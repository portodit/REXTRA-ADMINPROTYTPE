import { Router } from "express";
import { db } from "@workspace/db";
import {
  personaPhaseMaster,
  personaMissionMaster,
  personaMissionFeatureMap,
  personaJourneySettings,
  userPersonaMissionProgress,
} from "@workspace/db/schema";
import { eq, sql, and, ilike, or, gte } from "drizzle-orm";

const router = Router();

router.get("/phases", async (_req, res) => {
  try {
    const phases = await db
      .select()
      .from(personaPhaseMaster)
      .orderBy(personaPhaseMaster.phaseOrder);
    res.json(phases);
  } catch {
    res.status(500).json({ error: "Gagal mengambil data fase" });
  }
});

router.get("/settings", async (_req, res) => {
  try {
    const rows = await db.select().from(personaJourneySettings).limit(1);
    res.json(rows[0] ?? {});
  } catch {
    res.status(500).json({ error: "Gagal mengambil settings" });
  }
});

router.put("/settings", async (req, res) => {
  try {
    const { auto_pass_enabled, sequential_transition, show_previous_missions_as_recommended } = req.body;
    const existing = await db.select().from(personaJourneySettings).limit(1);
    if (!existing.length) {
      const inserted = await db.insert(personaJourneySettings).values({
        autoPassEnabled: auto_pass_enabled ?? true,
        sequentialTransition: sequential_transition ?? true,
        showPreviousMissionsAsRecommended: show_previous_missions_as_recommended ?? true,
        updatedAt: new Date(),
      }).returning();
      return res.json(inserted[0]);
    }
    const updated = await db.update(personaJourneySettings)
      .set({
        ...(auto_pass_enabled !== undefined ? { autoPassEnabled: auto_pass_enabled } : {}),
        ...(sequential_transition !== undefined ? { sequentialTransition: sequential_transition } : {}),
        ...(show_previous_missions_as_recommended !== undefined ? { showPreviousMissionsAsRecommended: show_previous_missions_as_recommended } : {}),
        updatedAt: new Date(),
      })
      .returning();
    res.json(updated[0]);
  } catch {
    res.status(500).json({ error: "Gagal update settings" });
  }
});

router.get("/journey-preview", async (_req, res) => {
  try {
    const phases = await db.select().from(personaPhaseMaster).orderBy(personaPhaseMaster.phaseOrder);
    const missions = await db
      .select({
        id: personaMissionMaster.id,
        missionCode: personaMissionMaster.missionCode,
        title: personaMissionMaster.title,
        sequenceNo: personaMissionMaster.sequenceNo,
        defaultCategory: personaMissionMaster.defaultCategory,
        isBlocking: personaMissionMaster.isBlocking,
        phaseId: personaMissionMaster.phaseId,
        phaseCode: personaPhaseMaster.code,
        phaseOrder: personaPhaseMaster.phaseOrder,
      })
      .from(personaMissionMaster)
      .leftJoin(personaPhaseMaster, eq(personaMissionMaster.phaseId, personaPhaseMaster.id))
      .where(eq(personaMissionMaster.status, "ACTIVE"))
      .orderBy(personaPhaseMaster.phaseOrder, personaMissionMaster.sequenceNo);

    const scenarios = phases.map(phase => {
      const scenarioMissions = missions
        .filter(m => (m.phaseOrder ?? 99) <= phase.phaseOrder)
        .map(m => ({
          mission_code: m.missionCode,
          title: m.title,
          sequence_no: m.sequenceNo,
          effective_category: (m.phaseOrder ?? 99) < phase.phaseOrder ? "RECOMMENDED" : m.defaultCategory,
          phase_code: m.phaseCode ?? "",
          is_blocking: m.isBlocking,
        }));

      return {
        initial_persona_code: phase.code,
        initial_persona_name: phase.name,
        required_count: scenarioMissions.filter(m => m.effective_category === "REQUIRED").length,
        recommended_count: scenarioMissions.filter(m => m.effective_category === "RECOMMENDED").length,
        missions: scenarioMissions,
      };
    });

    res.json({ scenarios });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Gagal membuat preview journey" });
  }
});

