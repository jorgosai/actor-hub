# Design-Notizen Actor Hub

Laufende Sammlung. Grundlage sind Referenz-Screenshots, die Jorgos ausgewählt hat,
plus seine Sätze dazu. Ziel: Geschmack in messbare Werte übersetzen, damit
Entscheidungen nachvollziehbar bleiben und nicht in jeder Sitzung neu erraten werden.

Stand: 28. Juli 2026

---

## Block 1 — fünf Referenzen

| Nr. | App | Jorgos' Satz |
|-----|-----|--------------|
| 1 | hims | Verschiedene Design-Elemente, Kacheln, Struktur, Farbnutzung subtil gut |
| 2 | Flow (Wispr) | Font-Nutzung, Größenunterschiede, Font-Arten |
| 3 | Flow (Wispr) | Anordnung der Elemente und der Fonts |
| 4 | Superpower | Farbnutzung in Elementen, Icons, moderner Feel |
| 5 | Superpower | Moderner Look and Feel (erweitert 4) |

Alle fünf sind Mobile. Drei Apps, zwei davon doppelt vertreten — Flow und
Superpower hat er also unabhängig zweimal ausgewählt.

---

## Was ich pro Referenz messen kann

### 1 — hims
- **Hintergrund** warmes Hellgrau, nicht Weiß. Karten darauf reinweiß.
- **Karten** ohne Rahmen. Radius ca. 20–24 px. Schatten kaum sichtbar.
  Trennung entsteht durch Helligkeitsunterschied Karte/Hintergrund, nicht durch Linien.
- **Markenfarbe Violett** erscheint ausschließlich als: Unterzeile unter der
  Überschrift, Fortschrittsbalken, winziges „Popular"-Tag. Nie als Fläche.
- **Hauptknopf ist schwarz**, nicht violett. Volle Breite, Radius voll rund.
- **Fortschritt** als vierstufige Leiste mit Textlabels (Requested → Delivered).
- **Auswahlliste**: gewählte Zeile = 1 px Akzentrahmen + gefüllte Akzent-Checkbox.
  Ungewählt = neutraler Rahmen. Die Zeilenfläche selbst bleibt in beiden Fällen weiß.
- **Kleine Kacheln** für Themen: quadratisch, nur Label + optional Tag oben rechts.

### 2 — Flow
- **Zwei Schriftarten mit unterschiedlichem Charakter**: Serif für Überschriften,
  Sans für alles Funktionale. Nicht nur zwei Schnitte derselben Familie.
- **Großer Sprungim Schriftgrad**: Überschrift etwa doppelt so groß wie Fließtext,
  und der Fließtext ist klein (ca. 15 px).
