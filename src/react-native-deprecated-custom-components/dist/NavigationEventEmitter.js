const _createClass = (function() {
  function defineProperties(target, props) {
    for (let i = 0; i < props.length; i++) {
      const descriptor = props[i];
      descriptor.enumerable = descriptor.enumerable || false;
      descriptor.configurable = true;
      if ('value' in descriptor) descriptor.writable = true;
      Object.defineProperty(target, descriptor.key, descriptor);
    }
  }
  return function(Constructor, protoProps, staticProps) {
    if (protoProps) defineProperties(Constructor.prototype, protoProps);
    if (staticProps) defineProperties(Constructor, staticProps);
    return Constructor;
  };
})();
const _get = function get(object, property, receiver) {
  if (object === null) object = Function.prototype;
  const desc = Object.getOwnPropertyDescriptor(object, property);
  if (desc === undefined) {
    const parent = Object.getPrototypeOf(object);
    if (parent === null) {
      return undefined;
    }
    return get(parent, property, receiver);
  } else if ('value' in desc) {
    return desc.value;
  }
  const getter = desc.get;
  if (getter === undefined) {
    return undefined;
  }
  return getter.call(receiver);
};
function _classCallCheck(instance, Constructor) {
  if (!(instance instanceof Constructor)) {
    throw new TypeError('Cannot call a class as a function');
  }
}
function _possibleConstructorReturn(self, call) {
  if (!self) {
    throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
  }
  return call && (typeof call === 'object' || typeof call === 'function') ? call : self;
}
function _inherits(subClass, superClass) {
  if (typeof superClass !== 'function' && superClass !== null) {
    throw new TypeError(
      `Super expression must either be null or a function, not ${typeof superClass}`
    );
  }
  subClass.prototype = Object.create(superClass && superClass.prototype, {
    constructor: { value: subClass, enumerable: false, writable: true, configurable: true },
  });
  if (superClass)
    Object.setPrototypeOf
      ? Object.setPrototypeOf(subClass, superClass)
      : (subClass.__proto__ = superClass);
}
const EventEmitter = require('./EventEmitter');
const NavigationEvent = require('./NavigationEvent');

const NavigationEventEmitter = (function(_EventEmitter) {
  _inherits(NavigationEventEmitter, _EventEmitter);
  function NavigationEventEmitter(target) {
    _classCallCheck(this, NavigationEventEmitter);
    const _this = _possibleConstructorReturn(
      this,
      (NavigationEventEmitter.__proto__ || Object.getPrototypeOf(NavigationEventEmitter)).call(this)
    );
    _this._emitting = false;
    _this._emitQueue = [];
    _this._target = target;
    return _this;
  }
  _createClass(NavigationEventEmitter, [
    {
      key: 'emit',
      value: function emit(eventType, data, didEmitCallback, extraInfo) {
        if (this._emitting) {
          var args = Array.prototype.slice.call(arguments);
          this._emitQueue.push(args);
          return;
        }
        this._emitting = true;
        const event = NavigationEvent.pool(eventType, this._target, data);
        if (extraInfo) {
          if (extraInfo.target) {
            event.target = extraInfo.target;
          }
          if (extraInfo.eventPhase) {
            event.eventPhase = extraInfo.eventPhase;
          }
          if (extraInfo.defaultPrevented) {
            event.preventDefault();
          }
          if (extraInfo.propagationStopped) {
            event.stopPropagation();
          }
        }
        _get(
          NavigationEventEmitter.prototype.__proto__ ||
            Object.getPrototypeOf(NavigationEventEmitter.prototype),
          'emit',
          this
        ).call(this, String(eventType), event);
        if (typeof didEmitCallback === 'function') {
          didEmitCallback.call(this._target, event);
        }
        event.dispose();
        this._emitting = false;
        while (this._emitQueue.length) {
          var args = this._emitQueue.shift();
          this.emit.apply(this, args);
        }
      },
    },
  ]);
  return NavigationEventEmitter;
})(EventEmitter);
module.exports = NavigationEventEmitter;
