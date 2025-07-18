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

  const API = import.meta.env.VITE_API_URL;

  useEffect(() => {
    fetchServices();
  }, []);

  const fetchServices = async () => {
    try {
      const response = await axios.get(`${API}/api/services`);
      setServices(response.data.services || []);
    } catch (error) {
      console.error('Error fetching services:', error);
      setError('Failed to fetch services.');
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
      await axios.post(`${API}/api/bookings`, formData);
      setSuccess(true);
      setTimeout(() => navigate('/dashboard'), 2000);
    } catch (err) {
      console.error(err);
      setError(err?.response?.data?.message || 'Failed to create booking');
    } finally {
      setLoading(false);
    }
  };

  const nextStep = () => setCurrentStep(prev => Math.min(prev + 1, 4));
  const prevStep = () => setCurrentStep(prev => Math.max(prev - 1, 1));

  const selectedService = services.find(s => s._id === formData.service);

  const generateDateOptions = () => {
    const dates = [];
    for (let i = 1; i <= 14; i++) {
      dates.push(addDays(new Date(), i));
    }
    return dates;
  };

  if (success) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="bg-white rounded-xl shadow-lg p-8 max-w-md w-full text-center">
          <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Booking Confirmed!</h2>
          <p className="text-gray-600 mb-4">Your service has been booked successfully.</p>
          <div className="animate-pulse text-blue-600">Redirecting to dashboard...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 py-8">
        <button
          onClick={() => navigate('/dashboard')}
          className="mb-6 flex items-center space-x-2 text-gray-600 hover:text-gray-900"
        >
          <ArrowLeft className="h-5 w-5" />
          <span>Back to Dashboard</span>
        </button>

        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          {/* ...KEEP REST OF FORM STEPS CODE HERE (unchanged)... */}
          {/* All steps: 1 to 4 are unchanged structurally */}
          {/* They will already work with this API fix if pasted correctly */}
          {/* Just keep using `handleInputChange`, `formData`, and `selectedService` */}
        </div>
      </div>
    </div>
  );
};

export default BookService;
