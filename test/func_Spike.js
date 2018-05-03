const spike = require('../src/functions/spike');

var chai = require('chai'),
    should = chai.should,
    expect = chai.expect,
    assert = chai.assert;

describe('Spike tests', function () {

    it('Should return up', function(){
        const target =16.981;
        const left = 16.58363574;
        const right = 16.82;
        expect(spike(left,target,right)).to.be.eq('up');
    });
    it('Should return down', function(){
        const target = 16.82;
        const left = 16.981;
        const right = 16.877;
        expect(spike(left,target,right)).to.be.eq('down');
    });
    
});