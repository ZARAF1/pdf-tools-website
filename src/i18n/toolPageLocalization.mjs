import { SUPPORTED_LANGUAGES } from './languageCatalog.mjs';
import { TOOL_UI_TRANSLATIONS } from './toolUiLocalization.mjs';

const translations = {
  en: {
    introSuffix: 'Use the controls below to set your options and create a separate output; your original file stays unchanged.',
    steps: ['Choose the file or files described above and wait for them to load.', 'Set the available options or select and arrange pages as needed.', 'Review your choices and start processing.', 'Check the separate output, then download it.'],
    attachmentNote: 'Your original file stays unchanged. Review the new output before sharing it.',
    rules: {
      pdfOne: 'One unencrypted PDF · no fixed page limit',
      pdf15: 'One unencrypted PDF · up to 15 pages',
      pdf30: 'One unencrypted PDF · up to 30 pages',
      pdf50: 'One unencrypted PDF · up to 50 pages',
      pdfUpTo5: 'Up to 5 unencrypted PDF files',
      pdf2To5: '2–5 unencrypted PDF files',
      images10: 'Up to 10 JPEG, PNG, or BMP images',
      passwordPdf: 'One password-protected PDF · AES-256 R6 or RC4 R2/R3 only'
    },
    cautions: {
      compress: 'Higher compression turns pages into images. It may lower image quality and remove selectable text; larger outputs are not offered.',
      edit: 'Edits are overlays; existing PDF text is not replaced or reflowed.',
      word: 'Scanned pages use English OCR. Complex layouts may need cleanup in Word.',
      protect: 'Keep the opening password safe; it cannot be recovered here.',
      unlock: 'You must know the correct password. Password guessing and recovery are not supported.',
      ocr: 'OCR recognizes English text only and works best with clear, upright printed pages.',
      redact: 'Redacted output rasterizes pages, removing the original selectable text beneath the marks.',
      sign: 'This creates a visible signature, not a certificate-based digital signature.',
      crop: 'Cropping hides content outside the page boundary but does not permanently erase it.'
    }
  },
  es: {
    introSuffix: 'Usa los controles de abajo para configurar las opciones y crear un archivo nuevo; el original no se modifica.',
    steps: ['Elige los archivos indicados arriba y espera a que se carguen.', 'Configura las opciones disponibles o selecciona y ordena las páginas.', 'Revisa tus selecciones e inicia el proceso.', 'Comprueba el archivo creado y descárgalo.'],
    attachmentNote: 'El archivo original no se modifica. Revisa el resultado antes de compartirlo.',
    rules: {
      pdfOne: 'Un PDF sin contraseña · sin límite fijo de páginas',
      pdf15: 'Un PDF sin contraseña · hasta 15 páginas',
      pdf30: 'Un PDF sin contraseña · hasta 30 páginas',
      pdf50: 'Un PDF sin contraseña · hasta 50 páginas',
      pdfUpTo5: 'Hasta 5 archivos PDF sin contraseña',
      pdf2To5: 'De 2 a 5 archivos PDF sin contraseña',
      images10: 'Hasta 10 imágenes JPEG, PNG o BMP',
      passwordPdf: 'Un PDF protegido con contraseña · solo AES-256 R6 o RC4 R2/R3'
    },
    cautions: {
      compress: 'La compresión alta convierte las páginas en imágenes. Puede reducir la calidad y quitar el texto seleccionable; no se ofrecen archivos más grandes.',
      edit: 'Las ediciones se superponen al contenido; no reemplazan ni reorganizan el texto existente.',
      word: 'Las páginas escaneadas usan OCR en inglés. Los diseños complejos pueden requerir ajustes en Word.',
      protect: 'Guarda bien la contraseña de apertura; no se puede recuperar aquí.',
      unlock: 'Necesitas la contraseña correcta. No se admiten intentos ni recuperación de contraseñas.',
      ocr: 'El OCR reconoce solo inglés y funciona mejor con páginas impresas, nítidas y derechas.',
      redact: 'El resultado rasteriza las páginas y elimina el texto seleccionable original bajo las marcas.',
      sign: 'Esto crea una firma visible, no una firma digital con certificado.',
      crop: 'El recorte oculta el contenido fuera del límite de página, pero no lo elimina permanentemente.'
    }
  },
  fr: {
    introSuffix: 'Utilisez les commandes ci-dessous pour régler les options et créer un nouveau fichier ; l’original reste inchangé.',
    steps: ['Choisissez les fichiers indiqués ci-dessus et attendez leur chargement.', 'Réglez les options ou sélectionnez et organisez les pages.', 'Vérifiez vos choix et lancez le traitement.', 'Vérifiez le nouveau fichier, puis téléchargez-le.'],
    attachmentNote: 'Le fichier d’origine reste inchangé. Vérifiez le résultat avant de le partager.',
    rules: {
      pdfOne: 'Un PDF non chiffré · aucune limite fixe de pages',
      pdf15: 'Un PDF non chiffré · jusqu’à 15 pages',
      pdf30: 'Un PDF non chiffré · jusqu’à 30 pages',
      pdf50: 'Un PDF non chiffré · jusqu’à 50 pages',
      pdfUpTo5: 'Jusqu’à 5 fichiers PDF non chiffrés',
      pdf2To5: 'De 2 à 5 fichiers PDF non chiffrés',
      images10: 'Jusqu’à 10 images JPEG, PNG ou BMP',
      passwordPdf: 'Un PDF protégé par mot de passe · AES-256 R6 ou RC4 R2/R3 uniquement'
    },
    cautions: {
      compress: 'La compression élevée convertit les pages en images. Elle peut réduire la qualité et supprimer le texte sélectionnable ; les fichiers plus volumineux ne sont pas proposés.',
      edit: 'Les modifications sont superposées ; le texte existant n’est ni remplacé ni redistribué.',
      word: 'Les pages numérisées utilisent l’OCR anglais. Les mises en page complexes peuvent nécessiter des corrections dans Word.',
      protect: 'Conservez le mot de passe d’ouverture en lieu sûr ; il ne peut pas être récupéré ici.',
      unlock: 'Le mot de passe correct est requis. La recherche et la récupération de mots de passe ne sont pas prises en charge.',
      ocr: 'L’OCR reconnaît uniquement l’anglais et fonctionne mieux sur des pages imprimées, nettes et droites.',
      redact: 'Le résultat pixellise les pages et supprime le texte sélectionnable d’origine sous les marques.',
      sign: 'Il s’agit d’une signature visible, et non d’une signature numérique certifiée.',
      crop: 'Le recadrage masque le contenu hors des limites de page sans l’effacer définitivement.'
    }
  },
  de: {
    introSuffix: 'Nutze die Steuerelemente unten, um Optionen festzulegen und eine separate Ausgabe zu erstellen; die Originaldatei bleibt unverändert.',
    steps: ['Wähle die oben angegebenen Dateien aus und warte, bis sie geladen sind.', 'Lege Optionen fest oder wähle und sortiere Seiten.', 'Prüfe deine Auswahl und starte die Verarbeitung.', 'Prüfe die neue Ausgabe und lade sie herunter.'],
    attachmentNote: 'Die Originaldatei bleibt unverändert. Prüfe die Ausgabe, bevor du sie teilst.',
    rules: {
      pdfOne: 'Eine unverschlüsselte PDF-Datei · keine feste Seitenbegrenzung',
      pdf15: 'Eine unverschlüsselte PDF-Datei · bis zu 15 Seiten',
      pdf30: 'Eine unverschlüsselte PDF-Datei · bis zu 30 Seiten',
      pdf50: 'Eine unverschlüsselte PDF-Datei · bis zu 50 Seiten',
      pdfUpTo5: 'Bis zu 5 unverschlüsselte PDF-Dateien',
      pdf2To5: '2–5 unverschlüsselte PDF-Dateien',
      images10: 'Bis zu 10 JPEG-, PNG- oder BMP-Bilder',
      passwordPdf: 'Eine passwortgeschützte PDF-Datei · nur AES-256 R6 oder RC4 R2/R3'
    },
    cautions: {
      compress: 'Hohe Komprimierung wandelt Seiten in Bilder um. Das kann die Bildqualität verringern und auswählbaren Text entfernen; größere Ausgaben werden nicht angeboten.',
      edit: 'Änderungen werden überlagert; vorhandener PDF-Text wird weder ersetzt noch umgebrochen.',
      word: 'Gescannte Seiten verwenden englische OCR. Komplexe Layouts müssen in Word möglicherweise nachbearbeitet werden.',
      protect: 'Bewahre das Öffnungspasswort sicher auf; es kann hier nicht wiederhergestellt werden.',
      unlock: 'Das richtige Passwort ist erforderlich. Das Erraten oder Wiederherstellen von Passwörtern wird nicht unterstützt.',
      ocr: 'OCR erkennt nur englischen Text und funktioniert am besten bei klaren, aufrechten Druckseiten.',
      redact: 'Die Ausgabe rastert Seiten und entfernt den ursprünglichen auswählbaren Text unter den Markierungen.',
      sign: 'Dies ist eine sichtbare Unterschrift, keine zertifikatsbasierte digitale Signatur.',
      crop: 'Beim Zuschneiden wird Inhalt außerhalb der Seitengrenze ausgeblendet, aber nicht dauerhaft gelöscht.'
    }
  },
  pt: {
    introSuffix: 'Use os controles abaixo para definir as opções e criar um novo arquivo; o original permanece inalterado.',
    steps: ['Escolha os arquivos indicados acima e aguarde o carregamento.', 'Defina as opções ou selecione e organize as páginas.', 'Revise suas escolhas e inicie o processamento.', 'Confira o novo arquivo e faça o download.'],
    attachmentNote: 'O arquivo original permanece inalterado. Confira o resultado antes de compartilhá-lo.',
    rules: {
      pdfOne: 'Um PDF sem senha · sem limite fixo de páginas',
      pdf15: 'Um PDF sem senha · até 15 páginas',
      pdf30: 'Um PDF sem senha · até 30 páginas',
      pdf50: 'Um PDF sem senha · até 50 páginas',
      pdfUpTo5: 'Até 5 arquivos PDF sem senha',
      pdf2To5: 'De 2 a 5 arquivos PDF sem senha',
      images10: 'Até 10 imagens JPEG, PNG ou BMP',
      passwordPdf: 'Um PDF protegido por senha · somente AES-256 R6 ou RC4 R2/R3'
    },
    cautions: {
      compress: 'A compressão alta transforma páginas em imagens. Isso pode reduzir a qualidade e remover texto selecionável; arquivos maiores não são oferecidos.',
      edit: 'As edições são sobreposições; o texto existente não é substituído nem reorganizado.',
      word: 'Páginas digitalizadas usam OCR em inglês. Layouts complexos podem precisar de ajustes no Word.',
      protect: 'Guarde a senha de abertura; ela não pode ser recuperada aqui.',
      unlock: 'É necessária a senha correta. A tentativa e a recuperação de senhas não são compatíveis.',
      ocr: 'O OCR reconhece somente inglês e funciona melhor com páginas impressas, nítidas e na posição correta.',
      redact: 'O resultado rasteriza as páginas e remove o texto selecionável original sob as marcações.',
      sign: 'Esta é uma assinatura visível, não uma assinatura digital baseada em certificado.',
      crop: 'O recorte oculta o conteúdo fora dos limites da página, mas não o apaga permanentemente.'
    }
  },
  it: {
    introSuffix: 'Usa i controlli qui sotto per impostare le opzioni e creare un nuovo file; l’originale resta invariato.',
    steps: ['Scegli i file indicati sopra e attendi il caricamento.', 'Imposta le opzioni oppure seleziona e riordina le pagine.', 'Controlla le scelte e avvia l’elaborazione.', 'Controlla il nuovo file e scaricalo.'],
    attachmentNote: 'Il file originale resta invariato. Controlla il risultato prima di condividerlo.',
    rules: {
      pdfOne: 'Un PDF non crittografato · nessun limite fisso di pagine',
      pdf15: 'Un PDF non crittografato · fino a 15 pagine',
      pdf30: 'Un PDF non crittografato · fino a 30 pagine',
      pdf50: 'Un PDF non crittografato · fino a 50 pagine',
      pdfUpTo5: 'Fino a 5 file PDF non crittografati',
      pdf2To5: 'Da 2 a 5 file PDF non crittografati',
      images10: 'Fino a 10 immagini JPEG, PNG o BMP',
      passwordPdf: 'Un PDF protetto da password · solo AES-256 R6 o RC4 R2/R3'
    },
    cautions: {
      compress: 'La compressione elevata trasforma le pagine in immagini. Può ridurre la qualità e rimuovere il testo selezionabile; i file più grandi non vengono offerti.',
      edit: 'Le modifiche sono sovrapposte; il testo esistente non viene sostituito né reimpaginato.',
      word: 'Le pagine scansionate usano l’OCR inglese. I layout complessi potrebbero richiedere correzioni in Word.',
      protect: 'Conserva la password di apertura; non può essere recuperata qui.',
      unlock: 'È necessaria la password corretta. Il recupero o il tentativo di indovinare password non sono supportati.',
      ocr: 'L’OCR riconosce solo l’inglese e funziona meglio con pagine stampate nitide e dritte.',
      redact: 'Il risultato rasterizza le pagine e rimuove il testo selezionabile originale sotto i segni.',
      sign: 'È una firma visibile, non una firma digitale basata su certificato.',
      crop: 'Il ritaglio nasconde il contenuto fuori dai margini della pagina, ma non lo cancella definitivamente.'
    }
  },
  nl: {
    introSuffix: 'Gebruik de bediening hieronder om opties in te stellen en een afzonderlijk bestand te maken; het origineel blijft ongewijzigd.',
    steps: ['Kies de hierboven genoemde bestanden en wacht tot ze zijn geladen.', 'Stel opties in of selecteer en orden pagina’s.', 'Controleer je keuzes en start de verwerking.', 'Controleer het nieuwe bestand en download het.'],
    attachmentNote: 'Het oorspronkelijke bestand blijft ongewijzigd. Controleer het resultaat voordat je het deelt.',
    rules: {
      pdfOne: 'Eén onversleutelde PDF · geen vaste paginalimiet',
      pdf15: 'Eén onversleutelde PDF · maximaal 15 pagina’s',
      pdf30: 'Eén onversleutelde PDF · maximaal 30 pagina’s',
      pdf50: 'Eén onversleutelde PDF · maximaal 50 pagina’s',
      pdfUpTo5: 'Maximaal 5 onversleutelde PDF-bestanden',
      pdf2To5: '2–5 onversleutelde PDF-bestanden',
      images10: 'Maximaal 10 JPEG-, PNG- of BMP-afbeeldingen',
      passwordPdf: 'Eén PDF met wachtwoord · alleen AES-256 R6 of RC4 R2/R3'
    },
    cautions: {
      compress: 'Hogere compressie zet pagina’s om in afbeeldingen. Dit kan de kwaliteit verlagen en selecteerbare tekst verwijderen; grotere bestanden worden niet aangeboden.',
      edit: 'Bewerkingen worden als laag toegevoegd; bestaande PDF-tekst wordt niet vervangen of opnieuw ingedeeld.',
      word: 'Gescande pagina’s gebruiken Engelse OCR. Complexe lay-outs moeten mogelijk in Word worden aangepast.',
      protect: 'Bewaar het openingswachtwoord goed; het kan hier niet worden hersteld.',
      unlock: 'Het juiste wachtwoord is vereist. Wachtwoorden raden of herstellen wordt niet ondersteund.',
      ocr: 'OCR herkent alleen Engelse tekst en werkt het best met duidelijke, rechte afgedrukte pagina’s.',
      redact: 'De uitvoer rasteriseert pagina’s en verwijdert de oorspronkelijke selecteerbare tekst onder de markeringen.',
      sign: 'Dit is een zichtbare handtekening, geen digitale handtekening met certificaat.',
      crop: 'Bijsnijden verbergt inhoud buiten de paginarand, maar verwijdert deze niet permanent.'
    }
  },
  pl: {
    introSuffix: 'Użyj poniższych elementów, aby ustawić opcje i utworzyć osobny plik; oryginał pozostanie bez zmian.',
    steps: ['Wybierz wskazane powyżej pliki i poczekaj na ich wczytanie.', 'Ustaw opcje lub wybierz i uporządkuj strony.', 'Sprawdź wybór i rozpocznij przetwarzanie.', 'Sprawdź nowy plik i pobierz go.'],
    attachmentNote: 'Oryginalny plik pozostaje bez zmian. Sprawdź wynik przed jego udostępnieniem.',
    rules: {
      pdfOne: 'Jeden niezaszyfrowany PDF · bez stałego limitu stron',
      pdf15: 'Jeden niezaszyfrowany PDF · maksymalnie 15 stron',
      pdf30: 'Jeden niezaszyfrowany PDF · maksymalnie 30 stron',
      pdf50: 'Jeden niezaszyfrowany PDF · maksymalnie 50 stron',
      pdfUpTo5: 'Maksymalnie 5 niezaszyfrowanych plików PDF',
      pdf2To5: 'Od 2 do 5 niezaszyfrowanych plików PDF',
      images10: 'Maksymalnie 10 obrazów JPEG, PNG lub BMP',
      passwordPdf: 'Jeden PDF chroniony hasłem · tylko AES-256 R6 lub RC4 R2/R3'
    },
    cautions: {
      compress: 'Wysoka kompresja zamienia strony w obrazy. Może obniżyć jakość i usunąć zaznaczalny tekst; większe pliki nie są oferowane.',
      edit: 'Zmiany są nakładane na stronę; istniejący tekst PDF nie jest zastępowany ani przeformatowywany.',
      word: 'Zeskanowane strony używają angielskiego OCR. Złożone układy mogą wymagać poprawek w Wordzie.',
      protect: 'Zachowaj hasło otwierające; nie można go tutaj odzyskać.',
      unlock: 'Wymagane jest prawidłowe hasło. Zgadywanie i odzyskiwanie haseł nie jest obsługiwane.',
      ocr: 'OCR rozpoznaje tylko angielski i działa najlepiej na wyraźnych, prostych stronach drukowanych.',
      redact: 'Wynik rasteruje strony i usuwa oryginalny zaznaczalny tekst pod oznaczeniami.',
      sign: 'To widoczny podpis, a nie podpis cyfrowy oparty na certyfikacie.',
      crop: 'Przycięcie ukrywa treść poza granicą strony, ale nie usuwa jej trwale.'
    }
  },
  sv: {
    introSuffix: 'Använd kontrollerna nedan för att välja alternativ och skapa en separat fil; originalet ändras inte.',
    steps: ['Välj filerna som anges ovan och vänta tills de har lästs in.', 'Välj alternativ eller markera och ordna sidor.', 'Kontrollera dina val och starta bearbetningen.', 'Granska den nya filen och ladda ned den.'],
    attachmentNote: 'Originalfilen ändras inte. Granska resultatet innan du delar det.',
    rules: {
      pdfOne: 'En okrypterad PDF · ingen fast sidgräns',
      pdf15: 'En okrypterad PDF · högst 15 sidor',
      pdf30: 'En okrypterad PDF · högst 30 sidor',
      pdf50: 'En okrypterad PDF · högst 50 sidor',
      pdfUpTo5: 'Upp till 5 okrypterade PDF-filer',
      pdf2To5: '2–5 okrypterade PDF-filer',
      images10: 'Upp till 10 JPEG-, PNG- eller BMP-bilder',
      passwordPdf: 'En lösenordsskyddad PDF · endast AES-256 R6 eller RC4 R2/R3'
    },
    cautions: {
      compress: 'Hög komprimering gör om sidor till bilder. Det kan försämra kvaliteten och ta bort markerbar text; större filer erbjuds inte.',
      edit: 'Ändringar läggs ovanpå sidan; befintlig PDF-text ersätts eller omflödas inte.',
      word: 'Skannade sidor använder engelsk OCR. Komplexa layouter kan behöva justeras i Word.',
      protect: 'Spara öppningslösenordet på ett säkert ställe; det kan inte återställas här.',
      unlock: 'Rätt lösenord krävs. Gissning och återställning av lösenord stöds inte.',
      ocr: 'OCR känner endast igen engelska och fungerar bäst med tydliga, upprätta utskrivna sidor.',
      redact: 'Resultatet rasteriserar sidor och tar bort den ursprungliga markerbara texten under markeringarna.',
      sign: 'Detta är en synlig signatur, inte en certifikatbaserad digital signatur.',
      crop: 'Beskärning döljer innehåll utanför sidgränsen men raderar det inte permanent.'
    }
  },
  fi: {
    introSuffix: 'Valitse asetukset alla olevilla säätimillä ja luo erillinen tiedosto; alkuperäinen säilyy ennallaan.',
    steps: ['Valitse yllä mainitut tiedostot ja odota, että ne latautuvat.', 'Määritä asetukset tai valitse ja järjestä sivut.', 'Tarkista valintasi ja käynnistä käsittely.', 'Tarkista uusi tiedosto ja lataa se.'],
    attachmentNote: 'Alkuperäinen tiedosto säilyy ennallaan. Tarkista tulos ennen jakamista.',
    rules: {
      pdfOne: 'Yksi salaamaton PDF · ei kiinteää sivurajaa',
      pdf15: 'Yksi salaamaton PDF · enintään 15 sivua',
      pdf30: 'Yksi salaamaton PDF · enintään 30 sivua',
      pdf50: 'Yksi salaamaton PDF · enintään 50 sivua',
      pdfUpTo5: 'Enintään 5 salaamatonta PDF-tiedostoa',
      pdf2To5: '2–5 salaamatonta PDF-tiedostoa',
      images10: 'Enintään 10 JPEG-, PNG- tai BMP-kuvaa',
      passwordPdf: 'Yksi salasanalla suojattu PDF · vain AES-256 R6 tai RC4 R2/R3'
    },
    cautions: {
      compress: 'Tehokas pakkaus muuttaa sivut kuviksi. Se voi heikentää kuvanlaatua ja poistaa valittavan tekstin; suurempia tiedostoja ei tarjota.',
      edit: 'Muokkaukset lisätään sivun päälle; PDF:n nykyistä tekstiä ei korvata eikä järjestellä uudelleen.',
      word: 'Skannatut sivut käyttävät englanninkielistä OCR-tunnistusta. Monimutkaisia asetteluja voi joutua korjaamaan Wordissa.',
      protect: 'Säilytä avaus salasana turvallisesti; sitä ei voi palauttaa täällä.',
      unlock: 'Tarvitset oikean salasanan. Salasanojen arvausta tai palautusta ei tueta.',
      ocr: 'OCR tunnistaa vain englantia ja toimii parhaiten selkeillä, suorassa olevilla tulostetuilla sivuilla.',
      redact: 'Tulos rasteroi sivut ja poistaa merkintöjen alla olevan alkuperäisen valittavan tekstin.',
      sign: 'Tämä on näkyvä allekirjoitus, ei varmenteeseen perustuva digitaalinen allekirjoitus.',
      crop: 'Rajaus piilottaa sivun reunojen ulkopuolisen sisällön, mutta ei poista sitä pysyvästi.'
    }
  },
  da: {
    introSuffix: 'Brug kontrollerne nedenfor til at vælge indstillinger og oprette en separat fil; originalen ændres ikke.',
    steps: ['Vælg de filer, der er angivet ovenfor, og vent på, at de indlæses.', 'Vælg indstillinger, eller markér og organisér sider.', 'Kontrollér dine valg, og start behandlingen.', 'Gennemse den nye fil, og download den.'],
    attachmentNote: 'Originalfilen ændres ikke. Gennemse resultatet, før du deler det.',
    rules: {
      pdfOne: 'Én ukrypteret PDF · ingen fast sidegrænse',
      pdf15: 'Én ukrypteret PDF · op til 15 sider',
      pdf30: 'Én ukrypteret PDF · op til 30 sider',
      pdf50: 'Én ukrypteret PDF · op til 50 sider',
      pdfUpTo5: 'Op til 5 ukrypterede PDF-filer',
      pdf2To5: '2–5 ukrypterede PDF-filer',
      images10: 'Op til 10 JPEG-, PNG- eller BMP-billeder',
      passwordPdf: 'Én adgangskodebeskyttet PDF · kun AES-256 R6 eller RC4 R2/R3'
    },
    cautions: {
      compress: 'Høj komprimering konverterer sider til billeder. Det kan forringe kvaliteten og fjerne markerbar tekst; større filer tilbydes ikke.',
      edit: 'Redigeringer lægges oven på siden; eksisterende PDF-tekst erstattes eller ombrydes ikke.',
      word: 'Scannede sider bruger engelsk OCR. Komplekse layout kan kræve justering i Word.',
      protect: 'Opbevar åbningsadgangskoden sikkert; den kan ikke gendannes her.',
      unlock: 'Den korrekte adgangskode er nødvendig. Gætning og gendannelse af adgangskoder understøttes ikke.',
      ocr: 'OCR genkender kun engelsk og fungerer bedst med tydelige, opretstående trykte sider.',
      redact: 'Resultatet rasteriserer siderne og fjerner den oprindelige markerbare tekst under markeringerne.',
      sign: 'Dette er en synlig underskrift, ikke en certifikatbaseret digital signatur.',
      crop: 'Beskæring skjuler indhold uden for sidegrænsen, men sletter det ikke permanent.'
    }
  },
  nb: {
    introSuffix: 'Bruk kontrollene nedenfor for å velge alternativer og lage en separat fil; originalen forblir uendret.',
    steps: ['Velg filene som er angitt ovenfor, og vent til de er lastet inn.', 'Velg alternativer eller merk og organiser sider.', 'Kontroller valgene, og start behandlingen.', 'Se gjennom den nye filen, og last den ned.'],
    attachmentNote: 'Originalfilen forblir uendret. Kontroller resultatet før du deler det.',
    rules: {
      pdfOne: 'Én ukryptert PDF · ingen fast sidegrense',
      pdf15: 'Én ukryptert PDF · opptil 15 sider',
      pdf30: 'Én ukryptert PDF · opptil 30 sider',
      pdf50: 'Én ukryptert PDF · opptil 50 sider',
      pdfUpTo5: 'Opptil 5 ukrypterte PDF-filer',
      pdf2To5: '2–5 ukrypterte PDF-filer',
      images10: 'Opptil 10 JPEG-, PNG- eller BMP-bilder',
      passwordPdf: 'Én passordbeskyttet PDF · bare AES-256 R6 eller RC4 R2/R3'
    },
    cautions: {
      compress: 'Høy komprimering gjør sider om til bilder. Det kan redusere kvaliteten og fjerne markerbar tekst; større filer tilbys ikke.',
      edit: 'Redigeringer legges oppå siden; eksisterende PDF-tekst erstattes eller flyttes ikke.',
      word: 'Skannede sider bruker engelsk OCR. Komplekse oppsett kan trenge justering i Word.',
      protect: 'Oppbevar åpningspassordet trygt; det kan ikke gjenopprettes her.',
      unlock: 'Riktig passord kreves. Gjetting og gjenoppretting av passord støttes ikke.',
      ocr: 'OCR gjenkjenner bare engelsk og fungerer best med tydelige, rette utskrevne sider.',
      redact: 'Resultatet rasteriserer sidene og fjerner den opprinnelige markerbare teksten under markeringene.',
      sign: 'Dette er en synlig signatur, ikke en sertifikatbasert digital signatur.',
      crop: 'Beskjæring skjuler innhold utenfor sidegrensen, men sletter det ikke permanent.'
    }
  },
  tr: {
    introSuffix: 'Seçenekleri belirlemek ve ayrı bir çıktı oluşturmak için aşağıdaki kontrolleri kullanın; özgün dosyanız değişmez.',
    steps: ['Yukarıda belirtilen dosyaları seçin ve yüklenmelerini bekleyin.', 'Seçenekleri ayarlayın veya sayfaları seçip sıralayın.', 'Seçimlerinizi gözden geçirin ve işlemi başlatın.', 'Yeni çıktıyı kontrol edin ve indirin.'],
    attachmentNote: 'Özgün dosyanız değişmez. Sonucu paylaşmadan önce gözden geçirin.',
    rules: {
      pdfOne: 'Bir şifresiz PDF · sabit sayfa sınırı yok',
      pdf15: 'Bir şifresiz PDF · en fazla 15 sayfa',
      pdf30: 'Bir şifresiz PDF · en fazla 30 sayfa',
      pdf50: 'Bir şifresiz PDF · en fazla 50 sayfa',
      pdfUpTo5: 'En fazla 5 şifresiz PDF dosyası',
      pdf2To5: '2–5 şifresiz PDF dosyası',
      images10: 'En fazla 10 JPEG, PNG veya BMP görseli',
      passwordPdf: 'Bir parola korumalı PDF · yalnızca AES-256 R6 veya RC4 R2/R3'
    },
    cautions: {
      compress: 'Yüksek sıkıştırma sayfaları görsellere dönüştürür. Görüntü kalitesini düşürebilir ve seçilebilir metni kaldırabilir; daha büyük çıktılar sunulmaz.',
      edit: 'Düzenlemeler sayfanın üzerine eklenir; mevcut PDF metni değiştirilmez veya yeniden akıtılmaz.',
      word: 'Taranmış sayfalarda İngilizce OCR kullanılır. Karmaşık düzenlerin Word’de düzeltilmesi gerekebilir.',
      protect: 'Açılış parolasını güvenli bir yerde saklayın; burada kurtarılamaz.',
      unlock: 'Doğru parola gerekir. Parola tahmini ve kurtarma desteklenmez.',
      ocr: 'OCR yalnızca İngilizceyi tanır; net ve düzgün basılmış sayfalarda daha iyi çalışır.',
      redact: 'Çıktı sayfaları rasterleştirir ve işaretlerin altındaki özgün seçilebilir metni kaldırır.',
      sign: 'Bu görünür bir imzadır; sertifika tabanlı dijital imza değildir.',
      crop: 'Kırpma, sayfa sınırının dışındaki içeriği gizler ancak kalıcı olarak silmez.'
    }
  },
  ru: {
    introSuffix: 'Используйте элементы управления ниже, чтобы задать параметры и создать отдельный файл; исходник не изменится.',
    steps: ['Выберите указанные выше файлы и дождитесь их загрузки.', 'Настройте параметры или выберите и упорядочьте страницы.', 'Проверьте выбор и запустите обработку.', 'Проверьте новый файл и скачайте его.'],
    attachmentNote: 'Исходный файл не изменяется. Проверьте результат перед отправкой.',
    rules: {
      pdfOne: 'Один PDF без шифрования · без фиксированного лимита страниц',
      pdf15: 'Один PDF без шифрования · до 15 страниц',
      pdf30: 'Один PDF без шифрования · до 30 страниц',
      pdf50: 'Один PDF без шифрования · до 50 страниц',
      pdfUpTo5: 'До 5 PDF-файлов без шифрования',
      pdf2To5: 'От 2 до 5 PDF-файлов без шифрования',
      images10: 'До 10 изображений JPEG, PNG или BMP',
      passwordPdf: 'Один PDF с паролем · только AES-256 R6 или RC4 R2/R3'
    },
    cautions: {
      compress: 'Высокое сжатие преобразует страницы в изображения. Качество может снизиться, а выделяемый текст — исчезнуть; более крупные файлы не предлагаются.',
      edit: 'Правки накладываются поверх страницы; существующий текст PDF не заменяется и не перераспределяется.',
      word: 'Для сканов используется английский OCR. Сложную разметку, возможно, придётся исправить в Word.',
      protect: 'Сохраните пароль открытия: восстановить его здесь нельзя.',
      unlock: 'Нужен правильный пароль. Подбор и восстановление паролей не поддерживаются.',
      ocr: 'OCR распознаёт только английский язык и лучше работает с чёткими ровными печатными страницами.',
      redact: 'Результат растрирует страницы и удаляет исходный выделяемый текст под отметками.',
      sign: 'Это видимая подпись, а не цифровая подпись на основе сертификата.',
      crop: 'Обрезка скрывает содержимое за границами страницы, но не удаляет его окончательно.'
    }
  },
  uk: {
    introSuffix: 'Скористайтеся елементами керування нижче, щоб налаштувати параметри й створити окремий файл; оригінал не зміниться.',
    steps: ['Виберіть указані вище файли й дочекайтеся їх завантаження.', 'Налаштуйте параметри або виберіть і впорядкуйте сторінки.', 'Перевірте вибір і запустіть обробку.', 'Перевірте новий файл і завантажте його.'],
    attachmentNote: 'Оригінальний файл не змінюється. Перевірте результат перед поширенням.',
    rules: {
      pdfOne: 'Один незашифрований PDF · без фіксованого обмеження сторінок',
      pdf15: 'Один незашифрований PDF · до 15 сторінок',
      pdf30: 'Один незашифрований PDF · до 30 сторінок',
      pdf50: 'Один незашифрований PDF · до 50 сторінок',
      pdfUpTo5: 'До 5 незашифрованих файлів PDF',
      pdf2To5: 'Від 2 до 5 незашифрованих файлів PDF',
      images10: 'До 10 зображень JPEG, PNG або BMP',
      passwordPdf: 'Один PDF із паролем · лише AES-256 R6 або RC4 R2/R3'
    },
    cautions: {
      compress: 'Високе стиснення перетворює сторінки на зображення. Якість може знизитися, а текст для виділення — зникнути; більші файли не пропонуються.',
      edit: 'Зміни накладаються поверх сторінки; наявний текст PDF не замінюється й не переформатовується.',
      word: 'Для сканованих сторінок використовується англійське OCR. Складні макети може знадобитися виправити у Word.',
      protect: 'Збережіть пароль відкриття: відновити його тут неможливо.',
      unlock: 'Потрібен правильний пароль. Підбір і відновлення паролів не підтримуються.',
      ocr: 'OCR розпізнає лише англійську й найкраще працює з чіткими рівними друкованими сторінками.',
      redact: 'Результат растеризує сторінки й видаляє початковий текст для виділення під позначками.',
      sign: 'Це видимий підпис, а не цифровий підпис на основі сертифіката.',
      crop: 'Обрізання приховує вміст за межами сторінки, але не видаляє його остаточно.'
    }
  },
  ar: {
    introSuffix: 'استخدم عناصر التحكم أدناه لضبط الخيارات وإنشاء ملف منفصل؛ لن يتغير الملف الأصلي.',
    steps: ['اختر الملفات الموضحة أعلاه وانتظر حتى يتم تحميلها.', 'اضبط الخيارات أو حدد الصفحات ورتبها حسب الحاجة.', 'راجع اختياراتك وابدأ المعالجة.', 'تحقق من الملف الجديد ثم نزّله.'],
    attachmentNote: 'يبقى الملف الأصلي دون تغيير. راجع الناتج قبل مشاركته.',
    rules: {
      pdfOne: 'ملف PDF واحد غير مشفر · لا يوجد حد ثابت للصفحات',
      pdf15: 'ملف PDF واحد غير مشفر · حتى 15 صفحة',
      pdf30: 'ملف PDF واحد غير مشفر · حتى 30 صفحة',
      pdf50: 'ملف PDF واحد غير مشفر · حتى 50 صفحة',
      pdfUpTo5: 'حتى 5 ملفات PDF غير مشفرة',
      pdf2To5: 'من ملفين إلى 5 ملفات PDF غير مشفرة',
      images10: 'حتى 10 صور JPEG أو PNG أو BMP',
      passwordPdf: 'ملف PDF واحد محمي بكلمة مرور · AES-256 R6 أو RC4 R2/R3 فقط'
    },
    cautions: {
      compress: 'يحوّل الضغط العالي الصفحات إلى صور. قد يقلل الجودة ويزيل النص القابل للتحديد؛ ولا تُعرض الملفات الأكبر حجماً.',
      edit: 'تُضاف التعديلات كطبقة فوق الصفحة؛ ولا يُستبدل النص الموجود أو يعاد تدفقه.',
      word: 'تستخدم الصفحات الممسوحة ضوئياً OCR باللغة الإنجليزية. قد تحتاج التخطيطات المعقدة إلى تنسيق في Word.',
      protect: 'احتفظ بكلمة مرور الفتح؛ لا يمكن استعادتها هنا.',
      unlock: 'تجب معرفة كلمة المرور الصحيحة. لا ندعم تخمين كلمات المرور أو استعادتها.',
      ocr: 'يتعرف OCR على الإنجليزية فقط ويعمل بشكل أفضل مع الصفحات المطبوعة الواضحة والمستقيمة.',
      redact: 'يحوّل الناتج الصفحات إلى صور ويزيل النص الأصلي القابل للتحديد أسفل العلامات.',
      sign: 'هذا توقيع مرئي وليس توقيعاً رقمياً قائماً على شهادة.',
      crop: 'يخفي الاقتصاص المحتوى خارج حدود الصفحة لكنه لا يمحوه نهائياً.'
    }
  },
  hi: {
    introSuffix: 'विकल्प चुनकर अलग आउटपुट बनाने के लिए नीचे दिए नियंत्रणों का उपयोग करें; मूल फ़ाइल अपरिवर्तित रहती है।',
    steps: ['ऊपर बताई गई फ़ाइलें चुनें और उनके लोड होने तक प्रतीक्षा करें।', 'विकल्प सेट करें या आवश्यक पेज चुनकर क्रम में रखें।', 'अपने चयन की जाँच करें और प्रक्रिया शुरू करें।', 'नई फ़ाइल जाँचें और डाउनलोड करें।'],
    attachmentNote: 'मूल फ़ाइल अपरिवर्तित रहती है। साझा करने से पहले परिणाम जाँचें।',
    rules: {
      pdfOne: 'एक अनएन्क्रिप्टेड PDF · पेजों की कोई निश्चित सीमा नहीं',
      pdf15: 'एक अनएन्क्रिप्टेड PDF · अधिकतम 15 पेज',
      pdf30: 'एक अनएन्क्रिप्टेड PDF · अधिकतम 30 पेज',
      pdf50: 'एक अनएन्क्रिप्टेड PDF · अधिकतम 50 पेज',
      pdfUpTo5: 'अधिकतम 5 अनएन्क्रिप्टेड PDF फ़ाइलें',
      pdf2To5: '2 से 5 अनएन्क्रिप्टेड PDF फ़ाइलें',
      images10: 'अधिकतम 10 JPEG, PNG या BMP चित्र',
      passwordPdf: 'एक पासवर्ड-सुरक्षित PDF · केवल AES-256 R6 या RC4 R2/R3'
    },
    cautions: {
      compress: 'उच्च संपीड़न पेजों को चित्रों में बदलता है। इससे गुणवत्ता घट सकती है और चयन योग्य टेक्स्ट हट सकता है; बड़ी फ़ाइलें उपलब्ध नहीं कराई जातीं।',
      edit: 'बदलाव पेज के ऊपर परत के रूप में जुड़ते हैं; मौजूदा PDF टेक्स्ट बदला या पुनर्व्यवस्थित नहीं होता।',
      word: 'स्कैन किए गए पेजों पर अंग्रेज़ी OCR चलता है। जटिल लेआउट को Word में सुधारना पड़ सकता है।',
      protect: 'खोलने वाला पासवर्ड सुरक्षित रखें; इसे यहाँ वापस नहीं पाया जा सकता।',
      unlock: 'सही पासवर्ड आवश्यक है। पासवर्ड का अनुमान या पुनर्प्राप्ति समर्थित नहीं है।',
      ocr: 'OCR केवल अंग्रेज़ी पहचानता है और साफ़, सीधे मुद्रित पेजों पर बेहतर काम करता है।',
      redact: 'आउटपुट पेजों को रास्टराइज़ करता है और निशानों के नीचे का मूल चयन योग्य टेक्स्ट हटा देता है।',
      sign: 'यह दिखाई देने वाला हस्ताक्षर है, प्रमाणपत्र-आधारित डिजिटल हस्ताक्षर नहीं।',
      crop: 'क्रॉप पेज की सीमा के बाहर की सामग्री छिपाता है, लेकिन स्थायी रूप से मिटाता नहीं है।'
    }
  },
  ja: {
    introSuffix: '下のコントロールでオプションを設定して別の出力を作成します。元のファイルは変更されません。',
    steps: ['上記のファイルを選択し、読み込みを待ちます。', 'オプションを設定するか、必要なページを選択して並べ替えます。', '選択内容を確認して処理を開始します。', '新しい出力を確認してダウンロードします。'],
    attachmentNote: '元のファイルは変更されません。共有する前に出力を確認してください。',
    rules: {
      pdfOne: '暗号化されていないPDF 1件・ページ数の固定上限なし',
      pdf15: '暗号化されていないPDF 1件・最大15ページ',
      pdf30: '暗号化されていないPDF 1件・最大30ページ',
      pdf50: '暗号化されていないPDF 1件・最大50ページ',
      pdfUpTo5: '暗号化されていないPDFを最大5件',
      pdf2To5: '暗号化されていないPDFを2～5件',
      images10: 'JPEG、PNG、BMP画像を最大10枚',
      passwordPdf: 'パスワード保護されたPDF 1件・AES-256 R6またはRC4 R2/R3のみ'
    },
    cautions: {
      compress: '高圧縮ではページを画像に変換します。画質が低下し、選択可能なテキストが失われる場合があります。元より大きい出力は提供しません。',
      edit: '編集内容はページ上に重ねて追加されます。既存のPDFテキストは置換・再配置されません。',
      word: 'スキャンページには英語OCRを使用します。複雑なレイアウトはWordで調整が必要な場合があります。',
      protect: '開くためのパスワードを保管してください。ここでは復元できません。',
      unlock: '正しいパスワードが必要です。パスワードの推測や復元には対応していません。',
      ocr: 'OCRは英語のみを認識します。鮮明で正立した印刷ページで最もよく機能します。',
      redact: '出力ではページを画像化し、マークの下にある元の選択可能なテキストを削除します。',
      sign: 'これは表示用の署名であり、証明書ベースの電子署名ではありません。',
      crop: 'トリミングはページ境界の外側を隠しますが、完全には削除しません。'
    }
  },
  ko: {
    introSuffix: '아래 컨트롤에서 옵션을 설정해 별도의 결과물을 만드세요. 원본 파일은 변경되지 않습니다.',
    steps: ['위에 표시된 파일을 선택하고 로드될 때까지 기다리세요.', '옵션을 설정하거나 필요한 페이지를 선택하고 정렬하세요.', '선택 내용을 확인하고 처리를 시작하세요.', '새 결과물을 확인한 뒤 다운로드하세요.'],
    attachmentNote: '원본 파일은 변경되지 않습니다. 공유하기 전에 결과물을 확인하세요.',
    rules: {
      pdfOne: '암호화되지 않은 PDF 1개 · 페이지 수 고정 제한 없음',
      pdf15: '암호화되지 않은 PDF 1개 · 최대 15페이지',
      pdf30: '암호화되지 않은 PDF 1개 · 최대 30페이지',
      pdf50: '암호화되지 않은 PDF 1개 · 최대 50페이지',
      pdfUpTo5: '암호화되지 않은 PDF 파일 최대 5개',
      pdf2To5: '암호화되지 않은 PDF 파일 2~5개',
      images10: 'JPEG, PNG 또는 BMP 이미지 최대 10개',
      passwordPdf: '암호로 보호된 PDF 1개 · AES-256 R6 또는 RC4 R2/R3만 지원'
    },
    cautions: {
      compress: '고압축은 페이지를 이미지로 변환합니다. 화질이 낮아지거나 선택 가능한 텍스트가 사라질 수 있으며, 더 큰 결과물은 제공하지 않습니다.',
      edit: '편집 내용은 페이지 위에 덧씌워집니다. 기존 PDF 텍스트를 바꾸거나 재배치하지 않습니다.',
      word: '스캔한 페이지에는 영어 OCR을 사용합니다. 복잡한 레이아웃은 Word에서 수정해야 할 수 있습니다.',
      protect: '열기 암호를 안전하게 보관하세요. 여기서는 복구할 수 없습니다.',
      unlock: '올바른 암호가 필요합니다. 암호 추측이나 복구는 지원되지 않습니다.',
      ocr: 'OCR은 영어만 인식하며 선명하고 똑바른 인쇄 페이지에서 가장 잘 작동합니다.',
      redact: '결과물은 페이지를 이미지화하고 표시 아래의 원래 선택 가능한 텍스트를 제거합니다.',
      sign: '이 기능은 화면에 보이는 서명이며 인증서 기반 디지털 서명이 아닙니다.',
      crop: '자르기는 페이지 경계 밖의 내용을 숨기지만 영구적으로 지우지는 않습니다.'
    }
  },
  'zh-CN': {
    introSuffix: '使用下方控件设置选项并创建单独的输出文件；原始文件不会更改。',
    steps: ['选择上方列出的文件并等待加载完成。', '设置选项，或选择并排列所需页面。', '检查所选内容并开始处理。', '检查新文件，然后下载。'],
    attachmentNote: '原始文件不会更改。分享前请检查输出结果。',
    rules: {
      pdfOne: '1 个未加密 PDF · 页数无固定上限',
      pdf15: '1 个未加密 PDF · 最多 15 页',
      pdf30: '1 个未加密 PDF · 最多 30 页',
      pdf50: '1 个未加密 PDF · 最多 50 页',
      pdfUpTo5: '最多 5 个未加密 PDF 文件',
      pdf2To5: '2–5 个未加密 PDF 文件',
      images10: '最多 10 张 JPEG、PNG 或 BMP 图片',
      passwordPdf: '1 个受密码保护的 PDF · 仅支持 AES-256 R6 或 RC4 R2/R3'
    },
    cautions: {
      compress: '高压缩会将页面转换为图像，可能降低画质并移除可选择的文本；不会提供比原文件更大的输出。',
      edit: '编辑内容会叠加在页面上；不会替换或重新排版现有 PDF 文本。',
      word: '扫描页面使用英语 OCR。复杂版式可能需要在 Word 中调整。',
      protect: '请妥善保存打开密码；此处无法恢复。',
      unlock: '必须提供正确密码。不支持猜测或恢复密码。',
      ocr: 'OCR 仅识别英语，在清晰、正向的印刷页面上效果最佳。',
      redact: '输出会将页面栅格化，并移除标记下方原有的可选择文本。',
      sign: '这是可见签名，并非基于证书的数字签名。',
      crop: '裁剪会隐藏页面边界外的内容，但不会将其永久删除。'
    }
  }
};