- **Akzentfarbe auf einem einzelnen Wort** („Your data is *safe*.") — Amber im
  ansonsten weißen Satz.
- **Dunkle Karte im hellen Screen** als Hervorhebung, statt Farbfläche.
- **Knopffarbe Creme** (nicht Weiß, nicht Schwarz) mit dunklem Text.
- **Fortschritt** als Segmentbalken oben, nicht als Punkte.

### 3 — Flow
- **Jede Auswahlzeile hat ein eigenes Icon** links. Das erzeugt einen großen Teil
  des „modernen" Eindrucks — die Liste liest sich nicht wie ein Formular.
- Zeilen: weiß, dünner Rahmen, Radius ca. 12 px, linksbündig.
- **Inaktiver Weiter-Knopf ist grau**, nicht ausgeblendet.
- **Bildhintergründe** mit warmer Farbkorrektur, Serif-Text darüber.
- Karussell-Punkte: der aktive wird zu einem kurzen Strich.

### 4 — Superpower
- **Orange als einzige Akzentfarbe.** Anteil an der Fläche schätzungsweise 5 %.
  Erscheint als: Preis, Häkchen-Kreise, aktive Tab-Unterstreichung, schmaler
  Streifen über der Preiskarte, Avatar-Punkt.
- **Listenzeilen in *einer* Karte mit dünnen Trennlinien** — nicht fünf Einzelkarten.
- Jede Zeile: Akzent-Häkchen links, Label, kleines Produktbild rechts.
- **Leerer Zustand gestaltet**: gestrichelte Platzhalterkästen mit „1st goal /
  2nd goal / 3rd goal".
- **Bilder laufen weich in den Hintergrund aus**, keine harte Rechteckkante.
- **Tabs** Scheduled / Processing / Results Ready: aktiv mit Akzent unterstrichen,
  Zukünftiges ausgegraut. Zustand ohne Farbe allein lesbar.

### 5 — Superpower
- **Schwarze Knöpfe über die volle Breite**, Radius voll rund.
- **Zentrierte Überschrift + zentrierte graue Unterzeile** im Onboarding.
  Auf den Datenseiten dagegen linksbündig.
- **Chip-Wolken**: kleine Pillen mit farbigem Punkt, nach hinten in der Deckkraft
  abnehmend — deutet „und noch mehr" an, ohne es auszuschreiben.
- **Vergleichskarte**: zwei gestapelte Felder in einer Karte (Standard vs. Superpower).
- **Nummerierte Schritte** 1 / 2 / 3 mit Akzentfarbe nur auf der Ziffer.
- Startbildschirm: nur die Wortmarke auf Weiß.

---

## Wiederkehrende Muster — das Wesentliche

1. **Neutrale Flächen, farbige Markierungen.**
   In allen fünf Referenzen füllt die Markenfarbe *nie* eine große Fläche.
   Sie sitzt in Icons, Ziffern, Unterstreichungen, einzelnen Wörtern, Häkchen.
   Geschätzter Farbanteil: unter 10 % der Bildfläche.

2. **Der Hauptknopf trägt nicht die Markenfarbe.**
   Vier von fünf verwenden fast-schwarze Pillen, eine cremefarbene.
   Die Markenfarbe ist für Akzente reserviert, nicht für Aktionen.

3. **Karten ohne Rahmen**, Radius 20–24 px, Schatten fast unsichtbar.
   Getrennt wird über Helligkeit, nicht über Linien.

4. **Viele Zeilen gehören in eine Karte**, mit dünnen Trennlinien —
   statt jede Zeile in ihre eigene Karte zu setzen.

5. **Starker Schriftgradkontrast bei kleinem Fließtext.**
   Überschrift etwa doppelt so groß, Fließtext klein (14–15 px) mit viel Zeilenabstand.

6. **Zwei Schriftarten mit unterschiedlichem Charakter**, nicht zwei Schnitte
   derselben Familie.

7. **Icons pro Listenzeile.**

8. **Ausgewählter Zustand = Akzentrahmen + gefülltes Steuerelement**,
   nicht eingefärbte Zeilenfläche.

9. **Fortschritt als Segmente mit Labels**, nicht als Prozentzahl oder Punkte.

10. **Bilder laufen aus statt hart zu enden.**

---

## Was in allen Referenzen steckt, aber nicht benannt wurde

- **Fast keine Schatten.** Was wir für „premium" halten, kommt dort ohne Erhebung aus.
- **Nur ein Akzentton pro App.** Bestätigt, was wir bei den Paletten gelernt haben.
- **Fließtext ist kleiner als bei uns.** 14–15 px gegen unsere 15–16 px, dafür luftiger gesetzt.
- **Leere Zustände sind gestaltet**, nicht nur ein grauer Satz.
- **Nichts ist doppelt hervorgehoben.** Pro Bildschirm gibt es genau eine Sache,
  die Aufmerksamkeit zieht.

---

## Abgleich mit dem aktuellen Stand von Actor Hub

| Referenzmuster | Actor Hub aktuell | Abweichung |
|---|---|---|
| Markenfarbe nur als Markierung | Großer grün gefüllter Hero-Block | **groß** |
| Kennzahlen auf neutraler Fläche | Vier farbig gefüllte Kacheln | **groß** |
| Hauptknopf fast-schwarz | Grüne Pillen | mittel |
| Zwei Schriftcharaktere | Bricolage + Geist — beide Sans | **groß** |
| Zeilen in einer Karte mit Trennlinien | Jede Zeile eine eigene Karte mit Schatten | mittel |
| Schatten fast unsichtbar | `shadow-sm` auf jeder Karte | klein |
| Icons pro Listenzeile | Nur Punkte | klein |
| Leere Zustände gestaltet | Grauer Satz | klein |

Die drei großen Abweichungen erklären wahrscheinlich zusammen, warum sich der
aktuelle Stand nicht so anfühlt wie die Referenzen — trotz derselben Grundstruktur.

**Wichtig:** die Struktur selbst (Sidebar, Kacheln, Karten, Reihenfolge) ist nicht
das Problem. Das wurde am 28.07. geprüft und von Jorgos bestätigt. Alternative
Strukturvorschläge wurden verworfen. Nicht erneut aufwärmen.

---

## Block 2 — fünf Referenzen

| Nr. | App | Plattform | Jorgos' Satz |
|-----|-----|-----------|--------------|
| 1 | Cleo | Mobile | Farbnutzung schön, warm und modern |
| 2 | Uvodo (Landing) | Desktop | Clean, übersichtlich, Farbakzentnutzung |
| 3 | Uvodo (App) | Desktop | Farbintensität der Elemente, Farbe an den richtigen Stellen, clean |
| 4 | Tines | Desktop | Trotz Boldness stimmig, modern, lebendig und individuell |
| 5 | Wise | Desktop | Einsatz der Logos und Farbelemente, Farbabstufung |

**Uvodo (App) und Wise sind die direkten Vergleichsfälle** — Desktop mit linker
Sidebar, Hauptbereich rechts. Dieselbe Grundform wie Actor Hub.

### 1 — Cleo
- **Warmer Verlauf als Hintergrund** (Pfirsich oben nach Creme unten), nicht flach.
- Auf dem Startscreen **keine Karten** — der Text sitzt direkt auf dem Verlauf.
- Markenfarbe ist ein **dunkles, entsättigtes Bordeaux**. Sie deckt große Flächen
  (Splash, Aktionskarte, Kontopanel) und funktioniert trotzdem.
  → **Wichtige Einschränkung zu Block 1:** Die Regel ist nicht „Markenfarbe nie
  als Fläche". Sie ist: *helle, gesättigte Töne können keine Fläche füllen,
  dunkle und entsättigte schon.*
- **Zahlentypografie**: `$` klein, `8.234` groß, `,78` klein. Hierarchie innerhalb
  einer einzigen Zahl.
- Segment-Tabs: aktiv = gefüllte dunkle Pille, inaktiv = weiße Pille.
- Nachbarkarte schaut am Rand hervor — signalisiert Karussell ohne Pfeile.
- Tab-Leiste unten: kreisförmig umrissene Icons, das aktive gefüllt.

### 2 — Uvodo (Landing)
- **Schwebende Pillen-Navigation** — nicht durchgehende Leiste, sondern eine
  abgerundete weiße Kapsel mit Abstand zum Rand.
- Hintergrund fast weiß mit **sehr feiner Rastertextur**.
- Überschrift riesig und schwarz, darin **ein Wort in einer gefüllten
  Akzent-Pille** („solopreneurs"). Gleiche Idee wie Flows farbiges Wort,
  aber als Fläche um das Wort.
- Umliegende Karten: weiß, dünner Rahmen, kleiner Radius (~10 px), kein Schatten.
  Jede mit **kleinem Akzent-Icon in getöntem Quadrat**.
- Statusanzeige „Active" = kleiner grüner Punkt plus Text.

### 3 — Uvodo (App) — Vergleichsfall
- **Sidebar ist hell**, nicht dunkel. Aktiver Eintrag = Akzentfarbe auf Text und
  Icon, **ohne gefüllten Hintergrund**.
- Gruppenlabel („Sales channels") klein und grau.
- Hauptbereich weiß mit sehr viel Weißraum.
- **Checkliste als eine Karte** mit Haarlinien zwischen den Zeilen. Jede Zeile:
  getöntes Icon-Quadrat, fette Zeile, graue Unterzeile.
- Erledigte Zeile: Icon-Quadrat grün getönt, Text ausgegraut.
- **Fortschritt als dünne Linie an der Oberkante der Karte** — kein separates Element.
- **Hinweisbox** hellblau getönt mit Icon, Text und Link mit Pfeil.
- Radius ~8–10 px, dünne Rahmen, keine Schatten.

### 4 — Tines
- Kräftiges Violett über die ganze Fläche, mit feinem Raster.
- **Serif für Überschriften, Sans für Fließtext** — dritte App im Set mit dieser Paarung.
- **Illustrationen** tragen die Persönlichkeit. Das ist das „lebendig und
  individuelle", das Jorgos benennt — es kommt nicht aus der Farbe, sondern aus
  gezeichneten Elementen.
- Viele bunte Details, aber alle in einer abgestimmten Familie.
- Chips mit farbigem Punkt plus Label. Prioritätschip mit winzigem Balken-Icon.
- **Lehre:** Kräftige Farbe funktioniert, wenn die Typografie ruhig bleibt und
  die Buntheit auf kleine, abgestimmte Elemente begrenzt ist.

### 5 — Wise — Vergleichsfall
- **Sidebar hell.** Aktiver Eintrag = hellgraue runde Pille, dunkler Text.
  Nicht in Markenfarbe gefüllt.
- **Akzentfarbe in mehreren Stufen für Knopf-Hierarchie**: „Send" kräftiges Grün,
  „Add money" und „Request" blasses Grün. Das ist die „Farbabstufung",
  die Jorgos benennt — Rangfolge über Sättigung statt über Form.
- **Karten sind hellgrau auf weißem Hintergrund** — genau umgekehrt zu hims
  (weiß auf grau). Beides funktioniert; entscheidend ist der Unterschied, nicht
  die Richtung.
- Kennzahl: kleines graues Label oben, großer fetter Wert darunter.
- **Logos und Flaggen als kreisrunde Marken** in Listenzeilen.
- Sekundärkarte („Do more with your money"): grau, zentrierter Text,
  großer runder Akzentknopf mit Plus. Gestalteter Leerzustand.
- **Links sind unterstrichen** („See all", „Find out more") statt farbig.
- Radius ~14 px, keine Schatten.

---

## Was Block 2 bestätigt

- Serif plus Sans (Tines) — jetzt drei Apps.
- Zeilen in **einer** Karte mit Trennlinien (Uvodo-Checkliste, Wise-Währungen).
  Damit sehr deutlich bestätigt.
- Icon pro Zeile (Uvodo).
- Praktisch keine Schatten (Uvodo, Wise).
- Starker Schriftgradkontrast bei kleinem Fließtext.
- Gestaltete Leerzustände (Wise).

## Was Block 2 korrigiert

**Der Hauptknopf trägt sehr wohl oft die Markenfarbe.**
Block 1: vier von fünf fast-schwarz. Block 2: Cleo bordeaux, Uvodo violett,
Wise grün. Über beide Blöcke ist es damit keine Regel, sondern eine Wahl.
Meine Schlussfolgerung aus Block 1 war zu schnell.

**Markenfarbe darf Fläche sein, wenn sie dunkel und entsättigt ist.** Siehe Cleo.

## Was Block 2 neu bringt

1. **Beide Desktop-Vergleichsfälle haben eine helle Sidebar** mit zurückhaltendem
   Aktiv-Zustand (Akzentfarbe nur auf Text, oder neutrale graue Pille).
   Actor Hub hat eine dunkle Sidebar mit in Markenfarbe gefüllter Pille.
2. **Akzent in Stufen** für Knopf-Rangfolge (Wise).
3. **Karten dürfen grau auf weiß sein** statt weiß auf grau.
4. **Ein Wort der Überschrift in einer Akzent-Pille** (Uvodo) — Weg, Farbe in
   große Typografie zu bringen, ohne Fläche zu fluten.
5. **Zahlentypografie mit Binnenhierarchie** (Cleo).
6. **Fortschritt als Haarlinie an der Kartenoberkante** (Uvodo).
7. **Getönte Hinweisbox** für Erklärungen (Uvodo).
8. **Illustrationen als Persönlichkeitsträger** (Tines).
9. **Unterstrichene Links** statt farbiger (Wise).
10. **Verlauf statt flacher Hintergrund** (Cleo).
11. **Kreisrunde Logos/Marken** in Listenzeilen (Wise).

## Farbwahl über beide Blöcke — mit Einschränkung

Vorkommende Farben: Violett (hims, Uvodo, Tines), Bordeaux/Warmbraun (Cleo),
Orange (Superpower), Grün (Wise), Amber (Flow). Kein Blau.

**Das ist kein verwertbares Signal.** Jorgos hat am 28.07. klargestellt: er hat die
Referenzen *nicht* nach dem Farbton ausgewählt, sondern nach **Einsatz, Abstufung
und Zusammenspiel**. Die vorkommenden Farbtöne sind also Beifang, nicht Absicht.
Nicht als Farbpräferenz behandeln.

Was er tatsächlich zur Farbe gesagt hat:
- **Blau ist seine persönliche Lieblingsfarbe.**
- Für Actor Hub hat er das Gefühl, Blau wirke „technisch, kühl und nicht so
  schauspielartig". Ausdrücklich ein Gefühl, keine Festlegung.
- **Keine Farbe ist ausgeschlossen.**

Konsequenz für die Arbeit: Farbton bleibt offen. Was aus den Referenzen zu holen
ist, sind die **Mechanismen** — Abstufung, Anteil an der Fläche, an welchen
Elementen Farbe sitzt. Nicht der Ton selbst.

---

## Block 3 — sechs Referenzen

| Nr. | App | Plattform | Jorgos' Satz |
|-----|-----|-----------|--------------|
| 1 | Contra (Landing) | Desktop | Clean, modern, gut erkennbar |
| 2 | Contra (App) | Desktop | Farbhighlights, andere Nutzung von Farben, Glow, Gradient-Logo-Animation, Aufbau/Struktur der Web-App |
| 3 | Contra (Anmeldung) | Desktop | Cleanes Anmelde-Pop-up (nur eine Beobachtung) |
| 4 | ClickUp | Desktop | Cleane Startseite mit hervorstehendem Element, App hinter leichtem Blur, Farbakzent auf Buttons |
| 5 | Mobbin | Desktop | Farbnutzung in Icons, Glow von Elementen, Stärke der Farbelemente |
| 6 | Coinbase | Desktop | Moderner Look, bolde Farbentscheidung als Element wie die Leiste oben |

Alle sechs Desktop. Damit sind es über alle Blöcke **16 Referenzen, 9 davon Desktop.**

### 1 — Contra (Landing)
- Hintergrund fast weiß mit **feiner Punktraster-Textur** und einem **sehr blassen
  farbigen Lichtschein** hinter der Überschrift. Sättigung minimal.
- Überschrift schwarz, ca. 56 px, enge Laufweite. Unterzeile grau, zentriert.
- Suchfeld: weiße Pille mit dünnem Rahmen, **der Knopf sitzt innen rechts im Feld**.
- Segmentumschalter „HIRE / GET HIRED": kleine Pille, aktives Segment weiß.
- **Filterreihe, in der nur das aktive Element eine Pille ist** — alles andere ist
  reiner Text ohne Rahmen. Sehr sparsam und trotzdem klar.
- Projektkarten: Bild zuerst, Radius ~12 px, kein Rahmen, kein Schatten.

### 2 — Contra (App) — reichhaltigster Vergleichsfall
- **Drei Spalten**: Navigation links, Inhalt mittig, Nebeninformation rechts.
- Sidebar hell. Aktiver Eintrag = **blass getönte Füllung** (Lavendel) mit dunklem
  Text. Nicht in Markenfarbe gefüllt.
- Gruppenlabels in winzigen grauen Kapitälchen: IDENTITY, LEADS, PROJECTS & PAYMENTS.
- Oben ein Arbeitsbereich-Wechsler als Karte mit Avatar, zwei Zeilen und Chevron.
- Unten eine Aktionskarte mit **Gradient-Leuchtrahmen** und Countdown.
- Avatar mit **Gradient-Ring als Kennzahl** (Discovery Score).
- Reiter mit kleinen Statusabzeichen daneben: „For you `COMING SOON`", „Jobs `BETA`".
  Aktiver Reiter mit dunkler Unterstreichung.
- **Kennzahlkasten**: hellgrau, große Zahl (56.460), darunter winzige graue
  Kapitälchen („PEOPLE ON THE WAITLIST").
- Rechte Spalte: winzige Kapitälchen als Rubrik, dann Zeilen mit `#`-Titel,
  rechts ausgerichteter grauer Zähler, zweizeilige graue Beschreibung.
- Schwebende Assistenzkarte unten rechts, einklappbar.

### 3 — Contra (Anmeldung)
- Modal weiß, Radius ~16 px, zentrierter Titel.
- **Primärknopf dunkel** (Google, mit farbigem G), **Sekundärknopf weiß mit Rahmen**.
- „OR SIGN UP BELOW" als winzige Kapitälchen mit Linien links und rechts.
- Vor- und Nachname nebeneinander, E-Mail über die ganze Breite.
- Seite dahinter abgedunkelt, kaum unscharf.

### 4 — ClickUp
- Weiß mit **mehrfarbigem, sehr blassem Lichtschein** in den Ecken (Rosa, Blau, Lavendel).
- Überschrift schwarz, ~56 px, enge Laufweite.
- **Gradient-Knopf** (Blau nach Magenta) als Handlungsaufforderung.
- **Produktbild stark weichgezeichnet im Hintergrund, davor eine scharfe weiße Karte.**
  Der Blur erzeugt Tiefe und lenkt die Aufmerksamkeit — nicht Farbe, nicht Schatten.
- Diese Karte: 3×4-Raster aus Feldern, jedes mit Icon, Label und winzigem
  Kontrollkästchen oben rechts.

### 5 — Mobbin
- **Zweistufige Navigation**: schmale dunkle Icon-Leiste ganz links (~68 px,
  Icon plus winziges Label), daneben eine helle Hauptsidebar.
  → Dunkel ist also nicht falsch, aber als *schmale Leiste*, nicht als Hauptnavigation.
- Jeder Arbeitsbereich hat ein **kleines Icon-Quadrat in einer eigenen kräftigen
  Farbe** (Blau, Grün, Violett, Orange, Gelb). Das ist die „Farbnutzung in Icons".
- **Zwei Chip-Stärken im selben Bild**:
  - Status kräftig gefüllt („SHIPPED" karminrot, „REVIEW" violett)
  - Schlagwörter blass getönt („component", „ui design", „dark mode")
  → Rangfolge über Sättigung, im selben Bildschirm. Verwandt mit Wise' Abstufung.
- Priorität: farbiges Fähnchen-Icon plus Wort, Rot für „Urgent".
- Karten weiß, dünner Rahmen, Radius ~10 px, kein Schatten, auf hellgrauem Grund.
- Überfällige Daten in Rot, rechts ausgerichtet.

### 6 — Coinbase
- **Durchgehende gesättigte Violettleiste am oberen Seitenrand**, weißer Text zentriert.
  → Jorgos nennt das „bolde Farbentscheidung". Bemerkenswert: kräftige Farbe
  funktioniert für ihn als **schmales Band**, nicht als großer Block.
  Das passt zur Cleo-Erkenntnis: der Flächenanteil entscheidet, nicht die Sättigung allein.
- Primärknopf gefüllte blaue Pille, **Sekundärknopf neutrale graue Pille**.
- Eingabefeld hellgrau gefüllt **ohne Rahmen**.
- Überschrift links, Produktbilder rechts — geteilter Aufbau statt zentriert.

---

## Was Block 3 neu bringt

1. **Lichtschein und Verläufe als Atmosphäre.** Contra und ClickUp legen sehr
   blasse farbige Lichtflächen hinter den Inhalt. Kein Farbblock, sondern Licht.
   Jorgos hat „Glow" und „Gradient" zweimal ausdrücklich benannt.
   In Actor Hub gibt es nichts davon — der Hintergrund ist eine flache Fläche.
2. **Zwei Chip-Stärken gleichzeitig** (Mobbin): kräftig für Status, blass für Schlagwörter.
3. **Nur das aktive Filterelement ist eine Pille**, der Rest ist Text (Contra).
4. **Blur als Tiefenwerkzeug** (ClickUp).
5. **Feine Rastertextur** im Hintergrund (Contra, Tines).
6. **Neutraler grauer Sekundärknopf** neben farbigem Primärknopf (Coinbase, Contra).
7. **Statusabzeichen als winzige Chips in Beschriftungen** (BETA, COMING SOON).
8. **Gradient-Ring um einen Avatar als Kennzahlanzeige** (Contra).
9. **Dreispaltiger Aufbau** mit rechter Nebenspalte (Contra).
10. **Kräftige Farbe als schmales Band** am Seitenrand (Coinbase).
11. **Eingabefeld grau gefüllt ohne Rahmen** (Coinbase).
12. **Knopf innerhalb des Eingabefelds** (Contra).

---

# Gesamtbild über alle 16 Referenzen

## Sehr starke Signale (in vielen unabhängigen Referenzen)

**1. Der aktive Navigationseintrag ist nie in Markenfarbe gefüllt.**
Vier Desktop-Apps mit Sidebar: Uvodo (nur Textfarbe), Wise (neutrale graue Pille),
Contra (blass getönte Füllung), Mobbin (hellere Füllung). **Vier von vier.**
Actor Hub füllt die Pille in Markenfarbe. Deutlichste Einzelabweichung.

**2. Sidebar hell.** Uvodo, Wise, Contra hell. Mobbin dunkel — aber nur als
schmale Icon-Leiste neben einer hellen Hauptsidebar. Actor Hub: dunkel, 256 px, Hauptnavigation.

**3. Ein Icon pro Zeile bzw. pro Eintrag.** Flow, Superpower, Uvodo, Mobbin, ClickUp.
Fünf Referenzen. Oft als getöntes oder farbiges Quadrat.

**4. Zeilen in *einer* Karte mit Haarlinien** statt vieler Einzelkarten.
Superpower, Uvodo, Wise, Mobbin, hims.

**5. Rangfolge über Farbstärke, nicht über Form.**
Wise (kräftiges/blasses Grün), Mobbin (kräftige/blasse Chips), Coinbase
(farbig/grau), Contra (dunkel/umrissen). Vier verschiedene Umsetzungen derselben Idee.

**6. Praktisch keine Schatten.** Durchgängig in allen 16.

**7. Kennzahl = große Zahl plus winzige graue Kapitälchen.** Cleo, Wise, Contra.

**8. Serif plus Sans.** Flow, Tines. Zwei von 16 — schwächer als ich in Block 1
geschätzt habe, aber Jorgos hat Flows Schrift *ausdrücklich* als Grund genannt.
Also nicht statistisch, sondern nach seiner Aussage relevant.

## Was Farbe angeht — die Mechanik

Über alle Referenzen lässt sich das so zusammenfassen:

- **Flächenanteil entscheidet, nicht Sättigung allein.** Ein schmales gesättigtes
  Band oben (Coinbase) geht. Eine große gesättigte Fläche geht nicht.
  Eine große *dunkle entsättigte* Fläche geht (Cleo).
- **Farbe sitzt bevorzugt an**: Icons, Ziffern, Häkchen, Unterstreichungen,
  Statuschips, einzelnen Wörtern, dünnen Fortschrittslinien.
- **Farbe kommt in Stufen**, nicht in einer Stärke.
- **Atmosphäre kommt aus blassem Licht**, nicht aus Farbflächen.

## Wo Actor Hub am stärksten abweicht — geordnet nach Deutlichkeit

| # | Abweichung | Belegt durch |
|---|---|---|
| 1 | Aktiver Nav-Eintrag in Markenfarbe gefüllt | 4 von 4 Sidebar-Apps machen es anders |
| 2 | Dunkle breite Sidebar als Hauptnavigation | 3 von 4 hell, 1 nur als schmale Leiste |
| 3 | Kein Lichtschein, flacher Hintergrund | Contra, ClickUp, Cleo, Tines |
| 4 | Nur eine Chip-Stärke | Mobbin, Wise, Coinbase, Contra |
| 5 | Jede Zeile eine eigene Karte mit Schatten | 5 Referenzen bündeln Zeilen |
| 6 | Keine Icons in Listenzeilen | 5 Referenzen haben sie |
| 7 | Zwei Sans-Schriften | Flow, Tines — und Jorgos' eigene Aussage |
| 8 | Großer gesättigter Farbblock (Hero) | Flächenanteil-Regel |
| 9 | Schatten auf jeder Karte | alle 16 verzichten fast völlig |

---

## Offene Punkte

- Serif-Display-Schrift testen (aus Referenz 2/3). Vermutlich der größte Hebel bei „Fonts".
- Hero-Block: Farbfläche gegen neutrale Karte mit Akzentmarkierungen tauschen — testen.
- Kennzahl-Kacheln: neutral mit farbigem Icon statt farbig gefüllt — testen.
- Knopffarbe fast-schwarz gegen Grün — testen.
- Mobile Ansicht wurde seit dem Redesign nie geprüft.
- Dark Mode: erst nachdem der helle Modus steht und das Kollegen-Feedback eingearbeitet ist.
