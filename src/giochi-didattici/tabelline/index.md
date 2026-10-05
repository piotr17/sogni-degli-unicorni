---
title: Tabelline a colori
h1: "Tabelline a colori: il gioco per impararle"
metatitle: "Gioco delle tabelline online: imparale a colori, gratis"
description: "Gioco gratis per imparare le tabelline dall'1 al 10: ogni tabellina ha il suo colore, in ordine o mescolate, con i progressi salvati. Per 2ª e 3ª elementare."
lede: "Ogni tabellina ha il suo colore. Scegli quali ripassare, in ordine o mescolate: la moltiplicazione resta sullo schermo per pensare, poi arriva il risultato."
materia: Matematica
argomento: Tabelline
classi: "2ª e 3ª"
eta: [7, 9]
app: /giochi-didattici/tabelline/gioca.html
date: 2026-10-04
faq:
  - domanda: "In che classe si studiano le tabelline?"
    risposta: "Di solito si cominciano in seconda elementare e si consolidano in terza. Ripassarle anche in quarta e quinta aiuta con le divisioni e le frazioni."
  - domanda: "Serve registrarsi o installare qualcosa?"
    risposta: "No. Il gioco si apre nel browser, anche da tablet e telefono, ed è gratis."
  - domanda: "Dove vengono salvati i progressi?"
    risposta: "Solo nel browser del dispositivo che usate. Non raccogliamo nomi né dati del bambino, e potete cancellare i progressi dal gioco con un tocco."
  - domanda: "Come si impara una tabellina difficile come quella del 7?"
    risposta: "Poche alla volta: scegliete solo il 7, prima in ordine e poi mescolata, per qualche minuto al giorno. La tabella pitagorica qui sotto aiuta a vedere le moltiplicazioni che già si conoscono, come 7 × 2 = 2 × 7."
---

## Come si gioca

1. **Scegli le tabelline** da ripassare: una sola, qualcuna o tutte e dieci.
2. **In ordine o mescolate**: in ordine per impararle, mescolate per vedere se si sanno davvero.
3. **Pensa al risultato**: dopo 5 secondi compare da solo, oppure tocca lo schermo quando sei pronto.
4. **Premi OK** se l'avevi indovinato. A fine giro vedi quante sono giuste, il confronto con l'ultima volta e le moltiplicazioni da ripassare.

Nella schermata **Progressi** ogni tabellina ha le sue barre, una per giro, così si vede se sta migliorando, e c'è l'elenco delle moltiplicazioni da ripassare. Il gioco si adatta al tema chiaro o scuro del dispositivo: col tema chiaro è un quaderno a quadretti, con quello scuro una lavagna.

## La tabella pitagorica

Tutte le tabelline dall'1 al 10 in una tabella sola: si cerca il primo numero nella colonna a sinistra, il secondo nella riga in alto, e il risultato è dove si incontrano.

<div class="table-scroll">
<table class="pitagorica">
<caption>Tabella pitagorica dall'1 al 10</caption>
<thead><tr><th scope="col">×</th>{%- for b in range(1, 11) %}<th scope="col">{{ b }}</th>{%- endfor %}</tr></thead>
<tbody>
{%- for a in range(1, 11) %}
<tr><th scope="row">{{ a }}</th>{%- for b in range(1, 11) %}<td>{{ a * b }}</td>{%- endfor %}</tr>
{%- endfor %}
</tbody>
</table>
</div>

## Consigli per genitori e maestre

- **Pochi minuti, tutti i giorni**: cinque minuti al giorno funzionano meglio di un'ora la domenica.
- **Una tabellina alla volta**: si aggiunge la successiva quando la precedente esce sicura anche mescolata.
- **Prima le facili**: la tabellina dell'1, del 2, del 5 e del 10 danno fiducia; poi 3, 4, 6, 9; per ultime 7 e 8.
- **Lo scambio aiuta**: 3 × 8 fa come 8 × 3. Chi sa la tabellina del 3 conosce già un pezzo di quella dell'8.
- **Ad alta voce**: dire la moltiplicazione mentre compare sullo schermo aiuta a ricordarla.
