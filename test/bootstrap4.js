/* global uiFactory */

/* exported uifBootstrap4 */
const uifBootstrap4 = {};

/* exported uifbs4 */
const uifbs4 = window.uifbs4 || uifBootstrap4;

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

uifBootstrap4.container = function (...args) {
	const { element, types, callback, setAfterProperties } = uiFactory.customize('div', ...args);

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
	const { element, callback, setAfterProperties } = uiFactory.customize('div', ...args);

	setAfterProperties(function () {
		element.classList.add('row');
	});

	return element.callback(callback);
};

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

uifBootstrap4.col = function (...args) {
	const { element, types, callback, setAfterProperties } = uiFactory.customize('div', ...args);

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
	const listElement = uiFactory.ol();
	const { setAfterProperties, setAfterContents } = uiFactory.customize(listElement, ...args);
	setAfterProperties(function () {
		listElement.classList.add('breadcrumb');
	});
	setAfterContents(function (init) {
		if (init) {
			return;
		}

		[...listElement.childNodes].forEach((item, index, array) => {
			const listItem = uiFactory.li().properties({
				class: [
					'breadcrumb-item',
					index === array.length - 1 ? 'active' : null
				].filter((value) => value).join(' ')
			});
			item.parentNode.insertBefore(listItem, item);
			listItem.contents(item);
		});
	});

	const { element, callback } = uiFactory.customize('div', ...args);

	listElement.end = element;
	element.list = listElement;

	element.properties({ 'aria-label': 'breadcrumb' }).contents([
		listElement
	]);

	element.contents = function (contents, callback) {
		return listElement.contents(contents, callback).end;
	};

	return element.callback(callback);
};

////////////////////////////////////////////////////////////////////////////////

uifBootstrap4.button = function (...args) {
	const defaultButton = uiFactory('button').properties({ type: 'button' });
	const { element, types, callback, setAfterProperties } = uiFactory.customize(defaultButton, ...args);

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
	const { element, callback, setAfterProperties } = uiFactory.customize('div', ...args);

	element.properties({ role: 'group', 'aria-label': label });

	setAfterProperties(function () {
		element.classList.add('btn-group');
	});

	return element.callback(callback);
};

////////////////////////////////////////////////////////////////////////////////

uifBootstrap4.buttonToolbar = function (label, ...args) {
	const { element, callback, setAfterProperties } = uiFactory.customize('div', ...args);

	element.properties({ role: 'toolbar', 'aria-label': label });

	setAfterProperties(function () {
		element.classList.add('btn-toolbar');
	});

	return element.callback(callback);
};
