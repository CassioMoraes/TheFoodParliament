let moment = require('moment');

class MomentWrapper {
    static getDate() {
        return moment();
    }

    static getDateWithSpecificTime(hour, minute, second) {
        return moment({ hour: hour, minute: minute, second: second });
    }

    static getMomentFromDate(date) {
        return moment(date);
    }

    static isSameDay(moment1, moment2) {
        return moment1.isSame(moment2, 'day');
    }

    static isSameOrAfter(moment1, moment2) {
        return moment1.isSameOrAfter(moment2);
    }

    static isSameOrBefore(moment1, moment2) {
        return moment1.isSameOrBefore(moment2);
    }

    static isSameOrAfterDay(moment1, moment2) {
        return moment1.isSameOrAfter(moment2, 'day');
    }

    static isSameOrBeforeDay(moment1, moment2) {
        return moment1.isSameOrBefore(moment2, 'day');
    }

    static getStartOfWeek() {
        return moment().startOf('week');
    }

    static getEndOfWeek() {
        return moment().endOf('week');
    }

    static transformToJustDate(date) {
        return moment(date).set({ hour: 0, minute: 0, second: 0, millisecond: 0 });
    }
}

module.exports = MomentWrapper;