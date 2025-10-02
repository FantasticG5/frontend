// src/components/Navbar.jsx
import React from 'react'
import { NavLink, useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCircleUser } from "@fortawesome/free-regular-svg-icons";
import { faPersonWalking } from "@fortawesome/free-solid-svg-icons";
import { useAuth } from "../components/auth/authProvider";

const Navbar = () => {
  const navigate = useNavigate();
  const { isAuthenticated, user, loading, logout } = useAuth();

  const handleProfileClick = () => navigate('/login');

  const handleLogoutClick = async () => {
    try {
      await logout();
      navigate("/login");
    } catch (err) {
      console.error("Logout failed:", err);
    }
  };

  return (
    <div>
      <nav className="navbar">
        <div>
          <NavLink to="/" className={({ isActive }) => isActive ? "active-link" : "navlink"}>Start</NavLink>
          <NavLink to="/sessions" className={({ isActive }) => isActive ? "active-link" : "navlink"}>Träningspass</NavLink>
          <NavLink to="/bookings" className={({ isActive }) => isActive ? "active-link" : "navlink"}>Mina bokningar</NavLink>
        </div>

        <div>
          {/* Visa inget medan auth-status laddas (valfritt) */}
          {loading ? null : (
            isAuthenticated ? (
              <div className="nav-auth">
                <span className="nav-user">
                  <FontAwesomeIcon icon={faCircleUser} aria-hidden="true" />
                  <span style={{ marginLeft: 8 }}>
                    {user?.userName ?? user?.email ?? "Inloggad"}
                  </span>
                </span>
                <button className="logout-button" onClick={handleLogoutClick}>
                  <p>Logga ut</p>
                  <FontAwesomeIcon icon={faPersonWalking} aria-hidden="true" />
                </button>
              </div>
            ) : (
              <button className="profile-button" onClick={handleProfileClick}>
                <p>Logga in</p>
                <FontAwesomeIcon icon={faPersonWalking} aria-hidden="true" />
              </button>
            )
          )}
        </div>
      </nav>
    </div>
  );
}

export default Navbar;
