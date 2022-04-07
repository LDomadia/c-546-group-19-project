// update to whatever routes we need
const homeRoutes = require('./home');
const clothesRoutes = require('./clothes');

const constructorMethod = (app) => {

app.use('/home', homeRoutes);
app.use('/clothes', clothesRoutes);

app.use('*', (req, res) => {
  res.render('pages/error/error404', {error: "Page not found",
    id: 1,
    title: "Error 404"});
});
};

module.exports = constructorMethod;