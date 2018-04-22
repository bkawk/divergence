'use strict';
const request = require('request');
const moment = require('moment');
// const RSI = require('technicalindicators').RSI;

// let priceArray = [];
// let rsiArray = [];

setInterval(() => {
    // TODO: Make sure there is a close price
        getPrice('1h', 'BTCUSD')
        .then((priceData) => {
            console.log(priceData);
        })
        .catch((error) => {
            console.log(Error(error));
        });
    //     if (priceArray.length >= 7) {
    //         priceArray.reverse();
    //         if(priceData != priceArray[1]){
    //             priceArray.pop();
    //             priceArray.unshift(priceData);
    //             priceArray.reverse();
    //             calculateRSI(priceArray);
    // }

    // } else {
    //     priceArray.reverse();
    //         if(priceData != priceArray[1]){
    //             priceArray.unshift(priceData);
    //         priceArray.reverse();
    // calculateRSI(priceArray);
    // }
    // }
    }, 5000);

/**
 * Request price data from Bitfinex
 * @param {string} timeFrame The time frame to request.
 * @param {string} pair The pair to request
 * @return {object} the price data
 */
    function getPrice(timeFrame, pair) {
        return new Promise(function(resolve, reject) {
            let url = 'https://api.bitfinex.com/v2';
            request.get(`${url}/candles/trade:${timeFrame}:t${pair}/last`,
            (error, response, data) => {
                let price = JSON.parse(data);
                let time = moment.utc(price[0]).local().format('HH:mm');
                if (!error) {
                    resolve({
                        open: price[1],
                        close: price[2],
                        high: price[3],
                        low: price[4],
                        volume: price[5],
                        time: time,
                    });
                } else {
                    reject(error);
                }
            });
        });
    }
