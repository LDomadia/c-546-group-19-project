// update to whatever routes we need
const homeRoutes = require("./home");
const clothesRoutes = require("./clothes");
const statsRoutes = require("./stats");
const accountRoutes = require("./account");
const profileRoutes = require("./profile");
const calRoutes = require("./calendar")

const constructorMethod = (app) => {
  app.use("/account", accountRoutes);

  app.use("/home", homeRoutes);
  app.use("/clothes", clothesRoutes);
  app.use("/profile",profileRoutes);
  app.use("/stats", statsRoutes);
  app.use("/calendar",calRoutes);

  app.use("*", (req, res) => {
    res.render("pages/error/error404", {
      error: "Page not found",
      id: 1,
      title: "Error 404",
    });
  });
};

module.exports = constructorMethod;
