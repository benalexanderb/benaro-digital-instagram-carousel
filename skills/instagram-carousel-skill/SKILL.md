---
name: instagram-carousel-skill
description: >
  Erstellt hochwertige Instagram-Karussell-Slides (4:5 / 1080x1350px) als PNG-Dateien via Satori.
  Verwandelt jeden Text, LinkedIn-Post, YouTube-Transkript oder Stichpunkte in ein visuell
  starkes, story-getriebenes Instagram-Carousel mit grafischen Elementen auf jeder Slide.
  Nutze diesen Skill IMMER wenn jemand Instagram-Slides, Carousel-Posts, Social-Media-Slides,
  Slideshows, "Karussell", "Carousel", "Instagram Post", "Slides erstellen", "mach mir Slides",
  "Instagram Carousel", "Carousel bauen", "Social Media Content" oder eine Variante davon
  erwähnt. Auch triggern wenn der User einen Text, Transkript, Stichpunkte oder Artikel liefert
  und daraus Instagram-Content will. Trigger auf: "mach daraus Slides", "erstelle einen
  Instagram Post", "Carousel Skill", "Instagram Skill". Do NOT use for: einzelne statische
  Bilder, YouTube Thumbnails, PowerPoint/PPTX Präsentationen, oder PDF Reports.
---

# Instagram Carousel Skill

Erstellt premium Instagram-Carousel-Slides in 4:5 Format (1080x1350px) als einzelne PNG-Dateien.
Verwandelt jeden Input (Text, Transkript, Stichpunkte, Artikel) in ein visuell starkes,
story-getriebenes Carousel mit grafischen Elementen auf jeder Slide.

---

## CRITICAL RULES — ENFORCE BEFORE EVERY GENERATION

### 1. UMLAUTS: LOAD LATIN-EXT FONTS

Satori CAN render umlauts (ä, ö, ü, ß) if you load BOTH latin AND latin-ext font files.
ALWAYS load both variants for every weight:

```javascript
const fonts = [400,500,600,700,800].flatMap(w => [
  { name:'Outfit', weight:w, style:'normal', data: fs.readFileSync(`outfit-latin-${w}-normal.woff`) },
  { name:'Outfit', weight:w, style:'normal', data: fs.readFileSync(`outfit-latin-ext-${w}-normal.woff`) },
]);
```

Write all German text with real umlauts. NO ae/oe/ue substitution.

### 2. NEVER HALLUCINATE DATA

Only use verified, citable numbers from the user's input. Omit rather than estimate.

### 3. STORYLINE FIRST, DESIGN SECOND

Before writing any code, ALWAYS plan the 3-Akt storyline first (see Storyline Framework below).
Every slide must pass the "Und deshalb..."-Test before you start designing.

### 4. EVERY SLIDE NEEDS A VISUAL ELEMENT

No slide may be "just text on a background". Every slide needs at least one graphic element:
chart, diagram, icon grid, contrast cards, progress bars, illustration, or image.

### 5. ALWAYS DELIVER CONTACT SHEET

After generating all slides, run the contact_sheet.py script from this skill's scripts/ directory.
Present contact-sheet.png FIRST, then individual PNGs.

### 6. BADGE = EMOTIONALER HOOK, NIE DAS THEMA

The badge (small label top of slide) must create curiosity or urgency. Never write the topic
or tool name in the badge. The badge is an emotional trigger, not a category label.

Good: "BREAKING NEWS", "DAS MUSST DU SEHEN", "ACHTUNG", "EXPERIMENT", "HEUTIGES LEARNING"
Bad: "COWORK x LINKEDIN", "AI TOOLS", "SOCIAL MEDIA", "SNOCKS UPDATE"

### 7. HEADLINE = EHRLICH + KONKRET + 1-SEKUNDEN-TEST

Every headline must pass the 1-second test: a reader scrolling Instagram must understand
what the slide is about within 1 second. If it takes longer, the slide is dead.

Rules:
- Always use the concrete verb (analysiert, ausgewertet, getestet, verglichen) — never vague
- Never be misleading about what happened. "90 Posts in 5 Min" sounds like writing. 
  "90 Posts in 5 Min analysiert" is honest and clear.
- Shorter is better. Max 4-5 words per line, max 4 lines.

### 8. HINTERGRUND-GRAFIK = DAS THEMA 1:1 ABBILDEN

The background or main visual on each slide must directly represent the topic. Never use
abstract icons that say nothing about the content.

