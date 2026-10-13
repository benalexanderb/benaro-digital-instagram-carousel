const fs = require('fs');
const path = require('path');

async function main() {
  const satori = (await import('satori')).default || require('satori');
  const { Resvg } = require('@resvg/resvg-js');

  const manropeDir = path.join(__dirname, 'node_modules/@fontsource/manrope/files');
  const interDir = path.join(__dirname, 'node_modules/@fontsource/inter/files');
  const fonts = [
    ...[600, 700, 800].flatMap(w => [
      { name: 'Manrope', weight: w, style: 'normal', data: fs.readFileSync(`${manropeDir}/manrope-latin-${w}-normal.woff`) },
      { name: 'Manrope', weight: w, style: 'normal', data: fs.readFileSync(`${manropeDir}/manrope-latin-ext-${w}-normal.woff`) },
    ]),
    ...[400, 500, 600, 700].flatMap(w => [
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
    type, props: { ...props, children: ch.length === 1 ? ch[0] : ch.length === 0 ? undefined : ch }
  });

  // === BD MONOGRAM LOGO ===
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

  // === REUSABLE COMPONENTS ===
  function badge(text) {
    return h('div', { style: { display: 'flex', marginBottom: '20px' } },
      h('span', {
        style: {
          display: 'flex', fontSize: '22px', fontWeight: 700, letterSpacing: '3px',
          fontFamily: 'Manrope', color: C.text, backgroundColor: C.cardBg,
          border: `1px solid ${C.cardBorder}`, padding: '10px 22px', borderRadius: '12px',
        }
      }, text),
    );
  }

  function headline(text, size = 62) {
    return h('span', {
      style: {
        display: 'flex', fontSize: `${size}px`, fontWeight: 800, fontFamily: 'Manrope',
        color: C.text, lineHeight: '1.1', letterSpacing: '-1.5px', marginBottom: '6px',
      }
    }, text);
  }

  function subline(text) {
    return h('span', {
      style: {
        display: 'flex', fontSize: '28px', fontWeight: 500, fontFamily: 'Inter',
        color: C.textSoft, lineHeight: '1.5', marginTop: '10px',
      }
    }, text);
  }

  function keyLearning(text, warn = false) {
    return h('div', {
      style: {
        display: 'flex', alignItems: 'center', gap: '16px', backgroundColor: C.cardBg,
        border: `1px solid ${C.cardBorder}`, borderRadius: '16px', padding: '24px 28px', marginTop: 'auto',
      }
    },
      h('div', { style: { display: 'flex', width: '6px', minHeight: '44px', backgroundColor: warn ? C.red : C.accent2, borderRadius: '3px' } }),
      h('span', { style: { display: 'flex', fontSize: '28px', fontWeight: 600, fontFamily: 'Inter', color: C.text, lineHeight: '1.4' } }, text),
    );
  }

  function footer() {
    return h('div', { style: { display: 'flex', alignItems: 'center', gap: '12px', marginTop: '24px' } },
      bdLogoImg('rgba(255,255,255,0.55)', 34),
      h('span', { style: { display: 'flex', fontSize: '24px', fontWeight: 500, fontFamily: 'Inter', color: C.textMuted } }, '@benarodigital'),
    );
  }

  function slideRoot(...children) {
    return h('div', {
      style: {
        display: 'flex', flexDirection: 'column', width: W, height: H, padding: '70px',
        backgroundColor: C.bg, fontFamily: 'Inter',
      }
    }, ...children);
  }

  function visualBlock(...children) {
    return h('div', { style: { display: 'flex', flex: '1', flexDirection: 'column', justifyContent: 'center' } }, ...children);
  }

  function svgImg(svg, width, height) {
    const src = 'data:image/svg+xml;base64,' + Buffer.from(svg).toString('base64');
    return h('img', { src, width, height, style: { display: 'flex' } });
  }

  function card(children, accent) {
    return h('div', {
      style: {
        display: 'flex', flex: '1', flexDirection: 'column', gap: '14px',
        backgroundColor: accent ? C.accent : C.cardBg,
        border: accent ? 'none' : `1px solid ${C.cardBorder}`,
        borderRadius: '20px', padding: '26px',
      }
    }, ...children);
  }

  function lockIcon(fill) {
    return svgImg(`<svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
      <rect x="4" y="10" width="16" height="11" rx="2.5" fill="none" stroke="${fill}" stroke-width="2"/>
      <path d="M7.5 10V7.5a4.5 4.5 0 0 1 9 0V10" fill="none" stroke="${fill}" stroke-width="2"/>
      <circle cx="12" cy="15.3" r="1.6" fill="${fill}"/>
    </svg>`, 44, 44);
  }

  // === SLIDE 1: HOOK ===
  const slide1 = slideRoot(
    badge('ACHTUNG'),
    headline('Dein Kunde bricht nicht wegen des Preises ab – sondern wegen eines fehlenden Siegels.', 48),
    subline('An Formularen und Checkouts entscheidet oft nicht das Angebot, sondern das Gefühl von Sicherheit.'),
    visualBlock(
      h('div', { style: { display: 'flex', gap: '16px' } },
        card([
          h('span', { style: { display: 'flex', fontSize: '21px', fontWeight: 700, letterSpacing: '2px', fontFamily: 'Manrope', color: C.textMuted } }, 'OHNE SIGNAL'),
          h('span', { style: { display: 'flex', fontSize: '24px', fontWeight: 600, fontFamily: 'Inter', color: C.textSoft, lineHeight: '1.4' } }, '"Kann ich hier wirklich meine Daten eingeben?"'),
        ]),
        card([
          h('span', { style: { display: 'flex', fontSize: '21px', fontWeight: 700, letterSpacing: '2px', fontFamily: 'Manrope', color: 'rgba(255,255,255,0.75)' } }, 'MIT SIGNAL'),
          h('span', { style: { display: 'flex', fontSize: '24px', fontWeight: 600, fontFamily: 'Inter', color: '#FFFFFF', lineHeight: '1.4' } }, '"Sieht sicher aus – ich mache weiter."'),
        ], true),
      ),
    ),
    keyLearning('Vertrauen entscheidet am Formular oft mehr als das eigentliche Angebot.', true),
    footer(),
  );

  // === SLIDE 2: WAS NUTZER SUCHEN ===
  function signalRow(label) {
    return h('div', { style: { display: 'flex', alignItems: 'center', gap: '18px', backgroundColor: C.cardBg, border: `1px solid ${C.cardBorder}`, borderRadius: '16px', padding: '20px 24px' } },
      lockIcon(C.accent2),
      h('span', { style: { display: 'flex', fontSize: '24px', fontWeight: 600, fontFamily: 'Inter', color: C.text } }, label),
    );
  }

  const slide2 = slideRoot(
    badge('DIE SUCHE'),
    headline('Bevor Besucher klicken, scannen sie unbewusst nach Sicherheits-Signalen.', 46),
    subline('Schloss-Symbol in der Adresszeile, bekannte Zahlungslogos, ein erkennbares Siegel, ein Impressum-Link.'),
    visualBlock(
      h('div', { style: { display: 'flex', flexDirection: 'column', gap: '14px' } },
        signalRow('SSL-Schloss-Symbol in der Browserleiste'),
        signalRow('Bekannte, erkennbare Zahlungsanbieter-Logos'),
        signalRow('Echtes Gütesiegel statt Fantasie-Symbol'),
        signalRow('Sichtbarer Impressum- & Datenschutz-Link'),
      ),
    ),
    keyLearning('Jedes dieser Signale senkt das gefühlte Risiko an einem einzigen Entscheidungspunkt.'),
    footer(),
  );

  // === SLIDE 3: PROBLEM — Fantasiesiegel wirkt nicht ===
  const slide3 = slideRoot(
    badge('DAS PROBLEM'),
    headline('Nicht jedes Siegel wirkt – nur erkannte Siegel schaffen Vertrauen.', 46),
    subline('Das Baymard Institute dokumentiert in seiner Checkout-Usability-Forschung: unbekannte oder generische Siegel werden von Nutzer:innen kaum als Sicherheits-Signal wahrgenommen.'),
    visualBlock(
      h('div', { style: { display: 'flex', gap: '16px' } },
        card([
          h('span', { style: { display: 'flex', fontSize: '21px', fontWeight: 700, letterSpacing: '2px', fontFamily: 'Manrope', color: C.textMuted } }, 'FANTASIE-SIEGEL'),
          h('span', { style: { display: 'flex', fontSize: '22px', fontWeight: 500, fontFamily: 'Inter', color: C.textSoft, lineHeight: '1.4' } }, 'Selbst gebautes Icon, niemand kennt die Quelle'),
        ]),
        card([
          h('span', { style: { display: 'flex', fontSize: '21px', fontWeight: 700, letterSpacing: '2px', fontFamily: 'Manrope', color: 'rgba(255,255,255,0.75)' } }, 'ECHTES SIEGEL'),
          h('span', { style: { display: 'flex', fontSize: '22px', fontWeight: 500, fontFamily: 'Inter', color: '#FFFFFF', lineHeight: '1.4' } }, 'Bekannte, verifizierbare Quelle – sofort wiedererkannt'),
        ], true),
      ),
    ),
    keyLearning('Ein Siegel, das niemand kennt, wirkt wie gar kein Siegel.', true),
    footer(),
  );

  // === SLIDE 4: ERWARTUNG VS REALITÄT ===
  const slide4 = slideRoot(
    badge('HÄUFIGER FEHLER'),
    headline('"Irgendein Siegel reicht schon" – ein teurer Irrtum.', 50),
    visualBlock(
      h('div', { style: { display: 'flex', gap: '16px' } },
        card([
          h('span', { style: { display: 'flex', fontSize: '21px', fontWeight: 700, letterSpacing: '2px', fontFamily: 'Manrope', color: C.textMuted } }, 'ERWARTUNG'),
          h('span', { style: { display: 'flex', fontSize: '22px', fontWeight: 500, fontFamily: 'Inter', color: C.textSoft, lineHeight: '1.4' } }, 'Hauptsache irgendein Siegel ist zu sehen'),
        ]),
        card([
          h('span', { style: { display: 'flex', fontSize: '21px', fontWeight: 700, letterSpacing: '2px', fontFamily: 'Manrope', color: 'rgba(255,255,255,0.75)' } }, 'REALITÄT'),
          h('span', { style: { display: 'flex', fontSize: '22px', fontWeight: 500, fontFamily: 'Inter', color: '#FFFFFF', lineHeight: '1.4' } }, 'Nur erkannte, vertraute Signale senken die Unsicherheit wirklich'),
        ], true),
      ),
    ),
    keyLearning('Vertrauen lässt sich nicht durch ein beliebiges Symbol simulieren.', true),
    footer(),
  );

  // === SLIDE 5: DAS PRINZIP DAHINTER ===
  const slide5 = slideRoot(
    badge('DAS PRINZIP'),
    headline('Bekannte Symbole wirken wie ein Stück Autorität.', 50),
    subline('Robert Cialdinis Autoritätsprinzip ("Influence", 1984): Menschen vertrauen eher Signalen, die von einer erkennbaren, legitimen Quelle stammen.'),
    visualBlock(
      h('div', { style: { display: 'flex', alignItems: 'center', gap: '20px' } },
        lockIcon(C.accent2),
        h('div', { style: { display: 'flex', flex: '1', height: '2px', backgroundColor: C.cardBorder } }),
        h('div', { style: { display: 'flex', width: '64px', height: '64px', borderRadius: '16px', backgroundColor: C.accent, alignItems: 'center', justifyContent: 'center' } },
          h('span', { style: { display: 'flex', fontSize: '28px', fontWeight: 800, fontFamily: 'Manrope', color: C.text } }, '✓'),
        ),
      ),
    ),
    keyLearning('Ein wiedererkanntes Symbol ersetzt für Besucher kurz die eigene Prüfung.'),
    footer(),
  );

  // === SLIDE 6: PLATZIERUNG ===
  const slide6 = slideRoot(
    badge('PLATZIERUNG'),
    headline('Signale wirken am stärksten genau dort, wo Besucher zögern.', 46),
    subline('Direkt am Formularfeld oder neben dem Zahlungs-Button – nicht nur versteckt im Footer.'),
    visualBlock(
      h('div', { style: { display: 'flex', flexDirection: 'column', gap: '16px' } },
        h('div', { style: { display: 'flex', height: '64px', borderRadius: '14px', backgroundColor: 'rgba(255,255,255,0.08)', alignItems: 'center', paddingLeft: '24px' } },
          h('span', { style: { display: 'flex', fontSize: '22px', fontWeight: 600, fontFamily: 'Inter', color: C.textMuted } }, 'Zahlungsdaten eingeben...'),
        ),
        h('div', { style: { display: 'flex', alignItems: 'center', gap: '16px' } },
          lockIcon(C.accent2),
          h('span', { style: { display: 'flex', fontSize: '22px', fontWeight: 600, fontFamily: 'Inter', color: C.text } }, 'Sicher verschlüsselt'),
          h('div', { style: { display: 'flex', flex: '1' } }),
          h('div', { style: { display: 'flex', width: '160px', height: '64px', borderRadius: '14px', backgroundColor: C.accent, alignItems: 'center', justifyContent: 'center' } },
            h('span', { style: { display: 'flex', fontSize: '22px', fontWeight: 700, fontFamily: 'Manrope', color: C.text } }, 'Zahlen'),
          ),
        ),
      ),
    ),
    keyLearning('Je näher das Signal am Zögern sitzt, desto größer seine Wirkung.'),
    footer(),
  );

  // === SLIDE 7: CHECKLISTE ===
  const learnings = [
    { num: '01', text: 'Nur echte, verifizierbare Siegel statt Fantasie-Icons nutzen', pct: 25 },
    { num: '02', text: 'SSL-Schloss & bekannte Zahlungslogos sichtbar zeigen', pct: 50 },
    { num: '03', text: 'Signale direkt neben Formular oder Zahlungs-Button platzieren', pct: 75 },
    { num: '04', text: 'Impressum & Datenschutz leicht auffindbar halten', pct: 100 },
  ];

  const slide7 = slideRoot(
    badge('DEINE CHECKLISTE'),
    headline('4 Schritte zu mehr Vertrauen am Entscheidungspunkt.', 50),
    visualBlock(
      h('div', { style: { display: 'flex', flexDirection: 'column', gap: '14px' } },
        ...learnings.map(l =>
          h('div', { style: { display: 'flex', flexDirection: 'column', gap: '10px', padding: '20px 24px', backgroundColor: C.cardBg, border: `1px solid ${C.cardBorder}`, borderRadius: '18px' } },
            h('div', { style: { display: 'flex', alignItems: 'center', gap: '18px' } },
              h('span', { style: { display: 'flex', fontSize: '34px', fontWeight: 800, fontFamily: 'Manrope', color: l.pct === 100 ? C.green : C.accent2, minWidth: '58px' } }, l.num),
              h('span', { style: { display: 'flex', fontSize: '22px', fontWeight: 600, fontFamily: 'Inter', color: C.text, lineHeight: '1.3' } }, l.text),
            ),
            h('div', { style: { display: 'flex', height: '6px', backgroundColor: 'rgba(255,255,255,0.12)', borderRadius: '3px' } },
              h('div', { style: { display: 'flex', width: `${l.pct}%`, height: '6px', backgroundColor: l.pct === 100 ? C.green : C.accent2, borderRadius: '3px' } }),
            ),
          )
        ),
      ),
    ),
    keyLearning('Vertrauen ist kein Zufall – es wird gezielt an den richtigen Stellen aufgebaut.'),
    footer(),
  );

  // === SLIDE 8: CTA ===
  const slide8 = slideRoot(
    h('div', { style: { display: 'flex', flex: '1', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', gap: '32px' } },
      bdLogoImg(C.text, 140),
      h('span', {
        style: {
          display: 'flex', fontSize: '46px', fontWeight: 800, fontFamily: 'Manrope', color: C.text,
          textAlign: 'center', lineHeight: '1.2', letterSpacing: '-1px',
        }
      }, 'Welches Vertrauens-Signal fehlt auf deiner Website?'),
      h('span', {
        style: {
          display: 'flex', fontSize: '30px', fontWeight: 600, fontFamily: 'Inter', color: C.textSoft,
          textAlign: 'center', lineHeight: '1.4', marginTop: '8px',
        }
      }, 'Folge @benarodigital für mehr Website-Wissen.'),
    ),
    footer(),
  );

  const slides = [slide1, slide2, slide3, slide4, slide5, slide6, slide7, slide8];

  const outDir = path.join(__dirname, `output/carousel_${process.env.TODAY}/slides`);
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

main().catch(e => { console.error(e); process.exit(1); });
