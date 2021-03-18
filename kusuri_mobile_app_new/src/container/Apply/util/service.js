const listeners = {};
let numberStamp = 0;

function broadcast() {
  Object.keys(listeners).forEach(k => listeners[k]());
}

export const UpdateStatusStamp = {
  get: () => numberStamp,
  set: count => {
    // console.log('SET-COUNT', count);
    numberStamp = count;
    broadcast();
  },
  onChange: (key, cb) => {
    listeners[key] = () => cb(numberStamp);
  },
  unChange: key => {
    delete listeners[key];
  }
};

const listenersInfoApply = {};
let numberInfoApply = {};

function broadcastInfoApply() {
  Object.keys(listenersInfoApply).forEach(k => listenersInfoApply[k]());
}

export const UpdateInfoApply = {
  get: () => numberInfoApply,
  set: count => {
    // console.log('SET-COUNT', count);
    numberInfoApply = count;
    broadcastInfoApply();
  },
  onChange: (key, cb) => {
    listenersInfoApply[key] = () => cb(numberInfoApply);
  },
  unChange: key => {
    delete listenersInfoApply[key];
  }
};
