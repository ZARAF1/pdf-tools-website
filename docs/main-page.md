# Homepage redesign work

## Task 1.1 — Scaffolding

### WCAG 2.2 AA Verification Matrix

| # | Criterion | Level | Verification Method |
|---|-----------|-------|---------------------|
| 1 | 1.3.1 Info and Relationships | A | DOM landmark + heading inspection |
| 2 | 1.4.3 Text Contrast | AA | Contrast ratio for every text/bg pair ≥4.5:1 (≥3:1 for ≥24px) |
| 3 | 1.4.4 Resize Text | AA | 200% zoom — no content loss |
| 4 | 1.4.10 Reflow | AA | 320px width no horizontal scroll; 400% zoom at 1280px no horizontal scroll |
| 5 | 1.4.11 Non-text Contrast | AA | Search border, focus rings, icon borders ≥3:1 |
| 6 | 1.4.12 Text Spacing | AA | Text-spacing bookmarklet — no clipping |
| 7 | 2.1.1 Keyboard | A | Tab/Enter/Space/Escape reach every function |
| 8 | 2.1.2 No Keyboard Trap | A | Focus can leave any element |
| 9 | 2.4.1 Bypass Blocks | A | Skip link visible on focus and functional |
| 10 | 2.4.3 Focus Order | A | Tab order = visual order |
| 11 | 2.4.7 Focus Visible | AA | Visible ring on every control |
| 12 | 2.4.11 Focus Not Obscured (2.2) | AA | Focused element not hidden by sticky bar/toast |
| 13 | 2.5.7 Dragging Movements (2.2) | AA | Every drag has single-pointer alternative |
| 14 | 2.5.8 Target Size Minimum (2.2) | AA | All targets ≥24×24 CSS px (project ≥44×44) |
| 15 | 3.2.6 Consistent Help (2.2) | A | Help/Contact same relative position each page |
| 16 | 3.3.1 Error Identification | A | Errors stated in text, not colour alone |
| 17 | 3.3.7 Redundant Entry (2.2) | A | No re-entry of same info across steps |
| 18 | 3.3.8 Accessible Authentication (2.2) | AA | No cognitive test for auth (n/a if no auth) |
| 19 | 4.1.2 Name, Role, Value | A | Every control has accessible name + correct role |
| 20 | 4.1.3 Status Messages | AA | Toasts/updates via aria-live |

### Task → applicable criteria mapping

| Task | Applicable criteria |
|------|---------------------|
| 3.x | 1.3.1, 1.4.3, 1.4.10, 1.4.11, 2.1.1, 2.4.1, 2.4.3, 2.4.7, 2.4.11, 2.5.8, 4.1.2 |
| 4.x | 1.3.1, 1.4.3, 1.4.10, 1.4.11, 2.1.1, 2.4.1, 2.4.3, 2.4.7, 2.4.11, 2.5.8, 4.1.2 |
| 5.x | 1.3.1, 1.4.3, 1.4.10, 1.4.11, 2.1.1, 2.4.1, 2.4.3, 2.4.7, 2.4.11, 2.5.8, 4.1.2 |
| 6.x | 1.3.1, 1.4.3, 1.4.10, 1.4.11, 2.1.1, 2.4.1, 2.4.3, 2.4.7, 2.4.11, 2.5.8, 4.1.2 |

## Task 1.3 — AdSlot Audit

### A) AdSlot usage inventory

| # | File:line | Placement prop | Rendered above the fold? | Adjacent to interactive element? | Placeholder text visible? | Notes |
|---|-----------|----------------|--------------------------|--------------------------------|---------------------------|-------|
| 1 | src/components/Home.jsx:215 | `homeBelowTools` | No — it sits below the hero and below the toolbox section in the render tree, so it is not above the initial viewport when a user lands on the homepage. | No — it is separated from the hero CTA and category buttons by the list of tool cards. | No — the component returns `null` unless the ad is fully configured and enabled. | Homepage placement is below discovered tooling content, which is the lowest-risk placement for the active layout. |
| 2 | src/components/ToolPage.jsx:653 | `toolSupportingContent` | No — it renders after the article body, related tools, and supporting content, so it is below the main reading flow. | No — it follows the page content and related tool carousel, not a primary CTA or form. | No — the component returns `null` unless the ad is fully configured and enabled. | Tool page placement is lower in the page and does not interrupt the conversion workflow. |

### B) AdSense compliance verdict per placement

| # | File:line | Verdict (SAFE / RISKY / MUST-FIX) | Rule violated or at-risk | One-line reason |
|---|-----------|------------------------------------|--------------------------|----------------|
| 1 | src/components/Home.jsx:215 | SAFE | None currently active; if enabled, watch R1/R3/R7 | The component is inactive by default (`enabled: false`, `consentGranted: false`, `config.enabled: false`), so no ad container renders to users today. |
| 2 | src/components/ToolPage.jsx:653 | SAFE | None currently active; if enabled, watch R1/R3/R7 | The placement is below the main content and the component is inactive by default, so the current page does not display an ad. |

### C) Risk summary

1. Placement file:line: src/components/Home.jsx:215 — Risk level: SAFE — No active ad is rendered; if enabled later, keep it beneath the main toolbox and away from hero CTAs.
2. Placement file:line: src/components/ToolPage.jsx:653 — Risk level: SAFE — No active ad is rendered; the current placement sits after article content and is not above the fold.

### D) Placeholder-text check

| File:line | Placeholder text | Visible to user? | Risk |
|-----------|------------------|------------------|------|
| none found | none found | No | None |

A grep of the source tree found no visible placeholder strings such as `Ad goes here`, `Advertisement`, `Sponsored`, `ad-slot`, or `your-ad-here` in rendered output. The AdSlot component only renders an actual ad container when all required config checks pass, and the current configuration is disabled.

### E) Copy-adjacency check

| Placement | Adjacent copy | Risk (SAFE / RISKY / MUST-FIX) |
|-----------|---------------|-------------------------------|
| src/components/Home.jsx:215 | No visible ad is rendered; the hero and toolbox content remain the only visible elements. | SAFE |
| src/components/ToolPage.jsx:653 | No visible ad is rendered; the article and related tools remain the only visible content. | SAFE |

### F) Layout-shift (CLS) risk check

| Placement | Fixed-height container? | Reserves space when unfilled? | Risk |
|-----------|-------------------------|-------------------------------|------|
| src/components/Home.jsx:215 | No static fixed height, but the ad element sets `min-h-[100px]` when enabled. | Yes — the `ins` element reserves at least 100px when the ad is active. | LOW / SAFE in current state because no ad loads. |
| src/components/ToolPage.jsx:653 | No static fixed height, but the ad element sets `min-h-[100px]` when enabled. | Yes — the `ins` element reserves at least 100px when the ad is active. | LOW / SAFE in current state because no ad loads. |

The AdSlot component itself does not collapse to zero height when enabled; it uses `min-h-[100px]` on the ad element, which is a conservative reserved space. That means CLS risk is limited to the ad slot area itself, not to the wider page layout, and the more important risk today is the placement logic when the feature is activated later.

### G) Recommended actions (do NOT implement)

1. FIX BEFORE ADSENSE SUBMISSION: Keep all AdSlot instances disabled until final placement review is complete — src/components/Home.jsx:215 and src/components/ToolPage.jsx:653 — the current deployment avoids visible ads, but any future activation must remain below the hero and the primary toolbox flows.
2. REVIEW AT DAY 6: Re-check the final homepage composition to ensure the ad remains below the main tool discovery content and never sits next to the primary CTA or form area — src/components/Home.jsx:215 — the placement is still functionally acceptable only if it stays outside the highest-visibility content block.
3. KEEP AS-IS: src/components/AdSlot.jsx:13-62 — the component correctly blocks all rendering until the publisher ID, slot IDs, consent, and feature flag are valid, which prevents visible placeholder text and accidental ad injection.

### H) AdSlot component API summary

`AdSlot` accepts a single `placement` prop and looks up a matching config entry in the module-level `AD_CONFIGURATION` object. It renders nothing unless the feature flag, consent state, publisher ID, and slot ID are all valid. When enabled, it injects the AdSense script once and renders an `ins` element with `aria-label="Advertisement"` and responsive width, while the wrapper preserves minimal spacing. The current default configuration prevents any visible ad or placeholder content from appearing.

## Task 1.4 — i18n Quality Audit

### A) Language inventory

| # | Code | Display name | Native name | Files populated | Approx. coverage per file |
|---|------|--------------|-------------|-----------------|---------------------------|
| 1 | en | English | English | toolTranslations; toolPageLocalization; toolUiLocalization; faqLocalization | toolTranslations 100%; toolPageLocalization 100%; toolUiLocalization 100%; resourceLocalization missing; faqLocalization 100% |
| 2 | es | Español | Español | all 5 files populated | toolTranslations 100%; toolPageLocalization 100%; toolUiLocalization 100%; resourceLocalization 100%; faqLocalization 100% |
| 3 | fr | Français | Français | all 5 files populated | toolTranslations 100%; toolPageLocalization 100%; toolUiLocalization 100%; resourceLocalization 100%; faqLocalization 100% |
| 4 | de | Deutsch | Deutsch | all 5 files populated | toolTranslations 100%; toolPageLocalization 100%; toolUiLocalization 100%; resourceLocalization 100%; faqLocalization 100% |
| 5 | pt | Português | Português | all 5 files populated | toolTranslations 100%; toolPageLocalization 100%; toolUiLocalization 100%; resourceLocalization 100%; faqLocalization 100% |
| 6 | it | Italiano | Italiano | all 5 files populated | toolTranslations 100%; toolPageLocalization 100%; toolUiLocalization 100%; resourceLocalization 100%; faqLocalization 100% |
| 7 | nl | Nederlands | Nederlands | all 5 files populated | toolTranslations 100%; toolPageLocalization 100%; toolUiLocalization 100%; resourceLocalization 100%; faqLocalization 100% |
| 8 | pl | Polski | Polski | all 5 files populated | toolTranslations 100%; toolPageLocalization 100%; toolUiLocalization 100%; resourceLocalization 100%; faqLocalization 100% |
| 9 | sv | Svenska | Svenska | all 5 files populated | toolTranslations 100%; toolPageLocalization 100%; toolUiLocalization 100%; resourceLocalization 100%; faqLocalization 100% |
| 10 | fi | Suomi | Suomi | all 5 files populated | toolTranslations 100%; toolPageLocalization 100%; toolUiLocalization 100%; resourceLocalization 100%; faqLocalization 100% |
| 11 | da | Dansk | Dansk | all 5 files populated | toolTranslations 100%; toolPageLocalization 100%; toolUiLocalization 100%; resourceLocalization 100%; faqLocalization 100% |
| 12 | nb | Norsk bokmål | Norsk bokmål | all 5 files populated | toolTranslations 100%; toolPageLocalization 100%; toolUiLocalization 100%; resourceLocalization 100%; faqLocalization 100% |
| 13 | tr | Türkçe | Türkçe | all 5 files populated | toolTranslations 100%; toolPageLocalization 100%; toolUiLocalization 100%; resourceLocalization 100%; faqLocalization 100% |
| 14 | ru | Русский | Русский | all 5 files populated | toolTranslations 100%; toolPageLocalization 100%; toolUiLocalization 100%; resourceLocalization 100%; faqLocalization 100% |
| 15 | uk | Українська | Українська | all 5 files populated | toolTranslations 100%; toolPageLocalization 100%; toolUiLocalization 100%; resourceLocalization 100%; faqLocalization 100% |
| 16 | ar | العربية | العربية | all 5 files populated | toolTranslations 100%; toolPageLocalization 100%; toolUiLocalization 100%; resourceLocalization 100%; faqLocalization 100% |
| 17 | hi | हिन्दी | हिन्दी | all 5 files populated | toolTranslations 100%; toolPageLocalization 100%; toolUiLocalization 100%; resourceLocalization 100%; faqLocalization 100% |
| 18 | ja | 日本語 | 日本語 | all 5 files populated | toolTranslations 100%; toolPageLocalization 100%; toolUiLocalization 100%; resourceLocalization 100%; faqLocalization 100% |
| 19 | ko | 한국어 | 한국어 | all 5 files populated | toolTranslations 100%; toolPageLocalization 100%; toolUiLocalization 100%; resourceLocalization 100%; faqLocalization 100% |
| 20 | zh-CN | Simplified Chinese | 简体中文 | all 5 files populated | toolTranslations 100%; toolPageLocalization 100%; toolUiLocalization 100%; resourceLocalization 100%; faqLocalization 100% |

### B) Quality sample per language

Language: en — English
  Sample 1 (tool name): "Merge PDF" → FLUENT — standard product naming and idiomatic phrasing.
  Sample 2 (UI label):  "Choose images to convert to PDF" → FLUENT — clear, direct, and user-specific.
  Sample 3 (FAQ):       "For the supported tools, your selected document is processed in this browser and is not sent to a conversion server." → FLUENT — precise and plain-English.
  Sample 4 (paragraph): "Use the controls below to set your options and create a separate output; your original file stays unchanged." → FLUENT — natural and easy to understand.
  Sample 5 (error):     "Preview unavailable until the page settings are valid." → FLUENT — concise and actionable.

Language: es — Español
  Sample 1 (tool name): "Unir PDF" → FLUENT — concise and natural for a PDF tool.
  Sample 2 (UI label):  "Elige imágenes para convertir a PDF" → FLUENT — idiomatic and consistent with the UI.
  Sample 3 (FAQ):       "Los documentos seleccionados se procesan en tu navegador y no se envían a un servidor de conversión." → FLUENT — clear, natural, and user-friendly.
  Sample 4 (paragraph): "Usa los controles de abajo para configurar las opciones y crear un archivo nuevo; el original no se modifica." → FLUENT — readable and proper.
  Sample 5 (error):     "La vista previa no estará disponible hasta que los ajustes de página sean válidos." → FLUENT — clear and actionable.

Language: fr — Français
  Sample 1 (tool name): "Fusionner PDF" → FLUENT — standard product naming with clear French.
  Sample 2 (UI label):  "Choisir des images à convertir en PDF" → FLUENT — natural and precise.
  Sample 3 (FAQ):       "Les documents sélectionnés sont traités dans votre navigateur et ne sont pas envoyés à un serveur de conversion." → FLUENT — good French without awkward literalism.
  Sample 4 (paragraph): "Utilisez les commandes ci-dessous pour régler les options et créer un nouveau fichier ; l’original reste inchangé." → FLUENT — polished and readable.
  Sample 5 (error):     "L’aperçu sera disponible lorsque les réglages de page seront valides." → FLUENT — clear and usable.

Language: de — Deutsch
  Sample 1 (tool name): "PDF zusammenführen" → FLUENT — normal business German and clear.
  Sample 2 (UI label):  "Bilder für die Umwandlung in PDF auswählen" → FLUENT — precise and natural.
  Sample 3 (FAQ):       "Ausgewählte Dokumente werden in deinem Browser verarbeitet und nicht an einen Konvertierungsserver gesendet." → FLUENT — natural phrasing for a technical UI.
  Sample 4 (paragraph): "Nutze die Steuerelemente unten, um Optionen festzulegen und eine separate Ausgabe zu erstellen; die Originaldatei bleibt unverändert." → FLUENT — polished and clear.
  Sample 5 (error):     "Die Vorschau ist verfügbar, sobald die Seiteneinstellungen gültig sind." → FLUENT — direct and understandable.

Language: pt — Português
  Sample 1 (tool name): "Mesclar PDF" → FLUENT — standard portal phrasing and easy to read.
  Sample 2 (UI label):  "Escolha imagens para converter em PDF" → FLUENT — natural and direct.
  Sample 3 (FAQ):       "Os documentos selecionados são processados no navegador e não são enviados a um servidor de conversão." → FLUENT — clear, correct Portuguese.
  Sample 4 (paragraph): "Use os controles abaixo para definir as opções e criar um novo arquivo; o original permanece inalterado." → FLUENT — strong, readable prose.
  Sample 5 (error):     "A pré-visualização ficará disponível quando as configurações da página forem válidas." → FLUENT — concise and actionable.

Language: it — Italiano
  Sample 1 (tool name): "Unisci PDF" → FLUENT — short and idiomatic for a tool.
  Sample 2 (UI label):  "Scegli immagini da convertire in PDF" → FLUENT — natural and precise.
  Sample 3 (FAQ):       "I documenti selezionati vengono elaborati nel browser e non inviati a un server di conversione." → FLUENT — clear technical Italian.
  Sample 4 (paragraph): "Usa i controlli qui sotto per impostare le opzioni e creare un nuovo file; l’originale resta invariato." → FLUENT — polished and readable.
  Sample 5 (error):     "L’anteprima sarà disponibile quando le impostazioni della pagina saranno valide." → FLUENT — concise and clear.

Language: nl — Nederlands
  Sample 1 (tool name): "PDF samenvoegen" → FLUENT — standard tool wording with natural Dutch.
  Sample 2 (UI label):  "Kies afbeeldingen om naar PDF om te zetten" → FLUENT — direct and readable.
  Sample 3 (FAQ):       "Geselecteerde documenten worden in je browser verwerkt en niet naar een conversieserver gestuurd." → FLUENT — clear and idiomatic.
  Sample 4 (paragraph): "Gebruik de bediening hieronder om opties in te stellen en een afzonderlijk bestand te maken; het origineel blijft ongewijzigd." → FLUENT — natural and clear.
  Sample 5 (error):     "De voorbeeldweergave is beschikbaar zodra de pagina-instellingen geldig zijn." → ACCEPTABLE — understandable, slightly mechanical but clear.

Language: pl — Polski
  Sample 1 (tool name): "Połącz PDF" → FLUENT — idiomatic and concise.
  Sample 2 (UI label):  "Wybierz obrazy do konwersji na PDF" → ACCEPTABLE — understandable, but the noun choice is a little literal.
  Sample 3 (FAQ):       "Wybrane dokumenty są przetwarzane w przeglądarce i nie trafiają na serwer konwersji." → ACCEPTABLE — grammatical and understandable.
  Sample 4 (paragraph): "Użyj poniższych elementów, aby ustawić opcje i utworzyć osobny plik; oryginał pozostanie bez zmian." → ACCEPTABLE — sound but slightly formal.
  Sample 5 (error):     "Podgląd będzie dostępny po wprowadzeniu prawidłowych ustawień strony." → ACCEPTABLE — clear but a little stiff.

Language: sv — Svenska
  Sample 1 (tool name): "Slå ihop PDF" → FLUENT — standard and natural Swedish.
  Sample 2 (UI label):  "Välj bilder att konvertera till PDF" → FLUENT — clear and idiomatic.
  Sample 3 (FAQ):       "Valda dokument behandlas i webbläsaren och skickas inte till en konverteringsserver." → FLUENT — natural wording.
  Sample 4 (paragraph): "Använd kontrollerna nedan för att välja alternativ och skapa en separat fil; originalet ändras inte." → FLUENT — polished and readable.
  Sample 5 (error):     "Förhandsgranskningen blir tillgänglig när sidinställningarna är giltiga." → FLUENT — direct and usable.

Language: fi — Suomi
  Sample 1 (tool name): "Yhdistä PDF" → FLUENT — concise and natural.
  Sample 2 (UI label):  "Valitse PDF-muotoon muunnettavat kuvat" → ACCEPTABLE — understandable and accurate, though slightly mechanical.
  Sample 3 (FAQ):       "Valitut asiakirjat käsitellään selaimessa eikä niitä lähetetä muunnospalvelimelle." → ACCEPTABLE — clear, but formal.
  Sample 4 (paragraph): "Valitse asetukset alla olevilla säätimillä ja luo erillinen tiedosto; alkuperäinen säilyy ennallaan." → ACCEPTABLE — comprehensible and grammatically sound.
  Sample 5 (error):     "Esikatselu on käytettävissä, kun sivuasetukset ovat kelvollisia." → ACCEPTABLE — direct, though slightly formulaic.

Language: da — Dansk
  Sample 1 (tool name): "Sammenlæg PDF" → ACCEPTABLE — understandable and generally correct.
  Sample 2 (UI label):  "Vælg billeder, der skal konverteres til PDF" → FLUENT — clear and natural.
  Sample 3 (FAQ):       "Valgte dokumenter behandles i browseren og sendes ikke til en konverteringsserver." → FLUENT — polished and readable.
  Sample 4 (paragraph): "Brug kontrollerne nedenfor til at vælge indstillinger og oprette en separat fil; originalen ændres ikke." → FLUENT — clear and natural.
  Sample 5 (error):     "Forhåndsvisningen er tilgængelig, når sideindstillingerne er gyldige." → FLUENT — clear and actionable.

Language: nb — Norsk bokmål
  Sample 1 (tool name): "Slå sammen PDF" → ACCEPTABLE — understandable and standard.
  Sample 2 (UI label):  "Velg bilder som skal konverteres til PDF" → FLUENT — natural and clear.
  Sample 3 (FAQ):       "Valgte dokumenter behandles i nettleseren og sendes ikke til en konverteringsserver." → FLUENT — nearly identical to Danish but natural.
  Sample 4 (paragraph): "Bruk kontrollene nedenfor for å velge alternativer og lage en separat fil; originalen forblir uendret." → FLUENT — clear and idiomatic.
  Sample 5 (error):     "Forhåndsvisningen blir tilgjengelig når sideinnstillingene er gyldige." → FLUENT — concise and clear.

Language: tr — Türkçe
  Sample 1 (tool name): "PDF Birleştir" → ACCEPTABLE — understandable, slightly template-like but usable.
  Sample 2 (UI label):  "PDF’ye dönüştürülecek görselleri seçin" → ACCEPTABLE — correct but literal.
  Sample 3 (FAQ):       "Seçilen belgeler tarayıcınızda işlenir ve bir dönüştürme sunucusuna gönderilmez." → ACCEPTABLE — solid and understandable.
  Sample 4 (paragraph): "Seçenekleri belirlemek ve ayrı bir çıktı oluşturmak için aşağıdaki kontrolleri kullanın; özgün dosyanız değişmez." → ACCEPTABLE — readable but slightly formal.
  Sample 5 (error):     "Sayfa ayarları geçerli olduğunda önizleme kullanılabilir." → ACCEPTABLE — clear and natural enough.

Language: ru — Русский
  Sample 1 (tool name): "Объединить PDF" → ACCEPTABLE — grammatically clear, though a little literal.
  Sample 2 (UI label):  "Выберите изображения для преобразования в PDF" → ACCEPTABLE — understandable and direct.
  Sample 3 (FAQ):       "Выбранные документы обрабатываются в браузере и не отправляются на сервер конвертации." → ACCEPTABLE — correct and readable.
  Sample 4 (paragraph): "Используйте элементы управления ниже, чтобы настроить параметры и создать отдельный файл; исходный файл не изменится." → ACCEPTABLE — clear but somewhat formal.
  Sample 5 (error):     "Предварительный просмотр станет доступен после ввода допустимых параметров страницы." → ACCEPTABLE — serviceable and precise.

Language: uk — Українська
  Sample 1 (tool name): "Об’єднати PDF" → ACCEPTABLE — understandable and consistent.
  Sample 2 (UI label):  "Виберіть зображення для перетворення на PDF" → ACCEPTABLE — clear and intelligible.
  Sample 3 (FAQ):       "Вибрані документи обробляються у браузері й не надсилаються на сервер конвертації." → ACCEPTABLE — solid Ukrainian, slightly formal.
  Sample 4 (paragraph): "Скористайтеся елементами керування нижче, щоб налаштувати параметри й створити окремий файл; оригінал не зміниться." → ACCEPTABLE — clear and natural enough.
  Sample 5 (error):     "Попередній перегляд буде доступний після введення допустимих налаштувань сторінки." → ACCEPTABLE — understandable and functional.

Language: ar — العربية
  Sample 1 (tool name): "دمج PDF" → UNKNOWN — cannot assess confidently because I do not read Arabic; wording appears coherent but requires native proofing.
  Sample 2 (UI label):  "اختر صورًا لتحويلها إلى PDF" → UNKNOWN — cannot assess confidently because I do not read Arabic; this is coherent but still needs native validation.
  Sample 3 (FAQ):       "تُعالج المستندات المحددة في متصفحك ولا تُرسل إلى خادم تحويل." → UNKNOWN — cannot assess confidently because I do not read Arabic; phrasing appears clear but should be native-reviewed.
  Sample 4 (paragraph): "استخدم عناصر التحكم أدناه لضبط الخيارات وإنشاء ملف منفصل؛ لن يتغير الملف الأصلي." → UNKNOWN — cannot assess confidently because I do not read Arabic; grammar appears consistent but needs native verification.
  Sample 5 (error):     "ستتوفر المعاينة عند إدخال إعدادات صفحة صالحة." → UNKNOWN — cannot assess confidently because I do not read Arabic; this looks understandable but is not validated by a native speaker.

Language: hi — हिन्दी
  Sample 1 (tool name): "PDF जोड़ें" → UNKNOWN — cannot assess confidently because I do not read Hindi; it appears correct but needs native validation.
  Sample 2 (UI label):  "PDF में बदलने के लिए चित्र चुनें" → UNKNOWN — cannot assess confidently because I do not read Hindi; the phrasing is coherent but not native-verified.
  Sample 3 (FAQ):       "चुने गए दस्तावेज़ आपके ब्राउज़र में संसाधित होते हैं और किसी रूपांतरण सर्वर पर नहीं भेजे जाते." → UNKNOWN — cannot assess confidently because I do not read Hindi; structure is clear but native review is still needed.
  Sample 4 (paragraph): "विकल्प चुनकर अलग आउटपुट बनाने के लिए नीचे दिए नियंत्रणों का उपयोग करें; मूल फ़ाइल अपरिवर्तित रहती है।" → UNKNOWN — cannot assess confidently because I do not read Hindi; content is understandable but should be checked by a native editor.
  Sample 5 (error):     "पेज सेटिंग मान्य होने पर पूर्वावलोकन उपलब्ध होगा." → UNKNOWN — cannot assess confidently because I do not read Hindi; sentence structure is workable but not native-validated.

Language: ja — 日本語
  Sample 1 (tool name): "PDFを結合" → UNKNOWN — cannot assess confidently because I do not read Japanese; it looks correct but needs native proofing.
  Sample 2 (UI label):  "PDFに変換する画像を選択" → UNKNOWN — cannot assess confidently because I do not read Japanese; the phrase is coherent but not native-validated.
  Sample 3 (FAQ):       "選択した文書はブラウザー内で処理され、変換サーバーには送信されません." → UNKNOWN — cannot assess confidently because I do not read Japanese; it reads naturally enough to be plausible but needs native review.
  Sample 4 (paragraph): "下のコントロールでオプションを設定して別の出力を作成します。元のファイルは変更されません。" → UNKNOWN — cannot assess confidently because I do not read Japanese; the wording is understandable but should be checked by a native speaker.
  Sample 5 (error):     "ページ設定が有効になるとプレビューを表示できます。" → UNKNOWN — cannot assess confidently because I do not read Japanese; it is clear, but native review is still warranted.

Language: ko — 한국어
  Sample 1 (tool name): "PDF 병합" → UNKNOWN — cannot assess confidently because I do not read Korean; the text is coherent but needs native validation.
  Sample 2 (UI label):  "PDF로 변환할 이미지 선택" → UNKNOWN — cannot assess confidently because I do not read Korean; it reads clearly but needs native proofing.
  Sample 3 (FAQ):       "선택한 문서는 브라우저에서 처리되며 변환 서버로 전송되지 않습니다." → UNKNOWN — cannot assess confidently because I do not read Korean; it is understandable but not native-verified.
  Sample 4 (paragraph): "아래 컨트롤에서 옵션을 설정해 별도의 결과물을 만드세요. 원본 파일은 변경되지 않습니다." → UNKNOWN — cannot assess confidently because I do not read Korean; some phrasing is slightly machine-patterned but plausible.
  Sample 5 (error):     "페이지 설정이 유효하면 미리 보기를 사용할 수 있습니다." → UNKNOWN — cannot assess confidently because I do not read Korean; it is usable but should be native-reviewed.

Language: zh-CN — 简体中文
  Sample 1 (tool name): "合并 PDF" → UNKNOWN — cannot assess confidently because I do not read Chinese; the string is coherent but I would still use native QA on the final copy.
  Sample 2 (UI label):  "选择要转换为 PDF 的图片" → UNKNOWN — cannot assess confidently because I do not read Chinese; it is grammatically clear but not native-validated.
  Sample 3 (FAQ):       "所选文档在浏览器中处理，不会发送到转换服务器。" → UNKNOWN — cannot assess confidently because I do not read Chinese; it appears natural but should be reviewed by a native speaker.
  Sample 4 (paragraph): "使用下方控件设置选项并创建单独的输出文件；原始文件不会更改。" → UNKNOWN — cannot assess confidently because I do not read Chinese; wording seems polished but needs native checking.
  Sample 5 (error):     "页面设置有效后即可显示预览。" → UNKNOWN — cannot assess confidently because I do not read Chinese; it is understandable but not fully validated.

### C) Risk summary per language

| # | Language | AdSense risk | Reason |
|---|----------|--------------|--------|
| 1 | en | SAFE | 5/5 samples are FLUENT or ACCEPTABLE and natural for product copy. |
| 2 | es | SAFE | 5/5 samples are FLUENT and readable for a customer-facing PDF tool. |
| 3 | fr | SAFE | 5/5 samples are FLUENT and polished. |
| 4 | de | SAFE | 5/5 samples are FLUENT and professional. |
| 5 | pt | SAFE | 5/5 samples are FLUENT and consistent. |
| 6 | it | SAFE | 5/5 samples are FLUENT and clear. |
| 7 | nl | SAFE | 5/5 samples are FLUENT / ACCEPTABLE and understandable. |
| 8 | pl | SAFE | 4/5 are ACCEPTABLE and the rest are clear; no direct machine-translation signal dominates. |
| 9 | sv | SAFE | 5/5 samples are FLUENT and natural. |
| 10 | fi | SAFE | 4/5 samples are ACCEPTABLE; no major quality failure emerged. |
| 11 | da | SAFE | 5/5 samples are FLUENT or ACCEPTABLE and coherent. |
| 12 | nb | SAFE | 5/5 samples are FLUENT or ACCEPTABLE and consistent. |
| 13 | tr | SAFE | 5/5 samples are ACCEPTABLE and understandable. |
| 14 | ru | SAFE | 5/5 samples are ACCEPTABLE and coherent. |
| 15 | uk | SAFE | 5/5 samples are ACCEPTABLE and functional. |
| 16 | ar | UNKNOWN | Cannot assess confidently without a native Arabic reviewer; the copy looks coherent but needs verification. |
| 17 | hi | UNKNOWN | Cannot assess confidently without a native Hindi reviewer; wording reads plausibly but should be checked. |
| 18 | ja | UNKNOWN | Cannot assess confidently without a native Japanese reviewer; phrasing seems coherent but not proofread. |
| 19 | ko | UNKNOWN | Cannot assess confidently without a native Korean reviewer; wording appears understandable but not validated. |
| 20 | zh-CN | UNKNOWN | Cannot assess confidently without a native Chinese reviewer; copy is coherent but should be checked for idiom and SEO quality. |