router.get("/missions", async (req, res) => {
  try {
    const { phase_code, category, status, search, group_by } = req.query as Record<string, string>;

    const conditions: ReturnType<typeof eq>[] = [];
    if (status) conditions.push(eq(personaMissionMaster.status, status as "ACTIVE" | "INACTIVE"));

    const baseQuery = db
      .select({
        id: personaMissionMaster.id,
        phaseCode: personaPhaseMaster.code,
        phaseName: personaPhaseMaster.name,
        phaseOrder: personaPhaseMaster.phaseOrder,
        phaseId: personaPhaseMaster.id,
        missionCode: personaMissionMaster.missionCode,
        title: personaMissionMaster.title,
        description: personaMissionMaster.description,
        sequenceNo: personaMissionMaster.sequenceNo,
        defaultCategory: personaMissionMaster.defaultCategory,
        rewardPoint: personaMissionMaster.rewardPoint,
        isBlocking: personaMissionMaster.isBlocking,
        isAutoPass: personaMissionMaster.isAutoPass,
        autoPassRule: personaMissionMaster.autoPassRule,
        missionStatus: personaMissionMaster.status,
        createdAt: personaMissionMaster.createdAt,
        updatedAt: personaMissionMaster.updatedAt,
      })
      .from(personaMissionMaster)
      .leftJoin(personaPhaseMaster, eq(personaMissionMaster.phaseId, personaPhaseMaster.id))
      .where(
        and(
          phase_code ? sql`${personaPhaseMaster.code} = ${phase_code}` : undefined,
          category ? eq(personaMissionMaster.defaultCategory, category as "REQUIRED" | "RECOMMENDED") : undefined,
          status ? eq(personaMissionMaster.status, status as "ACTIVE" | "INACTIVE") : undefined,
          search ? or(
            ilike(personaMissionMaster.title, `%${search}%`),
            ilike(personaMissionMaster.missionCode, `%${search}%`),
          ) : undefined,
        )
      )
      .orderBy(personaPhaseMaster.phaseOrder, personaMissionMaster.sequenceNo);

    const rawMissions = await baseQuery;

    const missionIds = rawMissions.map(m => m.id);
    const featureMaps = missionIds.length
      ? await db.select().from(personaMissionFeatureMap)
          .where(sql`${personaMissionFeatureMap.missionId} IN (${sql.join(missionIds.map(id => sql`${id}`), sql`, `)})`)
          .orderBy(personaMissionFeatureMap.displayOrder)
      : [];

    const userCounts = missionIds.length
      ? await db.select({
          missionId: userPersonaMissionProgress.missionId,
          cnt: sql<number>`count(*)::int`,
        })
          .from(userPersonaMissionProgress)
          .where(sql`${userPersonaMissionProgress.missionId} IN (${sql.join(missionIds.map(id => sql`${id}`), sql`, `)})`)
          .groupBy(userPersonaMissionProgress.missionId)
      : [];

    const fmMap = new Map<string, typeof featureMaps>();
    for (const fm of featureMaps) {
      const arr = fmMap.get(fm.missionId) ?? [];
      arr.push(fm);
      fmMap.set(fm.missionId, arr);
    }
    const ucMap = new Map(userCounts.map(u => [u.missionId, u.cnt]));

    const missions = rawMissions.map(m => ({
      id: m.id,
      phase_code: m.phaseCode,
      phase_name: m.phaseName,
      mission_code: m.missionCode,
      title: m.title,
      description: m.description,
      sequence_no: m.sequenceNo,
      default_category: m.defaultCategory,
      reward_point: m.rewardPoint,
      is_blocking: m.isBlocking,
      is_auto_pass: m.isAutoPass,
      auto_pass_rule: m.autoPassRule,
      status: m.missionStatus,
      user_count: ucMap.get(m.id) ?? 0,
      feature_maps: (fmMap.get(m.id) ?? []).map(fm => ({
        id: fm.id,
        feature_code: fm.featureCode,
        entitlement_key: fm.entitlementKey,
        access_label: fm.accessLabel,
        is_primary: fm.isPrimary,
        display_order: fm.displayOrder,
        completion_rule: fm.completionRule,
      })),
      created_at: m.createdAt,
      updated_at: m.updatedAt,
    }));

    if (group_by === "phase") {
      const phases = await db.select().from(personaPhaseMaster).orderBy(personaPhaseMaster.phaseOrder);
      const phaseGroups = phases.map(phase => {
        const phaseMissions = missions.filter(m => m.phase_code === phase.code);
        return {
          phase_id: phase.id,
          phase_code: phase.code,
          phase_name: phase.name,
          phase_order: phase.phaseOrder,
          total_missions: phaseMissions.length,
          required_count: phaseMissions.filter(m => m.default_category === "REQUIRED").length,
          recommended_count: phaseMissions.filter(m => m.default_category === "RECOMMENDED").length,
          missions: phaseMissions,
        };
      });
      return res.json({ phases: phaseGroups, total: missions.length });
    }

    res.json({ missions, total: missions.length });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Gagal mengambil data misi" });
  }
});

