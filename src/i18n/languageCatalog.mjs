export const SUPPORTED_LANGUAGES = [
  { code: 'en', name: 'English' },
  { code: 'es', name: 'Español' },
  { code: 'fr', name: 'Français' },
  { code: 'de', name: 'Deutsch' },
  { code: 'pt', name: 'Português' },
  { code: 'it', name: 'Italiano' },
  { code: 'nl', name: 'Nederlands' },
  { code: 'pl', name: 'Polski' },
  { code: 'sv', name: 'Svenska' },
  { code: 'fi', name: 'Suomi' },
  { code: 'da', name: 'Dansk' },
  { code: 'nb', name: 'Norsk bokmål' },
  { code: 'tr', name: 'Türkçe' },
  { code: 'ru', name: 'Русский' },
  { code: 'uk', name: 'Українська' },
  { code: 'ar', name: 'العربية' },
  { code: 'hi', name: 'हिन्दी' },
  { code: 'ja', name: '日本語' },
  { code: 'ko', name: '한국어' },
  { code: 'zh-CN', name: '简体中文' }
];

export const LANGUAGE_REGIONS = [
  {
    name: 'Europe',
    languages: ['en', 'fr', 'de', 'it', 'nl', 'pl', 'sv', 'fi', 'da', 'nb']
  },
  { name: 'Americas', languages: ['es', 'pt'] },
  { name: 'Middle East & Eurasia', languages: ['tr', 'ru', 'uk', 'ar'] },
  { name: 'South & East Asia', languages: ['hi', 'ja', 'ko', 'zh-CN'] }
];

const keys = [
  'home', 'faq', 'guides', 'language', 'chooseLanguage', 'allTools', 'categories',
  'privacy', 'contact', 'about', 'terms', 'darkMode', 'lightMode',
  'switchToDarkMode', 'switchToLightMode', 'mainNavigation', 'footerNavigation',
  'pdfToolkit', 'viewCategory', 'allRightsReserved', 'category.organize', 'category.convert',
  'category.edit-sign', 'category.protect-repair', 'category.extract-analyze'
];

const extraKeys = [
  'homeEyebrow', 'homeTitle', 'homeTagline', 'homeDescription', 'homeExplore',
  'browseToolCategories', 'categoryEyebrow', 'allPdfTools', 'toolsIn',
  'toolsToChooseFrom', 'browseAllCategories', 'hide', 'show', 'searchPdfTools',
  'findPdfTool', 'clearSearch', 'matchingTools', 'noMatchingTools'
];

const workflowKeys = [
  'howToUse', 'howItWorks', 'frequentlyAskedQuestions', 'uploadToTool',
  'processDocumentInBrowser', 'download', 'filesStayInBrowser', 'privacyPolicy',
  'conversionStatus', 'toolbox', 'selectToolToGetStarted', 'toolWorkspace',
  'instructionsAndWorkflow', 'attachPdfHere', 'attachPdfsHere',
  'attachImagesHere', 'relatedTools'
];

