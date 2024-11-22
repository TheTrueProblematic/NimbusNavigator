// ********************** Initialize server **********************************

const server = require('../index.js'); //TODO: Make sure the path to your index.js is correctly added

// ********************** Import Libraries ***********************************

const chai = require('chai'); // Chai HTTP provides an interface for live integration testing of the API's.
const chaiHttp = require('chai-http');
chai.should();
chai.use(chaiHttp);
const {assert, expect} = chai;

// ********************** DEFAULT WELCOME TESTCASE ****************************

// This was made for lab 11, no functionality to the application

// describe('Server!', () => {
//   // Sample test case given to test / endpoint.
//   it('Returns the default welcome message', done => {
//     chai
//       .request(server)
//       .get('/welcome')
//       .end((err, res) => {
//         expect(res).to.have.status(200);
//         expect(res.body.status).to.equals('success');
//         assert.strictEqual(res.body.message, 'Welcome!');
//         done();
//       });
//   });
// });

// *********************** TODO: WRITE 2 UNIT TESTCASES **************************

// ********************************************************************************

describe('Register:', () => {
  // positve case for register
 it('positive : /register - registers a user successfully', (done) => {
   chai
     .request(server)
     .post('/register')
     .send({
       name: 'test',
       username: 'test@example.com',
       zip: '80303',
       password: 'testpassword',
       cpassword: 'testpassword'
     })
     .end((err, res) => {
       // Here a redirect will trigger a 200 response
       expect(res).to.have.status(200);
       // Verify that the redirect actually happened
       expect(res.redirects[0]).to.include('/login'); // Verify redirection to /login
       done();
     });
 });


 // negative case for register, passwords don't match 
 it('negative : /register - passwords do not match', (done) => {
   chai
     .request(server)
     .post('/register')
     .send({
       name: 'test',
       username: 'test@example.com',
       zip: '80303',
       password: 'testpassword',
       cpassword: 'test'
     })
     .end((err, res) => {
       // 200 response means that the page reloaded
       expect(res).to.have.status(200);
       // Confirm that passwords don't match
       expect(res.text).to.include('Passwords do not match.'); // Verify the error message is rendered
       done();
     });
 });

});


describe('Login:', () => {
 // positive test case for /login
 it('positive: /login - login successful', (done) => {
   chai
     .request(server)
     .post('/login')
     .send({
       username: 'johndoe1@example.com', 
       password: 'test'
     })
     .end((err, res) => {
      // TODO: add response status

      // Verify redirect to /currentWeather after successful login
      expect(res.redirects[0]).to.include('/currentWeather'); 
      done();
   });
 });

 // negative test case for /login, incorrect poassword
 it('Negative : /login. Checking invalid password', done => {
   chai
     .request(server)
     .post('/login')
     .send({username: 'johndoe1@example.com', password: 'thisisinvalid'})
     .end((err, res) => {
       expect(res).to.have.status(200);
       expect(res.text).to.include('Incorrect username or password.');
       done();
     });
 });

});
