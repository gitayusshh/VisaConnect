
import { Link } from "react-router-dom";
import { Clock, ArrowRight } from "lucide-react";

function CountryCard({ country }) {
  return (
    <div className="country-card">
      {/* <div className="country-flag">{country.flag}</div> */}

      <div className="country-flag">
  <img
    src={`https://flagcdn.com/w80/${country.id === "uk" ? "gb" : country.id === "usa" ? "us" : country.id === "uae" ? "ae" : country.id === "australia" ? "au" : country.id === "germany" ? "de" : country.id === "france" ? "fr" : "ca"}.png`}
    alt={`${country.name} flag`}
    width="64"
    height="42"
    style={{ objectFit: "contain" }}
  />
</div>

      <h3>{country.name}</h3>
      <p>{country.purpose}</p>

      <div className="country-categories">
        {country.categories.map((category) => (
          <span key={category}>{category}</span>
        ))}
      </div>

      <div className="country-info">
        <span>
          <Clock size={16} />
          {country.processing}
        </span>
        <strong>₹{country.fee}</strong>
      </div>

      <Link to={`/countries/${country.id}`} className="details-link">
        View Details <ArrowRight size={16} />
      </Link>
    </div>
  );
}

export default CountryCard;
