var bodyParser = require('body-parser');
var express = require('express');
var app = express();
var xhub = require('express-x-hub');
var request = require('request');

app.set('port', (process.env.PORT || 5000));
app.listen(app.get('port'));

app.use(xhub({ algorithm: 'sha1', secret: process.env.APP_SECRET }));
app.use(bodyParser.json());

app.get('/', function(req, res) {
  res.send('Chasinglight Homepage webhook build is working!');
});

app.get('/facebook', function(req, res) {
  if (
    req.param('hub.mode') == 'subscribe' &&
    req.param('hub.verify_token') == 'token'
  ) {
    res.send(req.param('hub.challenge'));
  } else {
    res.sendStatus(400);
  }
});

app.post('/facebook', function(req, res) {
  if (req.isXHub) {
    if (req.isXHubValid()) {
      res.send('Verified!\n');
    }
  }
  else {
    res.sendStatus(401);
  }
  request.post('https://gitlab.com/api/v3/projects/1312060/trigger/builds', {
    form:{
      token: process.env.GITLAB_BUILD_TOKEN,
      ref: 'trigger'
    }
  })
  res.sendStatus(200);
});

app.listen();
