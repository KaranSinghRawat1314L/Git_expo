import { useState } from "react";
import "./App.css";

import SearchBar from "./components/SearchBar";
import ProfileCard from "./components/ProfileCard";
import LoadingSpinner from "./components/LoadingSpinner";

import { getGithubUser } from "./api/github";

function App() {
  const [username, setUsername] = useState("");

  const [profile, setProfile] = useState(null);

  const [loading, setLoading] = useState(false);

  const [error, setError] = useState("");

  const handleSearch = async () => {
    if (!username.trim()) return;

    try {
      setLoading(true);
      setError("");
      setProfile(null);

      const data = await getGithubUser(username);

      setProfile(data.data.profile);
    } catch (err) {
      setError(
        err.response?.data?.message ||
        "Something went wrong"
      );
    } finally {
      setLoading(false);
    }
  };

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
        <div className="error-box">
          {error}
        </div>
      )}

      {profile && (
        <ProfileCard profile={profile} />
      )}

    </div>
  );
}

export default App;