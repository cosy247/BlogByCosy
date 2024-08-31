const windowEvents = {};
const timeInterval = 100;
const intervalEvents = ['scroll']
let lastTimeValue = 0;

export default {
    add(eventName, eventCallback) {
        if (windowEvents.hasOwnProperty(eventName)) {
            windowEvents[eventName].add(eventCallback);
        } else {
            windowEvents[eventName] = new Set();
            windowEvents[eventName].add(eventCallback);
            window.addEventListener(eventName, (e) => {
                if(intervalEvents.includes(eventName)) {
                    const timeValue = Date.now();
                    if(timeValue - lastTimeValue < timeInterval) {
                        return;
                    } else {
                        lastTimeValue = timeValue;
                    }
                }
                windowEvents[eventName].forEach((callback) => callback(e));
            });
        }
    },
    remove(eventName, eventCallback) {
        if (windowEvents.hasOwnProperty(eventName)) {
            windowEvents[eventName].delete(eventCallback);
        }
    },
};
