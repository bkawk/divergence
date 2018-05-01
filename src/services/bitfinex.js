'use strict';
const Ws = require('ws'); 
const moment = require('moment');
/** 
* A service that deal with bitfinex service
*/
module.exports = class BitFinexService {
    /**
     * Create BitFinexService
     * @param {Object[]} timeFrames the time frame needed
     * @param {Object[]} pairs the pairs to observe
     * @param {string} apiUrl the bitfinex api url
     */
    constructor(timeFrames, pairs, apiUrl) {
        this.timeFrames = timeFrames;
        this.pairs = pairs;
        this.apiUrl = apiUrl;
        this.bitfinexData = [];
    }
    /**
     * Get Bitfinex Data
     * @return {bitfinexSubscriptions[]} subscriptions promise
     */
    createBitfinexSubscriptions() {
        return new Promise(function (resolve, reject) {
            let bitfinexSubscriptions = [];
            this.timeFrames.forEach((timeFrames) => {
                this.pairs.forEach((pairs) => {
                    bitfinexSubscriptions.push({
                        event: 'subscribe',
                        channel: 'candles',
                        key: `trade:${timeFrames}:t${pairs}`,
                    });
                });
            });
            resolve(bitfinexSubscriptions);
        }.bind(this));
    }
    /**
     * Get Bitfinex Data
     * @param {bitfinexSubscriptions[]} bitfinexSubscriptions
     * @return {bitfinexData[]} bitfinexData promise
     */
    getBitfinexData(bitfinexSubscriptions) {
        return new Promise(function (resolve, reject) {
            let initialDataComplete = 0;
            const w = new Ws(this.apiUrl);
            w.on('message', (msg) => {
                let data = JSON.parse(msg);
                if (data.event == 'subscribed' && data.channel == 'candles') {
                    let key = data.key.split(':');
                    this.bitfinexData.push({
                        pair: key[2],
                        timeFrame: key[1],
                        chanId: data.chanId,
                        data: [],
                    });
                } else if (data[0] != undefined && data[1] != 'hb') {
                    let chanId = data[0];
                    let price = data[1];
                    let time = moment.unix(price[0]).local().format('HH:mm');
                    let pair = this.bitfinexData.filter((obj) => {
                        return obj.chanId === chanId;
                    });
                    let pairData = pair[0].data;
                    if (price.length > 6) {
                        price.forEach((price) => {
                            let time = moment.unix(
                                price[0]).local().format('HH:mm');
                            pairData.push({
                                open: price[1],
                                close: price[2],
                                high: price[3],
                                low: price[4],
                                volume: price[5],
                                time: time,
                            });
                        });
                    } else {
                        pairData.push({
                            open: price[1],
                            close: price[2],
                            high: price[3],
                            low: price[4],
                            volume: price[5],
                            time: time,
                        });
                    }
                    if (pairData.length >= 150) {
                        pairData.shift();
                    }
                    if (this.bitfinexData.length == bitfinexSubscriptions.length &&
                        initialDataComplete == 0) {
                        initialDataComplete = 1;
                        console.log(`Initial Bitfinex data complete`);
                        console.log(`Listening for more data on websockets`);
                        resolve(this.bitfinexData);
                    }
                }
            });
            w.on('open', () => {
                bitfinexSubscriptions.forEach((pairs, i) => {
                    w.send(JSON.stringify(bitfinexSubscriptions[i]));
                });
            });
        }.bind(this));
    }

};

