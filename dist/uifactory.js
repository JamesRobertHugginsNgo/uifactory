"use strict";

function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _nonIterableSpread(); }

function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance"); }

function _iterableToArray(iter) { if (Symbol.iterator in Object(iter) || Object.prototype.toString.call(iter) === "[object Arguments]") return Array.from(iter); }

function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = new Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } }

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

/* exported uiFactoryPropertyDescriptor */
var uiFactoryPropertyDescriptor = {
  definedByUiFactoryPropertyDescriptor: {
    value: true
  },
  // Callback
  callback: {
    value: function value(callback) {
      // Callback
      if (typeof callback === 'function') {
        callback(this);
      } // Allow method chaining


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

              for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
                args[_key] = arguments[_key];
              }

              (_events$type = events[type]).call.apply(_events$type, [this].concat(args, [this]));
            });
          }
        };

        for (var type in events) {
          _loop(type);
        }
      }

      if (typeof callback === 'function') {
        callback(this);
      } // Allow method chaining


      return this;
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
      this._properties = properties; // Render

      var render = function render(propertyValue, propertyName, properties) {
        // propertyValue = Promise
        if (propertyValue instanceof Promise) {
          return propertyValue.then(function (value) {
            return render(value, propertyName);
          });
        } // propertyValue = function


        if (typeof propertyValue === 'function') {
          return render(propertyValue.call(_this2, _this2), propertyName);
        } // propertyValue = array


        if (Array.isArray(propertyValue)) {
          var tempProperties = {};
          var promises = propertyValue.map(function (value, index) {
            tempProperties[index] = true;
            return render(value, index, tempProperties);
          }).filter(function (promise) {
            return promise instanceof Promise;
          });

          if (properties && propertyName && Object.keys(tempProperties).length === 0) {
            delete properties[propertyName];
          }

          if (promises.length > 0) {
            return Promise.all(promises);
          }
        } // propertyValue = object


        if (_typeof(propertyValue) === 'object' && propertyValue !== null) {
          var _promises = Object.keys(propertyValue).map(function (key) {
            return render(propertyValue[key], key, propertyValue);
          }).filter(function (promise) {
            return promise instanceof Promise;
          });

          if (properties && propertyName && Object.keys(propertyValue).length === 0) {
            delete properties[propertyName];
          }

          if (_promises.length > 0) {
            return Promise.all(_promises);
          }
        } // propertyName & propertyValue = !null


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
      };

      var result = render(this._properties); // Callback

      if (typeof callback === 'function') {
        if (result instanceof Promise) {
          result.then(function () {
            callback(_this2);
          });
        } else {
          callback(this);
        }
      } // Allow method chaining


      return this;
    },
    writable: true
  },
  // contents
  _contents: {
    writable: true
  },
  contents: {
    value: function value(contents, callback) {
      var _this3 = this;

      var callRenderOncontents = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : false;
      this._contents = contents; // Render

      var render = function render(item) {
        var placeholder = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : _this3.appendChild(document.createTextNode(''));

        // item = Promise
        if (item instanceof Promise) {
          return item.then(function (value) {
            return render(value, placeholder);
          });
        } // item = function


        if (typeof item === 'function') {
          return render(item(_this3), placeholder);
        } // item = array


        if (Array.isArray(item)) {
          var promises = item.map(function (value) {
            return render(value, _this3.insertBefore(document.createTextNode(''), placeholder));
          }).filter(function (promise) {
            return promise instanceof Promise;
          });

          _this3.removeChild(placeholder);

          return promises.length > 0 && Promise.all(promises);
        } // item = object


        if (_typeof(item) === 'object' && item !== null && !(item instanceof Element) && !(item instanceof Text)) {
          var _promises2 = Object.keys(item).map(function (key) {
            return render(item[key], _this3.insertBefore(document.createTextNode(''), placeholder));
          }).filter(function (promise) {
            return promise instanceof Promise;
          });

          _this3.removeChild(placeholder);

          return _promises2.length > 0 && Promise.all(_promises2);
        } // item = boolean/number/string


        if (typeof item === 'boolean' || typeof item === 'number' || typeof item === 'string') {
          var wrapper = document.createElement('div');
          wrapper.innerHTML = String(item);
          return render(_toConsumableArray(wrapper.childNodes), placeholder);
        } // item = Element|Text


        if (item instanceof Element || item instanceof Text) {
          _this3.insertBefore(item, placeholder);
        } // Remove placeholder


        _this3.removeChild(placeholder); // Render item


        if (item instanceof Element && item.definedByUiFactoryPropertyDescriptors) {
          return callRenderOncontents && item.render();
        }
      };

      var result = render(this._contents); // Callback

      if (typeof callback === 'function') {
        if (result instanceof Promise) {
          result.then(function () {
            callback(_this3);
          });
        } else {
          callback(this);
        }
      } // Allow method chaining


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
      })]; // Callback

      if (typeof callback === 'function') {
        Promise.all(promises).then(function () {
          callback(_this4);
        });
      } // Allow method chaining


      return this;
    },
    writable: true
  }
};
/* exported uiFactory */

