import type { OptionGroup, Sport } from "./types";

/** Minimum units per order (across all sizes). */
export const MIN_ORDER_QTY = 3;

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
