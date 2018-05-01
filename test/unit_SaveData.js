const sinon = require('sinon');
const saveData = require('../src/tasks/saveData');
const fs = require('fs');
const util = require('util');

var chai = require('chai'),
    should = chai.should,
    expect = chai.expect,
    assert = chai.assert;

describe('Save data tests', function () {
    let fsSpy = sinon.spy(fs,"createWriteStream");
    let utilSpy = sinon.stub(util,"format");
    utilSpy.returns("test");

    beforeEach(function () {
        var sampleData = '{"pair": "tLRCUSD", "timeFrame": "1h", "period": 14, "direction": "bearish", "column": [{"column":1,"priceValue":1.025,"rsiValue":54.3,"priceSpike":"up","rsiSpike":"up"},{"column":2,"priceValue":1.0116,"rsiValue":52.45,"priceSpike":"down","rsiSpike":"down"},{"column":3,"priceValue":1.0423,"rsiValue":57.39,"priceSpike":"up","rsiSpike":"up"},{"column":4,"priceValue":1.0071,"rsiValue":52.64,"priceSpike":"down","rsiSpike":"down"},{"column":5,"priceValue":1.0298,"rsiValue":56.41,"priceSpike":"none","rsiSpike":"none"},{"column":6,"priceValue":1.0298,"rsiValue":56.41,"priceSpike":"none","rsiSpike":"none"},{"column":7,"priceValue":1.0295,"rsiValue":56.37,"priceSpike":"none","rsiSpike":"none"},{"column":8,"priceValue":1.0001,"rsiValue":52.87,"priceSpike":"none","rsiSpike":"none"},{"column":9,"priceValue":0.99975,"rsiValue":52.83,"priceSpike":"none","rsiSpike":"none"},{"column":10,"priceValue":0.9802,"rsiValue":50.55,"priceSpike":"down","rsiSpike":"down"},{"column":11,"priceValue":1.0498,"rsiValue":60.14,"priceSpike":"none","rsiSpike":"none"},{"column":12,"priceValue":1.05,"rsiValue":60.17,"priceSpike":"none","rsiSpike":"none"},{"column":13,"priceValue":1.0515,"rsiValue":60.39,"priceSpike":"none","rsiSpike":"none"},{"column":14,"priceValue":1.0934,"rsiValue":66.49,"priceSpike":"up","rsiSpike":"up"},{"column":15,"priceValue":1.01,"rsiValue":58.79,"priceSpike":"none","rsiSpike":"none"},{"column":16,"priceValue":1.0091,"rsiValue":58.7,"priceSpike":"down","rsiSpike":"down"},{"column":17,"priceValue":1.0093,"rsiValue":58.73,"priceSpike":"up","rsiSpike":"up"}]}';
        saveData("divergence",sampleData);            
    });
    
    it('Should write to correct format', function () {    
       expect(fsSpy.calledWith('./logs/divergence.js',{flags: 'a'})).to.be.true;
    });
    it('Should call util format inside the function', function () {  
        expect(utilSpy.called).to.be.true;
    });

});