import { useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
function Signup() {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [formError, setFormError] = useState('');
    const { signup, error: authError, clearError } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        // Form validation
        if (!name || !email || !password || !confirmPassword) {
            setFormError('Please fill in all fields');
            return;
        }

        if (password !== confirmPassword) {
            setFormError('Passwords do not match');
            return;
        }

        if (password.length < 8) {
            setFormError('Password must be at least 8 characters long');
            return;
        }

        setIsSubmitting(true);
        setFormError('');
        clearError();

        try {
            await signup(name, email, password, confirmPassword);
            console.log("Sending Signup Request:", { name, email, password, confirmPassword });
            navigate('/login'); // Redirect to home page after successful signup
        } catch (err) {
            // Authentication errors are handled by the context
            console.error('Signup error:', err);
        } finally {
            setIsSubmitting(false);
        }
    };
    return (
      <div className="flex bg-[#09090A] h-svh w-svh text-white font-sen">
        <div className="w-1/2 flex flex-col justify-center items-center">
          <div className="font-sen text-6xl mb-8 text-[#DDC165]">RUNE</div>
          <form className="w-2/4" onSubmit={handleSubmit}>
            {(formError || authError) && (
              <div className="bg-red-500 bg-opacity-20 border border-red-500 text-red-500 p-2 rounded mb-4">
                {formError || authError}
              </div>
            )}
            <div className="space-y-6">
              <div className="relative">
                <input
                  type="text"
                  id="name"
                  className="peer w-full pt-2 focus:outline-none border-b-2 border-white bg-transparent h-10 text-white text-base"
                  placeholder=" "
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
                <label
                  htmlFor="name"
                  className="absolute left-0 -top-2 text-sm text-primary_green transition-all duration-300
                  peer-placeholder-shown:text-gray-400 peer-placeholder-shown:top-2
                  peer-focus:-top-2 peer-focus:text-primary_green font-bold"
                >
                  Full Name
                </label>
              </div>

              <div className="relative">
                <input
                  type="email"
                  id="email"
                  className="peer w-full pt-2 focus:outline-none border-b-2 border-white bg-transparent h-10 text-white text-base"
                  placeholder=" "
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
                  type={showPassword ? "text" : "password"}
                  id="password"
                  className="peer w-full pt-2 pr-10 focus:outline-none border-b-2 border-white bg-transparent h-10 text-white text-base"
                  placeholder=" "
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

              <div className="relative">
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  id="confirmPassword"
                  className="peer w-full pt-2 pr-10 focus:outline-none border-b-2 border-white bg-transparent h-10 text-white text-base"
                  placeholder=" "
                  required
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                />
                <label
                  htmlFor="confirmPassword"
                  className="absolute left-0 -top-2 text-sm text-primary_green transition-all duration-300
                  peer-placeholder-shown:text-gray-400 peer-placeholder-shown:top-2
                  peer-focus:-top-2 peer-focus:text-primary_green font-bold"
                >
                  Confirm Password
                </label>
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-2 top-3 text-white hover:text-primary_green"
                >
                  {showConfirmPassword ? (
                    <EyeOff size={20} />
                  ) : (
                    <Eye size={20} />
                  )}
                </button>
              </div>
            </div>

            <div className="pt-10">
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full flex justify-center items-center h-10 bg-primary_green my-3 rounded-xl font-bold text-lg"
              >
                {isSubmitting ? "Signing Up..." : "Sign Up"}
              </button>
            </div>
            <p className="text-xs w-full flex justify-end">
              Already have an account?&nbsp;
              <Link to="/login" className="text-primary_green cursor-pointer">
                Login
              </Link>
            </p>
          </form>
        </div>
        <div className="w-1/2 h-full">
          <img
            src="./robo.png"
            alt=""
            className="w-full h-full object-cover object-right "
          />
        </div>
      </div>
    );
}

export default Signup;