const docxPdfRuleTranslations = {
  en: 'One unencrypted PDF or unprotected DOCX file · no fixed page limit',
  es: 'Un PDF sin contraseña o archivo DOCX sin protección · sin límite fijo de páginas',
  fr: 'Un PDF non chiffré ou fichier DOCX non protégé · aucune limite fixe de pages',
  de: 'Eine unverschlüsselte PDF- oder ungeschützte DOCX-Datei · keine feste Seitenbegrenzung',
  pt: 'Um PDF sem senha ou DOCX sem proteção · sem limite fixo de páginas',
  it: 'Un PDF non crittografato o DOCX non protetto · nessun limite fisso di pagine',
  nl: 'Eén onversleutelde PDF of onbeschermd DOCX-bestand · geen vaste paginalimiet',
  pl: 'Jeden niezaszyfrowany PDF lub niezabezpieczony plik DOCX · bez stałego limitu stron',
  sv: 'En okrypterad PDF eller oskyddad DOCX-fil · ingen fast sidgräns',
  fi: 'Yksi salaamaton PDF tai suojaamaton DOCX-tiedosto · ei kiinteää sivurajaa',
  da: 'Én ukrypteret PDF eller ubeskyttet DOCX-fil · ingen fast sidegrænse',
  nb: 'Én ukryptert PDF eller ubeskyttet DOCX-fil · ingen fast sidegrense',
  tr: 'Bir şifresiz PDF veya korumasız DOCX dosyası · sabit sayfa sınırı yok',
  ru: 'Один PDF без шифрования или незапароленный DOCX-файл · без фиксированного лимита страниц',
  uk: 'Один незашифрований PDF або незахищений DOCX-файл · без фіксованого обмеження сторінок',
  ar: 'ملف PDF واحد غير مشفر أو DOCX غير محمي · لا يوجد حد ثابت للصفحات',
  hi: 'एक अनएन्क्रिप्टेड PDF या असुरक्षित DOCX फ़ाइल · पेजों की कोई निश्चित सीमा नहीं',
  ja: '暗号化されていない PDF または保護されていない DOCX 1 件・ページ数の固定上限なし',
  ko: '암호화되지 않은 PDF 또는 보호되지 않은 DOCX 파일 1개 · 페이지 수 고정 제한 없음',
  'zh-CN': '1 个未加密 PDF 或未受保护的 DOCX 文件 · 页数无固定上限'
};

