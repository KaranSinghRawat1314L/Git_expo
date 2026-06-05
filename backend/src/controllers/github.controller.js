const githubService = require("../services/github.service");

async function getUser(req, res) {
  try {

    const { username } = req.params;

    const data = await githubService.getGithubUser(username);

    res.status(200).json({
      success: true,
      data
    });

  } catch (error) {

    res.status(400).json({
      success: false,
      message: error.message
    });

  }
}

module.exports = {
  getUser
};