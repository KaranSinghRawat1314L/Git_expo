import axios from "axios";

const api = axios.create({
  baseURL:
    import.meta.env.VITE_API_URL,
});

export const getGithubUser = (
  username,
  page = 1
) => {
  return api.get(
    `/${username}?page=${page}&per_page=30`
  );
};