# Phase 4.1B — Guidance Curriculum & Content Specification

**Document Version:** 1.0.0  
**Phase:** 4.1B — Pedagogical Specification & Curriculum Blueprint  
**Baseline Commit:** `ff52bdf` (Level 3 Frozen)  
**Status:** Read-Only Architectural Curriculum Specification  

---

## 1. Curriculum Philosophy

### 1.1 What Guided Mode Teaches vs. What It Does NOT Teach
- **What Guided Mode Teaches**: Strategic brand thinking, intentional decision-making, business-to-design translation, system coherence, prescriptive governance, and cross-domain relational logic.
- **What Guided Mode Does NOT Teach**: Generic visual design software tools (e.g. how to use Illustrator vector pen tools or Figma auto-layout), basic color theory, or introductory typography kerning. The user is assumed to be visually literate and design-capable.
- **Teaching Concepts vs. Explaining UI**: Explaining UI says *"Click here to add a differentiator"*. Teaching concepts says *"A differentiator is the defensible, evidence-backed reason why a customer chooses this brand over direct alternatives. Let's uncover that before picking colors."*

### 1.2 The Graphic Designer's Cognitive Transition
A graphic designer transitioning into brand design typically faces 3 major cognitive hurdles:
1. **From Artifact to System**: Shifting from designing isolated deliverables (a cool logo, a pretty business card) to authoring an interconnected identity system.
2. **From Subjective Aesthetics to Strategic Defense**: Shifting from *"I picked this color because it looks fresh"* to *"This palette visually communicates our core value of radical sourcing transparency to urban professionals seeking quiet focus"*.
3. **From Descriptive Guidelines to Prescriptive Governance**: Shifting from showcasing what an identity looks like to authoring enforceable constraints that protect brand equity.

### 1.3 Avoiding the Rigid Wizard
- The 6 stages represent a **recommended learning and decision journey**, not a linear blocking sequence.
- **No Hard Gates**: The designer can jump freely between any stage or module at any point.
- **Advisory Progression**: Progress indicators communicate *"Sufficiently defined to support downstream decisions"* rather than *"Completed step 2 of 6"*.

### 1.4 The Core Educational Principle
> **"Teach the reasoning behind the decision, then help the designer record that decision in the authoritative Brand Knowledge model."**

---

## 2. Six-Stage Curriculum Specification

---

### Stage 1 — Discover & Define: Clarify the Core
*Mapped Modules: `overview`, `strategy`*

#### 1. Learning Objective
Teach the designer how to anchor the brand in its fundamental commercial purpose, market category, and non-negotiable operational values before exploring aesthetics.

#### 2. Beginner Mental Model
*"A brand is not a logo; it is the reputation and promise of an organization. Before I sketch anything, I must understand why this organization exists, what business category it operates in, and what operational values guide its actions."*

#### 3. Core Concepts
- **Brand Essence vs. Marketing Slogan**: Essence is the foundational reason for being; slogans are transient advertising campaigns.
- **Category Framing**: The category defines customer expectations and sets the baseline visual codes.
- **Operational Values vs. Corporate Clichés**: Values are internal decision-making guardrails (how we behave), not decorative posters on an office wall.
- **Strategic Priorities**: Near-term and long-term milestones that focus brand energy.

#### 4. Client Discovery Questions (Ask Your Client)
- *"Why was this company founded beyond making money?"*
- *"What is your 1-sentence explanation of what you do when speaking to a stranger at an airport?"*
- *"What are 3 non-negotiable principles that guide how you treat customers and build products?"*
- *"If this brand ceased to exist tomorrow, what would the industry genuinely miss?"*

#### 5. Questions the Designer Should Ask Themselves
- *"Did the client give me a clear description of what they actually do, or did they give me a vague marketing slogan?"*
- *"Are these values actionable enough that an employee would know how to make a tough trade-off decision?"*
- *"What visual cliches exist in this category, and should we embrace or disrupt them?"*

#### 6. Expected Decisions & Brand Knowledge Outputs
- Formulate a clear, descriptive `brandName` and `category`.
- Author a precise `oneLineDescription` and comprehensive `longDescription`.
- Author 2–4 distinct `values` (`StrategicValueEntity[]`) with descriptive operational rationales.
- (Optional) Articulate 1–3 `priorities` (`StrategicPriorityEntity[]`).

#### 7. Common Beginner Mistakes
- Writing an aspirational advertising slogan into the `oneLineDescription`.
- Choosing generic values like *"Quality"*, *"Integrity"*, or *"Excellence"* without defining what they mean in practice.
- Leaving `category` blank or defining it so broadly that it provides no strategic direction (e.g. *"Lifestyle"* instead of *"Specialty Single-Origin Micro-Roastery"*).

#### 8. Weak vs. Strong Examples
- **Weak `oneLineDescription`**: *"We make the best coffee on earth for awesome people."* (Vague slogan, zero substance).
- **Strong `oneLineDescription`**: *"A neighborhood specialty coffee roaster dedicated to slow morning rituals and direct-trade farm sourcing."* (Clear, concrete, sets category and values).
- **Weak `values`**: `Title: Quality` | `Description: We always do our best.`
- **Strong `values`**: `Title: Quiet Craft` | `Description: Prioritizing meticulous batch roasting and serene acoustic spaces over fast-paced commercial turnover.`

#### 9. Diagnostic Warnings
- `Warning`: *"Your one-line description reads like an advertising slogan. Focus on describing what the brand actually does and offers."*
- `Tip`: *"Values like 'Quality' are table-stakes. Try defining what your client would sacrifice or say NO to in order to uphold this value."*

