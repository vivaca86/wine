# Interaction Layering: Skin + Fabric + Shoe (Prompt Grammar)

Last updated: 2026-04-27

This file formalizes a **layering grammar** for prompting realistic worn footwear ecommerce images. It is designed to prevent the two most common failure modes:

1) fabric treated as blur (hosiery/socks collapse into airbrushed skin)
2) fabric treated as decal (flat pasted texture with no tension or contact)

## Layer Stack Model (Always Name All Layers)

When something is worn on feet, describe three layers *explicitly*:

1. **Underlayer (body)**: anatomy + skin tone variation + subtle veins/tendons/toe shapes
2. **Fabric layer**: denier/knit/yarn + seams + reinforcement + sheen + fiber direction
3. **Contact layer**: shoe pressure + edge finishing + friction zones + deformation

If any layer is missing from the prompt, the model often “averages” it into blur.

## Hosiery + Pump (Nude sheer 10D/12D/15D/20D)

### Underlayer cues

- faint veins/tendons on instep + ankle
- ankle bones and toe knuckle contour (soft)

### Fabric cues

- denier explicitly (10–15D vs 20D)
- toe type explicitly (shadow toe vs sandal toe/unreinforced vs toeless)
- nylon sheen (matte vs satin) and fine knit fibers

### Contact cues

- hosiery tension at vamp opening (fabric continues into shoe)
- leather edge presses gently into fabric; contact shadow

Prompt block:

```text
Three-layer hosiery realism: (1) natural foot anatomy visible beneath fabric—faint blue-green veins on instep/ankle, subtle ankle bones and toe knuckle contours; (2) nude sheer 10–15 denier nylon layer with fine knit fibers and matte-satin sheen, explicitly a sandal-toe/unreinforced toe (or almost-invisible shadow-toe reinforcement) as specified; (3) pump interaction: low-cut vamp edge gently compresses the hosiery, fabric continues naturally into the shoe opening with slight tension and soft contact shadows. No beauty blur, no pasted texture, no sock-like toe cap.
```

Failure → fix:

- Hosiery becomes “bare skin blur” → add: `fine nylon knit fibers visible at macro scale`, `explicit denier`, `fabric sheen follows curvature`.
- Toe becomes a thick cap → add: `almost invisible shadow toe reinforcement`, `not opaque`, `not sock-like`.
- Fabric stops at vamp → add: `hosiery continues into shoe opening`.

## Socks + Sneaker (Ankle / crew / terry)

### Underlayer cues (when relevant)

- only subtle skin shape; avoid individual toes showing through thick socks

### Fabric cues

- knit structure + rib direction
- toe seam type (flat seam / hand-linked vs bulky seam)
- heel pocket shape (deep cup) and arch tension

### Contact cues

- collar compression into sock
- sock continues into shoe; boundary remains crisp

Prompt block:

```text
Three-layer sock realism: (1) underlying foot shape provides subtle tension (no visible bare toes through opaque cotton); (2) sock layer has real knit structure—vertical ribbing, visible yarn fibers, flat toe seam, defined heel pocket and arch tension; (3) sneaker collar presses into the sock with slight compression and tiny folds, sock continues into the shoe opening (not a painted cutoff), crisp boundary between fabric and shoe.
```

Failure → fix:

- Socks become painted bands → add: `visible knit loops/ribs aligned with leg`, `tiny shadowing from textile thickness`.
- Sock/shoe melts → add: `crisp boundary where collar presses`, `sock continues into opening`.
- No-show socks slip artifact → add: `deep heel pocket`, `heel grip strip (not visible, implied by fit)`.

## Thin Dress Socks + Loafers (Subtle translucency)

Thin dress socks can allow **very subtle** toe/knuckle shaping under tension (not explicit toes).

Prompt add-on:

```text
thin mercerized dress sock with fine rib knit, very subtle under-fabric shaping at toe knuckles (not individual toes), neat fit with no bulk
```

## Bare Foot + Sandal Straps (Compression is the product detail)

### Underlayer cues

- skin microtexture (pores), tone variation
- toenails if visible

### Contact cues

- strap edges press into skin with slight indentation
- no floating straps

Prompt block:

```text
Bare foot realism: natural skin microtexture and tone variation (not airbrushed), subtle anatomy at ankle bones and toe knuckles, toenails only where visible; sandal straps under tension press into skin with gentle indentation and contact shadows, physically plausible weight-bearing stance, no floating straps, no mannequin skin.
```

## Negative Constraints (Use as a standard footer)

```text
no beauty blur, no waxy mannequin skin, no pasted fabric texture, no melted sock-to-shoe boundary, no floating shoe straps, no random wrinkle noise, no impossible toe bending
```

## QA Checklist (Layering)

1. Can you identify the underlayer, fabric layer, and contact layer separately?
2. Does fabric show tension and follow curvature (not decal, not blur)?
3. Does fabric continue into shoe openings with believable boundaries?
4. Are pressure/compression shadows present at strap/vamp/collar contact?
5. Are toe seams / reinforcement / toe type consistent with the shoe openness?

## References

- Wolford “Shadow Toe” (almost invisible toe reinforcement) examples:
  - Pure 10 Tights: https://www.wolford.com/en-us/pure-10-tights-14497.4273.html
  - Individual 10 Tights: https://www.wolford.com/en-us/individual-10-tights-18382.outlet.html
- FALKE Shelina 12 DEN (“unreinforced toe” for open-toed shoes): https://www.falke.com/si_en/ts/falke-shelina/tights/
- Denier transparency categories (prompting ranges):
  - Girls and Nylons denier guide: https://www.girlsandnylons.com/guides/denier-guide.html
  - Journelle denier guide table: https://www.journelle.com/pages/hosiery-guide
- Sock toe seam vocabulary:
  - Hand-linked toe vs regular toe seams: https://www.icompressionsocks.com/is-seamless-toe-necessary/
  - Flat toe seam definition: https://julien-deluxe.com/en/pages/wat-is-een-flat-toe-seam
  - Toe seam comfort discussion: https://ecosox.com/blog/sock-talk-toe-seams/
- Heel counter definition (for rearfoot structure cues): https://shoemaking.wiki/Heel_Counter
