const axios = require("axios");
const cache = require("../cache/memoryCache");

const GITHUB_BASE_URL = "https://api.github.com";

async function getGithubUser(
  username,
  page = 1,
  perPage = 30
) {
  const cacheKey = `github:${username}:${page}:${perPage}`;

  const cachedData = cache.get(cacheKey);

  if (cachedData) {
    console.log("CACHE HIT");
    return cachedData;
  }

  console.log("CACHE MISS");

  try {
    const profilePromise =
      page === 1
        ? axios.get(
            `${GITHUB_BASE_URL}/users/${username}`
          )
        : Promise.resolve(null);

    const reposPromise = axios.get(
      `${GITHUB_BASE_URL}/users/${username}/repos`,
      {
        params: {
          page,
          per_page: perPage,
        },
      }
    );

    const [profileResponse, repoResponse] =
      await Promise.all([
        profilePromise,
        reposPromise,
      ]);

    const repositories = repoResponse.data.map(
      (repo) => ({
        id: repo.id,
        name: repo.name,
        description: repo.description,
        stars: repo.stargazers_count,
        language: repo.language,
        updatedAt: repo.updated_at,
        url: repo.html_url,
      })
    );

    const response = {
      profile: profileResponse
        ? {
            login: profileResponse.data.login,
            name: profileResponse.data.name,
            avatarUrl:
              profileResponse.data.avatar_url,
            bio: profileResponse.data.bio,
            followers:
              profileResponse.data.followers,
            following:
              profileResponse.data.following,
            publicRepos:
              profileResponse.data.public_repos,
          }
        : null,

      repositories,

      page,

      hasMore:
        repositories.length === perPage,
    };

    cache.set(cacheKey, response);

    return response;
  } catch (error) {
    if (error.response?.status === 404) {
      throw new Error("User not found");
    }

    if (error.response?.status === 403) {
      throw new Error(
        "GitHub rate limit exceeded"
      );
    }

    throw new Error(
      "Failed to fetch GitHub data"
    );
  }
}

module.exports = {
  getGithubUser,
};