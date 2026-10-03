# I Sogni degli Unicorni

Sito di storie della buonanotte e disegni da colorare a tema unicorni: <https://sogniunicorni.it>.

Generato con [Eleventy](https://www.11ty.dev/) (base: starter _eleventy-excellent_) e pubblicato su Netlify a ogni push su `main`.
I contenuti sono prodotti in gran parte dalla pipeline [py-storyteller-ai](https://github.com/piotr17/py-storyteller-ai), che scrive direttamente in questo repository.

## Sviluppo

```
npm install
npm start        # server locale con watch
npm run build    # build di produzione in dist/
```

## Contenuti

Tutto sta in `src/posts/`. Il layout decide il tipo di pagina:

| Tipo | File | Layout | URL |
|---|---|---|---|
| Storia | `<slug>.md` | `post` | `permalink` nel front matter (`/storie/<slug>.html`), altrimenti `/blog/<titolo>/` |
| Disegno da colorare | `<slug>-da-colorare.md` | `pagina-da-colorare` | `/unicorni-da-colorare/<slug>-da-colorare.html` |
| Libro | `sogni-degli-unicorni-volume-N.md` | `libro` | `/sogni-degli-unicorni-volume-N/` |

Le recensioni stanno in `src/recensioni/` (layout `review`).

### Storia e disegno

Una storia e il suo disegno si collegano a vicenda (pulsanti "Colora questa storia" / "Leggi anche la storia"). Il collegamento si trova così:

1. campo `storia: "<slug-della-storia>"` nel front matter del disegno, se presente;
2. altrimenti nome file: `<slug>-da-colorare.md` ↔ `<slug>.md`;
3. altrimenti, per i contenuti più vecchi, titolo uguale.

La logica è nei filtri `relatedColoring` / `relatedStory` in `config/filters/index.js`.

### Front matter

```yaml
---
layout: post
title: "Titolo della storia"
date: 2024-06-02
tags: [Unicorni]
metatitle: "Titolo SEO"
description: "Meta description"
style: Gianni Rodari        # autore a cui si ispira lo stile del racconto
permalink: /storie/titolo-della-storia.html
image: /assets/images/titolo-della-storia.webp
---
```

Mettete sempre `date`: senza, Eleventy usa la data del file e su Netlify l'ordine delle storie diventa casuale.

### Redirect

`src/assets/helperfiles/_redirects.njk` genera il file `_redirects` di Netlify. Quando rimuovete o rinominate una pagina, aggiungete lì la riga `vecchio-url	nuovo-url`.
