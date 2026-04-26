import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import Layout from './components/Layout';
import Landing from './pages/Landing';
import Dashboard from './pages/Dashboard';
import Courses from './pages/Courses';
import CourseDetail from './pages/CourseDetail';
import Quizzes from './pages/Quizzes';
import Leaderboard from './pages/Leaderboard';
import Progress from './pages/Progress';
import Profile from './pages/Profile';
import Resources from './pages/Resources';
import Certificates from './pages/Certificates';
import Help from './pages/Help';
import Admin from './pages/Admin';
import Login from './pages/Login';
import Register from './pages/Register';

// Shows landing for guests, dashboard for logged-in users
const HomeRoute = () => {
  const { user, loading } = useAuth();
  if (loading) return <div style={{ display:'flex',justifyContent:'center',alignItems:'center',height:'100vh' }}><div className="spinner" /></div>;
  if (!user) return <Landing />;
  if (user.role === 'admin') return <Navigate to="/admin" replace />;
  return <Navigate to="/dashboard" replace />;
};

const PrivateRoute = ({ children }) => {
  const { user, loading } = useAuth();
  if (loading) return <div style={{ display:'flex',justifyContent:'center',alignItems:'center',height:'100vh' }}><div className="spinner" /></div>;
  return user ? children : <Navigate to="/" replace />;
};

const StudentRoute = ({ children }) => {
  const { user, loading } = useAuth();
  if (loading) return null;
  if (!user) return <Navigate to="/" replace />;
  if (user.role === 'admin') return <Navigate to="/admin" replace />;
  return children;
};

const AdminRoute = ({ children }) => {
  const { user, loading } = useAuth();
  if (loading) return null;
  if (!user) return <Navigate to="/" replace />;
  if (user.role !== 'admin') return <Navigate to="/dashboard" replace />;
  return children;
};

const PublicOnlyRoute = ({ children }) => {
  const { user, loading } = useAuth();
  if (loading) return null;
  if (user) return <Navigate to={user.role === 'admin' ? '/admin' : '/dashboard'} replace />;
  return children;
};

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <Router>
          <Routes>
            {/* Public landing / home */}
            <Route path="/" element={<HomeRoute />} />

            {/* Auth pages — redirect if already logged in */}
            <Route path="/login" element={<PublicOnlyRoute><Login /></PublicOnlyRoute>} />
            <Route path="/register" element={<PublicOnlyRoute><Register /></PublicOnlyRoute>} />

            {/* Admin shell */}
            <Route path="/admin" element={<AdminRoute><Layout /></AdminRoute>}>
              <Route index element={<Admin />} />
            </Route>

            {/* Student shell — all nested under /dashboard prefix */}
            <Route path="/" element={<PrivateRoute><Layout /></PrivateRoute>}>
              <Route path="dashboard" element={<StudentRoute><Dashboard /></StudentRoute>} />
              <Route path="courses" element={<StudentRoute><Courses /></StudentRoute>} />
              <Route path="courses/:id" element={<StudentRoute><CourseDetail /></StudentRoute>} />
              <Route path="quizzes" element={<StudentRoute><Quizzes /></StudentRoute>} />
              <Route path="leaderboard" element={<StudentRoute><Leaderboard /></StudentRoute>} />
              <Route path="progress" element={<StudentRoute><Progress /></StudentRoute>} />
              <Route path="profile" element={<PrivateRoute><Profile /></PrivateRoute>} />
              <Route path="resources" element={<StudentRoute><Resources /></StudentRoute>} />
              <Route path="certificates" element={<StudentRoute><Certificates /></StudentRoute>} />
              <Route path="help" element={<StudentRoute><Help /></StudentRoute>} />
            </Route>

            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </Router>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
