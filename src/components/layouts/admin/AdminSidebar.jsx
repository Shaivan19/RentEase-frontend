import React from 'react'
import { Outlet, Link, useLocation } from 'react-router-dom'
import { AdminNavbar } from './AdminNavbar'
import { getAdminId } from '../../../utils/adminAuth'

export const AdminSidebar = () => {
  const location = useLocation();
  const adminId = getAdminId();

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
          <Link to="/admin/dashboard" className="brand-link">
            <span className="brand-text fw-light">Admin Dashboard</span>
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
                  to="/admin/dashboard" 
                  className={`nav-link ${isActive('/admin/dashboard') ? 'active' : ''}`}
                >
                  <i className="nav-icon bi bi-speedometer2" />
                  <p>Dashboard</p>
                </Link>
              </li>
              <li className="nav-item">
                <Link 
                  to="/admin/users" 
                  className={`nav-link ${isActive('/admin/users') ? 'active' : ''}`}
                >
                  <i className="nav-icon bi bi-people" />
                  <p>Users</p>
                </Link>
              </li>
              <li className="nav-item">
                <Link 
                  to="/admin/properties" 
                  className={`nav-link ${isActive('/admin/properties') ? 'active' : ''}`}
                >
                  <i className="nav-icon bi bi-house" />
                  <p>Properties</p>
                </Link>
              </li>
              <li className="nav-item">
                <Link 
                  to="/admin/bookings" 
                  className={`nav-link ${isActive('/admin/bookings') ? 'active' : ''}`}
                >
                  <i className="nav-icon bi bi-calendar-check" />
                  <p>Bookings</p>
                </Link>
              </li>
              <li className="nav-item">
                <Link 
                  to="/admin/reports" 
                  className={`nav-link ${isActive('/admin/reports') ? 'active' : ''}`}
                >
                  <i className="nav-icon bi bi-file-earmark-text" />
                  <p>Reports</p>
                </Link>
              </li>
              <li className="nav-item">
                <Link 
                  to="/admin/settings" 
                  className={`nav-link ${isActive('/admin/settings') ? 'active' : ''}`}
                >
                  <i className="nav-icon bi bi-gear" />
                  <p>Settings</p>
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
