import { useState } from 'react'
import SideBar from './SideBar'

const user=[{id:"Sasi",email:"sasi@gmail.com",img:""}]
function MainInterface() {
    const [isSelected,setIsSelected] =useState("")

    
  return (
    <div>
        <SideBar setIsSelected={setIsSelected} isSelected={isSelected} user={user}/>
    </div>
  )
}

export default MainInterface