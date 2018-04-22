'use strict';
const request = require('request');
const moment = require('moment');
const RSI = require('@solazu/technicalindicators').RSI;
const log = require('./logger.js');


(() => {
    log.info('Starting');
    monitorPair('1h', 'EOSUSD');
})();

/**
 * monitorPair
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
                // log.info(divergence);
            })
            .catch((error) => {
                log.error(Error(error));
            });
        }, 5000);
    });
}

/**
 * Detet divegence
 * @param {object} price The price array data
 * @param {object} rsi The rsi array data
 * @param {object} timeFrame The timeframe
 * @param {object} pair The pair
 * @return {boolean} hasa divergence been found true/false
 */
function detectDivergence(price, rsi, timeFrame, pair) {
    return new Promise(function(resolve, reject) {
        let column2 = {
            priceValue: price[2],
            rsiValue: rsi[2],
            priceSpike: spike(price[3], price[2], price[1]),
            rsiSpike: spike(rsi[3], rsi[2], rsi[1]),
        };
        log.debug(column2);


        resolve({
            divergence: false,
            period: 0,
            pair: pair,
            timeFrame: timeFrame,
        });
    });
}

/**
 * spike detector
 * @param {number} left The value to the left of target
 * @param {number} head The tagets value
 * @param {number} right The value to the right of target
 * @return {string} the string indicating direction
 */
function spike(left, head, right) {
    if (head > left && head > right) {
        return 'up';
    } else if (head < left && head < right) {
        return 'down';
    } else {
        return 'none';
    }
}

/**
 * calculate RSI
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
 * @param {string} timeFrame The time frame to request.
 * @param {string} pair The pair to request like BTCUSD
 * @param {string} mode last or hist
 * @return {object} the price data
 */
function getPrice(timeFrame, pair, mode) {
return new Promise(function(resolve, reject) {
    let url = 'https://api.bitfinex.com/v2';
    request.get(`${url}/candles/trade:${timeFrame}:t${pair}/${mode}`,
    (error, response, data) => {
        if (data) {
            let price = JSON.parse(data);
            if (!error) {
                if (mode == 'last') {
                    let time = moment.utc(price[0]).local().format('HH:mm');
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
                    let time = moment.utc(item[0]).local().format('HH:mm:ss');
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
            } else {
                reject(error);
            }
        } else {
            log.warn('Bitfinex API is unreachable');
        }
    });
});
}
