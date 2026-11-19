
import { Link, useParams } from "react-router-dom";
import { ArrowLeft, ArrowRight, Clock, FileText, CheckCircle } from "lucide-react";
import countries from "../data/countries";

function CountryDetails() {
  const { id } = useParams();

  const country = countries.find((item) => item.id === id);

  if (!country) {
    return (
      <div className="container section">
        <h2>Country not found</h2>
        <Link to="/countries">Back to Countries</Link>
      </div>
    );
  }

  const documents = [
    "Valid passport",
    "Recent passport-size photograph",
    "Completed visa application form",
    "Proof of financial support",
    "Travel itinerary or admission/employment documents",
  ];

  return (
    <div className="container section">
      <Link to="/countries" className="back-link">
        <ArrowLeft size={18} /> Back to Countries
      </Link>

      <div className="details-header">
        <div>
          <h1>{country.name}</h1>
          <p>{country.purpose}</p>
        </div>
        <span className="details-flag">{country.flag}</span>
      </div>

      <div className="details-grid">
        <div className="details-card">
          <Clock size={28} color="#2563eb" />
          <h3>Processing Time</h3>
          <p>{country.processing}</p>
        </div>

        <div className="details-card">
          <FileText size={28} color="#2563eb" />
          <h3>Consultation Fee</h3>
          <p>₹{country.fee}</p>
        </div>
      </div>

      <div className="details-section">
        <h2>Available Visa Categories</h2>
        <div className="country-categories">
          {country.categories.map((category) => (
            <span key={category}>{category} Visa</span>
          ))}
        </div>
      </div>

      <div className="details-section">
        <h2>Required Documents</h2>
        <p className="details-note">
          General examples only. Actual requirements depend on
          the destination, visa category, and applicant.
        </p>

        {documents.map((document) => (
          <div className="document-item" key={document}>
            <CheckCircle size={19} color="#16a34a" />
            <span>{document}</span>
          </div>
        ))}
      </div>

      <div className="details-section">
        <h2>Basic Eligibility</h2>
        <p>
          Applicants should have a valid passport, a genuine
          travel purpose, sufficient supporting documents,
          and meet the destination's visa requirements.
        </p>
      </div>

      <div className="details-actions">
        <Link to={`/apply?country=${country.id}`} className="primary-btn">
          Apply Now <ArrowRight size={18} />
        </Link>

        <Link to="/consultation" className="outline-btn">
          Book Consultation
        </Link>
      </div>

      <p className="details-note">
        Note: Fees and processing times are illustrative demo values,
        not official government estimates.
      </p>
    </div>
  );
}

export default CountryDetails;
