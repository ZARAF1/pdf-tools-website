import { SUPPORTED_LANGUAGES } from './languageCatalog.mjs';

const toolIds = [
  'merge', 'split', 'rotate', 'protect', 'unlock', 'image', 'pdf-images',
  'word', 'compress', 'edit', 'watermark', 'remove', 'extract', 'ocr',
  'crop', 'organize-pages', 'redact', 'sign'
];

const translations = {
  en: [
    ['Merge PDF', 'Split PDF', 'Rotate PDF', 'Protect PDF', 'Unlock PDF', 'Image to PDF', 'PDF to Images', 'PDF to Word', 'Compress PDF', 'Edit PDF', 'Watermark PDF', 'Remove PDF', 'Extract PDF Pages', 'OCR PDF', 'Crop PDF', 'Organize PDF', 'Redact PDF', 'Sign PDF'],
    ['combine PDF files into one document', 'extract selected pages or split a PDF into page files', 'rotate all or selected PDF pages', 'add an opening password to a PDF', 'remove supported encryption with the correct password', 'create a PDF from images', 'export PDF pages as image files', 'convert PDF text into an editable Word document', 'try to reduce PDF file size', 'add text, images, and annotations to a PDF copy', 'add text watermarks and page numbers', 'remove selected pages from a PDF', 'save selected pages as a new PDF', 'recognize scanned text and make a PDF searchable', 'change the visible page boundaries in a PDF', 'reorder, rotate, or remove PDF pages', 'permanently remove marked page content', 'add a visible signature to PDF pages']
  ],
  es: [
    ['Unir PDF', 'Dividir PDF', 'Girar PDF', 'Proteger PDF', 'Desbloquear PDF', 'Imagen a PDF', 'PDF a imágenes', 'PDF a Word', 'Comprimir PDF', 'Editar PDF', 'Marca de agua en PDF', 'Eliminar páginas PDF', 'Extraer páginas PDF', 'OCR de PDF', 'Recortar PDF', 'Organizar PDF', 'Redactar PDF', 'Firmar PDF'],
    ['combinar archivos PDF en un documento', 'extraer páginas seleccionadas o dividir un PDF en archivos por página', 'girar todas las páginas o algunas páginas del PDF', 'añadir una contraseña de apertura a un PDF', 'quitar el cifrado compatible con la contraseña correcta', 'crear un PDF a partir de imágenes', 'exportar páginas PDF como archivos de imagen', 'convertir texto PDF en un documento Word editable', 'intentar reducir el tamaño del PDF', 'añadir texto, imágenes y anotaciones a una copia del PDF', 'añadir marcas de agua de texto y números de página', 'quitar páginas seleccionadas de un PDF', 'guardar páginas seleccionadas como un PDF nuevo', 'reconocer texto escaneado y hacer que el PDF sea buscable', 'cambiar los límites visibles de las páginas del PDF', 'reordenar, girar o quitar páginas del PDF', 'eliminar permanentemente el contenido marcado de las páginas', 'añadir una firma visible a las páginas PDF']
  ],
  fr: [
    ['Fusionner PDF', 'Diviser PDF', 'Pivoter PDF', 'Protéger PDF', 'Déverrouiller PDF', 'Image en PDF', 'PDF en images', 'PDF en Word', 'Compresser PDF', 'Modifier PDF', 'Filigrane PDF', 'Supprimer des pages PDF', 'Extraire des pages PDF', 'OCR PDF', 'Recadrer PDF', 'Organiser PDF', 'Caviarder PDF', 'Signer PDF'],
    ['regrouper des fichiers PDF dans un seul document', 'extraire des pages choisies ou diviser un PDF en fichiers par page', 'faire pivoter toutes les pages ou certaines pages du PDF', 'ajouter un mot de passe à l’ouverture du PDF', 'retirer le chiffrement pris en charge avec le mot de passe correct', 'créer un PDF à partir d’images', 'exporter les pages PDF en fichiers image', 'convertir le texte PDF en document Word modifiable', 'essayer de réduire la taille du PDF', 'ajouter du texte, des images et des annotations à une copie du PDF', 'ajouter des filigranes textuels et des numéros de page', 'retirer les pages choisies d’un PDF', 'enregistrer les pages choisies dans un nouveau PDF', 'reconnaître le texte numérisé pour rendre le PDF consultable', 'modifier les limites visibles des pages PDF', 'réorganiser, faire pivoter ou retirer des pages PDF', 'supprimer définitivement le contenu marqué des pages', 'ajouter une signature visible aux pages PDF']
  ],
  de: [
    ['PDF zusammenführen', 'PDF teilen', 'PDF drehen', 'PDF schützen', 'PDF entsperren', 'Bild zu PDF', 'PDF zu Bildern', 'PDF zu Word', 'PDF komprimieren', 'PDF bearbeiten', 'PDF-Wasserzeichen', 'PDF-Seiten entfernen', 'PDF-Seiten extrahieren', 'OCR für PDF', 'PDF zuschneiden', 'PDF organisieren', 'PDF schwärzen', 'PDF unterschreiben'],
    ['PDF-Dateien zu einem Dokument zusammenfügen', 'ausgewählte Seiten extrahieren oder ein PDF in einzelne Seiten teilen', 'alle oder ausgewählte PDF-Seiten drehen', 'ein PDF mit einem Öffnungspasswort schützen', 'unterstützte Verschlüsselung mit dem richtigen Passwort entfernen', 'aus Bildern ein PDF erstellen', 'PDF-Seiten als Bilddateien exportieren', 'PDF-Text in ein bearbeitbares Word-Dokument umwandeln', 'versuchen, die PDF-Dateigröße zu verringern', 'einer PDF-Kopie Text, Bilder und Anmerkungen hinzufügen', 'Textwasserzeichen und Seitenzahlen hinzufügen', 'ausgewählte PDF-Seiten entfernen', 'ausgewählte Seiten als neues PDF speichern', 'gescannten Text erkennen und das PDF durchsuchbar machen', 'die sichtbaren Seitengrenzen eines PDFs ändern', 'PDF-Seiten neu anordnen, drehen oder entfernen', 'markierte Seiteninhalte dauerhaft entfernen', 'den PDF-Seiten eine sichtbare Unterschrift hinzufügen']
  ],
  pt: [
    ['Mesclar PDF', 'Dividir PDF', 'Girar PDF', 'Proteger PDF', 'Desbloquear PDF', 'Imagem para PDF', 'PDF para imagens', 'PDF para Word', 'Comprimir PDF', 'Editar PDF', 'Marca d’água em PDF', 'Remover páginas PDF', 'Extrair páginas PDF', 'OCR em PDF', 'Recortar PDF', 'Organizar PDF', 'Redigir PDF', 'Assinar PDF'],
    ['combinar arquivos PDF em um único documento', 'extrair páginas selecionadas ou dividir um PDF em arquivos por página', 'girar todas as páginas ou páginas selecionadas do PDF', 'adicionar uma senha de abertura a um PDF', 'remover criptografia compatível com a senha correta', 'criar um PDF a partir de imagens', 'exportar páginas PDF como arquivos de imagem', 'converter texto do PDF em um documento Word editável', 'tentar reduzir o tamanho do arquivo PDF', 'adicionar texto, imagens e anotações a uma cópia do PDF', 'adicionar marcas d’água de texto e números de página', 'remover páginas selecionadas de um PDF', 'salvar páginas selecionadas como um novo PDF', 'reconhecer texto digitalizado e tornar o PDF pesquisável', 'alterar os limites visíveis das páginas do PDF', 'reordenar, girar ou remover páginas do PDF', 'remover permanentemente conteúdo marcado das páginas', 'adicionar uma assinatura visível às páginas PDF']
  ],
  it: [
    ['Unisci PDF', 'Dividi PDF', 'Ruota PDF', 'Proteggi PDF', 'Sblocca PDF', 'Immagine in PDF', 'PDF in immagini', 'PDF in Word', 'Comprimi PDF', 'Modifica PDF', 'Filigrana PDF', 'Rimuovi pagine PDF', 'Estrai pagine PDF', 'OCR PDF', 'Ritaglia PDF', 'Organizza PDF', 'Oscura PDF', 'Firma PDF'],
    ['unire file PDF in un unico documento', 'estrarre pagine selezionate o dividere un PDF in file per pagina', 'ruotare tutte o alcune pagine del PDF', 'aggiungere una password di apertura a un PDF', 'rimuovere la crittografia supportata con la password corretta', 'creare un PDF da immagini', 'esportare le pagine PDF come file immagine', 'convertire il testo PDF in un documento Word modificabile', 'provare a ridurre le dimensioni del PDF', 'aggiungere testo, immagini e annotazioni a una copia PDF', 'aggiungere filigrane testuali e numeri di pagina', 'rimuovere pagine selezionate da un PDF', 'salvare le pagine selezionate come nuovo PDF', 'riconoscere il testo scansionato e rendere il PDF ricercabile', 'modificare i limiti visibili delle pagine PDF', 'riordinare, ruotare o rimuovere pagine PDF', 'rimuovere definitivamente i contenuti contrassegnati', 'aggiungere una firma visibile alle pagine PDF']
  ],
  nl: [
    ['PDF samenvoegen', 'PDF splitsen', 'PDF draaien', 'PDF beveiligen', 'PDF ontgrendelen', 'Afbeelding naar PDF', 'PDF naar afbeeldingen', 'PDF naar Word', 'PDF comprimeren', 'PDF bewerken', 'Watermerk in PDF', 'PDF-pagina’s verwijderen', 'PDF-pagina’s extraheren', 'OCR voor PDF', 'PDF bijsnijden', 'PDF organiseren', 'PDF redigeren', 'PDF ondertekenen'],
    ['PDF-bestanden combineren tot één document', 'geselecteerde pagina’s extraheren of een PDF per pagina splitsen', 'alle of geselecteerde PDF-pagina’s draaien', 'een openingswachtwoord aan een PDF toevoegen', 'ondersteunde versleuteling met het juiste wachtwoord verwijderen', 'een PDF van afbeeldingen maken', 'PDF-pagina’s als afbeeldingsbestanden exporteren', 'PDF-tekst omzetten naar een bewerkbaar Word-document', 'proberen de PDF-bestandsgrootte te verkleinen', 'tekst, afbeeldingen en annotaties aan een PDF-kopie toevoegen', 'tekstwatermerken en paginanummers toevoegen', 'geselecteerde pagina’s uit een PDF verwijderen', 'geselecteerde pagina’s als nieuwe PDF opslaan', 'gescande tekst herkennen en de PDF doorzoekbaar maken', 'de zichtbare paginaranden van een PDF wijzigen', 'PDF-pagina’s herordenen, draaien of verwijderen', 'gemarkeerde pagina-inhoud permanent verwijderen', 'een zichtbare handtekening aan PDF-pagina’s toevoegen']
  ],
  pl: [
    ['Połącz PDF', 'Podziel PDF', 'Obróć PDF', 'Chroń PDF', 'Odblokuj PDF', 'Obraz do PDF', 'PDF do obrazów', 'PDF do Word', 'Kompresuj PDF', 'Edytuj PDF', 'Znak wodny PDF', 'Usuń strony PDF', 'Wyodrębnij strony PDF', 'OCR PDF', 'Przytnij PDF', 'Organizuj PDF', 'Redaguj PDF', 'Podpisz PDF'],
    ['połączyć pliki PDF w jeden dokument', 'wyodrębnić wybrane strony lub podzielić PDF na osobne strony', 'obrócić wszystkie lub wybrane strony PDF', 'dodać hasło otwierające do pliku PDF', 'usunąć obsługiwane szyfrowanie przy użyciu prawidłowego hasła', 'utworzyć PDF z obrazów', 'wyeksportować strony PDF jako pliki obrazów', 'przekonwertować tekst PDF na edytowalny dokument Word', 'spróbować zmniejszyć rozmiar pliku PDF', 'dodać tekst, obrazy i adnotacje do kopii PDF', 'dodać tekstowe znaki wodne i numery stron', 'usunąć wybrane strony z pliku PDF', 'zapisać wybrane strony jako nowy plik PDF', 'rozpoznać tekst ze skanu i utworzyć przeszukiwalny PDF', 'zmienić widoczne granice stron PDF', 'zmienić kolejność, obrócić lub usunąć strony PDF', 'trwale usunąć zaznaczoną zawartość stron', 'dodać widoczny podpis do stron PDF']
  ],
  sv: [
    ['Slå ihop PDF', 'Dela PDF', 'Rotera PDF', 'Skydda PDF', 'Lås upp PDF', 'Bild till PDF', 'PDF till bilder', 'PDF till Word', 'Komprimera PDF', 'Redigera PDF', 'Vattenstämpel i PDF', 'Ta bort PDF-sidor', 'Extrahera PDF-sidor', 'OCR för PDF', 'Beskär PDF', 'Organisera PDF', 'Maskera PDF', 'Signera PDF'],
    ['slå ihop PDF-filer till ett dokument', 'extrahera valda sidor eller dela upp PDF:en i sidfiler', 'rotera alla eller valda PDF-sidor', 'lägga till ett öppningslösenord till en PDF', 'ta bort kryptering som stöds med rätt lösenord', 'skapa en PDF från bilder', 'exportera PDF-sidor som bildfiler', 'konvertera PDF-text till ett redigerbart Word-dokument', 'försöka minska PDF-filens storlek', 'lägga till text, bilder och anteckningar i en PDF-kopia', 'lägga till textvattenstämplar och sidnummer', 'ta bort valda sidor från en PDF', 'spara valda sidor som en ny PDF', 'känna igen skannad text och göra PDF:en sökbar', 'ändra PDF-sidornas synliga gränser', 'ordna om, rotera eller ta bort PDF-sidor', 'ta bort markerat sidinnehåll permanent', 'lägga till en synlig signatur på PDF-sidor']
  ],
  fi: [
    ['Yhdistä PDF', 'Jaa PDF', 'Kierrä PDF', 'Suojaa PDF', 'Avaa PDF-lukitus', 'Kuva PDF-muotoon', 'PDF kuviksi', 'PDF Wordiksi', 'Pakkaa PDF', 'Muokkaa PDF', 'PDF-vesileima', 'Poista PDF-sivuja', 'Poimi PDF-sivuja', 'PDF:n tekstintunnistus', 'Rajaa PDF', 'Järjestä PDF', 'Peitä PDF-sisältöä', 'Allekirjoita PDF'],
    ['yhdistää PDF-tiedostoja yhdeksi asiakirjaksi', 'poimia valitut sivut tai jakaa PDF sivukohtaisiksi tiedostoiksi', 'kiertää kaikki tai valitut PDF-sivut', 'lisätä PDF-tiedostoon avaus salasanan', 'poistaa tuetun salauksen oikealla salasanalla', 'luoda PDF:n kuvista', 'viedä PDF-sivut kuvatiedostoina', 'muuntaa PDF-teksti muokattavaksi Word-asiakirjaksi', 'yrittää pienentää PDF-tiedoston kokoa', 'lisätä tekstiä, kuvia ja merkintöjä PDF-kopioon', 'lisätä tekstivesileimoja ja sivunumeroita', 'poistaa valitut sivut PDF-tiedostosta', 'tallentaa valitut sivut uutena PDF-tiedostona', 'tunnistaa skannattua tekstiä ja tehdä PDF:stä haettavan', 'muuttaa PDF-sivujen näkyviä rajoja', 'järjestää, kiertää tai poistaa PDF-sivuja', 'poistaa merkityn sivusisällön pysyvästi', 'lisätä näkyvän allekirjoituksen PDF-sivuille']
  ],
  da: [
    ['Sammenlæg PDF', 'Opdel PDF', 'Rotér PDF', 'Beskyt PDF', 'Lås PDF op', 'Billede til PDF', 'PDF til billeder', 'PDF til Word', 'Komprimer PDF', 'Rediger PDF', 'Vandmærke i PDF', 'Fjern PDF-sider', 'Udtræk PDF-sider', 'OCR PDF', 'Beskær PDF', 'Organiser PDF', 'Redigér PDF-indhold', 'Underskriv PDF'],
    ['samle PDF-filer i ét dokument', 'udtrække valgte sider eller opdele en PDF i sidefiler', 'rotere alle eller valgte PDF-sider', 'tilføje en åbningsadgangskode til en PDF', 'fjerne understøttet kryptering med den korrekte adgangskode', 'oprette en PDF fra billeder', 'eksportere PDF-sider som billedfiler', 'konvertere PDF-tekst til et redigerbart Word-dokument', 'forsøge at reducere PDF-filens størrelse', 'tilføje tekst, billeder og anmærkninger til en PDF-kopi', 'tilføje tekstvandmærker og sidetal', 'fjerne valgte sider fra en PDF', 'gemme valgte sider som en ny PDF', 'genkende scannet tekst og gøre PDF’en søgbar', 'ændre de synlige sidegrænser i en PDF', 'omarrangere, rotere eller fjerne PDF-sider', 'fjerne markeret sideindhold permanent', 'tilføje en synlig underskrift på PDF-sider']
  ],
  nb: [
    ['Slå sammen PDF', 'Del PDF', 'Roter PDF', 'Beskytt PDF', 'Lås opp PDF', 'Bilde til PDF', 'PDF til bilder', 'PDF til Word', 'Komprimer PDF', 'Rediger PDF', 'Vannmerke i PDF', 'Fjern PDF-sider', 'Trekk ut PDF-sider', 'OCR PDF', 'Beskjær PDF', 'Organiser PDF', 'Sladd PDF', 'Signer PDF'],
    ['slå sammen PDF-filer til ett dokument', 'trekke ut valgte sider eller dele en PDF i sidefiler', 'rotere alle eller valgte PDF-sider', 'legge til et åpningspassord for en PDF', 'fjerne støttet kryptering med riktig passord', 'opprette en PDF fra bilder', 'eksportere PDF-sider som bildefiler', 'konvertere PDF-tekst til et redigerbart Word-dokument', 'forsøke å redusere PDF-filstørrelsen', 'legge til tekst, bilder og merknader i en PDF-kopi', 'legge til tekstvannmerker og sidetall', 'fjerne valgte sider fra en PDF', 'lagre valgte sider som en ny PDF', 'gjenkjenne skannet tekst og gjøre PDF-en søkbar', 'endre de synlige sidegrensene i en PDF', 'ordne om, rotere eller fjerne PDF-sider', 'fjerne markert sideinnhold permanent', 'legge til en synlig signatur på PDF-sider']
  ],
  tr: [
    ['PDF Birleştir', 'PDF Böl', 'PDF Döndür', 'PDF Koru', 'PDF Kilidini Aç', 'Görselden PDF’ye', 'PDF’den Görsellere', 'PDF’den Word’e', 'PDF Sıkıştır', 'PDF Düzenle', 'PDF Filigranı', 'PDF Sayfalarını Sil', 'PDF Sayfalarını Çıkar', 'PDF OCR', 'PDF Kırp', 'PDF Düzenle', 'PDF Karart', 'PDF İmzala'],
    ['PDF dosyalarını tek bir belgede birleştirmek', 'seçili sayfaları çıkarmak veya PDF’yi sayfa dosyalarına bölmek', 'tüm PDF sayfalarını veya seçilen sayfaları döndürmek', 'PDF’ye açılış parolası eklemek', 'doğru parolayla desteklenen şifrelemeyi kaldırmak', 'görsellerden PDF oluşturmak', 'PDF sayfalarını görsel dosyaları olarak dışa aktarmak', 'PDF metnini düzenlenebilir Word belgesine dönüştürmek', 'PDF dosya boyutunu küçültmeyi denemek', 'PDF kopyasına metin, görsel ve açıklama eklemek', 'metin filigranları ve sayfa numaraları eklemek', 'seçili sayfaları PDF’den kaldırmak', 'seçili sayfaları yeni PDF olarak kaydetmek', 'taranmış metni tanıyıp PDF’yi aranabilir yapmak', 'PDF sayfalarının görünür sınırlarını değiştirmek', 'PDF sayfalarını yeniden sıralamak, döndürmek veya kaldırmak', 'işaretli sayfa içeriğini kalıcı olarak kaldırmak', 'PDF sayfalarına görünür imza eklemek']
  ],
  ru: [
    ['Объединить PDF', 'Разделить PDF', 'Повернуть PDF', 'Защитить PDF', 'Разблокировать PDF', 'Изображение в PDF', 'PDF в изображения', 'PDF в Word', 'Сжать PDF', 'Редактировать PDF', 'Водяной знак PDF', 'Удалить страницы PDF', 'Извлечь страницы PDF', 'OCR PDF', 'Обрезать PDF', 'Упорядочить PDF', 'Заретушировать PDF', 'Подписать PDF'],
    ['объединить PDF-файлы в один документ', 'извлечь выбранные страницы или разделить PDF на отдельные страницы', 'повернуть все или выбранные страницы PDF', 'добавить пароль для открытия PDF', 'снять поддерживаемое шифрование с правильным паролем', 'создать PDF из изображений', 'экспортировать страницы PDF в файлы изображений', 'преобразовать текст PDF в редактируемый документ Word', 'попробовать уменьшить размер PDF-файла', 'добавить текст, изображения и пометки в копию PDF', 'добавить текстовые водяные знаки и номера страниц', 'удалить выбранные страницы из PDF', 'сохранить выбранные страницы как новый PDF', 'распознать текст скана и сделать PDF доступным для поиска', 'изменить видимые границы страниц PDF', 'изменить порядок, повернуть или удалить страницы PDF', 'безвозвратно удалить отмеченное содержимое страниц', 'добавить видимую подпись на страницы PDF']
  ],
  uk: [
    ['Об’єднати PDF', 'Розділити PDF', 'Повернути PDF', 'Захистити PDF', 'Розблокувати PDF', 'Зображення в PDF', 'PDF у зображення', 'PDF у Word', 'Стиснути PDF', 'Редагувати PDF', 'Водяний знак PDF', 'Видалити сторінки PDF', 'Витягти сторінки PDF', 'OCR PDF', 'Обрізати PDF', 'Упорядкувати PDF', 'Заретушувати PDF', 'Підписати PDF'],
    ['об’єднати PDF-файли в один документ', 'витягти вибрані сторінки або розділити PDF на окремі сторінки', 'повернути всі або вибрані сторінки PDF', 'додати пароль для відкриття PDF', 'зняти підтримуване шифрування за правильним паролем', 'створити PDF із зображень', 'експортувати сторінки PDF як файли зображень', 'перетворити текст PDF на редагований документ Word', 'спробувати зменшити розмір PDF-файлу', 'додати текст, зображення та примітки до копії PDF', 'додати текстові водяні знаки й номери сторінок', 'видалити вибрані сторінки з PDF', 'зберегти вибрані сторінки як новий PDF', 'розпізнати текст скану й зробити PDF доступним для пошуку', 'змінити видимі межі сторінок PDF', 'змінити порядок, повернути або видалити сторінки PDF', 'безповоротно видалити позначений вміст сторінок', 'додати видимий підпис на сторінки PDF']
  ],
  ar: [
    ['دمج PDF', 'تقسيم PDF', 'تدوير PDF', 'حماية PDF', 'فتح PDF', 'صورة إلى PDF', 'PDF إلى صور', 'PDF إلى Word', 'ضغط PDF', 'تحرير PDF', 'علامة مائية PDF', 'إزالة صفحات PDF', 'استخراج صفحات PDF', 'OCR PDF', 'اقتصاص PDF', 'تنظيم PDF', 'تنقيح PDF', 'توقيع PDF'],
    ['دمج ملفات PDF في مستند واحد', 'استخراج صفحات محددة أو تقسيم PDF إلى ملفات صفحات', 'تدوير كل صفحات PDF أو الصفحات المحددة', 'إضافة كلمة مرور لفتح PDF', 'إزالة التشفير المدعوم باستخدام كلمة المرور الصحيحة', 'إنشاء PDF من الصور', 'تصدير صفحات PDF كملفات صور', 'تحويل نص PDF إلى مستند Word قابل للتحرير', 'محاولة تقليل حجم ملف PDF', 'إضافة نصوص وصور وتعليقات إلى نسخة من PDF', 'إضافة علامات مائية نصية وأرقام صفحات', 'إزالة صفحات محددة من PDF', 'حفظ الصفحات المحددة كملف PDF جديد', 'التعرف على النص الممسوح ضوئيًا وجعل PDF قابلًا للبحث', 'تغيير الحدود المرئية لصفحات PDF', 'إعادة ترتيب صفحات PDF أو تدويرها أو إزالتها', 'إزالة محتوى الصفحات المحدد نهائيًا', 'إضافة توقيع مرئي إلى صفحات PDF']
  ],
  hi: [
    ['PDF जोड़ें', 'PDF विभाजित करें', 'PDF घुमाएँ', 'PDF सुरक्षित करें', 'PDF अनलॉक करें', 'छवि से PDF', 'PDF से छवियाँ', 'PDF से Word', 'PDF संपीड़ित करें', 'PDF संपादित करें', 'PDF वॉटरमार्क', 'PDF पृष्ठ हटाएँ', 'PDF पृष्ठ निकालें', 'PDF OCR', 'PDF क्रॉप करें', 'PDF व्यवस्थित करें', 'PDF से सामग्री हटाएँ', 'PDF पर हस्ताक्षर करें'],
    ['PDF फ़ाइलों को एक दस्तावेज़ में जोड़ना', 'चुने हुए पृष्ठ निकालना या PDF को अलग-अलग पृष्ठ फ़ाइलों में बाँटना', 'सभी या चुने हुए PDF पृष्ठ घुमाना', 'PDF खोलने के लिए पासवर्ड जोड़ना', 'सही पासवर्ड से समर्थित एन्क्रिप्शन हटाना', 'छवियों से PDF बनाना', 'PDF पृष्ठों को छवि फ़ाइलों के रूप में निर्यात करना', 'PDF टेक्स्ट को संपादन योग्य Word दस्तावेज़ में बदलना', 'PDF फ़ाइल का आकार घटाने का प्रयास करना', 'PDF की प्रति में टेक्स्ट, छवियाँ और टिप्पणियाँ जोड़ना', 'टेक्स्ट वॉटरमार्क और पृष्ठ संख्या जोड़ना', 'PDF से चुने हुए पृष्ठ हटाना', 'चुने हुए पृष्ठों को नई PDF के रूप में सहेजना', 'स्कैन किए गए टेक्स्ट को पहचानकर PDF को खोज योग्य बनाना', 'PDF पृष्ठों की दिखने वाली सीमाएँ बदलना', 'PDF पृष्ठों का क्रम बदलना, घुमाना या हटाना', 'चिह्नित पृष्ठ सामग्री को स्थायी रूप से हटाना', 'PDF पृष्ठों पर दिखाई देने वाला हस्ताक्षर जोड़ना']
  ],
  ja: [
    ['PDFを結合', 'PDFを分割', 'PDFを回転', 'PDFを保護', 'PDFのロック解除', '画像からPDF', 'PDFを画像に変換', 'PDFをWordに変換', 'PDFを圧縮', 'PDFを編集', 'PDFの透かし', 'PDFページを削除', 'PDFページを抽出', 'PDFのOCR', 'PDFをトリミング', 'PDFを整理', 'PDFを墨消し', 'PDFに署名'],
    ['複数のPDFファイルを1つの文書にまとめる', '選択したページを抽出するかPDFをページごとのファイルに分割する', 'すべてまたは選択したPDFページを回転する', 'PDFを開くためのパスワードを追加する', '正しいパスワードで対応する暗号化を解除する', '画像からPDFを作成する', 'PDFページを画像ファイルとして書き出す', 'PDFテキストを編集可能なWord文書に変換する', 'PDFファイルサイズの縮小を試みる', 'PDFのコピーにテキスト、画像、注釈を追加する', 'テキストの透かしとページ番号を追加する', '選択したPDFページを削除する', '選択したページを新しいPDFとして保存する', 'スキャン文字を認識してPDFを検索可能にする', 'PDFページの表示範囲を変更する', 'PDFページの順序変更、回転、削除を行う', '指定範囲のページ内容を完全に削除する', 'PDFページに見える署名を追加する']
  ],
  ko: [
    ['PDF 병합', 'PDF 분할', 'PDF 회전', 'PDF 보호', 'PDF 잠금 해제', '이미지를 PDF로', 'PDF를 이미지로', 'PDF를 Word로', 'PDF 압축', 'PDF 편집', 'PDF 워터마크', 'PDF 페이지 삭제', 'PDF 페이지 추출', 'PDF OCR', 'PDF 자르기', 'PDF 정리', 'PDF 내용 가리기', 'PDF 서명'],
    ['PDF 파일을 하나의 문서로 합치기', '선택한 페이지를 추출하거나 PDF를 페이지별 파일로 분할하기', '모든 PDF 페이지 또는 선택한 페이지 회전하기', 'PDF에 열기 암호 추가하기', '올바른 암호로 지원되는 암호화 제거하기', '이미지로 PDF 만들기', 'PDF 페이지를 이미지 파일로 내보내기', 'PDF 텍스트를 편집 가능한 Word 문서로 변환하기', 'PDF 파일 크기 줄이기 시도하기', 'PDF 사본에 텍스트, 이미지, 주석 추가하기', '텍스트 워터마크와 페이지 번호 추가하기', '선택한 PDF 페이지 제거하기', '선택한 페이지를 새 PDF로 저장하기', '스캔된 텍스트를 인식해 PDF를 검색 가능하게 만들기', 'PDF 페이지의 표시 경계 변경하기', 'PDF 페이지 순서 변경, 회전 또는 제거하기', '표시한 페이지 콘텐츠를 영구적으로 제거하기', 'PDF 페이지에 보이는 서명 추가하기']
  ],
  'zh-CN': [
    ['合并 PDF', '拆分 PDF', '旋转 PDF', '保护 PDF', '解锁 PDF', '图片转 PDF', 'PDF 转图片', 'PDF 转 Word', '压缩 PDF', '编辑 PDF', 'PDF 水印', '删除 PDF 页面', '提取 PDF 页面', 'PDF OCR', '裁剪 PDF', '整理 PDF', '涂黑 PDF 内容', '签署 PDF'],
    ['将多个 PDF 文件合并为一个文档', '提取所选页面或将 PDF 拆分为单页文件', '旋转所有或选定的 PDF 页面', '为 PDF 添加打开密码', '使用正确密码移除受支持的加密', '根据图片创建 PDF', '将 PDF 页面导出为图片文件', '将 PDF 文本转换为可编辑的 Word 文档', '尝试减小 PDF 文件大小', '向 PDF 副本添加文本、图片和批注', '添加文本水印和页码', '从 PDF 中删除所选页面', '将所选页面另存为新的 PDF', '识别扫描文本并使 PDF 可搜索', '更改 PDF 页面的可见边界', '重新排序、旋转或删除 PDF 页面', '永久移除标记的页面内容', '向 PDF 页面添加可见签名']
  ]
};

