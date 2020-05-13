var express = require('express');
var router = express.Router();
/*
* GET CommodityList.
*/
router.get('/commodities', function (req, res) {
  res.set({ "Access-Control-Allow-Origin": "http://localhost:3000" });
  //Get the data
  req.commodity.find(function (err, docs) {
    if (err === null)
      res.json(docs);
    else
      res.send({ msg: err });
  });
});

/* * POST to add commodity */
router.post('/addcommodity', function (req, res) {
  res.set({ "Access-Control-Allow-Origin": "http://localhost:3000" });
  var addRecord = new req.commodity({ category: req.body.category, name: req.body.name, status: req.body.status }); //add new commodity document
  addRecord.save(function (err, result) { res.send((err === null) ? { msg: '' } : { msg: err }); });
});

/* * DELETE to delete a commodity. */
router.delete('/deletecommodity/:id', function (req, res) {
  let id = req.params.id;
  console.log(`Deleting ${id}`);
  req.commodity.findByIdAndDelete(id, (err, result) => { res.send((err === null) ? { msg: '' } : { msg: err }); })
});

/* * PUT to update a commodity (status) */
router.put('/updatecommodity/:id', function (req, res) {
  var commodityToUpdate = req.params.id;
  var newStatus = req.body.status;
  console.log(commodityToUpdate, newStatus);
  req.commodity.findByIdAndUpdate(commodityToUpdate, {
    $set: { status: newStatus }
  })
    .then(() => res.send({ msg: '' }))
    .catch(error => {
      res.send({ msg: error })
    });
});
module.exports = router;