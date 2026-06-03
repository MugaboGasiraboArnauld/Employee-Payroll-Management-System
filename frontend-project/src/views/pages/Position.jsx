import React, { useState, useEffect } from "react";
import { fetchPositions, createPosition, updatePosition, deletePosition } from "../../controllers/positionController";
import { POSITION_NAMES, initPositionForm } from "../../models/positionModel";

const Position = () => {
  const [positions, setPositions] = useState([]);
  const [openModal, setOpenModal] = useState(false);
  const [editModal, setEditModal] = useState(false);
  const [form, setForm] = useState(initPositionForm);
  const [editForm, setEditForm] = useState(initPositionForm);
  const [editId, setEditId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [editLoading, setEditLoading] = useState(false);
  const [notification, setNotification] = useState(null);
  const [initialEditForm, setInitialEditForm] = useState(null);

  useEffect(() => { loadData(); }, []);

  const showNotification = (message, type = "success") => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 3000);
  };

  const loadData = async () => {
    try { setPositions(await fetchPositions()); }
    catch (err) { showNotification("Failed to load positions!", "error"); }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await createPosition(form);
      setForm(initPositionForm);
      setOpenModal(false);
      loadData();
      showNotification("Position created successfully!");
    } catch (error) {
      showNotification(error.response?.data?.message || "Failed to create position!", "error");
    } finally { setLoading(false); }
  };

  const handleEdit = async (e) => {
    e.preventDefault();
    setEditLoading(true);
    try {
      await updatePosition(editId, editForm);
      setEditForm(initPositionForm);
      setEditId(null);
      setEditModal(false);
      loadData();
      showNotification("Position updated successfully!");
    } catch (error) {
      showNotification(error.response?.data?.message || "Failed to update position!", "error");
    } finally { setEditLoading(false); }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this position?")) return;
    try { await deletePosition(id); loadData(); showNotification("Position deleted successfully!"); }
    catch (error) { showNotification(error.response?.data?.message || "Failed to delete position!", "error"); }
  };

  const openEditModal = (pos) => {
    const formData = { name: pos.name, requiredQualification: pos.requiredQualification };
    setEditForm(formData);
    setInitialEditForm(JSON.stringify(formData));
    setEditId(pos._id);
    setEditModal(true);
  };

  const handleCloseEditModal = () => {
    if (initialEditForm && JSON.stringify(editForm) !== initialEditForm) {
      if (!window.confirm("Discard unsaved changes?")) return;
    }
    setEditModal(false);
  };

  const renderAddForm = (data, setData, submitLabel, onSubmit) => (
    <form onSubmit={onSubmit} className="space-y-3">
      <select className="input-field" value={data.name} onChange={(e) => setData({ ...data, name: e.target.value })} required>
        <option value="">Select Position Name</option>
        {POSITION_NAMES.map((n) => <option key={n} value={n}>{n}</option>)}
      </select>
      <input className="input-field" placeholder="Required Qualification" value={data.requiredQualification} onChange={(e) => setData({ ...data, requiredQualification: e.target.value })} required />
      <div className="text-center"><button type="submit" className="btn" disabled={submitLabel === "Add Position" ? loading : editLoading}>{submitLabel === "Add Position" ? (loading ? "Adding..." : submitLabel) : (editLoading ? "Updating..." : submitLabel)}</button></div>
    </form>
  );

  return (
    <div className="bg-page p-4 md:p-6">
      <div className="max-w-7xl mx-auto">
        {notification && (
          <div className={`mb-4 p-3 rounded-lg text-sm font-medium ${notification.type === "error" ? "bg-red-100 text-red-700" : "bg-green-100 text-green-700"}`}>
            {notification.message}
            <button className="float-right font-bold" onClick={() => setNotification(null)}>X</button>
          </div>
        )}

        <div className="flex items-center justify-between mb-6 animate-fade-in">
          <div>
            <h1 className="text-2xl font-bold text-content mb-1">Position Management</h1>
            <p className="text-muted">Manage job positions</p>
          </div>
          <button onClick={() => setOpenModal(true)} className="btn">+ Add Position</button>
        </div>

        <div className="card">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold text-content">Positions ({positions.length})</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-color">
                  <th className="text-left py-3 px-4 font-semibold text-content">Position Name</th>
                  <th className="text-left py-3 px-4 font-semibold text-content">Required Qualification</th>
                  <th className="text-center py-3 px-4 font-semibold text-content">Actions</th>
                </tr>
              </thead>
              <tbody>
                {positions.length === 0 ? (
                  <tr><td colSpan="3" className="text-center py-8 text-muted">No positions created yet.</td></tr>
                ) : (
                  positions.map((pos, index) => (
                    <tr key={pos._id} className={`border-b border-color hover:bg-hover ${index % 2 === 0 ? 'bg-card' : 'bg-card-alt'} animate-slide-up`} style={{ animationDelay: `${index * 0.03}s` }}>
                      <td className="py-3 px-4 text-content font-medium">{pos.name}</td>
                      <td className="py-3 px-4 text-content">{pos.requiredQualification}</td>
                      <td className="py-3 px-4">
                        <div className="flex gap-2 justify-center">
                          <button onClick={() => openEditModal(pos)} className="btn">Edit</button>
                          <button onClick={() => handleDelete(pos._id)} className="btn-danger">Delete</button>
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

      {openModal && (
        <div className="overlay animate-fade-in" onClick={() => setOpenModal(false)}>
          <div className="modal animate-slide-up" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-4">
              <h3 className="modal-title mb-0">Add New Position</h3>
              <button onClick={() => setOpenModal(false)} className="btn">X</button>
            </div>
            {renderAddForm(form, setForm, "Add Position", handleSubmit)}
          </div>
        </div>
      )}

      {editModal && (
        <div className="overlay animate-fade-in" onClick={handleCloseEditModal}>
          <div className="modal animate-slide-up" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-4">
              <h3 className="modal-title mb-0">Edit Position</h3>
              <button onClick={handleCloseEditModal} className="btn">X</button>
            </div>
            {renderAddForm(editForm, setEditForm, "Update Position", handleEdit)}
          </div>
        </div>
      )}
    </div>
  );
};

export default Position;
