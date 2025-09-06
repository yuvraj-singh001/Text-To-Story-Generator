import React from 'react';
import { Link } from 'react-router-dom';
import { Book, Home, Library, User, LogOut } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { motion } from 'framer-motion';

const Navbar: React.FC = () => {
  const { user, logout } = useAuth();

  return (
    <motion.nav 
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6 }}
      className="bg-white shadow-lg border-b border-gray-100"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link to="/home" className="flex items-center space-x-2 group">
            <motion.div
              whileHover={{ rotate: 10, scale: 1.1 }}
              transition={{ duration: 0.2 }}
            >
              <Book className="h-8 w-8 text-indigo-600" />
            </motion.div>
            <span className="text-xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
              StoryGen
            </span>
          </Link>

          <div className="hidden md:flex items-center space-x-6">
            <NavLink to="/home" icon={Home}>Home</NavLink>
            <NavLink to="/library" icon={Library}>My Library</NavLink>
            <NavLink to="/profile" icon={User}>Profile</NavLink>
            <button
              onClick={logout}
              className="flex items-center space-x-1 text-gray-600 hover:text-red-500 transition-colors duration-200"
            >
              <LogOut className="h-4 w-4" />
              <span>Logout</span>
            </button>
          </div>

          <div className="md:hidden">
            <span className="text-sm text-gray-600">Hello, {user?.username}</span>
          </div>
        </div>
      </div>
    </motion.nav>
  );
};

interface NavLinkProps {
  to: string;
  icon: React.ComponentType<{ className?: string }>;
  children: React.ReactNode;
}

const NavLink: React.FC<NavLinkProps> = ({ to, icon: Icon, children }) => (
  <Link
    to={to}
    className="flex items-center space-x-1 text-gray-600 hover:text-indigo-600 transition-colors duration-200 group"
  >
    <Icon className="h-4 w-4 group-hover:scale-110 transition-transform duration-200" />
    <span>{children}</span>
  </Link>
);

export default Navbar;