### D) Overall recommendation (respecting D3)

2. SHIP ALL + IMPROVE SPECIFIC — The non-Western languages in the review set (Arabic, Hindi, Japanese, Korean, and Simplified Chinese) should receive native QA before broader SEO indexing, but they should not be removed from the product. The core language set reads as fluent or acceptable, so the current issue is targeted proofing rather than a global thin-content problem.

### E) Languages rated SAFE

- en — Fluent on all 5 samples.
- es — Fluent on all 5 samples.
- fr — Fluent on all 5 samples.
- de — Fluent on all 5 samples.
- pt — Fluent on all 5 samples.
- it — Fluent on all 5 samples.
- nl — Fluent on all 5 samples.
- pl — Acceptable on all 5 samples.
- sv — Fluent on all 5 samples.
- fi — Acceptable on all 5 samples.
- da — Fluent on all 5 samples.
- nb — Fluent on all 5 samples.
- tr — Acceptable on all 5 samples.
- ru — Acceptable on all 5 samples.
- uk — Acceptable on all 5 samples.

### F) Languages needing attention

- ar — Which samples failed: none explicitly failed, but all 5 samples remain UNKNOWN because I cannot validate Arabic with confidence. Recommended action: native QA before SEO indexing; rough effort estimate: medium (1 week).
- hi — Which samples failed: none explicitly failed, but all 5 samples remain UNKNOWN because I cannot validate Hindi with confidence. Recommended action: native QA before SEO indexing; rough effort estimate: medium (1 week).
- ja — Which samples failed: none explicitly failed, but all 5 samples remain UNKNOWN because I cannot validate Japanese with confidence. Recommended action: native QA before SEO indexing; rough effort estimate: medium (1 week).
- ko — Which samples failed: none explicitly failed, but all 5 samples remain UNKNOWN because I cannot validate Korean with confidence. Recommended action: native QA before SEO indexing; rough effort estimate: medium (1 week).
- zh-CN — Which samples failed: none explicitly failed, but all 5 samples remain UNKNOWN because I cannot validate Simplified Chinese with confidence. Recommended action: native QA before SEO indexing; rough effort estimate: medium (1 week).

### G) Machine-translation detection signals

- Signal: literal technical wording — example from de: "Die Website ruft ihre Seiten und Ressourcen ab. Die Protokollierung hängt vom Hostinganbieter ab." This reads as translatable but slightly literal template wording rather than polished product copy.
- Signal: repeated legal/safety phrasing — example from es: "Los documentos seleccionados se procesan en tu navegador y no se envían a un servidor de conversión." This phrasing is consistent but also formulaic across many languages, which is common in machine-generated copy.
- Signal: script-specific “native review needed” gap — example from ja: "ページ設定が有効になるとプレビューを表示できます。" It is understandable but not clearly native-polished enough to treat as fully human-edited SEO copy.
- Signal: formal-translation drift — example from hi: "विकल्प चुनकर अलग आउटपुट बनाने के लिए नीचे दिए नियंत्रणों का उपयोग करें; मूल फ़ाइल अपरिवर्तित रहती है।" It is clear but still reads as a direct translation of the English instructions rather than idiomatic Hindi product prose.

### H) AdSense submission advice

Given the current review, the shipped set is not obviously a thin-content AdSense risk across the core English and European-language offerings, but the five non-Western languages should not be treated as fully validated for broad SEO indexing until they receive native review. I would allow the product to ship as-is while applying a targeted human-proofing pass to Arabic, Hindi, Japanese, Korean, and Simplified Chinese before those pages are heavily indexed or promoted in search; I would not remove any language from the product.

## Task 1.5 — Baseline Metrics

### A) Test suite

| Item | Result |
|------|--------|
| Command | `npm.cmd test` (`node --test tests/*.test.mjs`) |
| Result | PASS before and after this documentation update — 352 passed, 0 failed, 0 skipped on both runs |
| Duration | Initial run: 1.94s wall-clock, Node duration 1,011.5734ms; post-update run: 1.33s wall-clock, Node duration 1,040.5927ms |
| Warnings | None observed in test output |

### B) Production build and bundle

| Item | Result |
|------|--------|
| Command | `npm.cmd run build` |
| Result | PASS; build completed in 2.23s |
| `dist/` output | 53,206,095 bytes (53,206.10 kB; 51,959.08 KiB) across 67 files |
| JavaScript chunks | 41 generated chunks in `dist/assets/`; 54 `.js` files total including copied OCR assets |
| Largest generated JavaScript chunk | `index-DS8Pxecb.js` — 991,541 bytes (968.30 KiB) |
| Homepage entry payload | 1,183,109 bytes (1,155.38 KiB) uncompressed: HTML, entry JavaScript, preloaded runtime, and stylesheet listed by `dist/index.html` |
| Warnings | `buffer` was externalized for browser compatibility from `docx`; a generated chunk exceeds the 500 kB minified warning limit. |

The homepage payload is an uncompressed build-file sum, not a measured network transfer size. The total `dist/` size includes copied OCR assets and is not the homepage's initial payload.

### C) Lighthouse mobile

| Metric | Result |
|--------|--------|
| Homepage URL | `http://localhost:4173/` — local production preview (`npm run build && npm run preview`); live Netlify deployment was outdated |
| Performance | 92 |
| Accessibility | 100 |
| Best Practices | 100 |
| SEO | 92 |
| LCP | Passed; export reported no major delay, but no numeric value was supplied |
| CLS | Passed; no layout shifts reported |
| INP | N/A — no value supplied |
| TBT | 10 ms |

### D) Accessibility audit — WAVE (axe DevTools unavailable)

axe DevTools failed to inject into the local preview, so WAVE was used instead. These counts are WAVE results and must not be interpreted as axe results.

| Item | WAVE result |
|------|-------------|
| Total WAVE errors | 0 errors; 28 contrast errors were reported separately |
| Critical | 0 |
| Serious | 28 contrast errors |
| Moderate | 24 alerts |
| Minor | 0 |
| Top reported items | Contrast Errors; Redundant title text; Redundant link |

### E) Responsive screenshots

The user reports that all eight full-page screenshots were saved in `tests/baseline-day1/`. Their presence was verified locally:

| Viewport width | Screenshot | Verified |
|----------------|------------|----------|
| 320 | `home-320.png` | Yes |
| 375 | `home-375.png` | Yes |
| 414 | `home-414.png` | Yes |
| 768 | `home-768.png` | Yes |
| 1024 | `home-1024.png` | Yes |
| 1280 | `home-1280.png` | Yes |
| 1440 | `home-1440.png` | Yes |
| 1920 | `home-1920.png` | Yes |

### F) Browser console

On the local production preview after a hard reload, the user reported **0 errors** and **0 warnings**. Error text: none.

### G) Baseline summary

| Metric | Value | Source | Threshold |
|--------|-------|--------|-----------|
| LH Performance | 92 | human — local production preview | ≥ 90 |
| LH Accessibility | 100 | human — local production preview | ≥ 95 |
| LH Best Practices | 100 | human — local production preview | ≥ 90 |
| LH SEO | 92 | human — local production preview | ≥ 95 |
| LCP | Passed; no major delay reported, numeric value not supplied | human — local production preview | < 2.5s |
| CLS | Passed; no layout shifts reported | human — local production preview | < 0.1 |
| INP | N/A — not supplied | human — local production preview | < 200ms |
| WAVE critical | 0 | human — WAVE; axe injection failed | 0 |
| WAVE serious | 28 contrast errors | human — WAVE; not an axe result | 0 |
| WAVE moderate | 24 alerts | human — WAVE | informational |
| WAVE errors | 0 errors (28 contrast errors reported separately) | human — WAVE | 0 |
| TBT | 10 ms | human — local production preview | — |
| Browser console | 0 errors, 0 warnings | human — local production preview | 0 |
| Screenshots | 8/8 files present for required widths | human reported; files verified locally | 8 |
| npm test | 352/352 passed | Copilot CLI | 352 (no regression) |
| Bundle size | 53,206.10 kB dist; homepage entry 1,155.38 KiB uncompressed | Copilot build output | decrease |

The Lighthouse, WAVE, screenshot, and console evidence above describes the local production preview, not the outdated live Netlify site. LCP was reported as passing without a numeric measurement, and INP was not supplied; neither is represented as a numeric Core Web Vital here.

### H) Interpretation

- **Furthest from target:** Lighthouse SEO is 92 against a target of ≥95 (3 points below target). Performance (92), Accessibility (100), and Best Practices (100) meet their stated score targets.
- **Reported as meeting target:** Lighthouse reports CLS passed with no layout shifts. LCP is reported as passed/no major delay, but without a numeric value; INP is unavailable, so those two results cannot be compared quantitatively with their thresholds.
- **Largest quality/accessibility risk:** WAVE reported 28 contrast errors and 24 moderate alerts; its top items also included redundant title text and redundant links. The contrast findings deserve review before redesign acceptance. Lighthouse Accessibility 100 does not erase these separate WAVE findings.
- **AdSense risk:** No direct AdSense-policy violation was identified by these measurements. The contrast findings are a user-experience/accessibility concern, not proof of an AdSense violation. The existing AdSlot audit records placements as inactive; the baseline does not establish future ad-placement compliance.
- **Scope limitation:** Evidence was gathered on the local production preview because the live Netlify site was outdated. Re-run the baseline against the intended deployment if production-specific measurements are required.

### I) Status and self-verification

Baseline status: **Ready for Review** — human browser evidence was supplied; axe DevTools was unavailable and WAVE was used as a clearly labeled substitute.

- [x] Section A records the actual test command, result, duration, and observed warnings.
- [x] Section B records the actual build output, `dist/` size, chunk counts, largest generated chunk, homepage entry payload, and warnings.
- [x] Section C records the supplied Lighthouse scores and distinguishes missing numeric LCP/INP values.
- [x] Section D records WAVE results and explicitly notes axe DevTools injection failure.
- [x] Section E confirms all eight screenshot files exist.
- [x] Section F records the supplied console counts.
- [x] Section G records all supplied measurements; unavailable numeric metrics are identified rather than fabricated.
- [x] Section H interprets the results and distinguishes accessibility quality risk from a proven AdSense violation.
- [x] `docs/status.md` Baseline row updated with browser evidence.
- [x] No application `.jsx`, `.js`, `.css`, `.mjs`, or `.json` file was modified.
- [x] Test count is recorded as observed: 352 passed.

## Task 2.1 — Design Tokens

### A) Token layer and theme integration

The shared tokens are exposed through Tailwind utilities and CSS custom properties. Existing application theme state is controlled by `document.documentElement.dataset.theme`; Tailwind is configured with a class-mode custom selector matching `[data-theme="dark"]`, so the current theme toggle keeps working without component changes. Light tokens are the `:root` defaults; dark color and shadow values are overridden by `:root[data-theme='dark']`.

The theme's color values are CSS-variable-backed, so the same utilities change with the active theme. Typography, spacing, and radius are structural scales and intentionally remain identical in both themes. The card, hover, modal, and sticky-bar shadows have light/dark values. The focus-ring token is light blue in dark mode to retain strong contrast.

Body copy and form-control text must remain at least 16px on mobile. Smaller type tokens are for compact labels, metadata, or supporting UI, not body copy.

### B) Color tokens

Hex values are shown for readability; the CSS custom properties store equivalent RGB channels for Tailwind alpha utilities. Palette-swatch ratios below are reference contrast against the page background, not approval to use every ramp shade as text; Section C lists each intended foreground/background pair.

| Name | Value (light) | Value (dark) | Contrast (if applicable) | Intended use |
|------|---------------|--------------|---------------------------|--------------|
| brand-50 | `#eff6ff` | `#0b1220` | Swatch/page reference: 1.04:1 light; 1.00:1 dark; background-only | Light tint / dark base tint |
| brand-100 | `#dbeafe` | `#0f172a` | Swatch/page reference: 1.17:1 light; 1.05:1 dark; background-only | Subtle brand surface |
| brand-200 | `#bfdbfe` | `#172554` | Swatch/page reference: 1.36:1 light; 1.27:1 dark; not text | Brand tint |
| brand-300 | `#93c5fd` | `#1e3a8a` | Swatch/page reference: 1.72:1 light; 1.81:1 dark; not text | Brand tint |
| brand-400 | `#60a5fa` | `#1e40af` | Swatch/page reference: 2.43:1 light; 2.15:1 dark; not text | Brand tint |
| brand-500 | `#3b82f6` | `#1d4ed8` | Swatch/page reference: 3.52:1 light; 2.79:1 dark; not text | Brand accent |
| brand-600 | `#2563eb` | `#2563eb` | Swatch/page reference: 4.94:1 light; 3.62:1 dark. Border: 5.17:1 on white; 3.30:1 on dark surface | Interactive borders and strong brand controls |
| brand-700 | `#1d4ed8` | `#60a5fa` | Swatch/page reference: 6.41:1 light; 7.36:1 dark. Text: 6.70:1 on white; 6.72:1 on dark surface | Brand links and text |
| brand-800 | `#1e40af` | `#93c5fd` | Swatch/page reference: 8.34:1 light; 10.38:1 dark; not text | Deep/light brand accent |
| brand-900 | `#1e3a8a` | `#dbeafe` | Swatch/page reference: 9.90:1 light; 15.35:1 dark; not text | Strongest light-theme / palest dark-theme accent |
| surface-50 | `#f8fafc` | `#0b1220` | Swatch/page reference: 1.00:1 in both themes; page background | Page background |
| surface-100 | `#f1f5f9` | `#111c2e` | Swatch/page reference: 1.05:1 light; 1.10:1 dark; muted/card background | Muted/card surface |
| surface-200 | `#e2e8f0` | `#1e293b` | Swatch/page reference: 1.18:1 light; 1.28:1 dark; non-interactive divider only | Subtle separators |
| surface-300 | `#cbd5e1` | `#334155` | Swatch/page reference: 1.42:1 light; 1.81:1 dark; non-interactive divider only | Stronger separators |
| surface-400 | `#94a3b8` | `#475569` | Swatch/page reference: 2.45:1 light; 2.47:1 dark; not text | Neutral ramp |
| surface-500 | `#64748b` | `#64748b` | Swatch/page reference: 4.55:1 light; 3.93:1 dark; use surface-fg-muted for text | Neutral ramp |
| surface-600 | `#475569` | `#94a3b8` | Swatch/page reference: 7.24:1 light; 7.30:1 dark; use surface-fg-secondary for text | Neutral ramp |
| surface-700 | `#334155` | `#cbd5e1` | Swatch/page reference: 9.90:1 light; 12.61:1 dark; not text | Neutral ramp |
| surface-800 | `#1e293b` | `#e2e8f0` | Swatch/page reference: 13.98:1 light; 15.19:1 dark; not text | Neutral ramp |
| surface-900 | `#0f172a` | `#f1f5f9` | Swatch/page reference: 17.06:1 light; 17.09:1 dark; use surface-fg-primary for text | Neutral ramp |
| surface-950 | `#020617` | `#f8fafc` | Swatch/page reference: 19.28:1 light; 17.89:1 dark; not text | Highest-contrast neutral |
| surface-fg (primary) | `#0f172a` | `#e2e8f0` | See every surface foreground pair in Section C | Primary text |
| surface-fg-secondary | `#475569` | `#a7b3c5` | See every surface foreground pair in Section C | Secondary text |
| surface-fg-muted | `#64748b` | `#94a3b8` | See every surface foreground pair in Section C | Muted text; chosen to pass AA on both theme surfaces |
| success / foreground | `#15803d` / `#ffffff` | `#86efac` / `#052e16` | 5.02:1 light; 10.62:1 dark | Success status background and readable foreground |
| warning / foreground | `#a16207` / `#ffffff` | `#fde68a` / `#422006` | 4.92:1 light; 11.70:1 dark | Warning status background and readable foreground |
| danger / foreground | `#b91c1c` / `#ffffff` | `#fca5a5` / `#450a0a` | 6.47:1 light; 8.51:1 dark | Error/danger status background and readable foreground |
| info / foreground | `#0369a1` / `#ffffff` | `#7dd3fc` / `#082f49` | 5.93:1 light; 8.32:1 dark | Informational status background and readable foreground |
| `--focus-ring` | `#2563eb` | `#60a5fa` | 5.17:1 on white; 6.72:1 on dark surface | 2px visible focus ring with a 2px surface-colored offset |

### C) Contrast evidence

Ratios use the WCAG relative-luminance formula and are rounded to two decimals. The following are the foreground/background combinations intended for token-based text, interactive boundaries, status treatments, and focus indicators. Palette-only surface swatches are backgrounds or decorative ramp values, not approved text colors; interactive boundaries use brand-600 rather than the subtle surface divider colors.

| Foreground | Background | Theme / use | Contrast |
|------------|------------|-------------|----------|
| `surface-fg` `#0f172a` | page `#f8fafc` | Light primary text | 17.06:1 |
| `surface-fg` `#0f172a` | card `#ffffff` | Light primary text | 17.85:1 |
| `surface-fg-secondary` `#475569` | page `#f8fafc` | Light secondary text | 7.24:1 |
| `surface-fg-secondary` `#475569` | card `#ffffff` | Light secondary text | 7.58:1 |
| `surface-fg-muted` `#64748b` | page `#f8fafc` | Light muted text | 4.55:1 |
| `surface-fg-muted` `#64748b` | card `#ffffff` | Light muted text | 4.76:1 |
| `surface-fg` `#e2e8f0` | page `#0b1220` | Dark primary text | 15.19:1 |
| `surface-fg` `#e2e8f0` | card `#111c2e` | Dark primary text | 13.86:1 |
| `surface-fg-secondary` `#a7b3c5` | page `#0b1220` | Dark secondary text | 8.82:1 |
| `surface-fg-secondary` `#a7b3c5` | card `#111c2e` | Dark secondary text | 8.05:1 |
| `surface-fg-muted` `#94a3b8` | page `#0b1220` | Dark muted text | 7.30:1 |
| `surface-fg-muted` `#94a3b8` | card `#111c2e` | Dark muted text | 6.66:1 |
| brand-700 `#1d4ed8` | white `#ffffff` | Light brand text | 6.70:1 |
| brand-700 `#1d4ed8` | page `#f8fafc` | Light brand text | 6.41:1 |
| brand-700 `#60a5fa` | page `#0b1220` | Dark brand text | 7.36:1 |
| brand-700 `#60a5fa` | card `#111c2e` | Dark brand text | 6.72:1 |
| brand-600 `#2563eb` | white `#ffffff` | Light interactive border | 5.17:1 |
| brand-600 `#2563eb` | page `#f8fafc` | Light interactive border | 4.94:1 |
| brand-600 `#2563eb` | page `#0b1220` | Dark interactive border | 3.62:1 |
| brand-600 `#2563eb` | card `#111c2e` | Dark interactive border | 3.30:1 |
| Focus `#2563eb` | white `#ffffff` | Light focus ring | 5.17:1 |
| Focus `#2563eb` | page `#f8fafc` | Light focus ring | 4.94:1 |
| Focus `#60a5fa` | page `#0b1220` | Dark focus ring | 7.36:1 |
| Focus `#60a5fa` | card `#111c2e` | Dark focus ring | 6.72:1 |
| `#ffffff` | success `#15803d` | Light success | 5.02:1 |
| `#ffffff` | warning `#a16207` | Light warning | 4.92:1 |
| `#ffffff` | danger `#b91c1c` | Light danger | 6.47:1 |
| `#ffffff` | info `#0369a1` | Light information | 5.93:1 |
| `#052e16` | success `#86efac` | Dark success | 10.62:1 |
| `#422006` | warning `#fde68a` | Dark warning | 11.70:1 |
| `#450a0a` | danger `#fca5a5` | Dark danger | 8.51:1 |
| `#082f49` | info `#7dd3fc` | Dark information | 8.32:1 |
| Existing tool-icon foreground `#1d4ed8` | existing tool-icon background `#eff6ff` | Light legacy alias preserved | 6.16:1 |
| Existing tool-icon foreground `#bfdbfe` | existing tool-icon background `#1e3a5f` | Dark legacy alias preserved | 8.10:1 |

All status foreground/background pairs exceed 4.5:1. The focus ring exceeds 3:1 against both page and card backgrounds in both themes. This is token contrast evidence; it does not claim that every existing page component has been runtime-audited with these tokens.

### D) Type scale

| Token | Size | Line height | Intended use |
|-------|------|-------------|--------------|
| 2xs | 11px | 16px | Compact metadata only |
| xs | 12px | 16px | Compact labels only |
| sm | 14px | 20px | Secondary UI labels; not mobile body text |
| base | 16px | 24px | Minimum body and form text on mobile |
| lg | 18px | 28px | Lead/body emphasis |
| xl | 20px | 28px | Subheadings |
| 2xl | 24px | 32px | Section headings |
| 3xl | 30px | 36px | Large headings |
| 4xl | 36px | 40px | Display headings |
| 5xl | 48px | 1 | Display |
| 6xl | 60px | 1 | Large display |
| 7xl | 72px | 1 | Largest display |

Type tokens have identical light and dark values; theme changes do not alter typography geometry.

### E) Spacing scale

| Token | Value | Intended use |
|-------|-------|--------------|
| xs | 4px | Tight inline spacing |
| sm | 8px | Compact control gaps |
| md | 12px | Control padding/gaps |
| lg | 16px | Standard spacing |
| xl | 24px | Section spacing |
| 2xl | 32px | Large component spacing |
| 3xl | 48px | Section separation |
| 4xl | 64px | Large section separation |
| 5xl | 96px | Page composition |
| 6xl | 128px | Major layout separation |

Spacing tokens are theme-invariant.

### F) Radii

| Token | Value | Intended use |
|-------|-------|--------------|
| sm | 6px | Compact controls |
| md | 10px | Standard controls |
| lg | 14px | Cards |
| xl | 20px | Large cards/panels |
| 2xl | 28px | Hero surfaces |
| full | 9999px | Pills and circular controls |

Radius tokens are theme-invariant.

### G) Shadows

| Token | Light value | Dark value | Intended use |
|-------|-------------|------------|--------------|
| card | `0 1px 2px rgb(15 23 42 / .06), 0 1px 3px rgb(15 23 42 / .1)` | `0 1px 2px rgb(0 0 0 / .24), 0 1px 3px rgb(0 0 0 / .32)` | Resting cards |
| cardHover | `0 8px 20px rgb(15 23 42 / .12), 0 3px 8px rgb(15 23 42 / .08)` | `0 8px 20px rgb(0 0 0 / .36), 0 3px 8px rgb(0 0 0 / .24)` | Elevated/hovered cards |
| focusRing | `0 0 0 2px var(--surface-background), 0 0 0 4px var(--focus-ring)` | Same geometry; dark surface and focus colors resolve from dark variables | 2px separator offset plus 2px visible outer ring |
| modal | `0 20px 50px rgb(15 23 42 / .2)` | `0 20px 50px rgb(0 0 0 / .48)` | Modal elevation |
| stickyBar | `0 -4px 16px rgb(15 23 42 / .12)` | `0 -4px 16px rgb(0 0 0 / .36)` | Sticky action bar |

### H) Rejected alternatives

- Considered a neutral-only brand palette; rejected because brand surfaces and links need a distinct identity and clear hierarchy.
- Considered relying on Tailwind's operating-system `media` dark mode; rejected because the app already supports an explicit persisted theme toggle.
- Considered converting the app to a literal `.dark` class; rejected for this task because it would require component changes outside scope. Tailwind's class strategy instead uses the existing `[data-theme="dark"]` root selector.
- Considered using gray-400 for muted text on white; rejected because it would not meet 4.5:1 for normal-sized text. The selected muted foreground is `#64748b` in light mode.

### I) Full source diffs

#### `tailwind.config.js`

```diff
diff --git a/tailwind.config.js b/tailwind.config.js
index d3f6d6c..9f7c05d 100644
--- a/tailwind.config.js
+++ b/tailwind.config.js
@@ -1,7 +1,98 @@
 module.exports = {
   content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
+  darkMode: ['class', '[data-theme="dark"]'],
   theme: {
-    extend: {},
+    extend: {
+      colors: {
+        brand: {
+          50: 'rgb(var(--brand-50) / <alpha-value>)',
+          100: 'rgb(var(--brand-100) / <alpha-value>)',
+          200: 'rgb(var(--brand-200) / <alpha-value>)',
+          300: 'rgb(var(--brand-300) / <alpha-value>)',
+          400: 'rgb(var(--brand-400) / <alpha-value>)',
+          500: 'rgb(var(--brand-500) / <alpha-value>)',
+          600: 'rgb(var(--brand-600) / <alpha-value>)',
+          700: 'rgb(var(--brand-700) / <alpha-value>)',
+          800: 'rgb(var(--brand-800) / <alpha-value>)',
+          900: 'rgb(var(--brand-900) / <alpha-value>)',
+        },
+        surface: {
+          50: 'rgb(var(--surface-50) / <alpha-value>)',
+          100: 'rgb(var(--surface-100) / <alpha-value>)',
+          200: 'rgb(var(--surface-200) / <alpha-value>)',
+          300: 'rgb(var(--surface-300) / <alpha-value>)',
+          400: 'rgb(var(--surface-400) / <alpha-value>)',
+          500: 'rgb(var(--surface-500) / <alpha-value>)',
+          600: 'rgb(var(--surface-600) / <alpha-value>)',
+          700: 'rgb(var(--surface-700) / <alpha-value>)',
+          800: 'rgb(var(--surface-800) / <alpha-value>)',
+          900: 'rgb(var(--surface-900) / <alpha-value>)',
+          950: 'rgb(var(--surface-950) / <alpha-value>)',
+        },
+        'surface-fg': {
+          DEFAULT: 'rgb(var(--surface-fg) / <alpha-value>)',
+          secondary: 'rgb(var(--surface-fg-secondary) / <alpha-value>)',
+          muted: 'rgb(var(--surface-fg-muted) / <alpha-value>)',
+        },
+        success: {
+          DEFAULT: 'rgb(var(--success) / <alpha-value>)',
+          foreground: 'rgb(var(--success-foreground) / <alpha-value>)',
+        },
+        warning: {
+          DEFAULT: 'rgb(var(--warning) / <alpha-value>)',
+          foreground: 'rgb(var(--warning-foreground) / <alpha-value>)',
+        },
+        danger: {
+          DEFAULT: 'rgb(var(--danger) / <alpha-value>)',
+          foreground: 'rgb(var(--danger-foreground) / <alpha-value>)',
+        },
+        info: {
+          DEFAULT: 'rgb(var(--info) / <alpha-value>)',
+          foreground: 'rgb(var(--info-foreground) / <alpha-value>)',
+        },
+      },
+      fontSize: {
+        '2xs': ['11px', { lineHeight: '16px' }],
+        xs: ['12px', { lineHeight: '16px' }],
+        sm: ['14px', { lineHeight: '20px' }],
+        base: ['16px', { lineHeight: '24px' }],
+        lg: ['18px', { lineHeight: '28px' }],
+        xl: ['20px', { lineHeight: '28px' }],
+        '2xl': ['24px', { lineHeight: '32px' }],
+        '3xl': ['30px', { lineHeight: '36px' }],
+        '4xl': ['36px', { lineHeight: '40px' }],
+        '5xl': ['48px', { lineHeight: '1' }],
+        '6xl': ['60px', { lineHeight: '1' }],
+        '7xl': ['72px', { lineHeight: '1' }],
+      },
+      spacing: {
+        xs: '4px',
+        sm: '8px',
+        md: '12px',
+        lg: '16px',
+        xl: '24px',
+        '2xl': '32px',
+        '3xl': '48px',
+        '4xl': '64px',
+        '5xl': '96px',
+        '6xl': '128px',
+      },
+      borderRadius: {
+        sm: '6px',
+        md: '10px',
+        lg: '14px',
+        xl: '20px',
+        '2xl': '28px',
+        full: '9999px',
+      },
+      boxShadow: {
+        card: 'var(--shadow-card)',
+        cardHover: 'var(--shadow-card-hover)',
+        focusRing: 'var(--shadow-focus-ring)',
+        modal: 'var(--shadow-modal)',
+        stickyBar: 'var(--shadow-sticky-bar)',
+      },
+    },
   },
   plugins: [],
 };
```

#### `src/index.css`

