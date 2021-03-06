
var creep_action_manager = require('creep_action_manager');

/**
 * @param {Creep} creep [description]
 * @return {Number} [description]
 */
module.exports.run = function (creep) {

    let vars = creep_action_manager.startAction(creep, true, true, false);
    if (vars === -1) {
        return -1;
    }
    let target = vars.target;

    let res;
    if (creep.memory.resourceName) {
        res = creep.withdraw(target, creep.memory.resourceName);
    } else {
        for (let resourceName in target.store) {
            res = creep.withdraw(target, resourceName);
            break;
        }
    }

    if (res === OK) {
        return 1;
    }
    if (res === ERR_NOT_IN_RANGE) {
        creep.memory.queriedAction = 'withdraw';
        creep.memory.action = 'travel';
        return 0;
    }

    return -1;
};
