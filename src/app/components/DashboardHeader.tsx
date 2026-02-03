import { LogOut } from "lucide-react";

interface DashboardHeaderProps {
  title: string;
  username: string;
  onLogout: () => void;
}

export function DashboardHeader({ title, username, onLogout }: DashboardHeaderProps) {
  return (
    <header className="bg-white/80 backdrop-blur-md shadow-lg sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="animate-slide-in-left">
          <h1 className="text-2xl text-gray-800">{title}</h1>
          <p className="text-gray-600">Welcome, <span className="gradient-text">{username}</span></p>
        </div>
        <button
          onClick={onLogout}
          className="btn-hover flex items-center gap-2 bg-gradient-to-r from-red-500 to-pink-600 text-white py-2 px-4 rounded-lg hover:from-red-600 hover:to-pink-700 transition-all duration-300 w-full sm:w-auto justify-center shadow-lg hover:shadow-xl transform hover:scale-105"
        >
          <LogOut className="w-4 h-4" />
          Logout
        </button>
      </div>
    </header>
  );
}