const translations = {
  en: ['Home', 'FAQ', 'Guides', 'Language', 'Choose language', 'All tools', 'Categories', 'Privacy', 'Contact', 'About', 'Terms', 'Dark mode', 'Light mode', 'Switch to dark mode', 'Switch to light mode', 'Main navigation', 'Footer navigation', 'PDF toolkit', 'View category', 'All rights reserved.', 'Organize', 'Convert', 'Edit & Sign', 'Protect & Repair', 'Extract'],
  es: ['Inicio', 'Preguntas frecuentes', 'Guías', 'Idioma', 'Elegir idioma', 'Todas las herramientas', 'Categorías', 'Privacidad', 'Contacto', 'Acerca de', 'Términos', 'Modo oscuro', 'Modo claro', 'Cambiar al modo oscuro', 'Cambiar al modo claro', 'Navegación principal', 'Navegación del pie de página', 'Herramientas PDF', 'Ver categoría', 'Todos los derechos reservados.', 'Organizar', 'Convertir', 'Editar y firmar', 'Proteger y reparar', 'Extraer'],
  fr: ['Accueil', 'FAQ', 'Guides', 'Langue', 'Choisir la langue', 'Tous les outils', 'Catégories', 'Confidentialité', 'Contact', 'À propos', 'Conditions', 'Mode sombre', 'Mode clair', 'Passer au mode sombre', 'Passer au mode clair', 'Navigation principale', 'Navigation de pied de page', 'Outils PDF', 'Voir la catégorie', 'Tous droits réservés.', 'Organiser', 'Convertir', 'Modifier et signer', 'Protéger et réparer', 'Extraire'],
  de: ['Startseite', 'FAQ', 'Anleitungen', 'Sprache', 'Sprache auswählen', 'Alle Tools', 'Kategorien', 'Datenschutz', 'Kontakt', 'Über uns', 'Nutzungsbedingungen', 'Dunkelmodus', 'Hellmodus', 'Zum Dunkelmodus wechseln', 'Zum Hellmodus wechseln', 'Hauptnavigation', 'Fußzeilennavigation', 'PDF-Werkzeuge', 'Kategorie ansehen', 'Alle Rechte vorbehalten.', 'Organisieren', 'Konvertieren', 'Bearbeiten und signieren', 'Schützen und reparieren', 'Extrahieren'],
  pt: ['Início', 'Perguntas frequentes', 'Guias', 'Idioma', 'Escolher idioma', 'Todas as ferramentas', 'Categorias', 'Privacidade', 'Contato', 'Sobre', 'Termos', 'Modo escuro', 'Modo claro', 'Mudar para modo escuro', 'Mudar para modo claro', 'Navegação principal', 'Navegação do rodapé', 'Ferramentas PDF', 'Ver categoria', 'Todos os direitos reservados.', 'Organizar', 'Converter', 'Editar e assinar', 'Proteger e reparar', 'Extrair'],
  it: ['Home', 'Domande frequenti', 'Guide', 'Lingua', 'Scegli la lingua', 'Tutti gli strumenti', 'Categorie', 'Privacy', 'Contatti', 'Informazioni', 'Termini', 'Modalità scura', 'Modalità chiara', 'Passa alla modalità scura', 'Passa alla modalità chiara', 'Navigazione principale', 'Navigazione piè di pagina', 'Strumenti PDF', 'Visualizza categoria', 'Tutti i diritti riservati.', 'Organizza', 'Converti', 'Modifica e firma', 'Proteggi e ripara', 'Estrai'],
  nl: ['Startpagina', 'Veelgestelde vragen', 'Handleidingen', 'Taal', 'Taal kiezen', 'Alle tools', 'Categorieën', 'Privacy', 'Contact', 'Over', 'Voorwaarden', 'Donkere modus', 'Lichte modus', 'Overschakelen naar donkere modus', 'Overschakelen naar lichte modus', 'Hoofdnavigatie', 'Voetnavigatie', 'PDF-hulpmiddelen', 'Categorie bekijken', 'Alle rechten voorbehouden.', 'Organiseren', 'Converteren', 'Bewerken en ondertekenen', 'Beveiligen en herstellen', 'Extraheren'],
  pl: ['Strona główna', 'Często zadawane pytania', 'Poradniki', 'Język', 'Wybierz język', 'Wszystkie narzędzia', 'Kategorie', 'Prywatność', 'Kontakt', 'O nas', 'Warunki', 'Tryb ciemny', 'Tryb jasny', 'Przełącz na tryb ciemny', 'Przełącz na tryb jasny', 'Nawigacja główna', 'Nawigacja stopki', 'Narzędzia PDF', 'Zobacz kategorię', 'Wszelkie prawa zastrzeżone.', 'Organizuj', 'Konwertuj', 'Edytuj i podpisuj', 'Chroń i napraw', 'Wyodrębnij'],
  sv: ['Hem', 'Vanliga frågor', 'Guider', 'Språk', 'Välj språk', 'Alla verktyg', 'Kategorier', 'Integritet', 'Kontakt', 'Om', 'Villkor', 'Mörkt läge', 'Ljust läge', 'Byt till mörkt läge', 'Byt till ljust läge', 'Huvudmeny', 'Sidfotsmeny', 'PDF-verktyg', 'Visa kategori', 'Med ensamrätt.', 'Organisera', 'Konvertera', 'Redigera och signera', 'Skydda och reparera', 'Extrahera'],
  fi: ['Etusivu', 'Usein kysytyt kysymykset', 'Oppaat', 'Kieli', 'Valitse kieli', 'Kaikki työkalut', 'Kategoriat', 'Tietosuoja', 'Yhteystiedot', 'Tietoa meistä', 'Käyttöehdot', 'Tumma tila', 'Vaalea tila', 'Vaihda tummaan tilaan', 'Vaihda vaaleaan tilaan', 'Päävalikko', 'Alatunnisteen valikko', 'PDF-työkalut', 'Näytä kategoria', 'Kaikki oikeudet pidätetään.', 'Järjestä', 'Muunna', 'Muokkaa ja allekirjoita', 'Suojaa ja korjaa', 'Poimi'],
  da: ['Hjem', 'Ofte stillede spørgsmål', 'Vejledninger', 'Sprog', 'Vælg sprog', 'Alle værktøjer', 'Kategorier', 'Privatliv', 'Kontakt', 'Om', 'Vilkår', 'Mørk tilstand', 'Lys tilstand', 'Skift til mørk tilstand', 'Skift til lys tilstand', 'Hovednavigation', 'Sidefodsnavigation', 'PDF-værktøjer', 'Se kategori', 'Alle rettigheder forbeholdes.', 'Organiser', 'Konverter', 'Rediger og underskriv', 'Beskyt og reparer', 'Udtræk'],
  nb: ['Hjem', 'Vanlige spørsmål', 'Veiledninger', 'Språk', 'Velg språk', 'Alle verktøy', 'Kategorier', 'Personvern', 'Kontakt', 'Om', 'Vilkår', 'Mørk modus', 'Lys modus', 'Bytt til mørk modus', 'Bytt til lys modus', 'Hovedmeny', 'Bunnmeny', 'PDF-verktøy', 'Vis kategori', 'Alle rettigheter forbeholdt.', 'Organiser', 'Konverter', 'Rediger og signer', 'Beskytt og reparer', 'Hent ut'],
  tr: ['Ana sayfa', 'Sık sorulan sorular', 'Kılavuzlar', 'Dil', 'Dil seçin', 'Tüm araçlar', 'Kategoriler', 'Gizlilik', 'İletişim', 'Hakkında', 'Kullanım koşulları', 'Koyu mod', 'Açık mod', 'Koyu moda geç', 'Açık moda geç', 'Ana gezinme', 'Alt bilgi gezinmesi', 'PDF araçları', 'Kategoriyi görüntüle', 'Tüm hakları saklıdır.', 'Düzenle', 'Dönüştür', 'Düzenle ve imzala', 'Koru ve onar', 'Ayıkla'],
  ru: ['Главная', 'Частые вопросы', 'Руководства', 'Язык', 'Выберите язык', 'Все инструменты', 'Категории', 'Конфиденциальность', 'Контакты', 'О проекте', 'Условия', 'Тёмная тема', 'Светлая тема', 'Включить тёмную тему', 'Включить светлую тему', 'Главная навигация', 'Навигация в подвале', 'Инструменты PDF', 'Открыть категорию', 'Все права защищены.', 'Организация', 'Конвертация', 'Редактирование и подпись', 'Защита и восстановление', 'Извлечение'],
  uk: ['Головна', 'Поширені запитання', 'Посібники', 'Мова', 'Виберіть мову', 'Усі інструменти', 'Категорії', 'Конфіденційність', 'Контакти', 'Про нас', 'Умови', 'Темний режим', 'Світлий режим', 'Увімкнути темний режим', 'Увімкнути світлий режим', 'Головна навігація', 'Навігація в підвалі', 'Інструменти PDF', 'Переглянути категорію', 'Усі права захищено.', 'Упорядкувати', 'Конвертувати', 'Редагувати й підписати', 'Захистити й відновити', 'Витягти'],
  ar: ['الرئيسية', 'الأسئلة الشائعة', 'الأدلة', 'اللغة', 'اختر اللغة', 'كل الأدوات', 'الفئات', 'الخصوصية', 'اتصل بنا', 'حول الموقع', 'الشروط', 'الوضع الداكن', 'الوضع الفاتح', 'التبديل إلى الوضع الداكن', 'التبديل إلى الوضع الفاتح', 'التنقل الرئيسي', 'تنقل التذييل', 'أدوات PDF', 'عرض الفئة', 'جميع الحقوق محفوظة.', 'تنظيم', 'تحويل', 'تحرير وتوقيع', 'حماية وإصلاح', 'استخراج'],
  hi: ['होम', 'अक्सर पूछे जाने वाले प्रश्न', 'गाइड', 'भाषा', 'भाषा चुनें', 'सभी टूल', 'श्रेणियाँ', 'गोपनीयता', 'संपर्क', 'परिचय', 'नियम और शर्तें', 'डार्क मोड', 'लाइट मोड', 'डार्क मोड पर जाएँ', 'लाइट मोड पर जाएँ', 'मुख्य नेविगेशन', 'फ़ूटर नेविगेशन', 'PDF टूल', 'श्रेणी देखें', 'सर्वाधिकार सुरक्षित।', 'व्यवस्थित करें', 'बदलें', 'संपादित और हस्ताक्षर करें', 'सुरक्षित और मरम्मत करें', 'निकालें'],
  ja: ['ホーム', 'よくある質問', 'ガイド', '言語', '言語を選択', 'すべてのツール', 'カテゴリ', 'プライバシー', 'お問い合わせ', 'このサイトについて', '利用規約', 'ダークモード', 'ライトモード', 'ダークモードに切り替え', 'ライトモードに切り替え', 'メインナビゲーション', 'フッターナビゲーション', 'PDFツール', 'カテゴリを見る', '無断転載を禁じます。', '整理', '変換', '編集と署名', '保護と修復', '抽出'],
  ko: ['홈', '자주 묻는 질문', '가이드', '언어', '언어 선택', '모든 도구', '카테고리', '개인정보', '문의', '소개', '이용 약관', '다크 모드', '라이트 모드', '다크 모드로 전환', '라이트 모드로 전환', '주요 탐색', '푸터 탐색', 'PDF 도구', '카테고리 보기', '모든 권리 보유.', '정리', '변환', '편집 및 서명', '보호 및 복구', '추출'],
  'zh-CN': ['首页', '常见问题', '指南', '语言', '选择语言', '所有工具', '类别', '隐私', '联系', '关于', '使用条款', '深色模式', '浅色模式', '切换到深色模式', '切换到浅色模式', '主导航', '页脚导航', 'PDF 工具', '查看类别', '版权所有。', '整理', '转换', '编辑与签名', '保护与修复', '提取']
};

