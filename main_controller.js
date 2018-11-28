
var room_manager = require('room_manager');
//attacker action 'idle' until finds hostile in room
//change action possible if old action undefined, 'idle' or 'collecting energy' and carry.energy === carry.capacity
//room memory has: max nr of workers, info about sources, exits, info about stuctures

//what can be build in room - https://docs.screeps.com/control.html#Room-Controller-Level
//  fill map with these, plan building to buildbased on this map

//change all === to === if no conversion expected

// reinitiate memory/plan new buildings:
//  roomStuctures.lenght + roomConstructionSites.lenght < expected structures (from map in memory)

//add custom actions (creep_action_x) to prototype?

//tunels

//CONTROLLER_STRUCTURES

/**
 * @return {undefined} [description]
 */
module.exports.run = function() {
    //collect all data (find methods)

    for(let roomName in Game.rooms) {
        let room = Game.rooms[roomName];
        let roomCreeps = _.filter(Game.creeps, (x) => x.room.roomName === roomName);
        let hostileCreeps = room.find(FIND_HOSTILE_CREEPS);
        let roomSources = room.find(FIND_SOURCES);
        let roomStructures = room.find(FIND_STRUCTURES);
        let roomTombstones = room.find(FIND_TOMBSTONES);
        let droppedResources = room.find(FIND_DROPPED_RESOURCES);
        droppedResources = droppedResources.concat(roomTombstones);
        let roomConstructionSites = room.find(FIND_CONSTRUCTION_SITES);
        let roomDamagedStructures = _.filter(roomStructures,
            (x) => (x.ticksToDowngrade === undefined && x.hits < x.hitsMax)
                (x.ticksToDowngrade !== undefined && x.hits < (x.hitsMax - 500))
        );
        let roomTowers = _.filter(roomStructures, (x) => x.my && x.structureType === STRUCTURE_TOWER);
        let roomSpawns = _.filter(roomStructures, (x) => x.my && x.structureType === STRUCTURE_SPAWN);
        let roomStructuresExtensions = _.filter(roomStructures, (x) => x.my && x.structureType === STRUCTURE_EXTENSION);
        let roomStructuresLinks = _.filter(roomStructures, (x) => x.my && x.structureType === STRUCTURE_LINK);
        let roomStructuresContainers = _.filter(roomStructures, (x) => x.structureType === STRUCTURE_CONTAINER);
        let roomStructuresStorage = _.filter(roomStructures, (x) => x.my && x.structureType === STRUCTURE_STORAGE)[0];

        let idleCreepsWorkers = _.filter(roomCreeps, (x) => x.action === 'idle');
        let creepsToHeal = _.filter(roomCreeps, (x) => x.hits < x.hitsMax);

        let indexOfMostDamagedStructure = roomDamagedStructures.reduce(
            (currentLowestHitsIndex, structureForI, i, tempArray) =>
                structureForI.hits < tempArray[currentLowestHitsIndex].hits ? i : currentLowestHitsIndex,
            0 //currentBestIndex = 0
        );
        let mostDamagedStructure = roomDamagedStructures[indexOfMostDamagedStructure];

        // vars like neededEnergyHarvesters, neededUpgraders
        room_manager.manageMemory(room, roomSources, roomStructuresExtensions, roomStructuresStorage
            droppedResources, roomConstructionSites, roomDamagedStructures);

        // spawn creeps if needed
        room_manager.spawnCreeps(room);

        // setup/update creeps memory (actions)
        room_manager.setupCreepActions(room);

        //creeps, towers, structures(links) actions
        room_manager.run(room, roomCreeps, roomTowers, hostileCreeps[0], creepsToHeal[0], mostDamagedStructure);
    }

};
