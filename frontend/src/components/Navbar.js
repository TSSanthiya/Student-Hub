import React from "react";
import { Link } from "react-router-dom";
import "./Navbar.css";

const Navbar = ({ userRole }) => {
  return (
    <nav className="navbar">
      <Link to="/home">Home</Link>
      <Link to="/about">About Us</Link>
      <Link to="/dashboard">Dashboard</Link> {/* Dynamic dashboard */}
    </nav>
  );
};
export default Navbar;