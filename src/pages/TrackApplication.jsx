
import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import {
  Search,
  CheckCircle,
  Clock,
  FileText,
  AlertCircle,
  ArrowRight,
} from "lucide-react";
import countries from "../data/countries";

const stages = [
  "Application Submitted",
  "Documents Verification",
  "Under Review",
  "Decision / Completed",
];

const demoApplications = [
  {
    id: "VC-DEMO001",
    fullName: "Rahul Sharma",
    country: "usa",
    visaType: "Tourist",
    status: "Submitted",
    submittedAt: "2026-11-10T10:30:00",
    latestUpdate: "Application submitted successfully.",
    demo: true,
  },
  {
    id: "VC-DEMO002",
    fullName: "Priya Verma",
    country: "canada",
    visaType: "Student",
    status: "Documents Verified",
    submittedAt: "2026-11-08T09:00:00",
    latestUpdate: "Documents verified successfully.",
    demo: true,
  },
  {
    id: "VC-DEMO003",
    fullName: "Aman Gupta",
    country: "uk",
    visaType: "Work",
    status: "Under Review",
    submittedAt: "2026-11-05T14:00:00",
    latestUpdate: "Application is currently under review.",
    demo: true,
  },
  {
    id: "VC-DEMO004",
    fullName: "Neha Singh",
    country: "australia",
    visaType: "Tourist",
    status: "Completed",
    submittedAt: "2026-10-28T11:15:00",
    latestUpdate: "Application processing completed.",
    demo: true,
  },
  {
    id: "VC-DEMO005",
    fullName: "Karan Mehta",
    country: "germany",
    visaType: "Business",
    status: "Rejected",
    submittedAt: "2026-10-25T12:00:00",
    latestUpdate: "A decision has been recorded for this application.",
    demo: true,
  },
];

function getStoredApplications() {
  try {
    const data = JSON.parse(
      localStorage.getItem("applications") || "[]"
    );

    return Array.isArray(data) ? data : [];
  } catch {
    return [];
  }
}

function getCurrentStage(status) {
  switch (status) {
    case "Submitted":
    case "Application Submitted":
      return 0;

    case "Documents Verification":
    case "Documents Verified":
      return 1;

    case "Under Review":
    case "Processing":
    case "In Process":
      return 2;

    case "Completed":
    case "Approved":
    case "Rejected":
      return 3;

    default:
      return 0;
  }
}

function getLatestUpdate(application) {
  if (application.latestUpdate) {
    return application.latestUpdate;
  }

  switch (application.status) {
    case "Submitted":
      return "Your application has been submitted successfully.";

    case "Documents Verified":
      return "Your documents have been verified.";

    case "Under Review":
      return "Your application is being reviewed.";

    case "Processing":
      return "Your application is currently being processed.";

    case "Approved":
      return "Your application has been approved.";

    case "Rejected":
      return "A decision has been recorded for your application.";

    case "Completed":
      return "Your application processing is complete.";

    default:
      return "Application status is available.";
  }
}

