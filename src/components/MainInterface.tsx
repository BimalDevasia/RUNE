import SideBar from "./SideBar";
import ChatArea from "./ChatArea";
import { useTheme } from "../contexts/ThemeContext";

function MainInterface() {
  const { theme } = useTheme();

  return (
    <div className={`flex ${theme === "dark" ? "bg-black" : "bg-white"}`}>
      <SideBar />
      <ChatArea />
    </div>
  );
}

export default MainInterface;
