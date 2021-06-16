module.exports = function (component, fn, deps) {
  // Effect meta data stored in an array of [fn, deps, changed]
  var meta = component.___effectMeta;
  var index = component.___effectIndex;

  if (meta) {
    if (index === undefined) {
      meta.push(fn, deps, 1);
    } else {
      component.___effectIndex += 3;
      if (deps) {
        var previousDeps = meta[index + 1];
        for (var i = 0; i < deps.length; i++) {
          if (deps[i] !== previousDeps[i]) {
            if (meta[index]) meta[index](); // run cleanup
            meta[index] = fn; // save new effect function
            meta[index + 1] = deps; // save new deps
            meta[index + 2] = 1; // mark effect as changed
            break;
          }
        }
      }
    }
  } else {
    patchLifecycle(component);
    component.___effectMeta = [fn, deps, 1];
  }
};

function patchLifecycle(component) {
  var proto = component.__proto__;
  if (proto.onMount !== runEffects) {
    proto.onMount = proto.onUpdate = runEffects;
    proto.onDestroy = runCleanups;
  }
}

function runEffects() {
  this.___effectIndex = 0;
  var meta = this.___effectMeta;
  for (var i = 0; i < meta.length; i += 3) {
    if (meta[i + 2]) {
      // check if effect has changed
      meta[i + 2] = 0; // mark effect as not changed
      meta[i] = meta[i](); // execute effect and save cleanup
    }
  }
}

function runCleanups() {
  var meta = this.___effectMeta;
  for (var i = 0; i < meta.length; i += 3) {
    meta[i] && meta[i](); // run cleanup
  }
}
