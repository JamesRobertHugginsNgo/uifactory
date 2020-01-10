/* exported stringToHtml */
/**
 * Create child elements for uiFactory.
 * @param {string} str
 * @returns {[HTMLElement|Text]}
 */
function stringToHtml(str) {
	const element = document.createElement('div');
	element.innerHTML = str;
	return [...element.childNodes].map((element) => {
		if (element instanceof HTMLElement) {
			return uiFactory(element);
		}
		return element;
	});
}

/** Object descriptors to be used on HTMLElements. */
const uiFactoryPropertyDescriptors = {
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

				if (childElements instanceof HTMLElement || childElements instanceof Text) {
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
					childElements = stringToHtml(childElements);
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
		Object.defineProperties(element, uiFactoryPropertyDescriptors);
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
