'use strict';

const slope = require('./slope');
/**
 * Divergence Strategy
 * For each of the items in the column array we look for divergence
 * @param {object} column The array of column data
 * @param {object} pair The pair of column data
 * @param {object} timeFrame The timeframe of column data
 * @param {object} period The period between spikes
 * @return {object} divergence report
 */
module.exports = function divergenceStrategy(column, pair, timeFrame, period) {
    return new Promise(function (resolve, reject) {
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
                    pair: pair,
                    timeFrame: timeFrame,
                    data: column,
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
                    pair: pair,
                    timeFrame: timeFrame,
                    data: column,
                });
            }
        });
    });
};