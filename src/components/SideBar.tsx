import { FiPlusCircle } from "react-icons/fi";
import { IoBookOutline } from "react-icons/io5";
import { MdOutlineSettings } from "react-icons/md";
import { RiInformation2Line } from "react-icons/ri";
import { useTheme } from "../contexts/ThemeContext";
import { MdDarkMode } from "react-icons/md";
import { MdOutlineLightMode } from "react-icons/md";
import "./customscroll.css";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { Link, useLocation, useParams } from "react-router";
import { useState } from "react";
import { twMerge } from "tailwind-merge";
const navlinks = [
  { id: "Bookmark chats", icons: <IoBookOutline className="w-6 h-6" /> },
  { id: "Settings", icons: <MdOutlineSettings className="w-6 h-6" /> },
  { id: "About us", icons: <RiInformation2Line className="w-6 h-6" /> },
];

interface userInfo {
  id: string;
  email: string;
}

interface props {
  user: userInfo;
}

function SideBar(props: props) {
  const { theme, toggleTheme } = useTheme();
  const [isSelected, setIsSelected] = useState("");
  const location = useLocation();
  const pathname = location.pathname;
  const { chat_id } = useParams();
  const query = useQuery({
    queryKey: ["chats"],
    queryFn: async () => {
      const response = await axios.get(`${import.meta.env.VITE_API_URL!}/chat`);

      return response.data;
    },
  });

  const chats = query.isLoading ? [] : query.data;

  return (
    <div
      className={`max-h-svh h-svh w-1/5 ${
        theme == "dark" ? "bg-black text-white" : "bg-white text-black"
      } font-roboto flex flex-col gap-4 px-4 pb-3`}
    >
      <div className="flex items-center justify-center pt-5 gap-3">
        {/* <img src="" alt="" /> */}
        <p
          className={`text-3xl font-sen ${
            theme === "dark" ? "text-[#DDC165]" : "text-[#8E7112]"
          } font-bold`}
        >
          RUNE
        </p>
      </div>
      <div>
        <Link
          className={twMerge(
            "flex gap-4 items-center cursor-pointer px-4 rounded-xl h-10 ",
            pathname === "/" && "bg-primary_green"
          )}
          to="/"
        >
          <FiPlusCircle className="w-6 h-6" />{" "}
          <p className="font-semibold">New Chat</p>
        </Link>
        {navlinks.map((items) => {
          return (
            <div
              key={items.id}
              className={`flex gap-4 items-center cursor-pointer ${
                isSelected === items.id ? "bg-primary_green" : ""
              } px-4 rounded-xl h-10 `}
              onClick={() => setIsSelected(items.id)}
            >
              {items.icons} <p className="font-semibold">{items.id}</p>
            </div>
          );
        })}
      </div>
      <hr className="m-0 " />
      {(isSelected === "New Chat" && (
        <p className=" font-semibold">Recent Chats</p>
      )) ||
        (isSelected === "Bookmark chats" && (
          <p className=" font-semibold">Bookmark Chats</p>
        ))}
      <div className="flex-1 overflow-auto px-4 font-roboto custom-scroll ">
        <div className="overflow-y-auto flex-1   font-light text-sm flex flex-col gap-1">
          {chats.map((chat) => (
            <Link
              key={chat.chat_id}
              className={twMerge(
                "border border-white/50 px-3 py-2 rounded-sm",
                chat_id === chat.chat_id &&
                  "bg-white/70 text-black font-medium",
                chat_id !== chat.chat_id && "hover:bg-slate-700"
              )}
              to={`/chat/${chat.chat_id}`}
            >
              {chat.title}
            </Link>
          ))}
        </div>
      </div>

      <div className="mt-auto flex flex-col gap-3">
        <div
          className={`h-36 px-3 flex flex-col justify-between py-3 rounded-xl ${
            theme === "dark" ? "bg-primary_grey" : "bg-black/20"
          }`}
        >
          <div className="flex items-center gap-2 ">
            <img
              src="./user.jpeg"
              alt=""
              className="w-11 h-11 object-cover object-center rounded-full"
            />

            <div>
              <p className="text-[14px]">{props.user.id}</p>
              <p className="text-[13px]">{props.user.email}</p>
            </div>

            <button className="ml-auto">Logout</button>
          </div>

          <div
            className={`flex justify-center h-12 py-2 border border-solid rounded-xl items-center cursor-pointer ${
              theme === "dark" ? "bg-primary_grey" : "bg-black/30"
            }`}
          >
            View Profile
          </div>
        </div>

        <div
          className={`relative h-12 ${
            theme === "dark" ? "bg-primary_grey" : "bg-black/20"
          } flex px-1 py-1 rounded-xl`}
        >
          <div
            className={`w-1/2 flex justify-center items-center gap-2 font-medium rounded-xl ${
              theme === "dark" ? "bg-black" : ""
            } cursor-pointer`}
            onClick={() => toggleTheme("dark")}
          >
            <MdDarkMode />
            Dark
          </div>
          <div
            className={`w-1/2 flex justify-center items-center gap-2 font-medium rounded-xl ${
              theme === "light" ? "bg-black/30" : ""
            } cursor-pointer`}
            onClick={() => toggleTheme("light")}
          >
            <MdOutlineLightMode />
            Light
          </div>
        </div>
      </div>
    </div>
  );
}

export default SideBar