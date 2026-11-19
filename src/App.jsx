import { useState } from "react";
import AuthScreen from "./components/AuthScreen";
import MainScreen from "./components/MainScreen";
import { translations, detectLanguage } from "./AllLanguages";

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState({
    uczen_id: 1,
    nickname: "",
    role: "",
    profilePic: null,
  });
  const [language, setLanguage] = useState(detectLanguage());
  const t = translations[language];

  const handleLogin = (nickname, role, profilePic = null, id = null) => {
    setUser((prev) => ({ ...prev, nickname, role, profilePic, uczen_id: id ?? prev.uczen_id }));
    setIsAuthenticated(true);
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
  };

  return (
    <div className="desktop-wrapper">
      <div className="phone-frame">
        <div className="phone-viewport">
          {!isAuthenticated ? (
            <AuthScreen
              onLogin={handleLogin}
              t={t}
              language={language}
              setLanguage={setLanguage}
            />
          ) : (
            <MainScreen user={user} onLogout={handleLogout} t={t} />
          )}
        </div>
      </div>
    </div>
  );
}

export default App;
