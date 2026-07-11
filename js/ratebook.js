/**
 * AstralForge Fit-Out Rate Book — updated July 2026 (UAE market).
 * Unit rates in AED (supply & install, mid-range commercial fit-out).
 * Based on original BOQ RAK 01 + expanded full fit-out scope.
 * Prices are indicative contractor rates; adjust per site survey.
 */
window.RATEBOOK = {
  currency: "AED",
  vatRate: 0.05,
  source: "Fit-Out Rate Book · Jul 2026 (UAE)",
  priceDate: "2026-07-11",
  notes:
    "Mid-range commercial office fit-out, supply & install. UAE market mid-2026. Excludes main contractor OH&P unless stated. Final quote subject to site survey & drawings.",
  items: [
    // ─── PRELIMINARIES ───────────────────────────────────────
    { id: 1, category: "PRELIMINARIES", description: "Site supervision, mobilisation & demobilisation of labour, tools & materials", uom: "LS", unitPrice: 3500, defaultQty: 1 },
    { id: 2, category: "PRELIMINARIES", description: "HSE, temporary protection of floors/walls/glass & debris management", uom: "LS", unitPrice: 1800, defaultQty: 1 },
    { id: 3, category: "PRELIMINARIES", description: "Shop drawings, as-built & project documentation", uom: "LS", unitPrice: 1500, defaultQty: 1 },
    { id: 4, category: "PRELIMINARIES", description: "Temporary power, lighting & site welfare (allowance)", uom: "LS", unitPrice: 1200, defaultQty: 1 },

    // ─── DEMOLITION / STRIP-OUT ───────────────────────────────
    { id: 10, category: "DEMOLITION WORKS", description: "Remove existing light fittings & AC diffusers; set aside for reuse/debris", uom: "M2", unitPrice: 18, defaultQty: 105 },
    { id: 11, category: "DEMOLITION WORKS", description: "Remove false ceiling / gypsum ceiling and cart away debris", uom: "M2", unitPrice: 22, defaultQty: 105 },
    { id: 12, category: "DEMOLITION WORKS", description: "Remove existing glass doors & fixed glass panels and cart away", uom: "M2", unitPrice: 85, defaultQty: 12 },
    { id: 13, category: "DEMOLITION WORKS", description: "Remove existing wallpaper and prepare surface for new finish", uom: "M2", unitPrice: 16, defaultQty: 80 },
    { id: 14, category: "DEMOLITION WORKS", description: "Remove existing wooden cladding / panelling and cart away debris", uom: "M2", unitPrice: 35, defaultQty: 20 },
    { id: 15, category: "DEMOLITION WORKS", description: "Remove existing carpet / carpet tiles and dispose", uom: "M2", unitPrice: 12, defaultQty: 105 },
    { id: 16, category: "DEMOLITION WORKS", description: "Remove existing floor tiles / vinyl and prepare substrate", uom: "M2", unitPrice: 28, defaultQty: 40 },
    { id: 17, category: "DEMOLITION WORKS", description: "Remove existing doors complete with frame (set aside / dispose)", uom: "Nos", unitPrice: 180, defaultQty: 8 },
    { id: 18, category: "DEMOLITION WORKS", description: "Dismantle gypsum partitions and cart away debris", uom: "M2", unitPrice: 25, defaultQty: 40 },
    { id: 19, category: "DEMOLITION WORKS", description: "General strip-out allowance / making good after demolition", uom: "LS", unitPrice: 2500, defaultQty: 1 },

    // ─── PARTITIONS & CIVIL ──────────────────────────────────
    { id: 30, category: "PARTITIONS & CIVIL", description: "100mm gypsum board partition, double layer both sides, glasswool insulation, metal stud frame", uom: "M2", unitPrice: 145, defaultQty: 59 },
    { id: 31, category: "PARTITIONS & CIVIL", description: "Gypsum partition single layer both sides (non-acoustic)", uom: "M2", unitPrice: 110, defaultQty: 20 },
    { id: 32, category: "PARTITIONS & CIVIL", description: "Fire-rated gypsum partition (1hr) with insulation", uom: "M2", unitPrice: 195, defaultQty: 15 },
    { id: 33, category: "PARTITIONS & CIVIL", description: "Insulated block wall with plastering both sides", uom: "M2", unitPrice: 165, defaultQty: 26 },
    { id: 34, category: "PARTITIONS & CIVIL", description: "Solid block wall 200mm with plastering both sides", uom: "M2", unitPrice: 145, defaultQty: 10 },
    { id: 35, category: "PARTITIONS & CIVIL", description: "Chasing walls/floor for services & making good (per LM chase)", uom: "LM", unitPrice: 35, defaultQty: 40 },
    { id: 36, category: "PARTITIONS & CIVIL", description: "Floor box opening: chip wall/floor, form recess & make good", uom: "Nos", unitPrice: 185, defaultQty: 6 },
    { id: 37, category: "PARTITIONS & CIVIL", description: "Concrete / screed repair & self-level compound (local)", uom: "M2", unitPrice: 45, defaultQty: 20 },
    { id: 38, category: "PARTITIONS & CIVIL", description: "Conduit & data outlet provision near each office entrance", uom: "Nos", unitPrice: 95, defaultQty: 8 },

    // ─── CEILING WORKS ───────────────────────────────────────
    { id: 50, category: "CEILING WORKS", description: "Gypsum board ceiling including framing, joints, cove light provision", uom: "M2", unitPrice: 125, defaultQty: 105 },
    { id: 51, category: "CEILING WORKS", description: "Fire-rated gypsum ceiling (server room / escape) including framing", uom: "M2", unitPrice: 165, defaultQty: 6 },
    { id: 52, category: "CEILING WORKS", description: "Mineral fibre / 60×60 ceiling tiles on T-grid (washroom grade)", uom: "M2", unitPrice: 95, defaultQty: 5 },
    { id: 53, category: "CEILING WORKS", description: "Acoustic ceiling tiles 60×60 on exposed grid", uom: "M2", unitPrice: 120, defaultQty: 40 },
    { id: 54, category: "CEILING WORKS", description: "Gypsum bulkhead / feature drop with paint finish ready", uom: "LM", unitPrice: 95, defaultQty: 25 },
    { id: 55, category: "CEILING WORKS", description: "Access panel in gypsum ceiling 600×600", uom: "Nos", unitPrice: 280, defaultQty: 4 },
    { id: 56, category: "CEILING WORKS", description: "Re-fix existing light fittings & AC diffusers after ceiling works", uom: "LS", unitPrice: 850, defaultQty: 1 },

    // ─── PAINTING WORKS (full scope) ─────────────────────────
    { id: 70, category: "PAINTING WORKS", description: "Surface preparation: sanding, crack filling, dust cleaning (walls/ceilings)", uom: "M2", unitPrice: 8, defaultQty: 510 },
    { id: 71, category: "PAINTING WORKS", description: "Full putty / skim coat (walls) — 2 coats ready for paint", uom: "M2", unitPrice: 22, defaultQty: 400 },
    { id: 72, category: "PAINTING WORKS", description: "Primer / sealer coat (walls & ceilings) — approved brand", uom: "M2", unitPrice: 10, defaultQty: 510 },
    { id: 73, category: "PAINTING WORKS", description: "Emulsion paint walls — 2 coats Jotun Fenomastic / equivalent premium", uom: "M2", unitPrice: 28, defaultQty: 400 },
    { id: 74, category: "PAINTING WORKS", description: "Emulsion paint ceilings — 2 coats white (Jotun / equivalent)", uom: "M2", unitPrice: 24, defaultQty: 110 },
    { id: 75, category: "PAINTING WORKS", description: "Complete wall & ceiling paint system (prep + primer + 2 coats emulsion)", uom: "M2", unitPrice: 38, defaultQty: 510 },
    { id: 76, category: "PAINTING WORKS", description: "Feature wall — designer emulsion / accent colour (2 coats)", uom: "M2", unitPrice: 45, defaultQty: 25 },
    { id: 77, category: "PAINTING WORKS", description: "Texture / stucco paint finish (supply & apply)", uom: "M2", unitPrice: 55, defaultQty: 15 },
    { id: 78, category: "PAINTING WORKS", description: "Moisture-resistant / washable paint for wet areas (2 coats)", uom: "M2", unitPrice: 32, defaultQty: 30 },
    { id: 79, category: "PAINTING WORKS", description: "Anti-fungal / kitchen paint (2 coats)", uom: "M2", unitPrice: 34, defaultQty: 20 },
    { id: 80, category: "PAINTING WORKS", description: "Enamel paint for doors, frames & metal (2 coats incl. primer)", uom: "M2", unitPrice: 42, defaultQty: 40 },
    { id: 81, category: "PAINTING WORKS", description: "Wood varnish / lacquer on joinery (2 coats)", uom: "M2", unitPrice: 48, defaultQty: 20 },
    { id: 82, category: "PAINTING WORKS", description: "Spray paint for metal frames / grills (2 coats)", uom: "M2", unitPrice: 40, defaultQty: 15 },
    { id: 83, category: "PAINTING WORKS", description: "Wallpaper supply & hang (mid-range commercial vinyl)", uom: "M2", unitPrice: 75, defaultQty: 40 },
    { id: 84, category: "PAINTING WORKS", description: "Wall graphics / branded vinyl mural (supply & apply)", uom: "M2", unitPrice: 120, defaultQty: 10 },
    { id: 85, category: "PAINTING WORKS", description: "Touch-up & final paint snagging after MEP / furniture install", uom: "LS", unitPrice: 950, defaultQty: 1 },
    { id: 86, category: "PAINTING WORKS", description: "Masking, protection & site cleaning related to painting", uom: "LS", unitPrice: 650, defaultQty: 1 },

    // ─── FLOORING ────────────────────────────────────────────
    { id: 100, category: "FLOORING", description: "Carpet tiles 50×50 commercial grade incl. underlay adhesive", uom: "M2", unitPrice: 78, defaultQty: 105 },
    { id: 101, category: "FLOORING", description: "Broadloom carpet commercial incl. underlay", uom: "M2", unitPrice: 95, defaultQty: 50 },
    { id: 102, category: "FLOORING", description: "Vinyl plank / LVT flooring commercial grade", uom: "M2", unitPrice: 85, defaultQty: 40 },
    { id: 103, category: "FLOORING", description: "Homogeneous vinyl sheet flooring (wet areas)", uom: "M2", unitPrice: 70, defaultQty: 15 },
    { id: 104, category: "FLOORING", description: "Ceramic floor tiles 60×60 incl. adhesive, grout & skirting", uom: "M2", unitPrice: 95, defaultQty: 30 },
    { id: 105, category: "FLOORING", description: "Porcelain floor tiles 60×60 premium incl. installation", uom: "M2", unitPrice: 125, defaultQty: 25 },
    { id: 106, category: "FLOORING", description: "Raised access floor system (standard pedestals + panels)", uom: "M2", unitPrice: 280, defaultQty: 20 },
    { id: 107, category: "FLOORING", description: "Epoxy floor coating (2 coats) plant/server room", uom: "M2", unitPrice: 55, defaultQty: 12 },
    { id: 108, category: "FLOORING", description: "Wooden skirting MDF / solid wood painted or finished", uom: "LM", unitPrice: 65, defaultQty: 85 },
    { id: 109, category: "FLOORING", description: "Aluminium / PVC skirting", uom: "LM", unitPrice: 38, defaultQty: 40 },
    { id: 110, category: "FLOORING", description: "Threshold strip / transition strip", uom: "LM", unitPrice: 45, defaultQty: 12 },

    // ─── DOORS & JOINERY ─────────────────────────────────────
    { id: 120, category: "DOORS & JOINERY", description: "Single leaf wooden swing door + frame + ironmongery (standard)", uom: "Nos", unitPrice: 3200, defaultQty: 8 },
    { id: 121, category: "DOORS & JOINERY", description: "Main entrance wooden door 1.0m × 2.6m high + frame + ironmongery", uom: "Nos", unitPrice: 4800, defaultQty: 1 },
    { id: 122, category: "DOORS & JOINERY", description: "Fire-rated timber door leaf + frame (30/60 min) + ironmongery", uom: "Nos", unitPrice: 4200, defaultQty: 2 },
    { id: 123, category: "DOORS & JOINERY", description: "Double leaf wooden door + frame + ironmongery", uom: "Nos", unitPrice: 5500, defaultQty: 1 },
    { id: 124, category: "DOORS & JOINERY", description: "Glass swing door 12mm tempered + patch fittings / frame", uom: "Nos", unitPrice: 3800, defaultQty: 2 },
    { id: 125, category: "DOORS & JOINERY", description: "Sliding glass door system (office / meeting room)", uom: "Nos", unitPrice: 4500, defaultQty: 1 },
    { id: 126, category: "DOORS & JOINERY", description: "Door closer heavy duty (approved brand)", uom: "Nos", unitPrice: 320, defaultQty: 8 },
    { id: 127, category: "DOORS & JOINERY", description: "Mortise lockset / lever handle set (commercial)", uom: "Nos", unitPrice: 280, defaultQty: 8 },
    { id: 128, category: "DOORS & JOINERY", description: "Built-in storage cabinet / low cupboard (per LM, melamine)", uom: "LM", unitPrice: 950, defaultQty: 6 },
    { id: 129, category: "DOORS & JOINERY", description: "Reception desk / counter (custom mid-range, per LM)", uom: "LM", unitPrice: 2800, defaultQty: 3 },
    { id: 130, category: "DOORS & JOINERY", description: "Workstation partition screen (fabric / glass, per LM)", uom: "LM", unitPrice: 420, defaultQty: 15 },
    { id: 131, category: "DOORS & JOINERY", description: "Wall panelling MDF / veneer (supply & install)", uom: "M2", unitPrice: 280, defaultQty: 20 },

    // ─── GLASS & ALUMINIUM ───────────────────────────────────
    { id: 140, category: "GLASS & ALUMINIUM", description: "Fixed glass partition 10–12mm clear tempered on aluminium frame", uom: "M2", unitPrice: 420, defaultQty: 25 },
    { id: 141, category: "GLASS & ALUMINIUM", description: "Frosted / film on glass partition", uom: "M2", unitPrice: 55, defaultQty: 15 },
    { id: 142, category: "GLASS & ALUMINIUM", description: "Double glazed office partition system (acoustic)", uom: "M2", unitPrice: 780, defaultQty: 12 },
    { id: 143, category: "GLASS & ALUMINIUM", description: "Aluminium door frame / shopfront profile (per LM)", uom: "LM", unitPrice: 185, defaultQty: 10 },
    { id: 144, category: "GLASS & ALUMINIUM", description: "Mirror wall / full height mirror install", uom: "M2", unitPrice: 165, defaultQty: 8 },

    // ─── ELECTRICAL WORKS ────────────────────────────────────
    { id: 160, category: "ELECTRICAL WORKS", description: "Twin switch socket with wiring (counter / workstation)", uom: "Nos", unitPrice: 145, defaultQty: 12 },
    { id: 161, category: "ELECTRICAL WORKS", description: "Electrical floor box complete (MK or equivalent) incl. install", uom: "Nos", unitPrice: 285, defaultQty: 6 },
    { id: 162, category: "ELECTRICAL WORKS", description: "DB modification / new ways & labelling", uom: "LS", unitPrice: 3200, defaultQty: 1 },
    { id: 163, category: "ELECTRICAL WORKS", description: "Conduiting for double-gang switch socket (server room)", uom: "LS", unitPrice: 280, defaultQty: 1 },
    { id: 164, category: "ELECTRICAL WORKS", description: "Double-gang switch sockets for server + relocate office sockets", uom: "LS", unitPrice: 1850, defaultQty: 1 },
    { id: 165, category: "ELECTRICAL WORKS", description: "Pull cable from electrical room + new breaker installation", uom: "LS", unitPrice: 4800, defaultQty: 1 },
    { id: 166, category: "ELECTRICAL WORKS", description: "LED panel light 60×60 recessed (supply & install)", uom: "Nos", unitPrice: 220, defaultQty: 10 },
    { id: 167, category: "ELECTRICAL WORKS", description: "Circular LED downlight recessed (supply & install)", uom: "Nos", unitPrice: 165, defaultQty: 36 },
    { id: 168, category: "ELECTRICAL WORKS", description: "Linear decorative LED light (washroom / feature)", uom: "Nos", unitPrice: 520, defaultQty: 1 },
    { id: 169, category: "ELECTRICAL WORKS", description: "LED strip / cove lighting complete with driver (per LM)", uom: "LM", unitPrice: 85, defaultQty: 30 },
    { id: 170, category: "ELECTRICAL WORKS", description: "Emergency exit light / exit sign (supply & install)", uom: "Nos", unitPrice: 380, defaultQty: 4 },
    { id: 171, category: "ELECTRICAL WORKS", description: "Spot / track light (supply & install)", uom: "Nos", unitPrice: 240, defaultQty: 8 },
    { id: 172, category: "ELECTRICAL WORKS", description: "1-gang 1-way switch (supply & install)", uom: "Nos", unitPrice: 55, defaultQty: 15 },
    { id: 173, category: "ELECTRICAL WORKS", description: "2-gang 2-way switch (supply & install)", uom: "Nos", unitPrice: 75, defaultQty: 10 },
    { id: 174, category: "ELECTRICAL WORKS", description: "Dedicated power circuit for AC / equipment (wiring + breaker)", uom: "Nos", unitPrice: 450, defaultQty: 4 },
    { id: 175, category: "ELECTRICAL WORKS", description: "Cable tray / trunking (per LM, mid-size)", uom: "LM", unitPrice: 65, defaultQty: 20 },

    // ─── DATA / ELV ──────────────────────────────────────────
    { id: 190, category: "DATA & ELV", description: "Cat6 data point complete (faceplate, cable, patching allowance)", uom: "Nos", unitPrice: 185, defaultQty: 16 },
    { id: 191, category: "DATA & ELV", description: "Telephone / voice point", uom: "Nos", unitPrice: 145, defaultQty: 8 },
    { id: 192, category: "DATA & ELV", description: "TV / HDMI point with conduit", uom: "Nos", unitPrice: 220, defaultQty: 2 },
    { id: 193, category: "DATA & ELV", description: "CCTV camera point (conduit + cabling only)", uom: "Nos", unitPrice: 280, defaultQty: 4 },
    { id: 194, category: "DATA & ELV", description: "Access control door point (cabling & prep only)", uom: "Nos", unitPrice: 450, defaultQty: 2 },
    { id: 195, category: "DATA & ELV", description: "24-port network patch panel & rack mounting (allowance)", uom: "LS", unitPrice: 1200, defaultQty: 1 },
    { id: 196, category: "DATA & ELV", description: "Wi-Fi AP cabling point", uom: "Nos", unitPrice: 165, defaultQty: 3 },

    // ─── HVAC WORKS ──────────────────────────────────────────
    { id: 210, category: "HVAC WORKS", description: "Ducting modification as per new layout (grills, VAV, relocation)", uom: "LS", unitPrice: 7500, defaultQty: 1 },
    { id: 211, category: "HVAC WORKS", description: "Supply & install new linear / square supply grill", uom: "Nos", unitPrice: 320, defaultQty: 8 },
    { id: 212, category: "HVAC WORKS", description: "Supply & install return air grill", uom: "Nos", unitPrice: 280, defaultQty: 6 },
    { id: 213, category: "HVAC WORKS", description: "VAV box supply & install (incl. controls interface)", uom: "Nos", unitPrice: 2800, defaultQty: 3 },
    { id: 214, category: "HVAC WORKS", description: "Flexible duct connection & balancing per outlet", uom: "Nos", unitPrice: 185, defaultQty: 12 },
    { id: 215, category: "HVAC WORKS", description: "Thermostat relocation / new digital thermostat", uom: "Nos", unitPrice: 450, defaultQty: 4 },
    { id: 216, category: "HVAC WORKS", description: "Split AC 1.5 TR supply & install (mid-range brand)", uom: "Nos", unitPrice: 3200, defaultQty: 2 },
    { id: 217, category: "HVAC WORKS", description: "Split AC 2.0 TR supply & install (mid-range brand)", uom: "Nos", unitPrice: 3800, defaultQty: 1 },
    { id: 218, category: "HVAC WORKS", description: "AC copper pipe & insulation (per LM)", uom: "LM", unitPrice: 95, defaultQty: 25 },
    { id: 219, category: "HVAC WORKS", description: "Fresh air / exhaust fan supply & install", uom: "Nos", unitPrice: 850, defaultQty: 2 },
    { id: 220, category: "HVAC WORKS", description: "Air balancing & commissioning report", uom: "LS", unitPrice: 1500, defaultQty: 1 },

    // ─── PLUMBING / WET AREAS ────────────────────────────────
    { id: 230, category: "PLUMBING", description: "Wash basin complete with mixer & trap (mid-range)", uom: "Nos", unitPrice: 950, defaultQty: 2 },
    { id: 231, category: "PLUMBING", description: "WC suite complete with cistern & seat (mid-range)", uom: "Nos", unitPrice: 1200, defaultQty: 2 },
    { id: 232, category: "PLUMBING", description: "Urinal with flush valve (mid-range)", uom: "Nos", unitPrice: 1100, defaultQty: 1 },
    { id: 233, category: "PLUMBING", description: "Kitchen sink with mixer (stainless, mid-range)", uom: "Nos", unitPrice: 850, defaultQty: 1 },
    { id: 234, category: "PLUMBING", description: "Water heater 50L supply & install", uom: "Nos", unitPrice: 950, defaultQty: 1 },
    { id: 235, category: "PLUMBING", description: "PPR / PEX hot & cold water piping (per LM)", uom: "LM", unitPrice: 55, defaultQty: 30 },
    { id: 236, category: "PLUMBING", description: "Drainage pipe modification / new point", uom: "Nos", unitPrice: 380, defaultQty: 4 },
    { id: 237, category: "PLUMBING", description: "Wall & floor tiling wet area (ceramic, incl. waterproofing prep)", uom: "M2", unitPrice: 110, defaultQty: 25 },
    { id: 238, category: "PLUMBING", description: "Cementitious waterproofing wet areas", uom: "M2", unitPrice: 45, defaultQty: 25 },

    // ─── FIRE & LIFE SAFETY ──────────────────────────────────
    { id: 250, category: "FIRE & SAFETY", description: "Smoke detector point (cabling & base; device if included mid-range)", uom: "Nos", unitPrice: 320, defaultQty: 6 },
    { id: 251, category: "FIRE & SAFETY", description: "Manual call point", uom: "Nos", unitPrice: 280, defaultQty: 2 },
    { id: 252, category: "FIRE & SAFETY", description: "Fire alarm sounder / strobe", uom: "Nos", unitPrice: 350, defaultQty: 3 },
    { id: 253, category: "FIRE & SAFETY", description: "Fire extinguisher 6kg CO2 or ABC + bracket", uom: "Nos", unitPrice: 220, defaultQty: 4 },
    { id: 254, category: "FIRE & SAFETY", description: "Sprinkler head relocation / new head (allowance)", uom: "Nos", unitPrice: 380, defaultQty: 6 },
    { id: 255, category: "FIRE & SAFETY", description: "Fire stopping / compartmentation sealing (allowance)", uom: "LS", unitPrice: 1800, defaultQty: 1 },

    // ─── BLINDS & SOFT FURNISHINGS ───────────────────────────
    { id: 270, category: "BLINDS & SOFT", description: "Vertical blinds commercial (per M2 fabric area)", uom: "M2", unitPrice: 85, defaultQty: 20 },
    { id: 271, category: "BLINDS & SOFT", description: "Roller blinds blackout / sunscreen (per M2)", uom: "M2", unitPrice: 110, defaultQty: 15 },
    { id: 272, category: "BLINDS & SOFT", description: "Motorised roller blind (per unit mid-size)", uom: "Nos", unitPrice: 950, defaultQty: 2 },

    // ─── CLEANING & HANDOVER ─────────────────────────────────
    { id: 280, category: "CLEANING & HANDOVER", description: "Post-construction deep cleaning", uom: "M2", unitPrice: 12, defaultQty: 120 },
    { id: 281, category: "CLEANING & HANDOVER", description: "Final snagging & defect rectification visit", uom: "LS", unitPrice: 1200, defaultQty: 1 },
    { id: 282, category: "CLEANING & HANDOVER", description: "O&M manuals, warranties & handover pack", uom: "LS", unitPrice: 800, defaultQty: 1 },
    { id: 283, category: "CLEANING & HANDOVER", description: "As-built drawings (architectural + MEP mark-ups)", uom: "LS", unitPrice: 1500, defaultQty: 1 }
  ]
};
