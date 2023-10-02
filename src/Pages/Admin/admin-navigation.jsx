import LogoutButton from "../../Components/buttons";
import { Routes, Route, Link } from "react-router-dom";
import React, { useState, useRef } from "react";
import OutsideClickListener from "../../Components/event-listeners";
import { AdminPropertyContent } from "./property-content";
import { AdminPropertySettings } from "./property-settings";
import { AdminPropertyOverview } from "./property-overview";
//Här har jag min navigerings funktion där jag använder Routing för att navigera mellan olika sidor.
// Här hanterar jag även “dropdown” menyns synlighet och använder en OutsideClickListener som finns i alla komponenter.
export function AdminNavigation({ Logout }) {
  const [dropdownVisible, setDropdownVisible] = useState(false);
  const dropdownRef = useRef(null);

  const toggleDropdown = () => {
    setDropdownVisible(!dropdownVisible);
  };

  const handleLinkClick = () => {
    setDropdownVisible(false);
  };

  const handleOutsideClick = () => {
    setDropdownVisible(false);
  };

  return (
    <div className="AdminNavigationContainer">
      <OutsideClickListener onOutsideClick={handleOutsideClick}>
        <nav className="AdminNavigation">
          <div className="LogoutButton">
            {Logout && <LogoutButton Logout={Logout} />}
          </div>

          <div className="AdminNavigationContent">
            <div className="Dropdown" ref={dropdownRef}>
              <button className="NavigationLink" onClick={toggleDropdown}>
                PROPERTY
              </button>

              <div
                className={`DropdownMenu ${dropdownVisible ? "visible" : ""}`}
              >
                <div className="DropdownLinkContainer">
                  <Link
                    className="DropdownLink"
                    to="/Overview"
                    onClick={handleLinkClick}
                  >
                    Overview
                  </Link>
                </div>

                <div className="DropdownLinkContainer">
                  <Link
                    className="DropdownLink"
                    to="/PropertyContent"
                    onClick={handleLinkClick}
                  >
                    Content
                  </Link>
                </div>

                <div className="DropdownLinkContainer">
                  <Link
                    className="DropdownLink"
                    to="/PropertySettings"
                    onClick={handleLinkClick}
                  >
                    Settings
                  </Link>
                </div>
              </div>
              {/*DropdownMenu*/}
            </div>
            {/*Dropdown*/}

            <div className="Dropdown">
              <button className="NavigationLink"> REVENUE </button>
            </div>

            <div className="Dropdown">
              <button className="NavigationLink"> FINANCIAL </button>
            </div>

            <div className="Dropdown">
              <button className="NavigationLink"> ADVANCED </button>
            </div>

            <div className="Dropdown">
              <button className="NavigationLink"> MISCELLANIOUS </button>
            </div>
          </div>
          {/*AdminNavigationContent*/}
        </nav>
        {/*AdminNavigation*/}
      </OutsideClickListener>
      <Routes>
        <Route path="/Overview" element={<AdminPropertyOverview />} />
        <Route path="/PropertyContent" element={<AdminPropertyContent />} />
        <Route path="/PropertySettings" element={<AdminPropertySettings />} />
      </Routes>
    </div>
  );
}
