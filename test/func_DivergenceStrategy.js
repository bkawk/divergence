const divergenceStrategy = require('../src/functions/divergenceStrategy');
const noDivergence = require('./data/noDivergence.js')
const bullishSlopeFalse = require('./data/bullishSlopeFalse.js')
var chaiAsPromised = require('chai-as-promised');


var chai = require('chai'),
    should = chai.should,
    expect = chai.expect,
    assert = chai.assert;

chai.use(chaiAsPromised);

describe('DivergenceStrategy tests', () =>{
    it('Should return no divergence', () => {
        const column = noDivergence;
        const timeFrame = "1h";
        const pair = "tEOSUSD";

        return divergenceStrategy(column, timeFrame, pair)
            .then(function (data) {
                expect(data.divergence).to.equal(false);
            })
    });
    it('Should return bullish divergence slope fail', () => {
        const column = bullishSlopeFalse;
        const timeFrame = "1h";
        const pair = "tEOSUSD";

        return divergenceStrategy(column, timeFrame, pair)
            .then(function (data) {
                expect(data.direction).to.equal('bullish');
                expect(data.slope).to.equal(false);
            })
            
    });
});