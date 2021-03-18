const listeners = {};
let notificationCount = 0;

function broadcast() {
  Object.keys(listeners).forEach(k =>{
    if(k!=='SetUpNotification'){
      listeners[k]()
    }
  } );
}
function broadcastOnNotification(){
  if(listeners['SetUpNotification']){
    listeners['SetUpNotification']()
  }

}

export default {
  get: () => notificationCount,
  set: count => {
    notificationCount = count;
    broadcast();
  },
  checkNotification:()=>{
    broadcastOnNotification()
  },


  onChange: (key, cb) => {
    listeners[key] = () => cb(notificationCount);
  },
  unChange: key => {
    delete listeners[key];
  }
};
