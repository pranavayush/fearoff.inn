import { useState } from "react";
import { useNavigate, Link } from "react-router";
import { GraduationCap, Mail, User, Lock, ArrowRight } from "lucide-react";
import { registerUser, isValidEmail, validatePassword } from "@/app/utils/users";

export default function TeacherRegister() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    fullName: "",
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [message, setMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    // Clear error for this field
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: "" }));
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.fullName.trim()) {
      newErrors.fullName = "Full name is required";
    }

    if (!formData.username.trim()) {
      newErrors.username = "Username is required";
    } else if (formData.username.length < 3) {
      newErrors.username = "Username must be at least 3 characters";
    }

    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!isValidEmail(formData.email)) {
      newErrors.email = "Please enter a valid email address";
    }

    const passwordValidation = validatePassword(formData.password);
    if (!passwordValidation.valid) {
      newErrors.password = passwordValidation.message;
    }

    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage("");

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    // Simulate network delay for smooth UX
    await new Promise(resolve => setTimeout(resolve, 800));

    const result = registerUser({
      fullName: formData.fullName,
      username: formData.username,
      email: formData.email,
      password: formData.password,
      userType: "teacher",
    });

    setIsSubmitting(false);

    if (result.success) {
      setMessage(result.message);
      setTimeout(() => {
        navigate("/teacher-login");
      }, 1500);
    } else {
      setMessage(result.message);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-md w-full transform transition-all duration-300 hover:shadow-3xl">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-green-400 to-emerald-500 rounded-full mb-4 shadow-lg animate-pulse">
            <GraduationCap className="w-12 h-12 text-white" />
          </div>
          <h1 className="text-3xl mb-2 text-gray-800">Teacher Registration</h1>
          <p className="text-gray-600">Create your teacher account</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <label htmlFor="fullName" className="block text-gray-700">
              Full Name
            </label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                id="fullName"
                name="fullName"
                value={formData.fullName}
                onChange={handleChange}
                className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:outline-none focus:ring-2 transition-all duration-200 ${
                  errors.fullName ? "border-red-500 focus:ring-red-500" : "border-gray-300 focus:ring-green-500"
                }`}
                placeholder="Enter your full name"
              />
            </div>
            {errors.fullName && <p className="text-red-500 text-sm">{errors.fullName}</p>}
          </div>

          <div className="space-y-2">
            <label htmlFor="username" className="block text-gray-700">
              Username
            </label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                id="username"
                name="username"
                value={formData.username}
                onChange={handleChange}
                className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:outline-none focus:ring-2 transition-all duration-200 ${
                  errors.username ? "border-red-500 focus:ring-red-500" : "border-gray-300 focus:ring-green-500"
                }`}
                placeholder="Choose a username"
              />
            </div>
            {errors.username && <p className="text-red-500 text-sm">{errors.username}</p>}
          </div>

          <div className="space-y-2">
            <label htmlFor="email" className="block text-gray-700">
              Email Address
            </label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:outline-none focus:ring-2 transition-all duration-200 ${
                  errors.email ? "border-red-500 focus:ring-red-500" : "border-gray-300 focus:ring-green-500"
                }`}
                placeholder="your.email@example.com"
              />
            </div>
            {errors.email && <p className="text-red-500 text-sm">{errors.email}</p>}
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
                name="password"
                value={formData.password}
                onChange={handleChange}
                className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:outline-none focus:ring-2 transition-all duration-200 ${
                  errors.password ? "border-red-500 focus:ring-red-500" : "border-gray-300 focus:ring-green-500"
                }`}
                placeholder="Create a password"
              />
            </div>
            {errors.password && <p className="text-red-500 text-sm">{errors.password}</p>}
          </div>

          <div className="space-y-2">
            <label htmlFor="confirmPassword" className="block text-gray-700">
              Confirm Password
            </label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="password"
                id="confirmPassword"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:outline-none focus:ring-2 transition-all duration-200 ${
                  errors.confirmPassword ? "border-red-500 focus:ring-red-500" : "border-gray-300 focus:ring-green-500"
                }`}
                placeholder="Confirm your password"
              />
            </div>
            {errors.confirmPassword && <p className="text-red-500 text-sm">{errors.confirmPassword}</p>}
          </div>

          {message && (
            <div className={`p-4 rounded-lg text-sm animate-fade-in ${
              message.includes("success") ? "bg-green-50 text-green-600 border border-green-200" : "bg-red-50 text-red-600 border border-red-200"
            }`}>
              {message}
            </div>
          )}

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-gradient-to-r from-green-500 to-emerald-600 text-white py-3 px-4 rounded-lg hover:from-green-600 hover:to-emerald-700 transition-all duration-300 disabled:from-gray-400 disabled:to-gray-500 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-lg hover:shadow-xl transform hover:scale-105"
          >
            {isSubmitting ? (
              <>
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                Creating Account...
              </>
            ) : (
              <>
                Create Account
                <ArrowRight className="w-5 h-5" />
              </>
            )}
          </button>
        </form>

        <div className="mt-6 text-center space-y-2">
          <p className="text-gray-600">
            Already have an account?{" "}
            <Link to="/teacher-login" className="text-green-500 hover:text-green-600 hover:underline transition-colors">
              Login here
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
