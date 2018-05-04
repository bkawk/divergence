const calculateRSI = require('../src/functions/calculateRSI');
const priceData = require('./data/priceData.js');
const chai = require('chai'), should = chai.should, expect = chai.expect, assert = chai.assert;

describe('Calculate RSI', () => {
    it('Should return price price arrays', () => {
        const priceArray = priceData;
        return calculateRSI(priceArray)
            .then(function (data) {
                expect(data[0].length).to.equal(21);
            })
    });
    it('Should return RSI array', () => {
        const priceArray = priceData;
        return calculateRSI(priceArray)
            .then(function (data) {
                expect(data[1].length).to.equal(21);
            })
    });
})
