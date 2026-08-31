import { FACTS } from "./site";
import type { OptionGroup, Sport } from "./types";

/** Minimum units per order (across all sizes). Single source: FACTS.moq. */
export const MIN_ORDER_QTY = FACTS.moq;

/* ------------------------------------------------------------------ *
   Sports catalogue — one configurable product per discipline.
 * ------------------------------------------------------------------ */

const P = {
  solid: { id: "solid", label: "Solid" },
  stripes: { id: "stripes", label: "Vertical stripes" },
  hoops: { id: "hoops", label: "Hoops" },
  chevron: { id: "chevron", label: "Chevron" },
  fade: { id: "fade", label: "Gradient fade" },
  split: { id: "split", label: "Split panel" },
  sash: { id: "sash", label: "Sash" },
  camo: { id: "camo", label: "Geo camo" },
};

type ImgVariant = "men" | "women" | "kid";
const VARIANT_LABEL: Record<ImgVariant, string> = {
  men: "Men's",
  women: "Women's",
  kid: "Youth",
};
function pics(slug: string, variants: ImgVariant[] = ["men", "women", "kid"]) {
  return variants.map((v) => ({
    src: `/products/${slug}-${v}.jpg`,
    label: VARIANT_LABEL[v],
  }));
}

export const SPORTS: Sport[] = [
  {
    slug: "handball",
    name: "Handball",
    discipline: "Indoor / Team Handball",
    tagline: "Grip, drive, finish.",
    blurb:
      "Lightweight sublimated handball shirts engineered for fast breaks and heavy contact. Reinforced shoulder seams keep shirts on backs through every wrestle in the six-metre.",
    aka: ["Team Handball", "Olympic Handball"],
    seoTitle: "Custom Handball Shirts & Kit",
    metaDescription:
      "Custom sublimated handball shirts and shorts for indoor clubs — bar-tacked underarm seams, four-way stretch and IHF-legible numbers dyed into the fabric. From $30/unit, min 3.",
    specifics: [
      {
        h: "Cut for the six-metre",
        p: "A close but not compressive body so a keeper can stretch and a pivot can absorb contact without the shirt riding up. Set-in sleeves with bar-tacked underarms take repeated grabs on the drive.",
      },
      {
        h: "Numbers that survive the season",
        p: "Player numbers are dyed into the fabric front and back to IHF-legible size, so there is nothing to peel after a season of hot washes. Sponsor and club marks print in the same pass at no added weight.",
      },
    ],
    faqs: [
      {
        q: "What size do handball numbers need to be?",
        a: "We print backs at roughly 20 cm tall and fronts at 10 cm, centred, which reads clearly for officials at national and regional level. Send your federation's spec in the request if it differs and we match it.",
      },
      {
        q: "Can you make matching goalkeeper shirts in a contrasting colour?",
        a: "Yes. Add the keeper as a separate line with its own colourway in your quote request — same design language, distinct enough for officials. There is no upcharge for a different sublimated colour.",
      },
      {
        q: "Which fabric holds up best to indoor contact?",
        a: "The Premium compression 210 g knit is the pick for senior handball — it resists snagging on the wrestle and gives light muscle support. Junior squads usually run the Pro AirDry 160 g for a lighter feel.",
      },
    ],
    unitBase: 30,
    silhouette: "tee",
    colorway: ["#1f6feb", "#0b2b6b", "#ccff00"],
    patterns: [P.solid, P.stripes, P.chevron, P.split, P.fade],
    hue: "#1f6feb",
    images: pics("handball"),
  },
  {
    slug: "netball",
    name: "Netball",
    discipline: "Court / Netball",
    tagline: "Own every third.",
    blurb:
      "Breathable netball tops and dresses with clean bib-friendly panels. Four-way stretch mesh under the arms so GA to GK, nothing rides up on the drive to the post.",
    aka: ["Court Netball"],
    seoTitle: "Custom Netball Dresses & Tops",
    metaDescription:
      "Custom netball dresses, tops and one-piece bodysuits with bib-friendly panels, four-way stretch underarm mesh and sublimated club colours. From $28/unit, minimum order 3.",
    specifics: [
      {
        h: "Bib-friendly by design",
        p: "Front and back panels are kept clear where the positional bib sits, so GS through GK your sponsor and crest are never hidden. The knit is smooth enough that hook-and-loop bibs don't pill the surface.",
      },
      {
        h: "Dresses, tops or one-pieces",
        p: "Every netball block comes as an A-line dress, a top to pair with your own skort, or a fitted one-piece bodysuit. Under-arm mesh gussets keep the shoulder free on the drive to the post.",
      },
    ],
    faqs: [
      {
        q: "Do you make netball dresses as well as tops?",
        a: "Yes — A-line dress, separate top, or a one-piece bodysuit, all from the same sublimated design. Pick the style in your quote request and mix styles across a squad if you need to.",
      },
      {
        q: "Will the print be damaged by positional bibs?",
        a: "No. The knit is smooth enough that hook-and-loop bibs don't catch, and because the graphics are sublimated into the fibre there is no raised print for a bib to lift.",
      },
      {
        q: "Can juniors and seniors share one design?",
        a: "They can. We hold your artwork on file and scale it across youth YS–YL and adult XS–3XL so an U11 side and a senior side look identical on court.",
      },
    ],
    unitBase: 28,
    silhouette: "tank",
    colorway: ["#e5484d", "#7a0c2e", "#ffd23f"],
    patterns: [P.solid, P.split, P.sash, P.fade, P.hoops],
    hue: "#e5484d",
    images: pics("netball"),
  },
  {
    slug: "hockey",
    name: "Field Hockey",
    discipline: "Turf / Field Hockey",
    tagline: "Short corners won on the shirt.",
    blurb:
      "Abrasion-resistant field hockey jerseys with a slim turf-ready cut. Sublimated club crests, sponsor boards and player numbers baked into the fabric — never a peel, never a crack.",
    aka: ["Hockey", "Indoor Hockey"],
    seoTitle: "Custom Field Hockey Jerseys",
    metaDescription:
      "Custom field hockey jerseys with an abrasion-resistant turf cut, reinforced hip and elbow zones, and sublimated crests, sponsors and numbers in one pass. From $32/unit, min 3.",
    specifics: [
      {
        h: "Turf-ready cut",
        p: "A slim but not tight body that stays put when you're bent over the ball, with a tighter-weave fabric across the hip and forearm where turf burn happens. Collar options from a clean crew to a two-button placket.",
      },
      {
        h: "Club, sponsor and initials in one pass",
        p: "Crest, sleeve sponsors, back-of-neck initials and squad numbers all sublimate together — no stitched badges to lift on the artificial surface, no re-order when a sponsor changes mid-season.",
      },
    ],
    faqs: [
      {
        q: "Is the fabric tough enough for water-based turf?",
        a: "Yes. We build hockey shirts on the tighter-knit Pro AirDry or compression fabric and reinforce the hip and elbow zones, the areas that see the most turf contact.",
      },
      {
        q: "Can we add players' initials above the crest?",
        a: "We can. Initials, a squad number and the club crest can all sublimate on the front. Send the roster in the configurator and we lay it out on the proof for your approval.",
      },
      {
        q: "Do you do indoor hockey shirts too?",
        a: "Yes — the same design scales to an indoor-cut shirt. Note 'indoor' in your request and we adjust the fit and fabric weight for the faster, warmer indoor game.",
      },
    ],
    unitBase: 32,
    silhouette: "tee",
    colorway: ["#2f8f5b", "#08331f", "#f5f4ef"],
    patterns: [P.solid, P.stripes, P.chevron, P.hoops, P.split],
    hue: "#2f8f5b",
    images: pics("hockey"),
  },
  {
    slug: "volleyball",
    name: "Volleyball",
    discipline: "Indoor & Beach / Volleyball",
    tagline: "Read. Set. Terminate.",
    blurb:
      "Low-friction volleyball jerseys that slide clean off the platform. Flatlock seams at the shoulder and a longer drop tail so digs in the back row don't untuck you.",
    aka: ["Indoor Volleyball", "Beach Volleyball"],
    seoTitle: "Custom Volleyball Jerseys",
    metaDescription:
      "Custom volleyball jerseys with flatlock shoulder seams, a longer drop tail and contrasting libero options — indoor and beach cuts from one design. From $29/unit, minimum 3.",
    specifics: [
      {
        h: "Stays tucked through the back row",
        p: "A longer drop tail and flatlock shoulder seams mean digs and dives don't untuck you or chafe under a passing platform. Fitted through the torso so it doesn't billow on the jump serve.",
      },
      {
        h: "Libero and captain marked correctly",
        p: "We build the libero shirt in a clearly contrasting colourway on the same design, and add the captain's underline to the front number where your league requires it.",
      },
    ],
    faqs: [
      {
        q: "Can you make a contrasting libero jersey?",
        a: "Yes, and it's expected — add the libero as a line in your quote with a contrasting colourway. The design stays the same so the team still looks like one unit.",
      },
      {
        q: "What number sizes do you use for volleyball?",
        a: "Fronts at about 15 cm and backs at about 20 cm, centred, which meets FIVB and most domestic league rules. We'll match a specific spec if you send it.",
      },
      {
        q: "Do you offer a beach volleyball cut?",
        a: "We do — a closer, lighter tank or crop built from the same sublimated artwork as your indoor kit. Specify 'beach' in the request.",
      },
    ],
    unitBase: 29,
    silhouette: "tee",
    colorway: ["#8b5cf6", "#2e1065", "#ccff00"],
    patterns: [P.solid, P.fade, P.split, P.chevron, P.sash],
    hue: "#8b5cf6",
    images: pics("volleyball"),
  },
  {
    slug: "rugby",
    name: "Rugby",
    discipline: "15s & 7s / Rugby Union & League",
    tagline: "Built to be grabbed.",
    blurb:
      "Heavyweight rugby jerseys with tight-weave stretch body, bonded collar and reinforced seams rated for the tackle contest. Tackle-twill numbers as standard, sublimated option for 7s speed kits.",
    aka: ["Rugby Union", "Rugby League", "Rugby Sevens"],
    seoTitle: "Custom Rugby Jerseys & Shirts",
    metaDescription:
      "Custom rugby jerseys built for the tackle contest — tight-weave stretch body, bonded collar, double-needle reinforced seams. Tackle-twill or sublimated numbers. From $40/unit, min 3.",
    specifics: [
      {
        h: "Rated for the contact area",
        p: "Tight-weave four-way-stretch body that's hard to grip, a bonded (not stitched) collar so there's nothing to tear at the ruck, and double-needle reinforced seams through the shoulder and side.",
      },
      {
        h: "15s, League or 7s",
        p: "Heavyweight bodies for forward-dominated 15s and League, or a lighter sublimated speed jersey for 7s. Tackle-twill numbers are standard; sublimated numbers keep weight down for tournament sides.",
      },
    ],
    faqs: [
      {
        q: "Will the seams hold up to scrummaging and rucking?",
        a: "That's what this jersey is built for. The body is a dense four-way stretch, the collar is bonded rather than stitched, and the shoulder and side seams are double-needle reinforced and bar-tacked.",
      },
      {
        q: "Tackle twill or sublimated numbers for rugby?",
        a: "Tackle twill (sewn) is the traditional, hard-wearing choice and our default for club rugby. Sublimated numbers are lighter and better for 7s squads carrying several jerseys to a tournament.",
      },
      {
        q: "Can you do a separate 7s tournament kit on the same design?",
        a: "Yes — we'll take your 15s design onto a lighter, more fitted 7s body and can produce home and away in one run so tournament sides are covered.",
      },
    ],
    unitBase: 40,
    silhouette: "polo",
    colorway: ["#0b0b0c", "#c8102e", "#f5f4ef"],
    patterns: [P.solid, P.hoops, P.stripes, P.sash, P.split],
    hue: "#c8102e",
    images: pics("rugby"),
    featured: true,
  },
  {
    slug: "cricket",
    name: "Cricket",
    discipline: "T20, ODI & Whites / Cricket",
    tagline: "Coloured kit and creams.",
    blurb:
      "Cricket shirts for coloured-clothing limited-overs kits and traditional playing whites. UV-treated fabric, ventilated back yoke and sublimated sponsor placement to league spec.",
    aka: ["T20 Cricket", "One Day Cricket", "Whites"],
    seoTitle: "Custom Cricket Shirts & Playing Kit",
    metaDescription:
      "Custom cricket shirts for coloured limited-overs kit and traditional whites — UV-treated fabric, ventilated back yoke, league-spec sponsor zones. Short or long sleeve. From $34/unit.",
    specifics: [
      {
        h: "Coloured kit and creams from one block",
        p: "The same fit gives you a coloured-clothing T20/ODI shirt and a traditional cream, short or long sleeve, with a ventilated back yoke for long days in the field.",
      },
      {
        h: "Sponsors to league spec",
        p: "Front, sleeve and non-dominant-shoulder sponsor zones are placed to your league's regulations, sublimated so they don't crack when the shirt is worn under a sweater or over a base layer.",
      },
    ],
    faqs: [
      {
        q: "Can one order cover both our coloured kit and our whites?",
        a: "Yes. List both on the quote request — a coloured T20/ODI shirt and a traditional cream — and we build them on the same fit so sizing carries across.",
      },
      {
        q: "Is the fabric okay for a full day in the sun?",
        a: "It's UV-treated poly with a ventilated back yoke and mesh side panels. Most club sides choose the Pro AirDry 160 g; add long sleeves for sun cover without extra heat.",
      },
      {
        q: "Where can we put sponsor logos on a cricket shirt?",
        a: "Chest, both sleeves and the non-dominant shoulder are the usual zones. Tell us your league's regulations in the request and we lay the proof out to match.",
      },
    ],
    unitBase: 34,
    silhouette: "polo",
    colorway: ["#0e7490", "#083344", "#ffd23f"],
    patterns: [P.solid, P.fade, P.sash, P.split, P.stripes],
    hue: "#0e7490",
    images: pics("cricket"),
  },
  {
    slug: "baseball",
    name: "Baseball",
    discipline: "Diamond / Baseball & Softball",
    tagline: "Stitched like the show.",
    blurb:
      "Full-button and two-button baseball jerseys with authentic tackle-twill lettering, sewn chest scripts and piping down the placket. Softball cuts and youth sizing on the same block.",
    aka: ["Baseball", "Fastpitch Softball", "Slowpitch Softball"],
    seoTitle: "Custom Baseball & Softball Jerseys",
    metaDescription:
      "Custom baseball and softball jerseys — full-button, two-button or pullover, with sewn tackle-twill chest scripts and numbers. Adult, fastpitch and youth cuts. From $36/unit, min 3.",
    specifics: [
      {
        h: "Full-button, two-button or pullover",
        p: "Authentic full-button front with a lined, bar-tacked placket, a two-button henley, or a clean pullover — all with the tackle-twill chest script and sewn numbers that read like the show.",
      },
      {
        h: "Baseball and softball together",
        p: "The same design produces a men's baseball cut and a women's fastpitch softball cut, plus youth sizing, so a whole program orders in one run.",
      },
    ],
    faqs: [
      {
        q: "Do you sew tackle-twill lettering or print it?",
        a: "Chest scripts, front numbers and back names/numbers are cut from tackle twill and sewn on with a satin stitch — layered, durable and authentic. Sublimated twill-look is available to save weight and cost.",
      },
      {
        q: "Can you match our program's softball and baseball kit?",
        a: "Yes — one design, produced in a baseball cut and a fastpitch softball cut with matching pants or shorts. Youth sizes come off the same block.",
      },
      {
        q: "How do full-button jerseys hold up?",
        a: "The placket is interlined and bar-tacked and the buttons are set on a reinforced band. It's the same construction used for adult league play and holds a season of slides and washes.",
      },
    ],
    unitBase: 36,
    silhouette: "tee",
    colorway: ["#b91c1c", "#450a0a", "#f5f4ef"],
    patterns: [P.solid, P.stripes, P.split, P.sash],
    hue: "#b91c1c",
    images: pics("baseball"),
  },
  {
    slug: "basketball",
    name: "Basketball",
    discipline: "Hardwood / Basketball",
    tagline: "Reversible or statement — your call.",
    blurb:
      "Basketball tanks in single-layer game weight or double-sided reversible mesh. Deep armholes, drop tail, and sublimated tackle-twill twill-look numbers that pass league rules.",
    aka: ["Basketball"],
    seoTitle: "Custom Basketball Jerseys",
    metaDescription:
      "Custom basketball jerseys — single-layer game weight or double-sided reversible mesh, deep armholes, drop tail and NFHS/FIBA-legal numbers. Matching shorts available. From $31/unit.",
    specifics: [
      {
        h: "Reversible or single-layer",
        p: "Choose a single-layer game jersey or a double-sided reversible in two colourways — light and dark from one garment for practice and scrimmage. Deep armholes and a drop tail keep it clear on the shot.",
      },
      {
        h: "Numbers that pass inspection",
        p: "Front and back numbers are sized and spaced to NFHS and FIBA rules with a solid single colour and clear contrast to the body. We flag anything in your design a table official would reject.",
      },
    ],
    faqs: [
      {
        q: "Can you make reversible practice jerseys?",
        a: "Yes — a double-sided reversible mesh with a different colourway and number set on each side. It's the most popular option for school and academy programs.",
      },
      {
        q: "Are your numbers legal for high-school and FIBA play?",
        a: "We size and space front and back numbers to NFHS and FIBA rules by default — solid colour, correct height, adequate contrast — and we'll tell you if a design choice would fail an official's check.",
      },
      {
        q: "Do you do matching shorts with side panels?",
        a: "Yes. Add 'jersey + shorts' in the configurator; the shorts carry the same sublimated design with contrast side panels and an inner brief option.",
      },
    ],
    unitBase: 31,
    silhouette: "tank",
    colorway: ["#f59e0b", "#7c2d12", "#0b0b0c"],
    patterns: [P.solid, P.fade, P.split, P.chevron, P.sash],
    hue: "#f59e0b",
    images: pics("basketball"),
    featured: true,
  },
  {
    slug: "soccer",
    name: "Soccer",
    discipline: "Football / Association Football",
    tagline: "The badge you play for.",
    blurb:
      "Match and training soccer jerseys with engineered ventilation zones, heat-sealed or sublimated crests, and sponsor placement to federation spec. Home, away and third in one project.",
    aka: ["Football", "Association Football"],
    seoTitle: "Custom Soccer & Football Jerseys",
    metaDescription:
      "Custom soccer (football) jerseys for match and training — engineered ventilation, sublimated or heat-sealed crests, sleeve badges to federation spec. Home, away and third in one run. From $29/unit.",
    specifics: [
      {
        h: "Home, away and third together",
        p: "Run all three strips off one design system in a single production window, so the whole season's kit arrives at once and numbers stay consistent across shirts.",
      },
      {
        h: "Crest and sponsor, your call",
        p: "Club crest and sponsors can sublimate flat into the shirt, or heat-seal with a slight raised finish for a more retail look. Sleeve patches and league badges are placed to federation spec.",
      },
    ],
    faqs: [
      {
        q: "Do you call it soccer or football?",
        a: "Both — it's the same sport and the same product. We work to association-football federation specs for crests, sponsors and sleeve badges wherever you play.",
      },
      {
        q: "Can we order home, away and third kits at once?",
        a: "Yes, and it's the efficient way to do it — one design system, one production run, consistent numbering across all three strips.",
      },
      {
        q: "Sublimated or heat-sealed crest?",
        a: "Sublimated sits flat in the fabric and never lifts — best for durability. Heat-sealed has a subtle raised edge for a retro-retail look. We'll show both on the proof if you're unsure.",
      },
    ],
    unitBase: 29,
    silhouette: "tee",
    colorway: ["#dc2626", "#7f1d1d", "#f5f4ef"],
    patterns: [P.solid, P.stripes, P.hoops, P.sash, P.fade, P.split],
    hue: "#dc2626",
    images: pics("soccer", ["women", "kid"]),
    featured: true,
  },
  {
    slug: "football",
    name: "American Football",
    discipline: "Gridiron / American Football",
    tagline: "Pads under, statement over.",
    blurb:
      "Gridiron jerseys cut for shoulder pads with pro, adult and youth fits. Sewn tackle-twill numbers and nameplates, stretch side panels, and a locked-down waist that won't grab facemasks.",
    aka: ["Gridiron", "Football"],
    seoTitle: "Custom American Football Jerseys",
    metaDescription:
      "Custom American football jerseys cut for shoulder pads — sewn tackle-twill numbers and nameplates, stretch side panels, gripped waist. Pro, adult and youth fits. From $42/unit, min 3.",
    specifics: [
      {
        h: "Cut for pads",
        p: "A wider shoulder yoke and pre-curved sleeves sit right over pads, with stretch side and underarm panels so nothing pulls when arms go up. The waist is tapered and gripped so it won't ride up and grab a facemask.",
      },
      {
        h: "Sewn numbers and nameplates",
        p: "Front, back and shoulder numbers plus the back nameplate are cut from tackle twill and double-stitched. Sublimated twill-look is an option for youth programs watching cost and weight.",
      },
    ],
    faqs: [
      {
        q: "Will the jersey fit over shoulder pads?",
        a: "It's designed to. The shoulder yoke is cut wide, the sleeves are pre-curved, and the side panels stretch — order your normal pad size and the fit accounts for the pads.",
      },
      {
        q: "Do you sew tackle-twill numbers for gridiron?",
        a: "Yes — front, back and sleeve/shoulder numbers and the back nameplate are layered tackle twill, double-stitched. It's standard for adult and high-school play; youth teams can opt for lighter sublimated numbers.",
      },
      {
        q: "Can you match youth and varsity teams in a program?",
        a: "We hold the design on file and produce it in youth, adult and a pro cut so every level of the program looks the same on the field.",
      },
    ],
    unitBase: 42,
    silhouette: "tee",
    colorway: ["#1d4ed8", "#f59e0b", "#f5f4ef"],
    patterns: [P.solid, P.split, P.sash, P.stripes],
    hue: "#1d4ed8",
    images: pics("football"),
  },
];

