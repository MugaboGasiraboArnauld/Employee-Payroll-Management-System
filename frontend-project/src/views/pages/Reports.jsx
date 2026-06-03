import React, { useState, useEffect } from "react";
import { CSVLink } from "react-csv";
import { fetchReportData, fetchEmployeesOnLeave } from "../../controllers/reportController";

const Reports = () => {
  const [activeTab, setActiveTab] = useState("payroll");
  const [salaries, setSalaries] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [filterMonth, setFilterMonth] = useState("");
  const [filterDepartment, setFilterDepartment] = useState("");
  const [leaveReport, setLeaveReport] = useState(null);

  useEffect(() => { loadData(); }, []);

  const loadData = async () => {
    try {
      const data = await fetchReportData();
      setSalaries(data.salaries);
      setDepartments(data.departments);
    } catch (err) { console.error("Failed to load report data!"); }
  };

  const loadLeaveReport = async () => {
    try {
      const data = await fetchEmployeesOnLeave();
      setLeaveReport(data);
    } catch (err) { console.error("Failed to load leave report!"); }
  };

  useEffect(() => {
    if (activeTab === "leave") loadLeaveReport();
  }, [activeTab]);

  const getDepartmentName = (id) => {
    const dep = departments.find((d) => d._id === id);
    return dep ? dep.name : id;
  };

  const mappedPayroll = salaries.map((s) => {
    const emp = s.employee;
    const deptId = emp?.department?._id || "";
    return {
      _id: s._id,
      firstName: emp?.firstName || "",
      lastName: emp?.lastName || "",
      department: getDepartmentName(deptId),
      grossSalary: Number(s.grossSalary || 0),
      totalDeduction: Number(s.totalDeduction || 0),
      netSalary: Number(s.netSalary || 0),
      month: s.month,
    };
  });

  const filteredPayroll = mappedPayroll.filter((r) => {
    if (filterMonth && r.month !== filterMonth) return false;
    if (filterDepartment && r.department !== filterDepartment) return false;
    return true;
  });

  const MONTH_NAMES = ["January","February","March","April","May","June","July","August","September","October","November","December"];
  const getMonthLabel = (value) => {
    if (!value) return value;
    const parts = value.split("-");
    const idx = parseInt(parts[1], 10) - 1;
    return MONTH_NAMES[idx] || value;
  };
  const uniqueMonths = [...new Set(mappedPayroll.map((r) => r.month))].sort();
  const uniqueDepartments = [...new Set(mappedPayroll.map((r) => r.department))].sort();

  const totalGross = filteredPayroll.reduce((sum, r) => sum + r.grossSalary, 0);
  const totalDed = filteredPayroll.reduce((sum, r) => sum + r.totalDeduction, 0);
  const totalNet = filteredPayroll.reduce((sum, r) => sum + r.netSalary, 0);

  const csvHeaders = [
    { label: "First Name", key: "firstName" },
    { label: "Last Name", key: "lastName" },
    { label: "Department", key: "department" },
    { label: "Gross Salary", key: "grossSalary" },
    { label: "Total Deduction", key: "totalDeduction" },
    { label: "Net Salary", key: "netSalary" },
    { label: "Month", key: "month" },
  ];

  const leaveCsvHeaders = [
    { label: "Department", key: "department" },
    { label: "First Name", key: "firstName" },
    { label: "Last Name", key: "lastName" },
    { label: "Gender", key: "gender" },
    { label: "Email", key: "email" },
    { label: "Telephone", key: "telephone" },
    { label: "Position", key: "position" },
  ];

  const leaveCsvData = leaveReport
    ? leaveReport.departments.flatMap(d =>
        d.employees.map(e => ({ department: d.department, ...e }))
      )
    : [];

  return (
    <div className="bg-page p-4 md:p-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-6 animate-fade-in">
          <div>
            <h1 className="text-2xl font-bold text-content mb-1">Reports</h1>
            <p className="text-muted">View and export HR reports</p>
          </div>
        </div>

        <div className="flex gap-2 mb-6 no-print">
          <button className={`btn ${activeTab === "payroll" ? "ring-2 ring-blue-500" : ""}`} onClick={() => setActiveTab("payroll")}>Payroll Report</button>
          <button className={`btn ${activeTab === "leave" ? "ring-2 ring-blue-500" : ""}`} onClick={() => setActiveTab("leave")}>Employees on Leave</button>
        </div>

        {activeTab === "payroll" && (
          <>
            <div className="flex justify-end mb-4 no-print gap-2">
              <button onClick={() => window.print()} className="btn">Print</button>
              <CSVLink data={filteredPayroll} headers={csvHeaders} filename="payroll_report.csv" className="btn">Download CSV</CSVLink>
            </div>

            <div className="card mb-6 animate-fade-in no-print">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-content mb-1">Filter by Month</label>
                  <select className="input-field" value={filterMonth} onChange={(e) => setFilterMonth(e.target.value)}>
                    <option value="">All Months</option>
                    {uniqueMonths.map((m) => <option key={m} value={m}>{getMonthLabel(m)}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-content mb-1">Filter by Department</label>
                  <select className="input-field" value={filterDepartment} onChange={(e) => setFilterDepartment(e.target.value)}>
                    <option value="">All Departments</option>
                    {uniqueDepartments.map((d) => <option key={d} value={d}>{d}</option>)}
                  </select>
                </div>
                <div className="flex items-end">
                  <button className="btn" onClick={() => { setFilterMonth(""); setFilterDepartment(""); }}>Clear Filters</button>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
              <div className="dashboard-card animate-bounce-in" style={{ animationDelay: "0s" }}>
                <p className="stat-label">Filtered Records</p>
                <p className="stat-value">{filteredPayroll.length}</p>
              </div>
              <div className="dashboard-card animate-bounce-in" style={{ animationDelay: "0.06s" }}>
                <p className="stat-label">Total Gross (RWF)</p>
                <p className="stat-value">{totalGross.toLocaleString()}</p>
              </div>
              <div className="dashboard-card animate-bounce-in" style={{ animationDelay: "0.12s" }}>
                <p className="stat-label">Total Deductions (RWF)</p>
                <p className="stat-value">{totalDed.toLocaleString()}</p>
              </div>
              <div className="dashboard-card animate-bounce-in" style={{ animationDelay: "0.18s" }}>
                <p className="stat-label">Total Net (RWF)</p>
                <p className="stat-value">{totalNet.toLocaleString()}</p>
              </div>
            </div>

            <div className="card">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-bold text-content">
                  Employee Payroll Report
                  {filterMonth && <span className="text-sm font-normal text-muted ml-2">- {getMonthLabel(filterMonth)}</span>}
                </h2>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-color">
                      <th className="text-left py-3 px-4 font-semibold text-content">First Name</th>
                      <th className="text-left py-3 px-4 font-semibold text-content">Last Name</th>
                      <th className="text-left py-3 px-4 font-semibold text-content">Department</th>
                      <th className="text-left py-3 px-4 font-semibold text-content">Gross</th>
                      <th className="text-left py-3 px-4 font-semibold text-content">Deduction</th>
                      <th className="text-left py-3 px-4 font-semibold text-content">Net Salary</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredPayroll.length === 0 ? (
                      <tr><td colSpan="6" className="text-center py-8 text-muted">No records match the selected filters.</td></tr>
                    ) : (
                      filteredPayroll.map((r, index) => (
                        <tr key={r._id} className={`border-b border-color hover:bg-hover ${index % 2 === 0 ? 'bg-card' : 'bg-card-alt'} animate-slide-up`} style={{ animationDelay: `${index * 0.02}s` }}>
                          <td className="py-3 px-4 text-content">{r.firstName}</td>
                          <td className="py-3 px-4 text-content">{r.lastName}</td>
                          <td className="py-3 px-4 text-content">{r.department}</td>
                          <td className="py-3 px-4 text-content">{r.grossSalary.toLocaleString()}</td>
                          <td className="py-3 px-4 text-content">{r.totalDeduction.toLocaleString()}</td>
                          <td className="py-3 px-4 font-medium text-content">{r.netSalary.toLocaleString()}</td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </>
        )}

        {activeTab === "leave" && (
          <>
            <div className="flex justify-end mb-4 no-print gap-2">
              <button onClick={() => window.print()} className="btn">Print</button>
              <CSVLink data={leaveCsvData} headers={leaveCsvHeaders} filename="employees_on_leave.csv" className="btn">Download CSV</CSVLink>
            </div>

            {leaveReport && (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-6">
                  <div className="dashboard-card animate-bounce-in" style={{ animationDelay: "0s" }}>
                    <p className="stat-label">Total Employees on Leave</p>
                    <p className="stat-value">{leaveReport.total}</p>
                  </div>
                  <div className="dashboard-card animate-bounce-in" style={{ animationDelay: "0.06s" }}>
                    <p className="stat-label">Departments Affected</p>
                    <p className="stat-value">{leaveReport.departments.length}</p>
                  </div>
                </div>

                {leaveReport.departments.map((dept, di) => (
                  <div key={di} className="card mb-4 animate-slide-up" style={{ animationDelay: `${di * 0.05}s` }}>
                    <div className="flex items-center justify-between mb-3">
                      <h3 className="text-lg font-bold text-content">{dept.department}</h3>
                      <span className="text-sm text-muted">{dept.count} employee(s) on leave</span>
                    </div>
                    <div className="overflow-x-auto">
                      <table className="w-full">
                        <thead>
                          <tr className="border-b border-color">
                            <th className="text-left py-2 px-3 font-semibold text-content">First Name</th>
                            <th className="text-left py-2 px-3 font-semibold text-content">Last Name</th>
                            <th className="text-left py-2 px-3 font-semibold text-content">Gender</th>
                            <th className="text-left py-2 px-3 font-semibold text-content">Email</th>
                            <th className="text-left py-2 px-3 font-semibold text-content">Telephone</th>
                            <th className="text-left py-2 px-3 font-semibold text-content">Position</th>
                          </tr>
                        </thead>
                        <tbody>
                          {dept.employees.map((e, ei) => (
                            <tr key={ei} className={`border-b border-color hover:bg-hover ${ei % 2 === 0 ? 'bg-card' : 'bg-card-alt'}`}>
                              <td className="py-2 px-3 text-content">{e.firstName}</td>
                              <td className="py-2 px-3 text-content">{e.lastName}</td>
                              <td className="py-2 px-3 text-content">{e.gender}</td>
                              <td className="py-2 px-3 text-content">{e.email}</td>
                              <td className="py-2 px-3 text-content">{e.telephone}</td>
                              <td className="py-2 px-3 text-content">{e.position}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                ))}
              </>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default Reports;
