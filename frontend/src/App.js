import "./App.css";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import TextFields from "./pages/Log";
import Register from "./pages/Reg";
import Home from "./pages/Home";
import Cart from "./pages/Cart";
import AdminLog from "./pages/AdminLogin";
import Admin from "./pages/Admin";
import AdminRegister from "./pages/AdminRegister";
import RegisteredUsers from "./pages/RegisteredUsers";
import Products from "./pages/Products";
import UserProtectedRoute from "./components/UserProtectedRoute";
import AdminProtectedRoute from "./components/AdminProtectedRoute";
import { AuthProvider } from "./AuthContext";

export default function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<TextFields />} />
          <Route path="/home" element={<UserProtectedRoute element={Home} />} />
          <Route path="/cart" element={<UserProtectedRoute element={Cart} />} />
          <Route path="/adminLogin" element={<AdminLog />} />
          <Route
            path="/adminPage"
            element={<AdminProtectedRoute element={Admin} />}
          />
          <Route
            path="/adminRegister"
            element={<AdminProtectedRoute element={AdminRegister} />}
          />
          <Route
            path="/registeredUsers"
            element={<AdminProtectedRoute element={RegisteredUsers} />}
          />
          <Route
            path="/products"
            element={<AdminProtectedRoute element={Products} />}
          />
        </Routes>
      </Router>
    </AuthProvider>
  );
}
