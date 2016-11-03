import React from 'react';
import R from 'ramda';
import Store from '../../../lib/store';
import TaskItems from './TaskItems';
import ListName from './ListName';

export default React.createClass({
    displayName: 'Tasks',
    getInitialState() {
        return {
            lists: Store.allLists.value,
            tasks: Store.allTasks.value
        };
    },
    componentWillMount() {
        Store.allLists.subscribe(lists => this.setState({lists}));
        Store.allTasks.subscribe(tasks => this.setState({tasks}));
    },
    render() {
        var nameParam = this.props.params.name;
        if (!nameParam && this.state.lists.count() > 0) {
            nameParam = this.state.lists.first().id;
        }
        var list = this.state.lists.get(nameParam) || {id: '', name: 'unknown'};
        var tasksGrouped = R.groupBy(R.prop('list'), this.state.tasks.toArray());
        var tasks = tasksGrouped.hasOwnProperty(nameParam) ?
            tasksGrouped[nameParam] : [];
        return (
            <div className="page lists-show">
                <ListName listId={list.id} listName={list.name} tasks={tasks}/>
                <TaskItems tasks={tasks}/>
            </div>
        );
    }
});
