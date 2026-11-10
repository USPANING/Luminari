import { useState, useEffect, useRef } from "react";
import TestScreen from "./TestScreen";
import TestSummary from "./TestSummary";

const HomeTab = ({ user, setActiveTab, t }) => {
  return (
    <div
      className="fade-in"
      style={{
        padding: "30px 20px",
        paddingBottom: "100px",
        overflowY: "auto",
        height: "100%",
      }}
    >
      {/* Header */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "30px",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
          <div
            style={{
              width: "50px",
              height: "50px",
              borderRadius: "50%",
              backgroundColor:
                user.profilePic && user.profilePic.startsWith("#")
                  ? user.profilePic
                  : "#2a3a5c",
              backgroundImage:
                user.profilePic && user.profilePic.startsWith("blob")
                  ? `url(${user.profilePic})`
                  : "none",
              backgroundSize: "cover",
              backgroundPosition: "center",
            }}
          ></div>
          <h2 style={{ fontSize: "22px", fontWeight: "600" }}>
            {t.hello}, {user.nickname}!
          </h2>
        </div>
        <div
          onClick={() => setActiveTab("profile")}
          style={{ cursor: "pointer", opacity: 0.7 }}
        >
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="var(--text-muted)"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <circle cx="12" cy="12" r="3"></circle>
            <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"></path>
          </svg>
        </div>
      </div>

      {/* Progress Section */}
      <div style={{ marginBottom: "20px" }}>
        <h3 style={{ fontSize: "18px", marginBottom: "10px" }}>{t.progress}</h3>
        <div
          style={{
            height: "6px",
            background: "var(--bg-glass)",
            borderRadius: "10px",
            overflow: "hidden",
            marginBottom: "16px",
          }}
        >
          <div
            style={{
              width: "44%",
              height: "100%",
              background: "var(--primary-cyan)",
              borderRadius: "10px",
            }}
          ></div>
        </div>
        <button
          className="btn-primary"
          style={{
            padding: "12px 24px",
            width: "auto",
            display: "inline-block",
            borderRadius: "20px",
          }}
        >
          {t.continueLesson}
        </button>
      </div>

      {/* Stats Blocks */}
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "12px",
          marginBottom: "30px",
        }}
      >
        <div
          className="glass-panel"
          style={{
            padding: "16px 20px",
            display: "flex",
            alignItems: "center",
            gap: "14px",
          }}
        >
          <img
            src="/FireStreak.svg"
            alt="streak"
            style={{ width: "28px", height: "28px", flexShrink: 0 }}
          />
          <span style={{ fontSize: "18px", fontWeight: "600" }}>
            10{" "}
            <span
              style={{
                fontSize: "14px",
                fontWeight: "400",
                color: "var(--text-muted)",
              }}
            >
              {t.streakDays}
            </span>
          </span>
        </div>
        <div
          className="glass-panel"
          style={{
            padding: "16px 20px",
            display: "flex",
            alignItems: "center",
            gap: "14px",
          }}
        >
          <img
            src="/Stars.svg"
            alt="stars"
            style={{ width: "28px", height: "28px", flexShrink: 0 }}
          />
          <span style={{ fontSize: "18px", fontWeight: "600" }}>
            15{" "}
            <span
              style={{
                fontSize: "14px",
                fontWeight: "400",
                color: "var(--text-muted)",
              }}
            >
              {t.topicsCompleted}
            </span>
          </span>
        </div>
      </div>

      {/* Recently Viewed */}
      <div>
        <h3 style={{ fontSize: "18px", marginBottom: "12px" }}>
          {t.recentlyViewed}
        </h3>
        <div
          style={{
            display: "flex",
            gap: "12px",
            overflowX: "auto",
            paddingBottom: "10px",
          }}
        >
          <div
            className="glass-panel"
            style={{ padding: "20px", minWidth: "200px", flexShrink: 0 }}
          >
            <h4 style={{ fontSize: "18px", marginBottom: "4px" }}>
              Granica funkcji
            </h4>
            <p style={{ fontSize: "14px", color: "var(--text-muted)" }}>
              границя функції
            </p>
            <div style={{ marginTop: "40px" }}></div>
          </div>
          <div
            className="glass-panel"
            style={{
              padding: "20px",
              minWidth: "100px",
              flexShrink: 0,
              opacity: 0.5,
            }}
          ></div>
        </div>
        <button
          className="btn-primary"
          style={{
            marginTop: "10px",
            padding: "12px 24px",
            width: "auto",
            display: "inline-block",
            borderRadius: "20px",
            background: "#0088ff",
          }}
        >
          {t.seeAll}
        </button>
      </div>
    </div>
  );
};

