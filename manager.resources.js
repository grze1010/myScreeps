
module.exports.run = function(creep) {
    var res;
    
    if(creep.room.memory.droppedResourceId) {
        res = module.exports.collectDroppedResources(creep);
        if(res === 1) {
            return res;
        }
    }

    res = module.exports.transportResourcesOtherThenEnergy(creep);
    if(res === 1) {
        return res;
    }
    
    res = module.exports.harvestSource(creep);
    if(res === -1) {
        return module.exports.getResourcesFromContainerAssignedToThisSource(creep);
    }
    
    return res;
}

module.exports.harvestSource = function(creep) {
    if(!creep.memory.sourceId) {
        module.exports.findSource(creep);
    }
    
    var target = Game.getObjectById(creep.memory.sourceId);
    if(!target) {
        creep.memory.sourceId = undefined;
        return 0;
    }
    
    if(target && target.energy > 0) {
        if(creep.harvest(target) === ERR_NOT_IN_RANGE) {
            creep.moveTo(target, {visualizePathStyle: {stroke: '#FFFFFF'}});
        }
        return 1;
    }

    if(target && target.ticksToRegeneration > 30 && creep.carry.energy > 0) {
        creep.memory.collectingResources = false;
        return 1;
    }
    
    return -1;
};

module.exports.findSource = function(creep) {
    var room = creep.room;
    
    //reset creep sourceId if source not in this room
    if(creep.memory.sourceId && !room.memory.sourcesByIds[creep.memory.sourceId]) {
        creep.memory.sourceId = undefined;
    }
    
    if(!creep.memory.sourceId) {
        for(var sourceId in room.memory.sourcesByIds) {
            var source = Game.getObjectById(sourceId);

            if(source.energy === 0) {
                continue;
            }
            
            var maxWorkers = room.memory.sourcesByIds[sourceId].maxWorkers;
            var currentNrOfWorkers = _.filter(Game.creeps, (c) => c.memory.sourceId === sourceId).length;
            if (currentNrOfWorkers < maxWorkers) {
                creep.memory.sourceId = sourceId;
                return 1;
            }
        }
        console.log('all active sources in this room have max workers');
    }
};

module.exports.getResourcesFromContainerAssignedToThisSource = function(creep) {
    var room = creep.room;
    var source = Game.getObjectById(creep.memory.sourceId);
    var containers = source.pos.findInRange(FIND_STRUCTURES, 1, { 
        filter: (c) => { 
            return c.structureType === STRUCTURE_CONTAINER && c.store.energy > 0; 
        } 
    });
    
    var isTargetOneOfContainers = creep.memory.role === 'harvester' 
            && creep.memory.targetId 
            && Game.getObjectById(creep.memory.targetId) 
            && Game.getObjectById(creep.memory.targetId).structureType === STRUCTURE_CONTAINER;
    if(isTargetOneOfContainers) {
        console.log('empty energy source, energy left only in containers');
        creep.memory.targetId = undefined;
    }

    for (var i in containers) {
        var container = containers[i];
        if(creep.withdraw(container, RESOURCE_ENERGY) === ERR_NOT_IN_RANGE) {
            creep.moveTo(container, {visualizePathStyle: {stroke: '#FFFFFF'}});
        }
        return 1;
    }
    
    console.log('no energy left in containers');
    
    return -1;
};

module.exports.transportResourcesOtherThenEnergy = function(creep) {
    var hasOtherResources = false;
    for(var resourceName in creep.carry) {
        if(resourceName === RESOURCE_ENERGY) {
            continue;
        }
        if(resourceName) {
            hasOtherResources = true;
            break;
        }
    }
    
    if(hasOtherResources) {
        var target;
        if(creep.memory.targetId) {
            target = Game.getObjectById(creep.memory.targetId);
            
            if(!target || target.structureType !== STRUCTURE_STORAGE) {
                target = creep.room.find(FIND_STRUCTURES, {
                    filter : (s) => s.structureType === STRUCTURE_STORAGE
                })[0];
                
                if(target) {
                    creep.memory.targetId = target;
                }
            }
            
            if(target) {
                for(var resourceName in creep.carry) {
                    if(creep.transfer(target, resourceName) === ERR_NOT_IN_RANGE) {
                        creep.moveTo(target, {visualizePathStyle: {stroke: '#FFFFFF'}});
                    }
                }
                return 1;
            }
        }
        return -1;
    }
    
    // if(creep.memory.targetId && Game.getObjectById(creep.memory.targetId).structureType === STRUCTURE_STORAGE) {
    creep.memory.targetId = undefined;
    // }
    
    return 0;
};


module.exports.collectDroppedResources = function (creep) {
    var collectors = _.filter(Game.creeps, (c) => c.memory.roomName === creep.room.roomName && c.memory.collectingDropped);
    if(collectors.length > 0) {
        return 0;
    }

    var target = Game.getObjectById(creep.room.memory.droppedResourceId);
    if(target) {
        if(target.type === 'resource') { //single resource
            if(creep.pickup(target) === ERR_NOT_IN_RANGE) {
                creep.moveTo(target, {visualizePathStyle: {stroke: '#FFFFFF'}});
                creep.memory.collectingDropped = true;
            }
            return 1;
        }
        
        if(target.store) { //tombstone
            for(var resourceName in target.store) {
                if(creep.withdraw(target, resourceName) === ERR_NOT_IN_RANGE) {
                    creep.moveTo(target, {visualizePathStyle: {stroke: '#FFFFFF'}});
                    creep.memory.collectingDropped = true;
                    break;
                }
            }
            return 1;
        }
        
        return -1;
    }
    room.memory.droppedResourcePos = undefined;
    return 0;
};









