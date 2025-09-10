import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import Login from "./Login";
import Booking from "./Booking";
import AdminDashboard from "./AdminDashboard";
import AddData from "./AddData";
import DeleteData from "./DeleteData";
import ChangePassword from "./ChangePassword";
import "./App.css";
import "./index.css";

// Admin route protection
function PrivateRoute({ children }) {
  const isAdmin = !!localStorage.getItem("adminName");
  return isAdmin ? children : <Navigate to="/" />;
}

export default function App() {
  return (
    <Routes>
      {/* Login as default page */}
      <Route path="/" element={<Login />} />
      {/* Student/Faculty user route */}
      <Route path="/booking" element={<Booking />} />
      {/* Admin pages - protected */}
      <Route
        path="/admin-dashboard"
        element={
          <PrivateRoute>
            <AdminDashboard />
          </PrivateRoute>
        }
      />
      <Route
        path="/add-data"
        element={
          <PrivateRoute>
            <AddData />
          </PrivateRoute>
        }
      />
      <Route
        path="/delete-data"
        element={
          <PrivateRoute>
            <DeleteData />
          </PrivateRoute>
        }
      />
      <Route
        path="/change-password"
        element={
          <PrivateRoute>
            <ChangePassword />
          </PrivateRoute>
        }
      />
      {/* Redirect any unmatched route to login */}
      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  );
}
