# Wrinkle, Tension, And Pressure Study

Last updated: 2026-04-27

This file defines one of the most important realism rules for AI-generated worn product images:

> Every wrinkle must have a cause.

A fold, crease, tension line, compression mark, or fabric shift should be explainable by at least one physical source:

- compression;
- stretch;
- contact;
- gravity;
- seam tension;
- material thickness;
- body anatomy;
- motion/pose;
- shoe pressure;
- elastic pressure.

If a wrinkle is just a decorative AI line, regenerate or revise the prompt.

## Why Macro Inspection Matters

At normal viewing size, fake wrinkles can look acceptable. At product-page zoom or 4x upscale, they become obvious.

Zoom inspection should check:

- whether the wrinkle follows the material direction;
- whether the wrinkle appears where force is applied;
- whether the wrinkle size matches material thickness;
- whether compression and stretching happen on the correct side of the body or product;
- whether fabric continues naturally into shoe openings, cuffs, seams, or hems.

## Layer Rule

For worn footwear and legwear, always think in layers:

1. Body layer: skin, bones, tendons, toes, heel, ankle, calf.
2. Soft material layer: hosiery, socks, leggings, pants, skirt, lining.
3. Hard/structured product layer: shoe upper, sole, heel, collar, vamp, strap.
4. Contact layer: pressure, compression, friction, floor contact, shoe opening contact.

Wrinkles and tension should usually appear at transitions between layers.

## Hosiery / Stockings / Tights

### Thin Sheer Hosiery

Common wrinkle/tension zones:

- ankle bend;
- instep curve;
- toe base / beginning of toes;
- ball of foot;
- low-vamp pump opening;
- heel curve;
- reinforced toe or shadow-toe transition;
- behind knee if visible.

Expected behavior:

- fine tension lines rather than heavy folds;
- nylon fibers stretch along the foot/leg curve;
- skin anatomy remains visible but softened;
- subtle compression where shoe leather presses the stocking;
- tiny wrinkles near toe base if foot is bent;
- slight sheen changes where fabric stretches.

Prompt phrases:

```text
fine nylon tension lines following the foot curvature, subtle wrinkles at the ankle bend and base of toes, slight compression where the low-vamp leather edge presses the sheer stocking, fabric stretches smoothly over tendons and toe knuckles, wrinkle size matches thin 10-15 denier nylon
```

Reject if:

- hosiery has thick cloth folds like cotton;
- wrinkles are random dark cracks;
- nylon texture stops at the shoe opening;
- toe cleavage appears as black fracture lines;
- fabric looks like blur with texture pasted on top.

### Opaque Tights

Common zones:

- knee bend;
- ankle bend;
- toes inside shoes;
- heel curve;
- waistband and seams if visible;
- shoe opening.

Expected behavior:

- skin color mostly hidden;
- anatomy shown through contour, compression, and sheen;
- thicker folds than sheer hosiery, but still finer than leggings;
- fabric density increases where doubled/compressed.

Prompt phrases:

```text
opaque tights with visible knit structure, fabric tension revealing leg contour without showing skin color, denser folds at ankle bend, subtle compression at shoe opening, matte fabric sheen following calf and ankle shape
```

## Socks

Common wrinkle/tension zones:

- ribbed cuff;
- ankle bend;
- shoe collar contact;
- heel pocket;
- toe seam;
- ball of foot;
- arch area;
- top of foot under laces;
- sock edge in no-show styles.

Expected behavior by thickness:

- thin dress socks: fine wrinkles, slight sheen, under-foot shape subtly visible under tension;
- white medium socks: toe/heel forms may be implied by tension and tone variation, not fully see-through;
- cotton ankle socks: ribbing and knit loops remain visible, cuff gently compresses skin;
- terry sports socks: thicker folds, terry loops, padded compression;
- wool socks: fuzzy fibers, bulkier folds, warm matte texture.

Prompt phrases:

```text
sock wrinkles caused by shoe collar pressure and ankle bend, ribbed cuff gently compressing the skin, heel pocket stretched over the heel curve, toe area stretched by toe pressure with subtle underlying toe-tip volumes, knit loops and yarn fibers following the fabric tension
```

Reject if:

- sock texture is painted on;
- cuff floats above skin;
- cuff cuts too deeply unless compression sock;
- wrinkles ignore rib direction;
- shoe collar and sock melt together;
- toe seam becomes a thick rope;
- thin sock reveals bare toes too clearly.

## Bare Feet / Bare Legs

Common wrinkle/pressure zones:

