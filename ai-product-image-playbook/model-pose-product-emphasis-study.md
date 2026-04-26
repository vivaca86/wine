# Model Pose And Product Emphasis Study

Last updated: 2026-04-27

This file defines how AI models should pose and be framed for ecommerce product images, especially for the shop's primary new-product categories:

1. Shoes
2. Socks
3. Hosiery / tights / leggings

The purpose is to make the model support the product, not steal attention from it. A strong model pose helps the customer imagine wearing the item while preserving product detail and trust.

## Core Principle

The product decides the pose.

- If the product is a shoe, the pose must make the shoe easy to inspect.
- If the product is a sock, the pose must show cuff, knit, toe/heel fit, and shoe interaction.
- If the product is hosiery/tights/leggings, the pose must show transparency, sheen, leg line, compression, and fabric behavior.

A beautiful model is not enough. The model must sell the product.

## Model Visual Direction

The model should have polished K-pop idol-level visual quality, but the result should still feel like a natural ecommerce model image.

Required:

- attractive, polished, fashion-forward appearance;
- healthy skin and natural body proportions;
- clean grooming and styling;
- expressive but restrained commercial posing;
- no resemblance to any specific real celebrity or public figure;
- not over-airbrushed, waxy, plastic, or fantasy-like;
- believable body mechanics.

Prompt phrase:

```text
polished K-pop idol-level visual styling, natural ecommerce model presence, attractive but believable, not resembling any real person, realistic skin texture and body proportions, commercial fashion posing that supports the product
```

## Body And Fit Priorities By Product

### Shoes

Most important model areas:

- feet;
- ankles;
- calves;
- leg line;
- balance and stance;
- garment hem placement.

The face matters in full-body shots, but the product should remain the hero.

### Socks

Most important model areas:

- ankle;
- lower calf;
- heel;
- toe area;
- shoe collar contact;
- calf/ankle proportions.

### Hosiery / Tights / Leggings

Most important model areas:

- leg line;
- ankle;
- knee;
- calf;
- foot top / instep;
- shoe opening;
- fabric sheen and transparency.

## Camera And Framing Rules

### Full-body Shots

Use for:

- styling context;
- outfit coordination;
- customer imagination;
- brand tone.

Rules:

- Full body visible head to toe.
- Feet must never be cropped.
- Use a slightly low camera angle when shoes are the product.
- One foot should usually be forward or angled outward.
- Shoes must remain large enough to inspect.
- Clothing must not hide the product.
- Background should be clean and not distract from product.

Prompt phrase:

```text
full body visible from head to toe, feet not cropped, slightly low camera angle, one foot forward so the shoes remain the visual priority, outfit supports the footwear, clean Korean ecommerce studio styling
```

### Below-knee Shots

Use for:

- shoe detail;
- sock detail;
- legwear detail;
- hemline and shoe interaction.

Rules:

- Crop from below knee or knee down.
- Shoes/socks/hosiery occupy a large part of frame.
- Show floor contact and shadow.
- Show garment hem if relevant.
- Avoid awkward amputated crops at joints.

Prompt phrase:

```text
below-knee product detail shot, crop from knees down, product occupies a large part of frame, natural ankle posture, visible floor contact and soft shadow, hemline positioned to reveal the product
```

### Ankle-down Close-ups

Use for:

- shoe close-ups;
- sock construction;
- hosiery/skin-under-fabric details;
- pressure and contact inspection.

Rules:

- Whole pair should usually be visible unless true macro inspection is requested.
- Shoe toes and heels must not be cropped.
- Camera should be close enough for material detail.
- Pose must reveal product construction.
- Use for 4x upscale stress tests.

Prompt phrase:

```text
ankle-down close-up product shot, full pair completely visible, no cropped toes or heels, close enough for material inspection, realistic floor contact, crisp micro-details for fabric, skin, and shoe construction
```

## Shoe Product Poses

### Standing Foot-forward Pose

Use for:

- default full-body shoe styling;
- below-knee shoe detail;
- sneakers, loafers, pumps, boots.

Behavior:

- front foot becomes larger and more visible;
- toe shape and side panels are easier to inspect;
- body remains natural and stable.

