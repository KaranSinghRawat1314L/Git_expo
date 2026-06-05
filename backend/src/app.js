const express = require("express");
const cors = require("cors");
const morgan = require("morgan");

const githubRoutes = require("./routes/github.routes");

const app = express();
app.use(morgan("dev"));
app.use(cors());
app.use(express.json());

app.use("/api/github", githubRoutes);

const PORT = 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});