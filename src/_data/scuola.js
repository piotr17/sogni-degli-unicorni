/**
 * La scuola degli unicorni: giochi e strumenti per la scuola primaria (/giochi-didattici/).
 * `materie` dà l'ordine dei gruppi nella pagina della sezione; il campo `materia` di ogni gioco
 * deve coincidere con uno di questi `nome`. Una materia senza giochi non compare.
 */
module.exports = {
  nome: 'La scuola degli unicorni',
  url: '/giochi-didattici/',
  materie: [
    {nome: 'Matematica', descrizione: 'Numeri, tabelline e calcolo a mente.'},
    {nome: 'Italiano', descrizione: 'Lettura, scrittura e grammatica.'},
    {nome: 'Inglese', descrizione: 'Le prime parole e frasi in inglese.'},
    {nome: 'Scienze', descrizione: 'Il corpo, gli animali, le piante e la natura.'},
    {nome: 'Storia', descrizione: 'Il tempo, la linea del tempo e le civiltà antiche.'},
    {nome: 'Geografia', descrizione: "L'orientamento, le carte e le regioni d'Italia."}
  ]
};
