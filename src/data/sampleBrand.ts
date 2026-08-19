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
          },
          tags: ['craft', 'precision']
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
          },
          tags: ['service', 'welcoming']
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
          },
          tags: ['ethics', 'sourcing']
        }
      ],
      priorities: [
        {
          id: 'pri-1',
          title: {
            en: 'Deepen direct-trade producer partnerships in Guatemala and Ethiopia',
            id: 'Memperdalam kemitraan perdagangan langsung dengan petani kopi di Guatemala dan Ethiopia'
          },
          description: {
            en: 'Visit partner farms annually and commit to 3-year minimum forward purchase contracts.',
            id: 'Mengunjungi kebun mitra setiap tahun dan menyepakati kontrak pembelian minimal 3 tahun.'
          },
          timeframe: 'Near-term'
        },
        {
          id: 'pri-2',
          title: {
            en: 'Maintain zero-waste packaging across all retail and bean bags',
            id: 'Mempertahankan kemasan ramah lingkungan tanpa sampah plastik pada seluruh biji kopi eceran'
          },
          description: {
            en: 'Transition all wholesale tins and home pouches to certified home-compostable barrier films.',
            id: 'Beralih ke bahan kemasan kompos rumahan bersertifikat untuk seluruh produk.'
          },
          timeframe: 'Mid-term'
        }
      ]
    },
    positioning: {
      targetAudiences: [
        {
          id: 'aud-1',
          name: {
            en: 'Urban Professionals & Creative Freelancers',
            id: 'Profesional Perkotaan & Pekerja Kreatif'
          },
          description: {
            en: 'Knowledge workers and creators seeking a calm, high-craft morning sanctuary to begin their day.',
            id: 'Pekerja kreatif yang mencari tempat tenang berkualitas tinggi untuk memulai rutinitas pagi.'
          },
          needsPainPoints: {
            en: 'Overwhelmed by loud, rushed commercial coffee chains; want unhurried hospitality and inspiring space.',
            id: 'Jenuh dengan kedai cepat saji yang bising; mendambakan pelayanan santai dan ruang yang menenangkan.'
          }
        },
        {
          id: 'aud-2',
          name: {
            en: 'Neighborhood Residents & Ritual Seekers',
            id: 'Warga Lingkungan & Pecinta Ritual Kopi'
          },
          description: {
            en: 'Locals who value connection with their neighborhood barista and take pride in artisanal origin beans.',
            id: 'Warga lokal yang menyukai hubungan dekat dengan barista dan menghargai biji kopi berkualitas kriya.'
          },
          needsPainPoints: {
            en: 'Want consistent quality without specialty coffee intimidation or pretension.',
            id: 'Menginginkan rasa konsisten tanpa istilah kopi yang rumit dan mengintimidasi.'
          }
        }
      ],
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
          id: 'diff-1',
          title: {
            en: 'Acoustically dampened, screen-lightened cafe spaces designed for presence',
            id: 'Ruang kafe yang dirancang khusus dengan peredam suara dan pencahayaan lembut untuk ketenangan'
          },
          description: {
            en: 'Natural oak wood interiors, acoustic felt panels, and subtle natural lighting create a sensory refuge.',
            id: 'Interior kayu ek alami dan panel akustik menciptakan suaka sensorik yang tenang.'
          },
          evidence: {
            en: 'Independent acoustic testing measuring average background sound at < 62 dB.',
            id: 'Pengukuran suara akustik independen di bawah 62 dB.'
          }
        },
        {
          id: 'diff-2',
          title: {
            en: 'Transparent direct-trade pricing printed on every bag of single-origin coffee',
            id: 'Harga transparan perdagangan langsung tercetak jelas pada setiap kantong biji kopi'
          },
          description: {
            en: 'We publish farm gate prices and FOB margins directly on the retail label.',
            id: 'Kami mencetak margin FOB dan harga petani langsung pada label produk.'
          },
          evidence: {
            en: 'Annual open-source Transparency Report published online.',
            id: 'Laporan Transparansi tahunan yang dipublikasikan terbuka.'
          }
        },
        {
          id: 'diff-3',
          title: {
            en: 'Baristas trained as warm hosts rather than gatekeepers of coffee jargon',
            id: 'Barista yang dilatih sebagai tuan rumah yang ramah, bukan penguji istilah kopi'
          },
          description: {
            en: 'Hospitality-first training curriculum prioritizing customer comfort over technical posturing.',
            id: 'Kurikulum pelatihan yang mengutamakan keramahan dibandingkan istilah teknis.'
          }
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
        {
          id: 'trait-1',
          trait: { en: 'Warm', id: 'Hangat' },
          definition: {
            en: 'Approachable, welcoming, and genuinely interested in human comfort.',
            id: 'Ramah, mudah didekati, dan peduli pada kenyamanan orang lain.'
          },
          spectrumPosition: 75
        },
        {
          id: 'trait-2',
          trait: { en: 'Grounded', id: 'Membumi' },
          definition: {
            en: 'Unpretentious, honest, and anchored in simple, well-crafted rituals.',
            id: 'Tidak berlebihan, jujur, dan berakar pada ritual sederhana yang penuh kriya.'
          },
          spectrumPosition: 80
        },
        {
          id: 'trait-3',
          trait: { en: 'Thoughtful', id: 'Penuh Pertimbangan' },
          definition: {
            en: 'Intentional in every detail—from acoustics to cup ceramic weight.',
            id: 'Penuh perhatian pada setiap detail—dari akustik hingga bobot cangkir keramik.'
          },
          spectrumPosition: 85
        },
        {
          id: 'trait-4',
          trait: { en: 'Quietly Confident', id: 'Percaya Diri yang Hening' },
          definition: {
            en: 'Does not need to shout or use flashy gimmicks to stand out.',
            id: 'Tidak perlu berteriak atau menggunakan trik mencolok untuk tampil istimewa.'
          },
          spectrumPosition: 70
        }
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
          weAreNot: { en: 'Elitist coffee snobs', id: 'Pakar kopi yang elitis' },
          rationale: {
            en: 'Coffee is an invitation to pause, not an examination of tasting notes.',
            id: 'Kopi adalah ajakan untuk beristirahat, bukan ujian mencicipi rasa.'
          }
        },
        {
          id: 'pair-2',
          weAre: { en: 'Intentionally calm', id: 'Tenang dengan penuh kesadaran' },
          weAreNot: { en: 'Boring or clinical', id: 'Membosankan atau kaku' },
          rationale: {
            en: 'Serenity comes from beauty and craftsmanship, not sterile emptiness.',
            id: 'Ketenangan lahir dari keindahan kriya, bukan kekosongan yang hampa.'
          }
        }
      ]
    },
    voiceTone: {
      principles: [
        {
          id: 'vp-1',
          title: {
            en: 'Speak like a thoughtful friend, not a corporation',
            id: 'Bicara seperti teman yang hangat, bukan korporasi'
          },
          description: {
            en: 'Use relaxed cadence, gentle humor, and sincere observation.',
            id: 'Gunakan irama santai, kehangatan, dan ketulusan berbahasa.'
          },
          doExample: {
            en: 'Take your time. We just roasted a fresh batch of Ethiopian heirloom beans.',
            id: 'Nikmati waktu Anda. Biji kopi Ethiopia kami baru saja selesai disangrai segar.'
          },
          dontExample: {
            en: 'Maximize your throughput with our premium artisan coffee beverage solutions!',
            id: 'Tingkatkan produktivitas Anda dengan solusi minuman kopi premium kami!'
          }
        },
        {
          id: 'vp-2',
          title: {
            en: 'Keep prose clear, human, and lightly poetic',
            id: 'Gunakan kalimat yang jelas, manusiawi, dan puitis secara halus'
          },
          description: {
            en: 'Celebrate everyday beauty without sliding into pretension or overly dense metaphors.',
            id: 'Rayakan keindahan rutinitas harian tanpa terasa kaku atau berbelit-belit.'
          }
        }
      ],
      toneGuidelines: {
        en: 'Warm, conversational, unhurried, and grounded. We use natural rhythms, avoiding hyperbole, exclamation overload, or trendy internet slang.',
        id: 'Hangat, santai, tidak terburu-buru, dan membumi. Gunakan ritme alami tanpa kata berlebihan atau bahasa gaul berlebihan.'
      },
      vocabulary: [
        { id: 'voc-1', term: { en: 'Grounding', id: 'Penyeimbang' }, recommendation: 'prefer' },
        { id: 'voc-2', term: { en: 'Ritual', id: 'Ritual' }, recommendation: 'prefer' },
        { id: 'voc-3', term: { en: 'Pause', id: 'Jeda' }, recommendation: 'prefer' },
        { id: 'voc-4', term: { en: 'Crafted', id: 'Dibuat dengan kriya' }, recommendation: 'prefer' },
        { id: 'voc-5', term: { en: 'Fuel up', id: 'Cari kafein' }, recommendation: 'avoid' },
        { id: 'voc-6', term: { en: 'Disruptive', id: 'Disruptif' }, recommendation: 'avoid' },
        { id: 'voc-7', term: { en: 'Premium', id: 'Mewah / Premium' }, recommendation: 'avoid' }
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
          },
          explanation: {
            en: 'Reframes coffee from a frantic transaction into a restorative daily ritual.',
            id: 'Mengubah makna kopi dari transaksi terburu-buru menjadi ritual yang menenangkan.'
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
      secondaryColors: [],
      typographyNotes: {
        en: 'Typography balances heritage craftsmanship with modern readability.',
        id: 'Tipografi menyeimbangkan kriya warisan dengan keterbacaan modern.'
      },
      imageryDirection: {
        en: 'Natural daylight, documentary angles, authentic cafe textures, and unposed moments.',
        id: 'Cahaya alami, sudut pandang dokumenter, tekstur kafe autentik, dan momen natural.'
      },
      layoutNotes: {
        en: 'Generous whitespace, structured grid, intentional focal points.',
        id: 'Ruang kosong yang lapang, grid terstruktur, dan titik fokus yang jelas.'
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
          id: 'km-1',
          headline: {
            en: 'Every cup starts with direct-trade relationships that honor the farmer.',
            id: 'Setiap cangkir dimulai dari hubungan perdagangan langsung yang menghargai petani.'
          },
          narrative: {
            en: 'We pay above fair-trade minimums to smallholder farms in Huila and Yirgacheffe.',
            id: 'Kami membayar harga di atas standar perdagangan adil kepada petani kecil.'
          },
          targetAudienceRef: {
            domain: 'foundation',
            entityType: 'targetAudience',
            entityId: 'aud-1',
            label: 'Urban Professionals & Creative Freelancers'
          },
          proofPointRefs: [
            {
              domain: 'foundation',
              entityType: 'proofPoint',
              entityId: 'pp-1',
              label: '100% direct-trade sourcing with transparent farm prices printed on every bag'
            }
          ]
        },
        {
          id: 'km-2',
          headline: {
            en: 'Our spaces are designed to quiet the noise, not speed you up.',
            id: 'Ruang kami dirancang untuk menenangkan pikiran, bukan mempercepat langkah Anda.'
          },
          narrative: {
            en: 'Acoustic dampening and warm oak seating make our cafes a sanctuary from sensory overload.',
            id: 'Peredam akustik dan tempat duduk kayu ek membuat kafe kami menjadi suaka dari kebisingan kota.'
          },
          targetAudienceRef: {
            domain: 'foundation',
            entityType: 'targetAudience',
            entityId: 'aud-1',
            label: 'Urban Professionals & Creative Freelancers'
          }
        }
      ],
      proofPoints: [
        {
          id: 'pp-1',
          claim: {
            en: '100% direct-trade sourcing with transparent farm prices printed on every bag',
            id: '100% pengadaan perdagangan langsung dengan harga perkebunan transparan tercetak di setiap kemasan'
          },
          evidence: {
            en: 'Farm-gate purchase receipts published annually in our Transparency Report.',
            id: 'Kwitansi pembelian tingkat petani diterbitkan tahunan dalam Laporan Transparansi.'
          },
          category: 'Ethics'
        }
      ],
      callsToAction: [
        {
          id: 'cta-1',
          label: {
            en: 'Find your neighborhood sanctuary',
            id: 'Temukan kedai penenang di lingkungan Anda'
          },
          contextChannel: 'Website Hero'
        },
        {
          id: 'cta-2',
          label: {
            en: 'Taste this season’s harvest',
            id: 'Cicipi hasil panen musim ini'
          },
          contextChannel: 'Retail Menu'
        }
      ]
    }
  }
};