for (const [language, rule] of Object.entries(docxPdfRuleTranslations)) {
  translations[language].rules.docxPdfOne = rule;
}

const powerpointPdfRuleTranslations = {
  en: 'One unencrypted PDF or unprotected .pptx file · page count depends on available browser memory',
  es: 'Un PDF sin contraseña o archivo .pptx sin protección · el límite de páginas depende de la memoria disponible del navegador',
  fr: 'Un PDF non chiffré ou fichier .pptx non protégé · le nombre de pages dépend de la mémoire disponible du navigateur',
  de: 'Eine unverschlüsselte PDF- oder ungeschützte .pptx-Datei · die Seitenzahl hängt vom verfügbaren Browserspeicher ab',
  pt: 'Um PDF sem senha ou arquivo .pptx desprotegido · o limite de páginas depende da memória disponível no navegador',
  it: 'Un PDF non crittografato o un file .pptx non protetto · il limite di pagine dipende dalla memoria disponibile nel browser',
  nl: 'Eén onversleuteld PDF- of onbeveiligd .pptx-bestand · het aantal pagina’s hangt af van het beschikbare browsergeheugen',
  pl: 'Jeden niezaszyfrowany PDF lub niezabezpieczony plik .pptx · liczba stron zależy od pamięci przeglądarki',
  sv: 'En okrypterad PDF eller oskyddad .pptx-fil · sidantalet beror på tillgängligt webbläsarminne',
  fi: 'Yksi salaamaton PDF tai suojaamaton .pptx-tiedosto · sivumäärä riippuu selaimen käytettävissä olevasta muistista',
  da: 'Én ukrypteret PDF eller ubeskyttet .pptx-fil · antal sider afhænger af browserens tilgængelige hukommelse',
  nb: 'Én ukryptert PDF eller ubeskyttet .pptx-fil · antall sider avhenger av tilgjengelig nettleserminne',
  tr: 'Bir şifresiz PDF veya korumasız .pptx dosyası · sayfa sayısı tarayıcı belleğine bağlıdır',
  ru: 'Один PDF без шифрования или незащищённый файл .pptx · число страниц зависит от доступной памяти браузера',
  uk: 'Один незашифрований PDF або незахищений файл .pptx · кількість сторінок залежить від доступної пам’яті браузера',
  ar: 'ملف PDF واحد غير مشفر أو ملف .pptx غير محمي · يعتمد عدد الصفحات على ذاكرة المتصفح المتاحة',
  hi: 'एक अनएन्क्रिप्टेड PDF या असुरक्षित .pptx फ़ाइल · पेजों की संख्या ब्राउज़र की उपलब्ध मेमोरी पर निर्भर करती है',
  ja: '暗号化されていない PDF または保護されていない .pptx ファイル 1 件・ページ数はブラウザーの空きメモリによる',
  ko: '암호화되지 않은 PDF 또는 보호되지 않은 .pptx 파일 1개 · 페이지 수는 브라우저 메모리 여유에 따라 달라집니다',
  'zh-CN': '1 个未加密 PDF 或未受保护的 .pptx 文件 · 页面数量取决于浏览器可用内存'
};

