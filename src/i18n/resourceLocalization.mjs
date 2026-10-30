import { SUPPORTED_LANGUAGES } from './languageCatalog.mjs';

const localizedUi = {
  es: ['Guías y recursos PDF', 'Explicaciones breves y prácticas sobre flujos de trabajo PDF, calidad de salida y procesamiento en el navegador.', 'Leer guía', 'Volver a todos los recursos'],
  fr: ['Guides et ressources PDF', 'Explications pratiques sur les flux PDF, la qualité des résultats et le traitement dans le navigateur.', 'Lire le guide', 'Retour à toutes les ressources'],
  de: ['PDF-Anleitungen und Ressourcen', 'Kurze, praktische Erklärungen zu PDF-Abläufen, Ausgabequalität und Verarbeitung im Browser.', 'Anleitung lesen', 'Zurück zu allen Ressourcen'],
  pt: ['Guias e recursos de PDF', 'Explicações práticas sobre fluxos de PDF, qualidade de saída e processamento no navegador.', 'Ler guia', 'Voltar a todos os recursos'],
  it: ['Guide e risorse PDF', 'Spiegazioni pratiche sui flussi PDF, sulla qualità dei risultati e sull’elaborazione nel browser.', 'Leggi la guida', 'Torna a tutte le risorse'],
  nl: ['PDF-gidsen en informatie', 'Korte, praktische uitleg over PDF-processen, uitvoerkwaliteit en verwerking in de browser.', 'Gids lezen', 'Terug naar alle bronnen'],
  pl: ['Poradniki i materiały PDF', 'Krótkie, praktyczne objaśnienia procesów PDF, jakości wyników i przetwarzania w przeglądarce.', 'Przeczytaj poradnik', 'Wróć do wszystkich materiałów'],
  sv: ['PDF-guider och resurser', 'Korta, praktiska förklaringar av PDF-arbetsflöden, resultatkvalitet och bearbetning i webbläsaren.', 'Läs guiden', 'Tillbaka till alla resurser'],
  fi: ['PDF-oppaat ja aineistot', 'Lyhyitä käytännönläheisiä selityksiä PDF-työnkuluista, tulosteen laadusta ja käsittelystä selaimessa.', 'Lue opas', 'Takaisin kaikkiin aineistoihin'],
  da: ['PDF-vejledninger og ressourcer', 'Korte, praktiske forklaringer på PDF-arbejdsgange, resultatkvalitet og behandling i browseren.', 'Læs vejledningen', 'Tilbage til alle ressourcer'],
  nb: ['PDF-veiledninger og ressurser', 'Korte, praktiske forklaringer på PDF-arbeidsflyter, resultatkvalitet og behandling i nettleseren.', 'Les veiledningen', 'Tilbake til alle ressurser'],
  tr: ['PDF kılavuzları ve kaynakları', 'PDF iş akışları, çıktı kalitesi ve tarayıcıda işleme hakkında kısa, pratik açıklamalar.', 'Kılavuzu oku', 'Tüm kaynaklara dön'],
  ru: ['Руководства и материалы по PDF', 'Краткие практические объяснения процессов PDF, качества результатов и обработки в браузере.', 'Читать руководство', 'Назад ко всем материалам'],
  uk: ['Посібники та матеріали PDF', 'Короткі практичні пояснення робочих процесів PDF, якості результатів і обробки у браузері.', 'Читати посібник', 'Назад до всіх матеріалів'],
  ar: ['أدلة وموارد PDF', 'شروحات عملية وموجزة حول سير عمل PDF وجودة النتائج والمعالجة في المتصفح.', 'اقرأ الدليل', 'العودة إلى جميع الموارد'],
  hi: ['PDF मार्गदर्शिकाएँ और संसाधन', 'PDF कार्यप्रवाह, परिणाम की गुणवत्ता और ब्राउज़र में प्रसंस्करण के बारे में संक्षिप्त व्यावहारिक जानकारी।', 'मार्गदर्शिका पढ़ें', 'सभी संसाधनों पर वापस जाएँ'],
  ja: ['PDFガイドとリソース', 'PDFのワークフロー、出力品質、ブラウザー内処理についての簡潔で実用的な説明です。', 'ガイドを読む', 'すべてのリソースに戻る'],
  ko: ['PDF 가이드 및 자료', 'PDF 작업 흐름, 출력 품질, 브라우저 처리에 관한 간결하고 실용적인 설명입니다.', '가이드 읽기', '모든 자료로 돌아가기'],
  'zh-CN': ['PDF 指南与资源', '简要实用地介绍 PDF 工作流程、输出质量和浏览器处理。', '阅读指南', '返回所有资源']
};

