export const LETTERS = ['R', 'I', 'A', 'S', 'E', 'C'] as const
export type RiasecLetter = typeof LETTERS[number]

export const LETTER_NAMES: Record<RiasecLetter, string> = {
  R: 'Realistic',
  I: 'Investigative',
  A: 'Artistic',
  S: 'Social',
  E: 'Enterprising',
  C: 'Conventional',
}

export type ProfileItem = { title: string; description: string }

export type RiasecProfile = {
  code: string
  letters: RiasecLetter[]
  name: string
  id: string
  description: string
  kekuatanProfil: ProfileItem[]
  tantanganProfil: ProfileItem[]
  strategiPengembangan: ProfileItem[]
  gayaInteraksi: ProfileItem[]
  lingkunganKerjaIdeal: ProfileItem[]
}

const REALISTIC_PROFILE: RiasecProfile = {
  code: 'R',
  letters: ['R'],
  name: 'Realistic',
  id: '#001',
  description:
    'Profil Realistic menunjukkan bahwa kamu adalah tipe yang lebih nyaman dengan pekerjaan praktis dan konkret dibandingkan hal yang abstrak. Berdasarkan pengalaman saya sebagai praktisi psikologi industri dan organisasi, individu dengan profil ini biasanya sangat baik dalam pelaksanaan teknis dan implementasi. Kamu cenderung lebih menyukai pendekatan "langsung mengerjakan" daripada menghabiskan waktu berjam-jam dalam rapat perencanaan. Di kampus, kamu mungkin lebih menikmati praktikum atau kerja laboratorium dibanding kuliah teori murni. Kekuatan khas dari tipe Realistic adalah kemampuanmu dalam memecahkan masalah teknis secara sistematis.',
  kekuatanProfil: [
    {
      title: 'Pemecah masalah yang praktis',
      description:
        'Kamu cenderung berpikir dalam pola "apa yang bisa saya lakukan sekarang" daripada hanya berteori tanpa tindakan. Kemampuan ini sangat berharga dalam dunia kerja yang dinamis dan menuntut hasil nyata.',
    },
    {
      title: 'Teliti dalam hal teknis',
      description:
        'Ketika menangani peralatan, sistem, atau proses teknis, kamu secara natural memperhatikan detail penting. Kamu menyadari inkonsistensi kecil yang mungkin terlewat oleh orang lain.',
    },
    {
      title: 'Pembelajaran mandiri',
      description:
        'Kamu tidak membutuhkan pengawasan atau bimbingan terus-menerus. Berikan kamu alat yang tepat dan panduan dasar, kamu bisa mempelajari sisanya melalui praktik langsung.',
    },
    {
      title: 'Dapat diandalkan dalam eksekusi',
      description:
        'Ketika kamu berkomitmen untuk menyelesaikan sesuatu, orang lain bisa mengandalkanmu. Kamu memahami pentingnya menuntaskan apa yang sudah dimulai.',
    },
  ],
  tantanganProfil: [
    {
      title: 'Kurang sabar dengan diskusi abstrak',
      description:
        'Pembahasan yang terlalu konseptual tanpa rencana aksi yang jelas bisa membuatmu frustrasi. Kamu mungkin sering bertanya dalam hati, "Jadi kita mau mengerjakan apa sebenarnya?"',
    },
    {
      title: 'Kesulitan menjelaskan kepada orang awam',
      description:
        'Menjelaskan hal teknis kepada orang yang tidak memiliki latar belakang sama adalah tantangan tersendiri. Kamu memahami prosesnya dengan sangat baik, tetapi menerjemahkannya ke bahasa sederhana membutuhkan keterampilan khusus.',
    },
    {
      title: 'Tidak nyaman dengan perubahan mendadak',
      description:
        'Kamu cenderung lebih menyukai metode yang sudah terbukti berhasil. Kalau tiba-tiba ada perubahan arah tanpa penjelasan yang masuk akal, kamu memerlukan waktu untuk menyesuaikan diri.',
    },
    {
      title: 'Pekerjaan administratif terasa membebani',
      description:
        'Tugas-tugas seperti dokumentasi dan pelaporan mungkin terasa membosankan. Kamu lebih senang langsung mengerjakan daripada menuliskan apa yang sudah dikerjakan.',
    },
  ],
  strategiPengembangan: [
    {
      title: 'Latih kemampuan menjelaskan',
      description:
        'Berlatihlah menjelaskan hal teknis menggunakan analogi atau contoh sehari-hari. Coba rekam diri kamu menjelaskan sesuatu, lalu tinjau kembali apakah penjelasanmu bisa dipahami orang di luar bidangmu.',
    },
    {
      title: 'Bangun kebiasaan dokumentasi',
      description:
        'Biasakan untuk mendokumentasikan proses kerjamu. Ini tidak hanya membantu orang lain memahami pekerjaanmu, tetapi juga menciptakan referensi berharga untuk dirimu sendiri di masa depan.',
    },
    {
      title: 'Cari kolaborasi lintas bidang',
      description:
        'Bekerjalah secara aktif dengan orang dari fungsi atau latar belakang berbeda. Hal ini akan membuka perspektif baru dan meningkatkan kemampuan adaptasimu.',
    },
    {
      title: 'Tingkatkan toleransi ambiguitas',
      description:
        'Latih diri mengambil keputusan dengan informasi yang belum lengkap. Mulai dari proyek kecil yang membutuhkan fleksibilitas, hingga kamu terbiasa dengan ketidakpastian.',
    },
  ],
  gayaInteraksi: [
    {
      title: 'Komunikasi langsung dan faktual',
      description:
        'Kamu menghargai komunikasi yang efisien dan tidak bertele-tele. Kamu menyampaikan informasi secara langsung dan mengharapkan hal yang sama dari orang lain.',
    },
    {
      title: 'Lebih suka mandiri tapi kolaboratif',
      description:
        'Kamu paling produktif saat bekerja mandiri dengan tujuan yang jelas, namun tetap terbuka untuk berkolaborasi ketika dibutuhkan dalam tim kecil yang fungsional.',
    },
    {
      title: 'Nyaman dengan struktur yang jelas',
      description:
        'Kamu bekerja lebih baik ketika peran dan tanggung jawab terdefinisi dengan baik. Kejelasan alur kerja membuat kamu lebih fokus dan produktif dalam mencapai target.',
    },
    {
      title: 'Penyelesaian konflik berbasis fakta',
      description:
        'Ketika menghadapi konflik, kamu cenderung mencari solusi berdasarkan data dan fakta yang ada, bukan pertimbangan emosional semata.',
    },
  ],
  lingkunganKerjaIdeal: [
    {
      title: 'Spesifikasi yang jelas',
      description:
        'Kamu berkembang ketika diberikan tujuan yang spesifik dan terukur. Lingkungan kerja yang menetapkan ekspektasi dengan jelas membuat performamu optimal.',
    },
    {
      title: 'Akses ke alat yang layak',
      description:
        'Bukan pemimpin yang harus punya segalanya, melainkan setidaknya punya alat kerja yang memadai. Kamu menghargai akses ke tools dan teknologi yang mendukung pekerjaanmu.',
    },
    {
      title: 'Ruang untuk bereksperimen',
      description:
        'Lingkungan yang memberikan ruang untuk mencoba pendekatan baru tanpa takut gagal sangat mendukung kreativitas dan inovasimu dalam memecahkan masalah.',
    },
    {
      title: 'Evaluasi berbasis kinerja',
      description:
        'Kamu menghargai sistem penilaian yang objektif berdasarkan hasil kerja nyata, bukan sekadar kesan atau hubungan interpersonal semata.',
    },
  ],
}

