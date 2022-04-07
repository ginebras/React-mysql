import React from 'react';
import { Link } from 'react-router-dom';

var Navbar = () => {
  return (
    <>
      <nav className="navbar navbar-expand-sm bg-light navbar-dark">
        <ul className="navbar-nav">
          <li className="nav-item- m-1">
            <Link to="/" className="btn btn-light btn-outline-primary">
              Home
            </Link>
          </li>
          <li className="nav-item- m-1">
            <Link to="/employees" className="btn btn-light btn-outline-primary">
              Employees
            </Link>
          </li>
          <li className="nav-item- m-1">
            <Link to="/department" className="btn btn-light btn-outline-primary">
              Department
            </Link>
          </li>
        </ul>
      </nav>
    </>
  );
};

export default Navbar;