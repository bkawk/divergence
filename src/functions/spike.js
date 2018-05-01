'use strict';

/**
 * Spike Detector
 * Part of being able to detect a divergence is to know where the numbers spike
 * A spike is where the numbers before and after
 * the terget are both higher or lower than the target
 * @param {number} left The value to the left of target
 * @param {number} target The tagets value
 * @param {number} right The value to the right of target
 * @return {string} the string indicating direction
 */

 module.exports = function spike(left, target, right) {
    if (target > left && target > right) {
        return "up";
    } else if (target < left && target < right) {
        return "down";
    } else {
        return "none";
    }
};
