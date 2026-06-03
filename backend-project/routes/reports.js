const express = require('express');
const router = express.Router();
const Employee = require('../models/Employee');
const Department = require('../models/Department');
const Salary = require('../models/Salary');
const requireAuth = require('../middleware/authMiddleware');

router.get('/monthly-payroll/:month', requireAuth, async (req, res) => {
  try {
    const { month } = req.params;
    const salaries = await Salary.find({ month });
    const payrollData = await Promise.all(salaries.map(async (salary) => {
      const employee = await Employee.findById(salary.employee).populate('department');
      return {
        firstName: employee?.firstName || '',
        lastName: employee?.lastName || '',
        department: employee?.department?.name || '',
        netSalary: salary.netSalary,
        month: salary.month
      };
    }));
    res.json(payrollData);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.get('/employees-on-leave', requireAuth, async (req, res) => {
  try {
    const employees = await Employee.find({ status: 'on leave' }).populate('department').populate('position');
    const grouped = {};
    for (const emp of employees) {
      const deptName = emp.department?.name || 'No Department';
      if (!grouped[deptName]) grouped[deptName] = [];
      grouped[deptName].push(emp);
    }
    res.json({
      total: employees.length,
      departments: Object.keys(grouped).map(name => ({
        department: name,
        count: grouped[name].length,
        employees: grouped[name].map(e => ({
          firstName: e.firstName,
          lastName: e.lastName,
          gender: e.gender,
          telephone: e.telephone,
          email: e.email,
          position: e.position?.name || ''
        }))
      }))
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