export function getSport(slug: string): Sport | undefined {
  return SPORTS.find((s) => s.slug === slug);
}

/* ------------------------------------------------------------------ *
   Option groups. Some are shaped by the sport silhouette.
 * ------------------------------------------------------------------ */

export const DESIGN_METHOD: OptionGroup = {
  id: "method",
  label: "Decoration method",
  helper: "How the colours and graphics get onto the fabric.",
  type: "single",
  defaultValue: "sublimation",
  options: [
    {
      id: "screenprint",
      label: "Screen print",
      delta: 0,
      desc: "Solid team colour body with printed logos. Best value for simple designs.",
    },
    {
      id: "sublimation",
      label: "Full sublimation",
      delta: 6,
      recommended: true,
      desc: "Edge-to-edge dye print. Unlimited colours, patterns and gradients, zero weight added.",
    },
    {
      id: "cutsew",
      label: "Cut & sew",
      delta: 18,
      desc: "Panels dyed then stitched — pro-grade construction and contrast piping.",
    },
  ],
};

export const FABRIC: OptionGroup = {
  id: "fabric",
  label: "Fabric",
  type: "single",
  defaultValue: "airdry",
  options: [
    { id: "polymesh", label: "Poly mesh 145g", delta: 0, desc: "Classic breathable training weight." },
    {
      id: "airdry",
      label: "Pro AirDry 160g",
      delta: 7,
      recommended: true,
      desc: "Moisture-wicking interlock with anti-odour finish.",
    },
    {
      id: "compression",
      label: "Premium compression 210g",
      delta: 14,
      desc: "Muscle-support stretch knit for contact sports.",
    },
  ],
};

