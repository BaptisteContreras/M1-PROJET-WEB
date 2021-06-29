class DataBase {


    constructor() {
        this._tables = {
            'resources': [],
            'trophies': [],
            'games': [],
            'general': [
                {
                    'id': '1',
                    'ttl': '200',
                    'zoom': '10',
                    'launch' : 30000,
                    'min' : 1
                }
            ]
        };
        if (!!DataBase.instance) {
            return DataBase.instance;
        }

        DataBase.instance = this;

        return this;
    }

    getElement(table, id) {
        let res = this._tables[table].filter((el) => el.id === id);
        return res.length > 0 ? res[0] : undefined;
    }

    getElementIndex(table, id) {
        let index = 0;
        let currentTable = this._tables[table];
        for (let i in currentTable) {
            if (currentTable[i].id === id) return index;
            index++;
        }
        return undefined;
    }

    getElementsBy(table, id) {
        return this._tables[table].filter((el) => el.id === id);
    }

    getAll(table) {
        return this._tables[table];
    }

    isExist(table, id) {
        return this.getElement(table, id) !== undefined;
    }

    addElement(table, el) {
        this._tables[table].push(el);
    }

    updateElement(table, id, fields) {
        let el = this.getElement(table, id);

        if (el) {
            Object.keys(fields).forEach((key, i) => {
                el[key] = fields[key];
            });

            this._tables[table] = this._tables[table].map(obj => obj.id === id ? el : obj);
        }
    }
    deleteElement(table, id) {
        this._tables[table] = this._tables[table].filter(obj => obj.id !== id);
    }

    debug() {
        // console.log(this._tables);
    }
    debug2() {
         return this._tables;
    }

}

module.exports = function () {
    return new DataBase();
};
