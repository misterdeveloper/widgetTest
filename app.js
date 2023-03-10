const express = require('express');
const app = express();
const path = require('path');

// Serve static files from a folder called 'public'
app.use(express.static(path.join(__dirname, 'public')));

// Route for login page
app.get('/login', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'login.html'));
});

// Route for signup page
app.get('/signup', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'signup.html'));
});

// Route for dashboard page
app.get('/dashboard', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'dashboard.html'));
});

// Start server
const port = 3000;
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});


/*

Here is an example of a simple Node.js and Express server that serves up local files and includes routes for login, signup, and dashboard:

In this example, we are using the express package to create an HTTP server, and the path package to manipulate file paths.

The server serves static files from a folder called public, which you can change to any folder you'd like. The express.static middleware serves static files such as HTML, CSS, and JavaScript files.

The server also includes three routes for the login, signup, and dashboard pages. Each route sends the corresponding HTML file as a response using the res.sendFile method. You can replace the file paths and file names with your own files.

Finally, we start the server by listening on port 3000.

Make sure you have Node.js installed on your machine and then save this code in a file named server.js and run it in the terminal using node server.js. You should see a message in the console saying "Server running on port 3000". You can then access the three pages by going to http://localhost:3000/login, http://localhost:3000/signup, and http://localhost:3000/dashboard.

*/
