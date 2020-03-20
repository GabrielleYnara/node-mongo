const MongoClient = require('mongodb').MongoClient; // It will act as a client for the mongo server
const assert = require('assert').strict;
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
MongoClient.connect(url, { useUnifiedTopology: true }, (err, client) => {
    
    /** 
     * Checks if err is equal to null. If so the application keeps running forward,
     * otherwise the assert will fail and terminate the whole application and log the error to the console. 
     */
    assert.strictEqual(err, null);

    console.log('Connected correctly to server');

    const db = client.db(dbname); //Connects to nucampsite data base on the MongoDb server

    db.dropCollection('campsites', (err, result) => {
        console.log('Dropped Collection: ', result);

        dboper.insertDocument(db, { name: "Breadcrumb Trail Campground", description: "Test"},
            'campsites', result => {
            console.log('Insert Document:', result.ops); // ops is short for operations

                dboper.findDocuments(db, 'campsites', docs => {
                    console.log('Found Documents:', docs);
    
                    dboper.updateDocument(db, { name: "Breadcrumb Trail Campground" },
                        { description: "Updated Test Description" }, 'campsites',
                        result => {
                            console.log('Updated Document Count:', result.result.nModified);
    
                            dboper.findDocuments(db, 'campsites', docs => {
                                console.log('Found  Documents:', docs);
                                
                                dboper.removeDocument(db, { name: "Breadcrumb Trail Campground" },
                                    'campsites', result => {
                                    console.log('Deleted Document Count:', result.deletedCount);
    
                                    client.close();
                                });
                            });
                        }
                    );
                });
            }
        );
    });
});