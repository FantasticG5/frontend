import React from 'react'
import { NavLink } from "react-router-dom";

const Navbar = () => {
  return (
    <div>
        <nav className="navbar">
            <NavLink  
                to="/"
                className={({ isActive }) => isActive ? "active-link" : "navlink"}
            >Start</NavLink>
            <NavLink  
                to="/sessions"
                className={({ isActive }) => isActive ? "active-link" : "navlink"}
            >Träningspass</NavLink>
            <NavLink  
                to="/bookings"
                className={({ isActive }) => isActive ? "active-link" : "navlink"}
            >Mina bokningar</NavLink>
                   <NavLink  
                       to="/cookie-settings"
                       className={({ isActive }) => isActive ? "active-link" : "navlink"}
                   >Cookie-inställningar</NavLink>
                   <NavLink  
                       to="/about-cookies"
                       className={({ isActive }) => isActive ? "active-link" : "navlink"}
                   >Om cookies</NavLink>
        </nav>
    </div>
  )
}

export default Navbar