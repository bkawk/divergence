'use strict';

/**
 * Calculate Slope
 * Is the price or rsi value higher than the slope value
 * @param {number} period The proce data
 * @param {number} firstValue The proce data
 * @param {number} secondValue The proce data
 * @param {string} direction The proce data
 * @return {boolean} true or false
 */
module.exports = function slope(direction, columns, pos, timeFrame, pair) {
    return new Promise(function (resolve, reject) {
        const period = columns[pos].column - columns[1].column;
        const time = columns[1].time
        // const rsiSlopeValue = ((columns[1].rsiValue - columns[pos].rsiValue) / Math.abs(period - 2)) * period;
        // const priceSlopeValue = ((columns[1].priceValue - columns[pos].priceValue) / Math.abs(period - 2)) * period;
        
        if (period <= 3) {
            resolve({direction, period, timeFrame, pair, time})
        } else if (direction == 'bullish') {
            columns.forEach((column, i) => {
                if (i+1 >= columns[1].column && i+1 <= columns[pos].column) {
                    //console.log(column.priceValue);
                }
            })
            resolve({direction:'bullish', period: 10, timeFrame, pair, time})
        } else {
            resolve({direction, period, timeFrame, pair, time})
        }

        // depending on the direction
        // for each period between  columns[1] and columns[pos];
        // check to see if price or rsi gets higher/lower than the slope for that period
        // if either does stop the loop and resolve {direction: 'none', period, timeFrame, pair}
        // if the price or rsi does not get higher/lower than the slope then resolve
        // {direction, period, timeFrame, pair, time}
        

    })
};