Prompt phrase:

```text
one foot placed forward and slightly outward to showcase toe shape, side profile, sole edge, and product volume; natural weight distribution and believable floor contact
```

### Walking Step Pose

Use for:

- dynamic styling;
- side profile;
- sole and heel reveal;
- sneaker/pump/loafer movement.

Behavior:

- front foot flat or rolling through step;
- rear heel may lift naturally;
- shoe flex and garment movement become visible.

Prompt phrase:

```text
gentle walking step toward camera, front foot extended and turned slightly outward, rear heel lightly raised, shoe flex and floor contact physically plausible, product remains sharp and emphasized
```

### Tiptoe / Heel-raised Pose

Use for:

- pumps;
- loafers;
- flex/crease testing;
- hosiery and shoe opening pressure.

Behavior:

- heel lifted high;
- ball of foot and toes carry weight;
- vamp creases at flex line;
- hosiery/sock tension increases at toe and ball of foot.

Prompt phrase:

```text
one foot in a strong natural tiptoe pose, heel lifted high off the floor, supported by ball of foot and toes, realistic forefoot pressure, vamp creases at ball-of-foot flex line, sock or hosiery tension visible around toe base and shoe opening
```

### Side Profile Pose

Use for:

- heel height;
- sole thickness;
- sneaker side panels;
- pump silhouette;
- boot shape.

Prompt phrase:

```text
low side-profile angle, full shoe silhouette visible, toe shape, arch curve, heel height, sole edge, and floor contact clearly shown
```

## Sock Product Poses

### Sneaker + Ankle Sock Crop

Use for:

- ankle socks;
- sports socks;
- casual product pages.

Show:

- cuff height;
- ribbed cuff;
- ankle compression;
- sneaker collar contact;
- toe seam if close enough.

Prompt phrase:

```text
ankle sock product crop with sneaker collar pressing naturally into the sock, ribbed cuff around ankle bone, visible knit fibers, subtle cuff compression, sock material continuing inside the shoe opening
```

### Crew Sock Standing Pose

Use for:

- fashion socks;
- ribbed socks;
- sports socks;
- socks sold as visible styling items.

Show:

- lower calf column;
- rib direction;
- consistent sock height;
- shoe pairing.

Prompt phrase:

```text
crew socks visible above sneakers, vertical rib knit following lower calf and ankle curve, consistent sock height on both legs, one foot forward, shoe collar and sock folds naturally interacting
```

### No-show Sock Loafer Pose

Use for:

- no-show socks;
- sockless styling.

Show:

- very low edge only if visible;
- heel edge seated;
- no slipping;
- shoe opening contact.

Prompt phrase:

```text
no-show sock mostly hidden inside the loafer, only a tiny clean edge visible at heel or side opening, deep heel pocket seated in place, shoe opening pressing gently against sock fabric, not bare skin
```

## Hosiery / Tights / Leggings Product Poses

### Low-vamp Pump Close-up

Use for:

- nude sheer pantyhose;
- toe visibility;
- shoe opening pressure;
- denier testing.

Show:

- instep veins/tendons through fabric;
- low vamp edge pressing stocking;
- toe cleavage only subtly if appropriate;
- nylon continues into shoe opening.

Prompt phrase:

```text
low-vamp pump close-up showing sheer hosiery continuing into the shoe opening, slight leather pressure and nylon tension, subtle base-of-toe contours near the vamp, skin-under-fabric details visible but softened
```

### Leg Line Full-body Pose

Use for:

- tights;
- leggings;
- stockings;
- outfit styling.

Show:

- leg line;
- fabric sheen;
- transparency/opacity;
- shoes paired with legwear.

Prompt phrase:

```text
full-body legwear styling pose with clean leg line, shoes visible head-to-toe framing, fabric sheen following calf and thigh contours, product color and opacity clearly readable, natural ecommerce model pose
```

### Below-knee Hosiery/Tights Detail

Use for:

- denier comparison;
- black/white/nude legwear;
- ankle and shoe contact.

Prompt phrase:

