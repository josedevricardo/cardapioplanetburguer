import React from "react";
import { Navigate } from "react-router-dom";

export default function PrivateRoute({ children }) {
const isLogged = localStorage.getItem("adminLogado") === "true";

if (!isLogged) {
return <Navigate to="/login-admin" replace />;
}

return children;
}
