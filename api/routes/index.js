var express = require('express');
var router = express.Router();
const ObjectID = require('mongodb').ObjectID;

function makeZoomLink() {
  var length = 10;
  var result           = 'https://zoom.us//';
  var characters       = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  var charactersLength = characters.length;
  for ( var i = 0; i < length; i++ ) {
    result += characters.charAt(Math.floor(Math.random() * 
charactersLength));
 }
 return result;
}


router.get('/availabilities', (req, res, next) => {
  req.collectionA.find({})
    .toArray()
    .then(results => res.json(results))
    .catch(error => res.send(error));
});

router.post('/availabilities', (req, res, next) => {
  const { availabilityDate, start, end } = req.body;
  if (!availabilityDate || !start || !end ) {
    return res.status(400).json({
      message: 'availability Date, start and end are required',
    });
  }
  link = " ";
  const payload = { availabilityDate, start, end , link};
  req.collectionA.insertOne(payload)
    .then(result => res.json(result.ops[0]))
    .catch(error => res.send(error));
});

router.delete('/availabilities/:id', (req, res, next) => {
  const { id } = req.params;
  const _id = ObjectID(id);
  req.collectionA.deleteOne({ _id })
    .then(result => res.json(result))
    .catch(error => res.send(error));
});


router.get('/reservations', (req, res, next) => {
  req.collectionR.find({})
    .toArray()
    .then(results => res.json(results))
    .catch(error => res.send(error));
});

router.post('/reservations', (req, res, next) => {
  const { reservationDate, start, end, title, email  } = req.body;
  if (!reservationDate || !start || !end || !title || !email) {
    return res.status(400).json({
      message: 'reservation Date, start, end, title and email are required',
    });
  }
  link = makeZoomLink();
  const payload = { reservationDate, start, end, title, email, link };
  req.collectionR.insertOne(payload)
    .then(result => res.json(result.ops[0]))
    .catch(error => res.send(error));
});

router.delete('/reservations/:id/:email', (req, res, next) => {
  const { id, email} = req.params;
  emailDB = " ";
  // console.log(id,"ObjectId('"+ id +"')")
  // console.log(email);
  // req.collectionR.findOne({ "_id": ObjectID(req.params['id']) })
  //   // .then(results =>console.log(results));
  //   .then(results => emailDB = results["email"])
  //   .then(console.log("EMAIL3",emailDB));
  //   console.log("emailDB:",emailDB);
  // if( emailDB == email){
  //   req.collectionR.deleteOne
  //   const _id = ObjectID(id);
  //   req.collectionR.deleteOne({ _id })
  //     .then(result => res.json(result))
  //     .catch(error => res.send(error));
  // }
  // else {
  //   console.log('not authorized');
  //   res.send("not authorized");
  // }

  req.collectionR.findOneAndDelete({ "_id": ObjectID(req.params['id']) , "email" : email})
  .then(result => res.json(result))
  .catch(error => res.send(error));
  
});

router.delete('/reservations/:email/:reservationDate/:start/:end', (req, res, next) => {
  const {email, reservationDate, start, end} = req.params;

  req.collectionR.findOneAndDelete({ "email" : email, "reservationDate" : reservationDate, "start" : start, "end": end})
  .then(result => res.json(result))
  .catch(error => res.send(error));
  
});


module.exports = router;
