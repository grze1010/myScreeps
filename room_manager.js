var tower_manager = require('tower_manager');
var creep_manager = require('creep_manager');

/**
 * @param {Room} room [description]
 * @param {Creep[]} roomCreeps [description]
 * @param {Tower[]} roomTowers [description]
 * @return {undefined} [description]
 */
module.exports.run = function(room, roomCreeps, roomTowers, enemyCreep, creepToHeal, mostDamagedStructure) {
    //creeps actions
    let creepsNextAction = new Array();
    for (let i in roomCreeps) {
        let creep = roomCreeps[i];
        let res = creep_manager.doAction(creep);
        if (res === 0) {
            creepsNextAction.push(creep);
        }
    }

    //towers actions
    for (let i in roomTowers) {
        let tower = roomTowers[i];
        tower_manager.doAction(tower, enemyCreep, creepToHeal, mostDamagedStructure);
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

module.exports.manageMemory = function(room, roomSources, roomExtensions, roomStorage
    droppedResources, roomConstructionSites, roomDamagedStructures) {
    //TODO: if not defined || new/destroyed structures
    if (room.memory.middlePoint === undefined || false) {
        initiateMemory(room, roomSources, roomExtensions, roomStorage);
    }

    //update room memory: needed workers
    updateMemory(room, droppedResources, roomConstructionSites, roomDamagedStructures);
};

module.exports.rewriteMemory = function(room) {
    delete Memory.rooms[room.roomName];
    module.exports.initiateMemory(room);
};

var updateMemory = function(room, idleCreepsWorkers, droppedResources,
    roomConstructionSites, roomDamagedStructures) {
    //update neededUpgraders/neededHarvesters/neededBuilders/neededCollectors etc

    //harvesters
    room.memory.neededHarvesters = 0;
    for (let i in room.memory.sourcesByIds) {
        room.memory.neededHarvesters += room.memory.sourcesByIds[i].maxWorkers;
    }

    //upgraders
    let minNrOfUpgraders = Math.ceil(CONTROLLER_MAX_UPGRADE_PER_TICK / (room.memory.workerWORKbodyParts * 2));
    if (room.memory.controllerLinkId !== undefined) {
        room.memory.neededUpgraders = minNrOfUpgraders;
    } else if (room.controller.ticksToDowngrade < CONTROLLER_DOWNGRADE[room.controller.level] - 200) {
        room.memory.neededUpgraders = minNrOfUpgraders + 1;
    } else {
        room.memory.neededUpgraders = 0;
    }

    //haulers
    // for sources
    room.memory.neededHaulers = 0;
    for (let i in room.memory.sourcesByIds) {
        if (room.memory.sourcesByIds[i].linkId === undefined
            && room.memory.sourcesByIds[i].containerId !== undefined) {

            let path = module.exports.findPathInMemory(
                room,
                room.memory.sourcesByIds[i].sourcePos,
                room.memory.middlePoint
            );
            //20 = go path 2 ways(2) * resources per tick from source(10)
            room.memory.neededHaulers += Math.ceil(path * 20 * CARRY_CAPACITY / room.memory.workerWORKbodyParts);
        }
    }
    // for container/link in the middle TODO
    if (room.memory.containerId !== undefined) {
        room.memory.neededHaulers += 1;
    }

    //collectors
    room.memory.neededCollectors = 0;
    let maxCreepCarry = room.memory.workerWORKbodyParts * 50;
    for (let i in droppedResources) {
        let droppedResource = droppedResources[i];
        let droppedResourceWeight = 0;
        if (droppedResource.type === 'resource') {
            droppedResourceWeight = droppedResource.amount;
        } else if (droppedResource.store !== undefined) {
            for (let j in droppedResource.store) {
                droppedResourceWeight += droppedResource.store[j];
            }
        }

        room.memory.neededCollectors += Math.ceil(droppedResourceWeight / maxCreepCarry);
    }

    //builders
    room.memory.neededBuilders = 0;
    if (roomConstructionSites.length > 0) {
        let progressNeeded = 0;
        for (let i in roomConstructionSites) {
            progressNeeded += roomConstructionSites[i].progressTotal - roomConstructionSites[i].progress;
        }
        room.memory.neededBuilders += Math.ceil(progressNeeded / maxCreepCarry);
    }

    //repairers
    room.memory.neededRepairers = 0;
    if (roomDamagedStructures.length > 0) {
        let progressNeeded = 0;
        for (let i in roomDamagedStructures) {
            progressNeeded += roomDamagedStructures[i].hitsMax - roomConstructionSites[i].hits;
        }
        room.memory.neededRepairers += Math.ceil(progressNeeded / maxCreepCarry);
    }

    return 0;
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
    let midPoint;
    let roomSourcesList = roomSources;
    if (roomSourcesList.length === 0) {
        midPoint = {x: 24, y: 24, roomName: room.roomName};
    }

    while (roomSourcesList.length >= 0) {
        if (roomSourcesList.length === 1) {
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

    // sourcesByIds: (pos, maxWorkers, emptyTiles, containerId, linkId)
    let howManyTimesCreepNeedsToTravelToSource = SOURCE_ENERGY_CAPACITY / (workerWORKbodyParts*CARRY_CAPACITY);

    room.memory.sourcesByIds = {};
    for (let i in roomSources) {
        room.memory.sourcesByIds[sources[i].id] = {};
	    let sourcePos = roomSources[i].pos;

        //sourcePos
        room.memory.sourcesByIds[sources[i].id].sourcePos = sourcePos;

	    //emptyTiles
	    room.lookForAtArea(LOOK_TERRAIN, sourcePos.y-1, sourcePos.x-1, sourcePos.y+1, sourcePos.x+1, true).forEach(
	        function(x) {
	            if(x.terrain === 'plain' || x.terrain === 'swamp' || x.terrain === 'road') {
	                if (room.memory.sourcesByIds[roomSources[i].id].emptyTiles === undefined) {
    	                room.memory.sourcesByIds[roomSources[i].id].emptyTiles = new Array();
	                }
	                room.memory.sourcesByIds[roomSources[i].id].emptyTiles.push(x.pos);
                }
            }
        );

        //generate paths between middlePoint and empty tiles around sources
        for (let j in room.memory.sourcesByIds[roomSources[i].id].emptyTiles) {
            let emptyTilePos = room.memory.sourcesByIds[roomSources[i].id].emptyTiles[i];
            module.exports.generatePathAndAddToMemory(room, emptyTilePos, room.memory.middlePoint);
        }

        //containerId, linkId
	    room.lookForAtArea(LOOK_STRUCTURES, sourcePos.y-1, sourcePos.x-1, sourcePos.y+1, sourcePos.x+1, true).forEach(
	        function(x) {
	            if (x.structureType === 'container') {
	                room.memory.sourcesByIds[roomSources[i].id].containerId = x.id;
                } else if (x.structureType === 'link') {
	                room.memory.sourcesByIds[roomSources[i].id].linkId = x.id;
                }
            }
        );

        if (room.memory.sourcesByIds[roomSources[i].id].linkId !== undefined
            || room.memory.sourcesByIds[roomSources[i].id].storageId !== undefined) {

            let neededWorkPartsPerSource = 5; // = source capacity(3000) / ticks between regens (300) / energy from single work(2)
            room.memory.sourcesByIds[roomSources[i].id].maxWorkers = Math.ceil(neededWorkPartsPerSource / workerWORKbodyParts);
        } else {
            let path = module.exports.findPathInMemory(room, roomSources[i].pos, room.memory.middlePoint);
            let howMuchTimeItTakesToTravelToSource = path.length * 2 + 25 + 5;
            room.memory.sourcesByIds[roomSources[i].id].maxWorkers =
                    Math.ceil(howManyTimesCreepNeedsToTravelToSource * howMuchTimeItTakesToTravelToSource / 300);
        }

    }

    // controllerLinkId:
    let controllerPos = room.controller.pos;
    room.lookForAtArea(LOOK_STRUCTURES, controllerPos.y-1, controllerPos.x-1, controllerPos.y+1, controllerPos.x+1, true).forEach(
        function(x) {
	        if (x.structureType === 'link') {
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
	        if (x.structureType === 'link') {
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
    //clear action for creep if neededX === 0

    //setup action for harvesters > upgraders > haulers > collectors > builders > repairers

    //if idle creeps left > setup as upgraders if lvl < 8, else TODO

    //go through idle creeps and sets up action for them based on neededX values in romm memory
    //idle creeps:
    // idle soliders
    //    action === 'idle' || (targetId && path === undefined)
};

module.exports.findPathInMemory = function(room, fromPos, toPos) {
    //todo: find path (search in rage to fromPos?), if not found generatePathAndAddToMemory
};

module.exports.generatePathAndAddToMemory = function(room, fromPos, toPos) {
    //todo (generate both ways)
}