const extraTranslations = {
  en: ['PDF tools, made simple', 'Powerful PDF Tools', 'All in one place.', 'Browser-based tools for everyday PDF tasks. Processing details and limitations are explained on each tool page.', 'Explore PDF tools', 'Browse tool categories', 'PDF tool category', 'All PDF tools', 'Tools in', 'tools to choose from', 'Browse all categories', 'Hide', 'Show', 'Search PDF tools', 'Find a PDF tool', 'Clear search', 'Matching PDF tools', 'No tools match'],
  es: ['Herramientas PDF, simplificadas', 'Potentes herramientas PDF', 'Todo en un solo lugar.', 'Herramientas en el navegador para tareas PDF cotidianas. Cada herramienta explica el proceso y sus limitaciones.', 'Explorar herramientas PDF', 'Explorar categorías de herramientas', 'Categoría de herramientas PDF', 'Todas las herramientas PDF', 'Herramientas en', 'herramientas disponibles', 'Ver todas las categorías', 'Ocultar', 'Mostrar', 'Buscar herramientas PDF', 'Buscar una herramienta PDF', 'Borrar búsqueda', 'Herramientas PDF coincidentes', 'No hay herramientas que coincidan'],
  fr: ['Les outils PDF en toute simplicité', 'Des outils PDF performants', 'Tout au même endroit.', 'Des outils dans le navigateur pour les tâches PDF courantes. Chaque page explique le traitement et ses limites.', 'Explorer les outils PDF', 'Parcourir les catégories', 'Catégorie d’outils PDF', 'Tous les outils PDF', 'Outils de la catégorie', 'outils disponibles', 'Voir toutes les catégories', 'Masquer', 'Afficher', 'Rechercher des outils PDF', 'Rechercher un outil PDF', 'Effacer la recherche', 'Outils PDF correspondants', 'Aucun outil ne correspond'],
  de: ['PDF-Tools, ganz einfach', 'Leistungsstarke PDF-Tools', 'Alles an einem Ort.', 'Browserbasierte Tools für alltägliche PDF-Aufgaben. Verarbeitung und Einschränkungen werden auf jeder Tool-Seite erläutert.', 'PDF-Tools entdecken', 'Tool-Kategorien durchsuchen', 'PDF-Tool-Kategorie', 'Alle PDF-Tools', 'Tools in', 'Tools zur Auswahl', 'Alle Kategorien ansehen', 'Ausblenden', 'Anzeigen', 'PDF-Tools suchen', 'PDF-Tool finden', 'Suche löschen', 'Passende PDF-Tools', 'Keine passenden Tools gefunden'],
  pt: ['Ferramentas PDF sem complicação', 'Ferramentas PDF poderosas', 'Tudo em um só lugar.', 'Ferramentas no navegador para tarefas PDF do dia a dia. Cada página explica o processamento e suas limitações.', 'Explorar ferramentas PDF', 'Explorar categorias de ferramentas', 'Categoria de ferramentas PDF', 'Todas as ferramentas PDF', 'Ferramentas em', 'ferramentas disponíveis', 'Ver todas as categorias', 'Ocultar', 'Mostrar', 'Pesquisar ferramentas PDF', 'Encontrar uma ferramenta PDF', 'Limpar pesquisa', 'Ferramentas PDF correspondentes', 'Nenhuma ferramenta corresponde'],
  it: ['Strumenti PDF, in modo semplice', 'Potenti strumenti PDF', 'Tutto in un unico posto.', 'Strumenti nel browser per le attività PDF quotidiane. Ogni pagina spiega il trattamento e i relativi limiti.', 'Esplora gli strumenti PDF', 'Sfoglia le categorie', 'Categoria di strumenti PDF', 'Tutti gli strumenti PDF', 'Strumenti in', 'strumenti disponibili', 'Visualizza tutte le categorie', 'Nascondi', 'Mostra', 'Cerca strumenti PDF', 'Trova uno strumento PDF', 'Cancella ricerca', 'Strumenti PDF corrispondenti', 'Nessuno strumento corrisponde'],
  nl: ['PDF-tools, eenvoudig gemaakt', 'Krachtige PDF-tools', 'Alles op één plek.', 'Tools in de browser voor dagelijkse PDF-taken. Elke toolpagina beschrijft de verwerking en beperkingen.', 'PDF-tools ontdekken', 'Toolcategorieën bekijken', 'PDF-toolcategorie', 'Alle PDF-tools', 'Tools in', 'tools om uit te kiezen', 'Alle categorieën bekijken', 'Verbergen', 'Tonen', 'PDF-tools zoeken', 'Een PDF-tool zoeken', 'Zoekopdracht wissen', 'Overeenkomende PDF-tools', 'Geen tools gevonden die overeenkomen'],
  pl: ['Narzędzia PDF bez komplikacji', 'Zaawansowane narzędzia PDF', 'Wszystko w jednym miejscu.', 'Narzędzia w przeglądarce do codziennych zadań PDF. Każda strona opisuje przetwarzanie i ograniczenia.', 'Przeglądaj narzędzia PDF', 'Przeglądaj kategorie narzędzi', 'Kategoria narzędzi PDF', 'Wszystkie narzędzia PDF', 'Narzędzia w kategorii', 'dostępne narzędzia', 'Zobacz wszystkie kategorie', 'Ukryj', 'Pokaż', 'Szukaj narzędzi PDF', 'Znajdź narzędzie PDF', 'Wyczyść wyszukiwanie', 'Pasujące narzędzia PDF', 'Brak pasujących narzędzi'],
  sv: ['PDF-verktyg, enkelt och smidigt', 'Kraftfulla PDF-verktyg', 'Allt på ett ställe.', 'Webbläsarbaserade verktyg för vanliga PDF-uppgifter. Varje verktygssida beskriver bearbetning och begränsningar.', 'Utforska PDF-verktyg', 'Bläddra bland verktygskategorier', 'PDF-verktygskategori', 'Alla PDF-verktyg', 'Verktyg i', 'verktyg att välja mellan', 'Visa alla kategorier', 'Dölj', 'Visa', 'Sök PDF-verktyg', 'Hitta ett PDF-verktyg', 'Rensa sökning', 'Matchande PDF-verktyg', 'Inga verktyg matchar'],
  fi: ['PDF-työkalut helposti', 'Tehokkaat PDF-työkalut', 'Kaikki yhdessä paikassa.', 'Selainpohjaiset työkalut tavallisiin PDF-tehtäviin. Jokaisella työkalusivulla kerrotaan käsittelystä ja rajoituksista.', 'Tutustu PDF-työkaluihin', 'Selaa työkaluluokkia', 'PDF-työkaluluokka', 'Kaikki PDF-työkalut', 'Luokan työkalut', 'valittavissa olevaa työkalua', 'Näytä kaikki luokat', 'Piilota', 'Näytä', 'Etsi PDF-työkaluja', 'Etsi PDF-työkalu', 'Tyhjennä haku', 'Hakua vastaavat PDF-työkalut', 'Hakua vastaavia työkaluja ei löytynyt'],
  da: ['PDF-værktøjer gjort enkle', 'Kraftfulde PDF-værktøjer', 'Alt samlet ét sted.', 'Browserbaserede værktøjer til almindelige PDF-opgaver. Hver værktøjsside beskriver behandling og begrænsninger.', 'Udforsk PDF-værktøjer', 'Gennemse værktøjskategorier', 'PDF-værktøjskategori', 'Alle PDF-værktøjer', 'Værktøjer i', 'værktøjer at vælge imellem', 'Se alle kategorier', 'Skjul', 'Vis', 'Søg efter PDF-værktøjer', 'Find et PDF-værktøj', 'Ryd søgning', 'Matchende PDF-værktøjer', 'Ingen værktøjer matcher'],
  nb: ['PDF-verktøy, gjort enkelt', 'Kraftige PDF-verktøy', 'Alt på ett sted.', 'Nettleserbaserte verktøy for vanlige PDF-oppgaver. Hver verktøyside forklarer behandling og begrensninger.', 'Utforsk PDF-verktøy', 'Bla gjennom verktøykategorier', 'PDF-verktøykategori', 'Alle PDF-verktøy', 'Verktøy i', 'verktøy å velge mellom', 'Vis alle kategorier', 'Skjul', 'Vis', 'Søk etter PDF-verktøy', 'Finn et PDF-verktøy', 'Tøm søk', 'Samsvarende PDF-verktøy', 'Ingen verktøy samsvarer'],
  tr: ['PDF araçları artık daha kolay', 'Güçlü PDF araçları', 'Hepsi tek bir yerde.', 'Günlük PDF işleri için tarayıcı tabanlı araçlar. Her araç sayfasında işlem ve sınırlamalar açıklanır.', 'PDF araçlarını keşfet', 'Araç kategorilerine göz at', 'PDF araç kategorisi', 'Tüm PDF araçları', 'Şunlardaki araçlar:', 'seçebileceğiniz araç', 'Tüm kategorilere göz at', 'Gizle', 'Göster', 'PDF araçlarını ara', 'Bir PDF aracı bul', 'Aramayı temizle', 'Eşleşen PDF araçları', 'Eşleşen araç yok'],
  ru: ['PDF-инструменты — это просто', 'Мощные инструменты PDF', 'Всё в одном месте.', 'Инструменты в браузере для повседневных задач с PDF. На странице каждого инструмента описаны обработка и ограничения.', 'Открыть инструменты PDF', 'Просмотреть категории инструментов', 'Категория инструментов PDF', 'Все инструменты PDF', 'Инструменты категории', 'инструментов на выбор', 'Все категории', 'Скрыть', 'Показать', 'Поиск инструментов PDF', 'Найти инструмент PDF', 'Очистить поиск', 'Подходящие инструменты PDF', 'Совпадений не найдено'],
  uk: ['PDF-інструменти — це просто', 'Потужні інструменти PDF', 'Усе в одному місці.', 'Інструменти у браузері для щоденних завдань із PDF. На сторінці кожного інструмента описано обробку та обмеження.', 'Переглянути інструменти PDF', 'Переглянути категорії інструментів', 'Категорія інструментів PDF', 'Усі інструменти PDF', 'Інструменти категорії', 'інструментів на вибір', 'Усі категорії', 'Приховати', 'Показати', 'Пошук інструментів PDF', 'Знайти інструмент PDF', 'Очистити пошук', 'Відповідні інструменти PDF', 'Збігів не знайдено'],
  ar: ['أدوات PDF ببساطة', 'أدوات PDF قوية', 'كل شيء في مكان واحد.', 'أدوات في المتصفح لمهام PDF اليومية. توضّح صفحة كل أداة تفاصيل المعالجة والقيود.', 'استكشف أدوات PDF', 'تصفح فئات الأدوات', 'فئة أدوات PDF', 'كل أدوات PDF', 'الأدوات في', 'أدوات للاختيار', 'تصفح كل الفئات', 'إخفاء', 'إظهار', 'ابحث عن أدوات PDF', 'ابحث عن أداة PDF', 'مسح البحث', 'أدوات PDF المطابقة', 'لا توجد أدوات مطابقة'],
  hi: ['PDF टूल, अब आसान', 'शक्तिशाली PDF टूल', 'सब कुछ एक ही जगह।', 'रोज़मर्रा के PDF कार्यों के लिए ब्राउज़र-आधारित टूल। हर टूल पेज पर प्रक्रिया और सीमाएँ बताई गई हैं।', 'PDF टूल देखें', 'टूल श्रेणियाँ देखें', 'PDF टूल श्रेणी', 'सभी PDF टूल', 'इस श्रेणी के टूल', 'उपलब्ध टूल', 'सभी श्रेणियाँ देखें', 'छिपाएँ', 'दिखाएँ', 'PDF टूल खोजें', 'PDF टूल ढूँढें', 'खोज साफ़ करें', 'मेल खाते PDF टूल', 'कोई टूल मेल नहीं खाता'],
  ja: ['PDFツールを簡単に', '高機能なPDFツール', 'すべてを一か所に。', '日常的なPDF作業に使えるブラウザツールです。処理内容と制限は各ツールページで説明します。', 'PDFツールを見る', 'ツールカテゴリを見る', 'PDFツールカテゴリ', 'すべてのPDFツール', 'カテゴリ内のツール', '個のツールから選択', 'すべてのカテゴリを見る', '非表示', '表示', 'PDFツールを検索', 'PDFツールを探す', '検索をクリア', '一致するPDFツール', '一致するツールはありません'],
  ko: ['간편한 PDF 도구', '강력한 PDF 도구', '모든 기능을 한곳에서.', '일상적인 PDF 작업을 위한 브라우저 기반 도구입니다. 각 도구 페이지에서 처리 방식과 제한 사항을 설명합니다.', 'PDF 도구 둘러보기', '도구 카테고리 둘러보기', 'PDF 도구 카테고리', '모든 PDF 도구', '카테고리 도구', '개 도구 중 선택', '모든 카테고리 보기', '숨기기', '표시', 'PDF 도구 검색', 'PDF 도구 찾기', '검색 지우기', '일치하는 PDF 도구', '일치하는 도구가 없습니다'],
  'zh-CN': ['轻松使用 PDF 工具', '强大的 PDF 工具', '一站式完成。', '用于日常 PDF 任务的浏览器工具。每个工具页面都会说明处理方式和限制。', '浏览 PDF 工具', '浏览工具类别', 'PDF 工具类别', '所有 PDF 工具', '类别中的工具', '个工具可供选择', '浏览所有类别', '隐藏', '显示', '搜索 PDF 工具', '查找 PDF 工具', '清除搜索', '匹配的 PDF 工具', '没有匹配的工具']
};

