import { SUPPORTED_LANGUAGES } from './languageCatalog.mjs';

const imageToPdfKeys = [
  'uploadLabel', 'uploadPrompt', 'dropPrompt', 'uploadDescription', 'chooseImages',
  'moveUp', 'moveDown', 'rotateCounterclockwise', 'rotateClockwise', 'pageSize',
  'fitImageDimensions', 'customDimensions', 'orientation', 'portrait', 'landscape',
  'autoOrient', 'customWidth', 'customHeight', 'imageFit', 'contain', 'fill',
  'margin', 'horizontalAlignment', 'left', 'center', 'right', 'verticalAlignment',
  'top', 'middle', 'bottom', 'maximumWidth', 'maximumHeight', 'scale',
  'pageBackgroundColor', 'jpegQuality', 'maintainAspectRatio', 'encodingNote',
  'reset', 'addMoreImages', 'createPdf', 'creatingPdf', 'page', 'pages', 'ready',
  'downloadPdf'
];

const imageToPdfLabels = {
  en: [
    'Choose images to convert to PDF', 'Choose or drop JPEG, PNG, or BMP images',
    'Drop images to add them', 'Create a PDF from up to {max} JPEG, PNG, or BMP images.',
    'Choose Images', 'Move up', 'Move down', 'Rotate counterclockwise',
    'Rotate clockwise', 'Page size', 'Fit image dimensions', 'Custom dimensions',
    'Orientation', 'Portrait', 'Landscape', 'Auto orient each page to its image',
    'Custom width (mm)', 'Custom height (mm)', 'Image fit', 'Contain (show entire image)',
    'Fill page (may crop)', 'Margin (points)', 'Horizontal alignment', 'Left', 'Center',
    'Right', 'Vertical alignment', 'Top', 'Middle', 'Bottom', 'Maximum width (px)',
    'Maximum height (px)', 'Scale (%)', 'Page background color', 'JPEG quality ({quality}%)',
    'Maintain aspect ratio',
    'PNG and BMP inputs are encoded as PNG to retain decoded transparency; JPEG inputs are resized and re-encoded using the quality setting. All resizing uses temporary browser copies, not the originals.',
    'Reset', 'Add more images ({count}/{max})', 'Create PDF ({count} {pageUnit})',
    'Creating PDF…', 'page', 'pages', 'Ready: {fileName} · {size}', 'Download PDF'
  ],
  es: [
    'Elige imágenes para convertir a PDF', 'Elige o suelta imágenes JPEG, PNG o BMP',
    'Suelta imágenes para añadirlas', 'Crea un PDF con hasta {max} imágenes JPEG, PNG o BMP.',
    'Elegir imágenes', 'Mover arriba', 'Mover abajo', 'Girar en sentido antihorario',
    'Girar en sentido horario', 'Tamaño de página', 'Ajustar a las dimensiones de la imagen',
    'Dimensiones personalizadas', 'Orientación', 'Vertical', 'Horizontal',
    'Orientar cada página según su imagen', 'Ancho personalizado (mm)',
    'Alto personalizado (mm)', 'Ajuste de imagen', 'Contener (mostrar toda la imagen)',
    'Rellenar página (puede recortar)', 'Margen (puntos)', 'Alineación horizontal',
    'Izquierda', 'Centro', 'Derecha', 'Alineación vertical', 'Arriba', 'Medio', 'Abajo',
    'Ancho máximo (px)', 'Alto máximo (px)', 'Escala (%)', 'Color de fondo de página',
    'Calidad JPEG ({quality}%)', 'Mantener la proporción',
    'Las imágenes PNG y BMP se codifican como PNG para conservar la transparencia decodificada; las imágenes JPEG se redimensionan y vuelven a codificar con la calidad indicada. El original no se modifica.',
    'Restablecer', 'Añadir más imágenes ({count}/{max})', 'Crear PDF ({count} {pageUnit})',
    'Creando PDF…', 'página', 'páginas', 'Listo: {fileName} · {size}', 'Descargar PDF'
  ],
  fr: [
    'Choisir des images à convertir en PDF', 'Choisissez ou déposez des images JPEG, PNG ou BMP',
    'Déposez des images pour les ajouter', 'Créez un PDF avec jusqu’à {max} images JPEG, PNG ou BMP.',
    'Choisir des images', 'Déplacer vers le haut', 'Déplacer vers le bas',
    'Pivoter dans le sens antihoraire', 'Pivoter dans le sens horaire', 'Format de page',
    'Adapter aux dimensions de l’image', 'Dimensions personnalisées', 'Orientation',
    'Portrait', 'Paysage', 'Orienter chaque page selon son image', 'Largeur personnalisée (mm)',
    'Hauteur personnalisée (mm)', 'Ajustement de l’image', 'Contenir (afficher toute l’image)',
    'Remplir la page (peut rogner)', 'Marge (points)', 'Alignement horizontal',
    'Gauche', 'Centre', 'Droite', 'Alignement vertical', 'Haut', 'Milieu', 'Bas',
    'Largeur maximale (px)', 'Hauteur maximale (px)', 'Échelle (%)', 'Couleur de fond de page',
    'Qualité JPEG ({quality}%)', 'Conserver les proportions',
    'Les images PNG et BMP sont encodées en PNG pour préserver leur transparence décodée ; les images JPEG sont redimensionnées et réencodées selon le niveau de qualité choisi. Les originaux ne sont pas modifiés.',
    'Réinitialiser', 'Ajouter des images ({count}/{max})', 'Créer le PDF ({count} {pageUnit})',
    'Création du PDF…', 'page', 'pages', 'Prêt : {fileName} · {size}', 'Télécharger le PDF'
  ],
  de: [
    'Bilder für die Umwandlung in PDF auswählen', 'JPEG-, PNG- oder BMP-Bilder auswählen oder hier ablegen',
    'Bilder hier ablegen, um sie hinzuzufügen', 'Erstelle ein PDF aus bis zu {max} JPEG-, PNG- oder BMP-Bildern.',
    'Bilder auswählen', 'Nach oben verschieben', 'Nach unten verschieben',
    'Gegen den Uhrzeigersinn drehen', 'Im Uhrzeigersinn drehen', 'Seitengröße',
    'An Bildabmessungen anpassen', 'Benutzerdefinierte Abmessungen', 'Ausrichtung',
    'Hochformat', 'Querformat', 'Jede Seite am jeweiligen Bild ausrichten',
    'Benutzerdefinierte Breite (mm)', 'Benutzerdefinierte Höhe (mm)', 'Bildanpassung',
    'Einpassen (gesamtes Bild anzeigen)', 'Seite füllen (kann beschneiden)',
    'Rand (Punkte)', 'Horizontale Ausrichtung', 'Links', 'Mitte', 'Rechts',
    'Vertikale Ausrichtung', 'Oben', 'Mittig', 'Unten', 'Maximale Breite (px)',
    'Maximale Höhe (px)', 'Skalierung (%)', 'Seitenhintergrundfarbe',
    'JPEG-Qualität ({quality}%)', 'Seitenverhältnis beibehalten',
    'PNG- und BMP-Bilder werden als PNG codiert, damit die dekodierte Transparenz erhalten bleibt. JPEG-Bilder werden mit der gewählten Qualität skaliert und neu codiert. Originale bleiben unverändert.',
    'Zurücksetzen', 'Weitere Bilder hinzufügen ({count}/{max})', 'PDF erstellen ({count} {pageUnit})',
    'PDF wird erstellt…', 'Seite', 'Seiten', 'Fertig: {fileName} · {size}', 'PDF herunterladen'
  ],
  pt: [
    'Escolha imagens para converter em PDF', 'Escolha ou solte imagens JPEG, PNG ou BMP',
    'Solte imagens para adicioná-las', 'Crie um PDF com até {max} imagens JPEG, PNG ou BMP.',
    'Escolher imagens', 'Mover para cima', 'Mover para baixo', 'Girar no sentido anti-horário',
    'Girar no sentido horário', 'Tamanho da página', 'Ajustar às dimensões da imagem',
    'Dimensões personalizadas', 'Orientação', 'Retrato', 'Paisagem',
    'Orientar cada página conforme a imagem', 'Largura personalizada (mm)',
    'Altura personalizada (mm)', 'Ajuste da imagem', 'Conter (mostrar a imagem inteira)',
    'Preencher página (pode cortar)', 'Margem (pontos)', 'Alinhamento horizontal',
    'Esquerda', 'Centro', 'Direita', 'Alinhamento vertical', 'Topo', 'Meio', 'Base',
    'Largura máxima (px)', 'Altura máxima (px)', 'Escala (%)', 'Cor de fundo da página',
    'Qualidade JPEG ({quality}%)', 'Manter proporção',
    'Imagens PNG e BMP são codificadas como PNG para preservar a transparência decodificada; imagens JPEG são redimensionadas e recodificadas com a qualidade selecionada. Os originais não são alterados.',
    'Redefinir', 'Adicionar mais imagens ({count}/{max})', 'Criar PDF ({count} {pageUnit})',
    'Criando PDF…', 'página', 'páginas', 'Pronto: {fileName} · {size}', 'Baixar PDF'
  ],
  it: [
    'Scegli immagini da convertire in PDF', 'Scegli o trascina immagini JPEG, PNG o BMP',
    'Trascina le immagini qui per aggiungerle', 'Crea un PDF con un massimo di {max} immagini JPEG, PNG o BMP.',
    'Scegli immagini', 'Sposta in alto', 'Sposta in basso', 'Ruota in senso antiorario',
    'Ruota in senso orario', 'Formato pagina', 'Adatta alle dimensioni dell’immagine',
    'Dimensioni personalizzate', 'Orientamento', 'Verticale', 'Orizzontale',
    'Orienta ogni pagina in base alla sua immagine', 'Larghezza personalizzata (mm)',
    'Altezza personalizzata (mm)', 'Adattamento immagine', 'Contieni (mostra tutta l’immagine)',
    'Riempi pagina (può ritagliare)', 'Margine (punti)', 'Allineamento orizzontale',
    'Sinistra', 'Centro', 'Destra', 'Allineamento verticale', 'In alto', 'Al centro',
    'In basso', 'Larghezza massima (px)', 'Altezza massima (px)', 'Scala (%)',
    'Colore di sfondo della pagina', 'Qualità JPEG ({quality}%)', 'Mantieni proporzioni',
    'Le immagini PNG e BMP vengono codificate come PNG per mantenere la trasparenza decodificata; le immagini JPEG vengono ridimensionate e ricodificate con la qualità scelta. Gli originali non vengono modificati.',
    'Reimposta', 'Aggiungi altre immagini ({count}/{max})', 'Crea PDF ({count} {pageUnit})',
    'Creazione PDF…', 'pagina', 'pagine', 'Pronto: {fileName} · {size}', 'Scarica PDF'
  ],
  nl: [
    'Kies afbeeldingen om naar PDF om te zetten', 'Kies of sleep JPEG-, PNG- of BMP-afbeeldingen',
    'Sleep afbeeldingen hierheen om ze toe te voegen', 'Maak een PDF met maximaal {max} JPEG-, PNG- of BMP-afbeeldingen.',
    'Afbeeldingen kiezen', 'Omhoog verplaatsen', 'Omlaag verplaatsen',
    'Linksom draaien', 'Rechtsom draaien', 'Paginaformaat', 'Aan afbeeldingsafmetingen aanpassen',
    'Aangepaste afmetingen', 'Oriëntatie', 'Staand', 'Liggend',
    'Elke pagina aanpassen aan de afbeelding', 'Aangepaste breedte (mm)',
    'Aangepaste hoogte (mm)', 'Afbeelding passend maken', 'Passend maken (hele afbeelding tonen)',
    'Pagina vullen (kan bijsnijden)', 'Marge (punten)', 'Horizontale uitlijning',
    'Links', 'Midden', 'Rechts', 'Verticale uitlijning', 'Boven', 'Midden', 'Onder',
    'Maximale breedte (px)', 'Maximale hoogte (px)', 'Schaal (%)',
    'Achtergrondkleur van pagina', 'JPEG-kwaliteit ({quality}%)', 'Beeldverhouding behouden',
    'PNG- en BMP-afbeeldingen worden als PNG gecodeerd om de gedecodeerde transparantie te behouden; JPEG-afbeeldingen worden met de gekozen kwaliteit geschaald en opnieuw gecodeerd. De originelen blijven ongewijzigd.',
    'Opnieuw instellen', 'Meer afbeeldingen toevoegen ({count}/{max})', 'PDF maken ({count} {pageUnit})',
    'PDF maken…', 'pagina', 'pagina’s', 'Gereed: {fileName} · {size}', 'PDF downloaden'
  ],
  pl: [
    'Wybierz obrazy do konwersji na PDF', 'Wybierz lub upuść obrazy JPEG, PNG albo BMP',
    'Upuść obrazy, aby je dodać', 'Utwórz PDF z maksymalnie {max} obrazów JPEG, PNG lub BMP.',
    'Wybierz obrazy', 'Przenieś w górę', 'Przenieś w dół', 'Obróć przeciwnie do ruchu wskazówek zegara',
    'Obróć zgodnie z ruchem wskazówek zegara', 'Rozmiar strony', 'Dopasuj do wymiarów obrazu',
    'Wymiary niestandardowe', 'Orientacja', 'Pionowa', 'Pozioma',
    'Dopasuj orientację każdej strony do obrazu', 'Niestandardowa szerokość (mm)',
    'Niestandardowa wysokość (mm)', 'Dopasowanie obrazu', 'Dopasuj (pokaż cały obraz)',
    'Wypełnij stronę (może przyciąć)', 'Margines (punkty)', 'Wyrównanie poziome',
    'Do lewej', 'Do środka', 'Do prawej', 'Wyrównanie pionowe', 'Góra', 'Środek', 'Dół',
    'Maksymalna szerokość (px)', 'Maksymalna wysokość (px)', 'Skala (%)',
    'Kolor tła strony', 'Jakość JPEG ({quality}%)', 'Zachowaj proporcje',
    'Obrazy PNG i BMP są kodowane jako PNG, aby zachować odczytaną przezroczystość; obrazy JPEG są skalowane i kodowane ponownie z wybraną jakością. Oryginały pozostają bez zmian.',
    'Resetuj', 'Dodaj więcej obrazów ({count}/{max})', 'Utwórz PDF ({count} {pageUnit})',
    'Tworzenie PDF…', 'strona', 'strony', 'Gotowe: {fileName} · {size}', 'Pobierz PDF'
  ],
  sv: [
    'Välj bilder att konvertera till PDF', 'Välj eller släpp JPEG-, PNG- eller BMP-bilder',
    'Släpp bilder här för att lägga till dem', 'Skapa en PDF med upp till {max} JPEG-, PNG- eller BMP-bilder.',
    'Välj bilder', 'Flytta upp', 'Flytta ned', 'Rotera moturs', 'Rotera medurs',
    'Sidstorlek', 'Anpassa till bildens mått', 'Anpassade mått', 'Orientering',
    'Stående', 'Liggande', 'Anpassa varje sida efter bilden', 'Anpassad bredd (mm)',
    'Anpassad höjd (mm)', 'Bildanpassning', 'Anpassa (visa hela bilden)',
    'Fyll sidan (kan beskära)', 'Marginal (punkter)', 'Horisontell justering',
    'Vänster', 'Centrera', 'Höger', 'Vertikal justering', 'Överst', 'Mitten', 'Nederst',
    'Maximal bredd (px)', 'Maximal höjd (px)', 'Skala (%)', 'Sidans bakgrundsfärg',
    'JPEG-kvalitet ({quality}%)', 'Behåll bildförhållandet',
    'PNG- och BMP-bilder kodas som PNG för att behålla avkodad transparens; JPEG-bilder ändras i storlek och kodas om med vald kvalitet. Originalen ändras inte.',
    'Återställ', 'Lägg till fler bilder ({count}/{max})', 'Skapa PDF ({count} {pageUnit})',
    'Skapar PDF…', 'sida', 'sidor', 'Klart: {fileName} · {size}', 'Ladda ned PDF'
  ],
  fi: [
    'Valitse PDF-muotoon muunnettavat kuvat', 'Valitse tai pudota JPEG-, PNG- tai BMP-kuvia',
    'Lisää kuvia pudottamalla ne tähän', 'Luo PDF, jossa on enintään {max} JPEG-, PNG- tai BMP-kuvaa.',
    'Valitse kuvat', 'Siirrä ylös', 'Siirrä alas', 'Kierrä vastapäivään', 'Kierrä myötäpäivään',
    'Sivun koko', 'Sovita kuvan mittoihin', 'Mukautetut mitat', 'Suunta',
    'Pysty', 'Vaaka', 'Suuntaa sivu kuvan mukaan', 'Mukautettu leveys (mm)',
    'Mukautettu korkeus (mm)', 'Kuvan sovitus', 'Sovita (näytä koko kuva)',
    'Täytä sivu (voi rajata)', 'Marginaali (pistettä)', 'Vaakasuuntainen tasaus',
    'Vasen', 'Keskelle', 'Oikea', 'Pystysuuntainen tasaus', 'Ylös', 'Keskelle', 'Alas',
    'Enimmäisleveys (px)', 'Enimmäiskorkeus (px)', 'Skaalaus (%)', 'Sivun taustaväri',
    'JPEG-laatu ({quality}%)', 'Säilytä kuvasuhde',
    'PNG- ja BMP-kuvat koodataan PNG-muotoon, jotta purettu läpinäkyvyys säilyy; JPEG-kuvat skaalataan ja koodataan uudelleen valitulla laadulla. Alkuperäisiä ei muuteta.',
    'Palauta', 'Lisää kuvia ({count}/{max})', 'Luo PDF ({count} {pageUnit})',
    'Luodaan PDF…', 'sivu', 'sivua', 'Valmis: {fileName} · {size}', 'Lataa PDF'
  ],
  da: [
    'Vælg billeder, der skal konverteres til PDF', 'Vælg eller slip JPEG-, PNG- eller BMP-billeder',
    'Slip billeder her for at tilføje dem', 'Opret en PDF med op til {max} JPEG-, PNG- eller BMP-billeder.',
    'Vælg billeder', 'Flyt op', 'Flyt ned', 'Drej mod uret', 'Drej med uret',
    'Sidestørrelse', 'Tilpas til billedets mål', 'Brugerdefinerede mål', 'Retning',
    'Stående', 'Liggende', 'Tilpas hver side efter billedet', 'Brugerdefineret bredde (mm)',
    'Brugerdefineret højde (mm)', 'Billedtilpasning', 'Tilpas (vis hele billedet)',
    'Udfyld siden (kan beskære)', 'Margen (punkter)', 'Vandret justering',
    'Venstre', 'Centrer', 'Højre', 'Lodret justering', 'Øverst', 'Midten', 'Nederst',
    'Maksimal bredde (px)', 'Maksimal højde (px)', 'Skala (%)', 'Sidens baggrundsfarve',
    'JPEG-kvalitet ({quality}%)', 'Bevar højde-bredde-forholdet',
    'PNG- og BMP-billeder kodes som PNG for at bevare den afkodede gennemsigtighed; JPEG-billeder ændres i størrelse og kodes igen med den valgte kvalitet. Originalerne ændres ikke.',
    'Nulstil', 'Tilføj flere billeder ({count}/{max})', 'Opret PDF ({count} {pageUnit})',
    'Opretter PDF…', 'side', 'sider', 'Klar: {fileName} · {size}', 'Hent PDF'
  ],
  nb: [
    'Velg bilder som skal konverteres til PDF', 'Velg eller slipp JPEG-, PNG- eller BMP-bilder',
    'Slipp bilder her for å legge dem til', 'Opprett en PDF med opptil {max} JPEG-, PNG- eller BMP-bilder.',
    'Velg bilder', 'Flytt opp', 'Flytt ned', 'Roter mot klokken', 'Roter med klokken',
    'Sidestørrelse', 'Tilpass til bildemål', 'Egendefinerte mål', 'Retning',
    'Stående', 'Liggende', 'Tilpass hver side etter bildet', 'Egendefinert bredde (mm)',
    'Egendefinert høyde (mm)', 'Bildetilpasning', 'Tilpass (vis hele bildet)',
    'Fyll siden (kan beskjære)', 'Marg (punkter)', 'Horisontal justering',
    'Venstre', 'Midtstill', 'Høyre', 'Vertikal justering', 'Øverst', 'Midten', 'Nederst',
    'Maksimal bredde (px)', 'Maksimal høyde (px)', 'Skala (%)', 'Bakgrunnsfarge for siden',
    'JPEG-kvalitet ({quality}%)', 'Behold størrelsesforhold',
    'PNG- og BMP-bilder kodes som PNG for å bevare dekodet gjennomsiktighet; JPEG-bilder skaleres og kodes på nytt med valgt kvalitet. Originalene endres ikke.',
    'Tilbakestill', 'Legg til flere bilder ({count}/{max})', 'Opprett PDF ({count} {pageUnit})',
    'Oppretter PDF…', 'side', 'sider', 'Klar: {fileName} · {size}', 'Last ned PDF'
  ],
  tr: [
    'PDF’ye dönüştürülecek görselleri seçin', 'JPEG, PNG veya BMP görselleri seçin ya da bırakın',
    'Eklemek için görselleri buraya bırakın', 'En fazla {max} JPEG, PNG veya BMP görselinden PDF oluşturun.',
    'Görselleri seçin', 'Yukarı taşı', 'Aşağı taşı', 'Saat yönünün tersine döndür',
    'Saat yönünde döndür', 'Sayfa boyutu', 'Görsel boyutlarına sığdır', 'Özel boyutlar',
    'Yön', 'Dikey', 'Yatay', 'Her sayfayı görseline göre yönlendir',
    'Özel genişlik (mm)', 'Özel yükseklik (mm)', 'Görsel sığdırma',
    'Sığdır (görselin tamamını göster)', 'Sayfayı doldur (kırpabilir)',
    'Kenar boşluğu (nokta)', 'Yatay hizalama', 'Sol', 'Orta', 'Sağ', 'Dikey hizalama',
    'Üst', 'Orta', 'Alt', 'Maksimum genişlik (px)', 'Maksimum yükseklik (px)',
    'Ölçek (%)', 'Sayfa arka plan rengi', 'JPEG kalitesi ({quality}%)', 'En-boy oranını koru',
    'Çözümlenen şeffaflığı korumak için PNG ve BMP görselleri PNG olarak kodlanır; JPEG görseller seçilen kaliteyle yeniden boyutlandırılıp kodlanır. Orijinaller değiştirilmez.',
    'Sıfırla', 'Daha fazla görsel ekle ({count}/{max})', 'PDF oluştur ({count} {pageUnit})',
    'PDF oluşturuluyor…', 'sayfa', 'sayfa', 'Hazır: {fileName} · {size}', 'PDF indir'
  ],
  ru: [
    'Выберите изображения для преобразования в PDF', 'Выберите или перетащите изображения JPEG, PNG или BMP',
    'Перетащите изображения сюда, чтобы добавить их', 'Создайте PDF из не более чем {max} изображений JPEG, PNG или BMP.',
    'Выбрать изображения', 'Переместить вверх', 'Переместить вниз', 'Повернуть против часовой стрелки',
    'Повернуть по часовой стрелке', 'Размер страницы', 'Подогнать под размер изображения',
    'Пользовательские размеры', 'Ориентация', 'Книжная', 'Альбомная',
    'Ориентировать страницу по изображению', 'Пользовательская ширина (мм)',
    'Пользовательская высота (мм)', 'Размещение изображения', 'Вписать (показать целиком)',
    'Заполнить страницу (возможно кадрирование)', 'Поле (пункты)', 'Выравнивание по горизонтали',
    'Слева', 'По центру', 'Справа', 'Выравнивание по вертикали', 'Сверху', 'По центру',
    'Снизу', 'Максимальная ширина (px)', 'Максимальная высота (px)', 'Масштаб (%)',
    'Цвет фона страницы', 'Качество JPEG ({quality}%)', 'Сохранять пропорции',
    'Изображения PNG и BMP кодируются как PNG для сохранения декодированной прозрачности; изображения JPEG изменяются по размеру и повторно кодируются с выбранным качеством. Оригиналы не меняются.',
    'Сбросить', 'Добавить изображения ({count}/{max})', 'Создать PDF ({count} {pageUnit})',
    'Создание PDF…', 'страница', 'страниц', 'Готово: {fileName} · {size}', 'Скачать PDF'
  ],
  uk: [
    'Виберіть зображення для перетворення на PDF', 'Виберіть або перетягніть зображення JPEG, PNG чи BMP',
    'Перетягніть зображення сюди, щоб додати їх', 'Створіть PDF із не більш ніж {max} зображень JPEG, PNG або BMP.',
    'Вибрати зображення', 'Перемістити вгору', 'Перемістити вниз',
    'Повернути проти годинникової стрілки', 'Повернути за годинниковою стрілкою',
    'Розмір сторінки', 'Підігнати під розміри зображення', 'Власні розміри',
    'Орієнтація', 'Книжкова', 'Альбомна', 'Орієнтувати сторінку за зображенням',
    'Власна ширина (мм)', 'Власна висота (мм)', 'Розміщення зображення',
    'Вписати (показати повністю)', 'Заповнити сторінку (можливе обрізання)',
    'Поле (пункти)', 'Горизонтальне вирівнювання', 'Ліворуч', 'По центру',
    'Праворуч', 'Вертикальне вирівнювання', 'Зверху', 'Посередині', 'Знизу',
    'Максимальна ширина (px)', 'Максимальна висота (px)', 'Масштаб (%)',
    'Колір тла сторінки', 'Якість JPEG ({quality}%)', 'Зберігати пропорції',
    'Зображення PNG і BMP кодуються як PNG, щоб зберегти розпізнану прозорість; зображення JPEG змінюються за розміром і кодуються повторно з вибраною якістю. Оригінали не змінюються.',
    'Скинути', 'Додати зображення ({count}/{max})', 'Створити PDF ({count} {pageUnit})',
    'Створення PDF…', 'сторінка', 'сторінок', 'Готово: {fileName} · {size}', 'Завантажити PDF'
  ],
  ar: [
    'اختر صورًا لتحويلها إلى PDF', 'اختر صور JPEG أو PNG أو BMP أو أسقطها هنا',
    'أسقط الصور هنا لإضافتها', 'أنشئ ملف PDF من ما يصل إلى {max} صور JPEG أو PNG أو BMP.',
    'اختيار الصور', 'تحريك لأعلى', 'تحريك لأسفل', 'تدوير عكس اتجاه عقارب الساعة',
    'تدوير مع اتجاه عقارب الساعة', 'حجم الصفحة', 'ملاءمة أبعاد الصورة',
    'أبعاد مخصصة', 'الاتجاه', 'عمودي', 'أفقي', 'توجيه كل صفحة حسب صورتها',
    'العرض المخصص (مم)', 'الارتفاع المخصص (مم)', 'ملاءمة الصورة',
    'احتواء (إظهار الصورة كاملة)', 'ملء الصفحة (قد يؤدي إلى الاقتصاص)',
    'الهامش (نقاط)', 'المحاذاة الأفقية', 'يسار', 'وسط', 'يمين', 'المحاذاة الرأسية',
    'أعلى', 'وسط', 'أسفل', 'الحد الأقصى للعرض (px)', 'الحد الأقصى للارتفاع (px)',
    'المقياس (%)', 'لون خلفية الصفحة', 'جودة JPEG ({quality}%)', 'الحفاظ على نسبة العرض إلى الارتفاع',
    'تُرمّز صور PNG وBMP بصيغة PNG للحفاظ على الشفافية بعد فك الترميز؛ وتُغيّر أبعاد صور JPEG ويُعاد ترميزها بالجودة المحددة. لا تتغير الملفات الأصلية.',
    'إعادة ضبط', 'إضافة صور أخرى ({count}/{max})', 'إنشاء PDF ({count} {pageUnit})',
    'جارٍ إنشاء PDF…', 'صفحة', 'صفحات', 'جاهز: {fileName} · {size}', 'تنزيل PDF'
  ],
  hi: [
    'PDF में बदलने के लिए चित्र चुनें', 'JPEG, PNG या BMP चित्र चुनें या यहाँ छोड़ें',
    'चित्र जोड़ने के लिए उन्हें यहाँ छोड़ें', 'अधिकतम {max} JPEG, PNG या BMP चित्रों से PDF बनाएँ।',
    'चित्र चुनें', 'ऊपर ले जाएँ', 'नीचे ले जाएँ', 'वामावर्त घुमाएँ', 'दक्षिणावर्त घुमाएँ',
    'पृष्ठ का आकार', 'चित्र के आकार में फिट करें', 'कस्टम आयाम', 'अभिविन्यास',
    'पोर्ट्रेट', 'लैंडस्केप', 'हर पृष्ठ का अभिविन्यास चित्र के अनुसार रखें',
    'कस्टम चौड़ाई (mm)', 'कस्टम ऊँचाई (mm)', 'चित्र का फिट',
    'समाहित करें (पूरा चित्र दिखाएँ)', 'पृष्ठ भरें (क्रॉप हो सकता है)',
    'मार्जिन (पॉइंट)', 'क्षैतिज संरेखण', 'बाएँ', 'केंद्र', 'दाएँ', 'लंबवत संरेखण',
    'ऊपर', 'बीच में', 'नीचे', 'अधिकतम चौड़ाई (px)', 'अधिकतम ऊँचाई (px)',
    'स्केल (%)', 'पृष्ठ का पृष्ठभूमि रंग', 'JPEG गुणवत्ता ({quality}%)', 'आस्पेक्ट अनुपात बनाए रखें',
    'डिकोड की गई पारदर्शिता बनाए रखने के लिए PNG और BMP चित्र PNG के रूप में एन्कोड किए जाते हैं; JPEG चित्र चुनी गई गुणवत्ता के अनुसार आकार बदलकर फिर से एन्कोड किए जाते हैं। मूल फ़ाइलें नहीं बदलतीं।',
    'रीसेट करें', 'और चित्र जोड़ें ({count}/{max})', 'PDF बनाएँ ({count} {pageUnit})',
    'PDF बनाया जा रहा है…', 'पृष्ठ', 'पृष्ठ', 'तैयार: {fileName} · {size}', 'PDF डाउनलोड करें'
  ],
  ja: [
    'PDFに変換する画像を選択', 'JPEG、PNG、BMP画像を選択またはドロップ',
    '画像をドロップして追加', '最大{max}枚のJPEG、PNG、BMP画像からPDFを作成します。',
    '画像を選択', '上へ移動', '下へ移動', '反時計回りに回転', '時計回りに回転',
    'ページサイズ', '画像の寸法に合わせる', 'カスタム寸法', '向き',
    '縦向き', '横向き', '各ページの向きを画像に合わせる', 'カスタム幅 (mm)',
    'カスタム高さ (mm)', '画像の配置', '全体を表示', 'ページに合わせる（切り抜かれる場合があります）',
    '余白（ポイント）', '水平方向の配置', '左', '中央', '右', '垂直方向の配置',
    '上', '中央', '下', '最大幅 (px)', '最大高さ (px)', '倍率 (%)',
    'ページの背景色', 'JPEG画質 ({quality}%)', '縦横比を維持',
    'デコード後の透明度を保つため、PNGとBMP画像はPNGとしてエンコードされます。JPEG画像は選択した画質でサイズ変更して再エンコードされます。元の画像は変更されません。',
    'リセット', '画像を追加 ({count}/{max})', 'PDFを作成 ({count}{pageUnit})',
    'PDFを作成中…', 'ページ', 'ページ', '準備完了: {fileName} · {size}', 'PDFをダウンロード'
  ],
  ko: [
    'PDF로 변환할 이미지 선택', 'JPEG, PNG 또는 BMP 이미지를 선택하거나 놓으세요',
    '이미지를 놓아 추가하세요', '최대 {max}개의 JPEG, PNG 또는 BMP 이미지로 PDF를 만듭니다.',
    '이미지 선택', '위로 이동', '아래로 이동', '시계 반대 방향으로 회전',
    '시계 방향으로 회전', '페이지 크기', '이미지 크기에 맞추기', '사용자 지정 크기',
    '방향', '세로', '가로', '이미지에 맞게 각 페이지 방향 설정',
    '사용자 지정 너비 (mm)', '사용자 지정 높이 (mm)', '이미지 맞춤',
    '맞춤 (이미지 전체 표시)', '페이지 채우기 (잘릴 수 있음)', '여백 (포인트)',
    '가로 정렬', '왼쪽', '가운데', '오른쪽', '세로 정렬', '위쪽', '가운데', '아래쪽',
    '최대 너비 (px)', '최대 높이 (px)', '배율 (%)', '페이지 배경색',
    'JPEG 품질 ({quality}%)', '가로세로 비율 유지',
    '디코딩된 투명도를 유지하기 위해 PNG 및 BMP 이미지는 PNG로 인코딩됩니다. JPEG 이미지는 선택한 품질로 크기를 조정해 다시 인코딩됩니다. 원본은 변경되지 않습니다.',
    '초기화', '이미지 더 추가 ({count}/{max})', 'PDF 만들기 ({count}{pageUnit})',
    'PDF 만드는 중…', '페이지', '페이지', '준비 완료: {fileName} · {size}', 'PDF 다운로드'
  ],
  'zh-CN': [
    '选择要转换为 PDF 的图片', '选择或拖放 JPEG、PNG 或 BMP 图片',
    '拖放图片以添加', '使用最多 {max} 张 JPEG、PNG 或 BMP 图片创建 PDF。',
    '选择图片', '上移', '下移', '逆时针旋转', '顺时针旋转', '页面大小',
    '适合图片尺寸', '自定义尺寸', '方向', '纵向', '横向', '根据图片调整每页方向',
    '自定义宽度 (mm)', '自定义高度 (mm)', '图片适配', '完整显示图片',
    '填充页面（可能裁剪）', '边距（点）', '水平对齐', '左', '居中', '右',
    '垂直对齐', '顶部', '中间', '底部', '最大宽度 (px)', '最大高度 (px)',
    '缩放 (%)', '页面背景色', 'JPEG 质量 ({quality}%)', '保持宽高比',
    'PNG 和 BMP 图片以 PNG 格式编码，以保留解码后的透明度；JPEG 图片会按所选质量缩放并重新编码。原始图片不会更改。',
    '重置', '添加更多图片 ({count}/{max})', '创建 PDF（{count} {pageUnit}）',
    '正在创建 PDF…', '页', '页', '已就绪：{fileName} · {size}', '下载 PDF'
  ]
};

