import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Home from './pages/Home';
import Login from './pages/Login';
import Signup from './pages/Signup';
import BookingForm from './pages/BookingForm';
import BookingList from './pages/BookingList';
import AdminDashboard from './pages/AdminDashboard';
import './App.css';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/booking/:movieId" element={<BookingForm />} />
        <Route path="/my-bookings" element={<BookingList />} />
        <Route path="/admin-dashboard" element={<AdminDashboard />} />
        <Route path="/footer" element={<footer />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}

export default App;
