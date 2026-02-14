import { useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import { useLeadModalConfig } from '@/hooks/useLeadModalConfig';
import { trackPageView } from '@/lib/tracking';

const TrackingScripts = () => {
  const { data: config } = useLeadModalConfig();
  const location = useLocation();
  const initializedRef = useRef<{ pixel: string; ga4: string }>({ pixel: '', ga4: '' });

  const pixelId = config?.meta_pixel_id || '';
  const ga4Id = config?.ga4_measurement_id || '';

  // Initialize Meta Pixel
  useEffect(() => {
    if (!pixelId || initializedRef.current.pixel === pixelId) return;
    initializedRef.current.pixel = pixelId;

    // fbq base code
    const f = window as any;
    if (!f.fbq) {
      const n: any = (f.fbq = function (...args: any[]) {
        n.callMethod ? n.callMethod.apply(n, args) : n.queue.push(args);
      });
      if (!f._fbq) f._fbq = n;
      n.push = n;
      n.loaded = true;
      n.version = '2.0';
      n.queue = [];
    }

    const script = document.createElement('script');
    script.async = true;
    script.src = 'https://connect.facebook.net/en_US/fbevents.js';
    document.head.appendChild(script);

    window.fbq('init', pixelId);
    window.fbq('track', 'PageView');
  }, [pixelId]);

  // Initialize Google Analytics 4
  useEffect(() => {
    if (!ga4Id || initializedRef.current.ga4 === ga4Id) return;
    initializedRef.current.ga4 = ga4Id;

    const script = document.createElement('script');
    script.async = true;
    script.src = `https://www.googletagmanager.com/gtag/js?id=${ga4Id}`;
    document.head.appendChild(script);

    window.dataLayer = window.dataLayer || [];
    window.gtag = function (...args: any[]) {
      window.dataLayer.push(args);
    };
    window.gtag('js', new Date());
    window.gtag('config', ga4Id, { send_page_view: true });
  }, [ga4Id]);

  // Track page views on route change
  useEffect(() => {
    if (pixelId || ga4Id) {
      trackPageView();
    }
  }, [location.pathname, pixelId, ga4Id]);

  return null;
};

export default TrackingScripts;
