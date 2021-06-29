class Trophy {

    constructor(id, name, description, difficulty,unlocker) {
        this._id = id;
        this._name = name;
        this._description = description;
        this._difficulty = difficulty;
        this._unlocker = unlocker;
    }
    toJson(){
        return  {
            "id" : this._id,
            "name" : this._name,
            "description" : this._description,
            "difficulty" : this._difficulty
        }
    }
    canUnlock(player,context){
        return this._unlocker.unlock(player,context)
    }
    listenOn(){
        return this._unlocker.getEvents()
    }

    getId(){
        return this._id;
    }
}

module.exports = Trophy
