import React, { useState } from 'react';
import { ArrowDownRight, FileText, Folder, Image, Lock, QrCode, ScanText, Shield, ShieldCheck, Sparkles } from 'lucide-react';
import EditorialLightSearch from './EditorialLightSearch';
import { useLanguage } from '../../i18n/useLanguage';

const ART_VARIANTS = [
  { background: '#e8f0f3', ring: 'rgb(88 126 145 / 0.34)', sun: '#e9b46b', documentMark: '#a64e2a', preview: '#eef2ed', image: 'linear-gradient(145deg, #eab879 0 50%, #c9754e 50% 100%)', icon1: Image, icon2: QrCode, icon1Color: '#793b27', icon2Color: '#315a6a', icon1Background: '#fffaf0', icon2Background: '#f5fbf9' },
  { background: '#f5e9ec', ring: 'rgb(154 94 112 / 0.3)', sun: '#d98872', documentMark: '#a64e2a', preview: '#f7eeea', image: 'linear-gradient(145deg, #e7ae9b 0 50%, #c97562 50% 100%)', icon1: Folder, icon2: Lock, icon1Color: '#8b4d56', icon2Color: '#4d6177', icon1Background: '#fff8f4', icon2Background: '#f7f5fb' },
  { background: '#eaf2e8', ring: 'rgb(83 125 93 / 0.3)', sun: '#dcb46f', documentMark: '#547d5d', preview: '#edf3e8', image: 'linear-gradient(145deg, #c9d89d 0 50%, #7fa47b 50% 100%)', icon1: Shield, icon2: FileText, icon1Color: '#4d7759', icon2Color: '#49637a', icon1Background: '#f7fbf2', icon2Background: '#f4f8fc' },
  { background: '#f4efdd', ring: 'rgb(145 126 77 / 0.3)', sun: '#df9d60', documentMark: '#a85e3c', preview: '#f4f0e2', image: 'linear-gradient(145deg, #f0cd83 0 50%, #d5865f 50% 100%)', icon1: Sparkles, icon2: QrCode, icon1Color: '#a36937', icon2Color: '#557177', icon1Background: '#fffaf0', icon2Background: '#f3f9f8' },
  { background: '#e7eff5', ring: 'rgb(72 112 148 / 0.3)', sun: '#e8b47e', documentMark: '#547b9b', preview: '#eaf1f3', image: 'linear-gradient(145deg, #9fc5d6 0 50%, #6e9db5 50% 100%)', icon1: Lock, icon2: Image, icon1Color: '#4b6884', icon2Color: '#467887', icon1Background: '#f6f9fc', icon2Background: '#f2faf9' },
  { background: '#f4e8df', ring: 'rgb(152 105 78 / 0.3)', sun: '#d9a95e', documentMark: '#ad6548', preview: '#f5ede6', image: 'linear-gradient(145deg, #edc38c 0 50%, #d08363 50% 100%)', icon1: FileText, icon2: Folder, icon1Color: '#93553c', icon2Color: '#62734e', icon1Background: '#fff9f3', icon2Background: '#f6f8ef' },
  { background: '#e8f1ef', ring: 'rgb(75 126 119 / 0.3)', sun: '#e2b66f', documentMark: '#498078', preview: '#eaf2ee', image: 'linear-gradient(145deg, #afd1be 0 50%, #69a295 50% 100%)', icon1: ScanText, icon2: Shield, icon1Color: '#407b71', icon2Color: '#54775f', icon1Background: '#f3faf7', icon2Background: '#f6fbf3' },
  { background: '#eeeafa', ring: 'rgb(113 100 157 / 0.28)', sun: '#e3b46d', documentMark: '#766aa2', preview: '#f0edf5', image: 'linear-gradient(145deg, #c7b9df 0 50%, #907fb6 50% 100%)', icon1: QrCode, icon2: Sparkles, icon1Color: '#71629a', icon2Color: '#a06c46', icon1Background: '#faf8ff', icon2Background: '#fff9f1' },
  { background: '#f7e9e2', ring: 'rgb(160 105 84 / 0.28)', sun: '#dba35e', documentMark: '#ad6248', preview: '#f5eeea', image: 'linear-gradient(145deg, #efc69b 0 50%, #d57f69 50% 100%)', icon1: Image, icon2: FileText, icon1Color: '#ae694d', icon2Color: '#557082', icon1Background: '#fff8f1', icon2Background: '#f4f8fb' },
  { background: '#e9eff0', ring: 'rgb(75 113 124 / 0.3)', sun: '#e5b16b', documentMark: '#52777b', preview: '#edf1ee', image: 'linear-gradient(145deg, #b8d2cf 0 50%, #7ba9a4 50% 100%)', icon1: Folder, icon2: ShieldCheck, icon1Color: '#4f7772', icon2Color: '#547a62', icon1Background: '#f5faf8', icon2Background: '#f5faf3' },
];

