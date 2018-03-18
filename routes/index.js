var express = require('express');
var axios = require('axios');
var router = express.Router();


/* GET home page. */
router.get('/I/want/title', (req, res, next) => {
  var addresses = req.query.address
  var add_ = []
  var promises = []
  var regex = /(^|\s)([\w-]+(\.[\w-]+)+\.?(:\d+)?(\/\S*)?)/gi;

  if (Array.isArray) {
    if (!Array.isArray(addresses)) {
      addresses = [addresses]
    }
  }
  addresses.forEach(address => {
    if (address.match(regex)) {
      link = (address.indexOf('://') === -1) ? 'http://' + address : address;
      promises.push(axios.get(link))
    } else {
      promises.push({address: address, response: 'NO RESPONSE'})
    }
  });

  Promise.all(promises).then(responses => {
    responses.forEach(element => {
      if (element.data) {
        matches = element.data.match(/<title>(.*?)<\/title>/)
        add_.push(matches[1])
      } else {
        add_.push(element.address + '-' + element.response)
      }
    })

    res.render('index', {addresses: add_})
  }).catch(e => {
    console.log(e)
  })
});

module.exports = router;
