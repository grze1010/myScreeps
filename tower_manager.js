
/**
 * @param {Tower} tower [description]
 * @param {(hostile) Creep} enemy [description]
 * @param {Structure} structure [description]
 * @return {undefind} [description]
 */
module.exports.doAction = function(tower, enemy, structure) {
	let res = engageEnemy(tower, enemy);
	if (res === 0) {
		repairDamagedStructures(tower, structure);
	}
}

/**
 * @param {Tower} tower [description]
 * @param {(hostile) Creep} enemy [description]
 * @return {undefind} [description]
 */
var engageEnemy = function (tower, enemy) {
    if(enemy !== undefined) {
        tower.attack(enemy);
        return 1;
    }
    return 0;
}

/**
 * @param {Tower} tower [description]
 * @param {Structure} structure [description]
 * @return {undefind} [description]
 */
var repairDamagedStructures = function (tower, structure) {
    if (tower.energy < tower.energyCapacity/2) {
        return 0;
    }

    if (structure !== undefined) {
        tower.repair(structure);
        return 1;
    }

    return 0;
}
