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
        </nav>
    </div>
  )
}

export default Navbar