const fileActionLabels = {
  en: ['Replace {fileName}', 'Remove {fileName}'],
  es: ['Reemplazar {fileName}', 'Quitar {fileName}'],
  fr: ['Remplacer {fileName}', 'Supprimer {fileName}'],
  de: ['{fileName} ersetzen', '{fileName} entfernen'],
  pt: ['Substituir {fileName}', 'Remover {fileName}'],
  it: ['Sostituisci {fileName}', 'Rimuovi {fileName}'],
  nl: ['{fileName} vervangen', '{fileName} verwijderen'],
  pl: ['Zastąp {fileName}', 'Usuń {fileName}'],
  sv: ['Ersätt {fileName}', 'Ta bort {fileName}'],
  fi: ['Korvaa {fileName}', 'Poista {fileName}'],
  da: ['Erstat {fileName}', 'Fjern {fileName}'],
  nb: ['Erstatt {fileName}', 'Fjern {fileName}'],
  tr: ['{fileName} dosyasını değiştir', '{fileName} dosyasını kaldır'],
  ru: ['Заменить {fileName}', 'Удалить {fileName}'],
  uk: ['Замінити {fileName}', 'Видалити {fileName}'],
  ar: ['استبدال {fileName}', 'إزالة {fileName}'],
  hi: ['{fileName} बदलें', '{fileName} हटाएँ'],
  ja: ['{fileName}を置き換え', '{fileName}を削除'],
  ko: ['{fileName} 바꾸기', '{fileName} 제거'],
  'zh-CN': ['替换 {fileName}', '移除 {fileName}']
};

