
module.exports.run = function (creep) {
	if(creep.memory.targetId) {
        var target = Game.getObjectById(creep.memory.targetId);
        if(target && target.progressTotal) {
            if(creep.build(target) === ERR_NOT_IN_RANGE) {
                creep.moveTo(target, {visualizePathStyle: {stroke: '#FFFFFF'}});
            }
            return 1;
        }
    }
    var target = creep.pos.findClosestByPath(FIND_MY_CONSTRUCTION_SITES);
    if(target) {
        creep.memory.targetId = target.id;
    } else {
        creep.memory.targetId = undefined;
        return 0;
    }
    
    if(!creep.memory.targetId) {
        return -1;
    }
    return 0;
};