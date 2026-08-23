// Carousel: Structured Data / Schema.org — wie Google Seiteninhalte wirklich versteht
// Kategorie: SEO — Benaro Digital Instagram-Automation
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

  // === SLIDE 1 visual: Google sees text bars, not meaning ===
  function textBarsCard() {
    const widths = [88, 62, 94, 74, 50];
    return h('div', {
      style: {
        display: 'flex', flexDirection: 'column', gap: '16px', backgroundColor: C.cardBg,
        borderRadius: '20px', padding: '34px', border: `1px solid ${C.cardBorder}`, position: 'relative',
      }
    },
      ...widths.map(w => h('div', { style: { display: 'flex', width: `${w}%`, height: '20px', backgroundColor: 'rgba(255,255,255,0.16)', borderRadius: '6px' } })),
      h('div', {
        style: {
          display: 'flex', position: 'absolute', top: '-26px', right: '-16px', width: '60px', height: '60px',
          borderRadius: '30px', backgroundColor: C.accent2, alignItems: 'center', justifyContent: 'center',
        }
      }, h('span', { style: { display: 'flex', fontFamily: 'Manrope', fontSize: '34px', fontWeight: 800, color: '#0B0C0E' } }, '?')),
    );
  }
  function unknownPillsRow() {
    const labels = ['TYP?', 'PREIS?', 'BEWERTUNG?'];
    return h('div', { style: { display: 'flex', gap: '12px', marginTop: '30px' } },
      ...labels.map(l => h('div', {
        style: {
          display: 'flex', flex: 1, alignItems: 'center', justifyContent: 'center', padding: '18px 10px',
          borderRadius: '14px', border: `2px dashed ${C.textMuted}`,
        }
      }, h('span', { style: { display: 'flex', fontFamily: 'Inter', fontSize: '22px', fontWeight: 600, color: C.textMuted } }, l)))
    );
  }

  // === SLIDE 2 visual: human view vs. bot view, side by side ===
  function miniProductCard() {
    return h('div', {
      style: { display: 'flex', flexDirection: 'column', flex: 1, backgroundColor: C.cardBg, borderRadius: '20px', padding: '28px', gap: '14px', border: `1px solid ${C.cardBorder}` }
    },
      h('span', { style: { display: 'flex', fontFamily: 'Inter', fontSize: '20px', fontWeight: 700, letterSpacing: '2px', color: C.textMuted } }, 'DU SIEHST'),
      h('span', { style: { display: 'flex', fontFamily: 'Manrope', fontSize: '26px', fontWeight: 700, color: C.text, lineHeight: '1.3' } }, 'Premium Laufschuh'),
      h('div', { style: { display: 'flex', alignItems: 'center', gap: '8px' } },
        ...Array.from({ length: 5 }).map(() => h('div', { style: { display: 'flex', width: '16px', height: '16px', borderRadius: '8px', backgroundColor: C.gold } })),
        h('span', { style: { display: 'flex', fontFamily: 'Inter', fontSize: '20px', fontWeight: 600, color: C.textSoft, marginLeft: '6px' } }, '4,8'),
      ),
      h('span', { style: { display: 'flex', fontFamily: 'Manrope', fontSize: '28px', fontWeight: 800, color: C.accent2 } }, '49,00 €'),
    );
  }
  function miniPlainCard() {
    const widths = [70, 92, 55, 80];
    return h('div', {
      style: { display: 'flex', flexDirection: 'column', flex: 1, backgroundColor: 'rgba(41,82,255,0.10)', borderRadius: '20px', padding: '28px', gap: '14px', border: `1px solid ${C.accent}` }
    },
      h('span', { style: { display: 'flex', fontFamily: 'Inter', fontSize: '20px', fontWeight: 700, letterSpacing: '2px', color: C.accent } }, 'GOOGLE OHNE MARKUP'),
      ...widths.map(w => h('div', { style: { display: 'flex', width: `${w}%`, height: '16px', backgroundColor: 'rgba(255,255,255,0.18)', borderRadius: '6px' } })),
    );
  }

  // === SLIDE 3 visual: three identical, undifferentiated search result rows ===
  function fakeResultRow() {
    return h('div', {
      style: { display: 'flex', flexDirection: 'column', gap: '8px', backgroundColor: C.cardBg, borderRadius: '14px', padding: '22px 26px', border: `1px solid ${C.cardBorder}` }
    },
      h('div', { style: { display: 'flex', width: '42%', height: '13px', backgroundColor: 'rgba(255,255,255,0.24)', borderRadius: '4px' } }),
      h('div', { style: { display: 'flex', width: '72%', height: '20px', backgroundColor: 'rgba(255,255,255,0.38)', borderRadius: '5px', marginTop: '4px' } }),
      h('div', { style: { display: 'flex', width: '86%', height: '12px', backgroundColor: 'rgba(255,255,255,0.16)', borderRadius: '4px' } }),
      h('div', { style: { display: 'flex', width: '58%', height: '12px', backgroundColor: 'rgba(255,255,255,0.16)', borderRadius: '4px' } }),
    );
  }

  // === SLIDE 4 visual: hub-and-spoke — Schema.org built jointly since 2011 ===
  function schemaHubVisual() {
    return h('div', { style: { display: 'flex', flexDirection: 'column', alignItems: 'center' } },
      h('div', { style: { display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '22px 44px', borderRadius: '20px', backgroundColor: C.accent } },
        h('span', { style: { display: 'flex', fontFamily: 'Manrope', fontSize: '30px', fontWeight: 800, color: '#FFFFFF', letterSpacing: '-0.5px' } }, 'SCHEMA.ORG'),
      ),
      h('div', { style: { display: 'flex', width: '4px', height: '44px', backgroundColor: C.cardBorder } }),
      h('div', { style: { display: 'flex', width: '100%', justifyContent: 'space-between' } },
        ...['GOOGLE', 'MICROSOFT', 'YAHOO', 'YANDEX'].map(name =>
          h('div', { style: { display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '12px' } },
            h('div', {
              style: {
                display: 'flex', width: '84px', height: '84px', borderRadius: '42px', backgroundColor: C.cardBg,
                border: `2px solid ${C.cardBorder}`, alignItems: 'center', justifyContent: 'center',
              }
            }, h('span', { style: { display: 'flex', fontFamily: 'Manrope', fontSize: '30px', fontWeight: 800, color: C.accent2 } }, name[0])),
            h('span', { style: { display: 'flex', fontFamily: 'Inter', fontSize: '18px', fontWeight: 600, color: C.textMuted } }, name),
          )
        ),
      ),
    );
  }

  // === SLIDE 5 visual: JSON-LD property list ===
  function propertyRow(key, value, highlight) {
    return h('div', {
      style: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '18px', paddingBottom: '18px', borderBottom: `1px solid ${C.cardBorder}` }
    },
      h('span', { style: { display: 'flex', fontFamily: 'Inter', fontSize: '23px', fontWeight: 600, color: C.textMuted } }, key),
      h('span', { style: { display: 'flex', fontFamily: 'Manrope', fontSize: '25px', fontWeight: 700, color: highlight ? C.accent2 : C.text } }, value),
    );
  }
  function jsonLdCard() {
    return h('div', { style: { display: 'flex', flexDirection: 'column', backgroundColor: C.cardBg, borderRadius: '22px', padding: '32px', border: `1px solid ${C.cardBorder}` } },
      h('div', { style: { display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '6px' } },
        h('div', { style: { display: 'flex', width: '14px', height: '14px', borderRadius: '7px', backgroundColor: C.accent2 } }),
        h('span', { style: { display: 'flex', fontFamily: 'Inter', fontSize: '19px', fontWeight: 700, letterSpacing: '2px', color: C.textMuted } }, 'JSON-LD IM QUELLCODE'),
      ),
      propertyRow('@type', 'Product'),
      propertyRow('name', 'Premium Laufschuh'),
      propertyRow('offers.price', '49,00 €'),
      propertyRow('aggregateRating', '4,8', true),
    );
  }

  // === SLIDE 6 visual: rich result mock — stars, price, FAQ dropdowns ===
  function richResultCard() {
    function chevron() {
      return h('div', { style: { display: 'flex', width: '0px', height: '0px', borderLeft: '7px solid transparent', borderRight: '7px solid transparent', borderTop: `9px solid ${C.textMuted}` } });
    }
    return h('div', { style: { display: 'flex', flexDirection: 'column', gap: '14px', backgroundColor: C.cardBg, borderRadius: '22px', padding: '32px', border: `1px solid ${C.cardBorder}` } },
      h('span', { style: { display: 'flex', fontFamily: 'Inter', fontSize: '19px', fontWeight: 600, color: C.green } }, 'shop-beispiel.de'),
      h('span', { style: { display: 'flex', fontFamily: 'Manrope', fontSize: '27px', fontWeight: 700, color: C.accent2 } }, 'Premium Laufschuh kaufen'),
      h('div', { style: { display: 'flex', alignItems: 'center', gap: '10px' } },
        ...Array.from({ length: 5 }).map(() => h('div', { style: { display: 'flex', width: '18px', height: '18px', borderRadius: '9px', backgroundColor: C.gold } })),
        h('span', { style: { display: 'flex', fontFamily: 'Inter', fontSize: '21px', fontWeight: 600, color: C.textSoft, marginLeft: '4px' } }, '4,8 Bewertung'),
        h('span', { style: { display: 'flex', fontFamily: 'Manrope', fontSize: '21px', fontWeight: 800, color: C.text, marginLeft: 'auto' } }, 'ab 49,00 €'),
      ),
      h('div', { style: { display: 'flex', flexDirection: 'column', gap: '10px', marginTop: '6px' } },
        ...['Welche Größen gibt es?', 'Wie lange dauert der Versand?'].map(q =>
          h('div', { style: { display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '16px 18px', backgroundColor: 'rgba(255,255,255,0.05)', borderRadius: '12px' } },
            h('span', { style: { display: 'flex', fontFamily: 'Inter', fontSize: '21px', fontWeight: 500, color: C.textSoft } }, q),
            chevron(),
          )
        ),
      ),
    );
  }

  // === SLIDE 1: Hook ===
  const slide1 = slideRoot(
    badge('WUSSTEST DU?'),
    headline('GOOGLE LIEST DEN TEXT.', 46),
    headline('NICHT DEN SINN.', 50, C.accent2),
    subline('Für Suchmaschinen ist deine Seite erstmal nur ein Haufen Buchstaben – ohne erkennbare Bedeutung.'),
    h('div', { style: { display: 'flex', flex: '1', flexDirection: 'column', justifyContent: 'center' } },
      textBarsCard(),
      unknownPillsRow(),
    ),
    footer(),
  );

  // === SLIDE 2: Mensch vs. Google-Bot ===
  const slide2 = slideRoot(
    badge('MENSCH VS. GOOGLE-BOT'),
    headline('DU SIEHST EIN PRODUKT.', 42),
    headline('GOOGLE SIEHT NUR TEXT.', 42, C.accent2),
    h('div', { style: { display: 'flex', flex: '1', flexDirection: 'column', justifyContent: 'center' } },
      h('div', { style: { display: 'flex', gap: '14px' } }, miniProductCard(), miniPlainCard()),
    ),
    keyLearning('Menschen erkennen Kontext sofort. Google-Bots brauchen dafür ausdrückliche Hinweise im Code.', C.accent2),
    footer(),
  );

  // === SLIDE 3: Die Folge ===
  const slide3 = slideRoot(
    badge('DIE FOLGE'),
    headline('OHNE MARKUP:', 50),
    headline('EIN LINK UNTER VIELEN', 42, C.accent2),
    subline('Ob Restaurant, Rezept oder Blogartikel – ohne Struktur sehen alle Ergebnisse für Google gleich aus.'),
    h('div', { style: { display: 'flex', flex: '1', flexDirection: 'column', justifyContent: 'center', gap: '14px' } },
      fakeResultRow(), fakeResultRow(), fakeResultRow(),
    ),
    keyLearning('Ohne Markup verschwindest du zwischen tausenden identisch aussehenden Ergebnissen.', C.red),
    footer(),
  );

  // === SLIDE 4: Schema.org ===
  const slide4 = slideRoot(
    badge('SCHEMA.ORG'),
    headline('EINE GEMEINSAME SPRACHE', 42),
    headline('FÜR SUCHMASCHINEN', 44, C.accent2),
    subline('Seit 2011 entwickeln Google, Microsoft, Yahoo und Yandex gemeinsam ein offenes Vokabular: Schema.org.'),
    h('div', { style: { display: 'flex', flex: '1', flexDirection: 'column', justifyContent: 'center' } },
      schemaHubVisual(),
    ),
    footer(),
  );

  // === SLIDE 5: JSON-LD ===
  const slide5 = slideRoot(
    badge('SO GEHT’S: JSON-LD'),
    headline('DU BESCHREIBST INHALTE', 40),
    headline('IN KLARER STRUKTUR', 42, C.accent2),
    subline('Google empfiehlt dafür JSON-LD: ein Code-Block, der Typ, Preis oder Bewertung exakt benennt.'),
    h('div', { style: { display: 'flex', flex: '1', flexDirection: 'column', justifyContent: 'center' } },
      jsonLdCard(),
    ),
    keyLearning('JSON-LD landet unsichtbar im Quellcode – Besucher sehen nichts davon, nur Google.', C.accent),
    footer(),
  );

  // === SLIDE 6: Rich Results ===
  const slide6 = slideRoot(
    badge('DAS ERGEBNIS'),
    headline('STERNE. PREISE.', 48),
    headline('FAQ ZUM AUSKLAPPEN.', 40, C.accent2),
    subline('Versteht Google dein Markup, kann es deinen Eintrag direkt in der Suche mit Rich Results erweitern.'),
    h('div', { style: { display: 'flex', flex: '1', flexDirection: 'column', justifyContent: 'center' } },
      richResultCard(),
    ),
    keyLearning('Rich Results sind keine Garantie, aber eine Chance, aus der Masse herauszustechen.', C.gold),
    footer(),
  );

  // === SLIDE 7: Takeaways ===
  const learnings = [
    { num: '01', text: 'Schema.org ist ein offener Standard, gemeinsam entwickelt seit 2011', pct: 25 },
    { num: '02', text: 'JSON-LD ist das von Google empfohlene Format für strukturierte Daten', pct: 50 },
    { num: '03', text: 'Rich Results sind eine Möglichkeit, keine Garantie', pct: 75 },
    { num: '04', text: 'Der Google Rich Results Test zeigt, ob dein Markup korrekt erkannt wird', pct: 100 },
  ];
  const slide7 = slideRoot(
    badge('DIE TAKEAWAYS'),
    headline('4 LEARNINGS ZU', 50),
    headline('STRUCTURED DATA', 46),
    h('div', { style: { display: 'flex', flex: '1', flexDirection: 'column', justifyContent: 'center', gap: '14px' } },
      ...learnings.map(l =>
        h('div', { style: { display: 'flex', flexDirection: 'column', gap: '10px', padding: '22px 26px', backgroundColor: C.cardBg, borderRadius: '18px', border: `1px solid ${C.cardBorder}` } },
          h('div', { style: { display: 'flex', alignItems: 'center', gap: '18px' } },
            h('span', { style: { display: 'flex', fontFamily: 'Manrope', fontSize: '34px', fontWeight: 800, color: l.pct === 100 ? C.accent2 : C.text, minWidth: '58px' } }, l.num),
            h('span', { style: { display: 'flex', fontFamily: 'Inter', fontSize: '23px', fontWeight: 600, color: C.text, lineHeight: '1.3' } }, l.text),
          ),
          h('div', { style: { display: 'flex', height: '6px', backgroundColor: C.cardBorder, borderRadius: '3px', overflow: 'hidden' } },
            h('div', { style: { display: 'flex', width: `${l.pct}%`, height: '6px', backgroundColor: l.pct === 100 ? C.accent2 : C.accent, borderRadius: '3px' } }),
          ),
        )
      ),
    ),
    footer(),
  );

  // === SLIDE 8: CTA ===
  const slide8 = slideRoot(
    h('div', { style: { display: 'flex', flex: '1', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', gap: '32px' } },
      bdLogoImg(C.text, 96),
      h('span', {
        style: {
          display: 'flex', fontFamily: 'Manrope', fontSize: '42px', fontWeight: 800, color: C.text,
          textAlign: 'center', lineHeight: '1.3', letterSpacing: '-1px',
        }
      }, 'Nutzt deine Website\nschon Schema.org?'),
      h('span', {
        style: { display: 'flex', fontFamily: 'Inter', fontSize: '28px', fontWeight: 500, color: C.textMuted, textAlign: 'center', lineHeight: '1.5' }
      }, 'Folge @benarodigital für mehr Website-Wissen\nrund um SEO & Struktur.'),
    ),
    footer(),
  );

  const slides = [slide1, slide2, slide3, slide4, slide5, slide6, slide7, slide8];
  const outDir = path.join(__dirname, 'output', 'carousel_2026-08-23', 'slides');
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
