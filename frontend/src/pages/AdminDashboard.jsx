import { useState, useEffect } from "react";
import { useAuthStore } from "../store/useAuthStore";
import { useNavigate } from "react-router-dom";
import { 
  Users, 
  UserPlus, 
  Search, 
  Edit, 
  Trash2, 
  LogOut, 
  MessageSquare,
  Shield,
  Plus,
  X,
  Loader2
} from "lucide-react";
import toast from "react-hot-toast";
import { axiosInstance } from "../lib/axios.js";

const AdminDashboard = () => {
  const { authUser, logout } = useAuthStore();
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    mobile: "",
    password: "",
    role: "user"
  });

  // Fetch users
  const fetchUsers = async () => {
    try {
      const params = searchTerm ? { search: searchTerm } : {};
      const res = await axiosInstance.get('/admin/users', { params });
      setUsers(res.data);
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to fetch users');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, [searchTerm]);

  // Create user
  const handleCreateUser = async (e) => {
    e.preventDefault();
    try {
      await axiosInstance.post('/admin/users', formData);
      toast.success('User created successfully');
      setShowCreateForm(false);
      setFormData({ fullName: "", email: "", mobile: "", password: "", role: "user" });
      fetchUsers();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to create user');
    }
  };

  // Update user
  const handleUpdateUser = async (e) => {
    e.preventDefault();
    try {
      await axiosInstance.put(`/admin/users/${editingUser._id}`, formData);
      toast.success('User updated successfully');
      setEditingUser(null);
      setFormData({ fullName: "", email: "", mobile: "", password: "", role: "user" });
      fetchUsers();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to update user');
    }
  };

  // Delete user
  const handleDeleteUser = async (userId) => {
    if (!confirm('Are you sure you want to delete this user?')) return;
    
    try {
      await axiosInstance.delete(`/admin/users/${userId}`);
      toast.success('User deleted successfully');
      fetchUsers();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to delete user');
    }
  };

  // Edit user
  const handleEditUser = (user) => {
    setEditingUser(user);
    setFormData({
      fullName: user.fullName,
      email: user.email,
      mobile: user.mobile,
      password: "",
      role: user.role
    });
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-base-200">
      {/* Header */}
      <div className="navbar bg-base-100 shadow-lg">
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <Shield className="w-8 h-8 text-primary" />
            <h1 className="text-xl font-bold">Admin Dashboard</h1>
          </div>
        </div>
        <div className="flex-none gap-2">
          <div className="flex items-center gap-2">
            <span className="text-sm opacity-70">Welcome, {authUser.fullName}</span>
            <button onClick={handleLogout} className="btn btn-sm btn-outline">
              <LogOut className="w-4 h-4" />
              Logout
            </button>
          </div>
        </div>
      </div>

      <div className="container mx-auto p-6">
        {/* Search and Create */}
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search users..."
                className="input input-bordered w-full pl-10"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
          <button
            onClick={() => setShowCreateForm(true)}
            className="btn btn-primary"
          >
            <UserPlus className="w-4 h-4 mr-2" />
            Add User
          </button>
        </div>

        {/* Users Table */}
        <div className="bg-base-100 rounded-lg shadow-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="table w-full">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Mobile</th>
                  <th>Role</th>
                  <th>Created</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan="6" className="text-center py-8">
                      <Loader2 className="w-6 h-6 animate-spin mx-auto" />
                    </td>
                  </tr>
                ) : users.length === 0 ? (
                  <tr>
                    <td colSpan="6" className="text-center py-8 text-gray-500">
                      No users found
                    </td>
                  </tr>
                ) : (
                  users.map((user) => (
                    <tr key={user._id}>
                      <td className="font-medium">{user.fullName}</td>
                      <td>{user.email}</td>
                      <td>{user.mobile}</td>
                      <td>
                        <span className={`badge ${user.role === 'admin' ? 'badge-primary' : 'badge-secondary'}`}>
                          {user.role}
                        </span>
                      </td>
                      <td>{new Date(user.createdAt).toLocaleDateString()}</td>
                      <td>
                        <div className="flex gap-2">
                          <button
                            onClick={() => handleEditUser(user)}
                            className="btn btn-sm btn-outline"
                          >
                            <Edit className="w-4 h-4" />
                          </button>
                          {user.role !== 'admin' && (
                            <button
                              onClick={() => handleDeleteUser(user._id)}
                              className="btn btn-sm btn-error"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Create User Modal */}
      {showCreateForm && (
        <div className="modal modal-open">
          <div className="modal-box">
            <h3 className="font-bold text-lg mb-4">Create New User</h3>
            <form onSubmit={handleCreateUser} className="space-y-4">
              <div className="form-control">
                <label className="label">
                  <span className="label-text">Full Name</span>
                </label>
                <input
                  type="text"
                  className="input input-bordered"
                  value={formData.fullName}
                  onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                  required
                />
              </div>
              <div className="form-control">
                <label className="label">
                  <span className="label-text">Email</span>
                </label>
                <input
                  type="email"
                  className="input input-bordered"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  required
                />
              </div>
              <div className="form-control">
                <label className="label">
                  <span className="label-text">Mobile</span>
                </label>
                <input
                  type="text"
                  className="input input-bordered"
                  value={formData.mobile}
                  onChange={(e) => setFormData({ ...formData, mobile: e.target.value })}
                  required
                />
              </div>
              <div className="form-control">
                <label className="label">
                  <span className="label-text">Password</span>
                </label>
                <input
                  type="password"
                  className="input input-bordered"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  required
                />
              </div>
              <div className="form-control">
                <label className="label">
                  <span className="label-text">Role</span>
                </label>
                <select
                  className="select select-bordered"
                  value={formData.role}
                  onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                >
                  <option value="user">User</option>
                  <option value="admin">Admin</option>
                </select>
              </div>
              <div className="modal-action">
                <button type="submit" className="btn btn-primary">
                  Create User
                </button>
                <button
                  type="button"
                  className="btn"
                  onClick={() => setShowCreateForm(false)}
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit User Modal */}
      {editingUser && (
        <div className="modal modal-open">
          <div className="modal-box">
            <h3 className="font-bold text-lg mb-4">Edit User</h3>
            <form onSubmit={handleUpdateUser} className="space-y-4">
              <div className="form-control">
                <label className="label">
                  <span className="label-text">Full Name</span>
                </label>
                <input
                  type="text"
                  className="input input-bordered"
                  value={formData.fullName}
                  onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                  required
                />
              </div>
              <div className="form-control">
                <label className="label">
                  <span className="label-text">Email</span>
                </label>
                <input
                  type="email"
                  className="input input-bordered"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  required
                />
              </div>
              <div className="form-control">
                <label className="label">
                  <span className="label-text">Mobile</span>
                </label>
                <input
                  type="text"
                  className="input input-bordered"
                  value={formData.mobile}
                  onChange={(e) => setFormData({ ...formData, mobile: e.target.value })}
                  required
                />
              </div>
              <div className="form-control">
                <label className="label">
                  <span className="label-text">Role</span>
                </label>
                <select
                  className="select select-bordered"
                  value={formData.role}
                  onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                >
                  <option value="user">User</option>
                  <option value="admin">Admin</option>
                </select>
              </div>
              <div className="modal-action">
                <button type="submit" className="btn btn-primary">
                  Update User
                </button>
                <button
                  type="button"
                  className="btn"
                  onClick={() => setEditingUser(null)}
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
