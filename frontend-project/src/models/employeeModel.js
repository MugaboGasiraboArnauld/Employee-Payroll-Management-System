export const EMPLOYEE_STATUSES = [
  "on leave", "left", "blacklisted", "deceased", "on mission"
];

export const ADDRESSES = [
  "Kigali, Rwanda", "Kicukiro, Kigali", "Nyarugenge, Kigali",
  "Gasabo, Kigali", "Huye, Southern Province", "Muhanga, Southern Province",
  "Rubavu, Western Province", "Musanze, Northern Province", "Other",
];

export const COUNTRY_CODES = [
  { code: "+250", flag: "\uD83C\uDDF7\uD83C\uDDFC" },
  { code: "+256", flag: "\uD83C\uDDFA\uD83C\uDDEC" },
  { code: "+254", flag: "\uD83C\uDDF0\uD83C\uDDEA" },
  { code: "+255", flag: "\uD83C\uDDF9\uD83C\uDDFF" },
  { code: "+257", flag: "\uD83C\uDDE7\uD83C\uDDE9" },
  { code: "+243", flag: "\uD83C\uDDE8\uD83C\uDDE9" },
  { code: "+27", flag: "\uD83C\uDDFF\uD83C\uDDE6" },
  { code: "+1", flag: "\uD83C\uDDFA\uD83C\uDDF8" },
  { code: "+44", flag: "\uD83C\uDDEC\uD83C\uDDE7" },
  { code: "+33", flag: "\uD83C\uDDEB\uD83C\uDDF7" },
  { code: "+49", flag: "\uD83C\uDDE9\uD83C\uDDEA" },
  { code: "+91", flag: "\uD83C\uDDEE\uD83C\uDDF3" },
  { code: "+86", flag: "\uD83C\uDDE8\uD83C\uDDF3" },
  { code: "+81", flag: "\uD83C\uDDEF\uD83C\uDDF5" },
  { code: "+61", flag: "\uD83C\uDDE6\uD83C\uDDFA" },
  { code: "+55", flag: "\uD83C\uDDE7\uD83C\uDDF7" },
  { code: "+52", flag: "\uD83C\uDDF2\uD83C\uDDFD" },
  { code: "+234", flag: "\uD83C\uDDF3\uD83C\uDDEC" },
  { code: "+233", flag: "\uD83C\uDDEC\uD83C\uDDED" },
  { code: "+20", flag: "\uD83C\uDDEA\uD83C\uDDEC" },
];

export const initEmployeeForm = {
  firstName: "",
  lastName: "",
  gender: "",
  dateOfBirth: "",
  dobFocused: false,
  email: "",
  telephone: "",
  telephoneCountryCode: "+250",
  telephoneNumber: "",
  address: "",
  hireDate: "",
  hireFocused: false,
  status: "on leave",
  department: "",
  position: "",
};
