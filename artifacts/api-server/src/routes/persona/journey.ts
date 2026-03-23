import { Router } from "express";
import { db } from "@workspace/db";
import {
  userPersonaProfile,
  userPersonaMissionProgress,
  userPersonaTransitionHistory,
  personaPhaseMaster,
  personaMissionMaster,
} from "@workspace/db/schema";
import { eq, sql, and, ilike, or, gte, lte } from "drizzle-orm";

const router = Router();

router.get("/users/stats", async (_req, res) => {
  try {
    const profiles = await db
      .select({
        journeyStatus: userPersonaProfile.journeyStatus,
        initialPhaseCode: personaPhaseMaster.code,
      })
      .from(userPersonaProfile)
      .leftJoin(personaPhaseMaster, eq(userPersonaProfile.initialPhaseId, personaPhaseMaster.id));

    const total = profiles.length;
    const pathfinder = profiles.filter(p => p.initialPhaseCode === "PATHFINDER").length;
    const builder = profiles.filter(p => p.initialPhaseCode === "BUILDER").length;
    const achiever = profiles.filter(p => p.initialPhaseCode === "ACHIEVER").length;
    const completed = profiles.filter(p => p.journeyStatus === "COMPLETED").length;

    res.json({
      total_users_with_journey: total,
      pathfinder_count: pathfinder,
      builder_count: builder,
      achiever_count: achiever,
      completed_count: completed,
      stagnant_count: 0,
    });
  } catch (err) {
    res.status(500).json({ error: "Gagal mengambil statistik" });
  }
});

