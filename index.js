'use strict';
const fs = require('fs');
const moment = require('moment');
const RSI = require('@solazu/technicalindicators').RSI;
const Ws = require('ws');
const util = require('util');

let bitfinexData = [];
let bitfinexSubscriptions = [];

console.log(`Divergence Detector Started`);

/**
* Start
*/
createBitfinexSubscriptions()
.then(() => {
    return getBitfinexData();
})
.then(() => {
    let waitingForHour = 0;
    setInterval(() => {
        if (waitingForHour == 0) {
            console.log(`Waiting for the top of the hour before scanning`);
            waitingForHour = 1;
        }
let minutes = new Date().getMinutes(); // eslint-disable-line no-unused-vars
let seconds = new Date().getSeconds(); // eslint-disable-line no-unused-vars
        // if (minutes == 0 && seconds == 0 ){
            console.log(`Top of the hour is now`);
            scanData();
        // }
    }, 10000);
})
.catch((error) => {
   cpnsole.log(`Error Message : ${error}`);
});


/**
 * Get Bitfinex Data
 * @return {promise} an empty promise
 */
function createBitfinexSubscriptions() {
    return new Promise(function(resolve, reject) {
        let timeFrames = [
            '1h',
            '2h',
            '3h',
            '4h',
            '5h',
            '6h',
            '7h',
            '8h',
            '9h',
            '10h',
            '11h',
            '12h',
        ];
        let pairs = [
            'EOSUSD',
            'ZRXUSD',
            'AIDUSD',
            'AIOUSD',
            'REPUSD',
            'AVTUSD',
            'BATUSD',
            'BTCUSD',
            'BCHUSD',
            'BTGUSD',
            'BFTUSD',
            'CFIUSD',
            'DAIUSD',
            'DASHUSD',
            'MNAUSD',
            'ETPUSD',
            'EDUUSD',
            'ETHUSD',
            'EDOUSD',
            'ETCUSD',
            'FUNUSD',
            'GNTUSD',
            'IOSUSD',
            'IOTAUSD',
            'LTCUSD',
            'LRCUSD',
            'MTNUSD',
            'XMRUSD',
            'NEOUSD',
            'ODEUSD',
            'OMGUSD',
            'QASHUSD',
            'QTUMUSD',
            'RCNUSD',
            'RDNUSD',
            'RRTUSD',
            'REQUSD',
            'XRPUSD',
            'SANUSD',
            'SNGUSD',
            'AGIUSD',
            'SPKUSD',
            'SNTUSD',
            'DATAUSD',
            'TRXUSD',
            'TNBUSD',
            'WAXUSD',
            'YYWUSD',
            'ZECUSD',
            'ELFUSD',
            'RLCUSD',
        ];

        timeFrames.forEach((timeFrames) => {
            pairs.forEach((pairs) => {
                bitfinexSubscriptions.push({
                    event: 'subscribe',
                    channel: 'candles',
                    key: `trade:${timeFrames}:t${pairs}`,
                });
            });
        });
        resolve();
    });
}

/**
 * Get Bitfinex Data
 * @return {promise} an empty promise
 */
function getBitfinexData() {
    return new Promise(function(resolve, reject) {
        let initialDataComplete = 0;
        const w = new Ws('wss://api.bitfinex.com/ws/2');
        w.on('message', (msg) => {
            let data = JSON.parse(msg);
            if (data.event == 'subscribed' && data.channel == 'candles') {
                let key = data.key.split(':');
                bitfinexData.push({
                    pair: key[2],
                    timeFrame: key[1],
                    chanId: data.chanId,
                    data: [],
                });
            } else if (data[0] != undefined && data[1] != 'hb') {
                let chanId = data[0];
                let price = data[1];
                let time = moment.unix(price[0]).local().format('HH:mm');
                let pair = bitfinexData.filter((obj) => {
                    return obj.chanId === chanId;
                });
                let pairData = pair[0].data;
                if (price.length > 6) {
                    price.forEach((price)=>{
                        let time = moment.unix(
                            price[0]).local().format('HH:mm');
                        pairData.push({
                            open: price[1],
                            close: price[2],
                            high: price[3],
                            low: price[4],
                            volume: price[5],
                            time: time,
                        });
                    });
                } else {
                    pairData.push({
                        open: price[1],
                        close: price[2],
                        high: price[3],
                        low: price[4],
                        volume: price[5],
                        time: time,
                    });
                }
                if (pairData.length >= 150) {
                    pairData.shift();
                }
                if (bitfinexData.length == bitfinexSubscriptions.length &&
                    initialDataComplete == 0) {
                    initialDataComplete = 1;
                    console.log(`Initial Bitfinex data complete`);
                    console.log(`Listening for more data on websockets`);
                    resolve();
                }
            }
        });
        w.on('open', () => {
            bitfinexSubscriptions.forEach((pairs, i) => {
                w.send(JSON.stringify(bitfinexSubscriptions[i]));
            });
        });
    });
}

/**
 * start scanner
 * @return {promise} an empty promise
 */
function scanData() {
    return new Promise(function(resolve, reject) {
        console.log(`Scanning Data now`);
        let dataArray = bitfinexData;
        dataArray.forEach((results)=>{
            calculateRSI(results.data)
            .then((rsiAndPrice) => {
                return createColumns(
                    rsiAndPrice[0],
                    rsiAndPrice[1],
                    results.timeFrame,
                    results.pair
                );
            })
            .then((divergence) => {
                saveData(
                    'divergence',
                    `{pair:${divergence.pair},
                        timeFrame:${divergence.timeFrame},
                        period:${divergence.data},
                        direction:${divergence.direction},
                        column:${JSON.stringify(divergence.column)}}`
                    );
            })
            .catch((error) => {
                console.log(error);
            });
        });
    });
}


