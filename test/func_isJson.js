const isJson = require('../src/functions/isJson');
const chai = require('chai'),
    should = chai.should,
    expect = chai.expect,
    assert = chai.assert;

describe('Test Json', () => {
    it('Should return true if the json is valid', () => {
        const json = {test: "test"};
        expect(isJson(json)).to.be.eq(true);
    });
})
