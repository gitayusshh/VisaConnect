
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { CalendarDays } from "lucide-react";
import { toast } from "react-toastify";
import countries from "../data/countries";
import { getBookings } from "../services/consultations";
import { isAdminUser } from "../services/api";

const timeSlots = [
  "09:00",
  "10:00",
  "11:00",
  "12:00",
  "14:00",
  "15:00",
  "16:00",
  "17:00",
];

const today = () => {
  const date = new Date();

  return [
    date.getFullYear(),
    String(date.getMonth() + 1).padStart(2, "0"),
    String(date.getDate()).padStart(2, "0"),
  ].join("-");
};

const initialForm = {
  fullName: "",
  email: "",
  phone: "",
  country: "",
  visaType: "",
  date: "",
  time: "",
  mode: "Online",
};

function getCurrentUser() {
  try {
    return JSON.parse(localStorage.getItem("user") || "null");
  } catch {
    return null;
  }
}

function Consultation() {
  const [form, setForm] = useState(initialForm);
  const [bookings, setBookings] = useState([]);
  const user = getCurrentUser();
  const userId = user?.id ?? null;
  const isAdmin = isAdminUser(user);
  const [error, setError] = useState("");
  const [confirmation, setConfirmation] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  const selectedCountry = countries.find(
    (country) => country.id === form.country
  );

  const update = (field, value) => {
    setForm((previous) => ({
      ...previous,
      [field]: value,
    }));

    setError("");
  };

  const showError = (message) => {
    setError(message);
    toast.error(message);
  };

  useEffect(() => {
    try {
      setBookings(getBookings());
    } catch (loadError) {
      setError(loadError.message || "Unable to load consultation requests.");
    }
  }, []);

  const myBookings = bookings
    .filter((booking) =>
      userId == null
        ? booking.userId == null
        : String(booking.userId) === String(userId)
    )
    .sort(
      (first, second) =>
        new Date(`${first.date}T${first.time}:00`) -
        new Date(`${second.date}T${second.time}:00`)
    );

  const handleSubmit = (event) => {
    event.preventDefault();

    if (submitting) return;

    if (
      !form.fullName.trim() ||
      !form.email.trim() ||
      !form.phone.trim() ||
      !form.country ||
      !form.visaType ||
      !form.date ||
      !form.time
    ) {
      showError("Please fill in all required fields.");
      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      showError("Please enter a valid email address.");
      return;
    }

    if (!/^[6-9]\d{9}$/.test(form.phone)) {
      showError("Please enter a valid 10-digit phone number.");
      return;
    }

    if (form.date < today()) {
      showError("Please select today or a future date.");
      return;
    }

    const bookingDateTime = new Date(
      `${form.date}T${form.time}:00`
    );

    if (bookingDateTime <= new Date()) {
      showError("Please select a future consultation time.");
      return;
    }

    if (!timeSlots.includes(form.time)) {
      showError("Please select a valid consultation time.");
      return;
    }

    if (!selectedCountry?.categories.includes(form.visaType)) {
      showError("Please select a valid visa category.");
      return;
    }

    setSubmitting(true);

    try {
      const bookings = getBookings();

      const slotTaken = bookings.some(
        (booking) =>
          booking.date === form.date &&
          booking.time === form.time &&
          booking.mode === form.mode &&
          !["Declined", "Cancelled"].includes(booking.status)
      );

      if (slotTaken) {
        showError(
          "This demo slot is already booked. Please choose another time."
        );
        return;
      }

      const user = JSON.parse(
        localStorage.getItem("user") || "null"
      );

      const booking = {
        ...form,
        id: `${Date.now()}`,
        userId: user?.id ?? null,
        status: "Pending",
        createdAt: new Date().toISOString(),
      };

      const updatedBookings = [...bookings, booking];
      localStorage.setItem("bookings", JSON.stringify(updatedBookings));
      setBookings(updatedBookings);

      setConfirmation(booking);

      toast.success(
        `Consultation request submitted! ID: ${booking.id}`
      );
    } catch {
      showError("Unable to save your booking. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  const viewMyConsultations = () => {
    setConfirmation(null);

    requestAnimationFrame(() => {
      document
        .getElementById("my-consultations")
        ?.scrollIntoView({ behavior: "smooth", block: "start" });
    });
  };

  if (confirmation) {
    return (
      <div className="container section">
        <div className="booking-success">
          <CalendarDays size={58} color="#2563eb" />

          <h2>Request Submitted!</h2>

          <p>
            Your preferred time is pending confirmation. Check your
            consultation list or dashboard for status updates.
          </p>

          <div className="booking-receipt">
            <p>
              <strong>Booking ID:</strong> {confirmation.id}
            </p>

            <p>
              <strong>Name:</strong> {confirmation.fullName}
            </p>

            <p>
              <strong>Country:</strong>{" "}
              {countries.find(
                (country) => country.id === confirmation.country
              )?.name}
            </p>

            <p>
              <strong>Visa Category:</strong>{" "}
              {confirmation.visaType}
            </p>

            <p>
              <strong>Date:</strong> {confirmation.date}
            </p>

            <p>
              <strong>Time:</strong> {confirmation.time}
            </p>

            <p>
              <strong>Mode:</strong> {confirmation.mode}
            </p>

            <p>
              <strong>Status:</strong> {confirmation.status}
            </p>
          </div>

          <div className="consultation-actions">
            <button
              type="button"
              className="outline-btn"
              onClick={viewMyConsultations}
            >
              View My Consultations
            </button>

            <Link to="/dashboard" className="outline-btn">
              View Dashboard
            </Link>

            {isAdmin && (
              <Link to="/admin" className="outline-btn">
                Review / Approve Requests
              </Link>
            )}

            <button
              type="button"
              className="primary-btn"
              onClick={() => {
                setConfirmation(null);
                setForm({ ...initialForm });
                setError("");
              }}
            >
              Book Another Consultation
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container section">
      <div className="section-heading">
        <span>EXPERT GUIDANCE</span>

        <h2>Book a Visa Consultation</h2>

        <p>
          Select your preferred date and time for a consultation.
        </p>
      </div>

      <div className="consultation-wrapper">
        <div className="consultation-heading">
          <CalendarDays size={28} color="#2563eb" />

          <div>
            <h3>Schedule Your Appointment</h3>
            <p>All fields marked * are required.</p>
          </div>
        </div>

        <form onSubmit={handleSubmit}>
          {error && (
            <div className="form-error" role="alert">
              {error}
            </div>
          )}

          <div className="form-grid">
            <div className="form-field">
              <label>Full Name *</label>

              <input
                value={form.fullName}
                onChange={(e) =>
                  update("fullName", e.target.value)
                }
                placeholder="Enter your name"
              />
            </div>

            <div className="form-field">
              <label>Email Address *</label>

              <input
                type="email"
                value={form.email}
                onChange={(e) =>
                  update("email", e.target.value)
                }
                placeholder="Enter your email"
              />
            </div>

            <div className="form-field">
              <label>Phone Number *</label>

              <input
                type="tel"
                maxLength={10}
                value={form.phone}
                onChange={(e) =>
                  update("phone", e.target.value)
                }
                placeholder="10-digit phone number"
              />
            </div>

            <div className="form-field">
              <label>Destination Country *</label>

              <select
                value={form.country}
                onChange={(e) => {
                  setForm((previous) => ({
                    ...previous,
                    country: e.target.value,
                    visaType: "",
                  }));

                  setError("");
                }}
              >
                <option value="">Select Country</option>

                {countries.map((country) => (
                  <option
                    key={country.id}
                    value={country.id}
                  >
                    {country.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="form-field">
              <label>Visa Category *</label>

              <select
                value={form.visaType}
                onChange={(e) =>
                  update("visaType", e.target.value)
                }
              >
                <option value="">Select Visa Category</option>

                {selectedCountry?.categories.map((category) => (
                  <option
                    key={category}
                    value={category}
                  >
                    {category} Visa
                  </option>
                ))}
              </select>
            </div>

            <div className="form-field">
              <label>Consultation Mode *</label>

              <select
                value={form.mode}
                onChange={(e) =>
                  update("mode", e.target.value)
                }
              >
                <option value="Online">Online</option>
                <option value="Offline">Offline</option>
              </select>
            </div>

            <div className="form-field">
              <label>Preferred Date *</label>

              <input
                type="date"
                min={today()}
                value={form.date}
                onChange={(e) => {
                  setForm((previous) => ({
                    ...previous,
                    date: e.target.value,
                    time: "",
                  }));

                  setError("");
                }}
              />
            </div>

            <div className="form-field">
              <label>Preferred Time *</label>

              <select
                value={form.time}
                onChange={(e) =>
                  update("time", e.target.value)
                }
              >
                <option value="">Select Time</option>

                {timeSlots.map((time) => (
                  <option key={time} value={time}>
                    {time}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <p className="details-note">
            This is a demo request, not a confirmed appointment.
            An administrator must confirm it first. Times are
            interpreted in your browser's local timezone.
          </p>

          <div className="consultation-actions">
            <button
              type="submit"
              className="primary-btn"
              disabled={submitting}
            >
              <CalendarDays size={18} />

              {submitting
                ? "Submitting..."
                : "Request Consultation"}
            </button>
          </div>
        </form>
      </div>

      <div className="dashboard-section" id="my-consultations">
        <div className="dashboard-section-heading">
          <h2>Your Consultations</h2>
          {isAdmin && (
            <Link to="/admin" className="outline-btn">
              Review / Approve Requests
            </Link>
          )}
        </div>

        {myBookings.length === 0 ? (
          <div className="empty-state">
            <CalendarDays size={34} color="#64748b" />
            <h3>No Consultation Requests Yet</h3>
            <p>Your submitted requests and their statuses will appear here.</p>
          </div>
        ) : (
          <div className="dashboard-list">
            {myBookings.map((booking) => (
              <div className="dashboard-list-item" key={booking.id}>
                <div>
                  <h3>
                    {countries.find(
                      (country) => country.id === booking.country
                    )?.name || booking.country}{" "}
                    Consultation
                  </h3>
                  <p>
                    {booking.visaType} Visa — {booking.mode}
                  </p>
                  <p>{booking.date} at {booking.time}</p>
                  <small>
                    {booking.id} · {booking.latestUpdate || "Request received."}
                  </small>
                </div>

                <span className="status-label">{booking.status}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default Consultation;
