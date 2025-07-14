import React from 'react';
import { Link } from 'react-router-dom';
import { Car, Shield, Clock, Users, CheckCircle, Star } from 'lucide-react';

const Home = () => {
  const features = [
    {
      icon: <Car className="h-8 w-8 text-blue-600" />,
      title: 'Expert Service',
      description: 'Professional mechanics with years of experience in automotive repair and maintenance.'
    },
    {
      icon: <Shield className="h-8 w-8 text-blue-600" />,
      title: 'Quality Guaranteed',
      description: 'All our services come with warranty and satisfaction guarantee.'
    },
    {
      icon: <Clock className="h-8 w-8 text-blue-600" />,
      title: 'Quick Booking',
      description: 'Easy online booking system with flexible scheduling options.'
    },
    {
      icon: <Users className="h-8 w-8 text-blue-600" />,
      title: 'Trusted by Thousands',
      description: 'Join thousands of satisfied customers who trust us with their vehicles.'
    }
  ];

  const services = [
    { name: 'Oil Change', price: 'From ₹299', duration: '30 min' },
    { name: 'Brake Service', price: 'From ₹699', duration: '60 min' },
    { name: 'Engine Diagnostics', price: 'From ₹499', duration: '45 min' },
    { name: 'AC Service', price: 'From ₹999', duration: '90 min' },
    { name: 'Tire Rotation', price: 'From ₹299', duration: '30 min' },
    { name: 'Full Service', price: 'From ₹1499', duration: '120 min' }
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-800 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 text-center">
          <h1 className="text-5xl md:text-6xl font-extrabold mb-6 leading-tight">
            Your Vehicle's <span className="text-blue-200">Best Friend</span>
          </h1>
          <p className="text-xl md:text-2xl text-blue-100 mb-10 max-w-3xl mx-auto">
            Professional automotive service and repair with convenient online booking. Expert mechanics, quality parts, and guaranteed satisfaction.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/register" className="bg-white text-blue-600 px-8 py-4 rounded-lg text-lg font-semibold hover:bg-blue-50 transition-all shadow-xl">
              Book Service Now
            </Link>
            <Link to="/login" className="border-2 border-white text-white px-8 py-4 rounded-lg text-lg font-semibold hover:bg-white hover:text-blue-600 transition-all">
              Sign In
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-20">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Why Choose AutoCare?</h2>
            <p className="text-lg text-gray-600 max-w-xl mx-auto">
              We're committed to providing the best automotive service experience with modern convenience.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <div key={index} className="text-center p-6 rounded-xl bg-gray-50 hover:bg-blue-50 transition-all shadow-md">
                <div className="flex justify-center mb-4">{feature.icon}</div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">{feature.title}</h3>
                <p className="text-gray-600 text-sm">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className="py-24 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Our Services</h2>
            <p className="text-lg text-gray-600 max-w-xl mx-auto">
              Comprehensive automotive services for all your vehicle needs.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {services.map((service, index) => (
              <div key={index} className="bg-white rounded-2xl shadow-lg p-6 hover:shadow-xl transition-shadow border-t-4 border-blue-500">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-xl font-bold text-gray-800">{service.name}</h3>
                  <div className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium">
                    {service.duration}
                  </div>
                </div>
                <p className="text-2xl font-extrabold text-blue-600 mb-4">{service.price}</p>
                <div className="flex items-center text-green-600">
                  <CheckCircle className="h-5 w-5 mr-2" />
                  <span className="text-sm">Quality guaranteed</span>
                </div>
              </div>
            ))}
          </div>

          <div className="text-center mt-12">
            <Link to="/services" className="inline-block bg-blue-600 text-white px-6 py-3 rounded-lg text-lg font-medium hover:bg-blue-700 transition-colors">
              View All Services
            </Link>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">What Our Customers Say</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[{
              name: 'Sarah Johnson',
              rating: 5,
              comment: 'Excellent service! The online booking made it so convenient, and the work was done perfectly.',
              service: 'Oil Change & Inspection'
            }, {
              name: 'Mike Chen',
              rating: 5,
              comment: 'Professional mechanics, fair pricing, and great customer service. Highly recommended!',
              service: 'Brake Service'
            }, {
              name: 'Emily Davis',
              rating: 5,
              comment: 'Quick turnaround time and excellent communication throughout the service process.',
              service: 'Engine Diagnostics'
            }].map((testimonial, index) => (
              <div key={index} className="bg-gray-50 rounded-xl p-6 shadow-md hover:shadow-lg transition-shadow">
                <div className="flex items-center mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="h-5 w-5 text-yellow-400 fill-current" />
                  ))}
                </div>
                <p className="text-gray-700 mb-4">"{testimonial.comment}"</p>
                <div className="border-t pt-4">
                  <p className="font-semibold text-gray-900">{testimonial.name}</p>
                  <p className="text-sm text-gray-600">{testimonial.service}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-blue-600">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl font-bold text-white mb-4">Ready to Service Your Vehicle?</h2>
          <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
            Join thousands of satisfied customers. Book your service appointment today.
          </p>
          <Link to="/register" className="bg-white text-blue-600 px-8 py-4 rounded-lg text-lg font-semibold hover:bg-blue-50 transition-colors shadow-lg inline-block">
            Get Started Now
          </Link>
        </div>
      </section>
    </div>
  );
};

export default Home;