function uiFactory() {
  var element; // args = [string, string, object?]

  for (var _len2 = arguments.length, args = new Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
    args[_key2] = arguments[_key2];
  }

  if (typeof args[0] === 'string' && typeof args[1] === 'string') {
    var namespaceURI = args[0],
        qualifiedName = args[1],
        options = args[2];
    element = document.createElementNS(namespaceURI, qualifiedName, options);
  } // args = [string, object?]
  else if (typeof args[0] === 'string') {
      var tagName = args[0],
          _options = args[1];
      element = document.createElement(tagName, _options);
    } // args = [Element]
    else if (args[0] instanceof Element) {
        element = args[0];
      }

  if (element instanceof Element) {
    // Define properties
    if (!element.definedByUiFactoryPropertyDescriptor) {
      element = Object.defineProperties(element, uiFactoryPropertyDescriptor);
    } // Add initial content - for rerendering


    if (element.childNodes.length > 0) {
      var _element;

      (_element = element).contents.apply(_element, _toConsumableArray(element.childNodes));
    }
  } // Return element and start method chaining


  return element;
}

['a', 'abbr', 'address', 'area', 'article', 'aside', 'audio', 'b', 'base', 'bdi', 'bdo', 'blockquote', 'body', 'br', 'button', 'canvas', 'caption', 'cite', 'code', 'col', 'colgroup', 'data', 'datalist', 'dd', 'del', 'details', 'dfn', 'dialog', 'div', 'dl', 'dt', 'em', 'embed', 'fieldset', 'figure', 'footer', 'form', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'head', 'header', 'hgroup', 'hr', 'html', 'i', 'iframe', 'img', 'input', 'ins', 'kbd', 'keygen', 'label', 'legend', 'li', 'link', 'main', 'map', 'mark', 'menu', 'menuitem', 'meta', 'meter', 'nav', 'noscript', 'object', 'ol', 'optgroup', 'option', 'output', 'p', 'param', 'pre', 'progress', 'q', 'rb', 'rp', 'rt', 'rtc', 'ruby', 's', 'samp', 'script', 'section', 'select', 'small', 'source', 'span', 'strong', 'style', 'sub', 'summary', 'sup', 'table', 'tbody', 'td', 'template', 'textarea', 'tfoot', 'th', 'thead', 'time', 'title', 'tr', 'track', 'u', 'ul', 'var', 'video', 'wbr'].forEach(function (tag) {
  return uiFactory[tag] = function (callback) {
    return uiFactory(tag).callback(callback);
  };
});

uiFactory.svg = function () {
  return uif('http://www.w3.org/2000/svg', 'svg');
};

['a', 'animate', 'animateMotion', 'animateTransform', 'circle', 'clipPath', 'color-profile', 'defs', 'desc', 'discard', 'ellipse', 'feBlend', 'feColorMatrix', 'feComponentTransfer', 'feComposite', 'feConvolveMatrix', 'feDiffuseLighting', 'feDisplacementMap', 'feDistantLight', 'feDropShadow', 'feFlood', 'feFuncA', 'feFuncB', 'feFuncG', 'feFuncR', 'feGaussianBlur', 'feImage', 'feMerge', 'feMergeNode', 'feMorphology', 'feOffset', 'fePointLight', 'feSpecularLighting', 'feSpotLight', 'feTile', 'feTurbulence', 'filter', 'foreignObject', 'g', 'hatch', 'hatchpath', 'image', 'line', 'linearGradient', 'marker', 'mask', 'mesh', 'meshgradient', 'meshpatch', 'meshrow', 'metadata', 'mpath', 'path', 'pattern', 'polygon', 'polyline', 'radialGradient', 'rect', 'script', 'set', 'solidcolor', 'stop', 'style', 'switch', 'symbol', 'text', 'textPath', 'title', 'tspan', 'unknown', 'use', 'view'].forEach(function (tag) {
  return uiFactory.svg[tag] = function (callback) {
    return uiFactory('http://www.w3.org/2000/svg', tag).callback(callback);
  };
});
/* exported uif */

var uif = uif || uiFactory;