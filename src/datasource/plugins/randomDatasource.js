import {assert} from 'chai'

export const TYPE_INFO = {
    type: "random",
    name: "Random",
    settings: {
        string: {
            name: 'some String w/o description',
            type: 'string',
            defaultValue: "Some default value"
        },
        text: {
            name: 'some Text',
            type: 'text',
            defaultValue: "Some default value",
            description: "This is pretty self explanatory..."
        },
        boolean: {
            name: 'some Boolean',
            type: 'boolean',
            defaultValue: true,
            description: "This is pretty self explanatory..."
        },
        multi: {
            name: 'some Options',
            type: 'option',
            description: "This is pretty self explanatory...",
            defaultValue: "old",
            options: [
                {
                    "name": "0-50",
                    "value": "young"
                },
                {
                    "name": "51-100",
                    "value": "old"
                }
            ]
        },
        multi2: {
            name: 'option w/o default',
            type: 'option',
            description: "This is pretty self explanatory...",
            options: [
                {
                    "name": "0-50",
                    "value": "young"
                },
                {
                    "name": "51-100",
                    "value": "old"
                }
            ]
        }
    }
    ,
    defaultProps: {}
};


export class Datasource {

    constructor() {
        // Initialize with non random values to demonstrate loading of historic values
        this.history = [{value: 10}, {value: 20}, {value: 30}, {value: 40}, {value: 50}]
    }

    getNewValues() {
        let newValue = {value: Math.ceil(Math.random() * 100)};
        this.history.push(newValue);
        return [newValue]
    }

    getPastValues(since) {
        return [...this.history];
    }


}
