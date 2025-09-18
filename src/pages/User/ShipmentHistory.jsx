
import React, { useState,useEffect } from "react";
import {
  Calendar,
  Download,
  Filter,
  Archive,
  TrendingUp,
  Package,
} from "lucide-react";

const ShipmentHistory = () => {
  const [dateRange, setDateRange] = useState("last_30");
  const [statusFilter, setStatusFilter] = useState("all");
  const [sortBy, setSortBy] = useState("newest");

  // Mock historical data
  const historicalShipments = [
    {
      id: "SH-2024-152",
      description: "Holiday Electronics",
      status: "Delivered",
      shippedDate: "Dec 15, 2024",
      deliveredDate: "Dec 18, 2024",
      destination: "New York, NY",
      carrier: "FedEx Express",
      value: "1,299.00",
      rating: 5,
      deliveryTime: "3 days",
    },
    {
      id: "SH-2024-148",
      description: "Books Collection",
      status: "Delivered",
      shippedDate: "Dec 8, 2024",
      deliveredDate: "Dec 12, 2024",
      destination: "Los Angeles, CA",
      carrier: "USPS Priority",
      value: "89.50",
      rating: 4,
      deliveryTime: "4 days",
    },
    {
      id: "SH-2024-143",
      description: "Furniture Package",
      status: "Delivered",
      shippedDate: "Nov 25, 2024",
      deliveredDate: "Nov 30, 2024",
      destination: "Chicago, IL",
      carrier: "UPS Freight",
      value: "2,150.00",
      rating: 5,
      deliveryTime: "5 days",
    },
    {
      id: "SH-2024-139",
      description: "Art Supplies",
      status: "Cancelled",
      shippedDate: "Nov 20, 2024",
      deliveredDate: null,
      destination: "Miami, FL",
      carrier: "DHL Express",
      value: "234.75",
      rating: null,
      deliveryTime: null,
    },
    {
      id: "SH-2024-135",
      description: "Sports Equipment",
      status: "Delivered",
      shippedDate: "Nov 10, 2024",
      deliveredDate: "Nov 14, 2024",
      destination: "Seattle, WA",
      carrier: "FedEx Ground",
      value: "567.25",
      rating: 4,
      deliveryTime: "4 days",
    },
    {
      id: "SH-2024-128",
      description: "Kitchen Appliances",
      status: "Delivered",
      shippedDate: "Oct 28, 2024",
      deliveredDate: "Nov 2, 2024",
      destination: "Austin, TX",
      carrier: "UPS Ground",
      value: "1,456.00",
      rating: 5,
      deliveryTime: "5 days",
    },
  ];

  useEffect(() => {
    async function fetchData() {
      try {
        const res = await fetch("http://localhost:4000/orders/getorders", {
          method: "GET"
        });
        const data = await res.json();
        console.log(data);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    }
    fetchData();
  }, []);

  // Filter and sort shipments
  const filteredShipments = historicalShipments
    .filter((shipment) => {
      const matchesStatus =
        statusFilter === "all" ||
        shipment.status.toLowerCase() === statusFilter.toLowerCase();
      return matchesStatus;
    })
    .sort((a, b) => {
      if (sortBy === "newest") {
        return new Date(b.shippedDate) - new Date(a.shippedDate);
      } else if (sortBy === "oldest") {
        return new Date(a.shippedDate) - new Date(b.shippedDate);
      } else if (sortBy === "value_high") {
        return parseFloat(b.value) - parseFloat(a.value);
      } else if (sortBy === "value_low") {
        return parseFloat(a.value) - parseFloat(b.value);
      }
      return 0;
    });

  const getStatusColor = (status) => {
    switch (status.toLowerCase()) {
      case "delivered":
        return "badge bg-success";
      case "cancelled":
        return "badge bg-danger";
      case "returned":
        return "badge bg-warning text-dark";
      default:
        return "badge bg-secondary";
    }
  };

  const renderStars = (rating) => {
    if (!rating) return null;
    return (
      <div className="d-flex align-items-center">
        {[...Array(5)].map((_, i) => (
          <svg
            key={i}
            className={`me-1`}
            width="16"
            height="16"
            fill={i < rating ? "gold" : "lightgray"}
            viewBox="0 0 20 20"
          >
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
          </svg>
        ))}
        <span className="small text-muted ms-1">({rating})</span>
      </div>
    );
  };

  // Stats
  const totalShipments = historicalShipments.length;
  const deliveredShipments = historicalShipments.filter(
    (s) => s.status === "Delivered"
  ).length;
  const totalValue = historicalShipments.reduce(
    (sum, s) => sum + parseFloat(s.value),
    0
  );
  const avgRating = historicalShipments
    .filter((s) => s.rating)
    .reduce((sum, s, _, arr) => sum + s.rating / arr.length, 0);

  return (
    <div className="container py-4">
      {/* Header */}
      <div className="d-flex flex-column flex-lg-row align-items-lg-center justify-content-between mb-4">
        <div>
          <h1 className="h3 fw-bold">Shipment History</h1>
          <p className="text-muted">
            Review your past shipments and track your shipping patterns
          </p>
        </div>
        <button className="btn btn-success d-flex align-items-center gap-2 mt-3 mt-lg-0">
          <Download size={16} /> Export History
        </button>
      </div>

      {/* Stats */}
      <div className="row g-3 mb-4">
        <div className="col-md-3">
          <div className="card p-3">
            <p className="small text-muted mb-1">Total Shipments</p>
            <h5>{totalShipments}</h5>
          </div>
        </div>
        <div className="col-md-3">
          <div className="card p-3">
            <p className="small text-muted mb-1">Delivered</p>
            <h5>{deliveredShipments}</h5>
            <span className="text-success small">
              {Math.round((deliveredShipments / totalShipments) * 100)}% success
              rate
            </span>
          </div>
        </div>
        <div className="col-md-3">
          <div className="card p-3">
            <p className="small text-muted mb-1">Total Value</p>
            <h5>${totalValue.toLocaleString()}</h5>
          </div>
        </div>
        <div className="col-md-3">
          <div className="card p-3">
            <p className="small text-muted mb-1">Avg. Rating</p>
            <h5>{avgRating.toFixed(1)}</h5>
            {renderStars(Math.round(avgRating))}
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="card p-3 mb-4">
        <div className="row g-3">
          <div className="col-md-4">
            <label className="form-label">Date Range</label>
            <select
              value={dateRange}
              onChange={(e) => setDateRange(e.target.value)}
              className="form-select"
            >
              <option value="last_30">Last 30 Days</option>
              <option value="last_90">Last 90 Days</option>
              <option value="last_year">Last Year</option>
              <option value="all_time">All Time</option>
            </select>
          </div>
          <div className="col-md-4">
            <label className="form-label">Status</label>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="form-select"
            >
              <option value="all">All Status</option>
              <option value="delivered">Delivered</option>
              <option value="cancelled">Cancelled</option>
              <option value="returned">Returned</option>
            </select>
          </div>
          <div className="col-md-4">
            <label className="form-label">Sort By</label>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="form-select"
            >
              <option value="newest">Newest First</option>
              <option value="oldest">Oldest First</option>
              <option value="value_high">Highest Value</option>
              <option value="value_low">Lowest Value</option>
            </select>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="card">
        <div className="table-responsive">
          <table className="table table-hover align-middle">
            <thead className="table-light">
              <tr>
                <th>Shipment</th>
                <th>Status</th>
                <th>Dates</th>
                <th>Destination</th>
                <th>Carrier</th>
                <th>Value</th>
                <th>Rating</th>
                <th className="text-end">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredShipments.map((shipment) => (
                <tr key={shipment.id}>
                  <td>
                    <div className="fw-semibold">#{shipment.id}</div>
                    <div className="text-muted small">
                      {shipment.description}
                    </div>
                  </td>
                  <td>
                    <span className={getStatusColor(shipment.status)}>
                      {shipment.status}
                    </span>
                  </td>
                  <td>
                    <div className="small">Shipped: {shipment.shippedDate}</div>
                    {shipment.deliveredDate && (
                      <div className="text-muted small">
                        Delivered: {shipment.deliveredDate}
                      </div>
                    )}
                    {shipment.deliveryTime && (
                      <div className="text-primary small">
                        ({shipment.deliveryTime})
                      </div>
                    )}
                  </td>
                  <td className="small">{shipment.destination}</td>
                  <td className="small">{shipment.carrier}</td>
                  <td className="fw-semibold">${shipment.value}</td>
                  <td>{renderStars(shipment.rating)}</td>
                  <td className="text-end">
                    <button className="btn btn-link text-primary btn-sm">
                      View
                    </button>
                    <button className="btn btn-link text-secondary btn-sm">
                      <Download size={16} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="card-footer d-flex justify-content-between align-items-center">
          <div className="small text-muted">
            Showing {filteredShipments.length} of {totalShipments} shipments
          </div>
          <div>
            <button className="btn btn-sm btn-outline-secondary me-2" disabled>
              Previous
            </button>
            <span className="btn btn-sm btn-primary">1</span>
            <button className="btn btn-sm btn-outline-secondary ms-2" disabled>
              Next
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ShipmentHistory;
