import React from 'react'
import { NavLink } from "react-router-dom";

const Navbar = () => {
  return (
    <div>
        <nav className="navbar">
            <NavLink  
                to="/"
                className={({ isActive }) => isActive ? "active-link" : ""}
            >Start</NavLink>
            <NavLink  
                to="/sessions"
                className={({ isActive }) => isActive ? "active-link" : ""}
            >Träningspass</NavLink>
            <NavLink  
                to="/bookings"
                className={({ isActive }) => isActive ? "active-link" : ""}
            >Mina bokningar</NavLink>
        </nav>
    </div>
  )
}

export default Navbar