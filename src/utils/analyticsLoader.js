// Analytics script loader - MVP version med bara Hotjar

// Lista över laddade analytics-skript
let loadedScripts = new Set();

/**
 * Laddar ett analytics-skript dynamiskt
 * @param {string} src - URL till skriptet
 * @param {string} id - Unikt ID för skriptet
 */
export const loadAnalyticsScript = (src, id) => {
  // Kontrollera om skriptet redan är laddat
  if (loadedScripts.has(id) || document.getElementById(id)) {
    return Promise.resolve();
  }

  return new Promise((resolve, reject) => {
    const script = document.createElement('script');
    script.id = id;
    script.src = src;
    script.async = true;
    script.defer = true;

    script.onload = () => {
      loadedScripts.add(id);
      console.log(`Analytics script loaded: ${id}`);
      resolve();
    };

    script.onerror = () => {
      console.error(`Failed to load analytics script: ${id}`);
      reject(new Error(`Failed to load ${id}`));
    };

    document.head.appendChild(script);
  });
};

/**
 * Tar bort ett analytics-skript
 * @param {string} id - ID för skriptet att ta bort
 */
export const removeAnalyticsScript = (id) => {
  const script = document.getElementById(id);
  if (script) {
    script.remove();
    loadedScripts.delete(id);
    console.log(`Analytics script removed: ${id}`);
  }
};

/**
 * Tar bort alla analytics-skript
 */
export const removeAllAnalyticsScripts = () => {
  removeAnalyticsScript('hotjar');
  
  // Rensa Hotjar globala variabler
  if (window.hj) {
    delete window.hj;
  }
  if (window._hjSettings) {
    delete window._hjSettings;
  }
};

/**
 * Laddar Hotjar
 * @param {string} siteId - Hotjar Site ID
 */
export const loadHotjar = (siteId) => {
  return new Promise((resolve, reject) => {
    // Kontrollera om Hotjar redan är laddat
    if (window.hj) {
      resolve();
      return;
    }

    // Skapa Hotjar-funktion (exakt som Hotjar's officiella script)
    window.hj = window.hj || function() {
      (window.hj.q = window.hj.q || []).push(arguments);
    };

    // Sätt Hotjar-inställningar (exakt som Hotjar's officiella script)
    window._hjSettings = { hjid: siteId, hjsv: 6 };

    // Ladda scriptet
    const script = document.createElement('script');
    script.id = 'hotjar';
    script.async = true;
    script.src = `https://static.hotjar.com/c/hotjar-${siteId}.js?sv=6`;
    
    script.onload = () => {
      console.log('Hotjar loaded and initialized');
      resolve();
    };

    script.onerror = () => {
      console.error('Failed to load Hotjar script');
      reject(new Error('Failed to load Hotjar'));
    };

    document.head.appendChild(script);
  });
};