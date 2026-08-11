// Carousel: Der 5-Sekunden-Test (Five Second Test / Steve Krug, "Don't Make Me Think", 2000)
// Kategorie: Content & Storytelling — Benaro Digital Instagram-Automation
const fs = require('fs');
const path = require('path');

async function main() {
  const satori = (await import('satori')).default || require('satori');
  const { Resvg } = require('@resvg/resvg-js');

  const manropeDir = path.join(__dirname, 'node_modules/@fontsource/manrope/files');
  const interDir = path.join(__dirname, 'node_modules/@fontsource/inter/files');
  const fonts = [
    ...[600, 700, 800].flatMap(w => [
      { name: 'Manrope', weight: w, style: 'normal', data: fs.readFileSync(path.join(manropeDir, `manrope-latin-${w}-normal.woff`)) },
      { name: 'Manrope', weight: w, style: 'normal', data: fs.readFileSync(path.join(manropeDir, `manrope-latin-ext-${w}-normal.woff`)) },
    ]),
    ...[400, 500, 600, 700].flatMap(w => [
      { name: 'Inter', weight: w, style: 'normal', data: fs.readFileSync(path.join(interDir, `inter-latin-${w}-normal.woff`)) },
      { name: 'Inter', weight: w, style: 'normal', data: fs.readFileSync(path.join(interDir, `inter-latin-ext-${w}-normal.woff`)) },
    ]),
  ];

  // === Benaro Digital brand colors (from benarodigital.com globals.css) ===
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

  // === BD monogram ===
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
    const height = width * (46 / 86);
    return h('img', { src, width, height, style: { display: 'flex' } });
  }

  // === Reusable components ===
  function badge(text) {
    return h('div', { style: { display: 'flex', marginBottom: '18px' } },
      h('span', {
        style: {
          display: 'flex', fontFamily: 'Inter', fontSize: '22px', fontWeight: 700, letterSpacing: '3px',
          color: C.accent2, backgroundColor: 'rgba(0,194,184,0.12)',
          padding: '10px 22px', borderRadius: '12px'
        }
      }, text)
    );
  }

  function headline(text, size, color) {
    return h('span', {
      style: {
        display: 'flex', fontFamily: 'Manrope', fontSize: (size || 58) + 'px', fontWeight: 800, color: color || C.text,
        lineHeight: '1.1', letterSpacing: '-1.5px', marginBottom: '6px'
      }
    }, text);
  }

  function subline(text) {
    return h('span', {
      style: { display: 'flex', fontFamily: 'Inter', fontSize: '28px', fontWeight: 500, color: C.textMuted, lineHeight: '1.5', marginTop: '10px' }
    }, text);
  }

  function keyLearning(text, accentColor) {
    return h('div', {
      style: {
        display: 'flex', alignItems: 'center', gap: '14px',
        backgroundColor: C.cardBg, borderRadius: '16px', padding: '22px 28px', marginTop: 'auto',
        border: `1px solid ${C.cardBorder}`,
      }
    },
      h('div', { style: { display: 'flex', width: '6px', minHeight: '40px', backgroundColor: accentColor || C.accent, borderRadius: '3px' } }),
      h('span', { style: { display: 'flex', fontFamily: 'Inter', fontSize: '27px', fontWeight: 600, color: C.text, lineHeight: '1.4' } }, text)
    );
  }

  function footer() {
    return h('div', { style: { display: 'flex', alignItems: 'center', gap: '12px', marginTop: '16px' } },
      bdLogoImg('rgba(255,255,255,0.55)', 34),
      h('span', { style: { display: 'flex', fontFamily: 'Inter', fontSize: '24px', fontWeight: 500, color: C.textMuted } }, '@benarodigital')
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

  function statementCard(label, text, opts) {
    opts = opts || {};
    return h('div', {
      style: {
        display: 'flex', flexDirection: 'column', backgroundColor: opts.bg || C.cardBg, borderRadius: '20px',
        padding: '28px', gap: '10px', border: `1px solid ${opts.border || C.cardBorder}`,
      }
    },
      h('span', { style: { display: 'flex', fontFamily: 'Inter', fontSize: '22px', fontWeight: 700, letterSpacing: '2px', color: opts.labelColor || C.textMuted } }, label),
      h('span', {
        style: {
          display: 'flex', fontFamily: 'Inter', fontSize: '28px', fontWeight: 600,
          color: opts.textColor || C.textSoft, lineHeight: '1.4',
          textDecoration: opts.strike ? 'line-through' : 'none',
        }
      }, text),
    );
  }

  function triggerRow(num, title, desc, color) {
    return h('div', { style: { display: 'flex', gap: '18px', alignItems: 'flex-start', backgroundColor: C.cardBg, borderRadius: '18px', padding: '20px 24px', border: `1px solid ${C.cardBorder}` } },
      h('div', {
        style: {
          display: 'flex', minWidth: '50px', height: '50px', borderRadius: '14px',
          backgroundColor: color, alignItems: 'center', justifyContent: 'center',
        }
      }, h('span', { style: { display: 'flex', fontFamily: 'Manrope', fontSize: '22px', fontWeight: 800, color: '#0B0C0E' } }, num)),
      h('div', { style: { display: 'flex', flexDirection: 'column', gap: '6px', flex: 1 } },
        h('span', { style: { display: 'flex', fontFamily: 'Manrope', fontSize: '28px', fontWeight: 700, color: C.text } }, title),
        h('span', { style: { display: 'flex', fontFamily: 'Inter', fontSize: '22px', fontWeight: 500, color: C.textMuted, lineHeight: '1.4' } }, desc),
      ),
    );
  }

  // Countdown row: 5 blocks counting down from 5 to 1, last one highlighted
  function countdownRow() {
    const nums = ['5', '4', '3', '2', '1'];
    return h('div', { style: { display: 'flex', gap: '16px', alignItems: 'center', justifyContent: 'center' } },
      ...nums.map((n, i) => {
        const isLast = i === nums.length - 1;
        return h('div', {
          style: {
            display: 'flex', width: '96px', height: '96px', borderRadius: '20px',
            backgroundColor: isLast ? C.accent2 : C.cardBg,
            border: `1px solid ${isLast ? C.accent2 : C.cardBorder}`,
            alignItems: 'center', justifyContent: 'center',
          }
        }, h('span', { style: { display: 'flex', fontFamily: 'Manrope', fontSize: '40px', fontWeight: 800, color: isLast ? '#0B0C0E' : C.textSoft } }, n));
      }),
    );
  }

  // Two-step process card: shown screen -> question
  function processCard(step, title, desc, color) {
    return h('div', { style: { display: 'flex', flexDirection: 'column', flex: 1, backgroundColor: C.cardBg, borderRadius: '20px', padding: '26px', gap: '14px', border: `1px solid ${C.cardBorder}` } },
      h('div', { style: { display: 'flex', width: '54px', height: '54px', borderRadius: '15px', backgroundColor: color, alignItems: 'center', justifyContent: 'center' } },
        h('span', { style: { display: 'flex', fontFamily: 'Manrope', fontSize: '24px', fontWeight: 800, color: '#0B0C0E' } }, step)),
      h('span', { style: { display: 'flex', fontFamily: 'Manrope', fontSize: '25px', fontWeight: 700, color: C.text, lineHeight: '1.3' } }, title),
      h('span', { style: { display: 'flex', fontFamily: 'Inter', fontSize: '21px', fontWeight: 500, color: C.textMuted, lineHeight: '1.4' } }, desc),
    );
  }

  // === SLIDE 1: Hook — 5 Sekunden ===
  const slide1 = slideRoot(
    badge('TEST DICH SELBST'),
    headline('5 SEKUNDEN.'),
    headline('MEHR ZEIT HAT DEIN', 46),
    headline('BESUCHER NICHT.', 46, C.accent2),
    subline('In dieser Zeit entscheidet sich, ob er bleibt – oder wieder geht.'),
    h('div', { style: { display: 'flex', flex: '1', flexDirection: 'column', justifyContent: 'center', gap: '24px' } },
      countdownRow(),
      h('span', { style: { display: 'flex', fontFamily: 'Inter', fontSize: '22px', fontWeight: 700, letterSpacing: '2px', color: C.textMuted, justifyContent: 'center' } }, 'DIE UHR LÄUFT AB DEM ERSTEN BLICK'),
    ),
    footer(),
  );

  // === SLIDE 2: Die Methode — Five Second Test ===
  const slide2 = slideRoot(
    badge('DIE METHODE'),
    headline('DER FIVE', 54),
    headline('SECOND TEST', 54, C.accent2),
    subline('Eine etablierte Usability-Testing-Methode: Eine Seite wird 5 Sekunden lang gezeigt, dann ausgeblendet – und gefragt, was hängen geblieben ist.'),
    h('div', { style: { display: 'flex', flex: '1', flexDirection: 'column', justifyContent: 'center', gap: '14px' } },
      processCard('1', 'Seite wird gezeigt', '5 Sekunden lang, ohne Vorwarnung.', C.accent2),
      processCard('2', 'Seite wird ausgeblendet', 'Der Bildschirm wird geschwärzt.', C.gold),
      processCard('3', 'Die entscheidende Frage', 'Was bietet diese Seite an – und für wen?', C.accent),
    ),
    footer(),
  );

  // === SLIDE 3: Konsequenz ===
  const slide3 = slideRoot(
    badge('DIE FOLGE FÜR DEINE WEBSITE'),
    headline('VERSTEHT ER ES NICHT—', 46),
    headline('IST ER SCHON WEG', 50),
    h('div', { style: { display: 'flex', flex: '1', flexDirection: 'column', justifyContent: 'center', gap: '14px' } },
      statementCard('WAS DU DENKST', '„Er scrollt schon weiter, wenn ihn etwas interessiert.“', { strike: true }),
      statementCard('WAS PASSIERT', 'Er sucht nicht nach der Antwort. Er geht einfach – ohne zu klicken, ohne zu scrollen.', { bg: 'rgba(239,68,68,0.12)', border: C.red, labelColor: C.red, textColor: C.text }),
    ),
    keyLearning('Ein Besucher, der nicht sofort versteht, gibt dir selten eine zweite Chance.', C.red),
    footer(),
  );

  // === SLIDE 4: Erwartung vs. Realität — Don't Make Me Think ===
  const slide4 = slideRoot(
    badge('MYTHOS VS. REALITÄT'),
    headline('KLARHEIT SCHLÄGT', 48),
    headline('KREATIVITÄT', 52, C.accent2),
    h('div', { style: { display: 'flex', flex: '1', flexDirection: 'column', justifyContent: 'center', gap: '14px' } },
      statementCard('ERWARTUNG', '„Ein cleverer, origineller Claim macht den besten Eindruck.“'),
      statementCard('REALITÄT', 'Steve Krug, „Don\'t Make Me Think" (2000): Nutzer lesen Seiten nicht, sie scannen sie. Der erste Eindruck muss ohne Nachdenken verständlich sein.', { bg: 'rgba(41,82,255,0.14)', border: C.accent, labelColor: C.accent, textColor: C.text }),
    ),
    keyLearning('Verständlichkeit gewinnt gegen jede noch so kreative Formulierung.', C.accent),
    footer(),
  );

  // === SLIDE 5: 3 Fragen, die zählen ===
  const slide5 = slideRoot(
    badge('3 FRAGEN, DIE ZÄHLEN'),
    headline('DAS MUSS DEIN', 50),
    headline('BESUCHER SOFORT', 50),
    headline('VERSTEHEN', 50, C.accent2),
    h('div', { style: { display: 'flex', flex: '1', flexDirection: 'column', justifyContent: 'center', gap: '14px' } },
      triggerRow('1', 'Was bietest du an?', 'In einem Satz, ohne Fachjargon.', C.accent2),
      triggerRow('2', 'Für wen ist es?', 'Damit sich der richtige Besucher angesprochen fühlt.', C.gold),
      triggerRow('3', 'Was soll ich jetzt tun?', 'Der nächste Schritt muss eindeutig sein.', C.accent),
    ),
    footer(),
  );

  // === SLIDE 6: Takeaways ===
  const learnings = [
    { num: '01', text: 'Besucher entscheiden innerhalb von Sekunden, ob sie bleiben', pct: 25 },
    { num: '02', text: 'Der Five-Second-Test macht sichtbar, was wirklich ankommt', pct: 50 },
    { num: '03', text: 'Klarheit schlägt Kreativität – so Steve Krugs Kernprinzip', pct: 75 },
    { num: '04', text: 'Kläre sofort: Was, für wen, und was als Nächstes', pct: 100 },
  ];
  const slide6 = slideRoot(
    badge('DIE TAKEAWAYS'),
    headline('4 LEARNINGS ZUM', 54),
    headline('MITNEHMEN', 54),
    h('div', { style: { display: 'flex', flex: '1', flexDirection: 'column', justifyContent: 'center', gap: '14px' } },
      ...learnings.map(l =>
        h('div', { style: { display: 'flex', flexDirection: 'column', gap: '10px', padding: '22px 26px', backgroundColor: C.cardBg, borderRadius: '18px', border: `1px solid ${C.cardBorder}` } },
          h('div', { style: { display: 'flex', alignItems: 'center', gap: '18px' } },
            h('span', { style: { display: 'flex', fontFamily: 'Manrope', fontSize: '36px', fontWeight: 800, color: l.pct === 100 ? C.accent2 : C.text, minWidth: '58px' } }, l.num),
            h('span', { style: { display: 'flex', fontFamily: 'Inter', fontSize: '24px', fontWeight: 600, color: C.text, lineHeight: '1.3' } }, l.text),
          ),
          h('div', { style: { display: 'flex', height: '6px', backgroundColor: C.cardBorder, borderRadius: '3px', overflow: 'hidden' } },
            h('div', { style: { display: 'flex', width: `${l.pct}%`, height: '6px', backgroundColor: l.pct === 100 ? C.accent2 : C.accent, borderRadius: '3px' } }),
          ),
        )
      ),
    ),
    footer(),
  );

  // === SLIDE 7: CTA ===
  const slide7 = slideRoot(
    h('div', { style: { display: 'flex', flex: '1', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', gap: '32px' } },
      bdLogoImg(C.text, 96),
      h('span', {
        style: {
          display: 'flex', fontFamily: 'Manrope', fontSize: '42px', fontWeight: 800, color: C.text,
          textAlign: 'center', lineHeight: '1.3', letterSpacing: '-1px',
        }
      }, 'Würde ein Fremder in 5\nSekunden verstehen,\nwas du anbietest?'),
      h('span', {
        style: { display: 'flex', fontFamily: 'Inter', fontSize: '28px', fontWeight: 500, color: C.textMuted, textAlign: 'center', lineHeight: '1.5' }
      }, 'Folge @benarodigital für mehr Website-Wissen\nrund um Klarheit, UX & Conversion.'),
    ),
    footer(),
  );

  const slides = [slide1, slide2, slide3, slide4, slide5, slide6, slide7];
  const outDir = path.join(__dirname, 'output', 'carousel_2026-08-11', 'slides');
  fs.mkdirSync(outDir, { recursive: true });

  for (let i = 0; i < slides.length; i++) {
    const svg = await satori(slides[i], { width: W, height: H, fonts });
    const resvg = new Resvg(svg, { fitTo: { mode: 'width', value: W } });
    const pngData = resvg.render();
    const pngPath = path.join(outDir, `slide-${String(i + 1).padStart(2, '0')}.png`);
    fs.writeFileSync(pngPath, pngData.asPng());
    console.log(`Slide ${i + 1}/${slides.length} done`);
  }
  console.log('All slides generated!');
}

main().catch(e => { console.error(e); process.exit(1); });
