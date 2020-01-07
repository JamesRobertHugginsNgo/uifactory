/* global uif */

window.uif = window.uif || {};

uif.app = (config = {}) => {
	const { type = 'page' } = config;
	return uif[type](config);
};
