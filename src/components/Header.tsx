
import { useAuth } from "../contexts/AuthContext";
import { Button } from "./ui/button";
import { useNavigate } from "react-router-dom";

export function Header() {
  const { isLoggedIn, username, logout } = useAuth();
  const navigate = useNavigate();
  
  const handleLoginClick = () => {
    navigate("/login");
  };
  
  const handleLogoutClick = () => {
    logout();
    navigate("/");
  };
  
  return (
    <header className="bg-brand-navy text-white py-4 px-6 shadow-md">
      <div className="container mx-auto flex justify-between items-center">
        <div className="flex items-center gap-2">
          <h1 
            className="text-2xl font-bold cursor-pointer" 
            onClick={() => navigate("/")}
          >
            <span className="text-brand-gold">BD</span> Business Rankings
          </h1>
        </div>
        <div className="flex items-center gap-4">
          {isLoggedIn ? (
            <div className="flex items-center gap-4">
              <span className="hidden md:inline-block">Welcome, {username}</span>
              <Button 
                variant="outline" 
                onClick={handleLogoutClick}
                className="text-white border-white hover:bg-white hover:text-brand-navy"
              >
                Logout
              </Button>
            </div>
          ) : (
            <Button 
              variant="outline" 
              onClick={handleLoginClick}
              className="text-white border-white hover:bg-white hover:text-brand-navy"
            >
              Admin Login
            </Button>
          )}
        </div>
      </div>
    </header>
  );
}
