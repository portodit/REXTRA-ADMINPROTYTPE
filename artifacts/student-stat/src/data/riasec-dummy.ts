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
      title: 'Komunikasi non-teknis',
      description:
        'Menjelaskan konsep teknis kepada audiens non-teknis bisa menjadi tantangan. Kamu mungkin merasa frustrasi ketika orang lain tidak memahami apa yang terasa jelas bagimu.',
    },
    {
      title: 'Adaptasi terhadap ambiguitas',
      description:
        'Kamu lebih nyaman dengan instruksi yang jelas dan terstruktur. Situasi yang ambigu atau tidak pasti bisa membuat kamu merasa tidak nyaman dan kurang produktif.',
    },
    {
      title: 'Pekerjaan administratif',
      description:
        'Tugas-tugas seperti dokumentasi, pelaporan, dan pekerjaan administratif mungkin terasa membosankan dan membuang waktu dibandingkan pekerjaan langsung.',
    },
    {
      title: 'Keterbatasan dalam berpikir abstrak',
      description:
        'Konsep-konsep yang sangat teoritis atau filosofis mungkin kurang menarik perhatianmu dibandingkan aplikasi praktisnya.',
    },
  ],
  strategiPengembangan: [
    {
      title: 'Tingkatkan kemampuan presentasi',
      description:
        'Latih dirimu untuk menjelaskan ide-ide teknis dalam bahasa sederhana. Gunakan analogi dan visualisasi untuk membantu orang lain memahami konsep yang kamu kuasai.',
    },
    {
      title: 'Kembangkan toleransi terhadap ketidakpastian',
      description:
        'Berlatih mengambil keputusan dengan informasi yang tidak lengkap. Mulai dengan proyek kecil yang membutuhkan fleksibilitas dan adaptasi.',
    },
    {
      title: 'Pelajari dasar-dasar manajemen proyek',
      description:
        'Memahami bagaimana merencanakan, mendokumentasikan, dan melaporkan kemajuan akan membuatmu lebih berharga dalam tim yang lebih besar.',
    },
    {
      title: 'Eksplor kolaborasi lintas fungsi',
      description:
        'Bekerja sama dengan rekan dari bidang yang berbeda akan memperluas perspektifmu dan membantu mengembangkan keterampilan interpersonal yang lebih beragam.',
    },
  ],
  gayaInteraksi: [
    {
      title: 'Kerja mandiri dengan tujuan jelas',
      description:
        'Kamu paling produktif ketika diberikan tujuan yang jelas dan kebebasan untuk mencapainya dengan caramu sendiri. Micromanagement menurunkan motivasimu.',
    },
    {
      title: 'Komunikasi langsung dan to-the-point',
      description:
        'Kamu menghargai komunikasi yang efisien dan tidak bertele-tele. Pertemuan yang panjang tanpa agenda yang jelas terasa menyia-nyiakan waktu bagimu.',
    },
    {
      title: 'Preferensi tim kecil dan fungsional',
      description:
        'Kamu lebih efektif dalam tim kecil dengan peran yang terdefinisi dengan baik dibandingkan dalam kelompok besar yang kurang terstruktur.',
    },
    {
      title: 'Penyelesaian konflik berbasis fakta',
      description:
        'Ketika menghadapi konflik, kamu cenderung mencari solusi berdasarkan data dan fakta daripada pertimbangan emosional.',
    },
  ],
  lingkunganKerjaIdeal: [
    {
      title: 'Lingkungan berbasis hasil',
      description:
        'Kamu berkembang dalam budaya yang menghargai output nyata dan pencapaian konkret, bukan seberapa sibuk seseorang terlihat.',
    },
    {
      title: 'Akses ke alat dan teknologi terkini',
      description:
        'Bekerja dengan peralatan, software, atau teknologi yang up-to-date membuatmu lebih bersemangat dan produktif.',
    },
    {
      title: 'Ruang untuk pemecahan masalah',
      description:
        'Kamu membutuhkan tantangan teknis yang nyata untuk diselesaikan. Pekerjaan rutin tanpa variasi bisa membuatmu bosan dalam jangka panjang.',
    },
    {
      title: 'Fleksibilitas dalam metode kerja',
      description:
        'Selama hasilnya tercapai, kamu menghargai kebebasan untuk memilih pendekatan terbaikmu sendiri dalam menyelesaikan tugas.',
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
      description: `Karakteristik ${name} dalam aspek ini menunjukkan keunggulan yang khas dan relevan dalam konteks dunia kerja modern.`,
    }))

  return {
    code,
    letters,
    name,
    id,
    description,
    kekuatanProfil: make([`Keunggulan utama ${name}`, 'Kemampuan analitis', 'Orientasi hasil', 'Adaptabilitas']),
    tantanganProfil: make(['Area pengembangan 1', 'Area pengembangan 2', 'Area pengembangan 3', 'Area pengembangan 4']),
    strategiPengembangan: make(['Strategi 1', 'Strategi 2', 'Strategi 3', 'Strategi 4']),
    gayaInteraksi: make(['Gaya komunikasi', 'Preferensi tim', 'Kolaborasi', 'Resolusi konflik']),
    lingkunganKerjaIdeal: make(['Budaya kerja ideal', 'Struktur organisasi', 'Manajemen', 'Lingkungan fisik']),
  }
}

