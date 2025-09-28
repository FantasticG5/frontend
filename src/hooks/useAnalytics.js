import { useEffect, useRef } from 'react';
import { useCookieConsent } from './useCookieConsent';
import { 
  loadHotjar, 
  removeAllAnalyticsScripts 
} from '../utils/analyticsLoader';
import { clearAnalyticsCookies } from '../utils/cookieUtils';
import { ANALYTICS_CONFIG, DEBUG_ANALYTICS } from '../config/analytics';

// Hook för att hantera analytics-laddning baserat på samtycke
export const useAnalytics = () => {
  const { hasConsentForType, isLoading } = useCookieConsent();
  const analyticsLoaded = useRef(false);

  useEffect(() => {
    // Vänta tills samtycke har laddats
    if (isLoading) {
      return;
    }

    const hasAnalyticsConsent = hasConsentForType('analytical');

    if (hasAnalyticsConsent && !analyticsLoaded.current) {
      // Ladda analytics-skript
      loadAnalyticsScripts();
      analyticsLoaded.current = true;
    } else if (!hasAnalyticsConsent && analyticsLoaded.current) {
      // Ta bort analytics-skript och rensa cookies
      removeAllAnalyticsScripts();
      clearAnalyticsCookies();
      analyticsLoaded.current = false;
      
      if (DEBUG_ANALYTICS) {
        console.log('Analytics disabled - scripts removed and cookies cleared');
      }
    }
  }, [hasConsentForType, isLoading]);

  const loadAnalyticsScripts = async () => {
    try {
      if (DEBUG_ANALYTICS) {
        console.log('Loading Hotjar script...', ANALYTICS_CONFIG);
      }

      // Ladda bara Hotjar
      if (ANALYTICS_CONFIG.hotjar.enabled && 
          ANALYTICS_CONFIG.hotjar.siteId !== 'HOTJAR_SITE_ID') {
        await loadHotjar(ANALYTICS_CONFIG.hotjar.siteId);
        
        if (DEBUG_ANALYTICS) {
          console.log('Hotjar script loaded successfully');
        }
      } else if (DEBUG_ANALYTICS) {
        console.log('Hotjar disabled or using default ID');
      }
    } catch (error) {
      console.error('Error loading Hotjar script:', error);
    }
  };

  return {
    analyticsLoaded: analyticsLoaded.current,
    hasAnalyticsConsent: hasConsentForType('analytical')
  };
};
