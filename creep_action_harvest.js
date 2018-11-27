
module.exports.run = function (creep) {
    
    if (creep.memory.targetId === undefined) {
        return -1;
    }
    
    let creepCarry = 0;
    for (let resourceName in creep.carry) {
        creepCarry += creep.carry[resourceName];
    }
    if (creepCarry == creep.carryCapacity) {
        return -1;
    }

    let target = Game.getObjectById(creep.memory.targetId);
    if (target === undefined) {
        return -1;
    }
    
    let res = creep.harvest(target);
    if (res == OK) {
        return 1;
    }
    if (res == ERR_NOT_ENOUGH_RESOURCES) {
        return -1;
    }
    if (res == ERR_NOT_IN_RANGE) {
        creep.memory.action = 'travel';
        return 0;
    }
    
    return 0;
};