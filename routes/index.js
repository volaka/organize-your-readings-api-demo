var express = require('express');
var router = express.Router();

var NaturalLanguageUnderstandingV1 = require('ibm-watson/natural-language-understanding/v1.js');

if(process.env.NODE_ENV === 'dev') {
  var apikey = process.env.APIKEY;
  var url = process.env.URL
} else {
  var VCAP_ENV = JSON.parse(process.env.VCAP_SERVICES)
  var apikey = VCAP_ENV["natural-language-understanding"][0].credentials.apikey
  var url = VCAP_ENV["natural-language-understanding"][0].credentials.url
}

var naturalLanguageUnderstanding = new NaturalLanguageUnderstandingV1({
  version: '2019-07-12',
  iam_apikey: apikey,
  url: url
});

/* GET home page. */
router.get('/', function(req, res, next) {
  const url = req.query.url;

  var analyzeParams = {
    'url': url,
    'features': {
      'categories': {
        'limit': 5
      },
      "concepts": {
        "limit": 5
      },
      "entities": {
        "sentiment": true,
        "limit": 5
      },
      'emotion': {},
      'keywords': {
        'limit': 10
      },
      'metadata': {}
    }
  };

  naturalLanguageUnderstanding.analyze(analyzeParams)
  .then(analysisResults => {
    res.json(analysisResults);
  })
  .catch(err => {
    res.status(400).json({ err: err });
  });
});

module.exports = router;
