// Carousel: WebP & AVIF — warum das Bildformat über deine Ladezeit entscheidet
// Kategorie: Performance & Ladezeit — Benaro Digital Instagram-Automation
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

  // === SLIDE 1 visual: one giant file bar vs. a tiny one ===
  function fileSizeBar(label, widthPct, color, big) {
    return h('div', { style: { display: 'flex', flexDirection: 'column', gap: '10px' } },
      h('span', { style: { display: 'flex', fontFamily: 'Inter', fontSize: '20px', fontWeight: 700, letterSpacing: '2px', color: C.textMuted } }, label),
      h('div', { style: { display: 'flex', width: '100%', height: big ? '56px' : '56px', backgroundColor: 'rgba(255,255,255,0.06)', borderRadius: '14px', border: `1px solid ${C.cardBorder}` } },
        h('div', { style: { display: 'flex', width: `${widthPct}%`, height: '56px', backgroundColor: color, borderRadius: '14px' } }),
      ),
    );
  }
  function fileSizeCompareCard() {
    return h('div', { style: { display: 'flex', flexDirection: 'column', gap: '26px', backgroundColor: C.cardBg, borderRadius: '20px', padding: '34px', border: `1px solid ${C.cardBorder}` } },
      fileSizeBar('JPEG / PNG (ORIGINAL)', 96, C.red, true),
      fileSizeBar('WEBP / AVIF', 28, C.accent2, false),
    );
  }

  // === SLIDE 2 visual: browser mockup, hero image = LCP element ===
  function browserLcpMockup() {
    return h('div', { style: { display: 'flex', flexDirection: 'column', backgroundColor: C.cardBg, borderRadius: '20px', border: `1px solid ${C.cardBorder}`, overflow: 'hidden' } },
      h('div', { style: { display: 'flex', alignItems: 'center', gap: '10px', padding: '18px 22px', borderBottom: `1px solid ${C.cardBorder}` } },
        h('div', { style: { display: 'flex', width: '14px', height: '14px', borderRadius: '7px', backgroundColor: 'rgba(255,255,255,0.18)' } }),
        h('div', { style: { display: 'flex', width: '14px', height: '14px', borderRadius: '7px', backgroundColor: 'rgba(255,255,255,0.18)' } }),
        h('div', { style: { display: 'flex', width: '14px', height: '14px', borderRadius: '7px', backgroundColor: 'rgba(255,255,255,0.18)' } }),
      ),
      h('div', { style: { display: 'flex', flexDirection: 'column', padding: '26px', gap: '18px' } },
        h('div', { style: { display: 'flex', position: 'relative', width: '100%', height: '320px', backgroundColor: 'rgba(41,82,255,0.18)', borderRadius: '16px', border: `2px solid ${C.accent}` } },
          h('div', { style: { display: 'flex', position: 'absolute', top: '16px', right: '16px', alignItems: 'center', padding: '8px 16px', borderRadius: '10px', backgroundColor: C.accent } },
            h('span', { style: { display: 'flex', fontFamily: 'Manrope', fontSize: '18px', fontWeight: 800, color: '#FFFFFF', letterSpacing: '1px' } }, 'LCP'),
          ),
        ),
        h('div', { style: { display: 'flex', width: '72%', height: '16px', backgroundColor: 'rgba(255,255,255,0.16)', borderRadius: '5px' } }),
        h('div', { style: { display: 'flex', width: '48%', height: '16px', backgroundColor: 'rgba(255,255,255,0.16)', borderRadius: '5px' } }),
      ),
    );
  }

  // === SLIDE 3 visual: loading bar stuck, users fading away ===
  function stuckLoadingCard() {
    return h('div', { style: { display: 'flex', flexDirection: 'column', gap: '28px', backgroundColor: C.cardBg, borderRadius: '20px', padding: '34px', border: `1px solid ${C.cardBorder}` } },
      h('div', { style: { display: 'flex', alignItems: 'center', justifyContent: 'space-between' } },
        h('span', { style: { display: 'flex', fontFamily: 'Inter', fontSize: '20px', fontWeight: 700, letterSpacing: '2px', color: C.textMuted } }, 'LADEVORGANG'),
        h('span', { style: { display: 'flex', fontFamily: 'Manrope', fontSize: '20px', fontWeight: 800, color: C.red } }, 'ABBRUCH'),
      ),
      h('div', { style: { display: 'flex', width: '100%', height: '28px', backgroundColor: 'rgba(255,255,255,0.08)', borderRadius: '14px' } },
        h('div', { style: { display: 'flex', width: '38%', height: '28px', backgroundColor: C.red, borderRadius: '14px' } }),
      ),
      h('div', { style: { display: 'flex', gap: '14px' } },
        ...[1, 0.6, 0.3].map(op => h('div', { style: { display: 'flex', width: '54px', height: '54px', borderRadius: '27px', backgroundColor: `rgba(255,255,255,${op * 0.5})`, border: `2px solid rgba(255,255,255,${op})` } })),
      ),
    );
  }

  // === SLIDE 4 visual: JPEG/PNG card vs. WebP/AVIF card ===
  function oldFormatCard() {
    return h('div', {
      style: { display: 'flex', flexDirection: 'column', flex: 1, backgroundColor: 'rgba(239,68,68,0.08)', borderRadius: '20px', padding: '28px', gap: '14px', border: `1px solid rgba(239,68,68,0.35)` }
    },
      h('span', { style: { display: 'flex', fontFamily: 'Inter', fontSize: '19px', fontWeight: 700, letterSpacing: '2px', color: C.red } }, 'JPEG / PNG'),
      ...[86, 64, 92].map(w => h('div', { style: { display: 'flex', width: `${w}%`, height: '16px', backgroundColor: 'rgba(255,255,255,0.18)', borderRadius: '6px' } })),
      h('span', { style: { display: 'flex', fontFamily: 'Manrope', fontSize: '22px', fontWeight: 800, color: C.text, marginTop: '4px' } }, 'Große Datei'),
    );
  }
  function newFormatCard() {
    return h('div', {
      style: { display: 'flex', flexDirection: 'column', flex: 1, backgroundColor: 'rgba(0,194,184,0.10)', borderRadius: '20px', padding: '28px', gap: '14px', border: `1px solid ${C.accent2}` }
    },
      h('span', { style: { display: 'flex', fontFamily: 'Inter', fontSize: '19px', fontWeight: 700, letterSpacing: '2px', color: C.accent2 } }, 'WEBP / AVIF'),
      h('div', { style: { display: 'flex', width: '38%', height: '16px', backgroundColor: 'rgba(255,255,255,0.24)', borderRadius: '6px' } }),
      h('span', { style: { display: 'flex', fontFamily: 'Manrope', fontSize: '22px', fontWeight: 800, color: C.accent2, marginTop: '4px' } }, 'Kleine Datei'),
      h('span', { style: { display: 'flex', fontFamily: 'Inter', fontSize: '20px', fontWeight: 500, color: C.textSoft, lineHeight: '1.4' } }, 'gleiche Bildqualität'),
    );
  }

  // === SLIDE 5 visual: origin of the two formats, 2x2 style ===
  function formatOriginCard(name, org, desc) {
    return h('div', {
      style: { display: 'flex', flex: 1, flexDirection: 'column', backgroundColor: 'rgba(255,255,255,0.06)', borderRadius: '20px', padding: '28px', gap: '12px', border: `1px solid ${C.cardBorder}` }
    },
      h('div', { style: { display: 'flex', width: '58px', height: '58px', borderRadius: '16px', backgroundColor: 'rgba(0,194,184,0.16)', alignItems: 'center', justifyContent: 'center' } },
        h('span', { style: { display: 'flex', fontFamily: 'Manrope', fontSize: '26px', fontWeight: 800, color: C.accent2 } }, name[0]),
      ),
      h('span', { style: { display: 'flex', fontFamily: 'Manrope', fontSize: '28px', fontWeight: 800, color: C.text } }, name),
      h('span', { style: { display: 'flex', fontFamily: 'Inter', fontSize: '20px', fontWeight: 600, color: C.textMuted } }, org),
      h('span', { style: { display: 'flex', fontFamily: 'Inter', fontSize: '20px', fontWeight: 500, color: C.textSoft, lineHeight: '1.4' } }, desc),
    );
  }

  // === SLIDE 6 visual: <picture> code card ===
  function codeLine(text, color) {
    return h('div', { style: { display: 'flex', paddingTop: '14px', paddingBottom: '14px', borderBottom: `1px solid ${C.cardBorder}` } },
      h('span', { style: { display: 'flex', fontFamily: 'Inter', fontSize: '22px', fontWeight: 600, color: color || C.textSoft } }, text),
    );
  }
  function pictureCodeCard() {
    return h('div', { style: { display: 'flex', flexDirection: 'column', backgroundColor: C.cardBg, borderRadius: '22px', padding: '32px', border: `1px solid ${C.cardBorder}` } },
      h('div', { style: { display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '6px' } },
        h('div', { style: { display: 'flex', width: '14px', height: '14px', borderRadius: '7px', backgroundColor: C.accent2 } }),
        h('span', { style: { display: 'flex', fontFamily: 'Inter', fontSize: '19px', fontWeight: 700, letterSpacing: '2px', color: C.textMuted } }, 'IM QUELLCODE'),
      ),
      codeLine('<picture>'),
      codeLine('  <source type="image/avif">', C.accent2),
      codeLine('  <source type="image/webp">', C.accent2),
      codeLine('  <img src="bild.jpg">'),
      codeLine('</picture>'),
    );
  }

  // === SLIDE 1: Hook ===
  const slide1 = slideRoot(
    badge('ACHTUNG'),
    headline('GROSSE BILDER.', 50),
    headline('LANGSAME SEITE.', 50, C.accent2),
    subline('Ein einziges unkomprimiertes Foto kann deine Ladezeit ausbremsen – noch bevor der Rest der Seite überhaupt da ist.'),
    h('div', { style: { display: 'flex', flex: '1', flexDirection: 'column', justifyContent: 'center' } },
      fileSizeCompareCard(),
    ),
    footer(),
  );

  // === SLIDE 2: Context — LCP ===
  const slide2 = slideRoot(
    badge('CORE WEB VITALS'),
    headline('DAS GRÖSSTE BILD', 42),
    headline('BESTIMMT DEIN LCP', 42, C.accent2),
    subline('Largest Contentful Paint misst, wie lange das größte sichtbare Element zum Laden braucht – meistens ein Bild.'),
    h('div', { style: { display: 'flex', flex: '1', flexDirection: 'column', justifyContent: 'center' } },
      browserLcpMockup(),
    ),
    footer(),
  );

  // === SLIDE 3: Die Folge ===
  const slide3 = slideRoot(
    badge('DIE FOLGE'),
    headline('JEDE SEKUNDE', 50),
    headline('KOSTET NUTZER', 48, C.accent2),
    subline('Google verknüpft Ladezeit direkt mit Core Web Vitals und damit mit Nutzererfahrung und Sichtbarkeit in der Suche.'),
    h('div', { style: { display: 'flex', flex: '1', flexDirection: 'column', justifyContent: 'center' } },
      stuckLoadingCard(),
    ),
    keyLearning('Wer beim Laden abspringt, sieht dein Angebot nie – ganz gleich wie gut es ist.', C.red),
    footer(),
  );

  // === SLIDE 4: Wendepunkt — WebP & AVIF ===
  const slide4 = slideRoot(
    badge('WEBP & AVIF'),
    headline('GLEICHE QUALITÄT.', 44),
    headline('KLEINERE DATEI.', 46, C.accent2),
    subline('WebP und AVIF komprimieren Bilder deutlich effizienter als klassische JPEG- oder PNG-Dateien – bei vergleichbarer Bildqualität.'),
    h('div', { style: { display: 'flex', flex: '1', flexDirection: 'column', justifyContent: 'center' } },
      h('div', { style: { display: 'flex', gap: '14px' } }, oldFormatCard(), newFormatCard()),
    ),
    footer(),
  );

  // === SLIDE 5: Herkunft der Formate ===
  const slide5 = slideRoot(
    badge('WOHER KOMMT DAS?'),
    headline('ZWEI FORMATE,', 46),
    headline('EIN ZIEL: KLEINER', 42, C.accent2),
    subline('Beide Formate sind offen dokumentiert und werden von den großen Browser-Herstellern gemeinsam getragen.'),
    h('div', { style: { display: 'flex', flex: '1', flexDirection: 'column', justifyContent: 'center' } },
      h('div', { style: { display: 'flex', gap: '14px' } },
        formatOriginCard('WebP', 'Google, seit 2010', 'Eigenes Bildformat für Web-Inhalte, dokumentiert bei Google Developers.'),
        formatOriginCard('AVIF', 'Alliance for Open Media', 'Baut auf dem offenen AV1-Videocodec auf, dokumentiert bei web.dev.'),
      ),
    ),
    footer(),
  );

  // === SLIDE 6: Umsetzung ===
  const slide6 = slideRoot(
    badge('SO SETZT DU ES UM'),
    headline('EIN <PICTURE>-TAG,', 40),
    headline('DREI FORMATE', 44, C.accent2),
    subline('Moderne Browser laden automatisch die kleinste unterstützte Variante – ältere bekommen weiterhin JPEG oder PNG als Fallback.'),
    h('div', { style: { display: 'flex', flex: '1', flexDirection: 'column', justifyContent: 'center' } },
      pictureCodeCard(),
    ),
    keyLearning('Kein Nutzer sieht ein kaputtes Bild – jeder Browser bekommt automatisch das beste Format, das er kann.', C.accent),
    footer(),
  );

  // === SLIDE 7: Takeaways ===
  const learnings = [
    { num: '01', text: 'WebP und das AV1-basierte AVIF komprimieren Bilder spürbar kleiner als JPEG oder PNG', pct: 25 },
    { num: '02', text: 'Kleinere Bilddateien verbessern direkt den Core Web Vital LCP', pct: 50 },
    { num: '03', text: 'Das <picture>-Element liefert automatisch das beste Format pro Browser', pct: 75 },
    { num: '04', text: 'Ein Fallback auf JPEG oder PNG sorgt dafür, dass ältere Browser trotzdem alles sehen', pct: 100 },
  ];
  const slide7 = slideRoot(
    badge('DIE TAKEAWAYS'),
    headline('4 LEARNINGS ZU', 48),
    headline('BILDFORMATEN', 48),
    h('div', { style: { display: 'flex', flex: '1', flexDirection: 'column', justifyContent: 'center', gap: '14px' } },
      ...learnings.map(l =>
        h('div', { style: { display: 'flex', flexDirection: 'column', gap: '10px', padding: '22px 26px', backgroundColor: C.cardBg, borderRadius: '18px', border: `1px solid ${C.cardBorder}` } },
          h('div', { style: { display: 'flex', alignItems: 'center', gap: '18px' } },
            h('span', { style: { display: 'flex', fontFamily: 'Manrope', fontSize: '34px', fontWeight: 800, color: l.pct === 100 ? C.accent2 : C.text, minWidth: '58px' } }, l.num),
            h('span', { style: { display: 'flex', fontFamily: 'Inter', fontSize: '22px', fontWeight: 600, color: C.text, lineHeight: '1.3' } }, l.text),
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
      }, 'Lädt deine Website\nnoch mit JPEG & PNG?'),
      h('span', {
        style: { display: 'flex', fontFamily: 'Inter', fontSize: '28px', fontWeight: 500, color: C.textMuted, textAlign: 'center', lineHeight: '1.5' }
      }, 'Folge @benarodigital für mehr Website-Wissen\nrund um Performance & SEO.'),
    ),
    footer(),
  );

  const slides = [slide1, slide2, slide3, slide4, slide5, slide6, slide7, slide8];
  const outDir = path.join(__dirname, 'output', 'carousel_2026-08-27', 'slides');
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
