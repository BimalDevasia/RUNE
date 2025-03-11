import { useTheme } from "../contexts/ThemeContext";
import NewChat from "./NewChat";
import SideBar from "./SideBar";

const NewChatInterface = () => {
  const { theme } = useTheme();
  return (
    <>
      <div className={`flex ${theme === "dark" ? "bg-black" : "bg-white"}`}>
        <SideBar />
        <NewChat />
      </div>
    </>
  );
};

export default NewChatInterface;
