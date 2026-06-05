const axios = require("axios");
const cache = require("../cache/memoryCache");

const GITHUB_BASE_URL = "https://api.github.com";

async function getGithubUser(username) {
  const cacheKey = `github:${username}`;

  const cachedData = cache.get(cacheKey);

  if (cachedData) {
    console.log("CACHE HIT");
    return cachedData;
  }

  console.log("CACHE MISS");

  try {
    const [profileResponse, repoResponse] = await Promise.all([
      axios.get(`${GITHUB_BASE_URL}/users/${username}`),
      axios.get(`${GITHUB_BASE_URL}/users/${username}/repos`)
    ]);

    const response = {
      profile: {
        login: profileResponse.data.login,
        name: profileResponse.data.name,
        avatarUrl: profileResponse.data.avatar_url,
        bio: profileResponse.data.bio,
        followers: profileResponse.data.followers,
        following: profileResponse.data.following,
        publicRepos: profileResponse.data.public_repos
      },

      repositories: repoResponse.data.map(repo => ({
        id: repo.id,
        name: repo.name,
        description: repo.description,
        stars: repo.stargazers_count,
        language: repo.language,
        updatedAt: repo.updated_at,
        url: repo.html_url
      }))
    };

    cache.set(cacheKey, response);

    return response;

  } catch (error) {

    if (error.response?.status === 404) {
      throw new Error("User not found");
    }

    if (error.response?.status === 403) {
      throw new Error("GitHub rate limit exceeded");
    }

    throw new Error("Failed to fetch GitHub data");
  }
}

module.exports = {
  getGithubUser
};