Mapping:
- "90 Posts analysiert" → Grid of 90 small post cards visible
- "30 Tage Experiment" → 30 dots or timeline markers
- "4 Projekte" → 4 cards in a 2x2 grid
- "Themen-Ranking" → Horizontal bars with labels
- The visual IS the content, not decoration.

### 9. LAYOUT = VERTIKAL ZENTRIERT, KEIN WHITESPACE

Use `flex:1` + `justifyContent:'center'` on the main content block. No large empty areas
above or below the content. The slide should feel balanced and centered.

Exception: Badge at top and handle/credit at bottom are pinned — only the middle
content block is centered.

### 10. TOOL/QUELLE = SEKUNDÄR, UNTEN, FARBIGER AKZENT

When a specific tool, brand, or source is mentioned, show it as a small colored badge
near the bottom of the slide. Never put it in the main headline or the top badge.

Format: Small pill with green (or brand color) background, white text.
Example: `"Mit Cowork von Anthropic"` as green rounded badge above the IG handle.

### 11. GRAFIK MUSS DIE HEADLINE 1:1 VISUALISIEREN

The main visual on a slide must directly illustrate what the headline says.
"AI übernimmt deinen Browser" → show a browser mockup with AI activity visible.
"Feedback-Loop" → show steps with arrows connecting them.
Never use a generic graphic that doesn't match the headline.

### 12. CONTENT-SLIDES DÜRFEN DAS THEMA ALS BADGE VERWENDEN

The hook-badge rule (Rule 6) applies to the first slide. On explanation/content slides
(Akt 1 Slide 2+, Akt 2), the badge CAN be the topic name ("COWORK", "DIE AUSWERTUNG")
because the reader is already hooked and now wants to learn.

### 13. HEADLINE + VISUAL = EIN BLOCK, KEIN ABSTAND

Headline and its visual element must feel like one connected unit. Use a small gap
(max 24px) between headline and visual. Never let them drift apart with large whitespace.
Both are centered together as one block using `flex:1` + `justifyContent:'center'`.

### 14. KEY LEARNING BAR FÜR CAVEATS = ROTER AKZENT