const workflowTranslations = {
  en: ['How to Use', 'How it works', 'Frequently Asked Questions', 'Upload to tool', 'Process document in browser', 'Download', 'Your selected files are processed in your browser and are not uploaded to a processing server. Learn more in our', 'Privacy Policy', 'Conversion status', 'Our Toolbox', 'Select a tool to get started', 'PDF tool workspace', 'Instructions and workflow', 'Attach PDF Here', 'Attach PDFs Here', 'Attach Images Here', 'Related tools'],
  es: ['Cómo usar', 'Cómo funciona', 'Preguntas frecuentes', 'Subir a la herramienta', 'Procesar el documento en el navegador', 'Descargar', 'Tus archivos se procesan en el navegador y no se envían a un servidor de procesamiento. Más información en nuestra', 'Política de privacidad', 'Estado de conversión', 'Nuestras herramientas', 'Selecciona una herramienta para comenzar', 'Espacio de trabajo PDF', 'Instrucciones y flujo de trabajo', 'Adjunta el PDF aquí', 'Adjunta los PDF aquí', 'Adjunta las imágenes aquí', 'Herramientas relacionadas'],
  fr: ['Mode d’emploi', 'Fonctionnement', 'Questions fréquentes', 'Importer dans l’outil', 'Traiter le document dans le navigateur', 'Télécharger', 'Vos fichiers sont traités dans le navigateur et ne sont pas envoyés à un serveur de traitement. En savoir plus dans notre', 'Politique de confidentialité', 'État de la conversion', 'Nos outils', 'Sélectionnez un outil pour commencer', 'Espace de travail PDF', 'Instructions et workflow', 'Joignez le PDF ici', 'Joignez les PDF ici', 'Joignez les images ici', 'Outils associés'],
  de: ['Anleitung', 'Funktionsweise', 'Häufig gestellte Fragen', 'In das Tool laden', 'Dokument im Browser verarbeiten', 'Herunterladen', 'Deine Dateien werden im Browser verarbeitet und nicht an einen Verarbeitungsserver übertragen. Weitere Informationen in unserer', 'Datenschutzerklärung', 'Konvertierungsstatus', 'Unsere Werkzeuge', 'Wähle ein Tool aus, um zu beginnen', 'PDF-Arbeitsbereich', 'Anleitung und Arbeitsablauf', 'PDF hier anhängen', 'PDFs hier anhängen', 'Bilder hier anhängen', 'Verwandte Tools'],
  pt: ['Como usar', 'Como funciona', 'Perguntas frequentes', 'Enviar para a ferramenta', 'Processar documento no navegador', 'Baixar', 'Seus arquivos são processados no navegador e não são enviados a um servidor de processamento. Saiba mais em nossa', 'Política de Privacidade', 'Status da conversão', 'Nossas ferramentas', 'Selecione uma ferramenta para começar', 'Área de trabalho do PDF', 'Instruções e fluxo de trabalho', 'Anexe o PDF aqui', 'Anexe os PDFs aqui', 'Anexe as imagens aqui', 'Ferramentas relacionadas'],
  it: ['Come usare', 'Come funziona', 'Domande frequenti', 'Carica nello strumento', 'Elabora il documento nel browser', 'Scarica', 'I file selezionati vengono elaborati nel browser e non sono inviati a un server di elaborazione. Scopri di più nella nostra', 'Informativa sulla privacy', 'Stato della conversione', 'I nostri strumenti', 'Seleziona uno strumento per iniziare', 'Area di lavoro PDF', 'Istruzioni e flusso di lavoro', 'Allega qui il PDF', 'Allega qui i PDF', 'Allega qui le immagini', 'Strumenti correlati'],
  nl: ['Gebruiksaanwijzing', 'Zo werkt het', 'Veelgestelde vragen', 'Uploaden naar de tool', 'Document verwerken in de browser', 'Downloaden', 'Je bestanden worden in de browser verwerkt en niet naar een verwerkingsserver geüpload. Lees meer in ons', 'Privacybeleid', 'Conversiestatus', 'Onze gereedschapskist', 'Selecteer een tool om te beginnen', 'PDF-werkruimte', 'Instructies en workflow', 'Voeg hier een PDF toe', 'Voeg hier PDF’s toe', 'Voeg hier afbeeldingen toe', 'Gerelateerde tools'],
  pl: ['Jak używać', 'Jak to działa', 'Często zadawane pytania', 'Prześlij do narzędzia', 'Przetwarzaj dokument w przeglądarce', 'Pobierz', 'Wybrane pliki są przetwarzane w przeglądarce i nie są wysyłane na serwer. Więcej informacji w naszej', 'Polityce prywatności', 'Stan konwersji', 'Nasze narzędzia', 'Wybierz narzędzie, aby rozpocząć', 'Obszar roboczy PDF', 'Instrukcje i przebieg pracy', 'Dołącz plik PDF', 'Dołącz pliki PDF', 'Dołącz obrazy', 'Powiązane narzędzia'],
  sv: ['Så använder du verktyget', 'Så fungerar det', 'Vanliga frågor', 'Ladda upp till verktyget', 'Bearbeta dokumentet i webbläsaren', 'Ladda ned', 'Dina filer behandlas i webbläsaren och laddas inte upp till en bearbetningsserver. Läs mer i vår', 'Integritetspolicy', 'Konverteringsstatus', 'Våra verktyg', 'Välj ett verktyg för att komma igång', 'PDF-arbetsyta', 'Instruktioner och arbetsflöde', 'Bifoga PDF här', 'Bifoga PDF-filer här', 'Bifoga bilder här', 'Relaterade verktyg'],
  fi: ['Käyttöohje', 'Näin se toimii', 'Usein kysytyt kysymykset', 'Lataa työkaluun', 'Käsittele asiakirja selaimessa', 'Lataa', 'Tiedostosi käsitellään selaimessa eikä niitä lähetetä käsittelypalvelimelle. Lue lisää', 'tietosuojakäytännöstämme', 'Muunnoksen tila', 'Työkalumme', 'Aloita valitsemalla työkalu', 'PDF-työtila', 'Ohjeet ja työnkulku', 'Liitä PDF tähän', 'Liitä PDF-tiedostot tähän', 'Liitä kuvat tähän', 'Aiheeseen liittyvät työkalut'],
  da: ['Sådan bruger du værktøjet', 'Sådan fungerer det', 'Ofte stillede spørgsmål', 'Upload til værktøjet', 'Behandl dokumentet i browseren', 'Download', 'Dine filer behandles i browseren og uploades ikke til en behandlingsserver. Læs mere i vores', 'privatlivspolitik', 'Konverteringsstatus', 'Vores værktøjskasse', 'Vælg et værktøj for at komme i gang', 'PDF-arbejdsområde', 'Instruktioner og arbejdsgang', 'Vedhæft PDF her', 'Vedhæft PDF-filer her', 'Vedhæft billeder her', 'Relaterede værktøjer'],
  nb: ['Slik bruker du verktøyet', 'Slik fungerer det', 'Vanlige spørsmål', 'Last opp til verktøyet', 'Behandle dokumentet i nettleseren', 'Last ned', 'Filene dine behandles i nettleseren og lastes ikke opp til en behandlingsserver. Les mer i vår', 'personvernerklæring', 'Konverteringsstatus', 'Verktøyene våre', 'Velg et verktøy for å komme i gang', 'PDF-arbeidsområde', 'Instruksjoner og arbeidsflyt', 'Legg ved PDF her', 'Legg ved PDF-filer her', 'Legg ved bilder her', 'Relaterte verktøy'],
  tr: ['Nasıl kullanılır', 'Nasıl çalışır', 'Sık sorulan sorular', 'Araca yükle', 'Belgeyi tarayıcıda işle', 'İndir', 'Dosyalarınız tarayıcıda işlenir ve bir işleme sunucusuna yüklenmez. Ayrıntılar için', 'Gizlilik Politikamıza bakın', 'Dönüştürme durumu', 'Araçlarımız', 'Başlamak için bir araç seçin', 'PDF çalışma alanı', 'Talimatlar ve iş akışı', 'PDF’yi buraya ekleyin', 'PDF dosyalarını buraya ekleyin', 'Görselleri buraya ekleyin', 'İlgili araçlar'],
  ru: ['Как пользоваться', 'Как это работает', 'Часто задаваемые вопросы', 'Загрузить в инструмент', 'Обработать документ в браузере', 'Скачать', 'Ваши файлы обрабатываются в браузере и не отправляются на сервер обработки. Подробнее в нашей', 'Политике конфиденциальности', 'Состояние преобразования', 'Наши инструменты', 'Выберите инструмент, чтобы начать', 'Рабочая область PDF', 'Инструкции и рабочий процесс', 'Добавьте PDF здесь', 'Добавьте PDF-файлы здесь', 'Добавьте изображения здесь', 'Похожие инструменты'],
  uk: ['Як користуватися', 'Як це працює', 'Поширені запитання', 'Завантажити в інструмент', 'Обробити документ у браузері', 'Завантажити', 'Ваші файли обробляються у браузері й не надсилаються на сервер обробки. Докладніше в нашій', 'Політиці конфіденційності', 'Стан перетворення', 'Наші інструменти', 'Виберіть інструмент, щоб почати', 'Робоча область PDF', 'Інструкції та робочий процес', 'Додайте PDF сюди', 'Додайте PDF-файли сюди', 'Додайте зображення сюди', 'Пов’язані інструменти'],
  ar: ['طريقة الاستخدام', 'آلية العمل', 'الأسئلة الشائعة', 'تحميل إلى الأداة', 'معالجة المستند في المتصفح', 'تنزيل', 'تتم معالجة ملفاتك في المتصفح ولا تُرسل إلى خادم معالجة. تعرّف على المزيد في', 'سياسة الخصوصية', 'حالة التحويل', 'أدواتنا', 'اختر أداة للبدء', 'مساحة عمل PDF', 'التعليمات وسير العمل', 'أرفق ملف PDF هنا', 'أرفق ملفات PDF هنا', 'أرفق الصور هنا', 'أدوات ذات صلة'],
  hi: ['उपयोग कैसे करें', 'यह कैसे काम करता है', 'अक्सर पूछे जाने वाले प्रश्न', 'टूल में अपलोड करें', 'दस्तावेज़ को ब्राउज़र में संसाधित करें', 'डाउनलोड करें', 'आपकी फ़ाइलें ब्राउज़र में संसाधित होती हैं और किसी प्रोसेसिंग सर्वर पर अपलोड नहीं होतीं। अधिक जानकारी हमारी', 'गोपनीयता नीति में देखें', 'रूपांतरण स्थिति', 'हमारे टूल', 'शुरू करने के लिए टूल चुनें', 'PDF कार्यक्षेत्र', 'निर्देश और कार्यप्रवाह', 'PDF यहाँ जोड़ें', 'PDF फ़ाइलें यहाँ जोड़ें', 'छवियाँ यहाँ जोड़ें', 'संबंधित टूल'],
  ja: ['使い方', '仕組み', 'よくある質問', 'ツールにアップロード', 'ブラウザーで文書を処理', 'ダウンロード', '選択したファイルはブラウザー内で処理され、処理サーバーにはアップロードされません。詳しくは', 'プライバシーポリシーをご覧ください', '変換ステータス', 'ツール一覧', 'ツールを選択して開始', 'PDFワークスペース', '手順とワークフロー', 'ここにPDFを添付', 'ここにPDFを添付', 'ここに画像を添付', '関連ツール'],
  ko: ['사용 방법', '작동 방식', '자주 묻는 질문', '도구에 업로드', '브라우저에서 문서 처리', '다운로드', '선택한 파일은 브라우저에서 처리되며 처리 서버에 업로드되지 않습니다. 자세한 내용은', '개인정보 처리방침을 확인하세요', '변환 상태', '도구 모음', '시작하려면 도구를 선택하세요', 'PDF 작업 영역', '안내 및 작업 흐름', '여기에 PDF 첨부', '여기에 PDF 첨부', '여기에 이미지 첨부', '관련 도구'],
  'zh-CN': ['使用方法', '工作原理', '常见问题', '上传到工具', '在浏览器中处理文档', '下载', '所选文件在浏览器中处理，不会上传到处理服务器。详情请参阅', '隐私政策', '转换状态', '工具箱', '选择工具以开始使用', 'PDF 工作区', '说明和工作流程', '在此添加 PDF', '在此添加 PDF 文件', '在此添加图片', '相关工具']
};

