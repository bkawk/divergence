var chai = require('chai'),
    should = chai.should,
    expect = chai.expect,
    assert = chai.assert;
const chaiAsPromised = require('chai-as-promised');
// calling should bef, solved chaiaspromised bug
chai.should();
chai.use(chaiAsPromised);
const scannerService = require('../src/dataScanner.js');

describe('Scanner tests', function() {
     const dummyData = [

        {channel: 'candles', event: 'subscribe', key: 'trade:1h:tEOSUSD'},
        {channel: 'candles', event: 'subscribe', key: 'trade:1h:tZRXUSD'},
        {channel: 'candles', event: 'subscribe', key: 'trade:2h:tEOSUSD'},
        {channel: 'candles', event: 'subscribe', key: 'trade:2h:tZRXUSD'}];

    it('scan should return pending promise', function() {

    });

});
