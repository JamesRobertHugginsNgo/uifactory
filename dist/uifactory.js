"use strict";

function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _nonIterableSpread(); }

function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance"); }

function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = new Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } }

function _toArray(arr) { return _arrayWithHoles(arr) || _iterableToArray(arr) || _nonIterableRest(); }

function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance"); }

function _iterableToArray(iter) { if (Symbol.iterator in Object(iter) || Object.prototype.toString.call(iter) === "[object Arguments]") return Array.from(iter); }

function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// UI FACTORY
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

/* exported uiFactory */
function uiFactory() {
  for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
    args[_key] = arguments[_key];
  }

  var element; // Branch - based on args pattern
  // A. [string, string, !function?, ...]

  if (typeof args[0] === 'string' && typeof args[1] === 'string') {
    var namespaceURI, qualifiedName, options;
    var _args = args;

    var _args2 = _toArray(_args);

    namespaceURI = _args2[0];
    qualifiedName = _args2[1];
    args = _args2.slice(2);

    if (typeof args[0] !== 'function') {
      var _args3 = args;

      var _args4 = _toArray(_args3);

      options = _args4[0];
      args = _args4.slice(1);
    }

    element = document.createElementNS(namespaceURI, qualifiedName, options);
  } // B. [string, !function?, ...]
  else if (typeof args[0] === 'string') {
      var tagName, _options;

      var _args5 = args;

      var _args6 = _toArray(_args5);

      tagName = _args6[0];
      args = _args6.slice(1);

      if (typeof args[0] !== 'function') {
        var _args7 = args;

        var _args8 = _toArray(_args7);

        _options = _args8[0];
        args = _args8.slice(1);
      }

      element = document.createElement(tagName, _options);
    } // C. [Element, function?]
    else if (args[0] instanceof Element) {
        var _args9 = args;

        var _args10 = _toArray(_args9);

        element = _args10[0];
        args = _args10.slice(1);
      }

  if (element instanceof Element) {
    if (!element.definedBy__uiFactory__propertyDescriptors) {
      element = Object.defineProperties(element, uiFactory__propertyDescriptors);
    } // Add initial contents


    if (element.childNodes.length > 0) {
      var _element;

      (_element = element).contents.apply(_element, _toConsumableArray(element.childNodes));
    }
  } // Return element and start method chaining


  return element.callback(args[0]);
}
/* exported uif */


var uif = uif || uiFactory; ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// PROPERTY DESCRIPTOR
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

/* exported uiFactoryPropertyDescriptors */

