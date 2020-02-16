<<<<<<< HEAD
/* exported uiFactory */
/**
 * uiFactory factory.
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
	}

	// Add essential properties and method.
	if (!element.definedByUiFactoryPropertyDescriptors) {
		Object.defineProperties(element, uiFactory.propertyDescriptors);
	}

	// Add values to essential properties.
	element.uiFactoryAttributes = attributes;
	element.uiFactoryChildElements = childElements;

	// Prepend existing child elements to property, otherwise it will be removed on the next render.
	const originalChildElements = [...element.childNodes].map((childNode) => childNode instanceof HTMLElement ? uiFactory(childNode) : childNode);
	if (originalChildElements.length > 0) {
		element.uiFactoryChildElements = element.uiFactoryChildElements
			? Array.isArray(element.uiFactoryChildElements) ? element.uiFactoryChildElements : [element.uiFactoryChildElements]
			: [];
		element.uiFactoryChildElements.unshift(...originalChildElements);
	}

	// Trigger render for this element only.
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
		value(callback, chainRender = true) {
			const renderAttributes = (attributes, key, source) => {
				if (attributes == null) {
					return;
				}

				if (attributes instanceof Promise) {
					return attributes.then((value) => renderAttributes(value, key, source));
				}

				if (typeof attributes === 'function') {
					return renderAttributes(attributes(this), key, source);
				}

				if (Array.isArray(attributes)) {
					return Promise.all(attributes.map((attribute, index) => renderAttributes(attribute, index, attributes)));
				}

				if (typeof attributes === 'object') {
					return Promise.all(Object.keys(attributes).map(
						(key) => {
							this.removeAttribute(key);
							return renderAttributes(attributes[key], key, attributes);
						}
					));
				}

				if (key) {
					if (typeof source[key] !== 'function') {
						delete source[key];
					}
					this.setAttribute(key, attributes);
				}
			};

			const renderChildElements = (childElements, placeholder, source, key) => {
				placeholder = placeholder || this.appendChild(document.createTextNode(''));

				if (childElements == null) {
					this.removeChild(placeholder);
					return;
				}

				if (childElements instanceof Promise) {
					return childElements.then((value) => renderChildElements(value, placeholder, source, key));
				}

				if (typeof childElements === 'function') {
					return renderChildElements(childElements(this), placeholder, source, key);
				}

				if (Array.isArray(childElements)) {
					const returnValue = Promise.all(childElements.map(
						(childElement, index) => renderChildElements(childElement, this.insertBefore(document.createTextNode(''), placeholder), childElements, index)
					));
					this.removeChild(placeholder);
					return returnValue;
				}

				if (childElements instanceof HTMLElement || childElements instanceof Text || childElements instanceof SVGElement) {
					this.insertBefore(childElements, placeholder);
					this.removeChild(placeholder);
					if (chainRender && childElements.definedByUiFactoryPropertyDescriptors) {
						return new Promise((resolve) => {
							childElements.render(resolve);
						});
					} else {
						return;
					}
				}

				if (typeof childElements === 'object') {
					const returnValue = Promise.all(Object.keys(childElements).map(
						(key) => renderChildElements(childElements[key], this.insertBefore(document.createTextNode(''), placeholder), childElements, key)
					));
					this.removeChild(placeholder);
					return returnValue;
				}

				if (typeof childElements === 'boolean' || typeof childElements === 'number' || typeof childElements === 'string') {
					childElements = uiFactory.stringToHtml(childElements);
					if (source && key && typeof source[key] !== 'function') {
						source[key] = childElements;
					}
					return renderChildElements(childElements, placeholder, source, key);
				}
			};

			const prenderChildElements = (childElements) => {
				while (this.firstChild) {
					this.removeChild(this.firstChild);
				}
				return renderChildElements(childElements);
			};

			Promise.all([
				renderAttributes(this.uiFactoryAttributes),
				prenderChildElements(this.uiFactoryChildElements)
			]).then(() => {
				if (callback) {
					callback(this);
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
uiFactory.stringToHtml = (str) => {
	const element = document.createElement('div');
	element.innerHTML = str;
	return [...element.childNodes].map((element) => {
		if (element instanceof HTMLElement) {
			return uiFactory(element);
		}
		return element;
	});
};

uiFactory.arrayToString = (arr, joiner = ' ') => {
	if (!Array.isArray(arr)) {
		arr = [arr];
	}
	return arr.filter((val) => val != null).join(joiner);
};

uiFactory.when = (condition, trueValue, falseValue) => {
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

uiFactory.exec = (func, ...args) => {
	return func(...args);
};
=======
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// UI FACTORY
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

/* exported uiFactory */
function uiFactory(...args) {
	let element;

	// Branch - based on args pattern
	// A. [string, string, !function?, ...]
	if (typeof args[0] === 'string' && typeof args[1] === 'string') {
		let namespaceURI, qualifiedName, options;
		[namespaceURI, qualifiedName, ...args] = args;
		if (typeof args[0] !== 'function') {
			[options, ...args] = args;
		}
		element = document.createElementNS(namespaceURI, qualifiedName, options);
	}
	// B. [string, !function?, ...]
	else if (typeof args[0] === 'string') {
		let tagName, options;
		[tagName, ...args] = args;
		if (typeof args[0] !== 'function') {
			[options, ...args] = args;
		}
		element = document.createElement(tagName, options);
	}
	// C. [Element, function?]
	else if (args[0] instanceof Element) {
		[element, ...args] = args;
	}

	if (element instanceof Element) {
		if (!element.definedBy__uiFactory__propertyDescriptors) {
			element = Object.defineProperties(element, uiFactory__propertyDescriptors);
		}

		// Add initial contents
		if (element.childNodes.length > 0) {
			element.contents(...element.childNodes);
		}
	}

	// Return element and start method chaining
	return element.callback(args[0]);
}

