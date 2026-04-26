# Bare Foot + Bare Leg Detail Study (Ecommerce Footwear Worn Images)

Last updated: 2026-04-27

This file is a microscopic visual study for **bare feet / bare legs** in ecommerce footwear images (sandals, strappy heels, slides, minimal sneakers styling). The goal is *commercially polished realism* that survives product-page zoom.

## The Main Problem

AI failures for bare feet/legs typically look like:

- waxy mannequin skin (no pores, no microtexture, no tone variation)
- “beauty blur” that erases all anatomy
- random veins drawn as dark lines (painted-on)
- toes and toenails that don’t match shoe openness
- no pressure/contact cues (foot floating inside the shoe)

A strong result shows **subtle anatomy + subtle surface texture + physically plausible pressure**.

## Surface Microtexture (What To Keep)

### Pores + micro-wrinkles

In close-up, bare foot/ankle skin is not a perfectly smooth gradient.

Prompt cues:

```text
subtle natural skin microtexture and pores (not airbrushed), faint micro-wrinkles near joints, realistic specular rolloff on skin, no plastic sheen
```

Reject if:

- the foot looks like a smooth plastic render
- the skin reads as a single flat color

### Vellus hair (“peach fuzz”) on legs and top-of-foot

On bare legs, fine vellus hair can be present and can catch light as a soft, sparse shimmer—not a “hairy leg” look.

Prompt cues:

```text
very fine vellus hair (peach fuzz) on the lower leg in side light, subtle and sparse, not stubble, not fuzzy noise
```

Notes:

- Vellus hair is fine, short body hair (“peach fuzz”).
- The *sole* of the foot does not have vellus hair, so don’t describe “peach fuzz” on the sole.

## Anatomy Landmarks (Don’t Smooth Away)

### Instep tendons + dorsal foot structure

Bare insteps often show very gentle tendon lines and structure under skin—especially in pointed-toe stance or when toes are extended.

Prompt cues:

```text
subtle instep tendon structure and natural foot contours, soft—not drawn lines—visible under skin, no beauty blur
```

Reject if:

- tendon lines are high-contrast “drawn on” strokes
- the entire foot top is a uniform cylinder

### Ankle bones

In realistic feet, ankle bones can be subtly visible depending on pose and body type.

Prompt cues:

```text
subtle ankle bone definition, realistic malleolus shape, gentle shadowing (not sharp sculpted edges)
```

### Toe knuckles (ball-of-foot / MTP joints)

Toe “knuckles” correspond to the metatarsophalangeal (MTP) joints at the ball of the foot. In many poses (especially pressure or toe extension), a gentle ridge/shape change can be visible.

Prompt cues:

```text
subtle toe knuckle (ball-of-foot) anatomy, gentle contour changes at the base of the toes, not exaggerated bumps
```

## Toenails (When Visible)

If the shoe exposes toes or the base of toes, toenails may appear.

Prompt cues:

```text
natural toenail shape and cuticle detail when visible, realistic nail thickness, no oversized glossy acrylic look unless requested
```

Reject if:

- toenails appear through closed shoes
- toenails float above toes or have wrong orientation

## Pressure + Contact Behaviors (Key for “Worn”)

### Shoe opening pressure

Edges that touch skin should show *gentle* compression.

Prompt cues:

```text
slight skin compression where straps/collar touch, soft indentation with realistic shadow, no harsh pinching
```

### Strap pressure (sandals / slingbacks)

The strap edge should not be a decal; it should press and slightly displace skin.

Prompt cues:

```text
strap edge presses into skin with subtle indentation, strap tension follows pose physics, realistic contact shadows
```

### Heel + toe ground contact

In standing poses, the plantar surface compresses where it contacts the ground (or insole). Even if the sole is not visible, that compression influences toe splay and the “settled” look.

Prompt cues:

```text
physically plausible weight-bearing stance, subtle toe/ball-of-foot compression cues, no floating foot
```

## Prompt-Ready Fragments (Mix-and-match)

### Bare legs + strappy sandal close-up

```text
bare foot and lower leg with realistic skin microtexture and pores (not airbrushed), faint veins and subtle tendon structure, gentle ankle bone definition, strap edges pressing into skin with slight indentation and contact shadows, natural toe shape and spacing, realistic weight-bearing stance
```

### Bare foot in a minimal sneaker (sockless styling)

```text
bare ankle and foot with subtle skin texture and tone variation, clean commercial lighting, natural anatomy at ankle bones and instep, shoe collar gently compressing skin, no plastic skin, no blur
```

## Negative Constraints (High-signal)

```text
no mannequin skin, no beauty blur, no over-smoothed gradients, no painted-on veins, no impossible toe bending, no floating straps, no toes visible through closed shoes
```

## QA Checklist (Barefoot)

1. Does the foot/ankle read as real human skin (microtexture present, not waxy)?
2. Are veins/tendons subtle and under-skin (not drawn-on lines)?
3. Do ankle bones and toe knuckles look plausible for the pose?
4. If toes are visible, are toenails and toe spacing anatomically coherent?
5. Do straps/collar edges press into skin with believable contact shadows?
6. Does the stance read as weight-bearing (no floating foot)?

## References

- Vellus hair (“peach fuzz”) definition and where it appears: https://my.clevelandclinic.org/health/body/23098-vellus-hair-peach-fuzz
- Metatarsophalangeal (MTP) joints overview (“toe knuckles”): https://www.kenhub.com/en/library/anatomy/metatarsophalangeal-mtp-joints
- Foot + ankle anatomy reference: https://www.physio-pedia.com/Comprehensive_Anatomy_of_the_Foot_and_Ankle
- Foot anatomy overview: https://www.kenhub.com/en/library/anatomy/ankle-and-foot-anatomy
