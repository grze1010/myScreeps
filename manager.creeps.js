var managerCreep = require('manager.creep');
var roleHarvester = require('role.harvester');
var roleRepairer = require('role.repairer');

module.exports.run = function (room) {
    var roomCreeps = room.find(FIND_MY_CREEPS);
    console.log('all creeps in this room (with attackers etc.): '+roomCreeps.length);
    var roomSpawns = room.find(FIND_MY_SPAWNS);
    var roomExtensions = room.find(FIND_MY_STRUCTURES, {
        filter: (structure) => {
                return structure.structureType == 'extension';
        }
    });
    var droppedResources = room.find(FIND_DROPPED_RESOURCES)[0];
    if(!droppedResources) {
        droppedResources = room.find(FIND_TOMBSTONES, {
            filter : (t) => {
                for(var r in t.store) {
                    if(t.store[r]) {
                        return true;
                    }
                }
                return false;
            }
        })[0];
    }
    if(droppedResources) {
        console.log('dropped resources available: '+JSON.stringify(droppedResources));
        room.memory.droppedResourceId = droppedResources.id;
    } else {
        room.memory.droppedResourceId = undefined;
        var collectors = _.filter(roomCreeps, (c) => c.memory.collectingDropped);
        for(var i in collectors) {
            collectors[i].memory.collectingDropped = undefined;
        }
    }

    for(var sourceId in room.memory.sourcesByIds) {
        console.log('sourceId: '+sourceId+', number of creeps: '+_.filter(Game.creeps, (creep) => creep.memory.sourceId == sourceId).length);
    }

    module.exports.spawnCreeps(room, roomSpawns, roomCreeps, roomExtensions);
    module.exports.creepActions(room, roomSpawns, roomCreeps);
    module.exports.manageRoles(room, roomCreeps);
};

module.exports.spawnCreeps = function (room, roomSpawns, roomCreeps, roomExtensions) {
    console.log('----- spawn creeps start');

    var attackers = _.filter(roomCreeps, (creep) => creep.memory.role == 'attacker');
    var maxAttackers = 1;

    roomSpawns.forEach( function (spawn) {
        var availableEnergy = spawn.energy;
        roomExtensions.forEach( function (extension) {
            availableEnergy += extension.energy;
        });
        if (availableEnergy => 1300) {
            if (!room.controller.safeMode && attackers.length < maxAttackers) {
                var newName = 'Attacker' + Game.time;
                spawn.spawnCreep([TOUGH,TOUGH,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,ATTACK,ATTACK,ATTACK,HEAL],
                                newName, {memory: {role: 'attacker'}});
            }
            if (room.memory.maxCreeps > (roomCreeps.length-attackers.length)) {
                console.log('wanna spawn new harvesting creep');
                var newName = 'Creep' + Game.time;
                spawn.spawnCreep([WORK,WORK,WORK,WORK,WORK,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,
                                MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE],
                                newName, {memory: {role: 'harvester'}});
            }
        }
    });
    console.log('----- spawn creeps end');
};

