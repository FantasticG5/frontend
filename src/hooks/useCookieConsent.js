import { useState, useEffect } from 'react';
import { 
  hasConsent, 
  getConsentCookie, 
  saveConsentCookie, 
  clearConsent,
  clearAnalyticsCookies,
  getConsentForType,
  isConsentExpired 
} from '../utils/cookieUtils';

// Hook för att hantera cookie-samtycke
export const useCookieConsent = () => {
  const [consent, setConsent] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  // Ladda samtycke från cookies när hooken används
  useEffect(() => {
    const loadConsent = () => {
      try {
        if (hasConsent()) {
          const consentData = getConsentCookie();
          
          if (isConsentExpired()) {
            clearConsent();
            setConsent(null);
          } else {
            setConsent(consentData);
          }
        } else {
          setConsent(null);
        }
      } catch (error) {
        console.error('Error loading consent:', error);
        setConsent(null);
      } finally {
        setIsLoading(false);
      }
    };

    loadConsent();
  }, []);

  // Spara nytt samtycke
  const saveConsent = (consentData) => {
    try {
      // Kolla om analytiska cookies stängs av
      const previousAnalytical = consent?.analytical || false;
      const newAnalytical = consentData.analytical || false;
      
      // Om analytiska cookies stängs av, rensa analytics-cookies
      if (previousAnalytical && !newAnalytical) {
        clearAnalyticsCookies();
        console.log('Analytics cookies cleared due to consent change');
      }
      
      saveConsentCookie(consentData);
      setConsent(consentData);
      
      return true;
    } catch (error) {
      console.error('Error saving consent:', error);
      return false;
    }
  };

  // Rensa allt samtycke
  const clearUserConsent = () => {
    try {
      clearConsent();
      setConsent(null);
      
      return true;
    } catch (error) {
      console.error('Error clearing consent:', error);
      return false;
    }
  };

  // Kolla samtycke för specifik cookie-typ
  const hasConsentForType = (type) => {
    if (!consent) {
      return type === 'necessary';
    }
    return getConsentForType(type);
  };

  // Kolla om användaren har gjort ett samtycke-val
  const hasUserConsent = () => {
    return consent !== null;
  };

  // Hämta samtyckesstatus för alla cookie-typer
  const getConsentStatus = () => {
    if (!consent) {
      return {
        necessary: true,
        functional: false,
        analytical: false
      };
    }

    return {
      necessary: consent.necessary || true,
      functional: consent.functional || false,
      analytical: consent.analytical || false
    };
  };

  return {
    consent,
    isLoading,
    hasUserConsent: hasUserConsent(),
    hasConsentForType,
    getConsentStatus,
    saveConsent,
    clearConsent: clearUserConsent,
    isExpired: isConsentExpired()
  };
};
