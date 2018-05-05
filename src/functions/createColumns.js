'use strict';
const isJson = require('./isJson');
const divergence = require('./divergence');
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
        if (price && rsi) {
            let columns = [];
            let i;
            for (i = 0; i <= 18; i++) {
                const closeLeft = price[i+2].close;
                const closeTarget = price[i+1].close;
                const closeRight = price[i].close;
                const rsiLeft = rsi[i+2];
                const rsiTarget = rsi[i+1];
                const rsiRight = rsi[i];
                const priceSpike = spike(closeLeft, closeTarget, closeRight);
                const rsiSpike = spike(rsiLeft, rsiTarget, rsiRight);
                const column = i;
                const priceValue = price[i].close;
                const rsiValue = rsi[i];
                const time = price[i].time;
                let data = {column, priceValue, rsiValue, priceSpike, rsiSpike, time};
                if (isJson(data)) {
                    columns.push(data);
                };
            };

            if (columns.length >= 19) {
                let i;
                for (i = 0; i < 19; i++) {
                    divergence(columns, i, timeFrame, pair)
                    .then((result) => {
                        resolve(result);
                    })
                    .catch((error) => {
                        console.log(error);
                    });
                };
            }
        }
    });
};
