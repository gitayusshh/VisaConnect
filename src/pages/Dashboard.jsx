
import { useState } from "react";
import { Link } from "react-router-dom";
import {
  FileText,
  Clock,
  CheckCircle,
  CalendarDays,
  ArrowRight,
  PlusCircle,
  Search,
  CalendarPlus,
  List,
  ClipboardCheck,
} from "lucide-react";
import countries from "../data/countries";
import { getBookings } from "../services/consultations";
import { isAdminUser } from "../services/api";

function getStoredArray(key) {
  try {
    if (key === "bookings") {
      return getBookings();
    }

    const data = JSON.parse(localStorage.getItem(key) || "[]");

    if (!Array.isArray(data)) {
      return [];
    }

    return data;
  } catch {
    return [];
  }
}

function getUser() {
  try {
    return JSON.parse(localStorage.getItem("user") || "null");
  } catch {
    return null;
  }
}

function Dashboard() {
  const [showAll, setShowAll] = useState(false);

  const user = getUser();
  const isAdmin = isAdminUser(user);
  const applications = getStoredArray("applications");
  const bookings = getStoredArray("bookings");

  const myApplications = applications.filter(
    (application) =>
      user?.id != null &&
      String(application.userId) === String(user.id)
  );

  const myBookings = bookings.filter(
    (booking) =>
      user?.id != null &&
      String(booking.userId) === String(user.id)
  );

  const completedStatuses = ["Completed", "Approved", "Rejected"];

  const completedApplications = myApplications.filter(
    (application) =>
      completedStatuses.includes(application.status)
  );

  const pendingApplications = myApplications.filter(
    (application) =>
      !completedStatuses.includes(application.status)
  );

  const upcomingConsultations = myBookings
    .filter((booking) => {
      if (["Declined", "Cancelled"].includes(booking.status)) {
        return false;
      }

      const date = new Date(
        `${booking.date}T${booking.time}:00`
      );

      return !Number.isNaN(date.getTime()) && date >= new Date();
    })
    .sort(
      (a, b) =>
        new Date(`${a.date}T${a.time}:00`) -
        new Date(`${b.date}T${b.time}:00`)
    );

  const sortedApplications = [...myApplications].sort(
    (a, b) =>
      new Date(b.submittedAt || 0) -
      new Date(a.submittedAt || 0)
  );

  const displayedApplications = showAll
    ? sortedApplications
    : sortedApplications.slice(0, 5);

  const getCountryName = (id) =>
    countries.find((country) => country.id === id)?.name ||
    id ||
    "Unknown";

  const formatDate = (value) => {
    if (!value) return "Not available";

    const date = new Date(value);

    return Number.isNaN(date.getTime())
      ? "Not available"
      : date.toLocaleDateString();
  };

  const viewAllApplications = () => {
    setShowAll(true);

    requestAnimationFrame(() => {
      document
        .getElementById("my-applications")
        ?.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });
    });
  };

  return (
    <div className="container section">
      <div className="dashboard-header">
        <div>
          <span className="dashboard-label">
            MY DASHBOARD
          </span>

          <h1>
            Welcome, {user?.firstName || "User"}!
          </h1>

          <p>
            Manage your visa applications and consultation
            bookings in one place.
          </p>
        </div>

        <Link to="/apply" className="primary-btn">
          <PlusCircle size={18} />
          New Application
        </Link>
      </div>

      {/* DASHBOARD STATISTICS */}

      <div className="dashboard-stats">
        <div className="stat-card">
          <FileText size={28} color="#2563eb" />
          <h2>{myApplications.length}</h2>
          <p>Total Applications</p>
        </div>

        <div className="stat-card">
          <Clock size={28} color="#f59e0b" />
          <h2>{pendingApplications.length}</h2>
          <p>Pending Applications</p>
        </div>

        <div className="stat-card">
          <CheckCircle size={28} color="#16a34a" />
          <h2>{completedApplications.length}</h2>
          <p>Completed Applications</p>
        </div>

        <div className="stat-card">
          <CalendarDays size={28} color="#7c3aed" />
          <h2>{upcomingConsultations.length}</h2>
          <p>Upcoming Consultations</p>
        </div>
      </div>

      {/* QUICK ACTIONS */}

      <div className="dashboard-section">
        <div className="dashboard-section-heading">
          <h2>Quick Actions</h2>
        </div>

        <div className="dashboard-quick-actions">
          <Link
            to="/apply"
            className="dashboard-action-card"
          >
            <PlusCircle size={27} color="#2563eb" />
            <h3>Apply for Visa</h3>
            <p>Start a new visa application.</p>
            <span>
              Apply Now <ArrowRight size={16} />
            </span>
          </Link>

          <Link
            to="/track"
            className="dashboard-action-card"
          >
            <Search size={27} color="#2563eb" />
            <h3>Track Application</h3>
            <p>Check your application status.</p>
            <span>
              Track Now <ArrowRight size={16} />
            </span>
          </Link>

          <Link
            to="/consultation"
            className="dashboard-action-card"
          >
            <CalendarPlus size={27} color="#2563eb" />
            <h3>Book Consultation</h3>
            <p>Schedule a visa consultation.</p>
            <span>
              Book Now <ArrowRight size={16} />
            </span>
          </Link>

          <button
            type="button"
            className="dashboard-action-card"
            onClick={viewAllApplications}
            style={{
              textAlign: "left",
              cursor: "pointer",
              font: "inherit",
            }}
          >
            <List size={27} color="#2563eb" />
            <h3>View Applications</h3>
            <p>See all your submitted applications.</p>
            <span>
              View All <ArrowRight size={16} />
            </span>
          </button>

          {isAdmin && (
            <Link
              to="/admin"
              className="dashboard-action-card"
            >
              <ClipboardCheck size={27} color="#2563eb" />
              <h3>Review Requests</h3>
              <p>Review applications and consultation requests.</p>
              <span>
                Open Review Page <ArrowRight size={16} />
              </span>
            </Link>
          )}
        </div>
      </div>

      {/* APPLICATION LIST */}

      <div
        className="dashboard-section"
        id="my-applications"
      >
        <div className="dashboard-section-heading">
          <h2>
            {showAll
              ? "All My Applications"
              : "Recent Applications"}
          </h2>

          {myApplications.length > 5 && (
            <button
              type="button"
              onClick={() => setShowAll(!showAll)}
              style={{
                border: "none",
                background: "transparent",
                color: "#2563eb",
                fontWeight: 600,
                cursor: "pointer",
              }}
            >
              {showAll ? "Show Recent" : "View All"}
            </button>
          )}
        </div>

        {displayedApplications.length === 0 ? (
          <div className="empty-state">
            <FileText size={34} color="#64748b" />

            <h3>No Applications Yet</h3>

            <p>
              You haven't submitted any visa applications
              using this demo account.
            </p>

            <Link to="/apply" className="primary-btn">
              Start Application
            </Link>
          </div>
        ) : (
          <div className="dashboard-list">
            {displayedApplications.map((application) => (
              <div
                className="dashboard-list-item"
                key={application.id}
              >
                <div>
                  <h3>
                    {getCountryName(application.country)}
                  </h3>

                  <p>
                    {application.visaType} Visa
                  </p>

                  <small>
                    {application.id} · Submitted:{" "}
                    {formatDate(application.submittedAt)}
                  </small>
                </div>

                <div className="dashboard-item-actions">
                  <span className="status-label">
                    {application.status}
                  </span>

                  <Link
                    to="/track"
                    state={{
                      applicationId: application.id,
                    }}
                  >
                    Track <ArrowRight size={16} />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* CONSULTATION BOOKINGS */}

      <div className="dashboard-section">
        <div className="dashboard-section-heading">
          <h2>Upcoming Consultations</h2>

          <Link to="/consultation">
            Book Consultation
            <ArrowRight size={16} />
          </Link>
        </div>

        {upcomingConsultations.length === 0 ? (
          <div className="empty-state">
            <CalendarDays size={34} color="#64748b" />

            <h3>No Upcoming Consultations</h3>

            <p>
              You have no upcoming demo appointments.
            </p>

            <Link
              to="/consultation"
              className="outline-btn"
            >
              Book Consultation
            </Link>
          </div>
        ) : (
          <div className="dashboard-list">
            {upcomingConsultations.map((booking) => (
              <div
                className="dashboard-list-item"
                key={booking.id}
              >
                <div>
                  <h3>
                    {getCountryName(booking.country)}{" "}
                    Consultation
                  </h3>

                  <p>
                    {booking.visaType} Visa — {booking.mode}
                  </p>

                  <p>
                    {booking.date} at {booking.time}
                  </p>

                  <small>{booking.id}</small>
                </div>

                <span className="status-label">
                  {booking.status}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>

      <p className="details-note">
        This dashboard uses browser-stored demo data.
        Applications and consultations are not processed
        by a real visa service.
      </p>
    </div>
  );
}

export default Dashboard;


