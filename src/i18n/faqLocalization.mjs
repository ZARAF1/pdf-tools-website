export const FAQ_TRANSLATIONS = {
  en: {
    title: 'Frequently Asked Questions',
    intro: 'Practical answers about using the PDF tools, their limits, and how the website processes files.',
    description: 'Answers about PDF tools, processing, downloads, compatibility, and privacy.',
    sectionLabel: 'Frequently asked questions',
    toolsLabel: 'PDF tools',
    guidesLabel: 'PDF guides',
    items: [
      ['Are my PDF files uploaded?', 'For the supported tools, your selected document is processed in this browser and is not sent to a conversion server. PDF to Word and OCR PDF use English OCR resources bundled with the site; recognition also runs on your device. Loading the site still sends ordinary page and asset requests to its host, whose logging practices depend on the deployment provider.'],
      ['How many PDF files can I merge?', 'You can merge up to five PDF files at a time. At least two files are required.'],
      ['Why might a PDF fail to open?', 'The file may be corrupt, use unsupported encryption or PDF features, or exceed the available memory. If it is password-protected, use Unlock PDF with a correct password you are authorized to use; otherwise try a readable copy or a smaller file.'],
      ['Will compression always reduce file size?', 'No. PDFs may already be compressed or be dominated by embedded images. The compressor reports actual sizes and avoids offering a larger output. Higher compression rasterizes pages and reduces text/image quality.'],
      ['Will PDF to Word preserve the layout?', 'Not exactly. Text positions and simple aligned rows are reconstructed. Complex columns, tables, forms, and scanned text may need manual correction.'],
      ['How do I save a generated file?', 'Use the tool’s Download button and choose a destination in your browser’s save dialog. If downloads are blocked, check the browser’s download permissions and try again.'],
      ['Do you use analytics or advertising cookies?', 'The inspected app has no configured analytics and no active advertising. It saves your language and theme preferences in browser storage, not in cookies. Hosting providers or future integrations may have separate storage or logging practices; see the Cookie Policy for details.'],
      ['Can I use a password-protected PDF?', 'Yes. Unlock PDF can remove supported opening-password encryption when you provide the correct password you are authorized to use. It supports AES-256 R6 and legacy RC4 R2/R3; other tools continue to reject encrypted inputs. Password guessing or recovery is not available. Protect PDF can create a password-protected output copy.']
    ]
  },
  es: {
    title: 'Preguntas frecuentes',
    intro: 'Respuestas prácticas sobre las herramientas PDF, sus límites y el procesamiento de archivos en el sitio.',
    description: 'Respuestas sobre herramientas PDF, procesamiento, descargas, compatibilidad y privacidad.',
    sectionLabel: 'Preguntas frecuentes',
    toolsLabel: 'Herramientas PDF',
    guidesLabel: 'Guías PDF',
    items: [
      ['¿Se suben mis archivos PDF?', 'Los documentos seleccionados se procesan en tu navegador y no se envían a un servidor de conversión. PDF a Word y OCR PDF usan recursos de Tesseract OCR incluidos en el sitio para reconocer páginas escaneadas; el reconocimiento también se ejecuta en tu navegador. El sitio solicita sus páginas y recursos, y las prácticas de registro dependen del proveedor de alojamiento.'],
      ['¿Cuántos archivos PDF puedo combinar?', 'Puedes combinar hasta cinco archivos PDF a la vez. Se necesitan al menos dos.'],
      ['¿Por qué puede no abrirse un PDF?', 'El archivo puede estar dañado, usar cifrado o funciones PDF no compatibles, o superar la memoria disponible. Si está protegido con contraseña, usa Desbloquear PDF con una contraseña correcta que estés autorizado a utilizar; también puedes probar una copia legible o un archivo más pequeño.'],
      ['¿La compresión siempre reduce el tamaño?', 'No. Algunos PDF ya están comprimidos o contienen principalmente imágenes incrustadas. Se informa del tamaño real y no se ofrece un resultado mayor como compresión. La compresión alta rasteriza las páginas y reduce la calidad del texto y las imágenes.'],
      ['¿PDF a Word conservará el diseño?', 'No exactamente. Se reconstruyen las posiciones del texto y las filas sencillas. Es posible que debas corregir columnas complejas, tablas, formularios y texto escaneado.'],
      ['¿Cómo guardo un archivo generado?', 'Pulsa Descargar en la herramienta y elige una ubicación en el diálogo del navegador. Si se bloquea la descarga, revisa los permisos del navegador e inténtalo de nuevo.'],
      ['¿Usan cookies de análisis o publicidad?', 'La aplicación revisada no tiene análisis integrado ni publicidad activa. Existe un cargador opcional de AdSense, pero no están configurados su activación, consentimiento, identificador de editor ni ubicaciones. El alojamiento y los recursos externos aún pueden recibir solicitudes; consulta sus políticas.'],
      ['¿Puedo usar un PDF protegido con contraseña?', 'Sí. Desbloquear PDF puede quitar el cifrado compatible si proporcionas una contraseña correcta que estés autorizado a usar. Admite AES-256 R6 y RC4 R2/R3; las demás herramientas rechazan archivos cifrados. No se adivinan ni recuperan contraseñas. Proteger PDF puede crear una copia protegida.']
    ]
  },
  fr: {
    title: 'Foire aux questions',
    intro: 'Des réponses pratiques sur les outils PDF, leurs limites et le traitement des fichiers par le site.',
    description: 'Réponses sur les outils PDF, le traitement, les téléchargements, la compatibilité et la confidentialité.',
    sectionLabel: 'Foire aux questions',
    toolsLabel: 'Outils PDF',
    guidesLabel: 'Guides PDF',
    items: [
      ['Mes fichiers PDF sont-ils envoyés ?', 'Les documents sélectionnés sont traités dans votre navigateur et ne sont pas envoyés à un serveur de conversion. PDF vers Word et OCR PDF utilisent des ressources Tesseract OCR intégrées au site pour reconnaître les pages numérisées ; la reconnaissance s’exécute aussi dans votre navigateur. Le site demande ses pages et ressources, et la conservation des journaux dépend de l’hébergeur.'],
      ['Combien de fichiers PDF puis-je fusionner ?', 'Vous pouvez fusionner jusqu’à cinq fichiers PDF à la fois. Deux fichiers au minimum sont requis.'],
      ['Pourquoi un PDF peut-il ne pas s’ouvrir ?', 'Le fichier peut être endommagé, utiliser un chiffrement ou des fonctions PDF non pris en charge, ou dépasser la mémoire disponible. S’il est protégé par mot de passe, utilisez Déverrouiller PDF avec un mot de passe correct que vous êtes autorisé à utiliser ; sinon, essayez une copie lisible ou un fichier plus petit.'],
      ['La compression réduit-elle toujours la taille ?', 'Non. Certains PDF sont déjà compressés ou contiennent surtout des images intégrées. La taille réelle est indiquée et un résultat plus volumineux n’est pas proposé comme compression. La compression élevée pixellise les pages et réduit la qualité du texte et des images.'],
      ['PDF vers Word conserve-t-il la mise en page ?', 'Pas exactement. Les positions du texte et les lignes simples sont reconstruites. Les colonnes complexes, tableaux, formulaires et textes numérisés peuvent nécessiter des corrections.'],
      ['Comment enregistrer un fichier généré ?', 'Cliquez sur Télécharger dans l’outil et choisissez un emplacement dans la boîte de dialogue du navigateur. Si le téléchargement est bloqué, vérifiez les autorisations du navigateur et réessayez.'],
      ['Utilisez-vous des cookies d’analyse ou de publicité ?', 'L’application examinée ne comporte ni intégration d’analyse ni publicité active. Un chargeur AdSense facultatif existe, mais son activation, le consentement, l’identifiant éditeur et les emplacements ne sont pas configurés. L’hébergeur et les ressources externes peuvent toujours recevoir des requêtes ; consultez leurs politiques.'],
      ['Puis-je utiliser un PDF protégé par mot de passe ?', 'Oui. Déverrouiller PDF peut retirer un chiffrement compatible si vous fournissez un mot de passe correct que vous êtes autorisé à utiliser. AES-256 R6 et RC4 R2/R3 sont pris en charge ; les autres outils refusent les fichiers chiffrés. Aucun mot de passe n’est deviné ni récupéré. Protéger PDF peut créer une copie protégée.']
    ]
  },
  de: {
    title: 'Häufig gestellte Fragen',
    intro: 'Praktische Antworten zu den PDF-Tools, ihren Grenzen und zur Dateiverarbeitung auf der Website.',
    description: 'Antworten zu PDF-Tools, Verarbeitung, Downloads, Kompatibilität und Datenschutz.',
    sectionLabel: 'Häufig gestellte Fragen',
    toolsLabel: 'PDF-Tools',
    guidesLabel: 'PDF-Anleitungen',
    items: [
      ['Werden meine PDF-Dateien hochgeladen?', 'Ausgewählte Dokumente werden in deinem Browser verarbeitet und nicht an einen Konvertierungsserver gesendet. PDF zu Word und OCR PDF verwenden eingebundene Tesseract-OCR-Ressourcen zur Erkennung gescannter Seiten; die Erkennung läuft ebenfalls im Browser. Die Website ruft ihre Seiten und Ressourcen ab. Die Protokollierung hängt vom Hostinganbieter ab.'],
      ['Wie viele PDF-Dateien kann ich zusammenfügen?', 'Du kannst bis zu fünf PDF-Dateien gleichzeitig zusammenfügen. Mindestens zwei Dateien sind erforderlich.'],
      ['Warum lässt sich ein PDF möglicherweise nicht öffnen?', 'Die Datei kann beschädigt sein, nicht unterstützte Verschlüsselung oder PDF-Funktionen verwenden oder den verfügbaren Speicher überschreiten. Bei Passwortschutz kannst du PDF entsperren mit einem korrekten Passwort verwenden, zu dessen Nutzung du berechtigt bist; andernfalls versuche eine lesbare Kopie oder eine kleinere Datei.'],
      ['Verringert die Komprimierung immer die Dateigröße?', 'Nein. Manche PDFs sind bereits komprimiert oder bestehen überwiegend aus eingebetteten Bildern. Die tatsächliche Größe wird angezeigt; eine größere Datei wird nicht als Komprimierung angeboten. Hohe Komprimierung rastert Seiten und mindert die Text- und Bildqualität.'],
      ['Bleibt das Layout bei PDF zu Word erhalten?', 'Nicht vollständig. Textpositionen und einfache ausgerichtete Zeilen werden rekonstruiert. Komplexe Spalten, Tabellen, Formulare und gescannter Text müssen möglicherweise manuell korrigiert werden.'],
      ['Wie speichere ich eine erzeugte Datei?', 'Klicke im Tool auf Herunterladen und wähle im Browser-Dialog einen Speicherort. Falls der Download blockiert wird, prüfe die Download-Berechtigungen des Browsers und versuche es erneut.'],
      ['Verwendet ihr Analyse- oder Werbe-Cookies?', 'In der geprüften App sind weder Analyse noch aktive Werbung integriert. Ein optionaler AdSense-Lader ist vorhanden, aber Aktivierung, Einwilligung, Publisher-ID und Platzierungen sind nicht eingerichtet. Hosting und externe Ressourcen können dennoch Anfragen erhalten; beachte deren Richtlinien.'],
      ['Kann ich ein passwortgeschütztes PDF verwenden?', 'Ja. PDF entsperren kann unterstützte Verschlüsselung entfernen, wenn du ein korrektes Passwort angibst, zu dessen Nutzung du berechtigt bist. AES-256 R6 und RC4 R2/R3 werden unterstützt; andere Tools lehnen verschlüsselte Dateien ab. Passwörter werden nicht erraten oder wiederhergestellt. PDF schützen kann eine geschützte Kopie erstellen.']
    ]
  },
  pt: {
    title: 'Perguntas frequentes',
    intro: 'Respostas práticas sobre as ferramentas de PDF, seus limites e o processamento de arquivos pelo site.',
    description: 'Respostas sobre ferramentas PDF, processamento, downloads, compatibilidade e privacidade.',
    sectionLabel: 'Perguntas frequentes',
    toolsLabel: 'Ferramentas PDF',
    guidesLabel: 'Guias de PDF',
    items: [
      ['Meus arquivos PDF são enviados?', 'Os documentos selecionados são processados no navegador e não são enviados a um servidor de conversão. PDF para Word e OCR PDF usam recursos do Tesseract OCR incluídos no site para reconhecer páginas digitalizadas; o reconhecimento também ocorre no navegador. O site solicita suas páginas e recursos, e os registros dependem do provedor de hospedagem.'],
      ['Quantos arquivos PDF posso mesclar?', 'Você pode mesclar até cinco arquivos PDF por vez. São necessários pelo menos dois.'],
      ['Por que um PDF pode não abrir?', 'O arquivo pode estar corrompido, usar criptografia ou recursos PDF não compatíveis ou exceder a memória disponível. Se estiver protegido por senha, use Desbloquear PDF com uma senha correta que você tenha autorização para usar; caso contrário, tente uma cópia legível ou um arquivo menor.'],
      ['A compactação sempre reduz o tamanho?', 'Não. Alguns PDFs já estão compactados ou contêm principalmente imagens incorporadas. O tamanho real é informado e um arquivo maior não é oferecido como resultado compactado. A compactação alta rasteriza as páginas e reduz a qualidade do texto e das imagens.'],
      ['PDF para Word preserva o layout?', 'Não exatamente. As posições do texto e linhas simples alinhadas são reconstruídas. Colunas complexas, tabelas, formulários e texto digitalizado podem exigir correção manual.'],
      ['Como salvo um arquivo gerado?', 'Clique em Baixar na ferramenta e escolha um local na janela do navegador. Se o download for bloqueado, verifique as permissões do navegador e tente novamente.'],
      ['Vocês usam cookies de análise ou publicidade?', 'O aplicativo analisado não tem integração de análise nem publicidade ativa. Existe um carregador opcional do AdSense, mas ativação, consentimento, ID do editor e posições não estão configurados. A hospedagem e recursos externos ainda podem receber solicitações; consulte as políticas aplicáveis.'],
      ['Posso usar um PDF protegido por senha?', 'Sim. Desbloquear PDF pode remover uma criptografia compatível se você fornecer uma senha correta que esteja autorizado a usar. Há suporte para AES-256 R6 e RC4 R2/R3; as outras ferramentas rejeitam arquivos criptografados. Senhas não são adivinhadas nem recuperadas. Proteger PDF pode criar uma cópia protegida.']
    ]
  },
  it: {
    title: 'Domande frequenti',
    intro: 'Risposte pratiche sugli strumenti PDF, sui loro limiti e sull’elaborazione dei file nel sito.',
    description: 'Risposte su strumenti PDF, elaborazione, download, compatibilità e privacy.',
    sectionLabel: 'Domande frequenti',
    toolsLabel: 'Strumenti PDF',
    guidesLabel: 'Guide PDF',
    items: [
      ['I miei file PDF vengono caricati?', 'I documenti selezionati vengono elaborati nel browser e non inviati a un server di conversione. PDF in Word e OCR PDF usano risorse Tesseract OCR incluse nel sito per riconoscere le pagine scansionate; il riconoscimento avviene nel browser. Il sito richiede le proprie pagine e risorse; i registri dipendono dal provider di hosting.'],
      ['Quanti file PDF posso unire?', 'Puoi unire fino a cinque file PDF alla volta. Ne servono almeno due.'],
      ['Perché un PDF potrebbe non aprirsi?', 'Il file potrebbe essere danneggiato, usare una crittografia o funzioni PDF non supportate oppure superare la memoria disponibile. Se è protetto da password, usa Sblocca PDF con una password corretta che sei autorizzato a usare; altrimenti prova una copia leggibile o un file più piccolo.'],
      ['La compressione riduce sempre le dimensioni?', 'No. Alcuni PDF sono già compressi o contengono soprattutto immagini incorporate. Viene indicata la dimensione effettiva e un file più grande non viene proposto come risultato compresso. La compressione elevata rasterizza le pagine e riduce la qualità di testo e immagini.'],
      ['PDF in Word mantiene l’impaginazione?', 'Non perfettamente. Vengono ricostruite le posizioni del testo e le righe semplici allineate. Colonne complesse, tabelle, moduli e testo scansionato potrebbero richiedere correzioni manuali.'],
      ['Come salvo un file generato?', 'Seleziona Scarica nello strumento e scegli una posizione nella finestra del browser. Se il download è bloccato, controlla le autorizzazioni del browser e riprova.'],
      ['Usate cookie di analisi o pubblicità?', 'L’app esaminata non integra strumenti di analisi né pubblicità attiva. È presente un caricatore AdSense facoltativo, ma attivazione, consenso, ID editore e posizioni non sono configurati. L’hosting e le risorse esterne possono comunque ricevere richieste; consulta le relative informative.'],
      ['Posso usare un PDF protetto da password?', 'Sì. Sblocca PDF può rimuovere la crittografia supportata se fornisci una password corretta che sei autorizzato a usare. Sono supportati AES-256 R6 e RC4 R2/R3; gli altri strumenti rifiutano i file crittografati. Le password non vengono indovinate né recuperate. Proteggi PDF può creare una copia protetta.']
    ]
  },
  nl: {
    title: 'Veelgestelde vragen',
    intro: 'Praktische antwoorden over de PDF-tools, hun beperkingen en hoe de website bestanden verwerkt.',
    description: 'Antwoorden over PDF-tools, verwerking, downloads, compatibiliteit en privacy.',
    sectionLabel: 'Veelgestelde vragen',
    toolsLabel: 'PDF-tools',
    guidesLabel: 'PDF-handleidingen',
    items: [
      ['Worden mijn PDF-bestanden geüpload?', 'Geselecteerde documenten worden in je browser verwerkt en niet naar een conversieserver gestuurd. PDF naar Word en OCR PDF gebruiken meegeleverde Tesseract OCR-bronnen voor gescande pagina’s; de herkenning gebeurt ook in je browser. De website vraagt pagina’s en bestanden op; logregistratie hangt af van de hostingprovider.'],
      ['Hoeveel PDF-bestanden kan ik samenvoegen?', 'Je kunt maximaal vijf PDF-bestanden tegelijk samenvoegen. Er zijn minstens twee bestanden nodig.'],
      ['Waarom kan een PDF mogelijk niet openen?', 'Het bestand kan beschadigd zijn, niet-ondersteunde versleuteling of PDF-functies gebruiken, of meer geheugen vereisen dan beschikbaar is. Gebruik bij wachtwoordbeveiliging PDF ontgrendelen met een correct wachtwoord dat je mag gebruiken; probeer anders een leesbare kopie of kleiner bestand.'],
      ['Verkleint compressie altijd het bestand?', 'Nee. Sommige PDF’s zijn al gecomprimeerd of bestaan vooral uit ingesloten afbeeldingen. De werkelijke grootte wordt getoond; een groter bestand wordt niet als compressieresultaat aangeboden. Hoge compressie rastert pagina’s en verlaagt de tekst- en beeldkwaliteit.'],
      ['Blijft de opmaak behouden bij PDF naar Word?', 'Niet exact. Tekstposities en eenvoudige uitgelijnde rijen worden gereconstrueerd. Complexe kolommen, tabellen, formulieren en gescande tekst kunnen handmatige correctie vereisen.'],
      ['Hoe sla ik een gegenereerd bestand op?', 'Klik op Downloaden in de tool en kies een locatie in het browservenster. Controleer bij een geblokkeerde download de browsermachtigingen en probeer het opnieuw.'],
      ['Gebruiken jullie analyse- of advertentiecookies?', 'De onderzochte app bevat geen analyse-integratie of actieve advertenties. Er is een optionele AdSense-lader, maar activering, toestemming, uitgevers-ID en advertentieposities zijn niet ingesteld. Hosting en externe bronnen kunnen wel verzoeken ontvangen; bekijk hun beleid.'],
      ['Kan ik een PDF met wachtwoordbeveiliging gebruiken?', 'Ja. PDF ontgrendelen kan ondersteunde versleuteling verwijderen als je een correct wachtwoord opgeeft dat je mag gebruiken. AES-256 R6 en RC4 R2/R3 worden ondersteund; andere tools weigeren versleutelde bestanden. Wachtwoorden worden niet geraden of hersteld. PDF beveiligen kan een beveiligde kopie maken.']
    ]
  },
  pl: {
    title: 'Często zadawane pytania',
    intro: 'Praktyczne odpowiedzi o narzędziach PDF, ich ograniczeniach i przetwarzaniu plików przez witrynę.',
    description: 'Odpowiedzi o narzędziach PDF, przetwarzaniu, pobieraniu, zgodności i prywatności.',
    sectionLabel: 'Często zadawane pytania',
    toolsLabel: 'Narzędzia PDF',
    guidesLabel: 'Poradniki PDF',
    items: [
      ['Czy moje pliki PDF są przesyłane?', 'Wybrane dokumenty są przetwarzane w przeglądarce i nie trafiają na serwer konwersji. PDF do Worda i OCR PDF korzystają z dołączonych do witryny zasobów Tesseract OCR do rozpoznawania skanów; samo rozpoznawanie również odbywa się w przeglądarce. Witryna pobiera swoje strony i zasoby, a rejestrowanie żądań zależy od hostingu.'],
      ['Ile plików PDF mogę połączyć?', 'Możesz połączyć maksymalnie pięć plików PDF naraz. Potrzebne są co najmniej dwa.'],
      ['Dlaczego plik PDF może się nie otworzyć?', 'Plik może być uszkodzony, używać nieobsługiwanego szyfrowania lub funkcji PDF albo przekraczać dostępną pamięć. Jeśli jest chroniony hasłem, użyj Odblokuj PDF z prawidłowym hasłem, którego wolno Ci użyć; w przeciwnym razie spróbuj czytelnej kopii lub mniejszego pliku.'],
      ['Czy kompresja zawsze zmniejsza rozmiar pliku?', 'Nie. Niektóre pliki PDF są już skompresowane lub zawierają głównie osadzone obrazy. Pokazujemy rzeczywisty rozmiar i nie oferujemy większego pliku jako wyniku kompresji. Wysoka kompresja rasteruje strony i obniża jakość tekstu oraz obrazów.'],
      ['Czy PDF do Worda zachowa układ strony?', 'Nie idealnie. Odtwarzane są pozycje tekstu i proste wyrównane wiersze. Złożone kolumny, tabele, formularze i skany mogą wymagać ręcznej korekty.'],
      ['Jak zapisać wygenerowany plik?', 'Kliknij Pobierz w narzędziu i wybierz lokalizację w oknie przeglądarki. Jeśli pobieranie jest blokowane, sprawdź uprawnienia przeglądarki i spróbuj ponownie.'],
      ['Czy używacie plików cookie do analityki lub reklam?', 'W sprawdzonej aplikacji nie ma integracji analitycznej ani aktywnych reklam. Istnieje opcjonalny skrypt AdSense, ale jego włączenie, zgoda, identyfikator wydawcy i miejsca reklamowe nie są skonfigurowane. Hosting i zasoby zewnętrzne nadal mogą otrzymywać żądania; sprawdź ich zasady.'],
      ['Czy mogę użyć pliku PDF chronionego hasłem?', 'Tak. Odblokuj PDF może usunąć obsługiwane szyfrowanie po podaniu prawidłowego hasła, którego wolno Ci użyć. Obsługiwane są AES-256 R6 i RC4 R2/R3; pozostałe narzędzia odrzucają zaszyfrowane pliki. Hasła nie są zgadywane ani odzyskiwane. Chroń PDF może utworzyć chronioną kopię.']
    ]
  },
  sv: {
    title: 'Vanliga frågor',
    intro: 'Praktiska svar om PDF-verktygen, deras begränsningar och hur webbplatsen behandlar filer.',
    description: 'Svar om PDF-verktyg, behandling, nedladdningar, kompatibilitet och integritet.',
    sectionLabel: 'Vanliga frågor',
    toolsLabel: 'PDF-verktyg',
    guidesLabel: 'PDF-guider',
    items: [
      ['Laddas mina PDF-filer upp?', 'Valda dokument behandlas i webbläsaren och skickas inte till en konverteringsserver. PDF till Word och OCR PDF använder medföljande Tesseract OCR-resurser för att känna igen skannade sidor; igenkänningen körs också i webbläsaren. Webbplatsen hämtar sina sidor och resurser, och loggning beror på webbhotellet.'],
      ['Hur många PDF-filer kan jag sammanfoga?', 'Du kan sammanfoga högst fem PDF-filer åt gången. Minst två filer krävs.'],
      ['Varför kanske en PDF inte går att öppna?', 'Filen kan vara skadad, använda kryptering eller PDF-funktioner som inte stöds eller överskrida tillgängligt minne. Om den är lösenordsskyddad kan du använda Lås upp PDF med ett korrekt lösenord som du har rätt att använda; annars kan du prova en läsbar kopia eller en mindre fil.'],
      ['Minskar komprimering alltid filstorleken?', 'Nej. Vissa PDF-filer är redan komprimerade eller består främst av inbäddade bilder. Den faktiska storleken visas, och en större fil erbjuds inte som komprimeringsresultat. Hög komprimering rasteriserar sidor och försämrar text- och bildkvaliteten.'],
      ['Bevaras layouten när PDF konverteras till Word?', 'Inte helt. Textpositioner och enkla justerade rader återskapas. Komplexa kolumner, tabeller, formulär och skannad text kan behöva korrigeras manuellt.'],
      ['Hur sparar jag en skapad fil?', 'Välj Ladda ned i verktyget och välj en plats i webbläsarens dialogruta. Om hämtningen blockeras kontrollerar du webbläsarens behörigheter och försöker igen.'],
      ['Använder ni analys- eller reklamcookies?', 'Den granskade appen har ingen analysintegration eller aktiv reklam. En valfri AdSense-laddare finns, men aktivering, samtycke, utgivar-ID och annonsplaceringar är inte konfigurerade. Webbhotellet och externa resurser kan ändå ta emot förfrågningar; läs deras policyer.'],
      ['Kan jag använda en lösenordsskyddad PDF?', 'Ja. Lås upp PDF kan ta bort kryptering som stöds om du anger ett korrekt lösenord som du har rätt att använda. AES-256 R6 och RC4 R2/R3 stöds; andra verktyg avvisar krypterade filer. Lösenord gissas eller återställs inte. Skydda PDF kan skapa en skyddad kopia.']
    ]
  },
  fi: {
    title: 'Usein kysytyt kysymykset',
    intro: 'Käytännön vastauksia PDF-työkaluista, niiden rajoituksista ja tiedostojen käsittelystä sivustolla.',
    description: 'Vastauksia PDF-työkaluista, käsittelystä, latauksista, yhteensopivuudesta ja tietosuojasta.',
    sectionLabel: 'Usein kysytyt kysymykset',
    toolsLabel: 'PDF-työkalut',
    guidesLabel: 'PDF-oppaat',
    items: [
      ['Ladataanko PDF-tiedostoni palvelimelle?', 'Valitut asiakirjat käsitellään selaimessa eikä niitä lähetetä muunnospalvelimelle. PDF Wordiksi ja OCR PDF käyttävät sivustoon sisältyviä Tesseract OCR -resursseja skannattujen sivujen tunnistamiseen; tunnistus tapahtuu myös selaimessa. Sivusto pyytää sivujaan ja resurssejaan, ja lokien säilytys riippuu palveluntarjoajasta.'],
      ['Kuinka monta PDF-tiedostoa voin yhdistää?', 'Voit yhdistää enintään viisi PDF-tiedostoa kerralla. Tiedostoja tarvitaan vähintään kaksi.'],
      ['Miksi PDF ei ehkä avaudu?', 'Tiedosto voi olla vioittunut, käyttää salausta tai PDF-ominaisuuksia, joita ei tueta, tai ylittää käytettävissä olevan muistin. Jos se on salasanalla suojattu, käytä Avaa PDF -työkalua oikealla salasanalla, jonka käyttöön sinulla on lupa; muuten kokeile luettavaa kopiota tai pienempää tiedostoa.'],
      ['Pienentääkö pakkaus aina tiedostokokoa?', 'Ei. Osa PDF-tiedostoista on jo pakattu tai sisältää enimmäkseen upotettuja kuvia. Todellinen koko näytetään, eikä suurempaa tiedostoa tarjota pakattuna tuloksena. Voimakas pakkaus rasteroi sivut ja heikentää tekstin ja kuvien laatua.'],
      ['Säilyykö asettelu PDF Wordiksi -muunnoksessa?', 'Ei täysin. Tekstin sijainnit ja yksinkertaiset tasatut rivit rekonstruoidaan. Monimutkaiset sarakkeet, taulukot, lomakkeet ja skannattu teksti saattavat vaatia manuaalista korjausta.'],
      ['Miten tallennan luodun tiedoston?', 'Valitse työkalusta Lataa ja valitse tallennuspaikka selaimen ikkunassa. Jos lataus estyy, tarkista selaimen latausluvat ja yritä uudelleen.'],
      ['Käytättekö analytiikka- tai mainosevästeitä?', 'Tarkistetussa sovelluksessa ei ole analytiikkaintegraatiota eikä aktiivista mainontaa. Valinnainen AdSense-lataaja on olemassa, mutta käyttöönottoa, suostumusta, julkaisijatunnusta ja mainospaikkoja ei ole määritetty. Palvelin ja ulkoiset resurssit voivat silti vastaanottaa pyyntöjä; tutustu niiden käytäntöihin.'],
      ['Voinko käyttää salasanalla suojattua PDF-tiedostoa?', 'Kyllä. Avaa PDF voi poistaa tuetun salauksen, kun annat oikean salasanan, jonka käyttöön sinulla on lupa. Tuettuja ovat AES-256 R6 ja RC4 R2/R3; muut työkalut hylkäävät salatut tiedostot. Salasanoja ei arvata eikä palauteta. Suojaa PDF voi luoda suojatun kopion.']
    ]
  },
  da: {
    title: 'Ofte stillede spørgsmål',
    intro: 'Praktiske svar om PDF-værktøjerne, deres begrænsninger, og hvordan webstedet behandler filer.',
    description: 'Svar om PDF-værktøjer, behandling, downloads, kompatibilitet og privatliv.',
    sectionLabel: 'Ofte stillede spørgsmål',
    toolsLabel: 'PDF-værktøjer',
    guidesLabel: 'PDF-vejledninger',
    items: [
      ['Uploades mine PDF-filer?', 'Valgte dokumenter behandles i browseren og sendes ikke til en konverteringsserver. PDF til Word og OCR PDF bruger medfølgende Tesseract OCR-ressourcer til at genkende scannede sider; genkendelsen kører også i browseren. Webstedet henter sine sider og ressourcer, og logning afhænger af hostingudbyderen.'],
      ['Hvor mange PDF-filer kan jeg flette?', 'Du kan flette op til fem PDF-filer ad gangen. Der kræves mindst to filer.'],
      ['Hvorfor kan en PDF muligvis ikke åbnes?', 'Filen kan være beskadiget, bruge kryptering eller PDF-funktioner, der ikke understøttes, eller overskride den tilgængelige hukommelse. Hvis den er adgangskodebeskyttet, kan du bruge Lås PDF op med en korrekt adgangskode, du har tilladelse til at bruge; ellers kan du prøve en læsbar kopi eller en mindre fil.'],
      ['Reducerer komprimering altid filstørrelsen?', 'Nej. Nogle PDF-filer er allerede komprimerede eller består primært af indlejrede billeder. Den faktiske størrelse vises, og en større fil tilbydes ikke som komprimeringsresultat. Høj komprimering rasteriserer sider og forringer tekst- og billedkvaliteten.'],
      ['Bevares layoutet ved PDF til Word?', 'Ikke helt. Tekstpositioner og enkle justerede rækker genskabes. Komplekse kolonner, tabeller, formularer og scannet tekst kan kræve manuel rettelse.'],
      ['Hvordan gemmer jeg en oprettet fil?', 'Vælg Download i værktøjet, og vælg en placering i browserens dialogboks. Hvis overførslen blokeres, skal du kontrollere browserens tilladelser og prøve igen.'],
      ['Bruger I analyse- eller reklamecookies?', 'Den gennemgåede app har ingen analyseintegration eller aktive annoncer. En valgfri AdSense-indlæser findes, men aktivering, samtykke, udgiver-id og annonceplaceringer er ikke konfigureret. Hosting og eksterne ressourcer kan stadig modtage anmodninger; se deres politikker.'],
      ['Kan jeg bruge en adgangskodebeskyttet PDF?', 'Ja. Lås PDF op kan fjerne understøttet kryptering, hvis du angiver en korrekt adgangskode, du har tilladelse til at bruge. AES-256 R6 og RC4 R2/R3 understøttes; andre værktøjer afviser krypterede filer. Adgangskoder gættes eller gendannes ikke. Beskyt PDF kan oprette en beskyttet kopi.']
    ]
  },
  nb: {
    title: 'Ofte stilte spørsmål',
    intro: 'Praktiske svar om PDF-verktøyene, begrensningene deres og hvordan nettstedet behandler filer.',
    description: 'Svar om PDF-verktøy, behandling, nedlastinger, kompatibilitet og personvern.',
    sectionLabel: 'Ofte stilte spørsmål',
    toolsLabel: 'PDF-verktøy',
    guidesLabel: 'PDF-veiledninger',
    items: [
      ['Lastes PDF-filene mine opp?', 'Valgte dokumenter behandles i nettleseren og sendes ikke til en konverteringsserver. PDF til Word og OCR PDF bruker medfølgende Tesseract OCR-ressurser for å gjenkjenne skannede sider; gjenkjenningen kjøres også i nettleseren. Nettstedet henter sider og ressurser, og logging avhenger av vertsleverandøren.'],
      ['Hvor mange PDF-filer kan jeg slå sammen?', 'Du kan slå sammen opptil fem PDF-filer om gangen. Minst to filer kreves.'],
      ['Hvorfor kan en PDF-fil ikke åpnes?', 'Filen kan være skadet, bruke kryptering eller PDF-funksjoner som ikke støttes, eller overskride tilgjengelig minne. Hvis den er passordbeskyttet, kan du bruke Lås opp PDF med et korrekt passord du har lov til å bruke; ellers kan du prøve en lesbar kopi eller en mindre fil.'],
      ['Reduserer komprimering alltid filstørrelsen?', 'Nei. Noen PDF-filer er allerede komprimert eller består hovedsakelig av innebygde bilder. Den faktiske størrelsen vises, og en større fil tilbys ikke som komprimert resultat. Høy komprimering rasteriserer sider og reduserer tekst- og bildekvaliteten.'],
      ['Bevares oppsettet når PDF konverteres til Word?', 'Ikke helt. Tekstposisjoner og enkle justerte rader bygges opp på nytt. Komplekse kolonner, tabeller, skjemaer og skannet tekst kan kreve manuell retting.'],
      ['Hvordan lagrer jeg en generert fil?', 'Velg Last ned i verktøyet og velg en plassering i nettleserens dialog. Hvis nedlastingen blokkeres, kontroller nettlesertillatelsene og prøv igjen.'],
      ['Bruker dere analyse- eller reklameinformasjonskapsler?', 'Den gjennomgåtte appen har ingen analyseintegrasjon eller aktive annonser. En valgfri AdSense-laster finnes, men aktivering, samtykke, utgiver-ID og annonseplasseringer er ikke konfigurert. Hosting og eksterne ressurser kan likevel motta forespørsler; se retningslinjene deres.'],
      ['Kan jeg bruke en passordbeskyttet PDF?', 'Ja. Lås opp PDF kan fjerne støttet kryptering hvis du oppgir et korrekt passord du har lov til å bruke. AES-256 R6 og RC4 R2/R3 støttes; andre verktøy avviser krypterte filer. Passord gjettes eller gjenopprettes ikke. Beskytt PDF kan lage en beskyttet kopi.']
    ]
  },
  tr: {
    title: 'Sık sorulan sorular',
    intro: 'PDF araçları, sınırları ve web sitesinin dosyaları nasıl işlediği hakkında pratik yanıtlar.',
    description: 'PDF araçları, işleme, indirme, uyumluluk ve gizlilik hakkında yanıtlar.',
    sectionLabel: 'Sık sorulan sorular',
    toolsLabel: 'PDF araçları',
    guidesLabel: 'PDF kılavuzları',
    items: [
      ['PDF dosyalarım yükleniyor mu?', 'Seçilen belgeler tarayıcınızda işlenir ve bir dönüştürme sunucusuna gönderilmez. PDF\'den Word\'e ve OCR PDF, taranmış sayfaları tanımak için siteye eklenmiş Tesseract OCR kaynaklarını kullanır; tanıma işlemi de tarayıcınızda çalışır. Site kendi sayfalarını ve kaynaklarını ister; günlük kayıtları barındırma sağlayıcısına bağlıdır.'],
      ['Kaç PDF dosyasını birleştirebilirim?', 'Aynı anda en fazla beş PDF dosyasını birleştirebilirsiniz. En az iki dosya gerekir.'],
      ['Bir PDF neden açılmayabilir?', 'Dosya bozuk olabilir, desteklenmeyen şifreleme veya PDF özellikleri kullanabilir ya da kullanılabilir belleği aşabilir. Parolayla korunuyorsa, kullanmaya yetkili olduğunuz doğru parolayla PDF\'nin Kilidini Aç aracını kullanın; aksi hâlde okunabilir bir kopyayı veya daha küçük bir dosyayı deneyin.'],
      ['Sıkıştırma dosya boyutunu her zaman azaltır mı?', 'Hayır. Bazı PDF\'ler zaten sıkıştırılmıştır veya çoğunlukla gömülü görseller içerir. Gerçek boyut gösterilir ve daha büyük bir dosya sıkıştırılmış sonuç olarak sunulmaz. Yüksek sıkıştırma sayfaları rasterleştirir ve metin/görsel kalitesini düşürür.'],
      ['PDF\'den Word\'e dönüştürme düzeni korur mu?', 'Tam olarak değil. Metin konumları ve basit hizalı satırlar yeniden oluşturulur. Karmaşık sütunlar, tablolar, formlar ve taranmış metin elle düzeltilmek zorunda kalabilir.'],
      ['Oluşturulan dosyayı nasıl kaydederim?', 'Araçta İndir düğmesine basın ve tarayıcı iletişim kutusunda bir konum seçin. İndirme engellenirse tarayıcı izinlerini kontrol edip yeniden deneyin.'],
      ['Analiz veya reklam çerezleri kullanıyor musunuz?', 'İncelenen uygulamada analiz entegrasyonu veya etkin reklam bulunmuyor. İsteğe bağlı bir AdSense yükleyicisi var ancak etkinleştirme, izin, yayıncı kimliği ve reklam yerleşimleri ayarlanmamış. Barındırma ve harici kaynaklar yine de istek alabilir; ilgili politikalarını inceleyin.'],
      ['Parolayla korunan bir PDF kullanabilir miyim?', 'Evet. PDF\'nin Kilidini Aç, kullanmaya yetkili olduğunuz doğru parolayı verdiğinizde desteklenen şifrelemeyi kaldırabilir. AES-256 R6 ve RC4 R2/R3 desteklenir; diğer araçlar şifrelenmiş dosyaları reddeder. Parolalar tahmin edilmez veya kurtarılmaz. PDF\'yi Koru korumalı bir kopya oluşturabilir.']
    ]
  },
  ru: {
    title: 'Часто задаваемые вопросы',
    intro: 'Практические ответы о PDF-инструментах, их ограничениях и обработке файлов на сайте.',
    description: 'Ответы о PDF-инструментах, обработке, загрузках, совместимости и конфиденциальности.',
    sectionLabel: 'Часто задаваемые вопросы',
    toolsLabel: 'PDF-инструменты',
    guidesLabel: 'Руководства по PDF',
    items: [
      ['Мои PDF-файлы загружаются на сервер?', 'Выбранные документы обрабатываются в браузере и не отправляются на сервер конвертации. PDF в Word и OCR PDF используют включённые в сайт ресурсы Tesseract OCR для распознавания отсканированных страниц; распознавание также выполняется в браузере. Сайт запрашивает свои страницы и ресурсы, а хранение журналов зависит от хостинг-провайдера.'],
      ['Сколько PDF-файлов можно объединить?', 'За один раз можно объединить до пяти PDF-файлов. Требуется не менее двух файлов.'],
      ['Почему PDF может не открыться?', 'Файл может быть повреждён, использовать неподдерживаемое шифрование или функции PDF либо превышать доступную память. Если он защищён паролем, используйте «Разблокировать PDF» с правильным паролем, которым вы вправе пользоваться; иначе попробуйте читаемую копию или файл меньшего размера.'],
      ['Всегда ли сжатие уменьшает размер файла?', 'Нет. Некоторые PDF уже сжаты или состоят главным образом из встроенных изображений. Показывается фактический размер, и увеличенный файл не предлагается как результат сжатия. Высокое сжатие растеризует страницы и ухудшает качество текста и изображений.'],
      ['Сохранится ли макет при преобразовании PDF в Word?', 'Не полностью. Восстанавливаются позиции текста и простые выровненные строки. Сложные колонки, таблицы, формы и отсканированный текст могут потребовать ручной правки.'],
      ['Как сохранить созданный файл?', 'Нажмите «Скачать» в инструменте и выберите папку в диалоге браузера. Если загрузка заблокирована, проверьте разрешения браузера и попробуйте снова.'],
      ['Используете ли вы файлы cookie аналитики или рекламы?', 'В проверенном приложении нет интеграции аналитики и активной рекламы. Необязательный загрузчик AdSense присутствует, но его включение, согласие, идентификатор издателя и рекламные места не настроены. Хостинг и внешние ресурсы всё равно могут получать запросы; изучите их правила.'],
      ['Можно ли использовать PDF, защищённый паролем?', 'Да. «Разблокировать PDF» удаляет поддерживаемое шифрование, если вы укажете правильный пароль, которым вправе пользоваться. Поддерживаются AES-256 R6 и RC4 R2/R3; остальные инструменты отклоняют зашифрованные файлы. Пароли не подбираются и не восстанавливаются. «Защитить PDF» может создать защищённую копию.']
    ]
  },
  uk: {
    title: 'Поширені запитання',
    intro: 'Практичні відповіді про PDF-інструменти, їхні обмеження та обробку файлів на сайті.',
    description: 'Відповіді про PDF-інструменти, обробку, завантаження, сумісність і конфіденційність.',
    sectionLabel: 'Поширені запитання',
    toolsLabel: 'PDF-інструменти',
    guidesLabel: 'Посібники з PDF',
    items: [
      ['Мої PDF-файли завантажуються на сервер?', 'Вибрані документи обробляються у браузері й не надсилаються на сервер конвертації. PDF у Word і OCR PDF використовують вбудовані ресурси Tesseract OCR для розпізнавання сканованих сторінок; розпізнавання також виконується у браузері. Сайт запитує власні сторінки та ресурси, а зберігання журналів залежить від хостингу.'],
      ['Скільки PDF-файлів можна об’єднати?', 'За один раз можна об’єднати до п’яти PDF-файлів. Потрібно щонайменше два файли.'],
      ['Чому PDF може не відкритися?', 'Файл може бути пошкодженим, використовувати непідтримуване шифрування чи функції PDF або перевищувати доступний обсяг пам’яті. Якщо файл захищено паролем, скористайтеся «Розблокувати PDF» із правильним паролем, яким ви маєте право користуватися; інакше спробуйте читабельну копію чи менший файл.'],
      ['Чи завжди стиснення зменшує розмір файлу?', 'Ні. Деякі PDF уже стиснуті або містять переважно вбудовані зображення. Показується фактичний розмір, а більший файл не пропонується як результат стиснення. Високе стиснення растеризує сторінки та погіршує якість тексту й зображень.'],
      ['Чи збереже PDF у Word початкове компонування?', 'Не повністю. Відтворюються позиції тексту й прості вирівняні рядки. Складні колонки, таблиці, форми та сканований текст можуть потребувати ручного виправлення.'],
      ['Як зберегти створений файл?', 'Натисніть «Завантажити» в інструменті та виберіть папку у вікні браузера. Якщо завантаження заблоковано, перевірте дозволи браузера й спробуйте ще раз.'],
      ['Чи використовуєте ви аналітичні або рекламні файли cookie?', 'У перевіреній програмі немає інтеграції аналітики чи активної реклами. Необов’язковий завантажувач AdSense є, але його активацію, згоду, ідентифікатор видавця та рекламні місця не налаштовано. Хостинг і зовнішні ресурси все одно можуть отримувати запити; ознайомтеся з їхніми правилами.'],
      ['Чи можна використовувати PDF, захищений паролем?', 'Так. «Розблокувати PDF» може зняти підтримуване шифрування, якщо ви надасте правильний пароль, яким маєте право користуватися. Підтримуються AES-256 R6 і RC4 R2/R3; інші інструменти відхиляють зашифровані файли. Паролі не підбираються й не відновлюються. «Захистити PDF» може створити захищену копію.']
    ]
  },
  ar: {
    title: 'الأسئلة الشائعة',
    intro: 'إجابات عملية حول أدوات PDF وحدودها وكيفية معالجة الموقع للملفات.',
    description: 'إجابات حول أدوات PDF والمعالجة والتنزيل والتوافق والخصوصية.',
    sectionLabel: 'الأسئلة الشائعة',
    toolsLabel: 'أدوات PDF',
    guidesLabel: 'أدلة PDF',
    items: [
      ['هل تُرفع ملفات PDF الخاصة بي؟', 'تُعالج المستندات المحددة في متصفحك ولا تُرسل إلى خادم تحويل. تستخدم أداتا PDF إلى Word وOCR PDF موارد Tesseract OCR المضمّنة في الموقع للتعرّف على الصفحات الممسوحة؛ ويجري التعرّف أيضًا في متصفحك. يطلب الموقع صفحاته وموارده، وتعتمد سجلات الاستضافة على مزوّد الخدمة.'],
      ['كم ملف PDF يمكنني دمجه؟', 'يمكنك دمج ما يصل إلى خمسة ملفات PDF في المرة الواحدة. يلزم ملفان على الأقل.'],
      ['لماذا قد يتعذر فتح ملف PDF؟', 'قد يكون الملف تالفًا، أو يستخدم تشفيرًا أو ميزات PDF غير مدعومة، أو يتجاوز الذاكرة المتاحة. إذا كان محميًا بكلمة مرور، فاستخدم أداة إلغاء قفل PDF بكلمة مرور صحيحة ومصرّح لك باستخدامها؛ وإلا فجرّب نسخة قابلة للقراءة أو ملفًا أصغر.'],
      ['هل يقلّل الضغط حجم الملف دائمًا؟', 'لا. قد تكون بعض ملفات PDF مضغوطة أصلًا أو تتكون أساسًا من صور مضمنة. يُعرض الحجم الفعلي ولا يُقدّم ملف أكبر كنتيجة ضغط. يحوّل الضغط العالي الصفحات إلى صور نقطية ويقلل جودة النص والصور.'],
      ['هل يحافظ التحويل من PDF إلى Word على التنسيق؟', 'ليس تمامًا. تُعاد بناء مواضع النص والصفوف البسيطة المحاذاة. قد تحتاج الأعمدة المعقدة والجداول والنماذج والنص الممسوح ضوئيًا إلى تصحيح يدوي.'],
      ['كيف أحفظ ملفًا تم إنشاؤه؟', 'استخدم زر التنزيل في الأداة واختر موقعًا في نافذة المتصفح. إذا مُنع التنزيل، فتحقق من أذونات التنزيل في المتصفح وحاول مرة أخرى.'],
      ['هل تستخدمون ملفات تعريف ارتباط للتحليلات أو الإعلانات؟', 'لا يتضمن التطبيق الذي تمت مراجعته تكاملًا للتحليلات أو إعلانات نشطة. يوجد محمّل AdSense اختياري، لكن التفعيل والموافقة ومعرّف الناشر ومواضع الإعلانات غير مهيأة. قد يستقبل المضيف والموارد الخارجية طلبات؛ راجع سياساتها.'],
      ['هل يمكنني استخدام PDF محمي بكلمة مرور؟', 'نعم. يمكن لأداة إلغاء قفل PDF إزالة التشفير المدعوم عند تقديم كلمة مرور صحيحة ومصرّح لك باستخدامها. تدعم AES-256 R6 وRC4 R2/R3؛ وترفض الأدوات الأخرى الملفات المشفرة. لا يتم تخمين كلمات المرور أو استعادتها. ويمكن لأداة حماية PDF إنشاء نسخة محمية.']
    ]
  },
  hi: {
    title: 'अक्सर पूछे जाने वाले प्रश्न',
    intro: 'PDF टूल, उनकी सीमाओं और वेबसाइट द्वारा फ़ाइलों को संसाधित करने के बारे में व्यावहारिक उत्तर।',
    description: 'PDF टूल, प्रोसेसिंग, डाउनलोड, संगतता और गोपनीयता के बारे में उत्तर।',
    sectionLabel: 'अक्सर पूछे जाने वाले प्रश्न',
    toolsLabel: 'PDF टूल',
    guidesLabel: 'PDF गाइड',
    items: [
      ['क्या मेरी PDF फ़ाइलें अपलोड होती हैं?', 'चुने गए दस्तावेज़ आपके ब्राउज़र में संसाधित होते हैं और किसी रूपांतरण सर्वर पर नहीं भेजे जाते। PDF से Word और OCR PDF स्कैन किए गए पृष्ठों को पहचानने के लिए वेबसाइट में शामिल Tesseract OCR संसाधनों का उपयोग करते हैं; पहचान भी ब्राउज़र में होती है। वेबसाइट अपने पृष्ठ और संसाधन मांगती है, और लॉग रखने की नीति होस्टिंग प्रदाता पर निर्भर करती है।'],
      ['मैं कितनी PDF फ़ाइलें जोड़ सकता हूँ?', 'आप एक बार में अधिकतम पाँच PDF फ़ाइलें जोड़ सकते हैं। कम से कम दो फ़ाइलें आवश्यक हैं।'],
      ['PDF क्यों नहीं खुल सकती?', 'फ़ाइल खराब हो सकती है, असमर्थित एन्क्रिप्शन या PDF सुविधाओं का उपयोग कर सकती है, या उपलब्ध मेमोरी से बड़ी हो सकती है। पासवर्ड-सुरक्षित होने पर, सही और उपयोग की अनुमति वाले पासवर्ड के साथ PDF अनलॉक करें; अन्यथा पढ़ने योग्य प्रति या छोटी फ़ाइल आज़माएँ।'],
      ['क्या संपीड़न हमेशा फ़ाइल का आकार घटाता है?', 'नहीं। कुछ PDF पहले से संपीड़ित होती हैं या उनमें मुख्यतः एम्बेड की गई छवियाँ होती हैं। वास्तविक आकार दिखाया जाता है और बड़ी फ़ाइल को संपीड़ित परिणाम के रूप में नहीं दिया जाता। उच्च संपीड़न पृष्ठों को रास्टर छवियों में बदलता है और पाठ/छवि की गुणवत्ता घटाता है।'],
      ['क्या PDF से Word में लेआउट बना रहता है?', 'पूरी तरह नहीं। पाठ की स्थिति और सरल संरेखित पंक्तियाँ फिर से बनाई जाती हैं। जटिल कॉलम, तालिकाओं, फ़ॉर्म और स्कैन किए गए पाठ को हाथ से सुधारना पड़ सकता है।'],
      ['बनाई गई फ़ाइल कैसे सहेजूँ?', 'टूल में डाउनलोड बटन चुनें और ब्राउज़र संवाद में स्थान चुनें। डाउनलोड अवरुद्ध होने पर ब्राउज़र की डाउनलोड अनुमतियाँ जाँचें और फिर प्रयास करें।'],
      ['क्या आप विश्लेषण या विज्ञापन कुकीज़ का उपयोग करते हैं?', 'जाँचे गए ऐप में विश्लेषण एकीकरण या सक्रिय विज्ञापन नहीं हैं। वैकल्पिक AdSense लोडर मौजूद है, लेकिन सक्रियण, सहमति, प्रकाशक आईडी और विज्ञापन स्थान सेट नहीं हैं। होस्ट और बाहरी संसाधनों को फिर भी अनुरोध मिल सकते हैं; उनकी नीतियाँ देखें।'],
      ['क्या मैं पासवर्ड-सुरक्षित PDF इस्तेमाल कर सकता हूँ?', 'हाँ। सही और उपयोग की अनुमति वाले पासवर्ड से PDF अनलॉक समर्थित एन्क्रिप्शन हटा सकता है। AES-256 R6 और RC4 R2/R3 समर्थित हैं; अन्य टूल एन्क्रिप्टेड फ़ाइलें अस्वीकार करते हैं। पासवर्ड का अनुमान या पुनर्प्राप्ति नहीं की जाती। PDF सुरक्षित करें एक सुरक्षित प्रति बना सकता है।']
    ]
  },
  ja: {
    title: 'よくある質問',
    intro: 'PDF ツールの使い方や制限、ウェブサイトでのファイル処理についての実用的な回答です。',
    description: 'PDF ツール、処理、ダウンロード、互換性、プライバシーに関する回答です。',
    sectionLabel: 'よくある質問',
    toolsLabel: 'PDF ツール',
    guidesLabel: 'PDF ガイド',
    items: [
      ['PDF ファイルはアップロードされますか？', '選択した文書はブラウザー内で処理され、変換サーバーには送信されません。PDF から Word と OCR PDF は、スキャンページの認識にサイト内蔵の Tesseract OCR リソースを使い、認識処理もブラウザーで行います。サイトのページやリソースへの通信は発生し、ログの扱いはホスティング事業者によります。'],
      ['一度に何個の PDF を結合できますか？', '一度に最大 5 個の PDF を結合できます。最低 2 個必要です。'],
      ['PDF が開けないのはなぜですか？', 'ファイルが破損している、未対応の暗号化や PDF 機能を使っている、または利用可能なメモリを超えている可能性があります。パスワード保護されている場合は、使用を許可された正しいパスワードで PDF のロック解除を使ってください。それ以外は、読み取り可能なコピーか小さいファイルをお試しください。'],
      ['圧縮すると必ずファイルサイズが小さくなりますか？', 'いいえ。すでに圧縮済み、または埋め込み画像が大半の PDF もあります。実際のサイズを表示し、サイズが大きくなるファイルは圧縮結果として提供しません。高圧縮ではページをラスタライズするため、文字や画像の品質が低下します。'],
      ['PDF から Word に変換するとレイアウトは保たれますか？', '完全には保たれません。文字の位置や単純な整列行は再構成されます。複雑な段組み、表、フォーム、スキャン文字は手作業で修正が必要な場合があります。'],
      ['作成したファイルを保存するには？', 'ツールのダウンロードボタンを押し、ブラウザーのダイアログで保存先を選択してください。ダウンロードがブロックされた場合は、ブラウザーの権限を確認して再試行してください。'],
      ['分析や広告の Cookie を使用していますか？', '確認したアプリには分析機能や有効な広告はありません。任意の AdSense ローダーはありますが、有効化、同意、パブリッシャー ID、広告枠は設定されていません。ホスティングや外部リソースへの通信は発生するため、それぞれのポリシーをご確認ください。'],
      ['パスワード保護された PDF を使えますか？', 'はい。使用を許可された正しいパスワードを入力すれば、PDF のロック解除で対応する暗号化を解除できます。AES-256 R6 と RC4 R2/R3 に対応し、ほかのツールは暗号化ファイルを拒否します。パスワードの推測や復元は行いません。PDF の保護では保護されたコピーを作成できます。']
    ]
  },
  ko: {
    title: '자주 묻는 질문',
    intro: 'PDF 도구의 사용 방법과 제한 사항, 웹사이트의 파일 처리 방식에 대한 실용적인 답변입니다.',
    description: 'PDF 도구, 처리, 다운로드, 호환성 및 개인정보 보호에 대한 답변입니다.',
    sectionLabel: '자주 묻는 질문',
    toolsLabel: 'PDF 도구',
    guidesLabel: 'PDF 가이드',
    items: [
      ['PDF 파일이 업로드되나요?', '선택한 문서는 브라우저에서 처리되며 변환 서버로 전송되지 않습니다. PDF를 Word로 및 OCR PDF는 스캔 페이지 인식에 사이트에 포함된 Tesseract OCR 리소스를 사용하며, 인식도 브라우저에서 실행됩니다. 사이트 페이지와 리소스 요청은 발생하며 로그 보관은 호스팅 업체 정책에 따릅니다.'],
      ['PDF 파일을 몇 개까지 병합할 수 있나요?', '한 번에 최대 5개의 PDF 파일을 병합할 수 있습니다. 최소 2개가 필요합니다.'],
      ['PDF가 열리지 않는 이유는 무엇인가요?', '파일이 손상되었거나 지원되지 않는 암호화 또는 PDF 기능을 사용하거나 사용 가능한 메모리를 초과했을 수 있습니다. 암호로 보호된 파일은 사용 권한이 있는 올바른 암호로 PDF 잠금 해제를 사용하세요. 그렇지 않으면 읽을 수 있는 사본이나 더 작은 파일을 시도하세요.'],
      ['압축하면 항상 파일 크기가 줄어드나요?', '아니요. 일부 PDF는 이미 압축되어 있거나 대부분 포함된 이미지로 이루어져 있습니다. 실제 크기를 표시하며 더 큰 파일은 압축 결과로 제공하지 않습니다. 높은 압축은 페이지를 래스터화해 텍스트와 이미지 품질을 낮춥니다.'],
      ['PDF를 Word로 변환하면 레이아웃이 유지되나요?', '완벽하게 유지되지는 않습니다. 텍스트 위치와 단순한 정렬 행은 재구성됩니다. 복잡한 열, 표, 양식, 스캔된 텍스트는 수동 수정이 필요할 수 있습니다.'],
      ['생성한 파일은 어떻게 저장하나요?', '도구에서 다운로드를 누르고 브라우저 대화상자에서 저장 위치를 선택하세요. 다운로드가 차단되면 브라우저 권한을 확인하고 다시 시도하세요.'],
      ['분석 또는 광고 쿠키를 사용하나요?', '검토한 앱에는 분석 통합이나 활성 광고가 없습니다. 선택 사항인 AdSense 로더는 있지만 활성화, 동의, 게시자 ID 및 광고 게재 위치는 설정되지 않았습니다. 호스팅과 외부 리소스는 요청을 받을 수 있으므로 해당 정책을 확인하세요.'],
      ['암호로 보호된 PDF를 사용할 수 있나요?', '예. 사용 권한이 있는 올바른 암호를 입력하면 PDF 잠금 해제가 지원되는 암호화를 제거할 수 있습니다. AES-256 R6 및 RC4 R2/R3을 지원하며 다른 도구는 암호화된 파일을 거부합니다. 암호를 추측하거나 복구하지 않습니다. PDF 보호로 보호된 사본을 만들 수 있습니다.']
    ]
  },
  'zh-CN': {
    title: '常见问题',
    intro: '关于 PDF 工具的使用方法、限制以及网站如何处理文件的实用解答。',
    description: '关于 PDF 工具、文件处理、下载、兼容性和隐私的解答。',
    sectionLabel: '常见问题',
    toolsLabel: 'PDF 工具',
    guidesLabel: 'PDF 指南',
    items: [
      ['我的 PDF 文件会上传吗？', '所选文档在浏览器中处理，不会发送到转换服务器。PDF 转 Word 和 OCR PDF 使用网站内置的 Tesseract OCR 资源识别扫描页面，识别过程也在浏览器中运行。网站仍会请求自身页面和资源，日志保留方式取决于托管服务商。'],
      ['一次可以合并多少个 PDF 文件？', '一次最多可合并五个 PDF 文件，至少需要两个。'],
      ['为什么 PDF 可能无法打开？', '文件可能已损坏、使用了不受支持的加密或 PDF 功能，或者超出可用内存。如果文件受密码保护，请使用您有权使用的正确密码通过“解锁 PDF”处理；也可以尝试可读取的副本或较小的文件。'],
      ['压缩一定会减小文件大小吗？', '不一定。有些 PDF 已经压缩，或主要由嵌入图片构成。页面会显示实际大小，不会把更大的文件作为压缩结果提供。高压缩会将页面栅格化，从而降低文字和图像质量。'],
      ['PDF 转 Word 会保留原有版式吗？', '不能完全保留。系统会重建文字位置和简单的对齐行。复杂分栏、表格、表单及扫描文字可能需要手动修正。'],
      ['如何保存生成的文件？', '点击工具中的“下载”，并在浏览器对话框中选择保存位置。如果下载被阻止，请检查浏览器下载权限后重试。'],
      ['你们会使用分析或广告 Cookie 吗？', '经检查的应用没有集成分析功能，也没有启用广告。虽然存在可选的 AdSense 加载器，但尚未设置启用状态、同意状态、发布商 ID 或广告位。托管服务和外部资源仍可能收到请求；请查看其适用政策。'],
      ['可以使用受密码保护的 PDF 吗？', '可以。“解锁 PDF”可在您提供有权使用的正确密码后移除受支持的加密。支持 AES-256 R6 和 RC4 R2/R3；其他工具会拒绝加密文件。不会猜测或恢复密码。“保护 PDF”可创建受密码保护的副本。']
    ]
  }
};

