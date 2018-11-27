
var creep_action_travel = require('creep_action_travel');
var creep_action_harvest = require('creep_action_harvest');
var creep_action_collectFromStorage = require('creep_action_collectFromStorage');
var creep_action_transferToStructure = require('creep_action_transferToStructure');
var creep_action_build = require('creep_action_build');
var creep_action_repair = require('creep_action_repair');
var creep_action_collectDropped = require('creep_action_collectDropped');
var creep_action_upgradeController = require('creep_action_upgradeController');

module.exports.doAction = function (creep) {
    if(creep.memory.action != 'idle' && creep.memory.idleCounter) {
        creep.memory.idleCounter = 0;
    }
    
    if (creep.memory.action == 'idle') {
        //waiting for action (empty energy source etc)
        if (creep.memory.idleCounter === undefined) {
            creep.memory.idleCounter = 0;
        } else if (creep.memory.idleCounter > 2) {
            creep.memory.targetId = creep.memory.sourceId;
            creep.memory.action = 'travel';
            creep.memory.idleCounter = undefined;
        }
        creep.memory.idleCounter += 1;
        return 0;
    } 
    
    if (creep.memory.action == 'travel') {
        return creep_action_travel.run(creep);
    } 
    if (creep.memory.action == 'harvest') {
        return creep_action_harvest.run(creep);
    } 
    if (creep.memory.action == 'collectFromStorage') {
        return creep_action_collectFromStorage.run(creep);
    }
    if (creep.memory.action == 'transferToStructure') {
        return creep_action_transferToStructure.run(creep);
    }
    if (creep.memory.action == 'build') {
        return creep_action_build.run(creep);
    }
    if (creep.memory.action == 'repair') {
        return creep_action_repair.run(creep);
    }
    if (creep.memory.action == 'collectDropped') {
        return creep_action_collectDropped.run(creep);
    }
    if (creep.memory.action == 'upgradeController') {
        return creep_action_upgradeController.run(creep);
    }
    return -1;
};