const PROFILES_MAP: Record<string, RiasecProfile> = {
  R: REALISTIC_PROFILE,
  I: makeSimpleProfile('I', ['I'], 'Investigative', '#002',
    'Profil Investigative menunjukkan individu yang analitis, intelektual, dan berorientasi pada pemecahan masalah kompleks. Kamu senang mengeksplorasi ide-ide abstrak dan mencari pemahaman mendalam tentang fenomena di sekitarmu.'),
  A: makeSimpleProfile('A', ['A'], 'Artistic', '#003',
    'Profil Artistic mencerminkan individu yang kreatif, imajinatif, dan ekspresif. Kamu cenderung berpikir di luar kebiasaan dan menemukan cara-cara inovatif untuk mengekspresikan ide dan perasaan.'),
  S: makeSimpleProfile('S', ['S'], 'Social', '#004',
    'Profil Social menggambarkan individu yang hangat, empatik, dan berorientasi pada membantu orang lain. Kamu menemukan kepuasan dalam berinteraksi, mendidik, dan mendukung pertumbuhan orang lain.'),
  E: makeSimpleProfile('E', ['E'], 'Enterprising', '#005',
    'Profil Enterprising menunjukkan individu yang ambisius, persuasif, dan berorientasi pada kepemimpinan. Kamu menikmati memimpin tim, mengambil keputusan strategis, dan mencapai tujuan bisnis.'),
  C: makeSimpleProfile('C', ['C'], 'Conventional', '#006',
    'Profil Conventional mencerminkan individu yang terorganisir, detail-oriented, dan sistematis. Kamu unggul dalam pekerjaan yang membutuhkan ketelitian, konsistensi, dan mengikuti prosedur yang telah ditetapkan.'),
}

export function getRiasecProfile(code: string): RiasecProfile | null {
  const upper = code.toUpperCase()
  if (PROFILES_MAP[upper]) return PROFILES_MAP[upper]

  const letters = upper.split('') as RiasecLetter[]
  const validLetters = letters.filter(l => LETTERS.includes(l))
  if (validLetters.length !== letters.length || validLetters.length < 2 || validLetters.length > 3) return null

  const name = validLetters.map(l => LETTER_NAMES[l]).join(' - ')
  const idNum = 6 + validLetters.length * 10
  const id = `#${String(idNum).padStart(3, '0')}`

  return makeSimpleProfile(upper, validLetters, name, id,
    `Profil ${name} merupakan kombinasi unik yang menggabungkan karakteristik dari ${validLetters.map(l => LETTER_NAMES[l]).join(', ')}. Individu dengan profil ini menampilkan kekuatan dari masing-masing tipe yang membentuk kombinasi tersebut.`)
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
