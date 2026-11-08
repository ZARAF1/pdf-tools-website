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

## Task 2.1 — Design Tokens

## Task 2.2 — Interactive Primitives

## Task 2.3 — Typography & Spacing

## Task 2.4 — Dark Mode

## Task 2.5 — Design System Summary

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