const toolCopyOverrides = {
  en: {
    split: { name: 'Split / Extract PDF', action: 'extract selected pages into one PDF, split every page, or divide pages into balanced sections' },
    word: { name: 'PDF ↔ Word', action: 'convert PDF text to editable Word documents or render DOCX files as image-based PDFs' }
  },
  es: {
    split: { name: 'Dividir / extraer PDF', action: 'extraer páginas seleccionadas en un PDF, dividir cada página o agrupar páginas en secciones equilibradas' },
    word: { name: 'PDF ↔ Word', action: 'convertir texto PDF en documentos Word editables o crear PDF basados en imágenes desde archivos DOCX' }
  },
  fr: {
    split: { name: 'Diviser / extraire PDF', action: 'extraire des pages choisies dans un PDF, séparer chaque page ou répartir les pages en sections équilibrées' },
    word: { name: 'PDF ↔ Word', action: 'convertir le texte PDF en documents Word modifiables ou créer des PDF image à partir de fichiers DOCX' }
  },
  de: {
    split: { name: 'PDF teilen / extrahieren', action: 'ausgewählte Seiten in ein PDF extrahieren, jede Seite einzeln teilen oder Seiten gleichmäßig gruppieren' },
    word: { name: 'PDF ↔ Word', action: 'PDF-Text in bearbeitbare Word-Dokumente umwandeln oder aus DOCX-Dateien bildbasierte PDFs erstellen' }
  },
  pt: {
    split: { name: 'Dividir / extrair PDF', action: 'extrair páginas selecionadas para um PDF, separar cada página ou agrupar páginas em partes equilibradas' },
    word: { name: 'PDF ↔ Word', action: 'converter texto de PDF em documentos Word editáveis ou criar PDFs em imagem a partir de arquivos DOCX' }
  },
  it: {
    split: { name: 'Dividi / estrai PDF', action: 'estrarre le pagine selezionate in un PDF, separare ogni pagina o dividere le pagine in sezioni bilanciate' },
    word: { name: 'PDF ↔ Word', action: 'convertire il testo PDF in documenti Word modificabili o creare PDF immagine da file DOCX' }
  },
  nl: {
    split: { name: 'PDF splitsen / extraheren', action: 'geselecteerde pagina’s in één PDF extraheren, elke pagina splitsen of pagina’s in evenwichtige delen verdelen' },
    word: { name: 'PDF ↔ Word', action: 'PDF-tekst omzetten naar bewerkbare Word-documenten of afbeeldings-PDF’s maken van DOCX-bestanden' }
  },
  pl: {
    split: { name: 'Podziel / wyodrębnij PDF', action: 'wyodrębnić wybrane strony do jednego pliku PDF, podzielić każdą stronę lub utworzyć równe części' },
    word: { name: 'PDF ↔ Word', action: 'konwertować tekst PDF na edytowalne dokumenty Word lub tworzyć obrazowe pliki PDF z DOCX' }
  },
  sv: {
    split: { name: 'Dela / extrahera PDF', action: 'extrahera valda sidor till en PDF, dela varje sida eller dela upp sidor i jämna avsnitt' },
    word: { name: 'PDF ↔ Word', action: 'konvertera PDF-text till redigerbara Word-dokument eller skapa bildbaserade PDF-filer från DOCX' }
  },
  fi: {
    split: { name: 'Jaa / poimi PDF-sivuja', action: 'poimia valitut sivut yhteen PDF-tiedostoon, jakaa jokainen sivu tai jakaa sivut tasaisiin osiin' },
    word: { name: 'PDF ↔ Word', action: 'muuntaa PDF-teksti muokattaviksi Word-asiakirjoiksi tai luoda kuvapohjaisia PDF-tiedostoja DOCX-tiedostoista' }
  },
  da: {
    split: { name: 'Opdel / udtræk PDF', action: 'udtrække valgte sider til én PDF, opdele hver side eller dele siderne i jævne sektioner' },
    word: { name: 'PDF ↔ Word', action: 'konvertere PDF-tekst til redigerbare Word-dokumenter eller oprette billedbaserede PDF’er fra DOCX-filer' }
  },
  nb: {
    split: { name: 'Del / trekk ut PDF', action: 'trekke valgte sider ut i én PDF, dele hver side eller fordele sidene i jevne deler' },
    word: { name: 'PDF ↔ Word', action: 'konvertere PDF-tekst til redigerbare Word-dokumenter eller lage bildebassert PDF fra DOCX-filer' }
  },
  tr: {
    split: { name: 'PDF böl / çıkar', action: 'seçili sayfaları tek PDF’de çıkarmak, her sayfayı ayrı bölmek veya sayfaları dengeli bölümlere ayırmak' },
    word: { name: 'PDF ↔ Word', action: 'PDF metnini düzenlenebilir Word belgelerine dönüştürmek veya DOCX dosyalarından görüntü tabanlı PDF oluşturmak' }
  },
  ru: {
    split: { name: 'Разделить / извлечь PDF', action: 'извлечь выбранные страницы в один PDF, разделить каждую страницу или распределить страницы по равным частям' },
    word: { name: 'PDF ↔ Word', action: 'преобразовать текст PDF в редактируемые документы Word или создать PDF из изображений страниц DOCX' }
  },
  uk: {
    split: { name: 'Розділити / витягти PDF', action: 'витягти вибрані сторінки в один PDF, розділити кожну сторінку або згрупувати сторінки в рівні частини' },
    word: { name: 'PDF ↔ Word', action: 'перетворити текст PDF на редаговані документи Word або створити PDF із зображень сторінок DOCX' }
  },
  ar: {
    split: { name: 'تقسيم / استخراج PDF', action: 'استخراج الصفحات المحددة في ملف PDF واحد أو تقسيم كل صفحة أو توزيع الصفحات على أقسام متوازنة' },
    word: { name: 'PDF ↔ Word', action: 'تحويل نص PDF إلى مستندات Word قابلة للتحرير أو إنشاء ملفات PDF مصورة من ملفات DOCX' }
  },
  hi: {
    split: { name: 'PDF विभाजित / पृष्ठ निकालें', action: 'चुने हुए पृष्ठों को एक PDF में निकालें, हर पृष्ठ अलग करें या पृष्ठों को संतुलित भागों में बाँटें' },
    word: { name: 'PDF ↔ Word', action: 'PDF पाठ को संपादन योग्य Word दस्तावेज़ों में बदलें या DOCX से चित्र-आधारित PDF बनाएँ' }
  },
  ja: {
    split: { name: 'PDF の分割 / 抽出', action: '選択したページを 1 つの PDF に抽出する、各ページを個別に分割する、またはページを均等なセクションに分ける' },
    word: { name: 'PDF ↔ Word', action: 'PDF のテキストを編集可能な Word 文書に変換する、または DOCX から画像ベースの PDF を作成する' }
  },
  ko: {
    split: { name: 'PDF 분할 / 추출', action: '선택한 페이지를 하나의 PDF로 추출하거나 각 페이지를 분할하거나 페이지를 균형 잡힌 구간으로 나누기' },
    word: { name: 'PDF ↔ Word', action: 'PDF 텍스트를 편집 가능한 Word 문서로 변환하거나 DOCX에서 이미지 기반 PDF 만들기' }
  },
  'zh-CN': {
    split: { name: '拆分 / 提取 PDF', action: '将选定页面提取为一个 PDF、逐页拆分，或将页面均衡分组' },
    word: { name: 'PDF ↔ Word', action: '将 PDF 文本转换为可编辑的 Word 文档，或将 DOCX 页面渲染为图片并创建 PDF' }
  }
};

