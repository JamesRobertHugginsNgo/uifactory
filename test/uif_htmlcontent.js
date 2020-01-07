/* global stringToHtml uif */

window.uif = window.uif || {};

uif.htmlContent = function (config = {}, modifier = {}) {
	const { html } = Object.assign(modifier, config);

	return stringToHtml(html);
};
