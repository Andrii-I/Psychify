import React, { useState, useRef } from 'react';

import '../style/Navbar.css';


function Navbar(props) {
  const { loggedIn, username } = props;
  // console.log(props);
  const component = loggedIn
    ? (
      <nav className="profile">
        <a href="/profile" className="nav-item registration">{username}</a>
        {/* MODAL: <a href="#profile" className="nav-item registration">{username}</a> */}
      </nav>
    ) : (
      <>
        <a href="#login" className="nav-item">Login</a>
        <a href="#registration" className="nav-item signup">Sign Up</a>
      </>
    );
  const nav = useRef(null);

  function toggleNav() {
    if (nav.current.className === 'navbar') {
      nav.current.className += '-responsive';
    } else {
      nav.current.className = 'navbar';
    }
  }

  return (
    <div className="top-bar">
      <a className="homepage" href="/">Psychify</a>
      <nav className="navbar" ref={nav}>
        <button type="button" className="icon" onClick={() => toggleNav()}>
          <i className="fas fa-bars" />
        </button>
        <a className="nav-item" href="/forum">Forum</a>
        <a className="nav-item" href="/dsm">Index</a>
        {component}
      </nav>
    </div>
  );
}

export default Navbar;
