'use strict';
const request = require('request');
const moment = require('moment');
const RSI = require('technicalindicators').RSI;

(() => {
    console.log('Starting');
    monitorPair('1m', 'EOSUSD');
    monitorPair('1m', 'BTCUSD');
})();

/**
 * monitorPair
 * @param {object} timeFrame To monitor 
 * @param {object} pair The pair like BTCUSD
 */
function monitorPair(timeFrame, pair) {
    return new Promise(function(resolve, reject) {
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
                    let price = data[0].reverse();
                    let rsi = data[1].reverse();
                    return detectDivergence(price, rsi, timeFrame, pair);
                })
                .then((divergence) => {
                    console.log(divergence);
                })
                .catch((error) => {
                    console.log(Error(error));
                });

            }, 5000);
        });
    });
}

/**
 * Detet divegence
 * @param {object} price The price array data
 * @param {object} rsi The rsi array data
 * @return {boolean} hasa divergence been found true/false
 */
function detectDivergence(price, rsi, timeFrame, pair) {
    return new Promise(function(resolve, reject) {
        resolve({divergence: false, period: 0, pair: pair, timeFrame: timeFrame});
    });
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
        let rsiArray = RSI.calculate({values: closeArray, period: 14});
        resolve([closeArray, rsiArray]);
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
                        let time = moment.utc(price[0]).local().format('HH:mm:ss');
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
                console.log('Bitfinex API is unreachable');
            }
        });
    });
}
