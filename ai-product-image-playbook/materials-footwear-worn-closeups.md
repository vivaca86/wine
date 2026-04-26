# Footwear Materials (Worn Close-ups): Microscopic Visual Cues

Last updated: 2026-04-27

This file is for prompt-ready *micro* descriptors that survive product-page zoom. It focuses on footwear materials and construction details as they appear **when worn** (deformation, tension, contact, and finish changes under real pressure).

## How to Use This

- Treat the shoe like a real SKU with fixed construction details.
- For each close-up, describe **(1) material**, **(2) construction**, **(3) deformation**, **(4) light behavior**.
- Always include a “reject if” list (negative constraints + QA checks).

---

## Smooth Leather (Calf / Nappa / Finished Leather)

### Micro cues to request

- Fine, tight leather grain (micro-pores), not plastic smoothness.
- **Specular highlight roll-off** across curves (toe box, quarter, heel counter cover): highlight band should *bend* and *narrow/widen* with curvature.
- Flex creases only at real flex points:
  - ball-of-foot / metatarsal line (vamp flex)
  - lace/vamp transition on sneakers
  - toe spring region (subtle)
- Stitch holes: evenly spaced perforations; thread sits slightly proud; minimal but real puckering next to seams.
- Edges:
  - folded leather edge: thin turned edge with a crisp fold line
  - edge paint: thin, clean edge coat with subtle thickness and a sharp border

### Prompt fragments (copy/paste)

- “fine-grain smooth leather with realistic pore texture at macro scale”
- “subtle natural flex creases across the vamp at the ball-of-foot, not random wrinkles”
- “visible stitch holes with consistent spacing; thread tension slightly puckers leather along seam”
- “clean folded leather edge / clean edge paint line along the opening”

### Negative constraints

- “no plastic-looking leather, no waxy smooth surface, no melted folds”
- “no decorative random wrinkles; creases must match foot flex physics”
- “no stitching that changes spacing, direction, or thread thickness”

### Failure patterns → fix

- If leather becomes “flat smooth”: add “macro leather pore texture visible; micro-grain visible in highlights.”
- If creases appear on rigid zones (heel counter): add “heel counter stays structured; no collapse creases at the back.”

---

## Patent Leather (Coated High-Gloss)

### Micro cues to request

- Mirror-like specular highlights: sharp, high-contrast highlight bands with *clean edges*.
- Reflections should follow geometry (toe cap, quarters) and remain continuous across the surface.
- Realistic micro scratches: faint hairline scuffs are okay; avoid heavy cracking unless explicitly “aged.”
- Flex behavior: patent can show early micro-crease stress at the ball-of-foot; don’t place deep wrinkles everywhere.

### Prompt fragments

- “high-gloss patent leather with crisp mirror reflections and sharp specular highlight bands”
- “tiny hairline micro-scuffs only; no cloudy plastic haze”
- “creases only at the vamp flex line, minimal and physically plausible”

### Negative constraints

- “no cloudy plastic, no orange-peel texture, no matte patent”
- “no shattered cracking pattern unless explicitly worn/distressed”

### Reference anchors

- Patent leather is a **coated** leather type with a glossy varnish/finish; it’s prone to scratches and can crack with mishandling. (Use this to justify reflection + scratch behavior.)
  - https://saphir.paris/en/pages/leather-guide
  - https://www.saphirmedailledorshop.com/collections/patent-leather-care-guide

---

## Suede / Nubuck

### Micro cues to request

- Nap / pile direction is visible: subtle light/dark shifts across panels due to brushed fiber direction.
- Matte surface: highlights are soft and broad, not sharp.
- Edge fuzz: suede edges can look slightly softer than smooth leather edges.
- Scuff marks: suede “writes” (brushing changes tone); don’t treat scuffs like paint chips.

### Prompt fragments

- “short suede nap with visible directional pile; subtle tone shift when brushed”
- “matte suede surface; soft diffuse highlights”

### Negative constraints

- “no smooth leather shine on suede; no glittery speckle noise to fake texture”

### Reference anchors

- Suede nap direction affects how it reflects light and shifts tone.
  - https://www.sneakerpharm.com/blogs/news/understanding-suede-in-shoes
- Suede care is brush-first; brushing affects nap direction (useful mental model for ‘directional pile’ prompts).
  - https://www.allenedmonds.com/the-journal/made-here/our-shoe-care

---

## Canvas (Sneakers, Espadrilles)

### Micro cues to request

- Plain weave texture: interlaced threads with visible weave scale at macro zoom.
- Slight thread irregularities/slubs (subtle, not heavy).
- Stitching sits on top of fabric and slightly compresses it.
- Rubber foxing overlap: rubber strip overlaps upper edge with a clean boundary and a slightly rounded corner radius.

