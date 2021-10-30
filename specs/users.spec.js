const UserCtrls = require('../src/users/user.controllers')
const chai = require('chai');
const server = require('../main')
const chaiHttp = require("chai-http");

// Chai Assertion Style
chai.should()
chai.use(chaiHttp)

describe("User Services", () => {
    describe('Normal Test Services', () => {
        it('Test get single user return 200', (done) => {
            chai.request(server)
                .get("/api/users/99")
                .end((err, res) => {
                    res.should.have.status(200)
                    // res.body.should.be.a('object')
                })
            done()
        })
    })
})