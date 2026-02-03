import { useState } from "react";
import { useNavigate, Link } from "react-router";
import { UserCircle, Lock, User, ArrowRight } from "lucide-react";
import { validateLogin } from "@/app/utils/users";

export default function StudentLogin() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!username || !password) {
      setError("Please enter both username and password");
      return;
    }

    setIsLoading(true);

    // Simulate network delay for smooth UX
    await new Promise(resolve => setTimeout(resolve, 600));

    const result = validateLogin(username, password, "student");

    setIsLoading(false);

    if (result.success && result.user) {
      localStorage.setItem("userType", "student");
      localStorage.setItem("username", result.user.username);
      localStorage.setItem("fullName", result.user.fullName);
      navigate("/student-dashboard");
    } else {
      setError(result.message);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex items-center justify-center p-4 animate-gradient">
      <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-md w-full transform transition-all duration-300 hover:shadow-3xl">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-blue-400 to-indigo-500 rounded-full mb-4 shadow-lg animate-pulse">
            <UserCircle className="w-12 h-12 text-white" />
          </div>
          <h1 className="text-3xl mb-2 text-gray-800">Student Login</h1>
          <p className="text-gray-600">Access your learning portal</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-5">
          <div className="space-y-2">
            <label htmlFor="username" className="block text-gray-700">
              Username
            </label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                id="username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200"
                placeholder="Enter your username"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label htmlFor="password" className="block text-gray-700">
              Password
            </label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200"
                placeholder="Enter your password"
              />
            </div>
          </div>

          {error && (
            <div className="bg-red-50 text-red-600 p-4 rounded-lg text-sm border border-red-200 animate-fade-in">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-gradient-to-r from-blue-500 to-indigo-600 text-white py-3 px-4 rounded-lg hover:from-blue-600 hover:to-indigo-700 transition-all duration-300 disabled:from-gray-400 disabled:to-gray-500 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-lg hover:shadow-xl transform hover:scale-105"
          >
            {isLoading ? (
              <>
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                Logging in...
              </>
            ) : (
              <>
                Login
                <ArrowRight className="w-5 h-5" />
              </>
            )}
          </button>
        </form>

        <div className="mt-6 text-center space-y-2">
          <p className="text-gray-600">
            Don't have an account?{" "}
            <Link to="/student-register" className="text-blue-500 hover:text-blue-600 hover:underline transition-colors">
              Register here
            </Link>
          </p>
          <Link to="/" className="text-gray-500 hover:text-gray-600 hover:underline text-sm transition-colors block">
            ← Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
}
