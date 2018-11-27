var roleAttacker = {

    run: function(creep) {
        var target;
        if(creep.memory.targetId) {
            target = Game.getObjectById(creep.memory.targetId);
            if(!target) {
                creep.memory.targetId = undefined;
            }
        }
        
        if(!creep.memory.targetId) {
            target = creep.pos.findClosestByPath(FIND_HOSTILE_CREEPS);
            if(target) {
                creep.memory.targetId = target.id;
            }
        }
        
        if(target) {
            if(creep.attack(target) == ERR_NOT_IN_RANGE) {
                creep.moveTo(target, {visualizePathStyle: {stroke: '#FFFFFF'}});
            }
        } else {
            creep.moveTo(26,12);
        } 
    }
    
};

module.exports = roleAttacker;