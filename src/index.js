'use strict';
const bitfinexData = require('./bitfinexData');
const dataScanner = require('./dataScanner');
const subscriptions = require('./subscriptions');

setImmediate(() => {
    console.log(`Divergence Detector Started`);
    subscriptions()
    .then((subscriptions) => {
        return bitfinexData(subscriptions);
    })
    .then((data) => {
        let waitingForHour = 0;
        setInterval(() => {
            if (waitingForHour === 0) {
                console.log(`Waiting for the top of the hour before scanning`);
                waitingForHour = 1;
            }
            const minutes = new Date().getMinutes();
            const seconds = new Date().getSeconds();
            if (minutes === 0 && seconds === 0) {
                console.log(`Top of the hour is now`);
                dataScanner(data);
            }
            dataScanner(data);
        }, 10000);
    })
    .catch((error) => {
        console.log(error);
    });
});
