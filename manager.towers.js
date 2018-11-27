var roomManager = require('room.manager');

module.exports.run = function (room) {
    var towers = room.find(FIND_MY_STRUCTURES, {filter : structure => { return structure.structureType == STRUCTURE_TOWER }});
    
    towers.forEach(function (tower) {
        var res = module.exports.engageEnemy(tower);
        if (res == 0) {
            module.exports.repairDamagedStructures(tower);
        }
    });
};

module.exports.engageEnemy = function (tower) {
    var closestHostile = tower.pos.findClosestByRange(FIND_HOSTILE_CREEPS);
    if(closestHostile) {
        tower.attack(closestHostile);
        return 1;
    }
    return 0;
}

module.exports.repairDamagedStructures = function (tower) {
    if(tower.energy < tower.energyCapacity/2) {
        return 0;
    }

    var closestDamagedStructure = roomManager.getMostDamagedStructure(tower.room);
    if(closestDamagedStructure) {
        tower.repair(closestDamagedStructure);
        return 1;
    }
    
    return 0;
}




