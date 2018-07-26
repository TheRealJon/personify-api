/* tslint:disable:no-console */
const mongodb = require('mongodb');

var mongoURL = process.env.OPENSHIFT_MONGODB_DB_URL || process.env.MONGO_URL;
var mongoURLLabel = '';

if (mongoURL == null && process.env.DATABASE_SERVICE_NAME) {
  var mongoServiceName = process.env.DATABASE_SERVICE_NAME.toUpperCase();
  var mongoHost = process.env[mongoServiceName + '_SERVICE_HOST'];
  var mongoPort = process.env[mongoServiceName + '_SERVICE_PORT'];
  var mongoDatabase = process.env[mongoServiceName + '_DATABASE'];
  var mongoPassword = process.env[mongoServiceName + '_PASSWORD'];
  var mongoUser = process.env[mongoServiceName + '_USER'];

  if (mongoHost && mongoPort && mongoDatabase) {
    mongoURLLabel = mongoURL = 'mongodb://';
    if (mongoUser && mongoPassword) {
      mongoURL += mongoUser + ':' + mongoPassword + '@';
    }
    // Provide UI label that excludes user id and pw
    mongoURLLabel += mongoHost + ':' + mongoPort + '/' + mongoDatabase;
    mongoURL += mongoHost + ':' +  mongoPort + '/' + mongoDatabase;

  }
}

module.exports = function() {
  if (mongoURL == null) {
    console.error("Cannot connect to MongoDB. No URL provided.");
    return;
  }

  if (mongodb == null) {
    console.error("Cannot connect to MongoDB. No client instance is present.");
    return;
  }

  mongodb.connect(mongoURL, function(err, conn) {
    if (err) {
      console.log('Error connecting to Mongo. Message:\n'+err);
      return;
    }

    console.log('Connected to MongoDB at: %s', mongoURLLabel);
    return conn;
  });
};
