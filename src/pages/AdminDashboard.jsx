// ✅ AdminDashboard.jsx (with date check for Completion)
import React, { useEffect, useState } from 'react';
import axios from 'axios';

const AdminDashboard = () => {
  const [stats, setStats] = useState({ users: 0, bookings: 0, services: 0, bookingsToday: 0 });
  const [users, setUsers] = useState([]);
  const [services, setServices] = useState([]);
  const [search, setSearch] = useState('');
  const [alertMsg, setAlertMsg] = useState('');
  const [alertType, setAlertType] = useState('');
  const [editingService, setEditingService] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [bookings, setBookings] = useState([]);
  const [bookingFilter, setBookingFilter] = useState({ customer: '', status: '', date: '' });

  const [formData, setFormData] = useState({
    name: '',
    category: '',
    vehicleType: '',
    price: '',
    duration: '',
    isActive: true
  });

  useEffect(() => {
    fetchStats();
    fetchUsers();
    fetchServices();
    fetchBookings();
  }, []);

  const fetchStats = async () => {
    try {
      const res = await axios.get('/api/admin/stats');
      setStats(res.data);
    } catch {
      showAlert('Failed to fetch dashboard stats', 'error');
    }
  };

  const fetchUsers = async () => {
    try {
      const res = await axios.get('/api/users');
      setUsers(res.data.users);
    } catch {
      showAlert('Failed to fetch users', 'error');
    }
  };

  const fetchServices = async () => {
    try {
      const res = await axios.get('/api/services');
      setServices(res.data.services);
    } catch {
      showAlert('Failed to fetch services', 'error');
    }
  };

  const fetchBookings = async () => {
    try {
      const res = await axios.get('/api/bookings');
      setBookings(res.data.bookings);
    } catch {
      showAlert('Failed to fetch bookings', 'error');
    }
  };

  const handleBookingStatusChange = async (id, status) => {
    try {
      await axios.patch(`/api/bookings/${id}/status`, { status });
      fetchBookings(); // refresh the list
      showAlert(`Booking marked as ${status}`, 'success');
    } catch (err) {
      showAlert(err.response?.data?.message || 'Failed to update booking status', 'error');
    }
  };

  const showAlert = (msg, type) => {
    setAlertMsg(msg);
    setAlertType(type);
    setTimeout(() => setAlertMsg(''), 3000);
  };

  const filteredUsers = users.filter(
    (u) =>
      u.name.toLowerCase().includes(search.toLowerCase()) ||
      u.email.toLowerCase().includes(search.toLowerCase()) ||
      u.phone.includes(search)
  );

  const isToday = (dateStr) => {
    const today = new Date();
    const input = new Date(dateStr);
    return today.toDateString() === input.toDateString();
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Admin Dashboard</h1>

      {alertMsg && (
        <div className={`mb-4 px-4 py-2 rounded text-white ${alertType === 'success' ? 'bg-green-500' : 'bg-red-500'}`}>
          {alertMsg}
        </div>
      )}

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-white p-6 rounded shadow"><p>Total Users</p><p className="text-2xl">{stats.users}</p></div>
        <div className="bg-white p-6 rounded shadow"><p>Total Bookings</p><p className="text-2xl">{stats.bookings}</p></div>
        <div className="bg-white p-6 rounded shadow"><p>Services Offered</p><p className="text-2xl">{stats.services}</p></div>
        <div className="bg-white p-6 rounded shadow"><p>Bookings Today</p><p className="text-2xl">{stats.bookingsToday}</p></div>
      </div>

      {/* Users Table */}
      {/* ... (unchanged code for managing users and services) ... */}

      {/* Booking Management */}
      <div className="mt-10">
        <h2 className="text-xl font-semibold mb-4">Manage Bookings</h2>

        <div className="flex gap-4 mb-4">
          <input
            className="border p-2 rounded"
            placeholder="Filter by customer"
            value={bookingFilter.customer}
            onChange={(e) => setBookingFilter({ ...bookingFilter, customer: e.target.value })}
          />
          <select
            className="border p-2 rounded"
            value={bookingFilter.status}
            onChange={(e) => setBookingFilter({ ...bookingFilter, status: e.target.value })}
          >
            <option value="">All Status</option>
            <option value="Pending">Pending</option>
            <option value="Approved">Approved</option>
            <option value="Cancelled">Cancelled</option>
            <option value="Completed">Completed</option>
          </select>
        </div>

        <table className="min-w-full divide-y">
          <thead>
            <tr>
              <th>Customer</th><th>Service</th><th>Date</th><th>Status</th><th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {bookings
              .filter((b) => {
                const matchName = b.user.name.toLowerCase().includes(bookingFilter.customer.toLowerCase());
                const matchStatus = bookingFilter.status ? b.status === bookingFilter.status : true;
                return matchName && matchStatus;
              })
              .map((b) => (
                <tr key={b._id}>
                  <td>{b.user.name}</td>
                  <td>{b.service.name}</td>
                  <td>{new Date(b.appointmentDate).toLocaleDateString()}</td>
                  <td>{b.status}</td>
                  <td className="space-x-2">
                    {b.status !== 'Approved' && (
                      <button onClick={() => handleBookingStatusChange(b._id, 'Approved')} className="bg-green-500 text-white px-2 py-1 rounded">Approve</button>
                    )}
                    {b.status !== 'Cancelled' && (
                      <button onClick={() => handleBookingStatusChange(b._id, 'Cancelled')} className="bg-red-600 text-white px-2 py-1 rounded">Cancel</button>
                    )}
                    {b.status !== 'Completed' && isToday(b.appointmentDate) && (
                      <button onClick={() => handleBookingStatusChange(b._id, 'Completed')} className="bg-blue-600 text-white px-2 py-1 rounded">Complete</button>
                    )}
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminDashboard;
