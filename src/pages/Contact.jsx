
import { useState } from "react";
import { Mail, Phone, MapPin, Send, CheckCircle } from "lucide-react";

function Contact() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });

  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
    setError("");
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (
      !form.name.trim() ||
      !form.email.trim() ||
      !form.subject.trim() ||
      !form.message.trim()
    ) {
      setError("Please fill in all fields.");
      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      setError("Please enter a valid email address.");
      return;
    }

    const messages = JSON.parse(
      localStorage.getItem("contactMessages") || "[]"
    );

    localStorage.setItem(
      "contactMessages",
      JSON.stringify([
        ...messages,
        {
          ...form,
          id: Date.now(),
          createdAt: new Date().toISOString(),
        },
      ])
    );

    setSuccess(true);
    setError("");
    setForm({ name: "", email: "", subject: "", message: "" });
  };

  return (
    <div className="container section">
      <div className="section-heading">
        <span>GET IN TOUCH</span>
        <h2>Contact Us</h2>
        <p>Have questions about your visa journey? Send us a message.</p>
      </div>

      <div className="contact-grid">
        <div className="contact-info">
          <h2>We're Here to Help</h2>
          <p>
            Our consultation portal helps you explore destinations,
            understand visa services, and manage your applications.
          </p>

          <div className="contact-info-item">
            <Mail size={24} />
            <div>
              <h3>Email Support</h3>
              <p>support@visaconnect.example</p>
            </div>
          </div>

          <div className="contact-info-item">
            <Phone size={24} />
            <div>
              <h3>Phone</h3>
              <p>Demo contact — not available</p>
            </div>
          </div>

          <div className="contact-info-item">
            <MapPin size={24} />
            <div>
              <h3>Location</h3>
              <p>Online Visa Consultation Portal</p>
            </div>
          </div>

          <p className="details-note">
            VisaConnect is a demonstration project. Contact details
            are illustrative and no real support service is provided.
          </p>
        </div>

        <div className="contact-form-card">
          <h2>Send a Message</h2>

          {success && (
            <div className="contact-success">
              <CheckCircle size={20} />
              Message saved successfully in this browser (demo only).
            </div>
          )}

          {error && <div className="form-error">{error}</div>}

          <form onSubmit={handleSubmit}>
            <div className="form-field">
              <label>Full Name *</label>
              <input
                name="name"
                value={form.name}
                onChange={handleChange}
                placeholder="Enter your name"
              />
            </div>

            <div className="form-field">
              <label>Email Address *</label>
              <input
                name="email"
                type="email"
                value={form.email}
                onChange={handleChange}
                placeholder="Enter your email"
              />
            </div>

            <div className="form-field">
              <label>Subject *</label>
              <input
                name="subject"
                value={form.subject}
                onChange={handleChange}
                placeholder="How can we help?"
              />
            </div>

            <div className="form-field">
              <label>Message *</label>
              <textarea
                name="message"
                value={form.message}
                onChange={handleChange}
                rows={5}
                placeholder="Write your message..."
              />
            </div>

            <button type="submit" className="primary-btn contact-submit">
              <Send size={18} />
              Send Message
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default Contact;
