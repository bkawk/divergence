'use strict';
const moment = require('moment');
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
        const period = columns[pos].column;
        const time = columns[1].time;
        const endTime = columns[pos].time;
        const priceY1 = columns[1].priceValue;
        const priceY2 = columns[pos].priceValue;
        const rsiY1 = columns[1].rsiValue;
        const rsiY2 = columns[pos].rsiValue;
        const priceSlope = (priceY2- priceY1) / period;
        const rsiSlope = (rsiY2 - rsiY1) / period;
        const divergenceColumn = columns[pos].column;
        let testData = [];
        if (period <= 3) {
            // console.log('------- START ---------');
            // console.log(moment(time).format('MMMM Do YYYY, H'));
            // console.log('------- DIVERGENCE  ---------');
            // console.log({direction, period, timeFrame, pair, time});
            // console.log('------- END ---------');
            // console.log(moment(endTime).format('MMMM Do YYYY, H'));
            resolve({direction, period, timeFrame, pair, time});
        } else {
            columns.forEach((column, i) => {
                if (i > columns[1].column && i < divergenceColumn) {
                    testData.push(column);
                    let priceLine = ((i-1) * priceSlope) + priceY1;
                    let rsiLine = ((i-1) * rsiSlope) + rsiY1;
                    if (column.priceValue > priceLine || column.rsiValue > rsiLine) {
                        resolve({direction: 'none', period, timeFrame, pair});
                    }
                }
            });
            // console.log(moment(time).format('MMMM Do YYYY, h:mm:ss a'));
            // console.log('------- DIVERGENCE  ---------');
            // console.log({direction, period, timeFrame, pair, time});
            // console.log('------- END ---------');
            // console.log(moment(endTime).format('MMMM Do YYYY, h:mm:ss a'));
            resolve({direction, period, timeFrame, pair, time});
        };
    });
};
