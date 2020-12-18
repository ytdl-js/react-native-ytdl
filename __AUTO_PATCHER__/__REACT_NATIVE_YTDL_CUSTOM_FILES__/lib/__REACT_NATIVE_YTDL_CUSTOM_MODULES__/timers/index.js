const timers = {
    setTimeout: function () {
        const id = global.setTimeout(...arguments);

        const ret = {
            unref: () => id
        }
        return ret;
    }
};

module.exports = timers
