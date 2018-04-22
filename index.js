"use strict";
const request = require('request');
const RSI = require('technicalindicators').RSI;
const moment = require('moment');

let priceArray = [];
let rsiArray = [];
let timeFrame = '1h';

setInterval(() => { 
    // TODO: Make sure there is a close price
        getPrice(timeFrame)
        .then((priceData) => {
            console.log(priceData);
        })
        .catch((error) => {
            console.log(Error(error));
        })
        
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


//     var milliseconds = 1000;
// 

    function getPrice(timeFrame) {
        return new Promise(function(resolve, reject) {
            let url = 'https://api.bitfinex.com/v2';
            request.get(`${url}/candles/trade:${timeFrame}:tBTCUSD/last`, (error, response, data) => {
                let price = JSON.parse(data);
                let time = moment.utc(price[0]).local().format("DD/MM/YYYY HH:mm:ss");
                if (!error) { 
                    resolve({open:price[1], close:price[2], high: price[3], low:price[4], volume:price[5], time:time});
                } else {
                    reject(error);
                }
            })
        })
    }
        