const express       = require('express');
const mongodb       = require('mongodb');
const morgan        = require('morgan');
const multer        = require('multer');
const path          = require('path');
const avatarStorage = require('./storage/avatar-storage');
const imgFilter     = require('./storage/image-filter');
const initDb        = require('./db/mongo');
const app           = express();
const upload        = multer({storage: avatarStorage, fileFilter: imgFilter });

var port = process.env.PORT || process.env.OPENSHIFT_NODEJS_PORT || 8080;
var ip   = process.env.IP   || process.env.OPENSHIFT_NODEJS_IP || '0.0.0.0';
var db = initDb();

// Server logging
app.use(morgan('combined'));

// error handling
app.use(function(error, request, response, next){
  console.error(error.stack);
  response.status(500).send('Something bad happened!');
});

const respondWithError = function (response, error, callback) {
  response.json( {error: error } );
}

app.get('/personas', function (request, response) {
  db.collection('personas').find({}).toArray(function(error, result){
    if (error) {
      respondWithError(response, error);
    }
    response.json(result);
  });
});

app.get('/persona/:id', function(request, response){
  var id = new mongodb.ObjectID(request.params.id);
  db.collection('personas').find({ _id: id }).toArray(function(error, result){
    if(err) {
      respondWithError(response, err);
    }
    if (result.length > 0) {
      response.json(result[0]);
    } else {
      response.json({error: 'Persona not found'});
    }
  });
});

app.delete('/delete/:id', function(request, response){
  response.json({error: 'Delete endpoint not implemented yet'});
})

app.post('/edit/:id', function(request, response){
  response.json({error: 'Edit endpoint not implemented yet'});
});

app.post('/create', upload.single('photo'), function(request, response){
  var persona = {};
  persona.name = request.body.name;
  persona.jobTitle = request.body.jobTitle;
  persona.keysToSuccess = request.body.keysToSuccess;
  persona.dangers = request.body.dangers;
  persona.quote = request.body.quote;
  persona.network = request.body.quote;
  persona.photo = '/avatars/' + request.file.filename;
  persona.network = request.body.network;
  persona.dayInTheLife = {};
  persona.skills = [];
  persona.dayInTheLife.summary = request.body.dayInTheLife;
  request.body.skills.forEach(function(skill, index){
    persona.skills.push({
      name: skill,
      rating: request.body.ratings[index]
    });
  });
  db.collection('personas').insertOne(persona, function(error, result){
    if (error) {
      respondWithError(response, error);
    } else {
      response.json({ success: true });
    }
  });
});

app.listen(port, ip);
console.log('Server running on http://%s:%s', ip, port);

module.exports = app;
