var R = require('ramda');
var Constants = require('../lib/constants');

var lists = [
    {
        user: Constants.user.id,
        name: "Meteor Principles",
        items: ["Data on the Wire",
            "One Language",
            "Database Everywhere",
            "Latency Compensation",
            "Full Stack Reactivity",
            "Embrace the Ecosystem",
            "Simplicity Equals Productivity"
        ]
    },
    {
        user: Constants.user.id,
        name: "Languages",
        items: ["Lisp",
            "C",
            "C++",
            "Python",
            "Ruby",
            "JavaScript",
            "Scala",
            "Erlang",
            "6502 Assembly"
        ]
    },
    {
        user: Constants.user.id,
        name: "Favorite Scientists",
        items: ["Ada Lovelace",
            "Grace Hopper",
            "Marie Curie",
            "Carl Friedrich Gauss",
            "Nikola Tesla",
            "Claude Shannon"
        ]
    }
];

exports.lists = lists.map(R.pick(['name','user']));

exports.tasks = dbLists => {
    console.log('dbLists: ', dbLists);
    return lists.reduce((acc, d) => {
        return acc.concat(d.items.map(e => {
            return {
                user: Constants.user.id,
                list: dbLists.find(x => x.name === d.name).id,
                item: e,
                done: false
            };
        }));
    },[]);
};