### Prompt fragments

- “plain-weave canvas upper with visible thread interlace at macro scale”
- “rubber foxing strip overlaps canvas with clean boundary line”

### Reference anchors

- Foxing is a separate rubber strip at the upper/sole join used on many sneakers.
  - https://www.heddels.com/dictionary/foxing/

---

## Mesh Uppers (Engineered Mesh)

### Micro cues to request

- Mesh pattern should be **structural**, not noise: hex/grid pores that vary by panel.
- Depth: you should see a slight shadow inside holes (especially under raking light).
- Reinforcement overlays can be heat-bonded (smooth film) or stitched; define which.

### Prompt fragments

- “engineered mesh upper with visible pore grid and real depth; shadow inside mesh holes”
- “heat-bonded overlay film with clean edge; no random stitching unless specified”

### Negative constraints

- “no moiré artifacts, no smeared mesh, no melted net texture”

---

## Knit Uppers (Flyknit / Primeknit / Sock-like Uppers)

### Micro cues to request

- Knit should read as yarn loops/paths, not printed texture.
- Zoned knit: tighter knit in support zones, looser knit for breathability.
- Seams are minimal; transitions are pattern changes, not stitched panel seams (unless the model has actual panel seams).

### Prompt fragments

- “digitally engineered knit upper; visible yarn structure; zoned knit density (support vs breathable zones)”
- “virtually seamless one-piece knit upper; no fake stitched panel lines”

### Reference anchors

- Nike Flyknit is a digitally engineered knitting process with targeted zones.
  - https://www.nike.com/flyknit/
  - https://about.nike.com/newsroom/releases/next-generation-flyknit-footwear-official-images
- adidas Primeknit is a seamless knitted upper with targeted zones.
  - https://www.adidas.com/us/primeknit-shoes

---

## Rubber Soles (Outsole / Midsole Sidewall / Outsole Edge)

### Micro cues to request

- Sidewall texture: matte rubber with fine microtexture, not glossy plastic.
- Mold seam / parting line: a subtle seam line can exist along the sidewall; it should be consistent and follow geometry.
- Edge “break”: outsole edge is usually slightly rounded, not razor sharp.
- Wear/contact: at the floor contact patch, show subtle compression and realistic shadowing.

### Prompt fragments

- “matte rubber sidewall with subtle mold seam line; clean, consistent outsole edge”
- “realistic floor contact compression and crisp contact shadow”

### Negative constraints

- “no wavy outsole edge, no melted tread, no inconsistent sole thickness left vs right”

### Reference anchors

- Injection-molded parts commonly show parting lines; flash is a quality defect.
  - https://en.wikipedia.org/wiki/Parting_line

---

## Stitching, Welts, and Sole Construction (Zoom-Level Cues)

### What to request

- Outsole stitch line (if present): consistent spacing; stitches sit like tiny beads; stitching follows the edge smoothly.
- Welt stitch (if present): visible stitch line around perimeter; stitch channel may be recessed.

### Prompt fragments

- “visible welt stitch around the perimeter; consistent stitch spacing; no broken stitch path”
- “outsole stitch line with evenly spaced ‘pearl’ stitches; no jitter”

### Reference anchors

- Outseaming / sole stitching concepts and tooling context.
  - https://shoemaking.wiki/Outseaming
- Blake stitch construction leaves clues at the sole edge / inside.
  - https://www.santosshoes.com/en/blog/handcrafted-shoes/blake-stitch
  - https://shoemaking.wiki/Blake_Stitching
- Example of Goodyear-welted product language (welt stitch, heat-sealed + sewn).
  - https://www.drmartens.com/eu/en_eu/101-stitch-smooth-leather-ankle-boots-black/p/26230001

---

## Heel Counter and Back Construction

### Micro cues to request

- Heel counter zone stays structured: minimal collapse; smooth curvature.
- Backstay seam: a vertical seam at the back with clean stitching; no wandering seam.

### Prompt fragments

- “structured heel counter with smooth curvature; no heel collapse”
- “clean backstay seam and stitching at heel; symmetric left and right”

### Reference anchors

- Heel counters are stiffeners that reinforce the heel area; materials vary (leather, thermoplastic, etc.).
  - https://shoemaking.wiki/Heel_Counter

---

## Universal QA Checks (Materials)

Reject/regenerate if any of these happen at zoom:

- Left/right shoes differ in grain, stitching, outsole shape, or edge finish.
- Stitches turn into blobs; stitch holes disappear.
- Patent reflections look like a foggy gradient.
- Suede looks like smooth leather with noise.
- Knit looks like airbrushed fabric with no yarn path.
- Rubber outsole edge warps or changes thickness along the perimeter.

