import React from 'react';
import { Link } from 'react-router';
import Immutable from 'immutable';
import R from 'ramda';
import Store from '../../lib/store';

export default React.createClass({
    displayName: 'ListTodos',
    getInitialState(){
        return {
            lists: Immutable.Map({}),
            tasks: Immutable.Map({})
        }
    },
    componentWillMount(){
        Store.allLists.subscribe(lists => this.setState({ lists }));
        Store.allTasks.subscribe(tasks => this.setState({ tasks }));
    },
    onCreateList() {
        Store.listCreate.onNext({
            user: '',
            name: 'List ' + Math.random().toFixed(3).toString()
        })
    },
    render() {
        var pairs=R.toPairs(R.groupBy(R.prop('id'),this.state.lists.toArray()));
        var tasksGrouped=R.groupBy(R.prop('list'),this.state.tasks.toArray());
        var items = pairs.map(pair => {
            var key = pair[0];
            var count =  tasksGrouped.hasOwnProperty(key) ?
                R.reject(R.prop('done'), tasksGrouped[key]).length : 0;
            return (
                <Link to={`/tasks/${key}`}
                      key={key}
                      className="list-todo">
                    <span className="count-list">{count}</span>
                    {pair[1][0].name}
                </Link>
            );
        });
        return (
            <div className="list-todos">
                <a className="js-new-list link-list-new" onClick={this.onCreateList}>
                    <span className="icon-plus"/>New List</a>
                {items}
            </div>
        );
    }
});
