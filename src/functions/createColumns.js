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
        let column = [];
        price.forEach((entry, i) => {
            if (price && i > 0 && i < 18) {
                const priceSpike = spike(price[i + 1], price[i], price[i - 1]);
                const rsiSpike = spike(rsi[i + 1], rsi[i], rsi[i - 1]);
                let data = {column: i, priceValue: price[i], rsiValue: rsi[i], priceSpike: priceSpike, rsiSpike: rsiSpike};
                if (isJson(data)) {
                    column.push(data);
                } else {
                    console.log('Bad Data 2');
                }
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
};
