import { useNavigate } from "react-router-dom";
import { useAuth } from "../AuthContext";

export default function useLogout() {
  const navigate = useNavigate();
  const { logout } = useAuth();

  const handleLogout = async () => {
    const accessToken = localStorage.getItem("access_token");
    const response = await fetch("http://localhost:8080/logout", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
    });

    if (response.ok) {
      localStorage.removeItem("access_token");
      localStorage.removeItem("refresh_token");
      logout();
      navigate("/Login");
    } else {
      console.log("Logout failed");
    }
  };

  return handleLogout;
}
