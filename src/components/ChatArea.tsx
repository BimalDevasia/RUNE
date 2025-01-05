
import { useState } from "react";
import { useTheme } from "../contexts/ThemeContext"
import { IoBookOutline } from "react-icons/io5";



interface userInfo{
  id:string
  email:string
}

interface ChatAreaProps{
  isSelected:string
  setIsSelected:(id:string) =>void
  user:userInfo
}
function ChatArea({ user, isSelected, setIsSelected}:ChatAreaProps) {

  const [isBookMarked,setIsBookMarked] = useState(false)
  const {theme}=useTheme()
  
  const messageDummy=[
    {type:"outgoing",message:"hello"},
    {type:"incoming",message:"how are you"},
    {type:"outgoing",message:"fine"},
    {type:"incoming",message:"what do you want"},
  ]

  const [message,setMessage]=useState(messageDummy)
  
  const handleBookmark=() => {
    setIsBookMarked(!isBookMarked)
  }


  return (
    <div className={`flex max-h-[calc(100svh-2rem)] h-[calc(100svh-2rem)] ${theme==="dark"?"bg-primary_grey text-white" :"bg-primary_grey/30 text-black"} flex-1 my-4 mr-4 rounded-[20px] font-roboto `}>
      <div className={`flex-1 border-r-[0.5px] flex flex-col ${theme==="dark"?"border-white/50":" border-primary_grey/50"} h-full`}>

      {/* first heading section */}
        <div className={`h-16 px-10 flex justify-between items-center font-medium text-2xl border-b ${theme==="dark"?"border-white/50":" border-primary_grey/50"} `}>
       <div> Welcome {user.id} !</div>
       <IoBookOutline className={`w-6 h-6 cursor-pointer ${isBookMarked?"text-primary_green":'text-white'} `}  onClick={handleBookmark}/>
        </div>
      
      {/* chat area */}
      <div className="flex-1 flex flex-col px-10">
        <div className="h-[80%] overflow-auto flex flex-col justify-end ">
          {message.map((item,index)=>(
            <div key={index} className={`flex w-full  ${item.type==="incoming"?"justify-start":"justify-end"} `}>
             <div className="max-w-[80%]">{item.message}</div> 
            </div>
          ))}
          </div>   
        <div className="relative flex-1  flex justify  ">
          <textarea name="" id="" className="w-full h-12 absolute bottom-5 bg-primary_grey border border-white outline-0 "></textarea>
          </div>                                                             
      </div>

      </div>
      <div className="w-1/4"></div>
    </div> 
  )
}

export default ChatArea