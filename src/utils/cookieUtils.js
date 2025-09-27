// Cookie utilities för att hantera samtyckesinställningar

// Sätt en cookie med namn, värde och alternativ
export const setCookie = (name, value, options = {}) => {
  const {
    expires = 365,
    path = '/',
    domain = window.location.hostname,
    secure = window.location.protocol === 'https:',
    sameSite = 'Lax'
  } = options;

  let cookieString = `${name}=${encodeURIComponent(value)}`;

  if (expires) {
    const date = new Date();
    date.setTime(date.getTime() + (expires * 24 * 60 * 60 * 1000));
    cookieString += `; expires=${date.toUTCString()}`;
  }

  cookieString += `; path=${path}`;
  cookieString += `; domain=${domain}`;
  
  if (secure) {
    cookieString += '; secure';
  }
  
  cookieString += `; samesite=${sameSite}`;

  document.cookie = cookieString;
};

// Hämta cookie-värde med namn
export const getCookie = (name) => {
  const nameEQ = name + "=";
  const ca = document.cookie.split(';');
  
  for (let i = 0; i < ca.length; i++) {
    let c = ca[i];
    while (c.charAt(0) === ' ') {
      c = c.substring(1, c.length);
    }
    if (c.indexOf(nameEQ) === 0) {
      return decodeURIComponent(c.substring(nameEQ.length, c.length));
    }
  }
  return null;
};

// Ta bort cookie med namn
export const deleteCookie = (name, options = {}) => {
  const { path = '/', domain = window.location.hostname } = options;
  
  document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=${path}; domain=${domain}`;
};

// Spara användarens samtyckesinställningar i cookie
export const saveConsentCookie = (consent) => {
  const consentData = {
    necessary: true,
    functional: consent.functional || false,
    analytical: consent.analytical || false,
    timestamp: new Date().toISOString(),
    version: '1.0'
  };

  setCookie('cookieConsent', JSON.stringify(consentData), {
    expires: 365,
    secure: window.location.protocol === 'https:',
    sameSite: 'Lax'
  });
};

// Hämta användarens samtyckesinställningar från cookie
export const getConsentCookie = () => {
  const consentString = getCookie('cookieConsent');
  
  if (!consentString) {
    return null;
  }

  try {
    const consent = JSON.parse(consentString);
    
    if (typeof consent === 'object' && 
        typeof consent.necessary === 'boolean' &&
        typeof consent.functional === 'boolean' &&
        typeof consent.analytical === 'boolean') {
      return consent;
    }
    
    return null;
  } catch (error) {
    console.warn('Invalid consent cookie format:', error);
    return null;
  }
};

// Kolla om användaren har gett samtycke
export const hasConsent = () => {
  const consent = getConsentCookie();
  return consent !== null;
};

// Rensa alla samtyckes-cookies och relaterad data - MVP version
export const clearConsent = () => {
  deleteCookie('cookieConsent');
  localStorage.removeItem('cookieConsent');
  
  // Rensa bara Hotjar cookies
  const hotjarCookies = ['_hjSession_', '_hjFirstSeen', '_hjSessionUser_'];
  
  hotjarCookies.forEach(cookieName => {
    deleteCookie(cookieName);
  });
};

// Rensa endast analytics-cookies när analytiska cookies stängs av - MVP version
export const clearAnalyticsCookies = () => {
  // Hotjar cookies
  const hotjarCookies = [
    '_hjSession_', '_hjFirstSeen', '_hjSessionUser_', '_hjIncludedInPageviewSample',
    '_hjIncludedInSessionSample', '_hjAbsoluteSessionInProgress', '_hjViewportId'
  ];
  
  // Ta bort Hotjar cookies
  hotjarCookies.forEach(cookieName => {
    deleteCookie(cookieName);
  });
  
  // Ta bort cookies som kan ha dynamiska suffix (t.ex. _hjSession_123456)
  const allCookies = document.cookie.split(';');
  allCookies.forEach(cookie => {
    const cookieName = cookie.split('=')[0].trim();
    
    // Kolla om cookien matchar Hotjar-mönster
    if (cookieName.startsWith('_hj')) {
      deleteCookie(cookieName);
    }
  });
  
  // Rensa localStorage för Hotjar
  Object.keys(localStorage).forEach(key => {
    if (key.startsWith('hotjar_')) {
      localStorage.removeItem(key);
    }
  });
  
  // Rensa sessionStorage för Hotjar
  Object.keys(sessionStorage).forEach(key => {
    if (key.startsWith('hotjar_')) {
      sessionStorage.removeItem(key);
    }
  });
};

// Hämta samtyckesstatus för specifik cookie-typ
export const getConsentForType = (type) => {
  const consent = getConsentCookie();
  
  if (!consent) {
    return type === 'necessary';
  }
  
  return consent[type] === true;
};

// Kolla om samtycke har gått ut (äldre än 1 år)
export const isConsentExpired = () => {
  const consent = getConsentCookie();
  
  if (!consent || !consent.timestamp) {
    return true;
  }
  
  const consentDate = new Date(consent.timestamp);
  const oneYearAgo = new Date();
  oneYearAgo.setFullYear(oneYearAgo.getFullYear() - 1);
  
  return consentDate < oneYearAgo;
};
