"use strict";

function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _nonIterableSpread(); }

function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance"); }

function _iterableToArray(iter) { if (Symbol.iterator in Object(iter) || Object.prototype.toString.call(iter) === "[object Arguments]") return Array.from(iter); }

function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = new Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } }

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

var uiFactory_PropertyDescriptors = {
  definedByUiFactoryPropertyDescriptors: {
    value: true
  },
  attributesData: {
    writable: true
  },
  childElementsData: {
    writable: true
  },
  callback: {
    value: function value(callback) {
      callback && callback(this);
      return this;
    },
    writable: true
  },
  renderAttributes: {
    value: function value(attributes, callback) {
      var _this = this;

      this.attributesData = attributes;

      var renderLoop = function renderLoop(value, name, attributes) {
        // PROMISE VALUE
        if (value instanceof Promise) {
          return value.then(function (value) {
            return renderLoop(value, name);
          });
        } // FUNCTION VALUE


        if (typeof value === 'function') {
          return renderLoop(value(_this), name);
        } // ARRAY VALUE


        if (Array.isArray(value)) {
          var tempAttributes = {};
          var promises = value.map(function (value, index) {
            tempAttributes[index] = true;
            return renderLoop(value, index, tempAttributes);
          }).filter(function (promise) {
            return promise instanceof Promise;
          });

          if (attributes && name && Object.keys(tempAttributes).length === 0) {
            delete attributes[name];
          }

          return promises.length > 0 && Promise.all(promises);
        } // OBJECT VALUE


        if (_typeof(value) === 'object' && value !== null) {
          var _promises = Object.keys(value).map(function (key) {
            return renderLoop(value[key], key, value);
          }).filter(function (promise) {
            return promise instanceof Promise;
          });

          if (attributes && name && Object.keys(value).length === 0) {
            delete attributes[name];
          }

          return _promises.length > 0 && Promise.all(_promises);
        } // KEY + VALUE


        if (name) {
          if (value == null) {
            _this.removeAttribute(name);
          } else {
            _this.setAttribute(name, value);
          }

          if (attributes) {
            delete attributes[name];
          }
        }
      };

      var result = renderLoop(this.attributesData);

      if (callback) {
        if (result instanceof Promise) {
          result.then(function () {
            return callback(_this);
          });
        } else {
          callback(this);
        }
      }

      return this;
    },
    writable: true
  },
  renderChildElements: {
    value: function value(childElements, callback) {
      var _this2 = this;

      var reRender = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : false;
      this.childElementsData = childElements;

      var renderLoop = function renderLoop(element) {
        var placeholder = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : _this2.appendChild(document.createTextNode(''));

        // PROMISE VALUE
        if (element instanceof Promise) {
          return element.then(function (value) {
            return renderLoop(value, placeholder);
          });
        } // FUNCTION VALUE


        if (typeof element === 'function') {
          return renderLoop(element(_this2), placeholder);
        } // ARRAY VALUE


        if (Array.isArray(element)) {
          var promises = element.map(function (value) {
            return renderLoop(value, _this2.insertBefore(document.createTextNode(''), placeholder));
          }).filter(function (promise) {
            return promise instanceof Promise;
          });

          _this2.removeChild(placeholder);

          return promises.length > 0 && Promise.all(promises);
        } // OBJECT VALUE


        if (_typeof(element) === 'object' && element !== null && !(element instanceof Element) && !(element instanceof Text)) {
          var _promises2 = Object.keys(element).map(function (key) {
            return renderLoop(element[key], _this2.insertBefore(document.createTextNode(''), placeholder));
          }).filter(function (promise) {
            return promise instanceof Promise;
          });

          _this2.removeChild(placeholder);

          return _promises2.length > 0 && Promise.all(_promises2);
        } // BOOLEAN, NUMBER OR STRING VALUE


        if (typeof element === 'boolean' || typeof element === 'number' || typeof element === 'string') {
          var wrapper = document.createElement('div');
          wrapper.innerHTML = String(element);
          return renderLoop(_toConsumableArray(wrapper.childNodes), placeholder);
        } // ELEMENT / TEXT VALUE


        if (element instanceof Element || element instanceof Text) {
          _this2.insertBefore(element, placeholder);
        } // REMOVE PLACEHOLDER


        _this2.removeChild(placeholder);

        if (element instanceof Element && element.definedByUiFactoryPropertyDescriptors) {
          return reRender && element.render();
        }
      };

      while (this.firstChild) {
        this.removeChild(this.firstChild);
      }

      var result = renderLoop(this.childElementsData);

      if (callback) {
        if (result instanceof Promise) {
          result.then(function () {
            return callback(_this2);
          });
        } else {
          callback(this);
        }
      }

      return this;
    },
    writable: true
  },
  render: {
    value: function value(callback) {
      var _this3 = this;

      Promise.all([new Promise(function (resolve) {
        return _this3.renderAttributes(_this3.attributesData, resolve);
      }), new Promise(function (resolve) {
        return _this3.renderChildElements(_this3.childElementsData, resolve, true);
      })]).then(function () {
        return callback && callback(_this3);
      });
      return this;
    },
    writable: true
  }
};
/* exported uiFactory */

function uiFactory() {
  var element, callback;

  if ((arguments.length <= 0 ? undefined : arguments[0]) instanceof Element) {
    element = arguments.length <= 0 ? undefined : arguments[0];
    callback = arguments.length <= 1 ? undefined : arguments[1];
  } else if (typeof (arguments.length <= 1 ? undefined : arguments[1]) === 'string') {
    element = document.createElementNS(arguments.length <= 0 ? undefined : arguments[0], arguments.length <= 1 ? undefined : arguments[1]);
    callback = arguments.length <= 2 ? undefined : arguments[2];
  } else {
    element = document.createElement(arguments.length <= 0 ? undefined : arguments[0]);
    callback = arguments.length <= 1 ? undefined : arguments[1];
  }

  if (!element.definedByUiFactoryPropertyDescriptors) {
    Object.defineProperties(element, uiFactory_PropertyDescriptors);
  }

  element.childElementsData = _toConsumableArray(element.childNodes);
  return element.cbk(callback);
}