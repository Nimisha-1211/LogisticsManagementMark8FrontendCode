import React, { useState } from "react";
import { dummyShipments } from "./UserDashboard";

const TrackShipment = () => {
  const [trackingId, setTrackingId] = useState("");
  const [result, setResult] = useState(null);

  const handleTrack = () => {
    const found = dummyShipments.find((s) => s.orderId === trackingId);
    setResult(found || { error: "❌ Shipment not found" });
  };

  return (
    <div className="container py-4">
      <h2 className="fw-bold mb-4">🔍 Track Shipment</h2>
      <div className="card p-4 shadow-sm mb-4">
        <label className="form-label">Enter Tracking ID</label>
        <div className="d-flex gap-2">
          <input
            type="text"
            className="form-control"
            placeholder="e.g. ORD123"
            value={trackingId}
            onChange={(e) => setTrackingId(e.target.value)}
          />
          <button className="btn btn-primary" onClick={handleTrack}>
            Track
          </button>
        </div>
      </div>

      {result && (
        <div className="card p-4 shadow-sm">
          {result.error ? (
            <p className="text-danger fw-semibold">{result.error}</p>
          ) : (
            <>
              <h5 className="fw-bold mb-3">Shipment Details</h5>
              <p>
                <strong>Status:</strong> {result.status}
              </p>
              <p>
                <strong>Destination:</strong> {result.deliveryAddress.address}
              </p>
              <p>
                <strong>Expected Delivery:</strong> {new Date(result.expectedDeliveryDate).toDateString()}
              </p>
              <p>
                <strong>Driver:</strong> {result.assignDriver?.name || "Not Assigned"}
              </p>
            </>
          )}
        </div>
      )}
    </div>
  );
};

export default TrackShipment;
