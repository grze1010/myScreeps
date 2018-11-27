
module.exports.run = function (creep) {
	if(creep.memory.targetId) {
        var target = Game.getObjectById(creep.memory.targetId);
        if(target && ((target.hitsMax <= 100000 && target.hits < target.hitsMax)
                || (target.hitsMax > 100000 && target.hits < 100000))) {
            if(creep.repair(target) == ERR_NOT_IN_RANGE) {
                creep.moveTo(target, {visualizePathStyle: {stroke: '#FFFFFF'}});
            }
            return 1;
        }
    }
    var target = module.exports.findClosestTarget(creep);
    if(target) {
        creep.memory.targetId = target.id;
    } else {
        creep.memory.targetId = undefined;
    }
    
    if(!creep.memory.targetId) {
        return -1;
    }
    return 0;
};

module.exports.findClosestTarget = function (creep) {
    if (creep === undefined) {
        return undefined;
    }
    var target = creep.pos.findClosestByPath(FIND_STRUCTURES, {
        filter: (structure) => {
            return !structure.ticksToDecay && ((structure.hitsMax <= 100000 && structure.hits < structure.hitsMax)
                || (structure.hitsMax > 100000 && structure.hits < 100000));
        } 
    });
    if(!target) {
        target = creep.pos.findClosestByPath(FIND_STRUCTURES, {
            filter: (structure) => {
                return !structure.ticksToDecay && structure.hits < structure.hitsMax;
            } 
        });
    }
    return target;
};


