import { useState } from "react";
import { LoginScreen } from "./components/LoginScreen";
import { UserInfoCapture } from "./components/UserInfoCapture";
import { OracleSetup, OracleConfig } from "./components/OracleSetup";
import { LifeSatisfactionScale } from "./components/LifeSatisfactionScale";
import { ZOWScreen } from "./components/ZOWScreen";
import { HomeScreen } from "./components/HomeScreen";
import { ConversationalChat } from "./components/ConversationalChat";
import { AnimatedBackground } from "./components/AnimatedBackground";

type AppState = "login" | "userInfo" | "oracleSetup" | "lifeSatisfaction" | "zow" | "home" | "chat";

interface UserInfo {
  name: string;
  gender: string;
}

function App() {
  const [appState, setAppState] = useState<AppState>("login");
  const [userInfo, setUserInfo] = useState<UserInfo>({ name: "", gender: "" });
  const [oracleConfig, setOracleConfig] = useState<OracleConfig>({
    name: "",
    avatarUrl: "",
    voiceType: ""
  });
  const [lifeSatisfactionScores, setLifeSatisfactionScores] = useState<number[]>([]);
  const [micPermissionGranted, setMicPermissionGranted] = useState(false);

  const handleLogin = () => {
    setAppState("userInfo");
  };

  const handleUserInfoComplete = (info: UserInfo) => {
    setUserInfo(info);
    setAppState("oracleSetup");
  };

  const handleOracleSetupComplete = (config: OracleConfig) => {
    setOracleConfig(config);
    setAppState("chat"); // Go straight to chat after oracle setup
  };

  const handleLifeSatisfactionComplete = (scores: number[]) => {
    setLifeSatisfactionScores(scores);
    setAppState("zow");
  };

  const handleZOWComplete = () => {
    setAppState("chat");
  };

  const handleStartChat = (mode: string) => {
    setAppState("chat");
  };

  const handleCloseChat = () => {
    setAppState("home");
  };

  return (
    <>
      {appState === "login" && <LoginScreen onLogin={handleLogin} />}
      {appState === "userInfo" && (
        <UserInfoCapture 
          onComplete={handleUserInfoComplete} 
          permissionGranted={micPermissionGranted}
          onPermissionGranted={setMicPermissionGranted}
        />
      )}
      {appState === "oracleSetup" && (
        <OracleSetup 
          userName={userInfo.name} 
          onComplete={handleOracleSetupComplete}
          permissionGranted={micPermissionGranted}
          onPermissionGranted={setMicPermissionGranted}
        />
      )}
      {appState === "lifeSatisfaction" && (
        <LifeSatisfactionScale userName={userInfo.name} onComplete={handleLifeSatisfactionComplete} />
      )}
      {appState === "zow" && (
        <ZOWScreen userName={userInfo.name} onComplete={handleZOWComplete} />
      )}
      {appState === "home" && (
        <HomeScreen userName={userInfo.name} onStartChat={handleStartChat} />
      )}
      {appState === "chat" && (
        <ConversationalChat 
          oracleName={oracleConfig.name}
          userName={userInfo.name}
          onClose={handleCloseChat}
        />
      )}
      <AnimatedBackground />
    </>
  );
}

export default App;