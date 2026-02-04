import { useState, useEffect } from 'react';
import axios from 'axios';

function AddChild() {
  const [children, setChildren] = useState([]);
  const [name, setName] = useState('');
  const [dob, setDob] = useState('');
  const [gender, setGender] = useState('Male');

  // Future dates block karne ke liye logic
  const today = new Date().toISOString().split('T')[0];

  // 🧮 DOB se total months calculate karne ka function
  const calculateAgeMonths = (birthDate) => {
    if (!birthDate) return 0;
    const birth = new Date(birthDate);
    const now = new Date();
    
    let months = (now.getFullYear() - birth.getFullYear()) * 12;
    months += now.getMonth() - birth.getMonth();
    
    // Agar current date birth date se pehle ki hai mahine mein, toh 1 month minus karein
    if (now.getDate() < birth.getDate()) {
      months--;
    }
    
    return months <= 0 ? 0 : months;
  };

  useEffect(() => {
    axios.get(`${import.meta.env.VITE_API_URL}/api/children`)
      .then(res => {
        if (Array.isArray(res.data)) {
          setChildren(res.data);
        }
      })
      .catch(err => console.error('❌ Error fetching children:', err));
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!name.trim() || !dob || !gender) {
      alert('Please fill all fields correctly.');
      return;
    }

    // Age calculate ho rahi hai backend bhejne se pehle
    const ageInMonths = calculateAgeMonths(dob);

    const payload = { 
      name: name.trim(), 
      dob, 
      gender,
      age_months: ageInMonths // ✅ Yeh ab report mein 'null' ko theek karega
    };

    try {
      const res = await axios.post(`${import.meta.env.VITE_API_URL}/api/children`, payload);
      
      if (res.data?.child || res.status === 201 || res.status === 200) {
        alert('Child profile created successfully!');
        // Reset Form
        setName('');
        setDob('');
        setGender('Male');
      }
    } catch (err) {
      console.error('❌ Error adding child:', err.response?.data || err.message);
      alert(err.response?.data?.error || 'Failed to add child');
    }
  };

  return (
    <div className="form-card" style={{ 
      padding: '2rem', 
      maxWidth: '450px', 
      margin: '40px auto', 
      boxShadow: '0 10px 25px rgba(0,0,0,0.1)', 
      borderRadius: '15px', 
      backgroundColor: '#fff' 
    }}>
      <h2 style={{ textAlign: 'center', marginBottom: '1.5rem', color: '#2c3e50', fontSize: '1.8rem' }}>
        👶 Add Child Profile
      </h2>
      
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.2rem' }}>
        
        {/* Name Input */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          <label style={{ fontWeight: '600', color: '#555' }}>Full Name</label>
          <input
            type="text"
            placeholder="Enter child's name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            style={{ padding: '12px', borderRadius: '8px', border: '1px solid #ddd', fontSize: '1rem' }}
            required
          />
        </div>

        {/* DOB Input */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          <label style={{ fontWeight: '600', color: '#555' }}>Date of Birth</label>
          <input
            type="date"
            value={dob}
            max={today}
            onChange={(e) => setDob(e.target.value)}
            style={{ padding: '12px', borderRadius: '8px', border: '1px solid #ddd', fontSize: '1rem' }}
            required
          />
          {dob && (
            <small style={{ color: '#27ae60', fontWeight: '500' }}>
              Calculated Age: {calculateAgeMonths(dob)} Months
            </small>
          )}
        </div>

        {/* Gender Selection */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          <label style={{ fontWeight: '600', color: '#555' }}>Gender</label>
          <select 
            value={gender} 
            onChange={(e) => setGender(e.target.value)}
            style={{ padding: '12px', borderRadius: '8px', border: '1px solid #ddd', fontSize: '1rem', backgroundColor: '#fff' }}
          >
            <option value="Male">Male</option>
            <option value="Female">Female</option>
            <option value="Other">Other</option>
          </select>
        </div>

        {/* Submit Button */}
        <button type="submit" style={{ 
          backgroundColor: '#4CAF50', 
          color: '#fff', 
          padding: '14px', 
          border: 'none', 
          borderRadius: '8px',
          fontWeight: 'bold',
          fontSize: '1.1rem',
          cursor: 'pointer',
          marginTop: '10px',
          boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
          transition: 'all 0.3s ease'
        }}>
          🚀 Create Profile
        </button>
      </form>
    </div>
  );
}

export default AddChild;