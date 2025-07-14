import React from 'react';
import { CheckCircle } from 'lucide-react';

const services = [
  { name: 'Engine Oil Change', price: '₹499 onwards', duration: '30 min' },
  { name: 'Brake Service', price: '₹1499 onwards', duration: '60 min' },
  { name: 'Engine Diagnostics', price: '₹999 onwards', duration: '45 min' },
  { name: 'AC Service', price: '₹1299 onwards', duration: '90 min' },
  { name: 'Tire Rotation', price: '₹599 onwards', duration: '30 min' },
  { name: 'Full Vehicle Servicing', price: '₹3499 onwards', duration: '120 min' }
];

const Services = () => {
  return (
    <div className="min-h-screen bg-gray-50 py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-5xl font-bold text-center text-blue-700 mb-10">Our Services</h1>
        <p className="text-center text-lg text-gray-600 mb-12 max-w-2xl mx-auto">
          Reliable and affordable car care — trusted by thousands of vehicle owners.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
          {services.map((service, index) => (
            <div
              key={index}
              className="bg-white rounded-2xl shadow-lg p-8 hover:shadow-xl transition duration-300 border-t-4 border-blue-500"
            >
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-semibold text-gray-900">{service.name}</h3>
                <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium">
                  {service.duration}
                </span>
              </div>
              <p className="text-2xl font-bold text-blue-600 mb-6">{service.price}</p>
              <div className="flex items-center text-green-600">
                <CheckCircle className="h-5 w-5 mr-2" />
                <span className="text-sm">Quality guaranteed</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Services;
