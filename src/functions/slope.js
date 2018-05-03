'use strict';

/**
 * Calculate Slope
 * Is the price or rsi value higher than the slope value
 * @param {number} direction The proce data
 * @param {number} columns The proce data
 * @param {number} pos The proce data
 * @param {string} timeFrame The proce data
 * @param {string} pair The proce data
 * @return {boolean} true or false
 */
module.exports = function slope(direction, columns, pos, timeFrame, pair) {
    return new Promise((resolve, reject) => {
        const period = columns[pos].column - columns[1].column;
        const time = columns[1].time;
        if (period <= 3) {
            resolve({direction, period, timeFrame, pair, time});
        } else if (direction == 'bullish') {
            columns.forEach((column, i) => {
                if (i+1 >= columns[1].column && i+1 <= columns[pos].column) {
                    let priceSlope = (columns[pos].priceValue - columns[1].priceValue) / (1-period);
                    let rsiSlope = (columns[pos].rsiValue - columns[1].rsiValue) / (1-period);
                    let maxPrice = columns[1].priceValue + (priceSlope * i);
                    let maxRsi = columns[1].rsiValue + (rsiSlope * i);
                    console.log(maxPrice);
                    console.log(maxRsi);
                    if (maxPrice > column.priceValue || maxRsi > column.rsiValue) {
                        resolve({direction: 'none', period, timeFrame, pair});
                    } else {
                        resolve({direction, period, timeFrame, pair, time});
                    }
                }
            });
        } else {
            columns.forEach((column, i) => {
                if (i+1 >= columns[1].column && i+1 <= columns[pos].column) {
                    let priceSlope = (columns[pos].priceValue - columns[1].priceValue) / (1-period);
                    let rsiSlope = (columns[pos].rsiValue - columns[1].rsiValue) / (1-period);
                    let minPrice = columns[1].priceValue + (priceSlope * i);
                    let minRsi = columns[1].rsiValue + (rsiSlope * i);
                    if (minPrice < column.priceValue || minRsi < column.rsiValue) {
                        resolve({direction: 'none', period, timeFrame, pair});
                    } else {
                        resolve({direction, period, timeFrame, pair, time});
                    }
                }
            });
        }
    });
};
