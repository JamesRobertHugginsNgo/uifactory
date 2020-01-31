/* global uiFactory_PropertyDescriptors uiFactory */

/* exported uifBootstrap */
function uifBootstrap(element, onRenderAttributes, onRenderChildElements) {
	if (onRenderAttributes) {
		onRenderAttributes(element);
		element.renderAttributes = function (attributes, callback) {
			return uiFactory_PropertyDescriptors.renderAttributes.value.call(this, attributes, () => {
				onRenderAttributes(element);
				callback && callback(this);
			});
		};
	}

	if (onRenderChildElements) {
		onRenderChildElements(element);
		element.renderChildElements = function (childElements, callback, reRender) {
			return uiFactory_PropertyDescriptors.renderChildElements.value.call(this, childElements, () => {
				onRenderChildElements(element);
				callback && callback(this);
			}, reRender);
		};
	}

	return element;
}

// LAYOUTS

uifBootstrap.container = (type) => {
	return uifBootstrap(uiFactory.div(), (element) => {
		element.classList.add(`container${type ? `-${type}` : ''}`);
	});
};

uifBootstrap.row = () => {
	return uifBootstrap(uiFactory.div(), (element) => {
		element.classList.add('row');
	});
};

uifBootstrap.col = (types) => {
	return uifBootstrap(uiFactory.div(), (element) => {
		if (types) {
			types = Array.isArray(types) ? types : [types];
			element.classList.add(...types.map((option) => `col-${option}`));
		} else {
			element.classList.add('col');
		}
	});
};

// COMPONENTS

uifBootstrap.alert = (type, dismissable = false) => {
	let onRenderChildElements;
	if (dismissable) {
		const btn = uiFactory.button()
			.attrs({ class: 'close', type: 'button', 'aria-label': 'Close', 'data-dismiss': 'alert' })
			.cEls(uiFactory.span().attrs({ 'aria-hidden': true }).cEls('&times;'));
		onRenderChildElements = (element) => {
			element.appendChild(btn);
		};
	}

	return uifBootstrap(uiFactory.div(), (element) => {
		element.classList.add('alert');
		type && element.classList.add(`alert-${type}`);

		dismissable && element.classList.add('alert-dismissible', 'fade', 'show');

		element.setAttribute('role', 'alert');
	}, onRenderChildElements);
};

uifBootstrap.badge = (type) => {
	return uifBootstrap(uiFactory.span(), (element) => {
		element.classList.add('badge');
		type && element.classList.add(`badge-${type}`);
	});
};

/* exported uifbs */
const uifbs = uifBootstrap;
