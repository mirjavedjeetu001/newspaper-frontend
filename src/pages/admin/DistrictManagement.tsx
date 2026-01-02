import { useState, useEffect } from 'react';
import axios from 'axios';
import AdminSidebar from '../../components/admin/AdminSidebar';
import '../../styles/Admin.css';

interface District {
  id: number;
  name_en: string;
  name_bn: string;
  code: string;
  is_active: boolean;
  created_at: string;
}

export default function DistrictManagement() {
  const [districts, setDistricts] = useState<District[]>([]);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [formData, setFormData] = useState({
    name_en: '',
    name_bn: '',
    code: '',
    is_active: true
  });

  useEffect(() => {
    fetchDistricts();
  }, []);

  const fetchDistricts = async () => {
    try {
      const response = await axios.get('http://localhost:3000/districts');
      setDistricts(response.data);
    } catch (error) {
      console.error('Error fetching districts:', error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingId) {
        await axios.put(`http://localhost:3000/districts/${editingId}`, formData);
      } else {
        await axios.post('http://localhost:3000/districts', formData);
      }
      fetchDistricts();
      resetForm();
    } catch (error) {
      console.error('Error saving district:', error);
      alert('Error saving district');
    }
  };

  const handleEdit = (district: District) => {
    setEditingId(district.id);
    setFormData({
      name_en: district.name_en,
      name_bn: district.name_bn,
      code: district.code,
      is_active: district.is_active
    });
  };

  const handleDelete = async (id: number) => {
    if (window.confirm('Are you sure you want to delete this district?')) {
      try {
        await axios.delete(`http://localhost:3000/districts/${id}`);
        fetchDistricts();
      } catch (error) {
        console.error('Error deleting district:', error);
      }
    }
  };

  const resetForm = () => {
    setFormData({
      name_en: '',
      name_bn: '',
      code: '',
      is_active: true
    });
    setEditingId(null);
  };

  return (
    <div className="admin-container">
      <AdminSidebar />
      <div className="admin-content">
        <div className="admin-header">
          <h1>জেলা পরিচালনা / District Management</h1>
        </div>

        <div className="admin-form-container">
          <h2>{editingId ? 'Edit District' : 'Add New District'}</h2>
          <form onSubmit={handleSubmit} className="admin-form">
            <div className="form-row">
              <div className="form-group">
                <label>District Name (English) *</label>
                <input
                  type="text"
                  value={formData.name_en}
                  onChange={(e) => setFormData({ ...formData, name_en: e.target.value })}
                  required
                />
              </div>
              <div className="form-group">
                <label>District Name (Bengali) *</label>
                <input
                  type="text"
                  value={formData.name_bn}
                  onChange={(e) => setFormData({ ...formData, name_bn: e.target.value })}
                  required
                />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>District Code *</label>
                <input
                  type="text"
                  value={formData.code}
                  onChange={(e) => setFormData({ ...formData, code: e.target.value.toUpperCase() })}
                  placeholder="e.g., DHA, CTG"
                  maxLength={5}
                  required
                />
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
            </div>

            <div className="form-actions">
              <button type="submit" className="btn-primary">
                {editingId ? 'Update District' : 'Create District'}
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
          <h2>Districts List ({districts.length} total)</h2>
          <table className="admin-table">
            <thead>
              <tr>
                <th>Code</th>
                <th>English Name</th>
                <th>Bengali Name</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {districts.map((district) => (
                <tr key={district.id}>
                  <td><strong>{district.code}</strong></td>
                  <td>{district.name_en}</td>
                  <td>{district.name_bn}</td>
                  <td>
                    <span className={`badge ${district.is_active ? 'badge-success' : 'badge-danger'}`}>
                      {district.is_active ? 'Active' : 'Inactive'}
                    </span>
                  </td>
                  <td>
                    <button onClick={() => handleEdit(district)} className="btn-edit">
                      Edit
                    </button>
                    <button onClick={() => handleDelete(district.id)} className="btn-delete">
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
