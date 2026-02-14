// Tracking utility for Meta Pixel & Google Analytics 4

declare global {
  interface Window {
    fbq: (...args: any[]) => void;
    gtag: (...args: any[]) => void;
    dataLayer: any[];
  }
}

export function trackPageView() {
  if (typeof window.fbq === 'function') {
    window.fbq('track', 'PageView');
  }
  if (typeof window.gtag === 'function') {
    window.gtag('event', 'page_view');
  }
}

export function trackClickCTA(product: {
  title: string;
  store: string;
  category: string;
  price: number;
}) {
  if (typeof window.fbq === 'function') {
    window.fbq('trackCustom', 'ClickCTA', {
      content_name: product.title,
      content_category: product.category,
      value: product.price,
      currency: 'BRL',
      store: product.store,
    });
  }
  if (typeof window.gtag === 'function') {
    window.gtag('event', 'click_cta', {
      item_name: product.title,
      item_category: product.category,
      value: product.price,
      currency: 'BRL',
      store: product.store,
    });
  }
}

export function trackLead(data: {
  leadType: string;
  tags: string[];
  source: string;
}) {
  if (typeof window.fbq === 'function') {
    window.fbq('track', 'Lead', {
      content_name: data.leadType,
      content_category: data.tags.join(', '),
      source: data.source,
    });
  }
  if (typeof window.gtag === 'function') {
    window.gtag('event', 'generate_lead', {
      lead_type: data.leadType,
      tags: data.tags.join(', '),
      source: data.source,
    });
  }
}
