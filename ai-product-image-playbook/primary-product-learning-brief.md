# Primary Product Learning Brief

Last updated: 2026-04-27

This brief defines the highest-priority learning direction for the shop's AI product image pipeline.

## Business Context

Primary new-product categories:

1. Shoes: main product category and highest priority.
2. Socks: accessory category sold with shoes.
3. Hosiery: stockings, tights, leggings, and related legwear sold with shoes.

Secondary / later categories:

- Used tops.
- Used bottoms.
- Used shoes.
- Broader clothing categories that will be studied after footwear and legwear are stable.

Current development stage:

- Real product samples are not always ready yet.
- Temporary AI-defined products may be used for testing.
- Later, real product photos should be used as references to generate worn/model styling images.
- Used items especially need AI worn shots because model reshooting every used item is impractical.

## Top Quality Goal

The target is not just a pretty AI image. The target is a close-up product image that can survive 4x upscaling and zoomed product-page inspection.

Required direction:

- Close-up images should remain believable after 4x scale-up.
- Shoe stitching, thread, lace fibers, rubber sole edges, mesh holes, leather grain, suede nap, sock yarn, and nylon fibers should remain coherent.
- Details should not turn into random noise, melted texture, painted-on lines, or fake ornamental patterns.
- The product should look more precise and controlled than a normal quick product photo, while still remaining physically believable.
- The image should feel like a hyper-detailed commercial product macro shot, not an illustration.

Prompt principle:

```text
made for 4x upscaled product-page inspection, micro-details remain coherent at zoom level, individual stitching threads, yarn fibers, nylon filaments, leather grain, edge finishing, and pressure/contact details are crisp and physically plausible
```

Negative principle:

```text
no melted micro-details, no random noise pretending to be texture, no painted-on stitching, no fake fiber pattern, no blurry upscaled texture, no plastic surface, no AI ornamental seams, no inconsistent thread direction
```

## Why This Level Of Detail Matters

The system should be trained toward extreme detail now so that later production images fail less often.

Reasons:

- Shoes are the core business category.
- Customers inspect shoe stitching, sole edges, laces, materials, and fit cues.
- Socks and hosiery are close-contact accessories where texture and transparency matter.
- If the pipeline learns only distant fashion styling, close-up product shots will break trust.
- Building the detail standard early helps later categories such as pants, skirts, tops, knitwear, leather, and used clothing.

## Priority 1: New Shoes

Study how ecommerce models pose to sell shoes.

Required pose/shot learning:

- one foot forward to make the product larger;
- low camera angle without distorting body anatomy;
- walking step that reveals toe shape, side profile, and sole;
- heel-raised/tiptoe pose for pumps and loafers to test vamp flex;
- ankle-down close-ups where the whole shoe remains visible;
- below-knee shots that show hemline, ankle, shoe, floor contact, and shadow;
- full-body styling shots where shoes still read as the product hero.

Material detail targets:

- stitching thread direction and spacing;
- lace fiber, lace holes, eyelets, tongue edge;
- leather grain, folded edge, creases at flex points;
- patent leather reflection and highlight shape;
- suede/nubuck nap direction;
- mesh weave and perforation grid;
- knit upper loops and tension;
- canvas weave;
- rubber sole molding, outsole edge, tread hints;
- heel tip, heel counter, and outsole contact.

## Priority 2: Socks

Study how models show socks as products and as shoe accessories.

Required pose/shot learning:

- ankle and lower calf crops;
- sneaker plus sock styling;
- side angle showing cuff height and shoe collar interaction;
- walking/standing poses that show sock folds and shoe pressure;
- macro details of toe seam, heel pocket, cuff, ribbing, terry loops, and yarn.

Texture detail targets:

- individual yarn fibers;
- rib knit direction following ankle/leg curvature;
- terry loops for sports socks;
- thin dress sock sheen and fine ribbing;
- no-show sock elastic edge and heel grip;
- cuff pressure and subtle skin indentation;
- shoe collar pressing into sock fabric;
- sock material continuing inside the shoe opening.

