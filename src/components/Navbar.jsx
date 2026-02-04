import { Link } from 'react-router-dom';

function Navbar() {
  return (
    <nav>
      <Link to="/">Home</Link>
      <Link to="/add-child">Add Child</Link>
      <Link to="/parent-dashboard">Parent Dashboard</Link> {/* ✅ NEW */}
      {/* Add other links as needed */}
    </nav>
  );
}

export default Navbar;