const articleTranslations = {
  es: [
    ['Qué puede y qué no puede hacer la compresión PDF', 'Conoce la compresión de PDF, los archivos con muchas imágenes y las diferencias de calidad.', [
      ['Por qué un PDF puede ser compacto', 'Los PDF pueden contener imágenes y fuentes ya comprimidas. Reorganizar la estructura ahorra poco si la mayoría del archivo son imágenes comprimidas.'],
      ['Optimización estándar y rasterización', 'La reescritura estructural puede reorganizar objetos sin convertir las páginas en imágenes y suele conservar el texto seleccionable, aunque quizá no reduzca el tamaño. Rasterizar y volver a codificar como JPEG puede reducirlo, pero elimina la búsqueda y selección de texto, reduce la nitidez vectorial y afecta a los formularios interactivos.'],
      ['Comprueba el resultado, no solo el nombre', 'Compara los tamaños y revisa páginas importantes con zoom normal y alto. Conserva el original hasta que la calidad sea aceptable. [Comprimir PDF](/compress) no ofrece un resultado más grande como compresión.']
    ]],
    ['Qué significa el procesamiento local de PDF', 'Descubre qué protege el procesamiento de PDF en el navegador y cuáles son sus límites.', [
      ['El documento seleccionado', 'Una biblioteca PDF del navegador puede leer un archivo elegido y crear otro sin subir el PDF a un servidor de conversión. Esto describe el procesamiento del documento, no todas las solicitudes del sitio.'],
      ['Solicitudes del sitio y sus recursos', 'El navegador solicita las páginas y los recursos del sitio, incluidos los recursos OCR de Tesseract.js incluidos localmente para PDF a Word y OCR PDF. El proveedor de alojamiento puede conservar registros de solicitudes según sus políticas.'],
      ['Considera toda la información antes de decidir', 'No introduzcas contenido sensible si el procesamiento o el alojamiento no se ajustan a tus necesidades. Consulta la [Política de privacidad](/privacy) para conocer la implementación y los datos pendientes.']
    ]],
    ['Convertir PDF escaneados a Word', 'Conoce el OCR, la calidad de los escaneos y los límites de diseño al convertir PDF.', [
      ['Los PDF con texto y los escaneados son distintos', 'Un PDF con capa de texto permite seleccionar caracteres. Un escaneo puede contener solo imágenes, por lo que el conversor debe reconocer los caracteres mediante OCR.'],
      ['La calidad del OCR depende del escaneo', 'La resolución, inclinación, contraste, idioma, escritura a mano y daños pueden afectar al reconocimiento. Para páginas sin texto legible, la herramienta usa OCR en inglés; revisa el documento Word para detectar errores u omisiones.'],
      ['Revisa el diseño', 'El conversor reconstruye posiciones de texto y filas sencillas, pero no reproduce perfectamente todos los diseños. Es posible que debas corregir columnas, tablas y formularios. Consulta la herramienta [PDF a Word](/pdf-to-word).']
    ]]
  ],
  fr: [
    ['Ce que la compression PDF peut et ne peut pas faire', 'Comprenez la compression PDF, les fichiers riches en images et les compromis de qualité.', [
      ['Pourquoi un PDF peut déjà être compact', 'Les PDF peuvent contenir des images et des polices déjà compressées. Réorganiser la structure apporte peu si la plupart des données sont des images compressées.'],
      ['Optimisation standard et pixellisation', 'Une réécriture structurelle peut réorganiser les objets sans convertir chaque page en image et conserve généralement le texte sélectionnable, sans garantir une réduction. La pixellisation et le réencodage JPEG peuvent réduire la taille, mais suppriment la recherche et la sélection du texte, diminuent la netteté vectorielle et affectent les formulaires interactifs.'],
      ['Vérifiez le résultat, pas son intitulé', 'Comparez les tailles et examinez les pages importantes à différents niveaux de zoom. Gardez l’original jusqu’à ce que la qualité vous convienne. [Compresser PDF](/compress) ne propose pas un résultat plus volumineux comme compression.']
    ]],
    ['Que signifie le traitement local des PDF', 'Découvrez ce que protège le traitement PDF dans le navigateur et ses limites.', [
      ['Le document sélectionné', 'Une bibliothèque PDF du navigateur peut lire un fichier choisi et en créer un nouveau sans envoyer le PDF à un serveur de conversion. Cela décrit le traitement du document, pas toutes les requêtes du site.'],
      ['Requêtes du site et de ses ressources', 'Le navigateur demande les pages et ressources du site, notamment les ressources OCR Tesseract.js intégrées pour PDF vers Word et OCR PDF. L’hébergeur peut conserver des journaux selon ses propres règles.'],
      ['Prenez votre décision avec toutes les informations', 'N’entrez pas de contenu sensible si le traitement ou l’hébergement ne vous convient pas. Consultez la [Politique de confidentialité](/privacy) pour connaître l’implémentation et les informations encore manquantes.']
    ]],
    ['Convertir des PDF numérisés en Word', 'Comprenez l’OCR, la qualité des scans et les limites de mise en page lors de la conversion.', [
      ['Les PDF textuels et numérisés sont différents', 'Un PDF avec une couche de texte expose des caractères sélectionnables. Un scan peut ne contenir que des images ; le convertisseur doit alors reconnaître les caractères par OCR.'],
      ['La qualité de l’OCR dépend du scan', 'La résolution, l’inclinaison, le contraste, la langue, l’écriture manuscrite et les dommages influent sur la reconnaissance. Pour les pages sans texte lisible, l’outil utilise l’OCR anglais ; vérifiez les omissions et erreurs dans le document Word.'],
      ['Vérifiez la mise en page', 'Le convertisseur reconstruit les positions du texte et les lignes simples, sans reproduire parfaitement chaque mise en page. Les colonnes, tableaux et formulaires peuvent nécessiter des corrections. Consultez [PDF vers Word](/pdf-to-word).']
    ]]
  ],
  de: [
    ['Was PDF-Komprimierung kann und was nicht', 'Erfahre mehr über PDF-Komprimierung, bildlastige Dateien und Qualitätsverluste.', [
      ['Warum ein PDF bereits kompakt sein kann', 'PDFs können bereits komprimierte Bilder und Schriftarten enthalten. Eine Neuordnung spart wenig, wenn der Großteil aus komprimierten Bildern besteht.'],
      ['Standardoptimierung und Rasterung', 'Eine strukturelle Überarbeitung kann PDF-Objekte neu ordnen, ohne Seiten in Bilder umzuwandeln, und erhält meist auswählbaren Text; eine kleinere Datei ist trotzdem nicht garantiert. Rasterung mit JPEG-Neukodierung kann die Größe senken, entfernt aber Textsuche und -auswahl, verringert die Vektorschärfe und beeinträchtigt interaktive Formulare.'],
      ['Prüfe das Ergebnis, nicht die Bezeichnung', 'Vergleiche die Dateigrößen und prüfe wichtige Seiten bei normaler und hoher Vergrößerung. Behalte das Original, bis die Qualität stimmt. [PDF komprimieren](/compress) bietet keine größere Datei als Komprimierungsergebnis an.']
    ]],
    ['Was lokale PDF-Verarbeitung bedeutet', 'Erfahre, was die PDF-Verarbeitung im Browser schützt und was nicht.', [
      ['Das ausgewählte Dokument', 'Eine PDF-Bibliothek im Browser kann eine ausgewählte Datei lesen und eine neue erstellen, ohne das PDF an einen Konvertierungsserver zu senden. Das beschreibt die Dokumentverarbeitung, nicht alle Website-Anfragen.'],
      ['Website- und Ressourcenanfragen', 'Der Browser lädt Website-Seiten und Ressourcen, darunter lokal gebündelte Tesseract.js-OCR-Dateien für PDF zu Word und OCR PDF. Hosting-Anbieter können Anfragen gemäß ihren Richtlinien protokollieren.'],
      ['Triff deine Datenschutzentscheidung vollständig informiert', 'Gib keine sensiblen Inhalte ein, wenn Verarbeitung oder Hosting nicht deinen Anforderungen entsprechen. In der [Datenschutzerklärung](/privacy) stehen Implementierungsdetails und noch offene Angaben.']
    ]],
    ['Gescannte PDFs in Word umwandeln', 'Erfahre mehr über OCR, Scanqualität und Layoutgrenzen bei der PDF-Konvertierung.', [
      ['Text-PDFs und Scans unterscheiden sich', 'Ein PDF mit Textebene enthält auswählbare Zeichen. Ein Scan kann nur Seitenbilder enthalten; der Konverter muss Zeichen dann per OCR erkennen.'],
      ['Die OCR-Qualität hängt vom Scan ab', 'Auflösung, Schräglage, Kontrast, Sprache, Handschrift und Beschädigungen beeinflussen die Erkennung. Für Seiten ohne lesbaren Text verwendet das Tool englische OCR. Prüfe das Word-Dokument auf Fehler und fehlende Inhalte.'],
      ['Das Layout muss geprüft werden', 'Der Konverter rekonstruiert Textpositionen und einfache Zeilen, aber nicht jedes Layout exakt. Spalten, Tabellen und Formulare können Nacharbeit erfordern. Siehe [PDF zu Word](/pdf-to-word).']
    ]]
  ],
  pt: [
    ['O que a compressão de PDF pode ou não fazer', 'Entenda a compressão de PDF, arquivos com muitas imagens e as diferenças de qualidade.', [
      ['Por que um PDF já pode ser compacto', 'PDFs podem conter imagens e fontes já comprimidas. Reorganizar a estrutura economiza pouco quando a maior parte do arquivo são imagens comprimidas.'],
      ['Otimização padrão e rasterização', 'Uma reescrita estrutural pode reorganizar objetos sem converter todas as páginas em imagens e geralmente preserva o texto selecionável, mas não garante redução. Rasterizar e recodificar em JPEG pode diminuir o tamanho, mas remove busca e seleção de texto, reduz a nitidez vetorial e afeta formulários interativos.'],
      ['Confira o resultado, não o rótulo', 'Compare os tamanhos e revise páginas importantes em zoom normal e ampliado. Guarde o original até aprovar a qualidade. [Comprimir PDF](/compress) não oferece um resultado maior como compressão.']
    ]],
    ['O que significa processamento local de PDF', 'Saiba o que o processamento de PDF no navegador protege e quais são seus limites.', [
      ['O documento selecionado', 'Uma biblioteca PDF no navegador pode ler um arquivo selecionado e criar outro sem enviar o PDF a um servidor de conversão. Isso descreve o processamento do documento, não todas as solicitações do site.'],
      ['Solicitações do site e de recursos', 'O navegador solicita as páginas e os recursos do site, incluindo recursos OCR Tesseract.js incluídos localmente para PDF para Word e OCR PDF. A hospedagem pode manter registros conforme suas políticas.'],
      ['Considere todas as informações antes de decidir', 'Não insira conteúdo sensível se o processamento ou a hospedagem não atender às suas necessidades. Consulte a [Política de Privacidade](/privacy) para ver a implementação e os detalhes ainda pendentes.']
    ]],
    ['Converter PDFs digitalizados para Word', 'Entenda o OCR, a qualidade da digitalização e os limites de layout na conversão de PDF.', [
      ['PDFs de texto e digitalizados são diferentes', 'Um PDF com camada de texto permite selecionar caracteres. Uma digitalização pode conter apenas imagens, exigindo que o conversor reconheça os caracteres por OCR.'],
      ['A qualidade do OCR depende da digitalização', 'Resolução, inclinação, contraste, idioma, escrita à mão e danos afetam o reconhecimento. Para páginas sem texto legível, a ferramenta usa OCR em inglês; revise o documento Word em busca de erros ou omissões.'],
      ['Revise o layout', 'O conversor reconstrói posições do texto e linhas simples, não reproduz perfeitamente todos os layouts. Colunas, tabelas e formulários podem exigir correções. Consulte [PDF para Word](/pdf-to-word).']
    ]]
  ],
  it: [
    ['Cosa può e non può fare la compressione PDF', 'Scopri la compressione PDF, i file ricchi di immagini e i compromessi sulla qualità.', [
      ['Perché un PDF può essere già compatto', 'I PDF possono contenere immagini e font già compressi. Riorganizzare la struttura fa risparmiare poco se la maggior parte dei dati sono immagini compresse.'],
      ['Ottimizzazione standard e rasterizzazione', 'Una riscrittura strutturale può riordinare gli oggetti senza convertire ogni pagina in immagine e di solito conserva il testo selezionabile, ma non garantisce una riduzione. La rasterizzazione con ricodifica JPEG può ridurre le dimensioni, ma elimina ricerca e selezione del testo, riduce la nitidezza vettoriale e influisce sui moduli interattivi.'],
      ['Controlla il risultato, non l’etichetta', 'Confronta le dimensioni e controlla le pagine importanti con zoom normale e ingrandito. Conserva l’originale finché la qualità non è accettabile. [Comprimi PDF](/compress) non offre un risultato più grande come compressione.']
    ]],
    ['Cosa significa elaborazione PDF locale', 'Scopri cosa protegge l’elaborazione PDF nel browser e quali sono i suoi limiti.', [
      ['Il documento selezionato', 'Una libreria PDF nel browser può leggere un file selezionato e crearne uno nuovo senza inviarlo a un server di conversione. Questo descrive l’elaborazione del documento, non tutte le richieste del sito.'],
      ['Richieste del sito e delle risorse', 'Il browser richiede le pagine e le risorse del sito, incluse quelle OCR Tesseract.js integrate per PDF in Word e OCR PDF. Il provider di hosting può conservare i log secondo le proprie regole.'],
      ['Valuta tutte le informazioni prima di decidere', 'Non inserire contenuti sensibili se l’elaborazione o l’hosting non sono adatti alle tue esigenze. Consulta l’[Informativa sulla privacy](/privacy) per dettagli sull’implementazione e sulle informazioni mancanti.']
    ]],
    ['Convertire PDF scansionati in Word', 'Scopri OCR, qualità delle scansioni e limiti di layout durante la conversione.', [
      ['PDF testuali e scansioni sono diversi', 'Un PDF con livello di testo contiene caratteri selezionabili. Una scansione può contenere solo immagini; il convertitore deve quindi riconoscere i caratteri tramite OCR.'],
      ['La qualità OCR dipende dalla scansione', 'Risoluzione, inclinazione, contrasto, lingua, scrittura a mano e danni possono influire sul riconoscimento. Per le pagine senza testo leggibile lo strumento usa OCR inglese; controlla il documento Word per errori e omissioni.'],
      ['Controlla il layout', 'Il convertitore ricostruisce le posizioni del testo e semplici righe, ma non riproduce perfettamente ogni layout. Colonne, tabelle e moduli possono richiedere correzioni. Vedi [PDF in Word](/pdf-to-word).']
    ]]
  ],
  nl: [
    ['Wat PDF-compressie wel en niet kan', 'Lees over PDF-compressie, bestanden met veel afbeeldingen en kwaliteitsverschillen.', [
      ['Waarom een PDF al compact kan zijn', 'PDF’s kunnen al gecomprimeerde afbeeldingen en lettertypen bevatten. De structuur herschrijven bespaart weinig als de meeste bytes in gecomprimeerde afbeeldingen zitten.'],
      ['Standaardoptimalisatie en rasteren', 'Een structurele herschrijving kan PDF-objecten ordenen zonder elke pagina naar een afbeelding om te zetten en behoudt meestal selecteerbare tekst, maar verkleint het bestand niet altijd. Rasteren en opnieuw coderen als JPEG kan de grootte verminderen, maar verwijdert zoeken en selecteren, vermindert vectorscherpte en beïnvloedt interactieve formulieren.'],
      ['Controleer het resultaat, niet het label', 'Vergelijk bestandsgroottes en bekijk belangrijke pagina’s op normale en hoge zoom. Bewaar het origineel totdat de kwaliteit goed is. [PDF comprimeren](/compress) biedt geen groter bestand als compressieresultaat.']
    ]],
    ['Wat lokale PDF-verwerking betekent', 'Ontdek wat PDF-verwerking in de browser beschermt en wat niet.', [
      ['Het geselecteerde document', 'Een PDF-bibliotheek in de browser kan een gekozen bestand lezen en een nieuw bestand maken zonder de PDF naar een conversieserver te sturen. Dit beschrijft de documentverwerking, niet alle websiteverzoeken.'],
      ['Website- en bronverzoeken', 'De browser vraagt pagina’s en bestanden van de website op, waaronder meegeleverde Tesseract.js-OCR-bronnen voor PDF naar Word en OCR PDF. Hostingproviders kunnen verzoeken volgens hun beleid loggen.'],
      ['Maak een keuze met het volledige beeld', 'Voer geen gevoelige inhoud in als verwerking of hosting niet bij je past. Bekijk het [Privacybeleid](/privacy) voor implementatiedetails en nog ontbrekende informatie.']
    ]],
    ['Gescande PDF’s naar Word converteren', 'Lees over OCR, scan kwaliteit en lay-outbeperkingen bij PDF-conversie.', [
      ['Tekst-PDF’s en scans verschillen', 'Een PDF met een tekstlaag bevat selecteerbare tekens. Een scan kan alleen pagina-afbeeldingen bevatten; de converter moet tekens dan met OCR herkennen.'],
      ['OCR-kwaliteit hangt af van de scan', 'Resolutie, scheefstand, contrast, taal, handschrift en beschadigingen beïnvloeden de herkenning. Voor pagina’s zonder leesbare tekst gebruikt de tool Engelse OCR; controleer het Word-bestand op fouten en ontbrekende tekst.'],
      ['Controleer de lay-out', 'De converter reconstrueert tekstposities en eenvoudige regels, maar niet elk ontwerp exact. Kolommen, tabellen en formulieren kunnen handmatige correcties vereisen. Zie [PDF naar Word](/pdf-to-word).']
    ]]
  ],
  pl: [
    ['Co kompresja PDF może, a czego nie może', 'Poznaj kompresję PDF, pliki z dużą liczbą obrazów i kompromisy dotyczące jakości.', [
      ['Dlaczego PDF może być już mały', 'Pliki PDF mogą zawierać już skompresowane obrazy i czcionki. Zmiana struktury niewiele daje, gdy większość danych stanowią skompresowane obrazy.'],
      ['Standardowa optymalizacja a rasteryzacja', 'Zmiana struktury może uporządkować obiekty bez zamiany każdej strony w obraz i zwykle zachowuje zaznaczalny tekst, ale nie gwarantuje zmniejszenia pliku. Rasteryzacja i ponowne kodowanie JPEG może zmniejszyć rozmiar, lecz usuwa wyszukiwanie i zaznaczanie tekstu, pogarsza ostrość wektorów i wpływa na formularze interaktywne.'],
      ['Sprawdź wynik, nie etykietę', 'Porównaj rozmiary i obejrzyj ważne strony przy zwykłym i dużym powiększeniu. Zachowaj oryginał, dopóki jakość nie będzie odpowiednia. [Kompresuj PDF](/compress) nie oferuje większego pliku jako wyniku kompresji.']
    ]],
    ['Co oznacza lokalne przetwarzanie PDF', 'Dowiedz się, co chroni przetwarzanie PDF w przeglądarce, a czego nie.', [
      ['Wybrany dokument', 'Biblioteka PDF w przeglądarce może odczytać wybrany plik i utworzyć nowy bez wysyłania PDF na serwer konwersji. Opisuje to przetwarzanie dokumentu, a nie wszystkie żądania witryny.'],
      ['Żądania witryny i zasobów', 'Przeglądarka pobiera strony i zasoby witryny, w tym dołączone lokalnie zasoby OCR Tesseract.js dla PDF do Word i OCR PDF. Dostawca hostingu może przechowywać logi zgodnie ze swoimi zasadami.'],
      ['Podejmij decyzję, znając cały kontekst', 'Nie wprowadzaj poufnych danych, jeśli sposób przetwarzania lub hosting Ci nie odpowiada. Zobacz [Politykę prywatności](/privacy), aby poznać implementację i brakujące informacje.']
    ]],
    ['Konwersja skanowanych PDF-ów do Worda', 'Poznaj OCR, jakość skanów i ograniczenia układu przy konwersji PDF.', [
      ['PDF-y tekstowe i skany są różne', 'PDF z warstwą tekstową zawiera znaki, które można zaznaczyć. Skan może zawierać tylko obrazy stron, więc konwerter musi rozpoznać znaki za pomocą OCR.'],
      ['Jakość OCR zależy od skanu', 'Rozdzielczość, przekrzywienie, kontrast, język, pismo odręczne i uszkodzenia wpływają na rozpoznawanie. Dla stron bez czytelnego tekstu narzędzie używa angielskiego OCR; sprawdź dokument Word pod kątem błędów i braków.'],
      ['Sprawdź układ', 'Konwerter odtwarza pozycje tekstu i proste wiersze, ale nie każdy układ idealnie. Kolumny, tabele i formularze mogą wymagać poprawek. Zobacz [PDF do Worda](/pdf-to-word).']
    ]]
  ],
  sv: [
    ['Vad PDF-komprimering kan och inte kan göra', 'Läs om PDF-komprimering, bildtunga filer och avvägningar mellan kvalitet och storlek.', [
      ['Varför en PDF redan kan vara kompakt', 'PDF-filer kan innehålla redan komprimerade bilder och teckensnitt. En omstrukturering sparar lite om de flesta byte består av komprimerade bilder.'],
      ['Standardoptimering och rastrering', 'En strukturell omskrivning kan ordna PDF-objekt utan att göra varje sida till en bild och bevarar oftast markerbar text, men minskar inte alltid filen. Rastrering och JPEG-omkodning kan minska storleken men tar bort textsökning och markering, försämrar vektorskärpan och påverkar interaktiva formulär.'],
      ['Kontrollera resultatet, inte etiketten', 'Jämför storlekarna och granska viktiga sidor med normal och hög zoom. Behåll originalet tills kvaliteten är godtagbar. [Komprimera PDF](/compress) erbjuder inte en större fil som komprimeringsresultat.']
    ]],
    ['Vad lokal PDF-behandling innebär', 'Läs vad PDF-behandling i webbläsaren skyddar och vad den inte skyddar.', [
      ['Det valda dokumentet', 'Ett PDF-bibliotek i webbläsaren kan läsa en vald fil och skapa en ny utan att skicka PDF-filen till en konverteringsserver. Det beskriver dokumentbehandlingen, inte alla webbplatsförfrågningar.'],
      ['Webbplats- och resursförfrågningar', 'Webbläsaren hämtar webbplatsens sidor och resurser, inklusive lokalt paketerade Tesseract.js-resurser för PDF till Word och OCR PDF. Webbhotellet kan spara loggar enligt sina egna regler.'],
      ['Fatta beslut med hela bilden', 'Mata inte in känsligt innehåll om behandlingen eller webbhotellet inte passar dina behov. Läs [integritetspolicyn](/privacy) om implementationen och uppgifter som saknas.']
    ]],
    ['Konvertera skannade PDF-filer till Word', 'Läs om OCR, skanningskvalitet och layoutbegränsningar vid PDF-konvertering.', [
      ['Text-PDF:er och skanningar skiljer sig åt', 'En PDF med textlager innehåller markerbara tecken. En skanning kan bara innehålla sidbilder, så konverteraren måste känna igen tecken med OCR.'],
      ['OCR-kvaliteten beror på skanningen', 'Upplösning, lutning, kontrast, språk, handskrift och skador påverkar igenkänningen. Verktyget använder engelsk OCR för sidor utan läsbar text; kontrollera Word-dokumentet efter fel och saknat innehåll.'],
      ['Granska layouten', 'Konverteraren återskapar textpositioner och enkla rader, men inte varje layout exakt. Kolumner, tabeller och formulär kan behöva rättas manuellt. Se [PDF till Word](/pdf-to-word).']
    ]]
  ],
  fi: [
    ['Mitä PDF-pakkaus voi ja ei voi tehdä', 'Tutustu PDF-pakkaukseen, kuvarunsaiden tiedostojen kokoon ja laatueroihin.', [
      ['Miksi PDF voi olla jo valmiiksi pieni', 'PDF voi sisältää valmiiksi pakattuja kuvia ja fontteja. Rakenteen uudelleenjärjestely säästää vähän, jos suurin osa tavuista on pakattuja kuvia.'],
      ['Tavallinen optimointi ja rasterointi', 'Rakenteen uudelleenkirjoitus voi järjestää PDF-objekteja muuttamatta jokaista sivua kuvaksi ja säilyttää yleensä valittavan tekstin, mutta tiedosto ei välttämättä pienene. Rasterointi ja JPEG-uudelleenkoodaus voi pienentää kokoa, mutta poistaa tekstin haun ja valinnan, heikentää vektorien tarkkuutta ja vaikuttaa vuorovaikutteisiin lomakkeisiin.'],
      ['Tarkista tulos, älä pelkkää nimeä', 'Vertaa tiedostokokoja ja tarkista tärkeät sivut tavallisella ja suurella zoomauksella. Säilytä alkuperäinen, kunnes laatu on hyväksyttävä. [Pakkaa PDF](/compress) ei tarjoa pakkaustuloksena suurempaa tiedostoa.']
    ]],
    ['Mitä PDF:n paikallinen käsittely tarkoittaa', 'Lue, mitä PDF:n käsittely selaimessa suojaa ja mitä se ei suojaa.', [
      ['Valittu asiakirja', 'Selaimen PDF-kirjasto voi lukea valitun tiedoston ja luoda uuden lähettämättä PDF:ää muunnospalvelimelle. Tämä kuvaa asiakirjan käsittelyä, ei kaikkia sivuston verkkopyyntöjä.'],
      ['Sivuston ja resurssien pyynnöt', 'Selain pyytää sivuston sivut ja resurssit, mukaan lukien sivustoon pakatut Tesseract.js-OCR-resurssit PDF Wordiksi- ja OCR PDF -työkaluille. Hosting-palvelu voi säilyttää pyyntölokeja omien käytäntöjensä mukaisesti.'],
      ['Tee päätös kokonaiskuvan perusteella', 'Älä syötä arkaluonteista sisältöä, jos käsittely tai hosting ei sovi tarpeisiisi. Katso [tietosuojakäytännöstä](/privacy) toteutuksen tiedot ja vielä puuttuvat tiedot.']
    ]],
    ['Skannattujen PDF-tiedostojen muuntaminen Wordiksi', 'Tutustu OCR-tunnistukseen, skannauksen laatuun ja asettelun rajoituksiin PDF-muunnoksessa.', [
      ['Teksti-PDF ja skannattu PDF ovat erilaisia', 'Tekstikerroksen sisältävän PDF:n merkkejä voi valita. Skannattu PDF voi sisältää vain sivukuvia, jolloin muunnin tunnistaa merkit OCR:llä.'],
      ['OCR-tarkkuus riippuu skannauksesta', 'Tarkkuus, vinous, kontrasti, kieli, käsiala ja vauriot vaikuttavat tunnistukseen. Työkalu käyttää englanninkielistä OCR:ää sivuille, joilla ei ole luettavaa tekstiä; tarkista Word-asiakirjasta virheet ja puuttuva sisältö.'],
      ['Tarkista asettelu', 'Muunnin palauttaa tekstin sijainteja ja yksinkertaisia rivejä, mutta ei kaikkia asetteluja täydellisesti. Sarakkeet, taulukot ja lomakkeet voivat vaatia muokkausta. Katso [PDF Wordiksi](/pdf-to-word).']
    ]]
  ],
  da: [
    ['Hvad PDF-komprimering kan og ikke kan', 'Forstå PDF-komprimering, billedtunge filer og afvejninger af kvalitet.', [
      ['Hvorfor en PDF allerede kan være kompakt', 'PDF-filer kan indeholde allerede komprimerede billeder og skrifttyper. En ny struktur sparer kun lidt, hvis de fleste bytes er komprimerede billeder.'],
      ['Standardoptimering og rasterisering', 'En strukturel omskrivning kan organisere PDF-objekter uden at gøre alle sider til billeder og bevarer normalt markerbar tekst, men reducerer ikke altid filstørrelsen. Rasterisering og JPEG-kodning kan mindske størrelsen, men fjerner tekstsøgning og markering, forringer vektorskarpheden og påvirker interaktive formularer.'],
      ['Kontrollér resultatet, ikke etiketten', 'Sammenlign størrelserne, og gennemgå vigtige sider ved normal og høj zoom. Behold originalen, indtil kvaliteten er acceptabel. [Komprimer PDF](/compress) tilbyder ikke en større fil som komprimeringsresultat.']
    ]],
    ['Hvad lokal PDF-behandling betyder', 'Læs, hvad PDF-behandling i browseren beskytter, og hvad den ikke gør.', [
      ['Det valgte dokument', 'Et PDF-bibliotek i browseren kan læse en valgt fil og oprette en ny uden at sende PDF’en til en konverteringsserver. Det beskriver dokumentbehandlingen, ikke alle anmodninger fra webstedet.'],
      ['Anmodninger fra webstedet og ressourcer', 'Browseren henter webstedets sider og ressourcer, herunder lokalt medfølgende Tesseract.js-OCR-ressourcer til PDF til Word og OCR PDF. Hostingudbyderen kan gemme logfiler efter egne regler.'],
      ['Træf beslutningen med hele billedet', 'Indtast ikke følsomt indhold, hvis behandlingen eller hosting ikke passer til dine behov. Se [privatlivspolitikken](/privacy) for oplysninger om implementeringen og udestående detaljer.']
    ]],
    ['Konvertering af scannede PDF’er til Word', 'Forstå OCR, scanningskvalitet og layoutbegrænsninger ved PDF-konvertering.', [
      ['Tekst-PDF’er og scanninger er forskellige', 'En PDF med et tekstlag indeholder markerbare tegn. En scanning kan kun indeholde sidebilleder, så konverteren skal genkende tegnene med OCR.'],
      ['OCR-kvaliteten afhænger af scanningen', 'Opløsning, skævhed, kontrast, sprog, håndskrift og skader påvirker genkendelsen. Værktøjet bruger engelsk OCR på sider uden læsbar tekst; kontrollér Word-dokumentet for fejl og manglende indhold.'],
      ['Gennemgå layoutet', 'Konverteren genskaber tekstpositioner og enkle rækker, men ikke alle layouts nøjagtigt. Kolonner, tabeller og formularer kan kræve manuel rettelse. Se [PDF til Word](/pdf-to-word).']
    ]]
  ],
  nb: [
    ['Hva PDF-komprimering kan og ikke kan gjøre', 'Forstå PDF-komprimering, bildefiler og avveininger mellom kvalitet og størrelse.', [
      ['Hvorfor en PDF allerede kan være kompakt', 'PDF-filer kan inneholde bilder og skrifter som allerede er komprimert. Omstrukturering sparer lite hvis de fleste bytene tilhører komprimerte bilder.'],
      ['Standardoptimalisering og rasterisering', 'En strukturell omskriving kan organisere PDF-objekter uten å gjøre hver side til et bilde, og bevarer vanligvis markerbar tekst, men reduserer ikke alltid størrelsen. Rasterisering og JPEG-koding kan redusere størrelsen, men fjerner tekstsøk og markering, svekker vektorskarphet og påvirker interaktive skjemaer.'],
      ['Kontroller resultatet, ikke etiketten', 'Sammenlign filstørrelsene og undersøk viktige sider med normal og høy zoom. Behold originalen til kvaliteten er akseptabel. [Komprimer PDF](/compress) tilbyr ikke en større fil som komprimeringsresultat.']
    ]],
    ['Hva lokal PDF-behandling betyr', 'Les hva PDF-behandling i nettleseren beskytter, og hva den ikke gjør.', [
      ['Det valgte dokumentet', 'Et PDF-bibliotek i nettleseren kan lese en valgt fil og opprette en ny uten å sende PDF-en til en konverteringsserver. Dette beskriver dokumentbehandlingen, ikke alle forespørsler fra nettstedet.'],
      ['Forespørsler til nettstedet og ressurser', 'Nettleseren henter nettstedets sider og ressurser, inkludert lokalt medfølgende Tesseract.js-ressurser for PDF til Word og OCR PDF. Vertstilbyderen kan lagre logger etter egne regler.'],
      ['Ta en informert beslutning', 'Ikke legg inn sensitivt innhold hvis behandlingen eller hostingen ikke passer for deg. Se [personvernerklæringen](/privacy) for implementasjonsdetaljer og manglende opplysninger.']
    ]],
    ['Konvertere skannede PDF-er til Word', 'Forstå OCR, skannekvalitet og layoutbegrensninger ved PDF-konvertering.', [
      ['Tekst-PDF-er og skanninger er forskjellige', 'En PDF med tekstlag inneholder markerbare tegn. En skanning kan bare inneholde sidebilder, så konverteren må gjenkjenne tegn med OCR.'],
      ['OCR-kvaliteten avhenger av skanningen', 'Oppløsning, skjevhet, kontrast, språk, håndskrift og skader påvirker gjenkjenningen. Verktøyet bruker engelsk OCR for sider uten lesbar tekst; kontroller Word-dokumentet for feil og mangler.'],
      ['Kontroller layouten', 'Konverteren rekonstruerer tekstplassering og enkle rader, men ikke alle oppsett nøyaktig. Kolonner, tabeller og skjemaer kan kreve manuelle rettelser. Se [PDF til Word](/pdf-to-word).']
    ]]
  ],
  tr: [
    ['PDF sıkıştırma neler yapabilir, neler yapamaz', 'PDF sıkıştırmayı, görsel ağırlıklı dosyaları ve kalite farklarını anlayın.', [
      ['PDF neden zaten küçük olabilir', 'PDF’ler önceden sıkıştırılmış görseller ve yazı tipleri içerebilir. Baytların çoğu sıkıştırılmış görsellerden oluşuyorsa yapıyı yeniden düzenlemek çok az kazandırır.'],
      ['Standart optimizasyon ve rasterleştirme', 'Yapısal yeniden yazım, her sayfayı görsele dönüştürmeden PDF nesnelerini düzenleyebilir ve genellikle seçilebilir metni korur; ancak boyutun küçülmesini garanti etmez. Rasterleştirme ve JPEG kodlaması boyutu azaltabilir, fakat metin arama ve seçimini kaldırır, vektör netliğini düşürür ve etkileşimli formları etkiler.'],
      ['Etiketi değil sonucu kontrol edin', 'Dosya boyutlarını karşılaştırın ve önemli sayfaları normal ve yüksek yakınlaştırmada inceleyin. Kalite uygun olana kadar özgün dosyayı saklayın. [PDF Sıkıştır](/compress) daha büyük bir çıktıyı sıkıştırma sonucu olarak sunmaz.']
    ]],
    ['Yerel PDF işleme ne anlama gelir', 'Tarayıcıdaki PDF işlemenin neleri koruduğunu ve neleri korumadığını öğrenin.', [
      ['Seçilen belge', 'Tarayıcıdaki PDF kitaplığı seçilen dosyayı okuyup PDF’yi dönüştürme sunucusuna göndermeden yeni bir dosya oluşturabilir. Bu, belgenin işlenme yolunu açıklar; sitenin tüm isteklerini değil.'],
      ['Site ve kaynak istekleri', 'Tarayıcı, PDF’den Word’e ve OCR PDF için site sayfalarını ve yerel Tesseract.js OCR kaynaklarını ister. Barındırma sağlayıcısı kendi politikalarına göre istek kayıtlarını tutabilir.'],
      ['Tüm bilgileri değerlendirerek karar verin', 'İşleme veya barındırma ihtiyaçlarınıza uymuyorsa hassas içerik girmeyin. Uygulama ve eksik işletmeci bilgileri için [Gizlilik Politikası](/privacy) sayfasına bakın.']
    ]],
    ['Taranmış PDF’leri Word’e dönüştürme', 'PDF dönüşümünde OCR’ı, tarama kalitesini ve düzen sınırlamalarını öğrenin.', [
      ['Metin PDF’leri ve taramalar farklıdır', 'Metin katmanı olan PDF’de seçilebilir karakterler bulunur. Tarama yalnızca sayfa görselleri içerebilir; dönüştürücü karakterleri OCR ile tanımalıdır.'],
      ['OCR kalitesi taramaya bağlıdır', 'Çözünürlük, eğiklik, kontrast, dil, el yazısı ve hasar tanımayı etkileyebilir. Okunabilir metni olmayan sayfalarda araç İngilizce OCR kullanır; Word belgesinde hata ve eksik içerik olup olmadığını kontrol edin.'],
      ['Düzeni gözden geçirin', 'Dönüştürücü metin konumlarını ve basit satırları yeniden oluşturur, ancak her düzeni kusursuz kopyalamaz. Sütunlar, tablolar ve formlar elle düzeltme gerektirebilir. [PDF’den Word’e](/pdf-to-word) aracına bakın.']
    ]]
  ],
  ru: [
    ['Что может и чего не может сжатие PDF', 'Узнайте о сжатии PDF, документах с большим количеством изображений и компромиссах качества.', [
      ['Почему PDF уже может быть компактным', 'PDF может содержать уже сжатые изображения и шрифты. Перестройка структуры мало поможет, если большая часть данных — сжатые изображения.'],
      ['Стандартная оптимизация и растеризация', 'Структурная перезапись может упорядочить объекты PDF без преобразования каждой страницы в изображение и обычно сохраняет выделяемый текст, но не гарантирует уменьшение размера. Растеризация и кодирование JPEG могут уменьшить файл, но лишают текст поиска и выделения, снижают четкость векторной графики и влияют на интерактивные формы.'],
      ['Проверяйте результат, а не название', 'Сравните размеры и проверьте важные страницы при обычном и большом увеличении. Сохраните оригинал, пока качество не станет приемлемым. [Сжать PDF](/compress) не предлагает увеличенный файл как результат сжатия.']
    ]],
    ['Что означает локальная обработка PDF', 'Узнайте, что защищает обработка PDF в браузере и чего она не гарантирует.', [
      ['Выбранный документ', 'Библиотека PDF в браузере может прочитать выбранный файл и создать новый, не отправляя PDF на сервер конвертации. Это описывает обработку документа, но не все запросы сайта.'],
      ['Запросы сайта и ресурсов', 'Браузер загружает страницы и ресурсы сайта, включая встроенные ресурсы Tesseract.js для OCR в PDF в Word и OCR PDF. Хостинг-провайдер может хранить журналы запросов согласно своим правилам.'],
      ['Принимайте решение с учетом всех обстоятельств', 'Не вводите конфиденциальные данные, если обработка или хостинг вам не подходят. В [Политике конфиденциальности](/privacy) описаны реализация и недостающие сведения.']
    ]],
    ['Преобразование сканированных PDF в Word', 'Узнайте об OCR, качестве сканов и ограничениях макета при конвертации PDF.', [
      ['Текстовые PDF и сканы отличаются', 'PDF со слоем текста содержит выделяемые символы. Скан может содержать только изображения страниц, поэтому конвертер распознает символы с помощью OCR.'],
      ['Качество OCR зависит от скана', 'Разрешение, перекос, контраст, язык, рукописный текст и повреждения влияют на распознавание. Для страниц без читаемого текста используется английский OCR; проверьте документ Word на ошибки и пропуски.'],
      ['Проверьте макет', 'Конвертер восстанавливает позиции текста и простые строки, но не копирует идеально каждый макет. Столбцы, таблицы и формы могут потребовать исправлений. См. [PDF в Word](/pdf-to-word).']
    ]]
  ],
  uk: [
    ['Що може і чого не може стиснення PDF', 'Дізнайтеся про стиснення PDF, файли з великою кількістю зображень і компроміси якості.', [
      ['Чому PDF уже може бути компактним', 'PDF може містити вже стиснуті зображення та шрифти. Перебудова структури мало допоможе, якщо більшість даних — стиснуті зображення.'],
      ['Стандартна оптимізація та растеризація', 'Структурний перезапис може впорядкувати об’єкти PDF без перетворення кожної сторінки на зображення та зазвичай зберігає текст, який можна виділяти, але не гарантує зменшення розміру. Растеризація й кодування JPEG можуть зменшити файл, але прибирають пошук і виділення тексту, знижують чіткість векторів і впливають на інтерактивні форми.'],
      ['Перевіряйте результат, а не назву', 'Порівняйте розміри та перевірте важливі сторінки за звичайного й високого збільшення. Збережіть оригінал, поки якість не буде прийнятною. [Стиснути PDF](/compress) не пропонує більший файл як результат стиснення.']
    ]],
    ['Що означає локальна обробка PDF', 'Дізнайтеся, що захищає обробка PDF у браузері, а чого вона не гарантує.', [
      ['Вибраний документ', 'Бібліотека PDF у браузері може прочитати вибраний файл і створити новий, не надсилаючи PDF на сервер конвертації. Це описує обробку документа, але не всі запити сайту.'],
      ['Запити сайту та ресурсів', 'Браузер завантажує сторінки й ресурси сайту, зокрема вбудовані ресурси Tesseract.js для OCR у PDF у Word і OCR PDF. Хостинг-провайдер може зберігати журнали відповідно до власних правил.'],
      ['Приймайте рішення з урахуванням усіх обставин', 'Не вводьте конфіденційні дані, якщо обробка чи хостинг вам не підходять. У [Політиці конфіденційності](/privacy) описано реалізацію та відсутні відомості.']
    ]],
    ['Перетворення сканованих PDF у Word', 'Дізнайтеся про OCR, якість сканів і обмеження макета під час конвертації PDF.', [
      ['Текстові PDF і скани відрізняються', 'PDF із текстовим шаром містить символи, які можна виділяти. Скан може містити лише зображення сторінок, тому конвертер розпізнає символи за допомогою OCR.'],
      ['Якість OCR залежить від скану', 'Роздільність, нахил, контраст, мова, рукописний текст і пошкодження впливають на розпізнавання. Для сторінок без читабельного тексту використовується англійський OCR; перевірте документ Word на помилки й пропуски.'],
      ['Перевірте макет', 'Конвертер відновлює позиції тексту й прості рядки, але не копіює ідеально кожен макет. Стовпці, таблиці та форми можуть потребувати виправлень. Див. [PDF у Word](/pdf-to-word).']
    ]]
  ],
  ar: [
    ['ما الذي يمكن لضغط PDF فعله وما لا يمكنه فعله', 'تعرّف على ضغط PDF والملفات كثيرة الصور والمفاضلة بين الحجم والجودة.', [
      ['لماذا قد يكون ملف PDF صغيراً بالفعل', 'قد تحتوي ملفات PDF على صور وخطوط مضغوطة مسبقاً. لا يوفر تغيير البنية كثيراً إذا كانت معظم البيانات صوراً مضغوطة.'],
      ['التحسين القياسي وتحويل الصفحات إلى صور', 'يمكن لإعادة كتابة البنية تنظيم كائنات PDF دون تحويل كل صفحة إلى صورة، وغالباً ما تحافظ على النص القابل للتحديد، لكنها لا تضمن تقليل الحجم. قد يقلل تحويل الصفحات إلى صور JPEG الحجم، لكنه يزيل البحث عن النص وتحديده ويضعف وضوح الرسومات المتجهة ويؤثر في النماذج التفاعلية.'],
      ['افحص النتيجة لا اسم الخيار', 'قارن الأحجام وافحص الصفحات المهمة بالتكبير العادي والعالي. احتفظ بالأصل حتى تصبح الجودة مقبولة. لا تعرض أداة [ضغط PDF](/compress) ملفاً أكبر على أنه نتيجة ضغط.']
    ]],
    ['ماذا تعني معالجة PDF محلياً', 'تعرّف على ما تحميه معالجة PDF في المتصفح وما لا تحميه.', [
      ['المستند المحدد', 'يمكن لمكتبة PDF في المتصفح قراءة ملف محدد وإنشاء ملف جديد دون إرسال PDF إلى خادم تحويل. يصف ذلك معالجة المستند، لا كل الطلبات التي يجريها الموقع.'],
      ['طلبات الموقع والموارد', 'يطلب المتصفح صفحات الموقع وموارده، بما فيها موارد Tesseract.js المضمنة محلياً لأدوات PDF إلى Word وOCR PDF. قد يحتفظ مزود الاستضافة بسجلات الطلبات وفق سياساته.'],
      ['اتخذ قراراً بناءً على الصورة كاملة', 'لا تُدخل محتوى حساساً إذا لم تناسبك المعالجة أو الاستضافة. راجع [سياسة الخصوصية](/privacy) لمعرفة تفاصيل التنفيذ والمعلومات التي لم تُحدد بعد.']
    ]],
    ['تحويل ملفات PDF الممسوحة إلى Word', 'تعرّف على OCR وجودة المسح الضوئي وحدود التخطيط عند تحويل PDF.', [
      ['تختلف ملفات PDF النصية عن الممسوحة', 'يحتوي PDF ذو طبقة النص على أحرف قابلة للتحديد. وقد يحتوي الملف الممسوح على صور الصفحات فقط، لذا يتعين على المحول التعرف على الأحرف باستخدام OCR.'],
      ['تعتمد جودة OCR على المسح', 'قد تؤثر الدقة والميل والتباين واللغة والكتابة اليدوية والتلف في التعرف. تستخدم الأداة OCR باللغة الإنجليزية للصفحات التي لا تحتوي على نص مقروء؛ راجع مستند Word بحثاً عن أخطاء أو محتوى مفقود.'],
      ['راجع التخطيط', 'يعيد المحول بناء مواضع النص والصفوف البسيطة، لكنه لا يطابق كل تخطيط تماماً. قد تحتاج الأعمدة والجداول والنماذج إلى تصحيح يدوي. راجع أداة [PDF إلى Word](/pdf-to-word).']
    ]]
  ],
  hi: [
    ['PDF संपीड़न क्या कर सकता है और क्या नहीं', 'PDF संपीड़न, अधिक छवियों वाली फ़ाइलों और गुणवत्ता के समझौतों को समझें।', [
      ['PDF पहले से छोटा क्यों हो सकता है', 'PDF में पहले से संपीड़ित चित्र और फ़ॉन्ट हो सकते हैं। यदि अधिकांश डेटा संपीड़ित चित्र हैं, तो संरचना बदलने से बहुत कम बचत होती है।'],
      ['सामान्य अनुकूलन और रास्टराइज़ेशन', 'संरचनात्मक पुनर्लेखन हर पृष्ठ को चित्र बनाए बिना PDF ऑब्जेक्ट व्यवस्थित कर सकता है और आमतौर पर चयन योग्य पाठ बचाता है, लेकिन आकार घटने की गारंटी नहीं देता। रास्टराइज़ करके JPEG में दोबारा एन्कोड करने से आकार घट सकता है, पर पाठ खोज/चयन हटता है, वेक्टर स्पष्टता घटती है और इंटरैक्टिव फ़ॉर्म प्रभावित होते हैं।'],
      ['लेबल नहीं, परिणाम जाँचें', 'आकारों की तुलना करें और महत्वपूर्ण पृष्ठ सामान्य तथा बड़े ज़ूम पर देखें। गुणवत्ता स्वीकार्य होने तक मूल फ़ाइल रखें। [PDF संपीड़ित करें](/compress) बड़ा परिणाम संपीड़न के रूप में नहीं देता।']
    ]],
    ['स्थानीय PDF प्रसंस्करण का अर्थ', 'जानें कि ब्राउज़र में PDF प्रसंस्करण क्या सुरक्षित करता है और क्या नहीं।', [
      ['चुना गया दस्तावेज़', 'ब्राउज़र की PDF लाइब्रेरी चुनी गई फ़ाइल पढ़कर नया दस्तावेज़ बना सकती है और PDF को रूपांतरण सर्वर पर भेजने की आवश्यकता नहीं होती। यह दस्तावेज़ प्रसंस्करण का वर्णन है, वेबसाइट के सभी अनुरोधों का नहीं।'],
      ['वेबसाइट और संसाधन अनुरोध', 'ब्राउज़र वेबसाइट पृष्ठ और संसाधन माँगता है, जिनमें PDF to Word और OCR PDF के लिए साइट में शामिल Tesseract.js OCR संसाधन भी हैं। होस्टिंग प्रदाता अपनी नीतियों के अनुसार अनुरोध लॉग रख सकता है।'],
      ['पूरी जानकारी के आधार पर निर्णय लें', 'यदि प्रसंस्करण या होस्टिंग आपकी आवश्यकताओं के अनुरूप न हो तो संवेदनशील सामग्री न डालें। कार्यान्वयन और अधूरी जानकारी के लिए [गोपनीयता नीति](/privacy) देखें।']
    ]],
    ['स्कैन किए गए PDF को Word में बदलना', 'PDF रूपांतरण में OCR, स्कैन की गुणवत्ता और लेआउट की सीमाएँ समझें।', [
      ['टेक्स्ट PDF और स्कैन अलग होते हैं', 'टेक्स्ट लेयर वाला PDF चयन योग्य अक्षर देता है। स्कैन में केवल पृष्ठ चित्र हो सकते हैं, इसलिए कन्वर्टर को OCR से अक्षर पहचानने पड़ते हैं।'],
      ['OCR की गुणवत्ता स्कैन पर निर्भर करती है', 'रिज़ॉल्यूशन, तिरछापन, कॉन्ट्रास्ट, भाषा, हस्तलेखन और क्षति पहचान को प्रभावित कर सकते हैं। पढ़ने योग्य पाठ के बिना पृष्ठों पर टूल अंग्रेज़ी OCR चलाता है; Word फ़ाइल में गलतियाँ और छूटी सामग्री जाँचें।'],
      ['लेआउट की समीक्षा करें', 'कन्वर्टर पाठ की स्थिति और सरल पंक्तियाँ बनाता है, लेकिन हर लेआउट की हूबहू प्रतिलिपि नहीं। कॉलम, तालिका और फ़ॉर्म में सुधार करना पड़ सकता है। [PDF to Word](/pdf-to-word) देखें।']
    ]]
  ],
  ja: [
    ['PDF圧縮でできること、できないこと', 'PDF圧縮、画像の多いファイル、品質とのトレードオフを説明します。', [
      ['PDFがすでに小さい場合がある理由', 'PDFには圧縮済みの画像やフォントが含まれることがあります。大部分が圧縮画像なら、構造を整理してもほとんど小さくなりません。'],
      ['標準最適化とラスタライズ', '構造を書き換えると、各ページを画像にせずPDFオブジェクトを整理でき、通常は選択可能なテキストを保てますが、サイズ縮小は保証されません。ラスタライズしてJPEGに再エンコードすると小さくなる場合がありますが、テキスト検索・選択ができなくなり、ベクターの鮮明さやインタラクティブフォームに影響します。'],
      ['名前ではなく結果を確認', 'サイズを比較し、重要なページを通常と高倍率で確認してください。品質に納得するまで元ファイルを保管してください。[PDF圧縮](/compress)は、より大きなファイルを圧縮結果として提供しません。']
    ]],
    ['PDFのローカル処理とは', 'ブラウザー内のPDF処理で保護されることと、保護されないことを説明します。', [
      ['選択したドキュメント', 'ブラウザーのPDFライブラリは、選択したファイルを読み込み、PDFを変換サーバーに送信せずに新しいファイルを作成できます。これは文書処理の説明であり、サイトのすべての通信を示すものではありません。'],
      ['サイトとリソースへのリクエスト', 'ブラウザーはサイトのページやリソースを取得します。PDF to WordとOCR PDF用のTesseract.js OCRリソースもサイトに含まれています。ホスティング事業者は独自の方針に基づいてリクエストログを保存する場合があります。'],
      ['全体を把握して判断する', '処理方法やホスティングが要件に合わない場合、機密情報を入力しないでください。実装内容と未確定事項は[プライバシーポリシー](/privacy)をご確認ください。']
    ]],
    ['スキャンPDFをWordに変換する', 'PDF変換時のOCR、スキャン品質、レイアウトの制限について説明します。', [
      ['テキストPDFとスキャンPDFの違い', 'テキストレイヤーのあるPDFでは文字を選択できます。スキャンにはページ画像だけが含まれる場合があり、その場合はOCRで文字を認識します。'],
      ['OCRの精度はスキャンに左右される', '解像度、傾き、コントラスト、言語、手書き、損傷などが認識に影響します。読み取れるテキストがないページには英語OCRを使用します。Word文書に誤りや欠落がないか確認してください。'],
      ['レイアウトを確認する', 'テキストの位置や簡単な行は再構成しますが、すべてのレイアウトを完全には再現しません。段組み、表、フォームは手作業で修正が必要な場合があります。[PDF to Word](/pdf-to-word)をご利用ください。']
    ]]
  ],
  ko: [
    ['PDF 압축으로 할 수 있는 것과 없는 것', 'PDF 압축, 이미지가 많은 파일, 품질과 크기의 상충 관계를 알아봅니다.', [
      ['PDF가 이미 작을 수 있는 이유', 'PDF에는 이미 압축된 이미지와 글꼴이 들어 있을 수 있습니다. 대부분이 압축 이미지라면 구조를 다시 작성해도 절약되는 크기는 적습니다.'],
      ['표준 최적화와 래스터화', '구조를 다시 쓰면 모든 페이지를 이미지로 바꾸지 않고 PDF 객체를 정리하며 대개 선택 가능한 텍스트를 보존하지만 크기 감소를 보장하지 않습니다. 래스터화 후 JPEG로 다시 인코딩하면 파일이 작아질 수 있지만 텍스트 검색과 선택이 사라지고 벡터 선명도가 낮아지며 대화형 양식에 영향을 줍니다.'],
      ['이름이 아니라 결과를 확인하세요', '파일 크기를 비교하고 중요한 페이지를 보통 및 높은 배율로 확인하세요. 품질이 만족스러울 때까지 원본을 보관하세요. [PDF 압축](/compress)은 더 큰 파일을 압축 결과로 제공하지 않습니다.']
    ]],
    ['로컬 PDF 처리의 의미', '브라우저에서 PDF를 처리할 때 보호되는 것과 그렇지 않은 것을 알아봅니다.', [
      ['선택한 문서', '브라우저의 PDF 라이브러리는 선택한 파일을 읽고 PDF를 변환 서버로 보내지 않고 새 파일을 만들 수 있습니다. 이는 문서 처리 경로를 설명하며 웹사이트의 모든 요청을 의미하지는 않습니다.'],
      ['사이트 및 리소스 요청', '브라우저는 사이트 페이지와 리소스를 요청하며 PDF to Word와 OCR PDF에 쓰이는 Tesseract.js OCR 리소스도 사이트에 포함되어 있습니다. 호스팅 업체는 자체 정책에 따라 요청 로그를 보관할 수 있습니다.'],
      ['전체 상황을 고려해 판단하세요', '처리 방식이나 호스팅이 필요에 맞지 않으면 민감한 내용을 입력하지 마세요. 구현 및 미확정 정보는 [개인정보 처리방침](/privacy)을 확인하세요.']
    ]],
    ['스캔 PDF를 Word로 변환하기', 'PDF 변환 시 OCR, 스캔 품질, 레이아웃 제한을 알아봅니다.', [
      ['텍스트 PDF와 스캔 PDF는 다릅니다', '텍스트 레이어가 있는 PDF에서는 문자를 선택할 수 있습니다. 스캔은 페이지 이미지뿐일 수 있으므로 변환기가 OCR로 문자를 인식해야 합니다.'],
      ['OCR 품질은 스캔에 따라 달라집니다', '해상도, 기울기, 대비, 언어, 손글씨, 손상 등이 인식에 영향을 줍니다. 읽을 수 있는 텍스트가 없는 페이지에는 영어 OCR을 사용하므로 Word 문서에서 오류와 누락을 확인하세요.'],
      ['레이아웃을 검토하세요', '변환기는 텍스트 위치와 간단한 행을 재구성하지만 모든 레이아웃을 완벽히 복제하지는 않습니다. 열, 표, 양식은 수동 수정이 필요할 수 있습니다. [PDF to Word](/pdf-to-word)를 확인하세요.']
    ]]
  ],
  'zh-CN': [
    ['PDF 压缩能做什么、不能做什么', '了解 PDF 压缩、图片较多的文件以及文件大小与质量之间的取舍。', [
      ['PDF 为什么可能已经很小', 'PDF 可能包含已压缩的图片和字体。如果大部分数据都是压缩图片，重新整理结构通常只能节省很少空间。'],
      ['标准优化与栅格化', '结构重写可以整理 PDF 对象，而不必将每页转成图片，通常也会保留可选择的文本，但不保证文件变小。栅格化并重新编码为 JPEG 可能缩小文件，却会移除文本搜索和选择功能、降低矢量清晰度，并影响交互式表单。'],
      ['检查结果，而不只看名称', '比较文件大小，并以普通和高倍缩放检查重要页面。在确认质量可接受之前，请保留原文件。[压缩 PDF](/compress)不会把更大的文件作为压缩结果提供。']
    ]],
    ['PDF 本地处理意味着什么', '了解浏览器中的 PDF 处理能保护什么，以及不能保护什么。', [
      ['所选文档', '浏览器中的 PDF 库可以读取所选文件并创建新文件，而无需将 PDF 上传到转换服务器。这说明的是文档处理方式，并不代表网站没有其他网络请求。'],
      ['网站和资源请求', '浏览器会请求网站页面和资源，包括网站内置的 PDF 转 Word 和 OCR PDF 所用 Tesseract.js OCR 资源。托管服务商可能根据其政策保存请求日志。'],
      ['结合完整信息做决定', '如果处理方式或托管服务不符合需求，请勿输入敏感内容。[隐私政策](/privacy)说明了当前实现及尚未确定的信息。']
    ]],
    ['将扫描版 PDF 转换为 Word', '了解 PDF 转换中的 OCR、扫描质量和版式限制。', [
      ['文本 PDF 与扫描 PDF 不同', '带有文本层的 PDF 可提供可选择的字符。扫描文件可能只有页面图片，因此转换器需要通过 OCR 识别字符。'],
      ['OCR 质量取决于扫描件', '分辨率、倾斜、对比度、语言、手写内容和页面损坏都会影响识别。对于没有可读文本的页面，工具使用英语 OCR；请检查 Word 文档中的错误和遗漏。'],
      ['检查版式', '转换器会重建文本位置和简单的对齐行，但无法完美还原所有版式。复杂的分栏、表格和表单可能需要手动修正。请查看 [PDF 转 Word](/pdf-to-word)。']
    ]]
  ]
};

const resourceArticleIds = ['pdf-compression', 'local-pdf-processing', 'scanned-pdf-to-word'];

for (const { code } of SUPPORTED_LANGUAGES) {
  if (code === 'en') continue;
  if (!localizedUi[code] || !articleTranslations[code] || articleTranslations[code].length !== resourceArticleIds.length) {
    throw new Error(`Resource guide translations are incomplete for "${code}".`);
  }
}

export const RESOURCE_TRANSLATIONS = articleTranslations;

export const getLocalizedResources = (language, articles) => {
  if (language === 'en' || !localizedUi[language]) {
    return {
      title: 'PDF Guides and Resources',
      intro: 'Short, practical explanations of PDF workflows, output quality, and browser processing.',
      readGuide: 'Read guide',
      backToResources: 'Back to all resources',
      articles
    };
  }

  const [title, intro, readGuide, backToResources] = localizedUi[language];
  const translations = articleTranslations[language];
  const localizedArticles = Object.fromEntries(
    resourceArticleIds.map((id, index) => {
      const [articleTitle, description, sections] = translations[index];
      return [id, {
        ...articles[id],
        title: articleTitle,
        description,
        sections
      }];
    })
  );

  return { title, intro, readGuide, backToResources, articles: localizedArticles };
};
