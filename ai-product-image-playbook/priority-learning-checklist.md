# Priority Learning Checklist

Last updated: 2026-04-27

Use this checklist when continuing AI product-image learning in another environment. The learner should research, update the relevant Markdown files, and mark items complete as they are handled.

The goal is practical prompt knowledge for ecommerce footwear worn images: visible textile fibers, skin-under-fabric behavior, material-specific shoe texture, pressure, tension, and zoom-safe QA rules.

## How To Use

For each item:

1. Research real close-up references.
2. Add visual observations.
3. Convert observations into prompt-ready phrases.
4. Add negative constraints.
5. Add QA checks.
6. Update the relevant playbook files.
7. Mark the item complete.

Suggested files to update:

- `priority-hosiery-foot-study.md`
- `sock-detail-study.md`
- `footwear-legwear-system.md`
- `research-notes.md`
- `qa-checklist.md`
- new focused files when needed

## 1. Model Upgrade Review: 5.2 To 5.5

- [ ] Read all existing `ai-product-image-playbook` files created from the 5.2 study.
- [ ] Identify vague language that can be made more visual and physical.
- [ ] Improve weak prompt phrases by separating layers: skin/body, fabric/material, shoe contact.
- [ ] Check whether 5.5 can handle more precise micro-detail language than 5.2.
- [ ] Add a `5.5 supplement` section where new phrasing improves results.
- [ ] Confirm the playbook still avoids overfitting to one shoe type or one hosiery type.

Completion output:

- [ ] Updated notes explaining what 5.5 should improve or reinterpret.
- [ ] Added prompt phrases that are more specific than the 5.2 versions.

## 2. Representative Hosiery Colors

Study black, white, and nude hosiery separately.

### Black Hosiery

- [ ] Study how black sheer hosiery changes skin visibility.
- [ ] Note how black nylon creates stronger leg contour and shadow compression.
- [ ] Distinguish black sheer from opaque black tights.
- [ ] Describe how veins/tendons become less visible than nude hosiery but leg structure can still show through sheen and tension.
- [ ] Add prompt phrases for black 10D/15D/20D/40D/80D.

### White Hosiery

- [ ] Study how white hosiery catches light and can bloom or wash out detail.
- [ ] Describe visible knit/fiber texture in white hosiery.
- [ ] Distinguish sheer white, opaque white tights, and thick white socks.
- [ ] Note how toe/heel tension can reveal underlying foot shape even when skin color is hidden.
- [ ] Add negative constraints for overexposed, glowing, plastic white fabric.

### Nude / Skin-tone Hosiery

- [ ] Study how nude hosiery blends with skin while still showing a nylon layer.
- [ ] Describe the boundary between bare-looking skin and visible hosiery.
- [ ] Document how veins, tendons, ankle bones, toe contours, and skin tone variation show through 10D/15D/20D.
- [ ] Add prompt phrases for matte nude, satin nude, glossy nude, shadow toe, sandal toe, and reinforced toe.

Completion output:

- [ ] Add a color comparison section to `priority-hosiery-foot-study.md` or a new hosiery color file.
- [ ] Add color-specific QA checks.

## 3. Denier-by-Denier Hosiery Behavior

Study at minimum: 5D, 10D, 15D, 20D, 30D, 40D, 60D, 80D+.

For each denier:

- [ ] Describe transparency level.
- [ ] Describe nylon/fiber visibility.
- [ ] Describe skin visibility.
- [ ] Describe vein/tendon/toe contour visibility.
- [ ] Describe toe seam or reinforced toe visibility.
- [ ] Describe matte vs satin vs glossy behavior.
- [ ] Describe how stretched areas become more transparent.
- [ ] Describe how compressed or doubled fabric areas become darker/denser.

Important advanced topic:

- [ ] Even at higher denier, study how tension over toes, heel, ball of foot, ankle bend, or shoe opening can reveal shape or tone differences underneath.

Completion output:

- [ ] Add a denier table with prompt phrases and QA expectations.
- [ ] Add failure notes for denier mismatch, e.g. 10D rendered like opaque tights or 80D rendered like bare skin.

## 4. Hosiery Wrinkles, Tension, And Contact Zones

