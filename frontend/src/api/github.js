import axios from "axios";

const api = axios.create({
  baseURL:
    "http://localhost:5000/api/github",
});

export const getGithubUser = (
  username,
  page = 1
) => {
  return api.get(
    `/${username}?page=${page}&per_page=30`
  );
};