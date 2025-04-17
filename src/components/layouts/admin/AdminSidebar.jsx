import React from 'react'
import { Outlet, Link, useLocation } from 'react-router-dom'
import { AdminNavbar } from './AdminNavbar'
import { getUserId } from '../../../utils/auth'

export const AdminSidebar = () => {
  const location = useLocation();
  const userId = getUserId();

  const isActive = (path) => {
    return location.pathname === path;
  };

  return (
    <>
      <AdminNavbar/>
      <aside
        className="app-sidebar bg-body-secondary shadow"
        data-bs-theme="dark"
      >
        <div className="sidebar-brand">
          <Link to="/user/profile" className="brand-link">
            <span className="brand-text fw-light">User Dashboard</span>
          </Link>
        </div>

        <div
          className=""
          data-overlayscrollbars-viewport="scrollbarHidden overflowXHidden overflowYScroll"
          tabIndex={-1}
          style={{
            marginRight: "-16px",
            marginBottom: "-16px",
            marginLeft: 0,
            top: "-8px",
            right: "auto",
            left: "-8px",
            width: "calc(100% + 16px)",
            padding: 8,
          }}
        >
          <nav className="mt-2">
            <ul
              className="nav sidebar-menu flex-column"
              data-lte-toggle="treeview"
              role="menu"
              data-accordion="false"
            >
              <li className="nav-item">
                <Link 
                  to="/user/profile" 
                  className={`nav-link ${isActive('/user/profile') ? 'active' : ''}`}
                >
                  <i className="nav-icon bi bi-person" />
                  <p>Profile</p>
                </Link>
              </li>
              <li className="nav-item">
                <Link 
                  to="/user/settings" 
                  className={`nav-link ${isActive('/user/settings') ? 'active' : ''}`}
                >
                  <i className="nav-icon bi bi-gear" />
                  <p>Settings</p>
                </Link>
              </li>
              <li className="nav-item">
                <Link 
                  to="/user/notifications" 
                  className={`nav-link ${isActive('/user/notifications') ? 'active' : ''}`}
                >
                  <i className="nav-icon bi bi-bell" />
                  <p>Notifications</p>
                </Link>
              </li>
              <li className="nav-item">
                <Link 
                  to="/user/security" 
                  className={`nav-link ${isActive('/user/security') ? 'active' : ''}`}
                >
                  <i className="nav-icon bi bi-shield-lock" />
                  <p>Security</p>
                </Link>
              </li>
            </ul>
          </nav>
        </div>
      </aside>
      <main className="app-main">
        <Outlet />
      </main>
    </>
  )
}
