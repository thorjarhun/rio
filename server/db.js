var async = require('async');
var R = require('ramda');
var data = require('./data');
var Constants = require('../lib/constants');


var r = require('rethinkdbdash')({
    host: 'localhost',
    port: 28015,
    db: 'test'
});

var Db = module.exports = {};


Db.allTasks = (userId, cb) => r.db('rio').table('task').filter({user: userId}).run(cb);

Db.allLists = (userId, cb) => r.db('rio').table('list').filter({user: userId}).run(cb);


function logError(err) {
    if (err) console.log(err);
}
Db.changes = (subject, table) => {
    r.db('rio').table(table).changes().run(function iterateCursor(err, cursor) {
        cursor.each((res, change) => subject.onNext(change));
    });
};

Db.createEntry = (table, data) => {
    r.db('rio').table(table).insert(data).run(logError);
};


Db.taskUpdate = (task) => {
    r.db('rio').table('task').get(task.id).update(task).run(logError);
};

Db.taskDelete = (task) => {
    r.db('rio').table('task').get(task.id).delete().run(logError);
};

Db.listUpdate = (info) => {
    r.db('rio').table('list').get(info.id).update({name: info.name}).run(logError);
};

Db.listDelete = (data) => {
    r.db('rio').table('list').get(data.id).delete().run(logError);
};

Db.signIn = function signIn(info, cb) {
    r.db('rio').table('user').filter(R.pick(['email', 'password'], info))
        .run((err, res) => {
            cb(err || res.length == 0 ? Constants.user : res[0])
        });
};

Db.join = function join(info, cb) {
    r.db('rio').table('user')
        .filter({email: info.email})
        .run((err, res) => {
            if (err) {
                cb({errors: [err]});
            } else {
                r.db('rio').table('user')
                    .insert(R.omit(['id'], info))
                    .run((err, res) => {
                        cb(!err && res.inserted ? {
                            email: info.email,
                            id: res.generated_keys[0]
                        } : {errors: ['server error']});
                    });
            }
        });
};

Db.setup = function setup(mainCallback) {
    async.waterfall([
        (callback) => {
            r.dbList().run((err, res) => {
                callback(err, res);
            });
        },
        (databases, callback) => {
            if (databases.indexOf('rio') == -1) {
                r.dbCreate('rio').run((err) => {
                    callback(err, true);
                });
            } else {
                callback(null, false);
            }
        },
        (create, callback) => {
            if (create) {
                r.db('rio').tableCreate('user')
                    .run((err, res) => {
                        callback(err, create);
                    });
            } else {
                callback(null, create);
            }

        },
        (create, callback) => {
            if (create) {
                r.db('rio').tableCreate('list')
                    .run((err, res) => {
                        callback(err, create);
                    });
            } else {
                callback(null, create);
            }
        },
        (create, callback) => {
            if (create) {
                r.db('rio').tableCreate('task')
                    .run((err, res) => {
                        callback(err, create);
                    });
            } else {
                callback(null, create);
            }
        },
        (create, callback) => {
            if (create) {
                r.db('rio').table('list').insert(data.lists)
                    .run((err, res) => {
                        callback(err, res);
                    });
            } else {
                callback(null, create);
            }
        },
        (create, callback) => {
            if (create) {
                r.db('rio').table('list')
                    .run((err, res) => {
                        if (err) {
                            callback(err, res);
                        } else {
                            r.db('rio').table('task').insert(data.tasks(res))
                                .run((err, res) => {
                                    callback(err, res);
                                });
                        }
                    });
            } else {
                callback(null);
            }
        }
    ], (err, res) => {
        mainCallback(err, res);
    })
};