```diff
diff --git a/src/index.css b/src/index.css
index c0180cb..40339d0 100644
--- a/src/index.css
+++ b/src/index.css
@@ -28,24 +28,100 @@ body {

 :root {
   color-scheme: light;
+  --brand-50: 239 246 255;
+  --brand-100: 219 234 254;
+  --brand-200: 191 219 254;
+  --brand-300: 147 197 253;
+  --brand-400: 96 165 250;
+  --brand-500: 59 130 246;
+  --brand-600: 37 99 235;
+  --brand-700: 29 78 216;
+  --brand-800: 30 64 175;
+  --brand-900: 30 58 138;
+  --surface-50: 248 250 252;
+  --surface-100: 241 245 249;
+  --surface-200: 226 232 240;
+  --surface-300: 203 213 225;
+  --surface-400: 148 163 184;
+  --surface-500: 100 116 139;
+  --surface-600: 71 85 105;
+  --surface-700: 51 65 85;
+  --surface-800: 30 41 59;
+  --surface-900: 15 23 42;
+  --surface-950: 2 6 23;
+  --surface-fg: 15 23 42;
+  --surface-fg-secondary: 71 85 105;
+  --surface-fg-muted: 100 116 139;
+  --success: 21 128 61;
+  --success-foreground: 255 255 255;
+  --warning: 161 98 7;
+  --warning-foreground: 255 255 255;
+  --danger: 185 28 28;
+  --danger-foreground: 255 255 255;
+  --info: 3 105 161;
+  --info-foreground: 255 255 255;
+  --focus-ring: #2563eb;
+  --shadow-card: 0 1px 2px rgb(15 23 42 / 0.06), 0 1px 3px rgb(15 23 42 / 0.1);
+  --shadow-card-hover: 0 8px 20px rgb(15 23 42 / 0.12), 0 3px 8px rgb(15 23 42 / 0.08);
+  --shadow-focus-ring: 0 0 0 2px var(--surface-background), 0 0 0 4px var(--focus-ring);
+  --shadow-modal: 0 20px 50px rgb(15 23 42 / 0.2);
+  --shadow-sticky-bar: 0 -4px 16px rgb(15 23 42 / 0.12);
   --page-background: #f8fafc;
   --surface-background: #ffffff;
   --surface-muted: #f1f5f9;
-  --text-primary: #0f172a;
-  --text-secondary: #475569;
-  --border-color: #e2e8f0;
-  --tool-icon-background: #eff6ff;
-  --tool-icon-foreground: #1d4ed8;
+  --text-primary: rgb(var(--surface-fg));
+  --text-secondary: rgb(var(--surface-fg-secondary));
+  --border-color: rgb(var(--surface-200));
+  --tool-icon-background: rgb(var(--brand-50));
+  --tool-icon-foreground: rgb(var(--brand-700));
 }

 :root[data-theme='dark'] {
   color-scheme: dark;
+  --brand-50: 11 18 32;
+  --brand-100: 15 23 42;
+  --brand-200: 23 37 84;
+  --brand-300: 30 58 138;
+  --brand-400: 30 64 175;
+  --brand-500: 29 78 216;
+  --brand-600: 37 99 235;
+  --brand-700: 96 165 250;
+  --brand-800: 147 197 253;
+  --brand-900: 219 234 254;
+  --surface-50: 11 18 32;
+  --surface-100: 17 28 46;
+  --surface-200: 30 41 59;
+  --surface-300: 51 65 85;
+  --surface-400: 71 85 105;
+  --surface-500: 100 116 139;
+  --surface-600: 148 163 184;
+  --surface-700: 203 213 225;
+  --surface-800: 226 232 240;
+  --surface-900: 241 245 249;
+  --surface-950: 248 250 252;
+  --surface-fg: 226 232 240;
+  --surface-fg-secondary: 167 179 197;
+  --surface-fg-muted: 148 163 184;
+  --success: 134 239 172;
+  --success-foreground: 5 46 22;
+  --warning: 253 230 138;
+  --warning-foreground: 66 32 6;
+  --danger: 252 165 165;
+  --danger-foreground: 69 10 10;
+  --info: 125 211 252;
+  --info-foreground: 8 47 73;
+  --focus-ring: #60a5fa;
+  --shadow-card: 0 1px 2px rgb(0 0 0 / 0.24), 0 1px 3px rgb(0 0 0 / 0.32);
+  --shadow-card-hover: 0 8px 20px rgb(0 0 0 / 0.36), 0 3px 8px rgb(0 0 0 / 0.24);
+  --shadow-focus-ring: 0 0 0 2px var(--surface-background), 0 0 0 4px var(--focus-ring);
+  --shadow-modal: 0 20px 50px rgb(0 0 0 / 0.48);
+  --shadow-sticky-bar: 0 -4px 16px rgb(0 0 0 / 0.36);
   --page-background: #0b1220;
   --surface-background: #111c2e;
   --surface-muted: #1e293b;
-  --text-primary: #e2e8f0;
-  --text-secondary: #a7b3c5;
-  --border-color: #334155;
+  --text-primary: rgb(var(--surface-fg));
+  --text-secondary: rgb(var(--surface-fg-secondary));
+  --border-color: rgb(var(--surface-300));
   --tool-icon-background: #1e3a5f;
   --tool-icon-foreground: #bfdbfe;
 }
```

### J) Self-verification

- [x] Brand and surface color scales have explicit light and dark values; every intended foreground/background pair is listed with its ratio in Section C.
- [x] Accent base/foreground pairs exceed 4.5:1 in both themes.
- [x] Focus ring is `#2563eb` light / `#60a5fa` dark and exceeds 3:1 against both page and card surfaces in each theme.
- [x] All 12 type sizes and paired line heights are defined.
- [x] All 10 spacing tokens are defined.
- [x] `tailwind.config.js` is extended; existing content and plugins remain.
- [x] Existing `data-theme` toggle is retained through the custom class-mode selector; no component files changed.
- [x] `npm.cmd test` passed before and after the token changes: 352/352 each run.
- [x] `npm.cmd run build` passed; existing `buffer` externalization and >500 kB chunk warnings remain.
- [x] Tailwind generated brand utilities and the custom dark selector in a focused PostCSS check.
- [x] Automated token-count and contrast checks passed, including 27 intended color pairs.
- [x] `git diff --check` passed; no `.jsx` file was modified.
- [x] No `.jsx` file was modified.

## Task 2.2 — Interactive Primitives

### A) Read evidence and scope

- Read [docs/status.md](./status.md): Task 2.1 was Ready for Review with a 352/352 test baseline.
- Read [docs/PROJECT-TRACKER.md](./PROJECT-TRACKER.md): D1, D6, R1–R9, and F1–F8 informed the accessibility, placement, evidence, and scope constraints.
- Read Task 2.1 in this file: token names, dark-theme selector, color values, and focus-ring shadow token.
- Read [ToolCard.jsx](../src/components/ToolCard.jsx) and [ToolSearch.jsx](../src/components/ToolSearch.jsx) as read-only API references; neither was modified.
- Created only the five requested files under `src/components/ui/`; this section and the Task 2.2 row in `docs/status.md` are the only documentation changes.

### B) Prop tables

#### Button

| Prop | Type | Default | Behavior |
|------|------|---------|----------|
| `variant` | `primary \| secondary \| ghost \| danger` | `primary` | Selects the documented color treatment; unsupported values throw. |
| `size` | `sm \| md \| lg` | `md` | Sets padding, font scale, and minimum height. `sm` uses 44px to meet the project-wide touch target despite the packet's 32px primitive suggestion. |
| `loading` | boolean | `false` | Shows an aria-hidden spinner, sets `aria-busy="true"`, and disables activation. |
| `disabled` | boolean | `false` | Uses native button disabling or disables an anchor by removing its `href` and tab stop. |
| `iconLeft`, `iconRight` | React node | — | Optional decorative icons, hidden from assistive technology. |
| `as` | `button \| a` | `button` | Chooses native semantics. Enabled anchors require `href`; unsupported tags throw. |
| `children` | React node | — | Visible button/link name. |
| `type` | button type | `button` | Forwarded to the native button only. |
| `className` | string | `''` | Appended utility classes. |
| `...rest` | native element props | — | Includes attributes such as `id`, `href`, and accessible naming props. |

#### Input

| Prop | Type | Default | Behavior |
|------|------|---------|----------|
| `label` | React node | Required | Always rendered as a visible `<label>` associated with the input. Empty/missing labels throw. |
| `hint` | React node | — | Adds visible 16px supporting text and includes its ID in `aria-describedby`. |
| `error` | React node | — | Adds 16px error text with `role="alert"`, sets `aria-invalid`, and includes the error ID in `aria-describedby`. |
| `size` | `md \| lg` | `md` | Sets 44px or 52px minimum height; unsupported values throw. |
| `id` | string | generated | Connects the label and descriptions to this input. |
| `className` | string | `''` | Appended utility classes. |
| `aria-describedby` | string | — | Merged with hint/error IDs. |
| `aria-invalid` | boolean/string | — | Preserved when no `error` prop is supplied; the error prop forces `true`. |
| `...rest` | native input props | — | Forwarded to the native input. |

#### Card

| Prop | Type | Default | Behavior |
|------|------|---------|----------|
| `variant` | `default \| interactive \| featured` | `default` | Chooses static, clickable, or featured styling; unsupported values throw. |
| `as` | element tag | `button` for interactive; otherwise `div` | Interactive cards allow only a button or an anchor. Interactive anchors require `href`. |
| `children` | React node | — | Card content. An interactive card is one native target; do not nest other interactive controls inside it. |
| `className` | string | `''` | Appended utility classes. |
| `...rest` | native element props | — | Interactive button defaults to `type="button"`; event and accessible-name props are forwarded. |

#### Badge

| Prop | Type | Default | Behavior |
|------|------|---------|----------|
| `tone` | `neutral \| brand \| success \| warning \| danger` | `neutral` | Selects a semantic foreground/background pair; unsupported values throw. |
| `size` | `sm \| md` | `sm` | Sets 24px or 28px minimum height. Badges are non-interactive and are not tap targets. |
| `children` | React node | — | Badge content. |
| `className` | string | `''` | Appended utility classes. |
| `...rest` | span props | — | Forwarded to the `<span>`. |

#### FocusRing

| Prop | Type | Default | Behavior |
|------|------|---------|----------|
| `children` | one React element | Required | Cloned to add the focus-ring classes; exactly one focusable child is expected. |
| `focusableOnly` | boolean | `true` | Uses `:focus-visible` when true; uses `:focus` when false. |
| `className` | string | `''` | Appended to the child's classes. |

### C) Contrast evidence

Ratios use the Task 2.1 token RGB values converted to sRGB relative luminance and are rounded to two decimals. Text pairs target 4.5:1; control borders and focus indicators target 3:1. Hover rows include their actual hover background or the `brightness()` filter applied to both foreground and background. Disabled/loading text is inactive UI and is dimmed to 60%; it is not represented as an enabled-state contrast result.

#### Button text pairs

| Variant | Theme/state | Foreground / background | Ratio |
|---------|-------------|-------------------------|-------|
| Primary | Light / default | `#ffffff` / `#1d4ed8` | 6.70:1 |
| Primary | Light / hover | `#ffffff` / `#1e40af` | 8.72:1 |
| Primary | Dark / default | `#0b1220` / `#dbeafe` | 15.35:1 |
| Primary | Dark / hover | `#0b1220` / `#93c5fd` | 10.38:1 |
| Secondary | Light / default | `#1d4ed8` / `#f1f5f9` | 6.12:1 |
| Secondary | Light / hover | `#1d4ed8` / `#eff6ff` | 6.16:1 |
| Secondary | Dark / default | `#e2e8f0` / `#111c2e` | 13.86:1 |
| Secondary | Dark / hover | `#e2e8f0` / `#1e293b` | 11.87:1 |
| Ghost | Light / default | `#1d4ed8` / `#ffffff` | 6.70:1 |
| Ghost | Light / hover | `#1d4ed8` / `#eff6ff` | 6.16:1 |
| Ghost | Dark / default | `#60a5fa` / `#0b1220` | 7.36:1 |
| Ghost | Dark / hover | `#60a5fa` / `#111c2e` | 6.72:1 |
| Danger | Light / default | `#ffffff` / `#b91c1c` | 6.47:1 |
| Danger | Light / hover (`brightness(.95)`) | Filter-adjusted foreground / background | 6.21:1 |
| Danger | Dark / default | `#450a0a` / `#fca5a5` | 8.51:1 |
| Danger | Dark / hover (`brightness(1.10)`) | Filter-adjusted foreground / background | 9.28:1 |

The secondary border is `#2563eb`: 4.72:1 against light `#f1f5f9` and 3.30:1 against dark `#111c2e`.

#### Input and Card pairs

| Element / state | Theme | Foreground or border / background | Ratio |
|-----------------|-------|-----------------------------------|-------|
| Input label text | Light | `#0f172a` / `#f1f5f9` | 16.30:1 |
| Input label text | Dark | `#e2e8f0` / `#111c2e` | 13.86:1 |
| Input hint text | Light | `#475569` / `#f1f5f9` | 6.92:1 |
| Input hint text | Dark | `#a7b3c5` / `#111c2e` | 8.05:1 |
| Input error text | Light | `#b91c1c` / `#f1f5f9` | 5.91:1 |
| Input error text | Dark | `#fca5a5` / `#111c2e` | 9.00:1 |
| Input normal border | Light | `#2563eb` / `#f1f5f9` | 4.72:1 |
| Input normal border | Dark | `#60a5fa` / `#111c2e` | 6.72:1 |
| Input error border | Light | `#b91c1c` / `#f1f5f9` | 5.91:1 |
| Input error border | Dark | `#fca5a5` / `#111c2e` | 9.00:1 |
| Card text | Light | `#0f172a` / `#f1f5f9` | 16.30:1 |
| Card text | Dark | `#e2e8f0` / `#111c2e` | 13.86:1 |
| Default/interactive Card border | Light | `#64748b` / `#f1f5f9` | 4.34:1 |
| Default/interactive Card border | Dark | `#64748b` / `#111c2e` | 3.59:1 |
| Featured Card border | Light | `#2563eb` / `#f1f5f9` | 4.72:1 |
| Featured Card border | Dark | `#2563eb` / `#111c2e` | 3.30:1 |

The dark input border uses important utilities because the existing dark-theme global input selector is more specific than regular Tailwind border utilities; this keeps the component's documented border/error colors effective without changing global CSS.

#### Badge text pairs

| Tone | Theme | Foreground / background | Ratio |
|------|-------|-------------------------|-------|
| Neutral | Light | `#0f172a` / `#e2e8f0` | 14.48:1 |
| Neutral | Dark | `#f1f5f9` / `#1e293b` | 13.35:1 |
| Brand | Light | `#1e3a8a` / `#dbeafe` | 8.49:1 |
| Brand | Dark | `#dbeafe` / `#0f172a` | 14.63:1 |
| Success | Light | `#ffffff` / `#15803d` | 5.02:1 |
| Success | Dark | `#052e16` / `#86efac` | 10.62:1 |
| Warning | Light | `#ffffff` / `#a16207` | 4.92:1 |
| Warning | Dark | `#422006` / `#fde68a` | 11.70:1 |
| Danger | Light | `#ffffff` / `#b91c1c` | 6.47:1 |
| Danger | Dark | `#450a0a` / `#fca5a5` | 8.51:1 |

#### Focus ring pairs

| Theme | Ring color | Offset surface | Ring / surface | Ring / page |
|-------|------------|----------------|----------------|-------------|
| Light | `#2563eb` | `#ffffff` | 5.17:1 | 4.94:1 against `#f8fafc` |
| Dark | `#60a5fa` | `#111c2e` | 6.72:1 | 7.36:1 against `#0b1220` |

The rendered ring is a visible 2px color outline with a 2px surface-colored offset, implemented by the existing `--shadow-focus-ring` token (`0 0 0 2px var(--surface-background), 0 0 0 4px var(--focus-ring)`).

### D) Focus, keyboard, and browser evidence

The five modules were dynamically rendered in the running Vite browser page and tested with keyboard input. A keyboard-focus screenshot was captured in the conversation; no screenshot file was added to the repository.

| Check | Result | Evidence |
|-------|--------|----------|
| Tab order | Pass | Tab reached each enabled Button, each Input, interactive Card button and link, and the FocusRing-wrapped button in DOM order. The disabled loading button and non-interactive Badge were correctly skipped. |
| Enter activation | Pass | Primary Button incremented its click count; interactive Card button activated; Card anchor changed the fragment to `#test`. |
| Space activation | Pass | Primary Button and interactive Card button each activated with Space; the Card click count reached 2 after Enter and Space. |
| Visible keyboard focus | Pass | `:focus-visible` matched every tested focusable primitive, with the 2px/2px-offset ring visible in computed styles and the captured screenshot. |
| Target and text sizes | Pass | Browser measurements: `sm`/`md` Buttons and `md` Inputs 44px; `lg` Button and Input 52px; all tested input, hint, and error text 16px; small Button text 16px. |
| Input error announcement | Pass | Error input had `aria-invalid="true"`, `aria-describedby` included hint/error IDs, and error content had `role="alert"`. |
| Loading state | Pass | Loading Button exposed `aria-busy="true"` and native `disabled`; its spinner was `aria-hidden`. |
| Escape | N/A — no primitive is dismissible | Escape is not a dismissal action for these controls; no dialog/popover was introduced. |
| Keyboard trap | Pass | After the last primitive, Tab moved to the site's skip link; focus was not trapped. |
| Horizontal overflow | Pass in measured state | With the pointer moved off hover controls, `documentElement.scrollWidth === clientWidth` at 320, 375, 414, 768, 1024, 1280, 1440, and 1920px. The rendered primitive fixture itself fit at 320px (right edge 296px; available client width 305px). |

### E) WCAG 2.2 criterion evidence

| # | Criterion | Result | Evidence |
|---|-----------|--------|----------|
| 1 | 1.3.1 Info and Relationships | Pass | Visible Input label uses `htmlFor`/`id`; hint and error IDs are associated by `aria-describedby`. |
| 2 | 1.4.3 Text Contrast | Pass for documented pairs | Section C lists enabled Button, Input, Card, and Badge pairs in both themes; each text pair is at least 4.5:1. |
| 3 | 1.4.4 Resize Text | Not evaluated | Browser zoom/text-resize testing was not part of this primitive check. |
| 4 | 1.4.10 Reflow | Pass in measured state | Scroll width equaled client width at the eight project viewport widths; the primitive fixture adapted at 320px. |
| 5 | 1.4.11 Non-text Contrast | Pass for tested boundaries | Input borders, Card borders, secondary-button border, and focus-ring pairs in Section C are at least 3:1. |
| 6 | 1.4.12 Text Spacing | Not evaluated | Text-spacing override/bookmarklet testing was not part of this primitive check. |
| 7 | 2.1.1 Keyboard | Pass | Tab, Enter, and Space tests exercised the native controls; the link used Enter as expected. |
| 8 | 2.1.2 No Keyboard Trap | Pass | Tab moved from the final primitive to the page skip link. |
| 9 | 2.4.1 Bypass Blocks | N/A — no bypass-block feature was added | Existing site skip-link behavior was not changed by these primitives. |
| 10 | 2.4.3 Focus Order | Pass for the fixture | Observed keyboard order followed the rendered DOM order and skipped disabled/non-interactive elements. |
| 11 | 2.4.7 Focus Visible | Pass | All tested focusable primitives matched `:focus-visible` and showed the focus-ring shadow. |
| 12 | 2.4.11 Focus Not Obscured | Not evaluated | Sticky overlays and whole-site scroll positions were outside this isolated primitive test. |
| 13 | 2.5.7 Dragging Movements | N/A — no dragging interaction was added | These primitives use click, text entry, and native keyboard activation only. |
| 14 | 2.5.8 Target Size Minimum | Pass for interactive controls | Measured Button heights were 44/44/52px; Input heights 44/52px; interactive Cards 58px. Badge is non-interactive. |
| 15 | 3.2.6 Consistent Help | N/A — no help/contact component was added | No help or contact UI is introduced by this task. |
| 16 | 3.3.1 Error Identification | Pass | Input error is visible text, has `aria-invalid`, and is not indicated by color alone. |
| 17 | 3.3.7 Redundant Entry | N/A — no multi-step data-entry flow was added | Input is a reusable single-field primitive; no repeated-entry flow is introduced. |
| 18 | 3.3.8 Accessible Authentication | N/A — no authentication flow was added | These UI primitives do not create an authentication step. |
| 19 | 4.1.2 Name, Role, Value | Pass for tested controls | Native button/link/input semantics were present; visible Input labels and button text were exposed in the browser accessibility snapshot. |
| 20 | 4.1.3 Status Messages | Pass for tested states | Input error used `role="alert"`; loading state exposed `aria-busy="true"`. |

### F) Rejected alternatives and implementation decisions

- Considered a 32px `sm` Button per the primitive-specific size suggestion; used a 44px minimum instead to preserve the project-wide touch-target rule. Compact padding remains.
- Considered reducing the `sm` Button, Input hint, or error font to 14px; retained 16px text to preserve the mobile body/input minimum.
- Considered adding a headless UI dependency; rejected it to keep these wrappers dependency-light and consistent with the existing Tailwind stack.
- Kept existing `ToolCard`, `ToolSearch`, and global CSS untouched; these are new primitives, not replacements.
- Used native button, anchor, and input elements rather than custom roles so browser keyboard behavior and semantics remain native.
- Kept disabled/loading controls visibly dimmed; the enabled-state contrast table does not claim that inactive controls meet enabled-text contrast targets.

### G) Full source

#### `src/components/ui/Button.jsx`

```jsx
import React from 'react';
import { LoaderCircle } from 'lucide-react';
import FocusRing from './FocusRing';

const VARIANT_CLASSES = {
  primary: 'bg-brand-700 text-white hover:bg-brand-800 dark:bg-brand-900 dark:text-surface-50 dark:hover:bg-brand-800',
  secondary: 'border border-brand-600 bg-surface-100 text-brand-700 hover:bg-brand-50 dark:bg-surface-100 dark:text-surface-fg dark:hover:bg-surface-200',
  ghost: 'bg-transparent text-brand-700 hover:bg-brand-50 dark:text-brand-700 dark:hover:bg-surface-100',
  danger: 'bg-danger text-danger-foreground hover:brightness-95 dark:hover:brightness-110',
};

const SIZE_CLASSES = {
  sm: 'min-h-11 gap-1.5 px-3 py-1 text-base',
  md: 'min-h-11 gap-2 px-4 py-2 text-base',
  lg: 'min-h-[52px] gap-2.5 px-5 py-3 text-lg',
};

const Button = React.forwardRef(function Button({
  variant = 'primary',
  size = 'md',
  loading = false,
  disabled = false,
  iconLeft,
  iconRight,
  as = 'button',
  children,
  className = '',
  onClick,
  type = 'button',
  ...rest
}, ref) {
  if (!Object.hasOwn(VARIANT_CLASSES, variant)) {
    throw new Error(`Unsupported Button variant: ${variant}`);
  }
  if (!Object.hasOwn(SIZE_CLASSES, size)) {
    throw new Error(`Unsupported Button size: ${size}`);
  }
  if (as !== 'button' && as !== 'a') {
    throw new Error('Button must render as a button or anchor.');
  }

  const Component = as;
  const isDisabled = disabled || loading;
  if (as === 'a' && !isDisabled && !rest.href) {
    throw new Error('An enabled Button rendered as an anchor requires an href.');
  }

  const classes = [
    'inline-flex min-w-[44px] items-center justify-center rounded-md font-semibold leading-5 transition-colors',
    'focus-visible:z-10',
    VARIANT_CLASSES[variant],
    SIZE_CLASSES[size],
    isDisabled ? 'cursor-not-allowed opacity-60' : 'cursor-pointer',
    className,
  ].filter(Boolean).join(' ');

  const handleClick = (event) => {
    if (isDisabled) {
      event.preventDefault();
      event.stopPropagation();
      return;
    }

    onClick?.(event);
  };

  const props = {
    ...rest,
    ref,
    className: classes,
    onClick: handleClick,
    'aria-busy': loading ? 'true' : rest['aria-busy'],
    'aria-disabled': as === 'a' && isDisabled ? true : rest['aria-disabled'],
  };

  if (as === 'button') {
    props.type = type;
    props.disabled = isDisabled;
  } else if (as === 'a' && isDisabled) {
    props.tabIndex = -1;
    props.href = undefined;
  }

  return (
    <FocusRing>
      <Component {...props}>
        {loading && (
          <LoaderCircle
            className="h-4 w-4 shrink-0 animate-spin motion-reduce:animate-none"
            aria-hidden="true"
          />
        )}
        {!loading && iconLeft && <span className="inline-flex shrink-0" aria-hidden="true">{iconLeft}</span>}
        {children}
        {!loading && iconRight && <span className="inline-flex shrink-0" aria-hidden="true">{iconRight}</span>}
      </Component>
    </FocusRing>
  );
});

export default Button;
```

#### `src/components/ui/Input.jsx`

```jsx
import React, { useId } from 'react';
import FocusRing from './FocusRing';

const SIZE_CLASSES = {
  md: 'min-h-11',
  lg: 'min-h-[52px]',
};

const Input = React.forwardRef(function Input({
  label,
  hint,
  error,
  size = 'md',
  id,
  className = '',
  'aria-describedby': describedBy,
  'aria-invalid': ariaInvalid,
  ...rest
}, ref) {
  if (label === undefined || label === null || label === '') {
    throw new Error('Input requires a visible label.');
  }
  if (!Object.hasOwn(SIZE_CLASSES, size)) {
    throw new Error(`Unsupported Input size: ${size}`);
  }

  const generatedId = useId();
  const inputId = id || `ui-input-${generatedId}`;
  const hintId = hint ? `${inputId}-hint` : undefined;
  const errorId = error ? `${inputId}-error` : undefined;
  const descriptionIds = [describedBy, hintId, errorId].filter(Boolean).join(' ') || undefined;
  const inputClasses = [
    'block w-full rounded-md border bg-surface-100 px-3 text-base leading-6 text-surface-fg',
    'placeholder:text-surface-fg-muted focus-visible:outline-none',
    'disabled:cursor-not-allowed disabled:opacity-60',
    SIZE_CLASSES[size],
    error ? '!border-danger' : '!border-brand-600 dark:!border-brand-700',
    className,
  ].filter(Boolean).join(' ');

  return (
    <div className="grid gap-1.5">
      <label htmlFor={inputId} className="text-base font-semibold leading-6 text-surface-fg">
        {label}
      </label>
      <FocusRing>
        <input
          {...rest}
          ref={ref}
          id={inputId}
          className={inputClasses}
          aria-invalid={error ? true : ariaInvalid}
          aria-describedby={descriptionIds}
        />
      </FocusRing>
      {hint && <p id={hintId} className="text-base leading-6 text-surface-fg-secondary">{hint}</p>}
      {error && (
        <p id={errorId} role="alert" className="text-base font-medium leading-6 text-danger">
          {error}
        </p>
      )}
    </div>
  );
});

export default Input;
```

#### `src/components/ui/Card.jsx`

```jsx
import React from 'react';
import FocusRing from './FocusRing';

const VARIANT_CLASSES = {
  default: 'border border-surface-500 bg-surface-100 shadow-card',
  featured: 'border border-brand-600 bg-surface-100 shadow-card',
  interactive: 'border border-surface-500 bg-surface-100 shadow-card transition-shadow hover:shadow-cardHover',
};

const Card = ({ variant = 'default', as, children, className = '', ...rest }) => {
  if (!Object.hasOwn(VARIANT_CLASSES, variant)) {
    throw new Error(`Unsupported Card variant: ${variant}`);
  }

  const isInteractive = variant === 'interactive';
  const Component = as || (isInteractive ? 'button' : 'div');

  if (isInteractive && Component !== 'button' && Component !== 'a') {
    throw new Error('Interactive Card must render as a button or anchor.');
  }
  if (isInteractive && Component === 'a' && !rest.href) {
    throw new Error('Interactive Card rendered as an anchor requires an href.');
  }

  const props = {
    ...rest,
    className: [
      'block rounded-lg p-4 text-left text-surface-fg',
      VARIANT_CLASSES[variant],
      isInteractive ? 'cursor-pointer' : '',
      className,
    ].filter(Boolean).join(' '),
  };

  if (isInteractive && Component === 'button') {
    props.type = rest.type || 'button';
  }

  const card = <Component {...props}>{children}</Component>;
  return isInteractive ? <FocusRing>{card}</FocusRing> : card;
};

export default Card;
```

#### `src/components/ui/Badge.jsx`

```jsx
import React from 'react';

const TONE_CLASSES = {
  neutral: 'bg-surface-200 text-surface-900 dark:bg-surface-200 dark:text-surface-900',
  brand: 'bg-brand-100 text-brand-900 dark:bg-brand-100 dark:text-brand-900',
  success: 'bg-success text-success-foreground',
  warning: 'bg-warning text-warning-foreground',
  danger: 'bg-danger text-danger-foreground',
};

const SIZE_CLASSES = {
  sm: 'min-h-6 px-2 text-xs',
  md: 'min-h-7 px-2.5 text-sm',
};

const Badge = ({ tone = 'neutral', size = 'sm', children, className = '', ...rest }) => {
  if (!Object.hasOwn(TONE_CLASSES, tone)) {
    throw new Error(`Unsupported Badge tone: ${tone}`);
  }
  if (!Object.hasOwn(SIZE_CLASSES, size)) {
    throw new Error(`Unsupported Badge size: ${size}`);
  }

  return (
    <span
      {...rest}
      className={[
        'inline-flex w-fit items-center justify-center rounded-full font-semibold leading-5',
        TONE_CLASSES[tone],
        SIZE_CLASSES[size],
        className,
      ].filter(Boolean).join(' ')}
    >
      {children}
    </span>
  );
};

export default Badge;
```

#### `src/components/ui/FocusRing.jsx`

```jsx
import React from 'react';

const FocusRing = ({ children, focusableOnly = true, className = '' }) => {
  const child = React.Children.only(children);

  if (!React.isValidElement(child)) {
    throw new Error('FocusRing requires one focusable React element.');
  }

  const focusClass = focusableOnly
    ? 'focus-visible:outline-none focus-visible:shadow-focusRing'
    : 'focus:outline-none focus:shadow-focusRing';
  const childClassName = [child.props.className, focusClass, className]
    .filter(Boolean)
    .join(' ');

  return React.cloneElement(child, { className: childClassName });
};

export default FocusRing;
```

### H) Self-verification

- [x] All five requested files exist, and all props/variants/defaults are listed above.
- [x] Enabled text pairs meet 4.5:1; input/card/secondary borders and focus rings meet 3:1 in both themes.
- [x] All Button sizes meet the 44px project target (`sm` is intentionally 44px); Input sizes measured 44px/52px.
- [x] Input, hint, and error text measured 16px; loading state, accessible input error, and disabled behavior were checked in the browser.
- [x] Keyboard screenshot captured; Tab, Enter, Space, focus visibility, link activation, and no-trap behavior were tested.
- [x] Escape dismissal is N/A because no primitive is dismissible.
- [x] `npm.cmd test` passed 352/352 before and after the changes; post-change duration 1,880.0454ms, zero failures, skipped, or warnings.
- [x] `npm.cmd run build` passed; existing `buffer` externalization and >500 kB chunk warnings remain.
- [x] `git diff --check` passed; no existing component or `.github/` file was changed for Task 2.2.
- [x] The full application was not redesigned or modified; the viewport test checked that the rendered fixture itself fits from 320px upward.

## Task 2.3 — Typography & Spacing

### A) Read evidence and scope

- Read `docs/status.md`, `docs/PROJECT-TRACKER.md`, `docs/inventory.md`, and Task 2.1 in this file before auditing.
- Read `src/index.css`, `src/App.jsx`, `src/components/Home.jsx`, `src/components/ToolPage.jsx`, and `src/components/SitePages.jsx` as requested.
- Read `src/components/CategoryPage.jsx`, `src/components/Footer.jsx`, and `src/components/FaqAccordion.jsx` to verify shared page headings and supporting copy styles.
- No source file was changed. No `.github/` file was modified; this task follows `docs/status.md` as the requested status source.

### B) Type scale and intended use