const descriptionPrefixes = {
  en: 'Use this tool to ',
  es: 'Usa esta herramienta para ',
  fr: 'Utilisez cet outil pour ',
  de: 'Mit diesem Tool kannst du ',
  pt: 'Use esta ferramenta para ',
  it: 'Usa questo strumento per ',
  nl: 'Gebruik deze tool om ',
  pl: 'Użyj tego narzędzia, aby ',
  sv: 'Använd verktyget för att ',
  fi: 'Tällä työkalulla voit ',
  da: 'Brug værktøjet til at ',
  nb: 'Bruk verktøyet til å ',
  tr: 'Bu aracı kullanarak ',
  ru: 'Используйте этот инструмент, чтобы ',
  uk: 'Скористайтеся цим інструментом, щоб ',
  ar: 'استخدم هذه الأداة لـ',
  hi: 'इस टूल से ',
  ja: 'このツールで',
  ko: '이 도구로 ',
  'zh-CN': '使用此工具'
};

export const TOOL_TRANSLATIONS = Object.fromEntries(
  Object.entries(translations).map(([language, [names, actions]]) => [
    language,
    Object.fromEntries(toolIds.map((id, index) => {
      const override = toolCopyOverrides[language]?.[id];
      return [
        id,
        {
          name: override?.name || names[index],
          description: `${descriptionPrefixes[language]}${override?.action || actions[index]}${language === 'ja' || language === 'zh-CN' ? '' : language === 'ar' ? '' : '.'}`
        }
      ];
    }))
  ])
);

