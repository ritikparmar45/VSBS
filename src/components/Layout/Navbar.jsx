import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Car, User, LogOut, Settings, Calendar, Users } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const getDashboardLink = () => {
    switch (user?.role) {
      case 'admin':
        return '/admin';
      case 'mechanic':
        return '/mechanic';
      default:
        return '/dashboard';
    }
  };

  return (
    <nav className="bg-white shadow-lg border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          {/* Left: Logo */}
          <div className="flex items-center">
            <Link to="/" className="flex items-center space-x-2">
              <div className="bg-blue-600 p-2 rounded-lg">
                <Car className="h-6 w-6 text-white" />
              </div>
              <span className="text-xl font-bold text-gray-900">AutoCare</span>
            </Link>
          </div>

          {/* Center: Navigation Links (only for guests) */}
          {!user && (
            <div className="hidden md:flex items-center space-x-6">
              <Link to="/" className="text-gray-700 hover:text-blue-600 text-sm font-medium">Home</Link>
              <Link to="/about" className="text-gray-700 hover:text-blue-600 text-sm font-medium">About</Link>
              <Link to="/contact" className="text-gray-700 hover:text-blue-600 text-sm font-medium">Contact</Link>
              <Link to="/services" className="text-gray-700 hover:text-blue-600 text-sm font-medium">Our Services</Link>
            </div>
          )}

          {/* Right: Auth & User */}
          <div className="flex items-center space-x-4">
            {user ? (
              <>
                {/* Dashboard */}
                <Link
                  to={getDashboardLink()}
                  className="flex items-center space-x-1 px-3 py-2 rounded-md text-sm font-medium text-gray-700 hover:text-blue-600 hover:bg-blue-50 transition-colors"
                >
                  {user.role === 'admin' ? (
                    <Settings className="h-4 w-4" />
                  ) : user.role === 'mechanic' ? (
                    <Users className="h-4 w-4" />
                  ) : (
                    <Calendar className="h-4 w-4" />
                  )}
                  <span>Dashboard</span>
                </Link>

                {/* My Profile */}
                <Link
                  to="/profile"
                  className="flex items-center space-x-1 px-3 py-2 rounded-md text-sm font-medium text-gray-700 hover:text-blue-600 hover:bg-blue-50 transition-colors"
                >
                  <User className="h-4 w-4" />
                  <span>My Profile</span>
                </Link>

                {/* User Info */}
                <div className="flex items-center space-x-2 px-3 py-2 rounded-md bg-gray-50">
                  <User className="h-4 w-4 text-gray-600" />
                  <span className="text-sm font-medium text-gray-700">{user.name}</span>
                  <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full capitalize">
                    {user.role}
                  </span>
                </div>

                {/* Logout */}
                <button
                  onClick={handleLogout}
                  className="flex items-center space-x-1 px-3 py-2 rounded-md text-sm font-medium text-red-600 hover:text-red-700 hover:bg-red-50 transition-colors"
                >
                  <LogOut className="h-4 w-4" />
                  <span>Logout</span>
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  className="text-gray-700 hover:text-blue-600 px-3 py-2 rounded-md text-sm font-medium transition-colors"
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors"
                >
                  Get Started
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
