const express = require('express');
const app = express();
const routes = require('./source/routes.js');
const { setCorsHeadersMiddleware } = require('./utils/function');
const PORT = process.env.PORT || 4555;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use((request, response, next) => setCorsHeadersMiddleware(request, response, next));
routes(app);

app.listen(PORT, function () {
    console.log('App listening on port: ' + PORT);
});
