"use strict";

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _nonIterableSpread(); }

function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance"); }

function _iterableToArray(iter) { if (Symbol.iterator in Object(iter) || Object.prototype.toString.call(iter) === "[object Arguments]") return Array.from(iter); }

function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = new Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } }

/* exported uiFactory */

/**
 * Creates HTML elements with additional functionalities.
 * @param {string|HTMLElement} element
 * @param {object|[object]} attributes
 * @param {HTMLElement|function|string|Text|object|[HTMLElement|function|string|Text|object]} childElements
 * @param {function} callback
 * @returns {HTMLElement}
 */
function uiFactory(element, attributes, childElements, callback) {
  // Pass element name as string to create a new element.
  if (typeof element === 'string') {
    element = document.createElement(element);
  } // Add essential properties and method.


  if (!element.definedByUiFactoryPropertyDescriptors) {
    Object.defineProperties(element, uiFactory.propertyDescriptors);
  } // Add values to essential properties.


  element.uiFactoryAttributes = attributes;
  element.uiFactoryChildElements = childElements; // Prepend existing child elements to property, otherwise it will be removed on the next render.

  var originalChildElements = _toConsumableArray(element.childNodes).map(function (childNode) {
    return childNode instanceof HTMLElement ? uiFactory(childNode) : childNode;
  });

  if (originalChildElements.length > 0) {
    var _element$uiFactoryChi;

    element.uiFactoryChildElements = element.uiFactoryChildElements ? Array.isArray(element.uiFactoryChildElements) ? element.uiFactoryChildElements : [element.uiFactoryChildElements] : [];

    (_element$uiFactoryChi = element.uiFactoryChildElements).unshift.apply(_element$uiFactoryChi, _toConsumableArray(originalChildElements));
  } // Trigger render for this element only.


  return element.render(callback, false);
}
/** Object descriptors to be used on HTMLElements. */


uiFactory.propertyDescriptors = {
  definedByUiFactoryPropertyDescriptors: {
    value: true
  },
  uiFactoryAttributes: {
    writable: true
  },
  uiFactoryChildElements: {
    writable: true
  },
  render: {
    value: function value(callback) {
      var _this = this;

      var chainRender = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : true;

      var renderAttributes = function renderAttributes(attributes, key, source) {
        if (attributes == null) {
          return;
        }

        if (attributes instanceof Promise) {
          return attributes.then(function (value) {
            return renderAttributes(value, key, source);
          });
        }

        if (typeof attributes === 'function') {
          return renderAttributes(attributes(_this), key, source);
        }

        if (Array.isArray(attributes)) {
          return Promise.all(attributes.map(function (attribute, index) {
            return renderAttributes(attribute, index, attributes);
          }));
        }

        if (_typeof(attributes) === 'object') {
          return Promise.all(Object.keys(attributes).map(function (key) {
            _this.removeAttribute(key);

            return renderAttributes(attributes[key], key, attributes);
          }));
        }

        if (key) {
          if (typeof source[key] !== 'function') {
            delete source[key];
          }

          _this.setAttribute(key, attributes);
        }
      };

      var renderChildElements = function renderChildElements(childElements, placeholder, source, key) {
        placeholder = placeholder || _this.appendChild(document.createTextNode(''));

        if (childElements == null) {
          _this.removeChild(placeholder);

          return;
        }

        if (childElements instanceof Promise) {
          return childElements.then(function (value) {
            return renderChildElements(value, placeholder, source, key);
          });
        }

        if (typeof childElements === 'function') {
          return renderChildElements(childElements(_this), placeholder, source, key);
        }

        if (Array.isArray(childElements)) {
          var returnValue = Promise.all(childElements.map(function (childElement, index) {
            return renderChildElements(childElement, _this.insertBefore(document.createTextNode(''), placeholder), childElements, index);
          }));

          _this.removeChild(placeholder);

          return returnValue;
        }

        if (childElements instanceof HTMLElement || childElements instanceof Text || childElements instanceof SVGElement) {
          _this.insertBefore(childElements, placeholder);

          _this.removeChild(placeholder);

          if (chainRender && childElements.definedByUiFactoryPropertyDescriptors) {
            return new Promise(function (resolve) {
              childElements.render(resolve);
            });
          } else {
            return;
          }
        }

        if (_typeof(childElements) === 'object') {
          var _returnValue = Promise.all(Object.keys(childElements).map(function (key) {
            return renderChildElements(childElements[key], _this.insertBefore(document.createTextNode(''), placeholder), childElements, key);
          }));

          _this.removeChild(placeholder);

          return _returnValue;
        }

        if (typeof childElements === 'boolean' || typeof childElements === 'number' || typeof childElements === 'string') {
          childElements = uiFactory.stringToHtml(childElements);

          if (source && key && typeof source[key] !== 'function') {
            source[key] = childElements;
          }

          return renderChildElements(childElements, placeholder, source, key);
        }
      };

      var prenderChildElements = function prenderChildElements(childElements) {
        while (_this.firstChild) {
          _this.removeChild(_this.firstChild);
        }

        return renderChildElements(childElements);
      };

      Promise.all([renderAttributes(this.uiFactoryAttributes), prenderChildElements(this.uiFactoryChildElements)]).then(function () {
        if (callback) {
          callback(_this);
        }
      });
      return this;
    }
  }
};
/**
 * Create child elements for uiFactory.
 * @param {string} str
 * @returns {[HTMLElement|Text]}
 */

