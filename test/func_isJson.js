const isJson = require('../src/functions/isJson');
const chai = require('chai');
const expect = chai.expect;
describe('Test Json', () => {
    it('Should return true if the json is valid', () => {
        const json = {test: 'test'};
        expect(isJson(json)).to.be.eq(true);
    });
    it('Should return false if the json is invalid', () => {
        const json = 'InvalidJSON';
        expect(isJson(json)).to.be.eq(true);
    });
});
