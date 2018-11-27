
var creep_action_manager = require('creep_action_manager');

/**
 * @param {Creep} creep [description]
 * @return {Number} [description]
 */
module.exports.run = function (creep) {
    let vars = creep_action_manager.startAction(creep, false, true, false);
    if (vars == -1) {
        return -1;
    }

    let res = creep.upgradeController(creep.room.controller);

    if (res == OK) {
        return 1;
    }
    if (res == ERR_NOT_IN_RANGE) {
		creep.memory.targetId = creep.room.controller.id;
        creep.memory.action = 'travel';
        return 0;
    }

    return -1;
};
