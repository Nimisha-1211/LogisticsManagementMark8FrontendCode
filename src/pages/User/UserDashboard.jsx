import React, { useEffect, useState } from "react";
import { Package, TrendingUp, Clock, CheckCircle } from "lucide-react";
import UserShipmentCard from "../../components/user/UserShipmentCard";

const UserDashboard = ({ userId }) => {
  const [stats, setStats] = useState([]);
  const [orders, setOrders] = useState([]);
 let value='68c931e44116c9b20e54c2f4';
  useEffect(() => {
    // if (!userId) return; // wait for userId
    async function fetchData() {
      try {
        const res = await fetch(
          `http://localhost:3000/orders/stats/${value}`,
          { method: "GET" }
        );
        const data = await res.json();
        console.log("Dashboard Data:", data);

        // Build stats from backend response
        const formattedStats = [
          {
            title: "Total Shipments",
            value: data.totals.totalShipments,
            change: data.thisMonth.totalShipments.change,
            icon: Package,
            color: "primary",
          },
          {
            title: "Active Shipments",
            value: data.totals.activeShipments,
            change: data.thisMonth.activeShipments.change,
            icon: Clock,
            color: "warning",
          },
          {
            title: "Delivered",
            value: data.totals.deliveredShipments,
            change: data.thisMonth.deliveredShipments.change,
            icon: CheckCircle,
            color: "success",
          },
          {
            title: "Total Value",
            value: `₹${data.totals.totalValue}`,
            change: data.thisMonth.totalValue.change,
            icon: TrendingUp,
            color: "info",
          },
        ];

        setStats(formattedStats);
        setOrders(data.orders || []);
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
      }
    }
    fetchData();
  }, [userId]);

  return (
    <div className="container py-4">
      {/* Header */}
      <div className="mb-4">
        <h1 className="h3 fw-bold text-dark">Dashboard</h1>
        <p className="text-muted">
          Welcome back! Here's what's happening with your shipments.
        </p>
      </div>

      {/* Stats Grid */}
      <div className="row g-4 mb-4">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <div key={index} className="col-12 col-md-6 col-lg-3">
              <div className="card shadow-sm">
                <div className="card-body d-flex justify-content-between align-items-center">
                  <div>
                    <p className="text-muted mb-1 small">{stat.title}</p>
                    <h5 className="fw-bold mb-0">{stat.value}</h5>
                    <small className="text-success">
                      {stat.change} from last month
                    </small>
                  </div>
                  <div
                    className={`rounded-circle bg-${stat.color} bg-opacity-10 p-3`}
                  >
                    <Icon className={`text-${stat.color}`} size={24} />
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Recent Activity */}
      <div className="row g-4">
        {/* Recent Shipments */}
        <div className="col-12 col-lg-6">
          <div className="d-flex justify-content-between align-items-center mb-3">
            <h2 className="h5 fw-semibold">Recent Shipments</h2>
            <a
              href="/my-shipments"
              className="text-primary text-decoration-none small fw-semibold"
            >
              View All
            </a>
          </div>
          <div className="d-flex flex-column">
            {orders.slice(0, 2).map((shipment) => {
              const productDetails = shipment.product?.productDetails || {};
              return (
                <div key={shipment._id} className="mb-3">
                  <UserShipmentCard
                    shipment={{
                      id: shipment.orderId,
                      description:
                        productDetails.description || "No product details",
                      status: shipment.status,
                      shippedDate: new Date(
                        shipment.orderPlacedDate
                      ).toDateString(),
                      expectedDate: new Date(
                        shipment.expectedDeliveryDate
                      ).toDateString(),
                      destination: shipment.deliveryAddress.address,
                      carrier:
                        shipment.assignDriver?.name || "Not Assigned",
                      value: productDetails.price
                        ? productDetails.price * shipment.quantity
                        : "N/A",
                    }}
                    onClick={() =>
                      console.log("View shipment:", shipment.orderId)
                    }
                  />
                </div>
              );
            })}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="col-12 col-lg-6">
          <h2 className="h5 fw-semibold mb-3">Quick Actions</h2>
          <div className="d-flex flex-column">
            <button className="btn btn-primary text-start mb-3 p-3">
              <h6 className="fw-semibold mb-1">Track a Shipment</h6>
              <small className="text-light">
                Enter tracking number to get real-time updates
              </small>
            </button>

            <button className="btn btn-success text-start mb-3 p-3">
              <h6 className="fw-semibold mb-1">Create New Shipment</h6>
              <small className="text-light">
                Start a new shipping request
              </small>
            </button>

            <button className="btn btn-info text-start mb-3 p-3">
              <h6 className="fw-semibold mb-1">View History</h6>
              <small className="text-light">
                Browse all your past shipments
              </small>
            </button>

            <div className="card shadow-sm border">
              <div className="card-body">
                <h6 className="fw-semibold mb-2">Need Help?</h6>
                <p className="text-muted small mb-2">
                  Have questions about your shipments or need assistance?
                </p>
                <button className="btn btn-link p-0 text-primary fw-semibold small">
                  Contact Support →
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserDashboard;