const powerpointCautions = {
  en: 'Output pages are images, so text is not editable or searchable. PPTX rendering may request substitute fonts from Google Fonts; the presentation itself stays in your browser.',
  es: 'Las páginas de salida son imágenes y el texto no se puede editar ni buscar. La conversión de PPTX puede solicitar fuentes sustitutas a Google Fonts; la presentación permanece en el navegador.',
  fr: 'Les pages de sortie sont des images, le texte n’est donc ni modifiable ni consultable. Le rendu PPTX peut demander des polices de remplacement à Google Fonts ; la présentation reste dans votre navigateur.',
  de: 'Die Ausgabeseiten sind Bilder; Text ist daher nicht bearbeitbar oder durchsuchbar. Beim PPTX-Rendern können Ersatzschriften von Google Fonts angefordert werden; die Präsentation bleibt im Browser.',
  pt: 'As páginas de saída são imagens, portanto o texto não pode ser editado nem pesquisado. A renderização de PPTX pode solicitar fontes substitutas do Google Fonts; a apresentação permanece no navegador.',
  it: 'Le pagine di output sono immagini, quindi il testo non è modificabile né ricercabile. Il rendering PPTX può richiedere font sostitutivi da Google Fonts; la presentazione resta nel browser.',
  nl: 'Uitvoerpagina’s zijn afbeeldingen, dus tekst is niet bewerkbaar of doorzoekbaar. PPTX-rendering kan vervangende lettertypen van Google Fonts aanvragen; de presentatie blijft in de browser.',
  pl: 'Strony wynikowe są obrazami, więc tekstu nie można edytować ani wyszukiwać. Renderowanie PPTX może pobierać czcionki zastępcze z Google Fonts; prezentacja pozostaje w przeglądarce.',
  sv: 'Utdata består av bilder, så texten kan inte redigeras eller sökas. PPTX-rendering kan begära ersättningsteckensnitt från Google Fonts; presentationen stannar i webbläsaren.',
  fi: 'Tulossivut ovat kuvia, joten tekstiä ei voi muokata eikä hakea. PPTX-renderöinti voi pyytää korvaavia fontteja Google Fontsista; esitys pysyy selaimessa.',
  da: 'Outputtet består af billeder, så teksten kan ikke redigeres eller søges. PPTX-gengivelse kan hente erstatningsskrifttyper fra Google Fonts; præsentationen bliver i browseren.',
  nb: 'Resultatet består av bilder, så teksten kan ikke redigeres eller søkes. PPTX-gjengivelse kan be om erstatningsfonter fra Google Fonts; presentasjonen forblir i nettleseren.',
  tr: 'Çıktı sayfaları resimdir; metin düzenlenemez veya aranamaz. PPTX görüntüleme, Google Fonts’tan yedek yazı tipleri isteyebilir; sunum tarayıcınızda kalır.',
  ru: 'Страницы результата — изображения, поэтому текст нельзя редактировать или искать. При отображении PPTX могут запрашиваться заменяющие шрифты Google Fonts; презентация остаётся в браузере.',
  uk: 'Сторінки результату є зображеннями, тому текст не можна редагувати чи шукати. Для відтворення PPTX можуть запитуватися шрифти-замінники Google Fonts; презентація залишається в браузері.',
  ar: 'صفحات الإخراج صور، لذا لا يمكن تحرير النص أو البحث فيه. قد يطلب عرض PPTX خطوطًا بديلة من Google Fonts؛ وتبقى العروض التقديمية في المتصفح.',
  hi: 'आउटपुट पेज इमेज हैं, इसलिए टेक्स्ट संपादित या खोजा नहीं जा सकता। PPTX रेंडरिंग Google Fonts से वैकल्पिक फ़ॉन्ट मांग सकती है; प्रस्तुति ब्राउज़र में ही रहती है।',
  ja: '出力ページは画像のため、テキストの編集や検索はできません。PPTX の描画時に Google Fonts へ代替フォントを要求する場合がありますが、プレゼンテーション自体はブラウザー内に留まります。',
  ko: '출력 페이지는 이미지이므로 텍스트를 편집하거나 검색할 수 없습니다. PPTX 렌더링 중 Google Fonts에 대체 글꼴을 요청할 수 있지만 프레젠테이션 자체는 브라우저에 남습니다.',
  'zh-CN': '输出页面为图片，无法编辑或搜索文本。渲染 PPTX 时可能会向 Google Fonts 请求替代字体；演示文稿本身始终留在浏览器中。'
};

