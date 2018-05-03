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
                if (i >= columns[1].column && i+2 <= columns[pos].column) {
                    let X1 = period+1;
                    let X2 = 1;
                    let priceY1 = columns[1].priceValue;
                    let priceY2 = columns[pos].priceValue;
                    let rsiY1 = columns[1].rsiValue;
                    let rsiY2 = columns[pos].rsiValue;
                    let priceSlope = (priceY1 - priceY2) / (X2-X1);
                    let rsiSlope = (rsiY1 - rsiY2) / (X2-X1);
                    let priceMax = columns[1].priceValue + ((i-1) * priceSlope);
                    let rsiMax = columns[1].rsiValue + ((i-1) * rsiSlope);
                    if (column.priceValue > priceMax || column.rsiValue > rsiMax) {
                        resolve({direction: 'none', period, timeFrame, pair});
                    }
                }
            });
            resolve({direction, period, timeFrame, pair, time});
        } else {
            columns.forEach((column, i) => {
                if (i >= columns[1].column && i+2 <= columns[pos].column) {
                    let X1 = period+1;
                    let X2 = 1;
                    let priceY1 = columns[1].priceValue;
                    let priceY2 = columns[pos].priceValue;
                    let rsiY1 = columns[1].rsiValue;
                    let rsiY2 = columns[pos].rsiValue;
                    let priceSlope = (priceY1 - priceY2) / (X2-X1);
                    let rsiSlope = (rsiY1 - rsiY2) / (X2-X1);
                    let priceMax = columns[1].priceValue + ((i-1) * priceSlope);
                    let rsiMax = columns[1].rsiValue + ((i-1) * rsiSlope);
                    if (column.priceValue > priceMax || column.rsiValue > rsiMax) {
                        resolve({direction: 'none', period, timeFrame, pair});
                    }
                }
            });
            resolve({direction, period, timeFrame, pair, time});
        }
    });
};
