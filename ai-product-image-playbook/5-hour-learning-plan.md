# 5-Hour Learning Plan: Microscopic Footwear Detail

Last updated: 2026-04-27

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

- 10D, 12D, 15D, 20D nude sheer pantyhose.
- How much skin should show at each denier.
- How veins, tendons, ankle bones, toe knuckles, and toe outlines show through the fabric.
- Toe vocabulary: shadow toe (almost invisible reinforcement) vs unreinforced/sandal toe.
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
- toe seam type (flat seam / hand-linked vs bulky seam);
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
- vellus hair (“peach fuzz”) on legs (subtle, not noisy fuzz);
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
- outsole edges / foxing;
- stitching;
- folded leather edges / edge paint;
- heel counters;
- shoe openings.

Prompt objective:

Each material must have its own visual language. Do not rely on generic words like `premium` or `realistic` alone.

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

## Source Set (Anchors + close-up references)

Hosiery:

- Denier guide with 10-15D and 20D behavior: https://www.girlsandnylons.com/guides/denier-guide.html
- Denier category table: https://www.journelle.com/pages/hosiery-guide
- Hosiery denier visual differences: https://estylingerie.com/2019/12/16/hosiery-denier-guide-what-do-different-deniers-look-like/
- Wolford Pure 10 Tights (matte look + Shadow Toe): https://www.wolford.com/en-us/pure-10-tights-14497.4273.html
- Wolford Individual 10 Tights (Shadow Toe mention): https://www.wolford.com/en-us/individual-10-tights-18382.outlet.html
- FALKE Shelina 12 DEN (unreinforced toe): https://www.falke.com/si_en/ts/falke-shelina/tights/
- Toe cleavage definition and low-vamp pump context: https://carets.com/blogs/faq/toe-cleavage

Feet + skin:

- Foot and ankle anatomy: https://www.physio-pedia.com/Comprehensive_Anatomy_of_the_Foot_and_Ankle
- Foot anatomy: https://www.kenhub.com/en/library/anatomy/ankle-and-foot-anatomy
- MTP joints (“toe knuckles”): https://www.kenhub.com/en/library/anatomy/metatarsophalangeal-mtp-joints
- Vellus hair (“peach fuzz”) definition: https://my.clevelandclinic.org/health/body/23098-vellus-hair-peach-fuzz

Socks:

- Sock texture guide: https://custom.sockclub.com/blogs/sock-texture-guide
- Sock construction and toe seams: https://deadsoxy.com/blogs/sock-knowledge-base/sock-construction-methods-explained
- Flat toe seam definition: https://julien-deluxe.com/en/pages/wat-is-een-flat-toe-seam
- Toe seam comfort discussion: https://ecosox.com/blog/sock-talk-toe-seams/
- Heel pocket fit concept: https://www.fitsok.com/blogs/news/what-is-a-heel-pocket

Materials + construction:

- Shoe materials overview: https://footinst.com/identify-right-shoe-material/
- Foxing definition: https://www.heddels.com/dictionary/foxing/
- Heel counter definition: https://shoemaking.wiki/Heel_Counter
- Lugs definition: https://shoemaking.wiki/Lugs
- Patent leather characteristics: https://www.schuhe-lueke.com/guidebook/shoe-care/lacquered-leather/
- Suede brushing + nap behavior: https://www.bdpumps.com/why-suede-loafers-need-special-treatment-the-10-minute-maintenance-routine/
- Fabric nap direction concept (maps to suede): https://stitched.info/tips/the-importance-of-fabric-nap-and-pile-direction/
- Nike Flyknit (engineered knit zones): https://www.nike.com/flyknit/
- adidas Primeknit overview/category: https://www.adidas.com/us/primeknit
- Vibram traction lug tech: https://www.vibram.com/us/technology/lifestyle/TECH_traction-lug.html
- Vibram outsole vocabulary (AKU guide): https://www.aku.co.uk/aku-academy/vibram
- Construction methods (Hanwag): https://www.hanwag.com/us/en-us/our-story/production/construction/

## Output Plan During Study

The study process should update or add Markdown files under `ai-product-image-playbook`:

- `priority-hosiery-foot-study.md`
- `sock-detail-study.md`
- `footwear-legwear-system.md`
- `bare-foot-detail-study.md`
- `shoe-material-texture-study.md`
- `interaction-layering-skin-fabric-shoe.md`

Each update should include:

- concrete visual observations;
- prompt-ready phrases;
- negative constraints;
- QA checks;
- source links;
- notes on what failures to regenerate.