const markdownFileRules = {
  en: 'One unencrypted PDF, .md, or plain-text file',
  es: 'Un PDF sin contraseña, un archivo .md o un archivo de texto',
  fr: 'Un PDF non chiffré, un fichier .md ou un fichier texte',
  de: 'Eine unverschlüsselte PDF-, .md- oder Textdatei',
  pt: 'Um PDF sem senha, arquivo .md ou arquivo de texto',
  it: 'Un PDF non crittografato, un file .md o un file di testo',
  nl: 'Eén niet-versleutelde PDF, .md- of tekstbestand',
  pl: 'Jeden niezaszyfrowany plik PDF, .md lub tekstowy',
  sv: 'En okrypterad PDF-, .md- eller textfil',
  fi: 'Yksi salaamaton PDF-, .md- tai tekstitiedosto',
  da: 'Én ukrypteret PDF-, .md- eller tekstfil',
  nb: 'Én ukryptert PDF-, .md- eller tekstfil',
  tr: 'Şifrelenmemiş bir PDF, .md veya metin dosyası',
  ru: 'Один незашифрованный PDF-файл, файл .md или текстовый файл',
  uk: 'Один незашифрований PDF-файл, файл .md або текстовий файл',
  ar: 'ملف PDF واحد غير مشفر أو ملف ‎.md أو ملف نصي',
  hi: 'एक एन्क्रिप्ट न की गई PDF, .md या टेक्स्ट फ़ाइल',
  ja: '暗号化されていない PDF、.md、またはテキストファイルを 1 つ',
  ko: '암호화되지 않은 PDF, .md 또는 텍스트 파일 1개',
  'zh-CN': '一个未加密的 PDF、.md 或纯文本文件'
};

