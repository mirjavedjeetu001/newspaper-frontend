import { useState, useEffect } from 'react';
import axios from 'axios';
import AdminSidebar from '../../components/admin/AdminSidebar';
import '../../styles/Admin.css';

interface Permission {
  id: number;
  name: string;
  display_name_en: string;
  display_name_bn: string;
  module: string;
}

interface Role {
  id: number;
  name: string;
  display_name: string;
  description?: string;
  permissions?: Permission[];
}

export default function RoleManagement() {
  const [roles, setRoles] = useState<Role[]>([]);
  const [permissions, setPermissions] = useState<Permission[]>([]);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    display_name: '',
    description: '',
    permissionIds: [] as number[]
  });

  useEffect(() => {
    fetchRoles();
    fetchPermissions();
  }, []);

  const fetchRoles = async () => {
    try {
      const response = await axios.get('http://localhost:3000/roles');
      setRoles(response.data);
    } catch (error) {
      console.error('Error fetching roles:', error);
    }
  };

  const fetchPermissions = async () => {
    try {
      const response = await axios.get('http://localhost:3000/permissions');
      setPermissions(response.data);
    } catch (error) {
      console.error('Error fetching permissions:', error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingId) {
        await axios.put(`http://localhost:3000/roles/${editingId}`, formData);
        if (formData.permissionIds.length > 0) {
          await axios.post(`http://localhost:3000/roles/${editingId}/permissions`, {
            permissionIds: formData.permissionIds
          });
        }
      } else {
        const response = await axios.post('http://localhost:3000/roles', formData);
        if (formData.permissionIds.length > 0) {
          await axios.post(`http://localhost:3000/roles/${response.data.id}/permissions`, {
            permissionIds: formData.permissionIds
          });
        }
      }
      fetchRoles();
      resetForm();
    } catch (error) {
      console.error('Error saving role:', error);
      alert('Error saving role');
    }
  };

  const handleEdit = (role: Role) => {
    setEditingId(role.id);
    setFormData({
      name: role.name,
      display_name: role.display_name,
      description: role.description || '',
      permissionIds: role.permissions?.map(p => p.id) || []
    });
  };

  const handleDelete = async (id: number) => {
    if (window.confirm('Are you sure you want to delete this role?')) {
      try {
        await axios.delete(`http://localhost:3000/roles/${id}`);
        fetchRoles();
      } catch (error) {
        console.error('Error deleting role:', error);
      }
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      display_name: '',
      description: '',
      permissionIds: []
    });
    setEditingId(null);
  };

  const handlePermissionToggle = (permissionId: number) => {
    setFormData(prev => ({
      ...prev,
      permissionIds: prev.permissionIds.includes(permissionId)
        ? prev.permissionIds.filter(id => id !== permissionId)
        : [...prev.permissionIds, permissionId]
    }));
  };

  const groupedPermissions = permissions.reduce((acc, permission) => {
    const module = permission.module || 'other';
    if (!acc[module]) acc[module] = [];
    acc[module].push(permission);
    return acc;
  }, {} as Record<string, Permission[]>);

  return (
    <div className="admin-container">
      <AdminSidebar />
      <div className="admin-content">
        <div className="admin-header">
          <h1>ভূমিকা পরিচালনা / Role Management</h1>
        </div>

        <div className="admin-form-container">
          <h2>{editingId ? 'Edit Role' : 'Add New Role'}</h2>
          <form onSubmit={handleSubmit} className="admin-form">
            <div className="form-row">
              <div className="form-group">
                <label>Role Name (System) *</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="e.g., content_manager"
                  required
                />
              </div>
              <div className="form-group">
                <label>Display Name *</label>
                <input
                  type="text"
                  value={formData.display_name}
                  onChange={(e) => setFormData({ ...formData, display_name: e.target.value })}
                  placeholder="e.g., Content Manager"
                  required
                />
              </div>
            </div>

            <div className="form-group">
              <label>Description</label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                rows={3}
              />
            </div>

            <div className="form-group">
              <label>Permissions</label>
              <div className="permissions-grid">
                {Object.entries(groupedPermissions).map(([module, perms]) => (
                  <div key={module} className="permission-module">
                    <h4>{module.charAt(0).toUpperCase() + module.slice(1)}</h4>
                    {perms.map(permission => (
                      <label key={permission.id} className="checkbox-label">
                        <input
                          type="checkbox"
                          checked={formData.permissionIds.includes(permission.id)}
                          onChange={() => handlePermissionToggle(permission.id)}
                        />
                        {permission.display_name_en}
                      </label>
                    ))}
                  </div>
                ))}
              </div>
            </div>

            <div className="form-actions">
              <button type="submit" className="btn-primary">
                {editingId ? 'Update Role' : 'Create Role'}
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
          <h2>Roles List</h2>
          <table className="admin-table">
            <thead>
              <tr>
                <th>Display Name</th>
                <th>System Name</th>
                <th>Description</th>
                <th>Permissions Count</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {roles.map((role) => (
                <tr key={role.id}>
                  <td><strong>{role.display_name}</strong></td>
                  <td><code>{role.name}</code></td>
                  <td>{role.description}</td>
                  <td>{role.permissions?.length || 0}</td>
                  <td>
                    <button onClick={() => handleEdit(role)} className="btn-edit">
                      Edit
                    </button>
                    <button onClick={() => handleDelete(role.id)} className="btn-delete">
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
