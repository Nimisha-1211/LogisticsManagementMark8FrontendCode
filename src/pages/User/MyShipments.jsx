

import React, { useState, useEffect } from "react";

function MyShipments() {
  // ✅ Keep mock data as fallback (so UI shows something if backend is not ready)
  const mockShipments = [
    {
      id: "ORD-101",
      description: "Electronics Package",
      status: "Pending",
      shippedDate: "2025-01-20",
      expectedDate: "2025-01-25",
      destination: "New Jersey, NJ",
      carrier: "FedEx",
      value: "120.00",
    },
    {
      id: "ORD-102",
      description: "Furniture Delivery",
      status: "Delivered",
      shippedDate: "2025-01-18",
      expectedDate: "2025-01-22",
      destination: "Boston, MA",
      carrier: "UPS",
      value: "300.00",
    },
    {
      id: "ORD-103",
      description: "Clothing Shipment",
      status: "Pending",
      shippedDate: "2025-01-22",
      expectedDate: "2025-01-27",
      destination: "Chicago, IL",
      carrier: "DHL",
      value: "80.00",
    },
    {
      id: "ORD-104",
      description: "Kitchen Appliances",
      status: "Delivered",
      shippedDate: "2025-01-15",
      expectedDate: "2025-01-20",
      destination: "San Francisco, CA",
      carrier: "FedEx",
      value: "250.00",
    },
  ];

  // ✅ Use state so it can update with backend data
  const [allShipments, setAllShipments] = useState(mockShipments);



  useEffect(() => {
  async function fetchData() {
    try {
      const res = await fetch("http://localhost:3000/shipments", {
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

  return (
    <div style={{ padding: "20px" }}>
      <h2>📦 My Shipments</h2>
      <table
        style={{
          width: "100%",
          borderCollapse: "collapse",
          marginTop: "20px",
        }}
      >
        <thead>
          <tr style={{ backgroundColor: "#f4f4f4" }}>
            <th style={{ border: "1px solid #ddd", padding: "10px" }}>Order ID</th>
            <th style={{ border: "1px solid #ddd", padding: "10px" }}>Description</th>
            <th style={{ border: "1px solid #ddd", padding: "10px" }}>Status</th>
            <th style={{ border: "1px solid #ddd", padding: "10px" }}>Shipped Date</th>
            <th style={{ border: "1px solid #ddd", padding: "10px" }}>Expected Date</th>
            <th style={{ border: "1px solid #ddd", padding: "10px" }}>Destination</th>
            <th style={{ border: "1px solid #ddd", padding: "10px" }}>Carrier</th>
            <th style={{ border: "1px solid #ddd", padding: "10px" }}>Value ($)</th>
          </tr>
        </thead>
        <tbody>
          {allShipments.map((shipment, index) => (
            <tr key={index}>
              <td style={{ border: "1px solid #ddd", padding: "10px" }}>{shipment.id}</td>
              <td style={{ border: "1px solid #ddd", padding: "10px" }}>{shipment.description}</td>
              <td
                style={{
                  border: "1px solid #ddd",
                  padding: "10px",
                  color: shipment.status === "Delivered" ? "green" : "orange",
                  fontWeight: "bold",
                }}
              >
                {shipment.status}
              </td>
              <td style={{ border: "1px solid #ddd", padding: "10px" }}>{shipment.shippedDate}</td>
              <td style={{ border: "1px solid #ddd", padding: "10px" }}>{shipment.expectedDate}</td>
              <td style={{ border: "1px solid #ddd", padding: "10px" }}>{shipment.destination}</td>
              <td style={{ border: "1px solid #ddd", padding: "10px" }}>{shipment.carrier}</td>
              <td style={{ border: "1px solid #ddd", padding: "10px" }}>{shipment.value}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default MyShipments;