/**
 * Spike Detector
 * Part of being able to detect a divergence is to know where the numbers spike
 * A spike is where the numbers before and after
 * the terget are both higher or lower than the target
 * @param {number} left The value to the left of target
 * @param {number} target The tagets value
 * @param {number} right The value to the right of target
 * @return {string} the string indicating direction
 */
function spike(left, target, right) {
    if (target > left && target > right) {
        return 'up';
    } else if (target < left && target < right) {
        return 'down';
    } else {
        return 'none';
    }
}

/**
 * Detet Divegence
 * First stage of finding a divergence by preparing the column array
 * @param {object} price The price array data
 * @param {object} rsi The rsi array data
 * @param {object} timeFrame The timeframe
 * @param {object} pair The pair
 * @return {boolean} has a divergence been found true/false
 */
function createColumns(price, rsi, timeFrame, pair) {
    return new Promise(function(resolve, reject) {
        let column = [];
        price.forEach((entry, i) => {
            if (price && i > 0 && i < 18) {
                let data = {
                    column: i,
                    priceValue: price[i],
                    rsiValue: rsi[i],
                    priceSpike: spike(price[i+1], price[i], price[i-1]),
                    rsiSpike: spike(rsi[i+1], rsi[i], rsi[i-1]),
                };
                column.push(data);
            }
        });

        let periods = [
            2,
            3,
            4,
            5,
            6,
            7,
            8,
            9,
            10,
            11,
            12,
            13,
            14,
            15,
            16,
            17,
            18,
        ];
        if (column.length > 1) {
            Promise.all([
                divergenceStrategy(column, pair, timeFrame, periods),
            ])
            .then(function(res) {
                res.forEach((data) => {
                    if (data.divergence) {
                        resolve(data);
                    };
                });
            })
            .catch(function(err) {
                console.error('Promise.all error', err);
            });
        }
    });
}

/**
 * Divergence Strategy
 * For each of the items in the column array we look for divergence
 * @param {object} column The array of column data
 * @param {object} pair The pair of column data
 * @param {object} timeFrame The timeframe of column data
 * @param {object} period The period between spikes
 * @return {object} divergence report
 */
function divergenceStrategy(column, pair, timeFrame, period) {
    return new Promise(function(resolve, reject) {
        period.forEach((data) => {
            let i = data + 2;
                if (
                    i <= 16 &&
                    column[2].priceSpike == 'up' &&
                    column[i].priceSpike == 'up' &&
                    column[2].rsiSpike == 'up' &&
                    column[i].rsiSpike == 'up' &&
                    column[i].priceValue < column[2].priceValue &&
                    column[i].rsiValue > column[2].rsiValue
                ) {
                    let firstPriceSpikeValue = column[2].priceValue;
                    let secondPriceSpikeValue = column[i].priceValue;
                    let firstRsiSpikeValue = column[2].rsiValue;
                    let secondRsiSpikeValue = column[i].rsiValue;

                    let x;
                    for (x = 0; x <= i.length; x++) {
                        let priceSlope = slope(period,
                            firstPriceSpikeValue,
                            secondPriceSpikeValue);
                        let rsiSlope = slope(period,
                            firstRsiSpikeValue,
                            secondRsiSpikeValue);
                        if (priceSlope && rsiSlope) {
                            console.log(x);
                            if (x == period.length) {
                                console.log('yay we have a divergence');
                            }
                        } else {
                            break;
                        }
                    }

                    resolve({
                        divergence: true,
                        period: data,
                        direction: 'bearish',
                        pair,
                        timeFrame,
                        column,
                    });
                }
                if (
                    i <= 15 &&
                    column[2].priceSpike == 'down' &&
                    column[i].priceSpike == 'down' &&
                    column[2].rsiSpike == 'down' &&
                    column[i].rsiSpike == 'down' &&
                    column[i].priceValue > column[2].priceValue &&
                    column[i].rsiValue < column[2].rsiValue
                ) {
                    resolve({
                        divergence: true,
                        period: data,
                        direction: 'bullish',
                        pair,
                        timeFrame,
                        column,
                    });
                }
        });
    });
}
/**
 * Calculate Slope
 * Is the price or rsi value higher than the slope value
 * @param {number} period The proce data
 * @param {number} firstValue The proce data
 * @param {number} secondValue The proce data
 * @return {boolean} true or false
 */
function slope(period, firstValue, secondValue) {
    let slopeValue = (
        (firstValue - secondValue) /
        Math.abs(period - 2)) * period;
    return (secondValue < slopeValue);
}
/**
 * Calculate RSI
 * From the historic and live data, calculate the
 * RSI and return the last 9 as 2 arrays
 * @param {object} priceArray The proce data
 * @return {object} the RSI Array
 */
function calculateRSI(priceArray) {
    return new Promise(function(resolve, reject) {
        let closeArray = [];
        priceArray.forEach((entry) => {
            if (entry.close) {
                closeArray.push(entry.close);
            }
        });
        let inputRSI = {
            values: closeArray,
            period: 14,
            reversedInput: true,
        };
        let rsiArray = (RSI.calculate(inputRSI));
        if (closeArray.length > 0 && rsiArray.length > 0) {
            resolve([closeArray.slice(0, 20), rsiArray.slice(0, 20)]);
        }
    });
}

/**
 * Save Data
 * Save the data to disk
 * @param {string} name The proce data
 * @param {object} data The proce data
 */
function saveData(name, data) {
        let logFile = fs.createWriteStream(
            __dirname + `/${name}.log`, {flags: 'a'});
        logFile.write(util.format(data) + '\n');
}
