

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
        // TODO: check if path from oldTargetId to targetId is defined in memory
        // if not found && targetId !== undefined && oldTargetId !== undefined, add this path to memory
        // avoid structures (structures near middlePoint?)
        // use PathFinder with range: 1 for structures/creeps
        //todo: if next tile has structure - rewrite path, if has creep - overtake to right

        let target = Game.getObjectById(creep.memory.targetId);
        //todo: if target source - if has container and is houler - move to container, if has no containers - move to empty tile
        if (target === undefined) {
            return -1;
        }

        path = creep.pos.findPathTo(target, {range: 1, ignoreCreeps: true});
        creep.memory.pathToTarget = creep.room.serializePath(path);
    }
    
    if (path === undefined && creep.memory.pathToTarget !== undefined) {
        path = creep.room.deserializePath(creep.memory.pathToTarget);
    }

    let res = creep.moveByPath(path);
        // visualizePathStyle: {
        //     fill: 'aqua',
        //     stroke: '#000000',
        //     lineStyle: 'dashed',
        //     strokeWidth: .2,
        //     opacity: .4
        // }
        
    if (res == OK) {
        return 1;
    }
    if (res == ERR_NOT_FOUND) {
        return -1;
    }

    return 0;
};
