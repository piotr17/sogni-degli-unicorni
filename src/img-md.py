import os
import datetime

# Percorso della cartella da controllare
folder_path = './assets/images/'
output_path = './posts/'

# Lista per mantenere i nomi dei file immagine
image_files = []

# Estensioni dei file immagine da considerare
image_extensions = ['.jpg', '.jpeg', '.png', '.gif']

# Scansione della cartella
for file in os.listdir(folder_path):
    if any(file.endswith(ext) for ext in image_extensions):
        image_files.append(file)

# Creazione dei file MD per ogni immagine
for image in image_files:
    # Rimozione dell'estensione del file per il titolo
    base_name = os.path.splitext(image)[0]
    # Beautification del file name con conversione dei - in spazi e maiuscole nelle parole
    nice_name = ' '.join(base_name.split('-'))
    nice_name = nice_name.title()
    # Ottenimento della data e ora corrente in formato ISO 8601
    current_datetime = datetime.datetime.now().isoformat()
    
    # Creazione del contenuto del file MD
    md_content = f"""---
layout: pagina-da-colorare
title: {nice_name}
date: {current_datetime}
tags: unicornidacolorare
metatitle: {nice_name} da colorare
description: Scarica un bellissimo disegno da colorare basato sulla storia {nice_name}
image: /assets/images/{base_name}.png
permalink: /unicorni-da-colorare/{base_name}.html
---
Scarica stampa e colora l'immagine del racconto {nice_name}
"""
    
    # Percorso e nome del file MD da creare
    md_file_path = os.path.join(output_path, f"{base_name}-da-colorare.md")
    
    # Scrittura del file MD
    with open(md_file_path, 'w') as md_file:
        md_file.write(md_content)

print("Creati file MD per tutte le immagini.")
