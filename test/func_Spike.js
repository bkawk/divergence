const spike = require('../src/functions/spike');

var chai = require('chai'),
    should = chai.should,
    expect = chai.expect,
    assert = chai.assert;

describe('Spike tests', () =>{
    it('Should return up', () => {
        const target = 16.981;
        const left = 16.58363574;
        const right = 16.82;
        expect(spike(left,target,right)).to.be.eq('up');
    });
    it('Should return down', () => {
        const target = 16.82;
        const left = 16.981;
        const right = 16.877;
        expect(spike(left,target,right)).to.be.eq('down');
    });
    it('Should return none', () => {
        const target = 16.82;
        const left = 16.721;
        const right = 16.99;
        expect(spike(left,target,right)).to.be.eq('none');
    });
});