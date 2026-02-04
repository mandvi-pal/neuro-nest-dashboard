
const calculateAgeInMonths = (dob) => {
  const birthDate = new Date(dob);
  const today = new Date();

  let years = today.getFullYear() - birthDate.getFullYear();
  let months = today.getMonth() - birthDate.getMonth();

  if (today.getDate() < birthDate.getDate()) {
    months--;
  }

  if (months < 0) {
    years--;
    months += 12;
  }

  return years * 12 + months;
};

const calculateAgeReadable = (dob) => {
  if (!dob || isNaN(new Date(dob))) return "Age not available";

  const birthDate = new Date(dob);
  const today = new Date();

  if (birthDate > today) return "DOB is in the future";

  let years = today.getFullYear() - birthDate.getFullYear();
  let months = today.getMonth() - birthDate.getMonth();
  let days = today.getDate() - birthDate.getDate();

  if (days < 0) {
    months--;
    days += new Date(today.getFullYear(), today.getMonth(), 0).getDate();
  }

  if (months < 0) {
    years--;
    months += 12;
  }

  return `${years} years ${months} months`;
};

module.exports = { calculateAgeInMonths, calculateAgeReadable };
