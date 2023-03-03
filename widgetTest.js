
// 1. Define the data model for Widget Factory, Widget, and User objects.

const { Sequelize, DataTypes } = require('sequelize');
const sequelize = new Sequelize('sqlite::memory:');

// User model
const User = sequelize.define('User', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  username: {
    type: DataTypes.STRING,
    allowNull: false
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false
  }
});

// WidgetFactory model
const WidgetFactory = sequelize.define('WidgetFactory', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false
  },
  location: {
    type: DataTypes.STRING,
    allowNull: false
  }
});

// Widget model
const Widget = sequelize.define('Widget', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false
  },
  price: {
    type: DataTypes.FLOAT,
    allowNull: false
  },
  factoryId: {
    type: DataTypes.INTEGER,
    allowNull: false
  }
});

// WidgetFactory and Widget associations
WidgetFactory.hasMany(Widget);
Widget.belongsTo(WidgetFactory);

// Exporting the models
module.exports = {
  User,
  WidgetFactory,
  Widget
};

// MY NEXT LINE ITEM WILL BE: 2 - Define a microservice API to create, update, and delete Widget Factories.






// 2. Define a microservice API to create, update, and delete Widget Factories.

const express = require('express');
const bodyParser = require('body-parser');
const factoryRouter = express.Router();
factoryRouter.use(bodyParser.json());

// Define the factory object model
const Factory = require('./models/factory');

// Create a new factory
factoryRouter.post('/', (req, res, next) => {
  Factory.create({
    name: req.body.name,
    location: req.body.location
  })
    .then((factory) => {
      console.log('Factory created: ', factory);
      res.statusCode = 200;
      res.setHeader('Content-Type', 'application/json');
      res.json(factory);
    }, (err) => next(err))
    .catch((err) => next(err));
});

// Get all factories
factoryRouter.get('/', (req, res, next) => {
  Factory.findAll({})
    .then((factories) => {
      res.statusCode = 200;
      res.setHeader('Content-Type', 'application/json');
      res.json(factories);
    }, (err) => next(err))
    .catch((err) => next(err));
});

// Get a specific factory by id
factoryRouter.get('/:factoryId', (req, res, next) => {
  Factory.findByPk(req.params.factoryId)
    .then((factory) => {
      res.statusCode = 200;
      res.setHeader('Content-Type', 'application/json');
      res.json(factory);
    }, (err) => next(err))
    .catch((err) => next(err));
});

// Update a factory by id
factoryRouter.put('/:factoryId', (req, res, next) => {
  Factory.update({
    name: req.body.name,
    location: req.body.location
  }, {
    where: {
      id: req.params.factoryId
    }
  })
    .then((result) => {
      console.log('Factory updated: ', result);
      res.statusCode = 200;
      res.setHeader('Content-Type', 'application/json');
      res.json({ status: 'success' });
    }, (err) => next(err))
    .catch((err) => next(err));
});

// Delete a factory by id
factoryRouter.delete('/:factoryId', (req, res, next) => {
  Factory.destroy({
    where: {
      id: req.params.factoryId
    }
  })
    .then((result) => {
      console.log('Factory deleted: ', result);
      res.statusCode = 200;
      res.setHeader('Content-Type', 'application/json');
      res.json({ status: 'success' });
    }, (err) => next(err))
    .catch((err) => next(err));
});

// Export the factoryRouter
module.exports = factoryRouter;

// MY NEXT LINE ITEM WILL BE: 3 - Define a microservice API to create, update, and delete Widgets for each Widget Factory.






