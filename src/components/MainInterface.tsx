import { useState } from 'react'
import SideBar from './SideBar'
import ChatArea from './ChatArea'
import { useTheme } from '../contexts/ThemeContext'
const user={id:"Sasi",email:"sasi@gmail.com",img:""}
function MainInterface() {
    const [isSelected, setIsSelected] = useState("");
    const {theme} = useTheme()
    
  return (
    <div className={`flex ${theme === "dark" ? "bg-black" : "bg-white"}`}>
      <SideBar user={user} />
      <ChatArea
        setIsSelected={setIsSelected}
        isSelected={isSelected}
        user={user}
      />
    </div>
  );
}

export default MainInterface