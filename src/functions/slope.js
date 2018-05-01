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
module.exports = function slope(period, firstValue, secondValue, direction) {
    let slopeValue = ((firstValue - secondValue) / Math.abs(period - 2)) * period;
    if (direction == 'bullish') {
        return (secondValue <= slopeValue);
    } else {
        return (secondValue >= slopeValue);
    };
};
