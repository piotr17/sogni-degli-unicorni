# CLAUDE.md

Guida per lavorare su questo repository. Per i dettagli operativi su contenuti e front matter vedi anche `readme.md`.

## Il progetto

**I Sogni degli Unicorni** (<https://sogniunicorni.it>) pubblica una serie di racconti della buonanotte con protagonisti gli unicorni, per bambini dai 3 agli 8 anni, ognuno con un disegno da colorare da stampare (A4, gratis).

Il portale ha quattro anime:

1. **Storie**: fiabe brevi da leggere ad alta voce, con un piccolo insegnamento (amicizia, coraggio, gentilezza). Lo stile di ogni racconto si ispira a un autore (campo `style`, es. Gianni Rodari, Beatrix Potter).
2. **Disegni da colorare**: uno per storia, collegato in entrambe le direzioni ("Colora questa storia" / "Leggi anche la storia").
3. **Il libro stampato**: *Sogni degli Unicorni – Volume 1* (17 storie + 1 bonus, 17 disegni), venduto su Amazon. Il sito lo promuove con la voce di menu evidenziata "Il libro", la pagina `/sogni-degli-unicorni-volume-1/` e la fascia `partials/book-band.njk`. Il link d'acquisto è `purchaseUrl` nel front matter del libro. Una parte delle storie del sito è stata spostata nel Volume 2 (vedi i redirect).

4. **La scuola degli unicorni** (`/giochi-didattici/`): piccoli giochi e strumenti che l'autore crea per aiutare la figlia a studiare alle elementari, pubblicati per tutti. Il primo è *Tabelline a colori*. Vedi la sezione dedicata più sotto.

Il pubblico finale sono bambini, ma chi legge e sceglie sono i genitori e le maestre: testi in italiano, tono caldo e semplice, niente contenuti che spaventano.

## Stack

- [Eleventy 2](https://www.11ty.dev/) (base: starter *eleventy-excellent*), template Nunjucks, Markdown con `markdownTemplateEngine: njk`.
- Input `src/`, output `dist/` (generato, ignorato da git).
- CSS: un solo foglio `src/assets/css/global.css` che importa `site/base.css`, `site/components.css`, `site/print.css`; compilato con PostCSS + Tailwind (token in `src/assets/design-tokens/*.json`) da `config/template-languages/css-config.js`.
- JS: `config/template-languages/js-config.js` impacchetta con esbuild solo `src/assets/scripts/app.js` (oggi assente: gli script del sito sono inline in `src/_layouts/base.njk`).
- Hosting: Netlify, deploy automatico a ogni push su `main` (`netlify.toml`: `npm run build`, publish `dist`, header di sicurezza).
- I contenuti arrivano in gran parte dalla pipeline [py-storyteller-ai](https://github.com/piotr17/py-storyteller-ai), che scrive direttamente in questo repository (il campo `temp` nel front matter è la temperatura usata per generarli).

## Comandi

```
npm install
npm start        # server locale con watch (http://localhost:8080)
npm run build    # pulizia + build di produzione in dist/
```

Non ci sono test: per verificare una modifica lancia `npm run build` e controlla l'output in `dist/`.

## Struttura

```
.eleventy.js            registrazione di filtri, shortcode, collezioni, plugin
config/
  collections/          storie, disegni, disegniDaColorare, recensioni, giochi
  filters/              relatedColoring/relatedStory, pageTitle, metaDescription, breadcrumbs, ...
  shortcodes/           imagePlaceholder, include_raw, youtube, email (antispam), year
  transforms/           minificazione HTML
  template-languages/   pipeline CSS e JS
src/
  _data/                meta.js (dati del sito), navigation.js (menu), scuola.js (materie), helpers, social
  _layouts/             base, home, blog, post, pagina-da-colorare, unicornidacolorare, libro, page, review(s),
                        giochi (indice della scuola), gioco (pagina di un gioco)
  _includes/partials/   header, footer, seo, breadcrumb, story-card, coloring-card, gioco-card, book-band
  posts/                storie, disegni da colorare e libri (tutti nella stessa cartella)
  giochi-didattici/     un gioco per cartella: index.md (pagina) + gioca.html (il gioco)
  pages/                home, elenco storie, indice dei giochi, about, uso dei disegni, privacy, cookie, note legali, 404
  unicorni-da-colorare/ indice dei disegni
  recensioni/           recensioni (layout review)
  assets/helperfiles/   _redirects, robots, sitemap, ads.txt, manifest, humans
  assets/images/        immagini di storie e disegni (stesso slug del contenuto)
```

## Contenuti: regole

- **Storia**: `src/posts/<slug>.md`, `layout: post`, `permalink: /storie/<slug>.html`, `image: /assets/images/<slug>.webp`.
- **Disegno**: `src/posts/<slug>-da-colorare.md`, `layout: pagina-da-colorare`, `tags: unicornidacolorare`, `permalink: /unicorni-da-colorare/<slug>-da-colorare.html`.
- **Libro**: `src/posts/sogni-degli-unicorni-volume-N.md`, `layout: libro`, `tags: libri`, con `purchaseUrl` e `price`.
- Collegamento storia ↔ disegno: campo `storia:` nel disegno, altrimenti nome file, altrimenti titolo (filtri `relatedColoring` / `relatedStory`).
- Metti sempre `date`: senza, su Netlify l'ordine delle storie diventa casuale.
- Compila `metatitle` e `description` (usati da `pageTitle` / `metaDescription` per la SEO).
- Gli slug contengono apostrofi, due punti e accenti (es. `l'unicorno-e-il-leone:-un'amicizia-speciale.md`): quotali sempre nei comandi shell e non rinominarli senza redirect.
- Immagini in WebP quando possibile (alcuni vecchi disegni sono ancora PNG).
- **Redirect**: quando rimuovi o rinomini una pagina aggiungi `vecchio-url	nuovo-url` in `src/assets/helperfiles/_redirects.njk`.

## Pubblicità, analytics e privacy

- In `base.njk`: Consent Mode v2 con tutto negato per default, **prima** di Google Tag Manager (`GTM-MK8MX85`); poi AdSense (`ca-pub-4548604400396789`). Il banner di consenso è quello di Google (Privacy e messaggi di AdSense). Non spostare GTM sopra il blocco di consenso.
- `ads.txt` generato da `src/assets/helperfiles/ads.njk`.
- Pagine legali: `/privacy/`, `/cookie-policy/`, `/note-legali/`, più `/uso-dei-disegni/` sull'uso dei disegni. Se aggiungi strumenti che salvano dati o usano servizi esterni, aggiorna privacy e cookie policy.
- L'email dell'autore non deve mai comparire in chiaro nell'HTML: usa lo shortcode `{% email %}`.

## La scuola degli unicorni (giochi didattici)

Giochi e strumenti per la scuola primaria (6-10 anni), nati per aiutare la figlia dell'autore a studiare. **Nome della sezione**: "La scuola degli unicorni" (occhiello, marchio dentro i giochi); **voce di menu e breadcrumb**: "Giochi per la scuola"; **URL**: `/giochi-didattici/`.

### Architettura e SEO

L'architettura è pensata per la ricerca: l'URL e gli H1 usano le parole che cercano genitori e maestre ("giochi didattici", "scuola primaria", "elementari", il nome dell'argomento), mentre il nome di fantasia sta nell'occhiello.

| Livello | URL | Indicizzata | File | Ruolo |
|---|---|---|---|---|
| Indice | `/giochi-didattici/` | sì | `src/pages/giochi-didattici.md` (layout `giochi`) | giochi raggruppati per materia; H1 "Giochi didattici per la scuola primaria"; schema `CollectionPage` + `ItemList` |
| Gioco | `/giochi-didattici/<argomento>/` | sì | `src/giochi-didattici/<argomento>/index.md` (layout `gioco`) | la pagina che si posiziona: spiegazione, contenuto utile, FAQ; schema `WebApplication` + `LearningResource`, `FAQPage` |
| App | `/giochi-didattici/<argomento>/gioca.html` | **no** (`noindex, follow`) | `src/giochi-didattici/<argomento>/gioca.html` | il gioco a schermo intero, copiato così com'è |

Regole:

- **URL piatti e stabili**: un gioco vive sempre in `/giochi-didattici/<argomento>/`, anche se cambia materia o classe. Lo slug è la parola chiave principale, breve e senza articoli: `tabelline`, `doppie`, `orologio`, `divisioni`. Mai rinominarlo senza redirect.
- **Materie e classi sono attributi, non cartelle**: `materia` (una di quelle in `src/_data/scuola.js`, che ne decide l'ordine nell'indice) e `classi` nel front matter. Le pagine per materia (`/giochi-didattici/matematica/`) si creano solo quando una materia ha **almeno 3 giochi**, per non pubblicare pagine vuote; per questo nessuno slug di un gioco può coincidere con il nome di una materia.
- **La pagina del gioco deve avere testo vero**, non solo il pulsante: come si gioca, un contenuto utile di per sé (per le tabelline: la tabella pitagorica in HTML), consigli per genitori e maestre, 3-5 domande frequenti in `faq`. È la pagina che Google indicizza; l'app è `noindex` perché da sola sarebbe una pagina quasi vuota.
- `metatitle` (≤ 62 caratteri) con la query principale ("Gioco delle tabelline online…"), `description` di 140-158 caratteri, `h1` descrittivo; `title` è il nome breve usato in card e breadcrumb.
- **Link interni**: menu principale, footer, sezione "03 — La scuola degli unicorni" in home (ultimi 3 giochi), "Altri giochi per la scuola" in fondo a ogni gioco, e dentro ogni app il marchio verso `/giochi-didattici/` più i link alla pagina del gioco e agli altri giochi. Dall'indice si rimanda alle storie.
- Breadcrumb: Home › Giochi per la scuola › <gioco> (filtro `breadcrumbs`, layout `gioco`).
- La sitemap include indice e pagine dei giochi da sola; le app non ci finiscono (sono copiate, non generate).

### Aggiungere un gioco

1. Crea `src/giochi-didattici/<argomento>/index.md`. Layout e permalink arrivano da `src/giochi-didattici/giochi-didattici.json`. Front matter:

   ```yaml
   ---
   title: Tabelline a colori            # nome breve (card, breadcrumb)
   h1: "Tabelline a colori: il gioco per impararle"
   metatitle: "Gioco delle tabelline online: imparale a colori, gratis"
   description: "…140-158 caratteri…"
   lede: "Una o due frasi sotto l'H1, usate anche nelle card."
   materia: Matematica                  # una delle materie di src/_data/scuola.js
   argomento: Tabelline                 # schema.org about/teaches
   classi: "2ª e 3ª"
   eta: [7, 9]
   app: /giochi-didattici/tabelline/gioca.html
   date: 2026-10-04
   faq:
     - domanda: "…"
       risposta: "…"
   ---
   ```

2. Metti il gioco in `src/giochi-didattici/<argomento>/gioca.html`: viene copiato in `dist` così com'è (passthrough) ed escluso dai template, quindi può contenere `{{ }}` senza problemi.
3. Nell'`<head>` del gioco: `<meta name="robots" content="noindex, follow">`, `<title><Gioco> · La scuola degli unicorni</title>`, una description e le favicon del sito (`/favicon.ico`, `/favicon.svg`, `/apple-touch-icon.png`).
4. Nella schermata iniziale del gioco: il marchio `.brand` (icona unicorno di `src/_includes/svg/unicorn-mark.svg` + "La scuola degli unicorni", link a `/giochi-didattici/`) e in fondo i link "Istruzioni…" (pagina del gioco) e "Altri giochi". Copiali da `tabelline/gioca.html`.
5. Se il gioco salva qualcosa nel browser, aggiungi le chiavi nella tabella della cookie policy.
6. `npm run build` e controlla `dist/giochi-didattici/`.

### Come devono essere i giochi

- Un file HTML autonomo (CSS e JS inline, al massimo Google Fonts), con un'identità propria ma il marchio della scuola. Niente GTM né AdSense dentro le app: la pubblicità e le statistiche stanno solo sulle pagine del sito.
- Funzionano bene da telefono, tablet e LIM (tocco, schermi piccoli, tema chiaro e scuro, `prefers-reduced-motion`), senza account.
- Niente dati personali dei bambini: il salvataggio resta nel browser (`localStorage`, in `try/catch`).
- Testi brevi, adatti a bambini di 6-10 anni, in italiano.

### Tabelline a colori

`src/giochi-didattici/tabelline/gioca.html`, pagina `/giochi-didattici/tabelline/`:

- ogni tabellina dall'1 al 10 ha un colore; se ne scelgono una o più, in ordine o mescolate;
- per ogni moltiplicazione 5 s per pensare (o un tocco per vedere subito il risultato), poi 4 s per premere OK se era giusta; pausa e uscita;
- fine giro: giuste su totale, confronto con l'ultima volta, moltiplicazioni da ripassare; schermata "Progressi" con lo storico (massimo 200 giri);
- tema chiaro "quaderno a quadretti" e scuro "lavagna", font Grandstander;
- salvataggio: se gira come Claude Artifact usa `window.claude` (`db` + `user`), altrimenti `localStorage` (`tabelline:v1`, `tabelline:storico:v1`). Sul sito vale solo `localStorage`.

## Convenzioni

- Lingua: contenuti, commenti e messaggi di commit in italiano.
- Commit in stile conventional: `feat:`, `fix:`, `perf:`, `docs:`, `content:`.
- Prettier (`.prettierrc`): 2 spazi, apici singoli, `printWidth` 90, niente virgole finali, `bracketSpacing: false`.
- `.env` (vedi `.env-sample`) contiene solo `URL`; in produzione `meta.url` è `https://sogniunicorni.it`.
