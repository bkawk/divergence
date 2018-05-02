'use strict';

const slope = require('./slope');
const UP = 'up';
const DOWN = 'down';
const BEAR = 'bearish';
const BULL = 'bullish';


function checkIfUpOrDown(i, column, upDown, magicNumber) {
    const secondColumn = column[2];
    if (i <= magicNumber &&
        secondColumn['priceSpike'] === upDown &&
        column[i].priceSpike === upDown &&
        secondColumn['rsiSpike'] === upDown &&
        column[i].rsiSpike === upDown &&
        column[i].priceValue < secondColumn.priceValue &&
        column[i].rsiValue > secondColumn.rsiValue) {
        return true;
    }
    return false;
}

function getValues(column, i) {
    return {
        firstPriceSpikeValue: column[2].priceValue,
        secondPriceSpikeValue: column[i].priceValue,
        firstRsiSpikeValue: column[2].rsiValue,
        secondRsiSpikeValue: column[i].rsiValue
    };
}

function resolveSlope(column, i, bullOrBear, resolve, pair, timeFrame, period) {
    const {firstPriceSpikeValue, secondPriceSpikeValue, firstRsiSpikeValue, secondRsiSpikeValue} = getValues(column, i);
    for (let x = 2; x <= i; x++) {
        const priceSlope = slope(i, firstPriceSpikeValue, secondPriceSpikeValue, bullOrBear);
        const rsiSlope = slope(i, firstRsiSpikeValue, secondRsiSpikeValue, bullOrBear);
        if (priceSlope && rsiSlope && x === i) {
            const divergence = true;
            const period = i;
            resolve({divergence, period, bullOrBear, pair, timeFrame, column});
        } else {
            break;
        }
    }
}

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
    return new Promise(function(resolve) {
        column.forEach((i) => {
            if (checkIfUpOrDown(column, i, UP, 16, BULL, pair, timeFrame, period)) {
                resolveSlope(i, column, resolve);
            }
            if (checkIfUpOrDown(column, i, DOWN, 15, BEAR, pair, timeFrame, period)) {
                resolveSlope(i, column, resolve);
            }
        });
    });
};
