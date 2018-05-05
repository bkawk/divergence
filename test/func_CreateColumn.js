const createColumns = require('../src/functions/createColumns.js');
const priceData = require('./data/priceData.js');
const rsiData = require('./data/rsiData.js');
const chai = require('chai'), should = chai.should, expect = chai.expect, assert = chai.assert;

describe('Calculate Columns', () => {
    it('Should create columns and find divergences', () => {
        const price = priceData;
        const rsi = rsiData;
        const timeFrame = '1h';
        const pair = 'tBTCUSD';
        return createColumns(price, rsi, timeFrame, pair)
            .then(function(result) {
                expect(result.pair).to.equal(pair);
            })
    });
})