const powerpointToolTranslations = {
  en: ['PDF ↔ PowerPoint', 'convert selected PDF pages into image-based PowerPoint slides, or selected PowerPoint slides into a PDF'],
  es: ['PDF ↔ PowerPoint', 'convertir páginas PDF seleccionadas en diapositivas de PowerPoint como imágenes, o diapositivas seleccionadas de PowerPoint en PDF'],
  fr: ['PDF ↔ PowerPoint', 'convertir des pages PDF choisies en diapositives PowerPoint sous forme d’images, ou des diapositives choisies en PDF'],
  de: ['PDF ↔ PowerPoint', 'ausgewählte PDF-Seiten in bildbasierte PowerPoint-Folien oder ausgewählte Folien in ein PDF umwandeln'],
  pt: ['PDF ↔ PowerPoint', 'converter páginas PDF selecionadas em slides do PowerPoint como imagens ou slides selecionados em PDF'],
  it: ['PDF ↔ PowerPoint', 'convertire le pagine PDF selezionate in diapositive PowerPoint come immagini o le diapositive selezionate in PDF'],
  nl: ['PDF ↔ PowerPoint', 'geselecteerde PDF-pagina’s omzetten naar PowerPoint-dia’s als afbeeldingen of geselecteerde dia’s naar PDF'],
  pl: ['PDF ↔ PowerPoint', 'konwertować wybrane strony PDF na slajdy PowerPoint jako obrazy lub wybrane slajdy do PDF'],
  sv: ['PDF ↔ PowerPoint', 'konvertera valda PDF-sidor till PowerPoint-bilder eller valda bilder till PDF'],
  fi: ['PDF ↔ PowerPoint', 'muuntaa valitut PDF-sivut PowerPoint-dioiksi kuvina tai valitut diat PDF-tiedostoksi'],
  da: ['PDF ↔ PowerPoint', 'konvertere valgte PDF-sider til PowerPoint-slides som billeder eller valgte slides til PDF'],
  nb: ['PDF ↔ PowerPoint', 'konvertere valgte PDF-sider til PowerPoint-lysbilder som bilder eller valgte lysbilder til PDF'],
  tr: ['PDF ↔ PowerPoint', 'seçilen PDF sayfalarını resim tabanlı PowerPoint slaytlarına veya seçilen slaytları PDF’ye dönüştürme'],
  ru: ['PDF ↔ PowerPoint', 'преобразовать выбранные страницы PDF в слайды PowerPoint-изображения или выбранные слайды в PDF'],
  uk: ['PDF ↔ PowerPoint', 'перетворити вибрані сторінки PDF на слайди PowerPoint-зображення або вибрані слайди на PDF'],
  ar: ['PDF ↔ PowerPoint', 'تحويل صفحات PDF المحددة إلى شرائح PowerPoint كصور أو تحويل الشرائح المحددة إلى PDF'],
  hi: ['PDF ↔ PowerPoint', 'चुने हुए PDF पेज को इमेज-आधारित PowerPoint स्लाइड या चुनी हुई स्लाइड को PDF में बदलें'],
  ja: ['PDF ↔ PowerPoint', '選択した PDF ページを画像形式の PowerPoint スライドに、選択したスライドを PDF に変換'],
  ko: ['PDF ↔ PowerPoint', '선택한 PDF 페이지를 이미지 기반 PowerPoint 슬라이드로, 선택한 슬라이드를 PDF로 변환'],
  'zh-CN': ['PDF ↔ PowerPoint', '将选定的 PDF 页面转换为图片型 PowerPoint 幻灯片，或将选定的幻灯片转换为 PDF']
};

