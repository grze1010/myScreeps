//todo: role planner, hauler

var creep_action_build = require('creep_action_build');
var creep_action_collectDropped = require('creep_action_collectDropped');
var creep_action_harvest = require('creep_action_harvest');
var creep_action_idle = require('creep_action_idle');
var creep_action_repair = require('creep_action_repair');
var creep_action_transfer = require('creep_action_transfer');
var creep_action_travel = require('creep_action_travel');
var creep_action_upgradeController = require('creep_action_upgradeController');
var creep_action_withdraw = require('creep_action_withdraw');

/**
 * @param {Creep} creep [description]
 * @return {Number} [description]
 */
module.exports.doAction = function (creep) {
    if(creep.memory.action !== 'idle' && creep.memory.idleCounter) {
        creep.memory.idleCounter = 0;
    }

    switch (creep.memory.action) {
        case 'idle':
            return creep_action_idle.run(creep);
        case 'travel':
            return creep_action_travel.run(creep);
        case 'harvest':
            return creep_action_harvest.run(creep);
        case 'withdraw':
            return creep_action_withdraw.run(creep);
        case 'transfer':
            return creep_action_transfer.run(creep);
        case 'build':
            return creep_action_build.run(creep);
        case 'repair':
            return creep_action_repair.run(creep);
        case 'collectDropped':
            return creep_action_collectDropped.run(creep);
        case 'upgradeController':
            return creep_action_upgradeController.run(creep);
        default:
            break;
    }

    return -1;
};
