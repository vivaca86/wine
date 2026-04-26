# 5-Hour Learning Plan: Microscopic Footwear Detail

Last updated: 2026-04-26

This is the active study plan for improving AI-generated worn footwear images. The goal is to learn visual detail deeply enough that future prompts can describe thread-level texture, skin-under-fabric behavior, material deformation, and realistic shoe contact.

## Goal

Future generated images should not merely look like fashion photos from a distance. They should survive close product-page inspection. The AI should be prompted to render:

- individual textile/nylon/yarn behavior;
- skin underneath socks, hosiery, or bare foot presentation;
- realistic pressure, tension, and compression at shoe contact points;
- material-specific texture for footwear uppers, soles, seams, heels, and openings;
- physically plausible foot, toe, ankle, and shoe deformation.

## Priority 1: Nude Sheer Hosiery

This is the highest-priority study area.

Study targets:

- 10D, 15D, 20D nude sheer pantyhose.
- How much skin should show at each denier.
- How veins, tendons, ankle bones, toe knuckles, and toe outlines show through the fabric.
- Difference between reinforced toe and sandal toe.
- Toe seam placement and visibility.
- How the fabric behaves around the pump opening.
- How much toe cleavage or base-of-toe contour should show in low-vamp closed pumps.
- How nylon sheen changes between matte, satin, and glossy finishes.

Visual zones:

- instep / foot top;
- ankle;
- toe area / reinforced toe;
- shoe opening / low vamp;
- toe shapes inside the shoe;
- pressure zones where leather touches nylon.

Prompt objective:

Describe hosiery as a layer over skin, not as blurred skin and not as pasted texture.

Layer model:

1. Body layer: veins, tendons, bones, toe shapes, skin tone variation.
2. Nylon layer: denier transparency, fiber direction, seams, reinforced zones, sheen.
3. Shoe contact layer: pressure, compression, vamp edge, toe box hiding/revealing anatomy.

## Priority 2: Socks

Study targets:

- no-show socks;
- ankle socks;
- crew socks;
- thin dress socks;
- terry sports socks;
- wool socks;
- thin vs thick sock opacity and tension.

Detail targets:

- yarn fibers;
- rib knit direction;
- cuff pressure;
- heel pocket shape;
- toe seam;
- terry loops;
- fabric thickness;
- sock edge and shoe collar interaction;
- when heel/toe/skin shapes can subtly show through thinner socks.

Prompt objective:

Describe socks as real textiles with structure: cuff, heel pocket, toe area, arch tension, yarn, and compression. Avoid painted-on sock texture.

Layer model:

1. Foot layer: heel curve, toes, ankle bones, skin compression.
2. Sock layer: yarn, knit, rib, toe seam, heel pocket, thickness.
3. Shoe contact layer: shoe collar pressing into sock, sock continuing into shoe opening, folds matching material thickness.

## Priority 3: Bare Foot and Bare Leg Detail

Study targets:

- foot pores and skin texture;
- faint veins on instep and ankle;
- tendons and ankle bones;
- toe knuckles and toenails when visible;
- skin compression at shoe straps, vamp openings, heel counters, sandal edges;
- heel and toe pressure on floor;
- natural tone variation.

Prompt objective:

Avoid doll-like skin. Bare feet should show subtle anatomy and pressure while still looking commercially polished.

## Priority 4: Footwear Materials

Study targets:

- smooth calf leather;
- patent leather;
- suede;
- nubuck;
- synthetic leather / PU;
- mesh;
- knit uppers;
- canvas;
- rubber soles;
- outsole edges;
- stitching;
- folded leather edges;
- heel counters;
- shoe openings;
- laces and eyelets.

Prompt objective:

Each material must have its own visual language. Do not rely on generic words like `premium` or `realistic` alone.

Examples:

- calf leather: fine grain, shallow flex creases, curved highlights, folded edge finishing;
- patent leather: crisp specular highlights and reflections, not cloudy plastic;
- suede: short nap, directional pile, matte surface, subtle color shifts;
- mesh: breathable woven grid, panel depth, not random noise;
- rubber sole: matte molded edge, tread hint, floor contact compression.

## Priority 5: Shoe Deformation and Physics

Study targets:

- pumps in flat stance;
- pumps in tiptoe / heel-raised stance;
- vamp creasing at ball-of-foot flex line;
- side compression at metatarsal area;
- shoe opening tension;
- sneaker sole compression;
- loafer vamp pressure;
- boot shaft and sock/fabric compression;
- realistic shadows under lifted heel or toe.

Prompt objective:

Wrinkles must follow pose physics. Random decorative wrinkles should be rejected.

## First Source Set

Initial sources used to anchor the study:

- Denier guide with 10-15D and 20D behavior: https://www.girlsandnylons.com/guides/denier-guide.html
- Hosiery denier visual differences: https://estylingerie.com/2019/12/16/hosiery-denier-guide-what-do-different-deniers-look-like/
- Foot and ankle anatomy: https://www.physio-pedia.com/Comprehensive_Anatomy_of_the_Foot_and_Ankle
- Foot anatomy: https://www.kenhub.com/en/library/anatomy/ankle-and-foot-anatomy
- Sock structure and heel pocket: https://www.icompressionsocks.com/5-basic-structures-of-socks-you-should-know-2/
- Sock construction and toe seams: https://deadsoxy.com/blogs/sock-knowledge-base/sock-construction-methods-explained
- Shoe material guide: https://footinst.com/identify-right-shoe-material/

## Output Plan During Study

The study process should update or add Markdown files under `ai-product-image-playbook`:

- `priority-hosiery-foot-study.md`
- `sock-detail-study.md`
- `footwear-legwear-system.md`
- future material-specific files such as `bare-foot-detail-study.md`, `shoe-material-texture-study.md`, and `shoe-deformation-physics.md`

Each update should include:

- concrete visual observations;
- prompt-ready phrases;
- negative constraints;
- QA checks;
- source links;
- notes on what failures to regenerate.
