import { Brand, LogoVariant } from '../types/brand';

export const defaultLogoVariants: LogoVariant[] = [
  {
    id: 'logo-var-1',
    variantKey: 'primary',
    name: {
      en: 'Primary Full Color Wordmark',
      id: 'Wordmark Utama Warna Penuh'
    },
    usageNotes: {
      en: 'Main brand mark for all primary touchpoints, cafe signage, packaging, and digital headers.',
      id: 'Logo utama untuk penanda cafe, kemasan, dan bagian atas media digital.'
    },
    recommendedBg: '#f7f4ef',
    doNotUseWhen: {
      en: 'Do not place over busy photographic backgrounds or low-contrast surfaces.',
      id: 'Jangan tempatkan di atas latar belakang foto yang ramai atau permukaan yang kontrasnya rendah.'
    }
  },
  {
    id: 'logo-var-2',
    variantKey: 'black',
    name: {
      en: 'Monochrome Solid Black',
      id: 'Hitam Solid Monokrom'
    },
    usageNotes: {
      en: 'Single-color black execution for receipts, thermal printing, and single-pass ink stamp packaging.',
      id: 'Varian hitam satu warna untuk cetak resi thermal dan stempel kemasan manual.'
    },
    recommendedBg: '#ffffff',
    doNotUseWhen: {
      en: 'Do not use on dark brown or espresso-toned surfaces.',
      id: 'Jangan gunakan pada permukaan berwarna cokelat tua atau warna espresso.'
    }
  },
  {
    id: 'logo-var-3',
    variantKey: 'white',
    name: {
      en: 'White Reversed Lockup',
      id: 'Putih Terbalik (Reversed)'
    },
    usageNotes: {
      en: 'Reversed white lockup specifically designed for placement on Espresso Earth (#2d241e) dark backgrounds.',
      id: 'Logo putih terbalik khusus untuk ditempatkan pada latar belakang gelap Espresso Earth (#2d241e).'
    },
    recommendedBg: '#2d241e',
    doNotUseWhen: {
      en: 'Do not use on light parchment or white surfaces.',
      id: 'Jangan gunakan pada permukaan parchment terang atau putih.'
    }
  },
  {
    id: 'logo-var-4',
    variantKey: 'simplifiedMark',
    name: {
      en: 'North Star Emblem Mark',
      id: 'Simbol Bintang Northstar'
    },
    usageNotes: {
      en: 'Standalone geometric star symbol used when space is constrained or as a subtle watermark on packaging.',
      id: 'Simbol bintang geometris berdiri sendiri saat ruang terbatas atau sebagai watermark halus pada kemasan.'
    },
    recommendedBg: '#f7f4ef',
    doNotUseWhen: {
      en: 'Do not use without clear brand context on first-time customer touchpoints.',
      id: 'Jangan gunakan tanpa konteks merek yang jelas pada titik sentuh pelanggan pertama kali.'
    }
  },
  {
    id: 'logo-var-5',
    variantKey: 'horizontal',
    name: {
      en: 'Compact Horizontal Lockup',
      id: 'Susunan Horisontal Ringkas'
    },
    usageNotes: {
      en: 'Emblem side-by-side with wordmark for narrow header bars, mobile footers, and website navs.',
      id: 'Simbol berdampingan dengan wordmark untuk bilah navigasi situs web dan header seluler.'
    },
    recommendedBg: '#ffffff',
    doNotUseWhen: {
      en: 'Do not crowd around container margins; maintain minimum 16px clear space.',
      id: 'Jangan sesaki tepi kontainer; pertahankan jarak bersih minimal 16px.'
    }
  },
  {
    id: 'logo-var-6',
    variantKey: 'vertical',
    name: {
      en: 'Centered Stacked Lockup',
      id: 'Susunan Vertikal Terpusat'
    },
    usageNotes: {
      en: 'Emblem centered above wordmark for retail bean bags, menu boards, and storefront glass doors.',
      id: 'Simbol di tengah atas wordmark untuk kantong biji kopi eceran, papan menu, dan pintu kaca toko.'
    },
    recommendedBg: '#f7f4ef',
    doNotUseWhen: {
      en: 'Do not scale below 32px emblem width.',
      id: 'Jangan perkecil di bawah lebar simbol 32px.'
    }
  },
  {
    id: 'logo-var-7',
    variantKey: 'iconApp',
    name: {
      en: 'App Icon & Favicon Slot',
      id: 'Ikon Aplikasi & Favicon'
    },
    usageNotes: {
      en: 'Square 1:1 ratio icon for PWA web app icons, browser favicons, and social media profile avatars.',
      id: 'Ikon rasio 1:1 persegi untuk ikon aplikasi PWA, favicon browser, dan foto profil media sosial.'
    },
    recommendedBg: '#0f172a',
    doNotUseWhen: {
      en: 'Do not include small tagline text inside the icon frame.',
      id: 'Jangan sertakan teks tagline kecil di dalam bingkai ikon.'
    }
  }
];