#### 10. Downstream Impact & Revisit Triggers
- **Influences**: Stage 2 (Category frames competitors), Stage 3 (Values dictate Personality traits), Stage 4 (Essence dictates visual tone).
- **Revisit Trigger**: If competitive discovery in Stage 2 reveals that the founders' perceived category is overcrowded, revisit Stage 1 to re-frame the category.

---

### Stage 2 — Position & Audience: Find the Strategic Stance
*Mapped Module: `positioning`*

#### 1. Learning Objective
Teach the designer how to segment audiences by mindset and pain points, analyze real competitive alternatives, and formulate defensible differentiators that justify visual distinctiveness.

#### 2. Beginner Mental Model
*"A brand cannot be for everyone. If I don't know who the core believer is and what alternatives they are comparing us against, I will design a generic, middle-of-the-road identity. Positioning gives me permission to be visually distinct."*

#### 3. Core Concepts
- **Demographics vs. Psychographic Mindset**: Demographics (age 25–40) tell you who buys; psychographics (pain points, rituals, anxieties) tell you *why* they buy.
- **Competitive Alternatives (Direct & Indirect)**: What the customer does instead (e.g., direct competitor vs. drinking tea vs. skipping breakfast).
- **Defensible Differentiators with Evidence**: A claim must be demonstrable and true (backed by proof), not just an unsubstantiated boast.
- **Positioning Statement Formula**: `For [Target], [Brand] is the [Category] that [Key Benefit/Differentiator] unlike [Alternative] because [Evidence].`

#### 4. Client Discovery Questions (Ask Your Client)
- *"Who is the specific person who loves your product the most, and what is their daily frustration?"*
- *"If your product didn't exist, what would they buy or do instead?"*
- *"What is the single most important reason someone should choose you over the market leader?"*
- *"What evidence or proof can we show that makes that reason undeniably true?"*

#### 5. Questions the Designer Should Ask Themselves
- *"Is this differentiator actually unique, or is it something every competitor claims?"*
- *"Does this audience definition give me enough emotional insight to design a mood board?"*
- *"How will this positioning stance change our typography, photography, and color choices?"*

#### 6. Expected Decisions & Brand Knowledge Outputs
- Define 1–3 `targetAudiences` (`AudienceEntity[]`) with detailed `needsPainPoints`.
- Articulate the `coreProblem` and `competitiveAlternatives`.
- Author 1–3 `differentiators` (`DifferentiatorEntity[]`) with concrete `evidence`.
- Synthesize a comprehensive `positioningStatement`.

#### 7. Common Beginner Mistakes
- Defining target audience as *"Everyone who needs coffee / software / shoes"*.
- Listing table-stakes product features as differentiators (e.g. *"Our app is easy to use"* or *"Friendly service"*).
- Failing to name competitive alternatives.

#### 8. Weak vs. Strong Examples
- **Weak Audience**: `Name: Young people` | `Needs: Wants good coffee.`
- **Strong Audience**: `Name: Urban Creatives & Remote Professionals` | `Needs: Stressed by noisy commercial cafe chains; seeking calm, acoustically treated spaces to do focused deep work.`
- **Weak Differentiator**: `Title: Great Taste` | `Evidence: Customers say it's yummy.`
- **Strong Differentiator**: `Title: Acoustic Sanctuary Architecture` | `Evidence: Cafe spaces are engineered with cork dampening; sound levels independently certified below 55dB during peak hours.`

#### 9. Diagnostic Warnings
- `Warning`: *"Your differentiator 'Fast Service' is a common category expectation rather than a unique positioning advantage."*
- `Recommendation`: *"You have defined an audience of 'Enterprise Procurement', but haven't listed their specific risk-aversion pain points."*

#### 10. Downstream Impact & Revisit Triggers
- **Influences**: Stage 3 (Audience targets for key messages), Stage 4 (Photography art direction & color mood), Stage 6 (Touchpoint design specs).
- **Revisit Trigger**: If client copywriting in Stage 3 reveals confusion on who they are speaking to, revisit Stage 2 Audiences.

---

### Stage 3 — Shape the Character: Give the Brand a Soul
*Mapped Modules: `personality`, `voiceTone`, `messaging`*

#### 1. Learning Objective
Teach the designer how to translate strategic positioning into human character traits with strict behavioral boundaries (*We Are / We Are Not*), actionable voice principles, and proof-backed key messages.

#### 2. Beginner Mental Model
*"If this brand walked into a room as a human being, how would they act, speak, and relate to others? Establishing behavioral boundaries prevents the brand from becoming a cartoon caricature or lapsing into corporate monotone."*

#### 3. Core Concepts
- **Traits vs. Behavioral Boundaries**: A trait like *"Playful"* is dangerous without a boundary (*"Playful, but never sarcastic or flippant"*).
- **Personality (Character) vs. Voice & Tone (Dynamic Expression)**: Personality is constant; tone flexes depending on the channel and emotional state of the user.
- **Do & Don't Copywriting Governance**: Actionable before-and-after examples that teach writers how the brand sounds.
- **Proof-Backed Messaging**: Connecting every customer-facing claim to a concrete strategic proof point.

#### 4. Client Discovery Questions (Ask Your Client)
- *"If your brand were a person, what 3-4 personality traits would describe their natural demeanor?"*
- *"Where is the boundary for each trait? (e.g. We are confident, but NEVER arrogant; we are warm, but NEVER overly casual)."*
- *"How should we speak when an order is delayed vs. when we launch a new seasonal single-origin lot?"*
- *"What is our 30-second elevator pitch?"*

