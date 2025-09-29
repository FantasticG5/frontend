import React, { useState, useEffect } from 'react';
import { getConsentCookie, saveConsentCookie, clearAnalyticsCookies } from '../utils/cookieUtils';

// CookieSettingsModal - modal för att anpassa cookie-inställningar
const CookieSettingsModal = ({ isOpen, onClose, onSave }) => {
  // State för att spåra nuvarande cookie-inställningar
  // necessary är alltid true och kan inte ändras
  const [settings, setSettings] = useState({
    necessary: true,    // Alltid true - behövs för grundfunktionalitet
    functional: false,  // Användarens preferens för funktionella cookies
    analytical: false   // Användarens preferens för analytiska cookies
  });

  // Ladda nuvarande inställningar när modalen öppnas
  useEffect(() => {
    if (isOpen) {
      // Ladda nuvarande inställningar från samtyckes-cookie
      const consent = getConsentCookie();
      if (consent) {
        setSettings({
          necessary: true, // Alltid true och låst
          functional: consent.functional || false,
          analytical: consent.analytical || false
        });
      }
      // Om inget samtycke finns, behåll standardvärden (bara nödvändiga aktiverade)
    }
  }, [isOpen]);

  // Växla cookie-inställningar
  const handleToggle = (type) => {
    // Förhindra växling av nödvändiga cookies - de är alltid nödvändiga
    if (type === 'necessary') return;
    
    // Växla den angivna cookie-typen
    setSettings(prev => ({
      ...prev,
      [type]: !prev[type]
    }));
  };

  // Spara cookie-inställningar
  const handleSave = () => {
    // Hämta nuvarande samtycke för att jämföra
    const currentConsent = getConsentCookie();
    const previousAnalytical = currentConsent?.analytical || false;
    const newAnalytical = settings.analytical;
    
    const consentData = {
      necessary: true,              // Alltid true - behövs för grundfunktionalitet
      functional: settings.functional,   // Användarens val för funktionella cookies
      analytical: newAnalytical    // Användarens val för analytiska cookies
    };
    
    // Om analytiska cookies stängs av, rensa analytics-cookies direkt
    if (previousAnalytical && !newAnalytical) {
      clearAnalyticsCookies();
      console.log('Analytics cookies cleared in settings modal');
    }
    
    // Spara samtycket i en browser-cookie
    saveConsentCookie(consentData);
    
    // Meddela föräldrakomponenten att inställningar sparades
    onSave(consentData);
    
    // Stäng modalen
    onClose();
  };

  // Avbryt ändringar
  const handleCancel = () => {
    onClose();
  };

  if (!isOpen) return null;
  return (
    <div className="modal-overlay" onClick={handleCancel}>
      <div className="modal cookie-settings-modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h3>Cookie-inställningar</h3>
          <button className="close-btn" onClick={handleCancel}>
            ×
          </button>
        </div>
        
        <div className="modal-body">
          <p className="modal-description">
            Välj vilka typer av cookies du vill tillåta. Nödvändiga cookies är alltid aktiva 
            eftersom de krävs för att webbplatsen ska fungera korrekt.
          </p>
          
          <div className="cookie-settings-list">
            <div className="cookie-setting-item necessary">
              <div className="cookie-setting-info">
                <h4>Nödvändiga cookies</h4>
                <p>
                  Dessa cookies är nödvändiga för att webbplatsen ska fungera och kan inte stängas av. 
                  De lagrar ingen personlig information.
                </p>
              </div>
              <div className="cookie-toggle-container">
                <label className="cookie-toggle locked">
                  <input 
                    type="checkbox" 
                    checked={true} 
                    disabled={true}
                    readOnly
                  />
                  <span className="toggle-slider"></span>
                </label>
                <span className="toggle-label">Alltid aktiv</span>
              </div>
            </div>

            <div className="cookie-setting-item">
              <div className="cookie-setting-info">
                <h4>Funktionella cookies</h4>
                <p>
                  Dessa cookies gör det möjligt för webbplatsen att komma ihåg dina val och 
                  förbättra din användarupplevelse.
                </p>
              </div>
              <div className="cookie-toggle-container">
                <label className="cookie-toggle">
                  <input 
                    type="checkbox" 
                    checked={settings.functional}
                    onChange={() => handleToggle('functional')}
                  />
                  <span className="toggle-slider"></span>
                </label>
              </div>
            </div>

            <div className="cookie-setting-item">
              <div className="cookie-setting-info">
                <h4>Analytiska cookies</h4>
                <p>
                  Dessa cookies hjälper oss att förstå hur besökare använder webbplatsen genom 
                  att samla och rapportera information anonymt.
                </p>
              </div>
              <div className="cookie-toggle-container">
                <label className="cookie-toggle">
                  <input 
                    type="checkbox" 
                    checked={settings.analytical}
                    onChange={() => handleToggle('analytical')}
                  />
                  <span className="toggle-slider"></span>
                </label>
              </div>
            </div>
          </div>
        </div>
        <div className="modal-actions">
          <button className="btn-secondary" onClick={handleCancel}>
            Avbryt
          </button>
          <button className="btn-accept-all" onClick={handleSave}>
            Spara inställningar
          </button>
        </div>
      </div>
    </div>
  );
};

export default CookieSettingsModal;
