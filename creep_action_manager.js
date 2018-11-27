
/**
 * @param {Creep} creep [description]
 * @param {Target} checkTarget [description]
 * @param {Boolean} checkCreepCarryCapacity [description]
 * @param {Boolean} checkCreepHasResources [description]
 * @return {Boolean} [description]
 */
module.exports.startAction = function (creep, checkTarget, checkCreepCarryCapacity, checkCreepHasResources) {
	let result = {};
	if (checkTarget) {
		if (creep.memory.targetId === undefined) {
	        return -1;
	    }

		let target = Game.getObjectById(creep.memory.targetId);
	    if (target === undefined) {
	        return -1;
	    }
		result.target = target;
	}

	if (checkCreepCarryCapacity) {
		let creepCarry = 0;
	    for (let resourceName in creep.carry) {
	        creepCarry += creep.carry[resourceName];
	    }
	    if (creepCarry == creep.carryCapacity) {
	        return -1;
	    }
		result.creepCarry = creepCarry;
	}

	if (checkCreepHasResources) {
		if (creep.memory.resourceName) {
			let creepResources = creep.carry[creep.memory.resourceName];
			if (creepResources !== undefined && creepResources > 0 {
				result.creepCarry = creepResources;
			}
			return -1;
		} else {
			let creepCarry = 0;
		    for (let resourceName in creep.carry) {
		        creepCarry += creep.carry[resourceName];
		    }
		    if (creepCarry == 0) {
		        return -1;
		    }
			result.creepCarry = creepCarry;
		}
	}

	return result;
}
