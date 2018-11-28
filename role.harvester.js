
module.exports.run = function (creep) {
    var target;
    if(!creep.memory.targetId) {
        target = module.exports.findTarget(creep);
    } else {
        target = Game.getObjectById(creep.memory.targetId);
        if(!target || !module.exports.doesNeedEnergy(target)) {
            target = module.exports.findTarget(creep);
        }
    }
    if(!target) {
        return -1;
    }

    if(creep.transfer(target, RESOURCE_ENERGY) === ERR_NOT_IN_RANGE) {
        creep.moveTo(target, {visualizePathStyle: {stroke: '#FFFFFF'}});
    }
    return 1;
};

module.exports.findTarget = function (creep) {
    var target = module.exports.findClosestTarget(creep);
    if(target) {
        creep.memory.targetId = target.id;
        return target;
    }

    creep.memory.targetId = undefined;
};

module.exports.findClosestTarget = function (creep) {
    if (creep === undefined) {
        return undefined;
    }
    var target = creep.pos.findClosestByPath(FIND_MY_STRUCTURES, {
        filter: (structure) => {
            return (structure.structureType === STRUCTURE_SPAWN
                || structure.structureType === STRUCTURE_EXTENSION)
                && module.exports.doesNeedEnergy(structure);
        }
    });
    if(!target) {
        target = creep.pos.findClosestByPath(FIND_MY_STRUCTURES, {
            filter: (structure) => {
                return structure.structureType === STRUCTURE_TOWER
                    && module.exports.doesNeedEnergy(structure);
            }
        });
    }
    if(!target) {
        target = creep.pos.findClosestByPath(FIND_STRUCTURES, {
            filter: (structure) => {
                return structure.structureType === STRUCTURE_CONTAINER
                    && module.exports.doesNeedEnergy(structure);
            }
        });
    }

    return target;
};

module.exports.doesNeedEnergy = function (structure) {
    return ((structure.structureType === STRUCTURE_SPAWN
            || structure.structureType === STRUCTURE_EXTENSION)
                && structure.energy < structure.energyCapacity)
            || (structure.structureType === STRUCTURE_CONTAINER
                && structure.store.energy < structure.storeCapacity)
            || (structure.structureType === STRUCTURE_TOWER
                && structure.energy < structure.energyCapacity*9/10);
}
