// ********************** Initialize server **********************************

const server = require('../index'); //TODO: Make sure the path to your index.js is correctly added

// ********************** Import Libraries ***********************************

const chai = require('chai'); // Chai HTTP provides an interface for live integration testing of the API's.
const chaiHttp = require('chai-http');
chai.should();
chai.use(chaiHttp);
const {assert, expect} = chai;

// ********************** DEFAULT WELCOME TESTCASE ****************************

describe('Server!', () => {
  // Sample test case given to test / endpoint.
  it('Returns the default welcome message', done => {
    chai
      .request(server)
      .get('/welcome')
      .end((err, res) => {
        expect(res).to.have.status(200);
        expect(res.body.status).to.equals('success');
        assert.strictEqual(res.body.message, 'Welcome!');
        done();
      });
  });
});

// *********************** TODO: WRITE 2 UNIT TESTCASES **************************

// ********************************************************************************
// Example Positive Testcase :
// API: /add_user
// Input: {id: 5, name: 'John Doe', dob: '2020-02-20'}
// Expect: res.status == 200 and res.body.message == 'Success'
// Result: This test case should pass and return a status 200 along with a "Success" message.
// Explanation: The testcase will call the /add_user API with the following input
// and expects the API to return a status of 200 along with the "Success" message.

describe('Testing Add User API', () => {
 
    // positive test case for user /login
    it('positive : /login', done => {
        chai
          .request(server)
          .post('/login')
          .send({email: 'johndoe1@example.com', password: 'password123'})
          .end((err, res) => {
            expect(res).to.have.status(200);
            expect(res.body.message).to.equals('Success');
            done();
          });
    });
    // negative test case for /login
    it('Negative : /login. Checking invalid email', done => {
          chai
            .request(server)
            .post('/login')
            .send({email: 'jame@example.com', password: 'jame'})
            .end((err, res) => {
              expect(res).to.have.status(400);
              expect(res.body.message).to.equals('Invalid email');
              done();
          });
    });

    // positive test case for /register
    // it('positive : /register', done => {
    //   chai
    //     .request(server)
    //     .post('/register')
    //     .send({name: 'Joe Buck', email: 'joebuck1@example.com', zipcode:'12345', password: 'password321'})
    //     .end((err, res) => {
    //       expect(res).to.have.status(200);
    //       expect(res.body.message).to.equals('Success');
    //       done();
    //     });
    // });
    // // negative test case for /register
    // it('Negative : /register. Checking invalid name', done => {
    //     chai
    //       .request(server)
    //       .post('/register')
    //       .send({name: 12, email: 'test11@example.com', zipcode:'12345', password: 'password123'})
    //       .end((err, res) => {
    //         expect(res).to.have.status(400);
    //         expect(res.body.message).to.equals('Invalid input');
    //         done();
    //       });
    // });
  });
