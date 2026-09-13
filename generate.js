const fs = require('fs');
const path = require('path');

async function main() {
  const satori = (await import('satori')).default || require('satori');
  const { Resvg } = require('@resvg/resvg-js');

  const manropeDir = path.join(__dirname, 'node_modules/@fontsource/manrope/files');
  const interDir = path.join(__dirname, 'node_modules/@fontsource/inter/files');
  const fonts = [
    ...[600, 700, 800].flatMap((w) => [
      { name: 'Manrope', weight: w, style: 'normal', data: fs.readFileSync(`${manropeDir}/manrope-latin-${w}-normal.woff`) },
      { name: 'Manrope', weight: w, style: 'normal', data: fs.readFileSync(`${manropeDir}/manrope-latin-ext-${w}-normal.woff`) },
    ]),
    ...[400, 500, 600, 700].flatMap((w) => [
      { name: 'Inter', weight: w, style: 'normal', data: fs.readFileSync(`${interDir}/inter-latin-${w}-normal.woff`) },
      { name: 'Inter', weight: w, style: 'normal', data: fs.readFileSync(`${interDir}/inter-latin-ext-${w}-normal.woff`) },
    ]),
  ];

  const C = {
    bg: '#14161A',
    text: '#FFFFFF',
    textSoft: 'rgba(255,255,255,0.72)',
    textMuted: '#9AA0AB',
    cardBg: 'rgba(255,255,255,0.06)',
    cardBorder: 'rgba(255,255,255,0.12)',
    accent: '#2952FF',
    accent2: '#00C2B8',
    gold: '#CBA35C',
    green: '#10B981',
    red: '#EF4444',
  };

  const W = 1080, H = 1350;

  const h = (type, props, ...ch) => ({
    type, props: { ...props, children: ch.length === 1 ? ch[0] : ch.length === 0 ? undefined : ch },
  });

  function bdMonogramSvg(fill) {
    return `<svg viewBox="14 10 86 46" xmlns="http://www.w3.org/2000/svg">
      <rect x="14" y="10" width="10" height="46" rx="5" fill="${fill}"/>
      <path d="M19 10H34A11 11 0 0 1 34 32H19Z" fill="${fill}"/>
      <path d="M19 32H36A12 12 0 0 1 36 56H19Z" fill="${fill}"/>
      <rect x="51" y="10" width="10" height="46" rx="5" fill="${fill}"/>
      <path d="M56 10H77A23 23 0 0 1 77 56H56Z" fill="${fill}"/>
    </svg>`;
  }
  function bdLogoImg(fill, width) {
    const src = 'data:image/svg+xml;base64,' + Buffer.from(bdMonogramSvg(fill)).toString('base64');
    return h('img', { src, width, height: width * (46 / 86), style: { display: 'flex' } });
  }

  function svgImg(inner, size, viewBox = '0 0 48 48') {
    const svg = `<svg viewBox="${viewBox}" width="${size}" height="${size}" xmlns="http://www.w3.org/2000/svg">${inner}</svg>`;
    const src = 'data:image/svg+xml;base64,' + Buffer.from(svg).toString('base64');
    return h('img', { src, width: size, height: size, style: { display: 'flex' } });
  }

  // === REUSABLE COMPONENTS ===

  function badge(text, color = C.text, bg = C.cardBg) {
    return h('div', { style: { display: 'flex', marginBottom: '18px' } },
      h('span', { style: { display: 'flex', fontFamily: 'Manrope', fontSize: '22px', fontWeight: 700, letterSpacing: '3px', color, backgroundColor: bg, padding: '10px 22px', borderRadius: '12px' } }, text));
  }

  function headline(text, size = 60) {
    return h('span', { style: { display: 'flex', fontFamily: 'Manrope', fontSize: `${size}px`, fontWeight: 800, color: C.text, lineHeight: '1.14', letterSpacing: '-1px', marginBottom: '4px' } }, text);
  }

  function subline(text) {
    return h('span', { style: { display: 'flex', fontFamily: 'Inter', fontSize: '28px', fontWeight: 500, color: C.textSoft, lineHeight: '1.5', marginTop: '10px' } }, text);
  }

  function keyLearning(text, danger = false) {
    return h('div', { style: { display: 'flex', alignItems: 'center', gap: '14px', backgroundColor: C.cardBg, border: `1px solid ${C.cardBorder}`, borderRadius: '16px', padding: '24px 28px', marginTop: 'auto' } },
      h('div', { style: { display: 'flex', width: '6px', minHeight: '40px', backgroundColor: danger ? C.red : C.accent2, borderRadius: '3px' } }),
      h('span', { style: { display: 'flex', fontFamily: 'Inter', fontSize: '26px', fontWeight: 600, color: C.text, lineHeight: '1.4' } }, text));
  }

  function footer() {
    return h('div', { style: { display: 'flex', alignItems: 'center', gap: '12px', marginTop: '20px' } },
      bdLogoImg('rgba(255,255,255,0.55)', 34),
      h('span', { style: { display: 'flex', fontFamily: 'Inter', fontSize: '24px', fontWeight: 500, color: C.textMuted } }, '@benarodigital'));
  }

  function slideRoot(...children) {
    return h('div', { style: { display: 'flex', flexDirection: 'column', width: W, height: H, padding: '70px', backgroundColor: C.bg, fontFamily: 'Inter' } }, ...children);
  }

  function arrowDown(color = C.cardBorder) {
    return h('div', { style: { display: 'flex', justifyContent: 'center', padding: '2px 0' } },
      h('div', { style: { display: 'flex', flexDirection: 'column', alignItems: 'center' } },
        h('div', { style: { display: 'flex', width: '4px', height: '22px', backgroundColor: color } }),
        h('div', { style: { display: 'flex', width: '0px', height: '0px', borderLeft: '9px solid transparent', borderRight: '9px solid transparent', borderTop: `11px solid ${color}` } }),
      ));
  }

  // Vertical "Schlecht" (red) / "Gut" (green) contrast stack
  function badGoodStack(badText, goodText) {
    return h('div', { style: { display: 'flex', flexDirection: 'column', gap: '4px' } },
      h('div', { style: { display: 'flex', flexDirection: 'column', backgroundColor: 'rgba(239,68,68,0.10)', border: `1px solid ${C.red}`, borderRadius: '20px', padding: '30px 32px', gap: '14px' } },
        h('span', { style: { display: 'flex', fontFamily: 'Manrope', fontSize: '22px', fontWeight: 700, letterSpacing: '2px', color: C.red } }, 'SCHLECHT'),
        h('span', { style: { display: 'flex', fontFamily: 'Inter', fontSize: '30px', fontWeight: 600, color: C.text, lineHeight: '1.4' } }, badText),
      ),
      arrowDown(C.cardBorder),
      h('div', { style: { display: 'flex', flexDirection: 'column', backgroundColor: 'rgba(16,185,129,0.12)', border: `1px solid ${C.green}`, borderRadius: '20px', padding: '30px 32px', gap: '14px' } },
        h('span', { style: { display: 'flex', fontFamily: 'Manrope', fontSize: '22px', fontWeight: 700, letterSpacing: '2px', color: C.green } }, 'GUT'),
        h('span', { style: { display: 'flex', fontFamily: 'Inter', fontSize: '30px', fontWeight: 600, color: C.text, lineHeight: '1.4' } }, goodText),
      ),
    );
  }

  // Icon set (rect/path/circle only, no <text> — Satori-safe)
  const ICONS = {
    button: `<rect x="5" y="16" width="38" height="17" rx="8.5" fill="none" stroke="${C.accent2}" stroke-width="3"/><rect x="14" y="23" width="20" height="4" rx="2" fill="${C.accent2}"/>`,
    form: `<rect x="6" y="9" width="36" height="10" rx="3" fill="none" stroke="${C.accent2}" stroke-width="3"/><line x1="6" y1="29" x2="32" y2="29" stroke="${C.accent2}" stroke-width="3" stroke-linecap="round"/><line x1="6" y1="38" x2="20" y2="38" stroke="${C.accent2}" stroke-width="3" stroke-linecap="round"/>`,
    error: `<path d="M24 6 L44 40 L4 40 Z" fill="none" stroke="${C.accent2}" stroke-width="3" stroke-linejoin="round"/><line x1="24" y1="18" x2="24" y2="27" stroke="${C.accent2}" stroke-width="3" stroke-linecap="round"/><circle cx="24" cy="33" r="1.9" fill="${C.accent2}"/>`,
    placeholder: `<line x1="6" y1="13" x2="42" y2="13" stroke="${C.accent2}" stroke-width="3" stroke-dasharray="6 5" stroke-linecap="round"/><line x1="6" y1="24" x2="34" y2="24" stroke="${C.accent2}" stroke-width="3" stroke-dasharray="6 5" stroke-linecap="round"/><line x1="6" y1="35" x2="24" y2="35" stroke="${C.accent2}" stroke-width="3" stroke-dasharray="6 5" stroke-linecap="round"/>`,
    confirm: `<circle cx="24" cy="24" r="17" fill="none" stroke="${C.accent2}" stroke-width="3"/><path d="M16 24 L21.5 30 L33 16.5" fill="none" stroke="${C.accent2}" stroke-width="3.5" stroke-linecap="round" stroke-linejoin="round"/>`,
  };

  function iconCard(iconKey, title, example) {
    return h('div', { style: { display: 'flex', flexDirection: 'column', width: '304px', backgroundColor: C.cardBg, border: `1px solid ${C.cardBorder}`, borderRadius: '18px', padding: '22px', gap: '14px' } },
      h('div', { style: { display: 'flex', width: '52px', height: '52px', borderRadius: '14px', backgroundColor: 'rgba(0,194,184,0.12)', alignItems: 'center', justifyContent: 'center' } },
        svgImg(ICONS[iconKey], 30)),
      h('div', { style: { display: 'flex', flexDirection: 'column', gap: '6px' } },
        h('span', { style: { display: 'flex', fontFamily: 'Manrope', fontSize: '23px', fontWeight: 700, color: C.text, lineHeight: '1.25' } }, title),
        h('span', { style: { display: 'flex', fontFamily: 'Inter', fontSize: '20px', fontWeight: 500, color: C.textMuted, lineHeight: '1.3' } }, example),
      ),
    );
  }

  function checkRow(text) {
    return h('div', { style: { display: 'flex', alignItems: 'center', gap: '18px', padding: '18px 26px', backgroundColor: C.cardBg, border: `1px solid ${C.cardBorder}`, borderRadius: '16px' } },
      h('div', { style: { display: 'flex', width: '38px', height: '38px', borderRadius: '19px', backgroundColor: 'rgba(16,185,129,0.15)', alignItems: 'center', justifyContent: 'center' } },
        svgImg(`<circle cx="24" cy="24" r="17" fill="none" stroke="${C.green}" stroke-width="0"/><path d="M15 24 L21 30 L34 15" fill="none" stroke="${C.green}" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/>`, 24)),
      h('span', { style: { display: 'flex', fontFamily: 'Inter', fontSize: '25px', fontWeight: 600, color: C.text, lineHeight: '1.3' } }, text));
  }

  // === SLIDES ===
  // Thema: Microcopy — warum die kleinsten Wörter auf einer Website den größten Unterschied
  // machen. Kategorie: Content & Storytelling.

  // Slide 1 — Hook (Akt 1)
  const slide1 = slideRoot(
    badge('WUSSTEST DU?'),
    headline('Die meistgelesenen Wörter deiner Website sind nicht deine Headline.', 52),
    subline('Es sind die kleinen Texte an Buttons, Formularen und Fehlermeldungen — genau dort, wo Besucher gerade handeln wollen.'),
    h('div', { style: { display: 'flex', flex: '1', flexDirection: 'column', justifyContent: 'center' } },
      h('div', { style: { display: 'flex', flexDirection: 'column', backgroundColor: C.cardBg, border: `1px solid ${C.cardBorder}`, borderRadius: '20px', padding: '32px', gap: '18px' } },
        h('span', { style: { display: 'flex', fontFamily: 'Manrope', fontSize: '20px', fontWeight: 700, letterSpacing: '2px', color: C.textMuted } }, 'STARTSEITE'),
        h('div', { style: { display: 'flex', flexDirection: 'column', gap: '8px' } },
          h('div', { style: { display: 'flex', alignItems: 'center', width: '100%', height: '96px', backgroundColor: 'rgba(255,255,255,0.05)', borderRadius: '12px', padding: '0 24px' } },
            h('span', { style: { display: 'flex', fontFamily: 'Manrope', fontSize: '30px', fontWeight: 800, color: 'rgba(255,255,255,0.28)' } }, 'Deine große Headline')),
          h('div', { style: { display: 'flex', justifyContent: 'flex-end', marginTop: '2px' } },
            h('span', { style: { display: 'flex', fontFamily: 'Manrope', fontSize: '17px', fontWeight: 700, letterSpacing: '1.5px', color: 'rgba(255,255,255,0.32)' } }, 'WIRD ÜBERFLOGEN')),
        ),
        h('div', { style: { display: 'flex', flexDirection: 'column', gap: '8px', marginTop: '6px' } },
          h('div', { style: { display: 'flex', alignItems: 'center', width: '58%', height: '64px', backgroundColor: 'rgba(0,194,184,0.14)', border: `2px solid ${C.accent2}`, borderRadius: '32px', padding: '0 28px' } },
            h('span', { style: { display: 'flex', fontFamily: 'Manrope', fontSize: '24px', fontWeight: 700, color: C.text } }, 'Jetzt anfragen')),
          h('div', { style: { display: 'flex', justifyContent: 'flex-start', marginTop: '2px' } },
            h('span', { style: { display: 'flex', fontFamily: 'Manrope', fontSize: '17px', fontWeight: 700, letterSpacing: '1.5px', color: C.accent2 } }, 'WIRD GELESEN')),
        ),
      ),
    ),
    keyLearning('Genau dort, wo Besucher handeln sollen, entscheiden wenige Wörter über den nächsten Klick.'),
    footer(),
  );

  // Slide 2 — Definition (Akt 1→2, "Und deshalb")
  const slide2 = slideRoot(
    badge('DEFINITION'),
    headline('Was ist Microcopy?', 62),
    subline('Die kleinen Textbausteine, die eine Website im Nutzungsmoment begleiten.'),
    h('div', { style: { display: 'flex', flex: '1', flexDirection: 'column', justifyContent: 'center', gap: '14px' } },
      h('div', { style: { display: 'flex', gap: '14px', justifyContent: 'center' } },
        iconCard('button', 'Button-Label', 'z.B. "Jetzt starten"'),
        iconCard('form', 'Formular-Hinweis', 'z.B. "Mind. 8 Zeichen"'),
        iconCard('error', 'Fehlermeldung', 'z.B. "Bitte prüfen"'),
      ),
      h('div', { style: { display: 'flex', gap: '14px', justifyContent: 'center' } },
        iconCard('placeholder', 'Platzhaltertext', 'z.B. "deine@email.de"'),
        iconCard('confirm', 'Bestätigung', 'z.B. "Erfolgreich gesendet"'),
      ),
    ),
    keyLearning('Fünf Textbausteine, ein Ziel: den Besucher im Moment der Handlung führen.'),
    footer(),
  );

  // Slide 3 — Warum es zählt ("Und deshalb")
  const slide3 = slideRoot(
    badge('UND DESHALB'),
    headline('Genau hier entscheidet sich der Klick.', 56),
    subline('In diesen Momenten braucht der Besucher Klarheit oder Sicherheit — schlechte Microcopy erzeugt Reibung genau am Entscheidungspunkt.'),
    h('div', { style: { display: 'flex', flex: '1', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', gap: '22px' } },
      h('div', { style: { display: 'flex', alignItems: 'center', gap: '20px' } },
        h('div', { style: { display: 'flex', flexDirection: 'column', backgroundColor: 'rgba(239,68,68,0.08)', border: `1px solid rgba(239,68,68,0.4)`, borderRadius: '16px', padding: '18px 22px' } },
          h('span', { style: { display: 'flex', fontFamily: 'Inter', fontSize: '22px', fontWeight: 600, color: C.red } }, 'Zweifel')),
        h('div', { style: { display: 'flex', flexDirection: 'column', alignItems: 'center', backgroundColor: 'rgba(0,194,184,0.14)', border: `2px solid ${C.accent2}`, borderRadius: '24px', padding: '30px 46px', gap: '10px' } },
          svgImg(`<path d="M10 5 L10 33 L17 27 L21.5 37 L26 35 L21.5 25 L31 25 Z" fill="${C.text}"/>`, 30, '0 0 40 44'),
          h('span', { style: { display: 'flex', fontFamily: 'Manrope', fontSize: '26px', fontWeight: 800, color: C.text } }, 'Der Klick')),
        h('div', { style: { display: 'flex', flexDirection: 'column', backgroundColor: 'rgba(16,185,129,0.10)', border: `1px solid rgba(16,185,129,0.4)`, borderRadius: '16px', padding: '18px 22px' } },
          h('span', { style: { display: 'flex', fontFamily: 'Inter', fontSize: '22px', fontWeight: 600, color: C.green } }, 'Vertrauen')),
      ),
    ),
    keyLearning('"Nutzer lesen nicht, sie scannen." — Steve Krug, "Don\'t Make Me Think". Klarheit schlägt Kreativität.'),
    footer(),
  );

  // Slide 4 — Beispiel 1: Button-Texte
  const slide4 = slideRoot(
    badge('BEISPIEL 1'),
    headline('Button-Texte', 62),
    h('div', { style: { display: 'flex', flex: '1', flexDirection: 'column', justifyContent: 'center', marginTop: '10px' } },
      badGoodStack('"Absenden"', '"Jetzt kostenlose Beratung sichern"'),
    ),
    keyLearning('Konkrete Handlungsversprechen schlagen generische Verben.'),
    footer(),
  );

  // Slide 5 — Beispiel 2: Fehlermeldungen
  const slide5 = slideRoot(
    badge('BEISPIEL 2'),
    headline('Fehlermeldungen', 58),
    h('div', { style: { display: 'flex', flex: '1', flexDirection: 'column', justifyContent: 'center', marginTop: '10px' } },
      badGoodStack('"Fehler: Ungültige Eingabe"', '"Bitte gib deine E-Mail im Format name@beispiel.de ein"'),
    ),
    keyLearning('Eine gute Fehlermeldung sagt, was zu tun ist — nicht nur, was falsch ist.'),
    footer(),
  );

  // Slide 6 — Beispiel 3: Leere Zustände
  const slide6 = slideRoot(
    badge('BEISPIEL 3'),
    headline('Leere Zustände', 58),
    h('div', { style: { display: 'flex', flex: '1', flexDirection: 'column', justifyContent: 'center', marginTop: '10px' } },
      badGoodStack('"Keine Ergebnisse"', '"Noch nichts hier — leg jetzt deinen ersten Eintrag an"'),
    ),
    keyLearning('Auch ein leerer Bildschirm kann motivieren statt zu enttäuschen.'),
    footer(),
  );

  // Slide 7 — Zusammenfassung (Akt 3, "Und deshalb")
  const slide7 = slideRoot(
    badge('MERKE DIR'),
    headline('Details kosten nichts — wirken aber viel.', 52),
    subline('Microcopy verursacht kaum Entwicklungsaufwand, hat aber direkten Einfluss darauf, ob Besucher Vertrauen fassen und handeln.'),
    h('div', { style: { display: 'flex', flex: '1', flexDirection: 'column', justifyContent: 'center', gap: '14px' } },
      checkRow('Button-Label'),
      checkRow('Formular-Hinweis'),
      checkRow('Fehlermeldung'),
      checkRow('Platzhaltertext'),
      checkRow('Bestätigungsmeldung'),
    ),
    keyLearning('Quelle: Nielsen Norman Group, "Microcopy: Definition and Examples"; Kinneret Yifrah, "Microcopy: The Complete Guide" (2017).'),
    footer(),
  );

  // Slide 8 — CTA (Akt 3)
  const slide8 = slideRoot(
    h('div', { style: { display: 'flex', flex: '1', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', gap: '32px' } },
      bdLogoImg(C.text, 168),
      h('span', { style: { display: 'flex', fontFamily: 'Manrope', fontSize: '46px', fontWeight: 800, color: C.text, textAlign: 'center', lineHeight: '1.25', letterSpacing: '-1px' } }, 'Bereit für eine Website, die auch im Detail überzeugt?'),
      h('span', { style: { display: 'flex', fontFamily: 'Inter', fontSize: '30px', fontWeight: 700, color: C.text, textAlign: 'center', lineHeight: '1.4', marginTop: '10px' } }, 'Folge @benarodigital für mehr Website-Wissen'),
    ),
    footer(),
  );

  const slides = [slide1, slide2, slide3, slide4, slide5, slide6, slide7, slide8];

  const outDir = path.join(__dirname, 'output', 'carousel_2026-09-13', 'slides');
  fs.mkdirSync(outDir, { recursive: true });

  for (let i = 0; i < slides.length; i++) {
    const svg = await satori(slides[i], { width: W, height: H, fonts });
    const resvg = new Resvg(svg, { fitTo: { mode: 'width', value: W } });
    const pngData = resvg.render();
    const pngPath = path.join(outDir, `slide-${String(i + 1).padStart(2, '0')}.png`);
    fs.writeFileSync(pngPath, pngData.asPng());
    console.log(`Slide ${i + 1}/${slides.length} done -> ${pngPath}`);
  }
  console.log('All slides generated!');
}

main().catch((e) => { console.error(e); process.exit(1); });