for (const { code } of SUPPORTED_LANGUAGES) {
  translations[code].rules.powerpointPdfOne = powerpointPdfRuleTranslations[code];
  translations[code].rules.markdownFileOne = markdownFileRules[code];
  translations[code].cautions.powerpoint = `${powerpointCautions[code]} ${TOOL_UI_TRANSLATIONS[code].powerpoint.fontNameDisclosure}`;
}

const faqTranslations = {
  es: ['¿Qué hace esta herramienta?', '¿Qué archivos puedo usar?', '¿Se modifica el archivo original?', '¿Se suben mis archivos?', '¿Qué debo tener en cuenta?', 'No. La herramienta crea un archivo nuevo y conserva el original sin cambios.', 'No. El archivo se procesa en tu navegador y no se envía a un servidor de procesamiento. El sitio y el proveedor de alojamiento pueden recibir solicitudes normales y mantener registros.'],
  fr: ['Que fait cet outil ?', 'Quels fichiers puis-je utiliser ?', 'Le fichier d’origine est-il modifié ?', 'Mes fichiers sont-ils envoyés ?', 'Que dois-je savoir avant de commencer ?', 'Non. L’outil crée un nouveau fichier et ne modifie pas l’original.', 'Non. Le fichier est traité dans votre navigateur et n’est pas envoyé à un serveur de traitement. Le site et l’hébergeur peuvent recevoir des requêtes ordinaires et conserver des journaux.'],
  de: ['Was macht dieses Tool?', 'Welche Dateien kann ich verwenden?', 'Wird die Originaldatei geändert?', 'Werden meine Dateien hochgeladen?', 'Was sollte ich vorher wissen?', 'Nein. Das Tool erstellt eine separate Ausgabedatei und ändert das Original nicht.', 'Nein. Die Datei wird in deinem Browser verarbeitet und nicht an einen Verarbeitungsserver gesendet. Die Website und der Hosting-Anbieter können normale Anfragen empfangen und Protokolle speichern.'],
  pt: ['O que esta ferramenta faz?', 'Quais arquivos posso usar?', 'O arquivo original é alterado?', 'Meus arquivos são enviados?', 'O que devo saber antes de começar?', 'Não. A ferramenta cria um arquivo separado e mantém o original inalterado.', 'Não. O arquivo é processado no navegador e não é enviado a um servidor de processamento. O site e a hospedagem podem receber solicitações comuns e manter registros.'],
  it: ['Cosa fa questo strumento?', 'Quali file posso usare?', 'Il file originale viene modificato?', 'I miei file vengono caricati?', 'Cosa devo sapere prima di iniziare?', 'No. Lo strumento crea un file separato e lascia invariato l’originale.', 'No. Il file viene elaborato nel browser e non viene inviato a un server di elaborazione. Il sito e il provider di hosting possono ricevere normali richieste e conservare i log.'],
  nl: ['Wat doet deze tool?', 'Welke bestanden kan ik gebruiken?', 'Wordt het originele bestand gewijzigd?', 'Worden mijn bestanden geüpload?', 'Wat moet ik vooraf weten?', 'Nee. De tool maakt een apart uitvoerbestand en laat het origineel ongewijzigd.', 'Nee. Het bestand wordt in je browser verwerkt en niet naar een verwerkingsserver gestuurd. De website en hostingprovider kunnen gewone verzoeken ontvangen en logboeken bewaren.'],
  pl: ['Co robi to narzędzie?', 'Jakich plików mogę użyć?', 'Czy oryginalny plik zostanie zmieniony?', 'Czy moje pliki są przesyłane?', 'Co warto wiedzieć przed rozpoczęciem?', 'Nie. Narzędzie tworzy osobny plik wynikowy i nie zmienia oryginału.', 'Nie. Plik jest przetwarzany w przeglądarce i nie jest wysyłany na serwer. Witryna i dostawca hostingu mogą otrzymywać zwykłe żądania i przechowywać logi.'],
  sv: ['Vad gör det här verktyget?', 'Vilka filer kan jag använda?', 'Ändras originalfilen?', 'Laddas mina filer upp?', 'Vad bör jag känna till innan jag börjar?', 'Nej. Verktyget skapar en separat utdatafil och lämnar originalet oförändrat.', 'Nej. Filen behandlas i webbläsaren och skickas inte till en bearbetningsserver. Webbplatsen och webbhotellet kan ta emot vanliga förfrågningar och spara loggar.'],
  fi: ['Mitä tämä työkalu tekee?', 'Mitä tiedostoja voin käyttää?', 'Muuttuuko alkuperäinen tiedosto?', 'Ladataanko tiedostoni palvelimelle?', 'Mitä minun on hyvä tietää ennen aloittamista?', 'Ei. Työkalu luo erillisen tulostiedoston ja jättää alkuperäisen ennalleen.', 'Ei. Tiedosto käsitellään selaimessa eikä sitä lähetetä käsittelypalvelimelle. Sivusto ja palveluntarjoaja voivat vastaanottaa tavallisia pyyntöjä ja säilyttää lokitietoja.'],
  da: ['Hvad gør dette værktøj?', 'Hvilke filer kan jeg bruge?', 'Ændres originalfilen?', 'Uploades mine filer?', 'Hvad bør jeg vide, før jeg går i gang?', 'Nej. Værktøjet opretter en separat outputfil og lader originalen være uændret.', 'Nej. Filen behandles i browseren og sendes ikke til en behandlingsserver. Webstedet og hostingudbyderen kan modtage almindelige anmodninger og gemme logfiler.'],
  nb: ['Hva gjør dette verktøyet?', 'Hvilke filer kan jeg bruke?', 'Endres originalfilen?', 'Lastes filene mine opp?', 'Hva bør jeg vite før jeg starter?', 'Nei. Verktøyet lager en separat resultatfil og lar originalen være uendret.', 'Nei. Filen behandles i nettleseren og sendes ikke til en behandlingsserver. Nettstedet og vertsleverandøren kan motta vanlige forespørsler og lagre logger.'],
  tr: ['Bu araç ne işe yarar?', 'Hangi dosyaları kullanabilirim?', 'Özgün dosya değiştirilir mi?', 'Dosyalarım yükleniyor mu?', 'Başlamadan önce neleri bilmeliyim?', 'Hayır. Araç ayrı bir çıktı oluşturur ve özgün dosyayı değiştirmez.', 'Hayır. Dosya tarayıcınızda işlenir ve bir işleme sunucusuna gönderilmez. Web sitesi ve barındırma sağlayıcısı normal istekler alabilir ve günlük kayıtları tutabilir.'],
  ru: ['Что делает этот инструмент?', 'Какие файлы можно использовать?', 'Изменится ли исходный файл?', 'Мои файлы загружаются на сервер?', 'Что важно знать перед началом?', 'Нет. Инструмент создаёт отдельный файл и не изменяет исходник.', 'Нет. Файл обрабатывается в браузере и не отправляется на сервер обработки. Сайт и хостинг-провайдер могут получать обычные запросы и хранить журналы.'],
  uk: ['Що робить цей інструмент?', 'Які файли можна використовувати?', 'Чи зміниться оригінальний файл?', 'Мої файли завантажуються на сервер?', 'Що важливо знати перед початком?', 'Ні. Інструмент створює окремий файл і не змінює оригінал.', 'Ні. Файл обробляється у браузері й не надсилається на сервер обробки. Сайт і хостинг-провайдер можуть отримувати звичайні запити та зберігати журнали.'],
  ar: ['ما وظيفة هذه الأداة؟', 'ما الملفات التي يمكنني استخدامها؟', 'هل يتغير الملف الأصلي؟', 'هل تُرفع ملفاتي؟', 'ما الذي ينبغي معرفته قبل البدء؟', 'لا. تنشئ الأداة ملفاً منفصلاً ولا تغيّر الملف الأصلي.', 'لا. تتم معالجة الملف في المتصفح ولا يُرسل إلى خادم معالجة. وقد يستقبل الموقع ومزوّد الاستضافة الطلبات العادية ويحتفظان بالسجلات.'],
  hi: ['यह टूल क्या करता है?', 'मैं कौन-सी फ़ाइलें इस्तेमाल कर सकता हूँ?', 'क्या मूल फ़ाइल बदलेगी?', 'क्या मेरी फ़ाइलें अपलोड होती हैं?', 'शुरू करने से पहले क्या जानना चाहिए?', 'नहीं। यह टूल अलग आउटपुट फ़ाइल बनाता है और मूल फ़ाइल को नहीं बदलता।', 'नहीं। फ़ाइल आपके ब्राउज़र में संसाधित होती है और प्रोसेसिंग सर्वर पर नहीं भेजी जाती। वेबसाइट और होस्टिंग प्रदाता को सामान्य अनुरोध मिल सकते हैं और वे लॉग रख सकते हैं।'],
  ja: ['このツールでは何ができますか？', '使用できるファイルは何ですか？', '元のファイルは変更されますか？', 'ファイルはアップロードされますか？', '使用前に知っておくことはありますか？', 'いいえ。別の出力ファイルを作成し、元のファイルは変更しません。', 'いいえ。ファイルはブラウザー内で処理され、処理サーバーには送信されません。ウェブサイトやホスティング事業者には通常のリクエストが届き、ログが保存される場合があります。'],
  ko: ['이 도구는 어떤 기능을 하나요?', '어떤 파일을 사용할 수 있나요?', '원본 파일이 변경되나요?', '파일이 업로드되나요?', '시작하기 전에 알아둘 점이 있나요?', '아니요. 별도의 결과 파일을 만들며 원본 파일은 변경하지 않습니다.', '아니요. 파일은 브라우저에서 처리되며 처리 서버로 전송되지 않습니다. 웹사이트와 호스팅 업체는 일반 요청을 받고 로그를 보관할 수 있습니다.'],
  'zh-CN': ['此工具有什么作用？', '可以使用哪些文件？', '原始文件会被修改吗？', '文件会上传吗？', '使用前需要了解什么？', '不会。工具会创建单独的输出文件，原始文件保持不变。', '不会。文件在浏览器中处理，不会发送到处理服务器。网站和托管服务商仍可能接收常规请求并保存日志。']
};

