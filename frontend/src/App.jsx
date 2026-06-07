import { useMemo, useState } from "react";
import "./App.css";

import SearchBar from "./components/SearchBar";
import ProfileCard from "./components/ProfileCard";
import LoadingSpinner from "./components/LoadingSpinner";

import { getGithubUser } from "./api/github";

function RepoCard({ repo }) {
  const [expanded, setExpanded] = useState(false);

  return (
    <div className="repo-card">
      <div
        className="repo-header"
        onClick={() => setExpanded(!expanded)}
      >
        <div>
          <h3 className="repo-name">{repo.name}</h3>

          <p className="repo-description">
            {repo.description || "No description available"}
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
            <span>Last Updated</span>
            <span>
              {new Date(repo.updatedAt).toLocaleDateString()}
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

function App() {
  const [username, setUsername] = useState("");

  const [profile, setProfile] = useState(null);

  const [repos, setRepos] = useState([]);

  const [loading, setLoading] = useState(false);

  const [loadingMore, setLoadingMore] =
    useState(false);

  const [error, setError] = useState("");

  const [page, setPage] = useState(1);

  const [hasMore, setHasMore] = useState(false);

  const [sortBy, setSortBy] = useState("stars");

  const [recentSearches, setRecentSearches] =
    useState(() => {
      return (
        JSON.parse(
          localStorage.getItem(
            "recentSearches"
          )
        ) || []
      );
    });

  const handleSearch = async (
    searchUsername = username
  ) => {
    if (!searchUsername.trim()) return;

    try {
      setLoading(true);
      setError("");

      const response =
        await getGithubUser(
          searchUsername,
          1
        );

      const data = response.data.data;

      setProfile(data.profile);

      setRepos(data.repositories);

      setPage(1);

      setHasMore(data.hasMore);

      const updatedSearches = [
        searchUsername,
        ...recentSearches.filter(
          (item) =>
            item !== searchUsername
        ),
      ].slice(0, 5);

      setRecentSearches(updatedSearches);

      localStorage.setItem(
        "recentSearches",
        JSON.stringify(updatedSearches)
      );
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Something went wrong"
      );

      setProfile(null);

      setRepos([]);
    } finally {
      setLoading(false);
    }
  };

  const handleLoadMore = async () => {
    try {
      setLoadingMore(true);

      const nextPage = page + 1;

      const response =
        await getGithubUser(
          username,
          nextPage
        );

      const data = response.data.data;

      setRepos((prevRepos) => [
        ...prevRepos,
        ...data.repositories,
      ]);

      setPage(nextPage);

      setHasMore(data.hasMore);
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingMore(false);
    }
  };

  const sortedRepos = useMemo(() => {
    const copiedRepos = [...repos];

    switch (sortBy) {
      case "name":
        copiedRepos.sort((a, b) =>
          a.name.localeCompare(b.name)
        );
        break;

      case "updated":
        copiedRepos.sort(
          (a, b) =>
            new Date(b.updatedAt) -
            new Date(a.updatedAt)
        );
        break;

      case "stars":
      default:
        copiedRepos.sort(
          (a, b) => b.stars - a.stars
        );
        break;
    }

    return copiedRepos;
  }, [repos, sortBy]);

  return (
    <div className="app">
      <h1 className="title">
        GitHub Repo Explorer
      </h1>

      <SearchBar
        username={username}
        setUsername={setUsername}
        handleSearch={() =>
          handleSearch(username)
        }
      />

      {recentSearches.length > 0 && (
        <div className="recent-searches">
          <h3>Recent Searches</h3>

          <div className="recent-list">
            {recentSearches.map((user) => (
              <button
                key={user}
                className="recent-chip"
                onClick={() => {
                  setUsername(user);
                  handleSearch(user);
                }}
              >
                {user}
              </button>
            ))}
          </div>
        </div>
      )}

      {loading && <LoadingSpinner />}

      {error && (
        <div className="error-box">
          {error}
        </div>
      )}

      {profile && (
        <>
          <ProfileCard profile={profile} />

          <div className="sort-container">
            <label>Sort By</label>

            <select
              value={sortBy}
              onChange={(e) =>
                setSortBy(
                  e.target.value
                )
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

          {hasMore && (
            <div className="load-more-container">
              <button
                className="load-more-btn"
                onClick={
                  handleLoadMore
                }
                disabled={loadingMore}
              >
                {loadingMore
                  ? "Loading..."
                  : "Load More"}
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}

export default App;