export const sampleBrand: Brand = {
  id: 'northstar-coffee',
  name: 'Northstar Coffee',
  description: 'A neighborhood coffee brand for people who use small daily rituals to stay grounded.',
  createdAt: '2026-01-15T08:00:00.000Z',
  updatedAt: '2026-08-17T07:00:00.000Z',
  activeModules: [
    'overview',
    'strategy',
    'positioning',
    'personality',
    'voiceTone',
    'visualBasics',
    'messaging'
  ],
  modules: {
    overview: {
      brandName: 'Northstar Coffee',
      oneLineDescription: {
        en: 'A neighborhood coffee brand for people who use small daily rituals to stay grounded.',
        id: 'Merek kedai kopi lingkungan untuk mereka yang memanfaatkan ritual harian kecil agar tetap tenang dan membumi.'
      },
      longDescription: {
        en: 'Northstar Coffee is an independent specialty coffee roasting and cafe concept dedicated to slow morning rituals, intentional sourcing, and warm human connection. Designed as a sanctuary from urban velocity, every detail—from our light-roasted single origins to our acoustic atmosphere—is tuned for grounding moments.',
        id: 'Northstar Coffee adalah sangrai kopi spesialti independen dan konsep kafe yang didedikasikan untuk ritual pagi yang tenang, pengadaan bahan yang etis, serta hubungan manusia yang hangat. Dirancang sebagai suaka dari hiruk-pikuk perkotaan, setiap detail—dari kopi sangrai ringan hingga suasana akustiknya—diselaraskan untuk menciptakan momen penenang.'
      },
      category: {
        en: 'Specialty Coffee / Neighborhood Cafe',
        id: 'Kopi Spesialti / Kafe Lingkungan'
      },
      website: 'https://northstarcoffee.com',
      internalNotes: {
        en: 'v0.1 core brand guidelines completed during strategic identity workshop. Ready for team alignment.',
        id: 'Panduan utama merek v0.1 diselesaikan dalam lokakarya identitas strategis.'
      }
    },
    strategy: {
      purpose: {
        en: 'To create quiet, restorative moments of pause that ground people in their daily lives.',
        id: 'Menciptakan momen jeda yang tenang dan memulihkan untuk menjaga keseimbangan hidup harian.'
      },
      mission: {
        en: 'To craft exceptional, ethically sourced coffee served in serene neighborhood spaces that celebrate craftsmanship and community.',
        id: 'Menyajikannya kopi spesialti etis dalam ruang lingkungan yang tenang untuk merayakan keahlian kriya dan komunitas.'
      },
      vision: {
        en: 'To build a network of beloved neighborhood sanctuaries that redefine morning coffee from a rushed transaction into a meaningful ritual.',
        id: 'Membangun jaringan suaka lingkungan yang mengubah kopi pagi dari transaksi terburu-buru menjadi ritual yang bermakna.'
      },
      values: [
        {
          id: 'val-1',
          title: {
            en: 'Intentionality',
            id: 'Keseriusan Niat (Intentionality)'
          },
          description: {
            en: 'We slow down to do things right—from bean sourcing to manual pour-over precision.',
            id: 'Kami mengambil waktu untuk melakukan segala hal secara presisi—dari pemilihan biji hingga teknik seduh manual.'
          }
        },
        {
          id: 'val-2',
          title: {
            en: 'Warm Hospitality',
            id: 'Keramahan yang Hangat'
          },
          description: {
            en: 'Unpretentious, welcoming service that makes regulars and newcomers feel equally at home.',
            id: 'Pelayanan ramah tanpa kesan elitis yang membuat pelanggan setia maupun pengunjung baru merasa nyaman.'
          }
        },
        {
          id: 'val-3',
          title: {
            en: 'Radical Transparency',
            id: 'Transparansi Radikal'
          },
          description: {
            en: 'Direct trade relationships with smallholder farms, sharing exact pricing and farm origin.',
            id: 'Kemitraan perdagangan langsung dengan petani kecil, membagikan harga transparan dan asal usul perkebunan.'
          }
        }
      ],
      priorities: [
        {
          en: 'Deepen direct-trade producer partnerships in Guatemala and Ethiopia',
          id: 'Memperdalam kemitraan perdagangan langsung dengan petani kopi di Guatemala dan Ethiopia'
        },
        {
          en: 'Maintain zero-waste packaging across all retail and bean bags',
          id: 'Mempertahankan kemasan ramah lingkungan tanpa sampah plastik pada seluruh biji kopi eceran'
        }
      ]
    },
    positioning: {
      targetAudience: {
        en: 'Urban professionals, creative freelancers, and local residents who feel overwhelmed by loud commercial coffee chains and seek a calm, high-craft morning sanctuary.',
        id: 'Profesional perkotaan, pekerja kreatif, dan warga lokal yang merasa jenuh dengan kedai kopi komersial yang bising dan mencari tempat tenang berkualitas tinggi.'
      },
      marketCategory: {
        en: 'Artisanal Specialty Coffee & Neighborhood Cafes',
        id: 'Kopi Spesialti Artisanal & Kafe Lingkungan'
      },
      coreProblem: {
        en: 'Modern coffee options force a choice between sterile fast-service chains or snobbish, intimidating specialty shops.',
        id: 'Pilihan kopi modern memaksa orang memilih antara kedai cepat saji yang kaku atau kedai spesialti yang terasa mengintimidasi.'
      },
      differentiators: [
        {
          en: 'Acoustically dampened, screen-lightened cafe spaces designed for presence',
          id: 'Ruang kafe yang dirancang khusus dengan peredam suara dan pencahayaan lembut untuk ketenangan'
        },
        {
          en: 'Transparent direct-trade pricing printed on every bag of single-origin coffee',
          id: 'Harga transparan perdagangan langsung tercetak jelas pada setiap kantong biji kopi'
        },
        {
          en: 'Baristas trained as warm hosts rather than gatekeepers of coffee jargon',
          id: 'Barista yang dilatih sebagai tuan rumah yang ramah, bukan penguji istilah kopi'
        }
      ],
      competitiveAlternatives: {
        en: 'High-speed commercial drive-thrus, pretentious minimalist third-wave roasters, and instant home pods.',
        id: 'Kedai cepat saji drive-thru, sangrai kopi minimals terlampau kaku, dan kopi saset instan.'
      },
      positioningStatement: {
        en: 'For urban professionals and creative locals who want a calmer alternative to rushed coffee chains, Northstar Coffee is a neighborhood coffee brand that turns everyday coffee into a grounding ritual through warm service, carefully sourced beans, and quiet, well-designed spaces.',
        id: 'Bagi para profesional dan kreator lokal yang menginginkan alternatif tenang dari kedai kopi terburu-buru, Northstar Coffee adalah merek kopi lingkungan yang mengubah kopi harian menjadi ritual penenang melalui pelayanan hangat, biji kopi terpilih, dan ruang yang nyaman.'
      }
    },
    personality: {
      traits: [
        { en: 'Warm', id: 'Hangat' },
        { en: 'Grounded', id: 'Membumi' },
        { en: 'Thoughtful', id: 'Penuh Pertimbangan' },
        { en: 'Quietly Confident', id: 'Percaya Diri yang Hening' }
      ],
      sliders: {
        classicToModern: 42,
        seriousToPlayful: 35,
        reservedToExpressive: 28,
        practicalToVisionary: 65
      },
      archetype: {
        en: 'The Caregiver & The Artisan',
        id: 'Pengayom & Pengrajin (The Caregiver & Artisan)'
      },
      weAreWeAreNot: [
        {
          id: 'pair-1',
          weAre: { en: 'Warm & welcoming hosts', id: 'Tuan rumah yang hangat' },
          weAreNot: { en: 'Elitist coffee snobs', id: 'Pakar kopi yang elitis' }
        },
        {
          id: 'pair-2',
          weAre: { en: 'Intentionally calm', id: 'Tenang dengan penuh kesadaran' },
          weAreNot: { en: 'Boring or clinical', id: 'Membosankan atau kaku' }
        }
      ]
    },
    voiceTone: {
      principles: [
        {
          en: 'Speak like a thoughtful friend, not a corporation',
          id: 'Bicara seperti teman yang hangat, bukan korporasi'
        },
        {
          en: 'Keep prose clear, human, and lightly poetic',
          id: 'Gunakan kalimat yang jelas, manusiawi, dan puitis secara halus'
        }
      ],
      toneGuidelines: {
        en: 'Warm, conversational, unhurried, and grounded. We use natural rhythms, avoiding hyperbole, exclamation overload, or trendy internet slang.',
        id: 'Hangat, santai, tidak terburu-buru, dan membumi. Gunakan ritme alami tanpa kata berlebihan atau bahasa gaul berlebihan.'
      },
      wordsToUse: [
        { en: 'Grounding', id: 'Penyeimbang' },
        { en: 'Ritual', id: 'Ritual' },
        { en: 'Pause', id: 'Jeda' },
        { en: 'Crafted', id: 'Dibuat dengan kriya' }
      ],
      wordsToAvoid: [
        { en: 'Fuel up', id: 'Cari kafein' },
        { en: 'Disruptive', id: 'Disruptif' },
        { en: 'Premium', id: 'Mewah / Premium' }
      ],
      examples: [
        {
          id: 'ex-1',
          context: { en: 'Cafe Signage', id: 'Papan Petunjuk Kafe' },
          before: {
            en: 'Grab your daily caffeine fix on the go! Fast service inside!',
            id: 'Ambil kafein harianmu dengan cepat! Layanan kilat di dalam!'
          },
          after: {
            en: 'Take a quiet moment. Your morning cup is freshly brewed inside.',
            id: 'Nikmati momen tenang. Kopi pagi Anda diseduh segar di dalam.'
          }
        }
      ],
      channelNotes: [
        {
          en: 'In-store packaging: Poetic, minimal, origin-focused',
          id: 'Kemasan toko: Puitis, minimalis, fokus pada asal usul kopi'
        }
      ]
    },
    visualBasics: {
      logoUsageNotes: {
        en: 'Primary wordmark uses a custom flared serif. Always allow generous clear space around all edges. Never tilt, stretch, or apply drop shadows.',
        id: 'Wordmark utama menggunakan jenis huruf serif berlekuk. Berikan ruang kosong yang cukup di sekeliling logo. Jangan miringkan atau beri bayangan.'
      },
      logoVariants: defaultLogoVariants,
      primaryColors: [
        {
          id: 'c-1',
          name: { en: 'Espresso Earth', id: 'Espresso Earth (Cokelat Tua)' },
          hex: '#2d241e',
          usage: { en: 'Primary typography & dark headers', id: 'Teks utama & tata letak gelap' }
        },
        {
          id: 'c-2',
          name: { en: 'Warm Parchment', id: 'Warm Parchment (Krem Hangat)' },
          hex: '#f7f4ef',
          usage: { en: 'Main background & cafe wall tone', id: 'Latar belakang utama & warna dinding kafe' }
        },
        {
          id: 'c-3',
          name: { en: 'Amber Glow', id: 'Amber Glow (Kuning Amber)' },
          hex: '#d97706',
          usage: { en: 'Accent highlights & badge borders', id: 'Aksen penyorot & bingkai lencana' }
        }
      ],
      secondaryColors: [
        {
          id: 'c-4',
          name: { en: 'Sage Leaf', id: 'Sage Leaf (Hijau Daun)' },
          hex: '#526e5a',
          usage: { en: 'Secondary tags for green tea blends', id: 'Tag sekunder untuk kemasan teh hijau' }
        }
      ],
      typographyNotes: {
        en: 'Primary Serif: Newsreader (Editorial & Headings). Primary Sans: Inter (UI & Body Text). Monospace: JetBrains Mono.',
        id: 'Serif Utama: Newsreader (Judul & Editorial). Sans Utama: Inter (Antarmuka & Teks Isi). Monospace: JetBrains Mono.'
      },
      imageryDirection: {
        en: 'Natural daylight, soft textures, tactile surfaces (warm oak, ceramic, linen), focused shots of pour-overs and relaxed human hands.',
        id: 'Cahaya alami, tekstur lembut, permukaan alami (kayu ek, keramik, linen), serta foto fokus pada seduhan kopi dan tangan manusia.'
      },
      layoutNotes: {
        en: 'Uncluttered grids with generous whitespace. Asymmetrical balance with subtle tactile lines.',
        id: 'Grid rapi dengan ruang kosong yang lapang. Keseimbangan asimetris dengan garis pembatas halus.'
      }
    },
    messaging: {
      tagline: {
        en: 'Grounded Mornings. Quiet Craft.',
        id: 'Pagi yang Tenang. Kriya yang Hening.'
      },
      elevatorPitch: {
        en: 'Northstar Coffee is a neighborhood coffee brand dedicated to slow morning rituals. We pair ethically sourced single-origin coffees with warm, serene cafe spaces that give urban locals a restorative pause in their daily routine.',
        id: 'Northstar Coffee adalah kedai kopi lingkungan yang didedikasikan untuk ritual pagi yang rileks. Kami memadukan kopi asal tunggal etis dengan ruang kafe yang tenang untuk memberikan jeda penenang bagi warga kota.'
      },
      keyMessages: [
        {
          en: 'Every cup starts with direct-trade relationships that honor the farmer.',
          id: 'Setiap cangkir dimulai dari hubungan perdagangan langsung yang menghargai petani.'
        },
        {
          en: 'Our spaces are designed to quiet the noise, not speed you up.',
          id: 'Ruang kami dirancang untuk menenangkan pikiran, bukan mempercepat langkah Anda.'
        }
      ],
      proofPoints: [
        {
          en: '100% direct-trade sourcing with transparent farm prices printed on every bag',
          id: '100% pengadaan perdagangan langsung dengan harga perkebunan transparan tercetak di setiap kemasan'
        }
      ],
      callsToAction: [
        {
          en: 'Find your neighborhood sanctuary',
          id: 'Temukan kedai penenang di lingkungan Anda'
        },
        {
          en: 'Taste this season’s harvest',
          id: 'Cicipi hasil panen musim ini'
        }
      ]
    }
  }
};
