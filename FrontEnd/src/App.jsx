import { BrowserRouter, Routes, Route } from "react-router-dom";

import Login from "./pages/auth/LoginPage.jsx";
import Signup from "./pages/auth/SignupPage.jsx";

import Dashboard from "./pages/dashboard/Dashboard.jsx";
import CreateTicket from "./pages/dashboard/CreateTicket.jsx";
import TicketLists from "./pages/dashboard/TicketLists.jsx";
import ReportPage from "./pages/dashboard/Reports.jsx";
import SettingsPage from "./pages/dashboard/Settings.jsx";
import TicketDetails from "./pages/dashboard/TicketDetails.jsx";

import Unauthorized from "./pages/auth/Unauthorized.jsx";
import ProtectedRoute from "./components/auth/ProtectedRoute.jsx";

import ForgotPasswordPage from "./pages/auth/ForgotPasswordPage.jsx";
import ReportsPage from "./pages/dashboard/Reports.jsx";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public */}
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />

        <Route path="/forgotpassword" element={<ForgotPasswordPage/>} />

        {/* Dashboard – all roles */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute allowedRoles={["customer", "agent", "admin"]}>
              <Dashboard />
            </ProtectedRoute>
          }
        />

        {/* Create Ticket – customer only */}
        <Route
          path="/createticket"
          element={
            <ProtectedRoute allowedRoles={["customer"]}>
              <CreateTicket />
            </ProtectedRoute>
          }
        />

        {/* Ticket List – all roles */}
        <Route
          path="/ticketlists"
          element={
            <ProtectedRoute allowedRoles={["customer", "agent", "admin"]}>
              <TicketLists />
            </ProtectedRoute>
          }
        />

        {/* Ticket Details – all roles */}
        <Route
          path="/tickets/:id"
          element={
            <ProtectedRoute allowedRoles={["customer", "agent", "admin"]}>
              <TicketDetails />
            </ProtectedRoute>
          }
        />

        {/* Reports – agent & admin */}
        <Route
          path="/reports"
          element={
            <ProtectedRoute allowedRoles={["agent", "admin"]}>
              <ReportPage />
            </ProtectedRoute>
          }
        />

        {/* Settings – admin only */}
        <Route
          path="/settings"
          element={
            <ProtectedRoute allowedRoles={["customer", "agent", "admin"]}>
              <SettingsPage />
            </ProtectedRoute>
          }
        />

        <Route path="/unauthorized" element={<Unauthorized />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
