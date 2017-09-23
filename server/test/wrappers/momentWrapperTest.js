let assert = require('assert');
let moment = require('moment');

let MomentWrapper = require('../../src/wrappers/momentWrapper');

describe('#getDate()', function () {
    it('should return same date as moment()', function () {
        let wrapperDate = MomentWrapper.getDate();
        let momentDate = moment();
        let isSameDate = momentDate.isSame(wrapperDate);

        assert.equal(isSameDate, true);
    });
});

describe('#getDateWithSpecificTime()', function () {
    it('should return same date as moment() with specific time', function () {
        let wrapperDate = MomentWrapper.getDateWithSpecificTime(12, 12, 12);
        let momentDate = moment({ hour: 12, minute: 12, second: 12 });
        let isSameDate = momentDate.isSame(wrapperDate);

        assert.equal(isSameDate, true);
    });
});

describe('#getMomentFromDate()', function () {
    it('should return same date as moment() with specific time', function () {
        let wrapperDate = MomentWrapper.getMomentFromDate(new Date());
        let momentDate = moment(new Date());
        let isSameDate = momentDate.isSame(wrapperDate);

        assert.equal(isSameDate, true);
    });
});

describe('#isSameDay()', function () {
    it('should return true', function () {
        let wrapperDate = MomentWrapper.getDate();
        let momentDate = moment();
        let isSameDay = MomentWrapper.isSameDay(wrapperDate, momentDate);

        assert.equal(isSameDay, true);
    });
});

describe('#isSameDay()', function () {
    it('should return false', function () {
        let wrapperDate = MomentWrapper.getDate();
        let momentDate = moment({ day: wrapperDate.date() - 1 });
        let isSameDay = MomentWrapper.isSameDay(wrapperDate, momentDate);

        assert.equal(isSameDay, false);
    });
});

describe('#isSameOrAfter()', function () {
    it('should return false', function () {
        let wrapperDate = MomentWrapper.getDate();
        let momentDate = moment({ day: wrapperDate.date() - 1 });
        let isSameOrAfter = MomentWrapper.isSameOrAfter(momentDate, wrapperDate);

        assert.equal(isSameOrAfter, false);
    });
});

describe('#isSameOrAfter()', function () {
    it('should return true', function () {
        let wrapperDate = MomentWrapper.getDate();
        let momentDate = moment({ day: wrapperDate.date() + 1 });
        let isSameOrAfter = MomentWrapper.isSameOrAfter(momentDate, wrapperDate);

        assert.equal(isSameOrAfter, true);
    });
});

describe('#isSameOrBefore()', function () {
    it('should return true', function () {
        let wrapperDate = MomentWrapper.getDate();
        let momentDate = moment({ day: wrapperDate.date() + 1 });
        let isSameOrBefore = MomentWrapper.isSameOrBefore(wrapperDate, momentDate);

        assert.equal(isSameOrBefore, true);
    });
});

describe('#isSameOrBefore()', function () {
    it('should return false', function () {
        let wrapperDate = MomentWrapper.getDate();
        let momentDate = moment({ day: wrapperDate.date() - 1 });
        let isSameOrBefore = MomentWrapper.isSameOrBefore(wrapperDate, momentDate);

        assert.equal(isSameOrBefore, false);
    });
});

describe('#isSameOrAfterDay()', function () {
    it('should return true', function () {
        let wrapperDate = MomentWrapper.getDateWithSpecificTime(0, 0, 0);
        let momentDate = moment();
        let isSameOrAfterDay = MomentWrapper.isSameOrAfterDay(momentDate, wrapperDate);

        assert.equal(isSameOrAfterDay, true);
    });
});

describe('#isSameOrBeforeDay()', function () {
    it('should return true', function () {
        let wrapperDate = MomentWrapper.getDateWithSpecificTime(0, 0, 0);
        let momentDate = moment();
        let isSameOrBeforeDay = MomentWrapper.isSameOrBeforeDay(momentDate, wrapperDate);

        assert.equal(isSameOrBeforeDay, true);
    });
});

describe('#getStartOfWeek()', function () {
    it('should return true', function () {
        let wrapperDate = MomentWrapper.getStartOfWeek();
        let momentDate = moment().startOf('week');
        let isSame = momentDate.isSame(wrapperDate);

        assert.equal(isSame, true);
    });
});

describe('#getEndOfWeek()', function () {
    it('should return true', function () {
        let wrapperDate = MomentWrapper.getEndOfWeek();
        let momentDate = moment().endOf('week');
        let isSame = momentDate.isSame(wrapperDate);

        assert.equal(isSame, true);
    });
});
