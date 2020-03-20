const MongoClient = require('mongodb').MongoClient; // It will act as a client for the mongo server
const assert = require('assert').strict;

const url = 'mongodb://localhost:27017/';
const dbname = 'nucampsite';

/**
 * This method onnects de mongo client with the mongodb server.
 * 1st argument: we pass the url where the MongoDB server can be accessed
 * 2nd argument: this object enables a major update and rewrite
 * 3rd argument: callback function with 2 params, err for the error messages and client;
 * client connects to database and perform operations.
 */
MongoClient.connect(url, { useUnifiedTopology: true }, (err, client) => {
    
    /** 
     * Checks if err is equal to null. If so the application keeps running forward,
     * otherwise the assert will fail and terminate the whole application and log the error to the console. 
     */
    assert.strictEqual(err, null); 

    console.log('Connected correctly to server');

    const db = client.db(dbname); //Connects to nucampsite data base on the MongoDb server

    db.dropCollection('campsites', (err, result) => { // Deletes database table
        assert.strictEqual(err, null);
        console.log('Dropped Collection', result);

        const collection = db.collection('campsites');

        collection.insertOne({ name: "BreadCrumb Trail Campground", description: "Test"}, 
        (err, result) => {
            assert.strictEqual(err, null);
            console.log('Insert Document: ', result.ops); // ops is short for operations

            collection.find().toArray((err, docs) => { //toArray convert the data so it's possible to console log it
                assert.strictEqual(err, null);
                console.log('Found Documents: ', docs);

                client.close();
            });  
         });
     }); 
});