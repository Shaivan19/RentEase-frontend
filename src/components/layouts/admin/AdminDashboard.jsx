import React from 'react';

export const AdminDashboard = () => {
  return (
    <div className="content-wrapper">
      <div className="content-header">
        <div className="container-fluid">
          <div className="row mb-2">
            <div className="col-sm-6">
              <h1 className="m-0">Dashboard</h1>
            </div>
          </div>
        </div>
      </div>

      <section className="content">
        <div className="container-fluid">
          <div className="row">
            <div className="col-lg-3 col-6">
              <div className="small-box bg-info">
                <div className="inner">
                  <h3>150</h3>
                  <p>Total Users</p>
                </div>
                <div className="icon">
                  <i className="bi bi-people" />
                </div>
                <a href="/admin/users" className="small-box-footer">
                  More info <i className="bi bi-arrow-right-circle" />
                </a>
              </div>
            </div>

            <div className="col-lg-3 col-6">
              <div className="small-box bg-success">
                <div className="inner">
                  <h3>53</h3>
                  <p>Total Properties</p>
                </div>
                <div className="icon">
                  <i className="bi bi-house" />
                </div>
                <a href="/admin/properties" className="small-box-footer">
                  More info <i className="bi bi-arrow-right-circle" />
                </a>
              </div>
            </div>

            <div className="col-lg-3 col-6">
              <div className="small-box bg-warning">
                <div className="inner">
                  <h3>44</h3>
                  <p>Active Bookings</p>
                </div>
                <div className="icon">
                  <i className="bi bi-calendar-check" />
                </div>
                <a href="/admin/bookings" className="small-box-footer">
                  More info <i className="bi bi-arrow-right-circle" />
                </a>
              </div>
            </div>

            <div className="col-lg-3 col-6">
              <div className="small-box bg-danger">
                <div className="inner">
                  <h3>65</h3>
                  <p>Pending Requests</p>
                </div>
                <div className="icon">
                  <i className="bi bi-file-earmark-text" />
                </div>
                <a href="/admin/requests" className="small-box-footer">
                  More info <i className="bi bi-arrow-right-circle" />
                </a>
              </div>
            </div>
          </div>

          <div className="row">
            <div className="col-md-6">
              <div className="card">
                <div className="card-header">
                  <h3 className="card-title">Recent Users</h3>
                </div>
                <div className="card-body">
                  <table className="table table-bordered">
                    <thead>
                      <tr>
                        <th>Name</th>
                        <th>Email</th>
                        <th>Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td>John Doe</td>
                        <td>john@example.com</td>
                        <td><span className="badge bg-success">Active</span></td>
                      </tr>
                      <tr>
                        <td>Jane Smith</td>
                        <td>jane@example.com</td>
                        <td><span className="badge bg-warning">Pending</span></td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>

            <div className="col-md-6">
              <div className="card">
                <div className="card-header">
                  <h3 className="card-title">Recent Properties</h3>
                </div>
                <div className="card-body">
                  <table className="table table-bordered">
                    <thead>
                      <tr>
                        <th>Title</th>
                        <th>Location</th>
                        <th>Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td>Luxury Apartment</td>
                        <td>New York</td>
                        <td><span className="badge bg-success">Available</span></td>
                      </tr>
                      <tr>
                        <td>Beach House</td>
                        <td>Miami</td>
                        <td><span className="badge bg-danger">Booked</span></td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}; 