const navigationToggleTranslations = {
  en: { collapseNavigation: 'Collapse navigation', expandNavigation: 'Expand navigation' },
  es: { collapseNavigation: 'Contraer navegación', expandNavigation: 'Expandir navegación' },
  fr: { collapseNavigation: 'Réduire la navigation', expandNavigation: 'Développer la navigation' },
  de: { collapseNavigation: 'Navigation einklappen', expandNavigation: 'Navigation ausklappen' },
  pt: { collapseNavigation: 'Recolher navegação', expandNavigation: 'Expandir navegação' },
  it: { collapseNavigation: 'Comprimi navigazione', expandNavigation: 'Espandi navigazione' },
  nl: { collapseNavigation: 'Navigatie inklappen', expandNavigation: 'Navigatie uitklappen' },
  pl: { collapseNavigation: 'Zwiń nawigację', expandNavigation: 'Rozwiń nawigację' },
  sv: { collapseNavigation: 'Fäll ihop navigeringen', expandNavigation: 'Fäll ut navigeringen' },
  fi: { collapseNavigation: 'Kutista navigointi', expandNavigation: 'Laajenna navigointi' },
  da: { collapseNavigation: 'Fold navigation sammen', expandNavigation: 'Udvid navigation' },
  nb: { collapseNavigation: 'Skjul navigasjonen', expandNavigation: 'Utvid navigasjonen' },
  tr: { collapseNavigation: 'Gezinmeyi daralt', expandNavigation: 'Gezinmeyi genişlet' },
  ru: { collapseNavigation: 'Свернуть навигацию', expandNavigation: 'Развернуть навигацию' },
  uk: { collapseNavigation: 'Згорнути навігацію', expandNavigation: 'Розгорнути навігацію' },
  ar: { collapseNavigation: 'طي شريط التنقل', expandNavigation: 'توسيع شريط التنقل' },
  hi: { collapseNavigation: 'नेविगेशन समेटें', expandNavigation: 'नेविगेशन फैलाएँ' },
  ja: { collapseNavigation: 'ナビゲーションを折りたたむ', expandNavigation: 'ナビゲーションを展開' },
  ko: { collapseNavigation: '탐색 메뉴 접기', expandNavigation: '탐색 메뉴 펼치기' },
  'zh-CN': { collapseNavigation: '折叠导航栏', expandNavigation: '展开导航栏' }
};