Thickness and tension targets:

- thin socks may subtly reveal toe/heel/skin shape under stretch;
- white thin socks can reveal toe/heel shapes through tension even when skin color is hidden;
- black thin socks show shape through sheen and contour rather than skin tone;
- medium cotton socks show shape through volume and stretch;
- thick terry/wool socks hide skin but reveal foot structure through compression, folds, and bulk.

## Priority 3: Hosiery, Tights, Leggings

The previous documents focused heavily on stockings. Expand the category to include:

- sheer stockings;
- pantyhose;
- tights;
- leggings;
- sheer socks / knee-highs;
- black, white, nude, and fashion-color legwear.

### Stockings / Pantyhose

Study:

- 5D, 10D, 15D, 20D, 30D, 40D, 60D, 80D+;
- nude, black, white, and colored hosiery;
- matte, satin, glossy finishes;
- sandal toe, shadow toe, reinforced toe, toeless;
- toe seam, toe cap, and toe-base visibility;
- skin-under-fabric: veins, tendons, ankle bones, toe contours;
- tension at foot, ankle, ball of foot, and shoe opening.

### Tights

Study tights as thicker legwear, not just darker stockings.

Targets:

- semi-opaque 30D/40D;
- opaque 60D/80D/100D+;
- black tights, white tights, nude opaque tights;
- matte vs glossy tights;
- how leg shape shows through contour and sheen even when skin is hidden;
- denser fabric at toes/heel under stretch;
- tension gradients around knee, ankle, toes, and shoe openings.

Prompt principle:

```text
opaque tights hide skin color but still reveal anatomy through contour, tension, compression, and fabric sheen; fine knit structure remains visible at macro scale
```

### Leggings

Study leggings as garment-like stretch fabric.

Targets:

- nylon/spandex athletic leggings;
- cotton jersey leggings;
- ribbed leggings;
- seamless leggings;
- compression leggings;
- ankle hem interaction with sneakers, boots, loafers;
- fabric stretch over knee, calf, ankle, and instep if stirrup/footed style;
- seam lines, gusset/side seam where visible, ribbing, compression panels.

Prompt principle:

```text
leggings are stretch fabric with real thickness, seam structure, compression, and directional tension; not painted-on skin, not liquid plastic
```

## Model Pose / Ecommerce Reference Study

Future research should study how real shopping malls and fashion brands pose models for each product type.

For shoes:

- How much of the body is shown.
- How often one foot is advanced.
- How low the camera is.
- How pants/skirts are positioned so shoes are not hidden.
- How walking poses reveal side panels and toe shape.
- How close-up shots keep the full shoe in frame.

For socks:

- How cuffs are shown.
- How socks are paired with sneakers/loafers/boots.
- How models sit, stand, or step to show ribbing and thickness.
- How close-ups show toe seam, heel pocket, cuff, and shoe interaction.

For hosiery/tights/leggings:

- How leg line, sheen, transparency, and color are emphasized.
- How pumps, loafers, boots, and sneakers are paired.
- How close-ups show denier and texture.
- How the model pose prevents the product from looking like bare skin or painted fabric.

## Inspection Test Images To Generate Later

Create test prompts for:

- shoe stitch/lace/sole 4-panel macro inspection;
- sock yarn/cuff/toe/heel 4-panel macro inspection;
- hosiery denier/color 4-panel inspection;
- tights opacity/tension 4-panel inspection;
- leggings fabric/seam/compression 4-panel inspection;
- 4x-upscale stress tests for each category.

## Completion Criteria

This learning direction is considered useful only when future generations can produce:

- shoe close-ups where stitching, laces, material grain, and sole edges remain coherent under 4x upscale;
- sock close-ups where yarn, ribbing, cuff pressure, toe seam, and heel pocket are visible;
- hosiery close-ups where denier, transparency, nylon fibers, and skin-under-fabric are physically believable;
- tights/leggings images where fabric thickness, opacity, compression, and contour are distinguishable;
- model poses that clearly match the product being sold;
- consistent 8-shot sets for shoes, socks, and hosiery products.
