# Interaction Layers: Skin + Fabric + Shoe Pressure (Prompt Templates + QA)

Last updated: 2026-04-27

This file teaches a *layered prompting* pattern for ecommerce-quality worn footwear images. The goal is to render:

- the body correctly (bones/tendons/veins/pressure),
- the fabric correctly (nylon knit / sock knit, seams, sheen, tension),
- the shoe correctly (material texture, construction),
- and their **interaction** (compression, contact shadows, deformation).

---

## The “4-Block Prompt” (Copy/Paste Template)

Use this exact structure in close-up prompts:

1) **Body block (under-layer)**
- “realistic foot/ankle anatomy: subtle malleoli, toe knuckles, faint veins/tendons, natural tone variation”

2) **Fabric block (middle-layer)**
- Hosiery: “10–20 denier nude sheer nylon layer; visible knit microtexture; correct toe construction (shadow toe / sandal toe / reinforced toe)”
- Socks: “fine-gauge rib knit / terry loop cushioning / wool halo; shaped heel pocket; linked toe seam”

3) **Shoe block (outer layer)**
- “material-specific texture (smooth leather / patent reflections / suede nap / engineered knit / canvas weave); consistent stitching; outsole edge geometry”

4) **Interaction block (contact + physics)**
- “subtle compression at shoe opening/strap/collar; realistic tension lines; foot-floor contact flattening; crisp contact shadow; creases only at true flex points”

Then add **Reject if:** and list 4–8 failure conditions.

---

## Contact Map (Where Interaction Must Show)

Call out 2–4 zones per shot (do not describe everything every time):

- **Vamp edge / shoe opening**: pressure indentation line + slight bulge.
- **Toe box**: toe silhouettes only if plausible; flex crease at ball-of-foot.
- **Heel counter collar**: structured heel + collar pressure (no collapse).
- **Straps** (sandals): strap tension, tiny edge indentation.
- **Laces/eyelets** (sneakers): lace tension, tongue padding compression.
- **Outsole edge**: clean silhouette + consistent thickness; realistic floor contact.

---

## Examples (Prompt Fragments by Scenario)

### A) Pump + Nude Sheer Hosiery (macro vamp/opening)

- Body: “subtle ankle bones and toe knuckles visible beneath hosiery; natural tone gradients”
- Fabric: “15D nude sheer pantyhose; visible nylon knit microtexture; matte-satin sheen; shadow toe”
- Shoe: “smooth black calf leather pump; clean folded opening edge; consistent stitch holes; 5 cm heel”
- Interaction: “nylon compresses slightly at the pump opening; realistic pressure line; vamp flex creases only at ball-of-foot”

Reject if:

- hosiery disappears into blurred bare skin
- reinforced toe shows up when shadow toe requested
- vamp creases appear randomly near heel counter
- shoe opening edge looks melted or uneven

### B) Sneaker + Knit Upper + Crew Socks (side profile close-up)

- Body: “subtle Achilles tendon contour; natural skin sheen at ankle”
- Fabric: “ribbed crew socks; shaped heel pocket; linked toe seam; faint cuff indentation”
- Shoe: “engineered knit upper with visible yarn path (zoned knit); matte rubber outsole with subtle mold seam line”
- Interaction: “sock collar compressed by sneaker collar; folds match thickness; realistic floor contact compression”

Reject if:

- knit upper becomes smooth fabric noise
- outsole edge warps or changes thickness
- sock heel pocket missing/twisted

### C) Sandal / Open Toe + Sheer Hosiery (toe detail)

- Fabric: “sandal-toe sheer hosiery (open-toe appropriate); visible knit microtexture at instep; no reinforced toe block”
- Interaction: “toe outlines subtly visible under sheer fabric; strap pressure indentation is soft and realistic”

Reject if:

- reinforced toe cap appears
- toes merge or duplicate
- hosiery texture becomes fishnet

---

## Negative Constraints Library (Common Failures)

Use a small subset per prompt:

- “no beauty blur / no airbrushed legs”
- “no melted shoe edges, no warped outsole silhouette”
- “no printed fabric texture; knit must be structural and warp with anatomy”
- “no random seams on hosiery; only real toe/waist seams if present”
- “no floating feet; contact shadows must match weight distribution”

---

## QA Checklist (Layer Interaction)

Zoom inspection pass: reject/regenerate if any of these are true.

**Body layer failures**

- Missing malleoli / mannequin ankles
- Toes/joints anatomically incorrect
- Floor contact shadows inconsistent with pose

**Fabric layer failures**

- Hosiery is invisible (blurred bare leg)
- Hosiery looks like a printed overlay (doesn’t warp with anatomy)
- Sock knit becomes smooth leggings
- Toe seam/heel pocket missing when requested

**Shoe layer failures**

- Left/right mismatch
- Stitching becomes blobs or changes spacing
- Outsole edge warps or tread melts

**Interaction failures**

- Shoe edge cuts unrealistically into skin/fabric
- Creases appear on rigid zones (heel counter)
- Pressure cues missing everywhere (floaty look)

