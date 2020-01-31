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
		Object.defineProperties(element, uiFactory.propertyDescriptors);
	}

	element.childElementsData = [...element.childNodes];

	return element.cbk(callback);
}

uiFactory.propertyDescriptors = {
	definedByUiFactoryPropertyDescriptors: {
		value: true
	},

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
	},

	cbk: {
		value(...args) {
			return this.callback(...args);
		}
	},

	attrs: {
		value(...args) {
			return this.renderAttributes(...args);
		}
	},

	cEls: {
		value(...args) {
			return this.renderChildElements(...args);
		}
	}
};

['a', 'abbr', 'address', 'area', 'article', 'aside', 'audio', 'b', 'base', 'bdi', 'bdo', 'blockquote', 'body', 'br',
	'button', 'canvas', 'caption', 'cite', 'code', 'col', 'colgroup', 'data', 'datalist', 'dd', 'del', 'details', 'dfn',
	'dialog', 'div', 'dl', 'dt', 'em', 'embed', 'fieldset', 'figure', 'footer', 'form', 'h1', 'h2', 'h3', 'h4', 'h5',
	'h6', 'head', 'header', 'hgroup', 'hr', 'html', 'i', 'iframe', 'img', 'input', 'ins', 'kbd', 'keygen', 'label',
	'legend', 'li', 'link', 'main', 'map', 'mark', 'menu', 'menuitem', 'meta', 'meter', 'nav', 'noscript', 'object',
	'ol', 'optgroup', 'option', 'output', 'p', 'param', 'pre', 'progress', 'q', 'rb', 'rp', 'rt', 'rtc', 'ruby', 's',
	'samp', 'script', 'section', 'select', 'small', 'source', 'span', 'strong', 'style', 'sub', 'summary', 'sup', 'table',
	'tbody', 'td', 'template', 'textarea', 'tfoot', 'th', 'thead', 'time', 'title', 'tr', 'track', 'u', 'ul', 'var',
	'video', 'wbr'].forEach((name) => uiFactory[name] = (callback) => uiFactory(name, callback));

uiFactory.lorem = () => {
	const paragraphs = [
		'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Phasellus gravida felis vitae mauris facilisis maximus. Integer pulvinar at diam ac pharetra. Donec eu nisi ornare, ultrices tellus sed, blandit magna. Donec molestie accumsan arcu non lacinia. Mauris mollis nulla ex, id suscipit elit dictum sit amet. Suspendisse tempor congue dui, at dictum quam eleifend eget. Maecenas sit amet lacus id erat pharetra pulvinar.',
		'Quisque rhoncus blandit nunc in dictum. Nunc elit tortor, ultricies ac turpis vel, ornare dignissim augue. Cras in ante sit amet sem aliquam porta. Quisque ut interdum orci. Cras condimentum felis tempor, eleifend lorem nec, rhoncus libero. Aenean ultricies felis sed nunc dapibus suscipit. Vestibulum laoreet, nibh ac scelerisque consectetur, sapien odio malesuada felis, quis lobortis justo turpis a sapien. Pellentesque consectetur volutpat ante, at tincidunt nisl porta ac. Donec eleifend imperdiet vulputate. Fusce ullamcorper ultrices euismod. Maecenas bibendum scelerisque arcu, et aliquam nulla consectetur ut. Class aptent taciti sociosqu ad litora torquent per conubia nostra, per inceptos himenaeos. Donec porta nibh sed risus scelerisque fringilla.',
		'Maecenas molestie nulla eu laoreet consequat. Sed sagittis blandit imperdiet. Vestibulum commodo urna vel purus sodales tincidunt. Phasellus in nulla vel nunc sodales dignissim quis quis nisi. Donec venenatis et nisi vel porttitor. Sed ut sollicitudin urna, vel aliquet ligula. In hac habitasse platea dictumst. Fusce quis urna diam. Donec tempor tristique dignissim. Nulla pharetra sit amet nibh id porta. Donec sagittis urna risus, in ultrices nisi fringilla et. Suspendisse potenti.',
		'Morbi vitae fringilla massa. Praesent luctus gravida magna, et ornare enim viverra sit amet. Donec risus ipsum, interdum non libero eget, feugiat placerat ante. Quisque semper elementum euismod. Donec sit amet enim lobortis, tempus sem vel, mollis elit. Maecenas eget dui arcu. Nunc a orci lorem.',
		'Phasellus non leo nunc. Ut id posuere orci. Mauris congue lectus sed sapien vulputate dignissim. Donec ac enim ac dui vestibulum fermentum. Nam dignissim lacinia lacus, tempor dignissim lacus mattis et. Quisque sed velit nisi. Vivamus pulvinar rhoncus justo, quis lobortis sem lobortis eu. Nam iaculis odio non velit semper feugiat. Pellentesque vehicula dui felis, nec malesuada lacus molestie rutrum. Nullam in lectus porta, egestas massa quis, mattis sem. Fusce mauris purus, faucibus et congue eu, iaculis sit amet leo. Maecenas et volutpat lorem, non eleifend est. Donec nec nisi eu erat finibus ultricies. Nullam eget convallis felis, eget viverra est. Pellentesque pellentesque feugiat augue.'
	];

	return paragraphs[uiFactory.lorem.index++ % paragraphs.length];
};
uiFactory.lorem.index = 0;

/* exported uif */
const uif = uiFactory;