const mergeDetailTranslations = {
  es: [['Qué hace', 'Combina PDF completos o páginas seleccionadas de varios archivos en un solo documento.'], ['Cómo funciona', 'Previsualiza, selecciona y ordena las páginas; después las combina en tu navegador.'], ['Qué obtienes', 'Un PDF independiente en el orden elegido, con marcadores de origen y páginas en blanco opcionales.']],
  fr: [['Fonction', 'Réunit des PDF entiers ou des pages choisies de plusieurs fichiers dans un seul document.'], ['Fonctionnement', 'Prévisualisez, sélectionnez et organisez les pages, puis assemblez-les dans votre navigateur.'], ['Résultat', 'Un PDF distinct dans l’ordre choisi, avec des signets par fichier et des pages blanches facultatifs.']],
  de: [['Funktion', 'Führt vollständige PDFs oder ausgewählte Seiten aus mehreren Dateien in einem Dokument zusammen.'], ['Ablauf', 'Seiten in der Vorschau ansehen, auswählen und anordnen; anschließend werden sie im Browser zusammengeführt.'], ['Ergebnis', 'Ein separates PDF in der gewählten Reihenfolge, optional mit Quelldatei-Lesezeichen und Leerseiten.']],
  pt: [['O que faz', 'Combina PDFs inteiros ou páginas selecionadas de vários arquivos em um só documento.'], ['Como funciona', 'Visualize, selecione e organize as páginas; depois, combine-as no navegador.'], ['O que você recebe', 'Um PDF separado na ordem escolhida, com marcadores de origem e páginas em branco opcionais.']],
  it: [['Cosa fa', 'Unisce PDF completi o pagine selezionate da più file in un unico documento.'], ['Come funziona', 'Visualizza, seleziona e riordina le pagine, quindi uniscile nel browser.'], ['Risultato', 'Un PDF separato nell’ordine scelto, con segnalibri per i file e pagine vuote facoltativi.']],
  nl: [['Wat het doet', 'Voegt volledige PDF’s of geselecteerde pagina’s uit meerdere bestanden samen tot één document.'], ['Hoe het werkt', 'Bekijk, selecteer en rangschik pagina’s en voeg ze daarna samen in je browser.'], ['Wat je krijgt', 'Een aparte PDF in de gekozen volgorde, met optionele bronbladwijzers en lege pagina’s.']],
  pl: [['Co robi', 'Łączy całe pliki PDF lub wybrane strony z wielu plików w jeden dokument.'], ['Jak działa', 'Wyświetl podgląd, wybierz i uporządkuj strony, a następnie połącz je w przeglądarce.'], ['Wynik', 'Osobny plik PDF w wybranej kolejności, z opcjonalnymi zakładkami źródeł i pustymi stronami.']],
  sv: [['Vad det gör', 'Slår ihop hela PDF-filer eller valda sidor från flera filer till ett dokument.'], ['Så fungerar det', 'Förhandsgranska, välj och ordna sidor och slå sedan ihop dem i webbläsaren.'], ['Resultat', 'En separat PDF i vald ordning, med valfria källbokmärken och tomma sidor.']],
  fi: [['Mitä se tekee', 'Yhdistää kokonaisia PDF-tiedostoja tai valittuja sivuja useista tiedostoista yhdeksi asiakirjaksi.'], ['Näin se toimii', 'Esikatsele, valitse ja järjestä sivut ja yhdistä ne sitten selaimessa.'], ['Tulos', 'Erillinen PDF valitsemassasi järjestyksessä, sekä halutessasi lähdekirjanmerkit ja tyhjät sivut.']],
  da: [['Hvad det gør', 'Samler hele PDF-filer eller udvalgte sider fra flere filer i ét dokument.'], ['Sådan fungerer det', 'Forhåndsvis, vælg og arrangér siderne, og saml dem derefter i browseren.'], ['Resultat', 'En separat PDF i den valgte rækkefølge med valgfri kildebogmærker og tomme sider.']],
  nb: [['Hva det gjør', 'Slår sammen hele PDF-er eller valgte sider fra flere filer til ett dokument.'], ['Slik fungerer det', 'Forhåndsvis, velg og ordne sidene, og slå dem deretter sammen i nettleseren.'], ['Resultat', 'En egen PDF i valgt rekkefølge, med valgfrie kildebokmerker og blanke sider.']],
  tr: [['Ne yapar', 'Birden fazla dosyadaki PDF’leri veya seçilen sayfaları tek bir belgede birleştirir.'], ['Nasıl çalışır', 'Sayfaları önizleyin, seçin ve sıralayın; ardından tarayıcınızda birleştirin.'], ['Sonuç', 'Seçtiğiniz sırada ayrı bir PDF; isteğe bağlı kaynak yer işaretleri ve boş sayfalarla.']],
  ru: [['Что делает', 'Объединяет целые PDF-файлы или выбранные страницы из нескольких файлов в один документ.'], ['Как работает', 'Просматривайте, выбирайте и упорядочивайте страницы, затем объединяйте их в браузере.'], ['Результат', 'Отдельный PDF в выбранном порядке с дополнительными закладками источников и пустыми страницами.']],
  uk: [['Що робить', 'Об’єднує цілі PDF-файли або вибрані сторінки з кількох файлів в один документ.'], ['Як працює', 'Переглядайте, вибирайте й упорядковуйте сторінки, а потім об’єднуйте їх у браузері.'], ['Результат', 'Окремий PDF у вибраному порядку з додатковими закладками джерел і порожніми сторінками.']],
  ar: [['ما الذي تفعله', 'تجمع ملفات PDF كاملة أو صفحات محددة من ملفات متعددة في مستند واحد.'], ['كيف تعمل', 'عاين الصفحات وحددها ورتبها، ثم ادمجها في متصفحك.'], ['النتيجة', 'ملف PDF منفصل بالترتيب الذي اخترته، مع إشارات مرجعية للمصادر وصفحات فارغة اختيارية.']],
  hi: [['यह क्या करता है', 'कई फ़ाइलों के पूरे PDF या चुने हुए पेजों को एक दस्तावेज़ में जोड़ता है।'], ['यह कैसे काम करता है', 'पेजों का पूर्वावलोकन करें, चुनें और क्रम तय करें, फिर उन्हें ब्राउज़र में जोड़ें।'], ['आपको क्या मिलता है', 'चुने हुए क्रम में अलग PDF, जिसमें वैकल्पिक स्रोत बुकमार्क और खाली पेज हो सकते हैं।']],
  ja: [['できること', '複数ファイルの PDF 全体、または選択したページを 1 つの文書にまとめます。'], ['仕組み', 'ページをプレビューして選択・並べ替え、ブラウザー内で結合します。'], ['出力結果', '選択した順序の別 PDF。元ファイルごとのしおりや空白ページも追加できます。']],
  ko: [['기능', '여러 파일의 PDF 전체 또는 선택한 페이지를 하나의 문서로 합칩니다.'], ['작동 방식', '페이지를 미리 보고 선택하고 정렬한 다음 브라우저에서 합칩니다.'], ['결과물', '선택한 순서의 별도 PDF이며, 원본 책갈피와 빈 페이지를 선택적으로 추가할 수 있습니다.']],
  'zh-CN': [['功能', '将多个 PDF 文件合并，或将其中选定的页面合成一个文档。'], ['工作方式', '预览、选择并排列页面，然后在浏览器中完成合并。'], ['输出结果', '按所选顺序生成独立 PDF，并可添加来源书签和空白分隔页。']]
};

