import React from 'react';

const AboutCookies = () => {
  // Cookie-information per kategori - förenklad version
  const cookieCategories = {
    necessary: {
      title: "Nödvändiga cookies",
      description: "Dessa cookies behövs för att webbplatsen ska fungera. De kan inte stängas av.",
      cookies: [
        {
          name: "Säkerhet och inloggning",
          purpose: "Håller dig inloggad och skyddar din information",
          duration: "Tills du loggar ut"
        },
        {
          name: "Cookie-inställningar",
          purpose: "Kommer ihåg dina val om cookies",
          duration: "1 år"
        }
      ]
    },
    functional: {
      title: "Funktionella cookies",
      description: "Dessa cookies gör webbplatsen mer användarvänlig genom att komma ihåg dina val.",
      cookies: [
        {
          name: "Språk och inställningar",
          purpose: "Kommer ihåg ditt språk och andra preferenser",
          duration: "6 månader"
        }
      ]
    },
    analytical: {
      title: "Analytiska cookies",
      description: "Dessa cookies hjälper oss förstå hur du använder webbplatsen så vi kan förbättra den.",
      cookies: [
        {
          name: "Användarstatistik",
          purpose: "Spårar vilka sidor du besöker och hur du navigerar",
          duration: "1 år"
        }
      ]
    }
  };

  const versionInfo = {
    version: "1.0",
    lastUpdated: "2024-09-27"
  };

  return (
    <div className="about-cookies-page">
      <div className="container">
        <header className="page-header">
          <h1>Om cookies</h1>
          <p className="page-description">
            Denna sida beskriver vilka cookies vi använder på vår webbplats och i vilket syfte. 
            Du kan hantera dina cookie-preferenser genom att använda cookie-inställningarna.
          </p>
        </header>

        <div className="version-info">
          <p><strong>Version:</strong> {versionInfo.version}</p>
          <p><strong>Senast uppdaterad:</strong> {versionInfo.lastUpdated}</p>
        </div>

        <div className="cookie-categories">
          {Object.entries(cookieCategories).map(([categoryKey, category]) => (
            <div key={categoryKey} className="cookie-category">
              <h2>{category.title}</h2>
              <p className="category-description">{category.description}</p>
              
              <div className="cookies-list">
                {category.cookies.map((cookie, index) => (
                  <div key={index} className="cookie-item">
                    <div className="cookie-item-header">
                      <h4>{cookie.name}</h4>
                      <span className="duration-badge">{cookie.duration}</span>
                    </div>
                    <p className="cookie-item-purpose">{cookie.purpose}</p>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        <div className="additional-info">
          <h2>Vanliga frågor</h2>
          <div className="info-sections">
            <div className="info-section">
              <h3>Vad är cookies?</h3>
              <p>
                Cookies är små filer som hjälper webbplatsen att komma ihåg dig och dina val. 
                Tänk på dem som anteckningar som webbplatsen gör för att ge dig en bättre upplevelse.
              </p>
            </div>

            <div className="info-section">
              <h3>Kan jag ändra mina val?</h3>
              <p>
                Ja! Du kan när som helst ändra dina cookie-inställningar genom att klicka på 
                "Cookie-inställningar" i menyn.
              </p>
            </div>

            <div className="info-section">
              <h3>Är mina data säkra?</h3>
              <p>
                Ja, vi följer alla säkerhetsregler och lagar. Vi samlar bara den information 
                vi behöver för att ge dig en bra upplevelse.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AboutCookies;