uiFactory.stringToHtml = function (str) {
  var element = document.createElement('div');
  element.innerHTML = str;
  return _toConsumableArray(element.childNodes).map(function (element) {
    if (element instanceof HTMLElement) {
      return uiFactory(element);
    }

    return element;
  });
};

uiFactory.arrayToString = function (arr) {
  var joiner = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : ' ';

  if (!Array.isArray(arr)) {
    arr = [arr];
  }

  return arr.filter(function (val) {
    return val != null;
  }).join(joiner);
};

uiFactory.when = function (condition, trueValue, falseValue) {
  if (typeof condition === 'function') {
    condition = condition();
  }

  if (condition) {
    if (typeof trueValue === 'function') {
      trueValue = trueValue();
    }

    return trueValue;
  } else {
    if (typeof falseValue === 'function') {
      falseValue = falseValue();
    }

    return falseValue;
  }
};

uiFactory.exec = function (func) {
  for (var _len = arguments.length, args = new Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
    args[_key - 1] = arguments[_key];
  }

  return func.apply(void 0, args);
};

['a', 'abbr', 'address', 'area', 'article', 'aside', 'audio', 'b', 'base', 'bdi', 'bdo', 'blockquote', 'body', 'br', 'button', 'canvas', 'caption', 'cite', 'code', 'col', 'colgroup', 'data', 'datalist', 'dd', 'del', 'details', 'dfn', 'dialog', 'div', 'dl', 'dt', 'em', 'embed', 'fieldset', 'figure', 'footer', 'form', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'head', 'header', 'hgroup', 'hr', 'html', 'i', 'iframe', 'img', 'input', 'ins', 'kbd', 'keygen', 'label', 'legend', 'li', 'link', 'main', 'map', 'mark', 'menu', 'menuitem', 'meta', 'meter', 'nav', 'noscript', 'object', 'ol', 'optgroup', 'option', 'output', 'p', 'param', 'pre', 'progress', 'q', 'rb', 'rp', 'rt', 'rtc', 'ruby', 's', 'samp', 'script', 'section', 'select', 'small', 'source', 'span', 'strong', 'style', 'sub', 'summary', 'sup', 'table', 'tbody', 'td', 'template', 'textarea', 'tfoot', 'th', 'thead', 'time', 'title', 'tr', 'track', 'u', 'ul', 'var', 'video', 'wbr'].forEach(function (tag) {
  uiFactory[tag] = function (attributes, childElements, callback) {
    return uiFactory(tag, attributes, childElements, callback);
  };
});

uiFactory.svg = function (element, attributes, childElements, callback) {
  if (typeof element === 'string') {
    element = document.createElementNS('http://www.w3.org/2000/svg', element);
  }

  return uiFactory(element, attributes, childElements, callback);
};

['a', 'animate', 'animateMotion', 'animateTransform', 'circle', 'clipPath', 'color-profile', 'defs', 'desc', 'discard', 'ellipse', 'feBlend', 'feColorMatrix', 'feComponentTransfer', 'feComposite', 'feConvolveMatrix', 'feDiffuseLighting', 'feDisplacementMap', 'feDistantLight', 'feDropShadow', 'feFlood', 'feFuncA', 'feFuncB', 'feFuncG', 'feFuncR', 'feGaussianBlur', 'feImage', 'feMerge', 'feMergeNode', 'feMorphology', 'feOffset', 'fePointLight', 'feSpecularLighting', 'feSpotLight', 'feTile', 'feTurbulence', 'filter', 'foreignObject', 'g', 'hatch', 'hatchpath', 'image', 'line', 'linearGradient', 'marker', 'mask', 'mesh', 'meshgradient', 'meshpatch', 'meshrow', 'metadata', 'mpath', 'path', 'pattern', 'polygon', 'polyline', 'radialGradient', 'rect', 'script', 'set', 'solidcolor', 'stop', 'style', 'svg', 'switch', 'symbol', 'text', 'textPath', 'title', 'tspan', 'unknown', 'use', 'view'].forEach(function (tag) {
  uiFactory.svg[tag] = function (attributes, childElements, callback) {
    return uiFactory.svg(tag, attributes, childElements, callback);
  };
});
/** Conveniece Object */

if (!window.uif) {
  window.uif = uiFactory;
}