import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import axios from 'axios';

const ProfileDashboard = () => {
  const { user, token } = useAuth();
  const [editMode, setEditMode] = useState(false);
  const [form, setForm] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: user?.phone || '',
    address: user?.address || '',
    password: '', // optional
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      await axios.put(
        `${import.meta.env.VITE_API_URL}/api/edit-profile`,
        { ...form },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      alert('✅ Profile updated successfully!');
      setEditMode(false);
      window.location.reload(); // optional: reload to show latest info
    } catch (err) {
      console.error(err);
      alert('❌ Failed to update profile');
    }
  };

  if (!user) {
    return <p className="text-center text-red-600 mt-10">Please login to view your profile.</p>;
  }

  return (
    <div className="max-w-2xl mx-auto mt-12 p-8 bg-white shadow-lg rounded-3xl border border-gray-100">
      <h2 className="text-3xl font-bold text-blue-700 mb-6 text-center">👤 Profile Dashboard</h2>

      {!editMode ? (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-4 text-gray-700 text-sm">
            <div><strong>Role:</strong> {user.role?.toUpperCase()}</div>
            <div><strong>Name:</strong> {user.name}</div>
            <div><strong>Email:</strong> {user.email}</div>
            <div><strong>Phone:</strong> {user.phone}</div>
            <div><strong>Address:</strong> {user.address || 'Not Provided'}</div>
          </div>

          <div className="mt-6 text-center">
            <button
              onClick={() => setEditMode(true)}
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg text-sm font-medium transition-all"
            >
              ✏️ Edit Profile
            </button>
          </div>
        </>
      ) : (
        <>
          <form onSubmit={handleUpdate} className="space-y-4 text-sm text-gray-700">
            <div>
              <label className="block font-medium">Name</label>
              <input
                type="text"
                name="name"
                value={form.name}
                onChange={handleChange}
                className="w-full px-3 py-2 border rounded-lg"
              />
            </div>
            <div>
              <label className="block font-medium">Email</label>
              <input
                type="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                className="w-full px-3 py-2 border rounded-lg"
              />
            </div>
            <div>
              <label className="block font-medium">Phone</label>
              <input
                type="text"
                name="phone"
                value={form.phone}
                onChange={handleChange}
                className="w-full px-3 py-2 border rounded-lg"
              />
            </div>
            <div>
              <label className="block font-medium">Address</label>
              <input
                type="text"
                name="address"
                value={form.address}
                onChange={handleChange}
                className="w-full px-3 py-2 border rounded-lg"
              />
            </div>
            <div>
              <label className="block font-medium">New Password (optional)</label>
              <input
                type="password"
                name="password"
                value={form.password}
                onChange={handleChange}
                className="w-full px-3 py-2 border rounded-lg"
              />
            </div>

            <div className="flex justify-center gap-4 mt-6">
              <button
                type="submit"
                className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-lg text-sm font-medium"
              >
                ✅ Save
              </button>
              <button
                type="button"
                onClick={() => setEditMode(false)}
                className="bg-gray-200 hover:bg-gray-300 px-6 py-2 rounded-lg text-sm"
              >
                ❌ Cancel
              </button>
            </div>
          </form>
        </>
      )}
    </div>
  );
};

export default ProfileDashboard;
