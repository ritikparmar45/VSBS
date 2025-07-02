import React from 'react';
import { Car, Mail, Phone, MapPin } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center space-x-2 mb-4">
              <div className="bg-blue-600 p-2 rounded-lg">
                <Car className="h-6 w-6 text-white" />
              </div>
              <span className="text-xl font-bold">AutoCare</span>
            </div>
            <p className="text-gray-300 mb-4 max-w-md">
              Your trusted partner for vehicle maintenance and repairs. We provide quality service 
              with experienced mechanics and modern equipment.
            </p>
            <div className="flex space-x-4">
              <div className="bg-gray-800 p-2 rounded-full hover:bg-gray-700 transition-colors cursor-pointer">
                <Mail className="h-4 w-4" />
              </div>
              <div className="bg-gray-800 p-2 rounded-full hover:bg-gray-700 transition-colors cursor-pointer">
                <Phone className="h-4 w-4" />
              </div>
              <div className="bg-gray-800 p-2 rounded-full hover:bg-gray-700 transition-colors cursor-pointer">
                <MapPin className="h-4 w-4" />
              </div>
            </div>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-4">Services</h3>
            <ul className="space-y-2 text-gray-300">
              <li><a href="#" className="hover:text-white transition-colors">Oil Change</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Brake Service</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Engine Repair</a></li>
              <li><a href="#" className="hover:text-white transition-colors">AC Service</a></li>
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-4">Contact Info</h3>
            <div className="space-y-2 text-gray-300">
              <div className="flex items-center space-x-2">
                <Phone className="h-4 w-4" />
                <span>+1 (555) 123-4567</span>
              </div>
              <div className="flex items-center space-x-2">
                <Mail className="h-4 w-4" />
                <span>info@autocare.com</span>
              </div>
              <div className="flex items-center space-x-2">
                <MapPin className="h-4 w-4" />
                <span>123 Service St, City, State</span>
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
          <p>&copy; 2025 AutoCare. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;