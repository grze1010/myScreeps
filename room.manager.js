//todo: reset memory function
module.exports.manageMemory = function (room) {
        console.log('room - '+room.name+' manageMemory-----start');
        if(!room.memory.sourcesByIds) {
            room.memory.sourcesByIds = {};
            
            var sources = room.find(FIND_SOURCES);
            for(var sourceName in sources) {
                room.memory.sourcesByIds[sources[sourceName].id] = {};
                
                var maxCreepsForEnergyNode = 0;
        	    var sourcePos = sources[sourceName].pos;
        	    room.lookForAtArea(LOOK_TERRAIN, sourcePos.y-1, sourcePos.x-1, sourcePos.y+1, sourcePos.x+1, true).forEach(
        	        function(area) {
        	            if(area.terrain == 'plain' || area.terrain == 'swamp' || area.terrain == 'road') {
        	                maxCreepsForEnergyNode += 1;
        	            }
                    }
                );
                
                room.memory.sourcesByIds[sources[sourceName].id].maxWorkers = maxCreepsForEnergyNode;
            }
        }
        // console.log('sources in this room: '+JSON.stringify(room.memory.sourcesByIds));
        
        if(!room.memory.maxCreeps) {
            var maxCreeps = 0;
            for(var sourceId in room.memory.sourcesByIds) {
                if(room.memory.sourcesByIds[sourceId] && room.memory.sourcesByIds[sourceId].maxWorkers) {
                    maxCreeps += room.memory.sourcesByIds[sourceId].maxWorkers;
                }
            }
            room.memory.maxCreeps = maxCreeps;
        }
        // console.log('max number of harvesting creeps in this room: '+room.memory.maxCreeps);
        console.log('room - '+room.name+' manageMemory-----end');
};

module.exports.resetMemory = function (room) {
    delete Memory.rooms[room.name];
    module.exports.manageMemory(room);
};

module.exports.getMostDamagedStructure = function (room) {
    var targets = room.find(FIND_STRUCTURES, {
        filter : (target) => (target.ticksToDecay && target.hits < target.hitsMax*9/10) || ((!target.ticksToDecay && target.hits < target.hitsMax))
    });
    
    var target;
    for(var i in targets) {
        if(!target || targets[i].hits < target.hits) {
            target = targets[i];
        }
    }
    return target;
};








