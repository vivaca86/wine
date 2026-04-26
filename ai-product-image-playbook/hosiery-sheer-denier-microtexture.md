# Nude Sheer Hosiery (10D / 15D / 20D): Microtexture + Skin-Under-Fabric

Last updated: 2026-04-27

This file is the *anti-blur* playbook for sheer hosiery. The failure mode to prevent: “sheer tights” prompts that produce blurred bare legs with no fabric layer.

Primary goal: describe hosiery as a **distinct translucent textile layer** over a detailed anatomical base, with correct toe construction and correct transparency by denier.

---

## Layer Model (Always Explicit)

Write prompts in 3 stacked layers:

1. **Skin layer (under)**: natural skin tone variation + faint veins/tendons/toe shapes.
2. **Hosiery layer (middle)**: denier, knit microtexture, sheen, toe construction (reinforced/shadow/sandal).
3. **Shoe-contact layer (over)**: tension/compression at shoe opening, vamp edge, toe box, heel counter.

If you omit layer 2, the model often “beauty-blurs” into fake bare legs.

---

## Denier Targets (10D vs 15D vs 20D)

Denier is not pure “opacity”; it’s a yarn weight metric and appearance changes with **stretch, lighting, and color**. Use it as a *visual instruction*.

### 10D (very sheer)

Expected look:

- Fabric is hard to see at a distance but appears at zoom as a **fine nylon knit microtexture**.
- Skin details remain readable: ankle bones, faint veins, tendon lines, toe knuckle shapes.
- Sheen can be “matte-satin” depending on product.

Prompt fragments:

- “10 denier nude sheer pantyhose; translucent nylon layer with visible micro knit texture at macro zoom”
- “skin details clearly visible under fabric (faint veins, tendons, ankle bones, toe shapes), not blurred”

### 15D (sheer)

Expected look:

- Fabric layer is more apparent; knit texture easier to see.
- Skin details still show, but with slightly softened contrast.

Prompt fragments:

- “15 denier nude sheer pantyhose with visible nylon knit layer; anatomy visible underneath”

### 20D (sheer-to-semi)

Expected look:

- More coverage; skin still visible in highlights, but reduced vein/tendon contrast.
- Toe outlines may still read depending on lighting and stretch.

Prompt fragments:

- “20 denier nude sheer tights; semi-sheer nylon layer; subtle anatomy visible beneath (not opaque tights)”

Reference anchors:

- Wolford tights guide (denier framing + styling cues).
  - https://www.wolford.com/our-tights-guide.html
- FALKE tights inspiration/denier guidance.
  - https://www.falke.com/us_en/inspiration/tights/
- Swedish Stockings denier guidance.
  - https://www.swedishstockings.com/pages/denier-guide

---

## Sheen (Matte vs Satin vs Glossy)

### Prompting sheen correctly

- Matte: minimal highlight; fabric still visible via microtexture and shadow.
- Satin: soft highlight band following curvature.
- Glossy: stronger highlight band; can reveal knit more in highlights.

Prompt fragments:

- “matte-satin nylon sheen (subtle highlight band) following leg curvature”
- “no oily gloss; no plastic shine”

---

## Toe Construction (Critical for Realism)

When toes are visible (sandals, open-toe heels) or when the toe area is close to the shoe opening, specify toe construction.

### Reinforced toe

- Denser/stronger toe zone; can appear slightly darker/more opaque.

### Shadow toe (nearly invisible reinforcement)

- Reinforcement exists but is designed to be subtle.

Reference anchor:

- Wolford Individual 10 product language references a “Shadow Toe” (near-invisible toe reinforcement).
  - https://www.wolfordshop.com/products/individual-10-tights-18382

### Unreinforced toe

- No visibly darker toe block; used for sandals/open shoes.

Reference anchor:

- FALKE Shelina (unreinforced toe) product concept.
  - https://www.falke.com/us_en/p/shelina-tights/40040_4109/

### Sandal toe / open toe

- Specifically intended for open-toe footwear; avoids a visible toe cap.

Reference anchors:

- Hosieree “Toes Explained” (reinforced vs sandal toe, etc.).
  - https://www.hosieree.com/pages/toes-explained
- Sandal toe explanation reference.
  - https://www.uktights.com/article/8-what-are-sandal-toe-tights

---

## Microtexture (How to Stop ‘Blurred Bare Leg’)

### What to explicitly demand

- Visible nylon knit: micro crosshatch/knit structure appears in highlights and midtones.
- Fabric tension gradients:
  - tighter at toes/ball-of-foot and ankle
  - smoother on shin
  - slight tension lines where shoe opening presses
- Knit should *follow form*: distortion around joints and edges.

### Prompt fragments

- “visible nylon knit microtexture (fine cross-knit) especially at ankle/instep; not airbrushed”
- “fabric tension around toes and shoe opening; slight distortion of knit over toe knuckles”

### Negative constraints

- “no beauty blur; no smooth skin filter; no ‘painted-on’ stocking texture”
- “no fishnet/large mesh pattern unless explicitly requested”

### Failure patterns → fixes

- If hosiery disappears entirely: add “fabric layer clearly visible at macro zoom; knit texture visible; not bare skin.”
- If hosiery becomes a printed overlay: add “knit texture warps with anatomy; tension increases at joints; no flat overlay.”
- If model outputs opaque tights: add “sheer pantyhose, translucent; skin details visible under fabric.”

---

## Shoe-Opening Interaction (Pumps, Loafers, Sneakers)

### What to ask for

- Nylon compresses slightly at shoe opening edge.
- Edge pressure creates a thin indentation line; no hard cutting.
- Toe outlines visible only if the shoe opening/pose makes it plausible.

Prompt fragments:

- “subtle nylon compression at the shoe opening; visible pressure line; realistic contact”
- “toe knuckle silhouettes subtly visible beneath sheer hosiery where the shoe opening reveals them”

---

## QA Checklist (Sheer Hosiery)

Reject/regenerate at zoom if:

- Legs look like smooth bare skin (no knit texture).
- Toe area has impossible construction (random darker patch, missing toes, duplicated toes).
- Reinforced toe appears when you requested sandal toe/unreinforced.
- Hosiery edge lines appear randomly on shin (fake seams).
- Veins/tendons are either totally missing (mannequin) or drawn like blue marker.

