# AI Product Image Playbook

Last updated: 2026-04-27

This folder is the shared rulebook for generating ecommerce fashion product images with AI, especially worn shoe photos. The goal is not just to make pretty images. The goal is to make images that survive zoomed product-page inspection: believable material, believable anatomy, consistent styling, and no obvious AI artifacts.

## Core Principle

AI image generation should be treated like a product photo pipeline:

1. Define the product as if it were a real SKU.
2. Generate a fixed shot set for that SKU.
3. Inspect every result at zoom level.
4. Regenerate any image that breaks product trust.
5. Save the prompt lessons so the next run starts closer to usable output.

For development-stage products without real samples, the AI image is a concept rendering, not final product proof. Once real samples exist, replace main product and detail proof shots with real photography. AI styling shots can still be used as clearly labeled styling/reference images.

## Microscopic Study Notes (Index)

These are prompt-ready micro cues + negative constraints + QA checks focused on worn footwear close-ups:

- [Footwear materials (worn close-ups)](materials-footwear-worn-closeups.md)
- [Bare skin: feet & legs micro details](bare-skin-feet-legs-micro-details.md)
- [Nude sheer hosiery: 10D/15D/20D microtexture + toe types](hosiery-sheer-denier-microtexture.md)
- [Socks: knit structures, seams, pressure marks](socks-knit-structures-microtexture.md)
- [Layered prompting: skin + fabric + shoe contact](interaction-layers-skin-fabric-shoe-contact.md)

## Standard Shot Set: 1 Product = 8 Images

### 1. Worn Shoe Close-ups: 4 Images

All close-ups must be worn images. No standalone product-only shots for this set.

Required:

- Full shoes visible; toes, heels, and sole edges must not be cropped.
- Front toe / toe box close-up.
- Lace, vamp, or shoe-opening close-up depending on shoe type.
- Side profile close-up showing silhouette, heel height, sole, and material panels.
- Rear or heel-quarter close-up showing heel counter, outsole edge, heel tip, or back construction.

### 2. Full-body Styling Shots: 2 Images

Required:

- Two different poses.
- Full body visible from head to toe.
- Shoes still emphasized through low angle, forward foot, lighting, and pose.
- Feet must not be cropped.
- Model should have polished K-pop idol-level styling and visual polish, without resembling any real person.

### 3. Below-knee Detail Shots: 2 Images

Required:

- Crop from below knee or knee down.
- Shoes occupy a large part of the frame.
- One standing/detail pose and one movement/detail pose.
- Shoe shape, floor contact, shadow, ankle posture, and garment hem must be clear.

## Global Quality Rules

Always request:

- Maximum available resolution.
- 4K-quality product photography.
- Ultra realistic commercial Korean ecommerce styling.
- Sharp material detail for shoes, clothes, skin, hosiery, stitching, sole, heel, folds, and floor contact.
- Natural body mechanics and believable weight distribution.
- Stable product identity across all 8 images.

Avoid:

- Cropped shoes in close-ups.
- Mismatched left and right shoes.
- Warped heels, soles, laces, stitching, or shoe openings.
- Plastic skin, waxy legs, blur-filter skin, or muddy texture.
- Impossible ankle angles or foot placement.
- Random decorative wrinkles that do not match the pose.
- AI-generated logos, labels, text, or fake brand marks.

## Product Consistency Rules

Before generating the shot set, write a product definition. Repeat it in every prompt.

Example for a basic pump:

- Classic black pointed-toe pump.
- Smooth premium black calf leather.
- Low-cut vamp.
- Clean folded leather edge.
- Slim 5 cm kitten heel.
- Leather-covered heel.
- Clean outsole edge.
- No logo.
- Identical left and right shoes.

Example for a sneaker:

- Cream and taupe minimalist women's sneaker.
- Warm ivory thick sculpted sole.
- Cream flat laces.
- Taupe suede overlay panels.
- Smooth cream leather upper.
- Rounded toe.
- Subtle stitching.
- No logo.
- Identical left and right shoes.

## Hosiery and Skin Lessons

The biggest mistake is asking for sheer stockings and getting blurred bare legs. Sheer hosiery must show both the fabric layer and the body underneath.

