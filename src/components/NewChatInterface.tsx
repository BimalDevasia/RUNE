import { useTheme } from "../contexts/ThemeContext";
import NewChat from "./NewChat";
import SideBar from "./SideBar";
const user = { id: "Sasi", email: "sasi@gmail.com", img: "" };

const NewChatInterface = () => {
  const { theme } = useTheme();
  return (
    <>
      <div className={`flex ${theme === "dark" ? "bg-black" : "bg-white"}`}>
        <SideBar user={user} />
        <NewChat />
      </div>
    </>
  );
};

export default NewChatInterface;