Study wrinkles and tension around:

- [ ] ankle bend;
- [ ] Achilles/heel curve;
- [ ] ball of foot;
- [ ] toe knuckles;
- [ ] beginning/base of toes near low vamp;
- [ ] shoe opening;
- [ ] reinforced toe seam or shadow toe area.

Prompt details to develop:

- [ ] How nylon stretches over convex anatomy.
- [ ] How fine folds gather at ankle bend.
- [ ] How toe-base wrinkles form when the foot bends.
- [ ] How a low-vamp pump presses the stocking without cutting or floating.
- [ ] How hosiery continues into the shoe opening.

Completion output:

- [ ] Add wrinkle/tension prompt phrases.
- [ ] Add QA checks for realistic vs random wrinkles.

## 5. Toe Visibility In Low-vamp Shoes

Study how much toe anatomy should be visible in thin hosiery with low-vamp pumps.

- [ ] Define what can be visible: base-of-toe contours, toe cleavage, toe knuckle hints.
- [ ] Define what should not be visible: full toes through closed leather, toenails through black pumps, impossible toe outlines.
- [ ] Compare sandal-toe, shadow-toe, reinforced-toe, and toeless hosiery.
- [ ] Document how visible toe details change by denier and color.

Completion output:

- [ ] Add a low-vamp toe visibility decision table.
- [ ] Add prompt phrases and negative constraints.

## 6. Sock Types And Fiber-level Detail

Study each sock type:

- [ ] no-show socks;
- [ ] ankle socks;
- [ ] crew socks;
- [ ] thin dress socks;
- [ ] terry sports socks;
- [ ] wool socks;
- [ ] ribbed fashion socks;
- [ ] compression socks.

For each type:

- [ ] Identify fabric/yarn type.
- [ ] Describe knit structure.
- [ ] Describe visible fibers at macro scale.
- [ ] Describe toe seam.
- [ ] Describe heel pocket.
- [ ] Describe cuff/elastic pressure.
- [ ] Describe wrinkles and folds.
- [ ] Describe shoe-opening contact.
- [ ] Describe what should and should not show through the sock.

Completion output:

- [ ] Add type-specific prompt blocks to `sock-detail-study.md`.
- [ ] Add QA checks for each sock type.

## 7. Sock Thickness, Tension, And Skin/Foot Shape Visibility

Study how thin and thick socks reveal or hide the foot underneath.

- [ ] Thin dress socks: when toe shapes, heel curve, or skin tone can subtly show.
- [ ] Thin white socks: how toe/heel tension may reveal underlying foot shapes even if skin color is mostly hidden.
- [ ] Thin black socks: how sheen/tension reveals shape without skin tone.
- [ ] Medium cotton socks: shape visible through volume, not transparency.
- [ ] Thick terry/wool socks: skin hidden, but foot structure implied by stretch, compression, and folds.
- [ ] Compression socks: skin hidden, anatomy shown through pressure gradients and tight contouring.

Completion output:

- [ ] Add a sock thickness table.
- [ ] Add prompt phrases for tension-revealed toe/heel shapes.
- [ ] Add negative constraints for socks looking painted on.

## 8. Bare Foot And Bare Leg Detail

Study realistic bare foot/leg details for shoe worn images.

- [ ] Instep veins.
- [ ] Foot tendons.
- [ ] Ankle bones.
- [ ] Toe knuckles.
- [ ] Toenails when visible.
- [ ] Heel pressure.
- [ ] Skin compression at straps, vamps, collars, and shoe openings.
- [ ] Natural pores, peach fuzz, and tone variation.
- [ ] Difference between polished ecommerce skin and plastic AI skin.

Completion output:

- [ ] Add or update a `bare-foot-detail-study.md` file.
- [ ] Add prompt phrases and QA checks.

## 9. Footwear Material Detail

Study materials worn on feet and their macro appearance.

- [ ] Smooth calf leather.
- [ ] Patent leather.
- [ ] Suede.
- [ ] Nubuck.
- [ ] Synthetic leather / PU.
- [ ] Mesh.
- [ ] Knit uppers.
- [ ] Canvas.
- [ ] Rubber soles.
- [ ] Outsole edges.
- [ ] Stitching.
- [ ] Folded leather edges.
- [ ] Heel counters.
- [ ] Laces and eyelets.
- [ ] Shoe openings and collar padding.

