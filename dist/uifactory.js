"use strict";

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _nonIterableSpread(); }

function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance"); }

function _iterableToArray(iter) { if (Symbol.iterator in Object(iter) || Object.prototype.toString.call(iter) === "[object Arguments]") return Array.from(iter); }

function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = new Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } }

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
    Object.defineProperties(element, uiFactory.propertyDescriptors);
  }

  element.childElementsData = _toConsumableArray(element.childNodes);
  return element.cbk(callback);
}

uiFactory.propertyDescriptors = {
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
  },
  cbk: {
    value: function value() {
      return this.callback.apply(this, arguments);
    }
  },
  attrs: {
    value: function value() {
      return this.renderAttributes.apply(this, arguments);
    }
  },
  cEls: {
    value: function value() {
      return this.renderChildElements.apply(this, arguments);
    }
  }
};
['a', 'abbr', 'address', 'area', 'article', 'aside', 'audio', 'b', 'base', 'bdi', 'bdo', 'blockquote', 'body', 'br', 'button', 'canvas', 'caption', 'cite', 'code', 'col', 'colgroup', 'data', 'datalist', 'dd', 'del', 'details', 'dfn', 'dialog', 'div', 'dl', 'dt', 'em', 'embed', 'fieldset', 'figure', 'footer', 'form', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'head', 'header', 'hgroup', 'hr', 'html', 'i', 'iframe', 'img', 'input', 'ins', 'kbd', 'keygen', 'label', 'legend', 'li', 'link', 'main', 'map', 'mark', 'menu', 'menuitem', 'meta', 'meter', 'nav', 'noscript', 'object', 'ol', 'optgroup', 'option', 'output', 'p', 'param', 'pre', 'progress', 'q', 'rb', 'rp', 'rt', 'rtc', 'ruby', 's', 'samp', 'script', 'section', 'select', 'small', 'source', 'span', 'strong', 'style', 'sub', 'summary', 'sup', 'table', 'tbody', 'td', 'template', 'textarea', 'tfoot', 'th', 'thead', 'time', 'title', 'tr', 'track', 'u', 'ul', 'var', 'video', 'wbr'].forEach(function (name) {
  return uiFactory[name] = function (callback) {
    return uiFactory(name, callback);
  };
});

uiFactory.lorem = function () {
  var paragraphs = ['Lorem ipsum dolor sit amet, consectetur adipiscing elit. Phasellus gravida felis vitae mauris facilisis maximus. Integer pulvinar at diam ac pharetra. Donec eu nisi ornare, ultrices tellus sed, blandit magna. Donec molestie accumsan arcu non lacinia. Mauris mollis nulla ex, id suscipit elit dictum sit amet. Suspendisse tempor congue dui, at dictum quam eleifend eget. Maecenas sit amet lacus id erat pharetra pulvinar.', 'Quisque rhoncus blandit nunc in dictum. Nunc elit tortor, ultricies ac turpis vel, ornare dignissim augue. Cras in ante sit amet sem aliquam porta. Quisque ut interdum orci. Cras condimentum felis tempor, eleifend lorem nec, rhoncus libero. Aenean ultricies felis sed nunc dapibus suscipit. Vestibulum laoreet, nibh ac scelerisque consectetur, sapien odio malesuada felis, quis lobortis justo turpis a sapien. Pellentesque consectetur volutpat ante, at tincidunt nisl porta ac. Donec eleifend imperdiet vulputate. Fusce ullamcorper ultrices euismod. Maecenas bibendum scelerisque arcu, et aliquam nulla consectetur ut. Class aptent taciti sociosqu ad litora torquent per conubia nostra, per inceptos himenaeos. Donec porta nibh sed risus scelerisque fringilla.', 'Maecenas molestie nulla eu laoreet consequat. Sed sagittis blandit imperdiet. Vestibulum commodo urna vel purus sodales tincidunt. Phasellus in nulla vel nunc sodales dignissim quis quis nisi. Donec venenatis et nisi vel porttitor. Sed ut sollicitudin urna, vel aliquet ligula. In hac habitasse platea dictumst. Fusce quis urna diam. Donec tempor tristique dignissim. Nulla pharetra sit amet nibh id porta. Donec sagittis urna risus, in ultrices nisi fringilla et. Suspendisse potenti.', 'Morbi vitae fringilla massa. Praesent luctus gravida magna, et ornare enim viverra sit amet. Donec risus ipsum, interdum non libero eget, feugiat placerat ante. Quisque semper elementum euismod. Donec sit amet enim lobortis, tempus sem vel, mollis elit. Maecenas eget dui arcu. Nunc a orci lorem.', 'Phasellus non leo nunc. Ut id posuere orci. Mauris congue lectus sed sapien vulputate dignissim. Donec ac enim ac dui vestibulum fermentum. Nam dignissim lacinia lacus, tempor dignissim lacus mattis et. Quisque sed velit nisi. Vivamus pulvinar rhoncus justo, quis lobortis sem lobortis eu. Nam iaculis odio non velit semper feugiat. Pellentesque vehicula dui felis, nec malesuada lacus molestie rutrum. Nullam in lectus porta, egestas massa quis, mattis sem. Fusce mauris purus, faucibus et congue eu, iaculis sit amet leo. Maecenas et volutpat lorem, non eleifend est. Donec nec nisi eu erat finibus ultricies. Nullam eget convallis felis, eget viverra est. Pellentesque pellentesque feugiat augue.'];
  return paragraphs[uiFactory.lorem.index++ % paragraphs.length];
};

uiFactory.lorem.index = 0;
/* exported uif */

var uif = uiFactory;