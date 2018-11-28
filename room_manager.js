
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
    let creepsNextAction = new Array();
    for (let i in roomCreeps) {
        let creep = roomCreeps[i];
        let res = creep_manager.doAction(creep);
        if (res == 0) {
            creepsNextAction.push(creep);
        }
    }

    //towers actions
    for (let i in roomTowers) {
        let tower = roomTowers[i];
        tower_manager.doAction(tower);
    }

    //TODO AFTER CONTROLLER LEVEL 5: structure actions
    //

    //try to run next action if last action failed (was not in range etc.)
    if (creepsNextAction.length > 0) {
        for (let i in creepsNextAction) {
            let creep = creepsNextAction[i];
            creep_manager.doAction(creep);
        }
    }
};

module.exports.spawnCreeps = function(room) {
    //spawn worker if workers in room < max workers in room
    // workers should have the same nr of work and carry body parts
    //spawn work,carry,move,move if 0 workers and not enough energy for normal worker

    //spawn solider if attacking other room or defenders < min defenders

};

module.exports.manageMemory = function(room) {
    //TODO: if not defined || new/destroyed structures
    if (room.memory.middlePoint === undefined || false) {
        initiateMemory(room, roomSources, roomExtensions, roomStorage);
    }

    //update room memory: needed workers
    updateMemory();
};

module.exports.rewriteMemory = function(room) {
    delete Memory.rooms[room.roomName];
    module.exports.initiateMemory(room);
};

var updateMemory = function(room) {
    //update neededUpgraders/neededHarvesters/neededBuilders/neededCollectors etc
};

/**
 * @param {Room} room [description]
 * @param {Source[]} roomSources [description]
 * @param {Extension[]} roomExtensions [description]
 * @param {Storage} roomStorage [description]
 * @return {undefined} [description]
 */
