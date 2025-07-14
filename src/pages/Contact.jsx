import React from 'react';
import { Mail, Phone, MapPin } from 'lucide-react';

const Contact = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white py-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-5xl font-extrabold text-center text-blue-800 mb-6 drop-shadow-md">
          Contact Us
        </h1>
        <p className="text-center text-lg text-gray-600 mb-14 max-w-2xl mx-auto">
          Have questions or need help? Reach out to us and we’ll get back to you shortly.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          <div className="space-y-8">
            <div className="flex items-start space-x-4">
              <MapPin className="text-blue-600 w-6 h-6 mt-1" />
              <div>
                <p className="text-lg font-semibold text-gray-800">Our Address</p>
                <p className="text-gray-600">123 AutoCare Street, New Town, Cityville, 456789</p>
              </div>
            </div>
            <div className="flex items-start space-x-4">
              <Phone className="text-blue-600 w-6 h-6 mt-1" />
              <div>
                <p className="text-lg font-semibold text-gray-800">Phone</p>
                <p className="text-gray-600">+91 98765 43210</p>
              </div>
            </div>
            <div className="flex items-start space-x-4">
              <Mail className="text-blue-600 w-6 h-6 mt-1" />
              <div>
                <p className="text-lg font-semibold text-gray-800">Email</p>
                <p className="text-gray-600">support@autocare.com</p>
              </div>
            </div>
          </div>

          <form className="space-y-6 bg-white p-8 rounded-2xl shadow-xl border border-blue-100">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                Your Name
              </label>
              <input
                type="text"
                id="name"
                name="name"
                required
                className="mt-1 block w-full border border-gray-300 rounded-lg shadow-sm px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                Your Email
              </label>
              <input
                type="email"
                id="email"
                name="email"
                required
                className="mt-1 block w-full border border-gray-300 rounded-lg shadow-sm px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            <div>
              <label htmlFor="message" className="block text-sm font-medium text-gray-700">
                Message
              </label>
              <textarea
                id="message"
                name="message"
                rows="5"
                required
                className="mt-1 block w-full border border-gray-300 rounded-lg shadow-sm px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              ></textarea>
            </div>
            <button
              type="submit"
              className="w-full bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors shadow-md"
            >
              Send Message
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Contact;
