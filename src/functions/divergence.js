'use strict';
const slope = require('./slope');
/**
 * Calculate Slope
 * Is the price or rsi value higher than the slope value
 * @param {object} columns array of all the columns
 * @param {number} pos The position to check
 * @param {string} timeFrame The time frame
 * @param {string} pair The pair
 * @return {object} containing a direction, pair, timeframe and time.
 */

module.exports = async (columns, pos, timeFrame, pair) => {
        if (
            columns[1].priceSpike === 'down' &&
            columns[pos].priceSpike === 'down' &&
            columns[1].rsiSpike === 'down' &&
            columns[pos].rsiSpike === 'down' &&
            columns[pos].priceValue > columns[1].priceValue &&
            columns[pos].rsiValue < columns[1].rsiValue
        ) {
            try {
                let confirmed = await slope('bullish', columns, pos, timeFrame, pair);
                return confirmed;
            } catch (error) {
                console.log(error);
            }
        } else if (
            columns[1].priceSpike === 'up' &&
            columns[pos].priceSpike === 'up' &&
            columns[1].rsiSpike === 'up' &&
            columns[pos].rsiSpike === 'up' &&
            columns[pos].priceValue < columns[1].priceValue &&
            columns[pos].rsiValue > columns[1].rsiValue
        ) {
            try {
                let confirmed = await slope('bearish', columns, pos, timeFrame, pair);
                return confirmed;
            } catch (error) {
                console.log(error);
            }
        } else {
            const period = columns[pos] - columns[1];
            return {direction: 'none', period, timeFrame, pair};
        }
};
