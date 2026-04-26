# QA Checklist For AI Worn Product Images

Use this checklist before accepting any generated product image.

## 0. File and Resolution

- Original generation is saved.
- Generated image uses the largest available size from the tool.
- If upscaled, original and upscaled files are both kept.
- 4x resize is not treated as real detail recovery; inspect for softness.
- For product-page detail images, zoom to at least 200% before accepting.

## 1. Framing

Reject if:

- Any shoe toe is cropped.
- Any heel is cropped.
- Full-body shot crops the feet.
- Close-up shot hides the product behind clothing.
- Below-knee shot makes shoes too small.

Accept if:

- In close-ups, the whole pair is visible unless the brief explicitly asks for a macro fragment.
- In full-body shots, shoes are still visually emphasized.
- In below-knee shots, shoes occupy a large portion of the frame.

## 2. Product Identity

Reject if:

- Left and right shoes are different designs.
- Heel height changes between images.
- Sole shape changes between images.
- Toe shape changes between images.
- Laces, eyelets, panels, seams, or heel tabs mutate across the set.
- Fake logo or unreadable brand-like mark appears.

Accept if:

- The product definition is recognizable across all 8 images.
- Differences are caused by camera angle, not design drift.

## 3. Anatomy and Pose

Reject if:

- Ankle angle is impossible.
- Foot does not contact the floor believably.
- Heel floats without proper shadow.
- Tiptoe pose does not put weight on ball of foot/toes.
- Full-body shot has warped hands, arms, knees, or legs.

Accept if:

- Weight distribution matches the pose.
- Shadows match foot contact.
- Foot, ankle, knee, and hip alignment look physically possible.

## 4. Hosiery and Skin

Reject if:

- Nude sheer stocking looks like plain blurred skin.
- Skin is plastic, waxy, or over-smoothed.
- Hosiery looks muddy or dirty.
- Mesh is exaggerated into fishnet when not requested.
- Opaque tights appear when sheer 10D/15D/20D was requested.

Accept if sheer hosiery shows:

- Translucent nylon layer over skin.
- Fine fiber texture, especially around ankle, instep, shin, and shoe opening.
- Skin tone visible underneath.
- Faint veins, tendons, ankle bones, toe outlines, or toe knuckle shapes where physically visible.
- Subtle matte-satin or soft nylon sheen.
- Slight tension/compression around toes, ankle, and shoe opening.

Accept if bare skin shows:

- Subtle pores.
- Natural tonal variation.
- Faint veins or tendons around foot and ankle.
- No beauty-blur plastic finish.

## 5. Leather Pumps and Creases

Reject if:

- Creases appear as random decorative lines.
- Creases appear where the shoe should be rigid.
- Leather folds look melted.
- The vamp does not react when the foot is on tiptoe.
- Heel-raised pose lacks shadow or pressure at ball of foot.

Accept if raised-heel pump pose shows:

- Creases at the ball-of-foot / metatarsal flex line.
- Shallow horizontal compression wrinkles across the vamp.
- Slight side compression or bulging near the ball of foot.
- Tension along shoe opening.
- Fine leather grain and highlights on toe/heel curves.

## 6. Sneakers and Casual Shoes

Reject if:

- Lace holes are inconsistent.
- Laces melt into the upper.
- Sole pattern mutates between left and right shoe.
- Toe box shape is asymmetrical.
- Shoe floats or intersects with floor.

Accept if:

- Laces, tongue, eyelets, stitching, panels, toe box, heel tab, and sole edge are all legible.
- Material differences are clear: leather vs suede vs mesh vs rubber.
- Left and right shoes match.

## 7. Clothing Consistency

Reject if:

- Skirt/pants length changes between images without intent.
- Same outfit appears as different fabrics across the set.
- Hemline hides product details in detail shots.
- Fabric folds ignore body posture.

Accept if:

- Outfit is consistent across the set.
- Hemline is intentionally placed to reveal shoes.
- Fabric texture is visible when the crop is close enough.

## 8. Commercial Use Score

Score each accepted candidate from 1 to 5.

- 5: Ready for product-page test use.
- 4: Usable with minor caution.
- 3: Concept/reference only; do not use as final detail proof.
- 2: Regenerate; contains visible trust issues.
- 1: Discard immediately.

Minimum recommended standard:

- Full-body styling shots: 4 or above.
- Below-knee detail shots: 4 or above.
- Close-up product detail shots: 5 preferred, 4 only if not used as main proof image.

## 9. Common Regeneration Notes

Use these short notes to improve the next prompt:

- Shoes cropped: add `full pair of shoes completely visible, no cropped toe, no cropped heel` near the top.
- Stocking looks like blur: add `skin details remain visible under sheer nylon: veins, tendons, toe outlines`.
- Skin too plastic: add `not waxy, not doll skin, no beauty blur, natural tonal variation`.
- Wrinkles wrong: add pose physics and specify flex point.
- Product changes across images: repeat the full product definition in every prompt.
- Full-body shoes too small: add `slightly low camera angle, one foot forward, footwear prominent in lower frame`.
