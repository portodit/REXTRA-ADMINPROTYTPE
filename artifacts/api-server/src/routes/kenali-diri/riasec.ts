import { Router } from "express";
import { randomUUID } from "crypto";

const router = Router();

/* ── In-memory seed data ─────────────────────────────── */
type ProfileItem = { id: string; title: string; description: string };
type SectionKey = "kekuatanProfil" | "tantanganProfil" | "strategiPengembangan" | "gayaInteraksi" | "lingkunganKerjaIdeal";
type RiasecStore = Record<SectionKey, ProfileItem[]>;

const VALID_SECTIONS: SectionKey[] = [
  "kekuatanProfil", "tantanganProfil", "strategiPengembangan", "gayaInteraksi", "lingkunganKerjaIdeal",
];

function makeItems(titles: string[], desc: string): ProfileItem[] {
  return titles.map(title => ({ id: randomUUID(), title, description: desc }));
}

const store = new Map<string, RiasecStore>();

function seed(code: string, data: Partial<Record<SectionKey, { title: string; description: string }[]>>) {
  const entry: RiasecStore = {
    kekuatanProfil: [],
    tantanganProfil: [],
    strategiPengembangan: [],
    gayaInteraksi: [],
    lingkunganKerjaIdeal: [],
  };
  for (const key of VALID_SECTIONS) {
    entry[key] = (data[key] ?? []).map(i => ({ id: randomUUID(), ...i }));
  }
  store.set(code.toUpperCase(), entry);
}

// Seed Realistic (R)
seed("R", {
  kekuatanProfil: [
    { title: "Pemecah masalah yang praktis", description: 'Kamu cenderung berpikir dalam pola "apa yang bisa saya lakukan sekarang". Kemampuan ini sangat berharga dalam dunia kerja yang dinamis dan menuntut hasil nyata.' },
    { title: "Teliti dalam hal teknis", description: "Ketika menangani peralatan, sistem, atau proses teknis, kamu secara natural memperhatikan detail penting." },
    { title: "Pembelajaran mandiri", description: "Kamu tidak membutuhkan pengawasan terus-menerus. Berikan kamu alat yang tepat dan panduan dasar, kamu bisa mempelajari sisanya." },
    { title: "Dapat diandalkan dalam eksekusi", description: "Ketika kamu berkomitmen menyelesaikan sesuatu, orang lain bisa mengandalkanmu." },
  ],
  tantanganProfil: [
    { title: "Kurang sabar dengan diskusi abstrak", description: 'Pembahasan terlalu konseptual tanpa rencana aksi yang jelas bisa membuatmu frustrasi.' },
    { title: "Kesulitan menjelaskan kepada orang awam", description: "Menjelaskan hal teknis kepada orang yang tidak memiliki latar belakang sama adalah tantangan tersendiri." },
    { title: "Tidak nyaman dengan perubahan mendadak", description: "Kamu cenderung menyukai metode yang sudah terbukti berhasil. Perubahan tiba-tiba memerlukan waktu penyesuaian." },
    { title: "Pekerjaan administratif terasa membebani", description: "Tugas dokumentasi dan pelaporan mungkin terasa membosankan dibanding pekerjaan langsung." },
  ],
  strategiPengembangan: [
    { title: "Latih kemampuan menjelaskan", description: "Berlatihlah menjelaskan hal teknis menggunakan analogi atau contoh sehari-hari." },
    { title: "Bangun kebiasaan dokumentasi", description: "Biasakan mendokumentasikan proses kerjamu untuk referensi berharga di masa depan." },
    { title: "Cari kolaborasi lintas bidang", description: "Bekerjalah aktif dengan orang dari fungsi berbeda untuk membuka perspektif baru." },
    { title: "Tingkatkan toleransi ambiguitas", description: "Latih diri mengambil keputusan dengan informasi yang belum lengkap." },
  ],
  gayaInteraksi: [
    { title: "Komunikasi langsung dan faktual", description: "Kamu menghargai komunikasi efisien dan tidak bertele-tele." },
    { title: "Lebih suka mandiri tapi kolaboratif", description: "Kamu paling produktif saat bekerja mandiri dengan tujuan jelas, namun tetap terbuka berkolaborasi." },
    { title: "Nyaman dengan struktur yang jelas", description: "Kamu bekerja lebih baik ketika peran dan tanggung jawab terdefinisi dengan baik." },
    { title: "Penyelesaian konflik berbasis fakta", description: "Ketika menghadapi konflik, kamu mencari solusi berdasarkan data dan fakta." },
  ],
  lingkunganKerjaIdeal: [
    { title: "Spesifikasi yang jelas", description: "Kamu berkembang ketika diberikan tujuan spesifik dan terukur." },
    { title: "Akses ke alat yang layak", description: "Kamu menghargai akses ke tools dan teknologi yang mendukung pekerjaanmu." },
    { title: "Ruang untuk bereksperimen", description: "Lingkungan yang memberikan ruang untuk mencoba pendekatan baru sangat mendukung inovasimu." },
    { title: "Evaluasi berbasis kinerja", description: "Kamu menghargai sistem penilaian objektif berdasarkan hasil kerja nyata." },
  ],
});

