/* global uif uiFactory */

window.uif = window.uif || {};

uif.form = function (config = {}, modifier = {}) {
	const { action, method, blocks, headingLevel = 1, data } = Object.assign(modifier, config);

	return uiFactory('form', { action, method }, [
		() => {
			if (blocks) {
				return blocks.map((block) => {
					const { type = 'htmlContent' } = block;

					return uif[type](block, { headingLevel, data });
				});
			}
		},

		uiFactory('button', { class: "btn btn-primary btn-lg" }, 'Submit')
	]);
};
