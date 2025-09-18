import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "../../styles/admin/Orders.css";

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [search, setSearch] = useState("");
  const [activeTab, setActiveTab] = useState("All");
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(true);

  // ✅ Fetch orders from backend
  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const res = await fetch("http://localhost:3000/orders/order", {
          method: "GET",
          headers: { "Content-Type": "application/json" },
        });
        if (!res.ok) throw new Error("Failed to fetch orders");
        const data = await res.json();
        setOrders(data);
      } catch (err) {
        console.error("Error fetching orders:", err);
        toast.error("Failed to load orders!");
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  // ✅ Start editing
  const handleEdit = (id) => setEditingId(id);

  // ✅ Save changes (update order in backend)
  const handleSave = async (id) => {
    const order = orders.find((o) => o._id === id);
    if (!order) return;

    try {
      const res = await fetch("http://localhost:3000/orders/order", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          orderId: order._id, // custom orderId (not _id)
          driverId: order.assignDriver?._id || null, // assign driver Mongo _id
          status: order.status,
        }),
      });

      if (!res.ok) throw new Error("Failed to update order");
      const data = await res.json();

      // ✅ update order in UI
      setOrders((prev) =>
        prev.map((o) => (o._id === id ? { ...o, ...data.order } : o))
      );

      toast.success("Order Updated!");
      setEditingId(null);
    } catch (err) {
      console.error(err);
      toast.error("Failed to update order!");
    }
  };

  // ✅ Cancel editing
  const handleCancel = () => setEditingId(null);

  // ✅ Update order locally (before saving)
  const handleChange = (id, field, value) => {
    setOrders((prev) =>
      prev.map((order) =>
        order._id === id ? { ...order, [field]: value } : order
      )
    );
  };

  // ✅ Delete order
  const handleDelete = async (id) => {
    try {
      const res = await fetch(`http://localhost:3000/orders/order/${id}`, {
        method: "DELETE",
      });
      if (!res.ok) throw new Error("Failed to delete order");

      setOrders((prev) => prev.filter((o) => o._id !== id));
      toast.success("Order Deleted!");
    } catch (err) {
      console.error(err);
      toast.error("Failed to delete order!");
    }
  };

  // ✅ Filters
  const filteredOrders = orders.filter((o) =>
    activeTab === "All" ? true : o.orderType === activeTab
  );

  const displayedOrders = filteredOrders.filter((o) =>
    (o.product?.productName || "N/A")
      .toLowerCase()
      .includes(search.toLowerCase())
  );

  // ✅ Counts
  const total = orders.length;
  const pending = orders.filter((o) => o.status === "Pending").length;
  const delivered = orders.filter((o) => o.status === "Delivered").length;
  const cancelled = orders.filter((o) => o.status === "Cancelled").length;

  if (loading) return <div>Loading Orders...</div>;

  return (
    <div className="orders-container">
      {/* Sidebar */}
      <div className="sidebar">
        <h4>Warehouse Manager</h4>
        <ul>
          <li>
            <Link to="/warehouse-dashboard">Dashboard</Link>
          </li>
          <li>
            <Link to="/inventory">Inventory</Link>
          </li>
          <li>
            <Link to="/orders">Orders</Link>
          </li>
          <li>
            <Link to="/assign-driver">Assign Driver</Link>
          </li>
          <li>
            <Link to="/settings">Settings</Link>
          </li>
          <li>
            <Link to="/logout" className="logout-link">
              Logout
            </Link>
          </li>
        </ul>
      </div>

      {/* Main content */}
      <div className="orders-main">
        <h2>Orders</h2>

        {/* Summary Cards */}
        <div className="cards">
          <div className="card total">Total Orders: {total}</div>
          <div className="card pending">Pending: {pending}</div>
          <div className="card completed">Delivered: {delivered}</div>
          <div className="card cancelled">Cancelled: {cancelled}</div>
        </div>

        {/* Controls */}
        <div className="controls">
          <div className="tabs">
            {["All", "Inbound", "Outbound"].map((tab) => (
              <button
                key={tab}
                className={activeTab === tab ? "active" : ""}
                onClick={() => setActiveTab(tab)}
              >
                {tab}
              </button>
            ))}
          </div>

          <input
            type="text"
            placeholder="Search orders..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        {/* Orders Table */}
        <table>
          <thead>
            <tr>
              <th>Order ID</th>
              <th>Product</th>
              <th>Type</th>
              <th>Quantity</th>
              <th>Status</th>
              <th>Customer</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {displayedOrders.length > 0 ? (
              displayedOrders.map((order) => (
                <tr key={order._id}>
                  <td>{order.orderId}</td>
                  <td>{order.product?.productName || "N/A"}</td>
                  <td>{order.orderType}</td>
                  <td>{order.quantity}</td>
                  <td>
                    {editingId === order._id ? (
                      <select
                        value={order.status}
                        onChange={(e) =>
                          handleChange(order._id, "status", e.target.value)
                        }
                      >
                        <option value="Pending">Pending</option>
                        <option value="Delivered">Delivered</option>
                        <option value="Cancelled">Cancelled</option>
                      </select>
                    ) : (
                      order.status
                    )}
                  </td>
                  <td>{order.deliveryAddress?.name || "N/A"}</td>
                  <td>
                    {editingId === order._id ? (
                      <>
                        <button
                          className="save-btn"
                          onClick={() => handleSave(order._id)}
                        >
                          Save
                        </button>
                        <button
                          className="cancel-btn"
                          onClick={handleCancel}
                        >
                          Cancel
                        </button>
                      </>
                    ) : (
                      <>
                        <button
                          className="edit-btn"
                          onClick={() => handleEdit(order._id)}
                        >
                          Edit
                        </button>
                        <button
                          className="delete-btn"
                          onClick={() => handleDelete(order._id)}
                        >
                          Delete
                        </button>
                      </>
                    )}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="7">No Orders Found</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <ToastContainer position="top-right" autoClose={2000} />
    </div>
  );
};

export default Orders;
