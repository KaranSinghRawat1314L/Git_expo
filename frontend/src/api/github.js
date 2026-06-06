import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:5000/api/github",
});

export const getGithubUser = async (username) => {
  const response = await api.get(`/${username}`);
  return response.data;
};