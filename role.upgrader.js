
module.exports.run = function (creep) {
    creep.memory.targetId = creep.room.controller.id;
    if(creep.upgradeController(creep.room.controller) === ERR_NOT_IN_RANGE) {
        creep.moveTo(creep.room.controller, {visualizePathStyle: {stroke: '#FFFFFF'}});
    }
    return 1;
};