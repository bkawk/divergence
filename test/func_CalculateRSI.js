var chai = require('chai');
const sinon = require('sinon');
var chaiAsPromised = require('chai-as-promised');
chai.use(chaiAsPromised);
var should = chai.should;
var expect = chai.expect;
var assert = chai.assert;
const calculateRSI = require('../src/functions/calculateRSI');
const withStatus = require('promise-with-status')(Promise);
describe('CalculateRSI tests', function () {
    var sampleData = [
        { "open": 16.986, "close": 16.82, "high": 17.081, "low": 16.625, "volume": 464108.87743184, "time": "15:00" },
        { "open": 16.986, "high": 17.081, "low": 16.625, "volume": 464108.87743184, "time": "15:00" },
    ];

    it("Should return pending with current sample data", function () {
        var promise = withStatus(calculateRSI(sampleData));
        promise.then(() => {
            expect(promise.status).to.be.eq("Pending");
            done();
        });
    });
    it("Should return closed array", function () {
        //let columnSpy = sinon.spy(calculateRSI,"closeArray")
        //TODO : Fix bugs Not returning, pending promise 
        //return expect(result).to.eventually.equal([sampleData.slice(0,1), sampleData]);
        //expect(result.should.be.pending).to.be.true;
        //expect(columnSpy.length).to.be.eq(1);

    });
    it("RSI only returned matched data", function () {

    });

});

