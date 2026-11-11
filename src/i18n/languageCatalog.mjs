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

const RTL_LANGUAGE_CODES = new Set(['ar', 'fa', 'he', 'ps', 'sd', 'ug', 'ur', 'yi']);

export const getLanguageDirection = (language) => (
  RTL_LANGUAGE_CODES.has(language.split('-')[0]) ? 'rtl' : 'ltr'
);

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

const v6Keys = [
  'skipToMainContent', 'browseTools', 'filesStayOnDevice', 'v6ArtCaption', 'v6CollectionsEyebrow',
  'v6CollectionsTitle', 'v6CollectionsDescription', 'v6TrustEyebrow',
  'v6TrustTitle', 'v6TrustDescription', 'v6WhyEyebrow', 'v6WhyTitle',
  'v6WhyParagraph1', 'v6WhyParagraph2', 'v6WhyParagraph3',
  'v6SearchResultSingular', 'v6SearchResultPlural'
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
  en: ['PDF tools, made simple', 'Private & Powerful PDF Tools', 'All in one place.', 'Browser-based tools for everyday PDF tasks. Processing details and limitations are explained on each tool page.', 'Explore PDF tools', 'Browse tool categories', 'PDF tool category', 'All PDF tools', 'Tools in', 'tools to choose from', 'Browse all categories', 'Hide', 'Show', 'Search PDF tools', 'Find a PDF tool', 'Clear search', 'Matching PDF tools', 'No tools match'],
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

const descriptionToggleTranslations = {
  en: { expandDescription: 'Read full description', collapseDescription: 'Show less' },
  es: { expandDescription: 'Leer descripción completa', collapseDescription: 'Mostrar menos' },
  fr: { expandDescription: 'Lire la description complète', collapseDescription: 'Afficher moins' },
  de: { expandDescription: 'Vollständige Beschreibung lesen', collapseDescription: 'Weniger anzeigen' },
  pt: { expandDescription: 'Ler descrição completa', collapseDescription: 'Mostrar menos' },
  it: { expandDescription: 'Leggi la descrizione completa', collapseDescription: 'Mostra meno' },
  nl: { expandDescription: 'Volledige beschrijving lezen', collapseDescription: 'Minder weergeven' },
  pl: { expandDescription: 'Przeczytaj pełny opis', collapseDescription: 'Pokaż mniej' },
  sv: { expandDescription: 'Läs hela beskrivningen', collapseDescription: 'Visa mindre' },
  fi: { expandDescription: 'Lue koko kuvaus', collapseDescription: 'Näytä vähemmän' },
  da: { expandDescription: 'Læs hele beskrivelsen', collapseDescription: 'Vis mindre' },
  nb: { expandDescription: 'Les hele beskrivelsen', collapseDescription: 'Vis mindre' },
  tr: { expandDescription: 'Açıklamanın tamamını oku', collapseDescription: 'Daha az göster' },
  ru: { expandDescription: 'Читать полное описание', collapseDescription: 'Показать меньше' },
  uk: { expandDescription: 'Читати повний опис', collapseDescription: 'Показати менше' },
  ar: { expandDescription: 'اقرأ الوصف الكامل', collapseDescription: 'عرض أقل' },
  hi: { expandDescription: 'पूरा विवरण पढ़ें', collapseDescription: 'कम दिखाएँ' },
  ja: { expandDescription: '説明全文を読む', collapseDescription: '折りたたむ' },
  ko: { expandDescription: '전체 설명 읽기', collapseDescription: '간략히 보기' },
  'zh-CN': { expandDescription: '阅读完整说明', collapseDescription: '收起' }
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

const toolExitTranslations = {
  en: { discardAttachedFiles: 'Leave this page?', discardAttachedFilesMessage: 'Your attached files will be removed if you leave this page.', discardReadyFileMessage: 'Your processed file is ready to download. If you leave, it and any attached files will be discarded.', discardReadyFilesMessage: 'Your {count} processed files are ready to download. If you leave, they and any attached files will be discarded.', stayOnPage: 'Stay on page', leavePage: 'Leave page' },
  es: { discardAttachedFiles: '¿Salir de esta página?', discardAttachedFilesMessage: 'Si sales de esta página, se quitarán los archivos adjuntos.', discardReadyFileMessage: 'Tu archivo procesado está listo para descargar. Si sales, se descartará junto con los archivos adjuntos.', discardReadyFilesMessage: 'Tus {count} archivos procesados están listos para descargar. Si sales, se descartarán junto con los archivos adjuntos.', stayOnPage: 'Permanecer en la página', leavePage: 'Salir de la página' },
  fr: { discardAttachedFiles: 'Quitter cette page ?', discardAttachedFilesMessage: 'Vos fichiers joints seront supprimés si vous quittez cette page.', discardReadyFileMessage: 'Votre fichier traité est prêt à être téléchargé. Si vous quittez la page, il sera supprimé avec les fichiers joints.', discardReadyFilesMessage: 'Vos {count} fichiers traités sont prêts à être téléchargés. Si vous quittez la page, ils seront supprimés avec les fichiers joints.', stayOnPage: 'Rester sur la page', leavePage: 'Quitter la page' },
  de: { discardAttachedFiles: 'Diese Seite verlassen?', discardAttachedFilesMessage: 'Wenn Sie diese Seite verlassen, werden Ihre angehängten Dateien entfernt.', discardReadyFileMessage: 'Ihre bearbeitete Datei kann jetzt heruntergeladen werden. Wenn Sie die Seite verlassen, wird sie zusammen mit den angehängten Dateien verworfen.', discardReadyFilesMessage: 'Ihre {count} bearbeiteten Dateien können jetzt heruntergeladen werden. Wenn Sie die Seite verlassen, werden sie zusammen mit den angehängten Dateien verworfen.', stayOnPage: 'Auf der Seite bleiben', leavePage: 'Seite verlassen' },
  pt: { discardAttachedFiles: 'Sair desta página?', discardAttachedFilesMessage: 'Se sair desta página, seus arquivos anexados serão removidos.', discardReadyFileMessage: 'Seu arquivo processado está pronto para baixar. Se sair, ele e os arquivos anexados serão descartados.', discardReadyFilesMessage: 'Seus {count} arquivos processados estão prontos para baixar. Se sair, eles e os arquivos anexados serão descartados.', stayOnPage: 'Permanecer na página', leavePage: 'Sair da página' },
  it: { discardAttachedFiles: 'Vuoi lasciare questa pagina?', discardAttachedFilesMessage: 'Se lasci questa pagina, i file allegati verranno rimossi.', discardReadyFileMessage: 'Il file elaborato è pronto per il download. Se esci, verrà eliminato insieme ai file allegati.', discardReadyFilesMessage: 'I {count} file elaborati sono pronti per il download. Se esci, verranno eliminati insieme ai file allegati.', stayOnPage: 'Resta sulla pagina', leavePage: 'Lascia la pagina' },
  nl: { discardAttachedFiles: 'Deze pagina verlaten?', discardAttachedFilesMessage: 'Als je deze pagina verlaat, worden je bijgevoegde bestanden verwijderd.', discardReadyFileMessage: 'Je verwerkte bestand kan worden gedownload. Als je weggaat, wordt het samen met je bijgevoegde bestanden verwijderd.', discardReadyFilesMessage: 'Je {count} verwerkte bestanden kunnen worden gedownload. Als je weggaat, worden ze samen met je bijgevoegde bestanden verwijderd.', stayOnPage: 'Op de pagina blijven', leavePage: 'Pagina verlaten' },
  pl: { discardAttachedFiles: 'Opuścić tę stronę?', discardAttachedFilesMessage: 'Dołączone pliki zostaną usunięte po opuszczeniu tej strony.', discardReadyFileMessage: 'Przetworzony plik jest gotowy do pobrania. Po opuszczeniu strony zostanie usunięty wraz z załączonymi plikami.', discardReadyFilesMessage: 'Przetworzone pliki ({count}) są gotowe do pobrania. Po opuszczeniu strony zostaną usunięte wraz z załączonymi plikami.', stayOnPage: 'Pozostań na stronie', leavePage: 'Opuść stronę' },
  sv: { discardAttachedFiles: 'Lämna sidan?', discardAttachedFilesMessage: 'Dina bifogade filer tas bort om du lämnar sidan.', discardReadyFileMessage: 'Din bearbetade fil är klar att laddas ned. Om du lämnar sidan tas den och bifogade filer bort.', discardReadyFilesMessage: 'Dina {count} bearbetade filer är klara att laddas ned. Om du lämnar sidan tas de och bifogade filer bort.', stayOnPage: 'Stanna kvar på sidan', leavePage: 'Lämna sidan' },
  fi: { discardAttachedFiles: 'Poistutaanko tältä sivulta?', discardAttachedFilesMessage: 'Liitetyt tiedostosi poistetaan, jos poistut tältä sivulta.', discardReadyFileMessage: 'Käsitelty tiedosto on valmis ladattavaksi. Jos poistut, se ja liitetyt tiedostot hylätään.', discardReadyFilesMessage: 'Käsitellyt {count} tiedostoa ovat valmiita ladattaviksi. Jos poistut, ne ja liitetyt tiedostot hylätään.', stayOnPage: 'Pysy sivulla', leavePage: 'Poistu sivulta' },
  da: { discardAttachedFiles: 'Forlad denne side?', discardAttachedFilesMessage: 'Dine vedhæftede filer fjernes, hvis du forlader denne side.', discardReadyFileMessage: 'Din behandlede fil er klar til download. Hvis du forlader siden, slettes den sammen med de vedhæftede filer.', discardReadyFilesMessage: 'Dine {count} behandlede filer er klar til download. Hvis du forlader siden, slettes de sammen med de vedhæftede filer.', stayOnPage: 'Bliv på siden', leavePage: 'Forlad siden' },
  nb: { discardAttachedFiles: 'Vil du forlate denne siden?', discardAttachedFilesMessage: 'De vedlagte filene fjernes hvis du forlater denne siden.', discardReadyFileMessage: 'Den behandlede filen er klar til nedlasting. Hvis du går ut, slettes den sammen med vedlagte filer.', discardReadyFilesMessage: 'De {count} behandlede filene er klare til nedlasting. Hvis du går ut, slettes de sammen med vedlagte filer.', stayOnPage: 'Bli på siden', leavePage: 'Forlat siden' },
  tr: { discardAttachedFiles: 'Bu sayfadan ayrılmak istiyor musunuz?', discardAttachedFilesMessage: 'Bu sayfadan ayrılırsanız ekli dosyalarınız kaldırılır.', discardReadyFileMessage: 'İşlenen dosyanız indirilmeye hazır. Ayrılırsanız bu dosya ve ekli dosyalar silinir.', discardReadyFilesMessage: 'İşlenen {count} dosyanız indirilmeye hazır. Ayrılırsanız bu dosyalar ve ekli dosyalar silinir.', stayOnPage: 'Sayfada kal', leavePage: 'Sayfadan ayrıl' },
  ru: { discardAttachedFiles: 'Покинуть эту страницу?', discardAttachedFilesMessage: 'При уходе со страницы прикрепленные файлы будут удалены.', discardReadyFileMessage: 'Обработанный файл готов к скачиванию. При уходе он и прикрепленные файлы будут удалены.', discardReadyFilesMessage: 'Обработанные файлы ({count}) готовы к скачиванию. При уходе они и прикрепленные файлы будут удалены.', stayOnPage: 'Остаться на странице', leavePage: 'Покинуть страницу' },
  uk: { discardAttachedFiles: 'Залишити цю сторінку?', discardAttachedFilesMessage: 'Якщо ви підете зі сторінки, прикріплені файли буде видалено.', discardReadyFileMessage: 'Оброблений файл готовий до завантаження. Якщо ви підете, його та прикріплені файли буде видалено.', discardReadyFilesMessage: 'Оброблені файли ({count}) готові до завантаження. Якщо ви підете, їх та прикріплені файли буде видалено.', stayOnPage: 'Залишитися на сторінці', leavePage: 'Залишити сторінку' },
  ar: { discardAttachedFiles: 'هل تريد مغادرة هذه الصفحة؟', discardAttachedFilesMessage: 'ستتم إزالة الملفات المرفقة إذا غادرت هذه الصفحة.', discardReadyFileMessage: 'ملفك المعالج جاهز للتنزيل. إذا غادرت، فسيتم حذفه مع الملفات المرفقة.', discardReadyFilesMessage: 'ملفاتك المعالجة وعددها {count} جاهزة للتنزيل. إذا غادرت، فسيتم حذفها مع الملفات المرفقة.', stayOnPage: 'البقاء في الصفحة', leavePage: 'مغادرة الصفحة' },
  hi: { discardAttachedFiles: 'क्या आप यह पेज छोड़ना चाहते हैं?', discardAttachedFilesMessage: 'पेज छोड़ने पर आपकी संलग्न फ़ाइलें हट जाएँगी।', discardReadyFileMessage: 'आपकी प्रोसेस की गई फ़ाइल डाउनलोड के लिए तैयार है। पेज छोड़ने पर यह और संलग्न फ़ाइलें हट जाएँगी।', discardReadyFilesMessage: 'आपकी प्रोसेस की गई {count} फ़ाइलें डाउनलोड के लिए तैयार हैं। पेज छोड़ने पर ये और संलग्न फ़ाइलें हट जाएँगी।', stayOnPage: 'पेज पर रहें', leavePage: 'पेज छोड़ें' },
  ja: { discardAttachedFiles: 'このページを離れますか？', discardAttachedFilesMessage: 'ページを離れると、添付ファイルは削除されます。', discardReadyFileMessage: '処理済みファイルをダウンロードできます。ページを離れると、添付ファイルとともに削除されます。', discardReadyFilesMessage: '処理済みファイル {count} 件をダウンロードできます。ページを離れると、添付ファイルとともに削除されます。', stayOnPage: 'ページにとどまる', leavePage: 'ページを離れる' },
  ko: { discardAttachedFiles: '이 페이지를 나가시겠습니까?', discardAttachedFilesMessage: '페이지를 나가면 첨부한 파일이 제거됩니다.', discardReadyFileMessage: '처리된 파일을 다운로드할 수 있습니다. 페이지를 나가면 첨부 파일과 함께 삭제됩니다.', discardReadyFilesMessage: '처리된 파일 {count}개를 다운로드할 수 있습니다. 페이지를 나가면 첨부 파일과 함께 삭제됩니다.', stayOnPage: '페이지에 머무르기', leavePage: '페이지 나가기' },
  'zh-CN': { discardAttachedFiles: '要离开此页面吗？', discardAttachedFilesMessage: '离开此页面后，已附加的文件将被移除。', discardReadyFileMessage: '处理后的文件已可下载。离开页面后，该文件和已附加的文件都将被丢弃。', discardReadyFilesMessage: '处理后的 {count} 个文件已可下载。离开页面后，这些文件和已附加的文件都将被丢弃。', stayOnPage: '留在此页面', leavePage: '离开页面' }
};

const documentUploadTitles = {
  en: 'Attach a PDF or Word file here',
  es: 'Adjunta aquí un PDF o archivo de Word',
  fr: 'Ajoutez ici un PDF ou un fichier Word',
  de: 'PDF- oder Word-Datei hier anhängen',
  pt: 'Anexe um PDF ou arquivo do Word aqui',
  it: 'Allega qui un PDF o un file Word',
  nl: 'Voeg hier een PDF- of Word-bestand toe',
  pl: 'Dodaj tutaj plik PDF lub Word',
  sv: 'Bifoga en PDF- eller Word-fil här',
  fi: 'Liitä PDF- tai Word-tiedosto tähän',
  da: 'Vedhæft en PDF- eller Word-fil her',
  nb: 'Legg ved en PDF- eller Word-fil her',
  tr: 'Buraya PDF veya Word dosyası ekleyin',
  ru: 'Добавьте сюда файл PDF или Word',
  uk: 'Додайте сюди файл PDF або Word',
  ar: 'أرفق ملف PDF أو Word هنا',
  hi: 'यहाँ PDF या Word फ़ाइल जोड़ें',
  ja: 'PDF または Word ファイルをここに添付',
  ko: '여기에 PDF 또는 Word 파일 첨부',
  'zh-CN': '在此处添加 PDF 或 Word 文件'
};

const wordUploadTitles = {
  en: 'Attach a Word file here',
  es: 'Adjunta aquí un archivo de Word',
  fr: 'Ajoutez ici un fichier Word',
  de: 'Word-Datei hier anhängen',
  pt: 'Anexe um arquivo do Word aqui',
  it: 'Allega qui un file Word',
  nl: 'Voeg hier een Word-bestand toe',
  pl: 'Dodaj tutaj plik Word',
  sv: 'Bifoga en Word-fil här',
  fi: 'Liitä Word-tiedosto tähän',
  da: 'Vedhæft en Word-fil her',
  nb: 'Legg ved en Word-fil her',
  tr: 'Buraya bir Word dosyası ekleyin',
  ru: 'Добавьте сюда файл Word',
  uk: 'Додайте сюди файл Word',
  ar: 'أرفق ملف Word هنا',
  hi: 'यहाँ Word फ़ाइल जोड़ें',
  ja: 'Word ファイルをここに添付',
  ko: '여기에 Word 파일 첨부',
  'zh-CN': '在此处添加 Word 文件'
};

const markdownUploadTitles = {
  en: 'Attach a Markdown file here',
  es: 'Adjunta aquí un archivo Markdown',
  fr: 'Ajoutez ici un fichier Markdown',
  de: 'Markdown-Datei hier anhängen',
  pt: 'Anexe um arquivo Markdown aqui',
  it: 'Allega qui un file Markdown',
  nl: 'Voeg hier een Markdown-bestand toe',
  pl: 'Dodaj tutaj plik Markdown',
  sv: 'Bifoga en Markdown-fil här',
  fi: 'Liitä Markdown-tiedosto tähän',
  da: 'Vedhæft en Markdown-fil her',
  nb: 'Legg ved en Markdown-fil her',
  tr: 'Buraya bir Markdown dosyası ekleyin',
  ru: 'Добавьте сюда файл Markdown',
  uk: 'Додайте сюди файл Markdown',
  ar: 'أرفق ملف Markdown هنا',
  hi: 'यहाँ Markdown फ़ाइल जोड़ें',
  ja: 'Markdown ファイルをここに添付',
  ko: '여기에 Markdown 파일 첨부',
  'zh-CN': '在此处添加 Markdown 文件'
};

const powerpointUploadTitles = {
  en: 'Attach a PDF or PowerPoint file here',
  es: 'Adjunta aquí un PDF o archivo de PowerPoint',
  fr: 'Ajoutez ici un PDF ou un fichier PowerPoint',
  de: 'PDF- oder PowerPoint-Datei hier anhängen',
  pt: 'Anexe um PDF ou arquivo do PowerPoint aqui',
  it: 'Allega qui un PDF o un file PowerPoint',
  nl: 'Voeg hier een PDF- of PowerPoint-bestand toe',
  pl: 'Dodaj tutaj plik PDF lub PowerPoint',
  sv: 'Bifoga en PDF- eller PowerPoint-fil här',
  fi: 'Liitä PDF- tai PowerPoint-tiedosto tähän',
  da: 'Vedhæft en PDF- eller PowerPoint-fil her',
  nb: 'Legg ved en PDF- eller PowerPoint-fil her',
  tr: 'Buraya PDF veya PowerPoint dosyası ekleyin',
  ru: 'Добавьте сюда файл PDF или PowerPoint',
  uk: 'Додайте сюди файл PDF або PowerPoint',
  ar: 'أرفق ملف PDF أو PowerPoint هنا',
  hi: 'यहाँ PDF या PowerPoint फ़ाइल जोड़ें',
  ja: 'PDF または PowerPoint ファイルをここに添付',
  ko: '여기에 PDF 또는 PowerPoint 파일 첨부',
  'zh-CN': '在此处添加 PDF 或 PowerPoint 文件'
};

const v6Translations = {
  en: ['Skip to main content', 'Browse tools', 'Files stay on your device', 'A clearer page, at your pace.', 'Five thoughtful collections', 'Explore PDF tools', 'Choose a collection, find the action, and continue at your own pace.', 'A little peace of mind', 'Your files stay yours.', 'Your documents are processed in your browser. Check each tool page for steps and limitations.', 'A note on the details', 'Good tools make the next step feel simple.', 'A document task can start with one question: which pages to keep, how to share a scan, or how to make a file easier to read. Browse by task, then choose a tool.', 'Each collection groups related actions. Review the controls and guidance on a tool page before creating an output.', 'PDF work happens in your browser. Some tools, including OCR, may need language resources the first time; the tool page explains what to expect.', 'tool matches', 'tools match'],
  es: ['Saltar al contenido principal', 'Explorar herramientas', 'Los archivos permanecen en tu dispositivo', 'Una página más clara, a tu ritmo.', 'Cinco colecciones bien pensadas', 'Explorar herramientas PDF', 'Elige una colección, encuentra la acción y continúa a tu ritmo.', 'Un poco de tranquilidad', 'Tus archivos siguen siendo tuyos.', 'Tus documentos se procesan en el navegador. Consulta cada herramienta para conocer los pasos y las limitaciones.', 'Una nota sobre los detalles', 'Las buenas herramientas simplifican el siguiente paso.', 'Una tarea con documentos puede empezar con una pregunta: qué páginas conservar, cómo compartir un escaneo o cómo facilitar la lectura de un archivo. Busca por tarea y elige una herramienta.', 'Cada colección agrupa acciones relacionadas. Revisa los controles y las instrucciones de la herramienta antes de crear un archivo.', 'El trabajo con PDF se realiza en el navegador. Algunas herramientas, como OCR, pueden necesitar recursos de idioma la primera vez; la página de la herramienta explica qué esperar.', 'herramienta coincide', 'herramientas coinciden'],
  fr: ['Aller au contenu principal', 'Parcourir les outils', 'Les fichiers restent sur votre appareil', 'Une page plus claire, à votre rythme.', 'Cinq collections soigneusement choisies', 'Explorer les outils PDF', 'Choisissez une collection, trouvez l’action et avancez à votre rythme.', 'Un peu de tranquillité', 'Vos fichiers restent les vôtres.', 'Vos documents sont traités dans votre navigateur. Consultez chaque page d’outil pour connaître les étapes et les limites.', 'Quelques précisions', 'Les bons outils simplifient la prochaine étape.', 'Une tâche documentaire commence parfois par une question : quelles pages conserver, comment partager un scan ou rendre un fichier plus lisible. Parcourez les tâches, puis choisissez un outil.', 'Chaque collection regroupe des actions liées. Consultez les commandes et les conseils de la page de l’outil avant de créer un fichier.', 'Le traitement des PDF se fait dans votre navigateur. Certains outils, dont l’OCR, peuvent nécessiter des ressources linguistiques lors de la première utilisation ; la page de l’outil explique à quoi s’attendre.', 'outil correspondant', 'outils correspondants'],
  de: ['Zum Hauptinhalt springen', 'Tools durchsuchen', 'Dateien bleiben auf deinem Gerät', 'Eine klarere Seite, in deinem Tempo.', 'Fünf sorgfältig zusammengestellte Sammlungen', 'PDF-Tools entdecken', 'Wähle eine Sammlung, finde die passende Aktion und arbeite in deinem Tempo weiter.', 'Ein wenig Sicherheit', 'Deine Dateien bleiben deine.', 'Deine Dokumente werden im Browser verarbeitet. Schritte und Einschränkungen findest du auf der jeweiligen Tool-Seite.', 'Ein Hinweis zu den Details', 'Gute Tools machen den nächsten Schritt einfach.', 'Eine Dokumentaufgabe beginnt oft mit einer Frage: Welche Seiten sollen bleiben, wie lässt sich ein Scan teilen oder eine Datei leichter lesen? Suche nach Aufgabe und wähle dann ein Tool.', 'Jede Sammlung bündelt passende Aktionen. Prüfe die Steuerelemente und Hinweise auf der Tool-Seite, bevor du eine Ausgabe erstellst.', 'PDFs werden im Browser verarbeitet. Manche Tools, darunter OCR, benötigen beim ersten Einsatz möglicherweise Sprachressourcen. Die Tool-Seite erklärt, was dich erwartet.', 'passendes Tool', 'passende Tools'],
  pt: ['Ir para o conteúdo principal', 'Explorar ferramentas', 'Os arquivos ficam no seu dispositivo', 'Uma página mais clara, no seu ritmo.', 'Cinco coleções cuidadosamente escolhidas', 'Explorar ferramentas PDF', 'Escolha uma coleção, encontre a ação e continue no seu ritmo.', 'Um pouco mais de tranquilidade', 'Seus arquivos continuam sendo seus.', 'Seus documentos são processados no navegador. Consulte cada ferramenta para ver as etapas e limitações.', 'Uma nota sobre os detalhes', 'Boas ferramentas simplificam a próxima etapa.', 'Uma tarefa com documentos pode começar com uma pergunta: quais páginas manter, como compartilhar uma digitalização ou facilitar a leitura de um arquivo. Explore por tarefa e escolha uma ferramenta.', 'Cada coleção reúne ações relacionadas. Confira os controles e as orientações da ferramenta antes de criar um arquivo.', 'O trabalho com PDF acontece no navegador. Algumas ferramentas, como OCR, podem precisar de recursos de idioma no primeiro uso; a página da ferramenta explica o que esperar.', 'ferramenta correspondente', 'ferramentas correspondentes'],
  it: ['Vai al contenuto principale', 'Esplora gli strumenti', 'I file restano sul tuo dispositivo', 'Una pagina più chiara, al tuo ritmo.', 'Cinque raccolte curate', 'Esplora gli strumenti PDF', 'Scegli una raccolta, trova l’azione e prosegui al tuo ritmo.', 'Un po’ di tranquillità', 'I tuoi file restano tuoi.', 'I documenti vengono elaborati nel browser. Consulta ogni pagina dello strumento per conoscere passaggi e limiti.', 'Una nota sui dettagli', 'Gli strumenti giusti semplificano il passo successivo.', 'Un’attività con i documenti può iniziare da una domanda: quali pagine conservare, come condividere una scansione o rendere un file più leggibile. Cerca per attività e scegli uno strumento.', 'Ogni raccolta riunisce azioni correlate. Controlla impostazioni e indicazioni nella pagina dello strumento prima di creare un file.', 'Il lavoro sui PDF avviene nel browser. Alcuni strumenti, incluso l’OCR, possono richiedere risorse linguistiche al primo utilizzo; la pagina dello strumento spiega cosa aspettarsi.', 'strumento corrispondente', 'strumenti corrispondenti'],
  nl: ['Ga naar de hoofdinhoud', 'Tools bekijken', 'Bestanden blijven op je apparaat', 'Een duidelijkere pagina, in jouw tempo.', 'Vijf zorgvuldig samengestelde collecties', 'PDF-tools ontdekken', 'Kies een collectie, vind de juiste actie en ga verder in je eigen tempo.', 'Een geruststellende gedachte', 'Je bestanden blijven van jou.', 'Je documenten worden in de browser verwerkt. Bekijk de stappen en beperkingen op de pagina van elke tool.', 'Een toelichting', 'Goede tools maken de volgende stap eenvoudig.', 'Een documenttaak begint soms met een vraag: welke pagina’s moeten blijven, hoe deel je een scan of maak je een bestand beter leesbaar? Zoek op taak en kies daarna een tool.', 'Elke collectie groepeert verwante acties. Bekijk de bediening en uitleg van een tool voordat je een bestand maakt.', 'PDF-bewerkingen vinden plaats in je browser. Sommige tools, zoals OCR, hebben mogelijk de eerste keer taalbronnen nodig; de toolpagina legt uit wat je kunt verwachten.', 'overeenkomende tool', 'overeenkomende tools'],
  pl: ['Przejdź do głównej treści', 'Przeglądaj narzędzia', 'Pliki pozostają na Twoim urządzeniu', 'Czytelniejsza strona, we własnym tempie.', 'Pięć starannie dobranych kolekcji', 'Przeglądaj narzędzia PDF', 'Wybierz kolekcję, znajdź potrzebną czynność i działaj we własnym tempie.', 'Odrobina spokoju', 'Twoje pliki pozostają Twoje.', 'Dokumenty są przetwarzane w przeglądarce. Na stronie każdego narzędzia znajdziesz instrukcje i ograniczenia.', 'Kilka słów o szczegółach', 'Dobre narzędzia ułatwiają kolejny krok.', 'Praca z dokumentem może zacząć się od pytania: które strony zachować, jak udostępnić skan albo ułatwić odczyt pliku. Wybierz zadanie, a potem odpowiednie narzędzie.', 'Każda kolekcja łączy powiązane działania. Przed utworzeniem pliku sprawdź ustawienia i wskazówki na stronie narzędzia.', 'Pliki PDF są przetwarzane w przeglądarce. Niektóre narzędzia, w tym OCR, mogą przy pierwszym użyciu potrzebować zasobów językowych; strona narzędzia wyjaśnia szczegóły.', 'pasujące narzędzie', 'pasujące narzędzia'],
  sv: ['Hoppa till huvudinnehållet', 'Bläddra bland verktyg', 'Filerna stannar på din enhet', 'En tydligare sida, i din egen takt.', 'Fem genomtänkta samlingar', 'Utforska PDF-verktyg', 'Välj en samling, hitta rätt åtgärd och fortsätt i din egen takt.', 'Lite extra trygghet', 'Dina filer förblir dina.', 'Dokumenten bearbetas i webbläsaren. Läs om stegen och begränsningarna på varje verktygssida.', 'Några ord om detaljerna', 'Bra verktyg gör nästa steg enkelt.', 'En dokumentuppgift kan börja med en fråga: vilka sidor ska vara kvar, hur delar du en skanning eller gör en fil enklare att läsa? Bläddra efter uppgift och välj sedan ett verktyg.', 'Varje samling grupperar relaterade åtgärder. Läs instruktionerna och granska inställningarna innan du skapar en fil.', 'PDF-arbetet sker i webbläsaren. Vissa verktyg, till exempel OCR, kan behöva språkresurser första gången; verktygssidan beskriver vad du kan förvänta dig.', 'matchande verktyg', 'matchande verktyg'],
  fi: ['Siirry pääsisältöön', 'Selaa työkaluja', 'Tiedostot pysyvät laitteellasi', 'Selkeämpi sivu, omaan tahtiisi.', 'Viisi harkittua kokoelmaa', 'Tutustu PDF-työkaluihin', 'Valitse kokoelma, löydä sopiva toiminto ja jatka omaan tahtiisi.', 'Mielenrauhaa', 'Tiedostosi pysyvät sinun hallinnassasi.', 'Asiakirjat käsitellään selaimessa. Katso kunkin työkalun sivulta ohjeet ja rajoitukset.', 'Tietoa yksityiskohdista', 'Hyvä työkalu helpottaa seuraavaa vaihetta.', 'Asiakirjatehtävä voi alkaa kysymyksestä: mitkä sivut säilytetään, miten skannauksen voi jakaa tai tiedoston lukemista helpottaa? Selaa tehtävän mukaan ja valitse sopiva työkalu.', 'Kokoelmat ryhmittelevät toisiinsa liittyviä toimintoja. Tarkista työkalusivun asetukset ja ohjeet ennen tiedoston luomista.', 'PDF-työ tehdään selaimessa. Jotkin työkalut, kuten OCR, voivat tarvita kieliresursseja ensimmäisellä käyttökerralla; työkalusivu kertoo lisätiedot.', 'sopiva työkalu', 'sopivaa työkalua'],
  da: ['Gå til hovedindhold', 'Gennemse værktøjer', 'Filerne bliver på din enhed', 'En tydeligere side i dit eget tempo.', 'Fem gennemtænkte samlinger', 'Udforsk PDF-værktøjer', 'Vælg en samling, find handlingen, og fortsæt i dit eget tempo.', 'Lidt ekstra tryghed', 'Dine filer forbliver dine.', 'Dokumenterne behandles i browseren. Se trinene og begrænsningerne på hver værktøjsside.', 'Et par ord om detaljerne', 'Gode værktøjer gør næste trin enkelt.', 'En dokumentopgave kan begynde med et spørgsmål: hvilke sider skal beholdes, hvordan deles en scanning, eller hvordan bliver en fil lettere at læse? Gennemse efter opgave, og vælg derefter et værktøj.', 'Hver samling grupperer relaterede handlinger. Gennemgå værktøjets indstillinger og vejledning, før du opretter en fil.', 'PDF-arbejdet foregår i browseren. Nogle værktøjer, herunder OCR, kan have brug for sprogressourcer første gang; værktøjssiden forklarer, hvad du kan forvente.', 'matchende værktøj', 'matchende værktøjer'],
  nb: ['Hopp til hovedinnhold', 'Bla gjennom verktøy', 'Filene blir på enheten din', 'En tydeligere side, i ditt eget tempo.', 'Fem gjennomtenkte samlinger', 'Utforsk PDF-verktøy', 'Velg en samling, finn handlingen og fortsett i ditt eget tempo.', 'Litt ekstra trygghet', 'Filene dine forblir dine.', 'Dokumentene behandles i nettleseren. Se fremgangsmåte og begrensninger på hver verktøyside.', 'Noen ord om detaljene', 'Gode verktøy gjør neste steg enkelt.', 'En dokumentoppgave kan begynne med et spørsmål: hvilke sider skal beholdes, hvordan dele en skanning eller gjøre en fil enklere å lese? Bla etter oppgave, og velg deretter et verktøy.', 'Hver samling grupperer relaterte handlinger. Se over innstillingene og veiledningen på verktøysiden før du lager en fil.', 'PDF-arbeidet skjer i nettleseren. Noen verktøy, som OCR, kan trenge språkressurser første gang; verktøysiden forklarer hva du kan forvente.', 'matchende verktøy', 'matchende verktøy'],
  tr: ['Ana içeriğe atla', 'Araçlara göz at', 'Dosyalar cihazınızda kalır', 'Kendi hızınızda daha anlaşılır bir sayfa.', 'Özenle seçilmiş beş koleksiyon', 'PDF araçlarını keşfet', 'Bir koleksiyon seçin, işlemi bulun ve kendi hızınızda devam edin.', 'İçiniz rahat olsun', 'Dosyalarınız size ait kalır.', 'Belgeleriniz tarayıcıda işlenir. Adımları ve sınırlamaları her aracın sayfasında inceleyin.', 'Ayrıntılar hakkında', 'İyi araçlar sonraki adımı kolaylaştırır.', 'Belge işlemi bir soruyla başlayabilir: hangi sayfalar kalmalı, tarama nasıl paylaşılmalı veya dosya nasıl daha kolay okunmalı? İşleme göre göz atıp uygun aracı seçin.', 'Her koleksiyon ilişkili işlemleri bir araya getirir. Çıktı oluşturmadan önce aracın ayarlarını ve açıklamalarını inceleyin.', 'PDF işlemleri tarayıcınızda gerçekleşir. OCR gibi bazı araçlar ilk kullanımda dil kaynaklarına ihtiyaç duyabilir; araç sayfası ayrıntıları açıklar.', 'eşleşen araç', 'eşleşen araç'],
  ru: ['Перейти к основному содержимому', 'Обзор инструментов', 'Файлы остаются на вашем устройстве', 'Более понятная страница в вашем темпе.', 'Пять тщательно подобранных коллекций', 'Инструменты PDF', 'Выберите коллекцию, найдите нужное действие и продолжайте в удобном темпе.', 'Немного спокойствия', 'Ваши файлы остаются вашими.', 'Документы обрабатываются в браузере. Инструкции и ограничения указаны на странице каждого инструмента.', 'О важных деталях', 'Хорошие инструменты упрощают следующий шаг.', 'Работа с документом может начаться с вопроса: какие страницы оставить, как поделиться сканом или упростить чтение файла? Найдите задачу и выберите подходящий инструмент.', 'В каждой коллекции собраны связанные действия. Перед созданием файла ознакомьтесь с настройками и инструкциями инструмента.', 'PDF обрабатываются в браузере. Некоторым инструментам, включая OCR, при первом использовании могут понадобиться языковые ресурсы; подробности есть на странице инструмента.', 'подходящий инструмент', 'подходящих инструментов'],
  uk: ['Перейти до основного вмісту', 'Переглянути інструменти', 'Файли залишаються на вашому пристрої', 'Зрозуміліша сторінка у вашому темпі.', 'П’ять ретельно підібраних колекцій', 'Інструменти PDF', 'Виберіть колекцію, знайдіть потрібну дію та продовжуйте у власному темпі.', 'Трохи спокою', 'Ваші файли залишаються вашими.', 'Документи обробляються у браузері. Інструкції та обмеження наведені на сторінці кожного інструмента.', 'Кілька слів про деталі', 'Хороші інструменти спрощують наступний крок.', 'Робота з документом може початися із запитання: які сторінки залишити, як поділитися скануванням або полегшити читання файла? Знайдіть завдання й виберіть інструмент.', 'Кожна колекція об’єднує пов’язані дії. Перш ніж створювати файл, перегляньте налаштування та підказки інструмента.', 'PDF обробляються у браузері. Деяким інструментам, зокрема OCR, під час першого використання можуть знадобитися мовні ресурси; подробиці наведені на сторінці інструмента.', 'відповідний інструмент', 'відповідні інструменти'],
  ar: ['انتقل إلى المحتوى الرئيسي', 'تصفّح الأدوات', 'تبقى الملفات على جهازك', 'صفحة أوضح، على إيقاعك.', 'خمس مجموعات مختارة بعناية', 'استكشف أدوات PDF', 'اختر مجموعة، واعثر على الإجراء المناسب، وتابع بالسرعة التي تناسبك.', 'راحة بال بسيطة', 'ملفاتك تبقى ملكك.', 'تُعالج مستنداتك في المتصفح. راجع صفحة كل أداة لمعرفة الخطوات والقيود.', 'ملاحظة حول التفاصيل', 'الأدوات الجيدة تجعل الخطوة التالية أسهل.', 'قد تبدأ مهمة المستند بسؤال: ما الصفحات التي ينبغي الاحتفاظ بها، أو كيف تشارك مسحًا ضوئيًا، أو تجعل الملف أسهل قراءة؟ تصفّح حسب المهمة ثم اختر الأداة المناسبة.', 'تجمع كل مجموعة إجراءات مترابطة. راجع عناصر التحكم والإرشادات في صفحة الأداة قبل إنشاء ملف.', 'تتم معالجة PDF في المتصفح. قد تحتاج بعض الأدوات، ومنها OCR، إلى موارد لغوية عند الاستخدام الأول؛ وتوضح صفحة الأداة ما يمكن توقعه.', 'أداة مطابقة', 'أدوات مطابقة'],
  hi: ['मुख्य सामग्री पर जाएँ', 'टूल ब्राउज़ करें', 'फ़ाइलें आपके डिवाइस पर रहती हैं', 'आपकी गति से, अधिक स्पष्ट पृष्ठ।', 'सोच-समझकर बनाए गए पाँच संग्रह', 'PDF टूल देखें', 'कोई संग्रह चुनें, ज़रूरी कार्रवाई खोजें और अपनी गति से आगे बढ़ें।', 'थोड़ी निश्चिंतता', 'आपकी फ़ाइलें आपकी ही रहती हैं।', 'आपके दस्तावेज़ ब्राउज़र में संसाधित होते हैं। चरणों और सीमाओं के लिए हर टूल का पृष्ठ देखें।', 'विवरण पर एक नज़र', 'अच्छे टूल अगला कदम आसान बनाते हैं।', 'दस्तावेज़ का काम एक सवाल से शुरू हो सकता है: कौन से पृष्ठ रखने हैं, स्कैन कैसे साझा करना है, या फ़ाइल को पढ़ना आसान कैसे बनाना है? काम के अनुसार ब्राउज़ करें और फिर टूल चुनें।', 'हर संग्रह संबंधित कार्रवाइयों को साथ रखता है। फ़ाइल बनाने से पहले टूल पृष्ठ के नियंत्रण और निर्देश देखें।', 'PDF का काम ब्राउज़र में होता है। OCR सहित कुछ टूल पहली बार उपयोग पर भाषा संसाधन माँग सकते हैं; टूल पृष्ठ बताता है कि क्या अपेक्षा करें।', 'मेल खाता टूल', 'मेल खाते टूल'],
  ja: ['メインコンテンツへ移動', 'ツールを探す', 'ファイルはお使いのデバイスに保存されます', '自分のペースで、より見やすいページに。', '目的別にまとめた5つのコレクション', 'PDFツールを見る', 'コレクションから操作を選び、自分のペースで進めましょう。', '少しの安心を', 'ファイルはお客様の手元に残ります。', '書類はブラウザー内で処理されます。手順と制限は各ツールのページでご確認ください。', '詳細について', '次の手順を簡単にするのが、よいツールです。', '書類の作業は「どのページを残すか」「スキャンをどう共有するか」「ファイルを読みやすくするには」といった疑問から始まります。目的から探して、合うツールを選びましょう。', '各コレクションには関連する操作がまとまっています。出力を作成する前に、ツールページの設定と案内をご確認ください。', 'PDFの処理はブラウザー内で行われます。OCRなど一部のツールでは初回に言語リソースが必要な場合があります。詳しくはツールページをご覧ください。', '件の一致するツール', '件の一致するツール'],
  ko: ['본문으로 건너뛰기', '도구 둘러보기', '파일은 기기에 보관됩니다', '내 속도에 맞춰 더 선명하게.', '세심하게 구성한 다섯 가지 모음', 'PDF 도구 둘러보기', '모음을 선택하고 필요한 작업을 찾아 내 속도로 진행하세요.', '작은 안심', '파일은 계속 내 소유입니다.', '문서는 브라우저에서 처리됩니다. 단계와 제한 사항은 각 도구 페이지에서 확인하세요.', '세부 사항 안내', '좋은 도구는 다음 단계를 간단하게 만듭니다.', '문서 작업은 어떤 페이지를 남길지, 스캔을 어떻게 공유할지, 파일을 더 쉽게 읽는 방법은 무엇인지 묻는 데서 시작할 수 있습니다. 작업별로 둘러보고 알맞은 도구를 선택하세요.', '각 모음은 관련 작업을 함께 제공합니다. 결과를 만들기 전에 도구 페이지에서 설정과 안내를 확인하세요.', 'PDF 작업은 브라우저에서 이루어집니다. OCR을 비롯한 일부 도구는 처음 사용할 때 언어 리소스가 필요할 수 있으며, 자세한 내용은 도구 페이지에 안내되어 있습니다.', '개 일치 도구', '개 일치 도구'],
  'zh-CN': ['跳转到主要内容', '浏览工具', '文件保留在您的设备上', '按自己的节奏，让页面更清晰。', '五个精心整理的工具集合', '探索 PDF 工具', '选择一个集合，找到所需操作，然后按自己的节奏继续。', '多一份安心', '您的文件始终由您掌控。', '文档会在浏览器中处理。各工具页面会说明操作步骤和限制。', '关于细节的说明', '好用的工具让下一步更简单。', '文档任务可能从一个问题开始：要保留哪些页面、如何分享扫描件，或怎样让文件更易阅读？按任务浏览并选择合适的工具。', '每个集合都将相关操作归在一起。创建输出前，请查看工具页面上的控件和说明。', 'PDF 在浏览器中处理。OCR 等部分工具首次使用时可能需要语言资源；工具页面会说明相关情况。', '个匹配工具', '个匹配工具']
};

const homeContentTranslations = {
  en: {
    homeBottomTitle: 'Powerful tools, zero friction.',
    homeBottomPara1: 'From merging and splitting to OCR and conversion, our PDF tools support more than 18 document workflows. Each tool is designed for a specific task.',
    homeBottomPara2: 'The collections above group related actions so you can find what you need quickly. Review the controls and guidance on a tool page before creating an output.',
    homeBottomPara3: 'Use the interface in any of our supported languages. Some tools, including OCR, may need language resources the first time you use them.',
    toolsCount: '{{count}} Tools',
  },
  es: {
    homeBottomTitle: 'Herramientas potentes, sin complicaciones.',
    homeBottomPara1: 'Desde combinar y dividir hasta OCR y conversión, nuestras herramientas PDF ofrecen más de 18 flujos de trabajo. Cada herramienta está diseñada para una tarea específica.',
    homeBottomPara2: 'Las colecciones agrupan acciones relacionadas para que encuentres lo que necesitas rápidamente. Revisa los controles y las instrucciones antes de crear un archivo.',
    homeBottomPara3: 'Usa la interfaz en cualquiera de los idiomas disponibles. Algunas herramientas, como OCR, pueden necesitar recursos de idioma la primera vez.',
    toolsCount: '{{count}} herramientas',
  },
  fr: {
    homeBottomTitle: 'Des outils puissants, en toute simplicité.',
    homeBottomPara1: 'De la fusion et de la séparation à l’OCR et à la conversion, nos outils PDF couvrent plus de 18 tâches documentaires. Chaque outil répond à un besoin précis.',
    homeBottomPara2: 'Les collections regroupent des actions associées pour vous aider à trouver rapidement ce qu’il vous faut. Consultez les commandes et les conseils avant de créer un fichier.',
    homeBottomPara3: 'Utilisez l’interface dans l’une des langues proposées. Certains outils, dont l’OCR, peuvent nécessiter des ressources linguistiques lors de la première utilisation.',
    toolsCount: '{{count}} outils',
  },
  de: {
    homeBottomTitle: 'Leistungsstarke Tools, ganz unkompliziert.',
    homeBottomPara1: 'Von Zusammenfügen und Teilen bis OCR und Konvertierung: Unsere PDF-Tools unterstützen mehr als 18 Dokumentaufgaben. Jedes Tool ist für einen bestimmten Zweck ausgelegt.',
    homeBottomPara2: 'Die Sammlungen bündeln passende Aktionen, damit du schnell findest, was du brauchst. Prüfe die Steuerelemente und Hinweise, bevor du eine Ausgabe erstellst.',
    homeBottomPara3: 'Nutze die Oberfläche in einer der verfügbaren Sprachen. Manche Tools, darunter OCR, benötigen bei der ersten Verwendung möglicherweise Sprachressourcen.',
    toolsCount: '{{count}} Tools',
  },
  pt: {
    homeBottomTitle: 'Ferramentas poderosas, sem complicação.',
    homeBottomPara1: 'De juntar e dividir a OCR e conversão, nossas ferramentas PDF abrangem mais de 18 tarefas com documentos. Cada ferramenta foi criada para uma necessidade específica.',
    homeBottomPara2: 'As coleções agrupam ações relacionadas para você encontrar rapidamente o que precisa. Confira os controles e as orientações antes de criar um arquivo.',
    homeBottomPara3: 'Use a interface em qualquer um dos idiomas disponíveis. Algumas ferramentas, como OCR, podem precisar de recursos de idioma no primeiro uso.',
    toolsCount: '{{count}} ferramentas',
  },
  it: {
    homeBottomTitle: 'Strumenti potenti, senza complicazioni.',
    homeBottomPara1: 'Dall’unione e divisione all’OCR e alla conversione, i nostri strumenti PDF coprono oltre 18 attività documentali. Ogni strumento è pensato per un’esigenza specifica.',
    homeBottomPara2: 'Le raccolte raggruppano azioni correlate per aiutarti a trovare subito ciò che serve. Controlla impostazioni e indicazioni prima di creare un file.',
    homeBottomPara3: 'Usa l’interfaccia in una delle lingue disponibili. Alcuni strumenti, incluso l’OCR, possono richiedere risorse linguistiche al primo utilizzo.',
    toolsCount: '{{count}} strumenti',
  },
  nl: {
    homeBottomTitle: 'Krachtige tools, zonder gedoe.',
    homeBottomPara1: 'Van samenvoegen en splitsen tot OCR en conversie: onze PDF-tools ondersteunen meer dan 18 documenttaken. Elke tool is gemaakt voor een specifieke taak.',
    homeBottomPara2: 'De collecties groeperen verwante acties, zodat je snel vindt wat je zoekt. Bekijk de bediening en uitleg voordat je een bestand maakt.',
    homeBottomPara3: 'Gebruik de interface in een van de beschikbare talen. Sommige tools, waaronder OCR, hebben mogelijk de eerste keer taalbronnen nodig.',
    toolsCount: '{{count}} tools',
  },
  pl: {
    homeBottomTitle: 'Możliwości bez zbędnych komplikacji.',
    homeBottomPara1: 'Od łączenia i dzielenia po OCR i konwersję — nasze narzędzia PDF obsługują ponad 18 zadań związanych z dokumentami. Każde narzędzie służy konkretnemu zadaniu.',
    homeBottomPara2: 'Kolekcje grupują powiązane działania, aby ułatwić znalezienie potrzebnej funkcji. Przed utworzeniem pliku sprawdź ustawienia i wskazówki.',
    homeBottomPara3: 'Korzystaj z interfejsu w jednym z dostępnych języków. Niektóre narzędzia, w tym OCR, mogą przy pierwszym użyciu wymagać zasobów językowych.',
    toolsCount: 'Narzędzia: {{count}}',
  },
  sv: {
    homeBottomTitle: 'Kraftfulla verktyg, utan krångel.',
    homeBottomPara1: 'Från att slå ihop och dela till OCR och konvertering – våra PDF-verktyg stöder fler än 18 dokumentuppgifter. Varje verktyg är utformat för ett särskilt behov.',
    homeBottomPara2: 'Samlingarna grupperar relaterade åtgärder så att du snabbt hittar det du behöver. Läs instruktionerna och granska inställningarna innan du skapar en fil.',
    homeBottomPara3: 'Använd gränssnittet på något av de tillgängliga språken. Vissa verktyg, till exempel OCR, kan behöva språkresurser första gången.',
    toolsCount: '{{count}} verktyg',
  },
  fi: {
    homeBottomTitle: 'Tehokkaita työkaluja helposti.',
    homeBottomPara1: 'PDF-työkalumme tukevat yli 18 asiakirjatehtävää yhdistämisestä ja jakamisesta OCR-tunnistukseen ja muuntamiseen. Jokainen työkalu on suunniteltu tiettyyn tarpeeseen.',
    homeBottomPara2: 'Kokoelmat ryhmittelevät toisiinsa liittyvät toiminnot, jotta löydät tarvitsemasi nopeasti. Tarkista asetukset ja ohjeet ennen tiedoston luomista.',
    homeBottomPara3: 'Käytä käyttöliittymää millä tahansa tuetuista kielistä. Jotkin työkalut, kuten OCR, voivat tarvita kieliresursseja ensimmäisellä käyttökerralla.',
    toolsCount: '{{count}} työkalua',
  },
  da: {
    homeBottomTitle: 'Effektive værktøjer, helt enkelt.',
    homeBottomPara1: 'Fra sammenlægning og opdeling til OCR og konvertering understøtter vores PDF-værktøjer mere end 18 dokumentopgaver. Hvert værktøj er lavet til en bestemt opgave.',
    homeBottomPara2: 'Samlingerne grupperer relaterede handlinger, så du hurtigt kan finde det, du skal bruge. Gennemgå indstillinger og vejledning, før du opretter en fil.',
    homeBottomPara3: 'Brug grænsefladen på et af de tilgængelige sprog. Nogle værktøjer, herunder OCR, kan have brug for sprogressourcer første gang.',
    toolsCount: '{{count}} værktøjer',
  },
  nb: {
    homeBottomTitle: 'Kraftige verktøy, uten styr.',
    homeBottomPara1: 'Fra sammenslåing og deling til OCR og konvertering støtter PDF-verktøyene våre over 18 dokumentoppgaver. Hvert verktøy er laget for en bestemt oppgave.',
    homeBottomPara2: 'Samlingene grupperer relaterte handlinger, slik at du raskt finner det du trenger. Se over innstillinger og veiledning før du oppretter en fil.',
    homeBottomPara3: 'Bruk grensesnittet på et av de tilgjengelige språkene. Noen verktøy, blant annet OCR, kan trenge språkressurser første gang.',
    toolsCount: '{{count}} verktøy',
  },
  tr: {
    homeBottomTitle: 'Güçlü araçlar, zahmetsiz kullanım.',
    homeBottomPara1: 'Birleştirme ve bölmeden OCR ve dönüştürmeye kadar PDF araçlarımız 18’den fazla belge iş akışını destekler. Her araç belirli bir görev için tasarlanmıştır.',
    homeBottomPara2: 'Koleksiyonlar ilişkili işlemleri bir araya getirerek ihtiyacınızı hızla bulmanıza yardımcı olur. Çıktı oluşturmadan önce ayarları ve açıklamaları inceleyin.',
    homeBottomPara3: 'Arayüzü desteklenen dillerden biriyle kullanın. OCR dâhil bazı araçlar ilk kullanımda dil kaynaklarına ihtiyaç duyabilir.',
    toolsCount: '{{count}} araç',
  },
  ru: {
    homeBottomTitle: 'Удобные инструменты для работы с PDF.',
    homeBottomPara1: 'Наши инструменты поддерживают более 18 задач: от объединения и разделения до OCR и конвертации. Каждый инструмент предназначен для конкретной задачи.',
    homeBottomPara2: 'В коллекциях собраны связанные действия, чтобы вы быстрее находили нужное. Перед созданием файла ознакомьтесь с настройками и инструкциями.',
    homeBottomPara3: 'Интерфейс доступен на разных языках. Некоторым инструментам, включая OCR, при первом использовании могут понадобиться языковые ресурсы.',
    toolsCount: 'Инструменты: {{count}}',
  },
  uk: {
    homeBottomTitle: 'Потужні інструменти без зайвих складнощів.',
    homeBottomPara1: 'Наші PDF-інструменти підтримують понад 18 завдань: від об’єднання й розділення до OCR і конвертації. Кожен інструмент призначений для конкретної роботи.',
    homeBottomPara2: 'Колекції об’єднують пов’язані дії, щоб ви швидко знаходили потрібне. Перед створенням файла перегляньте налаштування та підказки.',
    homeBottomPara3: 'Користуйтеся інтерфейсом однією з доступних мов. Деяким інструментам, зокрема OCR, під час першого використання можуть знадобитися мовні ресурси.',
    toolsCount: 'Інструменти: {{count}}',
  },
  ar: {
    homeBottomTitle: 'أدوات قوية، بسهولة تامة.',
    homeBottomPara1: 'من دمج الملفات وتقسيمها إلى OCR والتحويل، تدعم أدوات PDF لدينا أكثر من 18 مهمة للمستندات. صُممت كل أداة لمهمة محددة.',
    homeBottomPara2: 'تجمع المجموعات الإجراءات المترابطة لتسهيل العثور على ما تحتاج إليه. راجع عناصر التحكم والإرشادات قبل إنشاء ملف.',
    homeBottomPara3: 'استخدم الواجهة بأي من اللغات المتاحة. قد تحتاج بعض الأدوات، ومنها OCR، إلى موارد لغوية عند استخدامها لأول مرة.',
    toolsCount: 'الأدوات: {{count}}',
  },
  hi: {
    homeBottomTitle: 'शक्तिशाली टूल, बिना किसी झंझट के।',
    homeBottomPara1: 'मर्ज और स्प्लिट से लेकर OCR और कन्वर्ज़न तक, हमारे PDF टूल 18 से अधिक दस्तावेज़ कार्यों में मदद करते हैं। हर टूल एक खास काम के लिए बनाया गया है।',
    homeBottomPara2: 'संग्रह संबंधित कार्रवाइयों को साथ रखते हैं, ताकि आपको ज़रूरी टूल जल्दी मिल सके। फ़ाइल बनाने से पहले सेटिंग और निर्देश देखें।',
    homeBottomPara3: 'इंटरफ़ेस उपलब्ध भाषाओं में से किसी में भी इस्तेमाल करें। OCR सहित कुछ टूल पहली बार उपयोग करने पर भाषा संसाधन माँग सकते हैं।',
    toolsCount: 'टूल: {{count}}',
  },
  ja: {
    homeBottomTitle: '高機能なツールを、シンプルに。',
    homeBottomPara1: '結合や分割からOCR、変換まで、PDFツールで18種類以上の作業に対応します。それぞれのツールは特定の用途に合わせて設計されています。',
    homeBottomPara2: '関連する操作をコレクションにまとめているので、必要な機能をすぐに見つけられます。ファイルを作成する前に設定と案内をご確認ください。',
    homeBottomPara3: '対応言語のいずれかでインターフェースを利用できます。OCRなど一部のツールでは、初回利用時に言語リソースが必要な場合があります。',
    toolsCount: '{{count}} 個のツール',
  },
  ko: {
    homeBottomTitle: '강력한 도구를 간편하게.',
    homeBottomPara1: '병합과 분할부터 OCR 및 변환까지, PDF 도구로 18가지 이상의 문서 작업을 처리할 수 있습니다. 각 도구는 특정 작업에 맞게 설계되었습니다.',
    homeBottomPara2: '모음에서 관련 작업을 함께 살펴보고 필요한 기능을 빠르게 찾으세요. 파일을 만들기 전에 설정과 안내를 확인하세요.',
    homeBottomPara3: '지원되는 언어로 인터페이스를 사용할 수 있습니다. OCR을 비롯한 일부 도구는 처음 사용할 때 언어 리소스가 필요할 수 있습니다.',
    toolsCount: '{{count}}개 도구',
  },
  'zh-CN': {
    homeBottomTitle: '强大工具，轻松使用。',
    homeBottomPara1: '从合并、拆分到 OCR 和转换，我们的 PDF 工具支持 18 种以上的文档处理任务。每款工具都针对特定需求设计。',
    homeBottomPara2: '相关操作按集合归类，方便你快速找到所需功能。创建文件前，请查看工具的设置和说明。',
    homeBottomPara3: '界面支持多种语言。部分工具（包括 OCR）首次使用时可能需要下载语言资源。',
    toolsCount: '{{count}} 个工具',
  },
};

const messagesByLanguage = Object.fromEntries(
  SUPPORTED_LANGUAGES.map(({ code }) => [
    code,
    Object.fromEntries([
      ...keys.map((key, index) => [key, translations[code][index]]),
      ...extraKeys.map((key, index) => [key, extraTranslations[code][index]]),
      ...Object.entries(descriptionToggleTranslations[code]),
      ...workflowKeys.map((key, index) => [key, workflowTranslations[code][index]]),
      ...v6Keys.map((key, index) => [key, v6Translations[code][index]]),
      ...Object.entries(homeContentTranslations[code]),
      ['attachDocumentHere', documentUploadTitles[code]],
      ['attachWordFileHere', wordUploadTitles[code]],
      ['attachMarkdownFileHere', markdownUploadTitles[code]],
      ['attachPdfOrPowerPointHere', powerpointUploadTitles[code]],
      ['loadingTool', routeLoadingTranslations[code]],
      ...Object.entries(routeErrorTranslations[code]),
      ...Object.entries(toolExitTranslations[code]),
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
