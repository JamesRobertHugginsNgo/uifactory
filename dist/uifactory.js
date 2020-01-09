"use strict";

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _nonIterableSpread(); }

function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance"); }

function _iterableToArray(iter) { if (Symbol.iterator in Object(iter) || Object.prototype.toString.call(iter) === "[object Arguments]") return Array.from(iter); }

function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = new Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } }

/* exported stringToHtml */
function stringToHtml(str) {
  var element = document.createElement('div');
  element.innerHTML = str;
  return _toConsumableArray(element.childNodes).map(function (element) {
    if (element instanceof HTMLElement) {
      return uiFactory(element);
    }

    return element;
  });
}

var uiFactoryPropertyDescriptors = {
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

      var chainCallback = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : true;

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

        if (childElements instanceof HTMLElement || childElements instanceof Text) {
          _this.insertBefore(childElements, placeholder);

          _this.removeChild(placeholder);

          if (childElements.definedByUifPropertyDescriptors) {
            return new Promise(function (resolve) {
              childElements.render(resolve, chainCallback);
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
          childElements = stringToHtml(childElements);

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
/* exported uiFactory */

function uiFactory(element, attributes, childElements, callback) {
  if (typeof element === 'string') {
    element = document.createElement(element);
  }

  if (!element.definedByUiFactoryPropertyDescriptors) {
    Object.defineProperties(element, uiFactoryPropertyDescriptors);
  }

  element.uiFactoryAttributes = attributes;
  element.uiFactoryChildElements = childElements;

  var existingChildElements = _toConsumableArray(element.childNodes).map(function (childNode) {
    return childNode instanceof HTMLElement ? uiFactory(childNode) : childNode;
  });

  if (existingChildElements.length > 0) {
    var _element$uiFactoryChi;

    element.uiFactoryChildElements = element.uiFactoryChildElements || [];
    element.uiFactoryChildElements = Array.isArray(element.uiFactoryChildElements) ? element.uiFactoryChildElements : [element.uiFactoryChildElements];

    (_element$uiFactoryChi = element.uiFactoryChildElements).unshift.apply(_element$uiFactoryChi, _toConsumableArray(existingChildElements));
  }

  return element.render(callback, false);
}