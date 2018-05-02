const chai = require('chai');
const expect = chai.expect;
const calculateRSI = require('../src/functions/calculateRSI');
const withStatus = require('promise-with-status')(Promise);
describe('CalculateRSI tests', function() {
    const sampleData = [
        { 'open': 16.986, 'close': 16.82, 'high': 17.081, 'low': 16.625, 'volume': 464108.87743184, 'time': '15:00' },
        { 'open': 16.986, 'high': 17.081, 'low': 16.625, 'volume': 464108.87743184, 'time': '15:00' },
    ];

    it('Should return pending with current sample data', function () {
        var promise = withStatus(calculateRSI(sampleData));
        promise.then(() => {
            expect(promise.status).to.be.eq('Pending');
            done();
        });
    });
    it('Should return closed array', function() {
      
    });
    it('RSI only returned matched data', function() {

    });

});

