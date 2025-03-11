import { useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formError, setFormError] = useState('');

  const { login, error: authError, clearError } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Form validation
    if (!email || !password) {
      setFormError('Please fill in all fields');
      return;
    }

    setIsSubmitting(true);
    setFormError('');
    clearError();

    try {
      await login(email, password);
      console.log("Sending Login Request:", { email, password });
      navigate("/chat"); // Redirect to home page after successful login
    } catch (err) {
      // Authentication errors are handled by the context
      console.error('Login error:', err);
    } finally {
      setIsSubmitting(false);
    }
  };
  return (
    <div className="flex bg-[#09090A] h-svh w-svh text-white font-sen">
      <div className="w-1/2 flex flex-col justify-center items-center">
        <div className="font-sen text-[100px] mb-8 text-[#DDC165]">
          RUNE
        </div>
        <form className='w-2/4' onSubmit={handleSubmit}>
          {(formError || authError) && (
            <div className="bg-red-500 bg-opacity-20 border border-red-500 text-red-500 p-2 rounded mb-4">
              {formError || authError}
            </div>
          )}
          <div className='space-y-6'>
            <div className="relative">
              <input
                type="email"
                id="email"
                className="peer w-full pt-2 focus:outline-none border-b-2 border-white bg-transparent h-10 text-white text-[16px]"
                placeholder=" "
                autoComplete='off'
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
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
                autoComplete='off'
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
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
            <button
              type="submit"
              disabled={isSubmitting}
              className='w-full flex justify-center items-center h-10 bg-primary_green my-3 rounded-xl font-bold text-lg'
            >
              {isSubmitting ? 'Logging in...' : 'Login'}
            </button>
          </div>
          <p className='text-xs w-full flex justify-end'>Don&apos;t have an account?&nbsp; <Link to='/signup'><span className='text-primary_green cursor-pointer'> Sign Up Now</span></Link></p>
        </form>
      </div>
      <div className="w-1/2 h-full">
        <img src="./login.png" alt="" className="w-full h-full object-cover object-center " />
      </div>
    </div>
  );
}

export default Login;