/* global uiFactory_PropertyDescriptors uiFactory */

uiFactory_PropertyDescriptors.attrs = {
	value(...args) {
		return this.renderAttributes(...args);
	}
};

uiFactory_PropertyDescriptors.els = {
	value(...args) {
		return this.renderChildElements(...args);
	}
};

uiFactory_PropertyDescriptors.cbk = {
	value(...args) {
		return this.callback(...args);
	}
};

/* exported uif */
const uif = uiFactory;
