/**
 * Phase 4.1C — Static Guidance Content Repository
 * 
 * Contains bilingual, pedagogical guidance across all 6 stages and 12 modules.
 * Spec authoritative source: PHASE_4_1B_GUIDANCE_CURRICULUM.md
 * 
 * Zero storage of user brand data. Pure static pedagogical knowledge.
 */

import { GuidanceStage, GuidanceStageId } from '../types/guidance';
import { ModuleId } from '../types/brand';

export const GUIDANCE_STAGES: GuidanceStage[] = [
  // =========================================================================
  // STAGE 1: DISCOVER & DEFINE
  // =========================================================================
  {
    id: 'stage1_discover',
    stageNumber: 1,
    title: {
      en: 'Discover & Define',
      id: 'Eksplorasi & Definisi'
    },
    tagline: {
      en: 'Clarify the Core Purpose',
      id: 'Perjelas Esensi Inti Merek'
    },
    learningObjective: {
      en: 'Anchor the brand in its fundamental commercial purpose, market category, and operational values before exploring aesthetics.',
      id: 'Menjangkarkan merek pada tujuan komersial mendasar, kategori pasar, dan nilai operasional sebelum masuk ke eksplorasi estetika.'
    },
    designerMentalModel: {
      en: 'A brand is not a logo; it is the reputation and promise of an organization. Before sketching, understand why this organization exists and what non-negotiable operational values guide its actions.',
      id: 'Merek bukan sekadar logo; merek adalah reputasi dan janji suatu organisasi. Sebelum mulai mendesain, pahami alasan organisasi ini ada dan prinsip operasional apa yang memandu tindakannya.'
    },
    primaryModuleIds: ['overview', 'strategy'],
    topics: [
      {
        id: 'topic_brand_essence',
        moduleId: 'overview',
        fieldKey: 'oneLineDescription',
        tier: 'beginner',
        title: {
          en: 'One-Line Brand Essence',
          id: 'Esensi Inti Merek'
        },
        shortDescription: {
          en: 'A concise summary of what this brand actually does and offers.',
          id: 'Ringkasan padat tentang apa fungsi dan penawaran nyata merek ini.'
        },
        conceptTaught: {
          en: 'Distinguishing core business essence from temporary marketing advertising taglines.',
          id: 'Membedakan esensi bisnis mendasar dari slogan iklan pemasaran yang bersifat sementara.'
        },
        blocks: [
          {
            type: 'whyThisMatters',
            content: {
              en: 'Your one-line essence becomes the anchor for all communication. If the founder cannot state what they do in one sentence, visual identity exploration will lack direction.',
              id: 'Esensi satu kalimat menjadi jangkar seluruh komunikasi. Jika pendiri tidak bisa menjelaskan apa yang mereka lakukan dalam satu kalimat, arah visual akan kehilangan fokus.'
            }
          },
          {
            type: 'askYourClient',
            question: {
              en: 'How would you explain what your company does to a stranger at an airport in 10 seconds?',
              id: 'Bagaimana Anda menjelaskan apa yang perusahaan Anda lakukan kepada orang asing di bandara dalam 10 detik?'
            },
            whatToLookFor: {
              en: 'Look for clear functional verbs and tangible offerings. Avoid grand marketing cliches.',
              id: 'Cari kata kerja fungsional yang jelas dan penawaran nyata. Hindari klise pemasaran yang muluk-muluk.'
            },
            followUpPrompt: {
              en: 'What do your customers actually hand you money for?',
              id: 'Apa hal nyata yang membuat pelanggan rela membayar Anda?'
            }
          },
          {
            type: 'weakExample',
            example: {
              en: 'We make the best coffee on earth for awesome people.',
              id: 'Kami membuat kopi terbaik di dunia untuk orang-orang hebat.'
            },
            critique: {
              en: 'Vague marketing slogan with zero substance. Does not tell us whether this is a cafe, a B2B bean supplier, or an instant coffee product.',
              id: 'Slogan pemasaran klise tanpa substansi. Tidak menjelaskan apakah ini kedai kopi, pemasok biji kopi B2B, atau produk kopi instan.'
            }
          },
          {
            type: 'strongExample',
            example: {
              en: 'A neighborhood specialty coffee roaster dedicated to slow morning rituals and direct-trade farm sourcing.',
              id: 'Penyangrai kopi spesialti lokal yang berdedikasi pada ritual pagi yang tenang dan pengadaan biji kopi langsung dari petani.'
            },
            rationale: {
              en: 'Clearly defines the category (specialty coffee roaster), the offering (direct-trade beans), and the experiential context (slow morning rituals).',
              id: 'Secara jelas mendefinisikan kategori (penyangrai kopi spesialti), penawaran (biji kopi langsung dari petani), dan konteks pengalaman (ritual pagi yang tenang).'
            }
          },
          {
            type: 'watchOut',
            mistake: {
              en: 'Writing an advertising campaign slogan instead of a functional business description.',
              id: 'Menulis slogan kampanye iklan alih-alih deskripsi fungsional bisnis.'
            },
            whyItMatters: {
              en: 'Advertising slogans change with seasonal campaigns; brand essence remains stable for years.',
              id: 'Slogan iklan berganti mengikuti kampanye musiman; esensi merek bertahan stabil selama bertahun-tahun.'
            },
            remedy: {
              en: 'Focus on what the business actually sells, who it serves, and how it delivers value.',
              id: 'Fokus pada apa yang benar-benar dijual, siapa yang dilayani, dan bagaimana nilai tersebut diberikan.'
            }
          },
          {
            type: 'connectsTo',
            targetStageId: 'stage2_position',
            targetModuleId: 'positioning',
            explanation: {
              en: 'The category defined here directly frames which competitors and customer alternatives you evaluate in Stage 2.',
              id: 'Kategori yang didefinisikan di sini langsung menentukan kompetitor dan alternatif pelanggan yang Anda evaluasi di Tahap 2.'
            }
          }
        ],
        diagnostics: [
          {
            id: 'diag_essence_buzzwords',
            severity: 'warning',
            title: {
              en: 'Avoid Marketing Slogans in Essence',
              id: 'Hindari Slogan Pemasaran dalam Esensi'
            },
            message: {
              en: 'Ensure your one-line description states what the brand functionally does rather than using superlative claims like "the best" or "world-class".',
              id: 'Pastikan deskripsi satu kalimat menjelaskan fungsi nyata merek, bukan klaim superlatif seperti "terbaik" atau "kelas dunia".'
            }
          }
        ]
      },
      {
        id: 'topic_operational_values',
        moduleId: 'strategy',
        fieldKey: 'values',
        tier: 'intermediate',
        title: {
          en: 'Operational Strategic Values',
          id: 'Nilai Strategis Operasional'
        },
        shortDescription: {
          en: 'Non-negotiable behavioral principles that guide how the organization makes trade-offs.',
          id: 'Prinsip perilaku mutlak yang memandu bagaimana organisasi mengambil keputusan dan kompromi.'
        },
        conceptTaught: {
          en: 'Values as actionable decision-making guardrails rather than generic decorative posters.',
          id: 'Nilai sebagai pagar pembatas pengambilan keputusan nyata, bukan sekadar pajangan dinding kantor.'
        },
        blocks: [
          {
            type: 'whyThisMatters',
            content: {
              en: 'True brand values dictate what an organization is willing to sacrifice. They guide personality traits in Stage 3 and material choices in Stage 6.',
              id: 'Nilai merek sejati menentukan apa yang rela dikorbankan oleh organisasi. Nilai memandu karakter di Tahap 3 dan pemilihan material di Tahap 6.'
            }
          },
          {
            type: 'thinkAboutThis',
            prompt: {
              en: 'If a value does not cost the company money or force them to say NO to certain profitable opportunities, it is just a platitude, not a strategic value.',
              id: 'Jika suatu nilai tidak membuat perusahaan rela mengeluarkan biaya atau menolak peluang yang menguntungkan demi prinsip, itu hanya klise, bukan nilai strategis.'
            }
          },
          {
            type: 'weakExample',
            example: {
              en: 'Integrity: We are always honest and do the right thing.',
              id: 'Integritas: Kami selalu jujur dan melakukan hal yang benar.'
            },
            critique: {
              en: 'Table-stakes hygiene factor. No company claims to lack integrity. It gives zero distinctive design or operational direction.',
              id: 'Standar etika dasar umum. Tidak ada perusahaan yang mengaku tidak jujur. Ini tidak memberi diferensiasi desain maupun operasional.'
            }
          },
          {
            type: 'strongExample',
            example: {
              en: 'Radical Sourcing Transparency: We publish the exact purchase contracts and farm-gate prices paid to growers directly on our packaging.',
              id: 'Transparansi Pengadaan Radikal: Kami mempublikasikan bukti nota pembelian dan harga riil yang diterima petani langsung pada kemasan produk.'
            },
            rationale: {
              en: 'Highly specific, operational, and immediately dictates tactile packaging design (e.g. receipt layouts, stamp details).',
              id: 'Sangat spesifik, operasional, dan langsung mengarahkan desain kemasan (misal: layout struk transparan, detail stempel).'
            }
          },
          {
            type: 'connectsTo',
            targetStageId: 'stage3_character',
            targetModuleId: 'personality',
            explanation: {
              en: 'Operational values directly inspire your We Are / We Are Not behavioral pairs in Stage 3.',
              id: 'Nilai operasional langsung menginspirasi batas karakter (We Are / We Are Not) di Tahap 3.'
            }
          }
        ]
      }
    ]
  },

  // =========================================================================
  // STAGE 2: POSITION & AUDIENCE
  // =========================================================================
  {
    id: 'stage2_position',
    stageNumber: 2,
    title: {
      en: 'Position & Audience',
      id: 'Posisi & Audiens'
    },
    tagline: {
      en: 'Find the Strategic Stance',
      id: 'Tentukan Sikap Strategis di Pasar'
    },
    learningObjective: {
      en: 'Identify target audience mindsets and pain points, analyze real competitive alternatives, and formulate defensible differentiators that justify visual distinctiveness.',
      id: 'Identifikasi pola pikir dan keresahan audiens, analisis alternatif kompetitor, dan rumuskan pembeda yang terbukti untuk menjustifikasi keunikan visual.'
    },
    designerMentalModel: {
      en: 'A brand cannot be for everyone. If I don’t know who the core believer is and what alternatives they compare us against, I will design a generic, middle-of-the-road identity. Positioning gives me permission to be visually distinct.',
      id: 'Merek tidak bisa untuk semua orang. Tanpa mengetahui siapa loyalis utama dan alternatif apa yang mereka bandingkan, desain akan berakhir biasa dan klise. Positioning memberi legitimasi untuk tampil beda.'
    },
    primaryModuleIds: ['positioning'],
    topics: [
      {
        id: 'topic_audience_mindset',
        moduleId: 'positioning',
        fieldKey: 'targetAudiences',
        tier: 'beginner',
        title: {
          en: 'Audience Mindset & Frustrations',
          id: 'Pola Pikir & Keresahan Audiens'
        },
        shortDescription: {
          en: 'Understanding the customer through their emotional needs and daily rituals rather than just demographic statistics.',
          id: 'Memahami pelanggan melalui kebutuhan emosional dan ritual keseharian, bukan sekadar data demografis kaku.'
        },
        conceptTaught: {
          en: 'Psychographics and pain points provide emotional insight for visual moodboards and copywriting.',
          id: 'Psikografi dan titik keresahan memberikan wawasan emosional untuk moodboard visual dan gaya bahasa.'
        },
        blocks: [
          {
            type: 'whyThisMatters',
            content: {
              en: 'Demographics (age, income) tell you who can afford the product, but psychographics (frustrations, anxieties, aspirations) tell you why they care and what aesthetic tone resonates with them.',
              id: 'Demografi (usia, penghasilan) hanya memberi tahu siapa yang mampu membeli, namun psikografi (keresahan, kecemasan, aspirasi) menjelaskan mengapa mereka peduli dan gaya estetika apa yang menyentuh mereka.'
            }
          },
          {
            type: 'askYourClient',
            question: {
              en: 'What is the biggest daily frustration your core customers experience before finding your product?',
              id: 'Apa keresahan harian terbesar yang dialami pelanggan sebelum menemukan produk Anda?'
            },
            whatToLookFor: {
              en: 'Listen for emotional stress points, unmet expectations with existing market leaders, and lifestyle habits.',
              id: 'Dengarkan tekanan emosional, kekecewaan terhadap merek yang ada di pasar, dan kebiasaan gaya hidup.'
            }
          },
          {
            type: 'weakExample',
            example: {
              en: 'Target: Men and women aged 20–45 who drink coffee.',
              id: 'Target: Pria dan wanita usia 20–45 tahun yang minum kopi.'
            },
            critique: {
              en: 'Too broad. Covers almost half the human population and gives zero guidance on visual style, photography mood, or color palette.',
              id: 'Terlalu luas. Mencakup hampir separuh populasi dan tidak memberikan arahan apa pun untuk gaya visual, nuansa foto, atau palet warna.'
            }
          },
          {
            type: 'strongExample',
            example: {
              en: 'Target: Remote Creatives & Knowledge Workers seeking calm, acoustic sanctuaries to escape sensory overload from crowded cafe chains.',
              id: 'Target: Pekerja Kreatif & Profesional WFH yang mencari tempat tenang bebas polusi suara untuk fokus kerja dan menghindari keramaian kedai kopi komersial.'
            },
            rationale: {
              en: 'Immediately suggests a design aesthetic: minimalist, muted earth tones, warm natural textures, and serene documentary photography.',
              id: 'Langsung menyiratkan arahan visual yang jelas: minimalis, palet warna bumi (earthy), tekstur alami hangat, dan fotografi dokumenter yang tenang.'
            }
          },
          {
            type: 'connectsTo',
            targetStageId: 'stage4_visual',
            targetModuleId: 'visualKnowledge',
            explanation: {
              en: 'The emotional mindset defined here dictates your imagery art direction and typography tone in Stage 4.',
              id: 'Kondisi emosional audiens di sini mengarahkan gaya fotografi dan nuansa tipografi di Tahap 4.'
            }
          }
        ]
      },
      {
        id: 'topic_defensible_differentiation',
        moduleId: 'positioning',
        fieldKey: 'differentiators',
        tier: 'intermediate',
        title: {
          en: 'Defensible Differentiation',
          id: 'Diferensiasi yang Terbukti'
        },
        shortDescription: {
          en: 'Uncovering the demonstrable, proof-backed reasons why customers choose this brand over alternatives.',
          id: 'Menemukan alasan kuat dan terbukti mengapa pelanggan memilih merek ini dibanding alternatif lain.'
        },
        conceptTaught: {
          en: 'A differentiator must be verifiable and defensible, not an unsubstantiated boast.',
          id: 'Pembeda harus dapat diverifikasi dan dibuktikan, bukan sekadar klaim sepihak tanpa bukti.'
        },
        blocks: [
          {
            type: 'whyThisMatters',
            content: {
              en: 'Without a clear differentiator, your client will ask you to copy competitor aesthetics. Differentiation gives the brand a legitimate reason to look, speak, and behave differently.',
              id: 'Tanpa pembeda yang jelas, klien akan cenderung meminta desainer meniru kompetitor. Diferensiasi memberi legitimasi kuat agar merek berani tampil beda.'
            }
          },
          {
            type: 'weakExample',
            example: {
              en: 'Differentiator: High Quality and Friendly Baristas.',
              id: 'Pembeda: Kualitas Tinggi dan Barista yang Ramah.'
            },
            critique: {
              en: 'Table-stakes expectation. Every competitor claims the same thing, making it completely non-differentiating.',
              id: 'Ekspektasi standar. Semua kompetitor mengklaim hal yang sama, sehingga kehilangan daya beda sama sekali.'
            }
          },
          {
            type: 'strongExample',
            example: {
              en: 'Differentiator: Acoustic Sanctuary Engineering (Cork dampening architecture guaranteed below 55dB during peak operational hours).',
              id: 'Pembeda: Rekayasa Akustik Tenang (Arsitektur peredam gabus alami dengan jaminan kebisingan di bawah 55dB pada jam sibuk).'
            },
            rationale: {
              en: 'Concrete, verifiable, and provides a compelling USP that sets the brand apart from busy commercial chains.',
              id: 'Konkret, dapat diuji kebenarannya, dan menjadi nilai jual unik yang membedakan kedai ini dari jaringan kedai kopi bising lainnya.'
            }
          }
        ]
      }
    ]
  },

  // =========================================================================
  // STAGE 3: SHAPE THE CHARACTER
  // =========================================================================
  {
    id: 'stage3_character',
    stageNumber: 3,
    title: {
      en: 'Shape the Character',
      id: 'Bentuk Karakter Merek'
    },
    tagline: {
      en: 'Give the Brand a Soul',
      id: 'Berikan Jiwa dan Karakter pada Merek'
    },
    learningObjective: {
      en: 'Translate strategic positioning into human character traits with strict behavioral boundaries (We Are / We Are Not), actionable voice principles, and proof-backed messaging.',
      id: 'Menerjemahkan positioning strategis menjadi sifat kepribadian manusia dengan batas perilaku tegas (We Are / We Are Not), prinsip gaya bahasa, dan pesan utama berbasis bukti.'
    },
    designerMentalModel: {
      en: 'If this brand walked into a room as a person, how would they act, speak, and carry themselves? Defining strict boundaries prevents the brand from becoming a caricature or lapsing into corporate monotone.',
      id: 'Jika merek ini berwujud manusia, bagaimana ia bersikap, berbicara, dan membawa diri? Menetapkan batas tegas mencegah karakter merek menjadi kaku atau berlebihan.'
    },
    primaryModuleIds: ['personality', 'voiceTone', 'messaging'],
    topics: [
      {
        id: 'topic_we_are_boundaries',
        moduleId: 'personality',
        fieldKey: 'weAreWeAreNot',
        tier: 'intermediate',
        title: {
          en: 'We Are / We Are Not Guardrails',
          id: 'Batas Karakter (We Are / We Are Not)'
        },
        shortDescription: {
          en: 'Establishing precise guardrails between authentic character traits and their negative excesses.',
          id: 'Menetapkan batas tegas antara karakter asli merek vs jebakan perilaku berlebihan yang harus dicegah.'
        },
        conceptTaught: {
          en: 'A trait without a boundary leads to identity drift; boundaries clarify creative direction.',
          id: 'Sifat tanpa batasan memicu inkonsistensi identitas; batasan memperjelas arah kreatif.'
        },
        blocks: [
          {
            type: 'whyThisMatters',
            content: {
              en: 'Brands are frequently ruined not by lack of personality, but by taking a good trait too far (e.g. playful becoming childish, or knowledgeable becoming elitist).',
              id: 'Merek sering kali rusak bukan karena kurang karakter, melainkan karena menerapkan suatu sifat secara berlebihan (misal: ceria menjadi kekanak-kanakan, atau berwawasan menjadi sombong).'
            }
          },
          {
            type: 'weakExample',
            example: {
              en: 'We Are: Professional | We Are Not: Unprofessional.',
              id: 'We Are: Profesional | We Are Not: Tidak Profesional.'
            },
            critique: {
              en: 'Useless tautology. Does not help a copywriter or designer understand nuanced tone boundaries.',
              id: 'Pernyataan klise yang tidak bernilai. Tidak membantu penulis maupun desainer memahami nuansa batasan karakter.'
            }
          },
          {
            type: 'strongExample',
            example: {
              en: 'We Are: Welcoming & Knowledgeable | We Are Not: Elitist or Pretentious Baristas | Rationale: We explain flavor notes with generosity, never condescension.',
              id: 'We Are: Ramah & Berwawasan | We Are Not: Elitis atau Menggurui | Rationale: Kami menjelaskan profil rasa kopi dengan antusias dan sabar, tanpa merendahkan pelanggan pemula.'
            },
            rationale: {
              en: 'Directly informs customer service scripts, packaging tasting notes, and social media replies.',
              id: 'Langsung mengarahkan pedoman percakapan staf, catatan rasa pada kemasan, dan gaya balas pesan di media sosial.'
            }
          },
          {
            type: 'connectsTo',
            targetStageId: 'stage4_visual',
            targetModuleId: 'visualKnowledge',
            explanation: {
              en: 'Your We Are / We Are Not boundaries guide font choices (e.g. elegant serif vs. hyper-formal legal blackletter).',
              id: 'Batasan We Are / We Are Not memandu pemilihan tipografi (misal: serif elegan yang hangat vs font blackletter yang terlalu kaku).'
            }
          }
        ]
      },
      {
        id: 'topic_voice_principles',
        moduleId: 'voiceTone',
        fieldKey: 'principles',
        tier: 'intermediate',
        title: {
          en: 'Actionable Voice Principles',
          id: 'Prinsip Gaya Bahasa Praktis'
        },
        shortDescription: {
          en: 'Rules and before/after writing examples that teach anyone how the brand writes and speaks.',
          id: 'Aturan dan contoh perbandingan teks yang melatih siapa pun menulis dengan nada khas merek.'
        },
        conceptTaught: {
          en: 'Voice principles must contain concrete Do and Don\'t writing guidelines.',
          id: 'Prinsip gaya bahasa harus memuat contoh penulisan Do (Boleh) dan Don\'t (Pantangan) yang konkret.'
        },
        blocks: [
          {
            type: 'whyThisMatters',
            content: {
              en: 'Graphic designers often think only about visuals, but the brand voice on packaging and web headlines carries half the emotional weight of the identity.',
              id: 'Desainer grafis sering kali hanya fokus pada visual, padahal gaya bahasa pada kemasan dan judul website memegang separuh bobot emosional merek.'
            }
          },
          {
            type: 'strongExample',
            example: {
              en: 'Title: Warm Brevity | Do: Use grounded sensory words in short sentences (<15 words). | Don\'t: Never use corporate marketing buzzwords like "synergistic artisanal paradigms".',
              id: 'Judul: Lugas & Hangat | Do: Gunakan kata-kata indrawi yang sederhana dalam kalimat ringkas (<15 kata). | Don\'t: Jangan gunakan istilah korporat rumit seperti "sinergi paradigma artisanal".'
            },
            rationale: {
              en: 'Provides unambiguous guardrails for anyone writing copy for the brand.',
              id: 'Memberikan panduan yang sangat jelas dan tidak ambigu bagi siapa pun yang menulis untuk merek.'
            }
          }
        ]
      }
    ]
  },

  // =========================================================================
  // STAGE 4: CRAFT THE VISUAL IDENTITY
  // =========================================================================
  {
    id: 'stage4_visual',
    stageNumber: 4,
    title: {
      en: 'Craft Visual Identity',
      id: 'Rancang Identitas Visual'
    },
    tagline: {
      en: 'Translate Meaning into Form',
      id: 'Terjemahkan Makna Menjadi Bentuk Visual'
    },
    learningObjective: {
      en: 'Systematically translate brand character into a structured visual toolkit (logo variants, semantic colors, typographic scales, imagery direction) and organize master asset packages.',
      id: 'Menerjemahkan karakter merek secara sistematis ke dalam perangkat visual terstruktur (varian logo, palet warna semantik, skala tipografi, arahan foto) dan paket aset master.'
    },
    designerMentalModel: {
      en: 'Visual identity is not just a pretty mark. It is an interconnected visual system where colors have strict functional roles, typography establishes immediate clarity, and assets are packaged for production.',
      id: 'Identitas visual bukan sekadar logo yang cantik. Ini adalah sistem terpadu di mana warna memiliki fungsi spesifik, tipografi membangun hierarki yang jelas, dan aset siap pakai untuk produksi.'
    },
    primaryModuleIds: ['visualKnowledge', 'visualAssets'],
    topics: [
      {
        id: 'topic_functional_logo_variants',
        moduleId: 'visualKnowledge',
        fieldKey: 'logoVariants',
        tier: 'beginner',
        title: {
          en: 'Functional Logo Variants',
          id: 'Varian Logo Fungsional'
        },
        shortDescription: {
          en: 'Defining responsive, production-ready logo variations for light backgrounds, dark surfaces, thermal printing, and small-scale icons.',
          id: 'Menetapkan variasi logo siap produksi untuk latar terang, latar gelap, cetak struk termal, hingga favicon kecil.'
        },
        conceptTaught: {
          en: 'A professional brand system requires purpose-built variants for diverse physical and digital constraints.',
          id: 'Sistem merek profesional membutuhkan varian khusus untuk menjawab berbagai keterbatasan media cetak dan digital.'
        },
        blocks: [
          {
            type: 'whyThisMatters',
            content: {
              en: 'If you only supply one full-color horizontal logo, vendors will inevitably distort it, invert colors incorrectly on dark backgrounds, or fail when printing on black-and-white thermal printers.',
              id: 'Jika Anda hanya menyediakan satu logo horizontal berwarna, pihak vendor/klien pasti akan salah membalikkan warna di latar gelap atau gagal saat dicetak pada struk kasir hitam-putih.'
            }
          },
          {
            type: 'watchOut',
            mistake: {
              en: 'Delivering a single complex logo mark without monochrome, reversed, or compact emblem lockups.',
              id: 'Hanya menyerahkan satu logo kompleks tanpa versi monokrom, reversed (putih), atau emblem ringkas.'
            },
            whyItMatters: {
              en: 'The brand will look broken on dark packaging, embroidery, metal stamping, and mobile favicons.',
              id: 'Merek akan tampak rusak saat diaplikasikan pada kemasan gelap, bordir pakaian, stempel emboss, maupun favicon website.'
            },
            remedy: {
              en: 'Always define at least 3 core variants: Primary Full Color, Reversed White, and Single-Color Monochrome.',
              id: 'Selalu siapkan minimal 3 varian inti: Warna Utama (Terang), Reversed (Putih), dan Monokrom 1-Warna.'
            }
          },
          {
            type: 'connectsTo',
            targetStageId: 'stage5_govern',
            targetModuleId: 'visualRules',
            explanation: {
              en: 'Each logo variant defined here will be assigned strict clearspace and minimum scale rules in Stage 5.',
              id: 'Setiap varian logo yang dibuat di sini akan diberi aturan batas ruang aman (clearspace) dan skala minimum di Tahap 5.'
            }
          }
        ]
      },
      {
        id: 'topic_semantic_color_roles',
        moduleId: 'visualKnowledge',
        fieldKey: 'primaryColors',
        tier: 'intermediate',
        title: {
          en: 'Semantic Color Roles (60/30/10)',
          id: 'Peran Semantik Warna (60/30/10)'
        },
        shortDescription: {
          en: 'Assigning strict UI and print distribution roles to colors instead of arbitrarily splashing swatches.',
          id: 'Menetapkan peran fungsional pada setiap warna (latar, teks, aksen) alih-alih sekadar menumpuk warna tanpa aturan.'
        },
        conceptTaught: {
          en: 'Color harmony relies on disciplined proportions: 60% Dominant Neutral, 30% Secondary Surface, 10% Accent CTA.',
          id: 'Keharmonisan warna bergantung pada proporsi disiplin: 60% Netral Dominan, 30% Permukaan Sekunder, 10% Aksen Aksi (CTA).'
        },
        blocks: [
          {
            type: 'whyThisMatters',
            content: {
              en: 'Design systems fail when developers or junior designers don’t know which color to use for body text versus button highlights. Semantic roles eliminate guesswork and ensure accessibility.',
              id: 'Sistem desain gagal ketika tim pelaksana bingung warna mana yang dipakai untuk teks vs tombol aksi. Penetapan peran semantik menghilangkan keraguan dan menjamin keterbacaan (kontras).'
            }
          },
          {
            type: 'strongExample',
            example: {
              en: 'Espresso Earth (#2D241E): Primary Dark Neutral for body copy and dark containers (Contrast 12.4:1 on Warm Parchment #F7F4EF).',
              id: 'Espresso Earth (#2D241E): Netral Gelap Utama untuk teks utama dan kartu gelap (Rasio Kontras 12.4:1 di atas Warm Parchment #F7F4EF).'
            },
            rationale: {
              en: 'Combines exact color values with explicit functional responsibility and accessibility verification.',
              id: 'Menggabungkan kode warna presisi dengan tanggung jawab fungsi dan verifikasi kontras keterbacaan.'
            }
          }
        ]
      }
    ]
  },

  // =========================================================================
  // STAGE 5: GOVERN & PROTECT
  // =========================================================================
  {
    id: 'stage5_govern',
    stageNumber: 5,
    title: {
      en: 'Govern & Protect',
      id: 'Proteksi & Tata Kelola'
    },
    tagline: {
      en: 'Turn Identity into a Usable System',
      id: 'Ubah Identitas Menjadi Sistem yang Terlindungi'
    },
    learningObjective: {
      en: 'Author prescriptive, actionable governance rules (with strict severity tiers) and systematic product/sub-brand naming formulas that prevent brand degradation.',
      id: 'Susun aturan tata kelola yang tegas dan preskriptif (dengan tingkat urgensi jelas) serta formula penamaan produk yang mencegah penurunan kualitas merek.'
    },
    designerMentalModel: {
      en: 'Guidelines without rules are just art galleries. I must author clear, non-negotiable guardrails that prevent future teams and external vendors from distorting the logo, breaking contrast, or inventing chaotic product names.',
      id: 'Panduan tanpa aturan tegas hanyalah galeri seni pajangan. Saya wajib menuliskan batasan mutlak agar vendor dan staf masa depan tidak mendistorsi logo, merusak kontras, atau membuat nama produk sembarangan.'
    },
    primaryModuleIds: ['visualRules', 'brandNaming'],
    topics: [
      {
        id: 'topic_prescriptive_rules',
        moduleId: 'visualRules',
        tier: 'intermediate',
        title: {
          en: 'Prescriptive Governance Rules',
          id: 'Aturan Tata Kelola Preskriptif'
        },
        shortDescription: {
          en: 'Writing enforceable MUST / NEVER constraints with explicit severity ratings and entity references.',
          id: 'Menuliskan batasan tegas (KEHARUSAN / PANTANGAN) dengan tingkat urgensi dan tautan entitas yang jelas.'
        },
        conceptTaught: {
          en: 'Prescriptive rules define strict operational boundaries, unlike descriptive style guides.',
          id: 'Aturan preskriptif menetapkan batasan operasional yang tegas, bukan sekadar memamerkan gambar.'
        },
        blocks: [
          {
            type: 'whyThisMatters',
            content: {
              en: 'Third-party vendors (print shops, sign makers, web developers) do not read 50 pages of brand philosophy. They need immediate, black-and-white rules on what is forbidden.',
              id: 'Vendor eksternal (percetakan, pembuat plang, programmer) tidak akan membaca 50 halaman filosofi merek. Mereka butuh aturan hitam-di-atas-putih yang sangat jelas tentang apa yang dilarang.'
            }
          },
          {
            type: 'weakExample',
            example: {
              en: 'Rule: Use the logo with care and maintain good taste.',
              id: 'Aturan: Gunakan logo dengan hati-hati dan jaga estetika yang baik.'
            },
            critique: {
              en: 'Completely subjective and unenforceable. A printer will stretch or recolor the logo and claim it was done "with care".',
              id: 'Sangat subjektif dan mustahil ditegakkan. Pihak percetakan bisa saja mendistorsi logo dan berdalih mereka sudah "berhati-hati".'
            }
          },
          {
            type: 'strongExample',
            example: {
              en: 'Rule: Primary Wordmark Minimum Isolation Zone | Severity: requirement | Context: logo | Guidance: Maintain an isolation zone equal to the emblem height (X) on all four sides. Never allow typography or graphics inside this perimeter.',
              id: 'Aturan: Zona Aman Minimum Logo Utama | Tingkat: requirement | Konteks: logo | Panduan: Pertahankan ruang kosong sebesar tinggi simbol (X) di keempat sisi logo. Dilarang menempatkan teks atau elemen grafis apa pun di dalam area ini.'
            },
            rationale: {
              en: 'Precise, measurable, and easily verifiable during quality assurance.',
              id: 'Presisi, terukur, dan mudah diverifikasi saat pemeriksaan hasil cetak atau rilis web.'
            }
          },
          {
            type: 'connectsTo',
            targetStageId: 'stage6_apply',
            targetModuleId: 'brandExpression',
            explanation: {
              en: 'Touchpoint production artifacts created in Stage 6 must cite the specific visual rules they comply with.',
              id: 'Artefak aplikasi di Tahap 6 wajib menautkan aturan visual spesifik yang menjadi acuan kepatuhannya.'
            }
          }
        ]
      },
      {
        id: 'topic_naming_formulas',
        moduleId: 'brandNaming',
        fieldKey: 'systems',
        tier: 'advanced',
        title: {
          en: 'Product Naming Formulas',
          id: 'Formula Penamaan Produk'
        },
        shortDescription: {
          en: 'Establishing systematic grammatical rules for product lines, sub-brands, and feature tiers.',
          id: 'Membangun aturan tata bahasa yang sistematis untuk lini produk, sub-merek, dan tingkatan fitur.'
        },
        conceptTaught: {
          en: 'Naming systems provide sustainable formulas with approved and prohibited examples.',
          id: 'Sistem penamaan memberikan formula terstruktur lengkap dengan contoh yang disetujui vs dilarang.'
        },
        blocks: [
          {
            type: 'whyThisMatters',
            content: {
              en: 'When a company grows, founders often argue endlessly over arbitrary product names. A structured naming formula automates future product naming and preserves portfolio coherence.',
              id: 'Saat bisnis berkembang, pendiri sering berdebat tanpa ujung soal nama produk baru. Formula penamaan yang terstruktur mengotomatiskan proses penamaan masa depan dan menjaga keteraturan portofolio.'
            }
          },
          {
            type: 'strongExample',
            example: {
              en: 'Tier: Single-Origin Farm Lots | Formula: [Country] + [Producer/Estate] | Approved: "Colombia Los Vasquez", "Sumatra Kerinci" | Prohibited: "Secret Mountain Blend" | Rationale: Never hide farmer origins behind fantasy marketing names.',
              id: 'Tingkatan: Kopi Single-Origin | Formula: [Negara/Daerah] + [Nama Petani/Kebun] | Disetujui: "Colombia Los Vasquez", "Sumatra Kerinci" | Dilarang: "Secret Mountain Blend" | Rationale: Jangan pernah menyembunyikan asal kebun petani di balik nama fantasi pemasaran.'
            },
            rationale: {
              en: 'Reinforces the Stage 1 core value of Radical Sourcing Transparency through concrete product naming grammar.',
              id: 'Memperkuat nilai inti Transparansi Pengadaan dari Tahap 1 melalui tata bahasa penamaan produk nyata.'
            }
          }
        ]
      }
    ]
  },

  // =========================================================================
  // STAGE 6: APPLY & SCALE
  // =========================================================================
  {
    id: 'stage6_apply',
    stageNumber: 6,
    title: {
      en: 'Apply & Scale',
      id: 'Aplikasi & Skalabilitas'
    },
    tagline: {
      en: 'Bring the System into Real-World Use',
      id: 'Terapkan Sistem pada Dunia Nyata & Skala Portofolio'
    },
    learningObjective: {
      en: 'Synthesize visual assets, rules, and messaging into production-ready physical and digital touchpoints, and structure multi-entity portfolio topologies and coupling tiers.',
      id: 'Padukan aset visual, aturan tata kelola, dan pesan ke dalam artefak aplikasi nyata (cetak & digital) dengan spesifikasi produksi presisi, serta tata hierarki arsitektur portofolio.'
    },
    designerMentalModel: {
      en: 'A brand lives in the real world on tactile and digital surfaces. I must provide precise production specifications for touchpoints and structure how sub-brands or endorsed products connect back to the masterbrand without fragmenting equity.',
      id: 'Merek hidup di dunia nyata melalui permukaan fisik dan digital. Saya wajib memberikan spesifikasi produksi presisi untuk setiap media dan menstrukturkan bagaimana sub-merek terhubung dengan merek induk tanpa memecah reputasi.'
    },
    primaryModuleIds: ['brandExpression', 'brandArchitecture'],
    topics: [
      {
        id: 'topic_production_touchpoints',
        moduleId: 'brandExpression',
        fieldKey: 'touchpoints',
        tier: 'intermediate',
        title: {
          en: 'Production-Ready Touchpoints',
          id: 'Artefak Aplikasi Siap Produksi'
        },
        shortDescription: {
          en: 'Authoring real-world touchpoint specifications with dimensions, substrates, color spaces, and do/don\'t production guidelines.',
          id: 'Menyusun spesifikasi aplikasi nyata lengkap dengan dimensi, bahan/substrat, ruang warna, dan panduan cetak Do/Don\'t.'
        },
        conceptTaught: {
          en: 'A touchpoint is not an isolated Photoshop mockup; it is the physical realization of the entire brand system.',
          id: 'Media aplikasi bukan sekadar mockup gambar Photoshop; ini adalah wujud fisik nyata dari seluruh sistem identitas merek.'
        },
        blocks: [
          {
            type: 'whyThisMatters',
            content: {
              en: 'Clients and packaging printers judge brand systems on whether files can be manufactured without costly production errors. Precise specifications protect your design from printing disasters.',
              id: 'Klien dan pihak percetakan menilai kualitas sistem merek dari apakah file dapat langsung diproduksi tanpa kesalahan fatal. Spesifikasi presisi melindungi desain dari kegagalan cetak.'
            }
          },
          {
            type: 'weakExample',
            example: {
              en: 'Touchpoint: Coffee Bag (Description: A cool bag with our logo).',
              id: 'Aplikasi: Kemasan Kopi (Deskripsi: Kemasan keren dengan logo kami).'
            },
            critique: {
              en: 'Provides zero production guidance on dimensions, dielines, color modes, or paper substrates.',
              id: 'Tidak memberi panduan teknis apa pun mengenai ukuran dimensi, garis potong (dieline), mode warna, maupun jenis kertas.'
            }
          },
          {
            type: 'strongExample',
            example: {
              en: 'Name: 12oz Retail Roastery Pouch | Dimensions: 130 x 200 x 70 mm | ColorSpace: CMYK + 1 Pantone Spot | Material: 120gsm unbleached raw kraft with water-based matte seal | Do: Keep 25mm top margin for thermal seal | AppliedRules: [rule-logo-clearspace, rule-kraft-contrast].',
              id: 'Nama: Pouch Kopi Retail 12oz | Dimensi: 130 x 200 x 70 mm | Ruang Warna: CMYK + 1 Warna Khusus Pantone | Bahan: Kertas kraft alami 120gsm dengan lapisan matte ramah lingkungan | Do: Sisakan margin atas 25mm untuk segel pemanas | Aturan Terkait: [rule-logo-clearspace, rule-kraft-contrast].'
            },
            rationale: {
              en: 'Production-grade specification that links directly to governed visual rules and assets.',
              id: 'Spesifikasi standar industri manufaktur yang terhubung langsung dengan aturan visual dan aset master.'
            }
          },
          {
            type: 'revisitWhen',
            triggerCondition: {
              en: 'Physical packaging proof reveals legibility issues on textured substrates.',
              id: 'Hasil cetak percobaan fisik menunjukkan teks sulit dibaca pada bahan kertas bertekstur.'
            },
            recommendedAction: {
              en: 'Revisit Stage 4 (Typography Scale) or Stage 5 (Visual Rules) to increase minimum micro-copy font sizes or contrast requirements.',
              id: 'Kembali ke Tahap 4 (Skala Tipografi) atau Tahap 5 (Aturan Visual) untuk memperbesar ukuran font minimum atau memperketat kontras warna.'
            }
          }
        ]
      },
      {
        id: 'topic_brand_architecture_topology',
        moduleId: 'brandArchitecture',
        fieldKey: 'relationships',
        tier: 'advanced',
        title: {
          en: 'Portfolio Hierarchy & Coupling',
          id: 'Hierarki Portofolio & Tingkat Keterikatan Merek'
        },
        shortDescription: {
          en: 'Structuring how masterbrands, sub-brands, and endorsed lines visually connect and transfer equity.',
          id: 'Menstrukturkan bagaimana merek induk, sub-merek, dan lini endorsement terhubung secara visual dan menyalurkan reputasi.'
        },
        conceptTaught: {
          en: 'Brand architecture models (Branded House, House of Brands, Endorsed) control risk and visual equity.',
          id: 'Model arsitektur merek (Branded House, House of Brands, Endorsed) mengatur risiko bisnis dan pembagian reputasi visual.'
        },
        blocks: [
          {
            type: 'whyThisMatters',
            content: {
              en: 'When a successful business launches a new product line, architecture determines whether it shares the parent logo (monolithic) or operates independently to protect the parent brand from category risk.',
              id: 'Saat bisnis yang sukses meluncurkan lini produk baru, arsitektur menentukan apakah produk memakai logo induk (monolitik) atau mandiri untuk melindungi merek induk dari risiko pasar.'
            }
          },
          {
            type: 'thinkAboutThis',
            prompt: {
              en: 'A monolithic structure (Branded House) is cost-effective and builds master equity quickly, but a failure in one product damages the entire company. A freestanding structure (House of Brands) isolates risk but requires funding distinct marketing campaigns for every brand.',
              id: 'Struktur monolitik (Branded House) sangat hemat biaya dan cepat mendongkrak reputasi induk, namun kegagalan satu produk dapat merusak seluruh perusahaan. Struktur mandiri (House of Brands) mengisolasi risiko tetapi membutuhkan biaya pemasaran terpisah untuk setiap merek.'
            }
          },
          {
            type: 'connectsTo',
            targetStageId: 'stage5_govern',
            targetModuleId: 'brandNaming',
            explanation: {
              en: 'Your architecture strategy directly dictates your naming taxonomy systems authored in Stage 5.',
              id: 'Strategi arsitektur merek langsung menentukan formula penamaan produk yang disusun di Tahap 5.'
            }
          }
        ]
      }
    ]
  }
];

/**
 * Helper to fetch a stage definition by ID
 */
export function getGuidanceStage(stageId: GuidanceStageId): GuidanceStage | undefined {
  return GUIDANCE_STAGES.find((s) => s.id === stageId);
}

/**
 * Helper to fetch all topics mapped to a specific ModuleId
 */
export function getGuidanceTopicsForModule(moduleId: ModuleId) {
  const topics: { stage: GuidanceStage; topic: GuidanceStage['topics'][0] }[] = [];
  for (const stage of GUIDANCE_STAGES) {
    for (const topic of stage.topics) {
      if (topic.moduleId === moduleId) {
        topics.push({ stage, topic });
      }
    }
  }
  return topics;
}
