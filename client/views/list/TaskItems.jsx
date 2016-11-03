import React from 'react';
import Store from '../../../lib/store';

const onChecked = (user, taskId) => event => {
    return Store.taskUpdate.onNext({
        id: taskId,
        user: user,
        done: event.target.checked
    });
};

const TaskItems = ({tasks}) => {
    return (
        <div className="content-scrollable list-items">
            {
                tasks.map(d => {
                    return (
                        <div key={d.user+':'+d.list+':'+d.item} className="list-item">
                            <label className="checkbox">
                                <input type="checkbox"
                                       name="checked"
                                       defaultChecked={d.done}
                                       onChange={onChecked(d.user,d.id)} />
                                <span className="checkbox-custom"/>
                            </label>
                            <input type="text" placeholder={d.item}/>
                            <a className="js-delete-item delete-item" href="#">
                                <span className="icon-trash"/>
                            </a>
                        </div>
                    )
                })
            }
        </div>
    );
};

export default TaskItems;