router.post("/missions", async (req, res) => {
  try {
    const {
      phase_code, mission_code, title, description = "", sequence_no,
      default_category, reward_point = 0, is_blocking = false,
      is_auto_pass = false, auto_pass_rule = "", status = "ACTIVE",
    } = req.body;

    const phase = await db.select().from(personaPhaseMaster).where(eq(personaPhaseMaster.code, phase_code)).limit(1);
    if (!phase.length) return res.status(400).json({ error: "Phase tidak ditemukan" });

    const existing = await db.select().from(personaMissionMaster).where(eq(personaMissionMaster.missionCode, mission_code)).limit(1);
    if (existing.length) return res.status(409).json({ error: "Mission code sudah dipakai" });

    const conflict = await db.select().from(personaMissionMaster)
      .where(and(eq(personaMissionMaster.phaseId, phase[0]!.id), eq(personaMissionMaster.sequenceNo, sequence_no)))
      .orderBy(personaMissionMaster.sequenceNo);

    let shiftPreview: unknown[] = [];
    if (conflict.length) {
      const toShift = await db.select().from(personaMissionMaster)
        .where(and(eq(personaMissionMaster.phaseId, phase[0]!.id), gte(personaMissionMaster.sequenceNo, sequence_no)))
        .orderBy(sql`${personaMissionMaster.sequenceNo} DESC`);

      for (const m of toShift) {
        await db.update(personaMissionMaster)
          .set({ sequenceNo: m.sequenceNo + 1, updatedAt: new Date() })
          .where(eq(personaMissionMaster.id, m.id));
      }

      shiftPreview = toShift.map(m => ({
        mission_code: m.missionCode,
        title: m.title,
        old_sequence_no: m.sequenceNo,
        new_sequence_no: m.sequenceNo + 1,
      }));
    }

    const inserted = await db.insert(personaMissionMaster).values({
      phaseId: phase[0]!.id,
      missionCode: mission_code,
      title,
      description,
      sequenceNo: sequence_no,
      defaultCategory: default_category,
      rewardPoint: reward_point,
      isBlocking: is_blocking,
      isAutoPass: is_auto_pass,
      autoPassRule: auto_pass_rule,
      status,
    }).returning();

    const mission = inserted[0]!;
    res.status(201).json({
      mission: { ...mission, phase_code, phase_name: phase[0]!.name, feature_maps: [], user_count: 0 },
      shift_preview: shiftPreview,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Gagal membuat misi" });
  }
});

router.get("/missions/:id", async (req, res) => {
  try {
    const rows = await db
      .select({
        id: personaMissionMaster.id,
        phaseCode: personaPhaseMaster.code,
        phaseName: personaPhaseMaster.name,
        missionCode: personaMissionMaster.missionCode,
        title: personaMissionMaster.title,
        description: personaMissionMaster.description,
        sequenceNo: personaMissionMaster.sequenceNo,
        defaultCategory: personaMissionMaster.defaultCategory,
        rewardPoint: personaMissionMaster.rewardPoint,
        isBlocking: personaMissionMaster.isBlocking,
        isAutoPass: personaMissionMaster.isAutoPass,
        autoPassRule: personaMissionMaster.autoPassRule,
        missionStatus: personaMissionMaster.status,
        createdAt: personaMissionMaster.createdAt,
        updatedAt: personaMissionMaster.updatedAt,
      })
      .from(personaMissionMaster)
      .leftJoin(personaPhaseMaster, eq(personaMissionMaster.phaseId, personaPhaseMaster.id))
      .where(eq(personaMissionMaster.id, req.params.id!))
      .limit(1);

    if (!rows.length) return res.status(404).json({ error: "Misi tidak ditemukan" });

    const m = rows[0]!;
    const fms = await db.select().from(personaMissionFeatureMap)
      .where(eq(personaMissionFeatureMap.missionId, m.id))
      .orderBy(personaMissionFeatureMap.displayOrder);

    const uc = await db.select({ cnt: sql<number>`count(*)::int` })
      .from(userPersonaMissionProgress).where(eq(userPersonaMissionProgress.missionId, m.id));

    res.json({
      id: m.id,
      phase_code: m.phaseCode,
      phase_name: m.phaseName,
      mission_code: m.missionCode,
      title: m.title,
      description: m.description,
      sequence_no: m.sequenceNo,
      default_category: m.defaultCategory,
      reward_point: m.rewardPoint,
      is_blocking: m.isBlocking,
      is_auto_pass: m.isAutoPass,
      auto_pass_rule: m.autoPassRule,
      status: m.missionStatus,
      user_count: uc[0]?.cnt ?? 0,
      feature_maps: fms.map(fm => ({
        id: fm.id, feature_code: fm.featureCode, entitlement_key: fm.entitlementKey,
        access_label: fm.accessLabel, is_primary: fm.isPrimary,
        display_order: fm.displayOrder, completion_rule: fm.completionRule,
      })),
      created_at: m.createdAt,
      updated_at: m.updatedAt,
    });
  } catch {
    res.status(500).json({ error: "Gagal mengambil detail misi" });
  }
});

router.put("/missions/:id", async (req, res) => {
  try {
    const { title, description, sequence_no, default_category, reward_point, is_blocking, is_auto_pass, auto_pass_rule, status } = req.body;
    const existing = await db.select().from(personaMissionMaster).where(eq(personaMissionMaster.id, req.params.id!)).limit(1);
    if (!existing.length) return res.status(404).json({ error: "Misi tidak ditemukan" });

    const updated = await db.update(personaMissionMaster).set({
      ...(title !== undefined ? { title } : {}),
      ...(description !== undefined ? { description } : {}),
      ...(sequence_no !== undefined ? { sequenceNo: sequence_no } : {}),
      ...(default_category !== undefined ? { defaultCategory: default_category } : {}),
      ...(reward_point !== undefined ? { rewardPoint: reward_point } : {}),
      ...(is_blocking !== undefined ? { isBlocking: is_blocking } : {}),
      ...(is_auto_pass !== undefined ? { isAutoPass: is_auto_pass } : {}),
      ...(auto_pass_rule !== undefined ? { autoPassRule: auto_pass_rule } : {}),
      ...(status !== undefined ? { status } : {}),
      updatedAt: new Date(),
    }).where(eq(personaMissionMaster.id, req.params.id!)).returning();

    res.json({ mission: updated[0], shift_preview: [] });
  } catch {
    res.status(500).json({ error: "Gagal update misi" });
  }
});

router.put("/missions/:id/deactivate", async (req, res) => {
  try {
    const updated = await db.update(personaMissionMaster)
      .set({ status: "INACTIVE", updatedAt: new Date() })
      .where(eq(personaMissionMaster.id, req.params.id!))
      .returning();
    if (!updated.length) return res.status(404).json({ error: "Misi tidak ditemukan" });
    res.json({ success: true, mission: updated[0] });
  } catch {
    res.status(500).json({ error: "Gagal menonaktifkan misi" });
  }
});

router.delete("/missions/:id", async (req, res) => {
  try {
    const uc = await db.select({ cnt: sql<number>`count(*)::int` })
      .from(userPersonaMissionProgress).where(eq(userPersonaMissionProgress.missionId, req.params.id!));

    const count = uc[0]?.cnt ?? 0;
    if (count > 0) {
      return res.status(409).json({ error: `Misi sudah digunakan ${count} user. Gunakan Nonaktifkan.` });
    }

    await db.delete(personaMissionMaster).where(eq(personaMissionMaster.id, req.params.id!));
    res.json({ success: true });
  } catch {
    res.status(500).json({ error: "Gagal menghapus misi" });
  }
});

router.get("/missions/:id/users", async (req, res) => {
  try {
    const missionRow = await db.select().from(personaMissionMaster)
      .where(eq(personaMissionMaster.id, req.params.id!)).limit(1);
    if (!missionRow.length) return res.status(404).json({ error: "Misi tidak ditemukan" });

    const page = Math.max(1, parseInt(req.query.page as string || "1", 10));
    const limit = Math.min(50, parseInt(req.query.limit as string || "20", 10));
    const offset = (page - 1) * limit;

    const rows = await db
      .select({
        userId: userPersonaProfile.userId,
        profileId: userPersonaProfile.id,
        missionStatus: userPersonaMissionProgress.status,
        startedAt: userPersonaMissionProgress.createdAt,
        completedAt: userPersonaMissionProgress.completedAt,
        initialPhaseCode: sql<string>`ip.code`,
        currentPhaseCode: sql<string>`cp.code`,
      })
      .from(userPersonaMissionProgress)
      .leftJoin(userPersonaProfile, eq(userPersonaMissionProgress.userPersonaProfileId, userPersonaProfile.id))
      .leftJoin(sql`persona_phase_master ip`, sql`${userPersonaProfile.initialPhaseId} = ip.id`)
      .leftJoin(sql`persona_phase_master cp`, sql`${userPersonaProfile.currentPhaseId} = cp.id`)
      .where(eq(userPersonaMissionProgress.missionId, req.params.id!))
      .limit(limit).offset(offset);

    const totalResult = await db.select({ cnt: sql<number>`count(*)::int` })
      .from(userPersonaMissionProgress).where(eq(userPersonaMissionProgress.missionId, req.params.id!));

    res.json({
      mission_code: missionRow[0]!.missionCode,
      mission_title: missionRow[0]!.title,
      total: totalResult[0]?.cnt ?? 0,
      data: rows.map(r => ({
        user_id: r.userId,
        name: `User ${(r.userId ?? "").slice(0, 8)}`,
        email: `${(r.userId ?? "").slice(0, 8)}@example.com`,
        initial_persona: r.initialPhaseCode,
        active_persona: r.currentPhaseCode,
        mission_status: r.missionStatus,
        started_at: r.startedAt?.toISOString() ?? null,
        completed_at: r.completedAt?.toISOString() ?? null,
      })),
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Gagal mengambil daftar user misi" });
  }
});

router.post("/missions/:id/feature-maps", async (req, res) => {
  try {
    const { feature_code, entitlement_key, access_label, completion_rule = "", display_order = 1, is_primary = false } = req.body;

    if (is_primary) {
      await db.update(personaMissionFeatureMap)
        .set({ isPrimary: false, updatedAt: new Date() })
        .where(eq(personaMissionFeatureMap.missionId, req.params.id!));
    }

    const inserted = await db.insert(personaMissionFeatureMap).values({
      missionId: req.params.id!,
      featureCode: feature_code,
      entitlementKey: entitlement_key,
      accessLabel: access_label,
      completionRule: completion_rule,
      displayOrder: display_order,
      isPrimary: is_primary,
    }).returning();

    const fm = inserted[0]!;
    res.status(201).json({
      id: fm.id, feature_code: fm.featureCode, entitlement_key: fm.entitlementKey,
      access_label: fm.accessLabel, is_primary: fm.isPrimary,
      display_order: fm.displayOrder, completion_rule: fm.completionRule,
    });
  } catch {
    res.status(500).json({ error: "Gagal menambah feature map" });
  }
});

router.put("/missions/:id/feature-maps/:fmId", async (req, res) => {
  try {
    const { entitlement_key, access_label, completion_rule, display_order, is_primary } = req.body;

    if (is_primary) {
      await db.update(personaMissionFeatureMap)
        .set({ isPrimary: false, updatedAt: new Date() })
        .where(eq(personaMissionFeatureMap.missionId, req.params.id!));
    }

    const updated = await db.update(personaMissionFeatureMap).set({
      ...(entitlement_key !== undefined ? { entitlementKey: entitlement_key } : {}),
      ...(access_label !== undefined ? { accessLabel: access_label } : {}),
      ...(completion_rule !== undefined ? { completionRule: completion_rule } : {}),
      ...(display_order !== undefined ? { displayOrder: display_order } : {}),
      ...(is_primary !== undefined ? { isPrimary: is_primary } : {}),
      updatedAt: new Date(),
    }).where(eq(personaMissionFeatureMap.id, req.params.fmId!)).returning();

    if (!updated.length) return res.status(404).json({ error: "Feature map tidak ditemukan" });
    const fm = updated[0]!;
    res.json({
      id: fm.id, feature_code: fm.featureCode, entitlement_key: fm.entitlementKey,
      access_label: fm.accessLabel, is_primary: fm.isPrimary,
      display_order: fm.displayOrder, completion_rule: fm.completionRule,
    });
  } catch {
    res.status(500).json({ error: "Gagal update feature map" });
  }
});

router.delete("/missions/:id/feature-maps/:fmId", async (req, res) => {
  try {
    const fm = await db.select().from(personaMissionFeatureMap)
      .where(and(eq(personaMissionFeatureMap.id, req.params.fmId!), eq(personaMissionFeatureMap.missionId, req.params.id!)))
      .limit(1);

    if (!fm.length) return res.status(404).json({ error: "Feature map tidak ditemukan" });

    if (fm[0]!.isPrimary) {
      const others = await db.select({ cnt: sql<number>`count(*)::int` })
        .from(personaMissionFeatureMap)
        .where(and(eq(personaMissionFeatureMap.missionId, req.params.id!), sql`${personaMissionFeatureMap.id} != ${req.params.fmId}`));
      if ((others[0]?.cnt ?? 0) > 0) {
        return res.status(409).json({ error: "Tidak bisa hapus primary feature map. Assign primary ke yang lain dulu." });
      }
    }

    await db.delete(personaMissionFeatureMap).where(eq(personaMissionFeatureMap.id, req.params.fmId!));
    res.json({ success: true });
  } catch {
    res.status(500).json({ error: "Gagal menghapus feature map" });
  }
});

export default router;