The configured token scale provides a predictable set of roles for the redesign. These are intended mappings, not claims that current pages already use the scale consistently. Body copy must be at least 16px on mobile; smaller sizes are reserved for captions or compact control metadata, not paragraphs or instructions.

| Token | Size / line-height | Intended use |
|---|---:|---|
| `text-2xs` | 11px / 16px | Dense, nonessential micro-labels only |
| `text-xs` | 12px / 16px | Captions and eyebrow labels |
| `text-sm` | 14px / 20px | Compact control metadata; not body copy |
| `text-base` | 16px / 24px | Body paragraphs, instructions, and form help |
| `text-lg` | 18px / 28px | Lead text and small subsection headings |
| `text-xl` | 20px / 28px | Subsection headings |
| `text-2xl` | 24px / 32px | Section headings |
| `text-3xl` | 30px / 36px | Informational page titles |
| `text-4xl` | 36px / 40px | Tool-page titles |
| `text-5xl` | 48px / 48px | Large category or feature headings |
| `text-6xl` | 60px / 60px | Homepage hero title |
| `text-7xl` | 72px / 72px | Display heading where the layout has room |

### C) Body-copy violations and proposed alignment

The project rule is at least 16px for body text on mobile. The rows below identify paragraph, instructional, and content-description text below that floor; captions and compact control/navigation labels are called out separately rather than treated as body copy.

| File | Line | Current | Proposed | Reason |
|---|---:|---|---|---|
| `src/components/ToolPage.jsx` | 614, 623, 632 | `text-sm` = 14px | 16px (`text-base`) | The three workflow steps are explanatory content. |
| `src/components/ToolPage.jsx` | 635 | `text-sm` = 14px | 16px (`text-base`) | Browser-processing/privacy explanation is body copy. |
| `src/index.css` | 930 | 0.875rem = 14px | 16px | FAQ answer paragraphs are body copy. |
| `src/index.css` | 4046 | 0.875rem = 14px | 16px | Resource-card descriptions are content summaries. |
| `src/components/SitePages.jsx` | 205 | Uses `.resource-card-description` (14px) | 16px | This is the resource-card description rendered on the resources page. |
| `src/index.css` | 4345 | 0.9rem = 14.4px | 16px | Tool attachment rule text is user-facing instruction. |
| `src/index.css` | 6186 | 0.82rem = 13.12px at the mobile rule | 16px | Mobile override further reduces the attachment rule text. |
| `src/index.css` | 4369 | 0.875rem = 14px | 16px | Tool attachment guidance paragraph is explanatory copy. |
| `src/index.css` | 1186 | 0.95rem = 15.2px | 16px | Category tool-count supporting text is below the body floor. |
| `src/components/Footer.jsx` | 13 | `text-sm` = 14px | 16px | Copyright/support text is small, but remains readable page text. |

The homepage hero description was 16px at the measured mobile-equivalent viewport. The homepage eyebrow (12.8px), category eyebrow, CTA text, the FAQ page's 14px link row (`SitePages.jsx:118`), and small control metadata are labels or navigation rather than body paragraphs; they should use appropriate caption/control tokens and are not counted as body-copy violations here.

### D) Desktop line-length audit

At a 1280px viewport, rendered body paragraphs were checked against the project limit of 80 characters per line. The measured values are the longest rendered line in each sampled paragraph.

| Page/template | Source | Longest line | Result | Proposed redesign action |
|---|---|---:|---|---|
| Homepage hero description | `src/components/Home.jsx:75` | 51 characters | Within limit | Preserve a readable measure. |
| Category description | `src/components/CategoryPage.jsx:42` | 101 characters | Exceeds | Constrain the prose column to about 65–75ch. |
| Privacy page content | `src/components/SitePages.jsx:102` | 123 characters | Exceeds | Constrain paragraph measure independently of the card width. |
| Resources-page introduction | `src/components/SitePages.jsx:77` | 87 characters | Exceeds | Narrow the intro measure to about 65–75ch. |
| Resource-article introduction | `src/components/SitePages.jsx:77` | 118 characters | Exceeds | Narrow the intro measure to about 65–75ch. |
| Tool-guide introduction | `src/components/SitePages.jsx:250` (rendered by shared `PageLayout` at `:77`) | 121 characters | Exceeds | Constrain the prose measure to about 65–75ch. |
| Contact-page content | `src/components/SitePages.jsx:102` | 119 characters | Exceeds | Constrain paragraph measure independently of the card width. |
| Merge-tool attachment guidance | `src/index.css:4369` | 83 characters | Exceeds | Keep guidance copy to a readable measure. |

These are rendered observations from the English desktop preview, not estimates from source string length. The 80-character threshold is a project design rule; the future fix is a text-column measure, not a smaller font.

### E) Heading hierarchy audit

Source inspection covered the route templates; browser sampling confirmed the rendered count on nine representative routes. Every sampled page had exactly one `h1`.

| Template/file | `h1` count | Hierarchy evidence |
|---|---:|---|
| `src/components/Home.jsx` | 1 | Homepage title `h1`, followed by the toolbox `h2` and category `h3` headings. |
| `src/components/ToolPage.jsx` | 1 | Tool title `h1`; workspace and page sections use `h2`, with attachment and content subsections below them. |
| `src/components/SitePages.jsx` | 1 | Shared `PageLayout` title is `h1`; information, resource, and guide sections use `h2`. FAQ navigation is a paragraph, not a second heading. |
| `src/components/CategoryPage.jsx` | 1 | Category title `h1`, followed by the tools section `h2`. |
| `src/App.jsx` error fallback | 1 | The route-load error title is a single `h1` inside the main landmark. |

The nine rendered samples included the home, merge tool, FAQ, privacy, resources, resource article, tool guide, contact, and about page. No heading-count or heading-order violation was found in those templates.

### F) Spacing rhythm audit

Current homepage section stack and actual spacing at the existing Tailwind scale:

```text
Hero
  ↓ 64px = 4xl (outer `space-y-16`)
Category navigation
  ↓ 64px = 4xl (outer `space-y-16`)
Toolbox heading
  ↓ 32px = 2xl (`mb-8`)
Category group
  ↓ 28px = off-token (`space-y-7`)
Next category group
  ↑ 28px = off-token (`pt-7`; first group resets this to 0)
Category heading → tool cards: 16px (`mb-4`)
Tool cards within the grid: 12px = md (`gap-3`)
```

The outer 64px, 32px, 16px, and 12px values align to the named scale. The 28px category-stack gap and padding do not; normalize those to named tokens during the redesign after the intended density is selected. Other sampled shared page stacks use 32px (`space-y-8`, 2xl) and 24px (`space-y-6`, xl), both on-token.

### G) 200% zoom and text-spacing evidence

| Check | Result | Evidence |
|---|---|---|
| Homepage at 200% zoom | Pass in emulated layout | Native browser zoom controls were unavailable to this browser automation. A 640×450 CSS viewport was used as the equivalent reflow width for a 1280×900 viewport at 200%. The captured initial viewport showed no clipped text and remained vertically scrollable; `documentElement.scrollWidth` and `clientWidth` were both 625px. This is explicitly an emulation, not a claim that native browser zoom was set. |
| WCAG 1.4.12 text spacing | Pass for tested homepage sample | Applied `line-height: 1.5`, paragraph bottom spacing `2em`, letter spacing `0.12em`, and word spacing `0.16em` to the page. The hero paragraph remained 16px with 24px line-height; its 279×120px client box matched its scroll box. The CTA label fit its 223px client/scroll width. Document width remained 625/625px. A screenshot was captured with the overrides active. |

Both screenshots were captured in the browser session as visual evidence; they were not added as repository files because the task's file scope is documentation-only.

### H) Rejected alternatives

- Considered raising every small font globally; rejected because it would also enlarge captions and control metadata, rather than precisely addressing the content paragraphs found below 16px.
- Considered changing component classes while auditing; rejected because this task is a baseline audit and component edits are explicitly out of scope.
- Considered shrinking wide paragraphs to satisfy the 80-character line rule; rejected because the proper fix is to constrain text measure, preserving the 16px body-size floor.
- Considered switching all headings to fluid `clamp()` sizing; rejected for this audit because discrete token roles are easier to compare consistently across current page templates. Responsive heading sizing can be reconsidered during the redesign.

### I) Self-verification

- [x] Home, tool, shared site-page, category, and route-error templates were audited for one `h1` and hierarchy.
- [x] Body text below 16px is logged with source, current size, and proposed size; captions and control/navigation labels are distinguished.
- [x] 200%-equivalent homepage screenshot captured; viewport emulation is disclosed.
- [x] Text-spacing override screenshot captured, and one 16px paragraph was checked for clipping.
- [x] No component or CSS source file was modified.
- [x] `npm.cmd test` passed 352/352 before (1,702.5382ms) and after (1,685.2089ms) the audit; no failures, skipped tests, or warnings were reported.
- [x] `docs/status.md` and `docs/PROJECT-TRACKER.md` record the audit status and findings.

## Task 2.4 — Dark Mode

### A) Read evidence and scope

- Read `docs/status.md` and `docs/PROJECT-TRACKER.md` before the audit.
- Read Task 2.1's light/dark token values and all 17 foreground/background pairs in Section C above.
- Inspected `src/App.jsx`, the dark token and page rules in `src/index.css`, `tailwind.config.js`, and `index.html`'s pre-render theme initializer.
- Audited the homepage, Merge PDF tool page, and Privacy page in a local browser with persisted dark theme.
- The only source change is the approved theme-toggle accessibility fix in `src/App.jsx`. No CSS token needed changing because the documented dark pairs pass and sampled page surfaces/text computed to dark-theme colors.

### B) Dark contrast evidence

Ratios were recalculated from the documented light/dark sRGB values using WCAG relative luminance, rounded to two decimals. Text and status pairs use the 4.5:1 threshold; interactive borders, focus indicators, and icon boundaries use 3:1. Every row passes its applicable threshold in both themes.

| Pair | Light ratio | Dark ratio | Pass/fail |
|---|---:|---:|---|
| `surface-fg` / page background | 17.06:1 | 15.19:1 | Pass (≥4.5:1) |
| `surface-fg` / card background | 17.85:1 | 13.86:1 | Pass (≥4.5:1) |
| `surface-fg-secondary` / page background | 7.24:1 | 8.82:1 | Pass (≥4.5:1) |
| `surface-fg-secondary` / card background | 7.58:1 | 8.05:1 | Pass (≥4.5:1) |
| `surface-fg-muted` / page background | 4.55:1 | 7.30:1 | Pass (≥4.5:1) |
| `surface-fg-muted` / card background | 4.76:1 | 6.66:1 | Pass (≥4.5:1) |
| `brand-700` / white or page background | 6.70:1 | 7.36:1 | Pass (≥4.5:1) |
| `brand-700` / page or card background | 6.41:1 | 6.72:1 | Pass (≥4.5:1) |
| `brand-600` border / white or page background | 5.17:1 | 3.62:1 | Pass (≥3:1) |
| `brand-600` border / page or card background | 4.94:1 | 3.30:1 | Pass (≥3:1) |
| Focus ring / white or page background | 5.17:1 | 7.36:1 | Pass (≥3:1) |
| Focus ring / page or card background | 4.94:1 | 6.72:1 | Pass (≥3:1) |
| Success foreground / status background | 5.02:1 | 10.62:1 | Pass (≥4.5:1) |
| Warning foreground / status background | 4.92:1 | 11.70:1 | Pass (≥4.5:1) |
| Danger foreground / status background | 6.47:1 | 8.51:1 | Pass (≥4.5:1) |
| Info foreground / status background | 5.93:1 | 8.32:1 | Pass (≥4.5:1) |
| Tool-icon foreground / background | 6.16:1 | 8.10:1 | Pass (≥3:1) |

### C) Dark page audit and hardcoded-colour log

The three requested routes rendered with `data-theme="dark"` and the dark preference stored. The audited DOM had one page `h1` per route and no horizontal overflow in the 640px browser viewport (`scrollWidth === clientWidth === 625px`). The sampled computed colors were consistent with the dark variables: homepage hero category chips use `#1e293b` with white text; Merge PDF cards use `#111c2e` with `#e2e8f0` text, upload area `#172033`; Privacy cards use `#111c2e`, primary text `#e2e8f0`, and secondary text `#a7b3c5`. No light white background or dark foreground text was found in the sampled main content after loading the saved dark preference.

| File and lines | Static light-colour candidate | Dark-mode handling / browser result | Verdict |
|---|---|---|---|
| `src/components/Home.jsx:193-205` | `text-slate-800` / `text-slate-500` utilities; no inline `dark:` variants | `index.css:3802-3818` maps slate text utilities to dark foreground colors; measured category heading text was `#e2e8f0`. | No visible failure; relies on shared global mapping. |
| `src/components/ToolPage.jsx:598-635` | `bg-white`, `bg-slate-50`, and slate text classes; no inline `dark:` variants | `index.css:3610`, `3757`, `3802-3818`, `7108-7114`, and `8776-8783` remap surfaces, text, and upload zones. Browser measured card `#111c2e`, copy `#a7b3c5`, upload zone `#172033`. | No visible failure; relies on shared global mapping. |
| `src/components/SitePages.jsx:77-281` | `text-slate-*`, `bg-white`, `text-white`, and blue action utilities; no inline `dark:` variants | `index.css:3610`, `3802-3828` remap surface/text utilities; Privacy rendered cards at `#111c2e`, primary text `#e2e8f0`, secondary `#a7b3c5`. `bg-blue-600` remains a blue action background with white text. | No visible failure in Privacy; relies on shared global mapping. |
| `src/index.css:1276, 1553` | Homepage eyebrow/chip base rules use white translucent backgrounds and light-theme text/borders. | Dark variants at `index.css:1888-1892` and `1955-1960` replace those colors. Browser chip measured `#1e293b` / `#ffffff`. | No visible failure; explicit dark overrides exist. |

The JSX utility candidates are not unoverridden dark surfaces: `index.css` contains shared dark selectors for them and all three sampled pages rendered with dark foregrounds and surfaces. They remain a maintainability coupling, so prefer semantic tokens or local dark variants when those components are next redesigned; no out-of-scope component edits were made here.

### D) Theme-toggle accessibility audit

| Check | Result | Evidence |
|---|---|---|
| Native control and state | Pass after fix | The control is a native `<button>` with stable accessible name “Dark mode” and `aria-pressed` reflecting the theme. Browser inspection observed `true` in dark mode and `false` after switching to light. |
| State announcement | Programmatic state available; no screen-reader speech test | The pressed state changes on activation, allowing assistive technology to expose the toggle state. The visible action text still changes to the next mode. A live-region announcement was not added and a screen reader was not available for a spoken-output test. |
| First load / system preference | Pass | In a browser context emulating `prefers-color-scheme: dark`, with the saved theme removed, the `index.html` early initializer and React theme state both resolved to `dark`. |
| Persistence | Pass | Activating the control changed the root theme to `light`, stored `pdf-tools-theme=light`, and updated `aria-pressed` to `false`; an explicit stored preference takes precedence over system preference. |

Minimal fix applied in `src/App.jsx`: give the toggle a stable accessible name (`translate('darkMode')`) and add `aria-pressed={theme === 'dark'}`. A stable name is important for a pressed-state toggle; the title and visible text continue to describe the next available mode.

### E) SVG and icon inversion log

No `.svg` asset files were found, and a source search found no SVG with `fill="black"`, `fill="#000"`, or another literal black fill. The inline SVG fill uses in `src/components/EditPdf.jsx` are:

| File and lines | Fill | Purpose / dark-mode assessment |
|---|---|---|
| `src/components/EditPdf.jsx:131,167` | `item.color` | User-selected PDF text/highlight artwork, not a site icon. |
| `src/components/EditPdf.jsx:155,187,206` | `none` | Transparent shapes/selection outlines. |
| `src/components/EditPdf.jsx:1307` | `#7c3aed` | Keyboard-position marker with a white stroke. |
| `src/components/EditPdf.jsx:1310` | `#2563eb` | Text-position marker with a white stroke. |

None is a black-filled SVG icon requiring inversion. Lucide icons are stroke-based and use the surrounding `currentColor` styling.

### F) Rejected alternatives

- Considered changing dark palette values; rejected because all 17 documented foreground/background pairs pass their relevant WCAG thresholds.
- Considered replacing each light-mode utility class with component-specific dark variants; rejected for this task because existing global dark selectors remap them and the three sampled pages show no visible light-only surface/text failure.
- Considered adding a live region for the theme toggle; rejected as redundant once the native button exposes a stable name and changing `aria-pressed` state. Spoken screen-reader output remains unverified.
- Considered a custom `role="switch"`; rejected because the native button with pressed state provides keyboard behavior and the required state semantics without custom role handling.

### G) Self-verification

- [x] All 17 documented Task 2.1 foreground/background pairs have light and dark ratios recorded; every pair passes its applicable threshold.
- [x] Homepage, Merge PDF, and Privacy were rendered in dark mode; static candidates and their global dark overrides are logged with file and line references.
- [x] Toggle checked for native button, state semantics, first-load system preference, and persistence; `aria-pressed` fix is browser-verified.
- [x] SVG search found no black-filled icon; all inline SVG fill uses are listed above.
- [x] Only the approved `src/App.jsx` toggle change was made; `src/index.css` tokens were not changed because contrast and page checks passed.
- [x] `npm.cmd test` passed before the change: 352/352 in 1,209.713ms; after the change: 352/352 in 1,381.115ms, 0 failures/cancelled/skipped/todo.
- [x] `npm.cmd run build` passed; existing `buffer` externalization and >500 kB chunk warnings remain.
- [x] `docs/status.md` and `docs/PROJECT-TRACKER.md` updated for Task 2.4.

## Task 2.5 — Design System Summary

### A) Canonical visual spec

This is the visual rulebook for homepage Variants 1–3. Color swatches show the literal light and dark values (`[light]` / `[dark]`); the complete contrast calculations remain in Task 2.1, Section C. Use the paired foreground/background recipes there rather than treating every palette shade as text-safe.

#### Color palette

| Token | Light chip / value | Dark chip / value | Intended role |
|---|---|---|---|
| `brand-50` | <span style="display:inline-block;width:1em;height:1em;background:#eff6ff;border:1px solid #94a3b8"></span> `#eff6ff` | <span style="display:inline-block;width:1em;height:1em;background:#0b1220;border:1px solid #94a3b8"></span> `#0b1220` | Brand tint / dark base |
| `brand-100` | <span style="display:inline-block;width:1em;height:1em;background:#dbeafe;border:1px solid #94a3b8"></span> `#dbeafe` | <span style="display:inline-block;width:1em;height:1em;background:#0f172a;border:1px solid #94a3b8"></span> `#0f172a` | Subtle brand surface |
| `brand-200` | <span style="display:inline-block;width:1em;height:1em;background:#bfdbfe;border:1px solid #94a3b8"></span> `#bfdbfe` | <span style="display:inline-block;width:1em;height:1em;background:#172554;border:1px solid #94a3b8"></span> `#172554` | Brand tint |
| `brand-300` | <span style="display:inline-block;width:1em;height:1em;background:#93c5fd;border:1px solid #94a3b8"></span> `#93c5fd` | <span style="display:inline-block;width:1em;height:1em;background:#1e3a8a;border:1px solid #94a3b8"></span> `#1e3a8a` | Brand tint |
| `brand-400` | <span style="display:inline-block;width:1em;height:1em;background:#60a5fa;border:1px solid #94a3b8"></span> `#60a5fa` | <span style="display:inline-block;width:1em;height:1em;background:#1e40af;border:1px solid #94a3b8"></span> `#1e40af` | Brand accent |
| `brand-500` | <span style="display:inline-block;width:1em;height:1em;background:#3b82f6;border:1px solid #94a3b8"></span> `#3b82f6` | <span style="display:inline-block;width:1em;height:1em;background:#1d4ed8;border:1px solid #94a3b8"></span> `#1d4ed8` | Brand accent |
| `brand-600` | <span style="display:inline-block;width:1em;height:1em;background:#2563eb;border:1px solid #94a3b8"></span> `#2563eb` | <span style="display:inline-block;width:1em;height:1em;background:#2563eb;border:1px solid #94a3b8"></span> `#2563eb` | Interactive borders |
| `brand-700` | <span style="display:inline-block;width:1em;height:1em;background:#1d4ed8;border:1px solid #94a3b8"></span> `#1d4ed8` | <span style="display:inline-block;width:1em;height:1em;background:#60a5fa;border:1px solid #94a3b8"></span> `#60a5fa` | Brand text / links |
| `brand-800` | <span style="display:inline-block;width:1em;height:1em;background:#1e40af;border:1px solid #94a3b8"></span> `#1e40af` | <span style="display:inline-block;width:1em;height:1em;background:#93c5fd;border:1px solid #94a3b8"></span> `#93c5fd` | Deep/light brand accent |
| `brand-900` | <span style="display:inline-block;width:1em;height:1em;background:#1e3a8a;border:1px solid #94a3b8"></span> `#1e3a8a` | <span style="display:inline-block;width:1em;height:1em;background:#dbeafe;border:1px solid #94a3b8"></span> `#dbeafe` | Strong light / pale dark accent |
| `surface-50` | <span style="display:inline-block;width:1em;height:1em;background:#f8fafc;border:1px solid #94a3b8"></span> `#f8fafc` | <span style="display:inline-block;width:1em;height:1em;background:#0b1220;border:1px solid #94a3b8"></span> `#0b1220` | Page background |
| `surface-100` | <span style="display:inline-block;width:1em;height:1em;background:#f1f5f9;border:1px solid #94a3b8"></span> `#f1f5f9` | <span style="display:inline-block;width:1em;height:1em;background:#111c2e;border:1px solid #94a3b8"></span> `#111c2e` | Muted/card surface |
| `surface-200` | <span style="display:inline-block;width:1em;height:1em;background:#e2e8f0;border:1px solid #94a3b8"></span> `#e2e8f0` | <span style="display:inline-block;width:1em;height:1em;background:#1e293b;border:1px solid #94a3b8"></span> `#1e293b` | Subtle divider |
| `surface-300` | <span style="display:inline-block;width:1em;height:1em;background:#cbd5e1;border:1px solid #94a3b8"></span> `#cbd5e1` | <span style="display:inline-block;width:1em;height:1em;background:#334155;border:1px solid #94a3b8"></span> `#334155` | Strong divider |
| `surface-400` | <span style="display:inline-block;width:1em;height:1em;background:#94a3b8;border:1px solid #64748b"></span> `#94a3b8` | <span style="display:inline-block;width:1em;height:1em;background:#475569;border:1px solid #94a3b8"></span> `#475569` | Neutral ramp |
| `surface-500` | <span style="display:inline-block;width:1em;height:1em;background:#64748b;border:1px solid #94a3b8"></span> `#64748b` | <span style="display:inline-block;width:1em;height:1em;background:#64748b;border:1px solid #94a3b8"></span> `#64748b` | Neutral ramp; not dark muted text |
| `surface-600` | <span style="display:inline-block;width:1em;height:1em;background:#475569;border:1px solid #94a3b8"></span> `#475569` | <span style="display:inline-block;width:1em;height:1em;background:#94a3b8;border:1px solid #64748b"></span> `#94a3b8` | Neutral ramp |
| `surface-700` | <span style="display:inline-block;width:1em;height:1em;background:#334155;border:1px solid #94a3b8"></span> `#334155` | <span style="display:inline-block;width:1em;height:1em;background:#cbd5e1;border:1px solid #94a3b8"></span> `#cbd5e1` | Neutral ramp |
| `surface-800` | <span style="display:inline-block;width:1em;height:1em;background:#1e293b;border:1px solid #94a3b8"></span> `#1e293b` | <span style="display:inline-block;width:1em;height:1em;background:#e2e8f0;border:1px solid #94a3b8"></span> `#e2e8f0` | Neutral ramp |
| `surface-900` | <span style="display:inline-block;width:1em;height:1em;background:#0f172a;border:1px solid #94a3b8"></span> `#0f172a` | <span style="display:inline-block;width:1em;height:1em;background:#f1f5f9;border:1px solid #94a3b8"></span> `#f1f5f9` | Neutral ramp |
| `surface-950` | <span style="display:inline-block;width:1em;height:1em;background:#020617;border:1px solid #94a3b8"></span> `#020617` | <span style="display:inline-block;width:1em;height:1em;background:#f8fafc;border:1px solid #94a3b8"></span> `#f8fafc` | Highest-contrast neutral |
| `surface-fg` | <span style="display:inline-block;width:1em;height:1em;background:#0f172a;border:1px solid #94a3b8"></span> `#0f172a` | <span style="display:inline-block;width:1em;height:1em;background:#e2e8f0;border:1px solid #94a3b8"></span> `#e2e8f0` | Primary text |
| `surface-fg-secondary` | <span style="display:inline-block;width:1em;height:1em;background:#475569;border:1px solid #94a3b8"></span> `#475569` | <span style="display:inline-block;width:1em;height:1em;background:#a7b3c5;border:1px solid #64748b"></span> `#a7b3c5` | Secondary text |
| `surface-fg-muted` | <span style="display:inline-block;width:1em;height:1em;background:#64748b;border:1px solid #94a3b8"></span> `#64748b` | <span style="display:inline-block;width:1em;height:1em;background:#94a3b8;border:1px solid #64748b"></span> `#94a3b8` | Muted text; retains ≥4.5:1 |
| `--surface-background` | <span style="display:inline-block;width:1em;height:1em;background:#ffffff;border:1px solid #94a3b8"></span> `#ffffff` | <span style="display:inline-block;width:1em;height:1em;background:#111c2e;border:1px solid #94a3b8"></span> `#111c2e` | Raised card/surface background |
| `--text-primary` (legacy alias) | <span style="display:inline-block;width:1em;height:1em;background:#0f172a;border:1px solid #94a3b8"></span> `#0f172a` | <span style="display:inline-block;width:1em;height:1em;background:#e2e8f0;border:1px solid #94a3b8"></span> `#e2e8f0` | Alias of `surface-fg` |
| `--text-secondary` (legacy alias) | <span style="display:inline-block;width:1em;height:1em;background:#475569;border:1px solid #94a3b8"></span> `#475569` | <span style="display:inline-block;width:1em;height:1em;background:#a7b3c5;border:1px solid #64748b"></span> `#a7b3c5` | Alias of `surface-fg-secondary` |
| `--border-color` | <span style="display:inline-block;width:1em;height:1em;background:#e2e8f0;border:1px solid #94a3b8"></span> `#e2e8f0` | <span style="display:inline-block;width:1em;height:1em;background:#334155;border:1px solid #94a3b8"></span> `#334155` | Subtle divider; not an interactive boundary |
| `success` / foreground | <span style="display:inline-block;width:1em;height:1em;background:#15803d;border:1px solid #94a3b8"></span> `#15803d` / <span style="display:inline-block;width:1em;height:1em;background:#ffffff;border:1px solid #94a3b8"></span> `#fff` | <span style="display:inline-block;width:1em;height:1em;background:#86efac;border:1px solid #94a3b8"></span> `#86efac` / <span style="display:inline-block;width:1em;height:1em;background:#052e16;border:1px solid #94a3b8"></span> `#052e16` | Success status |
| `warning` / foreground | <span style="display:inline-block;width:1em;height:1em;background:#a16207;border:1px solid #94a3b8"></span> `#a16207` / <span style="display:inline-block;width:1em;height:1em;background:#ffffff;border:1px solid #94a3b8"></span> `#fff` | <span style="display:inline-block;width:1em;height:1em;background:#fde68a;border:1px solid #94a3b8"></span> `#fde68a` / <span style="display:inline-block;width:1em;height:1em;background:#422006;border:1px solid #94a3b8"></span> `#422006` | Warning status |
| `danger` / foreground | <span style="display:inline-block;width:1em;height:1em;background:#b91c1c;border:1px solid #94a3b8"></span> `#b91c1c` / <span style="display:inline-block;width:1em;height:1em;background:#ffffff;border:1px solid #94a3b8"></span> `#fff` | <span style="display:inline-block;width:1em;height:1em;background:#fca5a5;border:1px solid #94a3b8"></span> `#fca5a5` / <span style="display:inline-block;width:1em;height:1em;background:#450a0a;border:1px solid #94a3b8"></span> `#450a0a` | Error/destructive status |
| `info` / foreground | <span style="display:inline-block;width:1em;height:1em;background:#0369a1;border:1px solid #94a3b8"></span> `#0369a1` / <span style="display:inline-block;width:1em;height:1em;background:#ffffff;border:1px solid #94a3b8"></span> `#fff` | <span style="display:inline-block;width:1em;height:1em;background:#7dd3fc;border:1px solid #94a3b8"></span> `#7dd3fc` / <span style="display:inline-block;width:1em;height:1em;background:#082f49;border:1px solid #94a3b8"></span> `#082f49` | Informational status |
| `--page-background` | <span style="display:inline-block;width:1em;height:1em;background:#f8fafc;border:1px solid #94a3b8"></span> `#f8fafc` | <span style="display:inline-block;width:1em;height:1em;background:#0b1220;border:1px solid #94a3b8"></span> `#0b1220` | App canvas |
| `--surface-muted` | <span style="display:inline-block;width:1em;height:1em;background:#f1f5f9;border:1px solid #94a3b8"></span> `#f1f5f9` | <span style="display:inline-block;width:1em;height:1em;background:#1e293b;border:1px solid #94a3b8"></span> `#1e293b` | Quiet nested surface (`surface-100` / `surface-200`) |
| Tool icon background / foreground | <span style="display:inline-block;width:1em;height:1em;background:#eff6ff;border:1px solid #94a3b8"></span> `#eff6ff` / <span style="display:inline-block;width:1em;height:1em;background:#1d4ed8;border:1px solid #94a3b8"></span> `#1d4ed8` | <span style="display:inline-block;width:1em;height:1em;background:#1e3a5f;border:1px solid #94a3b8"></span> `#1e3a5f` / <span style="display:inline-block;width:1em;height:1em;background:#bfdbfe;border:1px solid #94a3b8"></span> `#bfdbfe` | Paired icon tile |
| `--focus-ring` | <span style="display:inline-block;width:1em;height:1em;background:#2563eb;border:1px solid #94a3b8"></span> `#2563eb` | <span style="display:inline-block;width:1em;height:1em;background:#60a5fa;border:1px solid #94a3b8"></span> `#60a5fa` | Keyboard focus indicator |

Use the four accent foreground/background pairs and their contrast evidence from Task 2.1; do not switch foreground and background roles.

#### Type scale

