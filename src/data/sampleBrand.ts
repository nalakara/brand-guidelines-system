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
    'visualAssets',
    'visualRules',
    'messaging',
    'brandNaming',
    'brandExpression'
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
      logos: [
        {
          id: 'logo-primary',
          name: 'Northstar Primary Wordmark',
          type: 'primaryLogo',
          role: 'primary',
          description: {
            en: 'Custom flared serif wordmark evoking timeless craftsmanship and warmth.',
            id: 'Wordmark serif berlekuk khas yang menghadirkan kehangatan dan kriya abadi.'
          },
          structure: {
            hasSymbol: true,
            hasWordmark: true,
            composition: { en: 'Emblem centered or left-aligned with serif logotype', id: 'Simbol di tengah atau rata kiri dengan logotype serif' }
          },
          variants: [
            {
              id: 'var-fullcolor',
              name: { en: 'Full Color Espresso', id: 'Warna Penuh Espresso' },
              colorType: 'fullColor',
              usageNotes: { en: 'Primary branding on Warm Parchment (#f7f4ef) backgrounds.', id: 'Branding utama pada latar Warm Parchment (#f7f4ef).' }
            },
            {
              id: 'var-white',
              name: { en: 'Reversed Pure White', id: 'Putih Murni Terbalik' },
              colorType: 'reversed',
              usageNotes: { en: 'For dark Espresso Earth (#2d241e) packaging and merchandise.', id: 'Untuk kemasan gelap Espresso Earth (#2d241e) dan merchandise.' }
            }
          ]
        },
        {
          id: 'logo-emblem',
          name: 'Northstar Compass Star Emblem',
          type: 'symbolMark',
          role: 'secondary',
          description: {
            en: 'Geometric 8-point compass star symbol used as stamp, packaging seal, and app favicon.',
            id: 'Simbol bintang kompas 8 titik geometris sebagai stempel, segel kemasan, dan favicon aplikasi.'
          },
          structure: {
            hasSymbol: true,
            hasWordmark: false
          },
          variants: [
            {
              id: 'var-emblem-solid',
              name: { en: 'Amber Gold Emblem', id: 'Simbol Emas Amber' },
              colorType: 'fullColor',
              usageNotes: { en: 'Wax seals, foil stamping, and app icons.', id: 'Segel lilin, cetak foil emas, dan ikon aplikasi.' }
            }
          ]
        }
      ],
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
          name: { en: 'Sage Canopy', id: 'Sage Canopy (Hijau Sage)' },
          hex: '#607274',
          usage: { en: 'Packaging tags & plant accent details', id: 'Label kemasan & detail aksen botani' }
        },
        {
          id: 'c-5',
          name: { en: 'Oat Cream', id: 'Oat Cream (Krem Gandum)' },
          hex: '#e3dcce',
          usage: { en: 'Subtle container borders and card fills', id: 'Bingkai kontainer halus dan latar kartu' }
        }
      ],
      colors: [
        {
          id: 'col-1',
          name: 'Espresso Earth',
          role: 'primary',
          hex: '#2d241e',
          rgb: 'rgb(45, 36, 30)',
          hsl: 'hsl(24, 20%, 15%)',
          cmyk: 'cmyk(0%, 20%, 33%, 82%)',
          description: { en: 'Deep, rich roasted tone for high-contrast typography.', id: 'Warna sangrai pekat untuk keterbacaan teks kontras tinggi.' }
        },
        {
          id: 'col-2',
          name: 'Warm Parchment',
          role: 'primary',
          hex: '#f7f4ef',
          rgb: 'rgb(247, 244, 239)',
          hsl: 'hsl(38, 27%, 95%)',
          cmyk: 'cmyk(0%, 1%, 3%, 3%)',
          description: { en: 'Gentle, soothing foundation tone that replaces sterile pure white.', id: 'Warna dasar lembut yang menggantikan putih murni kaku.' }
        },
        {
          id: 'col-3',
          name: 'Amber Glow',
          role: 'accent',
          hex: '#d97706',
          rgb: 'rgb(217, 119, 6)',
          hsl: 'hsl(32, 95%, 44%)',
          cmyk: 'cmyk(0%, 45%, 97%, 15%)',
          description: { en: 'Warm morning light highlight tone.', id: 'Warna sorotan cahaya pagi yang hangat.' }
        },
        {
          id: 'col-4',
          name: 'Sage Canopy',
          role: 'secondary',
          hex: '#607274',
          rgb: 'rgb(96, 114, 116)',
          hsl: 'hsl(186, 9%, 42%)',
          cmyk: 'cmyk(17%, 2%, 0%, 55%)',
          description: { en: 'Botanical coffee farm shade.', id: 'Warna keteduhan kebun kopi botani.' }
        }
      ],
      fonts: [
        {
          id: 'font-fraunces',
          name: 'Fraunces',
          role: 'primary',
          weights: [400, 600, 700],
          styles: ['normal', 'italic'],
          updatedAt: '2026-08-18T10:00:00.000Z'
        },
        {
          id: 'font-inter',
          name: 'Inter',
          role: 'secondary',
          weights: [400, 500, 600],
          styles: ['normal'],
          updatedAt: '2026-08-18T10:00:00.000Z'
        }
      ],
      typeStyles: [
        {
          id: 'ts-display-1',
          name: 'Display Large',
          category: 'display',
          fontFamilyId: 'font-fraunces',
          weight: 700,
          sizePx: 48,
          lineHeight: 1.15,
          letterSpacingEm: -0.02,
          sampleText: { en: 'Grounded Mornings.', id: 'Pagi yang Tenang.' }
        },
        {
          id: 'ts-heading-1',
          name: 'Heading 1',
          category: 'heading',
          fontFamilyId: 'font-fraunces',
          weight: 600,
          sizePx: 32,
          lineHeight: 1.25,
          letterSpacingEm: -0.01,
          sampleText: { en: 'Our Sourcing Ethics', id: 'Etika Pengadaan Kami' }
        },
        {
          id: 'ts-body-1',
          name: 'Body Regular',
          category: 'body',
          fontFamilyId: 'font-inter',
          weight: 400,
          sizePx: 16,
          lineHeight: 1.6,
          letterSpacingEm: 0,
          sampleText: { en: 'We craft unhurried coffee for intentional daily pauses.', id: 'Kami menyeduh kopi berkualitas untuk jeda harian Anda.' }
        }
      ],
      typographyNotes: {
        en: 'Typography balances heritage craftsmanship with modern readability. Headlines use Fraunces (warm flared serif), while body copy utilizes Inter (clean, highly legible grotesque).',
        id: 'Tipografi menyeimbangkan kriya warisan dengan keterbacaan modern. Judul menggunakan Fraunces (serif berlekuk hangat), sedangkan isi teks menggunakan Inter (sans-serif bersih).'
      },
      imageryDirection: {
        en: 'Natural daylight, documentary angles, authentic cafe textures, and unposed moments.',
        id: 'Cahaya alami, sudut pandang dokumenter, tekstur kafe autentik, dan momen natural.'
      },
      layoutNotes: {
        en: 'Generous whitespace, structured grid, intentional focal points.',
        id: 'Ruang kosong yang lapang, grid terstruktur, dan titik fokus yang jelas.'
      },
      layoutComposition: {
        gridSystems: [
          {
            id: 'grid-1',
            name: { en: '12-Column Desktop Grid', id: 'Grid Desktop 12-Kolom' },
            type: 'column',
            columns: 12,
            gutterPx: 24,
            marginPx: 64,
            contextChannel: 'Website & Digital Layouts',
            description: { en: 'Primary layout grid for marketing pages and digital editorial content.', id: 'Grid tata letak utama untuk halaman pemasaran dan editorial digital.' }
          },
          {
            id: 'grid-2',
            name: { en: '4-Column Mobile Grid', id: 'Grid Seluler 4-Kolom' },
            type: 'column',
            columns: 4,
            gutterPx: 16,
            marginPx: 20,
            contextChannel: 'Mobile Web & Apps',
            description: { en: 'Compact grid with generous tap targets.', id: 'Grid ringkas dengan area sentuh yang nyaman.' }
          }
        ],
        layoutPrinciples: [
          {
            id: 'lp-1',
            title: { en: 'Intentional Whitespace & Asymmetry', id: 'Ruang Kosong Berniat & Asimetri' },
            category: 'composition',
            description: { en: 'Allow ample breathing room around heroes and imagery to evoke cafe tranquility.', id: 'Berikan ruang bernapas yang cukup di sekitar judul dan gambar untuk menghadirkan ketenangan kafe.' },
            guidance: { en: 'Never crowd text against photo borders; maintain at least 48px margin.', id: 'Jangan rapatkan teks dengan tepi foto; pertahankan margin minimal 48px.' }
          }
        ],
        spacingScale: {
          baseUnitPx: 8,
          scaleSteps: [4, 8, 16, 24, 32, 48, 64],
          description: { en: 'Standard 8px geometric spacing scale.', id: 'Skala spasi geometris 8px standar.' }
        }
      },
      imagery: {
        directions: [
          {
            id: 'img-dir-1',
            name: { en: 'Documentary Morning Rituals', id: 'Dokumenter Ritual Pagi' },
            category: 'photography',
            description: { en: 'Unposed, authentic captures of morning coffee preparation, warm steam, and natural daylight.', id: 'Foto natural tanpa pose dari pembuatan kopi pagi, uap hangat, dan cahaya alami.' },
            mood: ['Warm', 'Natural', 'Calm', 'Human'],
            subjects: ['People', 'Environment', 'Craft', 'Ritual'],
            lighting: ['Natural Daylight', 'Soft Ambient'],
            composition: ['Documentary', 'Spacious'],
            doGuidance: { en: 'Shoot in authentic cafe lighting with soft depth of field.', id: 'Potret dalam cahaya kafe alami dengan kedalaman fokus yang lembut.' },
            dontGuidance: { en: 'Avoid harsh studio flash or overly staged artificial smiles.', id: 'Hindari lampu kilat studio yang keras atau pose senyum buatan.' }
          }
        ],
        treatments: [
          {
            id: 'img-trm-1',
            name: { en: 'Warm Daylight Tone', id: 'Nuansa Cahaya Hangat' },
            description: { en: 'Slightly lifted shadows with organic warm undertones.', id: 'Bayangan yang sedikit dinaikkan dengan rona hangat organik.' },
            colorTreatment: ['Natural', 'Warm Film', 'Earthy']
          }
        ]
      },
      graphicLanguage: {
        elements: [
          {
            id: 'ge-1',
            name: { en: 'Topographic Contour Lines', id: 'Garis Kontur Topografi' },
            category: 'pattern',
            description: { en: 'Subtle wave contour lines reflecting coffee origin terrain elevations.', id: 'Garis kontur gelombang halus yang mencerminkan ketinggian daerah asal kopi.' },
            characteristics: ['Organic', 'Minimal', 'Textured'],
            usageNotes: { en: 'Use as faint 10% opacity watermarks on coffee packaging bags and retail menus.', id: 'Gunakan sebagai watermark 10% pada kemasan kantong kopi dan buku menu.' }
          }
        ],
        illustrationStyles: [
          {
            id: 'illus-1',
            name: { en: 'Botanical Monoline Line Art', id: 'Seni Garis Monoline Botani' },
            style: ['Hand-drawn', 'Minimal', 'Monoline'],
            subjects: ['Botanical', 'Cafe Life'],
            description: { en: 'Delicate coffee branch and leaf sketches drawn with consistent 1.5px ink lines.', id: 'Sketsa cabang dan daun kopi yang digambar dengan garis tinta konsisten 1.5px.' }
          }
        ],
        iconSystems: [
          {
            id: 'icon-sys-1',
            name: { en: '24px Rounded Coffee UI Icons', id: 'Ikon UI Kopi Membulat 24px' },
            style: ['Outline', 'Rounded', 'Monoline'],
            gridSizePx: 24,
            strokeWidthPx: 2,
            cornerTreatment: 'rounded',
            description: { en: 'Custom beverage, roast level, and brewing method icons for digital menus and signage.', id: 'Ikon minuman, tingkat sangrai, dan metode seduh untuk menu digital dan papan petunjuk.' }
          }
        ]
      }
    },
    visualAssets: [
      {
        id: 'asset-wordmark-vector',
        name: 'Northstar Wordmark Vector Package',
        category: 'logos',
        notes: {
          en: 'Master vector SVG/EPS files for cafe signage and high-resolution packaging.',
          id: 'File master vektor SVG/EPS untuk plang nama kafe dan kemasan resolusi tinggi.'
        },
        files: [
          {
            id: 'file-wm-svg',
            filename: 'northstar-wordmark-master.svg',
            format: 'svg',
            sizeBytes: 24500,
            uploadedAt: '2026-08-18T10:00:00.000Z'
          },
          {
            id: 'file-wm-png',
            filename: 'northstar-wordmark-4k.png',
            format: 'png',
            sizeBytes: 182000,
            uploadedAt: '2026-08-18T10:00:00.000Z'
          }
        ],
        references: [
          {
            moduleId: 'logoSystem',
            entityName: 'Northstar Primary Wordmark'
          }
        ],
        updatedAt: '2026-08-18T10:00:00.000Z'
      },
      {
        id: 'asset-fraunces-family',
        name: 'Fraunces Variable Font Family',
        category: 'fonts',
        notes: {
          en: 'Open source serif display typeface by Undercase Type for all primary headings.',
          id: 'Font serif display open source dari Undercase Type untuk seluruh judul utama.'
        },
        files: [
          {
            id: 'file-ff-woff2',
            filename: 'Fraunces-VariableFont.woff2',
            format: 'woff2',
            sizeBytes: 112000,
            uploadedAt: '2026-08-18T10:00:00.000Z'
          }
        ],
        references: [
          {
            moduleId: 'typographySystem',
            entityName: 'Fraunces'
          }
        ],
        updatedAt: '2026-08-18T10:00:00.000Z'
      },
      {
        id: 'asset-icons-ui-pack',
        name: 'Coffee UI Icon SVG Set (24px)',
        category: 'icons',
        notes: {
          en: 'Full 24-item SVG iconography collection for brewing guides and digital checkout.',
          id: 'Koleksi lengkap 24 item ikon SVG untuk panduan seduh dan checkout digital.'
        },
        files: [
          {
            id: 'file-icons-zip',
            filename: 'northstar-icons-24px.zip',
            format: 'zip',
            sizeBytes: 45200,
            uploadedAt: '2026-08-18T10:00:00.000Z'
          }
        ],
        references: [
          {
            moduleId: 'graphicLanguage',
            entityName: '24px Rounded Coffee UI Icons'
          }
        ],
        updatedAt: '2026-08-18T10:00:00.000Z'
      }
    ],
    visualRules: [
      {
        id: 'rule-logo-clearspace',
        name: 'Primary Logo Minimum Clearspace',
        type: 'requirement',
        context: 'logo',
        guidance: {
          en: 'Always maintain a minimum isolation zone around the wordmark equal to the height of the North Star emblem (X). Never encroach with body copy or edge trim.',
          id: 'Selalu pertahankan zona isolasi minimum di sekeliling wordmark setara dengan tinggi simbol Bintang Northstar (X). Jangan biarkan teks atau tepi memotong area ini.'
        },
        tags: ['logo', 'clearspace', 'layout'],
        references: [
          {
            domain: 'visualKnowledge',
            entityType: 'rule',
            entityId: 'logo-primary',
            label: 'Northstar Primary Wordmark'
          }
        ],
        updatedAt: '2026-08-18T10:00:00.000Z'
      },
      {
        id: 'rule-color-contrast',
        name: 'Warm Parchment Background Contrast',
        type: 'restriction',
        context: 'color',
        guidance: {
          en: 'Never place Amber Glow (#d97706) text over Warm Parchment (#f7f4ef) as it fails WCAG AA legibility. Use Espresso Earth (#2d241e) for all parchment-backed text.',
          id: 'Jangan pernah menempatkan teks Amber Glow (#d97706) di atas latar Warm Parchment (#f7f4ef) karena tidak memenuhi standar kontras WCAG AA. Gunakan Espresso Earth (#2d241e).'
        },
        tags: ['color', 'accessibility', 'contrast'],
        references: [
          {
            domain: 'visualKnowledge',
            entityType: 'rule',
            entityId: 'c-2',
            label: 'Warm Parchment'
          },
          {
            domain: 'visualKnowledge',
            entityType: 'rule',
            entityId: 'c-3',
            label: 'Amber Glow'
          }
        ],
        updatedAt: '2026-08-18T10:00:00.000Z'
      },
      {
        id: 'rule-photo-authenticity',
        name: 'Authentic Morning Lighting Requirement',
        type: 'requirement',
        context: 'imagery',
        guidance: {
          en: 'All cafe and customer photography must feature natural daylight and unposed moments adhering to the Documentary Morning Rituals style.',
          id: 'Semua foto kafe dan pelanggan wajib menggunakan cahaya alami dan pose natural sesuai gaya Dokumenter Ritual Pagi.'
        },
        tags: ['photography', 'lighting', 'art-direction'],
        references: [
          {
            domain: 'visualKnowledge',
            entityType: 'imageryDirection',
            entityId: 'img-dir-1',
            label: 'Documentary Morning Rituals'
          }
        ],
        updatedAt: '2026-08-18T10:00:00.000Z'
      }
    ],
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
    },
    brandNaming: {
      principlesOverview: {
        en: 'Northstar names products using grounded celestial and navigational metaphors paired with honest, unpretentious flavor descriptors. Names avoid hyperbole, luxury claims, or technical jargon.',
        id: 'Northstar menamai produk menggunakan metafora langit dan navigasi yang membumi, dipadukan dengan deskriptor rasa yang jujur dan bersahaja. Nama menghindari klaim kemewahan yang berlebihan atau jargon teknis.'
      },
      systems: [
        {
          id: 'name-sys-1',
          title: {
            en: 'Seasonal Blend & Harvest Nomenclature',
            id: 'Nomenklatur Racikan Musiman & Hasil Panen'
          },
          tier: 'productTier',
          approach: 'metaphorical',
          formula: [
            {
              role: 'brandPrefix',
              label: { en: 'Northstar', id: 'Northstar' },
              required: true
            },
            {
              role: 'descriptor',
              label: { en: 'Celestial / Astronomical Event', id: 'Peristiwa Astronomi / Langit' },
              required: true
            },
            {
              role: 'tierSuffix',
              label: { en: 'Blend / Roast', id: 'Blend / Roast' },
              required: true
            }
          ],
          principles: {
            en: 'Blends use evocative navigational terms that evoke time of day and warmth without sounding aristocratic.',
            id: 'Racikan menggunakan istilah navigasi evokatif yang menggambarkan waktu dan kehangatan tanpa terdengar elitis.'
          },
          examples: {
            approved: [
              'Northstar Solstice Roast',
              'Northstar Equinox Blend',
              'Northstar Daybreak Espresso'
            ],
            prohibited: [
              'Northstar Imperial Gold Blend',
              'Northstar Royal Supreme Coffee',
              'Northstar Hyper-Caffeine Ultra'
            ],
            rationale: {
              en: 'Avoid hierarchical, aristocratic words (Royal, Imperial, Gold) which directly violate the Unpretentious brand trait.',
              id: 'Hindari kata-kata bernada elitis atau bangsawan (Royal, Imperial, Gold) yang melanggar sifat merek Bersahaja.'
            }
          },
          governingRuleRefs: [
            {
              domain: 'visualRules',
              entityType: 'rule',
              entityId: 'vr-2',
              label: 'Warm Parchment Background Contrast'
            }
          ],
          targetAudienceRefs: [
            {
              domain: 'foundation',
              entityType: 'targetAudience',
              entityId: 'aud-1',
              label: 'Urban Professionals & Creative Freelancers'
            }
          ],
          supportingMessageRefs: [
            {
              domain: 'foundation',
              entityType: 'keyMessage',
              entityId: 'km-1',
              label: 'Coffee that grounds your day, not rushes it.'
            }
          ]
        },
        {
          id: 'name-sys-2',
          title: {
            en: 'Single-Origin Direct-Trade Farm Lots',
            id: 'Lot Biji Kopi Single-Origin Perdagangan Langsung'
          },
          tier: 'productTier',
          approach: 'descriptive',
          formula: [
            {
              role: 'descriptor',
              label: { en: 'Country / Origin Region', id: 'Negara / Daerah Asal' },
              required: true
            },
            {
              role: 'modifier',
              label: { en: 'Producer / Estate Name', id: 'Nama Produser / Kebun' },
              required: true
            },
            {
              role: 'tierSuffix',
              label: { en: 'Process Type (Washed / Natural)', id: 'Metode Proses (Washed / Natural)' },
              required: false
            }
          ],
          principles: {
            en: 'Single origin lots must prioritize farm and producer visibility over branded marketing abstractions.',
            id: 'Lot single origin wajib mengutamakan visibilitas petani dan perkebunan daripada nama pemasaran buatan.'
          },
          examples: {
            approved: [
              'Colombia Los Vasquez Washed',
              'Ethiopia Guji Hambela Natural',
              'Sumatra Kerinci Anaerobic'
            ],
            prohibited: [
              'Northstar Mystic Jungle Reserve',
              'Northstar Secret Andean Mountain Blend'
            ],
            rationale: {
              en: 'Never hide origin producer names behind fantasy brand names. Transparency is our core proof point.',
              id: 'Jangan pernah menyembunyikan nama petani di balik nama fantasi merek. Transparansi adalah bukti nyata utama kami.'
            }
          },
          targetAudienceRefs: [
            {
              domain: 'foundation',
              entityType: 'targetAudience',
              entityId: 'aud-2',
              label: 'Specialty Coffee Purists & Sourcing Advocates'
            }
          ],
          supportingMessageRefs: [
            {
              domain: 'foundation',
              entityType: 'proofPoint',
              entityId: 'pp-1',
              label: '100% direct-trade sourcing with transparent farm prices printed on every bag'
            }
          ]
        }
      ]
    },
    brandExpression: {
      overview: {
        en: 'Northstar Coffee manifests through tactile, unpretentious physical artifacts and calm, breathing digital interfaces. Every physical touchpoint is built with sustainable materials, muted natural tones, and precise typographic hierarchy.',
        id: 'Northstar Coffee diwujudkan melalui artefak fisik yang alami dan antarmuka digital yang tenang. Setiap titik sentuh fisik dibuat dengan material ramah lingkungan, nada warna alami, dan hierarki tipografi yang presisi.'
      },
      touchpoints: [
        {
          id: 'tp-1',
          name: {
            en: 'Roastery Whole Bean 12oz Pouch',
            id: 'Kantong Biji Kopi Roastery 12oz'
          },
          category: 'packaging',
          channelContext: 'Retail & Online Store Packaging',
          description: {
            en: 'Primary retail packaging for single origin and blend coffee beans. Uses unbleached matte kraft paper with an inner biodegradable degas valve.',
            id: 'Kemasan ritel utama untuk biji kopi single origin dan blend. Menggunakan kertas kraft matte alami dengan katup degas terurai hayati.'
          },
          specifications: {
            dimensions: '130 × 200 × 70 mm (12oz / 340g)',
            colorSpace: 'CMYK',
            materialsFinish: {
              en: 'Unbleached 120gsm Kraft with matte water-based flood coat and spot UV roast badge',
              id: 'Kraft 120gsm alami dengan lapisan matte berbasis air dan spot UV pada lencana sangrai'
            },
            safeZonePadding: '8mm inner margin, 3mm bleed',
            productionNotes: {
              en: 'Ensure direct-trade transparency pricing table aligns with the 4-column subgrid on the back panel.',
              id: 'Pastikan tabel harga transparansi perdagangan langsung sejajar dengan subgrid 4-kolom di panel belakang.'
            }
          },
          guidelines: {
            doCopy: {
              en: 'Maintain generous parchment whitespace around the Northstar Wordmark on the front header.',
              id: 'Pertahankan ruang kosong parchment yang lapang di sekitar Wordmark Northstar pada bagian atas depan.'
            },
            dontCopy: {
              en: 'Do not print multi-color photographic graphics across the kraft paper grain.',
              id: 'Jangan mencetak grafis fotografi penuh warna di atas serat kertas kraft.'
            }
          },
          appliedAssetRefs: [
            {
              domain: 'visualAssets',
              entityType: 'asset',
              entityId: 'asset-1',
              label: 'Northstar Wordmark Vector Package'
            }
          ],
          appliedRuleRefs: [
            {
              domain: 'visualRules',
              entityType: 'rule',
              entityId: 'vr-1',
              label: 'Primary Logo Minimum Clearspace'
            },
            {
              domain: 'visualRules',
              entityType: 'rule',
              entityId: 'vr-2',
              label: 'Warm Parchment Background Contrast'
            }
          ],
          governingEntityRefs: [
            {
              domain: 'visualKnowledge',
              entityType: 'logo',
              entityId: 'logo-1',
              label: 'Northstar Primary Wordmark'
            },
            {
              domain: 'visualKnowledge',
              entityType: 'color',
              entityId: 'col-1',
              label: 'Espresso Earth'
            },
            {
              domain: 'visualKnowledge',
              entityType: 'color',
              entityId: 'col-2',
              label: 'Warm Parchment'
            }
          ]
        },
        {
          id: 'tp-2',
          name: {
            en: 'Specialty Cafe Takeaway Hot Cup',
            id: 'Gelas Kopi Panas Bawa Pulang'
          },
          category: 'packaging',
          channelContext: 'In-Store Beverage Takeaway',
          description: {
            en: 'Double-wall compostable hot paper cup featuring the centered compass star emblem on Oat Cream background.',
            id: 'Gelas kertas panas berdinding ganda yang dapat dikomposkan dengan simbol bintang kompas di tengah di atas latar Oat Cream.'
          },
          specifications: {
            dimensions: '8oz (240ml) & 12oz (355ml) Standard Cup',
            colorSpace: 'CMYK',
            materialsFinish: {
              en: 'FSC-certified double-wall paperboard with plant-based PLA lining',
              id: 'Karton bersertifikat FSC berdinding ganda dengan lapisan PLA nabati'
            },
            safeZonePadding: '12mm from top rim, 15mm from bottom seam',
            productionNotes: {
              en: 'Emblem mark printed centered at 36mm width with soy-based Espresso Earth ink.',
              id: 'Simbol dicetak di tengah dengan lebar 36mm menggunakan tinta kedelai Espresso Earth.'
            }
          },
          guidelines: {
            doCopy: {
              en: 'Keep all warning text in Inter Regular 7pt aligned along the lower curved baseline.',
              id: 'Gunakan font Inter Regular 7pt untuk teks peringatan yang sejajar dengan lengkungan bawah.'
            },
            dontCopy: {
              en: 'Do not add full-bleed ink coverage near the drinking rim.',
              id: 'Jangan tambahkan cetakan tinta penuh di dekat area bibir gelas.'
            }
          },
          appliedAssetRefs: [
            {
              domain: 'visualAssets',
              entityType: 'asset',
              entityId: 'asset-1',
              label: 'Northstar Wordmark Vector Package'
            }
          ],
          governingEntityRefs: [
            {
              domain: 'visualKnowledge',
              entityType: 'logo',
              entityId: 'logo-2',
              label: 'Northstar Compass Star Emblem'
            },
            {
              domain: 'visualKnowledge',
              entityType: 'color',
              entityId: 'col-5',
              label: 'Oat Cream'
            }
          ]
        },
        {
          id: 'tp-3',
          name: {
            en: 'Barista Service Apron Uniform',
            id: 'Seragam Celemek Barista'
          },
          category: 'apparel',
          channelContext: 'In-Store Retail & Hospitality',
          description: {
            en: 'Heavyweight organic cotton duck canvas barista apron with adjustable vegetable-tanned leather neck strap.',
            id: 'Celemek barista bahan kanvas katun organik tebal dengan tali leher kulit nabati yang dapat disesuaikan.'
          },
          specifications: {
            dimensions: '750 × 850 mm (One Size Fits All)',
            colorSpace: 'PMS',
            materialsFinish: {
              en: '14oz Espresso-dyed duck canvas with antique brass rivets and single-color amber embroidery',
              id: 'Kanvas katun 14oz warna espresso dengan paku keling kuningan antik dan bordir amber 1-warna'
            },
            safeZonePadding: 'Center chest pocket area: 80 × 80 mm max logo zone',
            productionNotes: {
              en: 'Northstar star emblem embroidered with Amber Glow thread (Pantone 1375 C equivalent).',
              id: 'Simbol bintang dibordir dengan benang Amber Glow (setara Pantone 1375 C).'
            }
          },
          guidelines: {
            doCopy: {
              en: 'Ensure leather straps are conditioned before cafe launch.',
              id: 'Pastikan tali kulit dirawat sebelum pembukaan kafe.'
            },
            dontCopy: {
              en: 'Never screenprint over canvas seams.',
              id: 'Jangan pernah menyablon di atas jahitan kanvas.'
            }
          },
          governingEntityRefs: [
            {
              domain: 'visualKnowledge',
              entityType: 'logo',
              entityId: 'logo-2',
              label: 'Northstar Compass Star Emblem'
            },
            {
              domain: 'visualKnowledge',
              entityType: 'color',
              entityId: 'col-3',
              label: 'Amber Glow'
            }
          ]
        },
        {
          id: 'tp-4',
          name: {
            en: 'Morning Ritual Instagram Story Grid',
            id: 'Templat Cerita Instagram Ritual Pagi'
          },
          category: 'socialMedia',
          channelContext: 'Digital Social Content',
          description: {
            en: 'Calm, documentary-style social storytelling template featuring morning light photography and Fraunces editorial quotes.',
            id: 'Templat cerita media sosial bergaya dokumenter yang menampilkan fotografi cahaya pagi dan kutipan editorial Fraunces.'
          },
          specifications: {
            dimensions: '1080 × 1920 px',
            aspectRatio: '9:16',
            colorSpace: 'RGB',
            safeZonePadding: '250px top header safe zone, 300px bottom interaction zone',
            productionNotes: {
              en: 'Export as sRGB 85% JPEG or H.264 MP4 at 30fps.',
              id: 'Ekspor sebagai JPEG sRGB 85% atau MP4 H.264 pada 30fps.'
            }
          },
          guidelines: {
            doCopy: {
              en: 'Use documentary morning natural lighting and maximum 2 lines of Fraunces serif text.',
              id: 'Gunakan pencahayaan alami pagi dokumenter dan maksimal 2 baris teks serif Fraunces.'
            },
            dontCopy: {
              en: 'Do not use animated flashing stickers or high-saturation neon colors.',
              id: 'Jangan gunakan stiker animasi mencolok atau warna neon saturasi tinggi.'
            }
          },
          appliedRuleRefs: [
            {
              domain: 'visualRules',
              entityType: 'rule',
              entityId: 'vr-3',
              label: 'Authentic Morning Lighting Requirement'
            }
          ],
          governingEntityRefs: [
            {
              domain: 'visualKnowledge',
              entityType: 'font',
              entityId: 'font-1',
              label: 'Fraunces'
            },
            {
              domain: 'visualKnowledge',
              entityType: 'imageryDirection',
              entityId: 'img-dir-1',
              label: 'Documentary Morning Rituals'
            }
          ]
        }
      ]
    }
  }
};
