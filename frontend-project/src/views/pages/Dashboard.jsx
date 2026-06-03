import React, { useState, useEffect } from "react";
import { fetchDashboardData } from "../../controllers/dashboardController";
import { createEmployee } from "../../controllers/employeeController";
import { createDepartment } from "../../controllers/departmentController";
import { createSalary } from "../../controllers/salaryController";
import { ADDRESSES, EMPLOYEE_STATUSES, COUNTRY_CODES, initEmployeeForm } from "../../models/employeeModel";
import { DEPT_NAMES, initDepartmentForm } from "../../models/departmentModel";
import { initSalaryForm } from "../../models/salaryModel";
import Modal from "../components/Modal";

const Dashboard = () => {
  const [employees, setEmployees] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [positions, setPositions] = useState([]);
  const [salaries, setSalaries] = useState([]);

  const [showEmpModal, setShowEmpModal] = useState(false);
  const [showDepModal, setShowDepModal] = useState(false);
  const [showSalModal, setShowSalModal] = useState(false);

  const [empForm, setEmpForm] = useState(initEmployeeForm);
  const [depForm, setDepForm] = useState(initDepartmentForm);
  const [salForm, setSalForm] = useState(initSalaryForm);

  const user = JSON.parse(localStorage.getItem("user") || "{}");

  useEffect(() => { loadData(); }, []);

  const loadData = async () => {
    try {
      const data = await fetchDashboardData();
      setEmployees(data.employees);
      setDepartments(data.departments);
      setPositions(data.positions);
      setSalaries(data.salaries);
    } catch (err) { console.error(err); }
  };

  const totalGross = salaries.reduce((sum, s) => sum + Number(s.grossSalary || 0), 0);
  const totalNet = salaries.reduce((sum, s) => sum + Number(s.netSalary || 0), 0);
  const totalDed = salaries.reduce((sum, s) => sum + Number(s.totalDeduction || 0), 0);

  const handleAddEmp = async (e) => {
    e.preventDefault();
    try { await createEmployee(empForm); setEmpForm(initEmployeeForm); setShowEmpModal(false); loadData(); }
    catch (error) { console.error(error); }
  };

  const handleAddDep = async (e) => {
    e.preventDefault();
    try { await createDepartment(depForm); setDepForm(initDepartmentForm); setShowDepModal(false); loadData(); }
    catch (error) { console.error(error); }
  };

  const handleAddSal = async (e) => {
    e.preventDefault();
    try { await createSalary(salForm); setSalForm(initSalaryForm); setShowSalModal(false); loadData(); }
    catch (error) { console.error(error); }
  };

  const latestSalaries = [...salaries].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)).slice(0, 5);

  const getEmployeeName = (emp) => {
    return emp ? `${emp.firstName} ${emp.lastName}` : "N/A";
  };

  return (
    <div className="bg-page p-4 md:p-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-6 animate-fade-in">
          <h1 className="text-2xl font-bold text-content mb-1">Welcome, {user.username || "User"}</h1>
          <p className="text-muted">Overview of the Human Resource Management System</p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3 mb-6">
          <div className="dashboard-card animate-bounce-in interactive" onClick={() => { setEmpForm(initEmployeeForm); setShowEmpModal(true); }} style={{ animationDelay: "0s", cursor: "pointer" }}>
            <p className="stat-label">Employees</p>
            <p className="stat-value">{employees.length}</p>
          </div>
          <div className="dashboard-card animate-bounce-in interactive" onClick={() => setShowDepModal(true)} style={{ animationDelay: "0.06s", cursor: "pointer" }}>
            <p className="stat-label">Departments</p>
            <p className="stat-value">{departments.length}</p>
          </div>
          <div className="dashboard-card animate-bounce-in interactive" onClick={() => setShowSalModal(true)} style={{ animationDelay: "0.12s", cursor: "pointer" }}>
            <p className="stat-label">Salary Records</p>
            <p className="stat-value">{salaries.length}</p>
          </div>
          <div className="dashboard-card animate-bounce-in" style={{ animationDelay: "0.18s" }}>
            <p className="stat-label">Total Gross (RWF)</p>
            <p className="stat-value">{totalGross.toLocaleString()}</p>
          </div>
          <div className="dashboard-card animate-bounce-in" style={{ animationDelay: "0.24s" }}>
            <p className="stat-label">Total Net (RWF)</p>
            <p className="stat-value">{totalNet.toLocaleString()}</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-6">
          <div className="dashboard-card">
            <div className="section-title">Department Overview</div>
            {departments.length === 0 ? (
              <p className="text-muted text-sm text-center py-6">No departments yet</p>
            ) : (
              <div className="space-y-2">
                {departments.slice(0, 5).map((d, i) => {
                  const empCount = employees.filter(e => e.department?._id === d._id).length;
                  return (
                    <div key={d._id} className="flex items-center justify-between p-2 rounded-lg hover:bg-hover transition-all animate-slide-up" style={{ animationDelay: `${i * 0.05}s` }}>
                      <div className="flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full" style={{ background: `hsl(${i * 50}, 70%, 50%)` }} />
                        <span className="text-sm font-medium text-content">{d.name}</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="text-xs text-muted">{empCount} employees</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          <div className="dashboard-card">
            <div className="section-title">Salary Summary</div>
            {salaries.length === 0 ? (
              <p className="text-muted text-sm text-center py-6">No salary records yet</p>
            ) : (
              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 rounded-lg bg-hover">
                  <span className="text-sm text-content font-medium">Total Payroll</span>
                  <span className="text-sm font-bold text-content">{totalGross.toLocaleString()} RWF</span>
                </div>
                <div className="flex items-center justify-between p-3 rounded-lg bg-hover">
                  <span className="text-sm text-content font-medium">Total Deductions</span>
                  <span className="text-sm font-bold text-content">{totalDed.toLocaleString()} RWF</span>
                </div>
                <div className="flex items-center justify-between p-3 rounded-lg bg-hover">
                  <span className="text-sm text-content font-medium">Total Net Pay</span>
                  <span className="text-sm font-bold text-content">{totalNet.toLocaleString()} RWF</span>
                </div>
                <div className="flex items-center justify-between p-3 rounded-lg bg-hover">
                  <span className="text-sm text-content font-medium">Avg Gross / Employee</span>
                  <span className="text-sm font-bold text-content">
                    {employees.length > 0 ? Math.round(totalGross / employees.length).toLocaleString() : 0} RWF
                  </span>
                </div>
                <div className="flex items-center justify-between p-3 rounded-lg bg-hover">
                  <span className="text-sm text-content font-medium">Avg Net / Employee</span>
                  <span className="text-sm font-bold text-content">
                    {employees.length > 0 ? Math.round(totalNet / employees.length).toLocaleString() : 0} RWF
                  </span>
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="card">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold text-content">Recent Salary Records</h2>
          </div>
          {latestSalaries.length === 0 ? (
            <p className="text-muted text-sm py-4 text-center">No salary records yet. Click a stat card above to add one!</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-color">
                    <th className="text-left py-2 px-3 font-semibold text-content">Employee</th>
                    <th className="text-left py-2 px-3 font-semibold text-content">Gross</th>
                    <th className="text-left py-2 px-3 font-semibold text-content">Deduction</th>
                    <th className="text-left py-2 px-3 font-semibold text-content">Net</th>
                    <th className="text-left py-2 px-3 font-semibold text-content">Month</th>
                  </tr>
                </thead>
                <tbody>
                  {latestSalaries.map((s, index) => (
                    <tr key={s._id} className={`border-b border-color hover:bg-hover animate-slide-up`} style={{ animationDelay: `${index * 0.05}s` }}>
                      <td className="py-2 px-3 text-content font-medium">{getEmployeeName(s.employee)}</td>
                      <td className="py-2 px-3 text-content">{Number(s.grossSalary).toLocaleString()}</td>
                      <td className="py-2 px-3 text-content">{Number(s.totalDeduction).toLocaleString()}</td>
                      <td className="py-2 px-3 text-content">{Number(s.netSalary).toLocaleString()}</td>
                       <td className="py-2 px-3 text-content">{s.month ? (() => { const p = s.month.split("-"); return ["January","February","March","April","May","June","July","August","September","October","November","December"][parseInt(p[1],10)-1] || s.month; })() : s.month}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      <Modal show={showEmpModal} onClose={() => setShowEmpModal(false)} title="Quick Add Employee">
        <form onSubmit={handleAddEmp} className="space-y-3">
          <div className="flex flex-col sm:flex-row gap-3">
            <input className="input-field" placeholder="First Name" value={empForm.firstName} onChange={(e) => setEmpForm({ ...empForm, firstName: e.target.value })} required />
            <input className="input-field" placeholder="Last Name" value={empForm.lastName} onChange={(e) => setEmpForm({ ...empForm, lastName: e.target.value })} required />
          </div>
          <div className="flex flex-col sm:flex-row gap-3">
            <input className="input-field" type="email" placeholder="Email" value={empForm.email} onChange={(e) => setEmpForm({ ...empForm, email: e.target.value })} required />
            <select className="input-field" value={empForm.gender} onChange={(e) => setEmpForm({ ...empForm, gender: e.target.value })} required>
              <option value="">Gender</option>
              <option value="Male">Male</option>
              <option value="Female">Female</option>
              <option value="Other">Other</option>
            </select>
          </div>
          <div className="flex flex-col sm:flex-row gap-3">
            <input className="input-field" type={empForm.dobFocused ? "date" : "text"} placeholder="Date of Birth" value={empForm.dateOfBirth} onFocus={() => setEmpForm({ ...empForm, dobFocused: true })} onBlur={() => setEmpForm({ ...empForm, dobFocused: !!empForm.dateOfBirth })} onChange={(e) => setEmpForm({ ...empForm, dateOfBirth: e.target.value })} required />
            <input className="input-field" type={empForm.hireFocused ? "date" : "text"} placeholder="Hire Date" value={empForm.hireDate} onFocus={() => setEmpForm({ ...empForm, hireFocused: true })} onBlur={() => setEmpForm({ ...empForm, hireFocused: !!empForm.hireDate })} onChange={(e) => setEmpForm({ ...empForm, hireDate: e.target.value })} required />
          </div>
          <div className="flex flex-col sm:flex-row gap-3">
            <select className="input-field sm:w-1/3" value={empForm.telephoneCountryCode} onChange={(e) => {
              const newCode = e.target.value;
              setEmpForm({ ...empForm, telephoneCountryCode: newCode, telephone: newCode + empForm.telephoneNumber });
            }} required>
              {COUNTRY_CODES.map((c) => <option key={c.code} value={c.code}>{c.flag} {c.code}</option>)}
            </select>
            <input className="input-field sm:w-2/3" placeholder="Telephone Number" type="tel" value={empForm.telephoneNumber} onChange={(e) => {
              const num = e.target.value.replace(/\D/g, "");
              setEmpForm({ ...empForm, telephoneNumber: num, telephone: empForm.telephoneCountryCode + num });
            }} required />
          </div>
          <select className="input-field" value={empForm.address} onChange={(e) => setEmpForm({ ...empForm, address: e.target.value })} required>
            <option value="">Select Address</option>
            {ADDRESSES.map((a) => <option key={a} value={a}>{a}</option>)}
          </select>
          <select className="input-field" value={empForm.status} onChange={(e) => setEmpForm({ ...empForm, status: e.target.value })} required>
            <option value="">Status</option>
            {EMPLOYEE_STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
          </select>
          <select className="input-field" value={empForm.department} onChange={(e) => setEmpForm({ ...empForm, department: e.target.value })} required>
            <option value="">Select Department</option>
            {departments.map((d) => <option key={d._id} value={d._id}>{d.name}</option>)}
          </select>
          <select className="input-field" value={empForm.position} onChange={(e) => setEmpForm({ ...empForm, position: e.target.value })} required>
            <option value="">Select Position</option>
            {positions.map((p) => <option key={p._id} value={p._id}>{p.name}</option>)}
          </select>
          <div className="text-center"><button type="submit" className="btn">Add Employee</button></div>
        </form>
      </Modal>

      <Modal show={showDepModal} onClose={() => setShowDepModal(false)} title="Quick Add Department">
        <form onSubmit={handleAddDep} className="space-y-3">
          <select className="input-field" value={depForm.name} onChange={(e) => setDepForm({ ...depForm, name: e.target.value })} required>
            <option value="">Select Department Name</option>
            {DEPT_NAMES.map((n) => <option key={n} value={n}>{n}</option>)}
          </select>
          <div className="text-center"><button type="submit" className="btn">Add Department</button></div>
        </form>
      </Modal>

      <Modal show={showSalModal} onClose={() => setShowSalModal(false)} title="Quick Add Salary">
        <form onSubmit={handleAddSal} className="space-y-3">
          <select className="input-field" value={salForm.employee} onChange={(e) => setSalForm({ ...salForm, employee: e.target.value })} required>
            <option value="">Select Employee</option>
            {employees.map((emp) => <option key={emp._id} value={emp._id}>{emp.firstName} {emp.lastName}</option>)}
          </select>
          <div className="flex flex-col sm:flex-row gap-3">
            <input className="input-field" placeholder="Gross Salary" type="number" value={salForm.grossSalary} onChange={(e) => {
              const gross = Number(e.target.value);
              setSalForm({ ...salForm, grossSalary: gross, netSalary: gross - Number(salForm.totalDeduction || 0) });
            }} required />
            <input className="input-field" placeholder="Deduction" type="number" value={salForm.totalDeduction} onChange={(e) => {
              const ded = Number(e.target.value);
              setSalForm({ ...salForm, totalDeduction: ded, netSalary: Number(salForm.grossSalary || 0) - ded });
            }} required />
            <input className="input-field" placeholder="Net Salary" type="number" value={salForm.netSalary} readOnly />
          </div>
          <select className="input-field" value={salForm.month} onChange={(e) => setSalForm({ ...salForm, month: e.target.value })} required>
            <option value="">Select Month</option>
            {(() => {
              const MONTH_NAMES = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
              const year = new Date().getFullYear();
              return MONTH_NAMES.map((name, i) => {
                const m = String(i + 1).padStart(2, "0");
                return <option key={m} value={`${year}-${m}`}>{name}</option>;
              });
            })()}
          </select>
          <div className="text-center"><button type="submit" className="btn">Add Salary</button></div>
        </form>
      </Modal>
    </div>
  );
};

export default Dashboard;