| Token | Size / line-height | Named use |
|---|---|---|
| `2xs` | 11px / 16px | Dense, nonessential micro-metadata only |
| `xs` | 12px / 16px | Eyebrows and captions |
| `sm` | 14px / 20px | Compact labels/control metadata, never mobile body copy |
| `base` | 16px / 24px | Body, help, descriptions, instructions; minimum mobile body size |
| `lg` | 18px / 28px | Lead text and minor headings |
| `xl` | 20px / 28px | Subsection headings |
| `2xl` | 24px / 32px | Section headings |
| `3xl` | 30px / 36px | Informational page titles |
| `4xl` | 36px / 40px | Large page/feature headings |
| `5xl` | 48px / 1 | Display headings |
| `6xl` | 60px / 1 | Homepage hero scale |
| `7xl` | 72px / 1 | Largest display scale |

Choose a deliberate hierarchy and use no more than three type sizes in a single section. Type geometry is the same in light and dark themes.

#### Spacing scale

| Token | Value | Typical role |
|---|---:|---|
| `xs` | 4px | Tight icon/label spacing |
| `sm` | 8px | Compact control gaps |
| `md` | 12px | Dense grid/control gaps |
| `lg` | 16px | Standard component padding/gaps |
| `xl` | 24px | Related content and section spacing |
| `2xl` | 32px | Large component separation |
| `3xl` | 48px | Section separation |
| `4xl` | 64px | Major section separation |
| `5xl` | 96px | Page composition |
| `6xl` | 128px | Major layout separation |

Use the named spacing utilities (`gap-md`, `p-lg`, `space-y-xl`, etc.); these dimensions do not change by theme. Avoid arbitrary pixel utilities and off-token values such as the current 28px category-stack gap noted in Task 2.3.

#### Radii and shadows

| Token | Value | Typical role |
|---|---:|---|
| `sm` | 6px | Compact controls |
| `md` | 10px | Standard controls |
| `lg` | 14px | Cards |
| `xl` | 20px | Large panels |
| `2xl` | 28px | Hero surfaces |
| `full` | 9999px | Pills/circular controls |

| Shadow token | Light | Dark | Use |
|---|---|---|---|
| `card` | `0 1px 2px rgb(15 23 42 / .06), 0 1px 3px rgb(15 23 42 / .1)` | `0 1px 2px rgb(0 0 0 / .24), 0 1px 3px rgb(0 0 0 / .32)` | Resting card elevation |
| `cardHover` | `0 8px 20px rgb(15 23 42 / .12), 0 3px 8px rgb(15 23 42 / .08)` | `0 8px 20px rgb(0 0 0 / .36), 0 3px 8px rgb(0 0 0 / .24)` | Interactive hover/focus elevation |
| `focusRing` | 2px surface offset + 2px blue ring | Same geometry; dark surface/ring tokens | Visible keyboard focus |
| `modal` | `0 20px 50px rgb(15 23 42 / .2)` | `0 20px 50px rgb(0 0 0 / .48)` | Modal elevation |
| `stickyBar` | `0 -4px 16px rgb(15 23 42 / .12)` | `0 -4px 16px rgb(0 0 0 / .36)` | Sticky action-bar elevation |

The focus ring is exactly 2px visible outline with 2px offset, implemented by `shadow-focusRing` / `--shadow-focus-ring: 0 0 0 2px var(--surface-background), 0 0 0 4px var(--focus-ring)`. Its color is `#2563eb` light / `#60a5fa` dark; measured contrast is 4.94:1 or better on page backgrounds and 5.17:1 or better on surfaces in light mode, and 6.72:1 or better in dark mode.

### B) Primitive do/don't and composition rules

| Primitive | Do | Don't |
|---|---|---|
| `Button` | Use `primary` for the main action, `secondary` for a peer action, `ghost` for low-emphasis actions, and `danger` only for destructive actions; keep `md`/`lg` targets at least 44px. | Don't use a button for navigation unless rendered as `as="a"` with an `href`; don't make ordinary links look like primary actions; don't bypass loading/disabled behavior. |
| `Input` | Always provide a visible label; use `hint` for help and `error` for an announced, described validation error. Keep text at least 16px and target height at least 44px. | Don't use placeholder-only labels, color-only validation, or custom input CSS that removes focus indication. |
| `Card` | Use `default` for grouped content, `featured` for one intentionally emphasized item, and `interactive` only when the whole card is one action. | Don't nest links/buttons/inputs inside an interactive card; don't make a static card appear clickable. |
| `Badge` | Use `neutral`, `brand`, `success`, `warning`, or `danger` for short categorical/status labels, paired with clear text. | Don't use a badge as a button, long-form status message, or the only indication of success/error. |
| `FocusRing` | Wrap a single focusable custom child that needs the shared focus-visible ring; rely on `focusableOnly` default for keyboard-only indication. | Don't wrap several siblings or another interactive control; don't suppress the ring or wrap primitives that already supply the same focus treatment. |

Usage and composition:

- Choose `Button` for an action that changes state or submits work. Choose a semantic `Link` (router link or anchor) for navigation; style it as a button only when it is a true call to action, and preserve its link semantics.
- Choose `Card interactive` only when the complete card is one navigation/action target. Otherwise keep a default `Card` and place separate `Button`/`Link` controls inside it.
- Choose `Badge` for a compact label such as “New” or “Ready”. Choose a text status message (and appropriate live/alert semantics when it changes) for instructions, outcomes, and errors; a status color alone is never sufficient.
- Standard content-card shape: `Card > Badge (optional) > heading/body text`. Keep the badge adjacent to its relevant heading or content and provide text labels for meaning.
- Apply `FocusRing` to a custom focusable `Link` or control where the native/component focus styling is not already provided. The ring must remain visible in both themes and must not be clipped.

Examples:

```jsx
<Button variant="primary" size="md" onClick={submit}>Save changes</Button>
<Button as="a" href="/resources" variant="secondary">Read the guide</Button>
<Input label="Output filename" hint="PDF extension is added automatically" />
<Card variant="default">
  <Badge tone="success">Ready</Badge>
  <h3>Merge PDFs</h3>
  <p>Combine selected documents in the chosen order.</p>
</Card>
<FocusRing><a href="/privacy">Privacy details</a></FocusRing>
```

### C) Variant build rules

Variants 1–3 must follow all of these rules:

1. Use only the color, type, spacing, radius, shadow, and focus tokens specified in Task 2.1; use the approved Task 2.2 primitive recipes for component colors.
2. Do not hardcode hex/RGB/HSL colors, arbitrary spacing values, or one-off radii in variant source or styles. If the needed value is missing, raise it for design-system review rather than inventing a token.
3. Use only `Button`, `Input`, `Card`, `Badge`, and `FocusRing` from Task 2.2 for their respective roles; do not create competing wrappers or duplicate primitives.
4. Every interactive element must be a `Button`, `Input`, interactive `Card`, semantic `Link`/anchor, or a wrapper of one. Use native/router link semantics for navigation; there is no separate custom Link primitive in Task 2.2.
5. Every keyboard-focusable control and link has a visible focus ring with the specified 2px ring and 2px offset; no `outline-none` without the replacement ring.
6. Preserve WCAG text contrast of at least 4.5:1 and non-text/focus contrast of at least 3:1; pair status colors with visible words/icons and never communicate state by color alone.
7. Keep body copy and inputs at least 16px on mobile. Use no more than three type sizes in a section and keep heading levels semantic.
8. Use named spacing/radius/shadow utilities only; maintain a single radius family within each component and at least 44×44px targets for primary interactive controls.
9. Keep light/dark behavior token-driven through `[data-theme="dark"]`; do not hardcode a light-only surface into a variant or change system-preference/persistence behavior.
10. Preserve current tool behavior, shared components, routes, and below-content ad placement; do not redesign or duplicate existing tools while building homepage variants.
11. Keep the 320px-first layout free of horizontal overflow at all required widths, maintain a composed desktop layout through 1920px, and avoid above-fold animation or ad containers.

### D) Open design questions for human decision before Day 3

1. Keep the current PDF Merge Pro wordmark/icon, or commission a new original lockup? If changing it, which elements are fixed (name, PDF tile, icon)?
2. Which homepage headline voice should lead: concise/formal utility language, or conversational task-first language?
3. What original hero treatment is preferred: abstract document geometry, a restrained workflow diagram, or typography-only? Any imagery/illustration constraints?
4. Which trust proof should be most prominent: browser-side processing/privacy, tool breadth, or simple workflow guidance? Confirm the exact claims that can be supported.
5. Should homepage category/tool browsing feel compact and scan-dense, or spacious and editorial? Choose which content receives the strongest visual emphasis.

### E) Self-verification

- [x] Palette table includes every Task 2.1 brand ramp, surface ramp, foreground token, status pair, focus ring, page/card/muted surface, and tool-icon alias, with light/dark color chips.
- [x] Type table includes all 12 sizes with names and intended use; mobile body-text minimum is explicit.
- [x] Spacing table includes all 10 named values; radii and all five shadows include their values and theme behavior.
- [x] All five Task 2.2 primitives have do/don't guidance and examples/usages; Button, Input, Card, Badge, and FocusRing composition rules are explicit.
- [x] Variant rules have 11 independently verifiable requirements; 5 human decisions are listed.
- [x] No code was modified for Task 2.5.
- [x] `npm.cmd test` passed 352/352 before and after the documentation update; exact durations are recorded below.
- [x] `docs/status.md` and `docs/PROJECT-TRACKER.md` record Task 2.5 completion.

## Task 3.x — Variant 1 (to be filled)

## Task 4.x — Variant 2 (to be filled)

## Task 5.x — Variant 3 (to be filled)

## Task 6.x — Selection & Final Homepage (to be filled)

## Task 9.x — SEO & Performance (to be filled)

## Task 1.2 — Current Homepage Audit & Documentation Reconciliation

### A) Component tree

```text
App (src/App.jsx) [shared shell; context, not owned by Home]
├─ Skip link -> #tool-search [shared]
└─ .site-workspace
   ├─ <header> -> <ToolSearch /> [shared, global tool discovery]
   ├─ <LeftNavigation /> [shared navigation + sidebar LanguagePicker]
   ├─ <main id="main-content">
   │  └─ Route "/" -> Home
   │     ├─ useEffect (document title/meta description sync; not a rendered component)
   │     ├─ <section className="home-hero"> [local]
   │     │  ├─ <div className="home-hero-copy"> [local]
   │     │  │  ├─ <p className="home-hero-eyebrow"> [local] - eyebrow label for the hero
   │     │  │  ├─ <h1 className="home-hero-title"> [local] - principal homepage headline
   │     │  │  ├─ <p className="home-hero-tagline"> [local] - short value proposition
   │     │  │  ├─ <p className="home-hero-description"> [local] - descriptive intro copy
   │     │  │  └─ <a className="home-hero-link" href="#toolbox"> [shared Link/anchor] - jump link to tool list
   │     │  └─ <nav className="home-hero-art" aria-label="browseToolCategories"> [shared nav element]
   │     │     ├─ decorative divs for orbit/paper/document styling [local]
   │     │     └─ TOOL_CATEGORIES.map(...) [data]
   │     │        └─ <button className="home-hero-category-chip"> [local] - expands tool fan by category
   │     │           └─ <Link to={localizedTool.path}> [shared] - category tool shortcuts
   │     ├─ <section id="toolbox"> [local]
   │     │  ├─ <h2> [local] - toolbox heading
   │     │  ├─ <p> [local] - subheading guidance
   │     │  └─ TOOL_CATEGORIES.map(...) [data]
   │     │     └─ <section id={`category-${category.id}`}> [local]
   │     │        ├─ <h3> [local] - category heading
   │     │        ├─ <Link className="category-section-link" to={category.path}> [shared] - category route link
   │     │        └─ tools.map(...) -> <ToolCard tool={tool} /> [shared]
   │     │           └─ <Link to={to || localizedTool.path}> [shared] - individual tool route
   │     └─ <AdSlot placement="homeBelowTools" /> [shared] - ad placement below tools
   └─ <Footer /> [shared legal links + footer LanguagePicker]
```

Purpose summary: Home renders the landing-page hero, category fan, and toolbox. Global tool search is rendered separately in the app shell; shared components include `ToolCard`, router links, `AdSlot`, `ToolSearch`, `LeftNavigation`, and `Footer`.

### B) Prop flow map

| Component | Prop | Type | Source (static / toolRegistry / context / prop-drilled) | Notes |
|-----------|------|------|-----------------------------------------------------------|-------|
| Home | `language`, `translate` | object | context | from `useLanguage()`. Drives localized category names, tool labels, and hero text. |
| Home | `activeCategoryId` | string \| null | state | Tracks the expanded hero category. |
| Home | `fanReadyCategoryId` | string \| null | state | Controls when tool fan is fully ready for animation. |
| Home | `heroArtRef` | ref object | internal state | Used to detect outside click dismissal. |
| Home | `categoryTriggerRefs` | Map | internal state | Keeps focus on the triggering category button after Escape. |
| ToolCard | `tool` | object | toolRegistry | Passed from `TOOL_REGISTRY` entries. |
| ToolCard | `to` | string | static / default | Optional override for route target. |
| ToolCard | `actionLabel` | string | static | Optional CTA copy. |
| ToolCard | `className` | string | static | Additional styling class. |
| Link (home hero) | `to` | string | toolRegistry-derived | Bound to localized `tool.path` or category route. |
| Link (category section) | `to` | string | category.path | Category overview route. |
| AdSlot | `placement` | string | static | `homeBelowTools` is the homepage ad placement. |

### C) Interactive element inventory

| # | Element (role + accessible name) | File:line | Handler / onClick | Navigation target or action | Keyboard reachable today? |
|---|----------------------------------|-----------|-------------------|----------------------------|---------------------------|
| 1 | Link "Explore tools" | src/components/Home.jsx:73 | native anchor click | `href="#toolbox"` scroll to toolbox | Yes — native anchor focus |
| 2 | Button "show/hide category" | src/components/Home.jsx:122-139 | `onClick={() => setActiveCategoryId(...)}` | Expand/collapse hero category fan | Yes — button is focusable |
| 3 | Tool link in hero fan | src/components/Home.jsx:155-177 | native Link click | `to={localizedTool.path}` | Yes — when expanded; otherwise `tabIndex={-1}` |
| 4 | Category heading link | src/components/Home.jsx:204-209 | native Link click | Category page route | Yes — native link focus |
| 5 | Tool card link | src/components/ToolCard.jsx:13-22 | native Link click | tool route | Yes — native link focus |
| 6 | Search trigger button | src/components/ToolSearch.jsx:140-150 | `onClick={openSearch}` | Expand/collapse search panel | Yes — button is focusable |
| 7 | Search field | src/components/ToolSearch.jsx:154-177 | `onChange`, `onFocus` | Filter tool search results | Yes — input is focusable |
| 8 | Clear search button | src/components/ToolSearch.jsx:180-190 | `onClick` clears query | Clears current search and refocuses input | Yes — button is focusable |
| 9 | Search option button | src/components/ToolSearch.jsx:208-226 | `onClick={() => openTool(tool)}` | Navigate to matching tool | Yes — button is focusable |
| 10 | Search result keyboard navigation | src/components/ToolSearch.jsx:90-118 | Arrow keys / Enter / Escape | Move focus and execute selection | Yes — custom key handling |

### D) Visual region inventory

| Region name | Current visual treatment (one sentence) | Contents | Above fold at 1440px desktop? | Above fold at 375px mobile? |
|-------------|-----------------------------------------|----------|-----------------------------|-----------------------------|
| Hero copy area | Large headline, supporting text, and CTA sit above the illustration. | Eyebrow, `h1`, tagline, description, CTA link | Yes | Yes |
| Hero illustration / category fan | Circular artboard with category chips and tool fan arcs. | Decorative PDF mock and category fan controls | Yes | Yes |
| Toolbox section | White/neutral cards grouped under category headings. | Category headings and tool cards | Yes | Yes |
| Category blocks | Border-top sections with cards in one-column / responsive grid. | Each grouped category’s tools | Yes | Partial (`space-y-7` + responsive grid) |
| Ad slot | Separate block below the toolbox list. | `AdSlot placement="homeBelowTools"` | No | No |
| Footer | Basic white footer with legal links and language selector. | Footer nav and copyright | No | No |

### E) Current accessibility state

#### E1. Landmarks present

| Landmark | Present? | Element used | Notes |
|----------|----------|--------------|-------|
| Skip link | Yes | `App.jsx:624` | Global skip link targets the search input. |
| Header | Yes | `App.jsx:627` | Search bar sits in the site topbar. |
| Nav | Yes | `src/components/Home.jsx:80` and `src/components/Footer.jsx:10` | Hero nav uses `aria-label` and footer nav is semantically navigational. |
| Main | Yes | `App.jsx:639` | Main content area is wrapped in `<main id="main-content">`. |
| Footer | Yes | `src/components/Footer.jsx:5` | Footer present, with legal links and language selector. |

#### E2. Heading hierarchy

Actual heading order on the homepage at the component level:

- `src/components/Home.jsx:66` — `<h1 className="home-hero-title">` 
- `src/components/Home.jsx:193` — `<h2 className="text-2xl font-bold text-slate-800">{translate('toolbox')}</h2>`
- `src/components/Home.jsx:205` — `<h3 id={...} className="mb-4 text-lg font-bold text-slate-800">`

`h1 count = 1` on this homepage render. No explicit duplicate `h1` found in the Home component. This is good, but the global site also has other route-level `h1` elements in tool pages and static pages; the homepage itself still renders one `h1` for the home route.

#### E3. Focus management

| Check | Result | File:line | Notes |
|-------|--------|-----------|-------|
| Skip link present? | Yes | `src/App.jsx:624` | Present and native anchor. |
| Skip link visible on focus? | Unknown — CSS not inspected here | `src/App.jsx:624` | Requires runtime + CSS verification. |
| Focus order = visual? | Partially yes | `src/components/Home.jsx:122-177` | Focus order follows the DOM and expanded category fan order. |
| Any keyboard trap? | No static evidence of trap | `src/components/ToolSearch.jsx:90-118` | Escape closes the search panel and returns focus to the trigger. |
| Any mouse-only elements? | No static evidence | `src/components/Home.jsx:122-177` and `src/components/ToolSearch.jsx:140-226` | Most are native buttons/links and input controls. |

#### E4. ARIA audit

| Element | ARIA attributes | Verdict | File:line |
|---------|-----------------|---------|-----------|
| Hero category nav | `aria-label={translate('browseToolCategories')}` | correct | `src/components/Home.jsx:80-81` |
| Category toggle button | `aria-expanded`, `aria-controls`, `aria-label`, `title` | correct | `src/components/Home.jsx:122-139` |
| Tool fan group | `role="group"`, `aria-label`, `aria-hidden` | correct | `src/components/Home.jsx:144-146` |
| Tool link item | `aria-label`, `title`, `aria-hidden` | correct | `src/components/Home.jsx:155-177` |
| Search input | `role="searchbox"`, `aria-label` from hidden label | correct | `src/components/ToolSearch.jsx:151-177` |
| Search results panel | `id="tool-search-results"`, `aria-label={translate('matchingTools')}` | correct | `src/components/ToolSearch.jsx:197-204` |
| Search status message | `role="status"` | correct | `src/components/ToolSearch.jsx:232` |

#### E5. Contrast risks by inspection

| Element | Text colour | Background colour | Estimated ratio | Risk |
|---------|-------------|------------------|----------------|------|
| `home-hero-title` text | inherited dark slate | light neutral page background | ~needs verification | needs verification |
| `toolbox` heading | `text-slate-800` | white/light neutral background | likely passes | passes |
| `ToolCard` text | `text-slate-500` + `text-slate-800` | white cards | likely passes | passes |
| `tool-search-input` text | `text-slate-800` | white input | likely passes | passes |
| `ToolSearch` clear button | `text-slate-400` | white input | likely <4.5:1 at small sizes | needs verification |
| Focus ring on search trigger and tool buttons | CSS ring color | surrounding background | not verifiable statically | needs verification |

Static inspection alone cannot verify exact ratios; CSS-specific contrast must be audited in runtime and with DevTools. See `src/components/Home.jsx:66`, `src/components/ToolSearch.jsx:177`, `src/components/ToolCard.jsx:17-18`.

#### E6. Form/input accessibility

| Element | Label? | aria-label? | Placeholder-only? | Error association? | Font size? | Tap target height? | File:line |
|---------|--------|-------------|-------------------|--------------------|-----------|-------------------|-----------|
| Search input | Yes — hidden label via `label htmlFor="tool-search"` | No explicit aria-label, but hidden label covers it | No | N/A | `text-sm` (approx 14px) is below the project requirement if CSS is not overridden; needs verification | `py-3` + 44px-ish height likely okay | `src/components/ToolSearch.jsx:139-177` |
| Search trigger button | N/A | Yes — `aria-label={translate('searchPdfTools')}` | N/A | N/A | not text-based | likely 44px+ | `src/components/ToolSearch.jsx:140-150` |
| Clear search button | No visible label; `aria-label` present | Yes | N/A | N/A | icon-only control | likely below 44px unless CSS expands it | `src/components/ToolSearch.jsx:180-189` |

Static issues flagged by review:

1. The design relies on `text-sm` for input text; the task standard requires input font size ≥16px. `src/components/ToolSearch.jsx:177`.
2. The clear-search icon button is icon-only and may need a larger hit area to remain above the required 44×44 target minimum. `src/components/ToolSearch.jsx:180-189`.
3. The global skip link exists but its focus/visibility needs CSS-level verification because there is no explicit visible-on-focus rule in the read code. `src/App.jsx:624`.
4. Search results are keyboard-operable, but hover-only styles are not necessarily a11y-tested for pointer and keyboard parity. `src/components/ToolSearch.jsx:208-226`.
5. Contrast for smaller gray text and icon-only controls is not statically proven. `src/components/ToolSearch.jsx:177`, `src/components/ToolSearch.jsx:189`, `src/components/Home.jsx:66`.

### F) Responsive behaviour

| Width | Layout behaviour (from Tailwind classes) | Overflow risk |
|-------|-----------------------------------------|---------------|
| 320 | `space-y-16`, stacked hero copy, hero art, and toolbox cards; category cards use full-width columns. | Low to moderate; hero art may compress visually. |
| 375 | Same as 320 with slightly more space; tool cards remain single-column. | Low |
| 414 | Similar to 375 with responsive spacing; still single-column cards. | Low |
| 768 | Hero content remains stacked; toolbox categories use `sm:grid-cols-2` for cards in the grid. | Low |
| 1024 | Desktop-style proportions begin to open; hero art and cards still remain within a single layout rhythm. | Low |
| 1280 | Layout expands to a composed desktop composition; category card grid can use `xl:grid-cols-3`. | Low |
| 1440 | Wide desktop composition with generous spacing and card columns. | Low |
| 1920 | Max-width layout remains disciplined; no evidence of a stretched mobile layout. | Low |

### G) MUST PRESERVE list

1. MUST PRESERVE: the `/` home route must still render the homepage hero and toolbox. Currently provided by `src/App.jsx:643` and `src/components/Home.jsx:58-214` — verified by route mapping in App. 
2. MUST PRESERVE: the global skip link must remain available from the app shell. Currently provided by `src/App.jsx:624` — verified by static route markup. 
3. MUST PRESERVE: the hero CTA anchor to `#toolbox` must still jump to the tool list. Currently provided by `src/components/Home.jsx:73` — verified by `href="#toolbox"`.
4. MUST PRESERVE: the category fan in the hero must still expose all five categories. Currently provided by `src/components/toolRegistry.js:21-52` and `src/components/Home.jsx:97-177` — verified by `TOOL_CATEGORIES.map(...)`.
5. MUST PRESERVE: the category routes `/categories/organize`, `/categories/convert`, `/categories/edit-sign`, `/categories/protect-repair`, and `/categories/extract` must remain navigable. Currently provided by `src/components/toolRegistry.js:21-52` and `src/App.jsx:645-649` — verified by route generation.
6. MUST PRESERVE: every active tool in the homepage toolbox must remain present and routeable. Currently provided by `src/components/toolRegistry.js:54-228` and `src/components/Home.jsx:199-209` — verified by `TOOL_REGISTRY` and `ToolCard` usage. Tool routes: `/merge`, `/split`, `/rotate`, `/protect`, `/unlock`, `/image-pdf`, `/pdf-to-word`, `/pdf-to-powerpoint`, `/pdf-to-markdown`, `/compress`, `/edit-pdf`, `/watermark`, `/remove-pages`, `/ocr-pdf`, `/crop-pdf`, `/organize`, `/redact`, and `/sign`.
7. MUST PRESERVE: the search field must remain client-side, keyword-based, and route-aware. Currently provided by `src/components/ToolSearch.jsx:27-47`, `src/components/ToolSearch.jsx:154-177`, and `src/components/ToolSearch.jsx:208-226` — verified by `results` computation and `openTool(tool)` navigation.
8. MUST PRESERVE: search keyboard handling must keep Escape, ArrowUp, ArrowDown, and Enter behaviors. Currently provided by `src/components/ToolSearch.jsx:93-118` — verified by keydown handler logic.
9. MUST PRESERVE: the tool cards must still carry localized names and descriptions plus iconography. Currently provided by `src/components/ToolCard.jsx:7-23` and `src/i18n/toolTranslations.mjs` — verified by `getLocalizedTool(language, tool)` usage.
10. MUST PRESERVE: the footer legal/trust links must remain accessible and visible. Currently provided by `src/components/Footer.jsx:7-19` and `src/App.jsx:676-685` — verified by footer nav and route list.
11. MUST PRESERVE: the language selector must stay available in the site shell and footer. Currently provided by `src/App.jsx:324` and `src/components/Footer.jsx:15` — verified by `LanguagePicker` usage and footer nav placement.
12. MUST PRESERVE: the theme is persisted in `localStorage` under `pdf-tools-theme`. Currently provided by `src/App.jsx:600-603` — verified by `localStorage.setItem('pdf-tools-theme', theme)`.
13. MUST PRESERVE: the homepage ad slot stays below the toolbox, never above the fold. Currently provided by `src/components/Home.jsx:211` and `src/components/Home.jsx:212` — verified by placement in the section after tool list. 
14. MUST PRESERVE: the home page does not mutate tool logic; it only provides navigation and discovery surfaces. Currently provided by the component tree and route wiring in `src/App.jsx` and `src/components/Home.jsx` — verified by read-only audit.

### H) MAY REDESIGN list

1. MAY REDESIGN: the hero illustration style — safe because the current markup is purely decorative and not intrinsic to tool behavior.
2. MAY REDESIGN: the category fan animation and motion timing — safe because the fan is only a navigation affordance, not a required routing logic.
3. MAY REDESIGN: the toolbox card grid spacing and proportions — safe because the data itself comes from `TOOL_REGISTRY` and the grouping is semantic, not a hard requirement.
4. MAY REDESIGN: the hero headline typography treatment — safe because the current home page only needs a single `h1` and a clear CTA.
5. MAY REDESIGN: the footer layout and grouping — safe because legal/trust links are preserved as content, not fixed into a specific grid arrangement.
6. MAY REDESIGN: the search panel visual styling — safe because the functional requirement is “search by tool metadata and navigate on selection,” not a specific panel appearance.
7. MAY REDESIGN: category label copy and icon treatment — safe because the category IDs and routes are the durable contract, not their original styling.
8. MAY REDESIGN: the spacing of the below-the-fold ad slot — safe because its purpose is to sit below the toolbox while content remains prioritized.

### I) Homepage redesign opportunities (observational only)

- The homepage has one `h1` in `Home.jsx:66`, which is good, but the broader site stack also manages additional route-level headings elsewhere; the home route should remain the only source of a homepage `h1` when the redesign lands.
- The top-of-page search is global app shell behavior, not a homepage-local component; that makes it easy to redesign the home hero without losing search access.
- The hero category fan and the toolbox are both discovery surfaces, but they are not the same interaction pattern; one is animated categorical navigation and one is standard list browsing.

### J) Homepage audit limitations

- Runtime contrast ratios are not verifiable by static inspection alone. Need browser DevTools or a Lighthouse/axe run to confirm the exact ratios and focus-ring visibility.
- Actual tap-target compliance (44×44px minimum) needs a real browser measurement at 320px and 375px widths; the static code suggests a likely match, but it is not confirmed.
- The homepage’s keyboard behavior needs a live run in the browser to confirm focus order, skip-link visibility, and custom search-interaction timing after animations and state transitions.

### K) Documentation reconciliation

#### K.1 architecture.md
- Purpose: Not present in `docs/`. No in-repo architecture record is available for the homepage redesign.
- Key commitments extracted:
  - No architecture doc currently exists in the repository snapshot.
  - The app is a React + Vite + Tailwind SPA with routes defined in `src/App.jsx`.
  - The homepage is a landing/discovery view assembled from `Home`, `ToolCard`, `ToolSearch`, and the registry.
- Code verification: Partially — the code clearly shows the app structure and route composition, but the missing doc means no formal architecture record can be reconciled.
- Conflict with redesign direction: Possible — the redesign could deviate from undocumented architecture decisions unless a future architecture file is supplied or created.
- Action recommendation for human: Needs decision before Day 10 — provide or create an architecture doc if the team wants explicit structural constraints beyond the current code.

#### K.2 user-guide.md
- Purpose: Not present in `docs/`. No file describes the user-visible workflow for the homepage.
- Key commitments extracted:
  - The homepage acts as a discovery surface for tools and categories.
  - The app exposes a global search and a browsable toolbox.
  - Tool navigation is route-driven and not local to a single page component.
- Code verification: Yes — `Home.jsx`, `ToolSearch.jsx`, and `App.jsx` all reflect this documented behavior.
- Conflict with redesign direction: None — the homepage is still a discovery surface, and redesigning its presentation does not remove the discovery model.
- Action recommendation for human: Keep as-is — existing code supports this usage model, and the doc is more of a narrative than a hard requirement.

#### K.3 accessibility.md
- Purpose: Not present in `docs/`; current WCAG commitment is captured here as a human decision, not in a file.
- Key commitments extracted:
  - D1: WCAG 2.2 AA is confirmed.
  - The project requires accessibility evidence for keyboard, contrast, focus, and search behavior.
  - The homepage must stay keyboard-reachable and semantically structured.
- Code verification: Partially — the current `Home` and `ToolSearch` code include focusable controls and semantic landmarks, but static proof is incomplete without runtime validation.
- Conflict with redesign direction: None — the redesign is explicitly required to keep WCAG 2.2 AA as the target.
- Action recommendation for human: Update during Day 10 — this doc should exist in the final design handoff to record compliance evidence.

