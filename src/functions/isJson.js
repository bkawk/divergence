'use strict';
export function isJson(json) {
    const text = JSON.stringify(json);
    try {
        JSON.parse(text);
        return true;
    } catch (error) {
        return false;
    };
};
