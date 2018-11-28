//todo: role dismantler

var creep_action_attack = require('creep_action_attack');
var creep_action_scout = require('creep_action_scout');
var creep_action_travel = require('creep_action_travel');

/**
 * @param {Creep} creep [description]
 * @return {Number} [description]
 */
module.exports.doAction = function (creep) {
    if (creep.memory.action === 'idle') {
        //waiting for action, move to some some spot?
        return 0;
    }

    switch (creep.memory.action) {
        case 'travel':
            return creep_action_travel.run(creep);
        case 'attack':
            return creep_action_attack.run(creep);
        case 'scout':
            return creep_action_scout.run(creep);
        default:
            break;
    }

    return -1;
};
