var chai = require('chai'),
    should = chai.should,
    expect = chai.expect,
    assert = chai.assert,
    deep = chai.deep;
var chaiAsPromised = require('chai-as-promised');
//calling should bef, solved chaiaspromised bug
chai.should();
chai.use(chaiAsPromised);
const Scanner = require('../src/services/scanner');

describe('Scanner tests', function () {
    let scannerService = new Scanner();
    var dummyData = [
        { channel: "candles", event: "subscribe", key: "trade:1h:tEOSUSD" },
        { channel: "candles", event: "subscribe", key: "trade:1h:tZRXUSD" },
        { channel: "candles", event: "subscribe", key: "trade:2h:tEOSUSD" },
        { channel: "candles", event: "subscribe", key: "trade:2h:tZRXUSD" }];

    it("scan should return pending promise", function () {
      
    });

});
