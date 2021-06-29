const express = require('express')
process.env["NODE_TLS_REJECT_UNAUTHORIZED"] = 0; // why not
const app = express()
var fs = require('fs'),
    path = require('path'),
    http = require('http');
var swaggerTools = require('swagger-tools');
var jsyaml = require('js-yaml');
const bodyParser = require('body-parser');
var api_routes = require('./routes/api_routes')
var games_routes = require('./routes/games_routes')
var trophy_routes = require('./routes/trophy_routes')
var players_routes = require('./routes/players_routes')
var admin_routes = require('./routes/admin_routes')
var beacon_routes = require('./routes/beacon_routes')
var trophyManager = require('./trophy/TrophyManager')()
var GameNotificationManager = require('./game/GameNotificationManager')()
var GameLauncher = require('./game/GameLauncher')()

const port = 3376



// swaggerRouter configuration
var options = {
    swaggerUi: path.join(__dirname, '/swagger.json'),
    controllers: path.join(__dirname, './controllers'),
};

app.use(bodyParser.json());
// The Swagger document (require it, build it programmatically, fetch it from a URL, ...)
var spec = fs.readFileSync(path.join(__dirname, 'api/swagger.yaml'), 'utf8');
var swaggerDoc = jsyaml.safeLoad(spec);

function checkAuthOrigin(req) {
   // console.log(req.header("Origin"))
   // console.log(req.originalUrl)
    return req.header("Origin") in ['192.168.75.6', 'http://192.168.75.6', 'https://192.168.75.6'];
}

// Initialize the Swagger middleware
swaggerTools.initializeMiddleware(swaggerDoc, function (middleware) {
    // Add headers
    app.use(function (req, res, next) {

        if (checkAuthOrigin(req)) {

            // Website you wish to allow to connect
            res.setHeader('Access-Control-Allow-Origin', req.header("Origin"));

            // Request methods you wish to allow
            res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');

            // Request headers you wish to allow
            res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type,Authorization,API-LOGIN');

            // Set to true if you need the website to include cookies in the requests sent
            // to the API (e.g. in case you use sessions)
            res.setHeader('Access-Control-Allow-Credentials', true);

            if (req.method === 'OPTIONS') {
                res.status(200).end();
            } else {
                next();
            }
        } else if(req.header("Origin") == null) {
            next();
        } else {

            next()

        }

    });

    // Interpret Swagger resources and attach metadata to request - must be first in swagger-tools middleware chain
    app.use(middleware.swaggerMetadata());

    // Validate Swagger requests
    app.use(middleware.swaggerValidator());

    // Route validated requests to appropriate controller
    app.use(middleware.swaggerRouter(options));

    // Serve the Swagger documents and Swagger UI
    app.use(middleware.swaggerUi());
    app.use('/public', express.static('../client/dist'))
    app.use('/api', api_routes)
    app.use('/api', games_routes)
    app.use('/api', trophy_routes)
    app.use('/api', players_routes)
    app.use('/admin', admin_routes)
    app.use('/beacon', beacon_routes)
    app.use(function (req, res, next) {
        res.status(404).send("Sorry can't find that!")
    })
    app.listen(port, () => {
        console.log('Your server is listening on port %d (http://localhost:%d)', port, port);
        console.log('Swagger-ui is available on http://localhost:%d/docs', port);
    })


});

