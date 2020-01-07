/* global uif uiFactory */

window.uif = window.uif || {};

uif.page = function (config = {}, modifier = {}) {
	const { title, blocks, headingLevel = 1, data } = Object.assign(modifier, config);

	return uiFactory('div', null, [
		() => {
			if (title) {
				return uiFactory(`h${headingLevel}`, null, title);
			}
		},

		() => {
			if (blocks) {
				return blocks.map((block) => {
					const { type = 'htmlContent' } = block;

					const nextHeadingLevel = title ? headingLevel + 1 : headingLevel;
					return uif[type](block, { headingLevel: nextHeadingLevel, data });
				});
			}
		}
	]);
};
