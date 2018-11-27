

/**
 * @param {Creep} creep [description]
 * @return {Number} [description]
 */
module.exports.run = function (creep) {

    if (creep.memory.targetId === undefined && creep.memory.pathToTarget === undefined) {
        return -1;
    }

    let path;
    if (creep.memory.pathToTarget === undefined) {
        // TODO: check if path from current pos to target defined in memory

        let target = Game.getObjectById(creep.memory.targetId);
        if (target === undefined) {
            return -1;
        }

        path = creep.pos.findPathTo(target, {range: 1, ignoreCreeps: true});
        creep.memory.pathToTarget = creep.room.serializePath(path);
    }

    let res = creep.moveByPath(path);
    if (res == OK) {
        return 1;
    }
    if (res == ERR_NOT_FOUND) {
        return -1;
    }

    return 0;
};
