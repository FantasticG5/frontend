import React, { useState } from 'react';
import CookieSettingsModal from '../components/CookieSettingsModal';

// CookieSettings-sida - visar cookie-inställningar
const CookieSettings = () => {
  // Styr om inställningsmodalen är öppen
  const [showSettingsModal, setShowSettingsModal] = useState(true);

  // När inställningar sparas i modalen
  const handleSettingsSave = (consentData) => {
    // Inställningar är redan sparade i modalen, stäng modalen
    setShowSettingsModal(false);
  };

  // Stäng inställningsmodal
  const handleSettingsClose = () => {
    setShowSettingsModal(false);
  };

  return (
    <div className="cookie-settings-page">
      <div className="container">
        <h1>Cookie-inställningar</h1>
        <p>
          Här kan du hantera dina cookie-inställningar. Du kan när som helst ändra dina val.
        </p>
        
        <div className="cookie-info">
          <h2>Vad är cookies?</h2>
          <p>
            Cookies är små textfiler som lagras på din enhet när du besöker vår webbplats. 
            De hjälper oss att förbättra din upplevelse och förstå hur du använder vår webbplats.
          </p>
          
          <h3>Typer av cookies vi använder:</h3>
          <ul>
            <li>
              <strong>Nödvändiga cookies:</strong> Dessa cookies är nödvändiga för att webbplatsen ska fungera korrekt. 
              De kan inte stängas av.
            </li>
            <li>
              <strong>Funktionella cookies:</strong> Dessa cookies gör det möjligt för webbplatsen att komma ihåg dina val 
              och förbättra din användarupplevelse.
            </li>
            <li>
              <strong>Analytiska cookies:</strong> Dessa cookies hjälper oss att förstå hur besökare använder webbplatsen 
              genom att samla och rapportera information anonymt.
            </li>
          </ul>
        </div>

        <div className="settings-actions">
          <button 
            className="btn-primary"
            onClick={() => setShowSettingsModal(true)}
          >
            Ändra cookie-inställningar
          </button>
          
          <a href="/about-cookies" className="btn-secondary-link">
            Läs mer om cookies
          </a>
        </div>
      </div>

      <CookieSettingsModal
        isOpen={showSettingsModal}
        onClose={handleSettingsClose}
        onSave={handleSettingsSave}
      />
    </div>
  );
};

export default CookieSettings;