var uiFactory__propertyDescriptors = {
  definedBy__uiFactory__propertyDescriptors: {
    value: true
  },
  // Callback
  callback: {
    value: function value(callback) {
      if (typeof callback === 'function') {
        callback(this);
      }

      return this;
    },
    writable: true
  },
  // Events
  events: {
    value: function value(events, callback) {
      var _this = this;

      if (events && _typeof(events) === 'object') {
        var _loop = function _loop(type) {
          if (Object.prototype.hasOwnProperty.call(events, type) && typeof events[type] === 'function') {
            _this.addEventListener(type, function () {
              var _events$type;

              for (var _len2 = arguments.length, args = new Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
                args[_key2] = arguments[_key2];
              }

              (_events$type = events[type]).call.apply(_events$type, [this].concat(args, [this]));
            });
          }
        };

        for (var type in events) {
          _loop(type);
        }
      }

      return this.callback(callback);
    },
    writable: true
  },
  // Properties
  _properties: {
    writable: true
  },
  properties: {
    value: function value() {
      var _this2 = this;

      var properties = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : this._properties;
      var callback = arguments.length > 1 ? arguments[1] : undefined;
      this._properties = properties; // Define attributes render function

      var renderAttributes = function renderAttributes(propertyValue, propertyName, properties) {
        // Branch - based on value type
        // A. Promise
        if (propertyValue instanceof Promise) {
          return propertyValue.then(function (value) {
            return renderAttributes(value, propertyName);
          });
        } // B. function


        if (typeof propertyValue === 'function') {
          return renderAttributes(propertyValue.call(_this2, _this2), propertyName);
        } // C. array


        if (Array.isArray(propertyValue)) {
          var tempProperties = {};
          var promises = propertyValue.map(function (value, index) {
            tempProperties[index] = true;
            return renderAttributes(value, index, tempProperties);
          }).filter(function (promise) {
            return promise instanceof Promise;
          });

          if (properties && propertyName && Object.keys(tempProperties).length === 0) {
            delete properties[propertyName];
          }

          if (promises.length > 0) {
            return Promise.all(promises);
          }

          return;
        } // D. object


        if (_typeof(propertyValue) === 'object' && propertyValue !== null) {
          var _promises = Object.keys(propertyValue).map(function (key) {
            return renderAttributes(propertyValue[key], key, propertyValue);
          }).filter(function (promise) {
            return promise instanceof Promise;
          });

          if (properties && propertyName && Object.keys(propertyValue).length === 0) {
            delete properties[propertyName];
          }

          if (_promises.length > 0) {
            return Promise.all(_promises);
          }

          return;
        } // E. otherwise


        if (propertyName) {
          if (propertyValue == null) {
            _this2.removeAttribute(propertyName);
          } else {
            _this2.setAttribute(propertyName, propertyValue);
          }

          if (properties) {
            delete properties[propertyName];
          }
        }
      }; // Render attributes


      var result = renderAttributes(this._properties);

      if (result instanceof Promise) {
        result.then(function () {
          _this2.callback(callback);
        });
      } else {
        this.callback(callback);
      }

      return this;
    },
    writable: true
  },
  // Contents
  _contents: {
    writable: true
  },
  contents: {
    value: function value() {
      var _this3 = this;

      var contents = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : this._contents;
      var callback = arguments.length > 1 ? arguments[1] : undefined;
      var callRenderOnContents = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : false;
      this._contents = contents; // Empty contents

      while (this.firstChild) {
        this.removeChild(this.firstChild);
      } // Define contents render function


      var renderContents = function renderContents(item) {
        var placeholder = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : _this3.appendChild(document.createTextNode(''));

        // Branch - based on item type
        // A. Promise
        if (item instanceof Promise) {
          return item.then(function (value) {
            return renderContents(value, placeholder);
          });
        } // B. function


        if (typeof item === 'function') {
          return renderContents(item(_this3), placeholder);
        } // C. array


        if (Array.isArray(item)) {
          var promises = item.map(function (value) {
            return renderContents(value, _this3.insertBefore(document.createTextNode(''), placeholder));
          }).filter(function (promise) {
            return promise instanceof Promise;
          });

          _this3.removeChild(placeholder);

          if (promises.length > 0) {
            return Promise.all(promises);
          }

          return;
        } // D. object


        if (_typeof(item) === 'object' && item !== null && !(item instanceof Element) && !(item instanceof Text)) {
          var _promises2 = Object.keys(item).map(function (key) {
            return renderContents(item[key], _this3.insertBefore(document.createTextNode(''), placeholder));
          }).filter(function (promise) {
            return promise instanceof Promise;
          });

          _this3.removeChild(placeholder);

          if (_promises2.length > 0) {
            return Promise.all(_promises2);
          }

          return;
        } // E. boolean/number/string


        if (typeof item === 'boolean' || typeof item === 'number' || typeof item === 'string') {
          var wrapper = document.createElement('div');
          wrapper.innerHTML = String(item);
          return renderContents(_toConsumableArray(wrapper.childNodes), placeholder);
        } // F. Otherwise


        if (item instanceof Element || item instanceof Text) {
          _this3.insertBefore(item, placeholder);
        }

        _this3.removeChild(placeholder);

        if (item instanceof Element && item.definedBy__uiFactory__propertyDescriptors && callRenderOnContents) {
          return item.render();
        }
      };

      var result = renderContents(this._contents);

      if (result instanceof Promise) {
        result.then(function () {
          _this3.callback(callback);
        });
      } else {
        this.callback(callback);
      }

      return this;
    },
    writable: true
  },
  // Render
  render: {
    value: function value(callback) {
      var _this4 = this;

      var promises = [new Promise(function (resolve) {
        return _this4.properties(_this4._properties, resolve);
      }), new Promise(function (resolve) {
        return _this4.contents(_this4._contents, resolve, true);
      })];
      Promise.all(promises).then(function () {
        _this4.callback(callback);
      });
      return this;
    },
    writable: true
  }
}; ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// ALIAS FUNCTIONS
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

['a', 'abbr', 'address', 'area', 'article', 'aside', 'audio', 'b', 'base', 'bdi', 'bdo', 'blockquote', 'body', 'br', 'button', 'canvas', 'caption', 'cite', 'code', 'col', 'colgroup', 'data', 'datalist', 'dd', 'del', 'details', 'dfn', 'dialog', 'div', 'dl', 'dt', 'em', 'embed', 'fieldset', 'figure', 'footer', 'form', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'head', 'header', 'hgroup', 'hr', 'html', 'i', 'iframe', 'img', 'input', 'ins', 'kbd', 'keygen', 'label', 'legend', 'li', 'link', 'main', 'map', 'mark', 'menu', 'menuitem', 'meta', 'meter', 'nav', 'noscript', 'object', 'ol', 'optgroup', 'option', 'output', 'p', 'param', 'pre', 'progress', 'q', 'rb', 'rp', 'rt', 'rtc', 'ruby', 's', 'samp', 'script', 'section', 'select', 'small', 'source', 'span', 'strong', 'style', 'sub', 'summary', 'sup', 'table', 'tbody', 'td', 'template', 'textarea', 'tfoot', 'th', 'thead', 'time', 'title', 'tr', 'track', 'u', 'ul', 'var', 'video', 'wbr'].forEach(function (tag) {
  return uiFactory[tag] = function (callback) {
    return uiFactory(tag, callback);
  };
});

