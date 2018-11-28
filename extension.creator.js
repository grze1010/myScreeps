var extensionCreator = {

    run: function(room) {
	    var takenFields = [room.find(FIND_MY_SPAWNS)[0].pos];
	    while(takenFields.length > 0) {
            var newTakenFields = Array(0);
            for (var i in takenFields) {
                var takenField = takenFields[i];
                console.log('takenField: '+JSON.stringify(takenField));
                if (room.createConstructionSite(takenField.x+1, takenField.y+1, STRUCTURE_EXTENSION) === -14) {
                    var newTakenField = takenField;
                    newTakenField.x += 1;
                    newTakenField.y += 1;
                    newTakenFields.push(newTakenField);
                } else {
                    newTakenFields = Array(0);
                    break;
                }
                    
                if (room.createConstructionSite(takenField.x-1, takenField.y+1, STRUCTURE_EXTENSION) === -14) {
                    var newTakenField = takenField;
                    newTakenField.x -= 1;
                    newTakenField.y += 1;
                    newTakenFields.push(newTakenField);
                } else {
                    newTakenFields = Array(0);
                    break;
                }
                    
                if (room.createConstructionSite(takenField.x-1, takenField.y-1, STRUCTURE_EXTENSION) === -14) {
                    var newTakenField = takenField;
                    newTakenField.x -= 1;
                    newTakenField.y -= 1;
                    newTakenFields.push(newTakenField);
                } else {
                    newTakenFields = Array(0);
                    break;
                }
                    
                if (room.createConstructionSite(takenField.x+1, takenField.y-1, STRUCTURE_EXTENSION) === -14) {
                    var newTakenField = takenField;
                    newTakenField.x += 1;
                    newTakenField.y -= 1;
                    newTakenFields.push(newTakenField);
                } else {
                    newTakenFields = Array(0);
                    break;
                }
            }
            newTakenFields.forEach( function (f) { console.log('newTakenField: '+JSON.stringify(f)); });
            takenFields = Array(0);//newTakenFields;
	    }
    }
};

module.exports = extensionCreator;