const powerpointKeys = [
  'directionPdfToPptx', 'directionPptxToPdf', 'choosePdf', 'choosePptx',
  'uploadPdfPrompt', 'uploadPptxPrompt', 'dropPdfPrompt', 'dropPptxPrompt',
  'pageSelection', 'pageSelectionHint', 'outputFilename', 'imageQuality',
  'standardQuality', 'highQuality', 'slideSize', 'wideSlides', 'matchPdfPages',
  'pdfPageSize', 'matchSlides', 'a4', 'letter', 'imageBasedWarning',
  'fontNetworkWarning', 'countPages', 'countSlides', 'convert', 'converting',
  'renderingPage', 'renderingSlide'
];

const powerpointLabels = {
  en: ['PDF to PowerPoint', 'PowerPoint to PDF', 'Choose PDF', 'Choose PowerPoint', 'Choose or drop a PDF to convert', 'Choose or drop a PowerPoint .pptx file to convert', 'Drop the PDF here', 'Drop the .pptx file here', 'Pages or slides to include', 'Leave blank to include all; e.g. 1-3, 5', 'Output filename', 'Image quality', 'Standard', 'Higher', 'Slide size', 'Widescreen 16:9', 'Match the first selected PDF page', 'PDF page size', 'Match slide size', 'A4', 'Letter', 'Output is image-based: text cannot be edited or searched.', 'PPTX rendering may request substitute fonts from Google Fonts. The presentation itself stays in this browser.', 'PDF pages: {count}', 'PowerPoint slides: {count}', 'Convert', 'Converting…', 'Rendering PDF page {current} of {total}…', 'Rendering slide {current} of {total}…'],
  es: ['PDF a PowerPoint', 'PowerPoint a PDF', 'Elegir PDF', 'Elegir PowerPoint', 'Elige o suelta un PDF para convertir', 'Elige o suelta un archivo PowerPoint .pptx', 'Suelta el PDF aquí', 'Suelta el archivo .pptx aquí', 'Páginas o diapositivas que incluir', 'En blanco incluye todo; p. ej., 1-3, 5', 'Nombre del archivo de salida', 'Calidad de imagen', 'Estándar', 'Alta', 'Tamaño de diapositiva', 'Panorámica 16:9', 'Coincidir con la primera página PDF seleccionada', 'Tamaño de página PDF', 'Coincidir con las diapositivas', 'A4', 'Carta', 'La salida son imágenes: el texto no se puede editar ni buscar.', 'PPTX puede solicitar fuentes sustitutas a Google Fonts. La presentación permanece en este navegador.', 'Páginas PDF: {count}', 'Diapositivas PowerPoint: {count}', 'Convertir', 'Convirtiendo…', 'Procesando página PDF {current} de {total}…', 'Procesando diapositiva {current} de {total}…'],
  fr: ['PDF en PowerPoint', 'PowerPoint en PDF', 'Choisir un PDF', 'Choisir PowerPoint', 'Choisissez ou déposez un PDF à convertir', 'Choisissez ou déposez un fichier PowerPoint .pptx', 'Déposez le PDF ici', 'Déposez le fichier .pptx ici', 'Pages ou diapositives à inclure', 'Laissez vide pour tout inclure ; ex. : 1-3, 5', 'Nom du fichier de sortie', 'Qualité de l’image', 'Standard', 'Élevée', 'Format des diapositives', 'Grand écran 16:9', 'Adapter à la première page PDF choisie', 'Format de page PDF', 'Adapter aux diapositives', 'A4', 'Lettre', 'La sortie est composée d’images : le texte n’est ni modifiable ni consultable.', 'Le rendu PPTX peut demander des polices de remplacement à Google Fonts. La présentation reste dans ce navigateur.', 'Pages PDF : {count}', 'Diapositives PowerPoint : {count}', 'Convertir', 'Conversion…', 'Rendu de la page PDF {current} sur {total}…', 'Rendu de la diapositive {current} sur {total}…'],
  de: ['PDF zu PowerPoint', 'PowerPoint zu PDF', 'PDF auswählen', 'PowerPoint auswählen', 'PDF zum Umwandeln auswählen oder ablegen', 'PowerPoint-.pptx-Datei auswählen oder ablegen', 'PDF hier ablegen', '.pptx-Datei hier ablegen', 'Einzuschließende Seiten oder Folien', 'Leer lassen, um alles einzuschließen; z. B. 1-3, 5', 'Name der Ausgabedatei', 'Bildqualität', 'Standard', 'Hoch', 'Foliengröße', 'Breitbild 16:9', 'An erste ausgewählte PDF-Seite anpassen', 'PDF-Seitengröße', 'An Foliengröße anpassen', 'A4', 'Brief', 'Die Ausgabe besteht aus Bildern; Text ist nicht bearbeitbar oder durchsuchbar.', 'Beim PPTX-Rendern können Ersatzschriften von Google Fonts angefordert werden. Die Präsentation bleibt im Browser.', 'PDF-Seiten: {count}', 'PowerPoint-Folien: {count}', 'Umwandeln', 'Wird umgewandelt…', 'PDF-Seite {current} von {total} wird gerendert…', 'Folie {current} von {total} wird gerendert…'],
  pt: ['PDF para PowerPoint', 'PowerPoint para PDF', 'Escolher PDF', 'Escolher PowerPoint', 'Escolha ou solte um PDF para converter', 'Escolha ou solte um arquivo PowerPoint .pptx', 'Solte o PDF aqui', 'Solte o arquivo .pptx aqui', 'Páginas ou slides a incluir', 'Deixe vazio para incluir tudo; ex.: 1-3, 5', 'Nome do arquivo de saída', 'Qualidade da imagem', 'Padrão', 'Alta', 'Tamanho do slide', 'Widescreen 16:9', 'Ajustar à primeira página PDF selecionada', 'Tamanho da página PDF', 'Ajustar aos slides', 'A4', 'Carta', 'A saída é baseada em imagens: o texto não pode ser editado nem pesquisado.', 'A renderização PPTX pode solicitar fontes substitutas do Google Fonts. A apresentação permanece neste navegador.', 'Páginas PDF: {count}', 'Slides PowerPoint: {count}', 'Converter', 'Convertendo…', 'Renderizando página PDF {current} de {total}…', 'Renderizando slide {current} de {total}…'],
  it: ['PDF in PowerPoint', 'PowerPoint in PDF', 'Scegli PDF', 'Scegli PowerPoint', 'Scegli o trascina un PDF da convertire', 'Scegli o trascina un file PowerPoint .pptx', 'Trascina qui il PDF', 'Trascina qui il file .pptx', 'Pagine o diapositive da includere', 'Lascia vuoto per includere tutto; es. 1-3, 5', 'Nome del file di output', 'Qualità immagine', 'Standard', 'Alta', 'Formato diapositiva', 'Widescreen 16:9', 'Adatta alla prima pagina PDF selezionata', 'Formato pagina PDF', 'Adatta alle diapositive', 'A4', 'Lettera', 'L’output è composto da immagini: il testo non è modificabile né ricercabile.', 'Il rendering PPTX può richiedere font sostitutivi da Google Fonts. La presentazione resta nel browser.', 'Pagine PDF: {count}', 'Diapositive PowerPoint: {count}', 'Converti', 'Conversione…', 'Rendering pagina PDF {current} di {total}…', 'Rendering diapositiva {current} di {total}…'],
  nl: ['PDF naar PowerPoint', 'PowerPoint naar PDF', 'PDF kiezen', 'PowerPoint kiezen', 'Kies of sleep een PDF om te converteren', 'Kies of sleep een PowerPoint-.pptx-bestand', 'Sleep de PDF hierheen', 'Sleep het .pptx-bestand hierheen', 'Op te nemen pagina’s of dia’s', 'Laat leeg om alles op te nemen; bijv. 1-3, 5', 'Naam van uitvoerbestand', 'Beeldkwaliteit', 'Standaard', 'Hoog', 'Diaformaat', 'Breedbeeld 16:9', 'Aanpassen aan eerste geselecteerde PDF-pagina', 'PDF-paginaformaat', 'Diaformaat gebruiken', 'A4', 'Brief', 'De uitvoer bestaat uit afbeeldingen; tekst kan niet worden bewerkt of doorzocht.', 'PPTX-rendering kan vervangende lettertypen van Google Fonts aanvragen. De presentatie blijft in deze browser.', 'PDF-pagina’s: {count}', 'PowerPoint-dia’s: {count}', 'Converteren', 'Bezig met converteren…', 'PDF-pagina {current} van {total} renderen…', 'Dia {current} van {total} renderen…'],
  pl: ['PDF do PowerPoint', 'PowerPoint do PDF', 'Wybierz PDF', 'Wybierz PowerPoint', 'Wybierz lub upuść PDF do konwersji', 'Wybierz lub upuść plik PowerPoint .pptx', 'Upuść tutaj plik PDF', 'Upuść tutaj plik .pptx', 'Strony lub slajdy do uwzględnienia', 'Pozostaw puste, aby uwzględnić wszystko; np. 1-3, 5', 'Nazwa pliku wynikowego', 'Jakość obrazu', 'Standardowa', 'Wysoka', 'Rozmiar slajdu', 'Szeroki ekran 16:9', 'Dopasuj do pierwszej wybranej strony PDF', 'Rozmiar strony PDF', 'Dopasuj do slajdów', 'A4', 'Letter', 'Wynik składa się z obrazów; tekstu nie można edytować ani wyszukiwać.', 'Renderowanie PPTX może pobierać czcionki zastępcze z Google Fonts. Prezentacja pozostaje w przeglądarce.', 'Strony PDF: {count}', 'Slajdy PowerPoint: {count}', 'Konwertuj', 'Konwertowanie…', 'Renderowanie strony PDF {current} z {total}…', 'Renderowanie slajdu {current} z {total}…'],
  sv: ['PDF till PowerPoint', 'PowerPoint till PDF', 'Välj PDF', 'Välj PowerPoint', 'Välj eller släpp en PDF för konvertering', 'Välj eller släpp en PowerPoint-.pptx-fil', 'Släpp PDF-filen här', 'Släpp .pptx-filen här', 'Sidor eller bilder som ska ingå', 'Lämna tomt för att ta med allt; t.ex. 1-3, 5', 'Namn på utdatafil', 'Bildkvalitet', 'Standard', 'Hög', 'Bildstorlek', 'Bredbild 16:9', 'Anpassa till första valda PDF-sidan', 'PDF-sidstorlek', 'Anpassa till bilderna', 'A4', 'Letter', 'Utdata består av bilder; texten kan inte redigeras eller sökas.', 'PPTX-rendering kan begära ersättningsteckensnitt från Google Fonts. Presentationen stannar i webbläsaren.', 'PDF-sidor: {count}', 'PowerPoint-bilder: {count}', 'Konvertera', 'Konverterar…', 'Renderar PDF-sida {current} av {total}…', 'Renderar bild {current} av {total}…'],
  fi: ['PDF PowerPointiksi', 'PowerPoint PDF:ksi', 'Valitse PDF', 'Valitse PowerPoint', 'Valitse tai pudota muunnettava PDF', 'Valitse tai pudota PowerPoint .pptx -tiedosto', 'Pudota PDF tähän', 'Pudota .pptx-tiedosto tähän', 'Sisällytettävät sivut tai diat', 'Jätä tyhjäksi, jos haluat kaikki; esim. 1-3, 5', 'Tulostiedoston nimi', 'Kuvanlaatu', 'Tavallinen', 'Korkea', 'Dian koko', 'Laajakuva 16:9', 'Sovita ensimmäiseen valittuun PDF-sivuun', 'PDF-sivun koko', 'Sovita diojen kokoon', 'A4', 'Letter', 'Tuloste koostuu kuvista, joten tekstiä ei voi muokata eikä hakea.', 'PPTX-renderöinti voi pyytää korvaavia fontteja Google Fontsista. Esitys pysyy selaimessa.', 'PDF-sivut: {count}', 'PowerPoint-diat: {count}', 'Muunna', 'Muunnetaan…', 'Renderöidään PDF-sivua {current}/{total}…', 'Renderöidään diaa {current}/{total}…'],
  da: ['PDF til PowerPoint', 'PowerPoint til PDF', 'Vælg PDF', 'Vælg PowerPoint', 'Vælg eller slip en PDF, der skal konverteres', 'Vælg eller slip en PowerPoint-.pptx-fil', 'Slip PDF-filen her', 'Slip .pptx-filen her', 'Sider eller slides, der skal medtages', 'Lad feltet stå tomt for at medtage alt; f.eks. 1-3, 5', 'Outputfilnavn', 'Billedkvalitet', 'Standard', 'Høj', 'Slideformat', 'Bredformat 16:9', 'Tilpas til første valgte PDF-side', 'PDF-sideformat', 'Tilpas til slides', 'A4', 'Letter', 'Outputtet består af billeder; teksten kan ikke redigeres eller søges.', 'PPTX-gengivelse kan hente erstatningsskrifttyper fra Google Fonts. Præsentationen bliver i browseren.', 'PDF-sider: {count}', 'PowerPoint-slides: {count}', 'Konvertér', 'Konverterer…', 'Gengiver PDF-side {current} af {total}…', 'Gengiver slide {current} af {total}…'],
  nb: ['PDF til PowerPoint', 'PowerPoint til PDF', 'Velg PDF', 'Velg PowerPoint', 'Velg eller slipp en PDF som skal konverteres', 'Velg eller slipp en PowerPoint-.pptx-fil', 'Slipp PDF-filen her', 'Slipp .pptx-filen her', 'Sider eller lysbilder som skal tas med', 'La feltet stå tomt for å ta med alt, f.eks. 1-3, 5', 'Navn på resultatfil', 'Bildekvalitet', 'Standard', 'Høy', 'Lysbildestørrelse', 'Bredformat 16:9', 'Tilpass til første valgte PDF-side', 'PDF-sidestørrelse', 'Tilpass til lysbildene', 'A4', 'Letter', 'Resultatet består av bilder; tekst kan ikke redigeres eller søkes.', 'PPTX-gjengivelse kan be om erstatningsfonter fra Google Fonts. Presentasjonen forblir i nettleseren.', 'PDF-sider: {count}', 'PowerPoint-lysbilder: {count}', 'Konverter', 'Konverterer…', 'Gjengir PDF-side {current} av {total}…', 'Gjengir lysbilde {current} av {total}…'],
  tr: ['PDF’den PowerPoint’e', 'PowerPoint’ten PDF’ye', 'PDF seç', 'PowerPoint seç', 'Dönüştürülecek PDF’yi seçin veya bırakın', 'PowerPoint .pptx dosyasını seçin veya bırakın', 'PDF’yi buraya bırakın', '.pptx dosyasını buraya bırakın', 'Dahil edilecek sayfa veya slaytlar', 'Tümünü dahil etmek için boş bırakın; ör. 1-3, 5', 'Çıktı dosya adı', 'Görüntü kalitesi', 'Standart', 'Yüksek', 'Slayt boyutu', 'Geniş ekran 16:9', 'İlk seçilen PDF sayfasına uydur', 'PDF sayfa boyutu', 'Slayt boyutunu kullan', 'A4', 'Letter', 'Çıktı görüntülerden oluşur; metin düzenlenemez veya aranamaz.', 'PPTX görüntüleme Google Fonts’tan yedek yazı tipleri isteyebilir. Sunum tarayıcınızda kalır.', 'PDF sayfaları: {count}', 'PowerPoint slaytları: {count}', 'Dönüştür', 'Dönüştürülüyor…', 'PDF sayfası {current}/{total} işleniyor…', 'Slayt {current}/{total} işleniyor…'],
  ru: ['PDF в PowerPoint', 'PowerPoint в PDF', 'Выбрать PDF', 'Выбрать PowerPoint', 'Выберите или перетащите PDF для преобразования', 'Выберите или перетащите файл PowerPoint .pptx', 'Перетащите PDF сюда', 'Перетащите файл .pptx сюда', 'Страницы или слайды для включения', 'Оставьте пустым, чтобы включить всё; например, 1-3, 5', 'Имя выходного файла', 'Качество изображения', 'Стандартное', 'Высокое', 'Размер слайда', 'Широкий экран 16:9', 'По первой выбранной странице PDF', 'Размер страницы PDF', 'По размеру слайда', 'A4', 'Letter', 'Результат состоит из изображений; текст нельзя редактировать или искать.', 'При отображении PPTX могут запрашиваться заменяющие шрифты Google Fonts. Презентация остаётся в браузере.', 'Страницы PDF: {count}', 'Слайды PowerPoint: {count}', 'Преобразовать', 'Преобразование…', 'Обработка страницы PDF {current} из {total}…', 'Обработка слайда {current} из {total}…'],
  uk: ['PDF у PowerPoint', 'PowerPoint у PDF', 'Вибрати PDF', 'Вибрати PowerPoint', 'Виберіть або перетягніть PDF для перетворення', 'Виберіть або перетягніть файл PowerPoint .pptx', 'Перетягніть PDF сюди', 'Перетягніть файл .pptx сюди', 'Сторінки або слайди для включення', 'Залиште порожнім, щоб включити все; наприклад, 1-3, 5', 'Назва вихідного файлу', 'Якість зображення', 'Стандартна', 'Висока', 'Розмір слайда', 'Широкий екран 16:9', 'За першою вибраною сторінкою PDF', 'Розмір сторінки PDF', 'За розміром слайдів', 'A4', 'Letter', 'Результат складається із зображень; текст не можна редагувати чи шукати.', 'Для відтворення PPTX можуть запитуватися шрифти Google Fonts. Презентація залишається в браузері.', 'Сторінки PDF: {count}', 'Слайди PowerPoint: {count}', 'Перетворити', 'Перетворення…', 'Обробка сторінки PDF {current} з {total}…', 'Обробка слайда {current} з {total}…'],
  ar: ['PDF إلى PowerPoint', 'PowerPoint إلى PDF', 'اختيار PDF', 'اختيار PowerPoint', 'اختر ملف PDF أو أفلته للتحويل', 'اختر ملف PowerPoint .pptx أو أفلته', 'أفلت ملف PDF هنا', 'أفلت ملف .pptx هنا', 'الصفحات أو الشرائح المطلوب تضمينها', 'اتركه فارغًا لتضمين الكل؛ مثال: 1-3، 5', 'اسم ملف الإخراج', 'جودة الصورة', 'قياسية', 'عالية', 'حجم الشريحة', 'عريض 16:9', 'مطابقة أول صفحة PDF محددة', 'حجم صفحة PDF', 'مطابقة حجم الشرائح', 'A4', 'Letter', 'يتكون الإخراج من صور؛ لا يمكن تحرير النص أو البحث فيه.', 'قد يطلب عرض PPTX خطوطًا بديلة من Google Fonts. يبقى العرض التقديمي في المتصفح.', 'صفحات PDF: {count}', 'شرائح PowerPoint: {count}', 'تحويل', 'جارٍ التحويل…', 'عرض صفحة PDF {current} من {total}…', 'عرض الشريحة {current} من {total}…'],
  hi: ['PDF से PowerPoint', 'PowerPoint से PDF', 'PDF चुनें', 'PowerPoint चुनें', 'बदलने के लिए PDF चुनें या छोड़ें', 'PowerPoint .pptx फ़ाइल चुनें या छोड़ें', 'PDF यहाँ छोड़ें', '.pptx फ़ाइल यहाँ छोड़ें', 'शामिल करने के लिए पेज या स्लाइड', 'सभी शामिल करने के लिए खाली छोड़ें; जैसे 1-3, 5', 'आउटपुट फ़ाइल का नाम', 'इमेज गुणवत्ता', 'मानक', 'उच्च', 'स्लाइड आकार', 'वाइडस्क्रीन 16:9', 'पहले चुने गए PDF पेज से मिलाएँ', 'PDF पेज आकार', 'स्लाइड आकार से मिलाएँ', 'A4', 'Letter', 'आउटपुट इमेज हैं; टेक्स्ट संपादित या खोजा नहीं जा सकता।', 'PPTX रेंडरिंग Google Fonts से वैकल्पिक फ़ॉन्ट मांग सकती है। प्रस्तुति ब्राउज़र में रहती है।', 'PDF पेज: {count}', 'PowerPoint स्लाइड: {count}', 'बदलें', 'बदला जा रहा है…', 'PDF पेज {current}/{total} रेंडर हो रहा है…', 'स्लाइड {current}/{total} रेंडर हो रही है…'],
  ja: ['PDF から PowerPoint', 'PowerPoint から PDF', 'PDF を選択', 'PowerPoint を選択', '変換する PDF を選択またはドロップ', 'PowerPoint .pptx ファイルを選択またはドロップ', 'ここに PDF をドロップ', 'ここに .pptx ファイルをドロップ', '含めるページまたはスライド', 'すべて含める場合は空欄（例：1-3, 5）', '出力ファイル名', '画像品質', '標準', '高画質', 'スライドサイズ', 'ワイド画面 16:9', '最初に選択した PDF ページに合わせる', 'PDF ページサイズ', 'スライドに合わせる', 'A4', 'レター', '出力は画像形式のため、テキストの編集や検索はできません。', 'PPTX の描画時に Google Fonts へ代替フォントを要求する場合があります。プレゼンテーションはブラウザー内に留まります。', 'PDF ページ数：{count}', 'PowerPoint スライド数：{count}', '変換', '変換中…', 'PDF ページ {current}/{total} を描画中…', 'スライド {current}/{total} を描画中…'],
  ko: ['PDF를 PowerPoint로', 'PowerPoint를 PDF로', 'PDF 선택', 'PowerPoint 선택', '변환할 PDF를 선택하거나 놓으세요', 'PowerPoint .pptx 파일을 선택하거나 놓으세요', 'PDF를 여기에 놓으세요', '.pptx 파일을 여기에 놓으세요', '포함할 페이지 또는 슬라이드', '모두 포함하려면 비워 두세요(예: 1-3, 5)', '출력 파일 이름', '이미지 품질', '표준', '높음', '슬라이드 크기', '와이드스크린 16:9', '처음 선택한 PDF 페이지에 맞춤', 'PDF 페이지 크기', '슬라이드 크기에 맞춤', 'A4', 'Letter', '출력은 이미지이므로 텍스트를 편집하거나 검색할 수 없습니다.', 'PPTX 렌더링 중 Google Fonts에 대체 글꼴을 요청할 수 있습니다. 프레젠테이션은 브라우저에 남습니다.', 'PDF 페이지: {count}', 'PowerPoint 슬라이드: {count}', '변환', '변환 중…', 'PDF 페이지 {current}/{total} 렌더링 중…', '슬라이드 {current}/{total} 렌더링 중…'],
  'zh-CN': ['PDF 转 PowerPoint', 'PowerPoint 转 PDF', '选择 PDF', '选择 PowerPoint', '选择或拖放要转换的 PDF', '选择或拖放 PowerPoint .pptx 文件', '将 PDF 拖放到此处', '将 .pptx 文件拖放到此处', '要包含的页面或幻灯片', '留空以包含全部；例如 1-3, 5', '输出文件名', '图像质量', '标准', '高', '幻灯片尺寸', '宽屏 16:9', '匹配第一个所选 PDF 页面', 'PDF 页面尺寸', '匹配幻灯片尺寸', 'A4', 'Letter', '输出为图像，无法编辑或搜索文本。', '渲染 PPTX 时可能会向 Google Fonts 请求替代字体；演示文稿本身始终留在浏览器中。', 'PDF 页面：{count}', 'PowerPoint 幻灯片：{count}', '转换', '正在转换…', '正在渲染 PDF 页面 {current}/{total}…', '正在渲染幻灯片 {current}/{total}…']
};

