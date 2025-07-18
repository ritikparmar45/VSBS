import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useAuth } from '../contexts/AuthContext';

const Dashboard = () => {
  const { user, token } = useAuth();
  const [bookings, setBookings] = useState([]);
  const API_BASE = import.meta.env.VITE_API_URL;

  useEffect(() => {
    if (!user || !token) return;
    fetchBookings();
  }, [user, token]);

  const fetchBookings = async () => {
    try {
      const response = await axios.get(`${API_BASE}/api/bookings`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setBookings(response.data);
    } catch (err) {
      console.error(err);
      alert('❌ Failed to fetch bookings');
    }
  };

  const handleCancelBooking = async (bookingId) => {
    if (!window.confirm('Are you sure you want to cancel this booking?')) return;

    try {
      await axios.patch(`${API_BASE}/api/bookings/${bookingId}/status`, {
        status: 'cancelled',
      }, {
        headers: { Authorization: `Bearer ${token}` },
      });

      alert('❌ Booking cancelled successfully!');
      fetchBookings();
    } catch (err) {
      console.error(err);
      alert('❌ Failed to cancel booking');
    }
  };

  const handleViewReceipt = async (bookingId) => {
    try {
      const response = await axios.get(`${API_BASE}/api/receipts/view/${bookingId}`, {
        headers: { Authorization: `Bearer ${token}` },
        responseType: 'blob',
      });

      const blob = new Blob([response.data], { type: 'application/pdf' });
      const url = window.URL.createObjectURL(blob);
      window.open(url);
    } catch (err) {
      console.error(err);
      alert('❌ Failed to fetch receipt');
    }
  };

  const handleDownloadReceipt = async (bookingId) => {
    try {
      const response = await axios.get(`${API_BASE}/api/receipts/download/${bookingId}`, {
        headers: { Authorization: `Bearer ${token}` },
        responseType: 'blob',
      });

      const blob = new Blob([response.data], { type: 'application/pdf' });
      const link = document.createElement('a');
      link.href = window.URL.createObjectURL(blob);
      link.download = `receipt_${bookingId}.pdf`;
      link.click();
    } catch (err) {
      console.error(err);
      alert('❌ Failed to download receipt');
    }
  };

  if (!user) {
    return <p className="text-center mt-10 text-red-600">Please login to view your dashboard.</p>;
  }

  return (
    <div className="max-w-5xl mx-auto mt-12 p-6 bg-white shadow-lg rounded-3xl">
      <h2 className="text-3xl font-bold text-blue-700 mb-8 text-center">📋 My Bookings</h2>

      {bookings.length === 0 ? (
        <p className="text-center text-gray-500">No bookings found.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full table-auto text-sm text-left text-gray-700">
            <thead>
              <tr className="bg-gray-100 text-gray-600 uppercase text-xs">
                <th className="px-4 py-3">Service</th>
                <th className="px-4 py-3">Date</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3 text-center">Actions</th>
              </tr>
            </thead>
            <tbody>
              {bookings.map((booking) => (
                <tr key={booking._id} className="border-b">
                  <td className="px-4 py-3">{booking.serviceName}</td>
                  <td className="px-4 py-3">{new Date(booking.date).toLocaleDateString()}</td>
                  <td className="px-4 py-3 capitalize">{booking.status}</td>
                  <td className="px-4 py-3 flex gap-2 justify-center">
                    <button
                      onClick={() => handleViewReceipt(booking._id)}
                      className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded-md text-xs"
                    >
                      📄 View
                    </button>
                    <button
                      onClick={() => handleDownloadReceipt(booking._id)}
                      className="bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded-md text-xs"
                    >
                      ⬇️ Download
                    </button>
                    {booking.status !== 'cancelled' && (
                      <button
                        onClick={() => handleCancelBooking(booking._id)}
                        className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded-md text-xs"
                      >
                        ❌ Cancel
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
