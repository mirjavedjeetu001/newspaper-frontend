import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { categoryAPI } from '../../services/api';
import AdminSidebar from '../../components/admin/AdminSidebar';
import '../../styles/Admin.css';

const CategoryManagement = () => {
  const { t, i18n } = useTranslation();
  const [categories, setCategories] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editingCategory, setEditingCategory] = useState<any>(null);
  const [formData, setFormData] = useState({
    name_en: '',
    name_bn: '',
    slug: '',
    order: 0,
  });

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const response = await categoryAPI.getAll();
      setCategories(response.data);
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingCategory) {
        await categoryAPI.update(editingCategory.id, formData);
      } else {
        await categoryAPI.create(formData);
      }
      setShowForm(false);
      setEditingCategory(null);
      resetForm();
      fetchCategories();
    } catch (error) {
      console.error('Error saving category:', error);
    }
  };

  const handleEdit = (item: any) => {
    setEditingCategory(item);
    setFormData({
      name_en: item.name_en,
      name_bn: item.name_bn,
      slug: item.slug,
      order: item.order,
    });
    setShowForm(true);
  };

  const handleDelete = async (id: number) => {
    if (window.confirm(i18n.language === 'bn' ? 'আপনি কি নিশ্চিত?' : 'Are you sure?')) {
      try {
        await categoryAPI.delete(id);
        fetchCategories();
      } catch (error) {
        console.error('Error deleting category:', error);
      }
    }
  };

  const resetForm = () => {
    setFormData({
      name_en: '',
      name_bn: '',
      slug: '',
      order: 0,
    });
  };

  return (
    <div className="admin-layout">
      <AdminSidebar />

      <main className="admin-content">
        <div className="admin-header">
          <h1>{t('manageCategories')}</h1>
          <button 
            className="btn btn-primary" 
            onClick={() => { setShowForm(!showForm); setEditingCategory(null); resetForm(); }}
          >
            {showForm ? t('cancel') : t('addNew')}
          </button>
        </div>

        {showForm && (
          <div className="admin-form-card">
            <h2>{editingCategory ? t('edit') : t('addNew')} {t('category')}</h2>
            <form onSubmit={handleSubmit}>
              <div className="form-row">
                <div className="form-group">
                  <label>Name (English)</label>
                  <input
                    type="text"
                    value={formData.name_en}
                    onChange={(e) => setFormData({ ...formData, name_en: e.target.value })}
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Name (বাংলা)</label>
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
                  <label>Slug</label>
                  <input
                    type="text"
                    value={formData.slug}
                    onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Order</label>
                  <input
                    type="number"
                    value={formData.order}
                    onChange={(e) => setFormData({ ...formData, order: parseInt(e.target.value) })}
                  />
                </div>
              </div>

              <div className="form-actions">
                <button type="submit" className="btn btn-primary">{t('save')}</button>
                <button 
                  type="button" 
                  className="btn btn-secondary" 
                  onClick={() => { setShowForm(false); setEditingCategory(null); resetForm(); }}
                >
                  {t('cancel')}
                </button>
              </div>
            </form>
          </div>
        )}

        <div className="admin-table-card">
          <table className="admin-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Name</th>
                <th>Slug</th>
                <th>Order</th>
                <th>{t('actions')}</th>
              </tr>
            </thead>
            <tbody>
              {categories.map((item: any) => (
                <tr key={item.id}>
                  <td>{item.id}</td>
                  <td>{i18n.language === 'bn' ? item.name_bn : item.name_en}</td>
                  <td>{item.slug}</td>
                  <td>{item.order}</td>
                  <td>
                    <button className="btn btn-sm btn-edit" onClick={() => handleEdit(item)}>{t('edit')}</button>
                    <button className="btn btn-sm btn-delete" onClick={() => handleDelete(item.id)}>{t('delete')}</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {categories.length === 0 && <div className="no-data">{t('noData')}</div>}
        </div>
      </main>
    </div>
  );
};

export default CategoryManagement;
