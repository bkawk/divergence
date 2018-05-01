const sinon = require('sinon');
const createColumn = require('../src/functions/createColumns');
const withStatus = require('promise-with-status')(Promise);
var chai = require('chai'),
    should = chai.should,
    expect = chai.expect,
    assert = chai.assert;

describe('Create Column tests', function () {
    var price = Array(1);
    price.push(16.82);
    var rsi = Array(1);
    rsi.push(39.21);
    var timeFrame = "1h";
    var pair = "tEOSUSD";

    it("Should return promise pending with current sample data", function () {
        var promise = createColumn(price, rsi, timeFrame, pair);
        promise.then(() => {
            expect(promise.status).to.be.eq("Pending");
            done();
        });
    });

    it("Should call divergance strategy linear with column length", function () {


    });
    it("Column called should be maxed 18 even Price length is higher", function () {

    });
    it("When Column empty should not give any data", function () {

    });
});