// Seed remaining single-letter codes with placeholder items
for (const code of ["I", "A", "S", "E", "C"]) {
  const names: Record<string, string> = { I: "Investigative", A: "Artistic", S: "Social", E: "Enterprising", C: "Conventional" };
  const name = names[code]!;
  seed(code, {
    kekuatanProfil: makeItems([`Keunggulan utama ${name}`, "Kemampuan analitis tinggi", "Orientasi pada hasil", "Adaptabilitas tinggi"], `Karakteristik ${name} yang menonjol dalam dunia kerja modern.`),
    tantanganProfil: makeItems(["Area pengembangan komunikasi", "Fleksibilitas", "Manajemen waktu", "Kolaborasi lintas tim"], `Area yang perlu dikembangkan untuk tipe ${name}.`),
    strategiPengembangan: makeItems(["Tingkatkan keterampilan interpersonal", "Bangun jaringan profesional", "Perluas wawasan lintas bidang", "Kembangkan kepemimpinan"], `Strategi pengembangan untuk tipe ${name}.`),
    gayaInteraksi: makeItems(["Komunikasi terbuka dan jujur", "Preferensi tim yang solid", "Kolaborasi sinergis", "Resolusi konflik konstruktif"], `Gaya interaksi khas tipe ${name}.`),
    lingkunganKerjaIdeal: makeItems(["Budaya kerja yang supportif", "Struktur organisasi jelas", "Manajemen yang inspiratif", "Lingkungan kondusif"], `Kondisi ideal untuk tipe ${name}.`),
  });
}

/* ── Helper: get or create store entry ──────────────── */
function getEntry(code: string): RiasecStore {
  const upper = code.toUpperCase();
  if (!store.has(upper)) {
    seed(upper, {}); // empty placeholder for unknown codes
  }
  return store.get(upper)!;
}

/* ── Routes ──────────────────────────────────────────── */

// GET /api/v1/admin/kenali-diri/riasec/:code
router.get("/:code", (req, res) => {
  const entry = getEntry(req.params.code!);
  res.json(entry);
});

// GET /api/v1/admin/kenali-diri/riasec/:code/:section
router.get("/:code/:section", (req, res): void => {
  const section = req.params.section as SectionKey;
  if (!VALID_SECTIONS.includes(section)) {
    res.status(400).json({ error: "Section tidak valid" });
    return;
  }
  const entry = getEntry(req.params.code!);
  res.json({ items: entry[section] });
});

// POST /api/v1/admin/kenali-diri/riasec/:code/:section/items
router.post("/:code/:section/items", (req, res): void => {
  const section = req.params.section as SectionKey;
  if (!VALID_SECTIONS.includes(section)) {
    res.status(400).json({ error: "Section tidak valid" });
    return;
  }
  const { title, description } = req.body;
  if (!title || typeof title !== "string" || !title.trim()) {
    res.status(400).json({ error: "Judul item wajib diisi" });
    return;
  }
  const entry = getEntry(req.params.code!);
  const newItem: ProfileItem = {
    id: randomUUID(),
    title: title.trim(),
    description: (description ?? "").trim(),
  };
  entry[section].push(newItem);
  res.status(201).json(newItem);
});

// DELETE /api/v1/admin/kenali-diri/riasec/:code/:section/items/:id
router.delete("/:code/:section/items/:id", (req, res): void => {
  const section = req.params.section as SectionKey;
  if (!VALID_SECTIONS.includes(section)) {
    res.status(400).json({ error: "Section tidak valid" });
    return;
  }
  const entry = getEntry(req.params.code!);
  const before = entry[section].length;
  entry[section] = entry[section].filter(i => i.id !== req.params.id);
  if (entry[section].length === before) {
    res.status(404).json({ error: "Item tidak ditemukan" });
    return;
  }
  res.json({ success: true });
});

export default router;
