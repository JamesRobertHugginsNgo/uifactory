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
		value(callback, chainCallback = true) {
			const renderAttributes = (attributes, key, source) => {
				if (attributes === null) {
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

				if (childElements === null) {
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

					if (childElements.definedByUifPropertyDescriptors) {
						return new Promise((resolve) => {
							childElements.render(resolve, chainCallback);
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

				if (typeof childElements === 'string') {
					const textNode = this.insertBefore(document.createTextNode(childElements), placeholder);

					if (source && key) {
						source[key] = textNode;
					}

					return renderChildElements(textNode, placeholder, source, key);
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
function uiFactory(element, attributes, childElements, callback) {
	if (typeof element === 'string') {
		element = document.createElement(element);
	}

	if (!element.definedByUiFactoryPropertyDescriptors) {
		Object.defineProperties(element, uiFactoryPropertyDescriptors);
	}

	element.uiFactoryAttributes = attributes;
	element.uiFactoryChildElements = childElements;

	return element.render(callback, false);
}
