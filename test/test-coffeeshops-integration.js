const chai = require('chai');
const chaiHttp = require('chai-http');
const mongoose = require('mongoose');
const routerFunction = require("../routerFunctions.js")
const should = chai.should();
const { coffeeShops } = require('../coffeeshops/models');
const { app, runServer, closeServer } = require('../server');
const { TEST_DATABASE_URL } = require('../config');

chai.use(chaiHttp);

const seedData = [{"name": "Row House Cafe", "address": "1170 Republican Street, Seattle", "rating": "4.2", "description": "Great place to eat",  "price": "2"},
{"name": "Espresso Vivace", "address": "227 Yale Avenue, Seattle", "rating": "4.5", "description": "Smells good and great coffee",  "price": "3"},
{"name": "Kaladi Brother Coffee", "address": "517 East Pike STreet, Seattle", "rating": "4.3", "description": "Great place to eat",  "price": "5"},
{"name": "Starbucks", "address": "195 Pike Street, Seattle", "rating": "4.1", "description": "Great place to eat", "price": "1"}];

function seedCoffeeData(done) {

    return coffeeShops.insertMany(seedData);
}


function tearDownDb() {
    console.warn('Deleting database');
    return mongoose.connection.dropDatabase();
}

describe('Coffee API resource', function () {

    // we need each of these hook functions to return a promise
    // otherwise we'd need to call a `done` callback. `runServer`,
    // `seedRestaurantData` and `tearDownDb` each return a promise,
    // so we return the value returned by these function calls.
    before(() => {
        runServer(TEST_DATABASE_URL)
            .then();
    });

    beforeEach(() => {
        return seedCoffeeData();
    });

    afterEach(() => {
        tearDownDb()
            .then()
    });

    after(() => {
        closeServer()
            .then();
    })

    describe('GET endpoint', function () {

        it('should return all existing coffeeShops', function () {
            
            return routerFunction.getCoffeeShops().then(coffeeShops => {
                coffeeShops.should.be.a("array");
                coffeeShops.should.have.length(4);
            })
        });

    });

});

//     describe('POST endpoint', function () {
//         it('should add a new blogpost', function () {

//             const newBlogPost = generateBlogData();

//             return chai.request(app)
//                 .post('/posts')
//                 .send(newBlogPost)
//                 .then(function (res) {
//                     res.should.have.status(201);
//                     res.should.be.json;
//                     res.body.should.be.a('object');
//                     res.body.should.include.keys(
//                         'title', 'author', 'content');
//                     res.body.id.should.not.be.null;
//                     res.body.title.should.equal(newBlogPost.title);
//                     res.body.content.should.equal(newBlogPost.content);

//                        return BlogPost.findById(res.body.id);
//                 })
//             .then(function(blogpost) {
//               blogpost.content.should.equal(newBlogPost.content);
//               blogpost.title.should.equal(newBlogPost.title);

//             });
//         });
//     });

//     describe('PUT endpoint', function() {

//     it('should update fields you send over', function() {
//       const updateData = {
//         title: 'Dr. DooLittle',
//         content: 'a great book'
//       };

//       return BlogPost
//         .findOne()
//         .exec()
//         .then(function(blogpost) {
//           updateData.id = blogpost.id;
//           console.log(blogpost.id);
//           return chai.request(app)
//             .put(`/posts/${blogpost.id}`)
//             .send(updateData);
//         })
//         .then(function(res) {
//           res.should.have.status(201);

//           return BlogPost.findById(updateData.id).exec();
//         })
//         .then(function(blogpost) {
//          blogpost.content.should.equal(updateData.content);
//           blogpost.title.should.equal(updateData.title);
//         });
//       });
//   });

//     describe('DELETE endpoint', function() {

//     it('delete a blogpost by id', function() {

//       let blogpost;

//       return BlogPost
//         .findOne()
//         .exec()
//         .then(function(_blogpost) {
//           blogpost = _blogpost;
//           return chai.request(app).delete(`/posts/${blogpost.id}`);
//         })
//         .then(function(res) {
//           res.should.have.status(204);
//           return BlogPost.findById(blogpost.id).exec();
//         })
//         .then(function(_blogpost) {

//           should.not.exist(_blogpost);
//         });
//     });
//   });

