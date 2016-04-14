var restify = require('restify');
var restifySwagger = require('node-restify-swagger');

var server = module.exports.server = restify.createServer();

server.use(restify.queryParser());
server.use(restify.CORS());
server.use(restify.bodyParser());

restifySwagger.configure(server, {
  info: {
    title: '52°North geobase API',
    description: '52°North geobase API',
    contact: 'm.rieke@52north.org',
    license: 'MIT',
    licenseUrl: 'http://opensource.org/licenses/MIT'
  },
  apiDescriptions: {
    'get':'GET API',
    'post':'POST API for complex requests'
  }
});

/**
* API Docs contents
* see http://mcavage.me/node-restify/#serve-static for usage
**/
server.get(/\/apidocs\/?.*/, restify.serveStatic({
  directory: './documentation',
  default: 'index.html'
}));
server.get('/', function (req, res, next) {
  res.header('Location', '/apidocs/index.html');
  res.send(302);
  return next(false);
});

/**
* Services Resource base controller
*/
server.get({url: '/services',
swagger: {
  summary: 'services resource',
  notes: 'this resource provides access to geodata services',
}}, function (req, res, next) {
  injectFullUrl(req);
  res.send([
    {
      service1: req.fullUrl+"/service1"
    }
    ]
  );
});

/**
* Service entry Resource base controller
*/
server.get({url: '/services/:id',
swagger: {
  summary: 'service entry resource',
  notes: 'this resource provides access to a geodata service',
}}, function (req, res, next) {
  res.send(req.params);
});

restifySwagger.loadRestifyRoutes();

function injectFullUrl(req) {
  req.fullUrl = (req.isSecure()) ? 'https' : 'http' + '://' + req.headers.host + req.url;
  return req;
}

/**
* Start server
*/
server.listen(8001, function () {
  console.log('%s started: %s', server.name, server.url);
});