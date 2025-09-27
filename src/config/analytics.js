// Analytics-konfiguration - MVP version med bara Hotjar
export const ANALYTICS_CONFIG = {
  hotjar: {
    siteId: import.meta.env.VITE_HOTJAR_SITE_ID || 'HOTJAR_SITE_ID',
    enabled: import.meta.env.VITE_HOTJAR_ENABLED === 'true' || false
  }
};

// Debug-läge för utveckling
export const DEBUG_ANALYTICS = import.meta.env.DEV;
