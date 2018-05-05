'use strict';
const Ws = require('ws');
const moment = require('moment');

/**
* A service that deal with bitfinex service
* @param {Object[]} timeFrames the time frame needed
* @param {Object[]} pairs the pairs to observe
* @param {string} apiUrl the bitfinex api url
* @return {bitfinexService} bitfinexService to subscribe and get bitfinex data
*/
module.exports = function(timeFrames, pairs, apiUrl) {
    let bitfinexData = [];
    return {
        bitfinexData: bitfinexData,
        /**
         * Get Bitfinex Data
         * @return {bitfinexSubscriptions[]} subscriptions promise
         */
        createBitfinexSubscriptions: function() {
            return new Promise((resolve, reject) => {
                let bitfinexSubscriptions = [];
                timeFrames.forEach((timeFrames) => {
                    pairs.forEach((pairs) => {
                        const event = 'subscribe';
                        const channel = 'candles';
                        const key = `trade:${timeFrames}:t${pairs}`;
                        bitfinexSubscriptions.push({event, channel, key});
                    });
                });
                resolve(bitfinexSubscriptions);
            });
        },
        /**
         * Get Bitfinex Data
         * @param {bitfinexSubscriptions[]} bitfinexSubscriptions
         * @return {bitfinexData[]} bitfinexData promise
         */
        getBitfinexData: function(bitfinexSubscriptions) {
            return new Promise((resolve, reject) => {
                let initialDataComplete = 0;
                const w = new Ws(apiUrl);
                w.on('message', (_msg) => {
                    const msg = JSON.parse(_msg);
                    let timeFrame;
                    let pair;
                    if (msg.event === 'subscribed' && msg.channel === 'candles') {
                        const item = msg.key.split(':');
                        pair = item[2];
                        timeFrame = item[1];
                        const chanId = msg.chanId;
                        const data = [];
                        bitfinexData.push({pair, timeFrame, chanId, data});
                    } else if (msg[0] != undefined && msg[1] != 'hb') {
                        const chanId = msg[0];
                        const price = msg[1];
                        const lookup = this.bitfinexData.filter((obj) => {
                            return obj.chanId === chanId;
                        });
                        let pairData = lookup[0].data;
                        if (price.length > 6) {
                            price.forEach((price) => {
                                const open = price[1];
                                const close = price[2];
                                const high = price[3];
                                const low = price[4];
                                const volume = price[5];
                                const time = price[0];
                                const value = {open, close, high, low, volume, time};
                                const itemTime = moment(time).format('MMMM Do YYYY, H');
                                const lastHour = moment().format('MMMM Do YYYY, H');
                                if (itemTime != lastHour) {
                                    const lastRecord = pairData[pairData.length - 1];
                                    if (lastRecord != value) {
                                        pairData.push(value);
                                    }
                                }
                            });
                        } else {
                            const open = price[1];
                            const close = price[2];
                            const high = price[3];
                            const low = price[4];
                            const volume = price[5];
                            const time = price[0];
                            const value = {open, close, high, low, volume, time};
                            const itemTime = moment(time).format('MMMM Do YYYY, H');
                            const lastHour = moment().format('MMMM Do YYYY, H');
                            if (itemTime != lastHour) {
                                const lastRecord = pairData[pairData.length - 1];
                                if (lastRecord != value) {
                                    pairData.push(value);
                                }
                            }
                        }
                        // if (pairData.length >= 150) {
                        //     pairData.pop();
                        // }
                        if (
                            bitfinexData.length === bitfinexSubscriptions.length &&
                            initialDataComplete === 0) {
                            initialDataComplete = 1;
                            console.log(`Initial Bitfinex data complete`);
                            console.log(`Listening for more data on websockets`);
                            resolve(bitfinexData);
                        }
                    }
                });
                w.on('open', () => {
                    bitfinexSubscriptions.forEach((pairs, i) => {
                        w.send(JSON.stringify(bitfinexSubscriptions[i]));
                    });
                });
            });
        },
    };
};


