"use strict";

/* global uiFactory_PropertyDescriptors uiFactory */
uiFactory_PropertyDescriptors.attrs = {
  value: function value() {
    return this.renderAttributes.apply(this, arguments);
  }
};
uiFactory_PropertyDescriptors.els = {
  value: function value() {
    return this.renderChildElements.apply(this, arguments);
  }
};
uiFactory_PropertyDescriptors.cbk = {
  value: function value() {
    return this.callback.apply(this, arguments);
  }
};
/* exported uif */

var uif = uiFactory;