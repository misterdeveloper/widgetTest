const express = require('express');
const axios = require('axios');

const app = express();
app.use(express.json());

const AUTH_SERVICE_URL = 'http://localhost:8000';

// Middleware to authenticate incoming requests using the auth microservice
const authenticate = async (req, res, next) => {
  const { authorization } = req.headers;
  if (!authorization) {
    return res.status(401).json({ error: 'Authorization header missing' });
  }
  try {
    const response = await axios.get(`${AUTH_SERVICE_URL}/verify`, {
      headers: {
        Authorization: authorization,
      },
    });
    if (!response.data.success) {
      return res.status(401).json({ error: 'Invalid token' });
    }
    req.user = response.data.user;
    next();
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Internal server error' });
  }
};

// Middleware to authorize incoming requests based on user role
const authorize = (roles) => (req, res, next) => {
  const { role } = req.user;
  if (!roles.includes(role)) {
    return res.status(403).json({ error: 'Access denied' });
  }
  next();
};

// Endpoint for creating a new widget factory
app.post('/widget-factories', authenticate, authorize(['admin']), async (req, res) => {
  try {
    // TODO: Create a new widget factory
    res.status(201).json({ success: true });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Endpoint for updating an existing widget factory
app.put('/widget-factories/:id', authenticate, authorize(['admin']), async (req, res) => {
  const { id } = req.params;
  try {
    // TODO: Update the widget factory with the specified ID
    res.json({ success: true });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Endpoint for deleting an existing widget factory
app.delete('/widget-factories/:id', authenticate, authorize(['admin']), async (req, res) => {
  const { id } = req.params;
  try {
    // TODO: Delete the widget factory with the specified ID
    res.json({ success: true });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Endpoint for creating a new widget
app.post('/widgets', authenticate, authorize(['admin', 'factory']), async (req, res) => {
  try {
    // TODO: Create a new widget
    res.status(201).json({ success: true });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Endpoint for updating an existing widget
app.put('/widgets/:id', authenticate, authorize(['admin', 'factory']), async (req, res) => {
  const { id } = req.params;
  try {
    // TODO: Update the widget with the

















    const express = require('express');
const axios = require('axios');

const app = express();
app.use(express.json());

// Authentication and Authorization microservice URL
const authUrl = 'http://localhost:3000';

// Endpoint for creating a new widget factory
app.post('/widget-factories', authenticate, authorize(['admin']), async (req, res) => {
  try {
    const { name, location } = req.body;
    // TODO: Create the widget factory in the database
    res.sendStatus(201);
  } catch (error) {
    console.error(error);
    res.sendStatus(500);
  }
});

// Endpoint for updating an existing widget factory
app.put('/widget-factories/:id', authenticate, authorize(['admin', 'factory']), async (req, res) => {
  const { id } = req.params;
  try {
    // TODO: Update the widget factory with the given id in the database
    res.sendStatus(200);
  } catch (error) {
    console.error(error);
    res.sendStatus(500);
  }
});

// Endpoint for deleting a widget factory
app.delete('/widget-factories/:id', authenticate, authorize(['admin']), async (req, res) => {
  const { id } = req.params;
  try {
    // TODO: Delete the widget factory with the given id from the database
    res.sendStatus(204);
  } catch (error) {
    console.error(error);
    res.sendStatus(500);
  }
});

// Endpoint for creating a new widget for a specific widget factory
app.post('/widget-factories/:factoryId/widgets', authenticate, authorize(['admin', 'factory']), async (req, res) => {
  const { factoryId } = req.params;
  try {
    const { name, description } = req.body;
    // TODO: Create the widget in the database and associate it with the given widget factory id
    res.sendStatus(201);
  } catch (error) {
    console.error(error);
    res.sendStatus(500);
  }
});

// Endpoint for updating an existing widget for a specific widget factory
app.put('/widget-factories/:factoryId/widgets/:widgetId', authenticate, authorize(['admin', 'factory']), async (req, res) => {
  const { factoryId, widgetId } = req.params;
  try {
    // TODO: Update the widget with the given widgetId for the given factoryId in the database
    res.sendStatus(200);
  } catch (error) {
    console.error(error);
    res.sendStatus(500);
  }
});

// Endpoint for deleting a widget for a specific widget factory
app.delete('/widget-factories/:factoryId/widgets/:widgetId', authenticate, authorize(['admin', 'factory']), async (req, res) => {
  const { factoryId, widgetId } = req.params;
  try {
    // TODO: Delete the widget with the given widgetId for the given factoryId from the database
    res.sendStatus(204);
  } catch (error) {
    console.error(error);
    res.sendStatus(500);
  }
});

// Endpoint for selling a widget from one widget factory to another
app.put('/widgets/:widgetId/sell', authenticate, authorize(['admin']), async (req, res) => {
  const { widgetId } = req.params;
  const { factoryId } = req.body;
  try {
    // TODO: Move the widget with the given widgetId from its current factory to the factory with the given factoryId in the database
    res.sendStatus(200);
  } catch (error) {
    console.error(error);
    res.sendStatus(500);
  }
});

// Middleware for authentication and authorization

const authenticate = async (req, res, next) => {
try {
const token = req.headers.authorization.split(' ')[1];
const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
req.user = decoded;
next();
} catch (error) {
console.error(error);
res.sendStatus(401);
}
};

const authorize = (roles) => {
return (req, res, next) => {
const userRole = req.user.role;
if (roles.includes(userRole)) {
next();
} else {
res.sendStatus(403);
}
};
};

// Endpoint for creating a new widget factory
app.post('/factories', authenticate, authorize(['admin']), async (req, res) => {
const { name } = req.body;
try {
// TODO: Create a new widget factory with the given name in the database
res.sendStatus(201);
} catch (error) {
console.error(error);
res.sendStatus(500);
}
});

// Endpoint for updating an existing widget factory
app.put('/factories/:id', authenticate, authorize(['admin']), async (req, res) => {
const { id } = req.params;
const { name } = req.body;
try {
// TODO: Update the widget factory with the given id in the database
res.sendStatus(200);
} catch (error) {
console.error(error);
res.sendStatus(500);
}
});

// Endpoint for deleting an existing widget factory
app.delete('/factories/:id', authenticate, authorize(['admin']), async (req, res) => {
const { id } = req.params;
try {
// TODO: Delete the widget factory with the given id from the database
res.sendStatus(200);
} catch (error) {
console.error(error);
res.sendStatus(500);
}
});

// Endpoint for creating a new widget
app.post('/widgets', authenticate, authorize(['admin', 'factory']), async (req, res) => {
const { name, description, factoryId } = req.body;
try {
// TODO: Create a new widget with the given name, description, and factoryId in the database
res.sendStatus(201);
} catch (error) {
console.error(error);
res.sendStatus(500);
}
});

// Endpoint for updating an existing widget
app.put('/widgets/:id', authenticate, authorize(['admin', 'factory']), async (req, res) => {
const { id } = req.params;
try {
// TODO: Update the widget with the given id in the database
res.sendStatus(200);
} catch (error) {
console.error(error);
res.sendStatus(500);
}
});

// Endpoint for deleting an existing widget
app.delete('/widgets/:id', authenticate, authorize(['admin', 'factory']), async (req, res) => {
const { id } = req.params;
try {
// TODO: Delete the widget with the given id from the database
res.sendStatus(200);
} catch (error) {
console.error(error);
res.sendStatus(500);
}
});


// Endpoint for selling a widget from one widget factory to another
app.put('/widgets/:widgetId/sell', authenticate, authorize(['admin']), async (req, res) => {
    const { widgetId } = req.params;
    const { factoryId } = req.body;
    try {
        // Get the widget with the given widgetId
        const widget = await Widget.findById(widgetId);
        if (!widget) {
        return res.status(404).send({ error: 'Widget not found' });
        }
    
        // Get the factory with the given factoryId
        const factory = await Factory.findById(factoryId);
        if (!factory) {
        return res.status(404).send({ error: 'Factory not found' });
        }
    
        // Move the widget to the new factory
        const oldFactory = await Factory.findById(widget.factory);
        oldFactory.widgets.pull(widget._id);
        await oldFactory.save();
        widget.factory = factory._id;
        await widget.save();
        factory.widgets.push(widget._id);
        await factory.save();
    
        res.sendStatus(200);
    } catch (error) {
        console.error(error);
        res.sendStatus(500);
    }
    });
    
    // Middleware for error handling
    app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Something went wrong!');
    });




