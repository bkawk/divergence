const createColumn = require('../src/functions/createColumns');
var chai = require('chai'),
    expect = chai.expect,
    assert = chai.assert;

describe('Create Column tests', function () {
    const price = [16.82];
    const rsi =[39.21];
    const timeFrame = "1h";
    const pair = "tEOSUSD";

    it('Should return promise pending with current sample data', function () {
        // const promise = createColumn(price, rsi, timeFrame, pair);
        // promise.then(() => {
        //     expect(promise.status).to.be.eq("Pending");
        //     done();
        // });
    });

    it('Should call divergance strategy linear with column length', function () {


    });
    it('Column called should be maxed 18 even Price length is higher', function () {

    });
    it('When Column empty should not give any data', function () {

    });
});