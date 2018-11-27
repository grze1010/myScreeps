
var room_manager = require('room_manager');
//attacker action 'idle' until finds hostile in room
//change action possible if old action undefined, 'idle' or 'collecting energy' and carry.energy == carry.capacity
//room memory has: max nr of workers, info about sources, exits, info about stuctures

//what can be build in room - https://docs.screeps.com/control.html#Room-Controller-Level
//  fill map with these, plan building to buildbased on this map

/**
 * @return {undefind} [description]
 */
module.exports.run = function() {
    //collect all data (find methods)

    //setup/update rooms memory

    for(let roomName in Game.rooms) {
        let room = Game.rooms[roomName];
        let roomCreeps = _.filter(Game.creeps, (x) => x.room.roomName == roomName);
        let roomStructures = room.find(FIND_STRUCTURES);

        let roomTombstones = room.find(FIND_TOMBSTONES);

        let roomSpawns = _.filter(roomStructures, (x) => x.my && x.structureType == STRUCTURE_SPAWN);
        let roomStructuresExtensions = _.filter(roomStructures, (x) => x.my && x.structureType == STRUCTURE_EXTENSION);
        let roomStructuresLinks = _.filter(roomStructures, (x) => x.my && x.structureType == STRUCTURE_LINK);
        let roomStructuresContainers = _.filter(roomStructures, (x) => x.structureType == STRUCTURE_CONTAINER);
        let roomStructuresStorage = _.filter(roomStructures, (x) => x.my && x.structureType == STRUCTURE_STORAGE)[0];

        // vars like neededEnergyHarvesters, neededUpgraders
        room_manager.manageMemory(room);

        // spawn creeps if needed
        room_manager.spawnCreeps(room);

        // setup/update creeps memory (actions)
        room_manager.setupCreepActions(room);

        //creeps, towers, structures(links) actions
        room_manager.run(room);
    }

};