const EditorialLightHero = () => {
  const { translate } = useLanguage();
  const [variantIndex] = useState(() => Math.floor(Math.random() * 10));
  const variant = ART_VARIANTS[variantIndex];
  const FirstStickerIcon = variant.icon1;
  const SecondStickerIcon = variant.icon2;

  return (
    <section className="v6-hero" aria-labelledby="v6-title">
      <div className="v6-hero-copy">
        <p className="v6-eyebrow">
          <Sparkles aria-hidden="true" />
          {translate('homeEyebrow')}
        </p>
        <h1 id="v6-title">{translate('homeTitle')}</h1>
        <p className="v6-hero-description">{translate('homeDescription')}</p>
        <div className="mt-8 flex max-w-xl flex-col">
          <div className="w-full [&_.v6-search]:!mt-0">
            <EditorialLightSearch />
          </div>
          <div className="mt-4 flex flex-wrap items-center justify-between gap-x-4 gap-y-2">
            <p className="v6-privacy-badge !m-0">
              <ShieldCheck aria-hidden="true" />
              {translate('filesStayOnDevice')}
            </p>
            <a className="v6-browse-cta !mt-0 flex items-center gap-2 font-bold text-[#a35d45] hover:underline" href="#v6-tools">
              {translate('homeExplore')}
              <ArrowDownRight size={18} aria-hidden="true" />
            </a>
          </div>
        </div>
      </div>

      <div className="v6-hero-art" aria-hidden="true" style={{ backgroundColor: variant.background }}>
        <div className="v6-art-orbit v6-art-orbit-one" style={{ borderColor: variant.ring }} />
        <div className="v6-art-orbit v6-art-orbit-two" style={{ borderColor: variant.ring }} />
        <div className="v6-art-sun" style={{ backgroundColor: variant.sun }} />
        <div className="v6-document-sheet">
          <div className="v6-document-topline">
            <span className="v6-document-mark" style={{ backgroundColor: variant.documentMark }}><FileText /></span>
            <span className="v6-document-menu"><i /><i /><i /></span>
          </div>
          <div className="v6-document-heading" />
          <div className="v6-document-subheading" />
          <div className="v6-document-lines"><i /><i /><i /><i /></div>
          <div className="v6-document-preview" style={{ backgroundColor: variant.preview }}>
            <div className="v6-preview-shape" style={{ background: variant.image }} />
            <span><i /><i /><i /></span>
          </div>
          <div className="v6-document-foot"><i /><i /></div>
        </div>
        <div className="v6-art-sticker v6-art-sticker-image" style={{ color: variant.icon1Color, backgroundColor: variant.icon1Background }}><FirstStickerIcon /></div>
        <div className="v6-art-sticker v6-art-sticker-scan" style={{ color: variant.icon2Color, backgroundColor: variant.icon2Background }}><SecondStickerIcon /></div>
        <p className="v6-art-caption">{translate('v6ArtCaption')}</p>
      </div>
    </section>
  );
};

export default EditorialLightHero;