module.exports.manageRoles = function (room, roomCreeps) {
    console.log('----- manage roles start');
    var harvesters = _.filter(roomCreeps, (creep) => creep.memory.role == 'harvester');
    var builders = _.filter(roomCreeps, (creep) => creep.memory.role == 'builder');
    var repairers = _.filter(roomCreeps, (creep) => creep.memory.role == 'repairer');
    var upgraders = _.filter(roomCreeps, (creep) => creep.memory.role == 'upgrader');
    var attackers = _.filter(roomCreeps, (creep) => creep.memory.role == 'attacker');
    console.log('harvesters.length: '+harvesters.length);
    console.log('builders.length: '+builders.length);
    console.log('repairers.length: '+repairers.length);
    console.log('upgraders.length: '+upgraders.length);
    console.log('attackers.length: '+attackers.length);

    var numberOfActiveRoles = 0;
    if(harvesters.length > 0) numberOfActiveRoles += 1;
    if(builders.length > 0) numberOfActiveRoles += 1;
    if(repairers.length > 0) numberOfActiveRoles += 1;
    if(upgraders.length > 0) numberOfActiveRoles += 1;

    var minWorkers = Math.floor((roomCreeps.length - attackers.length)/numberOfActiveRoles);
    console.log('minWorkers: '+minWorkers);
    var maxWorkers = room.memory.maxCreeps;

    var needHarvesters = false;
    var needBuilders = false;
    var needRepairers = false;
    var needUpgraders = upgraders.length < minWorkers;

    if (roleHarvester.findClosestTarget(roomCreeps[0])) {
        needHarvesters = true;
    }
    // console.log('needHarvesters: '+needHarvesters);

    if(room.find(FIND_CONSTRUCTION_SITES).length > 0) {
        needBuilders = true;
    }
    // console.log('needBuilders: '+needBuilders);

    // if (roleRepairer.findClosestTarget(roomCreeps[0])) {
    //     needRepairers = true;
    // } //todo
    // console.log('needRepairers: '+needRepairers);

    var includeBuilders = builders.length > 0 && (!needBuilders || (needBuilders && builders.length > minWorkers));
    // console.log('includeBuilders: '+includeBuilders);
    var includeRepairers = repairers.length > 0 && (!needRepairers || (needRepairers && repairers.length > minWorkers));
    // console.log('includeRepairers: '+includeRepairers);
    var includeHarvesters = harvesters.length > 0 && (!needHarvesters || (needHarvesters && harvesters.length > minWorkers));
    // console.log('includeHarvesters: '+includeHarvesters);
    var includeUpgraders = upgraders.length > minWorkers;
    // console.log('includeUpgraders: '+includeUpgraders);

    if(needHarvesters &&
        (harvesters.length < minWorkers ||
            ((!needRepairers || repairers.length >= minWorkers)
            && (!needBuilders || builders.length >= minWorkers)
            && (!needUpgraders || upgraders.length >= minWorkers)))
    ) {
        if(includeBuilders) {
            managerCreep.changeCreepRole(module.exports.getFirstNotInAction(builders), 'harvester');
        } else if(includeRepairers) {
            managerCreep.changeCreepRole(module.exports.getFirstNotInAction(repairers), 'harvester');
        } else if(includeUpgraders) {
            managerCreep.changeCreepRole(module.exports.getFirstNotInAction(upgraders), 'harvester');
        }
    } else if(needBuilders &&
        (builders.length < minWorkers ||
            ((!needRepairers || repairers.length >= minWorkers)
            && (!needHarvesters || harvesters.length >= minWorkers)
            && (!needUpgraders || upgraders.length >= minWorkers)))
    ) {
        if(includeRepairers) {
            managerCreep.changeCreepRole(module.exports.getFirstNotInAction(repairers), 'builder');
        } else if(includeUpgraders) {
            managerCreep.changeCreepRole(module.exports.getFirstNotInAction(upgraders), 'builder');
        } else if(includeHarvesters) {
            managerCreep.changeCreepRole(module.exports.getFirstNotInAction(harvesters), 'builder');
        }
    } else if(needRepairers &&
        (repairers.length < minWorkers ||
            ((!needHarvesters || harvesters.length >= minWorkers)
            && (!needBuilders || builders.length >= minWorkers)
            && (!needUpgraders || upgraders.length >= minWorkers)))
    ) {
        if(includeBuilders) {
            managerCreep.changeCreepRole(module.exports.getFirstNotInAction(builders), 'repairer');
        } else if(includeUpgraders) {
            managerCreep.changeCreepRole(module.exports.getFirstNotInAction(upgraders), 'repairer');
        } else if(includeHarvesters) {
            managerCreep.changeCreepRole(module.exports.getFirstNotInAction(harvesters), 'repairer');
        }
    } else {
        if(includeBuilders) {
            managerCreep.changeCreepRole(module.exports.getFirstNotInAction(builders), 'upgrader');
        } else if(includeRepairers) {
            managerCreep.changeCreepRole(module.exports.getFirstNotInAction(repairers), 'upgrader');
        } else if(includeHarvesters) {
            managerCreep.changeCreepRole(module.exports.getFirstNotInAction(harvesters), 'upgrader');
        }
    }

    console.log('----- manage roles end');
};

module.exports.creepActions = function (room, roomSpawns, roomCreeps) {
    console.log('----- creeps actions start');

    roomCreeps.forEach( function (creep) {
        var inAction = false;

        if(!inAction) {
            managerCreep.run(creep);
        }
    });
    console.log('----- creeps actions end');
};

module.exports.getFirstNotInAction = function (creeps) {
    if (creeps) {
        var creepsNotInAction = _.filter(creeps, (creep) => creep.memory.collectingResources || creep.memory.targetId === undefined);
        if(creepsNotInAction.length > 0) {
            return creepsNotInAction[0];
        }
        console.log('waiting for creep to finish action before changing role');
    }
    return undefined;
}
