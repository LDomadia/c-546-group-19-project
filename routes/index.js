// update to whatever routes we need
// const bandRoutes = require('./bands');
// const albumRoutes = require('./albums');

const constructorMethod = (app) => {
// same here
//   app.use('/bands', bandRoutes);
//   app.use('/albums', albumRoutes);

  app.use('*', (req, res) => {
    res.sendStatus(404);
  });
};

module.exports = constructorMethod;