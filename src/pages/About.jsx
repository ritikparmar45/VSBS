import React from 'react';
import { Users, Star, Wrench } from 'lucide-react';

const About = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white py-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-5xl font-extrabold text-center text-blue-800 mb-6 drop-shadow-md">
          About AutoCare
        </h1>
        <p className="text-center text-lg text-gray-600 mb-14 max-w-3xl mx-auto">
          Empowering vehicle owners with reliable, affordable, and technology-driven automotive services since 2023.
        </p>

        <p className="text-lg text-gray-700 mb-6 leading-relaxed">
          AutoCare was founded with a mission to make car maintenance simple, transparent, and hassle-free. Whether it's a quick oil change or a full diagnostic check, our platform connects vehicle owners with experienced mechanics through a seamless online booking system.
        </p>

        <p className="text-lg text-gray-700 mb-12 leading-relaxed">
          We started in 2023 with a small team of passionate auto experts and have grown into a trusted name in vehicle care. Today, AutoCare serves thousands of happy customers across the region.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          <div className="text-center p-8 bg-white rounded-2xl shadow-lg hover:shadow-xl border-t-4 border-blue-500 transition-transform hover:-translate-y-1">
            <Users className="mx-auto h-12 w-12 text-blue-600 mb-4" />
            <h3 className="text-xl font-bold text-gray-900">Customer First</h3>
            <p className="text-gray-600 text-sm mt-3">
              We prioritize your satisfaction by delivering reliable service and timely support.
            </p>
          </div>

          <div className="text-center p-8 bg-white rounded-2xl shadow-lg hover:shadow-xl border-t-4 border-yellow-400 transition-transform hover:-translate-y-1">
            <Star className="mx-auto h-12 w-12 text-yellow-500 mb-4" />
            <h3 className="text-xl font-bold text-gray-900">Trusted Quality</h3>
            <p className="text-gray-600 text-sm mt-3">
              Our certified mechanics ensure top-quality service with a satisfaction guarantee.
            </p>
          </div>

          <div className="text-center p-8 bg-white rounded-2xl shadow-lg hover:shadow-xl border-t-4 border-green-500 transition-transform hover:-translate-y-1">
            <Wrench className="mx-auto h-12 w-12 text-green-600 mb-4" />
            <h3 className="text-xl font-bold text-gray-900">Experienced Team</h3>
            <p className="text-gray-600 text-sm mt-3">
              Our team brings years of hands-on automotive experience to every service.
            </p>
          </div>
        </div>

        <div className="mt-20 text-center">
          <h2 className="text-3xl font-bold text-blue-800 mb-4">Our Mission</h2>
          <p className="text-gray-700 max-w-3xl mx-auto text-lg leading-relaxed">
            To redefine vehicle servicing by combining cutting-edge technology, experienced professionals, and a customer-first mindset. We aim to become the most reliable and convenient vehicle maintenance platform in the country.
          </p>
        </div>
      </div>
    </div>
  );
};

export default About;
