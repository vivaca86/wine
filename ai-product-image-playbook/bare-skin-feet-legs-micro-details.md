# Bare Skin (Feet & Legs): Microscopic Detail Targets

Last updated: 2026-04-27

This file is for prompting and QA of **bare foot / bare leg** realism in worn footwear product imagery.

Goal: preserve commercial polish while keeping *real* anatomy (bones, tendons, veins, pores, micro hair, pressure).

---

## Core Layer Model

In prompts, describe these as separate layers so the model doesn’t “beauty-blur” everything:

1. **Skin surface layer**: pores, microtexture, vellus hair (where applicable), subtle specular sheen.
2. **Subsurface anatomy layer**: faint veins, tendons, bony landmarks, toe joint shapes.
3. **Pressure/contact layer**: compression at shoe openings/straps/cuffs + floor contact.

---

## Skin Surface Microtexture (Zoom-Level)

### What real skin shows in close-ups

- Microtexture (not perfectly smooth): tiny pores and shallow texture variation.
- Slight natural sheen: highlight changes with leg curvature and lighting direction.
- Tone variation: warmer/cooler patches, subtle mottling, and gradient toward ankles.

### Prompt fragments

- “commercial beauty styling but real skin texture at macro zoom; visible pores and microtexture”
- “natural tone variation and subtle sheen; not airbrushed”

### Negative constraints

- “no plastic skin, no waxy blur filter, no ‘beauty-smooth’ legs”

---

## Vellus Hair (Peach Fuzz) as a Realism Cue

### Where it should/shouldn’t appear

- Legs and ankles can show faint vellus hair in high-res close-ups (especially with rim light).
- Soles have **no hair**; tops of feet typically have minimal visible hair compared to legs.

### Prompt fragments

- “very subtle vellus hair (peach fuzz) visible only in highlights on lower leg/ankle; not furry”

### Negative constraints

- “no thick body hair; no hair on soles”

### Reference anchors

- Vellus hair definition and distribution.
  - https://my.clevelandclinic.org/health/body/23019-vellus-hair

---

## Veins and Tendons (Subsurface Anatomy)

### Visual targets

- **Dorsal foot / instep**: faint superficial veins can be visible under good light.
- **Tendons**: extensor tendons can subtly show as lines/cords on the top of the foot when toes are extended.
- Keep it subtle: these are realism cues, not medical diagrams.

### Prompt fragments

- “faint superficial veins on the top of the foot/ankle; subtle, not exaggerated”
- “subtle extensor tendon lines on the dorsum of foot when toes are extended”

### Negative constraints

- “no painted-on blue veins; no overly muscular tendon exaggeration”

### Reference anchors

- Dorsal venous arch (top-of-foot superficial veins).
  - https://www.healthline.com/human-body-maps/dorsal-venous-arch
- Extensor tendon anatomy context (use as justification for tendon-line realism cues).
  - https://orthovellum.com/extensor-tendons-of-the-foot/

---

## Bony Landmarks (Ankle Bones, Toe Knuckles)

### Visual targets

- **Malleoli** (inner/outer ankle bones): subtle asymmetry; lateral malleolus often sits slightly lower/more posterior.
- **Toe knuckles**: metatarsophalangeal (MTP) joints can create gentle bumps/creases, especially in dorsiflexion.

### Prompt fragments

- “visible ankle bone landmarks (medial/lateral malleolus) with natural subtlety”
- “toe knuckle shape cues (MTP joints) visible as gentle bumps under skin, not inflated”

### Negative constraints

- “no swollen balloon joints; no missing ankle bones (smooth mannequin ankle)”

### Reference anchors

- Foot/toe joint anatomy context (MTP joints).
  - https://www.kenhub.com/en/library/anatomy/metatarsophalangeal-joints
- Lateral malleolus/fibula landmark context.
  - https://www.kenhub.com/en/library/anatomy/fibula

---

## Toenails (When Visible)

### Visual targets

- Nail plate: thin, slightly translucent at the free edge; subtle shine; not thick acrylic.
- Cuticle area: clean but present; avoid “missing cuticle” look.
- If nail polish: consistent coverage with clean edge; no smeared color outside the nail.

### Prompt fragments

- “natural toenails with realistic nail plate translucency and subtle shine”

### Negative constraints

- “no extra nails, no duplicated nail beds, no smeared polish”

---

## Pressure and Contact: Shoe Openings, Straps, Floor

### Zones to explicitly describe

- **Shoe opening / vamp edge**: skin compression and slight bulge where the edge presses.
- **Sandal straps**: strap imprint and micro compression; strap tension should match pose.
- **Heel counter collar**: edge pressure at Achilles/heel collar; avoid sharp ‘knife edge’ cuts into skin.
- **Floor contact**:
  - standing: heel pad and ball-of-foot show subtle flattening
  - tiptoe: toes/ball carry weight; heel lifted with crisp shadow

### Prompt fragments

- “subtle skin compression at shoe opening/strap edges; realistic pressure marks and soft tissue bulge”
- “realistic floor contact: heel pad/ball-of-foot gently flattened; crisp contact shadow”

### Negative constraints

- “no floating feet; no zero-contact shadows; no strap passing through skin”

---

## Universal QA Checks (Bare Skin)

Reject/regenerate at zoom if:

- Skin is uniformly blurred (beauty filter) with no pores/microtexture.
- Veins/tendons look like painted graphics or are absent in a way that reads mannequin.
- Ankles are unnaturally cylindrical with no malleoli.
- Toes have incorrect joint segmentation or extra joints.
- Contact shadows don’t match weight distribution.