const sitePolicyTranslations = {
  en: { security: 'Security', cookiePolicy: 'Cookie Policy' },
  es: { security: 'Seguridad', cookiePolicy: 'Política de cookies' },
  fr: { security: 'Sécurité', cookiePolicy: 'Politique relative aux cookies' },
  de: { security: 'Sicherheit', cookiePolicy: 'Cookie-Richtlinie' },
  pt: { security: 'Segurança', cookiePolicy: 'Política de cookies' },
  it: { security: 'Sicurezza', cookiePolicy: 'Informativa sui cookie' },
  nl: { security: 'Beveiliging', cookiePolicy: 'Cookiebeleid' },
  pl: { security: 'Bezpieczeństwo', cookiePolicy: 'Polityka plików cookie' },
  sv: { security: 'Säkerhet', cookiePolicy: 'Cookiepolicy' },
  fi: { security: 'Tietoturva', cookiePolicy: 'Evästekäytäntö' },
  da: { security: 'Sikkerhed', cookiePolicy: 'Cookiepolitik' },
  nb: { security: 'Sikkerhet', cookiePolicy: 'Retningslinjer for informasjonskapsler' },
  tr: { security: 'Güvenlik', cookiePolicy: 'Çerez Politikası' },
  ru: { security: 'Безопасность', cookiePolicy: 'Политика использования файлов cookie' },
  uk: { security: 'Безпека', cookiePolicy: 'Політика щодо файлів cookie' },
  ar: { security: 'الأمان', cookiePolicy: 'سياسة ملفات تعريف الارتباط' },
  hi: { security: 'सुरक्षा', cookiePolicy: 'कुकी नीति' },
  ja: { security: 'セキュリティ', cookiePolicy: 'Cookieポリシー' },
  ko: { security: '보안', cookiePolicy: '쿠키 정책' },
  'zh-CN': { security: '安全', cookiePolicy: 'Cookie 政策' }
};

