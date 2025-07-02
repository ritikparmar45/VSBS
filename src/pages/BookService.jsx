import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Car, Calendar, Clock, CreditCard, ArrowLeft, AlertCircle, CheckCircle } from 'lucide-react';
import axios from 'axios';
import { format, addDays } from 'date-fns';

const BookService = () => {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const [formData, setFormData] = useState({
    service: '',
    vehicleDetails: {
      type: 'car',
      make: '',
      model: '',
      year: new Date().getFullYear(),
      licensePlate: ''
    },
    appointmentDate: '',
    appointmentTime: '',
    notes: ''
  });

  const timeSlots = [
    '09:00', '09:30', '10:00', '10:30', '11:00', '11:30',
    '12:00', '12:30', '13:00', '13:30', '14:00', '14:30',
    '15:00', '15:30', '16:00', '16:30', '17:00'
  ];

  useEffect(() => {
    fetchServices();
  }, []);

  const fetchServices = async () => {
    try {
      const response = await axios.get('/api/services');
      setServices(response.data.services);
    } catch (error) {
      console.error('Error fetching services:', error);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    
    if (name.startsWith('vehicle.')) {
      const field = name.split('.')[1];
      setFormData(prev => ({
        ...prev,
        vehicleDetails: {
          ...prev.vehicleDetails,
          [field]: field === 'year' ? parseInt(value) : value
        }
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const handleServiceSelect = (serviceId) => {
    setFormData(prev => ({
      ...prev,
      service: serviceId
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      await axios.post('/api/bookings', formData);
      setSuccess(true);
      setTimeout(() => {
        navigate('/dashboard');
      }, 2000);
    } catch (error) {
      setError(error.response?.data?.message || 'Failed to create booking');
    } finally {
      setLoading(false);
    }
  };

  const nextStep = () => {
    setCurrentStep(prev => Math.min(prev + 1, 4));
  };

  const prevStep = () => {
    setCurrentStep(prev => Math.max(prev - 1, 1));
  };

  const selectedService = services.find(s => s._id === formData.service);

  const generateDateOptions = () => {
    const dates = [];
    for (let i = 1; i <= 14; i++) {
      const date = addDays(new Date(), i);
      dates.push(date);
    }
    return dates;
  };

  if (success) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="bg-white rounded-xl shadow-lg p-8 max-w-md w-full text-center">
          <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Booking Confirmed!</h2>
          <p className="text-gray-600 mb-4">Your service has been booked successfully. We'll contact you soon.</p>
          <div className="animate-pulse text-blue-600">Redirecting to dashboard...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <button
            onClick={() => navigate('/dashboard')}
            className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 transition-colors"
          >
            <ArrowLeft className="h-5 w-5" />
            <span>Back to Dashboard</span>
          </button>
        </div>

        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          {/* Progress Bar */}
          <div className="px-8 py-6 bg-gray-50 border-b">
            <div className="flex items-center justify-between">
              {[1, 2, 3, 4].map((step) => (
                <div key={step} className="flex items-center">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                    currentStep >= step ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-600'
                  }`}>
                    {step}
                  </div>
                  {step < 4 && (
                    <div className={`h-1 w-24 mx-4 ${
                      currentStep > step ? 'bg-blue-600' : 'bg-gray-200'
                    }`} />
                  )}
                </div>
              ))}
            </div>
            <div className="flex justify-between mt-2 text-sm">
              <span className={currentStep >= 1 ? 'text-blue-600' : 'text-gray-500'}>Select Service</span>
              <span className={currentStep >= 2 ? 'text-blue-600' : 'text-gray-500'}>Vehicle Details</span>
              <span className={currentStep >= 3 ? 'text-blue-600' : 'text-gray-500'}>Schedule</span>
              <span className={currentStep >= 4 ? 'text-blue-600' : 'text-gray-500'}>Confirm</span>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="p-8">
            {error && (
              <div className="mb-6 bg-red-50 border border-red-200 rounded-lg p-4 flex items-center space-x-2">
                <AlertCircle className="h-5 w-5 text-red-500" />
                <span className="text-red-700 text-sm">{error}</span>
              </div>
            )}

            {/* Step 1: Select Service */}
            {currentStep === 1 && (
              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-6">Select a Service</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {services.map((service) => (
                    <div
                      key={service._id}
                      className={`border-2 rounded-lg p-6 cursor-pointer transition-all ${
                        formData.service === service._id
                          ? 'border-blue-500 bg-blue-50'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                      onClick={() => handleServiceSelect(service._id)}
                    >
                      <div className="flex justify-between items-start mb-4">
                        <h3 className="text-lg font-semibold text-gray-900">{service.name}</h3>
                        <div className="text-right">
                          <div className="text-2xl font-bold text-blue-600">${service.price}</div>
                          <div className="text-sm text-gray-500">{service.duration} min</div>
                        </div>
                      </div>
                      <p className="text-gray-600 text-sm mb-4">{service.description}</p>
                      <div className="flex items-center space-x-2">
                        <span className="bg-gray-100 text-gray-800 px-2 py-1 rounded-full text-xs font-medium capitalize">
                          {service.category}
                        </span>
                        <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-xs font-medium capitalize">
                          {service.vehicleType}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Step 2: Vehicle Details */}
            {currentStep === 2 && (
              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-6">Vehicle Details</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Vehicle Type
                    </label>
                    <select
                      name="vehicle.type"
                      value={formData.vehicleDetails.type}
                      onChange={handleInputChange}
                      className="w-full px-3 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      required
                    >
                      <option value="car">Car</option>
                      <option value="bike">Motorcycle</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Make
                    </label>
                    <input
                      type="text"
                      name="vehicle.make"
                      value={formData.vehicleDetails.make}
                      onChange={handleInputChange}
                      className="w-full px-3 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="e.g., Toyota, Honda"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Model
                    </label>
                    <input
                      type="text"
                      name="vehicle.model"
                      value={formData.vehicleDetails.model}
                      onChange={handleInputChange}
                      className="w-full px-3 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="e.g., Camry, Civic"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Year
                    </label>
                    <input
                      type="number"
                      name="vehicle.year"
                      value={formData.vehicleDetails.year}
                      onChange={handleInputChange}
                      min="1990"
                      max={new Date().getFullYear() + 1}
                      className="w-full px-3 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      required
                    />
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      License Plate
                    </label>
                    <input
                      type="text"
                      name="vehicle.licensePlate"
                      value={formData.vehicleDetails.licensePlate}
                      onChange={handleInputChange}
                      className="w-full px-3 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Enter license plate number"
                      required
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Step 3: Schedule */}
            {currentStep === 3 && (
              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-6">Schedule Appointment</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Select Date
                    </label>
                    <div className="grid grid-cols-2 gap-2">
                      {generateDateOptions().map((date) => (
                        <button
                          key={date.toISOString()}
                          type="button"
                          onClick={() => setFormData(prev => ({
                            ...prev,
                            appointmentDate: format(date, 'yyyy-MM-dd')
                          }))}
                          className={`p-3 text-sm border rounded-lg text-center transition-colors ${
                            formData.appointmentDate === format(date, 'yyyy-MM-dd')
                              ? 'border-blue-500 bg-blue-50 text-blue-700'
                              : 'border-gray-200 hover:border-gray-300'
                          }`}
                        >
                          <div className="font-medium">{format(date, 'MMM dd')}</div>
                          <div className="text-gray-500">{format(date, 'EEE')}</div>
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Select Time
                    </label>
                    <div className="grid grid-cols-3 gap-2 max-h-64 overflow-y-auto">
                      {timeSlots.map((time) => (
                        <button
                          key={time}
                          type="button"
                          onClick={() => setFormData(prev => ({
                            ...prev,
                            appointmentTime: time
                          }))}
                          className={`p-2 text-sm border rounded-lg transition-colors ${
                            formData.appointmentTime === time
                              ? 'border-blue-500 bg-blue-50 text-blue-700'
                              : 'border-gray-200 hover:border-gray-300'
                          }`}
                        >
                          {time}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="mt-6">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Additional Notes (Optional)
                  </label>
                  <textarea
                    name="notes"
                    value={formData.notes}
                    onChange={handleInputChange}
                    rows={3}
                    className="w-full px-3 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Any specific requirements or issues with your vehicle..."
                  />
                </div>
              </div>
            )}

            {/* Step 4: Confirm */}
            {currentStep === 4 && (
              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-6">Confirm Booking</h2>
                <div className="bg-gray-50 rounded-lg p-6 mb-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Booking Summary</h3>
                  
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-gray-600">Service:</span>
                      <span className="font-medium">{selectedService?.name}</span>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <span className="text-gray-600">Vehicle:</span>
                      <span className="font-medium">
                        {formData.vehicleDetails.year} {formData.vehicleDetails.make} {formData.vehicleDetails.model}
                      </span>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <span className="text-gray-600">License Plate:</span>
                      <span className="font-medium">{formData.vehicleDetails.licensePlate}</span>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <span className="text-gray-600">Date:</span>
                      <span className="font-medium">
                        {formData.appointmentDate && format(new Date(formData.appointmentDate), 'MMMM dd, yyyy')}
                      </span>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <span className="text-gray-600">Time:</span>
                      <span className="font-medium">{formData.appointmentTime}</span>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <span className="text-gray-600">Duration:</span>
                      <span className="font-medium">{selectedService?.duration} minutes</span>
                    </div>
                    
                    <div className="border-t pt-4">
                      <div className="flex items-center justify-between text-lg font-semibold">
                        <span>Total Amount:</span>
                        <span className="text-blue-600">${selectedService?.price}</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
                  <div className="flex items-start space-x-2">
                    <AlertCircle className="h-5 w-5 text-yellow-600 mt-0.5" />
                    <div>
                      <p className="text-sm text-yellow-800">
                        <strong>Please note:</strong> Your booking is subject to availability confirmation. 
                        We'll contact you within 24 hours to confirm your appointment.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Navigation Buttons */}
            <div className="flex justify-between mt-8">
              <button
                type="button"
                onClick={prevStep}
                disabled={currentStep === 1}
                className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                Previous
              </button>

              {currentStep < 4 ? (
                <button
                  type="button"
                  onClick={nextStep}
                  disabled={
                    (currentStep === 1 && !formData.service) ||
                    (currentStep === 2 && (!formData.vehicleDetails.make || !formData.vehicleDetails.model || !formData.vehicleDetails.licensePlate)) ||
                    (currentStep === 3 && (!formData.appointmentDate || !formData.appointmentTime))
                  }
                  className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  Next
                </button>
              ) : (
                <button
                  type="submit"
                  disabled={loading}
                  className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center space-x-2"
                >
                  {loading ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                      <span>Booking...</span>
                    </>
                  ) : (
                    <>
                      <CheckCircle className="h-4 w-4" />
                      <span>Confirm Booking</span>
                    </>
                  )}
                </button>
              )}
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default BookService;