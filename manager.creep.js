var roleHarvester = require('role.harvester');
var roleUpgrader = require('role.upgrader');
var roleBuilder = require('role.builder');
var roleRepairer = require('role.repairer');
var roleCollector = require('role.collector');
var roleAttacker = require('role.attacker');
var sourceHarvest = require('source.harvest');
var managerResources = require('manager.resources');

module.exports.run = function (creep) {
    var room = creep.room;
    
    if(creep.memory.roomName === undefined || creep.memory.working === undefined) {
        var creepsForThisRoom = _.filter(Game.creeps, (c) => (c.memory.role != 'attacker' && c.memory.roomName == room.name)).length;
        var maxCreepsForThisRoom = room.memory.maxCreeps;
        if (creep.memory.role == 'attacker' || creepsForThisRoom < maxCreepsForThisRoom) {
            creep.memory.roomName = room.name;
            creep.memory.working = true;
        } else {
            creep.memory.roomName = undefined;
            creep.memory.working = false;
        }
    }
    if(creep.memory.working == false){
        if(creep.memory.roomName === undefined || creep.memory.roomName == room.name) {
            module.exports.findNextRoom(creep);
        }
        module.exports.travelBetweenRooms(creep);
        return 0;
    }
    
    if(creep.memory.working) {
        if (creep.memory.role === undefined) {
            changeCreepRole(creep, 'harvester');
        }
        
        if(creep.memory.role == 'harvester' || creep.memory.role == 'upgrader' || creep.memory.role == 'builder' || creep.memory.role == 'repairer') {
            if(creep.memory.collectingResources === undefined) {
                creep.memory.collectingResources = (creep.carry.energy == 0);
            } else if (creep.carry.energy == 0) {
                creep.memory.collectingResources = true;
            } else if (creep.carry.energy == creep.carryCapacity) {
                if(creep.memory.collectingResources && creep.memory.targetId) { //reset target after finishing collecting resources
                    creep.memory.targetId = undefined;
                }
                creep.memory.collectingResources = false;
            }
            
            if(creep.memory.collectingResources) {
                managerResources.run(creep);
            } else {
                var actionResult = 0;
                if(creep.memory.role == 'harvester') {
                    actionResult = roleHarvester.run(creep);
                } else if(creep.memory.role == 'upgrader') {
                    actionResult = roleUpgrader.run(creep);
                } else if(creep.memory.role == 'builder') {
                    actionResult = roleBuilder.run(creep);
                } else if(creep.memory.role == 'repairer') {
                    actionResult = roleRepairer.run(creep);
                } 
                
                if(actionResult == -1) {
                    creep.memory.collectingResources = true;
                }
            }
        } else {
            //scout, attacker, capturer
            if(creep.memory.role == 'attacker') {
                roleAttacker.run(creep);
            } else if(creep.memory.role == 'collector') {
                roleCollector.run(creep);
            }
        }
        //
    }
};

module.exports.travelBetweenRooms = function (creep) {
    var room = Game.getObjectById(creep.memory.roomName)
    //todo
};

module.exports.findNextRoom = function (creep) {
    //todo
    creep.memory.roomName = undefined;
};

module.exports.changeCreepRole = function (creep, newRole) {
    if(!creep) {
        return -1;
    }
    console.log('change creep role from '+creep.memory.role+' to '+newRole);
    // delete Memory.creeps[creep.name];
    creep.memory.role = newRole;
    return 1;
};



