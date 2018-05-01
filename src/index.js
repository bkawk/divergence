'use strict';
const Bitfinex = require('./services/bitfinex');
const Scanner = require('./services/scanner');

/**
* Start
*/
console.log(`Divergence Detector Started`);
let timeFrames = ['1h', '2h', '3h', '4h', '5h', '6h', '7h', '8h', '9h', '10h', '11h', '12h'];
let pairs = ['EOSUSD', 'ZRXUSD', 'AIDUSD', 'AIOUSD', 'REPUSD', 'AVTUSD', 'BATUSD', 'BTCUSD', 'BCHUSD', 'BTGUSD', 'BFTUSD', 'CFIUSD', 'DAIUSD', 'DASHUSD', 'MNAUSD', 'ETPUSD', 'EDUUSD', 'ETHUSD', 'EDOUSD', 'ETCUSD', 'FUNUSD', 'GNTUSD', 'IOSUSD', 'IOTAUSD', 'LTCUSD', 'LRCUSD', 'MTNUSD', 'XMRUSD', 'NEOUSD', 'ODEUSD', 'OMGUSD', 'QASHUSD', 'QTUMUSD', 'RCNUSD', 'RDNUSD', 'RRTUSD', 'REQUSD', 'XRPUSD', 'SANUSD', 'SNGUSD', 'AGIUSD', 'SPKUSD', 'SNTUSD', 'DATAUSD', 'TRXUSD', 'TNBUSD', 'WAXUSD', 'YYWUSD', 'ZECUSD', 'ELFUSD', 'RLCUSD',
];
let apiUrl = 'wss://api.bitfinex.com/ws/2';

setImmediate(() => {
    let bitfinexService = new Bitfinex(timeFrames, pairs, apiUrl);
    let scannerService = new Scanner();
    bitfinexService.createBitfinexSubscriptions()
        .then((bitfinexSubscriptions) => {
            return bitfinexService.getBitfinexData(bitfinexSubscriptions);
        })
        .then(() => {
            let waitingForHour = 0;
            setInterval(() => {
                if (waitingForHour == 0) {
        console.log(`Waiting for the top of the hour before scanning`);
                    waitingForHour = 1;
                }
                let minutes = new Date().getMinutes();
                let seconds = new Date().getSeconds();
                if (minutes == 0 && seconds == 0 ) {
                    console.log(`Top of the hour is now`);
                    scannerService.scan(bitfinexService.bitfinexData);
                }
            }, 1000);
        });
});