#### 5. Questions the Designer Should Ask Themselves
- *"Are these We Are / We Are Not pairs actually useful guardrails, or are they obvious tautologies?"*
- *"Do our voice principles provide clear Do / Don't examples for third-party copywriters?"*
- *"Does the elevator pitch directly reinforce our Stage 2 positioning differentiators?"*

#### 6. Expected Decisions & Brand Knowledge Outputs
- Author 3–5 `traits` (`PersonalityTraitEntity[]`) with descriptive definitions.
- Author 2–4 `weAreWeAreNot` pairs (`WeArePairEntity[]`) with rationale.
- Define `principles` (`VoicePrincipleEntity[]`) with concrete *Do / Don't* guidelines.
- Formulate `tagline`, `elevatorPitch`, and 2–4 `keyMessages` (`KeyMessageEntity[]`) linked to target audiences.

#### 7. Common Beginner Mistakes
- Confusing Voice with Personality (treating them as two identical lists of adjectives).
- Creating meaningless We Are / We Are Not pairs (e.g. *"We are good, but we are not bad"*).
- Writing key messages that make grandiose claims without citing proof points.

#### 8. Weak vs. Strong Examples
- **Weak We Are / We Are Not**: `We Are: Professional` | `We Are Not: Unprofessional` (Trivial, non-actionable).
- **Strong We Are / We Are Not**: `We Are: Welcoming & Knowledgeable` | `We Are Not: Snobbish or Elitist Baristas` | `Rationale: We explain flavor profiles with generosity and patience, never condescension.`
- **Weak Voice Principle**: `Title: Friendly` | `Do: Be nice` | `Don't: Be mean.`
- **Strong Voice Principle**: `Title: Warm Brevity` | `Do: Use grounded, sensory words. Keep sentences under 15 words.` | `Don't: Never use corporate marketing buzzwords like 'synergistic artisanal paradigm'.`

#### 9. Diagnostic Warnings
- `Warning`: *"Your personality trait is 'Bold', but your voice guidelines forbid any strong or provocative opinions."*
- `Recommendation`: *"You have authored key messages but have not linked them to any Target Audience from Stage 2."*

#### 10. Downstream Impact & Revisit Triggers
- **Influences**: Stage 4 (Visual identity aesthetic: warm serif vs. tech mono), Stage 5 (Naming tone and rules), Stage 6 (Touchpoint copywriting).
- **Revisit Trigger**: If copywriting on real packaging mockups feels cold, revisit Stage 3 Voice Principles.

---

### Stage 4 — Craft the Visual Identity: Translate Meaning into Form
*Mapped Modules: `visualKnowledge`, `visualAssets`*

#### 1. Learning Objective
Teach the designer how to translate the brand character and positioning into a structured, modular visual system (functional logo variants, semantic color palettes, typographic hierarchy, imagery art direction) and organize master asset packages.

#### 2. Beginner Mental Model
*"Visual identity is not just drawing a nice logo. It is engineering a complete visual language where colors have functional UI/print roles, typography establishes immediate clarity and tone, and imagery direction tells a consistent story."*

#### 3. Core Concepts
- **Functional Logo Variants**: Why a brand needs Primary, Monochrome, Reversed, Stacked, and Emblem variants for diverse production constraints.
- **Semantic Color Palettes (60/30/10 Rule)**: Assigning colors to strict roles (Dominant Neutral, Surface/Card, Primary Text, Accent/CTA) rather than randomly splashing color.
- **Typographic Hierarchy & Contrast**: Pairing display personality fonts with robust, accessible body type scales across desktop and mobile.
- **Art Direction & Image Moodboards**: Establishing rules for lighting, human subject framing, and color grading.
- **Visual Knowledge (Specification) vs. Visual Assets (Files)**: The specification defines *how* it works; the asset stores the master SVG/WOFF2 files.

#### 4. Questions the Designer Should Ask Themselves
- *"Do I have high-contrast logo variants for both light paper and dark espresso surfaces?"*
- *"Do my color pairings meet WCAG AA legibility contrast standards (4.5:1 for body copy)?"*
- *"Does the typography scale provide distinct, proportional hierarchy from H1 display down to micro-caption?"*
- *"Are all logo assets available as production-ready, clean SVGs without stray vector points?"*

#### 5. Expected Decisions & Brand Knowledge Outputs
- Author `logoVariants` (`LogoVariant[]`) with clear usage notes and background recommendations.
- Define `primaryColors` and `secondaryColors` with explicit hex, CMYK, and functional role tags.
- Author `typographyHierarchy` (Display, Headings, Subhead, Body, Caption) and font family specs.
- Define `imageryDirections` and `imageTreatments` guidelines.
- Populate `visualAssets` with master SVG files, icon packs, and font packages.

#### 6. Common Beginner Mistakes
- Uploading a single full-color logo without reversed or single-color monochrome versions for thermal receipts or stamping.
- Choosing pastel-on-pastel color combinations that are impossible to read in print or UI.
- Neglecting imagery art direction, leaving future photographers to guess the visual style.

#### 7. Weak vs. Strong Examples
- **Weak Color System**: `Hex: #FF0000` | `Name: Red` | `Role: (blank)` (Random swatch).
- **Strong Color System**: `Hex: #2D241E` | `Name: Espresso Dark Neutral` | `Role: Primary Typography & Dark Surface (Contrast ratio 12.4:1 on Warm Parchment #F7F4EF)`.
- **Weak Typography**: *"Use Arial for everything."*
- **Strong Typography**: Display: *Fraunces Variable 700 (Warm, grounded editorial craft)* | Body: *Inter Regular 400 (Clean, highly legible micro-counter spaces)*.

#### 8. Diagnostic Warnings
- `Warning`: *"Your Primary Wordmark lacks a defined Reversed (White) variant for dark backgrounds."*
- `Tip`: *"Ensure your secondary accent color is reserved for interactive accents and CTAs (10% distribution) rather than large background fills."*

