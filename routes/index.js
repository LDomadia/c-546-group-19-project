// update to whatever routes we need
const homeRoutes = require("./home");
const clothesRoutes = require("./clothes");
const outfitsRoutes = require("./outfits");
const statsRoutes = require("./stats");
const accountRoutes = require("./account");
const profileRoutes = require("./profile");
const outfitsRoutes = require("./outfits");

const constructorMethod = (app) => {
  app.use("/account", accountRoutes);

  app.use("/home", homeRoutes);
  app.use("/clothes", clothesRoutes);
  app.use("/outfits", outfitsRoutes);
  app.use("/profile", profileRoutes);
  app.use("/stats", statsRoutes);
  app.use("/outfits", outfitsRoutes);

  app.use("/", (req, res) => {
    res.redirect("/home");
  });

  app.use("*", (req, res) => {
    res.render("pages/error/error404", {
      error: "Page not found",
      id: 1,
      title: "Error 404",
    });
  });
};

module.exports = constructorMethod;
