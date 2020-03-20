const MongoClient = require('mongodb').MongoClient; // It will act as a client for the mongo server
const dboper = require('./operations'); // dboper = short for database operations

const url = 'mongodb://localhost:27017/';
const dbname = 'nucampsite';

/**
 * This method onnects de mongo client with the mongodb server.
 * 1st argument: we pass the url where the MongoDB server can be accessed
 * 2nd argument: this object enables a major update and rewrite
 * 3rd argument: callback function with 2 params, err for the error messages and client;
 * client connects to database and perform operations.
 */
MongoClient.connect(url, { useUnifiedTopology: true }).then(client => {

    console.log('Connected correctly to server');

    const db = client.db(dbname); //Connects to nucampsite data base on the MongoDb server

    db.dropCollection('campsites')
    .then(result => {
        console.log('Dropped Collection: ', result);
    })
	.catch(err => console.log('No collection to drop.'));
	
	dboper.insertDocument(db, {name: "Breadcrumb Trail Campground", description: "Test"}, 'campsites')
    .then(result => {
        console.log('Insert Document:', result.ops); // ops is short for operations

        return dboper.findDocuments(db, 'campsites');
    })
    .then(docs => {
        console.log('Found Documents:', docs);
    
        return dboper.updateDocument(db, { name: "Breadcrumb Trail Campground" },
            { description: "Updated Test Description" }, 'campsites');
    })
    .then(result => {
        console.log('Updated Document Count:', result.result.nModified);
    
        return dboper.findDocuments(db, 'campsites');
    })
    .then(docs => {
        console.log('Found Documents:', docs);
                                
        return dboper.removeDocument(db, { name: "Breadcrumb Trail Campground" },'campsites')
    })
    .then(result => {
        console.log('Deleted Document Count:', result.deletedCount);
    
        return client.close();
    })
    .catch(err => {
        console.log(err);
        client.close();
    });
})
.catch(err => console.log(err));