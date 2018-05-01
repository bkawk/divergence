'use strict';

const divergenceStrategy = require('./divergencestrategy');
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
    return new Promise(function (resolve, reject) {
        let column = [];
        price.forEach((entry, i) => {
            if (price && i > 0 && i < 18) {
                let data = {
                    column: i,
                    priceValue: price[i],
                    rsiValue: rsi[i],
                    priceSpike: spike(price[i + 1], price[i], price[i - 1]),
                    rsiSpike: spike(rsi[i + 1], rsi[i], rsi[i - 1]),
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
                .then(function (res) {
                    res.forEach((data) => {
                        if (data.divergence) {
                            resolve(data);
                        };
                    });
                })
                .catch(function (err) {
                    console.error('Promise.all error', err);
                });
        }
    });
};