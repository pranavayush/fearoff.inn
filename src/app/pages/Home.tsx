import { Link } from "react-router";
import { BookOpen, Users, ArrowRight, GraduationCap, FileText } from "lucide-react";

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-100 via-purple-50 to-pink-100 animate-gradient">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-md shadow-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center gap-3">
            <div className="bg-gradient-to-br from-indigo-500 to-purple-600 p-2 rounded-lg shadow-lg">
              <BookOpen className="w-6 h-6 text-white" />
            </div>
            <h1 className="text-2xl gradient-text">FearOff Dashboard</h1>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-20">
        <div className="text-center mb-12 animate-fade-in">
          <div className="inline-block mb-6 animate-float">
            <div className="bg-gradient-to-br from-indigo-500 to-purple-600 p-6 rounded-full shadow-2xl">
              <GraduationCap className="w-16 h-16 text-white" />
            </div>
          </div>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl mb-4 text-gray-800">
            Welcome to <span className="gradient-text">FearOff Portal</span>
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            A modern learning platform connecting students and teachers
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-3 gap-6 mb-12 animate-scale-in">
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg card-hover">
            <div className="bg-blue-100 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
              <FileText className="w-6 h-6 text-blue-600" />
            </div>
            <h3 className="text-lg mb-2 text-gray-800">Question Papers</h3>
            <p className="text-gray-600 text-sm">Access and download question papers shared by teachers</p>
          </div>

          <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg card-hover">
            <div className="bg-green-100 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
              <Users className="w-6 h-6 text-green-600" />
            </div>
            <h3 className="text-lg mb-2 text-gray-800">Easy Submission</h3>
            <p className="text-gray-600 text-sm">Submit your answer sheets quickly and securely</p>
          </div>

          <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg card-hover">
            <div className="bg-purple-100 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
              <GraduationCap className="w-6 h-6 text-purple-600" />
            </div>
            <h3 className="text-lg mb-2 text-gray-800">Teacher Tools</h3>
            <p className="text-gray-600 text-sm">Upload and manage question papers effortlessly</p>
          </div>
        </div>

        {/* Login Cards */}
        <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {/* Student Card */}
          <div className="bg-white rounded-2xl shadow-2xl p-8 transform transition-all duration-300 hover:scale-105 hover:shadow-3xl animate-slide-in-left">
            <div className="text-center mb-6">
              <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-blue-400 to-indigo-500 rounded-full mb-4 shadow-lg">
                <Users className="w-10 h-10 text-white" />
              </div>
              <h2 className="text-2xl mb-2 text-gray-800">Student Portal</h2>
              <p className="text-gray-600 text-sm">Access your learning resources</p>
            </div>
            
            <div className="space-y-3">
              <Link
                to="/student-login"
                className="btn-hover block w-full bg-gradient-to-r from-blue-500 to-indigo-600 text-white py-3 px-4 rounded-lg hover:from-blue-600 hover:to-indigo-700 transition-all duration-300 text-center shadow-lg hover:shadow-xl flex items-center justify-center gap-2"
              >
                Login
                <ArrowRight className="w-5 h-5" />
              </Link>
              
              <Link
                to="/student-register"
                className="block w-full bg-white border-2 border-blue-500 text-blue-500 py-3 px-4 rounded-lg hover:bg-blue-50 transition-all duration-300 text-center"
              >
                Create New Account
              </Link>
            </div>
          </div>

          {/* Teacher Card */}
          <div className="bg-white rounded-2xl shadow-2xl p-8 transform transition-all duration-300 hover:scale-105 hover:shadow-3xl animate-slide-in-right">
            <div className="text-center mb-6">
              <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-green-400 to-emerald-500 rounded-full mb-4 shadow-lg">
                <GraduationCap className="w-10 h-10 text-white" />
              </div>
              <h2 className="text-2xl mb-2 text-gray-800">Teacher Portal</h2>
              <p className="text-gray-600 text-sm">Manage your teaching materials</p>
            </div>
            
            <div className="space-y-3">
              <Link
                to="/teacher-login"
                className="btn-hover block w-full bg-gradient-to-r from-green-500 to-emerald-600 text-white py-3 px-4 rounded-lg hover:from-green-600 hover:to-emerald-700 transition-all duration-300 text-center shadow-lg hover:shadow-xl flex items-center justify-center gap-2"
              >
                Login
                <ArrowRight className="w-5 h-5" />
              </Link>
              
              <Link
                to="/teacher-register"
                className="block w-full bg-white border-2 border-green-500 text-green-500 py-3 px-4 rounded-lg hover:bg-green-50 transition-all duration-300 text-center"
              >
                Create New Account
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-white/80 backdrop-blur-md mt-12 py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-gray-600">
          <p className="text-sm">© 2026 FearOff Portal. Empowering education through technology.</p>
        </div>
      </footer>
    </div>
  );
}
