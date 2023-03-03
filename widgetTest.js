
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


