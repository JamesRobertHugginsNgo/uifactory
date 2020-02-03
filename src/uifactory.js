/* exported uiFactoryPropertyDescriptor */
const uiFactoryPropertyDescriptor = {
	definedByUiFactoryPropertyDescriptor: { value: true },

	// Callback
	callback: {
		value(callback) {

			// Callback
			if (typeof callback === 'function') {
				callback(this);
			}

			// Allow method chaining
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

			if (typeof callback === 'function') {
				callback(this);
			}

			// Allow method chaining
			return this;
		},
		writable: true
	},

	// Properties
	_properties: { writable: true },
	properties: {
		value(properties = this._properties, callback) {
			this._properties = properties;

			// Render
			const render = (propertyValue, propertyName, properties) => {

				// propertyValue = Promise
				if (propertyValue instanceof Promise) {
					return propertyValue.then((value) => {
						return render(value, propertyName);
					});
				}

				// propertyValue = function
				if (typeof propertyValue === 'function') {
					return render(propertyValue.call(this, this), propertyName);
				}

				// propertyValue = array
				if (Array.isArray(propertyValue)) {
					const tempProperties = {};
					const promises = propertyValue
						.map((value, index) => {
							tempProperties[index] = true;
							return render(value, index, tempProperties);
						})
						.filter((promise) => promise instanceof Promise);
					if (properties && propertyName && Object.keys(tempProperties).length === 0) {
						delete properties[propertyName];
					}
					if (promises.length > 0) {
						return Promise.all(promises);
					}
				}

				// propertyValue = object
				if (typeof propertyValue === 'object' && propertyValue !== null) {
					const promises = Object.keys(propertyValue)
						.map((key) => render(propertyValue[key], key, propertyValue))
						.filter((promise) => promise instanceof Promise);
					if (properties && propertyName && Object.keys(propertyValue).length === 0) {
						delete properties[propertyName];
					}
					if (promises.length > 0) {
						return Promise.all(promises);
					}
				}

				// propertyName & propertyValue = !null
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
			const result = render(this._properties);

			// Callback
			if (typeof callback === 'function') {
				if (result instanceof Promise) {
					result.then(() => {
						callback(this);
					});
				} else {
					callback(this);
				}
			}

			// Allow method chaining
			return this;
		},
		writable: true
	},

	// contents
	_contents: { writable: true },
	contents: {
		value(contents, callback, callRenderOncontents = false) {
			this._contents = contents;

			// Render
			const render = (item, placeholder = this.appendChild(document.createTextNode(''))) => {

				// item = Promise
				if (item instanceof Promise) {
					return item.then((value) => {
						return render(value, placeholder);
					});
				}

				// item = function
				if (typeof item === 'function') {
					return render(item(this), placeholder);
				}

				// item = array
				if (Array.isArray(item)) {
					const promises = item
						.map((value) => render(value, this.insertBefore(document.createTextNode(''), placeholder)))
						.filter((promise) => promise instanceof Promise);
					this.removeChild(placeholder);
					return promises.length > 0 && Promise.all(promises);
				}

				// item = object
				if (typeof item === 'object' && item !== null && !(item instanceof Element) && !(item instanceof Text)) {
					const promises = Object.keys(item)
						.map((key) => render(item[key], this.insertBefore(document.createTextNode(''), placeholder)))
						.filter((promise) => promise instanceof Promise);
					this.removeChild(placeholder);
					return promises.length > 0 && Promise.all(promises);
				}

				// item = boolean/number/string
				if (typeof item === 'boolean' || typeof item === 'number' || typeof item === 'string') {
					const wrapper = document.createElement('div');
					wrapper.innerHTML = String(item);
					return render([...wrapper.childNodes], placeholder);
				}

				// item = Element|Text
				if (item instanceof Element || item instanceof Text) {
					this.insertBefore(item, placeholder);
				}

				// Remove placeholder
				this.removeChild(placeholder);

				// Render item
				if (item instanceof Element && item.definedByUiFactoryPropertyDescriptors) {
					return callRenderOncontents && item.render();
				}
			};
			const result = render(this._contents);

			// Callback
			if (typeof callback === 'function') {
				if (result instanceof Promise) {
					result.then(() => {
						callback(this);
					});
				} else {
					callback(this);
				}
			}

			// Allow method chaining
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

			// Callback
			if (typeof callback === 'function') {
				Promise.all(promises).then(() => {
					callback(this);
				});
			}

			// Allow method chaining
			return this;
		},
		writable: true
	}
};

/* exported uiFactory */
function uiFactory(...args) {
	let element;

	// args = [string, string, object?]
	if (typeof args[0] === 'string' && typeof args[1] === 'string') {
		const [namespaceURI, qualifiedName, options] = args;
		element = document.createElementNS(namespaceURI, qualifiedName, options);
	}
	// args = [string, object?]
	else if (typeof args[0] === 'string') {
		const [tagName, options] = args;
		element = document.createElement(tagName, options);
	}
	// args = [Element]
	else if (args[0] instanceof Element) {
		[element] = args;
	}

	if (element instanceof Element) {

		// Define properties
		if (!element.definedByUiFactoryPropertyDescriptor) {
			element = Object.defineProperties(element, uiFactoryPropertyDescriptor);
		}

		// Add initial content - for rerendering
		if (element.childNodes.length > 0) {
			element.contents(...element.childNodes);
		}
	}

	// Return element and start method chaining
	return element;
}

['a', 'abbr', 'address', 'area', 'article', 'aside', 'audio', 'b', 'base', 'bdi', 'bdo', 'blockquote', 'body', 'br',
	'button', 'canvas', 'caption', 'cite', 'code', 'col', 'colgroup', 'data', 'datalist', 'dd', 'del', 'details', 'dfn',
	'dialog', 'div', 'dl', 'dt', 'em', 'embed', 'fieldset', 'figure', 'footer', 'form', 'h1', 'h2', 'h3', 'h4', 'h5',
	'h6', 'head', 'header', 'hgroup', 'hr', 'html', 'i', 'iframe', 'img', 'input', 'ins', 'kbd', 'keygen', 'label',
	'legend', 'li', 'link', 'main', 'map', 'mark', 'menu', 'menuitem', 'meta', 'meter', 'nav', 'noscript', 'object',
	'ol', 'optgroup', 'option', 'output', 'p', 'param', 'pre', 'progress', 'q', 'rb', 'rp', 'rt', 'rtc', 'ruby', 's',
	'samp', 'script', 'section', 'select', 'small', 'source', 'span', 'strong', 'style', 'sub', 'summary', 'sup', 'table',
	'tbody', 'td', 'template', 'textarea', 'tfoot', 'th', 'thead', 'time', 'title', 'tr', 'track', 'u', 'ul', 'var',
	'video', 'wbr'].forEach((tag) => uiFactory[tag] = (callback) => uiFactory(tag).callback(callback));

uiFactory.svg = () => uif('http://www.w3.org/2000/svg', 'svg');
['a', 'animate', 'animateMotion', 'animateTransform', 'circle', 'clipPath', 'color-profile', 'defs', 'desc', 'discard',
	'ellipse', 'feBlend', 'feColorMatrix', 'feComponentTransfer', 'feComposite', 'feConvolveMatrix', 'feDiffuseLighting',
	'feDisplacementMap', 'feDistantLight', 'feDropShadow', 'feFlood', 'feFuncA', 'feFuncB', 'feFuncG', 'feFuncR',
	'feGaussianBlur', 'feImage', 'feMerge', 'feMergeNode', 'feMorphology', 'feOffset', 'fePointLight',
	'feSpecularLighting', 'feSpotLight', 'feTile', 'feTurbulence', 'filter', 'foreignObject', 'g', 'hatch', 'hatchpath',
	'image', 'line', 'linearGradient', 'marker', 'mask', 'mesh', 'meshgradient', 'meshpatch', 'meshrow', 'metadata',
	'mpath', 'path', 'pattern', 'polygon', 'polyline', 'radialGradient', 'rect', 'script', 'set', 'solidcolor', 'stop',
	'style', 'switch', 'symbol', 'text', 'textPath', 'title', 'tspan', 'unknown', 'use', 'view']
	.forEach((tag) => uiFactory.svg[tag] = (callback) => uiFactory('http://www.w3.org/2000/svg', tag).callback(callback));

/* exported uif */
let uif = uif || uiFactory;