const SubjectsTab = ({ t, onSubjectSelect }) => {
  const [subjects, setSubjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchSubjects = async () => {
      try {
        setLoading(true);
        const res = await fetch("/subjects");
        if (!res.ok) throw new Error("Failed to fetch subjects");
        const data = await res.json();
        setSubjects(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchSubjects();
  }, []);

  return (
    <div
      className="fade-in"
      style={{
        padding: "30px 20px",
        paddingBottom: "100px",
        overflowY: "auto",
        height: "100%",
      }}
    >
      <h2 style={{ fontSize: "24px", fontWeight: "600", marginBottom: "20px" }}>
        {t.subjects}
      </h2>
      
      {loading && (
        <div style={{ textAlign: "center", color: "var(--text-muted)", marginTop: "40px" }}>
          {t.loading}
        </div>
      )}
      
      {error && (
        <div style={{ textAlign: "center", color: "red", marginTop: "40px" }}>
          {t.error}
        </div>
      )}

      {!loading && !error && (
        <div style={{ display: "flex", flexDirection: "column", gap: "15px" }}>
          {subjects.map((subject) => (
            <div
              key={subject.id}
              onClick={() => onSubjectSelect(subject.id)}
              className="glass-panel"
              style={{
                padding: "20px",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                cursor: "pointer",
                transition: "transform 0.2s, background 0.2s",
              }}
              onMouseOver={(e) => (e.currentTarget.style.transform = "scale(1.02)")}
              onMouseOut={(e) => (e.currentTarget.style.transform = "scale(1)")}
            >
              <span style={{ fontSize: "18px", fontWeight: "500" }}>
                {subject.name}
              </span>
              <span style={{ fontSize: "24px", opacity: 0.5 }}>›</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

const DictionaryTab = ({t}) => (
  <div
    className="fade-in"
    style={{
      padding: "30px 20px",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      height: "100%",
    }}
  >
    <img
      src="/Notes.svg"
      alt="dictionary"
      style={{
        width: "60px",
        height: "60px",
        marginBottom: "20px",
        opacity: 0.7,
        filter: "invert(1)",
      }}
    />
    <h2 style={{ marginBottom: "10px" }}>{t.dictionary}</h2>
    <p style={{ color: "var(--text-muted)" }}>(Словарь в разработке)</p>
  </div>
);

const ChatBotTab = () => (
  <div
    className="fade-in"
    style={{
      padding: "30px 20px",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      height: "100%",
    }}
  >
    <img
      src="/ChatBot.svg"
      alt="chatbot"
      style={{
        width: "60px",
        height: "60px",
        marginBottom: "20px",
        opacity: 0.7,
        filter: "invert(1)",
      }}
    />
    <h2 style={{ marginBottom: "10px" }}>ChatBot</h2>
    <p style={{ color: "var(--text-muted)" }}>(Чат-бот в разработке)</p>
  </div>
);

const ProfileTab = ({ user, onLogout, t }) => {
  const fileInputRef = useRef(null);
  const [localPic, setLocalPic] = useState(user.profilePic);

  const handleFileSelect = (e) => {
    const file = e.target.files[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setLocalPic(url);
      user.profilePic = url; // Mutable update for prototype
    }
  };

  return (
    <div
      className="fade-in"
      style={{
        padding: "30px 20px",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        height: "100%",
        overflowY: "auto",
        paddingBottom: "100px",
      }}
    >
      <div
        style={{
          width: "100px",
          height: "100px",
          borderRadius: "50%",
          backgroundColor:
            localPic && localPic.startsWith("#") ? localPic : "#2a3a5c",
          backgroundImage:
            localPic && localPic.startsWith("blob")
              ? `url(${localPic})`
              : "none",
          backgroundSize: "cover",
          backgroundPosition: "center",
          marginBottom: "16px",
          boxShadow: "0 0 20px rgba(0,229,255,0.4)",
          border: "2px solid var(--primary-cyan)",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          overflow: "hidden",
          position: "relative",
        }}
      >
        {/* Icon of photo for changing theme later */}
        <div
          onClick={() => fileInputRef.current.click()}
          style={{
            position: "absolute",
            bottom: "0",
            width: "100%",
            height: "35%",
            background: "rgba(0,0,0,0.5)",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            cursor: "pointer",
          }}
        >
          <svg
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="white"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
            <circle cx="8.5" cy="8.5" r="1.5"></circle>
            <polyline points="21 15 16 10 5 21"></polyline>
          </svg>
        </div>
        <input
          type="file"
          accept="image/*"
          ref={fileInputRef}
          onChange={handleFileSelect}
          style={{ display: "none" }}
        />
      </div>

      <h2 style={{ fontSize: "24px", fontWeight: "600", marginBottom: "40px" }}>
        {user.nickname}
      </h2>

      <div
        style={{
          width: "100%",
          display: "flex",
          flexDirection: "column",
          gap: "12px",
        }}
      >
        {[
          { label: t.editProfile, action: () => {} },
          { label: t.achievements, action: () => {} },
          { label: t.settings, action: () => {} },
          { label: t.logOut, action: onLogout },
        ].map((item, idx) => (
          <div
            key={idx}
            onClick={item.action}
            className="glass-panel"
            style={{
              padding: "16px 20px",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              cursor: "pointer",
              transition: "background 0.2s",
            }}
          >
            <span style={{ fontSize: "18px", fontWeight: "500" }}>
              {item.label}
            </span>
            <span style={{ fontSize: "24px", opacity: 0.5 }}>›</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default function MainScreen({ user, onLogout, t }) {
  const [activeTab, setActiveTab] = useState("home");
  const [testSubjectId, setTestSubjectId] = useState(null);
  const [testAttemptId, setTestAttemptId] = useState(null);
  const [finishedAnswers, setFinishedAnswers] = useState(null);

  const handleSubjectSelect = (subjectId) => {
    setTestSubjectId(subjectId);
    setTestAttemptId(Date.now());
  };

  const handleTestFinish = (answers) => {
    setFinishedAnswers(answers);
    setTestSubjectId(null);
  };

  const handleTestCancel = () => {
    setTestSubjectId(null);
  };

  const handleSummaryClose = () => {
    setFinishedAnswers(null);
    setFinishedWrongAnswers(null);
  };

  if (finishedAnswers) {
    return (
      <TestSummary
        answers={finishedAnswers}
        userId={user.uczen_id}
        onClose={handleSummaryClose}
        t={t}
      />
    );
  }

  if (testSubjectId) {
    return (
      <TestScreen 
        key={`attempt-${testAttemptId}`}
        przedmiotId={testSubjectId} 
        onFinish={handleTestFinish} 
        onCancel={handleTestCancel} 
        t={t} 
      />
    );
  }

  const NavIcon = ({ tabId, src }) => {
    const isActive = activeTab === tabId;
    return (
      <button
        onClick={() => setActiveTab(tabId)}
        style={{
          background: "transparent",
          padding: "10px",
          opacity: isActive ? 1 : 0.85,
          transition: "all 0.2s ease",
          cursor: "pointer",
        }}
      >
        <div
          style={{
            width: "28px",
            height: "28px",
            backgroundColor: isActive ? "var(--primary-cyan)" : "#ffffff",
            WebkitMaskImage: `url(${src})`,
            WebkitMaskSize: "contain",
            WebkitMaskRepeat: "no-repeat",
            WebkitMaskPosition: "center",
            maskImage: `url(${src})`,
            maskSize: "contain",
            maskRepeat: "no-repeat",
            maskPosition: "center",
            filter: isActive
              ? "drop-shadow(0 0 10px rgba(0,229,255,0.9)) drop-shadow(0 0 4px rgba(0,229,255,0.5))"
              : "none",
            transition: "all 0.2s ease",
          }}
        />
      </button>
    );
  };

  return (
    <div style={{ height: "100%", position: "relative" }}>
      <div style={{ height: "100%" }}>
        {activeTab === "home" && (
          <HomeTab user={user} setActiveTab={setActiveTab} t={t} />
        )}
        {activeTab === "lectures" && (
          <SubjectsTab t={t} onSubjectSelect={handleSubjectSelect} />
        )}
        {activeTab === "dictionary" && <DictionaryTab t={t} />}
        {activeTab === "chatbot" && <ChatBotTab t={t} />}
        {activeTab === "profile" && (
          <ProfileTab user={user} onLogout={onLogout} t={t} />
        )}
      </div>

      {/* Bottom Navigation */}
      <div
        style={{
          position: "absolute",
          bottom: 0,
          left: 0,
          width: "100%",
          height: "80px",
          background: "rgba(15, 22, 36, 0.95)",
          backdropFilter: "blur(15px)",
          borderTop: "1px solid var(--border-glass)",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          padding: "0 25px",
          borderBottomLeftRadius: "40px",
          borderBottomRightRadius: "40px",
        }}
      >
        <NavIcon tabId="home" src="/House.svg" />
        <NavIcon tabId="lectures" src="/Lectures.svg" />
        <NavIcon tabId="dictionary" src="/Notes.svg" />
        <NavIcon tabId="chatbot" src="/ChatBot.svg" />
        <NavIcon tabId="profile" src="/PSettings.svg" />
      </div>
    </div>
  );
}