const offlineFaqTranslations = {
  en: ['Can I use the tools offline?', 'Offline use is not guaranteed. The website must load in your browser, and a connection may be needed to open or reload it. Supported PDF operations run on your device after the page loads; your document is not sent to a conversion server.'],
  es: ['¿Puedo usar las herramientas sin conexión?', 'No se garantiza el uso sin conexión. El sitio debe cargarse en el navegador y puede que necesites conexión para abrirlo o volver a cargarlo. Las operaciones PDF compatibles se ejecutan en tu dispositivo una vez cargada la página; tu documento no se envía a un servidor de conversión.'],
  fr: ['Puis-je utiliser les outils hors ligne ?', 'L’utilisation hors ligne n’est pas garantie. Le site doit se charger dans votre navigateur et une connexion peut être nécessaire pour l’ouvrir ou le recharger. Une fois la page chargée, les opérations PDF prises en charge s’exécutent sur votre appareil ; votre document n’est pas envoyé à un serveur de conversion.'],
  de: ['Kann ich die Tools offline verwenden?', 'Die Offline-Nutzung wird nicht garantiert. Die Website muss im Browser geladen werden; zum Öffnen oder erneuten Laden kann eine Verbindung nötig sein. Unterstützte PDF-Vorgänge laufen nach dem Laden der Seite auf Ihrem Gerät; das Dokument wird nicht an einen Konvertierungsserver gesendet.'],
  pt: ['Posso usar as ferramentas sem conexão?', 'O uso sem conexão não é garantido. O site precisa ser carregado no navegador, e pode ser necessária uma conexão para abri-lo ou recarregá-lo. Depois que a página carrega, as operações PDF compatíveis são executadas no dispositivo; o documento não é enviado a um servidor de conversão.'],
  it: ['Posso usare gli strumenti offline?', 'L’uso offline non è garantito. Il sito deve essere caricato nel browser e potrebbe servire una connessione per aprirlo o ricaricarlo. Dopo il caricamento della pagina, le operazioni PDF supportate vengono eseguite sul dispositivo; il documento non viene inviato a un server di conversione.'],
  nl: ['Kan ik de tools offline gebruiken?', 'Offline gebruik is niet gegarandeerd. De website moet in je browser worden geladen en er kan een verbinding nodig zijn om de website te openen of opnieuw te laden. Ondersteunde PDF-bewerkingen worden na het laden op je apparaat uitgevoerd; je document wordt niet naar een conversieserver gestuurd.'],
  pl: ['Czy mogę korzystać z narzędzi offline?', 'Działanie offline nie jest gwarantowane. Witryna musi załadować się w przeglądarce, a do jej otwarcia lub ponownego załadowania może być potrzebne połączenie. Obsługiwane operacje PDF są wykonywane na urządzeniu po załadowaniu strony; dokument nie jest wysyłany na serwer konwersji.'],
  sv: ['Kan jag använda verktygen offline?', 'Offlineanvändning garanteras inte. Webbplatsen måste läsas in i webbläsaren och en anslutning kan behövas för att öppna eller läsa in den igen. PDF-åtgärder som stöds körs på din enhet när sidan har lästs in; dokumentet skickas inte till en konverteringsserver.'],
  fi: ['Voinko käyttää työkaluja offline-tilassa?', 'Offline-käyttöä ei taata. Sivusto on ladattava selaimeen, ja sen avaamiseen tai uudelleenlataamiseen voidaan tarvita verkkoyhteys. Tuetut PDF-toiminnot suoritetaan laitteellasi sivun latauduttua; asiakirjaa ei lähetetä muunnospalvelimelle.'],
  da: ['Kan jeg bruge værktøjerne offline?', 'Offlinebrug er ikke garanteret. Webstedet skal indlæses i browseren, og der kan være brug for en forbindelse for at åbne eller genindlæse det. Understøttede PDF-handlinger udføres på din enhed, når siden er indlæst; dokumentet sendes ikke til en konverteringsserver.'],
  nb: ['Kan jeg bruke verktøyene uten nett?', 'Bruk uten nett er ikke garantert. Nettstedet må lastes inn i nettleseren, og det kan være nødvendig med en tilkobling for å åpne eller laste det inn på nytt. Støttede PDF-operasjoner kjøres på enheten etter at siden er lastet inn; dokumentet sendes ikke til en konverteringsserver.'],
  tr: ['Araçları çevrimdışı kullanabilir miyim?', 'Çevrimdışı kullanım garanti edilmez. Web sitesinin tarayıcıya yüklenmesi gerekir; siteyi açmak veya yeniden yüklemek için bağlantı gerekebilir. Desteklenen PDF işlemleri sayfa yüklendikten sonra cihazınızda çalışır; belgeniz bir dönüştürme sunucusuna gönderilmez.'],
  ru: ['Можно ли пользоваться инструментами без интернета?', 'Работа без интернета не гарантируется. Сайт должен загрузиться в браузере; для его открытия или повторной загрузки может понадобиться подключение. Поддерживаемые операции с PDF выполняются на устройстве после загрузки страницы; документ не отправляется на сервер конвертации.'],
  uk: ['Чи можна користуватися інструментами офлайн?', 'Офлайн-робота не гарантується. Сайт має завантажитися у браузері, а для його відкриття чи повторного завантаження може знадобитися підключення. Підтримувані операції з PDF виконуються на вашому пристрої після завантаження сторінки; документ не надсилається на сервер конвертації.'],
  ar: ['هل يمكنني استخدام الأدوات دون اتصال بالإنترنت؟', 'لا نضمن العمل دون اتصال. يجب تحميل الموقع في المتصفح، وقد يلزم الاتصال لفتحه أو إعادة تحميله. تُنفَّذ عمليات PDF المدعومة على جهازك بعد تحميل الصفحة؛ ولا يُرسل المستند إلى خادم تحويل.'],
  hi: ['क्या मैं इन टूल का उपयोग ऑफ़लाइन कर सकता हूँ?', 'ऑफ़लाइन उपयोग की गारंटी नहीं है। वेबसाइट को ब्राउज़र में लोड होना चाहिए और उसे खोलने या फिर से लोड करने के लिए कनेक्शन की आवश्यकता हो सकती है। पेज लोड होने के बाद समर्थित PDF प्रक्रियाएँ आपके डिवाइस पर चलती हैं; दस्तावेज़ किसी रूपांतरण सर्वर पर नहीं भेजा जाता।'],
  ja: ['オフラインでツールを使えますか？', 'オフラインでの利用は保証されません。サイトをブラウザーに読み込む必要があり、開くときや再読み込み時に接続が必要な場合があります。ページの読み込み後、対応するPDF処理はお使いの端末で実行され、文書が変換サーバーに送信されることはありません。'],
  ko: ['오프라인으로 도구를 사용할 수 있나요?', '오프라인 사용은 보장되지 않습니다. 웹사이트가 브라우저에 로드되어야 하며 사이트를 열거나 다시 로드할 때 연결이 필요할 수 있습니다. 페이지가 로드된 후 지원되는 PDF 작업은 기기에서 실행되며 문서는 변환 서버로 전송되지 않습니다.'],
  'zh-CN': ['我可以离线使用这些工具吗？', '我们不保证离线使用。网站需要先加载到浏览器中，打开或重新加载时可能需要网络连接。页面加载后，支持的 PDF 操作会在您的设备上运行；文档不会发送到转换服务器。']
};

export const getLocalizedFaq = (language) => {
  const localized = FAQ_TRANSLATIONS[language] || FAQ_TRANSLATIONS.en;
  return {
    ...localized,
    items: [...localized.items, offlineFaqTranslations[language] || offlineFaqTranslations.en],
    pageTitle: `${localized.title} | PDF Merge Pro`
  };
};
