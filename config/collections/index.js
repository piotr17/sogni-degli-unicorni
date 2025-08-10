const path = require('path');
const fs = require('fs');

module.exports = function(eleventyConfig) {
    // Aggiungi una collezione personalizzata
    eleventyConfig.addCollection("recensioni", function(collectionApi) {
        // Trova tutti i file nella cartella 'recensioni'
        let recensioniDir = path.resolve(__dirname, 'src/recensioni');
        let recensioniFiles = fs.readdirSync(recensioniDir);

        let recensioniItems = recensioniFiles.map(filename => {
            let filePath = path.join(recensioniDir, filename);
            let fileContents = fs.readFileSync(filePath, 'utf8');

            // Crea un oggetto per ogni file con le informazioni necessarie
            return {
                url: `/recensioni/${path.basename(filename, path.extname(filename))}.html`,
                // Qui puoi aggiungere altre proprietà basate sul contenuto del file se necessario, come title o date
                data: fileContents
            };
        });

        return recensioniItems;
    });

    // Configurazione per trasformare gli URL come desiderato
    eleventyConfig.addPassthroughCopy({"src/recensioni": "recensioni"});

    // Collections per link incrociati
    eleventyConfig.addCollection("racconti", function(collectionApi) {
        return collectionApi.getFilteredByTag("storie").slice(0, 10);
    });

    eleventyConfig.addCollection("disegniDaColorare", function(collectionApi) {
        return collectionApi.getFilteredByTag("unicornidacolorare").slice(0, 10);
    });

    // Altre configurazioni di Eleventy possono andare qui
};
