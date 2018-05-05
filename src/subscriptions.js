'use strict';
/**
 * Subscriptions
 * Part of being able to detect a divergence is to know where the numbers spike
 * A spike is where the numbers before and after
 * the terget are both higher or lower than the target
 * @param {number} timeFrames The value to the left of target
 * @param {number} pairs The tagets value
 * @param {number} apiUrl The value to the right of target
 * @return {string} the string indicating direction
 */

module.exports = function subscriptions() {
    return new Promise((resolve, reject) => {
        const timeFrames = ['1h', '2h', '3h', '4h', '5h', '6h', '7h', '8h', '9h', '10h', '11h', '12h'];
        const pairs = ['EOSUSD', 'ZRXUSD', 'AIDUSD', 'AIOUSD', 'REPUSD', 'AVTUSD', 'BATUSD', 'BTCUSD', 'BCHUSD', 'BTGUSD', 'BFTUSD', 'CFIUSD', 'DAIUSD', 'DASHUSD', 'MNAUSD', 'ETPUSD', 'EDUUSD', 'ETHUSD', 'EDOUSD', 'ETCUSD', 'FUNUSD', 'GNTUSD', 'IOSUSD', 'IOTAUSD', 'LTCUSD', 'LRCUSD', 'MTNUSD', 'XMRUSD', 'NEOUSD', 'ODEUSD', 'OMGUSD', 'QASHUSD', 'QTUMUSD', 'RCNUSD', 'RDNUSD', 'RRTUSD', 'REQUSD', 'XRPUSD', 'SANUSD', 'SNGUSD', 'AGIUSD', 'SPKUSD', 'SNTUSD', 'DATAUSD', 'TRXUSD', 'TNBUSD', 'WAXUSD', 'YYWUSD', 'ZECUSD', 'ELFUSD', 'RLCUSD'];
        let subscriptions = [];
        timeFrames.forEach((timeFrames) => {
            pairs.forEach((pairs) => {
                const event = 'subscribe';
                const channel = 'candles';
                const key = `trade:${timeFrames}:t${pairs}`;
                subscriptions.push({event, channel, key});
            });
        });
        resolve(subscriptions);
    });
};
