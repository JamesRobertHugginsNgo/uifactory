/* global uiFactory_PropertyDescriptors uiFactory */

uiFactory_PropertyDescriptors.cbk = {
	value(...args) {
		return this.callback(...args);
	}
};

uiFactory_PropertyDescriptors.attrs = {
	value(...args) {
		return this.renderAttributes(...args);
	}
};

uiFactory_PropertyDescriptors.cEls = {
	value(...args) {
		return this.renderChildElements(...args);
	}
};

/* exported uif */
const uif = uiFactory;
