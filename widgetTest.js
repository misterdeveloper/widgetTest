
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









// Line Item 3: Define a microservice API to create, update, and delete Widgets for each Widget Factory.

// Import necessary packages
const express = require('express');
const bodyParser = require('body-parser');
const Sequelize = require('sequelize');

// Create an instance of the express app
const app = express();

// Set up bodyParser middleware
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// Connect to the database
const sequelize = new Sequelize('database', 'username', 'password', {
  host: 'localhost',
  dialect: 'sqlite',
  storage: 'database.sqlite'
});

// Define Widget model
const Widget = sequelize.define('widget', {
  name: {
    type: Sequelize.STRING,
    allowNull: false
  },
  description: {
    type: Sequelize.TEXT,
    allowNull: false
  },
  price: {
    type: Sequelize.FLOAT,
    allowNull: false
  },
  factoryId: {
    type: Sequelize.INTEGER,
    allowNull: false
  }
});

// Define route to create a widget
app.post('/factories/:factoryId/widgets', async (req, res) => {
  try {
    const widget = await Widget.create({
      name: req.body.name,
      description: req.body.description,
      price: req.body.price,
      factoryId: req.params.factoryId
    });
    res.status(201).json(widget);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Define route to update a widget
app.put('/factories/:factoryId/widgets/:widgetId', async (req, res) => {
  try {
    const widget = await Widget.findOne({
      where: {
        id: req.params.widgetId,
        factoryId: req.params.factoryId
      }
    });
    if (widget) {
      widget.name = req.body.name;
      widget.description = req.body.description;
      widget.price = req.body.price;
      await widget.save();
      res.status(200).json(widget);
    } else {
      res.status(404).json({ message: 'Widget not found' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Define route to delete a widget
app.delete('/factories/:factoryId/widgets/:widgetId', async (req, res) => {
  try {
    const widget = await Widget.findOne({
      where: {
        id: req.params.widgetId,
        factoryId: req.params.factoryId
      }
    });
    if (widget) {
      await widget.destroy();
      res.status(204).send();
    } else {
      res.status(404).json({ message: 'Widget not found' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// MY NEXT LINE ITEM WILL BE: 4 - Define a microservice API to sell Widgets to other Widget Factories based on market conditions.








// 4. Define a microservice API to sell Widgets to other Widget Factories based on market conditions.
app.post('/widgetfactories/:widgetFactoryId/widgets/:widgetId/sell', (req, res) => {
  const { widgetFactoryId, widgetId } = req.params;

  // check if widget factory and widget exist
  WidgetFactory.findByPk(widgetFactoryId).then((widgetFactory) => {
    if (!widgetFactory) {
      res.status(404).send('Widget factory not found');
    } else {
      Widget.findByPk(widgetId).then((widget) => {
        if (!widget) {
          res.status(404).send('Widget not found');
        } else {
          // calculate price based on market conditions and sell the widget
          const price = calculatePrice(widget, widgetFactory);
          widgetFactory.update({ balance: widgetFactory.balance + price });
          widget.update({ widgetFactoryId: null });
          res.status(200).send(`Widget ${widgetId} sold for ${price} to Widget Factory ${widgetFactoryId}`);
        }
      });
    }
  });
});

// helper function to calculate widget price based on market conditions
function calculatePrice(widget, widgetFactory) {
  // add your logic here to calculate the price based on market conditions
  return Math.floor(Math.random() * 100) + 1;
}

// MY NEXT LINE ITEM WILL BE: 5 - Define a microservice API to move Widgets to other Widget Factories based on market conditions.





// 5. Define a microservice API to move Widgets to other Widget Factories based on market conditions.
app.put('/widget/:widgetId/move/:newFactoryId', async (req, res) => {
  const widgetId = req.params.widgetId;
  const newFactoryId = req.params.newFactoryId;

  try {
    // Check if the widget exists
    const widget = await Widget.findByPk(widgetId);
    if (!widget) {
      res.status(404).json({ error: 'Widget not found' });
      return;
    }

    // Check if the new factory exists
    const newFactory = await WidgetFactory.findByPk(newFactoryId);
    if (!newFactory) {
      res.status(404).json({ error: 'New factory not found' });
      return;
    }

    // Move the widget to the new factory
    await widget.update({ factoryId: newFactory.id });

    res.status(200).json({ message: 'Widget moved successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
});

// MY NEXT LINE ITEM WILL BE: 6 - Define a microservice API to retrieve all Widget Factories.






// 6. Define a microservice API to retrieve all Widget Factories.
app.get('/widgetFactories', async (req, res) => {
  try {
    const widgetFactories = await WidgetFactory.findAll();
    res.status(200).json(widgetFactories);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// MY NEXT LINE ITEM WILL BE: 7 - Define a microservice API to retrieve all Widgets for a specific Widget Factory.




// 7. Define a microservice API to retrieve all Widgets for a specific Widget Factory.

// Retrieve all widgets for a specific widget factory
app.get('/widget-factories/:factoryId/widgets', (req, res) => {
  Widget.findAll({
    where: { factoryId: req.params.factoryId }
  }).then(widgets => {
    res.status(200).json(widgets);
  }).catch(error => {
    res.status(500).send('Error retrieving widgets for factory with ID: ' + req.params.factoryId);
  });
});

// MY NEXT LINE ITEM WILL BE: 8 - Define a microservice API to retrieve a specific Widget.





// 8. Define a microservice API to retrieve a specific Widget.

// Get a specific Widget by ID
app.get('/widget/:id', async (req, res) => {
  try {
    const widget = await Widget.findByPk(req.params.id);
    if (!widget) {
      res.status(404).json({ message: 'Widget not found' });
    } else {
      res.json(widget);
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// MY NEXT LINE ITEM WILL BE: 9 - Define a microservice API to retrieve a specific User from a separate microservice.




// 9. Define a microservice API to retrieve a specific User from a separate microservice.

// This endpoint retrieves a user from a separate microservice
app.get('/users/:id', (req, res) => {
  const userId = req.params.id;
  const options = {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json'
    }
  };

  // Send a request to the separate microservice to get the user data
  fetch(`http://user-service/users/${userId}`, options)
    .then(response => {
      if (!response.ok) {
        throw new Error('Error retrieving user data');
      }
      return response.json();
    })
    .then(user => {
      res.json(user);
    })
    .catch(error => {
      res.status(500).json({ error: error.message });
    });
});

// MY NEXT LINE ITEM WILL BE: 10 - Ensure that all APIs follow a consistent naming convention and use proper HTTP verbs and response codes.






// 10. Ensure that all APIs follow a consistent naming convention and use proper HTTP verbs and response codes.

// Widget Factory APIs
app.post('/api/widget-factories', createWidgetFactory);
app.put('/api/widget-factories/:id', updateWidgetFactory);
app.delete('/api/widget-factories/:id', deleteWidgetFactory);

// Widget APIs
app.post('/api/widget-factories/:factoryId/widgets', createWidget);
app.put('/api/widget-factories/:factoryId/widgets/:id', updateWidget);
app.delete('/api/widget-factories/:factoryId/widgets/:id', deleteWidget);

// Sell Widget API
app.post('/api/widget-factories/:factoryId/widgets/:id/sell', sellWidget);

// Move Widget API
app.post('/api/widget-factories/:factoryId/widgets/:id/move', moveWidget);

// Get Widget Factories API
app.get('/api/widget-factories', getAllWidgetFactories);

// Get Widgets for a specific Widget Factory API
app.get('/api/widget-factories/:id/widgets', getAllWidgetsForFactory);

// Get Specific Widget API
app.get('/api/widget-factories/:factoryId/widgets/:id', getSpecificWidget);

// Get Specific User API
app.get('/api/users/:id', getSpecificUser);

// Handling Invalid Routes
app.all('*', (req, res) => {
  res.status(404).json({ error: 'Invalid Route' });
});

// Handling Errors
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong!' });
});

// MY NEXT LINE ITEM WILL BE: 11 - Implement proper error handling for all APIs.






// 11. Implement proper error handling for all APIs

// Define a custom error handler middleware
app.use((err, req, res, next) => {
  // Check if the error is a Sequelize validation error
  if (err instanceof sequelize.ValidationError) {
    // If it is, extract the error messages
    const errors = err.errors.map((error) => error.message);
    // Send the error response with a 422 status code and the error messages
    res.status(422).json({ errors });
  } else {
    // If the error is not a validation error, send a generic error response
    res.status(500).json({ error: 'Internal server error' });
  }
});

// MY NEXT LINE ITEM WILL BE: 12 - Write unit tests for each API to ensure that they work as expected.



