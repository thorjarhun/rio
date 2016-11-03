var socketIo = require('socket.io');
var R = require('ramda');
var Db = require('./db');
var Store = require('../lib/store');
var Constants = require('../lib/constants');

var Transfer = module.exports = {};


Transfer.setup = function setup(server) {
    socketIo(server).on('connection', socket => {
        Db.setup(err => {
            if (err) {
                console.log('Database setup err:', err);
                return;
            }
            Db.changes(Store.listChange, 'list');
            Db.changes(Store.taskChange, 'task');
            listen(socket);
        });
    });
};

Store.joinRequest.skip(1).subscribe(val => Db.join(val, res => Store.joinResult.onNext(res)));

Store.signInRequest.skip(1).subscribe(val => Db.signIn(val, res => Store.signInResult.onNext(res)));

Store.taskCreate.skip(1).subscribe(R.partial(Db.createEntry,'task'));
Store.taskUpdate.skip(1).subscribe(Db.taskUpdate);
Store.taskDelete.skip(1).subscribe(Db.taskDelete);

Store.listCreate.skip(1).subscribe(R.partial(Db.createEntry,'list'));
Store.listUpdate.skip(1).subscribe(Db.listUpdate);
Store.listDelete.skip(1).subscribe(Db.listDelete);

const toChange = R.map(entry => entry.hasOwnProperty('old_val') ? entry : {old_val: null, new_val: entry});

// client sends 'create', 'update', 'delete'
// server responds 'update'
function listen(socket) {
    socket.on(Constants.sendAll, function sendAll(user) {
        Db.allLists(user.id, (err, res) => {
            toChange(err ? [] : res).forEach(d => socket.emit(Constants.listChange, d));
        });
        Db.allTasks(user.id, (err, res) => {
            toChange(err ? [] : res).forEach(d => socket.emit(Constants.taskChange, d));
        });
    });

    function emit(address, change) {
        socket.emit(address, change);
    }

    Store.listChange.skip(1).subscribe(R.partial(emit, Constants.listChange));
    Store.taskChange.skip(1).subscribe(R.partial(emit, Constants.taskChange));
    Store.signInRequest.skip(1).subscribe(data => socket.emit('signin', data));

    function onNext(subject, data) {
        console.log(data);
        subject.onNext(data);
    }

    socket.on(Constants.taskCreate, R.partial(onNext, Store.taskCreate));
    socket.on(Constants.taskUpdate, R.partial(onNext, Store.taskUpdate));
    socket.on(Constants.taskDelete, R.partial(onNext, Store.taskDelete));
    socket.on(Constants.listCreate, R.partial(onNext, Store.listCreate));
    socket.on(Constants.listUpdate, R.partial(onNext, Store.listUpdate));
    socket.on(Constants.listDelete, R.partial(onNext, Store.listDelete));
    socket.on(Constants.joinRequest, R.partial(onNext, Store.joinRequest));
    socket.on(Constants.signInRequest, R.partial(onNext, Store.signInRequest));

    // TODO: Can these be moved up?
    Store.joinResult.skip(1).subscribe(data => socket.emit(Constants.joinResult, data));
    Store.signInResult.skip(1).subscribe(data => socket.emit(Constants.signInResult, data));
}
