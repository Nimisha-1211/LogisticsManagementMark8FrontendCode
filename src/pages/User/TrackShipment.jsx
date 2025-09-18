import React, { useState } from "react";
import { Search, Package, MapPin, Clock } from "lucide-react";
import UserStatusTracker from "../../components/user/UserStatusTracker";
import InvoiceDownloadButton from "../../components/user/InvoiceDownloadButton";
import AddressUpdateForm from "../../components/user/AddressUpdateForm";

const TrackShipment = () => {
  const [trackingNumber, setTrackingNumber] = useState("");
  const [shipmentData, setShipmentData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [showAddressUpdate, setShowAddressUpdate] = useState(false);

  // Mock data
  const mockShipmentData = {
    id: "SH-2025-001",
    trackingNumber: "TRK123456789",
    description: "Electronics Package",
    status: "In Transit",
    shippedDate: "Jan 15, 2025",
    expectedDate: "Jan 18, 2025",
    origin: "San Francisco, CA",
    destination: "New York, NY",
    carrier: "FedEx Express",
    weight: "2.5 lbs",
    dimensions: '12" x 8" x 6"',
    value: "899.00",
    currentLocation: "Denver, CO",
    trackingSteps: [
      { title: "Order Confirmed", description: "Your shipment has been prepared and confirmed", timestamp: "Jan 15, 2025 09:00 AM", location: "San Francisco, CA", completed: true, status: "confirmed" },
      { title: "Picked Up", description: "Package picked up by carrier", timestamp: "Jan 15, 2025 02:30 PM", location: "San Francisco, CA", completed: true, status: "picked_up" },
      { title: "In Transit", description: "Package is on its way to destination", timestamp: "Jan 16, 2025 08:15 AM", location: "Denver, CO", completed: false, status: "in_transit" },
      { title: "Out for Delivery", description: "Package is out for final delivery", timestamp: "", location: "New York, NY", completed: false, status: "out_for_delivery" },
      { title: "Delivered", description: "Package has been delivered successfully", timestamp: "", location: "New York, NY", completed: false, status: "delivered" }
    ]
  };

  const mockInvoiceData = {
    amount: 899.0,
    date: "Jan 15, 2025",
    invoiceNumber: "INV-SH-2025-001",
  };

  const handleTrack = () => {
    if (!trackingNumber.trim()) return;
    setIsLoading(true);
    setTimeout(() => {
      if (trackingNumber.toLowerCase().includes("trk") || trackingNumber.includes("123")) {
        setShipmentData(mockShipmentData);
      } else {
        setShipmentData(null);
      }
      setIsLoading(false);
    }, 1500);
  };

  const handleAddressUpdate = (newAddress) => {
    console.log("Address updated:", newAddress);
    setShowAddressUpdate(false);
  };

  return (
    <div className="container py-5">
      {/* Header */}
      <div className="mb-4">
        <h1 className="h3 fw-bold">Track Shipment</h1>
        <p className="text-muted">Enter your tracking number to get real-time updates</p>
      </div>

      {/* Search Section */}
      <div className="card shadow-sm mb-4">
        <div className="card-body">
          <div className="row g-3">
            <div className="col-md-9">
              <label className="form-label">Tracking Number</label>
              <input
                type="text"
                className="form-control"
                placeholder="Enter tracking number (try: TRK123456789)"
                value={trackingNumber}
                onChange={(e) => setTrackingNumber(e.target.value)}
                onKeyPress={(e) => e.key === "Enter" && handleTrack()}
              />
            </div>
            <div className="col-md-3 d-flex align-items-end">
              <button
                className={`btn w-100 ${isLoading ? "btn-secondary" : "btn-primary"}`}
                disabled={isLoading || !trackingNumber.trim()}
                onClick={handleTrack}
              >
                {isLoading ? (
                  <span className="spinner-border spinner-border-sm me-2"></span>
                ) : (
                  <Search size={18} className="me-2" />
                )}
                {isLoading ? "Tracking..." : "Track"}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Shipment Results */}
      {shipmentData && (
        <div className="mb-4">
          <div className="card shadow-sm mb-4">
            <div className="card-body">
              <div className="d-flex justify-content-between align-items-start mb-3">
                <div className="d-flex align-items-center">
                  <div className="bg-light p-3 rounded me-3">
                    <Package size={32} className="text-primary" />
                  </div>
                  <div>
                    <h5 className="mb-1">#{shipmentData.id}</h5>
                    <small className="text-muted">{shipmentData.description}</small>
                  </div>
                </div>
                <span className="badge bg-primary">{shipmentData.status}</span>
              </div>

              <div className="row">
                <div className="col-md-4 mb-3">
                  <h6>Shipment Details</h6>
                  <ul className="list-unstyled small">
                    <li><strong>Weight:</strong> {shipmentData.weight}</li>
                    <li><strong>Dimensions:</strong> {shipmentData.dimensions}</li>
                    <li><strong>Value:</strong> ${shipmentData.value}</li>
                    <li><strong>Carrier:</strong> {shipmentData.carrier}</li>
                  </ul>
                </div>
                <div className="col-md-4 mb-3">
                  <h6>Journey</h6>
                  <ul className="list-unstyled small">
                    <li><MapPin size={14} className="text-muted me-1" /> From: {shipmentData.origin}</li>
                    <li><MapPin size={14} className="text-primary me-1" /> Currently: {shipmentData.currentLocation}</li>
                    <li><MapPin size={14} className="text-success me-1" /> To: {shipmentData.destination}</li>
                  </ul>
                </div>
                <div className="col-md-4 mb-3">
                  <h6>Timeline</h6>
                  <ul className="list-unstyled small">
                    <li><Clock size={14} className="text-muted me-1" /> Shipped: {shipmentData.shippedDate}</li>
                    <li><Clock size={14} className="text-primary me-1" /> Expected: {shipmentData.expectedDate}</li>
                  </ul>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="mt-3 border-top pt-3 d-flex flex-wrap gap-2">
                <button className="btn btn-warning text-white" onClick={() => setShowAddressUpdate(true)}>
                  Update Address
                </button>
                <button className="btn btn-secondary">Contact Carrier</button>
                <button className="btn btn-outline-secondary">Share Tracking</button>
              </div>
            </div>
          </div>

          {showAddressUpdate && (
            <AddressUpdateForm
              currentAddress={{
                street: "123 Main Street",
                city: "New York",
                state: "NY",
                zipCode: "10001",
                country: "United States",
              }}
              onSave={handleAddressUpdate}
              onCancel={() => setShowAddressUpdate(false)}
            />
          )}

          <div className="row g-4">
            <div className="col-lg-8">
              <UserStatusTracker
                trackingSteps={shipmentData.trackingSteps}
                currentStatus={shipmentData.status.toLowerCase().replace(" ", "_")}
              />
            </div>
            <div className="col-lg-4">
              <InvoiceDownloadButton shipmentId={shipmentData.id} invoiceData={mockInvoiceData} />

              <div className="card shadow-sm mt-4">
                <div className="card-body">
                  <h6 className="fw-bold mb-3">Need Help?</h6>
                  <div className="mb-2 p-3 bg-light rounded">
                    <h6 className="small fw-bold text-primary mb-1">Track by Email</h6>
                    <small className="text-muted">Get updates sent to your email</small>
                  </div>
                  <div className="mb-2 p-3 bg-light rounded">
                    <h6 className="small fw-bold text-success mb-1">SMS Notifications</h6>
                    <small className="text-muted">Receive text message updates</small>
                  </div>
                  <button className="btn btn-light w-100 text-start">
                    <h6 className="small fw-bold mb-1">Contact Support</h6>
                    <small className="text-muted">Get help with your shipment</small>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* No Results */}
      {trackingNumber && !shipmentData && !isLoading && (
        <div className="card shadow-sm text-center p-5">
          <Package size={48} className="text-muted mb-3 mx-auto" />
          <h5 className="fw-bold">Shipment Not Found</h5>
          <p className="text-muted">
            We couldn't find a shipment with tracking number "{trackingNumber}".<br />
            Please check the number and try again.
          </p>
          <small className="text-secondary">Try using: TRK123456789 for demo purposes</small>
        </div>
      )}
    </div>
  );
};

export default TrackShipment;