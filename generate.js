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

  // === SLIDE 1: HOOK — Impressum/Kontakt fehlt = Vertrauen fehlt ===
  const slide1 = slideRoot(
    badge('ACHTUNG'),
    headline('Ein verstecktes Impressum kostet dich mehr als nur eine Abmahnung.', 50),
    subline('Bevor jemand ein Formular ausfüllt oder kauft, prüft das Gehirn unbewusst: Ist hier wirklich ein echtes Unternehmen?'),
    visualBlock(
      h('div', { style: { display: 'flex', gap: '16px' } },
        card([
          h('span', { style: { display: 'flex', fontSize: '21px', fontWeight: 700, letterSpacing: '2px', fontFamily: 'Manrope', color: C.textMuted } }, 'KEIN KONTAKT SICHTBAR'),
          h('span', { style: { display: 'flex', fontSize: '24px', fontWeight: 600, fontFamily: 'Inter', color: C.textSoft, lineHeight: '1.4' } }, 'Nur ein Formular, kein Name, kein Impressum im Blick'),
        ]),
        card([
          h('span', { style: { display: 'flex', fontSize: '21px', fontWeight: 700, letterSpacing: '2px', fontFamily: 'Manrope', color: 'rgba(255,255,255,0.75)' } }, 'KONTAKT SICHTBAR'),
          h('span', { style: { display: 'flex', fontSize: '24px', fontWeight: 600, fontFamily: 'Inter', color: '#FFFFFF', lineHeight: '1.4' } }, 'Echter Name, Adresse, Impressum klar verlinkt'),
        ], true),
      ),
    ),
    keyLearning('Vertrauen entscheidet sich oft schon vor der ersten Zeile Verkaufstext.', true),
    footer(),
  );

  // === SLIDE 2: DIE FORSCHUNG — Stanford Web Credibility ===
  function signalCard(label) {
    return h('div', {
      style: {
        display: 'flex', alignItems: 'center', gap: '16px', padding: '20px 24px',
        backgroundColor: C.cardBg, border: `1px solid ${C.cardBorder}`, borderRadius: '16px',
      }
    },
      h('div', { style: { display: 'flex', width: '14px', height: '14px', borderRadius: '7px', backgroundColor: C.accent2 } }),
      h('span', { style: { display: 'flex', fontSize: '26px', fontWeight: 600, fontFamily: 'Inter', color: C.text } }, label),
    );
  }

  const slide2 = slideRoot(
    badge('DIE FORSCHUNG'),
    headline('Was Besucher wirklich prüfen, bevor sie dir vertrauen.', 52),
    subline('Die Stanford Web Credibility Research (B.J. Fogg et al., Stanford Persuasive Technology Lab, 2002) untersuchte, welche Signale Websites glaubwürdig wirken lassen.'),
    visualBlock(
      h('div', { style: { display: 'flex', flexDirection: 'column', gap: '14px' } },
        signalCard('Echte Adresse & Telefonnummer'),
        signalCard('Erkennbare Ansprechpartner'),
        signalCard('Transparente Kontaktmöglichkeiten'),
        signalCard('Vollständiges, auffindbares Impressum'),
      ),
    ),
    keyLearning('Je greifbarer eine Website wirkt, desto glaubwürdiger erscheint sie.'),
    footer(),
  );

  // === SLIDE 3: DAS PROBLEM — versteckte Signale ===
  function hiddenCard(title, desc) {
    return h('div', {
      style: {
        display: 'flex', flexDirection: 'column', gap: '8px',
        backgroundColor: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.25)',
        borderRadius: '18px', padding: '22px',
      }
    },
      h('span', { style: { display: 'flex', fontSize: '24px', fontWeight: 700, fontFamily: 'Manrope', color: C.red } }, title),
      h('span', { style: { display: 'flex', fontSize: '20px', fontWeight: 500, fontFamily: 'Inter', color: 'rgba(255,255,255,0.65)', lineHeight: '1.4' } }, desc),
    );
  }

  const slide3 = slideRoot(
    badge('DAS PROBLEM'),
    headline('Viele Websites verstecken genau diese Signale.', 54),
    visualBlock(
      h('div', { style: { display: 'flex', flexDirection: 'column', gap: '12px' } },
        hiddenCard('Impressum drei Klicks tief', 'Versteckt im Footer-Kleingedruckten statt direkt sichtbar'),
        hiddenCard('Nur ein Kontaktformular', 'Keine Telefonnummer, keine Adresse, kein echter Name'),
        hiddenCard('Kein Gesicht hinter der Marke', 'Anonyme Teamseite ohne Namen oder Fotos'),
      ),
    ),
    keyLearning('Jedes versteckte Signal ist eine kleine Vertrauens-Hürde mehr.', true),
    footer(),
  );

  // === SLIDE 4: DER WENDEPUNKT — Erwartung vs. Realität ===
  const slide4 = slideRoot(
    badge('DER WENDEPUNKT'),
    headline('Sichtbarkeit schlägt Design-Perfektion.', 54),
    visualBlock(
      h('div', { style: { display: 'flex', gap: '16px' } },
        card([
          h('span', { style: { display: 'flex', fontSize: '21px', fontWeight: 700, letterSpacing: '2px', fontFamily: 'Manrope', color: C.textMuted } }, 'ERWARTUNG'),
          h('span', { style: { display: 'flex', fontSize: '22px', fontWeight: 500, fontFamily: 'Inter', color: C.textSoft, lineHeight: '1.4' } }, '"Rechtstexte stören das cleane Design, also klein und versteckt halten."'),
        ]),
        card([
          h('span', { style: { display: 'flex', fontSize: '21px', fontWeight: 700, letterSpacing: '2px', fontFamily: 'Manrope', color: 'rgba(255,255,255,0.75)' } }, 'REALITÄT'),
          h('span', { style: { display: 'flex', fontSize: '22px', fontWeight: 500, fontFamily: 'Inter', color: '#FFFFFF', lineHeight: '1.4' } }, 'Sichtbare, echte Kontaktdaten wirken vertrauenswürdiger als jedes Design-Detail.'),
        ], true),
      ),
    ),
    keyLearning('Transparenz ist kein Stilbruch, sondern ein Vertrauenssignal.'),
    footer(),
  );

  // === SLIDE 5: KONKRET UMGESETZT ===
  function leverCard(title, desc) {
    return h('div', {
      style: {
        display: 'flex', flexDirection: 'column', gap: '8px',
        backgroundColor: 'rgba(255,255,255,0.06)', borderRadius: '18px', padding: '22px',
        border: '1px solid rgba(255,255,255,0.08)',
      }
    },
      h('span', { style: { display: 'flex', fontSize: '24px', fontWeight: 700, fontFamily: 'Manrope', color: '#FFFFFF' } }, title),
      h('span', { style: { display: 'flex', fontSize: '19px', fontWeight: 500, fontFamily: 'Inter', color: 'rgba(255,255,255,0.55)', lineHeight: '1.4' } }, desc),
    );
  }

  const slide5 = slideRoot(
    badge('KONKRET UMGESETZT'),
    headline('So wird dein Impressum zum Vertrauenssignal.', 48),
    visualBlock(
      h('div', { style: { display: 'flex', flexDirection: 'column', gap: '12px' } },
        leverCard('Footer-Link gut sichtbar', 'Impressum & Datenschutz auf jeder Seite leicht auffindbar verlinken'),
        leverCard('Echter Name statt nur Formular', 'Telefonnummer oder Adresse zusätzlich zum Kontaktformular zeigen'),
        leverCard('Gesicht zur Marke', 'Ansprechpartner mit Namen und wenn möglich Foto sichtbar machen'),
        leverCard('Regelmäßig aktuell halten', 'Kontaktdaten und Rechtstexte bei Änderungen zeitnah anpassen'),
      ),
    ),
    keyLearning('Kleine, sichtbare Details schaffen oft mehr Vertrauen als ein komplettes Redesign.'),
    footer(),
  );

  // === SLIDE 6: DAS PRINZIP ===
  function checkIcon(color) {
    return svgImg(`<svg width="56" height="56" viewBox="0 0 56 56" xmlns="http://www.w3.org/2000/svg">
      <circle cx="28" cy="28" r="26" fill="none" stroke="${color}" stroke-width="4"/>
      <path d="M17 29L24 36L39 20" fill="none" stroke="${color}" stroke-width="5" stroke-linecap="round" stroke-linejoin="round"/>
    </svg>`, 56, 56);
  }

  const slide6 = slideRoot(
    badge('DAS PRINZIP'),
    headline('Transparenz senkt das gefühlte Risiko.', 56),
    subline('Die Stanford-Forschung zeigt: Je mehr eine Website wie ein echtes, greifbares Unternehmen wirkt, desto glaubwürdiger erscheint sie.'),
    visualBlock(
      h('div', { style: { display: 'flex', gap: '16px' } },
        card([
          h('span', { style: { display: 'flex', fontSize: '60px', fontWeight: 800, fontFamily: 'Manrope', color: C.red } }, '?'),
          h('span', { style: { display: 'flex', fontSize: '22px', fontWeight: 600, fontFamily: 'Inter', color: C.textSoft, lineHeight: '1.4' } }, 'Anonyme Website: Wer steckt eigentlich dahinter?'),
        ]),
        card([
          checkIcon(C.green),
          h('span', { style: { display: 'flex', fontSize: '22px', fontWeight: 600, fontFamily: 'Inter', color: C.textSoft, lineHeight: '1.4' } }, 'Transparente Website: Hier steht ein echtes Unternehmen dahinter'),
        ]),
      ),
    ),
    keyLearning('Jeder Klick fühlt sich für Besucher wie ein kleines Risiko an — Transparenz macht es kleiner.'),
    footer(),
  );

  // === SLIDE 7: CHECKLISTE ===
  const learnings = [
    { num: '01', text: 'Impressum & Datenschutz im Footer gut sichtbar verlinken', pct: 25 },
    { num: '02', text: 'Echte Telefonnummer oder Adresse zusätzlich zum Formular zeigen', pct: 50 },
    { num: '03', text: 'Ansprechpartner mit Namen und wenn möglich Foto sichtbar machen', pct: 75 },
    { num: '04', text: 'Kontaktdaten regelmäßig auf Aktualität prüfen', pct: 100 },
  ];

  const slide7 = slideRoot(
    badge('DEINE CHECKLISTE'),
    headline('4 Schritte zu mehr Vertrauen durch Transparenz.', 46),
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
    keyLearning('Sichtbare Transparenz entscheidet mit, ob Besucher dir ihre Daten geben.'),
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
      }, 'Wie leicht findet ein Fremder dein Impressum auf deiner Website?'),
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