function TrackApplication() {
  const location = useLocation();

  const [applicationId, setApplicationId] = useState(
    location.state?.applicationId || ""
  );

  const [application, setApplication] = useState(null);
  const [searchResults, setSearchResults] = useState([]);
  const [error, setError] = useState("");

  const findApplication = (query) => {
    const searchText = query.trim().toLowerCase();

    if (!searchText) {
      setApplication(null);
      setSearchResults([]);
      setError("Please enter an application ID, name, country, or visa type.");
      return;
    }

    const allApplications = [
      ...getStoredApplications(),
      ...demoApplications,
    ];

    const matches = allApplications.filter((item) => {
      const countryName =
        countries.find((countryItem) => countryItem.id === item.country)
          ?.name || item.country;
      const searchableFields = [
        item.id,
        item.fullName,
        item.country,
        countryName,
        item.visaType,
      ];

      return searchableFields.some((field) =>
        String(field || "").toLowerCase().includes(searchText)
      );
    });

    if (matches.length === 1) {
      setApplication(matches[0]);
      setSearchResults([]);
      setError("");
    } else if (matches.length > 1) {
      setApplication(null);
      setSearchResults(matches);
      setError("");
    } else {
      setApplication(null);
      setSearchResults([]);
      setError("No application found matching your search.");
    }
  };

  const selectSearchResult = (result) => {
    setApplicationId(result.id);
    setApplication(result);
    setSearchResults([]);
    setError("");
  };

  const formatDate = (date) => {
    if (!date) return "Not available";

    const parsed = new Date(date);

    return Number.isNaN(parsed.getTime())
      ? "Not available"
      : parsed.toLocaleDateString();
  };

  useEffect(() => {
    const id = location.state?.applicationId;

    if (id) {
      setApplicationId(id);
      findApplication(id);
    }
  }, [location.state]);

  const country = countries.find(
    (item) => item.id === application?.country
  );

  const currentStage = application
    ? getCurrentStage(application.status)
    : -1;

  const isRejected = application?.status === "Rejected";

  return (
    <div className="container section">
      <div className="section-heading">
        <span>APPLICATION TRACKING</span>
        <h2>Track Your Visa Application</h2>
        <p>
          Search by application ID, applicant name, country, or visa type.
        </p>
      </div>

      <div className="tracking-wrapper">
        <form
          className="tracking-search"
          onSubmit={(event) => {
            event.preventDefault();
            findApplication(applicationId);
          }}
        >
          <input
            type="text"
            placeholder="Search ID, name, country, or visa type"
            aria-label="Search applications"
            value={applicationId}
            onChange={(e) => {
              setApplicationId(e.target.value);
              setError("");
              setApplication(null);
              setSearchResults([]);
            }}
          />

          <button type="submit" className="primary-btn">
            <Search size={18} />
            Search Applications
          </button>
        </form>

        {error && (
          <div className="form-error" role="alert">
            <AlertCircle size={18} />
            {error}
          </div>
        )}

        {searchResults.length > 0 && (
          <div className="tracking-demo-section">
            <h3>Select an Application</h3>
            <div className="tracking-demo-grid">
              {searchResults.map((result) => (
                <button
                  key={result.id}
                  type="button"
                  className="tracking-demo-card"
                  onClick={() => selectSearchResult(result)}
                >
                  <strong>{result.id}</strong>
                  <span>{result.fullName}</span>
                  <small>
                    {countries.find(
                      (countryItem) => countryItem.id === result.country
                    )?.name || result.country}{" "}
                    · {result.visaType}
                  </small>
                  <span className="tracking-demo-action">
                    View Status <ArrowRight size={15} />
                  </span>
                </button>
              ))}
            </div>
          </div>
        )}

        <div className="tracking-demo-section">
          <h3>Try Demo Application Tracking</h3>

          <p>
            Select a sample application to explore different statuses.
          </p>

          <div className="tracking-demo-grid">
            {demoApplications.map((demo) => (
              <button
                key={demo.id}
                type="button"
                className="tracking-demo-card"
                onClick={() => {
                  setApplicationId(demo.id);
                  findApplication(demo.id);
                }}
              >
                <strong>{demo.id}</strong>
                <span>{demo.fullName}</span>
                <small>{demo.status}</small>

                <span className="tracking-demo-action">
                  View Status <ArrowRight size={15} />
                </span>
              </button>
            ))}
          </div>
        </div>

        {application && (
          <div className="tracking-result">
            <div className="tracking-summary">
              <h3>Application Details</h3>

              {application.demo && (
                <p className="tracking-demo-badge">
                  Sample Application
                </p>
              )}

              <p>
                <strong>Application ID:</strong>{" "}
                {application.id}
              </p>

              <p>
                <strong>Applicant:</strong>{" "}
                {application.fullName}
              </p>

              <p>
                <strong>Destination:</strong>{" "}
                {country?.name || application.country}
              </p>

              <p>
                <strong>Visa Category:</strong>{" "}
                {application.visaType}
              </p>

              <p>
                <strong>Application Date:</strong>{" "}
                {formatDate(application.submittedAt)}
              </p>

              <p>
                <strong>Current Status:</strong>{" "}
                <span
                  className={`status-label ${
                    isRejected ? "tracking-rejected" : ""
                  }`}
                >
                  {application.status}
                </span>
              </p>
            </div>

            <div className="tracking-timeline">
              <h3>Application Progress</h3>

              {stages.map((stage, index) => {
                const finished = index < currentStage;
                const current = index === currentStage;

                return (
                  <div className="timeline-item" key={stage}>
                    <div
                      className={`timeline-icon ${
                        finished || current ? "finished" : ""
                      } ${
                        current && isRejected
                          ? "tracking-rejected-icon"
                          : ""
                      }`}
                    >
                      {finished || current ? (
                        <CheckCircle size={20} />
                      ) : (
                        <Clock size={20} />
                      )}
                    </div>

                    <div>
                      <h4>{stage}</h4>

                      <p>
                        {finished
                          ? "Completed"
                          : current
                          ? isRejected
                            ? "Decision: Rejected"
                            : application.status === "Approved"
                            ? "Decision: Approved"
                            : "Current Stage"
                          : "Pending"}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="tracking-latest-update">
              <Clock size={21} />

              <div>
                <h4>Latest Update</h4>
                <p>{getLatestUpdate(application)}</p>
              </div>
            </div>

            <div className="tracking-note">
              <FileText size={20} />

              <p>
                This is a simulated application tracking system.
                Status updates are for demonstration purposes only.
                No real visa processing takes place.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default TrackApplication;
