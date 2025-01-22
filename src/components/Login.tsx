import  { useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';
import { Link } from 'react-router';

function Login() {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className="flex bg-[#09090A] h-svh w-svh text-white font-sen">
      <div className="w-1/2 flex flex-col justify-center items-center">
        <div className="font-sen text-[100px] mb-8 text-[#DDC165]">
          RUNE
        </div>
        <form className='w-2/4'>

          <div className='space-y-6'>
          <div className="relative">
            <input 
              type="email" 
              id="email" 
              className="peer w-full pt-2 focus:outline-none border-b-2 border-white bg-transparent h-10 text-white text-[16px]"
              placeholder=" "
              required
            />
            <label 
              htmlFor="email" 
              className="absolute left-0 -top-2 text-sm text-primary_green transition-all duration-300
                         peer-placeholder-shown:text-gray-400 peer-placeholder-shown:top-2
                         peer-focus:-top-2 peer-focus:text-primary_green font-bold"
            >
              Email
            </label>
          </div>    

          <div className="relative">
            <input 
              type={showPassword ? 'text' : 'password'}
              id="password" 
              className="peer w-full pt-2 pr-10 focus:outline-none border-b-2 border-white bg-transparent h-10 text-white text-[16px] "
              placeholder=" "
              required
            />
            <label 
              htmlFor="password" 
              className="absolute left-0 -top-2 text-sm text-primary_green transition-all duration-300
                         peer-placeholder-shown:text-gray-400 peer-placeholder-shown:top-2
                         peer-focus:-top-2 peer-focus:text-primary_green font-bold"
            >
              Password
            </label>
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-2 top-3 text-white hover:text-primary_green"
            >
              {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
          </div>
          </div>

            <div className='pt-10'>
            <p className='text-sm text-primary_green flex justify-end pt-3 w-full cursor-pointer'>Forgot Password ?</p>
            <Link to='/'>
            <button type="submit" className='w-full flex justify-center items-center h-10 bg-primary_green my-3 rounded-xl font-bold text-lg'>Login</button>
            </Link>
            <p className='text-xs w-full flex justify-end'>Don&apos;t have an account?&nbsp; <span className='text-primary_green cursor-pointer'> Sign Up Now</span></p>

            </div>
        </form>
      </div>
      <div className="w-1/2 h-full">
        <img src="./login.png" alt="" className="w-full h-full object-cover object-center "/>
      </div>
    </div>
  );
}

export default Login;