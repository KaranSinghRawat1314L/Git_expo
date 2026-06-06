function SearchBar({ username, setUsername, handleSearch }) {
  return (
    <div className="search-container">
      <input
        type="text"
        placeholder="Enter GitHub username"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        className="search-input"
      />

      <button
        onClick={handleSearch}
        className="search-button"
      >
        Search
      </button>
    </div>
  );
}

export default SearchBar;