#### K.4 seo-strategy.md
- Purpose: Not present in `docs/`; the project notes say keyword research is deferred to Day 9.
- Key commitments extracted:
  - D2: Keyword research is deferred to a collaborative Day 9 exercise.
  - Homepage h1 structure must be preserved, but the exact words can change.
  - Do not lock in current SEO keywords as a must-preserve element of this audit.
- Code verification: Yes — the current home route is set to `h1` and the app sets document title/meta description in `Home.jsx:17-30`.
- Conflict with redesign direction: None — the redesign can change the wording while preserving a single homepage `h1` and metadata conventions.
- Action recommendation for human: Keep as-is — the strategy is intentionally deferred and not binding to this audit.

#### K.5 internationalization.md
- Purpose: Not present in `docs/`; the repo does have 20-language support in code and translation files.
- Key commitments extracted:
  - D3: 20 languages are shipped and must remain in the product.
  - Search, category names, and tool labels are localized via `useLanguage()` and translation catalogs.
  - Translation quality is a separate audit in Task 1.4.
- Code verification: Yes — the homepage uses `translate(...)` and `getLocalizedTool(language, tool)` to render localized strings and tool names.
- Conflict with redesign direction: None — redesigning the visuals does not require removing languages.
- Action recommendation for human: Keep as-is — no removal of languages should be recommended in this task.

#### K.6 testing.md
- Purpose: Not present in `docs/`; the current repo has a live Jest/Node test suite and a task contract says it is authoritative.
- Key commitments extracted:
  - The only authoritative regression strategy is the existing `npm test` suite.
  - Test strategy is not parallelized or invented here.
  - The project must keep all tests green during redesign iterations.
- Code verification: Yes — the repo’s `package.json` declares `npm test` (`node --test tests/*.test.mjs`), and the suite is passing in the current state.
- Conflict with redesign direction: None — the redesign must not break the test suite.
- Action recommendation for human: Keep as-is — the repo already has the operative regression strategy.

#### K.7 deployment.md
- Purpose: Not present in `docs/`; no deployment guide is available in the repo snapshot.
- Key commitments extracted:
  - D4: CSP-related items must be flagged for explanation before Day 9.4.
  - The deployment doc should eventually mention hosting and security posture.
  - No deployment action is taken in this task.
- Code verification: Not-verifiable-statically — no deployment documentation or CSP settings are present in the repository snapshot.
- Conflict with redesign direction: Possible — a future deployment handoff may need to explain CSP or build-specific security constraints.
- Action recommendation for human: Needs decision before Day 9.4 — the team must provide the CSP explanation before deployment considerations are finalized.

### L) Documentation updates needed after redesign (Day 10 handover input)

| Doc | Section to update | Reason | Blocking task (which Day X decision unblocks it) |
|-----|------------------|--------|----------------------------------------------------|
| architecture.md | Home route and app-shell architecture | The homepage and global app shell will look materially different after redesign. | Day 6 final homepage selection |
| accessibility.md | WCAG evidence and keyboard/focus notes | The redesign must be backed by runtime contrast and keyboard proof. | Day 6 final homepage selection |
| seo-strategy.md | Target keyword strategy and metadata choices | The product will need the final keyword set once Day 9 research is complete. | Day 9 keyword research |
| internationalization.md | Translation coverage and language support guidance | Design changes should not weaken the 20-language product commitment. | Day 4 language review |
| testing.md | Regression checklist for homepage redesign | New layout and interaction changes must be validated with the existing suite and any needed visual checks. | Day 3 baseline and Day 6 final selection |
| deployment.md | CSP and hosting posture | Deployment constraints may require security explanation before final launch. | Day 9.4 CSP explanation |
| user-guide.md | Homepage and tool-discovery workflow | The home page’s content hierarchy and navigation flow will change visually but must retain semantics. | Day 6 final homepage selection |

### M) Constraints to carry forward

1. MUST RESPECT: D1 — WCAG 2.2 AA target is confirmed. Accessibility documentation should be updated at Day 10 handover. 
2. MUST RESPECT: D2 — SEO keyword research remains open. Do not lock in a homepage keyword as a preserved contract for this task.
3. MUST RESPECT: D3 — 20 languages remain part of the product and should not be removed as a redesign recommendation in this audit.
4. MUST RESPECT: D4 — CSP items are flagged for explanation before Day 9.4 and are not resolved here.
5. MUST RESPECT: the homepage remains the route `/`; its single `h1` and route semantics must be preserved while the visual design changes.
6. MUST RESPECT: the app shell search remains available globally and must keep its keyword-based behavior while visual redesign happens.
7. MUST DECIDE: whether the missing docs in `docs/` should be created later or tracked externally before Day 10 handover.

### SELF-VERIFICATION
- [x] Every interactive element in Home.jsx is represented in section C.
- [x] Every tool category exposed on Home appears in section G.
- [x] Every category and tool route navigable from Home is listed in section G.
- [x] At least 5 accessibility issues are flagged with file:line in section E.
- [x] Section G has at least 10 items (14).
- [x] Section H has at least 8 items (8).
- [x] Section E2 states the exact h1 count and gives a file:line reference for each heading.
- [x] Section F has exactly 8 rows (320/375/414/768/1024/1280/1440/1920).
- [x] Sections K.1–K.7 are present, each with all 5 fields filled.
- [x] Section K.3 records D1 (WCAG 2.2 AA confirmed).
- [x] Section K.4 records D2 (SEO deferred to Day 9).
- [x] Section K.5 records D3 (20 languages kept; quality = Task 1.4).
- [x] Section K.7 records D4 (CSP flagged for explanation).
- [x] Section L lists every documentation file needing an update.
- [x] Section M has at least 3 constraints including D1–D4.
- [x] No .jsx/.js/.css/.mjs/.json file was modified.
- [x] Only Task 1.2 in docs/main-page.md and its docs/status.md row were changed; Tasks 1.1, 1.3, and 1.4 remain untouched.
- [x] npm test passed before and after the documentation update with identical results (352/352).
- [x] docs/status.md Task 1.2 row updated to "Fixed — Ready for Review".

## Task 3.1 — Variant 1: Scannable Grid Homepage

### A) Read evidence and scope

- Read `docs/status.md`, `docs/PROJECT-TRACKER.md`, `docs/inventory.md`, and the Task 1.2 and Task 2.5 sections of this file.
- Read `src/components/Home.jsx`, `src/components/toolRegistry.js`, `src/components/ToolSearch.jsx`, `src/components/ui/`, and the shared `AdSlot` implementation.
- Consulted the Linear, Stripe, Vercel, and Claude templates for high-level hierarchy and interaction cues only; no reference layout or artwork was copied.
- The new variant is intentionally not routed. `App.jsx` adds a development-only preview branch; the existing Home route, ToolSearch implementation, ToolCard, registry data, tool workflows, footer, and language picker remain unchanged.

### B) Implemented variant

- Added `src/components/VariantScannableGrid.jsx` and four focused components in `src/components/v1/`. The preview renders native header, main, navigation, and footer landmarks.
- The replaceable `brandName` prop supplies the header wordmark; the composite H1 is “All the PDF tools you need, right in your browser.” The browser-privacy statement is displayed directly beside the hero search.
- The full-width search uses the shared `Input` primitive, is 48px high with 16px text, and searches registry/localized tool data. Result counts and no-result feedback are announced through a polite live region.
- Five registry-driven category cards appear immediately below the hero. Each shows three or four visible text links; the operation labels in Extract link to their valid Split/OCR destinations. Popular cards are interactive shared `Card` primitives.
- A `Button` primitive creates the fixed mobile “Browse All Tools” action, with bottom safe-area padding. The category sidebar replaces it at the desktop breakpoint.
- The shared `AdSlot` remains after all content. Its configuration is disabled, so the preview showed no ad or reserved ad box.
- The required hero Input is distinct from the existing global `ToolSearch`, which remains unchanged in the app shell. Reconcile whether both remain visible when the variant is selected/routed in Task 6.1.
- A temporary preview harness is available at `http://localhost:5173/?preview=v1` when Vite is running. `src/App.jsx` selects it only when `import.meta.env.DEV` is true and the query is `preview=v1`; the production build contains no harness module or variant copy. This does not change application routing. The existing app-shell `ToolSearch` is not rendered in this preview branch; decide whether to consolidate search when selecting the final route in Task 6.1.

### C) Design rationale and rejected alternatives

The discovery goal is to make the category and actual task names scannable without first opening a menu or waiting for a carousel. Five categories and up to four text links per card are directly visible, followed by three popular actions. This is an interaction rationale, not a measured competitor benchmark; no third-party layout or artwork was copied.

Alternatives considered:

- Category carousel — rejected because off-screen cards conceal tool choices and require interaction before scanning.
- Single category dropdown — rejected because it adds a tap and hides the task names on mobile.
- Dense one-column list of every tool — rejected because category grouping would be lost and the initial scan would be longer.
- Replacing the required hero Input with the app-shell `ToolSearch` — rejected for this variant because the task requires a persistent, full-width Input. The existing app-shell search is preserved; whether to consolidate the two at final routing remains open.

### D) Responsive behavior

| Width | Observed behavior |
|---|---|
| 320 | One-column category cards; 48px search input with 16px text; safe-area mobile CTA. All visible pointer targets measured at least 44×44px. |
| 375 | One-column cards and stacked hero; sticky CTA remains visible; no horizontal overflow. |
| 414 | One-column cards; sticky CTA remains visible; no horizontal overflow. |
| 768 | Two-column category cards; hero stays stacked; mobile CTA remains visible. |
| 1024 | Three-column cards and category sidebar; sticky CTA hidden. |
| 1280 | Four-column cards; hero places headline and search side by side; sidebar visible. |
| 1440 | Four-column cards and sidebar; container remains within its parent’s available width. |
| 1920 | Four-column cards; measured content container is capped at 1440px and centered; no horizontal overflow. |

The Chromium preview reported no horizontal overflow at 320, 375, 414, 768, 1024, 1280, 1440, or 1920px. Visible pointer targets were checked at every width; none measured below 44×44px. The Input measured 48px high with 16px text. This is a local-browser check, not cross-browser certification.

### E) Contrast and focus evidence

The search border measurements use computed colors from the rendered Input after theme changes. A full rendered text-pair audit and automated WAVE/axe scan remain pending. Hover classes are present, but the browser automation did not provide reliable visual hover measurements.

| Pair | Light | Dark | Result |
|---|---:|---:|---|
| Search border against Input surface | 4.72:1 | 6.72:1 | Pass |
| Search border hover state | Not measured | Not measured | Hover classes exist; browser hover verification was inconclusive |
| Focus indicator | Visible 2px ring with surface offset | Visible 2px ring with surface offset | Focused theme button computed style showed the ring; token ratios are documented in Task 2.1 |

After bringing the preview page to the foreground, focusing the skip link revealed it at the top-left (16px inset). The theme button's computed focus style showed a visible ring. Category links, header navigation, interactive cards, Input, and Button use the existing FocusRing primitive or the documented `focus-visible` token utility.

### F) WCAG 2.2 evidence

| # | Criterion | Result | Evidence |
|---:|---|---|---|
| 1 | 1.3.1 Info and Relationships | Pass | One H1 and one main landmark; native header, navigation, aside, labelled sections, lists, and links are present in the preview itself. |
| 2 | 1.4.3 Text Contrast | Partial — full audit pending | Computed search-border contrast passes in both themes; text pairings use Task 2.1 tokens, but the complete rendered-page text contrast scan is pending. |
| 3 | 1.4.4 Resize Text | Pending | Required viewport reflow was checked; 200% text resizing/native browser zoom was not verified for this variant. |
| 4 | 1.4.10 Reflow | Pass | No horizontal overflow at all eight required viewport widths. |
| 5 | 1.4.11 Non-text Contrast | Pass for measured search boundary | Search border measured 4.72:1 light / 6.72:1 dark against the rendered Input surface. Hover-state contrast was not measured. |
| 6 | 1.4.12 Text Spacing | Pass for reflow sample | Applied line-height 1.5, paragraph spacing 2em, letter spacing .12em, and word spacing .16em at 320px; no horizontal overflow was observed. |
| 7 | 2.1.1 Keyboard | Partial — manual keyboard check pending | Interactive controls use native links, buttons, and Input; this browser automation did not provide reliable keyboard-event evidence. |
| 8 | 2.1.2 No Keyboard Trap | Pass for implemented controls | Search, links, cards, and Button use native focusable elements; no modal or custom trapped-focus interaction is introduced. |
| 9 | 2.4.1 Bypass Blocks | Pass | “Skip to tools” was revealed at a 16px top/left inset after focusing it in the foregrounded preview; its href targets the category directory. |
| 10 | 2.4.3 Focus Order | Pass for DOM order | Focusable content follows the skip link, header, hero search, category directory, popular tools, footer, and mobile browse action in DOM order. |
| 11 | 2.4.7 Focus Visible | Pass for sampled control | The focused theme button's computed style showed a surface offset and visible focus ring. |
| 12 | 2.4.11 Focus Not Obscured | Pass for mobile sample | At 320px, the final Extract link ended at y=472px while the fixed CTA began at y=823px; their bounds did not overlap. |
| 13 | 2.5.7 Dragging Movements | N/A — no dragging interaction | The variant introduces no drag operation. |
| 14 | 2.5.8 Target Size Minimum | Pass for visible pointer targets | No visible, non-sr-only link, button, or input measured below 44×44px at the eight required widths. |
| 15 | 3.2.6 Consistent Help | N/A — no help/contact UI added | The variant adds no help or contact mechanism. |
| 16 | 3.3.1 Error Identification | N/A — no error-producing form | Search no-result feedback is plain-text status, not a form error; no validation-error state is introduced. |
| 17 | 3.3.7 Redundant Entry | N/A — no multi-step entry flow | The search is a single field and does not request repeated data. |
| 18 | 3.3.8 Accessible Authentication | N/A — no authentication flow | No authentication UI is introduced. |
| 19 | 4.1.2 Name, Role, Value | Pass | The visible “Search all PDF tools” label names the Input; the theme button exposes a stable name and `aria-pressed`; navigation and actions use native links/buttons. |
| 20 | 4.1.3 Status Messages | Pass | Search results announce “1 matching tools” and “No tools found. Try another search.” through a `role="status"` polite live region. |

Automated axe/WAVE scanning remains **pending**: neither `window.axe` nor the WAVE extension toolbar was available in the local browser session. No zero-violation result is claimed.

### G) Regression and self-verification

| Check | Result | Evidence |
|---|---|---|
| Existing suite before implementation | 352/352 passed | Recorded pre-change run; 1,198.2876ms. |
| Existing suite plus variant tests | 358/358 passed | `npm.cmd test`; 1,433.2275ms. |
| Variant-focused tests | 6/6 passed | `tests/variantScannableGrid.test.mjs`; covers preview gating, one H1/main, tokens/primitives, category links, target sizing, hover classes, and the mobile action. |
| Production build | Passed | `npm.cmd run build`; existing `buffer` externalization and >500kB chunk warnings remain. The variant/harness are intentionally absent from the production bundle. |
| Browser preview | Passed for measured states | Local Chromium checked eight responsive widths, 48px/16px search sizing, target dimensions, landmarks, theme state/persistence, search results, focus visibility, target overlap, input-border contrast, and a text-spacing override. |
| axe/WAVE and Lighthouse | Pending human scan | Browser automation had neither axe nor WAVE injected. Lighthouse on the Vite development server is diagnostic, not representative of a production build; collect the requested output and repeat performance validation after final routing. |
| Existing app source scope | Passed | `App.jsx` adds only the development-only `?preview=v1` branch; the `/` route, `Home.jsx`, `ToolSearch.jsx`, and existing tools/routes remain unchanged. |

**Status: In Progress — awaiting user input.** The variant remains unrouted as required. Do not mark Ready for Review until a human supplies an axe DevTools or WAVE scan for the preview and the zero critical/serious requirement is confirmed.

## Task 4.1 — Variant 2 (Bold Editorial)

### A) Design rationale and reference interpretation

Variant 2 is a more expressive, editorial direction for people who want to understand the breadth of the PDF toolbox before choosing a task. A layered brand-blue hero, oversized composite headline, numbered process strip, and asymmetrical category panels create stronger visual rhythm than Variant 1's compact directory.

The Stripe reference informed the deliberate hierarchy, restrained multi-stop gradient, and blue-tinted elevation. The Framer reference informed the oversized display scale, assertive contrast, and product-forward presentation. These are high-level cues only: this implementation uses the project's Task 2.1 color, type, spacing, radius, and shadow tokens, with no reference-site layout, artwork, proprietary fonts, or external design assets copied.

The headline, “Every PDF task, ready for its next chapter,” covers the tool collection; the supporting copy and trust proof state that tools work in the browser and files stay on the device. The wordmark remains replaceable through the `brandName` prop. No search field or dropdown is added.

### B) Components created

| Component | Responsibility |
|---|---|
| `src/components/VariantEditorial.jsx` | Variant shell, skip link, shared footer, and composition of the V2 sections. |
| `src/components/v2/V2Header.jsx` | Replaceable wordmark, section navigation, and the shared accessible theme control. |
| `src/components/v2/V2Hero.jsx` | Token-gradient hero, composite H1, privacy proof, tool-count badge, and “Explore All Tools” Button. |
| `src/components/v2/V2HowItWorks.jsx` | Ordered three-step visual strip with large icons. |
| `src/components/v2/V2ToolGrid.jsx` | Asymmetrical category panels containing rich interactive tool cards. |

`src/components/VariantEditorial.jsx` reuses `Footer`; V2 sections reuse the existing `Button`, `Card`, and `Badge` primitives. The footer wrapper applies theme-aware surface tokens and ensures visible footer links and controls meet the project's 44px target minimum.

### C) Registry fidelity and preview isolation

- The five category panels are generated from `TOOL_CATEGORIES`; each panel filters `TOOL_REGISTRY` by its registry category id.
- All 18 registry tools render exactly once. Their icon component, name, description, and `path` are read directly from the registry; no V2 tool list or invented label is maintained.
- Each tool is a complete interactive `Card`, not a bare text link. The hero CTA points to the tool directory; there is no search/dropdown interaction.
- `App.jsx` preserves the existing `/` → `Home` route and existing V1 preview branch. V2 is selected only for `?preview=v2` in development or when a separate build explicitly sets `VITE_ENABLE_V2_PREVIEW=true`. The opt-in preview build is not the normal deployment build.
- V1 component files and `VariantScannableGrid.jsx` were not changed.

### D) Responsive and browser verification

| Width | Observed behavior |
|---:|---|
| 320 | Stacked hero, process cards, and tool cards; no horizontal overflow. |
| 375 | Stacked content; no horizontal overflow. |
| 414 | Stacked content; no horizontal overflow. |
| 768 | Process strip and category tool cards begin using multi-column layouts; no horizontal overflow. |
| 1024 | Asymmetric category grid is active; no horizontal overflow. |
| 1280 | Spacious category grid and full hero composition; no horizontal overflow. |
| 1440 | Content remains within the 1440px container; no horizontal overflow. |
| 1920 | Container remains capped and centered; no horizontal overflow. |

Production-preview browser checks confirmed one H1, five category panels, 18 tool cards, no search fields, zero horizontal overflow, and no visible link/button targets below 44×44px at all eight widths. The theme button changed `aria-pressed` from false to true in-browser. Loading `/` without `?preview=v2` displayed the existing “Powerful PDF Tools” homepage and not the V2 hero.

### E) WCAG 2.2 evidence

| # | Criterion | Result | Evidence |
|---:|---|---|---|
| 1 | 1.3.1 Info and Relationships | Pass | Native header, navigation, one main landmark, labelled sections, category headings, and ordered three-step list. |
| 2 | 1.4.3 Text Contrast | Pass for documented token pairs | Contrast calculated from the Task 2.1 token values: light hero heading at least 6.41:1 and supporting text at least 5.50:1 across the gradient; dark hero heading at least 9.90:1 and supporting text at least 8.40:1. Body/card foregrounds use the documented surface token pairs. |
| 3 | 1.4.4 Resize Text | Pending | No 200% browser zoom/text-resize check was performed for this variant. |
| 4 | 1.4.10 Reflow | Pass | Production-preview browser reported no horizontal overflow at 320, 375, 414, 768, 1024, 1280, 1440, or 1920px. |
| 5 | 1.4.11 Non-text Contrast | Partial | Focus ring uses the Task 2.1 focus token; full rendered-state boundary/icon contrast scan was not performed. |
| 6 | 1.4.12 Text Spacing | Pending | No text-spacing override test was performed for this variant. |
| 7 | 2.1.1 Keyboard | Partial | Actions are native links/buttons and use shared focus primitives; a full manual keyboard pass was not performed. |
| 8 | 2.1.2 No Keyboard Trap | Pass | No modal, custom focus trap, or non-native keyboard interaction is introduced. |
| 9 | 2.4.1 Bypass Blocks | Pass by source | “Skip to PDF tools” links directly to the tool-grid section. |
| 10 | 2.4.3 Focus Order | Pass by DOM order | Focusable items follow skip link, header, hero action, sections, tool cards, and footer in document order. |
| 11 | 2.4.7 Focus Visible | Pass by primitive usage | Shared `Button` and interactive `Card` apply `FocusRing`; navigation and skip links have visible focus styles. |
| 12 | 2.4.11 Focus Not Obscured | Pass by layout | No fixed overlay or sticky control is added; interactive cards remain in document flow. |
| 13 | 2.5.3 Label in Name | Pass | Theme control's stable accessible name is “Dark mode”; its visible desktop label is also “Dark mode”. |
| 14 | 2.5.8 Target Size Minimum | Pass | Browser measured visible links and buttons at or above 44×44px across the eight widths. |
| 15 | 3.2.6 Consistent Help | N/A — no help UI added | This variant adds no help mechanism. |
| 16 | 3.3.1 Error Identification | N/A — no form or error state | The variant introduces no input or validation flow. |
| 17 | 3.3.7 Redundant Entry | N/A — no data-entry flow | The variant introduces no repeated data-entry flow. |
| 18 | 3.3.8 Accessible Authentication | N/A — no authentication flow | No authentication UI is introduced. |
| 19 | 4.1.2 Name, Role, Value | Pass | Native headings, links, ordered list, and Button semantics; theme toggle exposes `aria-pressed`. |
| 20 | 4.1.3 Status Messages | N/A — no dynamic status | No asynchronous status or result message is introduced. |

Automated axe/WAVE and Lighthouse scans were not run; no zero-violation or performance score is claimed.

### F) Regression and build evidence

| Check | Result | Evidence |
|---|---|---|
| Full tests before implementation | 359/359 passed | `npm.cmd test`; baseline before the Task 4.1 regression test and implementation. |
| Full tests after implementation | 363/363 passed | `npm.cmd test`; 0 failed. |
| V2-focused tests | 4/4 passed | `tests/variantEditorial.test.mjs`; preview gate/default route, hero, process strip, registry-derived cards, and footer target classes. |
| Production build | Passed | PowerShell temporarily set `$env:VITE_ENABLE_V2_PREVIEW='true'` around `npm.cmd run build`, then cleared it; existing `buffer` externalization and >500kB chunk warnings remain. Main JS output: 1,008.70 kB. |
| Production preview | HTTP 200 | `npm.cmd run preview -- --host 127.0.0.1 --port 4174 --strictPort`; `http://127.0.0.1:4174/?preview=v2`. |
| Whitespace validation | Passed | `git diff --check`. |

### G) Alternatives considered and rejected

- Adding another search dropdown — rejected because this direction explicitly uses one prominent CTA and avoids complex search interaction.
- Hand-maintaining category/tool lists — rejected because it can drift from `toolRegistry.js`; categories and all 18 cards are registry-derived.
- Using a full-bleed single-color black canvas and competitor-like screenshots — rejected in favor of project tokens, an original editorial grid, and non-interactive abstract document geometry.
- Enabling V2 in every production build — rejected; the explicit `VITE_ENABLE_V2_PREVIEW` opt-in is required for a separate production-preview build, while the ordinary homepage remains unchanged.

## Task 5.1 — Variant 3 (Apple Bento Box)

### A) Read evidence and design direction

- Reviewed Task 2.1 design tokens and Task 1.2 preservation requirements in this file, plus `docs/status.md` and `docs/PROJECT-TRACKER.md`.
- Reviewed the Apple and Notion design-template references for high-level cues: warm restraint, tactile surfaces, clear hierarchy, and purposeful asymmetry. No reference layout, artwork, or proprietary visual assets were copied.
- Inspected `src/components/toolRegistry.js`, `src/components/ui/`, and the existing V1/V2 preview branches in `src/App.jsx` before implementation.
- Followed the workspace project instructions and status; no `.github/` file was modified.

Variant 3 is a light-first, document-centered direction for users who want to browse by task. Its soft token gradient, generous editorial hero, and asymmetrical category panels distinguish it from the compact V1 directory and the high-contrast V2 composition. The wordmark is passed as a replaceable `brandName` prop; the hero keeps the all-tools promise and prominent on-device privacy proof.

The hero's document shapes are decorative, static, and hidden from assistive technology. There is no above-the-fold animation, ad slot, or search control.

### B) Components created

| Component | Responsibility |
|---|---|
| `src/components/VariantBento.jsx` | Preview shell, skip link, replaceable composition, shared Footer, and theme props. |
| `src/components/v3/V3Header.jsx` | Replaceable wordmark, section navigation, shared Button theme control, and focus treatment. |
| `src/components/v3/V3Hero.jsx` | Single composite H1, privacy Badge and proof, primary shared Button, and static decorative illustration. |
| `src/components/v3/V3BentoGrid.jsx` | Registry-derived category panels and complete interactive Card links. |

### C) Bento layout and registry fidelity

The 12-column desktop composition gives Organize seven columns, Convert five, Edit & Sign five, Protect & Repair four, and Extract three. This makes Organize the largest collection and Extract the smallest without a manually duplicated tool mapping. At tablet and mobile widths the grid collapses to two columns or one stacked column.

`V3BentoGrid` maps `TOOL_CATEGORIES` and filters `TOOL_REGISTRY` by each category id. Every rendered tool uses the registry's actual icon, name, description, and `path`; the preview renders all five categories and all 18 tools. Missing layout metadata throws instead of silently omitting a category.

The category panels and tool cards use the existing 28px `rounded-2xl` radius token. This follows the user's resolution of the requested 24px radius in favor of the existing design-system token; no new radius or palette token was introduced. Shared `Card`, `Badge`, and `Button` primitives are reused.

### D) Preview isolation

`src/App.jsx` selects V3 only when `?preview=v3` is present and either the app is in development or the production build explicitly sets `VITE_ENABLE_V3_PREVIEW=true`. The ordinary `/` route remains `Home`; a production preview build is not the normal deployment artifact. Existing V1 and V2 source files were not edited.

### E) Responsive behavior

Production-preview browser checks found no horizontal overflow and no undersized visible interactive targets at each viewport. The category layout uses a single column below `md`, two columns at `md`, and the asymmetrical 12-column composition at `lg`.

| Width | Behavior |
|---:|---|
| 320 | Stacked hero and categories; tool cards remain single-column; skip link becomes a 44px-high visible target on focus. |
| 375 | Stacked, compact card layout; no horizontal overflow. |
| 414 | Stacked layout with the same single-column tool list; no horizontal overflow. |
| 768 | Two-column category directory; no horizontal overflow. |

| Width | Behavior |
|---:|---|
| 1024 | Asymmetrical 12-column grid begins; Organize is the largest panel. |
| 1280 | Spacious 12-column editorial composition within the 1440px container. |
| 1440 | 1440px maximum container and generous outer padding. |
| 1920 | Container remains capped and centered; no horizontal overflow. |

Browser verification at 320, 375, 414, 768, 1024, 1280, 1440, and 1920px measured equal document and client widths (no horizontal overflow). It also confirmed one H1, five category panels, 18 tool cards, 28px hero/category/tool-card radii, 44px minimum focused skip-link height, the hover translation and brand border, theme toggle state change, and fallback to the existing homepage at `/`. The production preview emitted no captured browser console errors or warnings.

### F) WCAG 2.2 evidence

| # | Criterion | Result | Evidence |
|---:|---|---|---|
| 1 | 1.3.1 Info and Relationships | Pass by source | Native header, nav, main, labelled hero and tool sections, category headings, and one H1. |
| 2 | 1.4.3 Contrast (Minimum) | Pending measurement | Named foreground/surface tokens are used; no contrast calculation or axe/WAVE scan was run for V3. |
| 3 | 1.4.4 Resize Text | Not tested | No 200% resize or browser text-zoom test was performed. |
| 4 | 1.4.10 Reflow | Pass for tested widths | Production preview had no horizontal overflow at all eight required viewport widths. |
| 5 | 1.4.11 Non-text Contrast | Pending measurement | Focus ring and icon/surface tokens are used; rendered contrast ratios were not measured. |
| 6 | 1.4.12 Text Spacing | Not tested | No text-spacing override was run for V3. |
| 7 | 2.1.1 Keyboard | Partial | Native anchors and buttons plus shared focus primitives are used; only skip-link focus and its visible ring were browser-checked, not a full traversal. |
| 8 | 2.1.2 No Keyboard Trap | Pass by source | No modal, focus trap, or custom keyboard widget is introduced. |
| 9 | 2.4.1 Bypass Blocks | Pass | “Skip to PDF tools” targets the tool section and expands visibly on focus. |
| 10 | 2.4.3 Focus Order | Pass by DOM order | Focus sequence follows skip link, header, hero action, category tool links, and footer. |
| 11 | 2.4.7 Focus Visible | Partial | Shared `FocusRing` is applied to header links, theme Button, and interactive Cards; the skip-link focus ring was observed, but every control was not individually tested. |
| 12 | 2.4.11 Focus Not Obscured (Minimum) | Pass by layout | No fixed overlay or sticky control is added; interactive content remains in normal flow. |
| 13 | 2.5.3 Label in Name | Pass by source | The theme control keeps the accessible name “Dark mode”; its desktop visible label matches. |
| 14 | 2.5.8 Target Size (Minimum) | Pass for tested states | Browser found no undersized visible controls across eight widths; the focused skip link measures 124×44px. |
| 15 | 3.2.6 Consistent Help | N/A — no help UI | Variant 3 adds no help mechanism. |
| 16 | 3.3.1 Error Identification | N/A — no validation flow | Variant 3 adds no form or input validation. |
| 17 | 3.3.2 Labels or Instructions | N/A — no data-entry controls | The variant adds no form fields. |
| 18 | 3.3.7 Redundant Entry | N/A — no data-entry flow | The variant adds no user data-entry task. |
| 19 | 4.1.2 Name, Role, Value | Pass by source | Navigation uses native links; the theme control is a shared Button with a stable accessible name and `aria-pressed`. |
| 20 | 4.1.3 Status Messages | N/A — no dynamic status UI | The variant does not create status or result messages. |

