
import { useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { toast } from "react-toastify";
import { CheckCircle, ArrowLeft, ArrowRight } from "lucide-react";
import countries from "../data/countries";

const steps = [
  "Personal Details",
  "Travel Details",
  "Documents",
  "Review",
];

const today = () => {
  const date = new Date();
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
};

function ApplyVisa() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const selectedCountry = searchParams.get("country") || "";

  const [step, setStep] = useState(0);
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const [form, setForm] = useState({
    fullName: "",
    email: "",
    phone: "",
    dob: "",
    passportNumber: "",
    country: selectedCountry,
    visaType: "",
    purposeOfTravel: "",
    numberOfTravelers: "1",
    travelDate: "",
    returnDate: "",
    passport: "",
    photograph: "",
    bankStatement: "",
    supportingDocument: "",
  });

  const updateForm = (field, value) => {
    setForm((previous) => ({
      ...previous,
      [field]: value,
    }));

    setError("");
  };

  const selectedCountryData = countries.find(
    (country) => country.id === form.country
  );

  const showError = (message) => {
    setError(message);
    toast.error(message);
  };

  const validateStep = () => {
    if (step === 0) {
      if (
        !form.fullName.trim() ||
        !form.email.trim() ||
        !form.phone.trim() ||
        !form.dob ||
        !form.passportNumber.trim()
      ) {
        return "Please complete all personal details.";
      }

      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
        return "Please enter a valid email address.";
      }

      if (!/^[6-9]\d{9}$/.test(form.phone)) {
        return "Please enter a valid 10-digit phone number.";
      }

      if (
        !/^[A-Z0-9]{6,12}$/.test(
          form.passportNumber.trim().toUpperCase()
        )
      ) {
        return "Enter a valid passport number (6–12 letters or digits).";
      }

      if (form.dob >= today()) {
        return "Please enter a valid date of birth.";
      }
    }

    if (step === 1) {
      if (
        !form.country ||
        !form.visaType ||
        !form.purposeOfTravel.trim() ||
        !form.travelDate ||
        !form.returnDate
      ) {
        return "Please complete all travel details.";
      }

      if (!selectedCountryData?.categories.includes(form.visaType)) {
        return "Please select a valid visa category.";
      }

      const travelers = Number(form.numberOfTravelers);

      if (
        !Number.isInteger(travelers) ||
        travelers < 1 ||
        travelers > 20
      ) {
        return "Number of travelers must be between 1 and 20.";
      }

      if (form.travelDate < today()) {
        return "Travel date cannot be in the past.";
      }

      if (form.returnDate < form.travelDate) {
        return "Return date cannot be before travel date.";
      }
    }

    if (step === 2) {
      if (
        !form.passport ||
        !form.photograph ||
        !form.bankStatement
      ) {
        return "Please select your passport, photograph and bank statement.";
      }
    }

    return "";
  };

  const nextStep = () => {
    const message = validateStep();

    if (message) {
      showError(message);
      return;
    }

    setStep((previous) => Math.min(previous + 1, 3));
    setError("");
    window.scrollTo(0, 0);
  };

  const previousStep = () => {
    setStep((previous) => Math.max(previous - 1, 0));
    setError("");
    window.scrollTo(0, 0);
  };

  const handleFileChange = (field, event) => {
    const file = event.target.files?.[0];

    if (!file) {
      updateForm(field, "");
      return;
    }

    const allowedExtensions = [".pdf", ".jpg", ".jpeg", ".png"];
    const extension = file.name
      .slice(file.name.lastIndexOf("."))
      .toLowerCase();

    if (!allowedExtensions.includes(extension)) {
      event.target.value = "";
      updateForm(field, "");
      showError("Only PDF, JPG, JPEG and PNG files are allowed.");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      event.target.value = "";
      updateForm(field, "");
      showError("Each file must be 5 MB or smaller.");
      return;
    }

    updateForm(field, file.name);
  };

  const submitApplication = () => {
    if (submitting) return;

    setSubmitting(true);
    setError("");

    try {
      const existing = JSON.parse(
        localStorage.getItem("applications") || "[]"
      );

      if (!Array.isArray(existing)) {
        throw new Error("Invalid saved application data.");
      }

      const user = JSON.parse(
        localStorage.getItem("user") || "null"
      );

      const application = {
        ...form,
        passportNumber: form.passportNumber.trim().toUpperCase(),
        id: `VC-${Date.now()}-${Math.random()
          .toString(36)
          .slice(2, 6)
          .toUpperCase()}`,
        userId: user?.id ?? null,
        status: "Submitted",
        submittedAt: new Date().toISOString(),
        latestUpdate: "Application submitted successfully.",
      };

      localStorage.setItem(
        "applications",
        JSON.stringify([...existing, application])
      );

      toast.success(
        `Application submitted successfully! ID: ${application.id}`
      );

      navigate("/track", {
        state: {
          applicationId: application.id,
        },
      });
    } catch {
      showError("Unable to save your application. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="container section">
      <div className="section-heading">
        <span>VISA APPLICATION</span>
        <h2>Apply for Your Visa</h2>
        <p>
          Complete all four steps to submit your demo visa application.
        </p>
      </div>

      <div className="application-wrapper">
        <div className="application-steps">
          {steps.map((title, index) => (
            <div
              key={title}
              className={`application-step ${
                index === step ? "active" : ""
              } ${index < step ? "completed" : ""}`}
            >
              <span>{index < step ? "✓" : index + 1}</span>
              <small>{title}</small>
            </div>
          ))}
        </div>

        {error && (
          <div className="form-error" role="alert">
            {error}
          </div>
        )}

        {step === 0 && (
          <div className="form-grid">
            <div className="form-field">
              <label>Full Name *</label>
              <input
                value={form.fullName}
                onChange={(e) =>
                  updateForm("fullName", e.target.value)
                }
                placeholder="Enter full name"
              />
            </div>

            <div className="form-field">
              <label>Email Address *</label>
              <input
                type="email"
                value={form.email}
                onChange={(e) =>
                  updateForm("email", e.target.value)
                }
                placeholder="Enter email address"
              />
            </div>

            <div className="form-field">
              <label>Phone Number *</label>
              <input
                type="tel"
                maxLength={10}
                value={form.phone}
                onChange={(e) =>
                  updateForm("phone", e.target.value)
                }
                placeholder="10-digit mobile number"
              />
            </div>

            <div className="form-field">
              <label>Date of Birth *</label>
              <input
                type="date"
                max={today()}
                value={form.dob}
                onChange={(e) =>
                  updateForm("dob", e.target.value)
                }
              />
            </div>

            <div className="form-field">
              <label>Passport Number *</label>
              <input
                value={form.passportNumber}
                maxLength={12}
                onChange={(e) =>
                  updateForm(
                    "passportNumber",
                    e.target.value.toUpperCase()
                  )
                }
                placeholder="Enter sample passport number"
              />
            </div>
          </div>
        )}

        {step === 1 && (
          <div className="form-grid">
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
                  <option key={country.id} value={country.id}>
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
                  updateForm("visaType", e.target.value)
                }
              >
                <option value="">Select Visa Category</option>
                {selectedCountryData?.categories.map((category) => (
                  <option key={category} value={category}>
                    {category} Visa
                  </option>
                ))}
              </select>
            </div>

            <div className="form-field">
              <label>Purpose of Travel *</label>
              <textarea
                rows={3}
                value={form.purposeOfTravel}
                onChange={(e) =>
                  updateForm("purposeOfTravel", e.target.value)
                }
                placeholder="Describe your purpose of travel"
              />
            </div>

            <div className="form-field">
              <label>Number of Travelers *</label>
              <input
                type="number"
                min="1"
                max="20"
                step="1"
                value={form.numberOfTravelers}
                onChange={(e) =>
                  updateForm("numberOfTravelers", e.target.value)
                }
              />
            </div>

            <div className="form-field">
              <label>Expected Travel Date *</label>
              <input
                type="date"
                min={today()}
                value={form.travelDate}
                onChange={(e) =>
                  updateForm("travelDate", e.target.value)
                }
              />
            </div>

            <div className="form-field">
              <label>Expected Return Date *</label>
              <input
                type="date"
                min={form.travelDate || today()}
                value={form.returnDate}
                onChange={(e) =>
                  updateForm("returnDate", e.target.value)
                }
              />
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="form-grid">
            {[
              ["passport", "Passport *"],
              ["photograph", "Passport Photograph *"],
              ["bankStatement", "Bank Statement *"],
              ["supportingDocument", "Supporting Documents (Optional)"],
            ].map(([field, label]) => (
              <div className="form-field" key={field}>
                <label>{label}</label>
                <input
                  type="file"
                  accept=".pdf,.jpg,.jpeg,.png"
                  onChange={(e) =>
                    handleFileChange(field, e)
                  }
                />

                {form[field] && (
                  <small className="file-selected">
                    <CheckCircle size={15} />
                    {form[field]}
                  </small>
                )}
              </div>
            ))}

            <p className="details-note">
              Demo only: files are not uploaded to a server.
              Only filenames are stored in this browser.
              Use sample documents, not real passports or bank statements.
              Maximum file size: 5 MB.
            </p>
          </div>
        )}

        {step === 3 && (
          <div className="review-section">
            <h3>Review Your Application</h3>

            {[
              ["Full Name", form.fullName],
              ["Email", form.email],
              ["Phone", form.phone],
              ["Date of Birth", form.dob],
              ["Passport Number", form.passportNumber],
              ["Destination", selectedCountryData?.name],
              ["Visa Category", form.visaType],
              ["Purpose of Travel", form.purposeOfTravel],
              ["Number of Travelers", form.numberOfTravelers],
              ["Travel Date", form.travelDate],
              ["Return Date", form.returnDate],
              ["Passport Document", form.passport],
              ["Photograph", form.photograph],
              ["Bank Statement", form.bankStatement],
              [
                "Supporting Documents",
                form.supportingDocument || "Not provided",
              ],
            ].map(([label, value]) => (
              <div className="review-row" key={label}>
                <strong>{label}</strong>
                <span>{value}</span>
              </div>
            ))}

            <p className="details-note">
              This is a demonstration application.
              No actual visa application will be submitted.
              Use fictional personal details only.
            </p>
          </div>
        )}

        <div className="form-navigation">
          {step > 0 ? (
            <button
              type="button"
              className="outline-btn"
              onClick={previousStep}
            >
              <ArrowLeft size={17} />
              Previous
            </button>
          ) : (
            <span />
          )}

          {step < 3 ? (
            <button
              type="button"
              className="primary-btn"
              onClick={nextStep}
            >
              Next
              <ArrowRight size={17} />
            </button>
          ) : (
            <button
              type="button"
              className="primary-btn"
              onClick={submitApplication}
              disabled={submitting}
            >
              {submitting
                ? "Submitting..."
                : "Submit Application"}
              <CheckCircle size={17} />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

export default ApplyVisa;
