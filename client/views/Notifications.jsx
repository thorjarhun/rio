import React from 'react';

const Notifications = () => (
   <div className="notifications">
       <div className="notification">
           <span className="icon-sync"/>
           <div className="meta">
               <div className="title-notification">Trying to connect</div>
               <div className="description">There seems to be a connection issue</div>
           </div>
       </div>
   </div>
);

export default Notifications;
