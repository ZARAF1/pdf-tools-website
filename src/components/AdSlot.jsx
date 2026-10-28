import React, { useEffect } from 'react';

const AD_CONFIGURATION = Object.freeze({
  enabled: false,
  consentGranted: false,
  publisherId: '',
  placements: Object.freeze({
    homeBelowTools: Object.freeze({ enabled: false, slotId: '' }),
    toolSupportingContent: Object.freeze({ enabled: false, slotId: '' })
  })
});

const AdSlot = ({ placement }) => {
  const config = AD_CONFIGURATION.placements[placement];
  const isConfigured = /^ca-pub-\d+$/.test(AD_CONFIGURATION.publisherId);

  useEffect(() => {
    if (
      !AD_CONFIGURATION.enabled ||
      !AD_CONFIGURATION.consentGranted ||
      !config?.enabled ||
      !isConfigured ||
      !config.slotId
    ) return;

    const scriptId = 'google-adsense-script';
    let script = document.getElementById(scriptId);
    if (!script) {
      script = document.createElement('script');
      script.id = scriptId;
      script.async = true;
      script.crossOrigin = 'anonymous';
      script.src = `https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${AD_CONFIGURATION.publisherId}`;
    }

    const initializeAd = () => {
      script.dataset.loaded = 'true';
      if (window.adsbygoogle) {
        window.adsbygoogle.push({});
      }
    };

    if (script?.dataset.loaded === 'true') {
      initializeAd();
    } else if (script) {
      script.addEventListener('load', initializeAd, { once: true });
    }
    if (!document.getElementById(scriptId)) {
      document.head.appendChild(script);
    }

    return () => script?.removeEventListener('load', initializeAd);
  }, [config, isConfigured]);

  if (
    !AD_CONFIGURATION.enabled ||
    !AD_CONFIGURATION.consentGranted ||
    !config?.enabled ||
    !isConfigured ||
    !config.slotId
  ) {
    return null;
  }

  return (
    <div className="mx-auto my-8 w-full max-w-5xl" aria-label="Advertisement">
      <ins
        className="adsbygoogle block min-h-[100px] w-full"
        style={{ display: 'block' }}
        data-ad-client={AD_CONFIGURATION.publisherId}
        data-ad-slot={config.slotId}
        data-ad-format="auto"
        data-full-width-responsive="true"
      />
    </div>
  );
};

export default AdSlot;
