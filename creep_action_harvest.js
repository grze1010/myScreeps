
var creep_action_manager = require('creep_action_manager');

/**
 * @param {Creep} creep [description]
 * @return {Number} [description]
 */
module.exports.run = function (creep) {

    let vars = creep_action_manager.startAction(creep, true, true, false);
    if (vars == -1) {
        return -1;
    }
    let target = vars.target;

    let res = creep.harvest(target);
    if (res == OK) {
        return 1;
    }
    if (res == ERR_NOT_IN_RANGE) {
        creep.memory.queriedAction = 'harvest';
        creep.memory.action = 'travel';
        return 0;
    }

    return -1;
};
