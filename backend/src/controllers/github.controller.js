const githubService = require("../services/github.service");

async function getUser(req, res) {
  try {
    const { username } = req.params;

    const page = Number(req.query.page) || 1;
    const perPage = Number(req.query.per_page) || 30;

    const data = await githubService.getGithubUser(
      username,
      page,
      perPage
    );

    return res.status(200).json({
      success: true,
      data,
    });

  } catch (error) {
    return res.status(400).json({
      success: false,
      message: error.message,
    });
  }
}

module.exports = {
  getUser,
};