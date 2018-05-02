'use strict';
const isJson = require('../functions/isJson');
const divergenceStrategy = require('./divergenceStrategy');
const spike = require('./spike');
/**
 * Detect Divegence
 * First stage of finding a divergence by preparing the column array
 * @param {object} price The price array data
 * @param {object} rsi The rsi array data
 * @param {object} timeFrame The timeframe
 * @param {object} pair The pair
 * @return {boolean} has a divergence been found true/false
 */
module.exports = function createColumns(price, rsi, timeFrame, pair) {
    return new Promise(function(resolve, reject) {
        let columns = [];
        price.forEach((entry, i) => {
            if (price && i > 0 && i < 18) {
                const priceSpike = spike(price[i + 1].close, price[i].close, price[i - 1].close);
                const rsiSpike = spike(rsi[i + 1], rsi[i], rsi[i - 1]);
                const column = i;
                const priceValue = price[i].close;
                const rsiValue = rsi[i];
                const time = price[i].time;
                let data = {column, priceValue, rsiValue, priceSpike, rsiSpike, time};
                if (isJson(data)) {
                    columns.push(data);
                };
            }
        });
        if (columns.length > 1) {
            Promise.all([divergenceStrategy(columns, pair, timeFrame)])
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
};