const routeLoadingTranslations = {
  en: 'Loading tool…',
  es: 'Cargando la herramienta…',
  fr: 'Chargement de l’outil…',
  de: 'Tool wird geladen…',
  pt: 'Carregando a ferramenta…',
  it: 'Caricamento dello strumento…',
  nl: 'Tool laden…',
  pl: 'Wczytywanie narzędzia…',
  sv: 'Laddar verktyget…',
  fi: 'Ladataan työkalua…',
  da: 'Indlæser værktøjet…',
  nb: 'Laster inn verktøyet…',
  tr: 'Araç yükleniyor…',
  ru: 'Загрузка инструмента…',
  uk: 'Завантаження інструмента…',
  ar: 'جارٍ تحميل الأداة…',
  hi: 'टूल लोड हो रहा है…',
  ja: 'ツールを読み込んでいます…',
  ko: '도구를 불러오는 중…',
  'zh-CN': '正在加载工具…'
};

const routeErrorTranslations = {
  en: { routeLoadFailed: 'This page could not be loaded.', reloadPage: 'Reload page' },
  es: { routeLoadFailed: 'No se pudo cargar esta página.', reloadPage: 'Recargar la página' },
  fr: { routeLoadFailed: 'Cette page n’a pas pu être chargée.', reloadPage: 'Recharger la page' },
  de: { routeLoadFailed: 'Diese Seite konnte nicht geladen werden.', reloadPage: 'Seite neu laden' },
  pt: { routeLoadFailed: 'Não foi possível carregar esta página.', reloadPage: 'Recarregar a página' },
  it: { routeLoadFailed: 'Impossibile caricare questa pagina.', reloadPage: 'Ricarica la pagina' },
  nl: { routeLoadFailed: 'Deze pagina kon niet worden geladen.', reloadPage: 'Pagina opnieuw laden' },
  pl: { routeLoadFailed: 'Nie udało się wczytać tej strony.', reloadPage: 'Wczytaj stronę ponownie' },
  sv: { routeLoadFailed: 'Det gick inte att läsa in sidan.', reloadPage: 'Ladda om sidan' },
  fi: { routeLoadFailed: 'Sivun lataaminen epäonnistui.', reloadPage: 'Lataa sivu uudelleen' },
  da: { routeLoadFailed: 'Siden kunne ikke indlæses.', reloadPage: 'Indlæs siden igen' },
  nb: { routeLoadFailed: 'Siden kunne ikke lastes inn.', reloadPage: 'Last inn siden på nytt' },
  tr: { routeLoadFailed: 'Bu sayfa yüklenemedi.', reloadPage: 'Sayfayı yeniden yükle' },
  ru: { routeLoadFailed: 'Не удалось загрузить эту страницу.', reloadPage: 'Перезагрузить страницу' },
  uk: { routeLoadFailed: 'Не вдалося завантажити цю сторінку.', reloadPage: 'Перезавантажити сторінку' },
  ar: { routeLoadFailed: 'تعذر تحميل هذه الصفحة.', reloadPage: 'إعادة تحميل الصفحة' },
  hi: { routeLoadFailed: 'यह पेज लोड नहीं हो सका।', reloadPage: 'पेज फिर से लोड करें' },
  ja: { routeLoadFailed: 'このページを読み込めませんでした。', reloadPage: 'ページを再読み込み' },
  ko: { routeLoadFailed: '이 페이지를 불러오지 못했습니다.', reloadPage: '페이지 새로고침' },
  'zh-CN': { routeLoadFailed: '无法加载此页面。', reloadPage: '重新加载页面' }
};

