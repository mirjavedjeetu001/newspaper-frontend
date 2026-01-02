import { useState, useEffect } from 'react';
import axios from 'axios';
import AdminSidebar from '../../components/admin/AdminSidebar';
import '../../styles/Admin.css';

interface Role {
  id: number;
  name: string;
  display_name: string;
}

interface District {
  id: number;
  name_en: string;
  name_bn: string;
  code: string;
}

interface User {
  id: number;
  username: string;
  email: string;
  full_name: string;
  phone?: string;
  is_active: boolean;
  district_id?: number;
  district?: District;
  roles?: Role[];
  last_login?: string;
  created_at: string;
}

export default function UserManagement() {
  const [users, setUsers] = useState<User[]>([]);
  const [roles, setRoles] = useState<Role[]>([]);
  const [districts, setDistricts] = useState<District[]>([]);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    full_name: '',
    phone: '',
    district_id: '',
    roleIds: [] as number[],
    is_active: true
  });

  useEffect(() => {
    fetchUsers();
    fetchRoles();
    fetchDistricts();
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await axios.get('http://localhost:3000/users');
      setUsers(response.data);
    } catch (error) {
      console.error('Error fetching users:', error);
    }
  };

  const fetchRoles = async () => {
    try {
      const response = await axios.get('http://localhost:3000/roles');
      setRoles(response.data);
    } catch (error) {
      console.error('Error fetching roles:', error);
    }
  };

  const fetchDistricts = async () => {
    try {
      const response = await axios.get('http://localhost:3000/districts/active');
      setDistricts(response.data);
    } catch (error) {
      console.error('Error fetching districts:', error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const submitData = {
        ...formData,
        districtId: formData.district_id ? parseInt(formData.district_id) : null
      };

      if (editingId) {
        if (!formData.password) {
          delete submitData.password;
        }
        await axios.put(`http://localhost:3000/users/${editingId}`, submitData);
      } else {
        await axios.post('http://localhost:3000/users', submitData);
      }
      fetchUsers();
      resetForm();
    } catch (error) {
      console.error('Error saving user:', error);
      alert('Error saving user');
    }
  };

  const handleEdit = (user: User) => {
    setEditingId(user.id);
    setFormData({
      username: user.username,
      email: user.email,
      password: '',
      full_name: user.full_name,
      phone: user.phone || '',
      district_id: user.district_id?.toString() || '',
      roleIds: user.roles?.map(r => r.id) || [],
      is_active: user.is_active
    });
  };

  const handleDelete = async (id: number) => {
    if (window.confirm('Are you sure you want to delete this user?')) {
      try {
        await axios.delete(`http://localhost:3000/users/${id}`);
        fetchUsers();
      } catch (error) {
        console.error('Error deleting user:', error);
      }
    }
  };

  const resetForm = () => {
    setFormData({
      username: '',
      email: '',
      password: '',
      full_name: '',
      phone: '',
      district_id: '',
      roleIds: [],
      is_active: true
    });
    setEditingId(null);
  };

  const handleRoleToggle = (roleId: number) => {
    setFormData(prev => ({
      ...prev,
      roleIds: prev.roleIds.includes(roleId)
        ? prev.roleIds.filter(id => id !== roleId)
        : [...prev.roleIds, roleId]
    }));
  };

  return (
    <div className="admin-container">
      <AdminSidebar />
      <div className="admin-content">
        <div className="admin-header">
          <h1>ব্যবহারকারী পরিচালনা / User Management</h1>
        </div>

        <div className="admin-form-container">
          <h2>{editingId ? 'Edit User' : 'Add New User'}</h2>
          <form onSubmit={handleSubmit} className="admin-form">
            <div className="form-row">
              <div className="form-group">
                <label>Username *</label>
                <input
                  type="text"
                  value={formData.username}
                  onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                  required
                  disabled={editingId !== null}
                />
              </div>
              <div className="form-group">
                <label>Email *</label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  required
                />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>Full Name *</label>
                <input
                  type="text"
                  value={formData.full_name}
                  onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
                  required
                />
              </div>
              <div className="form-group">
                <label>Phone</label>
                <input
                  type="text"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>Password {editingId ? '(Leave blank to keep current)' : '*'}</label>
                <input
                  type="password"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  required={!editingId}
                />
              </div>
              <div className="form-group">
                <label>District</label>
                <select
                  value={formData.district_id}
                  onChange={(e) => setFormData({ ...formData, district_id: e.target.value })}
                >
                  <option value="">Select District</option>
                  {districts.map(district => (
                    <option key={district.id} value={district.id}>
                      {district.name_en} / {district.name_bn}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="form-group">
              <label>Roles *</label>
              <div className="checkbox-group">
                {roles.map(role => (
                  <label key={role.id} className="checkbox-label">
                    <input
                      type="checkbox"
                      checked={formData.roleIds.includes(role.id)}
                      onChange={() => handleRoleToggle(role.id)}
                    />
                    {role.display_name}
                  </label>
                ))}
              </div>
            </div>

            <div className="form-group">
              <label className="checkbox-label">
                <input
                  type="checkbox"
                  checked={formData.is_active}
                  onChange={(e) => setFormData({ ...formData, is_active: e.target.checked })}
                />
                Active
              </label>
            </div>

            <div className="form-actions">
              <button type="submit" className="btn-primary">
                {editingId ? 'Update User' : 'Create User'}
              </button>
              {editingId && (
                <button type="button" onClick={resetForm} className="btn-secondary">
                  Cancel
                </button>
              )}
            </div>
          </form>
        </div>

        <div className="admin-table-container">
          <h2>Users List</h2>
          <table className="admin-table">
            <thead>
              <tr>
                <th>Username</th>
                <th>Full Name</th>
                <th>Email</th>
                <th>Roles</th>
                <th>District</th>
                <th>Status</th>
                <th>Last Login</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr key={user.id}>
                  <td>{user.username}</td>
                  <td>{user.full_name}</td>
                  <td>{user.email}</td>
                  <td>
                    {user.roles?.map(r => r.display_name).join(', ') || 'No roles'}
                  </td>
                  <td>{user.district?.name_en || 'All'}</td>
                  <td>
                    <span className={`badge ${user.is_active ? 'badge-success' : 'badge-danger'}`}>
                      {user.is_active ? 'Active' : 'Inactive'}
                    </span>
                  </td>
                  <td>
                    {user.last_login 
                      ? new Date(user.last_login).toLocaleDateString() 
                      : 'Never'}
                  </td>
                  <td>
                    <button onClick={() => handleEdit(user)} className="btn-edit">
                      Edit
                    </button>
                    <button onClick={() => handleDelete(user.id)} className="btn-delete">
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
