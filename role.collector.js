//todo withdraw from tombstone
module.exports.run = function (creep) {

    return 0;
};

module.exports.findClosestTarget = function (creep) {
    if (creep === undefined) {
        return undefined;
    }
    return creep.pos.findClosestByPath(FIND_DROPPED_RESOURCES);
};