#### 9. Downstream Impact & Revisit Triggers
- **Influences**: Stage 5 (Visual Rules directly govern these logos/colors), Stage 6 (Touchpoints use these assets and specs).
- **Revisit Trigger**: If packaging dieline testing in Stage 6 reveals unreadable small text, revisit Stage 4 Typography Scale.

---

### Stage 5 — Govern & Protect: Turn Identity into a Usable System
*Mapped Modules: `visualRules`, `brandNaming`*

#### 1. Learning Objective
Teach the designer how to author prescriptive, actionable governance rules (with strict severity tiers) and systematic product/sub-brand naming formulas that protect the brand from degradation.

#### 2. Beginner Mental Model
*"Guidelines without rules are just art galleries. I must author clear, non-negotiable guardrails that prevent future client employees, junior designers, and external vendors from distorting the logo, breaking contrast, or inventing chaotic product names."*

#### 3. Core Concepts
- **Prescriptive vs. Descriptive Guidelines**: Descriptive says *"This is our logo."* Prescriptive says *"The logo must always have 1X clearspace and must NEVER be placed on busy photographic backgrounds."*
- **Severity Tiers**:
  - `must` / `requirement`: Absolute requirement for brand integrity (e.g. minimum clearspace).
  - `restriction` / `prohibition`: Strict prohibition (e.g. never stretch or alter color).
  - `preference`: Contextual recommendation (e.g. prefer natural paper substrates).
- **Semantic Rule References**: Linking a rule directly to the governed logo, color, or asset via `EntityReference`.
- **Naming Taxonomy & Formulas**: Structuring names with predictable grammar (`descriptor` + `modifier` + `tierSuffix`).

#### 4. Questions the Designer Should Ask Themselves
- *"What are the top 3 ways a careless vendor will ruin this logo, and have I written explicit rules forbidding them?"*
- *"What is the formula for naming a new product line or seasonal blend?"*
- *"Are my approved and prohibited naming examples backed by clear strategic rationale?"*
- *"Is every visual rule linked to its corresponding visual entity?"*

#### 5. Expected Decisions & Brand Knowledge Outputs
- Author 3–8 `visualRules` (`VisualRuleItem[]`) covering clearspace, minimum scale, contrast, and layout.
- Assign appropriate `type` (requirement, restriction, preference) and `context` tags to each rule.
- Link rules to governed entities using `references` (`EntityReference[]`).
- Author `principlesOverview` and 1–3 `systems` (`NamingSystemEntity[]`) with approved and prohibited examples.

#### 6. Common Beginner Mistakes
- Writing vague, unenforceable advice like *"Use the logo tastefully"* or *"Be creative"*.
- Forgetting to specify minimum print and digital dimensions.
- Defining a naming system without providing *Prohibited* counter-examples.

#### 7. Weak vs. Strong Examples
- **Weak Rule**: `Name: Logo Rule` | `Guidance: Don't mess up the logo.` (Vague, non-actionable).
- **Strong Rule**: `Name: Primary Wordmark Isolation Zone` | `Type: requirement` | `Context: logo` | `Guidance: Maintain an isolation zone equal to the height of the emblem (X) on all four sides. No text or graphic elements may intrude.` | `References: [visualKnowledge:logo:primary]`
- **Weak Naming Example**: `Approved: Cool Coffee` | `Prohibited: Bad Coffee`
- **Strong Naming Example**: `Tier: Product Origin` | `Formula: [Country] + [Estate/Producer]` | `Approved: Colombia Los Vasquez` | `Prohibited: Secret Mountain Blend` | `Rationale: Never hide farm origins behind generic fantasy marketing names.`

#### 8. Diagnostic Warnings
- `Warning`: *"You have defined 4 visual rules, but none govern minimum clearspace or contrast restrictions for your Primary Logo."*
- `Recommendation`: *"Your Naming System has approved examples but lacks prohibited examples to show boundaries."*

#### 9. Downstream Impact & Revisit Triggers
- **Influences**: Stage 6 (Touchpoints must comply with these rules; Architecture nodes must follow naming systems).
- **Revisit Trigger**: If real touchpoint production in Stage 6 reveals vendor substrate limitations, revisit Stage 5 Rules to add contextual print exceptions.

---

### Stage 6 — Apply & Scale: Bring the System to Life
*Mapped Modules: `brandExpression`, `brandArchitecture`*

#### 1. Learning Objective
Teach the designer how to synthesize visual assets, rules, and messaging into production-ready physical and digital touchpoints, and structure multi-entity portfolio topologies and visual coupling tiers.

#### 2. Beginner Mental Model
*"The client and audience judge the brand through real touchpoints in the physical and digital world. I must provide precise production specifications for touchpoints and structure how sub-brands or endorsed lines connect back to the masterbrand without diluting equity."*

#### 3. Core Concepts
- **Touchpoints as System Synthesis**: A touchpoint is not an isolated artwork; it is the real-world execution of Assets + Rules + Personality + Copywriting.
- **Production Specifications**: Real-world dimensions, bleed margins, color spaces (CMYK/Pantone), substrate finishes, and dieline notes.
- **Brand Architecture Strategy Archetypes**:
  - *Branded House (Monolithic)*: Masterbrand dominates; sub-brands share identity (e.g. Virgin, FedEx).
  - *House of Brands (Freestanding)*: Independent brands with isolated equity (e.g. P&G).
  - *Endorsed*: Sub-brand has distinct identity but carries parent endorsement (e.g. Courtyard by Marriott).
  - *Hybrid*: Pragmatic combination of models.
