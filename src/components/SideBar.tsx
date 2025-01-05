import { FiPlusCircle } from "react-icons/fi";
import { IoBookOutline } from "react-icons/io5";
import { IoMdNotificationsOutline } from "react-icons/io";
import { MdOutlineSettings } from "react-icons/md";
import { RiInformation2Line } from "react-icons/ri";
import { useTheme } from "../contexts/ThemeContext";
import { MdDarkMode } from "react-icons/md";
import { MdOutlineLightMode } from "react-icons/md";
import "./customscroll.css"
const navlinks=[
    {id:"New Chat",icons:<FiPlusCircle className="w-6 h-6"/>},
    {id:"Bookmark chats",icons:<IoBookOutline className="w-6 h-6" />},
    {id:"Notifications",icons:<IoMdNotificationsOutline className="w-6 h-6" />},
    {id:"Settings",icons:<MdOutlineSettings className="w-6 h-6" />},
    {id:"About us",icons:<RiInformation2Line className="w-6 h-6" />}
    ]

    interface userInfo{
        id:string
        email:string
    }

    interface props{
        setIsSelected:(id:string)=>void
        isSelected:string
        user:userInfo
    
    }
    
function SideBar(props:props) {

    const {theme, toggleTheme}=useTheme()

    const content=[
        {title:"check"},
        {title:"check"},
        {title:"check"},
        {title:"check"},
        {title:"check"},
        {title:"check"},
        {title:"check"},
        {title:"check"},
        {title:"check"},
        {title:"check"},
        {title:"check"},
        {title:"check"},
    ]


  return (
    <div className={`max-h-svh h-svh w-1/5 ${theme=="dark"?"bg-black text-white":"bg-white text-black"} font-roboto flex flex-col gap-4 px-4 pb-3`}>
        <div className="flex items-center justify-center pt-5 gap-3">
            <img src="" alt="Photo" />
            LOGO
        </div>
        <div>
            {navlinks.map((items)=>{
                return (
                    <div key={items.id} className={`flex gap-4 items-center cursor-pointer ${props.isSelected===items.id?"bg-primary_green":""} px-4 rounded-xl h-10 `} onClick={()=>props.setIsSelected(items.id)}>
                        {items.icons} <p className="font-semibold">{items.id}</p>
                    </div>
                );
            })}
        </div>
        <hr className="m-0 " />
        {(props.isSelected==="New Chat" &&
            <p className=" font-semibold">Recent Chats</p>)
            || props.isSelected==="Bookmark chats" && 
            <p className=" font-semibold">Bookmark Chats</p>
        }
        <div className="flex-1 overflow-auto px-4 font-roboto custom-scroll ">
            <div className="overflow-y-auto flex-1   font-light text-sm flex flex-col gap-1">
            {(props.isSelected==="New Chat" || props.isSelected==="Bookmark chats") &&
                content.map((content)=>(
                    <div>
                        {content.title}
                    </div>
                ))
            }
            </div>
        </div>
            
        <div className="mt-auto flex flex-col gap-3">

            <div className="bg-primary_grey h-36 px-3 flex flex-col justify-between py-3 rounded-xl">
                <div className="flex items-center gap-2 ">
                    <img src="./user.jpeg" alt="" className="w-11 h-11 object-cover object-center rounded-full"/>
                    
                        <div >
                        <p className="text-[14px]">{props.user.id}</p>
                        <p className="text-[13px]">{props.user.email}</p>
                        </div>
                   
                    <button className="ml-auto">
                        Logout
                    </button>
                </div>

                <div className="flex justify-center h-12 py-2 border border-solid rounded-xl items-center ">
                    View Profile
                </div>
            </div>

            <div className="relative h-12 bg-primary_grey flex px-1 py-1 rounded-xl ">
                
                <div className={`w-1/2 flex justify-center items-center gap-2 font-medium rounded-xl ${theme==="dark"?"bg-black":""}`} onClick={()=>toggleTheme("dark")}><MdDarkMode  />Dark</div>
                <div className={`w-1/2 flex justify-center items-center gap-2 font-medium rounded-xl ${theme==="light"?"bg-black":""}`} onClick={()=>toggleTheme("light")}><MdOutlineLightMode />Light</div>
            </div>

        </div>

        
    </div>
  )
}

export default SideBar