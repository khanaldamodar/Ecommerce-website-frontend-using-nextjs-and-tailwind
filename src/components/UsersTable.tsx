"use client";
import React, { useEffect, useState } from "react";
import { Pencil, Trash2, Loader2, AlertCircle } from "lucide-react";
import Cookies from "js-cookie";

interface User {
  id: number;
  name: string;
  email: string;
  phone_number?: string | null;
  address?: string | null;
  email_verified_at?: string | null;
  created_at: string;
  updated_at: string;
  role: string;
}

const UsersTable = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const res = await fetch("http://localhost:8000/api/users",{
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${Cookies.get("auth_token")}`, // Assuming you store the token in cookies
        },
      });
      const result = await res.json();

      if (result.success) {
        setUsers(result.data);
      } else {
        throw new Error("Failed to load users.");
      }
    } catch (err) {
      console.error(err);
      setError("Unable to fetch users.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleDelete = async (id: number) => {
    if (!confirm("Are you sure you want to delete this user?")) return;
    try {
      const res = await fetch(`http://localhost:8000/api/users/${id}`, {
        method: "DELETE",
      });
      if (res.ok) {
        setUsers(users.filter((user) => user.id !== id));
      } else {
        alert("Failed to delete user.");
      }
    } catch (error) {
      alert("Error deleting user.");
    }
  };

  const formatDate = (date: string) => new Date(date).toLocaleString();

  if (loading) {
    return (
      <div className="flex items-center justify-center p-6">
        <Loader2 className="animate-spin h-6 w-6 text-blue-600" />
        <span className="ml-2 text-gray-600">Loading users...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 bg-red-100 text-red-700 rounded flex items-center">
        <AlertCircle className="w-5 h-5 mr-2" />
        {error}
      </div>
    );
  }

  return (
    <div className="p-6 bg-white shadow rounded-lg">
      <h2 className="text-xl font-semibold mb-4">User Management</h2>
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-4 py-2 text-left text-sm font-semibold text-gray-600">Name</th>
            <th className="px-4 py-2 text-left text-sm font-semibold text-gray-600">Email</th>
            <th className="px-4 py-2 text-left text-sm font-semibold text-gray-600">Role</th>
            <th className="px-4 py-2 text-left text-sm font-semibold text-gray-600">Created At</th>
            <th className="px-4 py-2 text-center text-sm font-semibold text-gray-600">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100">
          {users.map((user) => (
            <tr key={user.id} className="hover:bg-gray-50">
              <td className="px-4 py-2 text-sm text-gray-800">{user.name}</td>
              <td className="px-4 py-2 text-sm text-gray-800">{user.email}</td>
              <td className="px-4 py-2 text-sm text-gray-800 capitalize">{user.role}</td>
              <td className="px-4 py-2 text-sm text-gray-800">{formatDate(user.created_at)}</td>
              <td className="px-4 py-2 text-center space-x-2">
                <button
                  onClick={() => alert(`Edit user ${user.id}`)} // Replace with navigation or modal
                  className="p-1 text-blue-600 hover:bg-blue-50 rounded"
                  title="Edit"
                >
                  <Pencil className="h-5 w-5" />
                </button>
                <button
                  onClick={() => handleDelete(user.id)}
                  className="p-1 text-red-600 hover:bg-red-50 rounded"
                  title="Delete"
                >
                  <Trash2 className="h-5 w-5" />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {users.length === 0 && (
        <div className="text-center py-4 text-gray-500">No users found.</div>
      )}
    </div>
  );
};

export default UsersTable;
