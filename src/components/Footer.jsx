import React from 'react'
import { NavLink } from "react-router-dom";

const Footer = () => {
  return (
     <div>
        <nav className="footer">  
            <div>   
                <NavLink  
                    to="/cookie-settings"
                    className="navlink-footer"
                >Cookie-inställningar</NavLink>
                <NavLink  
                    to="/about-cookies"
                    className="navlink-footer"
                >Om cookies</NavLink>
            </div>
            <p>FantasticG5 © 2025 </p>
        </nav>
        
    </div>
  )
}

export default Footer