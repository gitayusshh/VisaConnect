
import { useState } from "react";
import { Search, SlidersHorizontal, RotateCcw } from "lucide-react";
import countries from "../data/countries";
import CountryCard from "../components/CountryCard";

function Countries() {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");
  const [sortBy, setSortBy] = useState("name-asc");

  const getFee = (country) => {
    const fee = Number(
      String(country.fee ?? "0").replace(/[^0-9.]/g, "")
    );

    return Number.isFinite(fee) ? fee : 0;
  };

  const getProcessingDays = (country) => {
    const processing = String(country.processing ?? "");
    const match = processing.match(/\d+/);

    return match ? Number(match[0]) : Infinity;
  };

  const filteredCountries = countries
    .filter((country) => {
      const matchesSearch = country.name
        .toLowerCase()
        .includes(search.trim().toLowerCase());

      const matchesCategory =
        category === "All" ||
        country.categories.includes(category);

      return matchesSearch && matchesCategory;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case "name-asc":
          return a.name.localeCompare(b.name);

        case "name-desc":
          return b.name.localeCompare(a.name);

        case "fee-low":
          return getFee(a) - getFee(b);

        case "fee-high":
          return getFee(b) - getFee(a);

        case "processing":
          return getProcessingDays(a) - getProcessingDays(b);

        default:
          return 0;
      }
    });

  const resetFilters = () => {
    setSearch("");
    setCategory("All");
    setSortBy("name-asc");
  };

  return (
    <div className="container section">
      <div className="section-heading">
        <span>EXPLORE DESTINATIONS</span>
        <h2>Find Your Visa Destination</h2>
        <p>
          Search, filter and compare visa destinations based on
          your preferences.
        </p>
      </div>

      <div className="filter-bar">
        <div className="search-box">
          <Search size={20} />

          <input
            type="text"
            placeholder="Search countries..."
            aria-label="Search countries"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <select
          value={category}
          aria-label="Filter by visa category"
          onChange={(e) => setCategory(e.target.value)}
        >
          <option value="All">All Visa Types</option>
          <option value="Tourist">Tourist</option>
          <option value="Student">Student</option>
          <option value="Work">Work</option>
          <option value="Business">Business</option>
        </select>

        <div className="sort-select">
          <SlidersHorizontal size={18} />

          <select
            value={sortBy}
            aria-label="Sort countries"
            onChange={(e) => setSortBy(e.target.value)}
          >
            <option value="name-asc">Name: A to Z</option>
            <option value="name-desc">Name: Z to A</option>
            <option value="fee-low">Fee: Low to High</option>
            <option value="fee-high">Fee: High to Low</option>
            <option value="processing">Processing: Fastest First</option>
          </select>
        </div>
      </div>

      <div className="country-results-bar">
        <p>
          Showing <strong>{filteredCountries.length}</strong> of{" "}
          <strong>{countries.length}</strong> destinations
        </p>

        <button
          type="button"
          className="reset-filters-btn"
          onClick={resetFilters}
        >
          <RotateCcw size={16} />
          Reset Filters
        </button>
      </div>

      {filteredCountries.length > 0 ? (
        <div className="country-grid">
          {filteredCountries.map((country) => (
            <CountryCard key={country.id} country={country} />
          ))}
        </div>
      ) : (
        <div className="empty-state">
          <Search size={35} />
          <h3>No countries found</h3>
          <p>
            Try a different search term or visa category.
          </p>

          <button
            type="button"
            className="primary-btn"
            onClick={resetFilters}
          >
            Show All Countries
          </button>
        </div>
      )}
    </div>
  );
}

export default Countries;
