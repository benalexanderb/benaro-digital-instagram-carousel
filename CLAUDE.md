# Umgebungsregeln fuer die Carousel-Routine

Diese Regeln haben **Vorrang vor dem Routine-Prompt**. Wo sie ihm widersprechen,
gelten sie. Sie beschreiben, was in dieser Sandbox technisch moeglich ist, und
sind am 22.08.2026 nachgemessen worden.

## 1. Buffer ist aus dieser Umgebung nicht erreichbar

Der Egress-Proxy blockt die gesamte Domain buffer.com:

```
api.buffer.com     -> curl: (56) CONNECT tunnel failed, response 403
graph.buffer.com   -> curl: (56) CONNECT tunnel failed, response 403
api.bufferapp.com  -> curl: (56) CONNECT tunnel failed, response 403
publish.buffer.com -> curl: (56) CONNECT tunnel failed, response 403
buffer.com         -> curl: (56) CONNECT tunnel failed, response 403
```

**SCHRITT 4 des Prompts (Buffer per curl) entfaellt vollstaendig.** Versuche
keinen curl gegen Buffer, keinen anderen Buffer-Host und keinen Workaround. Die
Buffer-MCP-Tools sind ebenfalls tabu, sie haengen am falschen Konto
(benarofinanzen statt benarodigital).

Stattdessen erledigt ein GitHub-Actions-Workflow das Einreihen. Du uebergibst
ihm die Arbeit ueber eine Datei.

## 2. Statt Buffer: post.json schreiben

Lege im Carousel-Ordner `output/carousel_$TODAY/post.json` an, exakt so:

```json
{
  "date": "2026-08-23",
  "channelId": "6a65265be2638b94d7d55993",
  "caption": "Vollstaendige Caption inklusive Hashtags, genau nach den Regeln aus Schritt 4.3 des Prompts.",
  "slides": [
    {
      "url": "https://raw.githubusercontent.com/benalexanderb/benaro-digital-instagram-carousel/main/output/carousel_2026-08-23/slides/slide-01.png",
      "altText": "Individueller Alt-Text zu Slide 1"
    },
    {
      "url": "https://raw.githubusercontent.com/benalexanderb/benaro-digital-instagram-carousel/main/output/carousel_2026-08-23/slides/slide-02.png",
      "altText": "Individueller Alt-Text zu Slide 2"
    }
  ]
}
```

Regeln dazu:

- Ein Eintrag pro Slide, in der richtigen Reihenfolge, jeder mit eigenem
  Alt-Text. Keine generischen Alt-Texte.
- `date` und die Ordnernamen in den URLs sind das heutige Datum.
- `channelId` bleibt unveraendert. Der Workflow lehnt jede andere ID ab.
- Die Caption schreibst du weiterhin nach Schritt 4.3 des Prompts, also Hook,
  Mehrwert, Call-to-Action, maximal fuenf Hashtags, 150 bis 250 Zeichen ohne
  Hashtags.

## 3. GitHub-Upload laeuft ueber git push, nicht ueber die Contents-API

Die GitHub Contents-API (`curl -X PUT .../contents/...`) ist in dieser Umgebung
gesperrt und antwortet mit `403 Write access to this GitHub API path is not
permitted through this proxy`. Die `gh_upload`-Funktion aus SCHRITT 3 des
Prompts funktioniert also nicht.

Nutze im Klon unter `/tmp/workspace` stattdessen:

```bash
cd /tmp/workspace
git add data/used_topics.json output/carousel_$TODAY
git -c user.email="bot@benarodigital.com" -c user.name="Carousel Bot" \
    commit -m "Carousel $TODAY"
git push origin HEAD:main
```

Wichtig: Die `post.json` gehoert mit in denselben Push. Sobald sie auf `main`
liegt, startet der Workflow.

## 4. Ergebnis kontrollieren

Der Workflow heisst "Buffer-Post einreihen". Warte nach dem Push etwa 90
Sekunden und pruefe:

```bash
curl -s "https://api.github.com/repos/benalexanderb/benaro-digital-instagram-carousel/actions/runs?per_page=3" \
  | python3 -c "import sys,json; [print(r['name'], r['status'], r['conclusion'], r['html_url']) for r in json.load(sys.stdin)['workflow_runs']]"
```

- `conclusion: success` bedeutet, der Post ist bei Buffer eingereiht.
- `conclusion: failure` ist ein echter Fehler. Melde ihn in der Mail aus
  SCHRITT 5 deutlich als Fehler und nenne die Run-URL.
- Laeuft der Lauf noch (`status: in_progress`), warte einmal weitere 60
  Sekunden und pruefe erneut.

In der Mail aus SCHRITT 5 ersetzt du das Feld "Buffer Post-ID" durch den
Status des Workflow-Laufs samt Run-URL.

## 5. Fehler nie stillschweigend abfangen

Wenn ein Schritt scheitert, schreib das klar in die Zusammenfassung und in die
Mail. Die Automation hat vom 17.08. bis 22.08.2026 unbemerkt nichts gepostet,
weil der Buffer-Fehler wie ein normaler Abschluss aussah.