/* exported uif */
let uif = uif || uiFactory;

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// PROPERTY DESCRIPTOR
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

/* exported uiFactoryPropertyDescriptors */
const uiFactory__propertyDescriptors = {
	definedBy__uiFactory__propertyDescriptors: {
		value: true
	},

	// Callback
	callback: {
		value(callback) {
			if (typeof callback === 'function') {
				callback(this);
			}

			return this;
		},
		writable: true
	},

	// Events
	events: {
		value(events, callback) {
			if (events && typeof events === 'object') {
				for (const type in events) {
					if (Object.prototype.hasOwnProperty.call(events, type) && typeof events[type] === 'function') {
						this.addEventListener(type, function (...args) {
							events[type].call(this, ...args, this);
						});
					}
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
		value(properties = this._properties, callback) {
			this._properties = properties;

			// Define attributes render function
			const renderAttributes = (propertyValue, propertyName, properties) => {

				// Branch - based on value type
				// A. Promise
				if (propertyValue instanceof Promise) {
					return propertyValue.then((value) => {
						return renderAttributes(value, propertyName);
					});
				}
				// B. function
				if (typeof propertyValue === 'function') {
					return renderAttributes(propertyValue.call(this, this), propertyName);
				}
				// C. array
				if (Array.isArray(propertyValue)) {
					const tempProperties = {};
					const promises = propertyValue
						.map((value, index) => {
							tempProperties[index] = true;
							return renderAttributes(value, index, tempProperties);
						})
						.filter((promise) => promise instanceof Promise);
					if (properties && propertyName && Object.keys(tempProperties).length === 0) {
						delete properties[propertyName];
					}
					if (promises.length > 0) {
						return Promise.all(promises);
					}
					return;
				}
				// D. object
				if (typeof propertyValue === 'object' && propertyValue !== null) {
					const promises = Object.keys(propertyValue)
						.map((key) => renderAttributes(propertyValue[key], key, propertyValue))
						.filter((promise) => promise instanceof Promise);
					if (properties && propertyName && Object.keys(propertyValue).length === 0) {
						delete properties[propertyName];
					}
					if (promises.length > 0) {
						return Promise.all(promises);
					}
					return;
				}
				// E. otherwise
				if (propertyName) {
					if (propertyValue == null) {
						this.removeAttribute(propertyName);
					} else {
						this.setAttribute(propertyName, propertyValue);
					}
					if (properties) {
						delete properties[propertyName];
					}
				}
			};

			// Render attributes
			const result = renderAttributes(this._properties);
			if (result instanceof Promise) {
				result.then(() => {
					this.callback(callback);
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
		value(contents = this._contents, callback, callRenderOnContents = false) {
			this._contents = contents;

			// Empty contents
			while (this.firstChild) {
				this.removeChild(this.firstChild);
			}

			// Define contents render function
			const renderContents = (item, placeholder = this.appendChild(document.createTextNode(''))) => {

				// Branch - based on item type
				// A. Promise
				if (item instanceof Promise) {
					return item.then((value) => {
						return renderContents(value, placeholder);
					});
				}
				// B. function
				if (typeof item === 'function') {
					return renderContents(item(this), placeholder);
				}
				// C. array
				if (Array.isArray(item)) {
					const promises = item
						.map((value) => renderContents(value, this.insertBefore(document.createTextNode(''), placeholder)))
						.filter((promise) => promise instanceof Promise);
					this.removeChild(placeholder);
					if (promises.length > 0) {
						return Promise.all(promises);
					}
					return;
				}
				// D. object
				if (typeof item === 'object' && item !== null && !(item instanceof Element) && !(item instanceof Text)) {
					const promises = Object.keys(item)
						.map((key) => renderContents(item[key], this.insertBefore(document.createTextNode(''), placeholder)))
						.filter((promise) => promise instanceof Promise);
					this.removeChild(placeholder);
					if (promises.length > 0) {
						return Promise.all(promises);
					}
					return;
				}
				// E. boolean/number/string
				if (typeof item === 'boolean' || typeof item === 'number' || typeof item === 'string') {
					const wrapper = document.createElement('div');
					wrapper.innerHTML = String(item);
					return renderContents([...wrapper.childNodes], placeholder);
				}
				// F. Otherwise
				if (item instanceof Element || item instanceof Text) {
					this.insertBefore(item, placeholder);
				}
				this.removeChild(placeholder);
				if (item instanceof Element && item.definedBy__uiFactory__propertyDescriptors && callRenderOnContents) {
					return item.render();
				}
			};

			const result = renderContents(this._contents);
			if (result instanceof Promise) {
				result.then(() => {
					this.callback(callback);
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
		value(callback) {
			const promises = [
				new Promise((resolve) => this.properties(this._properties, resolve)),
				new Promise((resolve) => this.contents(this._contents, resolve, true))
			];

			Promise.all(promises).then(() => {
				this.callback(callback);
			});

			return this;
		},
		writable: true
	}
};

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// ALIAS FUNCTIONS
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
>>>>>>> feature/version3

['a', 'abbr', 'address', 'area', 'article', 'aside', 'audio', 'b', 'base', 'bdi', 'bdo', 'blockquote', 'body', 'br',
	'button', 'canvas', 'caption', 'cite', 'code', 'col', 'colgroup', 'data', 'datalist', 'dd', 'del', 'details', 'dfn',
	'dialog', 'div', 'dl', 'dt', 'em', 'embed', 'fieldset', 'figure', 'footer', 'form', 'h1', 'h2', 'h3', 'h4', 'h5',
	'h6', 'head', 'header', 'hgroup', 'hr', 'html', 'i', 'iframe', 'img', 'input', 'ins', 'kbd', 'keygen', 'label',
<<<<<<< HEAD
	'legend', 'li', 'link', 'main', 'map', 'mark', 'menu', 'menuitem', 'meta', 'meter', 'nav', 'noscript', 'object', 'ol',
	'optgroup', 'option', 'output', 'p', 'param', 'pre', 'progress', 'q', 'rb', 'rp', 'rt', 'rtc', 'ruby', 's', 'samp',
	'script', 'section', 'select', 'small', 'source', 'span', 'strong', 'style', 'sub', 'summary', 'sup', 'table',
	'tbody', 'td', 'template', 'textarea', 'tfoot', 'th', 'thead', 'time', 'title', 'tr', 'track', 'u', 'ul', 'var',
	'video', 'wbr'].forEach((tag) => {
		uiFactory[tag] = (attributes, childElements, callback) => {
			return uiFactory(tag, attributes, childElements, callback);
		};
	});

uiFactory.svg = (element, attributes, childElements, callback) => {
	if (typeof element === 'string') {
		element = document.createElementNS('http://www.w3.org/2000/svg', element);
	}
	return uiFactory(element, attributes, childElements, callback);
};

=======
	'legend', 'li', 'link', 'main', 'map', 'mark', 'menu', 'menuitem', 'meta', 'meter', 'nav', 'noscript', 'object',
	'ol', 'optgroup', 'option', 'output', 'p', 'param', 'pre', 'progress', 'q', 'rb', 'rp', 'rt', 'rtc', 'ruby', 's',
	'samp', 'script', 'section', 'select', 'small', 'source', 'span', 'strong', 'style', 'sub', 'summary', 'sup', 'table',
	'tbody', 'td', 'template', 'textarea', 'tfoot', 'th', 'thead', 'time', 'title', 'tr', 'track', 'u', 'ul', 'var',
	'video', 'wbr'].forEach((tag) => uiFactory[tag] = function (callback) {
		return uiFactory(tag, callback);
	});

uiFactory.svg = () => uif('http://www.w3.org/2000/svg', 'svg');
>>>>>>> feature/version3
['a', 'animate', 'animateMotion', 'animateTransform', 'circle', 'clipPath', 'color-profile', 'defs', 'desc', 'discard',
	'ellipse', 'feBlend', 'feColorMatrix', 'feComponentTransfer', 'feComposite', 'feConvolveMatrix', 'feDiffuseLighting',
	'feDisplacementMap', 'feDistantLight', 'feDropShadow', 'feFlood', 'feFuncA', 'feFuncB', 'feFuncG', 'feFuncR',
	'feGaussianBlur', 'feImage', 'feMerge', 'feMergeNode', 'feMorphology', 'feOffset', 'fePointLight',
	'feSpecularLighting', 'feSpotLight', 'feTile', 'feTurbulence', 'filter', 'foreignObject', 'g', 'hatch', 'hatchpath',
	'image', 'line', 'linearGradient', 'marker', 'mask', 'mesh', 'meshgradient', 'meshpatch', 'meshrow', 'metadata',
	'mpath', 'path', 'pattern', 'polygon', 'polyline', 'radialGradient', 'rect', 'script', 'set', 'solidcolor', 'stop',
<<<<<<< HEAD
	'style', 'svg', 'switch', 'symbol', 'text', 'textPath', 'title', 'tspan', 'unknown', 'use', 'view'].forEach((tag) => {
		uiFactory.svg[tag] = (attributes, childElements, callback) => {
			return uiFactory.svg(tag, attributes, childElements, callback);
		};
	});

/** Conveniece Object */
if (!window.uif) {
	window.uif = uiFactory;
=======
	'style', 'switch', 'symbol', 'text', 'textPath', 'title', 'tspan', 'unknown', 'use', 'view']
	.forEach((tag) => uiFactory.svg[tag] = function (callback) {
		return uiFactory('http://www.w3.org/2000/svg', tag, callback);
	});

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// CUSTOMIZE UI FACTORY
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

/* exported uiFactory__customize */
function uiFactory__customize(element, ...args) {
	let types, callback;

	// element = uiFactory(element);

	// Assign arguments to variables
	// - [element, ...]
	if (args[0] instanceof Element) {
		[element, ...args] = args;
	}
	// - [!function, ...]
	if (typeof args[0] !== 'function') {
		[types, ...args] = args;
		if (types !== undefined && !Array.isArray(types)) {
			types = [types];
		}
	}
	// - [function, ...]
	if (typeof args[0] === 'function') {
		[callback, ...args] = args;
	}

	element = uiFactory(element);

	function setBeforeProperties(beforeProperties) {
		beforeProperties(true);
		element.properties = (function (originalProperties) {
			return function (properties, callback) {
				beforeProperties(false);
				return originalProperties.call(this, properties, callback);
			};
		})(element.properties);
	}

	function setAfterProperties(afterProperties) {
		afterProperties(true);
		element.properties = (function (originalProperties) {
			return function (properties, callback) {
				return originalProperties.call(this, properties, function (element) {
					afterProperties(false);
					if (typeof callback === 'function') {
						return callback.call(this, element);
					}
				});
			};
		})(element.properties);
	}

	function setBeforeContents(beforeContents) {
		beforeContents(true);
		element.contents = (function (originalContents) {
			return function (contents, callback, callRenderOnContents) {
				beforeContents(false);
				return originalContents.call(this, contents, callback, callRenderOnContents);
			};
		})(element.contents);
	}

	function setAfterContents(afterContents) {
		afterContents(true);
		element.contents = (function (originalContents) {
			return function (contents, callback, callRenderOnContents) {
				return originalContents.call(this, contents, function (element) {
					afterContents(false);
					if (typeof callback === 'function') {
						return callback.call(this, element);
					}
				}, callRenderOnContents);
			};
		})(element.contents);
	}

	return {
		element, types, callback,
		setBeforeProperties, setAfterProperties,
		setBeforeContents, setAfterContents
	};
>>>>>>> feature/version3
}