Automated axe/WAVE and Lighthouse scans were not run; this section does not claim zero violations or a Lighthouse score.

### G) Alternatives considered and rejected

- A symmetric equal-size category grid — rejected because the task calls for deliberate asymmetry and a visibly larger Organize collection.
- Hand-maintained tool lists or link paths — rejected because they could drift; registry data is the single source of truth.
- Hard-coded 24px corners — rejected after the user's decision to keep the existing 28px radius token.
- Enabling V3 in every production build — rejected; production preview requires the explicit `VITE_ENABLE_V3_PREVIEW=true` opt-in.
- Animated hero decoration — rejected to preserve the no-above-fold-animation and reduced-motion-safe direction.

### H) Regression and build evidence

| Check | Result | Evidence |
|---|---|---|
| Full tests before implementation | 363/363 passed | Full suite run before adding the V3 test and implementation. |
| Full tests after implementation | 367/367 passed | `npm.cmd test`; 0 failed. |
| V3-focused tests | 4/4 passed | `tests/variantBento.test.mjs`; preview isolation, hero primitives and trust proof, registry-driven grid, and theme/footer behavior. |
| Production build | Passed with existing warnings | Built with `VITE_ENABLE_V3_PREVIEW=true`; the existing `buffer` externalization and >500kB chunk warnings remain. Main JS asset: 1,006.51 kB. |
| Production preview | Browser verified | `http://127.0.0.1:4175/?preview=v3`; opt-in build, eight responsive widths, default-home fallback, theme control, hover state, and no captured console errors/warnings. |
| Whitespace validation | Passed | `git diff --check`. |

## Task 6.1 — Variant 4 (Command Center)

### A) Read evidence and design direction

- Reviewed the Raycast and Superhuman template references for dark command surfaces, keyboard-first search, and restrained accent glow. No reference layout, logo, or proprietary visual assets were copied.
- Reviewed `src/components/toolRegistry.js`, `src/components/ui/`, Task 2.1 design tokens, Task 1.2 preservation requirements, `docs/status.md`, and `docs/PROJECT-TRACKER.md`.
- The variant uses a centered black command surface, a single large labelled search field, compact registry-derived tool cards, a bright blue accent, and monospace metadata. The blue is locally set to `#3B82F6` so it remains legible even when the global theme is dark.
- The hero and all cards retain the composite tool-discovery message and visible on-device privacy proof. The brand label remains replaceable through the `brandName` prop.

### B) Components and behavior

| Component | Responsibility |
|---|---|
| `src/components/VariantCommandCenter.jsx` | Isolated preview shell, skip link, layout, and footer. |
| `src/components/v4/CommandHeader.jsx` | Replaceable wordmark, privacy indicator, and anchor navigation. |
| `src/components/v4/CommandSearch.jsx` | Labelled search input, live result count, Cmd/Ctrl+K, Escape, ArrowDown, and first-result Enter navigation. |
| `src/components/v4/CommandToolGrid.jsx` | Registry-derived category groups and tool cards. |
| `src/components/v4/searchTools.mjs` | Shared all-registry filtering and ranking by exact/name-prefix relevance. |

`searchTools` searches each registry tool's name, description, keywords, and category. The grid preserves the exact registry icon, name, description, and `path` for every link; all five categories and 18 tools render when the query is empty. The result count and no-results response are status messages.

Tool, wordmark, and footer destinations use native full-page links. This is intentional: it exits the opt-in preview branch and lets the existing app route render instead of leaving the preview mounted after client-side navigation. The search Enter key follows the same path.

### C) Preview isolation

`src/App.jsx` selects V4 only for `?preview=v4` in development or when a production build opts in with `VITE_ENABLE_V4_PREVIEW=true`. The default `/` route remains the existing Home page. Do not deploy the opt-in preview build as the normal production artifact.

Production preview: `http://127.0.0.1:4176/?preview=v4`

### D) Responsive and interaction evidence

The production preview rendered one H1, five category groups, and 18 tool links. Browser checks at the listed widths found `scrollWidth === clientWidth` and no visible link, button, or input target below 44px.

| Width | Observed behavior |
|---:|---|
| 320 | Single-column cards; no horizontal overflow or undersized visible controls. |
| 375 | Single-column cards; no horizontal overflow or undersized visible controls. |
| 414 | Single-column cards; no horizontal overflow or undersized visible controls. |
| 768 | Two-column tool cards; no horizontal overflow or undersized visible controls. |
| 1024 | Two-column tool cards; no horizontal overflow or undersized visible controls. |
| 1280 | Three-column tool cards in the centered layout; no horizontal overflow. |
| 1440 | Three-column tool cards within the 1440px maximum container. |
| 1920 | Container remains capped; no horizontal overflow. |

Keyboard checks confirmed the search field's accessible name, Cmd/Ctrl+K focus, Escape clearing, ArrowDown focus to the first result, and Enter selection. Searching `ocr` ranked OCR PDF first, followed by PDF ↔ Word; Enter loaded the real `/ocr-pdf` route. Loading `/` separately rendered the unchanged Home H1.

### E) WCAG 2.2 evidence

| # | Criterion | Result | Evidence |
|---:|---|---|---|
| 1 | 1.3.1 Info and Relationships | Pass by source | Native header, navigation, main, labelled search section, five named category sections, lists, and one H1. |
| 2 | 1.4.3 Contrast (Minimum) | Pass for used text colors | Browser-measured ratios: white on `#0A0A0A` 19.80:1; `#D4D4D4` on `#0A0A0A` 13.36:1; `#3B82F6` on `#0A0A0A` 5.38:1. |
| 3 | 1.4.4 Resize Text | Pass for emulated 200% text | At 640px with the root font size doubled, the document had no horizontal overflow. |
| 4 | 1.4.10 Reflow | Pass for tested widths | No horizontal overflow at 320, 375, 414, 768, 1024, 1280, 1440, or 1920px. |
| 5 | 1.4.11 Non-text Contrast | Pass for primary boundaries and focus | Search border on its surface measured 5.13:1; 80%-opacity card border composited on its surface measured 3.67:1. The solid accent focus outline is 5.38:1 on the page background. |
| 6 | 1.4.12 Text Spacing | Pass for tested override | At 640px with 1.5 line height, 0.12em letter spacing, 0.16em word spacing, and doubled paragraph spacing, visible content had no horizontal overflow or clipped content. The intentionally visually hidden skip link and label remain screen-reader accessible. |
| 7 | 2.1.1 Keyboard | Partial | Cmd/Ctrl+K, Escape, ArrowDown, and Enter were exercised; a complete traversal of every link was not performed. |
| 8 | 2.1.2 No Keyboard Trap | Pass by source | No modal, focus trap, or custom keyboard widget is introduced; native links and input remain in normal tab order. |
| 9 | 2.4.1 Bypass Blocks | Pass | “Skip to command center” targets `#command-main` and becomes visible on focus. |
| 10 | 2.4.3 Focus Order | Pass by DOM order | Focus order follows the skip link, header, search, tool links, and footer; search-to-result movement was keyboard-tested. |
| 11 | 2.4.7 Focus Visible | Pass | Keyboard Tab to search showed a solid brand-blue outline. Source uses `focus-visible:outline-2`; the integrated browser reported a 1.6px computed outline. |
| 12 | 2.4.11 Focus Not Obscured (Minimum) | Pass by layout | No fixed overlay or sticky control covers focused content. |
| 13 | 2.5.7 Dragging Movements | N/A — no drag interaction | The command center adds no drag-only operation. |
| 14 | 2.5.8 Target Size (Minimum) | Pass for tested widths | Browser found zero visible anchors, buttons, or inputs below 44px at all eight responsive widths. |
| 15 | 3.2.6 Consistent Help | N/A — no help UI | The variant adds no help mechanism. |
| 16 | 3.3.1 Error Identification | N/A — no validation flow | The search field filters results and introduces no form validation errors. |
| 17 | 3.3.7 Redundant Entry | N/A — no multi-step data-entry flow | The variant collects no data for later re-entry. |
| 18 | 3.3.8 Accessible Authentication | N/A — no authentication | The variant adds no authentication flow. |
| 19 | 4.1.2 Name, Role, Value | Pass by source | Search has a visible label and searchbox role; tool cards and navigation use named native links. |
| 20 | 4.1.3 Status Messages | Pass by source and interaction | The live result count and no-results message use `role="status"`; the search count updates when typing. |

axe/WAVE and Lighthouse were not run for V4. The keyboard test was focused, not a full manual traversal; no zero-violation claim is made.

### F) Design decisions and rejected alternatives

- Centered command palette → fits the keyboard-first command-center direction; rejected a hero with a standard browse CTA because search is the primary interaction.
- Registry-derived cards → prevents fabricated or stale tool data; rejected manually curated card lists.
- Native full-page route links → guarantees preview-to-tool navigation exits V4; rejected client-side links that left the preview branch mounted.
- High-contrast full search border and 80% card border → preserves a subtle dark interface while meeting non-text contrast; rejected the original lower-contrast 30% border.
- Opt-in production flag → lets reviewers inspect V4 without replacing the existing homepage.

### G) Regression and build evidence

| Check | Result | Evidence |
|---|---|---|
| Full tests before implementation | 367/367 passed | Full-suite baseline before V4 implementation. |
| Full tests after implementation | 371/371 passed | `npm.cmd test`; 0 failed. |
| V4-focused tests | 4/4 passed | `tests/variantCommandCenter.test.mjs`; preview isolation, search keyboard behavior, registry links, and dark palette/focus rules. |
| Production build | Passed with existing warnings | Built with `VITE_ENABLE_V4_PREVIEW=true`; `buffer` externalization and >500kB chunk warnings remain. Main JS asset: 1,005.18 kB. |
| Production preview | Browser verified | `http://127.0.0.1:4176/?preview=v4`; 18 tools, eight widths, search ranking, real OCR route, and unchanged default homepage. |
| Whitespace validation | Passed | `git diff --check`. |

## Task status

**Ready for Review.** Human accessibility-tool and Lighthouse scans remain outstanding; do not treat them as completed or infer results from the browser checks.

## Task 7.1 — Variant 5 (Vibrant Consumer)

### A) Read evidence and design direction

- Reviewed the Spotify and Airbnb template references for high-level cues: warm welcoming tone, colorful surfaces, bold hierarchy, and rounded consumer-friendly cards. No competitor layout, artwork, proprietary assets, or copy was reproduced.
- Reviewed `docs/inventory.md`, `src/components/toolRegistry.js`, `src/components/ui/`, Task 1.2 preservation requirements, Task 2.1 tokens, the existing app route and theme behavior, `docs/status.md`, and `docs/PROJECT-TRACKER.md`.
- The light-first layout uses a soft background, pastel category panels, an editorial hero, and a compact 1/2/3-column directory. It preserves the app's existing theme preference and header toggle rather than forcing a theme change.
- The hero has one H1, a labelled 56px search field, a direct tools CTA, and no above-the-fold ad slot. The explanatory section below the tool directory contains three substantive paragraphs and three supporting content cards; the existing `AdSlot` follows that content.

### B) Components and registry fidelity

| Component | Responsibility |
|---|---|
| `src/components/VariantVibrant.jsx` | Isolated preview composition, skip link, shared Footer, and below-content AdSlot. |
| `src/components/v5/VibrantHeader.jsx` | Replaceable wordmark, browse link, and theme toggle. |
| `src/components/v5/VibrantHero.jsx` | Single H1, primary CTA, supporting trust copy, and search placement. |
| `src/components/v5/VibrantSearch.jsx` | Accessible live search, result panel, keyboard handling, and route selection. |
| `src/components/v5/VibrantToolDirectory.jsx` | Registry-derived five-category grid and category navigation. |
| `src/components/v5/VibrantToolCard.jsx` | Interactive tool card using the exact registry icon, name, description, and path. |
| `src/components/v5/VibrantWhy.jsx` | Three long-form paragraphs and three supporting explanatory cards. |
| `src/components/v5/vibrant.css` | V5-only shared-footer sizing and theme styling. |

The directory filters `TOOL_REGISTRY` by each `TOOL_CATEGORIES` entry and renders all 18 tools. Tool links use `tool.path`; visible card labels and descriptions use the raw registry fields. The search checks registry names, descriptions, keywords, and category names; `pdf` produced all 18 results, and `ocr` Enter navigation opened `/ocr-pdf`.

The shared `ToolCard` and `ToolSearch` components localize their displayed data and use a different expanding-search presentation. To preserve the task's exact registry-copy requirement and persistent large search input, V5 uses the shared `Card` and `Input` primitives with V5 presentation. It reuses the existing registry-only `searchTools` helper rather than maintaining a second filtering/ranking implementation.

### C) Preview isolation

`src/App.jsx` selects V5 only for `?preview=v5` in development or when a production build opts in with `VITE_ENABLE_V5_PREVIEW=true`. The default `/` route remains the existing Home page. Browser navigation to `/ocr-pdf` exited the preview and rendered the existing tool page.

Production preview: `http://127.0.0.1:4177/?preview=v5`

### D) Responsive and interaction evidence

The production preview rendered exactly one H1, five categories, and 18 tool cards. At 320px, the 16px search input measured 56px high; the result panel was absolute, `z-index: 50`, and within the viewport. Searching `pdf` returned 18 results, clicking outside closed the panel, and Enter on `ocr` opened the existing `/ocr-pdf` tool. Loading `/` without the preview flag rendered the unchanged Home H1, “Powerful PDF Tools.”

| Width | Observed behavior |
|---:|---|
| 320 | One-column category grid; no horizontal overflow; zero visible controls below 44px. |
| 375 | One-column category grid; no horizontal overflow; zero visible controls below 44px. |
| 414 | One-column category grid; no horizontal overflow; zero visible controls below 44px. |
| 768 | Two-column category grid; no horizontal overflow; zero visible controls below 44px. |
| 1024 | Two-column category grid; no horizontal overflow; zero visible controls below 44px. |
| 1280 | Three-column category grid; no horizontal overflow; zero visible controls below 44px. |
| 1440 | Three-column grid in the maximum-width container; no horizontal overflow. |
| 1920 | Three-column grid remains centered within the 1440px maximum-width container; no horizontal overflow. |

Browser keyboard checks reached the skip link, wordmark, header controls, primary CTA, labelled search input, category link, and a tool card in DOM order. The tool card has a visible brand focus outline; search supports Escape, Enter, and outside-click dismissal. A full manual keyboard traversal was not performed.

### E) WCAG 2.2 evidence

| # | Criterion | Result | Evidence |
|---:|---|---|---|
| 1 | 1.3.1 Info and Relationships | Pass by source and browser | Header, named navigation, one `main`, one H1, H2/H3 section hierarchy, named category sections, and tool lists render in the DOM. |
| 2 | 1.4.3 Contrast (Minimum) | Pass for observed visible text | Browser-computed visible text and search-placeholder contrast had no sample below 4.5:1; minimum was 4.76:1 in light mode and 6.64:1 in dark mode. This was not an axe/WAVE scan. |
| 3 | 1.4.4 Resize Text | Not tested | No 200% text-resize browser check was performed for this variant. |
| 4 | 1.4.10 Reflow | Pass for tested widths | No horizontal overflow at 320, 375, 414, 768, 1024, 1280, 1440, or 1920px. |
| 5 | 1.4.11 Non-text Contrast | Partial | Input boundaries and keyboard focus are visible; a complete 3:1 audit of every icon, boundary, and state was not performed. |
| 6 | 1.4.12 Text Spacing | Not tested | No text-spacing override bookmarklet/browser check was performed. |
| 7 | 2.1.1 Keyboard | Partial | Tab reached the first eight focusable controls; search Escape, Enter, and result navigation were exercised. Complete control-by-control keyboard traversal remains unverified. |
| 8 | 2.1.2 No Keyboard Trap | Pass by source | No modal or focus-trap widget is added; the search and results use a normal input and links. |
| 9 | 2.4.1 Bypass Blocks | Pass | The first Tab stop is “Skip to main content,” linking to `#main-content`. |
| 10 | 2.4.3 Focus Order | Partial | The first eight Tab stops follow the DOM order from skip link through the first tool card; the rest of the page was not traversed. |
| 11 | 2.4.7 Focus Visible | Pass for sampled controls | Keyboard focus on the skip link, header, CTA, input, category link, and tool card displayed an outline or focus-ring shadow; the tool card's outline was measured at 1.6px computed width. |
| 12 | 2.4.11 Focus Not Obscured (Minimum) | Pass by layout | No fixed or sticky overlay is introduced; the search dropdown appears below the input and remains viewport-contained at 320px. |
| 13 | 2.5.7 Dragging Movements | N/A — no drag-only interaction | The variant adds no drag interaction. |
| 14 | 2.5.8 Target Size (Minimum) | Pass for tested widths | Browser found zero visible links, buttons, inputs, or selects below the project's 44px target at all eight responsive widths. |
| 15 | 3.2.6 Consistent Help | N/A — no new help UI | The variant adds no help mechanism; the existing shared Footer remains in use. |
| 16 | 3.3.1 Error Identification | N/A — no validation flow | Search is not a submission form; unmatched queries are described in text rather than by color alone. |
| 17 | 3.3.7 Redundant Entry | N/A — no multi-step data-entry flow | The variant introduces no repeated data-entry step. |
| 18 | 3.3.8 Accessible Authentication | N/A — no authentication | The variant introduces no authentication flow. |
| 19 | 4.1.2 Name, Role, Value | Pass by source and browser | Search has a visible label and searchbox role; theme toggle exposes its pressed state; tool cards and navigation use native named links. |
| 20 | 4.1.3 Status Messages | Pass by source and interaction | Search result count and no-results copy use `role="status"`; typing updates the result count. |

### F) Design decisions

- Warm pastel category grid and large friendly search → makes tool discovery approachable and scan-dense on mobile; rejected a dark technical palette and a horizontal-only category carousel that would hide tools offscreen.
- 24px V5 surface corners → follows this task's explicit radius requirement; applied only within V5 rather than changing the site's shared 28px radius token.
- Registry-exact cards and existing `searchTools` helper → prevent invented or localized tool data and avoid duplicate search filtering; rejected reusing `ToolCard`/`ToolSearch` presentation because they localize labels and use a different search interaction.
- Below-directory explanatory content → places substantive SEO/AdSense copy after the tools and away from the hero CTA; rejected an above-the-fold ad container or placeholder ad copy.
- Opt-in production flag → enables review without replacing the default homepage.

### G) Regression and build evidence

| Check | Result | Evidence |
|---|---|---|
| Full tests before implementation | 371/371 passed | Full-suite baseline before Task 7.1. |
| Full tests after implementation | 371/371 passed | Final `npm.cmd test`; 0 failed. |
| Production build | Passed with existing warnings | Built with `VITE_ENABLE_V5_PREVIEW=true`; existing `buffer` externalization and >500kB chunk warnings remain. Main JS asset: 1,013.31 kB (344.48 kB gzip); PDF worker: 1,375.83 kB. |
| Production preview | Browser verified | `http://127.0.0.1:4177/?preview=v5`; exact tool count, eight widths, search, OCR navigation, computed 24px hero/category/tool/search/content surfaces, focus indicator, and unchanged default homepage verified. |
| Whitespace validation | Passed | `git diff --check`. |

axe/WAVE and Lighthouse were not run. The browser and computed-style checks provide the evidence above but do not substitute for those external scans.

### H) Task status

**Ready for Review.** The opt-in preview is available for human review; Lighthouse and axe/WAVE evidence remain outstanding.

## Task 8.1 — Variant 6 (Light Editorial Bento Box)

### A) Read evidence and design direction

- Reviewed `docs/PROJECT-TRACKER.md`, `docs/status.md`, `docs/inventory.md`, `src/components/toolRegistry.js`, the shared `Footer` and `AdSlot`, the existing search helper, and `src/App.jsx`.
- Built a warm, light-only editorial surface with a split-screen hero and abstract document illustration. The asymmetric desktop bento gives Organize a 2×2 area, Convert a tall area, Edit and Extract compact areas, and Protect a wide area; Tablet uses two columns and mobile stacks the collections.
- The V6 wrapper uses `data-theme="light"` and locally scoped light tokens. Its search input explicitly overrides the site's root-level dark input rule so the control remains white with dark text when the global document theme is dark.
- The long-form “Why Choose Us” article follows the tools, has a logical H2, and precedes the reused `AdSlot`; no ad slot is placed above the fold.

### B) Components and registry fidelity

| Component | Responsibility |
|---|---|
| `src/components/VariantEditorialLight.jsx` | Isolated V6 composition, forced-light wrapper, semantic main, shared footer, and below-content AdSlot. |
| `src/components/v6/EditorialLightHeader.jsx` | V6 wordmark, browse navigation, and privacy note. |
| `src/components/v6/EditorialLightHero.jsx` | Single H1, supporting copy, search placement, CTA, and abstract document illustration. |
| `src/components/v6/EditorialLightSearch.jsx` | Labelled search, live result count, registry-helper results, Escape/outside-click dismissal, and keyboard navigation. |
| `src/components/v6/EditorialLightBento.jsx` | Asymmetric five-category layout populated from `TOOL_CATEGORIES` and `TOOL_REGISTRY`. |
| `src/components/v6/EditorialLightWhy.jsx` | Editorial explanatory section with three paragraphs. |
| `src/components/v6/editorial-light.css` | V6-only responsive layout, fixed-light palette, focus styles, and shared-footer sizing. |

All 18 tool cards use the exact registry icon, name, description, and `tool.path`. Searching `pdf` returned all 18 tools. Search results close on Escape and outside pointer interaction.

### C) Preview isolation

`src/App.jsx` gates `?preview=v6` to development or an explicitly enabled production build (`VITE_ENABLE_V6_PREVIEW=true`), and only at `/`. The default homepage and `/ocr-pdf` route were browser-checked and rendered without the V6 wrapper.

Production preview: `http://127.0.0.1:4178/?preview=v6`

### D) Responsive and interaction evidence

The production preview rendered one H1, five categories, and 18 tool cards. At each listed width the document had no horizontal overflow and no visible link, button, input, or select below 44×44px. The search field is 16px text; the abstract art remains visible.

| Width | Observed behavior |
|---:|---|
| 320 | One-column bento; no horizontal overflow or undersized visible controls. |
| 375 | One-column bento; no horizontal overflow or undersized visible controls. |
| 414 | One-column bento; no horizontal overflow or undersized visible controls. |
| 768 | Two-column bento; no horizontal overflow or undersized visible controls. |
| 1024 | Two-column bento; no horizontal overflow or undersized visible controls. |
| 1280 | Four-column asymmetric bento; no horizontal overflow or undersized visible controls. |
| 1440 | Four-column asymmetric bento in the maximum-width container; no horizontal overflow. |
| 1920 | Four-column asymmetric bento remains within the 1440px maximum-width container; no horizontal overflow. |

The production preview's first Tab stop was the skip link, with a solid 2.4px computed outline. The V6 input, placeholder, wrapper, article, and footer stayed light when the document root was set to dark. Search returned 18 matches for `pdf`; Escape and outside pointer interaction closed it. `/` continued to render “Powerful PDF Tools,” and `/ocr-pdf` rendered the existing OCR tool page.

### E) WCAG 2.2 evidence

| # | Criterion | Result | Evidence |
|---:|---|---|---|
| 1 | 1.3.1 Info and Relationships | Pass by source and browser | One semantic `main`, named navigation/search, one H1, ordered H2/H3 headings, named category sections, and tool lists render in the DOM. |
| 2 | 1.4.3 Contrast (Minimum) | Pass for sampled visible text | Browser-computed 126 visible text samples in simulated dark-root mode had a minimum of 5.59:1; the search placeholder measured 6.25:1 against white. Not an axe/WAVE scan. |
| 3 | 1.4.4 Resize Text | Not tested | No 200% text-resize browser check was performed. |
| 4 | 1.4.10 Reflow | Pass at tested widths | No horizontal overflow at 320, 375, 414, 768, 1024, 1280, 1440, or 1920px. |
| 5 | 1.4.11 Non-text Contrast | Partial | Search border and focus treatment are visible; a complete 3:1 review of all icons, boundaries, and states was not performed. |
| 6 | 1.4.12 Text Spacing | Not tested | No text-spacing override bookmarklet/browser check was performed. |
| 7 | 2.1.1 Keyboard | Partial | Skip-link focus, search Escape, and result navigation behavior were checked; full keyboard traversal of all controls remains unverified. |
| 8 | 2.1.2 No Keyboard Trap | Pass by source | No modal or focus-trap component is introduced; search and tool results use a normal input and links. |
| 9 | 2.4.1 Bypass Blocks | Pass | First Tab stop is “Skip to main content,” linking to `#v6-main`. |
| 10 | 2.4.3 Focus Order | Partial | The DOM places skip link, header, hero search/CTA, collections, article, and footer in reading order; a complete Tab-order traversal was not performed. |
| 11 | 2.4.7 Focus Visible | Partial | The first Tab stop showed a solid 2.4px outline; CSS provides focus-visible outlines for links, buttons, and inputs, but not every control was individually focused. |
| 12 | 2.4.11 Focus Not Obscured (Minimum) | Partial | No fixed or sticky overlay is introduced; the search results intentionally overlay content. Full focus-obscuration testing across all states remains outstanding. |
| 13 | 2.5.7 Dragging Movements | N/A — no drag-only interaction | V6 adds no dragging interaction. |
| 14 | 2.5.8 Target Size (Minimum) | Pass for tested widths | Browser found no visible link, button, input, or select below 44×44px at all eight responsive widths. |
| 15 | 3.2.6 Consistent Help | N/A — no new help mechanism | V6 reuses the site's shared footer and adds no separate help UI; cross-page help placement was not changed. |
| 16 | 3.3.1 Error Identification | N/A — no validation flow | Search is not a submission/validation form; unmatched queries are described with text. |
| 17 | 3.3.7 Redundant Entry | N/A — no repeated multi-step entry | V6 introduces no multi-step form or repeated data-entry flow. |
| 18 | 3.3.8 Accessible Authentication | N/A — no authentication | V6 introduces no authentication flow. |
| 19 | 4.1.2 Name, Role, Value | Pass by source and browser | Search has an associated label and searchbox role; tool/category destinations are native named links; clear-search is a labelled button. |
| 20 | 4.1.3 Status Messages | Pass by source and interaction | Search result count uses `role="status"` and updates with the query; the browser displayed 18 matching results for `pdf`. |

### F) Design decisions

- Split hero plus asymmetric bento → makes the page visibly editorial and gives key tool groups distinct spatial weight; rejected another equal-column card grid.
- Locally forced light palette → meets the explicit light-mode requirement without changing the app-wide theme; rejected changing the global theme or altering earlier variants.
- Registry-derived tool links and reused `searchTools` helper → preserves real tool data and existing search behavior; rejected hand-authored tool labels or a duplicate ranking implementation.
- Production opt-in preview gate → enables review while preserving the default homepage; rejected replacing the standard route.

### G) Regression and build evidence

| Check | Result | Evidence |
|---|---|---|
| Full tests before implementation | 371/371 passed | Pre-task V6 baseline recorded in the preceding task context. |
| Full tests after implementation | 371/371 passed | `npm.cmd test`; 0 failed, 0 skipped; 1,962.2211ms. |
| Production build | Passed with existing warnings | Built with `VITE_ENABLE_V6_PREVIEW=true`; `buffer` externalization and >500kB chunk warnings remain. Main JS: 1,023.73 kB (346.73 kB gzip); CSS: 239.15 kB (37.75 kB gzip); PDF worker: 1,375.83 kB. |
| Production preview | Browser verified | `http://127.0.0.1:4178/?preview=v6`; tool count, eight widths, forced-light colors under simulated dark root, search, OCR route, and unchanged default homepage verified. |
| Whitespace validation | Passed | `git diff --check`. |

Lighthouse and axe/WAVE were not run. The browser and computed-style checks do not substitute for those scans. Text resizing, text-spacing overrides, full keyboard traversal, and a complete non-text contrast review remain for human/accessibility review.

### H) Task status

**Ready for Review.** Production preview is opt-in and available at `http://127.0.0.1:4178/?preview=v6`; Lighthouse and axe/WAVE evidence remain outstanding.

## Task 9.1 — Variant 7 (Glassmorphism)

### A) Read evidence and design direction

- Reviewed `docs/PROJECT-TRACKER.md`, `docs/status.md`, `docs/inventory.md`, `src/App.jsx`, `src/components/toolRegistry.js`, the shared `ToolSearch`, `ToolCard`, `Footer`, and `AdSlot`, and the V6 component structure.
- Created a light, airy surface with pale blue, lavender, and pink gradients; translucent panels; 32px category-card corners; soft shadows; and blur. The hero is centered above floating collections rather than a strict bento layout.
- CSS is isolated in `src/components/v7/glass.css`; the preview wrapper sets `data-theme="light"` without changing the app-wide theme. No automatic or above-fold animation was added.
- The shared `AdSlot` remains after the tool directory and explanatory section. It remains governed by its existing configuration and is not placed near the hero or primary search.

### B) Components and registry fidelity

| Component | Responsibility |
|---|---|
| `src/components/VariantGlass.jsx` | V7 composition, skip link, semantic main, shared footer, and below-content AdSlot. |
| `src/components/v7/GlassHeader.jsx` | V7 wordmark and homepage collection navigation. |
| `src/components/v7/GlassHero.jsx` | Single H1, centered description, shared ToolSearch, and collection link. |
| `src/components/v7/GlassCollections.jsx` | Five collection panels and shared ToolCard links sourced from `TOOL_CATEGORIES` and `TOOL_REGISTRY`. |
| `src/components/v7/GlassPrinciples.jsx` | Three explanatory content cards below the tool directory. |
| `src/components/v7/glass.css` | V7-only glass surfaces, focus treatments, fixed-light colors, hover states, and responsive layout. |
| `src/App.jsx` | V7 preview import and root-only development/production-opt-in gate. |

The directory renders five categories and all 18 registered tools. ToolCard continues to use the registry's icons and paths and the site's existing language localization. Search behavior is provided by the shared ToolSearch; no tool workflow or route was recreated.
The hero, search, footer, and card surfaces remained light while the document root was set to dark during a browser check.

### C) Preview isolation

