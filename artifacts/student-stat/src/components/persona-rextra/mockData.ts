export interface Mission {
  id: string;
  no: number;
  code: string;
  name: string;
  description: string;
  fitur: string;
  kategori: "Wajib" | "Dianjurkan";
  reward: number;
  autoPass: boolean;
  status: "Aktif" | "Nonaktif";
  usedByUsers: number;
  blocking: boolean;
  autoPassType: string;
  labelAkses: string;
}

export interface PersonaData {
  id: string;
  name: string;
  description: string;
  colorClass: string;
  missions: Mission[];
}

export const MOCK_PERSONAS: PersonaData[] = [
  {
    id: "pathfinder",
    name: "Pathfinder",
    description: "Fase eksplorasi awal dan pembangunan fondasi karier.",
    colorClass: "bg-violet-100 text-violet-800",
    missions: [
      { id: "m1", no: 1, code: "PF_JS", name: "Simpan data pendidikan — Jejak Studi", description: "Misi wajib untuk menyimpan data pendidikan.", fitur: "Jejak Studi", kategori: "Wajib", reward: 100, autoPass: true, status: "Aktif", usedByUsers: 324, blocking: true, autoPassType: "Data fitur tersedia", labelAkses: "-" },
      { id: "m2", no: 2, code: "PF_KD", name: "Tetapkan tujuan karier — Kenali Diri", description: "Misi wajib untuk tes profil karier.", fitur: "Kenali Diri", kategori: "Wajib", reward: 100, autoPass: false, status: "Aktif", usedByUsers: 298, blocking: true, autoPassType: "Manual", labelAkses: "-" },
      { id: "m3", no: 3, code: "PF_JP", name: "Jelajahi profesi — Jelajah Profesi", description: "Misi dianjurkan untuk menjelajahi profesi.", fitur: "Jelajah Profesi", kategori: "Dianjurkan", reward: 100, autoPass: false, status: "Aktif", usedByUsers: 201, blocking: false, autoPassType: "Manual", labelAkses: "-" },
      { id: "m4", no: 4, code: "PF_RK", name: "Susun rencana karier — Rencana Karier", description: "Misi wajib untuk menyusun rencana.", fitur: "Rencana Karier", kategori: "Wajib", reward: 100, autoPass: false, status: "Aktif", usedByUsers: 180, blocking: true, autoPassType: "Manual", labelAkses: "-" },
    ],
  },
  {
    id: "builder",
    name: "Builder",
    description: "Fase pengembangan portofolio dan personal branding.",
    colorClass: "bg-blue-100 text-blue-800",
    missions: [
      { id: "m5", no: 1, code: "BD_JS", name: "Simpan data pendidikan — Jejak Studi", description: "", fitur: "Jejak Studi", kategori: "Wajib", reward: 100, autoPass: true, status: "Aktif", usedByUsers: 180, blocking: true, autoPassType: "Data fitur tersedia", labelAkses: "-" },
      { id: "m6", no: 2, code: "BD_RK", name: "Susun rencana karier lanjutan", description: "", fitur: "Rencana Karier", kategori: "Wajib", reward: 100, autoPass: false, status: "Aktif", usedByUsers: 120, blocking: true, autoPassType: "Manual", labelAkses: "-" },
      { id: "m7", no: 3, code: "BD_UKP", name: "Uji kecocokan profesi pilihan", description: "", fitur: "Uji Kecocokan", kategori: "Dianjurkan", reward: 100, autoPass: false, status: "Aktif", usedByUsers: 98, blocking: false, autoPassType: "Manual", labelAkses: "-" },
    ],
  },
  {
    id: "achiever",
    name: "Achiever",
    description: "Fase persiapan seleksi rekrutmen dan transisi karier.",
    colorClass: "bg-emerald-100 text-emerald-800",
    missions: [
      { id: "m8", no: 1, code: "AC_CV", name: "Buat CV terpersonalisasi", description: "", fitur: "CV Generator", kategori: "Wajib", reward: 150, autoPass: false, status: "Aktif", usedByUsers: 45, blocking: true, autoPassType: "Manual", labelAkses: "-" },
      { id: "m9", no: 2, code: "AC_INT", name: "Simulasi wawancara — AI Interviewer", description: "", fitur: "AI Interviewer", kategori: "Wajib", reward: 150, autoPass: false, status: "Aktif", usedByUsers: 30, blocking: true, autoPassType: "Manual", labelAkses: "-" },
    ],
  },
];

export const FITUR_OPTIONS = [
  "Kenali Diri", "Jejak Studi", "Jelajah Profesi", "Rencana Karier",
  "CV Generator", "AI Interviewer", "Uji Kecocokan",
];

export const MOCK_USERS_ON_MISSION = [
  { name: "Budi Santoso", email: "budi@univ.ac.id", personaAwal: "Pathfinder", personaAktif: "Builder", statusMisi: "Selesai", tanggalSelesai: "12 Jan 2026" },
  { name: "Siti Rahayu", email: "siti@univ.ac.id", personaAwal: "Builder", personaAktif: "Builder", statusMisi: "Berjalan", tanggalSelesai: "—" },
  { name: "Dewi Kusuma", email: "dewi@univ.ac.id", personaAwal: "Pathfinder", personaAktif: "Pathfinder", statusMisi: "Belum Mulai", tanggalSelesai: "—" },
];
