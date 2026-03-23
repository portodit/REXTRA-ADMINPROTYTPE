import { db, personaPhaseMaster, personaMissionMaster, personaMissionFeatureMap, userPersonaProfile, userPersonaMissionProgress, userPersonaTransitionHistory } from "@workspace/db";

async function main() {
  console.log("🌱 Seeding persona data...\n");

  // --- Ambil fase yang sudah ada ---
  const phases = await db.select().from(personaPhaseMaster).orderBy(personaPhaseMaster.phaseOrder);
  if (phases.length === 0) {
    console.error("❌ Tidak ada fase. Jalankan seed awal terlebih dahulu.");
    process.exit(1);
  }
  const pathfinder = phases.find(p => p.code === "PATHFINDER")!;
  const builder = phases.find(p => p.code === "BUILDER")!;
  const achiever = phases.find(p => p.code === "ACHIEVER")!;
  console.log(`✅ Fase ditemukan: ${phases.map(p => p.name).join(", ")}`);

  // --- Hapus misi lama (cascade akan hapus progress & feature maps) ---
  await db.delete(userPersonaTransitionHistory);
  await db.delete(userPersonaMissionProgress);
  await db.delete(userPersonaProfile);
  await db.delete(personaMissionMaster);
  console.log("🗑️  Data lama dibersihkan");

  // --- Seed Misi ---
  const missions = await db.insert(personaMissionMaster).values([
    // Pathfinder missions
    {
      phaseId: pathfinder.id,
      missionCode: "PF-001",
      title: "Lengkapi Profil Dasar",
      description: "Isi nama lengkap, foto profil, dan informasi kontak.",
      sequenceNo: 1,
      defaultCategory: "REQUIRED",
      rewardPoint: 100,
      isBlocking: true,
      isAutoPass: false,
      status: "ACTIVE",
    },
    {
      phaseId: pathfinder.id,
      missionCode: "PF-002",
      title: "Ikuti Tes Profiling Karir",
      description: "Selesaikan tes kepribadian dan minat karir untuk menentukan persona kamu.",
      sequenceNo: 2,
      defaultCategory: "REQUIRED",
      rewardPoint: 200,
      isBlocking: true,
      isAutoPass: false,
      status: "ACTIVE",
    },
    {
      phaseId: pathfinder.id,
      missionCode: "PF-003",
      title: "Buat CV Pertama",
      description: "Gunakan template CV REXTRA untuk membuat CV profesional pertamamu.",
      sequenceNo: 3,
      defaultCategory: "REQUIRED",
      rewardPoint: 150,
      isBlocking: false,
      isAutoPass: false,
      status: "ACTIVE",
    },
    {
      phaseId: pathfinder.id,
      missionCode: "PF-004",
      title: "Jelajahi Lowongan Magang",
      description: "Temukan dan simpan minimal 3 lowongan magang yang sesuai minatmu.",
      sequenceNo: 4,
      defaultCategory: "RECOMMENDED",
      rewardPoint: 75,
      isBlocking: false,
      isAutoPass: false,
      status: "ACTIVE",
    },
    // Builder missions
    {
      phaseId: builder.id,
      missionCode: "BL-001",
      title: "Lamar 3 Lowongan",
      description: "Kirim lamaran ke minimal 3 perusahaan berbeda melalui platform REXTRA.",
      sequenceNo: 1,
      defaultCategory: "REQUIRED",
      rewardPoint: 250,
      isBlocking: true,
      isAutoPass: false,
      status: "ACTIVE",
    },
    {
      phaseId: builder.id,
      missionCode: "BL-002",
      title: "Ikuti Webinar Pengembangan Karir",
      description: "Hadiri minimal 1 webinar karir yang tersedia di platform.",
      sequenceNo: 2,
      defaultCategory: "REQUIRED",
      rewardPoint: 150,
      isBlocking: false,
      isAutoPass: false,
      status: "ACTIVE",
    },
    {
      phaseId: builder.id,
      missionCode: "BL-003",
      title: "Perbarui CV dengan Pengalaman Baru",
      description: "Update CV kamu dengan pengalaman atau keahlian terbaru.",
      sequenceNo: 3,
      defaultCategory: "REQUIRED",
      rewardPoint: 100,
      isBlocking: false,
      isAutoPass: true,
      autoPassRule: "CV updated after initial creation",
      status: "ACTIVE",
    },
    {
      phaseId: builder.id,
      missionCode: "BL-004",
      title: "Hubungkan Akun LinkedIn",
      description: "Sinkronkan profil LinkedIn untuk memperkuat networking profesional.",
      sequenceNo: 4,
      defaultCategory: "RECOMMENDED",
      rewardPoint: 100,
      isBlocking: false,
      isAutoPass: false,
      status: "ACTIVE",
    },
    // Achiever missions
    {
      phaseId: achiever.id,
      missionCode: "AC-001",
      title: "Dapatkan Penawaran Kerja",
      description: "Terima tawaran pekerjaan resmi dari perusahaan melalui REXTRA.",
      sequenceNo: 1,
      defaultCategory: "REQUIRED",
      rewardPoint: 500,
      isBlocking: true,
      isAutoPass: false,
      status: "ACTIVE",
    },
    {
      phaseId: achiever.id,
      missionCode: "AC-002",
      title: "Bagikan Kisah Suksesmu",
      description: "Tulis cerita perjalanan karirmu di komunitas REXTRA.",
      sequenceNo: 2,
      defaultCategory: "REQUIRED",
      rewardPoint: 200,
      isBlocking: false,
      isAutoPass: false,
      status: "ACTIVE",
    },
    {
      phaseId: achiever.id,
      missionCode: "AC-003",
      title: "Mentori 1 Pengguna Junior",
      description: "Bantu 1 pengguna Pathfinder yang membutuhkan bimbingan karir.",
      sequenceNo: 3,
      defaultCategory: "RECOMMENDED",
      rewardPoint: 300,
      isBlocking: false,
      isAutoPass: false,
      status: "ACTIVE",
    },
  ]).returning();
  console.log(`✅ ${missions.length} misi dibuat`);

  const pfm = (code: string) => missions.find(m => m.missionCode === code)!;

  // --- Feature Maps ---
  await db.insert(personaMissionFeatureMap).values([
    { missionId: pfm("PF-001").id, featureCode: "profile_edit", entitlementKey: "PROFILE_COMPLETE", accessLabel: "BEBAS", completionRule: "profile_completion >= 80", displayOrder: 1, isPrimary: true },
    { missionId: pfm("PF-002").id, featureCode: "career_test", entitlementKey: "CAREER_PROFILING", accessLabel: "BEBAS", completionRule: "test_submitted = true", displayOrder: 1, isPrimary: true },
    { missionId: pfm("PF-003").id, featureCode: "cv_builder", entitlementKey: "CV_BASIC", accessLabel: "BEBAS", completionRule: "cv_created = true", displayOrder: 1, isPrimary: true },
    { missionId: pfm("PF-004").id, featureCode: "job_search", entitlementKey: "JOB_EXPLORE", accessLabel: "BEBAS", completionRule: "jobs_saved >= 3", displayOrder: 1, isPrimary: false },
    { missionId: pfm("BL-001").id, featureCode: "job_apply", entitlementKey: "JOB_APPLY", accessLabel: "AKSES_TOKEN", completionRule: "applications_sent >= 3", displayOrder: 1, isPrimary: true },
    { missionId: pfm("BL-002").id, featureCode: "webinar", entitlementKey: "WEBINAR_ACCESS", accessLabel: "AKSES_TOKEN", completionRule: "webinars_attended >= 1", displayOrder: 1, isPrimary: true },
    { missionId: pfm("BL-003").id, featureCode: "cv_builder", entitlementKey: "CV_UPDATE", accessLabel: "BEBAS", completionRule: "cv_updated_after_profiling = true", displayOrder: 1, isPrimary: false },
    { missionId: pfm("BL-004").id, featureCode: "linkedin_connect", entitlementKey: "LINKEDIN_SYNC", accessLabel: "BEBAS", completionRule: "linkedin_connected = true", displayOrder: 1, isPrimary: false },
    { missionId: pfm("AC-001").id, featureCode: "offer_management", entitlementKey: "OFFER_RECEIVE", accessLabel: "AKSES_TERBATAS", completionRule: "offer_accepted = true", displayOrder: 1, isPrimary: true },
    { missionId: pfm("AC-002").id, featureCode: "community", entitlementKey: "STORY_SHARE", accessLabel: "BEBAS", completionRule: "story_published = true", displayOrder: 1, isPrimary: false },
    { missionId: pfm("AC-003").id, featureCode: "mentoring", entitlementKey: "MENTOR_ACCESS", accessLabel: "AKSES_TERBATAS", completionRule: "mentee_count >= 1", displayOrder: 1, isPrimary: false },
  ]);
  console.log("✅ Feature maps dibuat");

  // Helper: buat UUID deterministik-ish dari index
  const fakeUserId = (i: number) =>
    `00000000-0000-0000-0000-${String(i).padStart(12, "0")}`;

  const now = new Date();
  const daysAgo = (d: number) => new Date(now.getTime() - d * 86400000);

  // --- User Profiles ---
  // 12 users dengan variasi: Pathfinder (aktif/stagnant), Builder (aktif), Achiever (completed)
  const profilesData = [
    // Pathfinder aktif
    { userId: fakeUserId(1), initialPhaseId: pathfinder.id, currentPhaseId: pathfinder.id, journeyStatus: "ACTIVE" as const, profiledAt: daysAgo(30), name: "Budi Santoso" },
    { userId: fakeUserId(2), initialPhaseId: pathfinder.id, currentPhaseId: pathfinder.id, journeyStatus: "ACTIVE" as const, profiledAt: daysAgo(14), name: "Citra Dewi" },
    { userId: fakeUserId(3), initialPhaseId: pathfinder.id, currentPhaseId: pathfinder.id, journeyStatus: "ACTIVE" as const, profiledAt: daysAgo(7), name: "Dian Pratama" },
    // Pathfinder stagnant (>30 hari tanpa progress)
    { userId: fakeUserId(4), initialPhaseId: pathfinder.id, currentPhaseId: pathfinder.id, journeyStatus: "ACTIVE" as const, profiledAt: daysAgo(60), name: "Eko Saputra" },
    { userId: fakeUserId(5), initialPhaseId: pathfinder.id, currentPhaseId: pathfinder.id, journeyStatus: "ACTIVE" as const, profiledAt: daysAgo(45), name: "Fajar Nugroho" },
    // Builder aktif (dari Pathfinder)
    { userId: fakeUserId(6), initialPhaseId: pathfinder.id, currentPhaseId: builder.id, journeyStatus: "ACTIVE" as const, profiledAt: daysAgo(60), name: "Gita Rahayu" },
    { userId: fakeUserId(7), initialPhaseId: pathfinder.id, currentPhaseId: builder.id, journeyStatus: "ACTIVE" as const, profiledAt: daysAgo(45), name: "Hendra Wijaya" },
    { userId: fakeUserId(8), initialPhaseId: builder.id,    currentPhaseId: builder.id, journeyStatus: "ACTIVE" as const, profiledAt: daysAgo(25), name: "Indah Permata" },
    // Builder ke Achiever
    { userId: fakeUserId(9), initialPhaseId: pathfinder.id, currentPhaseId: achiever.id, journeyStatus: "ACTIVE" as const, profiledAt: daysAgo(90), name: "Joko Susilo" },
    { userId: fakeUserId(10), initialPhaseId: builder.id,   currentPhaseId: achiever.id, journeyStatus: "ACTIVE" as const, profiledAt: daysAgo(75), name: "Kartika Sari" },
    // Achiever completed
    { userId: fakeUserId(11), initialPhaseId: pathfinder.id, currentPhaseId: achiever.id, journeyStatus: "COMPLETED" as const, profiledAt: daysAgo(120), completedAt: daysAgo(5), name: "Lukman Hakim" },
    { userId: fakeUserId(12), initialPhaseId: pathfinder.id, currentPhaseId: achiever.id, journeyStatus: "COMPLETED" as const, profiledAt: daysAgo(100), completedAt: daysAgo(10), name: "Maya Anggraini" },
  ];

  const profiles = await db.insert(userPersonaProfile).values(
    profilesData.map(u => ({
      userId: u.userId,
      initialPhaseId: u.initialPhaseId,
      currentPhaseId: u.currentPhaseId,
      journeyStatus: u.journeyStatus,
      profiledAt: u.profiledAt,
      completedAt: u.completedAt ?? null,
      lastUpdatedAt: u.completedAt ?? u.profiledAt,
      profilingAnswers: { userName: u.name },
    }))
  ).returning();
  console.log(`✅ ${profiles.length} user profiles dibuat`);

  // Helper: ambil profile berdasarkan index (1-based)
  const prof = (i: number) => profiles[i - 1];

  // --- Mission Progress ---
  const progressValues: {
    userPersonaProfileId: string;
    missionId: string;
    effectiveCategory: "REQUIRED" | "RECOMMENDED";
    status: "NOT_STARTED" | "IN_PROGRESS" | "COMPLETED" | "AUTO_PASSED";
    isAutoPassed: boolean;
    completedAt: Date | null;
    rewardPointGranted: number;
  }[] = [];

  const addProgress = (
    profileId: string,
    missionCode: string,
    status: "NOT_STARTED" | "IN_PROGRESS" | "COMPLETED" | "AUTO_PASSED",
    category: "REQUIRED" | "RECOMMENDED" = "REQUIRED",
    completedAt?: Date,
  ) => {
    const m = pfm(missionCode);
    progressValues.push({
      userPersonaProfileId: profileId,
      missionId: m.id,
      effectiveCategory: category,
      status,
      isAutoPassed: status === "AUTO_PASSED",
      completedAt: completedAt ?? (status === "COMPLETED" || status === "AUTO_PASSED" ? daysAgo(Math.floor(Math.random() * 20 + 1)) : null),
      rewardPointGranted: (status === "COMPLETED" || status === "AUTO_PASSED") ? m.rewardPoint : 0,
    });
  };

  // User 1 - Pathfinder aktif, sudah 2 misi selesai
  addProgress(prof(1).id, "PF-001", "COMPLETED", "REQUIRED", daysAgo(25));
  addProgress(prof(1).id, "PF-002", "COMPLETED", "REQUIRED", daysAgo(20));
  addProgress(prof(1).id, "PF-003", "IN_PROGRESS");
  addProgress(prof(1).id, "PF-004", "NOT_STARTED", "RECOMMENDED");

  // User 2 - Pathfinder, baru mulai
  addProgress(prof(2).id, "PF-001", "COMPLETED", "REQUIRED", daysAgo(10));
  addProgress(prof(2).id, "PF-002", "IN_PROGRESS");
  addProgress(prof(2).id, "PF-003", "NOT_STARTED");

  // User 3 - Pathfinder baru
  addProgress(prof(3).id, "PF-001", "IN_PROGRESS");

  // User 4 - Stagnant, stuck di misi pertama lama
  addProgress(prof(4).id, "PF-001", "IN_PROGRESS");
  addProgress(prof(4).id, "PF-002", "NOT_STARTED");

  // User 5 - Stagnant, belum mulai sama sekali
  addProgress(prof(5).id, "PF-001", "NOT_STARTED");

  // User 6 - Builder aktif (sudah selesai semua Pathfinder)
  addProgress(prof(6).id, "PF-001", "COMPLETED", "REQUIRED", daysAgo(50));
  addProgress(prof(6).id, "PF-002", "COMPLETED", "REQUIRED", daysAgo(45));
  addProgress(prof(6).id, "PF-003", "COMPLETED", "REQUIRED", daysAgo(40));
  addProgress(prof(6).id, "PF-004", "COMPLETED", "RECOMMENDED", daysAgo(38));
  addProgress(prof(6).id, "BL-001", "COMPLETED", "REQUIRED", daysAgo(20));
  addProgress(prof(6).id, "BL-002", "IN_PROGRESS");
  addProgress(prof(6).id, "BL-003", "NOT_STARTED");

  // User 7 - Builder aktif
  addProgress(prof(7).id, "PF-001", "COMPLETED", "REQUIRED", daysAgo(40));
  addProgress(prof(7).id, "PF-002", "COMPLETED", "REQUIRED", daysAgo(35));
  addProgress(prof(7).id, "PF-003", "COMPLETED", "REQUIRED", daysAgo(30));
  addProgress(prof(7).id, "BL-001", "COMPLETED", "REQUIRED", daysAgo(15));
  addProgress(prof(7).id, "BL-002", "COMPLETED", "REQUIRED", daysAgo(10));
  addProgress(prof(7).id, "BL-003", "AUTO_PASSED", "REQUIRED", daysAgo(8));
  addProgress(prof(7).id, "BL-004", "IN_PROGRESS", "RECOMMENDED");

  // User 8 - Builder langsung (initial_phase=BUILDER)
  addProgress(prof(8).id, "BL-001", "COMPLETED", "REQUIRED", daysAgo(18));
  addProgress(prof(8).id, "BL-002", "IN_PROGRESS");
  addProgress(prof(8).id, "BL-003", "NOT_STARTED");

  // User 9 - Achiever aktif
  addProgress(prof(9).id, "PF-001", "COMPLETED", "REQUIRED", daysAgo(85));
  addProgress(prof(9).id, "PF-002", "COMPLETED", "REQUIRED", daysAgo(80));
  addProgress(prof(9).id, "PF-003", "COMPLETED", "REQUIRED", daysAgo(75));
  addProgress(prof(9).id, "BL-001", "COMPLETED", "REQUIRED", daysAgo(60));
  addProgress(prof(9).id, "BL-002", "COMPLETED", "REQUIRED", daysAgo(50));
  addProgress(prof(9).id, "BL-003", "COMPLETED", "REQUIRED", daysAgo(45));
  addProgress(prof(9).id, "AC-001", "COMPLETED", "REQUIRED", daysAgo(15));
  addProgress(prof(9).id, "AC-002", "IN_PROGRESS");
  addProgress(prof(9).id, "AC-003", "NOT_STARTED", "RECOMMENDED");

  // User 10 - Achiever aktif
  addProgress(prof(10).id, "BL-001", "COMPLETED", "REQUIRED", daysAgo(60));
  addProgress(prof(10).id, "BL-002", "COMPLETED", "REQUIRED", daysAgo(50));
  addProgress(prof(10).id, "BL-003", "AUTO_PASSED", "REQUIRED", daysAgo(45));
  addProgress(prof(10).id, "AC-001", "COMPLETED", "REQUIRED", daysAgo(20));
  addProgress(prof(10).id, "AC-002", "COMPLETED", "REQUIRED", daysAgo(12));
  addProgress(prof(10).id, "AC-003", "IN_PROGRESS", "RECOMMENDED");

  // User 11 - Completed Achiever
  addProgress(prof(11).id, "PF-001", "COMPLETED", "REQUIRED", daysAgo(115));
  addProgress(prof(11).id, "PF-002", "COMPLETED", "REQUIRED", daysAgo(110));
  addProgress(prof(11).id, "PF-003", "COMPLETED", "REQUIRED", daysAgo(105));
  addProgress(prof(11).id, "PF-004", "COMPLETED", "RECOMMENDED", daysAgo(100));
  addProgress(prof(11).id, "BL-001", "COMPLETED", "REQUIRED", daysAgo(80));
  addProgress(prof(11).id, "BL-002", "COMPLETED", "REQUIRED", daysAgo(70));
  addProgress(prof(11).id, "BL-003", "COMPLETED", "REQUIRED", daysAgo(65));
  addProgress(prof(11).id, "BL-004", "COMPLETED", "RECOMMENDED", daysAgo(60));
  addProgress(prof(11).id, "AC-001", "COMPLETED", "REQUIRED", daysAgo(20));
  addProgress(prof(11).id, "AC-002", "COMPLETED", "REQUIRED", daysAgo(12));
  addProgress(prof(11).id, "AC-003", "COMPLETED", "RECOMMENDED", daysAgo(6));

  // User 12 - Completed Achiever
  addProgress(prof(12).id, "PF-001", "COMPLETED", "REQUIRED", daysAgo(95));
  addProgress(prof(12).id, "PF-002", "COMPLETED", "REQUIRED", daysAgo(90));
  addProgress(prof(12).id, "PF-003", "COMPLETED", "REQUIRED", daysAgo(85));
  addProgress(prof(12).id, "BL-001", "COMPLETED", "REQUIRED", daysAgo(65));
  addProgress(prof(12).id, "BL-002", "COMPLETED", "REQUIRED", daysAgo(55));
  addProgress(prof(12).id, "BL-003", "AUTO_PASSED", "REQUIRED", daysAgo(50));
  addProgress(prof(12).id, "AC-001", "COMPLETED", "REQUIRED", daysAgo(25));
  addProgress(prof(12).id, "AC-002", "COMPLETED", "REQUIRED", daysAgo(15));
  addProgress(prof(12).id, "AC-003", "COMPLETED", "RECOMMENDED", daysAgo(11));

  await db.insert(userPersonaMissionProgress).values(progressValues as any);
  console.log(`✅ ${progressValues.length} mission progresses dibuat`);

  // --- Transition History ---
  const transitions = [];

  // User 6: PF -> BL
  transitions.push({ userPersonaProfileId: prof(6).id, fromPhaseId: pathfinder.id, toPhaseId: builder.id, transitionReason: "Semua misi wajib Pathfinder selesai", transitionedAt: daysAgo(35) });
  // User 7: PF -> BL
  transitions.push({ userPersonaProfileId: prof(7).id, fromPhaseId: pathfinder.id, toPhaseId: builder.id, transitionReason: "Semua misi wajib Pathfinder selesai", transitionedAt: daysAgo(28) });
  // User 9: PF -> BL -> AC
  transitions.push({ userPersonaProfileId: prof(9).id, fromPhaseId: pathfinder.id, toPhaseId: builder.id, transitionReason: "Semua misi wajib Pathfinder selesai", transitionedAt: daysAgo(70) });
  transitions.push({ userPersonaProfileId: prof(9).id, fromPhaseId: builder.id,    toPhaseId: achiever.id, transitionReason: "Semua misi wajib Builder selesai", transitionedAt: daysAgo(30) });
  // User 10: BL -> AC
  transitions.push({ userPersonaProfileId: prof(10).id, fromPhaseId: builder.id,   toPhaseId: achiever.id, transitionReason: "Semua misi wajib Builder selesai", transitionedAt: daysAgo(35) });
  // User 11: PF -> BL -> AC
  transitions.push({ userPersonaProfileId: prof(11).id, fromPhaseId: pathfinder.id, toPhaseId: builder.id,  transitionReason: "Semua misi wajib Pathfinder selesai", transitionedAt: daysAgo(95) });
  transitions.push({ userPersonaProfileId: prof(11).id, fromPhaseId: builder.id,    toPhaseId: achiever.id, transitionReason: "Semua misi wajib Builder selesai", transitionedAt: daysAgo(40) });
  // User 12: PF -> BL -> AC
  transitions.push({ userPersonaProfileId: prof(12).id, fromPhaseId: pathfinder.id, toPhaseId: builder.id,  transitionReason: "Semua misi wajib Pathfinder selesai", transitionedAt: daysAgo(78) });
  transitions.push({ userPersonaProfileId: prof(12).id, fromPhaseId: builder.id,    toPhaseId: achiever.id, transitionReason: "Semua misi wajib Builder selesai", transitionedAt: daysAgo(40) });

  await db.insert(userPersonaTransitionHistory).values(transitions);
  console.log(`✅ ${transitions.length} transition histories dibuat`);

  console.log("\n🎉 Seed selesai! Ringkasan:");
  console.log(`   - ${missions.length} misi (4 Pathfinder, 4 Builder, 3 Achiever)`);
  console.log(`   - 12 user profiles (5 Pathfinder, 3 Builder, 4 Achiever)`);
  console.log(`   - ${progressValues.length} mission progress records`);
  console.log(`   - ${transitions.length} transition history records`);

  process.exit(0);
}

main().catch((err) => {
  console.error("❌ Seed gagal:", err);
  process.exit(1);
});