For each material:

- [ ] Describe surface texture.
- [ ] Describe light behavior.
- [ ] Describe wrinkles, deformation, or compression.
- [ ] Describe edge/transition details.
- [ ] Add negative constraints for fake-looking AI texture.

Completion output:

- [ ] Add or update `shoe-material-texture-study.md`.
- [ ] Add material-specific prompt blocks.

## 10. Pressure, Contact, And Deformation Physics

Study how feet, socks/hosiery, and shoes interact under weight.

- [ ] Standing flat.
- [ ] One foot forward.
- [ ] Walking step.
- [ ] Strong tiptoe / heel raised.
- [ ] Ball-of-foot pressure.
- [ ] Toe pressure inside closed toe boxes.
- [ ] Heel counter pressure.
- [ ] Sneaker sole compression.
- [ ] Pump vamp creasing.
- [ ] Loafer vamp pressure.
- [ ] Boot shaft compression against socks/tights.

Completion output:

- [ ] Add or update `shoe-deformation-physics.md`.
- [ ] Add pose-specific prompt phrases and QA checks.

## 11. Color + Thickness + Material Combination Tables

Build comparison tables for common ecommerce cases.

Examples:

- [ ] nude 10D pantyhose + black low-vamp pump;
- [ ] nude 20D pantyhose + beige pump;
- [ ] black 20D sheer tights + black pump;
- [ ] black 80D opaque tights + loafers;
- [ ] white thin ankle socks + sneakers;
- [ ] black thin dress socks + loafers;
- [ ] thick white terry crew socks + sneakers;
- [ ] wool socks + boots.

For each combination:

- [ ] How much skin/foot shape should show.
- [ ] What fiber texture should show.
- [ ] What shoe contact/pressure should show.
- [ ] Best prompt phrase.
- [ ] Main failure modes.

Completion output:

- [ ] Add a combination table file or section.

## 12. Failure Case Dictionary

Document common failures and how to fix them.

- [ ] Hosiery rendered as blurred bare skin.
- [ ] Hosiery rendered as pasted texture.
- [ ] Nude 10D rendered as opaque tights.
- [ ] Reinforced toe rendered like a sock cap.
- [ ] Toe cleavage drawn as random dark cracks.
- [ ] Full toes visible through closed leather pumps.
- [ ] Sock texture painted on skin.
- [ ] Sock cuff floating above skin.
- [ ] Sock melting into shoe collar.
- [ ] Thick sock with no volume.
- [ ] Thin sock with no foot shape/tension.
- [ ] Leather grain rendered as random noise.
- [ ] Pump creases in impossible locations.
- [ ] Shoe pressure/contact missing.

Completion output:

- [ ] Add failure -> prompt fix entries to `qa-checklist.md` or a dedicated failure dictionary.

## 13. Test Image Prompt Templates

Create dedicated test prompts to verify learning visually.

- [ ] Hosiery 4-panel inspection prompt.
- [ ] Sock 4-panel inspection prompt.
- [ ] Bare foot 4-panel inspection prompt.
- [ ] Shoe material macro inspection prompt.
- [ ] Pressure/deformation physics prompt.
- [ ] Full 8-shot product set prompt family.

Completion output:

- [ ] Add test prompts to `prompt-templates.md` or a dedicated `inspection-test-prompts.md`.

## 14. Final Acceptance Criteria

The learning pass is complete only when the playbook can support prompts that produce:

- [ ] hosiery where skin-under-fabric anatomy remains visible and physically plausible;
- [ ] hosiery denier/color differences that are visually meaningful;
- [ ] socks with real textile structure, not painted texture;
- [ ] sock thickness and tension that imply the foot underneath;
- [ ] bare feet with realistic but ecommerce-appropriate detail;
- [ ] shoe materials with category-specific texture and light behavior;
- [ ] foot/shoe/fabric pressure and deformation that match the pose;
- [ ] repeatable 8-shot product image sets with consistent product identity.
