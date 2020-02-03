/* global $ uiFactory */

uiFactory.bootstrap4 = function (...args) {
	let element, types, callback;

	[element, ...args] = args;
	element = uiFactory(element);

	// args = [element, ...]
	if (args[0] instanceof Element) {
		[element, ...args] = args;
		element = uiFactory(element);
	}
	// args = [!function, ...]
	if (typeof args[0] !== 'function') {
		[types, ...args] = args;
		if (types !== undefined && !Array.isArray(types)) {
			types = [types];
		}
	}
	// args = [function, ...]
	if (typeof args[0] === 'function') {
		[callback, ...args] = args;
	}

	function setAfterProperties(afterProperties) {
		afterProperties();
		element.properties = ((properties) => function (...args) {
			const result = properties.call(this, ...args);
			if (result instanceof Promise) {
				result.then(() => afterProperties());
			} else {
				afterProperties();
			}
			return result;
		})(element.properties);
	}

	function setAfterContents(afterContents) {
		afterContents();
		element.contents = ((contents) => function (...args) {
			const result = contents.call(this, ...args);
			if (result instanceof Promise) {
				result.then(() => afterContents());
			} else {
				afterContents();
			}
			return result;
		})(element.contents);
	}

	return { element, types, callback, setAfterProperties, setAfterContents };
};

////////////////////////////////////////////////////////////////////////////////

uiFactory.bootstrap4.container = (...args) => {
	const { element, types, callback, setAfterProperties } = uiFactory.bootstrap4('div', ...args);

	setAfterProperties(() => {
		if (types) {
			element.classList.add(...types.map((type) => `container-${type}`));
		} else {
			element.classList.add('container');
		}
	});

	return element.callback(callback);
};

////////////////////////////////////////////////////////////////////////////////

uiFactory.bootstrap4.row = (...args) => {
	const { element, callback, setAfterProperties } = uiFactory.bootstrap4('div', ...args);

	setAfterProperties(() => {
		element.classList.add('row');
	});

	return element.callback(callback);
};

////////////////////////////////////////////////////////////////////////////////

uiFactory.bootstrap4.col = (...args) => {
	const { element, types, callback, setAfterProperties } = uiFactory.bootstrap4('div', ...args);

	setAfterProperties(() => {
		element.classList.add('col');
		if (types) {
			element.classList.add(...types.map((type) => `col-${type}`));
		}
	});

	return element.callback(callback);
};

////////////////////////////////////////////////////////////////////////////////

uiFactory.bootstrap4.alert = (...args) => {
	const { element, types, callback, setAfterProperties, setAfterContents } = uiFactory.bootstrap4('div', ...args);

	element.properties({ role: 'alert' });

	// Dismissible
	if (types && types.indexOf('dismissible') !== -1) {
		setAfterProperties(() => {
			element.classList.add('alert', ...types.map((type) => `alert-${type}`), 'fade', 'show');
		});

		const dismissButton = uiFactory.button()
			.properties({
				type: 'button',
				class: 'close',
				'data-dismiss': 'alert',
				'aria-label': 'Close'
			})
			.contents([
				uiFactory.span().properties({ 'aria-hidden': 'true' }).contents([
					'&times;'
				])
			]);
		setAfterContents(() => {
			element.appendChild(dismissButton);
		});

		$(element).on('close.bs.alert', () => {
			if (element.parentNode && element.parentNode.definedByUiFactoryPropertyDescriptors) {
				const index = element.parentNode._contents.indexOf(element);
				if (index !== -1) {
					element.parentNode._contents.splice(index, 1);
				}
			}
		});
	}
	// Not dimissable
	else {
		setAfterProperties(() => {
			element.classList.add('alert');
			if (types) {
				element.classList.add(...types.map((type) => `alert-${type}`));
			}
		});
	}

	return element.callback(callback);
};

////////////////////////////////////////////////////////////////////////////////

uiFactory.bootstrap4.badge = (...args) => {
	const { element, types, callback, setAfterProperties } = uiFactory.bootstrap4('div', ...args);

	setAfterProperties(() => {
		element.classList.add('badge');
		if (types) {
			element.classList.add(...types.map((type) => `badge-${type}`));
		}
	});

	return element.callback(callback);
};

////////////////////////////////////////////////////////////////////////////////

uiFactory.bootstrap4.breadcrumb = (...args) => {
	const { element, callback, setAfterContents } = uiFactory.bootstrap4('div', ...args);

	element.properties({ 'aria-label': 'breadcrumb' }).contents([
		uiFactory.ol((el) => element.list = el).properties({ class: 'breadcrumb' })
	]);

	element.contents = function (...args) {
		return element.list.contents(...args);
	};

	setAfterContents(() => {
		const breadcrumbItems = [];

		while (element.list.firstChild) {
			breadcrumbItems.push(element.list.firstChild);
			element.list.removeChild(element.list.firstChild);
		}

		const length = breadcrumbItems.length;
		element.list.contents(breadcrumbItems.map((breadcrumbItem, index) => {
			return uiFactory.li().properties({
				class: [
					'breadcrumb-item',
					index === length - 1 ? 'active' : null
				].filter((value) => value).join(' ')
			}).contents(breadcrumbItem);
		}));
	});

	return element.callback(callback);
};

////////////////////////////////////////////////////////////////////////////////

uiFactory.bootstrap4.button = (...args) => {
	const defaultButton = uiFactory('button').properties({ type: 'button' });
	const { element, types, callback, setAfterProperties } = uiFactory.bootstrap4(defaultButton, ...args);

	setAfterProperties(() => {
		element.classList.add('btn');
		if (types) {
			element.classList.add(...types.map((type) => `btn-${type}`));
		}
	});

	return element.callback(callback);
};

////////////////////////////////////////////////////////////////////////////////

uiFactory.bootstrap4.buttonGroup = (label, ...args) => {
	const { element, callback, setAfterProperties } = uiFactory.bootstrap4('div', ...args);

	element.properties({ role: 'group', 'aria-label': label });

	setAfterProperties(() => {
		element.classList.add('btn-group');
	});

	return element.callback(callback);
};

////////////////////////////////////////////////////////////////////////////////

uiFactory.bootstrap4.buttonToolbar = (label, ...args) => {
	const { element, callback, setAfterProperties } = uiFactory.bootstrap4('div', ...args);

	element.properties({ role: 'toolbar', 'aria-label': label });

	setAfterProperties(() => {
		element.classList.add('btn-toolbar');
	});

	return element.callback(callback);
};

////////////////////////////////////////////////////////////////////////////////

/* exported uifbs4 */
uiFactory.bs4 = uiFactory.bs4 || uiFactory.bootstrap4;