const messagesByLanguage = Object.fromEntries(
  SUPPORTED_LANGUAGES.map(({ code }) => [
    code,
    Object.fromEntries([
      ...keys.map((key, index) => [key, translations[code][index]]),
      ...extraKeys.map((key, index) => [key, extraTranslations[code][index]]),
      ...workflowKeys.map((key, index) => [key, workflowTranslations[code][index]]),
      ['loadingTool', routeLoadingTranslations[code]],
      ...Object.entries(routeErrorTranslations[code]),
      ...Object.entries(sitePolicyTranslations[code]),
      ...Object.entries(navigationToggleTranslations[code])
    ])
  ])
);

export const getLanguageName = (code) => (
  SUPPORTED_LANGUAGES.find((language) => language.code === code)?.name
  || SUPPORTED_LANGUAGES[0].name
);

export const getMessage = (language, key) => (
  messagesByLanguage[language]?.[key]
  || messagesByLanguage.en[key]
  || key
);

export const getInitialLanguage = () => {
  try {
    const savedLanguage = typeof window === 'undefined'
      ? null
      : window.localStorage.getItem('pdf-tools-language');
    return SUPPORTED_LANGUAGES.some(({ code }) => code === savedLanguage)
      ? savedLanguage
      : 'en';
  } catch {
    return 'en';
  }
};
