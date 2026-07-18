// Carousel-Serie: 4 Referenzprojekte von benarodigital.com
// Ein Carousel pro Projekt: benaro-finanzen, tammyskids, lernenmitmali, logixx
const fs = require('fs');
const path = require('path');

const PROJECTS = [
  {
    slug: 'benaro-finanzen',
    num: '01',
    name: 'Benaro Finanzen',
    domain: 'benarofinanzen.com',
    tagline: 'Vertrauen aufbauen, bevor das erste Gespräch beginnt.',
    description: 'Ein moderner, vertrauenswürdiger Webauftritt für eine unabhängige Finanzberatung — von der Erstberatung bis zur Terminbuchung in wenigen Klicks.',
    services: ['UI/UX Design', 'Webentwicklung', 'Responsive Umsetzung', 'Performanceoptimierung', 'Conversion-Optimierung', 'Kontaktformular', 'SEO-Basis'],
  },
  {
    slug: 'tammyskids',
    num: '02',
    name: "Tammy's Kids",
    domain: 'tammyskids.com',
    tagline: 'Aus einer veralteten Seite wurde ein warmer, moderner Auftritt.',
    description: 'Vollständiges Redesign einer bestehenden Website: aus einer veralteten Seite wurde ein warmer, moderner Auftritt für eine Kindertagespflege.',
    services: ['Website-Redesign', 'Responsive Entwicklung', 'Performanceoptimierung', 'Moderne Benutzerführung', 'Strukturverbesserung'],
  },
  {
    slug: 'lernenmitmali',
    num: '03',
    name: 'Leichter lernen mit Mali',
    domain: 'lernenmitmali.com',
    tagline: 'Vom ersten Klick bis zum kostenlosen Kennenlerngespräch.',
    description: 'Eine persönliche Website für Online-Nachhilfe im gesamten DACH-Raum — mit klarer Fächerübersicht, transparenten Preismodellen und direktem Weg zum kostenlosen Kennenlerngespräch.',
    services: ['UI/UX Design', 'Webentwicklung', 'Responsive Umsetzung', 'Preismodell-Seite', 'Kontaktformular', 'SEO-Basis'],
  },
  {
    slug: 'logixx',
    num: '04',
    name: 'LOGIXX',
    domain: 'logixxmedien.com',
    tagline: '25+ Jahre Erfahrung, klar auf den Punkt gebracht.',
    description: 'Ein professioneller Webauftritt für einen Lagerlogistik-Anbieter mit über 25 Jahren Erfahrung — mit klarer Leistungsübersicht für Privat- und Geschäftskunden und direktem Weg zur Anfrage.',
    services: ['UI/UX Design', 'Webentwicklung', 'Responsive Umsetzung', 'Leistungsübersicht', 'Kontaktformular', 'SEO-Basis'],
  },
];

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
    chrome: '#1E2126',
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
    return h('img', { src, width, height: width * (46 / 86), style: { display: 'flex' } });
  }

  function badge(text, color) {
    return h('div', { style: { display: 'flex', marginBottom: '18px' } },
      h('span', {
        style: {
          display: 'flex', fontFamily: 'Inter', fontSize: '22px', fontWeight: 700, letterSpacing: '3px',
          color: color || C.accent2, backgroundColor: color ? `${color}1F` : 'rgba(0,194,184,0.12)',
          padding: '10px 22px', borderRadius: '12px'
        }
      }, text)
    );
  }

  function headline(text, size) {
    return h('span', {
      style: { display: 'flex', fontFamily: 'Manrope', fontSize: (size || 54) + 'px', fontWeight: 800, color: C.text, lineHeight: '1.1', letterSpacing: '-1.2px' }
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
      style: { display: 'flex', flexDirection: 'column', width: W, height: H, padding: '70px', backgroundColor: C.bg, fontFamily: 'Inter' }
    }, ...children);
  }

  function browserMockup(imgB64, imgW, imgH, domain) {
    const frameW = 940;
    const frameImgH = Math.round(frameW * (imgH / imgW));
    return h('div', { style: { display: 'flex', flexDirection: 'column', width: `${frameW}px`, borderRadius: '20px', overflow: 'hidden', border: `1px solid ${C.cardBorder}` } },
      h('div', { style: { display: 'flex', alignItems: 'center', height: '44px', backgroundColor: C.chrome, padding: '0 18px', gap: '8px' } },
        h('div', { style: { display: 'flex', gap: '7px', width: '90px', alignItems: 'center' } },
          h('div', { style: { display: 'flex', width: '10px', height: '10px', borderRadius: '5px', backgroundColor: 'rgba(255,255,255,0.22)' } }),
          h('div', { style: { display: 'flex', width: '10px', height: '10px', borderRadius: '5px', backgroundColor: 'rgba(255,255,255,0.22)' } }),
          h('div', { style: { display: 'flex', width: '10px', height: '10px', borderRadius: '5px', backgroundColor: 'rgba(255,255,255,0.22)' } }),
        ),
        h('div', { style: { display: 'flex', flex: '1', justifyContent: 'center' } },
          h('div', { style: { display: 'flex', backgroundColor: 'rgba(255,255,255,0.08)', borderRadius: '8px', padding: '5px 20px' } },
            h('span', { style: { display: 'flex', fontFamily: 'Inter', fontSize: '18px', fontWeight: 500, color: C.textMuted } }, domain),
          ),
        ),
        h('div', { style: { display: 'flex', width: '90px' } }),
      ),
      h('img', { src: imgB64, width: frameW, height: frameImgH, style: { display: 'flex' } }),
    );
  }

  function check(text) {
    return h('div', { style: { display: 'flex', width: '100%', alignItems: 'center', gap: '12px' } },
      h('div', { style: { display: 'flex', flexShrink: 0, width: '26px', height: '26px', borderRadius: '13px', backgroundColor: 'rgba(0,194,184,0.16)', alignItems: 'center', justifyContent: 'center' } },
        h('span', { style: { display: 'flex', fontFamily: 'Inter', fontSize: '16px', fontWeight: 700, color: C.accent2 } }, '✓')),
      h('span', { style: { display: 'flex', flex: 1, fontFamily: 'Inter', fontSize: '24px', fontWeight: 500, color: C.textSoft, lineHeight: '1.3' } }, text),
    );
  }

  function twoCol(items) {
    const col1 = items.filter((_, i) => i % 2 === 0);
    const col2 = items.filter((_, i) => i % 2 === 1);
    return h('div', { style: { display: 'flex', width: '100%', gap: '24px' } },
      h('div', { style: { display: 'flex', flexDirection: 'column', gap: '20px', width: '410px' } }, ...col1.map(check)),
      h('div', { style: { display: 'flex', flexDirection: 'column', gap: '20px', width: '410px' } }, ...col2.map(check)),
    );
  }

  const outputRoot = path.join(__dirname, 'output');

  for (const project of PROJECTS) {
    const imgPath = path.join(__dirname, 'assets/portfolio', `${project.slug}.jpg`);
    const imgBuf = fs.readFileSync(imgPath);
    const imgB64 = 'data:image/jpeg;base64,' + imgBuf.toString('base64');
    // read actual pixel dims via a quick PNG/JPEG size sniff is overkill — dims were fixed at generation time
    const dims = { 'benaro-finanzen': [900, 490], tammyskids: [900, 490], lernenmitmali: [900, 456], logixx: [900, 490] };
    const [imgW, imgH] = dims[project.slug];

    // === SLIDE 1: Cover ===
    const slide1 = slideRoot(
      badge(`REFERENZ ${project.num}`),
      headline(project.name, project.name.length > 18 ? 44 : 54),
      subline(project.tagline),
      h('div', { style: { display: 'flex', flex: '1', flexDirection: 'column', justifyContent: 'center', marginTop: '20px' } },
        browserMockup(imgB64, imgW, imgH, project.domain),
      ),
      footer(),
    );

    // === SLIDE 2: Das Projekt (Beschreibung als Pull-Quote) ===
    const slide2 = slideRoot(
      badge('DAS PROJEKT'),
      headline('Die Aufgabe', 54),
      h('div', { style: { display: 'flex', flex: '1', flexDirection: 'column', justifyContent: 'center' } },
        h('div', { style: { display: 'flex', flexDirection: 'row', gap: '28px', backgroundColor: C.cardBg, borderRadius: '28px', padding: '44px 40px', border: `1px solid ${C.cardBorder}` } },
          h('div', { style: { display: 'flex', minWidth: '8px', alignSelf: 'stretch', backgroundColor: C.accent2, borderRadius: '4px' } }),
          h('div', { style: { display: 'flex', flexDirection: 'column', gap: '24px' } },
            h('span', { style: { display: 'flex', fontFamily: 'Manrope', fontSize: '72px', fontWeight: 800, color: C.accent2, lineHeight: '0.6' } }, '„'),
            h('span', { style: { display: 'flex', fontFamily: 'Inter', fontSize: '31px', fontWeight: 500, color: C.text, lineHeight: '1.55' } }, project.description),
          ),
        ),
      ),
      footer(),
    );

    // === SLIDE 3: Leistungen ===
    const slide3 = slideRoot(
      badge('LEISTUNGEN'),
      headline('Was wir umgesetzt', 48),
      headline('haben', 48),
      h('div', { style: { display: 'flex', flex: '1', flexDirection: 'column', justifyContent: 'center' } },
        h('div', { style: { display: 'flex', width: '100%', backgroundColor: C.cardBg, borderRadius: '24px', padding: '40px', border: `1px solid ${C.cardBorder}` } },
          twoCol(project.services),
        ),
      ),
      footer(),
    );

    // === SLIDE 4: CTA ===
    const slide4 = slideRoot(
      h('div', { style: { display: 'flex', flex: '1', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', gap: '30px' } },
        bdLogoImg(C.text, 88),
        h('span', { style: { display: 'flex', fontFamily: 'Manrope', fontSize: '42px', fontWeight: 800, color: C.text, textAlign: 'center', lineHeight: '1.3', letterSpacing: '-1px' } },
          'Ihre Website könnte'),
        h('span', { style: { display: 'flex', fontFamily: 'Manrope', fontSize: '42px', fontWeight: 800, color: C.accent2, textAlign: 'center', lineHeight: '1.3', letterSpacing: '-1px' } },
          'das nächste Projekt sein.'),
        h('div', { style: { display: 'flex', backgroundColor: C.cardBg, borderRadius: '14px', padding: '14px 28px', border: `1px solid ${C.cardBorder}`, marginTop: '8px' } },
          h('span', { style: { display: 'flex', fontFamily: 'Inter', fontSize: '24px', fontWeight: 600, color: C.text } }, project.domain),
        ),
        h('span', { style: { display: 'flex', fontFamily: 'Inter', fontSize: '26px', fontWeight: 500, color: C.textMuted, textAlign: 'center', lineHeight: '1.5' } },
          'Kostenloses Erstgespräch auf benarodigital.com'),
      ),
      footer(),
    );

    const slides = [slide1, slide2, slide3, slide4];
    const outDir = path.join(outputRoot, `referenz_${project.slug}`, 'slides');
    fs.mkdirSync(outDir, { recursive: true });

    for (let i = 0; i < slides.length; i++) {
      const svg = await satori(slides[i], { width: W, height: H, fonts });
      const resvg = new Resvg(svg, { fitTo: { mode: 'width', value: W } });
      const pngData = resvg.render();
      fs.writeFileSync(path.join(outDir, `slide-${String(i + 1).padStart(2, '0')}.png`), pngData.asPng());
    }
    console.log(`${project.name}: 4 Slides fertig -> ${outDir}`);
  }
  console.log('Alle 4 Referenz-Carousels generiert!');
}

main().catch(e => { console.error(e); process.exit(1); });
