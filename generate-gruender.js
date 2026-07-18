// Carousel: Gründer-Vorstellung — Ben Borowy stellt sich und benarodigital.com vor
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
  };

  const W = 1080, H = 1350;

  const h = (type, props, ...ch) => ({
    type, props: { ...props, children: ch.length === 1 ? ch[0] : ch.length === 0 ? undefined : ch }
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
    const height = width * (46 / 86);
    return h('img', { src, width, height, style: { display: 'flex' } });
  }

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

  function headline(text, size) {
    return h('span', {
      style: {
        display: 'flex', fontFamily: 'Manrope', fontSize: (size || 58) + 'px', fontWeight: 800, color: C.text,
        lineHeight: '1.1', letterSpacing: '-1.2px',
      }
    }, text);
  }

  function subline(text) {
    return h('span', {
      style: { display: 'flex', fontFamily: 'Inter', fontSize: '28px', fontWeight: 500, color: C.textMuted, lineHeight: '1.5', marginTop: '10px' }
    }, text);
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

  // === SLIDE 1: Photo + Intro ===
  const founderB64 = 'data:image/jpeg;base64,' + fs.readFileSync(path.join(__dirname, 'assets/founder.jpg')).toString('base64');
  const slide1 = slideRoot(
    badge('DER GRÜNDER'),
    headline('Ben Borowy', 60),
    subline('Gründer von Benaro Digital'),
    h('div', { style: { display: 'flex', flex: '1', flexDirection: 'column', justifyContent: 'center', marginTop: '24px' } },
      h('div', { style: { display: 'flex', width: '100%', height: '780px', borderRadius: '28px', overflow: 'hidden', border: `1px solid ${C.cardBorder}` } },
        h('img', { src: founderB64, width: 940, height: 780, style: { objectFit: 'cover' } }),
      ),
    ),
    footer(),
  );

  // === SLIDE 2: Philosophie / Mission ===
  const slide2 = slideRoot(
    badge('PHILOSOPHIE'),
    headline('Ein direkter', 54),
    headline('Ansprechpartner —', 54),
    h('span', { style: { display: 'flex', fontFamily: 'Manrope', fontSize: '54px', fontWeight: 800, color: C.accent2, lineHeight: '1.1', letterSpacing: '-1.2px' } }, 'statt anonymer Agentur.'),
    h('div', { style: { display: 'flex', flex: '1', flexDirection: 'column', justifyContent: 'center', gap: '20px' } },
      h('div', { style: { display: 'flex', flexDirection: 'column', gap: '20px', backgroundColor: C.cardBg, borderRadius: '24px', padding: '36px', border: `1px solid ${C.cardBorder}` } },
        h('span', { style: { display: 'flex', fontFamily: 'Inter', fontSize: '29px', fontWeight: 500, color: C.textSoft, lineHeight: '1.55' } },
          'Ich entwickle Websites für Unternehmen, die Wert auf saubere Umsetzung, ehrliche Beratung und ein Ergebnis legen, das auch in fünf Jahren noch überzeugt.'),
        h('div', { style: { display: 'flex', width: '64px', height: '3px', backgroundColor: C.accent } }),
        h('span', { style: { display: 'flex', fontFamily: 'Inter', fontSize: '29px', fontWeight: 500, color: C.textSoft, lineHeight: '1.55' } },
          'Statt vorgefertigter Vorlagen: eine Website, die wirklich zu Ihrem Unternehmen passt — und ein Ansprechpartner, der auch nach dem Launch erreichbar bleibt.'),
      ),
    ),
    footer(),
  );

  // === SLIDE 3: Benaro Digital vorstellen ===
  function fact(label, value) {
    return h('div', { style: { display: 'flex', flexDirection: 'column', gap: '8px', flex: 1 } },
      h('span', { style: { display: 'flex', fontFamily: 'Inter', fontSize: '20px', fontWeight: 700, letterSpacing: '1.5px', color: C.textMuted } }, label.toUpperCase()),
      h('span', { style: { display: 'flex', fontFamily: 'Manrope', fontSize: '25px', fontWeight: 700, color: C.text, lineHeight: '1.3' } }, value),
    );
  }
  const slide3 = slideRoot(
    badge('BENARODIGITAL.COM'),
    headline('Websites, die', 50),
    headline('Vertrauen schaffen', 50),
    h('span', { style: { display: 'flex', fontFamily: 'Manrope', fontSize: '50px', fontWeight: 800, color: C.accent2, lineHeight: '1.1', letterSpacing: '-1.2px' } }, 'und Kunden gewinnen.'),
    subline('Individuelle Websites für Handwerk, Kanzleien, Praxen & lokale Unternehmen — modern, schnell, gebaut für echte Anfragen.'),
    h('div', { style: { display: 'flex', flex: '1', flexDirection: 'column', justifyContent: 'center', gap: '20px' } },
      h('div', { style: { display: 'flex', flexDirection: 'column', gap: '14px' } },
        h('div', { style: { display: 'flex', alignItems: 'center', gap: '16px' } },
          h('div', { style: { display: 'flex', width: '54px', height: '54px', borderRadius: '14px', backgroundColor: 'rgba(41,82,255,0.16)', border: `1px solid ${C.accent}`, alignItems: 'center', justifyContent: 'center' } },
            h('span', { style: { display: 'flex', fontFamily: 'Manrope', fontSize: '26px', fontWeight: 800, color: C.accent } }, '01')),
          h('span', { style: { display: 'flex', fontFamily: 'Inter', fontSize: '27px', fontWeight: 600, color: C.text } }, 'Strategie & Konzept statt Vorlage'),
        ),
        h('div', { style: { display: 'flex', alignItems: 'center', gap: '16px' } },
          h('div', { style: { display: 'flex', width: '54px', height: '54px', borderRadius: '14px', backgroundColor: 'rgba(0,194,184,0.14)', border: `1px solid ${C.accent2}`, alignItems: 'center', justifyContent: 'center' } },
            h('span', { style: { display: 'flex', fontFamily: 'Manrope', fontSize: '26px', fontWeight: 800, color: C.accent2 } }, '02')),
          h('span', { style: { display: 'flex', fontFamily: 'Inter', fontSize: '27px', fontWeight: 600, color: C.text } }, 'Design, Text & Technik aus einer Hand'),
        ),
        h('div', { style: { display: 'flex', alignItems: 'center', gap: '16px' } },
          h('div', { style: { display: 'flex', width: '54px', height: '54px', borderRadius: '14px', backgroundColor: 'rgba(203,163,92,0.16)', border: `1px solid ${C.gold}`, alignItems: 'center', justifyContent: 'center' } },
            h('span', { style: { display: 'flex', fontFamily: 'Manrope', fontSize: '26px', fontWeight: 800, color: C.gold } }, '03')),
          h('span', { style: { display: 'flex', fontFamily: 'Inter', fontSize: '27px', fontWeight: 600, color: C.text } }, 'Betreuung auch nach dem Launch'),
        ),
      ),
      h('div', {
        style: {
          display: 'flex', backgroundColor: C.cardBg, borderRadius: '22px', padding: '30px 32px',
          border: `1px solid ${C.cardBorder}`, gap: '28px',
        }
      },
        fact('Fokus', 'Qualität vor Quantität'),
        fact('Zusammenarbeit', 'Langfristig & persönlich'),
        fact('Standort', 'Hamburg, deutschlandweit'),
      ),
    ),
    footer(),
  );

  // === SLIDE 4: CTA ===
  const slide4 = slideRoot(
    h('div', { style: { display: 'flex', flex: '1', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', gap: '32px' } },
      bdLogoImg(C.text, 96),
      h('span', {
        style: {
          display: 'flex', fontFamily: 'Manrope', fontSize: '46px', fontWeight: 800, color: C.text,
          textAlign: 'center', lineHeight: '1.3', letterSpacing: '-1px',
        }
      }, 'Schau vorbei auf'),
      h('span', {
        style: {
          display: 'flex', fontFamily: 'Manrope', fontSize: '46px', fontWeight: 800, color: C.accent2,
          textAlign: 'center', lineHeight: '1.3', letterSpacing: '-1px',
        }
      }, 'benarodigital.com'),
      h('span', {
        style: { display: 'flex', fontFamily: 'Inter', fontSize: '28px', fontWeight: 500, color: C.textMuted, textAlign: 'center', lineHeight: '1.5' }
      }, 'Folge @benarodigital für mehr Website-Wissen\nrund um Psychologie, Design & SEO.'),
    ),
    footer(),
  );

  const slides = [slide1, slide2, slide3, slide4];
  const outDir = path.join(__dirname, 'output', 'carousel_2026-07-18_gruender-vorstellung', 'slides');
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
