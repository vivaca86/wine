# Footwear Legwear System

Last updated: 2026-04-27

For shoe product pages, every worn image should deliberately choose one of three foot/leg states:

1. Barefoot / bare legs
2. Socks
3. Hosiery / stockings / tights

Do not let the model invent an unclear middle state. The prompt must name the state and describe the texture, pressure, and shoe interaction.

## 1. Barefoot / Bare Legs

Use for:

- sandals;
- open shoes;
- casual summer sneakers;
- lifestyle shots where skin contact is part of the style.

Visual requirements:

- natural skin tone variation;
- subtle pores;
- faint veins around foot and ankle;
- visible ankle bones and tendons;
- heel, toe, and arch pressure where the shoe contacts the foot;
- no plastic or waxy finish.

Prompt block:

```text
Bare natural foot and leg skin, realistic pores, faint veins around foot and ankle, subtle ankle bones and tendons, natural tonal variation, slight skin compression where the shoe touches the foot, no plastic skin, no waxy doll skin, no beauty blur.
```

Deep dive file:

- `bare-foot-detail-study.md`

## 2. Socks

Use for:

- sneakers;
- loafers;
- boots;
- casual shoes;
- styling shots where sock color/texture is part of the outfit.

Sock prompts must define:

- height: no-show, low-cut, ankle, crew, over-calf;
- material: cotton, mercerized cotton, wool, ribbed knit, terry, synthetic performance knit;
- thickness: thin dress sock, medium cotton sock, thick cushioned sports sock;
- edge behavior: ribbed cuff, elastic opening, rolled/slouchy folds;
- shoe interaction: compression at shoe opening, fabric bunching, heel grip, toe seam, arch tension.

### No-show Socks

Visual behavior:

- mostly hidden inside shoe;
- may barely show at heel or side depending on shoe cut;
- thin elastic opening grips foot;
- fabric can wrinkle slightly inside low-cut shoes;
- heel silicone grip or raised heel tab may be implied if visible.

Prompt block:

```text
Thin no-show socks mostly hidden inside the shoe, low-cut elastic edge barely visible at the heel and side opening, smooth thin cotton-blend fabric, slight fabric tension around the arch, no bulky sock edge, no sock bunching above the shoe unless intentionally shown.
```

### Ankle Socks

Visual behavior:

- cuff sits below or just above ankle bone;
- often ribbed around cuff;
- cotton texture visible;
- compression ring around ankle can be subtle;
- good for sneakers.

Prompt block:

```text
Clean ankle socks, soft cotton blend with fine knit texture, ribbed elastic cuff around the ankle, subtle compression where the cuff grips the skin, smooth toe area inside the sneaker, realistic fabric thickness and folds at the shoe opening.
```

### Crew Socks

Visual behavior:

- visible sock column above shoe;
- ribbed vertical structure often visible;
- can be white athletic, black dress, colored fashion, or patterned;
- should follow calf curve without looking painted on.

Prompt block:

```text
Crew socks with visible vertical rib knit texture, soft cotton fibers, elastic cuff pressure, fabric following the ankle and lower calf curve, slight natural folds where the sock meets the shoe collar, realistic knit thickness, not painted-on texture.
```

### Thin Dress Socks

Visual behavior:

- thinner and smoother than athletic socks;
- often mercerized cotton or nylon blend;
- subtle sheen;
- ribbing can be fine and vertical;
- should fit neatly in loafers or dress shoes without bulk.

Prompt block:

```text
Thin ribbed dress socks in mercerized cotton blend, fine vertical rib texture, slight silky sheen, close fit around foot and ankle, no bulky folds, subtle compression at shoe opening, elegant formal styling.
```

### Thick Sports / Terry Socks

Visual behavior:

- cushioned terry loops can make the sock look thicker;
- more volume around ankle and shoe collar;
- may bunch or fold more visibly;
- works with sneakers and boots, not sleek pumps.

Prompt block:

```text
Thick cushioned sports socks, visible terry knit texture, soft cotton loops, ribbed cuff, padded volume around ankle and shoe collar, natural compression and folds where the sneaker collar presses into the sock.
```

Deep dive file:

- `sock-detail-study.md`

## 3. Hosiery / Stockings / Tights

Use for:

- pumps;
- flats;
- loafers;
- office styling;
- dress styling;
- formal outfits.

Use the dedicated file for detailed nude sheer hosiery foot behavior:

- `priority-hosiery-foot-study.md`

Short prompt block:

```text
Nude sheer 10-15 denier pantyhose, translucent nylon over natural skin, fine knit fibers visible around ankle, instep, and shoe opening, faint veins/tendons/toe contours visible underneath, subtle matte-satin sheen, slight fabric tension and compression where the shoe touches the foot, not bare skin, not opaque tights, not beauty blur.
```

## Interaction-layer grammar (Use for all worn images)

To prevent blur/decal failures, use the three-layer approach:

- underlayer (body)
- fabric layer
- contact layer (shoe pressure)

Deep dive file:

- `interaction-layering-skin-fabric-shoe.md`

## Decision Rules By Shoe Type

### Pumps

Best matches:

- nude sheer pantyhose (explicit toe type: shadow toe vs unreinforced/sandal toe);
- black sheer tights;
- bare legs for summer/evening styling;
- thin no-show socks only for special concept shots.

Avoid:

- thick socks unless deliberately styled;
- athletic socks for formal pump product pages.

### Sneakers

Best matches:

- ankle socks;
- crew socks;
- no-show socks;
- bare ankles for summer styling.

Avoid:

- unclear sock/barefoot state;
- socks that melt into the shoe collar.

### Loafers

Best matches:

- thin dress socks;
- crew socks for fashion styling;
- no-show socks for sockless look;
- sheer socks/tights for women's styling.

Avoid:

- no-show socks visibly bunching at heel unless documenting fit problems;
- sock edge awkwardly showing at only one side.

### Boots

Best matches:

- crew socks;
- wool socks;
- thick ribbed socks;
- tights for women's dress boots.

Avoid:

- sock texture disappearing into boot opening;
- impossible leg/boot overlap.

## QA Checklist For Socks

Reject if:

- sock texture looks painted on;
- ribbing does not follow leg/foot curvature;
- cuff cuts into skin too deeply or floats above skin;
- sock thickness conflicts with shoe type;
- left/right sock height differs unintentionally;
- no-show sock appears as random white patch;
- fabric melts into shoe collar.

Accept if:

- knit structure is visible at close range;
- cuff pressure is subtle and believable;
- sock height is consistent across pair;
- shoe opening presses naturally against sock fabric;
- folds and bunching match the pose and material thickness;
- material category is clear: thin dress, cotton ankle, ribbed crew, terry sports, wool.

## Reference Links

- Denier categories and visual expectations: https://www.journelle.com/pages/hosiery-guide
- Sock texture guide: https://custom.sockclub.com/blogs/sock-texture-guide
- Nordstrom ribbed mercerized cotton dress socks reference: https://www.nordstrom.com/s/nordstrom-ribbed-mercerized-cotton-blend-dress-socks/7988629
