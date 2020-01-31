const uiFactory_PropertyDescriptors = {
	definedByUiFactoryPropertyDescriptors: { value: true },

	attributesData: { writable: true },
	childElementsData: { writable: true },

	callback: {
		value(callback) {
			callback && callback(this);
			return this;
		},
		writable: true
	},

	renderAttributes: {
		value(attributes, callback) {
			this.attributesData = attributes;

			const renderLoop = (value, name, attributes) => {

				// PROMISE VALUE
				if (value instanceof Promise) {
					return value.then((value) => renderLoop(value, name));
				}

				// FUNCTION VALUE
				if (typeof value === 'function') {
					return renderLoop(value(this), name);
				}

				// ARRAY VALUE
				if (Array.isArray(value)) {
					const tempAttributes = {};
					const promises = value
						.map((value, index) => {
							tempAttributes[index] = true;
							return renderLoop(value, index, tempAttributes);
						})
						.filter((promise) => promise instanceof Promise);
					if (attributes && name && Object.keys(tempAttributes).length === 0) {
						delete attributes[name];
					}
					return promises.length > 0 && Promise.all(promises);
				}

				// OBJECT VALUE
				if (typeof value === 'object' && value !== null) {
					const promises = Object.keys(value)
						.map((key) => renderLoop(value[key], key, value))
						.filter((promise) => promise instanceof Promise);
					if (attributes && name && Object.keys(value).length === 0) {
						delete attributes[name];
					}
					return promises.length > 0 && Promise.all(promises);
				}

				// KEY + VALUE
				if (name) {
					if (value == null) {
						this.removeAttribute(name);
					} else {
						this.setAttribute(name, value);
					}

					if (attributes) {
						delete attributes[name];
					}
				}
			};

			const result = renderLoop(this.attributesData);
			if (callback) {
				if (result instanceof Promise) {
					result.then(() => callback(this));
				} else {
					callback(this);
				}
			}

			return this;
		},
		writable: true
	},

	renderChildElements: {
		value(childElements, callback, reRender = false) {
			this.childElementsData = childElements;

			const renderLoop = (element, placeholder = this.appendChild(document.createTextNode(''))) => {

				// PROMISE VALUE
				if (element instanceof Promise) {
					return element.then((value) => renderLoop(value, placeholder));
				}

				// FUNCTION VALUE
				if (typeof element === 'function') {
					return renderLoop(element(this), placeholder);
				}

				// ARRAY VALUE
				if (Array.isArray(element)) {
					const promises = element
						.map((value) => renderLoop(value, this.insertBefore(document.createTextNode(''), placeholder)))
						.filter((promise) => promise instanceof Promise);
					this.removeChild(placeholder);
					return promises.length > 0 && Promise.all(promises);
				}

				// OBJECT VALUE
				if (typeof element === 'object' && element !== null && !(element instanceof Element) && !(element instanceof Text)) {
					const promises = Object.keys(element)
						.map((key) => renderLoop(element[key], this.insertBefore(document.createTextNode(''), placeholder)))
						.filter((promise) => promise instanceof Promise);
					this.removeChild(placeholder);
					return promises.length > 0 && Promise.all(promises);
				}

				// BOOLEAN, NUMBER OR STRING VALUE
				if (typeof element === 'boolean' || typeof element === 'number' || typeof element === 'string') {
					const wrapper = document.createElement('div');
					wrapper.innerHTML = String(element);
					return renderLoop([...wrapper.childNodes], placeholder);
				}

				// ELEMENT / TEXT VALUE
				if (element instanceof Element || element instanceof Text) {
					this.insertBefore(element, placeholder);
				}

				// REMOVE PLACEHOLDER
				this.removeChild(placeholder);

				if (element instanceof Element && element.definedByUiFactoryPropertyDescriptors) {
					return reRender && element.render();
				}
			};

			while (this.firstChild) {
				this.removeChild(this.firstChild);
			}

			const result = renderLoop(this.childElementsData);
			if (callback) {
				if (result instanceof Promise) {
					result.then(() => callback(this));
				} else {
					callback(this);
				}
			}

			return this;
		},
		writable: true
	},

	render: {
		value(callback) {
			Promise.all([
				new Promise((resolve) => this.renderAttributes(this.attributesData, resolve)),
				new Promise((resolve) => this.renderChildElements(this.childElementsData, resolve, true))
			]).then(() => callback && callback(this));

			return this;
		},
		writable: true
	}
};

/* exported uiFactory */
function uiFactory(...args) {
	let element, callback;
	if (args[0] instanceof Element) {
		element = args[0];
		callback = args[1];
	} else if (typeof args[1] === 'string') {
		element = document.createElementNS(args[0], args[1]);
		callback = args[2];
	} else {
		element = document.createElement(args[0]);
		callback = args[1];
	}

	if (!element.definedByUiFactoryPropertyDescriptors) {
		Object.defineProperties(element, uiFactory_PropertyDescriptors);
	}

	element.childElementsData = [...element.childNodes];

	return element.cbk(callback);
}








