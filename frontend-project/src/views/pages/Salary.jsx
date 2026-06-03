import React, { useState, useEffect } from "react";
import { fetchSalaries, createSalary, updateSalary, deleteSalary } from "../../controllers/salaryController";
import { fetchEmployees } from "../../controllers/employeeController";
import { initSalaryForm } from "../../models/salaryModel";

const MONTH_NAMES = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December"
];

const getYear = () => new Date().getFullYear();

const MONTHS = MONTH_NAMES.map((name, i) => {
  const m = String(i + 1).padStart(2, "0");
  return { value: `${getYear()}-${m}`, label: name };
});

const getMonthLabel = (value) => {
  if (!value) return value;
  const parts = value.split("-");
  const idx = parseInt(parts[1], 10) - 1;
  return MONTH_NAMES[idx] || value;
};

const Salary = () => {
  const [salaries, setSalaries] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [openModal, setOpenModal] = useState(false);
  const [editModal, setEditModal] = useState(false);
  const [form, setForm] = useState(initSalaryForm);
  const [editForm, setEditForm] = useState(initSalaryForm);
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
    try {
      setSalaries(await fetchSalaries());
      setEmployees(await fetchEmployees());
    } catch (err) { showNotification("Failed to load data!", "error"); }
  };

  const autoFillSalary = (empId, setData, current) => {
    const emp = employees.find((e) => e._id === empId);
    if (!emp) {
      setData({ ...current, employee: empId, grossSalary: "", totalDeduction: "", netSalary: "" });
      return;
    }
    setData({ ...current, employee: empId, grossSalary: "", totalDeduction: "", netSalary: "" });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await createSalary(form);
      setForm(initSalaryForm);
      setOpenModal(false);
      loadData();
      showNotification("Salary created successfully!");
    } catch (error) {
      showNotification(error.response?.data?.message || "Failed to create salary!", "error");
    } finally { setLoading(false); }
  };

  const handleEdit = async (e) => {
    e.preventDefault();
    setEditLoading(true);
    try {
      await updateSalary(editId, editForm);
      setEditForm(initSalaryForm);
      setEditId(null);
      setEditModal(false);
      loadData();
      showNotification("Salary updated successfully!");
    } catch (error) {
      showNotification(error.response?.data?.message || "Failed to update salary!", "error");
    } finally { setEditLoading(false); }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this salary record?")) return;
    try { await deleteSalary(id); loadData(); showNotification("Salary deleted successfully!"); }
    catch (error) { showNotification(error.response?.data?.message || "Failed to delete salary!", "error"); }
  };

  const openEditModal = (salary) => {
    const formData = {
      employee: salary.employee?._id || "",
      grossSalary: salary.grossSalary,
      totalDeduction: salary.totalDeduction,
      netSalary: salary.netSalary,
      month: salary.month,
    };
    setEditForm(formData);
    setInitialEditForm(JSON.stringify(formData));
    setEditId(salary._id);
    setEditModal(true);
  };

  const handleCloseEditModal = () => {
    if (initialEditForm && JSON.stringify(editForm) !== initialEditForm) {
      if (!window.confirm("Discard unsaved changes?")) return;
    }
    setEditModal(false);
  };

  const getEmployeeName = (emp) => {
    return emp ? `${emp.firstName} ${emp.lastName}` : "N/A";
  };

  const renderAddForm = (data, setData, submitLabel, onSubmit) => (
    <form onSubmit={onSubmit} className="space-y-3">
      <select className="input-field" value={data.employee} onChange={(e) => autoFillSalary(e.target.value, setData, data)} required>
        <option value="">Select Employee</option>
        {employees.map((emp) => (
          <option key={emp._id} value={emp._id}>
            {emp.firstName} {emp.lastName}
          </option>
        ))}
      </select>
      <div className="flex flex-col sm:flex-row gap-3">
        <input className="input-field" placeholder="Gross Salary (RWF)" type="number" value={data.grossSalary} onChange={(e) => {
          const gross = Number(e.target.value);
          setData({ ...data, grossSalary: gross, netSalary: gross - Number(data.totalDeduction || 0) });
        }} required />
        <input className="input-field" placeholder="Total Deduction (RWF)" type="number" value={data.totalDeduction} onChange={(e) => {
          const ded = Number(e.target.value);
          setData({ ...data, totalDeduction: ded, netSalary: Number(data.grossSalary || 0) - ded });
        }} required />
        <input className="input-field" placeholder="Net Salary (RWF)" type="number" value={data.netSalary} readOnly />
      </div>
      <select className="input-field" value={data.month} onChange={(e) => setData({ ...data, month: e.target.value })} required>
        <option value="">Select Month</option>
        {MONTHS.map((m) => <option key={m.value} value={m.value}>{m.label}</option>)}
      </select>
      <div className="text-center"><button type="submit" className="btn" disabled={submitLabel === "Add Salary" ? loading : editLoading}>{submitLabel === "Add Salary" ? (loading ? "Adding..." : submitLabel) : (editLoading ? "Updating..." : submitLabel)}</button></div>
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
            <h1 className="text-2xl font-bold text-content mb-1">Salary Management</h1>
            <p className="text-muted">Manage employee salary records</p>
          </div>
          <button onClick={() => setOpenModal(true)} className="btn">+ Add Salary</button>
        </div>

        <div className="card">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold text-content">Salary Records ({salaries.length})</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-color">
                  <th className="text-left py-3 px-4 font-semibold text-content">Employee Name</th>
                  <th className="text-left py-3 px-4 font-semibold text-content">Gross Salary</th>
                  <th className="text-left py-3 px-4 font-semibold text-content">Deduction</th>
                  <th className="text-left py-3 px-4 font-semibold text-content">Net Salary</th>
                  <th className="text-left py-3 px-4 font-semibold text-content">Month</th>
                  <th className="text-center py-3 px-4 font-semibold text-content">Actions</th>
                </tr>
              </thead>
              <tbody>
                {salaries.length === 0 ? (
                  <tr><td colSpan="6" className="text-center py-8 text-muted">No salary records yet.</td></tr>
                ) : (
                  salaries.map((s, index) => (
                    <tr key={s._id} className={`border-b border-color hover:bg-hover ${index % 2 === 0 ? 'bg-card' : 'bg-card-alt'} animate-slide-up`} style={{ animationDelay: `${index * 0.03}s` }}>
                      <td className="py-3 px-4 font-medium text-content">{getEmployeeName(s.employee)}</td>
                      <td className="py-3 px-4 text-content">{Number(s.grossSalary).toLocaleString()}</td>
                      <td className="py-3 px-4 text-content">{Number(s.totalDeduction).toLocaleString()}</td>
                      <td className="py-3 px-4 text-content">{Number(s.netSalary).toLocaleString()}</td>
                       <td className="py-3 px-4 text-content">{getMonthLabel(s.month)}</td>
                      <td className="py-3 px-4">
                        <div className="flex gap-2 justify-center">
                          <button onClick={() => openEditModal(s)} className="btn">Edit</button>
                          <button onClick={() => handleDelete(s._id)} className="btn-danger">Delete</button>
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
              <h3 className="modal-title mb-0">Add New Salary</h3>
              <button onClick={() => setOpenModal(false)} className="btn">X</button>
            </div>
            {renderAddForm(form, setForm, "Add Salary", handleSubmit)}
          </div>
        </div>
      )}

      {editModal && (
        <div className="overlay animate-fade-in" onClick={handleCloseEditModal}>
          <div className="modal animate-slide-up" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-4">
              <h3 className="modal-title mb-0">Edit Salary</h3>
              <button onClick={handleCloseEditModal} className="btn">X</button>
            </div>
            {renderAddForm(editForm, setEditForm, "Update Salary", handleEdit)}
          </div>
        </div>
      )}

    </div>
  );
};

export default Salary;
