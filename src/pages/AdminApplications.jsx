import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ClipboardCheck, CheckCircle, XCircle } from "lucide-react";
import { toast } from "react-toastify";
import countries from "../data/countries";
import { getBookings } from "../services/consultations";

function loadApplications() {
  const savedApplications = localStorage.getItem("applications");

  if (!savedApplications) {
    return [];
  }

  const applications = JSON.parse(savedApplications);

  if (!Array.isArray(applications)) {
    throw new Error("Saved application data is invalid.");
  }

  return applications;
}

function getNextActions(status) {
  switch (status) {
    case "Submitted":
      return [
        {
          status: "Documents Verification",
          label: "Begin Documents Verification",
        },
      ];
    case "Documents Verification":
      return [
        {
          status: "Under Review",
          label: "Verify Documents & Start Review",
        },
      ];
    case "Under Review":
      return [
        { status: "Approved", label: "Approve" },
        { status: "Rejected", label: "Reject" },
      ];
    default:
      return [];
  }
}

function getBookingActions(status) {
  if (status !== "Pending") {
    return [];
  }

  return [
    { status: "Confirmed", label: "Confirm" },
    { status: "Declined", label: "Decline" },
  ];
}

function AdminApplications() {
  const [applications, setApplications] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [processingId, setProcessingId] = useState("");
  const [processingBookingId, setProcessingBookingId] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    try {
      setApplications(loadApplications());
      setBookings(getBookings());
    } catch (loadError) {
      setError(loadError.message || "Unable to load applications.");
    } finally {
      setLoading(false);
    }
  }, []);

  const updateStatus = (applicationId, nextStatus) => {
    if (processingId) return;

    setProcessingId(applicationId);
    setError("");

    try {
      const currentApplications = loadApplications();
      const application = currentApplications.find(
        (item) => String(item.id) === String(applicationId)
      );
      const allowedActions = getNextActions(application?.status);
      const selectedAction = allowedActions.find(
        (action) => action.status === nextStatus
      );

      if (!application || !selectedAction) {
        throw new Error("This application can no longer be updated.");
      }

      const latestUpdate =
        nextStatus === "Documents Verification"
          ? "Documents verification started."
          : nextStatus === "Under Review"
          ? "Documents verified; application is now under review."
          : nextStatus === "Approved"
          ? "Application approved."
          : "Application rejected.";

      const updatedApplications = currentApplications.map((item) =>
        String(item.id) === String(applicationId)
          ? {
              ...item,
              status: nextStatus,
              latestUpdate,
              statusUpdatedAt: new Date().toISOString(),
            }
          : item
      );

      localStorage.setItem(
        "applications",
        JSON.stringify(updatedApplications)
      );
      setApplications(updatedApplications);
      toast.success(`${application.id}: ${nextStatus}`);
    } catch (updateError) {
      const message =
        updateError.message || "Unable to update this application.";
      setError(message);
      toast.error(message);
    } finally {
      setProcessingId("");
    }
  };

  const updateBookingStatus = (bookingId, nextStatus) => {
    if (processingBookingId) return;

    setProcessingBookingId(bookingId);
    setError("");

    try {
      const currentBookings = getBookings();
      const booking = currentBookings.find(
        (item) => String(item.id) === String(bookingId)
      );
      const selectedAction = getBookingActions(booking?.status).find(
        (action) => action.status === nextStatus
      );

      if (!booking || !selectedAction) {
        throw new Error("This consultation request can no longer be updated.");
      }

      const updatedBooking = {
        ...booking,
        status: nextStatus,
        confirmedByAdmin: nextStatus === "Confirmed",
        latestUpdate:
          nextStatus === "Confirmed"
            ? "Consultation request confirmed by an administrator."
            : "Consultation request declined by an administrator.",
        statusUpdatedAt: new Date().toISOString(),
      };
      const updatedBookings = currentBookings.map((item) =>
        String(item.id) === String(bookingId) ? updatedBooking : item
      );

      localStorage.setItem("bookings", JSON.stringify(updatedBookings));
      setBookings(updatedBookings);
      toast.success(`Consultation ${booking.id}: ${nextStatus}`);
    } catch (updateError) {
      const message =
        updateError.message || "Unable to update this consultation request.";
      setError(message);
      toast.error(message);
    } finally {
      setProcessingBookingId("");
    }
  };

  const getCountryName = (id) =>
    countries.find((country) => country.id === id)?.name ||
    id ||
    "Unknown";

  return (
    <div className="container section">
      <div className="dashboard-header">
        <div>
          <span className="dashboard-label">DEMO ADMIN</span>
          <h1>Review Requests</h1>
          <p>
            Verify applications and confirm or decline consultation requests.
          </p>
        </div>
        <Link to="/dashboard" className="outline-btn">
          Back to Dashboard
        </Link>
      </div>

      <div className="dashboard-section">
        <div className="dashboard-section-heading">
          <h2>All Applications</h2>
        </div>

        {error && (
          <div className="form-error" role="alert">
            {error}
          </div>
        )}

        {loading ? (
          <div className="empty-state" role="status">
            <p>Loading applications...</p>
          </div>
        ) : applications.length === 0 ? (
          <div className="empty-state">
            <ClipboardCheck size={34} color="#64748b" />
            <h3>No Applications to Review</h3>
            <p>Submitted applications will appear here.</p>
            <Link to="/apply" className="primary-btn">
              Create a Demo Application
            </Link>
          </div>
        ) : (
          <div className="dashboard-list">
            {applications.map((application) => {
              const actions = getNextActions(application.status);
              const country = getCountryName(application.country);

              return (
                <div
                  className="dashboard-list-item"
                  key={application.id}
                >
                  <div>
                    <h3>{country} — {application.visaType} Visa</h3>
                    <p>{application.fullName}</p>
                    <small>
                      {application.id} · Current status: {application.status}
                    </small>
                    {application.latestUpdate && (
                      <p>{application.latestUpdate}</p>
                    )}
                  </div>

                  <div className="dashboard-item-actions">
                    {actions.length > 0 ? (
                      actions.map((action) => (
                        <button
                          key={action.status}
                          type="button"
                          className={
                            action.status === "Rejected"
                              ? "outline-btn"
                              : "primary-btn"
                          }
                          onClick={() =>
                            updateStatus(application.id, action.status)
                          }
                          disabled={Boolean(processingId)}
                        >
                          {action.status === "Approved" && (
                            <CheckCircle size={16} />
                          )}
                          {action.status === "Rejected" && (
                            <XCircle size={16} />
                          )}
                          {processingId === application.id
                            ? "Updating..."
                            : action.label}
                        </button>
                      ))
                    ) : (
                      <span className="status-label">
                        {application.status}
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      <div className="dashboard-section">
        <div className="dashboard-section-heading">
          <h2>Consultation Requests</h2>
        </div>

        {bookings.length === 0 ? (
          <div className="empty-state">
            <p>No consultation requests to review.</p>
          </div>
        ) : (
          <div className="dashboard-list">
            {bookings.map((booking) => {
              const actions = getBookingActions(booking.status);

              return (
                <div
                  className="dashboard-list-item"
                  key={booking.id}
                >
                  <div>
                    <h3>
                      {getCountryName(booking.country)} —{" "}
                      {booking.visaType} Consultation
                    </h3>
                    <p>{booking.fullName}</p>
                    <small>
                      {booking.id} · {booking.date} at {booking.time} ·{" "}
                      {booking.mode}
                    </small>
                  </div>

                  <div className="dashboard-item-actions">
                    {actions.length > 0 ? (
                      actions.map((action) => (
                        <button
                          key={action.status}
                          type="button"
                          className={
                            action.status === "Declined"
                              ? "outline-btn"
                              : "primary-btn"
                          }
                          onClick={() =>
                            updateBookingStatus(booking.id, action.status)
                          }
                          disabled={Boolean(processingBookingId)}
                        >
                          {processingBookingId === booking.id
                            ? "Updating..."
                            : action.label}
                        </button>
                      ))
                    ) : (
                      <span className="status-label">
                        {booking.status}
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      <p className="details-note">
        Demo only: application and consultation decisions are saved in
        this browser. Signed-in demo users can access this page; it does
        not provide real admin access controls.
      </p>
    </div>
  );
}

export default AdminApplications;
