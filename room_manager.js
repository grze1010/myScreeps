
var tower_manager = require('tower_manager');
var creep_manager = require('creep_manager');

/**
 * @param {Room} room [description]
 * @param {Creep[]} roomCreeps [description]
 * @param {Tower[]} roomTowers [description]
 * @return {undefind} [description]
 */
module.exports.run = function(room, roomCreeps, roomTowers) {
    //creeps actions
    for (let i in roomCreeps) {
        let creep = roomCreeps[i];
        creep_manager.doAction(creep);
    }

    //towers actions
    for (let i in roomTowers) {
        let tower = roomTowers[i];
        tower_manager.doAction(tower);
    }

    //TODO AFTER CONTROLLER LEVEL 5: structure actions
};

module.exports.spawnCreeps = function(room) {
    //spawn worker if workers in room < max workers in room
    // workers should have the same nr of work and carry body parts

    //spawn solider if attacking other room or defenders < min defenders

};

module.exports.manageMemory = function(room) {
    //if not defined
    // module.exports.initiateMemory();

    //if should rewrite (errors in memory/new structure created/structure destroyed)
    // module.exports.rewriteMemory();

    //every tick
    // module.exports.updateMemory();
};

module.exports.rewriteMemory = function(room) {
    delete Memory.rooms[room.roomName];
    module.exports.initiateMemory(room);
};

module.exports.updateMemory = function(room) {
    //update neededUpgraders/neededHarvesters/neededBuilders/neededCollectors etc
};

module.exports.initiateMemory = function(room) {
    //define values
    // maxWorkers =
    //    x = how many times need to travel:   3000 / (workerWORKbodyParts*50)
    //    y = how much time it takes to travel:   ((road(between source and spawn).lenght * 2) + 25) + 5(time to drop resources etc.)
    //    x*y = how much time it takes for one creep to empty source
    //    maxWorkers = celling(x*y / 300) * nrOfSources

    // sourcesByIds:
    //    maxWorkers =
    //       x = maxWorkersToNotLeaveSourceEmpty: room.maxWorkers / nrOfSources
    //       y = nrOfFreeTilesNextToSource
    //       maxWorkers = (y >= x) ? y : x+1;
    //
    //    containersByIds
    //
    //    pathToContainer (path)
    //    pathToConroller (path)
    //    pathToSpawns (spawnId : path)
    //    pathToExtensions (extensionId : path)
    //    pathToTurrets (turretId : path)

    // linksByIds

    // storageId

    // paths
};

module.exports.setupCreepActions = function(room) {
    //go through idle creeps and sets up action for them based on neededX values in romm memory
    //idle creeps:
    // idle workers:
    //    action == 'idle' && energy > 0
    // idle soliders
    //    action == 'idle' || (targetId && path == idle)
};
