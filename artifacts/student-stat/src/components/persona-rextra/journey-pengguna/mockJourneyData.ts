export interface JourneyUser {
  id: string;
  name: string;
  email: string;
  nim?: string;
  personaAwal: "Pathfinder" | "Builder" | "Achiever";
  personaAktif: "Pathfinder" | "Builder" | "Achiever" | "Journey Selesai";
  statusJourney: "Belum Mulai" | "Sedang Berjalan" | "Persona Selesai" | "Journey Selesai";
  progressWajib: { done: number; total: number };
  totalMisiSelesai: number;
  tanggalProfiling: string;
  terakhirDiperbarui: string;
}

export interface JourneyTransition {
  persona: string;
  status: "Selesai" | "Aktif" | "Belum Dimulai";
  startDate: string;
  endDate?: string;
}

export interface UserMissionProgress {
  id: string;
  name: string;
  persona: string;
  kategori: "Wajib" | "Dianjurkan";
  statusMisi: "Belum Mulai" | "Sedang Berjalan" | "Selesai" | "Auto-pass";
  tanggalSelesai?: string;
  reward: string;
}

export const MOCK_JOURNEY_USERS: JourneyUser[] = [
  { id: "u1", name: "Budi Santoso", email: "budi@univ.ac.id", nim: "2024001", personaAwal: "Pathfinder", personaAktif: "Builder", statusJourney: "Sedang Berjalan", progressWajib: { done: 2, total: 3 }, totalMisiSelesai: 5, tanggalProfiling: "05 Jan 2026", terakhirDiperbarui: "20 Mar 2026" },
  { id: "u2", name: "Siti Rahayu", email: "siti@univ.ac.id", nim: "2024002", personaAwal: "Pathfinder", personaAktif: "Pathfinder", statusJourney: "Sedang Berjalan", progressWajib: { done: 3, total: 4 }, totalMisiSelesai: 4, tanggalProfiling: "08 Jan 2026", terakhirDiperbarui: "18 Mar 2026" },
  { id: "u3", name: "Dewi Kusuma", email: "dewi@univ.ac.id", nim: "2024003", personaAwal: "Builder", personaAktif: "Achiever", statusJourney: "Sedang Berjalan", progressWajib: { done: 1, total: 2 }, totalMisiSelesai: 8, tanggalProfiling: "10 Jan 2026", terakhirDiperbarui: "21 Mar 2026" },
  { id: "u4", name: "Ahmad Fauzan", email: "ahmad@univ.ac.id", nim: "2024004", personaAwal: "Achiever", personaAktif: "Journey Selesai", statusJourney: "Journey Selesai", progressWajib: { done: 2, total: 2 }, totalMisiSelesai: 9, tanggalProfiling: "03 Jan 2026", terakhirDiperbarui: "15 Mar 2026" },
  { id: "u5", name: "Rina Wulandari", email: "rina@univ.ac.id", personaAwal: "Pathfinder", personaAktif: "Pathfinder", statusJourney: "Belum Mulai", progressWajib: { done: 0, total: 4 }, totalMisiSelesai: 0, tanggalProfiling: "15 Mar 2026", terakhirDiperbarui: "15 Mar 2026" },
  { id: "u6", name: "Dian Permata", email: "dian@univ.ac.id", nim: "2024006", personaAwal: "Builder", personaAktif: "Builder", statusJourney: "Persona Selesai", progressWajib: { done: 3, total: 3 }, totalMisiSelesai: 4, tanggalProfiling: "12 Jan 2026", terakhirDiperbarui: "19 Mar 2026" },
  { id: "u7", name: "Eko Prasetyo", email: "eko@univ.ac.id", nim: "2024007", personaAwal: "Pathfinder", personaAktif: "Pathfinder", statusJourney: "Sedang Berjalan", progressWajib: { done: 1, total: 4 }, totalMisiSelesai: 1, tanggalProfiling: "20 Feb 2026", terakhirDiperbarui: "10 Mar 2026" },
  { id: "u8", name: "Fitri Handayani", email: "fitri@univ.ac.id", nim: "2024008", personaAwal: "Achiever", personaAktif: "Achiever", statusJourney: "Sedang Berjalan", progressWajib: { done: 1, total: 2 }, totalMisiSelesai: 7, tanggalProfiling: "06 Jan 2026", terakhirDiperbarui: "22 Mar 2026" },
];

export const MOCK_TRANSITIONS: JourneyTransition[] = [
  { persona: "Pathfinder", status: "Selesai", startDate: "05 Jan 2026", endDate: "12 Jan 2026" },
  { persona: "Builder", status: "Aktif", startDate: "12 Jan 2026" },
  { persona: "Achiever", status: "Belum Dimulai", startDate: "—" },
];

export const MOCK_USER_MISSIONS: UserMissionProgress[] = [
  { id: "um1", name: "Simpan data pendidikan — Jejak Studi", persona: "Pathfinder", kategori: "Wajib", statusMisi: "Auto-pass", tanggalSelesai: "05 Jan 2026", reward: "+100 poin • Sudah diberikan" },
  { id: "um2", name: "Tetapkan tujuan karier — Kenali Diri", persona: "Pathfinder", kategori: "Wajib", statusMisi: "Selesai", tanggalSelesai: "08 Jan 2026", reward: "+100 poin • Sudah diberikan" },
  { id: "um3", name: "Jelajahi profesi — Jelajah Profesi", persona: "Pathfinder", kategori: "Dianjurkan", statusMisi: "Selesai", tanggalSelesai: "10 Jan 2026", reward: "+100 poin • Sudah diberikan" },
  { id: "um4", name: "Susun rencana karier — Rencana Karier", persona: "Pathfinder", kategori: "Wajib", statusMisi: "Selesai", tanggalSelesai: "12 Jan 2026", reward: "+100 poin • Sudah diberikan" },
  { id: "um5", name: "Simpan data pendidikan — Jejak Studi", persona: "Builder", kategori: "Wajib", statusMisi: "Auto-pass", tanggalSelesai: "12 Jan 2026", reward: "+100 poin • Sudah diberikan" },
  { id: "um6", name: "Susun rencana karier lanjutan", persona: "Builder", kategori: "Wajib", statusMisi: "Sedang Berjalan", reward: "+100 poin • Belum diberikan" },
  { id: "um7", name: "Uji kecocokan profesi pilihan", persona: "Builder", kategori: "Dianjurkan", statusMisi: "Belum Mulai", reward: "+100 poin • Belum diberikan" },
];

export const SUMMARY_STATS = {
  totalAktif: 8,
  pathfinder: 4,
  builder: 2,
  achiever: 2,
  selesai: 1,
};