`src/App.jsx` enables `?preview=v7` in development or when a production preview build sets `VITE_ENABLE_V7_PREVIEW=true`. The preview is restricted to `/`. The production browser check confirmed that `/` without the query renders the existing “Powerful PDF Tools” homepage and that `/privacy?preview=v7` does not render V7.

Production preview: `http://127.0.0.1:4179/?preview=v7`

### D) Responsive and interaction evidence

The production preview rendered exactly one H1, five categories, and 18 tool cards. At each tested width, `document.documentElement.scrollWidth` equalled `clientWidth`; no visible link, button, input, or select was below 44×44px. The content container capped at 1440px at 1920px. Search opened from its shared trigger with a 16px input, returned one matching result for “merge,” and closed on Escape.

| Width | Observed behavior |
|---:|---|
| 320 | One-column cards; no horizontal overflow or visible targets below 44×44px. |
| 375 | One-column cards; no horizontal overflow or visible targets below 44×44px. |
| 414 | One-column cards; no horizontal overflow or visible targets below 44×44px. |

| Width | Observed behavior |
|---:|---|
| 768 | Two-column collection grid; no horizontal overflow or visible targets below 44×44px. |
| 1024 | Two-column collection grid; no horizontal overflow or visible targets below 44×44px. |
| 1280 | Three-column floating collection grid; no horizontal overflow or visible targets below 44×44px. |
| 1440 | Three-column grid remains within the 1440px container; no horizontal overflow. |
| 1920 | Three-column grid remains capped at 1440px; no horizontal overflow. |

### E) WCAG 2.2 evidence

| # | Criterion | Result | Evidence |
|---:|---|---|---|
| 1 | 1.3.1 Info and Relationships | Pass by source/browser structure | Browser found one H1; the source uses one `main`, named navigation, labelled sections, heading hierarchy, and category/tool lists. |
| 2 | 1.4.3 Contrast (Minimum) | Not fully verified | The palette uses dark foreground colors on pale glass surfaces, but no complete computed contrast sampling or axe/WAVE scan was run. |
| 3 | 1.4.4 Resize Text | Not tested | No 200% text-resize browser check was performed. |
| 4 | 1.4.10 Reflow | Pass at tested widths | At 320, 375, 414, 768, 1024, 1280, 1440, and 1920px, the document had no horizontal overflow. |
| 5 | 1.4.11 Non-text Contrast | Partial | Focus outlines and panel borders are explicitly styled; a complete 3:1 review of all icons, boundaries, and states was not performed. |
| 6 | 1.4.12 Text Spacing | Not tested | No text-spacing override bookmarklet/browser check was performed. |
| 7 | 2.1.1 Keyboard | Partial | Search trigger, search input, matching result, and Escape dismissal were exercised; full keyboard traversal was not performed. |
| 8 | 2.1.2 No Keyboard Trap | Partial | The V7 layout adds no modal or focus trap; complete keyboard traversal out of every state was not performed. |
| 9 | 2.4.1 Bypass Blocks | Pass by source/browser | The first Tab stop was the visible “Skip to main content” link, which targets the V7 `main` landmark (`#v7-main`). |
| 10 | 2.4.3 Focus Order | Partial | DOM order follows header, hero/search, collections, supporting content, and footer; a full Tab-order check was not performed. |
| 11 | 2.4.7 Focus Visible | Partial | The first Tab stop showed a visible solid outline (2.4px computed); scoped CSS defines 3px focus-visible outlines, but every interactive state was not individually focused. |
| 12 | 2.4.11 Focus Not Obscured (Minimum) | Partial | No sticky overlay is introduced; search results can overlay nearby content, and complete focused-element visibility was not tested. |
| 13 | 2.5.7 Dragging Movements | N/A — no drag-only interaction | The V7 homepage introduces no dragging interaction. |
| 14 | 2.5.8 Target Size (Minimum) | Pass for tested widths | Browser measurement found no visible link, button, input, or select below 44×44px at all eight responsive widths. |
| 15 | 3.2.6 Consistent Help | N/A — no new help mechanism | V7 reuses the shared footer and adds no separate help UI; cross-page help placement was not changed. |
| 16 | 3.3.1 Error Identification | N/A — no validation flow | Search is not a form submission or validation flow; no-match feedback is textual in the shared search component. |
| 17 | 3.3.7 Redundant Entry | N/A — no repeated multi-step entry | V7 introduces no multi-step form or repeated data-entry flow. |
| 18 | 3.3.8 Accessible Authentication | N/A — no authentication | V7 introduces no authentication flow. |
| 19 | 4.1.2 Name, Role, Value | Pass by source | Tool destinations are native links; the shared search exposes a labelled trigger and labelled search input; the skip link and nav have accessible names. |
| 20 | 4.1.3 Status Messages | Partial | The shared search updates its result panel after typing, but a dedicated live status announcement was not verified. |

### F) Design decisions

- Frosted panels over a pale gradient → creates a distinct glass aesthetic while keeping dark content legible; rejected another solid-color bento grid.
- Centered hero and loose three-column collection layout → keeps search prominent and the desktop composition airy; rejected a dense dashboard.
- Shared ToolSearch and ToolCard → preserves existing search and registry navigation behavior; rejected duplicating their logic.
- Root-only production opt-in → enables a production review without changing the standard homepage; rejected replacing the `/` route.

### G) Validation and limitations

| Check | Result | Evidence |
|---|---|---|
| Full tests before implementation | 371/371 passed | `npm.cmd test`; 0 failed. |
| Full tests after implementation | 371/371 passed | `npm.cmd test`; 0 failed. |
| Production build | Passed with existing warnings | Built with `VITE_ENABLE_V7_PREVIEW=true`; the existing `buffer` externalization and >500kB chunk warnings remain. Main JS: 1,030.06 kB (347.80 kB gzip); CSS: 251.49 kB (40.14 kB gzip). |
| Production preview | Browser verified | `http://127.0.0.1:4179/?preview=v7`; one H1, five categories, 18 tools, search/Escape, root-only gate, and responsive checks verified. |
| Whitespace validation | Passed | `git diff --check`. |

Lighthouse and axe/WAVE were not run. Performance scores, CLS, full contrast, 200% text resize, text-spacing overrides, and full keyboard traversal remain unverified.

### H) Task status

**Ready for Review.** Production preview is available at `http://127.0.0.1:4179/?preview=v7` with `VITE_ENABLE_V7_PREVIEW=true`; the standard homepage remains unchanged.

## Task 10.1 — Variant 8 (Neo-Brutalism)

### A) Read evidence and design direction

- Reviewed `docs/PROJECT-TRACKER.md`, `docs/status.md`, `docs/inventory.md`, `src/App.jsx`, `src/components/toolRegistry.js`, the shared `ToolSearch`, `ToolCard`, `Footer`, and `AdSlot`, and the preceding homepage variants.
- Created an off-white canvas with bright yellow, electric blue, and pink blocks; 4px black borders; hard unblurred offset shadows; square cards; and heavy uppercase headlines. V8 uses no gradients, backdrop blur, or above-fold animations.
- Styles are isolated in `src/components/v8/brutal.css`, and the page wrapper fixes the variant surface to light mode without changing the app-wide theme.
- Reused the existing search, card, category/tool registry, footer, and below-content AdSlot. The ad remains after directory and supporting content; no ad container is introduced above the fold.

### B) Components and registry fidelity

| Component | Responsibility |
|---|---|
| `src/components/VariantBrutal.jsx` | V8 composition, skip link, semantic main, shared footer, and below-content AdSlot. |
| `src/components/v8/BrutalHeader.jsx` | V8 brand link and homepage navigation. |
| `src/components/v8/BrutalHero.jsx` | Single H1, supporting message, shared search, and directory link. |
| `src/components/v8/BrutalDirectory.jsx` | Five category panels and shared ToolCard links sourced from the registry. |
| `src/components/v8/BrutalManifesto.jsx` | Three supporting task-principle rows below the directory. |
| `src/components/v8/brutal.css` | V8-only colors, thick borders, hard shadows, focus/hover states, and responsive layout. |
| `src/App.jsx` | Development-only, root-only V8 preview gate. |

All five categories and 18 tools are generated from `TOOL_CATEGORIES` and `TOOL_REGISTRY`; shared ToolCard provides registry icon, name, description, and path (with existing localization). No tool workflow or route is recreated.

### C) Preview isolation

`src/App.jsx` gates `?preview=v8` using `import.meta.env.DEV` and restricts it to `/`. The browser confirmed that `/` without the query renders the existing “Powerful PDF Tools” homepage and `/privacy?preview=v8` does not render V8.

The task asked for both a dev-only preview gate and a production preview URL, which conflict: V8 is intentionally not enabled in the production build. Per the human's choice, the gate remains strictly development-only. Local preview: `http://127.0.0.1:5180/?preview=v8`. `npm.cmd run build` passed, but that production build does not expose V8.

### D) Responsive and interaction evidence

The browser rendered one H1, five categories, and 18 tool cards. At all eight tested widths, document `scrollWidth` equalled `clientWidth`, and no visible link, button, input, or select was below 44×44px. The content container capped at 1440px at 1920px. Search opens through the shared trigger with a 16px input, returned two matches for “ocr,” and closed on Escape. Hovering a tool card translated it by 3px and reduced its hard shadow from 4px to 1px. The first Tab exposed a 48px skip link with a 4px red focus outline.

| Width | Observed behavior |
|---:|---|
| 320 | Single-column cards; no horizontal overflow; visible controls meet 44×44px. |
| 375 | Single-column cards; no horizontal overflow; visible controls meet 44×44px. |
| 414 | Single-column cards; no horizontal overflow; visible controls meet 44×44px. |

| Width | Observed behavior |
|---:|---|
| 768 | Two-column collection grid; no overflow; visible controls meet 44×44px. |
| 1024 | Two-column collection grid; no overflow; visible controls meet 44×44px. |
| 1280 | Three-column collection grid; no overflow. |
| 1440 | Three-column grid remains within the 1440px container. |
| 1920 | Content remains capped at 1440px; no overflow. |

### E) WCAG 2.2 evidence

| # | Criterion | Result | Evidence |
|---:|---|---|---|
| 1 | 1.3.1 Info and Relationships | Pass by source/browser structure | Browser found one H1; source uses one `main`, named navigation, labelled sections, heading hierarchy, and category/tool lists. |
| 2 | 1.4.3 Contrast (Minimum) | Not fully verified | The palette uses black text on light surfaces and colored blocks; no complete contrast sampling or axe/WAVE scan was run. |
| 3 | 1.4.4 Resize Text | Not tested | No 200% text-resize browser check. |
| 4 | 1.4.10 Reflow | Pass at tested widths | No horizontal overflow at 320, 375, 414, 768, 1024, 1280, 1440, or 1920px. |
| 5 | 1.4.11 Non-text Contrast | Partial | Thick black card boundaries and visible focus outlines are provided; all icons, boundaries, and states were not checked against 3:1. |
| 6 | 1.4.12 Text Spacing | Not tested | No text-spacing override bookmarklet/browser check. |
| 7 | 2.1.1 Keyboard | Partial | Search trigger/input, a result, Escape dismissal, and first-Tab skip link were checked; full keyboard traversal was not performed. |
| 8 | 2.1.2 No Keyboard Trap | Partial | No modal or focus trap is added; complete keyboard traversal out of every state was not tested. |
| 9 | 2.4.1 Bypass Blocks | Pass by source/browser | First Tab reached the visible “Skip to main content” link, which targets `#v8-main`. |
| 10 | 2.4.3 Focus Order | Partial | DOM order follows header, hero/search, directory, supporting content, and footer; full Tab-order review was not performed. |
| 11 | 2.4.7 Focus Visible | Partial | Skip-link focus showed a visible 4px red outline; every control/state was not individually focused. |
| 12 | 2.4.11 Focus Not Obscured (Minimum) | Partial | No sticky overlay is introduced; search results can overlay nearby content, and all focus states were not tested. |
| 13 | 2.5.7 Dragging Movements | N/A — no drag-only interaction | The V8 homepage adds no dragging interaction. |
| 14 | 2.5.8 Target Size (Minimum) | Pass for tested widths | No visible link, button, input, or select below 44×44px at all eight responsive widths. |
| 15 | 3.2.6 Consistent Help | N/A — no new help mechanism | V8 reuses the shared footer and adds no separate help UI; cross-page help placement was not changed. |
| 16 | 3.3.1 Error Identification | N/A — no validation flow | Search is not a form submission/validation flow; no-match feedback remains textual in the shared component. |
| 17 | 3.3.7 Redundant Entry | N/A — no repeated multi-step entry | V8 introduces no multi-step form or repeated data-entry flow. |
| 18 | 3.3.8 Accessible Authentication | N/A — no authentication | V8 introduces no authentication flow. |
| 19 | 4.1.2 Name, Role, Value | Pass by source | Tool destinations are native links; shared search has a labelled trigger and searchbox; skip link and nav are named. |
| 20 | 4.1.3 Status Messages | Partial | Shared search updates the result panel; a dedicated live status announcement was not verified. |

### F) Design decisions

- Flat off-white, yellow, blue, and pink blocks with black outlines → creates the requested raw visual language → rejected gradients, blur, and soft elevation.
- Registry-generated category/tool cards → maintains exact tool data and links → rejected hand-authored duplicates.
- Shared ToolSearch and ToolCard → preserves established search/localization/navigation → rejected rebuilding those interactions.
- Strict development-only gate → honors the specific gate requirement → rejected a production environment flag after the human chose `dev_only`.

### G) Validation and limitations

| Check | Result | Evidence |
|---|---|---|
| Full tests before implementation | 371/371 passed | `npm.cmd test`; 0 failed. |
| Full tests after implementation | 371/371 passed | `npm.cmd test`; 0 failed. |
| Production build | Passed with existing warnings | `npm.cmd run build`; existing `buffer` externalization and >500kB chunk warnings remain. Main JS: 1,024.08 kB (346.61 kB gzip); CSS: 264.24 kB (42.06 kB gzip). V8 preview is disabled in this build by design. |
| Development preview | Browser verified | `http://127.0.0.1:5180/?preview=v8`; layout, category/tool counts, search, Escape, hover, gate fallbacks, and target sizes checked. |
| Whitespace validation | Passed | `git diff --check`. |

Lighthouse and axe/WAVE were not run. Performance scores, CLS, full contrast, 200% text resize, text-spacing overrides, and full keyboard traversal remain unverified.

### H) Task status

**Ready for Review.** Development preview is available at `http://127.0.0.1:5180/?preview=v8`. A production preview is unavailable because V8 remains strictly dev-only, per the human's decision.

## Task 11.1 — Variant 9 (Minimalist Zen)

### A) Read evidence and design direction

- Reviewed `docs/PROJECT-TRACKER.md`, `docs/status.md`, `docs/inventory.md`, `src/App.jsx`, `src/components/toolRegistry.js`, shared `ToolSearch`, `ToolCard`, `Footer`, and `AdSlot`, and the existing V8 gate.
- Built a quiet white surface with dark slate typography, a single forest-green accent, generous vertical spacing, and thin neutral separators. Category tool links use a simple unboxed layout; hover emphasizes the text rather than adding a card treatment.
- Kept all styling inside `src/components/v9/zen.css`; the wrapper pins the variant to light mode. No above-fold animation, heavy border, shadow, gradient, or ad container was added.
- Reused the site's shared search, tool card, registry, footer, and below-content AdSlot.

### B) Components and registry fidelity

| Component | Responsibility |
|---|---|
| `src/components/VariantZen.jsx` | V9 composition, skip link, semantic main, shared footer, and below-content AdSlot. |
| `src/components/v9/ZenHeader.jsx` | Minimal wordmark and homepage navigation. |
| `src/components/v9/ZenHero.jsx` | Single H1, centered search, and directory link. |
| `src/components/v9/ZenDirectory.jsx` | Five text-led category sections and shared ToolCard links sourced from the registry. |
| `src/components/v9/ZenClosing.jsx` | Short closing message after the directory. |
| `src/components/v9/zen.css` | V9-only white/green styles, whitespace, minimal search/card treatments, focus states, and responsive layout. |
| `src/App.jsx` | Development-only, root-only V9 preview gate. |

All five categories and 18 tools are generated from `TOOL_CATEGORIES` and `TOOL_REGISTRY`. Shared ToolCard preserves the registered icon, name, description, and path while retaining existing localization; no tool flow is recreated.

### C) Preview isolation

`src/App.jsx` gates `?preview=v9` on development builds and restricts it to `/`. Browser checks confirmed that `/` without the query renders the existing “Powerful PDF Tools” homepage and `/privacy?preview=v9` does not render V9.

The request for a production preview URL conflicts with the explicit dev-only gate. The human approved keeping the gate strictly dev-only. Local development preview: `http://127.0.0.1:5180/?preview=v9`. A production preview is unavailable without changing that decision.

### D) Responsive and interaction evidence

The browser rendered one H1, five category sections, and 18 tool cards. At all eight tested widths, document `scrollWidth` equalled `clientWidth`, and no visible link, button, input, or select was below 44×44px. The content container capped at 1440px at 1920px. Search opened through the shared trigger with 16px input text, returned two matches for “ocr,” and closed on Escape. Hovering a tool link added a subtle background and underline without a box or shadow. First Tab revealed the 48px skip link with a visible forest-green outline.

| Width | Observed behavior |
|---:|---|
| 320 | Single-column category sections and tools; no horizontal overflow; visible controls meet 44×44px. |
| 375 | Single-column category sections and tools; no overflow; visible controls meet 44×44px. |
| 414 | Single-column category sections and tools; no overflow; visible controls meet 44×44px. |

| Width | Observed behavior |
|---:|---|
| 768 | Two-column tools within each section; no overflow; visible controls meet 44×44px. |
| 1024 | Two-column tools within each section; no overflow. |
| 1280 | Two-column directory composition with generous category/description separation. |
| 1440 | Directory remains centered within the 1440px maximum-width container. |
| 1920 | Content remains capped at 1440px; no horizontal overflow. |

### E) WCAG 2.2 evidence

| # | Criterion | Result | Evidence |
|---:|---|---|---|
| 1 | 1.3.1 Info and Relationships | Pass by source/browser structure | Browser found one H1; source uses one `main`, named navigation, labelled category sections, heading hierarchy, and tool lists. |
| 2 | 1.4.3 Contrast (Minimum) | Not fully verified | Dark slate and forest-green text are used on white; no complete contrast sampling or axe/WAVE scan was run. |
| 3 | 1.4.4 Resize Text | Not tested | No 200% text-resize browser check. |
| 4 | 1.4.10 Reflow | Pass at tested widths | No horizontal overflow at 320, 375, 414, 768, 1024, 1280, 1440, or 1920px. |
| 5 | 1.4.11 Non-text Contrast | Partial | Thin separators and focus outlines are styled; a full 3:1 check of icons, boundaries, and all states was not performed. |
| 6 | 1.4.12 Text Spacing | Not tested | No text-spacing override bookmarklet/browser check. |
| 7 | 2.1.1 Keyboard | Partial | Search trigger/input, a result, Escape dismissal, and first-Tab skip link were checked; full keyboard traversal was not performed. |
| 8 | 2.1.2 No Keyboard Trap | Partial | No modal or focus trap is introduced; complete keyboard traversal out of every state was not tested. |
| 9 | 2.4.1 Bypass Blocks | Pass by source/browser | First Tab reached the visible “Skip to main content” link, which targets `#v9-main`. |
| 10 | 2.4.3 Focus Order | Partial | DOM order follows header, hero/search, directory, closing content, and footer; full Tab-order review was not performed. |
| 11 | 2.4.7 Focus Visible | Partial | Skip-link focus showed a visible 3px forest-green outline; every control/state was not individually focused. |
| 12 | 2.4.11 Focus Not Obscured (Minimum) | Partial | No sticky overlay is introduced; search results can overlay nearby content, and all focus states were not tested. |
| 13 | 2.5.7 Dragging Movements | N/A — no drag-only interaction | The V9 homepage adds no dragging interaction. |
| 14 | 2.5.8 Target Size (Minimum) | Pass for tested widths | No visible link, button, input, or select below 44×44px at all eight responsive widths. |
| 15 | 3.2.6 Consistent Help | N/A — no new help mechanism | V9 reuses the shared footer and adds no separate help UI; cross-page help placement was not changed. |
| 16 | 3.3.1 Error Identification | N/A — no validation flow | Search is not a form submission/validation flow; no-match feedback remains textual in the shared component. |
| 17 | 3.3.7 Redundant Entry | N/A — no repeated multi-step entry | V9 introduces no multi-step form or repeated data-entry flow. |
| 18 | 3.3.8 Accessible Authentication | N/A — no authentication | V9 introduces no authentication flow. |
| 19 | 4.1.2 Name, Role, Value | Pass by source | Tool destinations are native links; shared search has a labelled trigger and searchbox; skip link and nav have accessible names. |
| 20 | 4.1.3 Status Messages | Partial | Shared search updates its result panel; a dedicated live status announcement was not verified. |

### F) Design decisions

- White canvas, slate text, forest-green accent → creates a quiet premium tone → rejected bright multicolor blocks.
- Unboxed tool lists with thin section separators → reduces visual noise while retaining grouping → rejected bordered cards or shadows.
- Shared ToolSearch and ToolCard → preserves established search, localization, and routes → rejected duplicate interaction logic.
- Strict dev-only preview gate → honors the specific gate requirement and approved choice → rejected production opt-in after the human chose dev-only.

### G) Validation and limitations

| Check | Result | Evidence |
|---|---|---|
| Full tests before implementation | 371/371 passed | `npm.cmd test`; 0 failed. |
| Full tests after implementation | 371/371 passed | `npm.cmd test`; 0 failed. |
| Production build | Passed with existing warnings | `npm.cmd run build`; existing `buffer` externalization and >500kB chunk warnings remain. Main JS: 1,024.25 kB (346.65 kB gzip); CSS: 273.34 kB (43.41 kB gzip). V9 preview is disabled in this build by design. |
| Development preview | Browser verified | `http://127.0.0.1:5180/?preview=v9`; page structure, category/tool counts, search/Escape, hover, gate fallbacks, and target sizes checked. |
| Whitespace validation | Passed | `git diff --check`. |

Lighthouse and axe/WAVE were not run. Performance scores, CLS, full contrast, 200% text resize, text-spacing overrides, and full keyboard traversal remain unverified.

### H) Task status

**Ready for Review.** Development preview is available at `http://127.0.0.1:5180/?preview=v9`. A production preview is unavailable because V9 remains strictly dev-only, per the human's decision.

## Task 12.1 — Variant 10 (Cyberpunk)

### A) Read evidence and design direction

- Reviewed `docs/PROJECT-TRACKER.md`, `docs/status.md`, `docs/inventory.md`, `src/App.jsx`, `src/components/toolRegistry.js`, shared `ToolSearch`, `ToolCard`, `Footer`, and `AdSlot`, and the previous V9 preview-gate choice.
- Created a deep-black terminal aesthetic with a subtle cyan grid, cyan/magenta/lime accents, sharp neon borders, monospace labels, and glow that strengthens on card hover.
- Styles are isolated in `src/components/v10/cyberpunk.css`; the preview wrapper uses a dark color scheme. No above-fold animation was added.
- The existing AdSlot is reused after the tool directory and supporting readout; no ad container is introduced above the fold or adjacent to the search.

### B) Components and registry fidelity

| Component | Responsibility |
|---|---|
| `src/components/VariantCyberpunk.jsx` | V10 composition, skip link, semantic main, shared footer, and below-content AdSlot. |
| `src/components/v10/CyberHeader.jsx` | Technical wordmark and homepage navigation. |
| `src/components/v10/CyberHero.jsx` | Single H1, system status details, shared search, and tool-index link. |
| `src/components/v10/CyberDirectory.jsx` | Five category panels and shared ToolCard links sourced from the registry. |
| `src/components/v10/CyberReadout.jsx` | Supporting system notes after the directory. |
| `src/components/v10/cyberpunk.css` | V10-only dark palette, grid, neon borders/glows, focus/hover styling, and responsive layout. |
| `src/App.jsx` | Root-only development preview gate for V10. |

All five categories and 18 tools are generated from `TOOL_CATEGORIES` and `TOOL_REGISTRY`; shared ToolCard preserves icons, names, descriptions, paths, and localization. Existing search, tools, and routes are reused rather than rebuilt.

### C) Preview isolation

`src/App.jsx` gates `?preview=v10` on development builds and restricts it to `/`. The browser confirmed that `/` without the query renders the existing “Powerful PDF Tools” homepage and `/privacy?preview=v10` does not render V10.

The request for a production preview URL conflicts with the explicit dev-only gate. The human approved strict dev-only behavior, consistent with V8/V9. Local preview: `http://127.0.0.1:5180/?preview=v10`. A production preview is unavailable without changing that decision.

### D) Responsive and interaction evidence

The browser rendered one H1, five categories, and 18 tools. At each tested width, document `scrollWidth` equalled `clientWidth`; no visible link, button, input, or select was below 44×44px. The content container capped at 1440px at 1920px. Search opened with 16px text, returned matching results for “ocr,” and closed on Escape. Hovering a tool card changed its border to cyan and applied a measured cyan glow. The preview also confirmed normal homepage fallback when the query is absent.

| Width | Observed behavior |
|---:|---|
| 320 | Single-column category panels; no horizontal overflow; visible controls meet 44×44px. |
| 375 | Single-column panels; no overflow; visible controls meet 44×44px. |
| 414 | Single-column panels; no overflow; visible controls meet 44×44px. |

| Width | Observed behavior |
|---:|---|
| 768 | Two-column category grid; no overflow; visible controls meet 44×44px. |
| 1024 | Two-column category grid; no overflow. |
| 1280 | Three-column category grid; no overflow. |
| 1440 | Three-column grid remains within the 1440px container. |
| 1920 | Content remains capped at 1440px; no horizontal overflow. |

### E) WCAG 2.2 evidence

| # | Criterion | Result | Evidence |
|---:|---|---|---|
| 1 | 1.3.1 Info and Relationships | Pass by source/browser structure | Browser found one H1; source uses one `main`, named navigation, labelled categories, heading hierarchy, and tool lists. |
| 2 | 1.4.3 Contrast (Minimum) | Not fully verified | Neon and pale foreground colors are used on dark surfaces; no complete contrast sampling or axe/WAVE scan was run. |
| 3 | 1.4.4 Resize Text | Not tested | No 200% text-resize browser check. |
| 4 | 1.4.10 Reflow | Pass at tested widths | No horizontal overflow at 320, 375, 414, 768, 1024, 1280, 1440, or 1920px. |
| 5 | 1.4.11 Non-text Contrast | Partial | Neon borders and focus outlines are styled; a complete 3:1 check of icons, boundaries, and all states was not performed. |
| 6 | 1.4.12 Text Spacing | Not tested | No text-spacing override bookmarklet/browser check. |
| 7 | 2.1.1 Keyboard | Partial | Search trigger/input, a result, Escape dismissal, and skip-link focus were checked; full keyboard traversal was not performed. |
| 8 | 2.1.2 No Keyboard Trap | Partial | No modal or focus trap is introduced; complete keyboard traversal out of every state was not tested. |
| 9 | 2.4.1 Bypass Blocks | Pass by source | A labelled skip link targets the V10 `main` landmark (`#v10-main`). |
| 10 | 2.4.3 Focus Order | Partial | DOM follows header, hero/search, directory, readout, and footer; full Tab-order review was not performed. |
| 11 | 2.4.7 Focus Visible | Partial | Scoped CSS provides a 3px magenta focus outline; every control/state was not individually focused. |
| 12 | 2.4.11 Focus Not Obscured (Minimum) | Partial | No sticky overlay is introduced; search results can overlay nearby content, and all focus states were not tested. |
| 13 | 2.5.7 Dragging Movements | N/A — no drag-only interaction | The V10 homepage adds no dragging interaction. |
| 14 | 2.5.8 Target Size (Minimum) | Pass for tested widths | No visible link, button, input, or select below 44×44px at all eight responsive widths. |
| 15 | 3.2.6 Consistent Help | N/A — no new help mechanism | V10 reuses the shared footer and adds no separate help UI; cross-page help placement was not changed. |
| 16 | 3.3.1 Error Identification | N/A — no validation flow | Search is not a form submission/validation flow; no-match feedback remains textual in the shared component. |
| 17 | 3.3.7 Redundant Entry | N/A — no repeated multi-step entry | V10 introduces no multi-step form or repeated data-entry flow. |
| 18 | 3.3.8 Accessible Authentication | N/A — no authentication | V10 introduces no authentication flow. |
| 19 | 4.1.2 Name, Role, Value | Pass by source | Tool destinations are native links; shared search has a labelled trigger and searchbox; skip link and nav have accessible names. |
| 20 | 4.1.3 Status Messages | Partial | Shared search updates its result panel; a dedicated live status announcement was not verified. |

### F) Design decisions

- Near-black background, cyan grid, and cyan/magenta/lime accents → establishes a technical neon identity → rejected a light or neutral palette.
- Sharp bordered panels with hover-activated glow → makes the tool directory feel like a readable system console → rejected rounded soft cards and static elevation.
- Shared ToolSearch and ToolCard → preserves existing search, localization, and routes → rejected reimplementing interaction logic.
- Strict dev-only preview gate → honors the specific gate request and approved choice → rejected production opt-in.

### G) Validation and limitations

| Check | Result | Evidence |
|---|---|---|
| Full tests before implementation | Passed; 371/371 preceding recorded baseline | This task's `npm.cmd test` exited successfully, but its verbose count output was not retained. The test suite baseline recorded immediately before V10 was 371/371. |
| Full tests after implementation | 371/371 passed | `npm.cmd test`; 0 failed. |
| Production build | Passed with existing warnings | `npm.cmd run build`; existing `buffer` externalization and >500kB chunk warnings remain. Main JS: 1,024.43 kB (346.69 kB gzip); CSS: 287.13 kB (45.79 kB gzip). V10 preview is disabled in this build by design. |
| Development preview | Browser verified | `http://127.0.0.1:5180/?preview=v10`; layout, category/tool counts, search/Escape, hover glow, gate fallback, and target sizes checked. |
| Compile and whitespace checks | Passed | Problems tool reported no errors in scoped files; `git diff --check` passed. |

Lighthouse and axe/WAVE were not run. Performance scores, CLS, full contrast, 200% text resize, text-spacing overrides, and full keyboard traversal remain unverified.

### H) Task status

**Ready for Review.** Development preview is available at `http://127.0.0.1:5180/?preview=v10`. A production preview is unavailable because V10 remains strictly dev-only, per the human's decision.
