'use strict';
const request = require('request');
const moment = require('moment');
const RSI = require('technicalindicators').RSI;

let priceArray = [];
let rsiArray = [];

setInterval(() => {
        getPrice('1m', 'BTCUSD')
        .then((priceData) => {
            return updatePriceArray(priceData);
        })
        .then((priceArray) => {
            calculateRSI(priceArray);
        })
        .catch((error) => {
            console.log(Error(error));
        });
    }, 5000);


/**
 * calculate RSI
 * @param {object} priceArray The proce data
 * @return {object} the RSI Array
 */
function calculateRSI(priceArray) {
    if(priceArray && priceArray.length >= 15){
        let closeArray = [];
        priceArray.forEach((entry) => {
            closeArray.push(entry.close);
        });
        if(closeArray && closeArray.length >=15) {
            rsiArray = RSI.calculate({values:closeArray, period:14});
            console.log(closeArray);
            console.log(rsiArray);
        }
    } else {
        let timeToWait = (15 -priceArray.length) 
        console.log(`Need more data please wait ${timeToWait} min`)
    }
}
        
/**
 * Request price data from Bitfinex
 * @param {object} priceData The proce data
 * @return {object} the price data
 */
function updatePriceArray(priceData) {
    return new Promise(function(resolve, reject) {
        if (priceArray.filter(
            (item) => (item.time === priceData.time)
        ).length == 0 ) {
            priceArray.push(priceData);
        } else {
            priceArray = priceArray.filter(function(el) {
                return el.time !== priceData.time;
            });
            priceArray.push(priceData);
        }
        if (priceArray.length == 30) {
            priceArray.shift();
        }
        resolve(priceArray);
    });
}

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
            let time = moment.utc(price[0]).local().format('HH:mm:ss');
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