- toe joints;
- ball of foot;
- heel contact;
- ankle bend;
- shoe straps;
- pump or loafer opening;
- sandal edges.

Expected behavior:

- skin compresses where straps or vamps touch;
- tendons and veins shift with pose;
- heel and toe pressure flatten slightly on floor;
- toe knuckles crease naturally when bent;
- polished ecommerce skin still has pores and tone variation.

Prompt phrases:

```text
natural skin compression where the shoe opening touches the foot, subtle toe-joint creases from bending, heel pressure flattening slightly against the floor, ankle tendons shifting with the pose, realistic pores and tone variation without beauty blur
```

## Shoes

### Pumps / Dress Shoes

Common zones:

- vamp flex line at ball of foot;
- metatarsal side compression;
- shoe opening tension;
- heel counter;
- heel tip and floor contact;
- outsole edge.

Expected behavior:

- flat standing pose: minimal vamp creasing;
- walking or tiptoe pose: shallow creases at ball-of-foot flex line;
- side compression near metatarsal area;
- leather pulls around low vamp opening;
- heel shadow matches lifted or grounded heel.

Prompt phrases:

```text
vamp creases exactly at the ball-of-foot flex line, shallow horizontal compression wrinkles caused by forefoot pressure, slight side compression at the metatarsal area, shoe opening tension following the foot shape, realistic heel shadow and floor contact
```

Reject if:

- creases appear on rigid heel counter randomly;
- leather folds look melted;
- cracks appear on new smooth leather;
- wrinkles do not correspond to foot pose;
- heel floats without shadow.

### Sneakers

Common zones:

- toe box flex;
- lace tension;
- tongue compression;
- collar padding;
- sole edge/floor contact;
- side panel flex;
- heel counter pressure.

Expected behavior:

- toe box may crease when stepping or crouching;
- laces pull the eyelet panels inward;
- tongue compresses under laces;
- collar presses against sock or ankle;
- sole compresses subtly at floor contact.

Prompt phrases:

```text
toe box creases caused by walking step, laces pulling eyelet panels with real tension, tongue compressed under laces, padded sneaker collar pressing into sock fabric, matte rubber sole slightly compressed at floor contact
```

Reject if:

- laces melt into upper;
- lace tension does not affect panels;
- sole floats;
- toe creases look like random scratches;
- left and right shoes deform differently without reason.

## Clothing Around Footwear

Common zones:

- pants hem resting on shoe;
- cropped trouser hem above ankle;
- skirt hem consistency;
- leggings ankle hem;
- socks under pants hem;
- boot shaft under pants.

Expected behavior:

- hem weight creates small folds where it touches shoe;
- stiff fabric forms angular folds;
- soft fabric drapes more fluidly;
- leggings stretch smoothly with seam/hem tension;
- pant length remains consistent across a product set.

Prompt phrases:

```text
trouser hem draping naturally above the shoe, small folds caused by fabric weight and ankle movement, hemline does not hide the product, fabric thickness and stiffness determine wrinkle size
```

## Universal Prompt Block

```text
Wrinkle realism: every wrinkle, fold, tension line, and compression mark must have a physical cause from the pose, material thickness, contact, gravity, seam tension, elastic pressure, or shoe pressure. Wrinkles follow material grain and body curvature. No random decorative wrinkles, no melted folds, no painted-on lines.
```

## Universal QA Questions

1. What caused this wrinkle?
2. Does the wrinkle appear where force/contact/stretch actually occurs?
3. Does wrinkle size match the material thickness?
4. Does the direction follow knit, grain, seam, or body curvature?
5. Does compression appear on the loaded side of the pose?
6. Does stretching appear on the tension side?
7. Does the material continue naturally into shoe openings, cuffs, seams, and hems?
8. At 4x zoom, does the wrinkle remain coherent or turn into random texture?

## Failure Fixes

If wrinkles are random:

```text
wrinkles only where compression, stretch, seam tension, or contact occurs; no decorative wrinkles
```

If hosiery wrinkles are too heavy:

```text
thin 10-15 denier nylon shows fine tension lines and tiny wrinkles, not thick cotton folds
```

If sock wrinkles are too flat:

```text
real textile thickness, yarn fibers casting tiny shadows, folds caused by shoe collar pressure and ankle bend
```

If leather creases are wrong:

```text
creases at ball-of-foot flex line only, shallow compression wrinkles caused by forefoot pressure, no cracks on new leather
```

If fabric melts into shoe:

```text
clear contact boundary where shoe presses the fabric, material continues into opening, compression visible without merging surfaces
```