function makeSimpleProfile(
  code: string,
  letters: RiasecLetter[],
  name: string,
  id: string,
  description: string,
): RiasecProfile {
  const make = (titles: string[]): ProfileItem[] =>
    titles.map(title => ({
      title,
      description: `Karakteristik ${name} dalam aspek ini menunjukkan keunggulan yang khas dan relevan dalam konteks dunia kerja modern yang terus berkembang.`,
    }))

  return {
    code,
    letters,
    name,
    id,
    description,
    kekuatanProfil: make([`Keunggulan utama ${name}`, 'Kemampuan analitis tinggi', 'Orientasi pada hasil', 'Adaptabilitas tinggi']),
    tantanganProfil: make(['Perlu mengembangkan komunikasi', 'Manajemen waktu', 'Fleksibilitas', 'Kolaborasi lintas tim']),
    strategiPengembangan: make(['Tingkatkan keterampilan interpersonal', 'Bangun jaringan profesional', 'Perluas wawasan lintas bidang', 'Kembangkan kepemimpinan']),
    gayaInteraksi: make(['Komunikasi terbuka dan jujur', 'Preferensi tim yang solid', 'Kolaborasi sinergis', 'Resolusi konflik konstruktif']),
    lingkunganKerjaIdeal: make(['Budaya kerja yang supportif', 'Struktur organisasi yang jelas', 'Manajemen yang inspiratif', 'Lingkungan yang kondusif']),
  }
}

