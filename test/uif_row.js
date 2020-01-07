/* global uif uiFactory */

window.uif = window.uif || {};

uif.row = function (config = {}, modifier = {}) {
	const { blocks, headingLevel = 1, data } = Object.assign(modifier, config);

	return uiFactory('div', { class: 'row' }, () => {
		if (blocks) {
			return blocks.map((block) => {
				const { type = 'htmlContent', colSpan } = block;

				const childElements = uif[type](block, { headingLevel, data });
				return uiFactory('div', { class: `col${colSpan ? `-${colSpan}` : ''}` }, childElements);
			});
		}
	});
};
