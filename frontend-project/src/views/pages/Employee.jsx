import React, { useState, useEffect } from "react";
import { fetchEmployees as getEmployees, fetchDepartments as getDepts, fetchPositions as getPositions, createEmployee, updateEmployee, deleteEmployee } from "../../controllers/employeeController";
import { ADDRESSES, EMPLOYEE_STATUSES, COUNTRY_CODES, initEmployeeForm } from "../../models/employeeModel";

const Employee = () => {
  const [employees, setEmployees] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [positions, setPositions] = useState([]);
  const [openModal, setOpenModal] = useState(false);
  const [editModal, setEditModal] = useState(false);
  const [editId, setEditId] = useState(null);
  const [form, setForm] = useState(initEmployeeForm);
  const [editForm, setEditForm] = useState(initEmployeeForm);
  const [loading, setLoading] = useState(false);
  const [editLoading, setEditLoading] = useState(false);
  const [notification, setNotification] = useState(null);
  const [initialEditForm, setInitialEditForm] = useState(null);
  const [search, setSearch] = useState("");

  useEffect(() => { loadData(); }, []);

  const showNotification = (message, type = "success") => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 3000);
  };

  const loadData = async () => {
    try {
      setEmployees(await getEmployees());
      setDepartments(await getDepts());
      setPositions(await getPositions());
    } catch (err) { showNotification("Failed to load data!", "error"); }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await createEmployee(form);
      setForm(initEmployeeForm);
      setOpenModal(false);
      loadData();
      showNotification("Employee created successfully!");
    } catch (error) {
      showNotification(error.response?.data?.message || error.message || "Failed to create employee!", "error");
    } finally { setLoading(false); }
  };

  const handleEdit = async (e) => {
    e.preventDefault();
    setEditLoading(true);
    try {
      await updateEmployee(editId, editForm);
      setEditForm(initEmployeeForm);
      setEditId(null);
      setEditModal(false);
      loadData();
      showNotification("Employee updated successfully!");
    } catch (error) {
      showNotification(error.response?.data?.message || "Failed to update employee!", "error");
    } finally { setEditLoading(false); }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this employee?")) return;
    try { await deleteEmployee(id); loadData(); showNotification("Employee deleted successfully!"); }
    catch (error) { showNotification("Failed to delete employee!", "error"); }
  };

  const openEditModal = (emp) => {
    const tel = emp.telephone || "";
    const matchedCode = COUNTRY_CODES.find((c) => tel.startsWith(c.code));
    const formData = {
      firstName: emp.firstName,
      lastName: emp.lastName,
      gender: emp.gender,
      dateOfBirth: emp.dateOfBirth ? emp.dateOfBirth.split("T")[0] : "",
      dobFocused: !!emp.dateOfBirth,
      email: emp.email,
      telephone: emp.telephone,
      telephoneCountryCode: matchedCode ? matchedCode.code : "+250",
      telephoneNumber: matchedCode ? tel.slice(matchedCode.code.length) : tel,
      address: emp.address,
      hireDate: emp.hireDate ? emp.hireDate.split("T")[0] : "",
      hireFocused: !!emp.hireDate,
      status: emp.status,
      department: emp.department?._id || "",
      position: emp.position?._id || "",
    };
    setEditForm(formData);
    setInitialEditForm(JSON.stringify(formData));
    setEditId(emp._id);
    setEditModal(true);
  };

  const handleCloseEditModal = () => {
    if (initialEditForm && JSON.stringify(editForm) !== initialEditForm) {
      if (!window.confirm("Discard unsaved changes?")) return;
    }
    setEditModal(false);
  };

  const getDepartmentName = (id) => {
    const dep = departments.find((d) => d._id === id);
    return dep ? dep.name : id;
  };

  const getPositionName = (id) => {
    const pos = positions.find((p) => p._id === id);
    return pos ? pos.name : id;
  };

  const getStatusBadge = (status) => {
    const colors = {
      "on leave": "bg-yellow-100 text-yellow-700",
      "left": "bg-red-100 text-red-700",
      "blacklisted": "bg-red-100 text-red-700",
      "deceased": "bg-gray-100 text-gray-700",
      "on mission": "bg-blue-100 text-blue-700",
    };
    return <span className={`text-xs px-2 py-0.5 rounded-full ${colors[status] || "bg-gray-100 text-gray-700"}`}>{status}</span>;
  };

  const filteredEmployees = employees.filter(emp => {
    if (!search) return true;
    const q = search.toLowerCase();
    return emp.firstName?.toLowerCase().includes(q) ||
      emp.lastName?.toLowerCase().includes(q) ||
      emp.email?.toLowerCase().includes(q) ||
      emp.telephone?.includes(q);
  });

  const renderFields = (data, setData) => (
    <>
      <div className="flex flex-col sm:flex-row gap-3">
        <input className="input-field" placeholder="First Name" value={data.firstName} onChange={(e) => setData({ ...data, firstName: e.target.value })} required />
        <input className="input-field" placeholder="Last Name" value={data.lastName} onChange={(e) => setData({ ...data, lastName: e.target.value })} required />
      </div>
      <div className="flex flex-col sm:flex-row gap-3">
        <input className="input-field" type="email" placeholder="Email" value={data.email} onChange={(e) => setData({ ...data, email: e.target.value })} required />
        <select className="input-field" value={data.gender} onChange={(e) => setData({ ...data, gender: e.target.value })} required>
          <option value="">Select Gender</option>
          <option value="Male">Male</option>
          <option value="Female">Female</option>
          <option value="Other">Other</option>
        </select>
      </div>
      <div className="flex flex-col sm:flex-row gap-3">
        <input className="input-field" type={data.dobFocused ? "date" : "text"} placeholder="Date of Birth" value={data.dateOfBirth} onFocus={() => setData({ ...data, dobFocused: true })} onBlur={() => setData({ ...data, dobFocused: !!data.dateOfBirth })} onChange={(e) => setData({ ...data, dateOfBirth: e.target.value })} required />
        <input className="input-field" type={data.hireFocused ? "date" : "text"} placeholder="Hire Date" value={data.hireDate} onFocus={() => setData({ ...data, hireFocused: true })} onBlur={() => setData({ ...data, hireFocused: !!data.hireDate })} onChange={(e) => setData({ ...data, hireDate: e.target.value })} required />
      </div>
      <div className="flex flex-col sm:flex-row gap-3">
        <select className="input-field sm:w-1/3" value={data.telephoneCountryCode} onChange={(e) => {
          const newCode = e.target.value;
          setData({ ...data, telephoneCountryCode: newCode, telephone: newCode + data.telephoneNumber });
        }} required>
          {COUNTRY_CODES.map((c) => <option key={c.code} value={c.code}>{c.flag} {c.code}</option>)}
        </select>
        <input className="input-field sm:w-2/3" placeholder="Telephone Number" type="tel" value={data.telephoneNumber} onChange={(e) => {
          const num = e.target.value.replace(/\D/g, "");
          setData({ ...data, telephoneNumber: num, telephone: data.telephoneCountryCode + num });
        }} required />
      </div>
      <select className="input-field" value={data.address} onChange={(e) => setData({ ...data, address: e.target.value })} required>
        <option value="">Select Address</option>
        {ADDRESSES.map((a) => <option key={a} value={a}>{a}</option>)}
      </select>
      <select className="input-field" value={data.status} onChange={(e) => setData({ ...data, status: e.target.value })} required>
        <option value="">Select Status</option>
        {EMPLOYEE_STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
      </select>
      <select className="input-field" value={data.department} onChange={(e) => setData({ ...data, department: e.target.value })} required>
        <option value="">Select Department</option>
        {departments.map((d) => <option key={d._id} value={d._id}>{d.name}</option>)}
      </select>
      <select className="input-field" value={data.position} onChange={(e) => setData({ ...data, position: e.target.value })} required>
        <option value="">Select Position</option>
        {positions.map((p) => <option key={p._id} value={p._id}>{p.name}</option>)}
      </select>
    </>
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
            <h1 className="text-2xl font-bold text-content mb-1">Employee Management</h1>
            <p className="text-muted">Manage employee records</p>
          </div>
          <button onClick={() => { setForm(initEmployeeForm); setOpenModal(true); }} className="btn">+ Add Employee</button>
        </div>

        <div className="card mb-4">
          <input className="input-field" placeholder="Search employees by name, email or telephone..." value={search} onChange={(e) => setSearch(e.target.value)} />
        </div>

        <div className="card">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold text-content">Employees ({filteredEmployees.length})</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-color">
                  <th className="text-left py-3 px-4 font-semibold text-content">First Name</th>
                  <th className="text-left py-3 px-4 font-semibold text-content">Last Name</th>
                  <th className="text-left py-3 px-4 font-semibold text-content">Email</th>
                  <th className="text-left py-3 px-4 font-semibold text-content">Department</th>
                  <th className="text-left py-3 px-4 font-semibold text-content">Position</th>
                  <th className="text-left py-3 px-4 font-semibold text-content">Status</th>
                  <th className="text-center py-3 px-4 font-semibold text-content">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredEmployees.length === 0 ? (
                  <tr><td colSpan="7" className="text-center py-8 text-muted">No employees found.</td></tr>
                ) : (
                  filteredEmployees.map((emp, index) => (
                    <tr key={emp._id} className={`border-b border-color hover:bg-hover ${index % 2 === 0 ? 'bg-card' : 'bg-card-alt'} animate-slide-up`} style={{ animationDelay: `${index * 0.03}s` }}>
                      <td className="py-3 px-4 text-content">{emp.firstName}</td>
                      <td className="py-3 px-4 text-content">{emp.lastName}</td>
                      <td className="py-3 px-4 text-content">{emp.email}</td>
                      <td className="py-3 px-4 text-content">{getDepartmentName(emp.department?._id)}</td>
                      <td className="py-3 px-4 text-content">{getPositionName(emp.position?._id)}</td>
                      <td className="py-3 px-4">{getStatusBadge(emp.status)}</td>
                      <td className="py-3 px-4">
                        <div className="flex gap-2">
                          <button onClick={() => openEditModal(emp)} className="btn">Edit</button>
                          <button onClick={() => handleDelete(emp._id)} className="btn-danger">Delete</button>
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
              <h3 className="modal-title mb-0">Add New Employee</h3>
              <button onClick={() => setOpenModal(false)} className="btn">X</button>
            </div>
            <form onSubmit={handleSubmit} className="space-y-3">
              {renderFields(form, setForm)}
              <div className="text-center"><button type="submit" className="btn" disabled={loading}>{loading ? "Adding..." : "Add Employee"}</button></div>
            </form>
          </div>
        </div>
      )}

      {editModal && (
        <div className="overlay animate-fade-in" onClick={handleCloseEditModal}>
          <div className="modal animate-slide-up" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-4">
              <h3 className="modal-title mb-0">Edit Employee</h3>
              <button onClick={handleCloseEditModal} className="btn">X</button>
            </div>
            <form onSubmit={handleEdit} className="space-y-3">
              {renderFields(editForm, setEditForm)}
              <div className="text-center"><button type="submit" className="btn" disabled={editLoading}>{editLoading ? "Updating..." : "Update Employee"}</button></div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Employee;