The key learning bar at the bottom normally has a black/white accent line. When showing
a caveat, limitation, or warning, change the accent line color to `C.red` (#EF4444).
This visually signals "attention" without needing extra text.

### 15. PLATTFORM-LOGO AUF SLIDE 1 — NUR BILDMARKE

Always place the platform/tool logo on the first slide to make the topic instantly
recognizable (e.g., YouTube icon when it's about YouTube, Google logo for Google topics).
Use ONLY the Bildmarke (icon/symbol) — never the full logo with text.
Everyone recognizes the icon alone, and the wordmark wastes space and adds noise.

Think of it like a thumbnail: within 1 second, the viewer should know which platform
or tool this carousel is about.

### 16. KONTRAST IST ALLES — NIE GLEICHE FARBE AUF GLEICHE FARBE

Never place same-colored elements on same-colored backgrounds. A red logo on a red
card is invisible. A white icon on a white background disappears. Always ensure
every element contrasts clearly against its immediate background.

Rule of thumb: element and background must differ by at least 3 brightness levels.
Best combo: white card with dark text on a dark background = maximum contrast.

Before rendering, mentally check every element: "Can I see this clearly against
its background?" If not, change the colors.

### 17. NUR EIN BRAND-LOGO PRO SLIDE

No double branding — ONE brand logo per slide is enough (preferably in the footer).
Don't place it top-right AND bottom-right. That looks cluttered and wastes space.

Exception: The CTA slide may have the logo centered + in the footer.

### 18. WHITESPACE IST PFLICHT

Nothing should feel cramped. Every element needs breathing room. Generous spacing
between badge, headline, subline, visual, and footer creates a professional look
and helps Instagram users scan quickly while scrolling.

Minimum spacing guidelines:
- 20-32px between badge/header and headline
- 16-24px between headline and subline
- Use `flex:1` for the main content area so it distributes naturally
- Cards need internal padding of at least 28px

### 19. VISUALISIERUNG = VERSTÄNDLICH OHNE KONTEXT

Every visualization must be understandable for someone who does NOT know the topic yet.
The creator knows what it's about, but the viewer doesn't. Ask yourself before designing:
"Would someone who has never heard of this topic understand this graphic within 1 second?"

Good: A YouTube homepage mockup with thumbnail grid (instantly recognizable)
Bad: Abstract boxes with X marks (meaningless without context)

If the answer is "only with explanation", choose a more concrete representation —
real UI mockups, recognizable shapes, familiar metaphors.

### 20. KEIN FAKE-BUTTON AUF INSTAGRAM

Never place clickable-looking buttons ("Folgen", "Speichern") on Instagram slides.
They're images — nothing is clickable. Fake buttons look amateurish.

Instead, use a text-based CTA: "Folge für mehr Wissen rund um [Thema]" or
a question that invites engagement. The text CTA is the call to action,
not a button mockup.

### 21. LOGO-GRÖSSE = HIERARCHIE

The brand logo should never dominate the main message of a slide. On the CTA slide,
the question or call-to-action is MORE important than the logo. If the logo is too
large, the actual message gets pushed into the background.

Guidelines:
- Brand logo on CTA slide: max 180px width
- The headline/question is always the most dominant element on every slide
- If the logo competes with the headline for attention, make the logo smaller

### 22. TEXTFLUSS PRÜFEN — KEINE ISOLIERTEN WÖRTER

After generating slides, always check that text wraps naturally. Single words should
not sit isolated on their own line if they belong to the previous sentence.
"nichts." alone on a line looks broken when it belongs to "...bringt dir nichts."

After rendering, review every slide's text flow:
- Does any single word sit alone on a line?
- Does the line break feel natural or forced?
- If broken: adjust font size, line width, or rephrase slightly

---

## Architecture

```
Satori (HTML/CSS → SVG) → @resvg/resvg-js (SVG → PNG 1080x1350)
```

No Chrome, no Puppeteer, no browser.

**Setup (run once):**
```bash
npm install satori @fontsource/outfit @resvg/resvg-js
pip install Pillow --break-system-packages
```

Note: Use `@resvg/resvg-js` for SVG→PNG conversion (pure JS, no system dependencies).
If `librsvg2-bin` / `rsvg-convert` is available, that works too, but `resvg-js` is
the recommended approach because it doesn't require root/sudo privileges.

## Workflow

1. Collect user input (text, topic, handle, colors, optional image)
2. Plan 3-Akt Storyline with "Und deshalb"-Brücken
3. Assign visual elements to each slide
4. Build generate.js with BOTH latin + latin-ext fonts
5. Run `node generate.js` → produces slide-01.png, slide-02.png, etc.
6. Run contact sheet script → horizontal contact sheet
7. Present contact-sheet.png FIRST, then individual PNGs

---

## STORYLINE FRAMEWORK — THE "UND DESHALB"-SYSTEM

This is the core mechanism that guarantees narrative coherence across every carousel.
ALWAYS apply this before designing slides.

### The 3-Akt Structure

Every carousel follows a 3-act narrative arc. The number of slides per act is flexible,
but the structure is mandatory:

| Akt | Purpose | Slides | Emotion |
|-----|---------|--------|---------|
| 1 — Spannung | Hook the reader, establish context, show the problem | 2-3 | Neugier → Frustration |
| 2 — Auflösung | Present the turning point, proof, and method | 2-3 | Überraschung → Verständnis |
| 3 — Abschluss | Deliver takeaways and call to action | 1-2 | Klarheit → Motivation |

### The "Und deshalb"-Brücke Test

Before finalizing ANY slide sequence, test every transition:

- From Slide 1 → 2: Can you say "und deshalb..." or "das zeigt sich so..."?
- From Slide 2 → 3: Can you say "und die Folge ist..." or "und deshalb..."?
- From Slide 3 → 4: Can you say "aber..." or "es gibt einen Weg..."?
- From Slide 4 → 5: Can you say "und zwar weil..." or "der Beweis..."?
- From Slide 5 → 6: Can you say "das funktioniert weil..." or "das Prinzip dahinter..."?
- From Slide 6 → 7: Can you say "konkret heißt das..." or "die Takeaways..."?
- From Slide 7 → 8: Can you say "und jetzt du..."?

If ANY transition fails this test, reorder or rewrite until it works.

### Standard Story Templates

#### Template A: Problem → Lösung (most common)

| # | Akt | Slide-Typ | Rolle | Brücke |
|---|-----|-----------|-------|--------|
| 1 | Spannung | imageTitle / Hook | Neugier erzeugen | → "was passiert wirklich?" |
| 2 | Spannung | Chart / Visualisierung | Kontext mit Daten/Grafik zeigen | → "und deshalb..." |
| 3 | Spannung | Funnel / Kontrast | Die Konsequenz des Problems | → "aber..." |
| 4 | Auflösung | Erwartung vs. Realität | Der Wendepunkt | → "und zwar weil..." |
| 5 | Auflösung | Cards / Grid | Konkreter Beweis / Beispiele | → "das funktioniert weil..." |
| 6 | Auflösung | Metapher / Prinzip | Das übergeordnete Prinzip | → "konkret heißt das..." |
| 7 | Abschluss | Nummerierte Learnings | Takeaways mit Fortschrittsbalken | → "und jetzt du:" |
| 8 | Abschluss | CTA | Frage + Folgen/Speichern | Ende |

#### Template B: Erkenntnis → Methode

| # | Akt | Slide-Typ | Rolle |
|---|-----|-----------|-------|
| 1 | Spannung | Hook | Überraschende Erkenntnis / Gegenposition |
| 2 | Spannung | statHero | Große Zahl als Beweis |
| 3 | Auflösung | Erwartung vs. Realität | Was die meisten denken vs. was stimmt |
| 4 | Auflösung | Schritte / Prozess | Die konkrete Methode |
| 5 | Auflösung | Beispiel / Case Study | Beweis dass es funktioniert |
| 6 | Abschluss | Learnings | Zusammenfassung |
| 7 | Abschluss | CTA | Frage + Folgen/Speichern |

#### Template C: Story → Lektion

| # | Akt | Slide-Typ | Rolle |
|---|-----|-----------|-------|
| 1 | Spannung | Hook mit Bild | Persönliche Geschichte starten |
| 2 | Spannung | Zitat / Statement | Der Moment der Erkenntnis |
| 3 | Spannung | Problem-Visualisierung | Was schiefging |
| 4 | Auflösung | Wendepunkt | Was sich geändert hat |
| 5 | Auflösung | Konkreter Beweis | Zahlen, Ergebnisse, Vorher/Nachher |
| 6 | Abschluss | Learnings | Was du mitnehmen solltest |
| 7 | Abschluss | CTA | Frage + Folgen/Speichern |

### Template Selection Logic

Analyze the user's input text and choose the template based on content:
- **Has a clear problem + solution?** → Template A
- **Has a surprising insight or contrarian take?** → Template B
- **Has a personal story or experience?** → Template C
- **Mixed content?** → Default to Template A, adapt as needed

---

## VISUAL DESIGN SYSTEM

### Design Principle: Every Slide Needs a Graphic

The #1 rule: text alone is never enough. Every slide must have a visual element
that supports and amplifies the message. Here's the catalog of visual elements:

### Visual Element Catalog

| Visual | When to Use | Complexity |
|--------|-------------|------------|
| Line/Curve Chart | Trends, trajectories, rise-and-fall stories | Medium |
| Funnel Diagram | Attrition, dropout, narrowing down | Medium |
| Contrast Cards | Expectation vs. Reality, Before vs. After | Low |
| 2x2 / Grid Cards | Multiple items with equal weight (features, projects) | Low |
| Progress Bars | Sequential steps, building towards completion | Low |
| Stat Hero (big number) | Single impactful metric | Low |
| Arrow Flow | Cause → Effect, Process flow | Medium |
| Icon/Shape Grid | Repetition, monotony, volume | Medium |
| Illustration (SVG) | Metaphors (oxygen mask, mountain, bridge) | High |
| Strikethrough Pills | What's being replaced / debunked | Low |
| Tag/Color Badges | Categories, labels, status indicators | Low |
| Quote Box | Direct quotes, prompts, user input | Low |

### Visual Assignment Rules

After planning the storyline, assign visuals to each slide:

1. **Hook slide (Slide 1):** Image + text overlay OR bold typography with visual element + platform Bildmarke (see Rule 15)
2. **Context/Data slide (Slide 2):** ALWAYS a chart, diagram, or data visualization
3. **Problem slide (Slide 3):** Funnel, contrast cards, or icon grid showing the negative
4. **Turning point (Slide 4):** Side-by-side contrast (Expectation vs. Reality)
5. **Proof slide (Slide 5):** Grid cards, numbered items, or concrete examples
6. **Principle slide (Slide 6):** SVG illustration + quote, or metaphor visualization
7. **Learnings (Slide 7):** Numbered cards with progress bars
8. **CTA (Slide 8):** Clean, centered, text-based CTA + question (no fake buttons — see Rule 20)

---

## DESIGN SYSTEM

### Font: Outfit (geometric, Gordita-like)
Weights: 400-800. Load WOFF from `@fontsource/outfit`. ALWAYS load BOTH `latin` AND `latin-ext`.

### Color Palette: BLACK & WHITE ONLY

NO purple, no blue, no color accent — never. Only exception: green/red for positive/negative.

| Token | Value | Use |
|-------|-------|-----|
| bg | #FFFFFF | Slide background |
| text | #0A0A0A | Primary text, accent |
| textSoft | #444444 | Secondary text |
| textMuted | #666666 | Labels |
| cardBg | #F0F0F0 | Card backgrounds |
| border | #D0D0D0 | Dividers |
| green | #10B981 | Positive / final step highlight |
| red | #EF4444 | Negative / danger |
| bgDark | #0C0C0C | Dark slides |

### Minimum Font Size: 29px

| Element | Canvas px |
|---------|-----------|
| Title | 56-76 |
| Badge label | 22 |
| Body text | 28-34 |
| Card text | 26-30 |
| Subline | 28 |
| Key learning | 28 |
| IG handle | 24 |
| Source text | 20 |
| Big metric (statHero) | 120-160 |

### Layout — TWO-BLOCK PATTERN

NEVER use `justifyContent: 'center'` or `justifyContent: 'space-between'` on the slide root.

```
┌─────────────────────┐
│ BADGE (fixed)        │ ← Category label, tight margins
│ HEADLINE (fixed)     │ ← Directly below badge
│ SUBLINE (optional)   │ ← Context below headline
│                      │
│ VISUAL (flex:1)      │ ← Charts/Cards/Graphics EXPAND to fill
│                      │
│ KEY LEARNING (fixed) │ ← Pinned to bottom, takeaway bar
└─────────────────────┘
```

```javascript
// Slide root: NO justifyContent — use flex:1 on the visual block
h('div', { style: { display:'flex', flexDirection:'column', width:1080, height:1350, padding:'70px', backgroundColor:bg, fontFamily:'Outfit' } },
  badge('LABEL'),
  headline('Title'),
  subline('Context'),
  h('div', { style: { display:'flex', flex:'1', flexDirection:'column', justifyContent:'center' } },
    /* VISUAL ELEMENT HERE */
  ),
  keyLearning('Takeaway text'),
);
```

### Padding
- Slide padding: 70px all sides
- Card padding: 28-36px
- Card border-radius: 18-24px

### Light/Dark Alternation
Alternate white (bg) and dark (bgDark) slides for visual rhythm:
- Odd slides: light (bg: #FFFFFF)
- Even slides: dark (bg: #0C0C0C)
- Exception: First slide can be dark if using image overlay

---

## REUSABLE COMPONENTS

### Badge (category label)
```javascript
function badge(text, dark=false) {
  return h('div', { style: { display:'flex', marginBottom:'16px' } },
    h('span', { style: { display:'flex', fontSize:'22px', fontWeight:700, letterSpacing:'3px',
      color: dark ? '#FFFFFF' : C.text,
      backgroundColor: dark ? 'rgba(255,255,255,0.08)' : C.cardBg,
      padding:'10px 22px', borderRadius:'12px' } }, text),
  );
}
```

### Headline
```javascript
function headline(text, dark=false, size=64) {
  return h('span', { style: { fontSize:`${size}px`, fontWeight:800,
    color: dark ? '#FFFFFF' : C.text,
    lineHeight:'1.08', letterSpacing:'-1.5px', marginBottom:'6px' } }, text);
}
```

### Subline
```javascript
function subline(text, dark=false) {
  return h('span', { style: { fontSize:'28px', fontWeight:500,
    color: dark ? 'rgba(255,255,255,0.5)' : C.textMuted,
    lineHeight:'1.5', marginTop:'8px' } }, text);
}
```

### Key Learning (bottom bar)
```javascript
function keyLearning(text, dark=false) {
  return h('div', { style: { display:'flex', alignItems:'center', gap:'14px',
    backgroundColor: dark ? 'rgba(255,255,255,0.06)' : C.cardBg,
    borderRadius:'16px', padding:'22px 28px', marginTop:'auto' } },
    h('div', { style: { display:'flex', width:'6px', minHeight:'40px',
      backgroundColor: dark ? '#FFFFFF' : C.text, borderRadius:'3px' } }),
    h('span', { style: { fontSize:'28px', fontWeight:600,
      color: dark ? '#FFFFFF' : C.text, lineHeight:'1.4' } }, text),
  );
}
```

### IG Handle
```javascript
function igHandle(handle, dark=false) {
  return h('div', { style: { display:'flex', alignItems:'center', marginTop:'16px' } },
    h('span', { style: { fontSize:'24px', fontWeight:500,
      color: dark ? 'rgba(255,255,255,0.35)' : C.textMuted } }, handle),
  );
}
```

### Contrast Cards (Erwartung vs. Realität)
```javascript
// Two side-by-side cards showing contrast
h('div', { style: { display:'flex', gap:'14px' } },
  // Left: expectation (light card)
  h('div', { style: { display:'flex', flex:'1', flexDirection:'column', backgroundColor:C.cardBg, borderRadius:'20px', padding:'28px', gap:'12px' } },
    h('span', { style: { fontSize:'22px', fontWeight:700, letterSpacing:'2px', color:C.textMuted } }, 'ERWARTUNG'),
    h('div', { style: { display:'flex', width:'100%', height:'4px', backgroundColor:C.border, borderRadius:'2px' } }),
    h('span', { style: { fontSize:'28px', fontWeight:600, color:C.textSoft, lineHeight:'1.4' } }, 'What people think'),
  ),
  // Right: reality (dark card)
  h('div', { style: { display:'flex', flex:'1', flexDirection:'column', backgroundColor:C.text, borderRadius:'20px', padding:'28px', gap:'12px' } },
    h('span', { style: { fontSize:'22px', fontWeight:700, letterSpacing:'2px', color:'rgba(255,255,255,0.5)' } }, 'REALITÄT'),
    h('div', { style: { display:'flex', width:'100%', height:'4px', backgroundColor:'rgba(255,255,255,0.15)', borderRadius:'2px' } }),
    h('span', { style: { fontSize:'28px', fontWeight:600, color:'#FFFFFF', lineHeight:'1.4' } }, 'What actually happens'),
  ),
),
```

### Numbered Learning Cards with Progress Bars
```javascript
const learnings = [
  { num:'01', text:'First learning', pct:25 },
  { num:'02', text:'Second learning', pct:50 },
  { num:'03', text:'Third learning', pct:75 },
  { num:'04', text:'Fourth learning', pct:100 },
];

learnings.map(l =>
  h('div', { style: { display:'flex', flexDirection:'column', gap:'10px', padding:'24px 28px', backgroundColor:C.cardBg, borderRadius:'18px' } },
    h('div', { style: { display:'flex', alignItems:'center', gap:'18px' } },
      h('span', { style: { fontSize:'40px', fontWeight:800, color: l.pct === 100 ? C.green : C.text, minWidth:'60px' } }, l.num),
      h('span', { style: { fontSize:'28px', fontWeight:600, color:C.text, lineHeight:'1.3' } }, l.text),
    ),
    h('div', { style: { display:'flex', height:'6px', backgroundColor:C.border, borderRadius:'3px', overflow:'hidden' } },
      h('div', { style: { display:'flex', width:`${l.pct}%`, height:'6px', backgroundColor: l.pct === 100 ? C.green : C.text, borderRadius:'3px' } }),
    ),
  )
)
```

### 2x2 Project/Feature Grid (dark)
```javascript
h('div', { style: { display:'flex', gap:'14px' } },
  h('div', { style: { display:'flex', flex:'1', flexDirection:'column', backgroundColor:'rgba(255,255,255,0.06)', borderRadius:'20px', padding:'28px', gap:'10px', border:'1px solid rgba(255,255,255,0.08)' } },
    h('div', { style: { display:'flex', width:'52px', height:'52px', borderRadius:'14px', backgroundColor:'rgba(255,255,255,0.1)', alignItems:'center', justifyContent:'center' } },
      h('span', { style: { fontSize:'26px', fontWeight:800, color:'#FFFFFF' } }, 'AB'), // initials
    ),
    h('span', { style: { fontSize:'28px', fontWeight:700, color:'#FFFFFF' } }, 'Title'),
    h('span', { style: { fontSize:'22px', fontWeight:500, color:'rgba(255,255,255,0.45)', lineHeight:'1.4' } }, 'Description'),
  ),
  // ... repeat for second card
),
```

### Arrow/Flow Connector
```javascript
h('div', { style: { display:'flex', justifyContent:'center', padding:'4px 0' } },
  h('div', { style: { display:'flex', flexDirection:'column', alignItems:'center' } },
    h('div', { style: { display:'flex', width:'4px', height:'28px', backgroundColor:C.border } }),
    h('div', { style: { display:'flex', width:'0px', height:'0px', borderLeft:'10px solid transparent', borderRight:'10px solid transparent', borderTop:`12px solid ${C.border}` } }),
  ),
),
```

### CTA — Text-Based (NO fake buttons! See Rule 20)
```javascript
// NEVER use button-styled elements on Instagram — they're not clickable.
// Instead, use a text-based call to action:
h('div', { style: { display:'flex', flexDirection:'column', alignItems:'center', gap:'16px', marginTop:'24px' } },
  h('span', { style: { fontSize:'34px', fontWeight:700, color:'#FFFFFF', textAlign:'center', lineHeight:'1.4' } },
    'Folge für mehr Wissen rund um [Thema]'),
),
```

### Danger/Highlight Tag
```javascript
h('div', { style: { display:'flex', alignItems:'center', gap:'10px', padding:'14px 24px', backgroundColor:'rgba(239,68,68,0.08)', borderRadius:'14px' } },
  h('div', { style: { display:'flex', width:'12px', height:'12px', borderRadius:'6px', backgroundColor:C.red } }),
  h('span', { style: { fontSize:'26px', fontWeight:600, color:C.red } }, 'Warning text here'),
),
```

### Strikethrough Pills (debunking)
```javascript
h('div', { style: { display:'flex', alignItems:'center', gap:'16px' } },
  h('span', { style: { fontSize:'30px', fontWeight:500, color:'rgba(255,255,255,0.4)', textDecoration:'line-through' } }, 'Old thing'),
  h('span', { style: { fontSize:'30px', fontWeight:400, color:'rgba(255,255,255,0.25)' } }, '  /  '),
  h('span', { style: { fontSize:'30px', fontWeight:500, color:'rgba(255,255,255,0.4)', textDecoration:'line-through' } }, 'Other old thing'),
),
```

---

## SVG CHARTS & ILLUSTRATIONS

Build SVG graphics as standalone strings (NO `<text>` elements — Satori crashes on those).
Convert to base64 data-URI and embed as `<img>`.

```javascript
const svg = `<svg width="860" height="420" viewBox="0 0 860 420" xmlns="http://www.w3.org/2000/svg">
  <!-- Only <line>, <path>, <circle>, <rect> — NO <text> -->
</svg>`;
const src = `data:image/svg+xml;base64,${Buffer.from(svg).toString('base64')}`;
h('img', { src, width:860, height:420, style:{ objectFit:'contain' } });
```

Render all labels, values, legends as regular `h('span', ...)` elements OUTSIDE the SVG.

### Proven SVG Patterns

**Line/Curve Chart** (for trends, trajectories):
- Use `<path>` with cubic bezier curves
- Use `<linearGradient>` for color transitions (green → red)
- Add threshold line with `stroke-dasharray` for danger zones
- Add `<circle>` dots at key data points

**Funnel Diagram** (for attrition, dropout):
- 3 `<rect>` elements with decreasing width
- Connecting `<line>` elements between layers
- Use gradient fills for positive (green) and negative (red) layers

**Metaphor Illustrations** (oxygen mask, mountain, etc.):
- Simple line art with `<path>` and `<line>` elements
- Keep strokes white on dark backgrounds, opacity 0.3-0.9
- Max complexity: 10-15 SVG elements

---

## USER IMAGE HANDLING

When the user provides an image (photo, portrait, screenshot):

```bash
# Resize and convert to base64
convert /mnt/user-data/uploads/image.png -resize 900x -quality 85 face.jpg
base64 -w0 face.jpg > face.b64
```

```javascript
const imgB64 = fs.readFileSync('face.b64', 'utf8').trim();
const imgSrc = `data:image/jpeg;base64,${imgB64}`;

// Use as full-bleed background on slide 1
h('div', { style: { display:'flex', width:W, height:H, position:'relative' } },
  h('img', { src:imgSrc, width:W, height:H, style:{ objectFit:'cover', position:'absolute', top:0, left:0 } }),
  h('div', { style: { display:'flex', position:'absolute', top:0, left:0, width:W, height:H,
    background:'linear-gradient(180deg, rgba(0,0,0,0.1) 0%, rgba(0,0,0,0.35) 40%, rgba(0,0,0,0.88) 100%)' } }),
  h('div', { style: { display:'flex', flexDirection:'column', position:'absolute', top:0, left:0, width:W, height:H, padding:'70px', justifyContent:'flex-end' } },
    // Content here
  ),
);
```

---

## SATORI TECHNICAL NOTES

- Uses `h(type, props, ...children)` helper, NOT JSX
- Children go INSIDE props: `{ type, props: { style, children } }`
- Every div with multiple children needs `display: "flex"`
- No box-shadow, no text-shadow
- Font: WOFF format only (not WOFF2)
- Images as base64 data-URI
- Arrow characters (→) may not render — use text alternatives
- Checkmarks, emojis, and special characters break Satori — use numbered lists instead
- Satori import: `require('satori').default || require('satori')`

### CRITICAL: SVG `<text>` elements crash Satori

Satori throws an error on `<text>` nodes. Build SVG with only `<line>`, `<path>`, `<circle>`,
`<rect>`. All text labels go as `h('span', ...)` elements outside the SVG.

### CRITICAL: h() children must be undefined when empty

```javascript
const h = (type, props, ...ch) => ({
  type, props: { ...props, children: ch.length === 1 ? ch[0] : ch.length === 0 ? undefined : ch }
});
```

---

## CONTENT ANALYSIS — BEFORE YOU DESIGN

When the user provides input text, analyze it in this order:

1. **Extract the core message** — What's the ONE thing the reader should take away?
2. **Identify the story type** — Problem/Solution? Insight/Method? Personal Story/Lesson?
3. **Select the template** — A, B, or C based on story type
4. **Map content to slides** — Assign each piece of content to a slide in the template
5. **Test the "Und deshalb"-Brücken** — Verify every transition works
6. **Assign visual elements** — Pick graphics that support each slide's message
7. **Only then: write the code**

### Content-to-Visual Mapping

| Content Type | Best Visual |
|-------------|-------------|
| "Am Anfang war alles toll, dann..." | Line/Curve Chart (rise and fall) |
| "Viele machen X, wenige schaffen Y" | Funnel Diagram |
| "Was die meisten denken vs. Realität" | Contrast Cards side-by-side |
| "Ich habe 4 Dinge die mich antreiben" | 2x2 Grid Cards |
| "Meine 3-5 Learnings" | Numbered Cards + Progress Bars |
| "Das Prinzip dahinter ist..." | SVG Metaphor Illustration |
| "Die Zahl die alles ändert" | Stat Hero (huge number) |
| "Schritt 1, Schritt 2, Schritt 3" | Numbered Steps with Connectors |
| "X ist nicht Y" / Debunking | Strikethrough Pills |
| Zitat / Spruch / Weisheit | Quote Box with border |

---

## SLIDE COUNT GUIDELINES

- **7-8 slides** is the sweet spot for most carousels
- Minimum: 6 slides (shorter feels incomplete)
- Maximum: 10 slides (longer loses attention)
- Akt 1 (Spannung): 2-3 slides
- Akt 2 (Auflösung): 2-3 slides
- Akt 3 (Abschluss): 1-2 slides
- No redundant slides — if two slides trigger the same emotion, merge them
- Every slide must introduce a NEW thought

---

## LANGUAGE

Default German with real umlauts (ä, ö, ü, ß). Technical terms in English.
No Fach-Englisch/Jargon on slides — formulate so non-techies understand it.

---

## COMPLETE GENERATION TEMPLATE

```javascript
const fs = require('fs');
const path = require('path');

async function main() {
  const satori = (await import('satori')).default || require('satori');
  const { Resvg } = require('@resvg/resvg-js');

  const fontDir = path.join(__dirname, 'node_modules/@fontsource/outfit/files');
  const fonts = [400,500,600,700,800].flatMap(w => [
    { name:'Outfit', weight:w, style:'normal', data: fs.readFileSync(path.join(fontDir, `outfit-latin-${w}-normal.woff`)) },
    { name:'Outfit', weight:w, style:'normal', data: fs.readFileSync(path.join(fontDir, `outfit-latin-ext-${w}-normal.woff`)) },
  ]);

  const C = {
    bg:'#FFFFFF', text:'#0A0A0A', textSoft:'#444444', textMuted:'#666666',
    cardBg:'#F0F0F0', border:'#D0D0D0', bgDark:'#0C0C0C',
    green:'#10B981', red:'#EF4444',
  };

  const W = 1080, H = 1350;

  const h = (type, props, ...ch) => ({
    type, props: { ...props, children: ch.length === 1 ? ch[0] : ch.length === 0 ? undefined : ch }
  });

  // === REUSABLE COMPONENTS ===
  // (paste badge, headline, subline, keyLearning, igHandle from above)

  // === SLIDES ===
  // Build each slide following the 3-Akt storyline

  const slides = [slide1, slide2, /* ... */ slideN];

  for (let i = 0; i < slides.length; i++) {
    const svg = await satori(slides[i], { width:W, height:H, fonts });
    const resvg = new Resvg(svg, { fitTo: { mode: 'width', value: W } });
    const pngData = resvg.render();
    const pngPath = path.join(__dirname, 'slides', `slide-${String(i+1).padStart(2,'0')}.png`);
    fs.writeFileSync(pngPath, pngData.asPng());
    console.log(`Slide ${i+1}/${slides.length} done`);
  }
  console.log('All slides generated!');
}

main().catch(e => { console.error(e); process.exit(1); });
```