for (const [language, [name, description]] of Object.entries(powerpointToolTranslations)) {
  TOOL_TRANSLATIONS[language].powerpoint = { name, description };
}

const markdownToolTranslations = {
  en: ['PDF ↔ Markdown', 'extract selectable PDF text as Markdown or create a PDF from Markdown content'],
  es: ['PDF ↔ Markdown', 'extraer texto seleccionable de un PDF como Markdown o crear un PDF a partir de Markdown'],
  fr: ['PDF ↔ Markdown', 'extraire le texte sélectionnable d’un PDF en Markdown ou créer un PDF à partir de Markdown'],
  de: ['PDF ↔ Markdown', 'auswählbaren PDF-Text als Markdown extrahieren oder ein PDF aus Markdown erstellen'],
  pt: ['PDF ↔ Markdown', 'extrair texto selecionável de um PDF como Markdown ou criar um PDF a partir de Markdown'],
  it: ['PDF ↔ Markdown', 'estrarre il testo selezionabile di un PDF come Markdown o creare un PDF dal Markdown'],
  nl: ['PDF ↔ Markdown', 'selecteerbare PDF-tekst extraheren als Markdown of een PDF maken van Markdown'],
  pl: ['PDF ↔ Markdown', 'wyodrębniać zaznaczalny tekst PDF jako Markdown lub tworzyć PDF z Markdown'],
  sv: ['PDF ↔ Markdown', 'extrahera markerbar PDF-text som Markdown eller skapa en PDF från Markdown'],
  fi: ['PDF ↔ Markdown', 'poimia valittava PDF-teksti Markdown-muotoon tai luoda PDF Markdown-sisällöstä'],
  da: ['PDF ↔ Markdown', 'udtrække markerbar PDF-tekst som Markdown eller oprette en PDF fra Markdown'],
  nb: ['PDF ↔ Markdown', 'trekke ut markerbar PDF-tekst som Markdown eller lage en PDF fra Markdown'],
  tr: ['PDF ↔ Markdown', 'seçilebilir PDF metnini Markdown olarak çıkarma veya Markdown içeriğinden PDF oluşturma'],
  ru: ['PDF ↔ Markdown', 'извлечь выделяемый текст PDF в Markdown или создать PDF из Markdown'],
  uk: ['PDF ↔ Markdown', 'витягти виділюваний текст PDF у Markdown або створити PDF із Markdown'],
  ar: ['PDF ↔ Markdown', 'استخراج نص PDF القابل للتحديد بصيغة Markdown أو إنشاء PDF من محتوى Markdown'],
  hi: ['PDF ↔ Markdown', 'चयन योग्य PDF टेक्स्ट को Markdown के रूप में निकालें या Markdown से PDF बनाएँ'],
  ja: ['PDF ↔ Markdown', '選択可能な PDF テキストを Markdown として抽出、または Markdown から PDF を作成'],
  ko: ['PDF ↔ Markdown', '선택 가능한 PDF 텍스트를 Markdown으로 추출하거나 Markdown에서 PDF 만들기'],
  'zh-CN': ['PDF ↔ Markdown', '将可选择的 PDF 文本提取为 Markdown，或根据 Markdown 创建 PDF']
};