```text
below-knee hosiery detail shot, ankle and foot visible, fabric tension at ankle bend and shoe opening, denier and color clearly readable, shoe pairing supports the legwear product
```

### Leggings Ankle Hem Pose

Use for:

- leggings paired with sneakers/boots;
- ankle hem detail;
- compression and fabric thickness.

Prompt phrase:

```text
leggings ankle detail with stretch fabric tension, seam or hem structure visible, fabric compression around ankle, sneaker or boot collar interacting naturally with the legging hem
```

## Clothing And Hem Rules

Clothing must support the product.

For shoes:

- trousers should not cover the product;
- cropped trousers or intentional hem placement works well;
- wide-leg pants can be used only if shoe remains visible;
- skirts should keep consistent length across the set;
- hemline must not hide toe, heel, or side profile in detail shots.

For socks:

- pants should reveal cuff/height if socks are the product;
- rolled hems can show socks but must look intentional;
- avoid inconsistent sock visibility across shots.

For hosiery/tights:

- skirt/dress length must be consistent;
- leg line and fabric sheen must remain visible;
- avoid accidental bare-leg look when hosiery is product.

Prompt phrase:

```text
hemline positioned intentionally to reveal the product, consistent garment length across the image set, clothing supports product visibility without hiding toe, heel, cuff, or fabric detail
```

## Fixed AI Model Personas

For repeatable brand tone, define a small set of reusable model personas.

Suggested set:

- Female A: minimal office, pumps, stockings, tights, skirts/slacks.
- Female B: casual sneaker, socks, denim, sporty/cute styling.
- Female C: street fashion, boots, chunky sneakers, wide pants.
- Male A: minimal loafer/sneaker, slacks, clean casual.
- Male B: sports/casual sneaker, ankle/crew socks, denim or joggers.
- Male C: street styling, boots or heavy sneakers, oversized pants.

For each persona, document:

- age range impression;
- body proportion;
- styling category;
- best product categories;
- typical poses;
- camera angles;
- outfit rules;
- skin/hair/makeup tone.

Important:

- Do not imitate real celebrities.
- Keep the model believable as an ecommerce model.
- Reuse pose language and styling rules for consistency.

## Product-specific Attention Balance

### When Shoes Are Product

- Shoes should be the first read.
- Model face and outfit should support styling, not dominate.
- Full-body images still need shoe prominence.
- Close-ups must preserve full shoe geometry.

### When Socks Are Product

- Sock cuff, knit, height, heel/toe fit, and shoe interaction are the first read.
- Shoes act as styling context.
- Feet/ankles/lower calves matter more than face.

### When Hosiery/Tights/Leggings Are Product

- Legwear texture, color, opacity, sheen, and compression are the first read.
- Shoes should show how the legwear is worn.
- Skin-under-fabric detail matters most for sheer hosiery.

## Failure Cases

Reject or regenerate if:

- the model pose hides the product;
- feet are cropped in full-body shots;
- full-body shoes are too small to inspect;
- clothing hem covers the shoe unintentionally;
- sock cuff height changes left vs right without cause;
- legwear reads as bare skin when it is the product;
- the model's face/outfit overwhelms the product;
- pose creates impossible ankle/foot mechanics;
- product emphasis is inconsistent across an 8-shot set;
- the model looks like a real identifiable celebrity.

## QA Questions

1. What is the product in this image?
2. Does the model pose make that product easier to inspect?
3. Is the product large enough in frame?
4. Are toe, heel, cuff, vamp, or fabric details hidden?
5. Does the camera angle support the product?
6. Does the outfit help or hurt product visibility?
7. Is the model attractive but still commercially believable?
8. Does the image fit the same brand tone as the rest of the set?
9. Would a customer understand how the item looks when worn?
10. Would this pose work again for another product in the same category?

## Universal Prompt Block

```text
Model pose and product emphasis: the model supports the product rather than stealing attention. Use natural ecommerce model posing with polished K-pop idol-level styling, not resembling any real person. Camera angle, foot placement, crop, garment hem, and body posture are chosen to make the product easy to inspect. Product remains the visual priority, feet are not cropped, and pose mechanics are physically believable.
```
