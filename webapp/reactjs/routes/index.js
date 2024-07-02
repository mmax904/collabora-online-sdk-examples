var express = require('express');
var router = express.Router();
var http = require('http');
var https = require('https');
var Dom = require('@xmldom/xmldom').DOMParser;
var xpath = require('xpath');

/* GET home page. */
router.get('/', function (req, res, next) {
  res.render('index', { title: 'Express' });
});

router.get('/collaboraUrl', function (req, res) {
  var collaboraOnlineHost = req.query.server;

  var httpClient = collaboraOnlineHost.startsWith('https') ? https : http;
  var data = '';
  const collaboraCodeUrl = `${collaboraOnlineHost}/hosting/discovery`
  console.log(collaboraCodeUrl, collaboraOnlineHost.startsWith('https'));

  // try {
    var request = httpClient.get(collaboraCodeUrl, function (response) {
      response.on('data', function (chunk) { data += chunk.toString(); });
      response.on('end', function () {
        var err;
        if (response.statusCode !== 200) {
          err = 'Request failed. Satus Code: ' + response.statusCode;
          response.resume();
          res.status(response.statusCode).send(err);
          console.log('response.statusCode !== 200',err.message)
          return;
        }
        if (!response.complete) {
          err = 'No able to retrieve the discovery.xml file from the Collabora Online server with the submitted address.';
          res.status(404).send(err);
          console.log('!response.complete',err.message);
          return;
        }
        var doc = new Dom().parseFromString(data);
        if (!doc) {
          err = 'The retrieved discovery.xml file is not a valid XML file'
          res.status(404).send(err)
          console.log('!doc',err.message);
          return;
        }
        var mimeType = 'text/plain';
        var mimeType = 'application/vnd.openxmlformats-officedocument.wordprocessingml.document';
        var nodes = xpath.select("/wopi-discovery/net-zone/app[@name='" + mimeType + "']/action", doc);
        if (!nodes || nodes.length !== 1) {
          err = 'The requested mime type is not handled'
          res.status(404).send(err);
          console.log('!nodes || nodes.length !== 1',err.message);
          return;
        }
        var onlineUrl = nodes[0].getAttribute('urlsrc');
        res.json({
          url: onlineUrl,
          token: 'access_token'
        });
      });
      response.on('error', function (err) {
        res.status(404).send('Request error: ' + err);
        console.log('Request error: ' + err.message);
      });
    });
  // } catch (error) {
  //   console.log(error.message)
  //   res.json({
  //     // url: 'https://demo.eu.collaboraonline.com/browser/7432220/cool.html?',
  //     url: 'https://localhost:9980/browser/fbf97e9/cool.html?',
  //     token: 'access_token'
  //   });
  // }
});


module.exports = router;
