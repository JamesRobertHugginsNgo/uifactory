/* global uif uiFactory */

window.uif = window.uif || {};

uif.textField__idCounter = 0;

uif.textField = function (config = {}, modifier = {}) {
	const {
		id = `textField__${uif.textField__idCounter++}`,
		bindTo,
		label,
		placeholder,
		value,
		helpText,
		data
	} = Object.assign(modifier, config);

	const ariaDescribedBy = helpText ? `${id}__helpText` : null;

	return uiFactory('div', { class: 'form-group' }, [
		() => {
			if (label) {
				return uiFactory('label', { for: id }, label);
			}
		},

		uiFactory('input', {
			id,
			class: 'form-control',
			type: 'text',
			value,
			placeholder,
			'aria-describedby': ariaDescribedBy
		}, null, (element) => {
			if (bindTo && data) {
				element.value = data[bindTo] || '';
				element.addEventListener('input', () => {
					data[bindTo] = element.value;
				});
			}
		}),

		() => {
			if (helpText) {
				return uiFactory('small', { id: ariaDescribedBy, class: 'form-text text-muted' }, helpText);
			}
		}
	]);
};
