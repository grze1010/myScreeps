var extensionCreator = require('extension.creator');
var roomManager = require('room.manager');
var managerCreeps = require('manager.creeps');
var managerTowers = require('manager.towers');

module.exports.loop = function () {
    //
    //todo: automatic builder (extensions, containeres, storage, roads)
    //role scout, attacker, dismantler
    //go to next room, 
    //creeps pathing (movebypath, reusepath, Room.serializePath)
    //if fiound hostile - first get energy to tower
    //
    
    console.log('-----------------next loop------------------');
    for(var i in Memory.creeps) {
        if(!Game.creeps[i]) {
            delete Memory.creeps[i];
        }
    }

    for (var roomName in Game.rooms) {
        console.log('------- roomName: '+roomName+' -------');
        
        var room = Game.rooms[roomName];
    
        ////////room memory
        roomManager.manageMemory(room);
        ////////
        
        ////////towers actions
        managerTowers.run(room);
        ////////
        
        ////////creeps actions
        managerCreeps.run(room);
        ////////
    }
}