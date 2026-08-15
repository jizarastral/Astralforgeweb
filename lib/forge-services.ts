export const FORGE = {
  name: "AstralForge AE",
  tagline: "From drawing to delivery",
  site: "https://astralforgeweb.onrender.com",
  shop: "https://astralae.myshopify.com/",
  email: "astralfconsulting@gmail.com",
  phones: {
    sales: "+971 55 445 8850",
    technical: "+971 50 836 4246",
    happiness: "+971 50 580 4276",
  },
  whatsapp: {
    sales: "971554458850",
    technical: "971508364246",
    happiness: "971505804276",
  },
};

export type ForgeService = {
  id: string;
  code: string;
  title: string;
  subtitle: string;
  body: string;
  /** Service photography only — never personal portraits */
  image: string;
};

/** Unsplash service photography (no personal / portrait images). */
const u = (id: string, w = 1200) =>
  `https://images.unsplash.com/${id}?auto=format&fit=crop&w=${w}&q=80`;

export const forgeServices: ForgeService[] = [
  {
    id: "drawings",
    code: "01",
    title: "Shop drawings & design",
    subtitle: "Every build begins as a line",
    body: "Shop drawings, coordination plans, and fabrication packages — clarity before steel, glass, or copper ever moves.",
    image: u("photo-1503387762-592deb58ef4e"), // blueprints / architecture plans
  },
  {
    id: "glass",
    code: "02",
    title: "Aluminium & glass fabrication",
    subtitle: "Facades forged in metal & light",
    body: "Curtain walls, windows, doors, spider glazing, and aluminium systems for architecture that must perform in the UAE climate.",
    image: u("photo-1486406146926-c627a92ad1ab"), // glass facade building
  },
  {
    id: "fitout",
    code: "03",
    title: "Interior fitouts",
    subtitle: "Spaces that feel finished",
    body: "Partitions, finishes, and premium spaces that respect architecture and programme — residential and commercial packages.",
    image: u("photo-1618221195710-dd6b41faaea6"), // modern interior
  },
  {
    id: "hvac",
    code: "04",
    title: "HVAC (G+20)",
    subtitle: "Climate engineered to G+20",
    body: "Chillers, FCUs, VRF, ducting and commissioning — comfort systems for day one and peak UAE summers.",
    image: u("photo-1621905251189-08b45d6a269e"), // HVAC / mechanical plant
  },
  {
    id: "structure",
    code: "05",
    title: "Structure & framing",
    subtitle: "From structure with confidence",
    body: "Framing intent, interfaces, and buildable detailing so architecture stands with confidence.",
    image: u("photo-1541888946425-d81bb19240f5"), // steel structure / construction
  },
  {
    id: "mep",
    code: "06",
    title: "MEP",
    subtitle: "Mechanical · Electrical · Plumbing",
    body: "Integrated MEP delivery — coordinated routes, load paths, and installation that matches the drawings.",
    image: u("photo-1581094794329-c8112a89af12"), // industrial / plant systems
  },
  {
    id: "fire",
    code: "07",
    title: "Fire systems",
    subtitle: "Protection that is non-negotiable",
    body: "Detection, suppression, alarms, and life-safety coordination designed to meet code and keep people safe.",
    image: u("photo-1558618666-fcd25c85cd64"), // fire protection / safety
  },
  {
    id: "security",
    code: "08",
    title: "Security & surveillance",
    subtitle: "Eyes on every critical edge",
    body: "CCTV, access control, intrusion — layered security for assets, people, and operations.",
    image: u("photo-1557597774-9d273605dfa9"), // security / CCTV
  },
  {
    id: "strongroom",
    code: "09",
    title: "Strong rooms",
    subtitle: "When zero compromise is the brief",
    body: "High-security enclosures, vault-grade detailing, and controlled access for critical spaces.",
    image: u("photo-1563986768609-322da13575f3"), // secure / vault concept
  },
  {
    id: "led",
    code: "10",
    title: "LED display",
    subtitle: "Facades that speak in light",
    body: "LED screens, media walls, and display systems — installation and integration for brands that need to be seen.",
    image: u("photo-1492684223066-81342ee5ff30"), // LED / media display
  },
  {
    id: "landscape",
    code: "11",
    title: "Landscaping",
    subtitle: "Grounds that complete the project",
    body: "Outdoor works, softscape interfaces, and site finishing that ties architecture to the land.",
    image: u("photo-1585320806297-9794b3e4eeae"), // landscaping
  },
  {
    id: "signage",
    code: "12",
    title: "Advertising & sign boards",
    subtitle: "Identity fixed in steel & light",
    body: "Signage, wayfinding, and advertising structures — fabricated and installed to brand standards across UAE sites.",
    image: u("photo-1561070791-2526d30994b5"), // signage / brand
  },
  {
    id: "it",
    code: "13",
    title: "IT solutions",
    subtitle: "Digital systems for real operations",
    body: "Web platforms, portals, automation, and support — the same precision we bring to site work, applied to software.",
    image: u("photo-1518770660439-4636190af475"), // technology / IT
  },
  {
    id: "print3d",
    code: "14",
    title: "3D printing",
    subtitle: "From idea to form",
    body: "Prototypes, mock-ups, and custom parts — additive manufacturing that accelerates decisions before full production.",
    image: u("photo-1581092160562-40aa08e78837"), // 3D printing / manufacturing
  },
  {
    id: "shop",
    code: "15",
    title: "Astral shop",
    subtitle: "Forge the everyday",
    body: "Curated gadgets, car, kitchen & home essentials. Same brand. Instant checkout. Ships worldwide.",
    image: u("photo-1441986300917-64674bd600d8"), // retail / shop products
  },
];

export const workSteps = [
  {
    step: "01",
    title: "Discover",
    body: "Site, scope, codes, and constraints — we listen before we draw.",
  },
  {
    step: "02",
    title: "Engineer",
    body: "Drawings, packages, and coordination across disciplines.",
  },
  {
    step: "03",
    title: "Build",
    body: "Fabrication, install, MEP, life-safety, and digital systems.",
  },
  {
    step: "04",
    title: "Deliver",
    body: "Commissioning, documentation, and support that lasts.",
  },
];
