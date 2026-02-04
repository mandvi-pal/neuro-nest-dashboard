import { Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';


import Home from './pages/Home';
import AddChild from './pages/AddChild';
import SmartScreening from './pages/SmartScreening';
import Results from './pages/Results';
import ResultsChart from './pages/ResultsChart';
import ParentDashboard from './pages/ParentDashboard';
import Interactive from './pages/Interactive'; // ✅ Directly renders games
import ParentFeedback from './components/SmartScreening/ParentFeedback'; // ✅ New feedback module

function App() {
  return (
    <>
      
      <Navbar />

      
      <Routes>
       
        <Route path="/" element={<Home />} />
        <Route path="/add-child" element={<AddChild />} />
        <Route path="/screening" element={<SmartScreening />} />
        <Route path="/results" element={<Results />} />
        <Route path="/analytics" element={<ResultsChart />} />
        <Route path="/parent-dashboard" element={<ParentDashboard />} />

        
        <Route path="/feedback" element={<ParentFeedback />} />

        
        <Route path="/games" element={<Interactive />} />
      </Routes>
    </>
  );
}

export default App;