- **Coupling Tiers & Visual Equity**: Controlling how tightly a child node is coupled to its parent (`monolithic`, `endorsed`, `coBranded`, `freestanding`).

#### 4. Questions the Designer Should Ask Themselves
- *"What are the 3-5 essential touchpoints that define our customer's daily experience?"*
- *"Have I included clear production dimensions, materials, and do/don't guidelines for each touchpoint?"*
- *"Does this brand have sub-products or sister brands, and how should they visually relate to the masterbrand?"*
- *"Are all touchpoint mockups linked to the visual rules and assets they utilize?"*

#### 5. Expected Decisions & Brand Knowledge Outputs
- Author `overview` and 2–6 `touchpoints` (`TouchpointEntity[]`) covering stationery, packaging, digital, and signage.
- Provide detailed `specifications` (dimensions, materials, finish) and `guidelines` (do/don't copy).
- Link touchpoints to `appliedAssetRefs` and `appliedRuleRefs`.
- (If multi-brand) Select `strategyType` and author `nodes` (`BrandArchitectureNodeEntity[]`) and `relationships` (`BrandRelationshipEntity[]`).

#### 6. Common Beginner Mistakes
- Uploading flat mockup pictures without production specifications or dieline instructions.
- Creating brand architecture for a single-product business that doesn't need it.
- Creating arbitrary, disconnected logos for sub-brands without defining the equity coupling tier.

#### 7. Weak vs. Strong Examples
- **Weak Touchpoint**: `Name: Bag` | `Category: packaging` | `Description: Coffee bag mockup.`
- **Strong Touchpoint**: `Name: 12oz Roastery Retail Bag` | `Category: packaging` | `Dimensions: 130 × 200 × 70 mm` | `ColorSpace: CMYK + 1 Spot` | `Materials: 120gsm unbleached raw kraft with water-based matte sealant` | `Do: Maintain 25mm top margin for thermal heat-seal` | `AppliedRules: [rule-logo-clearspace, rule-kraft-contrast]`.
- **Weak Architecture**: Creating 5 standalone logos with zero documented relationship or coupling rules.
- **Strong Architecture**: `Parent: Northstar Coffee (Master)` $\rightarrow$ `Child: Northstar Roastery Lab (Sub-brand)` | `Type: parentOf` | `Coupling: monolithic` | `Rationale: Leverages masterbrand equity while designating experimental single-origin roasting.`

#### 8. Diagnostic Warnings
- `Warning`: *"Touchpoint 'Retail Coffee Bag' does not reference any governing Visual Rules."*
- `Error`: *"Brand Architecture contains a self-referencing cycle (Node A is parent of Node A)."*

#### 9. Downstream Impact & Revisit Triggers
- **Influences**: Final client Guideline Preview assembly, vendor handoffs, export deliverables.
- **Revisit Trigger**: If mockup testing reveals that small typography is unreadable on textured kraft paper, revisit Stage 4 Typography or Stage 5 Contrast Rules.

---

## 3. Decision Dependency Map & Legitimate Feedback Loops

```
+----------------------------------------------------------------------------------------------------+
|                                    FORWARD STRATEGIC FLOW                                          |
+----------------------------------------------------------------------------------------------------+
|  Stage 1: Purpose & Values (overview, strategy)                                                    |
|       |                                                                                            |
|       v                                                                                            |
|  Stage 2: Target Audience & Positioning Differentiators (positioning)                             |
|       |                                                                                            |
|       v                                                                                            |
|  Stage 3: Personality Traits, Voice Principles & Messaging (personality, voiceTone, messaging)     |
|       |                                                                                            |
|       v                                                                                            |
|  Stage 4: Visual Identity Specs, Color Roles & Assets (visualKnowledge, visualAssets)              |
|       |                                                                                            |
|       v                                                                                            |
|  Stage 5: Prescriptive Rules & Naming Systems (visualRules, brandNaming)                           |
|       |                                                                                            |
|       v                                                                                            |
|  Stage 6: Real-World Touchpoints & Portfolio Architecture (brandExpression, brandArchitecture)     |
+----------------------------------------------------------------------------------------------------+
                                      |                |
                                      | FEEDBACK       | FEEDBACK
                                      | LOOP 1         | LOOP 2
                                      v                v
+----------------------------------------------------------------------------------------------------+
|                                    LEGITIMATE FEEDBACK LOOPS                                       |
+----------------------------------------------------------------------------------------------------+
| Loop 1 (Stage 6 -> Stage 4/5):                                                                     |
|   Packaging dieline testing reveals that secondary color has poor contrast on unbleached kraft    |
|   --> Designer returns to Stage 4 (Colors) to adjust ink values or Stage 5 to add a substrate rule.|
|                                                                                                    |
| Loop 2 (Stage 5 -> Stage 3):                                                                       |
|   Drafting prohibited naming examples reveals voice boundaries were too permissive                 |
|   --> Designer returns to Stage 3 (We Are / We Are Not) to tighten personality guardrails.         |
|                                                                                                    |
| Loop 3 (Stage 2 -> Stage 1):                                                                       |
|   Audience discovery reveals customer pain point is completely different from founders' view       |
|   --> Designer returns to Stage 1 to re-frame the core business category and essence.              |
+----------------------------------------------------------------------------------------------------+
```

---

## 4. Beginner Mental Models: Core Conceptual Distinctions

```
+------------------------------------+---------------------------------------------------------------+
| CONCEPT PAIR                       | BEGINNER MISCONCEPTION vs. CORRECT BRAND MENTAL MODEL         |
+------------------------------------+---------------------------------------------------------------+
| 1. Strategy != Positioning         | Misconception: "They are both just business goal statements."  |
|                                    | Correct Model: Strategy is INTERNAL (why we exist and how we  |
|                                    | operate). Positioning is EXTERNAL (how we occupy a distinct,  |
|                                    | defensible place in the customer's mind vs. alternatives).    |
+------------------------------------+---------------------------------------------------------------+
| 2. Personality != Voice & Tone     | Misconception: "Voice is just a list of personality traits."  |
|                                    | Correct Model: Personality is the WHO (character traits and  |
|                                    | boundaries). Voice & Tone is the HOW (how that character      |
|                                    | writes and flexes across channels and customer moods).        |
+------------------------------------+---------------------------------------------------------------+
| 3. Visual Knowledge != Visual Assets| Misconception: "Visual guidelines are just a folder of logos."|
|                                    | Correct Model: Visual Knowledge is the SPECIFICATION (HEX,    |
|                                    | scales, clearspace, pairings). Assets are the BINARY FILES    |
|                                    | (.svg, .woff2, .png) packaged for production.                 |
+------------------------------------+---------------------------------------------------------------+
| 4. Visual Guidelines != Rules      | Misconception: "Guidelines are just visual recommendations."  |
|                                    | Correct Model: Guidelines showcase what it looks like; Rules  |
|                                    | establish legally enforceable MUST / NEVER constraints.       |
+------------------------------------+---------------------------------------------------------------+
| 5. Brand Naming != Voice Vocab     | Misconception: "Naming is just copywriting."                  |
|                                    | Correct Model: Vocabulary is a glossary of words. Naming is a |
|                                    | systematic TAXONOMY and grammatical formula for products.     |
+------------------------------------+---------------------------------------------------------------+
| 6. Architecture != Single Brand    | Misconception: "Every product needs its own unique logo."     |
|                                    | Correct Model: Architecture structures PORTFOLIO EQUITY,      |
|                                    | dictating how sub-brands link back to the parent masterbrand. |
+------------------------------------+---------------------------------------------------------------+
```

---

## 5. Client Discovery Question Library

```
+---------------------+---------------------------------------------------------------+-------------------------------------------------------------+
| CATEGORY            | DISCOVERY QUESTION (Ask Your Client)                          | WHAT TO LOOK FOR vs. FOLLOW-UP PROMPT                       |
+---------------------+---------------------------------------------------------------+-------------------------------------------------------------+
| Business & Category | "What is the 1-sentence explanation of what you do?"          | Look for concrete offer. If vague slogan, ask: "What do     |
|                     |                                                               | customers actually pay you money for?"                      |
+---------------------+---------------------------------------------------------------+-------------------------------------------------------------+
| Audience Mindset    | "Who is the customer that loves you most, and why?"          | Look for emotional pain points. Follow up: "What were they  |
|                     |                                                               | doing before they found your product?"                      |
+---------------------+---------------------------------------------------------------+-------------------------------------------------------------+
| Differentiation     | "What is the #1 reason to pick you over the market leader?"   | Look for defensible proof. Follow up: "How can we prove to a|
|                     |                                                               | skeptic that this claim is 100% true?"                      |
+---------------------+---------------------------------------------------------------+-------------------------------------------------------------+
| Character & Traits  | "If your brand were a person, who would they be?"             | Look for human traits. Follow up: "What is the boundary?    |
|                     |                                                               | What would this person NEVER do or say?"                    |
+---------------------+---------------------------------------------------------------+-------------------------------------------------------------+
| Voice & Tone        | "How should we sound when an order is broken or delayed?"     | Look for empathy vs. corporate evasion. Follow up: "Give me |
|                     |                                                               | an example of a sentence you would NEVER say to a client."  |
+---------------------+---------------------------------------------------------------+-------------------------------------------------------------+
| Governance & Rules  | "What is the biggest mistake external vendors make with you?" | Look for logo distortion, bad fonts. Follow up: "What must  |
|                     |                                                               | be strictly prohibited on packaging and web?"               |
+---------------------+---------------------------------------------------------------+-------------------------------------------------------------+
| Portfolio & Scale   | "Will this brand launch new product lines or sub-ventures?"   | Look for multi-tier architecture needs vs. monolithic line. |
+---------------------+---------------------------------------------------------------+-------------------------------------------------------------+
```

---

## 6. Beginner Mistake Taxonomy

```
+-----------------------------------+--------------------------------+-------------------------------------------------------------+------------------------------------+
| MISTAKE                           | WHAT HAPPENS                   | WHY IT IS PROBLEMATIC                                       | HOW GUIDED MODE RESPONDS           |
+-----------------------------------+--------------------------------+-------------------------------------------------------------+------------------------------------+
| 1. Logo-First Trap                | Designer draws logos on Day 1  | Aesthetic decisions have no strategic defense against client| Prompts Stage 1 & 2 discovery to   |
|                                   | before defining purpose/stance.| whims ("I don't like green").                               | establish the strategic rationale. |
+-----------------------------------+--------------------------------+-------------------------------------------------------------+------------------------------------+
| 2. Slogan as Description          | Writes "The best coffee ever"  | Fails to communicate what the business actually sells.      | Warns that description reads like an|
|                                   | in oneLineDescription.         |                                                             | ad; prompts concrete offer details.|
+-----------------------------------+--------------------------------+-------------------------------------------------------------+------------------------------------+
| 3. Demographic-Only Audience      | Defines audience as "Men 25-45"| Fails to reveal customer frustrations or emotional needs.   | Prompts psychographic pain points &|
|                                   | with no pain points.           |                                                             | daily ritual context.              |
+-----------------------------------+--------------------------------+-------------------------------------------------------------+------------------------------------+
| 4. Table-Stakes Differentiator    | Claims "Quality & Good Service"| Competitors claim the exact same thing; zero distinction.   | Prompts unique operational proof   |
|                                   | as competitive advantage.      |                                                             | and sacrifice points.              |
+-----------------------------------+--------------------------------+-------------------------------------------------------------+------------------------------------+
| 5. Unbounded Traits               | Lists "Playful" with no We-Are-| Writers lapse into childish sarcasm or unprofessional copy. | Requires We Are / We Are Not       |
|                                   | Not boundary.                  |                                                             | boundary definition.               |
+-----------------------------------+--------------------------------+-------------------------------------------------------------+------------------------------------+
| 6. Unenforceable Rules            | Writes "Be consistent and clean| Junior teams and vendors cannot follow vague advice.        | Prompts explicit severity tier and |
|                                   | with logo placement".          |                                                             | clearspace X-height formulas.      |
+-----------------------------------+--------------------------------+-------------------------------------------------------------+------------------------------------+
```

---

## 7. Diagnostic & Recommendation Curriculum (4-Level Hierarchy)

```
+-------------------+--------------------------------------------------------------------------------------------------------------------+
| LEVEL             | DIAGNOSTIC EXAMPLES (10 Representative Rules)                                                                      |
+-------------------+--------------------------------------------------------------------------------------------------------------------+
| 1. Error (Red)    | 1. Brand Architecture contains a cyclic relationship (Node A -> Node B -> Node A).                                 |
|    (Data / Schema | 2. EntityReference targets a non-existent entity ID.                                                               |
|     Integrity)    | 3. Color hex string is syntactically invalid (e.g. "#XYZ").                                                        |
|                   | 4. Naming system formula contains duplicate role tags.                                                             |
|                   | 5. Touchpoint specifies a negative or 0 mm dimension.                                                              |
+-------------------+--------------------------------------------------------------------------------------------------------------------+
| 2. Warning        | 1. OneLineDescription contains marketing buzzwords ("best", "world-class") without stating business category.     |
|    (Amber)        | 2. Differentiator has an ambitious claim but leaves the 'evidence' field completely blank.                         |
|    (Strategic /   | 3. Primary logo variant lacks a defined clearspace or isolation zone rule in Stage 5.                             |
|     Visual Gap)   | 4. Color palette has 6 colors but none are assigned the 'Primary Neutral / Text' role.                             |
|                   | 5. Touchpoint artifact is authored without any appliedRuleRefs or appliedAssetRefs.                                |
+-------------------+--------------------------------------------------------------------------------------------------------------------+
| 3. Recommen-      | 1. You defined an audience in Stage 2; consider attaching tailored Key Messages in Stage 3.                       |
|    dation (Blue)  | 2. You have created an Espresso Dark color; consider adding a Reversed (White) logo variant for dark backgrounds.   |
|    (Next Step)    | 3. Your brand has sub-brands; consider defining a Brand Architecture strategy model in Stage 6.                    |
|                   | 4. Consider adding a typography scale for mobile screen widths in Visual Knowledge.                                |
|                   | 5. Consider adding Do/Don't copywriting examples to your Voice Principles.                                         |
+-------------------+--------------------------------------------------------------------------------------------------------------------+
| 4. Tip / Insight  | 1. Tip: Values represent what you are willing to sacrifice, not just what sounds pleasant on a wall.              |
|    (Purple)       | 2. Tip: A We Are / We Are Not pair works best when the 'Not' represents the natural excess of the trait.           |
|    (Pedagogy)     | 3. Tip: Aim for a 60-30-10 color balance (60% Dominant Neutral, 30% Surface, 10% Accent CTA).                     |
|                   | 4. Tip: Naming formulas prevent founders from arguing over arbitrary product names.                                |
|                   | 5. Tip: Monolithic architecture maximizes parent equity, while freestanding protects parent liability.             |
+-------------------+--------------------------------------------------------------------------------------------------------------------+
```

---

## 8. Guided Mode Interaction Patterns (Pedagogical UI Blocks)

The Guidance Layer will support 9 structured pedagogical UI block types:

1. **`WhyThisMatters`**: Explains the commercial and design justification for the field.
2. **`ThinkAboutThis`**: Cognitive prompt encouraging the designer to reflect before typing.
3. **`AskYourClient`**: Practical client interview questions.
4. **`WeakExample`**: Shows common, shallow beginner answers with a critique.
5. **`StrongExample`**: Shows a defensible, concrete, professional answer.
6. **`WatchOut`**: Highlights common traps and mistakes.
7. **`ConnectsTo`**: Shows downstream dependencies (e.g. *"This audience connects to Stage 3 Key Messages"*).
8. **`RevisitWhen`**: Outlines conditions that suggest returning to an earlier decision.
9. **`LearnMore`**: Optional deep-dive for advanced learners.

---

## 9. Guidance Content vs. Brand Data Boundary

```
+-----------------------------------------------------------------------------------+
| GUIDANCE CONTENT (`src/data/guidanceContent.ts`)                                  |
| - Pure static educational copy and pedagogical frameworks                         |
| - English and Indonesian translations                                             |
| - Generic examples (e.g. Northstar Coffee case study)                             |
| - Diagnostic rule heuristics                                                      |
| - 0% user brand data                                                              |
+-----------------------------------------------------------------------------------+
                                         |
                       Guides / Informs / Validates
                                         |
                                         v
+-----------------------------------------------------------------------------------+
| BRAND KNOWLEDGE MODEL (`Brand.modules.*`)                                         |
| - Authoritative user-authored brand data                                          |
| - Typed entities: `StrategicValueEntity`, `AudienceEntity`, `VisualRuleItem`, etc.|
| - 100% owned by the user                                                          |
+-----------------------------------------------------------------------------------+
```

---

## 10. Bilingual Curriculum Adaptation (EN / ID)

Guidance is conceptually adapted for Indonesian branding discourse, not mechanically translated:

```
+--------------------------+------------------------------+-------------------------------------------------------------+
| CONCEPT                  | ENGLISH PEDAGOGICAL FRAMING  | INDONESIAN CONCEPTUAL ADAPTATION                            |
+--------------------------+------------------------------+-------------------------------------------------------------+
| One-Line Description     | "One-Line Brand Essence"     | "Esensi Inti Merek (Bukan Slogan Iklan)"                    |
|                          | Focus on functional offer.   | Tekankan apa fungsi nyata bisnis, bukan slogan promosi.     |
+--------------------------+------------------------------+-------------------------------------------------------------+
| We Are / We Are Not      | "Trait Boundaries"           | "Batas Tegas Karakter (Karakter Asli vs Batas Ekses)"       |
|                          | Preventing trait excess.     | Menjelaskan karakter positif vs jebakan ekses yang dicegah. |
+--------------------------+------------------------------+-------------------------------------------------------------+
| Visual Rules             | "Prescriptive Constraints"   | "Aturan Proteksi Identitas (Pantangan & Keharusan)"         |
|                          | Legal protection of design.  | Panduan wajib agar vendor/klien tidak merusak desain.       |
+--------------------------+------------------------------+-------------------------------------------------------------+
| Brand Architecture       | "Portfolio Equity Topology"  | "Hierarki Merek & Hubungan Kepemilikan Visual"              |
|                          | Structural equity flow.      | Mengatur hubungan antara merek induk dan lini produk.       |
+--------------------------+------------------------------+-------------------------------------------------------------+
```

---

## 11. AI Tutor Boundaries

- **Permissible AI Assistance**:
  1. *Socratic Questioner*: Asking probing questions about client competitors and audience pain points.
  2. *Draft Refinement*: Suggesting clearer, punchier phrasing upon explicit user request.
  3. *Cross-Domain Auditor*: Identifying contradictions (e.g. trait is *Playful*, but typography is *Formal Legal Serif*).
  4. *Pedagogical Tutor*: Explaining branding concepts on demand.
- **Strictly Forbidden AI Behaviors**:
  1. *Synthetic Brand Fabrication*: Auto-generating values, colors, or audiences without user input.
  2. *Silent Mutation*: Modifying `Brand.modules.*` without explicit designer confirmation.
  3. *Overriding Decisions*: Forcing specific creative choices.

---

## 12. Curriculum Coverage Matrix

| Stage | Topic | Concept Taught | Brand Module | Beginner Risk | Guidance Pattern | Downstream Impact |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| **1** | Brand Essence | Core offer clarity | `overview` | Writing advertising slogan | WhyThisMatters, Weak/Strong | Frames category & target |
| **1** | Strategic Values | Operational guardrails | `strategy` | Listing generic clichés | AskYourClient, WatchOut | Dictates personality traits |
| **2** | Target Audience | Psychographics & pain points | `positioning` | Demographic-only profile | ThinkAboutThis, Weak/Strong | Targets key messages & touchpoints |
| **2** | Differentiation | Defensible market stance | `positioning` | Claiming table-stakes | WhyThisMatters, ConnectsTo | Justifies distinct visual codes |
| **3** | Personality Traits | Human brand character | `personality` | Unbounded adjectives | Weak/Strong, WatchOut | Governs aesthetic tone |
| **3** | Voice & Tone | Dynamic channel execution | `voiceTone` | Confusing with personality | ThinkAboutThis, ConnectsTo | Directs touchpoint copywriting |
| **3** | Key Messaging | Proof-backed customer claims | `messaging` | Unsubstantiated claims | WhyThisMatters, Weak/Strong | Populates marketing assets |
| **4** | Logo Variants | Functional execution roles | `visualKnowledge` | Single full-color mark only | WatchOut, ConnectsTo | Feeds clearspace rules |
| **4** | Color Roles | 60/30/10 semantic roles | `visualKnowledge` | Decorative color dumping | WhyThisMatters, Weak/Strong | Feeds contrast rules & UI |
| **4** | Typographic Scale | Proportional type hierarchy | `visualKnowledge` | Single font for everything | ThinkAboutThis, ConnectsTo | Dictates touchpoint layout |
| **5** | Visual Rules | Prescriptive constraints | `visualRules` | Vague, unenforceable advice | Weak/Strong, ConnectsTo | Protects touchpoint production |
| **5** | Naming Systems | Product taxonomy formulas | `brandNaming` | Chaotic arbitrary names | AskYourClient, Weak/Strong | Governs portfolio lines |
| **6** | Touchpoints | Real-world dielines & specs | `brandExpression` | Mockups with no specs | WhyThisMatters, WatchOut | Client delivery & production |
| **6** | Architecture | Portfolio coupling topology | `brandArchitecture` | Creating unneeded sub-logos | ThinkAboutThis, ConnectsTo | Multi-entity equity flow |

---

# Review Verdict & Confirmation

1. **Curriculum Completeness**: All 6 stages, 12 modules, and 14 pedagogical dimensions are fully specified.
2. **Cognitive Shift**: Explicitly teaches the mental shift from visual decorator to strategic brand identity designer.
3. **Frozen Baseline (`ff52bdf`)**: **100% UNTOUCHED & FROZEN**. No source code, types, or schemas modified.
4. **Ready for Phase 4.1 Implementation**: The curriculum is fully specified and ready to be encoded into `src/data/guidanceContent.ts` upon approval.
