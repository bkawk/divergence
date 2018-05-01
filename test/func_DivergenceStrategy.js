const sinon = require('sinon');
const divergenceStrategy = require('../src/functions/divergenceStrategy');
const withStatus = require('promise-with-status')(Promise);
var chai = require('chai'),
    should = chai.should,
    expect = chai.expect,
    assert = chai.assert;

describe('DivergenceStrategy tests', function () {
    var column = Array(1);
    column.push(16.82);
    var timeFrame = "1h";
    var pair = "tEOSUSD";
    var period = Array(1);
    period.push(16);

    it("Should return error with 1 sample data", function () {
       
      
    });


});