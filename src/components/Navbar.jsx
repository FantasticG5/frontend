import React from 'react'
import { NavLink, useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCircleUser } from "@fortawesome/free-regular-svg-icons";
import {faPersonWalking } from "@fortawesome/free-solid-svg-icons";

const Navbar = () => {
  const navigate = useNavigate();

  const handleProfileClick = () => {
    navigate('/login');
  };

  return (
    <div>
        <nav className="navbar">
           <div>
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
            </div>
            <div>
                <button className="profile-button" onClick={handleProfileClick}>
                    <FontAwesomeIcon icon={faPersonWalking} alt-text="Profile" />
                </button>
            </div>
        </nav>
        
    </div>
  )
}

export default Navbar