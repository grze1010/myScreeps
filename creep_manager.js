var creep_role_worker = require('creep_role_worker');
var creep_role_solider = require('creep_role_solider');

module.exports.doAction = function(creep) {
    //perform action based on role and action field in creep memory
    if (creep.memory.action === undefined) {
        creep.memory.action = 'idle';
    }

    let res;
    if (creep.memory.role === 'worker') {
        res = creep_role_worker.doAction(creep);
    } else if (creep.memory.role === 'solider') {
        res = creep_role_solider.doAction(creep);
    }

    //if can't perform - reset creep memory
    if (res === -1) {
        module.exports.resetCreepMemory(creep);
        return 0;
    }

    return res;
};

module.exports.changeCreepAction = function(creep, action) {
    if(creep !== undefined && action !== undefined) {
        creep.memory.action = action;
        return 1;
    }
    return -1;
}

module.exports.resetCreepMemory = function(creep) {
    if(creep !== undefined) {
        creep.memory.action = 'idle';
        creep.memory.queriedAction = undefined;

        if (creep.memory.targetId !== undefined) {
            creep.memory.oldTargetId = creep.memory.targetId;
        }
        creep.memory.targetId = undefined;

        creep.memory.pathToTarget = undefined;
    }
    return -1;
}