router.get("/users", async (req, res) => {
  try {
    const {
      persona_initial,
      persona_active,
      status,
      search,
      date_from,
      date_to,
      page = "1",
      limit = "20",
      sort_by,
    } = req.query as Record<string, string>;

    const pageNum = Math.max(1, parseInt(page, 10));
    const limitNum = Math.min(100, Math.max(1, parseInt(limit, 10)));
    const offset = (pageNum - 1) * limitNum;

    const initialPhaseAlias = db
      .$with("initial_phase")
      .as(db.select().from(personaPhaseMaster));

    const rows = await db
      .select({
        userId: userPersonaProfile.userId,
        profileId: userPersonaProfile.id,
        journeyStatus: userPersonaProfile.journeyStatus,
        profiledAt: userPersonaProfile.profiledAt,
        lastUpdatedAt: userPersonaProfile.lastUpdatedAt,
        initialPhaseCode: sql<string>`ip.code`.as("initial_phase_code"),
        initialPhaseName: sql<string>`ip.name`.as("initial_phase_name"),
        currentPhaseCode: sql<string>`cp.code`.as("current_phase_code"),
        currentPhaseName: sql<string>`cp.name`.as("current_phase_name"),
      })
      .from(userPersonaProfile)
      .leftJoin(
        sql`persona_phase_master ip`,
        sql`${userPersonaProfile.initialPhaseId} = ip.id`
      )
      .leftJoin(
        sql`persona_phase_master cp`,
        sql`${userPersonaProfile.currentPhaseId} = cp.id`
      )
      .where(
        and(
          persona_initial ? sql`ip.code = ${persona_initial}` : undefined,
          persona_active ? sql`cp.code = ${persona_active}` : undefined,
          status ? eq(userPersonaProfile.journeyStatus, status as "ACTIVE" | "COMPLETED") : undefined,
          date_from ? gte(userPersonaProfile.profiledAt, new Date(date_from)) : undefined,
          date_to ? lte(userPersonaProfile.profiledAt, new Date(date_to)) : undefined,
        )
      )
      .limit(limitNum)
      .offset(offset);

    const progressRows = rows.length > 0
      ? await db
          .select({
            userPersonaProfileId: userPersonaMissionProgress.userPersonaProfileId,
            effectiveCategory: userPersonaMissionProgress.effectiveCategory,
            status: userPersonaMissionProgress.status,
          })
          .from(userPersonaMissionProgress)
          .where(sql`${userPersonaMissionProgress.userPersonaProfileId} IN (${sql.join(rows.map(r => sql`${r.profileId}`), sql`, `)})`)
      : [];

    const progressMap = new Map<string, { done: number; total: number }>();
    for (const p of progressRows) {
      if (p.effectiveCategory === "REQUIRED") {
        const current = progressMap.get(p.userPersonaProfileId) ?? { done: 0, total: 0 };
        current.total++;
        if (p.status === "COMPLETED" || p.status === "AUTO_PASSED") current.done++;
        progressMap.set(p.userPersonaProfileId, current);
      }
    }

    const countResult = await db
      .select({ count: sql<number>`count(*)::int` })
      .from(userPersonaProfile);

    const total = countResult[0]?.count ?? 0;

    const data = rows.map(r => {
      const progress = progressMap.get(r.profileId) ?? { done: 0, total: 0 };
      const pct = progress.total > 0 ? (progress.done / progress.total) * 100 : 0;
      return {
        user_id: r.userId,
        name: `User ${r.userId.slice(0, 8)}`,
        email: `${r.userId.slice(0, 8)}@example.com`,
        initial_persona: r.initialPhaseCode ?? "",
        active_persona: r.currentPhaseCode ?? "",
        journey_status: r.journeyStatus,
        required_completed: progress.done,
        required_total: progress.total,
        percentage: Math.round(pct * 10) / 10,
        profiled_at: r.profiledAt?.toISOString() ?? "",
        last_updated_at: r.lastUpdatedAt?.toISOString() ?? "",
      };
    });

    res.json({
      data,
      total,
      page: pageNum,
      total_pages: Math.ceil(total / limitNum),
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Gagal mengambil data pengguna" });
  }
});

router.get("/users/:userId/journey", async (req, res) => {
  try {
    const { userId } = req.params;

    const profileRows = await db
      .select({
        id: userPersonaProfile.id,
        userId: userPersonaProfile.userId,
        journeyStatus: userPersonaProfile.journeyStatus,
        profiledAt: userPersonaProfile.profiledAt,
        completedAt: userPersonaProfile.completedAt,
        lastUpdatedAt: userPersonaProfile.lastUpdatedAt,
        profilingAnswers: userPersonaProfile.profilingAnswers,
        initialPhaseCode: sql<string>`ip.code`,
        initialPhaseName: sql<string>`ip.name`,
        currentPhaseCode: sql<string>`cp.code`,
        currentPhaseName: sql<string>`cp.name`,
      })
      .from(userPersonaProfile)
      .leftJoin(sql`persona_phase_master ip`, sql`${userPersonaProfile.initialPhaseId} = ip.id`)
      .leftJoin(sql`persona_phase_master cp`, sql`${userPersonaProfile.currentPhaseId} = cp.id`)
      .where(eq(userPersonaProfile.userId, userId))
      .limit(1);

    if (!profileRows.length) {
      return res.status(404).json({ error: "User tidak memiliki journey" });
    }

    const profile = profileRows[0]!;

    const missionRows = await db
      .select({
        id: userPersonaMissionProgress.id,
        effectiveCategory: userPersonaMissionProgress.effectiveCategory,
        status: userPersonaMissionProgress.status,
        isAutoPassed: userPersonaMissionProgress.isAutoPassed,
        completedAt: userPersonaMissionProgress.completedAt,
        rewardPointGranted: userPersonaMissionProgress.rewardPointGranted,
        rewardGrantedAt: userPersonaMissionProgress.rewardGrantedAt,
        sourceFeatureCode: userPersonaMissionProgress.sourceFeatureCode,
        missionCode: personaMissionMaster.missionCode,
        missionTitle: personaMissionMaster.title,
        rewardPoint: personaMissionMaster.rewardPoint,
        phaseCode: sql<string>`pm.code`,
        phaseName: sql<string>`pm.name`,
      })
      .from(userPersonaMissionProgress)
      .leftJoin(personaMissionMaster, eq(userPersonaMissionProgress.missionId, personaMissionMaster.id))
      .leftJoin(sql`persona_phase_master pm`, sql`${personaMissionMaster.phaseId} = pm.id`)
      .where(eq(userPersonaMissionProgress.userPersonaProfileId, profile.id));

    const transitionRows = await db
      .select({
        transitionReason: userPersonaTransitionHistory.transitionReason,
        transitionedAt: userPersonaTransitionHistory.transitionedAt,
        fromPhaseName: sql<string | null>`fp.name`,
        toPhaseName: sql<string>`tp.name`,
      })
      .from(userPersonaTransitionHistory)
      .leftJoin(sql`persona_phase_master fp`, sql`${userPersonaTransitionHistory.fromPhaseId} = fp.id`)
      .leftJoin(sql`persona_phase_master tp`, sql`${userPersonaTransitionHistory.toPhaseId} = tp.id`)
      .where(eq(userPersonaTransitionHistory.userPersonaProfileId, profile.id))
      .orderBy(userPersonaTransitionHistory.transitionedAt);

    const requiredMissions = missionRows.filter(m => m.effectiveCategory === "REQUIRED");
    const recommendedMissions = missionRows.filter(m => m.effectiveCategory === "RECOMMENDED");
    const doneStatuses = ["COMPLETED", "AUTO_PASSED"];

    const requiredCompleted = requiredMissions.filter(m => doneStatuses.includes(m.status)).length;
    const requiredTotal = requiredMissions.length;
    const recommendedCompleted = recommendedMissions.filter(m => doneStatuses.includes(m.status)).length;
    const recommendedTotal = recommendedMissions.length;
    const pct = requiredTotal > 0 ? (requiredCompleted / requiredTotal) * 100 : 0;

    const profilingAnswers = profile.profilingAnswers as Record<string, unknown> | null;

    res.json({
      user_id: profile.userId,
      name: `User ${profile.userId.slice(0, 8)}`,
      email: `${profile.userId.slice(0, 8)}@example.com`,
      initial_persona: profile.initialPhaseCode,
      active_persona: profile.currentPhaseCode,
      journey_status: profile.journeyStatus,
      profiled_at: profile.profiledAt?.toISOString() ?? "",
      completed_at: profile.completedAt?.toISOString() ?? null,
      last_updated_at: profile.lastUpdatedAt?.toISOString() ?? "",
      required_completed: requiredCompleted,
      required_total: requiredTotal,
      percentage: Math.round(pct * 10) / 10,
      recommended_completed: recommendedCompleted,
      recommended_total: recommendedTotal,
      transitions: transitionRows.map(t => ({
        from_phase_name: t.fromPhaseName ?? null,
        to_phase_name: t.toPhaseName,
        transition_reason: t.transitionReason,
        transitioned_at: t.transitionedAt?.toISOString() ?? "",
      })),
      missions: missionRows.map(m => ({
        mission_code: m.missionCode,
        title: m.missionTitle,
        phase_code: m.phaseCode,
        phase_name: m.phaseName,
        effective_category: m.effectiveCategory,
        status: m.status,
        is_auto_passed: m.isAutoPassed,
        completed_at: m.completedAt?.toISOString() ?? null,
        reward_expected: m.rewardPoint ?? 0,
        reward_granted: m.rewardPointGranted,
        reward_granted_at: m.rewardGrantedAt?.toISOString() ?? null,
        source_feature_code: m.sourceFeatureCode ?? null,
      })),
      profiling_answers: {
        has_career_goal: profilingAnswers?.has_career_goal ?? false,
        building_portfolio: profilingAnswers?.building_portfolio ?? null,
        in_recruitment_process: profilingAnswers?.in_recruitment_process ?? null,
        result_persona_code: profile.initialPhaseCode ?? "",
        profiled_at: profile.profiledAt?.toISOString() ?? "",
      },
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Gagal mengambil detail journey" });
  }
});

export default router;
