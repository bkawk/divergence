'use strict';
const RateLimiter = require('request-rate-limiter');
const winston = require('winston');
const fs = require('fs');
const moment = require('moment');
const RSI = require('@solazu/technicalindicators').RSI;


/**
 * Rate limiter to ensure we dont hit rate limits from the BitFinex API
 */
const limiter = new RateLimiter({
    rate: 1,
    interval: 6,
});


/**
 * Logger to be used to log all found divergences to a file
 */
const log = new (winston.Logger)({
    transports: [
        new (winston.transports.Console)({ 
            colorize: true,
            timestamp() {return moment().format('dddd, MMMM Do YYYY, h:mm:ss a');},
            level: process.env.NODE_ENV === 'development' ? 'debug' : 'info'
        }),
        new (winston.transports.File)({
            filename: `logs.log`,
            timestamp() {return moment().format('dddd, MMMM Do YYYY, h:mm:ss a');},
            level: process.env.NODE_ENV === 'development' ? 'debug' : 'info'
        })
    ]
});

/**
 * Launcher
 * Allows the time frames and the pairs to be entered.
 * Starts the monitorPair function for each pair / time frame combination.
 */
(() => {
    log.info('Divergence Detector Started');
    let timeFrames = ['30m', '1h', '2h', '3h', '4h'];
    let pairs = ['EOSUSD', 'BTCUSD', 'ETHUSD', 'LTCUSD'];
    timeFrames.forEach((timeFrames) => {
        pairs.forEach((pairs) => {
            monitorPair(timeFrames, pairs);
        });
    });
})();

/**
 * monitorPair
 * gets the historic data then starts requesting the live data and stores in priceArray
 * usees the historic and live data to calculate the RSI this returns two arrays one for the price and one for the rsi 
 * The two arrays are then given to the detectDivergence function to determine of any divegences occour on any of the timeframes for any pair.
 * @param {object} timeFrame To monitor
 * @param {object} pair The pair like BTCUSD
 */
function monitorPair(timeFrame, pair) {
    getPrice(timeFrame, pair, 'hist')
    .then((historicPriceData) => {
        let priceArray = historicPriceData;
        setInterval(() => {
            getPrice(timeFrame, pair, 'last')
            .then((priceData) => {
                priceArray.push(priceData);
                return calculateRSI(priceArray);
            })
            .then((data) => {
                return detectDivergence(data[0], data[1], timeFrame, pair);
            })
            .then((divergence) => {
                log.info(divergence);
            })
            .catch((error) => {
                log.error(Error(error));
            });
        }, 120000);
    })
    .catch((error) => {
        log.error(error);
    });
}

/**
 * Spike Detector
 * Part of being able to detect a divergence is to know where the numbers spike
 * A spike is where the numbers before and after the terget are both higher or lower than the target
 * @param {number} left The value to the left of target
 * @param {number} head The tagets value
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
function detectDivergence(price, rsi, timeFrame, pair) {
    return new Promise(function(resolve, reject) {
        let column = [];
        price.forEach((entry, i) => {
            if (i > 0 && i < 9) {
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
        log.info(`Scanning....`);
        let periods = [2, 3, 4, 5];
        Promise.all([
            divergenceStrategy(column, pair, timeFrame, periods),
            // TODO: reversalStrategy(column, pair, timeFrame, periods),
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
                column[2].priceSpike == 'up' &&
                column[i].priceSpike == 'up' &&
                column[2].rsiSpike == 'up' &&
                column[i].rsiSpike == 'up' &&
                column[i].priceValue < column[2].priceValue &&
                column[i].rsiValue > column[2].rsiValue
            ) {
                log.info(`${pair} - ${timeFrame} - Pass`);
                resolve({
                    divergence: true,
                    period: data,
                    direction: 'bearish',
                    pair: pair,
                    timeFrame: timeFrame,
                    column: column,
                });
            }
            if (
                column[2].priceSpike == 'down' &&
                column[i].priceSpike == 'down' &&
                column[2].rsiSpike == 'down' &&
                column[i].rsiSpike == 'down' &&
                column[i].priceValue > column[2].priceValue &&
                column[i].rsiValue < column[2].rsiValue
            ) {
                log.info(`${pair} - ${timeFrame} - Pass`);
                resolve({
                    divergence: true,
                    period: data,
                    direction: 'bullish',
                    pair: pair,
                    timeFrame: timeFrame,
                    column: column,
                });
            }
        });
    });
}



/**
 * Calculate RSI
 * From the historic and live data, calculate the RSI and return the last 9 as 2 arrays
 * @param {object} priceArray The proce data
 * @return {object} the RSI Array
 */
function calculateRSI(priceArray) {
    return new Promise(function(resolve, reject) {
        let closeArray = [];
        priceArray.forEach((entry) => {
            closeArray.push(entry.close);
        });
        let inputRSI = {
            values: closeArray,
            period: 14,
            reversedInput: true,
        };
        let rsiArray = (RSI.calculate(inputRSI));
        resolve([closeArray.slice(0, 9), rsiArray.slice(0, 9)]);
    });
}

/**
 * Request price data from Bitfinex
 * Used to request historic and live data from the bitfinex API
 * @param {string} timeFrame The time frame to request.
 * @param {string} pair The pair to request like BTCUSD
 * @param {string} mode last or hist
 * @return {object} the price data
 */
function getPrice(timeFrame, pair, mode) {
return new Promise(function(resolve, reject) {
    let url = 'https://api.bitfinex.com/v2';
    limiter.request({
        url: `${url}/candles/trade:${timeFrame}:t${pair}/${mode}`,
        method: 'get',
    }, function (error, response) {
        if (response && response.body != 'null' && response.body.startsWith('[')) {
            let price = JSON.parse(response.body);
            if (mode == 'last') {
                let time = moment.unix(price[0]).local().format('HH:mm');
                resolve({
                    open: price[1],
                    close: price[2],
                    high: price[3],
                    low: price[4],
                    volume: price[5],
                    time: time,
                });
            };
            if (mode == 'hist') {
                let historicDataArray = [];
                price.forEach((item) => {
                let time = moment.unix(item[0]).local().format('HH:mm');
                    historicDataArray.push({
                        open: item[1],
                        close: item[2],
                        high: item[3],
                        low: item[4],
                        volume: item[5],
                        time: time,
                    });
                });
                resolve(historicDataArray);
            };
        }
    });
});
}