const detailPointHeadings = {
  en: { what: 'What it does', how: 'How it works', result: 'What you get' },
  ...Object.fromEntries(Object.entries(mergeDetailTranslations).map(([code, points]) => [code, {
    what: points[0][0],
    how: points[1][0],
    result: points[2][0]
  }]))
};

const requiredRuleKeys = Object.keys(translations.en.rules);
const requiredCautionKeys = Object.keys(translations.en.cautions);
for (const { code } of SUPPORTED_LANGUAGES) {
  const locale = translations[code];
  if (code === 'en') continue;
  if (!locale || !Array.isArray(locale.steps) || locale.steps.length !== 4) {
    throw new Error(`Tool page guide translations are incomplete for "${code}".`);
  }
  if (!faqTranslations[code] || faqTranslations[code].length !== 7) {
    throw new Error(`Tool page FAQ translations are incomplete for "${code}".`);
  }
  if (!detailPointHeadings[code]) {
    throw new Error(`Tool detail point labels are incomplete for "${code}".`);
  }
  if (requiredRuleKeys.some((key) => !locale.rules[key])) {
    throw new Error(`Tool page attachment limit translations are incomplete for "${code}".`);
  }
  if (requiredCautionKeys.some((key) => !locale.cautions[key])) {
    throw new Error(`Tool page caution translations are incomplete for "${code}".`);
  }
}

export const TOOL_PAGE_TRANSLATIONS = translations;
export const TOOL_PAGE_FAQ_TRANSLATIONS = faqTranslations;

export const getLocalizedToolPage = (language, toolId, localizedTool, content, attachmentRule) => {
  if (language === 'en' || !translations[language]) {
    return {
      intro: content.intro,
      detailPoints: Object.entries(content.detailPoints).map(([key, text]) => ({ key, text })),
      detailPointHeadings: detailPointHeadings.en,
      steps: content.steps,
      attachment: attachmentRule,
      faqs: content.faqs
    };
  }

  const messages = translations[language];
  const localizedRule = attachmentRule ? messages.rules[attachmentRule.ruleKey] : null;
  if (attachmentRule && !localizedRule) {
    throw new Error(`Missing localized attachment rule "${attachmentRule.ruleKey}" for "${language}".`);
  }
  const localizedAttachmentInfo = localizedTool?.description
    ? `${localizedTool.description} ${messages.cautions[toolId] || messages.attachmentNote}`
    : messages.cautions[toolId] || messages.attachmentNote;
  const detailPoints = toolId === 'merge'
    ? mergeDetailTranslations[language].map(([, text], index) => ({
        key: ['what', 'how', 'result'][index],
        text
      }))
    : [
        { key: 'what', text: localizedTool?.description || content.detailPoints.what },
        { key: 'how', text: messages.steps[1] },
        { key: 'result', text: `${messages.steps[3]} ${messages.attachmentNote}` }
      ];
  return {
    intro: messages.introSuffix,
    detailPoints,
    detailPointHeadings: detailPointHeadings[language],
    steps: messages.steps,
    faqs: [
      [faqTranslations[language][0], localizedTool?.description || faqTranslations[language][6]],
      [faqTranslations[language][1], localizedRule || faqTranslations[language][6]],
      [faqTranslations[language][2], faqTranslations[language][5]],
      [faqTranslations[language][3], faqTranslations[language][6]],
      [faqTranslations[language][4], localizedAttachmentInfo]
    ],
    attachment: attachmentRule ? {
      ...attachmentRule,
      rule: localizedRule,
      info: localizedAttachmentInfo
    } : attachmentRule
  };
};
