
var creep_action_manager = require('creep_action_manager');

/**
 * @param {Creep} creep [description]
 * @return {Number} [description]
 */
module.exports.run = function (creep) {

	//waiting for action (between actions / energy source is empty etc.)
    if (creep.memory.idleCounter === undefined) {
        creep.memory.idleCounter = 0;
    } else if (creep.memory.idleCounter > 2) {
        creep.memory.targetId = creep.memory.sourceId;
        creep.memory.action = 'travel';
        creep.memory.idleCounter = undefined;
    }
    creep.memory.idleCounter += 1;
    
    if (creep.memory.queriedAction !== undefined) {
        creep.memory.action = creep.memory.queriedAction;
        creep.memory.queriedAction = undefined;
        return 1;
    }
    
    return 0;
};