For nude sheer pantyhose, describe:

- 10-15 denier or 15-20 denier depending on transparency.
- Translucent beige nylon over natural skin tone.
- Fine nylon knit or cross-knit fiber texture on ankle, instep, shin, and shoe opening.
- Skin details visible under the fabric: faint veins, ankle bones, tendons, toe knuckle shapes, toe outlines, and natural tone variation.
- Subtle matte-satin sheen following the leg curve.
- Slight fabric tension around toes, ball of foot, ankle, and shoe opening.

Avoid:

- `smooth skin` by itself.
- `perfect legs` by itself.
- Overly heavy mesh/fishnet pattern unless the product is actually fishnet.
- Opaque tights when asking for sheer pantyhose.
- Blur language that hides skin detail.

Deep dive:

- [Microscopy: nude sheer hosiery (10D/15D/20D) + foot contact layers](microscopy/hosiery-nude-sheer-denier-foot-contact.md)
- [Nude sheer hosiery: 10D/15D/20D microtexture + toe types](hosiery-sheer-denier-microtexture.md)

## Leather Pump Crease Lessons

Pumps and leather shoes crease according to foot mechanics. Creases should appear where the material flexes, especially around the ball-of-foot / metatarsal flex point.

For a raised-heel or tiptoe pose, ask for:

- Heel lifted high off the floor.
- Ball of foot and toes carrying the weight.
- Vamp creases across the ball-of-foot flex line.
- Shallow horizontal compression wrinkles across the vamp.
- Slight side bulging or compression at the metatarsal area.
- Subtle tension along the shoe opening.
- Realistic shadow under the lifted heel.

Avoid:

- Random decorative wrinkles.
- Cracked leather unless the product is worn/distressed.
- Melted folds.
- Creases on physically impossible areas.

## Research Rule

If the material is unfamiliar, research before prompting. Look up close-up references for:

- Shoe category: pumps, loafers, sneakers, boots, sandals.
- Material: calf leather, patent leather, suede, mesh, canvas, knit, rubber sole.
- Hosiery: 10D, 15D, 20D, matte, glossy, reinforced toe, sandal toe, opaque tights.
- Garment fabric: denim twill, wool suiting, ribbed knit, satin, cotton poplin, nylon, polyester, leather.

Then convert what you learn into explicit prompt language. Do not rely on generic words like `realistic`, `premium`, or `detailed` alone.

## Reference Links Used For This Version

- Wolford tights guide: https://www.wolford.com/our-tights-guide.html
- FALKE tights inspiration and denier guidance: https://www.falke.com/us_en/inspiration/tights/
- Calzedonia sheer tights category references: https://www.calzedonia.com/us/women/tights_and_stockings/sheer_tights/
- Hosieree sheer/reinforced toe product references: https://www.hosieree.com/products/CalzitalySheerCushion.html
- Hosieree toe construction explainer: https://www.hosieree.com/Articles/Toes.html
- UK Tights sandal toe explanation: https://www.uktights.com/tights/sheer-tights/sandal-toe-tights
- Denier definition (textile units): https://en.wikipedia.org/wiki/Units_of_textile_measurement
- Fogal All Nude (10D) product detail references: https://fogal.com/products/all-nude-tights
- Shoe Snob leather creasing guidance: https://theshoesnobblog.com/guide-to-leather-creasing/
- Grant Stone vamp crease discussion: https://www.grantstoneshoes.com/blogs/journal/123192833-creating-a-clean-vamp-crease
- Shoe Tease high heel anatomy overview: https://www.shoe-tease.com/parts-of-a-high-heel-anatomy/

Additional micro-study anchors:

- Wolford Individual 10 (Shadow Toe reference): https://www.wolfordshop.com/products/individual-10-tights-18382
- Terry loop sock structure reference: https://darntough.com/blogs/the-alternate-stitch/what-is-terry-loop
- Heel counter construction reference: https://shoemaking.wiki/Heel_Counter
- Patent leather finish context (care/finish behavior): https://saphir.paris/en/pages/leather-guide
- Nike Flyknit material/knit concept references: https://www.nike.com/flyknit/
- adidas Primeknit references: https://www.adidas.com/us/primeknit-shoes
