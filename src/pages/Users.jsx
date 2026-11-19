
import { useEffect, useState } from "react";
import {
  Users as UsersIcon,
  Search,
  RefreshCw,
  AlertCircle,
  Mail,
} from "lucide-react";

function Users() {
  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchUsers = async (signal) => {
    setLoading(true);
    setError("");

    try {
      const response = await fetch(
        "https://dummyjson.com/users?limit=30",
        { signal }
      );

      if (!response.ok) {
        throw new Error("Unable to fetch users.");
      }

      const data = await response.json();

      if (!Array.isArray(data.users)) {
        throw new Error("Invalid API response.");
      }

      setUsers(data.users);
    } catch (err) {
      if (err.name === "AbortError") return;

      setError(
        "Unable to load users. Please check your internet connection and try again."
      );
    } finally {
      if (!signal?.aborted) {
        setLoading(false);
      }
    }
  };

  useEffect(() => {
    const controller = new AbortController();

    fetchUsers(controller.signal);

    return () => controller.abort();
  }, []);

  const filteredUsers = users.filter((user) => {
    const fullName =
      `${user.firstName} ${user.lastName}`.toLowerCase();

    return (
      fullName.includes(search.toLowerCase()) ||
      user.email.toLowerCase().includes(search.toLowerCase())
    );
  });

  return (
    <div className="container section">
      <div className="section-heading">
        <span>API INTEGRATION</span>
        <h2>Users Directory</h2>
        <p>
          Explore sample user profiles fetched from the DummyJSON API.
        </p>
      </div>

      <div className="users-api-note">
        <UsersIcon size={21} />
        <p>
          These are public sample profiles provided by DummyJSON.
          They are not actual VisaConnect customers.
        </p>
      </div>

      <div className="users-toolbar">
        <div className="search-box">
          <Search size={19} />

          <input
            type="text"
            placeholder="Search users by name or email..."
            aria-label="Search users"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <button
          type="button"
          className="outline-btn"
          onClick={() => fetchUsers()}
          disabled={loading}
        >
          <RefreshCw size={17} />
          Refresh
        </button>
      </div>

      {loading && (
        <div className="users-feedback" role="status">
          <div className="users-spinner" />
          <h3>Loading Users...</h3>
          <p>Fetching sample profiles from the API.</p>
        </div>
      )}

      {!loading && error && (
        <div className="users-feedback" role="alert">
          <AlertCircle size={36} color="#dc2626" />
          <h3>Something Went Wrong</h3>
          <p>{error}</p>

          <button
            className="primary-btn"
            onClick={() => fetchUsers()}
          >
            <RefreshCw size={17} />
            Try Again
          </button>
        </div>
      )}

      {!loading && !error && (
        <>
          <p className="users-result-count">
            Showing {filteredUsers.length} sample users
          </p>

          {filteredUsers.length > 0 ? (
            <div className="users-grid">
              {filteredUsers.map((user) => (
                <div className="user-profile-card" key={user.id}>
                  <img
                    src={user.image}
                    alt={`${user.firstName} ${user.lastName}`}
                    loading="lazy"
                  />

                  <h3>
                    {user.firstName} {user.lastName}
                  </h3>

                  <p className="user-profile-email">
                    <Mail size={15} />
                    {user.email}
                  </p>

                  <span className="user-profile-id">
                    Sample User #{user.id}
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <div className="empty-state">
              <Search size={32} />
              <h3>No Users Found</h3>
              <p>Try searching with another name or email.</p>
            </div>
          )}
        </>
      )}
    </div>
  );
}

export default Users;