const powerpointFontPrivacyDisclosures = {
  en: 'Font-family names from slides may be included in those requests; the presentation file and its contents are not.',
  es: 'Esos avisos pueden incluir los nombres de las fuentes de las diapositivas; no incluyen el archivo ni su contenido.',
  fr: 'Ces requêtes peuvent inclure les noms des polices des diapositives, mais pas le fichier ni son contenu.',
  de: 'Diese Anfragen können Schriftfamiliennamen aus den Folien enthalten, nicht jedoch die Präsentationsdatei oder deren Inhalte.',
  pt: 'Essas solicitações podem incluir os nomes das fontes dos slides, mas não o arquivo nem seu conteúdo.',
  it: 'Queste richieste possono includere i nomi dei font delle diapositive, ma non il file né i suoi contenuti.',
  nl: 'Deze verzoeken kunnen lettertypenamen uit de dia’s bevatten, maar niet het presentatiebestand of de inhoud ervan.',
  pl: 'Żądania mogą zawierać nazwy czcionek ze slajdów, ale nie plik prezentacji ani jego treść.',
  sv: 'Förfrågningarna kan innehålla teckensnittsnamn från bilderna, men inte presentationsfilen eller dess innehåll.',
  fi: 'Pyynnöt voivat sisältää diojen fonttiperheiden nimiä, mutta eivät esitystiedostoa tai sen sisältöä.',
  da: 'Anmodningerne kan indeholde skrifttypenavne fra slides, men ikke præsentationsfilen eller dens indhold.',
  nb: 'Forespørslene kan inneholde skriftnavn fra lysbildene, men ikke presentasjonsfilen eller innholdet.',
  tr: 'Bu isteklerde slaytlardaki yazı tipi adları bulunabilir; sunum dosyası ve içeriği gönderilmez.',
  ru: 'В запросы могут входить названия шрифтов со слайдов, но не файл презентации и не его содержимое.',
  uk: 'Запити можуть містити назви шрифтів зі слайдів, але не файл презентації та не його вміст.',
  ar: 'قد تتضمن هذه الطلبات أسماء الخطوط المستخدمة في الشرائح، لكنها لا تتضمن ملف العرض أو محتواه.',
  hi: 'इन अनुरोधों में स्लाइड के फ़ॉन्ट नाम शामिल हो सकते हैं, लेकिन प्रस्तुति फ़ाइल या उसकी सामग्री नहीं।',
  ja: 'このリクエストにはスライドのフォント名が含まれる場合がありますが、プレゼンテーションファイルや内容は含まれません。',
  ko: '요청에 슬라이드의 글꼴 이름이 포함될 수 있지만 프레젠테이션 파일이나 내용은 전송되지 않습니다.',
  'zh-CN': '这些请求可能包含幻灯片所用字体名称，但不包含演示文稿文件及其内容。'
};

