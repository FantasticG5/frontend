import React, { useState } from 'react';
import CookieSettingsModal from './CookieSettingsModal';
import { useCookieConsent } from '../hooks/useCookieConsent';

// CookieBanner - visar cookie-banner för nya användare
const CookieBanner = () => {
  // Styr om bannern ska visas
  const [showBanner, setShowBanner] = useState(false);
  
  // Styr om inställningsmodalen är öppen
  const [showSettingsModal, setShowSettingsModal] = useState(false);
  
  // Hook som hanterar cookie-samtycke och ger utility-funktioner
  // Laddar samtycke från cookies, sparar nytt samtycke, och kollar status
  const { hasUserConsent, saveConsent, isLoading } = useCookieConsent();

  // Visar bannern bara för nya användare
  React.useEffect(() => {
    if (!isLoading && !hasUserConsent) {
      setShowBanner(true);
    }
  }, [isLoading, hasUserConsent]);

  // Acceptera alla cookies
  const handleAcceptAll = () => {
    const success = saveConsent({
      necessary: true,    // Alltid true - behövs för grundfunktionalitet
      functional: true,   // Användaren accepterar funktionella cookies (inställningar, etc.)
      analytical: true    // Användaren accepterar analytiska cookies (spårning, analytics)
    });
    
    // Dölj bannern bara om samtycket sparades framgångsrikt
    if (success) {
      setShowBanner(false);
    }
  };

  // Avvisa icke nödvändiga cookies
  const handleReject = () => {
    const success = saveConsent({
      necessary: true,     // Alltid true - behövs för grundfunktionalitet
      functional: false,   // Användaren avvisar funktionella cookies
      analytical: false    // Användaren avvisar analytiska cookies
    });
    
    // Dölj bannern bara om samtycket sparades framgångsrikt
    if (success) {
      setShowBanner(false);
    }
  };

  // Öppna inställningsmodal
  const handleCustomize = () => {
    setShowSettingsModal(true);
  };

  // När inställningar sparas i modalen
  const handleSettingsSave = (consentData) => {
    // Inställningar är redan sparade i modalen, bara stäng bannern
    setShowBanner(false);
  };

  // Stäng inställningsmodal
  const handleSettingsClose = () => {
    setShowSettingsModal(false);
  };

  if (!showBanner) {
    return null;
  }
  return (
    <>
      <div className="cookie-banner">
        <div className="cookie-banner-content">
          <div className="cookie-banner-text">
            <h3>Vi använder cookies</h3>
            <p>
              Vi använder cookies för att förbättra din upplevelse på vår webbplats. 
              Nödvändiga cookies är alltid aktiva, men du kan välja att aktivera eller 
              inaktivera funktionella och analytiska cookies.
            </p>
          </div>
          
          <div className="cookie-banner-actions">
            <button 
              className="btn-cookie btn-accept-all" 
              onClick={handleAcceptAll}
            >
              Acceptera alla
            </button>
            
            <button 
              className="btn-cookie btn-reject" 
              onClick={handleReject}
            >
              Avvisa icke nödvändiga
            </button>
            
            <button 
              className="btn-cookie btn-customize" 
              onClick={handleCustomize}
            >
              Anpassa
            </button>
          </div>
        </div>
      </div>
      <CookieSettingsModal
        isOpen={showSettingsModal}
        onClose={handleSettingsClose}
        onSave={handleSettingsSave}
      />
    </>
  );
};

export default CookieBanner;
