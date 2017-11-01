const express = require('express');
var queryStat = require('../../build/serviceQuery')();
const app = express();

const staticFileMiddleware = express.static('../');
app.use(staticFileMiddleware);

app.use('/statics/query', function (req, res) {
  queryStat.query(req, res);
});

const port = 5555;
app.listen(port, () => {
  console.log(`Example app listening on port ${5555}!`);
});