const translations = {};
for (const { code } of SUPPORTED_LANGUAGES) {
  const imageLabels = imageToPdfLabels[code];
  const actionLabels = fileActionLabels[code];
  const powerpointLabelsForLanguage = powerpointLabels[code];
  if (!imageLabels || imageLabels.length !== imageToPdfKeys.length
    || !actionLabels || actionLabels.length !== 2
    || !powerpointLabelsForLanguage || powerpointLabelsForLanguage.length !== powerpointKeys.length) {
    throw new Error(`Tool UI translations are incomplete for "${code}".`);
  }
  translations[code] = {
    imageToPdf: Object.fromEntries(imageToPdfKeys.map((key, index) => [key, imageLabels[index]])),
    powerpoint: Object.fromEntries(powerpointKeys.map((key, index) => [key, powerpointLabelsForLanguage[index]])),
    fileActions: { replace: actionLabels[0], remove: actionLabels[1] }
  };
  if (!powerpointFontPrivacyDisclosures[code]) {
    throw new Error(`PowerPoint privacy disclosure is missing for "${code}".`);
  }
  translations[code].powerpoint.fontNameDisclosure = powerpointFontPrivacyDisclosures[code];
}

export const TOOL_UI_TRANSLATIONS = translations;

export const getLocalizedToolUi = (language) => (
  translations[language] || translations.en
);

export const formatToolUiMessage = (message, values) => message.replace(
  /\{(\w+)\}/g,
  (placeholder, key) => (Object.hasOwn(values, key) ? String(values[key]) : placeholder)
);
