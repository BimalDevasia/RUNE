import { useAuth } from "../contexts/AuthContext";
import "./customscroll.css"
import { Link } from "react-router";
import { useNavigate } from "react-router-dom";

function HeroSection() {
  const { user,logout }=useAuth()
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await logout();
      navigate("/login"); // Redirect to login page after logout
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };
    return (
      <div
        className="no_overflow w-svw h-svh flex flex-col bg-cover bg-center overflow-hidden"
        style={{ backgroundImage: "url(./hero.png)" }}
      >
        {/* Header Section */}
        <div className="h-28 flex px-32 items-center justify-center font-sen">
          <div className="font-sen z-10 text-7xl text-[#DDC165] w-full font-bold">RUNE</div>
          <div className="flex gap-3">
            <div className="w-32 h-10 bg-primary_green flex justify-center items-center rounded-2xl font-bold">
              <Link to="/login">LOGIN</Link>
            </div>
            <div className="w-32 h-10 bg-primary_green flex justify-center items-center rounded-2xl font-bold">
            <Link to="/login">SIGN IN</Link>
            </div>
          </div>
        </div>
  
        {/* Hero Section */}
        <div className="relative flex-1 flex">
          <div className="w-1/2 h-full flex flex-col  justify-center pl-32 gap-5 font-ubuntu_mono">
            <div className="text-7xl text-primary_green ">Learn Smarter, Faster</div>
            <div className="text-4xl text-white w-3/4">Your textbook, your smart tutor—instant answers & quizzes!"</div>
          </div>
          <div className=" w-1/2 h-full">
            <div  className="absolute w-[600px] h-full bg-cover bg-no-repeat bg-center bottom-0 right-0 " style={{backgroundImage:'URL(./herorobo.png)'}}></div>
          </div>
        </div>
      </div>
    );
  }
  
  export default HeroSection;
  