var initiateMemory = function(room, roomSources, roomExtensions, roomStorage) {
    // middlePoint:
    let midPoint
    let roomSourcesList = roomSources;
    if (roomSourcesList.length == 0) {
        midPoint = {x: 24, y: 24, roomName: room.roomName};
    }

    while (roomSourcesList.length >= 0) {
        if (roomSourcesList.length == 1) {
            midPoint = roomSourcesList[0].pos;
            break;
        }
        let firstPoint = roomSourcesList[0].pos;
        let secondPoint = roomSourcesList[1].pos;

        midPoint = {
            x: Math.floor((firstPoint.x + secondPoint.x) / 2),
            y: Math.floor((firstPoint.y + secondPoint.y) / 2),
            roomName: room.roomName
        };
        roomSourcesList.splice(0, 2, {pos: midPoint});
    }

    //TODO: MIDDLEPOINT PLACEMENT - SHOULDN'T BE NEXT TO SOURCE
    //TODO: rewrite with Game.map.getRoomTerrain()
    //middlePoint = find pos close to midPoint that is in the middle of empty(terrain) 5x5 block
    // [s][ ][t][ ][S] - S - storage
    // [ ][ ][ ][ ][ ] - s - spawn
    // [T][ ][l][ ][t] - t - tower
    // [ ][ ][ ][ ][ ] - T - transporter
    // [s][ ][t][ ][s] - l - link
    let found = true;
    let areaAroundMidPoint = room.lookForAtArea(LOOK_TERRAIN, midPoint.y-2, midPoint.x-2, midPoint.y+2, midPoint.x+2, true);
    for (let i in areaAroundX) {
        let x = areaAroundX[i];
        if(x.terrain !== 'plain' && x.terrain !== 'swamp' && x.terrain !== 'road') {
            found = false;
            break;
        }
    }
    if (found) {
        room.memory.middlePoint = midPoint;
    }

    let k = 0;
    while (room.memory.middlePoint === undefined) {
        let area = room.lookForAtArea(LOOK_TERRAIN, midPoint.y-k, midPoint.x-k, midPoint.y+k, midPoint.x+k, true);
        for (let i in area) {
            let xPos = {x: area[i].x, y: area[i].y roomName: room.roomName};
    	    found = true;
    	    let areaAroundX = room.lookForAtArea(LOOK_TERRAIN, xPos.y-2, xPos.x-2, xPos.y+2, xPos.x+2, true);
            for (let j in areaAroundX) {
                let y = areaAroundX[j];
        	    if(y.terrain !== 'plain' && y.terrain !== 'swamp' && y.terrain !== 'road') {
        	        found = false;
        	        break;
        	    }
            }
            if (found) {
                room.memory.middlePoint = x.pos;
                break;
            }
        };
        k += 1;
    }


    // workerWORKbodyParts:
    if (currentWorkers > 0) {
        room.memory.workerWORKbodyParts = Math.floor(room.energyCapacityAvailable / 250);
    } else { //first worker
        room.memory.workerWORKbodyParts = 1;
    }

    // sourcesByIds: (maxCreepsForEnergyNode, emptyTiles, containerId, linkId)
    room.memory.sourcesByIds = {};
    for (let i in roomSources) {
        room.memory.sourcesByIds[sources[i].id] = {};
	    let sourcePos = roomSources[i].pos;

	    //maxCreepsForEnergyNode, emptyTiles
	    let maxCreepsForEnergyNode = 0;
	    room.lookForAtArea(LOOK_TERRAIN, sourcePos.y-1, sourcePos.x-1, sourcePos.y+1, sourcePos.x+1, true).forEach(
	        function(x) {
	            if(x.terrain == 'plain' || x.terrain == 'swamp' || x.terrain == 'road') {
	                maxCreepsForEnergyNode += 1;

	                if (room.memory.sourcesByIds[roomSources[i].id].emptyTiles === undefined) {
    	                room.memory.sourcesByIds[roomSources[i].id].emptyTiles = new Array();
	                }
	                room.memory.sourcesByIds[roomSources[i].id].emptyTiles.push(x.pos);
                }
            }
        );
        room.memory.sourcesByIds[roomSources[i].id].maxWorkers = maxCreepsForEnergyNode;

        //containerId, linkId
	    room.lookForAtArea(LOOK_STRUCTURES, sourcePos.y-1, sourcePos.x-1, sourcePos.y+1, sourcePos.x+1, true).forEach(
	        function(x) {
	            if (x.structureType == 'container') {
	                room.memory.sourcesByIds[roomSources[i].id].containerId = x.id;
                } else if (x.structureType == 'link') {
	                room.memory.sourcesByIds[roomSources[i].id].linkId = x.id;
                }
            }
        );

        //generate paths between middlePoint and empty tiles around sources
        for (let j in room.memory.sourcesByIds[roomSources[i].id].emptyTiles) {
            let emptyTilePos = room.memory.sourcesByIds[roomSources[i].id].emptyTiles[i];
            module.exports.generatePathAndAddToMemory(room, emptyTilePos, room.memory.middlePoint);
        }
    }



    // maxSourceWorkers:
    let howManyTimesCreepNeedsToTravelToSource = SOURCE_ENERGY_CAPACITY / (workerWORKbodyParts*CARRY_CAPACITY);
    let path = module.exports.findPathInMemory(room, roomSources[0].pos, room.memory.middlePoint);
    let howMuchTimeItTakesToTravelToSource = path.length * 2 + 25 + 5;
    room.memory.maxSourceWorkers = Math.ceil(howManyTimesCreepNeedsToTravelToSource * howMuchTimeItTakesToTravelToSource / 300);

    for (let i in room.memory.sourcesByIds) {
        if (room.memory.maxSourceWorkers < room.memory.sourcesByIds[i].maxWorkers) {
            room.memory.sourcesByIds[i].maxWorkers = room.memory.maxSourceWorkers;
        }
    }

    // controllerLinkId:
    let controllerPos = room.controller.pos;
    room.lookForAtArea(LOOK_STRUCTURES, controllerPos.y-1, controllerPos.x-1, controllerPos.y+1, controllerPos.x+1, true).forEach(
        function(x) {
	        if (x.structureType == 'link') {
	            room.memory.controllerLinkId = x.id;
            }
        }
    );

    // roomStorage: (Id, linkId)
    room.memory.roomStorage = {};
    room.memory.roomStorage.Id = roomStorage.id;

    let roomStoragePos = roomStorage.pos;
    room.lookForAtArea(LOOK_STRUCTURES, roomStoragePos.y-2, roomStoragePos.x-2, roomStoragePos.y+2, roomStoragePos.x+2, true).forEach(
        function(x) {
	        if (x.structureType == 'link') {
	            room.memory.roomStorage.linkId = x.id;
            }
        }
    );

    // extensionsByIds:
    room.memory.extensionsByIds = {};
    for (let i in roomExtensions) {
        room.memory.extensionsByIds[roomExtensions[i].id] = {};
    }

    // TODO: building to build, paths?
};

module.exports.setupCreepActions = function(room) {
    //go through idle creeps and sets up action for them based on neededX values in romm memory
    //idle creeps:
    // idle workers:
    //    action == 'idle' && energy > 0
    // idle soliders
    //    action == 'idle' || (targetId && path == idle)
};

module.exports.findPathInMemory = function(room, fromPos, toPos) {
    //todo
};

module.exports.generatePathAndAddToMemory = function(room, fromPos, toPos) {
    //todo (generate both ways)
}