export const KIT: OptionGroup = {
  id: "kit",
  label: "Kit pieces",
  type: "single",
  defaultValue: "jersey",
  options: [
    { id: "jersey", label: "Jersey only", delta: 0, recommended: true },
    { id: "jersey-shorts", label: "Jersey + shorts", delta: 19 },
    { id: "full", label: "Full kit + socks", delta: 34 },
  ],
};

export const FIT: OptionGroup = {
  id: "fit",
  label: "Fit block",
  type: "single",
  defaultValue: "standard",
  options: [
    { id: "standard", label: "Standard", delta: 0, recommended: true },
    { id: "athletic", label: "Athletic / slim", delta: 0 },
    { id: "womens", label: "Women's cut", delta: 0 },
    { id: "youth", label: "Youth block", delta: -4, desc: "Sizes YXS–YXL." },
  ],
};

export const TECHNIQUE: OptionGroup = {
  id: "technique",
  label: "Names, numbers & badges",
  helper: "Application method for player identification and team crests.",
  type: "single",
  defaultValue: "heat",
  options: [
    { id: "heat", label: "Heat-applied vinyl", delta: 0, recommended: true, desc: "Clean, light, quick turnaround." },
    { id: "twill", label: "Tackle twill (sewn)", delta: 9, desc: "Layered stitched fabric letters — the pro look." },
    { id: "embroidery", label: "Embroidered", delta: 13, desc: "Raised thread crests and nameplates." },
  ],
};

export const EXTRAS: OptionGroup = {
  id: "extras",
  label: "Add-ons",
  type: "multi",
  defaultValue: ["crest"],
  options: [
    { id: "crest", label: "Team crest / logo", delta: 5, recommended: true, desc: "Your badge, digitised and placed." },
    { id: "captain", label: "Captain's armband", delta: 6 },
    { id: "necktag", label: "Custom inner neck tag", delta: 3 },
    { id: "bag", label: "Matching matchday bag", delta: 14 },
  ],
};

/** Ordered option groups shown in the quote form — kept deliberately short. */
export function groupsFor(_sport: Sport): OptionGroup[] {
  return [FABRIC, DESIGN_METHOD, KIT, TECHNIQUE, EXTRAS];
}

/** Sizes offered in the quantity breakdown. */
export const SIZES = ["YS", "YM", "YL", "XS", "S", "M", "L", "XL", "2XL", "3XL"];
