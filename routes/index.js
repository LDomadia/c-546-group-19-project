// update to whatever routes we need
const homeRoutes = require("./home");
const clothesRoutes = require("./clothes");
const accountRoutes = require("./account");

const constructorMethod = (app) => {
  app.use("/account", accountRoutes);

  app.use("/home", homeRoutes);
  app.use("/clothes", clothesRoutes);

  //TODO - move this to more apporiate file
  app.use("/signup", async (req, res) => {
    try {
      res.render("pages/medium/signup", { title: "Sign Up" });
    } catch (e) {
      res.sendStatus(500);
    }
  });

  app.use("/login", async (req, res) => {
    try {
      res.render("pages/medium/login", { title: "Log In" });
    } catch (e) {
      res.sendStatus(500);
    }
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
