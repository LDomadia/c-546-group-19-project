// update to whatever routes we need
const closetRoutes = require('./closet');

const constructorMethod = (app) => {

app.use('', closetRoutes);

app.use('*', (req, res) => {
  res.render('pages/error/error404', {error: "Page not found",
    id: 1,
    title: "Error 404"});
});
};

module.exports = constructorMethod;