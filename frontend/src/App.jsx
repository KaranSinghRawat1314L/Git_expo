import { useMemo, useState } from "react";
import "./App.css";

import SearchBar from "./components/SearchBar";
import ProfileCard from "./components/ProfileCard";
import LoadingSpinner from "./components/LoadingSpinner";

import { getGithubUser } from "./api/github";

function App() {
  const [username, setUsername] = useState("");
  const [profile, setProfile] = useState(null);
  const [repos, setRepos] = useState([]);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [sortBy, setSortBy] = useState("stars");

  const handleSearch = async () => {
    if (!username.trim()) return;

    try {
      setLoading(true);
      setError("");

      const data = await getGithubUser(username);

      setProfile(data.data.profile);
      setRepos(data.data.repositories);
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Something went wrong"
      );
    } finally {
      setLoading(false);
    }
  };

  const sortedRepos = useMemo(() => {
    const copied = [...repos];

    switch (sortBy) {
      case "name":
        copied.sort((a, b) =>
          a.name.localeCompare(b.name)
        );
        break;

      case "updated":
        copied.sort(
          (a, b) =>
            new Date(b.updatedAt) -
            new Date(a.updatedAt)
        );
        break;

      case "stars":
      default:
        copied.sort((a, b) => b.stars - a.stars);
        break;
    }

    return copied;
  }, [repos, sortBy]);

  return (
    <div className="app">
      <h1 className="title">
        GitHub Repo Explorer
      </h1>

      <SearchBar
        username={username}
        setUsername={setUsername}
        handleSearch={handleSearch}
      />

      {loading && <LoadingSpinner />}

      {error && (
        <div className="error-box">{error}</div>
      )}

      {profile && (
        <>
          <ProfileCard profile={profile} />

          <div className="sort-container">
            <label>Sort By</label>

            <select
              value={sortBy}
              onChange={(e) =>
                setSortBy(e.target.value)
              }
            >
              <option value="stars">
                Stars
              </option>

              <option value="name">
                Name
              </option>

              <option value="updated">
                Last Updated
              </option>
            </select>
          </div>

          <div className="repo-list">
            {sortedRepos.map((repo) => (
              <RepoCard
                key={repo.id}
                repo={repo}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
}

function RepoCard({ repo }) {
  const [expanded, setExpanded] =
    useState(false);

  return (
    <div className="repo-card">
      <div
        className="repo-header"
        onClick={() =>
          setExpanded(!expanded)
        }
      >
        <div>
          <h3 className="repo-name">
            {repo.name}
          </h3>

          <p className="repo-description">
            {repo.description ||
              "No description available"}
          </p>
        </div>

        <button className="expand-btn">
          {expanded ? "▲" : "▼"}
        </button>
      </div>

      {expanded && (
        <div className="repo-details">
          <div className="detail-row">
            <span>Language</span>
            <span>{repo.language || "N/A"}</span>
          </div>

          <div className="detail-row">
            <span>Stars</span>
            <span>{repo.stars}</span>
          </div>

          <div className="detail-row">
            <span>Updated</span>
            <span>
              {new Date(
                repo.updatedAt
              ).toLocaleDateString()}
            </span>
          </div>

          <a
            href={repo.url}
            target="_blank"
            rel="noreferrer"
            className="repo-link"
          >
            View Repository
          </a>
        </div>
      )}
    </div>
  );
}

export default App;