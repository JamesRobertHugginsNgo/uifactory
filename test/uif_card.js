/* global uif uiFactory */

window.uif = window.uif || {};

uif.card = function (config = {}, modifier = {}) {
	const { title, blocks, headingLevel = 1, data } = Object.assign(modifier, config);

	return uiFactory('div', { class: 'card mb-3' }, [
		() => {
			if (title) {
				return uiFactory(`h${headingLevel}`, { class: 'h5 card-header' }, title);
			}
		},

		uiFactory('div', { class: 'card-body' }, () => {
			if (blocks) {
				return blocks.map((block) => {
					const { type = 'htmlContent' } = block;

					const nextHeadingLevel = title ? headingLevel + 1 : headingLevel;
					return uif[type](block, { headingLevel: nextHeadingLevel, data });
				});
			}
		})
	]);
};
