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

['a', 'abbr', 'address', 'area', 'article', 'aside', 'audio', 'b', 'base', 'bdi', 'bdo', 'blockquote', 'body', 'br',
	'button', 'canvas', 'caption', 'cite', 'code', 'col', 'colgroup', 'data', 'datalist', 'dd', 'del', 'details', 'dfn',
	'dialog', 'div', 'dl', 'dt', 'em', 'embed', 'fieldset', 'figure', 'footer', 'form', 'h1', 'h2', 'h3', 'h4', 'h5',
	'h6', 'head', 'header', 'hgroup', 'hr', 'html', 'i', 'iframe', 'img', 'input', 'ins', 'kbd', 'keygen', 'label',
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

['a', 'animate', 'animateMotion', 'animateTransform', 'circle', 'clipPath', 'color-profile', 'defs', 'desc', 'discard',
	'ellipse', 'feBlend', 'feColorMatrix', 'feComponentTransfer', 'feComposite', 'feConvolveMatrix', 'feDiffuseLighting',
	'feDisplacementMap', 'feDistantLight', 'feDropShadow', 'feFlood', 'feFuncA', 'feFuncB', 'feFuncG', 'feFuncR',
	'feGaussianBlur', 'feImage', 'feMerge', 'feMergeNode', 'feMorphology', 'feOffset', 'fePointLight',
	'feSpecularLighting', 'feSpotLight', 'feTile', 'feTurbulence', 'filter', 'foreignObject', 'g', 'hatch', 'hatchpath',
	'image', 'line', 'linearGradient', 'marker', 'mask', 'mesh', 'meshgradient', 'meshpatch', 'meshrow', 'metadata',
	'mpath', 'path', 'pattern', 'polygon', 'polyline', 'radialGradient', 'rect', 'script', 'set', 'solidcolor', 'stop',
	'style', 'svg', 'switch', 'symbol', 'text', 'textPath', 'title', 'tspan', 'unknown', 'use', 'view'].forEach((tag) => {
		uiFactory.svg[tag] = (attributes, childElements, callback) => {
			return uiFactory.svg(tag, attributes, childElements, callback);
		};
	});

/** Conveniece Object */
if (!window.uif) {
	window.uif = uiFactory;
}
