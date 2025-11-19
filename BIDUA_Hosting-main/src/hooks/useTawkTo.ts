import { useEffect } from 'react';

interface TawkToAPI {
  hideWidget: () => void;
  showWidget: () => void;
  setAttributes: (attributes: Record<string, string>, callback?: (error: Error | null) => void) => void;
  visitor: {
    name?: string;
    email?: string;
  };
}

declare global {
  interface Window {
    Tawk_API?: TawkToAPI;
    Tawk_LoadStart?: Date;
  }
}

interface UseTawkToOptions {
  propertyId?: string;
  widgetId?: string;
  onLoad?: () => void;
}

export const useTawkTo = (options: UseTawkToOptions = {}) => {
  const propertyId = options.propertyId || import.meta.env.VITE_TAWKTO_PROPERTY_ID;
  const widgetId = options.widgetId || import.meta.env.VITE_TAWKTO_WIDGET_ID || 'default';

  useEffect(() => {
    if (!propertyId || propertyId === 'your_property_id_here') {
      return;
    }

    const scriptId = 'tawkto-script';

    if (document.getElementById(scriptId)) {
      return;
    }

    window.Tawk_API = window.Tawk_API || {};
    window.Tawk_LoadStart = new Date();

    const script = document.createElement('script');
    script.id = scriptId;
    script.async = true;
    script.src = `https://embed.tawk.to/${propertyId}/${widgetId}`;
    script.charset = 'UTF-8';
    script.setAttribute('crossorigin', '*');

    script.onload = () => {
      if (options.onLoad) {
        options.onLoad();
      }
    };

    const firstScript = document.getElementsByTagName('script')[0];
    if (firstScript && firstScript.parentNode) {
      firstScript.parentNode.insertBefore(script, firstScript);
    }

    return () => {
      const existingScript = document.getElementById(scriptId);
      if (existingScript) {
        existingScript.remove();
      }

      const tawkIframe = document.getElementById('tawk-bubble-iframe');
      if (tawkIframe) {
        tawkIframe.remove();
      }

      delete window.Tawk_API;
      delete window.Tawk_LoadStart;
    };
  }, [propertyId, widgetId, options.onLoad]);

  return {
    hideWidget: () => {
      if (window.Tawk_API?.hideWidget) {
        window.Tawk_API.hideWidget();
      }
    },
    showWidget: () => {
      if (window.Tawk_API?.showWidget) {
        window.Tawk_API.showWidget();
      }
    },
    setAttributes: (attributes: Record<string, string>) => {
      if (window.Tawk_API?.setAttributes) {
        window.Tawk_API.setAttributes(attributes);
      }
    },
  };
};