uiFactory.svg = function () {
  return uif('http://www.w3.org/2000/svg', 'svg');
};

['a', 'animate', 'animateMotion', 'animateTransform', 'circle', 'clipPath', 'color-profile', 'defs', 'desc', 'discard', 'ellipse', 'feBlend', 'feColorMatrix', 'feComponentTransfer', 'feComposite', 'feConvolveMatrix', 'feDiffuseLighting', 'feDisplacementMap', 'feDistantLight', 'feDropShadow', 'feFlood', 'feFuncA', 'feFuncB', 'feFuncG', 'feFuncR', 'feGaussianBlur', 'feImage', 'feMerge', 'feMergeNode', 'feMorphology', 'feOffset', 'fePointLight', 'feSpecularLighting', 'feSpotLight', 'feTile', 'feTurbulence', 'filter', 'foreignObject', 'g', 'hatch', 'hatchpath', 'image', 'line', 'linearGradient', 'marker', 'mask', 'mesh', 'meshgradient', 'meshpatch', 'meshrow', 'metadata', 'mpath', 'path', 'pattern', 'polygon', 'polyline', 'radialGradient', 'rect', 'script', 'set', 'solidcolor', 'stop', 'style', 'switch', 'symbol', 'text', 'textPath', 'title', 'tspan', 'unknown', 'use', 'view'].forEach(function (tag) {
  return uiFactory.svg[tag] = function (callback) {
    return uiFactory('http://www.w3.org/2000/svg', tag, callback);
  };
}); ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// CUSTOMIZE UI FACTORY
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

/* exported uiFactory__customize */

function uiFactory__customize(element) {
  for (var _len3 = arguments.length, args = new Array(_len3 > 1 ? _len3 - 1 : 0), _key3 = 1; _key3 < _len3; _key3++) {
    args[_key3 - 1] = arguments[_key3];
  }

  var types, callback; // element = uiFactory(element);
  // Assign arguments to variables
  // - [element, ...]

  if (args[0] instanceof Element) {
    var _args11 = args;

    var _args12 = _toArray(_args11);

    element = _args12[0];
    args = _args12.slice(1);
  } // - [!function, ...]


  if (typeof args[0] !== 'function') {
    var _args13 = args;

    var _args14 = _toArray(_args13);

    types = _args14[0];
    args = _args14.slice(1);

    if (types !== undefined && !Array.isArray(types)) {
      types = [types];
    }
  } // - [function, ...]


  if (typeof args[0] === 'function') {
    var _args15 = args;

    var _args16 = _toArray(_args15);

    callback = _args16[0];
    args = _args16.slice(1);
  }

  element = uiFactory(element);

  function setBeforeProperties(beforeProperties) {
    beforeProperties(true);

    element.properties = function (originalProperties) {
      return function (properties, callback) {
        beforeProperties(false);
        return originalProperties.call(this, properties, callback);
      };
    }(element.properties);
  }

  function setAfterProperties(afterProperties) {
    afterProperties(true);

    element.properties = function (originalProperties) {
      return function (properties, callback) {
        return originalProperties.call(this, properties, function (element) {
          afterProperties(false);

          if (typeof callback === 'function') {
            return callback.call(this, element);
          }
        });
      };
    }(element.properties);
  }

  function setBeforeContents(beforeContents) {
    beforeContents(true);

    element.contents = function (originalContents) {
      return function (contents, callback, callRenderOnContents) {
        beforeContents(false);
        return originalContents.call(this, contents, callback, callRenderOnContents);
      };
    }(element.contents);
  }

  function setAfterContents(afterContents) {
    afterContents(true);

    element.contents = function (originalContents) {
      return function (contents, callback, callRenderOnContents) {
        return originalContents.call(this, contents, function (element) {
          afterContents(false);

          if (typeof callback === 'function') {
            return callback.call(this, element);
          }
        }, callRenderOnContents);
      };
    }(element.contents);
  }

  return {
    element: element,
    types: types,
    callback: callback,
    setBeforeProperties: setBeforeProperties,
    setAfterProperties: setAfterProperties,
    setBeforeContents: setBeforeContents,
    setAfterContents: setAfterContents
  };
}