import { Navigate, Route, Routes } from 'react-router-dom';
import AdminRoute from './components/auth/AdminRoute';
import ProtectedRoute from './components/auth/ProtectedRoute';
import Layout from './components/layout/Layout';
import AdminPage from './pages/AdminPage';
import DashboardPage from './pages/DashboardPage';
import LoginPage from './pages/LoginPage';
import PatientDetailPage from './pages/PatientDetailPage';
import PatientRegistrationPage from './pages/PatientRegistrationPage';
import PatientsHistoryPage from './pages/PatientsHistoryPage';
import PredictionResultPage from './pages/PredictionResultPage';
import SymptomsEntryPage from './pages/SymptomsEntryPage';

function App() {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />

      <Route
        path="/"
        element={
          <ProtectedRoute>
            <Layout />
          </ProtectedRoute>
        }
      >
        <Route index element={<Navigate to="/dashboard" replace />} />
        <Route path="dashboard" element={<DashboardPage />} />
        <Route path="patients/new" element={<PatientRegistrationPage />} />
        <Route path="symptoms" element={<SymptomsEntryPage />} />
        <Route path="predictions/result" element={<PredictionResultPage />} />
        <Route path="history" element={<PatientsHistoryPage />} />
        <Route path="patients/:patientId" element={<PatientDetailPage />} />
        <Route
          path="admin"
          element={
            <AdminRoute>
              <AdminPage />
            </AdminRoute>
          }
        />
      </Route>

      <Route path="*" element={<Navigate to="/dashboard" replace />} />
    </Routes>
  );
}

export default App;