for (const [language, [name, description]] of Object.entries(markdownToolTranslations)) {
  TOOL_TRANSLATIONS[language].markdown = { name, description };
}

const imagePdfToolNames = {
  en: 'Images ↔ PDF',
  es: 'Imágenes ↔ PDF',
  fr: 'Images ↔ PDF',
  de: 'Bilder ↔ PDF',
  pt: 'Imagens ↔ PDF',
  it: 'Immagini ↔ PDF',
  nl: 'Afbeeldingen ↔ PDF',
  pl: 'Obrazy ↔ PDF',
  sv: 'Bilder ↔ PDF',
  fi: 'Kuvat ↔ PDF',
  da: 'Billeder ↔ PDF',
  nb: 'Bilder ↔ PDF',
  tr: 'Görseller ↔ PDF',
  ru: 'Изображения ↔ PDF',
  uk: 'Зображення ↔ PDF',
  ar: 'صور ↔ PDF',
  hi: 'छवियाँ ↔ PDF',
  ja: '画像 ↔ PDF',
  ko: '이미지 ↔ PDF',
  'zh-CN': '图像 ↔ PDF'
};

const imagePdfToolDescriptions = {
  en: 'Create a PDF from images or export PDF pages as image files.',
  es: 'Crea un PDF a partir de imágenes o exporta páginas PDF como archivos de imagen.',
  fr: 'Créez un PDF à partir d’images ou exportez les pages PDF en fichiers image.',
  de: 'Erstelle ein PDF aus Bildern oder exportiere PDF-Seiten als Bilddateien.',
  pt: 'Crie um PDF a partir de imagens ou exporte páginas de PDF como arquivos de imagem.',
  it: 'Crea PDF da immagini o esporta le pagine PDF come file immagine.',
  nl: 'Maak een PDF van afbeeldingen of exporteer PDF-pagina’s als afbeeldingsbestanden.',
  pl: 'Twórz pliki PDF z obrazów lub eksportuj strony PDF jako pliki graficzne.',
  sv: 'Skapa PDF-filer från bilder eller exportera PDF-sidor som bildfiler.',
  fi: 'Luo PDF kuvista tai vie PDF-sivut kuvatiedostoina.',
  da: 'Opret en PDF fra billeder, eller eksportér PDF-sider som billedfiler.',
  nb: 'Opprett PDF fra bilder eller eksporter PDF-sider som bildefiler.',
  tr: 'Görsellerden PDF oluşturun veya PDF sayfalarını görsel dosyaları olarak dışa aktarın.',
  ru: 'Создавайте PDF из изображений или экспортируйте страницы PDF в файлы изображений.',
  uk: 'Створюйте PDF із зображень або експортуйте сторінки PDF як файли зображень.',
  ar: 'أنشئ ملف PDF من الصور أو صدّر صفحات PDF كملفات صور.',
  hi: 'छवियों से PDF बनाएँ या PDF पृष्ठों को छवि फ़ाइलों के रूप में निर्यात करें।',
  ja: '画像からPDFを作成、またはPDFページを画像ファイルとして書き出します。',
  ko: '이미지로 PDF를 만들거나 PDF 페이지를 이미지 파일로 내보냅니다.',
  'zh-CN': '从图像创建 PDF，或将 PDF 页面导出为图像文件。'
};

for (const [language, name] of Object.entries(imagePdfToolNames)) {
  TOOL_TRANSLATIONS[language]['image-pdf'] = {
    name,
    description: imagePdfToolDescriptions[language]
  };
}

export const getLocalizedTool = (language, tool) => {
  const translation = TOOL_TRANSLATIONS[language]?.[tool.id];
  return translation ? { ...tool, ...translation } : tool;
};
