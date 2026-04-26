# Shoe Material + Construction Texture Study (Worn Ecommerce Images)

Last updated: 2026-04-27

This file is a microscopic visual study for **footwear materials and construction cues** that must hold up in ecommerce zoom. The aim is to turn material knowledge into prompt-ready fragments + QA checks.

## The Main Problem

AI commonly collapses real materials into generic “smooth shiny surface” or “random noise texture.” For product imagery, each material needs its **own visual language**:

- consistent microtexture (grain / nap / knit loops)
- physically plausible highlights (matte vs satin vs mirror gloss)
- believable seams, stitches, and edge finishing
- believable deformation under foot pressure

## Smooth Leather (Calf / Kid / Corrected Grain)

### What to look for

- fine grain with subtle pore pattern (not perfectly uniform)
- shallow flex creases at the ball-of-foot line (creases have direction)
- edges: folded/turned edge or edge paint depending on construction
- stitching: evenly spaced, thread slightly proud or slightly recessed depending on style

Prompt cues:

```text
fine tight leather grain (subtle pores, not plastic), shallow directional flex creases at the ball-of-foot, clean folded leather edge finishing, precise even stitching with slight thread relief
```

Negative constraints:

```text
no vinyl-plastic smoothness, no random wrinkle noise, no muddy stitched edges
```

## Patent Leather (High-gloss “mirror”)

### Visual behavior

- highlight edges are crisp; reflections read as “glass-like” rather than cloudy
- micro-scratches are more visible than on matte leather (specular surface)
- the surface reads smooth and sealed (a coated layer)

Prompt cues:

```text
mirror-gloss patent leather with crisp specular highlights and clear reflections, smooth sealed surface (not cloudy plastic), subtle micro-scratches visible in raking light, no matte leather grain
```

Common failure:

- patent leather rendered as dull plastic (diffuse, milky highlight)

Fix prompt:

```text
high-gloss lacquered finish, sharp highlight edges, reflection clarity, no haze
```

## Suede / Nubuck (Nap / pile direction)

### Visual behavior

- suede is directional: nap lies one way; it changes apparent color with stroke direction
- creases are *nap disruption* + *surface compression*, not shiny wrinkles

Prompt cues:

```text
short suede nap with visible directional pile, subtle color shift with nap direction, matte surface with no specular glare, crease zones show flattened nap (not shiny wrinkles)
```

Negative constraints:

```text
no sand-texture noise, no glossy highlights, no flat matte paint with zero nap
```

## Canvas + Foxing (Vulcanized sneaker look)

### Visual behavior

- canvas has a readable weave (especially in close-up)
- rubber foxing is a separate strip around the shoe where upper meets sole
- foxing has molded edges; can have a faint mold seam line; matte rubber

Prompt cues:

```text
visible canvas weave texture, rubber foxing strip wrapping the shoe where upper meets sole, matte vulcanized rubber sidewall with crisp molded edge, subtle mold seam line
```

## Knit Uppers (Flyknit / Primeknit-style)

### Visual behavior

- one-piece knit upper with varying knit density by zone (open knit vs tight knit)
- loops/strands are visible in macro; structure follows foot curvature

Prompt cues:

```text
engineered knit upper with visible knit loops and varying knit density by zone (tighter support areas, more open breathable areas), one-piece sock-like construction, knit structure follows foot curvature
```

Negative constraints:

```text
no printed knit texture, no random mesh noise, no melted knit-to-sole boundary
```

## Rubber Outsoles + Lugs (Grip language)

### Visual behavior

- rubber is usually matte; highlights are broad and soft (not glossy)
- lugs are molded with consistent geometry; edges can round with wear
- outsole edges can show tiny scuffs and micro dust in real product images

Prompt cues:

```text
matte molded rubber outsole with defined lug geometry, subtle wear rounding on lug edges, crisp outsole edge and sidewall, faint scuffing and dust at ground-contact points
```

## Heel Counters + Rearfoot Shape

Even when hidden, heel counters affect silhouette: heel cup stays structured and does not collapse like fabric.

Prompt cues:

```text
structured heel cup silhouette (heel counter support), rearfoot shape holds without collapsing, heel collar compresses slightly against sock/skin
```

## Stitching + Seams (Upper assembly)

### What to look for

- stitch spacing consistency
- stitch direction follows seam geometry
- thread thickness matches product type (dress vs work vs sneaker)
- seams have a physical ridge/valley (not painted lines)

Prompt cues:

```text
even stitch spacing with consistent tension, seams form a real ridge/valley with tiny shadow, thread thickness appropriate to the shoe style, no painted seam lines
```

## Construction Cues (Sole attachment)

Construction affects what you should see in close-ups:

- cemented: cleaner sidewall, fewer visible stitches
- welted/double-stitched: perimeter stitch lines, welt/rand visual separation

Prompt cues:

```text
visible perimeter welt/stitched construction with consistent stitch density (not decorative fake stitches), crisp boundary between welt and outsole
```

## Deformation Under Wear (Worn realism)

### Ball-of-foot flex

- creases concentrate near the flex line; they don’t appear randomly
- uppers compress slightly at metatarsal area under weight

Prompt cues:

```text
directional vamp creasing at the ball-of-foot flex line, slight side compression at the forefoot under weight, no random wrinkles on rigid areas
```

## QA Checklist (Materials)

1. Does each material read correctly at 100% zoom (grain / nap / knit loops)?
2. Are highlights physically correct (matte vs satin vs mirror gloss)?
3. Do seams and stitches have geometry (ridge/valley + tiny shadows), not paint?
4. Are outsole edges and lugs molded consistently (not amorphous blobs)?
5. Does the heel keep structure (counter support), not collapse?
6. Are creases directional and located at plausible flex zones?

## References

- Nike Flyknit technology (engineered knit zones): https://www.nike.com/flyknit/
- adidas Primeknit overview/category (knit upper concept): https://www.adidas.com/us/primeknit
- Foxing definition + close-up example: https://www.heddels.com/dictionary/foxing/
- Heel counter definition (shoemaking wiki): https://shoemaking.wiki/Heel_Counter
- Lugs definition (shoemaking wiki): https://shoemaking.wiki/Lugs
- Patent leather characteristics + care considerations: https://www.schuhe-lueke.com/guidebook/shoe-care/lacquered-leather/
- Suede nap direction and brushing guidance: https://www.bdpumps.com/why-suede-loafers-need-special-treatment-the-10-minute-maintenance-routine/
- Fabric nap / pile direction concept (maps well to suede behavior): https://stitched.info/tips/the-importance-of-fabric-nap-and-pile-direction/
- Vibram traction lug tech (lug shape focus): https://www.vibram.com/us/technology/lifestyle/TECH_traction-lug.html
- Vibram outsole design/compound vocabulary (AKU guide): https://www.aku.co.uk/aku-academy/vibram
- Boot construction methods + double-stitched explanation (Hanwag): https://www.hanwag.com/us/en-us/our-story/production/construction/
- Upper stitching as structural assembly (Rancourt): https://www.rancourtandcompany.com/blogs/blog/well-worn-paths-stitching
- Goodyear welting explained (Loake): https://blog.loake.com/history/goodyear-welting-explained/
- Upper seam types and how they look (Shoegazing): https://shoegazing.com/2023/03/26/guide-types-of-apron-front-and-split-toe-seams/
