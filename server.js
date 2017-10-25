/*const express = require('express');
 const app = express();
 var queryStat = require('./build/serviceQuery')();

 const port = 5555;

 module.exports = statics;
 function statics(loopbackApplication, options) {
 console.log('> Starting app edulivre');

 const staticFileMiddleware = express.static('dist');
 app.use(staticFileMiddleware);


 app.use('/statics/query', function (req, res) {
 queryStat.query(req, res);
 });

 app.listen(port, () = > {
 console.log(`Edulivre app listening on port ${port}!`);
 })
 ;
 }*/
var _defaults = require('lodash').defaults;
var path = require('path');
var queryStat = require('./build/serviceQuery')();
var STATIC_ROOT = path.join(__dirname, 'dist');

module.exports = statics;

function statics(loopbackApplication, options) {
  options = _defaults({}, options, { mountPath: '/statics' });
  loopbackApplication.use(options.mountPath, routes(loopbackApplication, options));
  loopbackApplication.set('statics-app', options);
}


function routes(loopbackApplication, options) {
  var loopback = loopbackApplication.loopback;
  var loopbackMajor = loopback && loopback.version &&
    loopback.version.split('.')[0] || 1;

  var router = new loopback.Router();
  router.use('/statics/query', function (req, res) {
    queryStat.query(req, res);
  });
  router.use(loopback.static(STATIC_ROOT));
  return router;
}
