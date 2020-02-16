/* global uiFactory uiFactory__customize */

/* exported uifBootstrap4 */
const uifBootstrap4 = {};

/* exported uifbs4 */
const uifbs4 = window.uifBs4 || uifBootstrap4;

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

uifBootstrap4.container = function (...args) {
	const { element, types, callback, setAfterProperties } = uiFactory__customize('div', ...args);

	setAfterProperties(function () {
		if (types) {
			element.classList.add(...types.map((type) => `container-${type}`));
		} else {
			element.classList.add('container');
		}
	});

	return element.callback(callback);
};

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

uifBootstrap4.row = function (...args) {
	const { element, callback, setAfterProperties } = uiFactory__customize('div', ...args);

	setAfterProperties(function () {
		element.classList.add('row');
	});

	return element.callback(callback);
};

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

uifBootstrap4.col = function (...args) {
	const { element, types, callback, setAfterProperties } = uiFactory__customize('div', ...args);

	setAfterProperties(function () {
		element.classList.add('col');
		if (types) {
			element.classList.add(...types.map((type) => `col-${type}`));
		}
	});

	return element.callback(callback);
};

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

uifBootstrap4.breadcrumb = function (...args) {
	const { element, callback, setAfterContents } = uiFactory__customize('div', ...args);

	element.properties({ 'aria-label': 'breadcrumb' }).contents([
		uiFactory.ol(function (el) {
			element.list = el;
			element.list.end = element;
		}).properties({ class: 'breadcrumb' })
	]);

	element.contents = function (...args) {
		return element.list.contents(...args).end;
	};

	setAfterContents(function () {
		element.list.contents([...element.list.childNodes].map((item, index, array) => {
			return uiFactory.li().properties({
				class: [
					'breadcrumb-item',
					index === array.length - 1 ? 'active' : null
				].filter((value) => value).join(' ')
			}).contents(item);
		}));
	});

	return element.callback(callback);
};

////////////////////////////////////////////////////////////////////////////////

uifBootstrap4.button = function (...args) {
	const defaultButton = uiFactory('button').properties({ type: 'button' });
	const { element, types, callback, setAfterProperties } = uiFactory__customize(defaultButton, ...args);

	setAfterProperties(function () {
		element.classList.add('btn');
		if (types) {
			element.classList.add(...types.map((type) => `btn-${type}`));
		}
	});

	return element.callback(callback);
};

////////////////////////////////////////////////////////////////////////////////

uifBootstrap4.buttonGroup = function (label, ...args) {
	const { element, callback, setAfterProperties } = uiFactory__customize('div', ...args);

	element.properties({ role: 'group', 'aria-label': label });

	setAfterProperties(function () {
		element.classList.add('btn-group');
	});

	return element.callback(callback);
};

////////////////////////////////////////////////////////////////////////////////

uifBootstrap4.buttonToolbar = function (label, ...args) {
	const { element, callback, setAfterProperties } = uiFactory__customize('div', ...args);

	element.properties({ role: 'toolbar', 'aria-label': label });

	setAfterProperties(function () {
		element.classList.add('btn-toolbar');
	});

	return element.callback(callback);
};