const PROFILES_MAP: Record<string, RiasecProfile> = {
  R: REALISTIC_PROFILE,
  I: makeSimpleProfile('I', ['I'], 'Investigative', '#002',
    'Profil Investigative menunjukkan individu yang analitis, intelektual, dan berorientasi pada pemecahan masalah kompleks. Kamu senang mengeksplorasi ide-ide abstrak dan mencari pemahaman mendalam tentang fenomena di sekitarmu. Kamu unggul dalam penelitian, analisis data, dan pekerjaan yang membutuhkan pemikiran kritis tinggi.'),
  A: makeSimpleProfile('A', ['A'], 'Artistic', '#003',
    'Profil Artistic mencerminkan individu yang kreatif, imajinatif, dan ekspresif. Kamu cenderung berpikir di luar kebiasaan dan menemukan cara-cara inovatif untuk mengekspresikan ide. Kamu menghargai kebebasan berekspresi dan menghindari pekerjaan yang terlalu terstruktur atau repetitif.'),
  S: makeSimpleProfile('S', ['S'], 'Social', '#004',
    'Profil Social menggambarkan individu yang hangat, empatik, dan berorientasi pada membantu orang lain. Kamu menemukan kepuasan dalam berinteraksi, mendidik, dan mendukung pertumbuhan orang lain. Kamu unggul dalam pekerjaan yang melibatkan pelayanan, pengajaran, atau konseling.'),
  E: makeSimpleProfile('E', ['E'], 'Enterprising', '#005',
    'Profil Enterprising menunjukkan individu yang ambisius, persuasif, dan berorientasi pada kepemimpinan. Kamu menikmati memimpin tim, mengambil keputusan strategis, dan mencapai tujuan bisnis. Kamu memiliki kemampuan alami untuk mempengaruhi dan memotivasi orang lain.'),
  C: makeSimpleProfile('C', ['C'], 'Conventional', '#006',
    'Profil Conventional mencerminkan individu yang terorganisir, detail-oriented, dan sistematis. Kamu unggul dalam pekerjaan yang membutuhkan ketelitian, konsistensi, dan mengikuti prosedur yang telah ditetapkan. Kamu adalah orang yang dapat diandalkan dalam menjaga kerapian dan akurasi data.'),
}

export function getRiasecProfile(code: string): RiasecProfile | null {
  const upper = code.toUpperCase()
  if (PROFILES_MAP[upper]) return PROFILES_MAP[upper]

  const letters = upper.split('') as RiasecLetter[]
  const validLetters = letters.filter(l => LETTERS.includes(l))
  if (validLetters.length !== letters.length || validLetters.length < 2 || validLetters.length > 3) return null

  const name = validLetters.map(l => LETTER_NAMES[l]).join(' - ')

  return makeSimpleProfile(upper, validLetters, name, `#${String(7 + validLetters.length * 10).padStart(3, '0')}`,
    `Profil ${name} merupakan kombinasi unik yang menggabungkan karakteristik dari ${validLetters.map(l => LETTER_NAMES[l]).join(', ')}. Individu dengan profil ini menampilkan kekuatan dari masing-masing tipe yang membentuk kombinasi tersebut, menciptakan pendekatan kerja yang beragam dan adaptif.`)
}

export function getAllEntries() {
  const entries: { id: string; letters: RiasecLetter[]; name: string; type: string; code: string }[] = []
  let idCounter = 1
  const fmt = (n: number) => `#${String(n).padStart(3, '0')}`

  for (const l of LETTERS) {
    entries.push({ id: fmt(idCounter++), letters: [l], name: LETTER_NAMES[l], type: '1-huruf', code: l })
  }
  for (const l1 of LETTERS) {
    for (const l2 of LETTERS) {
      if (l1 === l2) continue
      entries.push({ id: fmt(idCounter++), letters: [l1, l2], name: `${LETTER_NAMES[l1]} - ${LETTER_NAMES[l2]}`, type: '2-huruf', code: `${l1}${l2}` })
    }
  }
  for (const l1 of LETTERS) {
    for (const l2 of LETTERS) {
      if (l1 === l2) continue
      for (const l3 of LETTERS) {
        if (l3 === l1 || l3 === l2) continue
        entries.push({ id: fmt(idCounter++), letters: [l1, l2, l3], name: `${LETTER_NAMES[l1]} - ${LETTER_NAMES[l2]} - ${LETTER_NAMES[l3]}`, type: '3-huruf', code: `${l1}${l2}${l3}` })
      }
    }
  }
  return entries
}
