/* global uif uiFactory */

window.uif = window.uif || {};

uif.textareaField__idCounter = 0;

uif.textareaField = function (config = {}, modifier = {}) {
	const {
		id = `textareaField__${uif.textField__idCounter++}`,
		bindTo,
		label,
		placeholder,
		value,
		helpText,
		rows,
		data
	} = Object.assign(modifier, config);

	const ariaDescribedBy = helpText ? `${id}__helpText` : null;

	return uiFactory('div', { class: 'form-group' }, [
		() => {
			if (label) {
				return uiFactory('label', { for: id }, label);
			}
		},

		uiFactory('textarea', {
			id,
			class: 'form-control',
			placeholder,
			'aria-describedby': ariaDescribedBy,
			rows
		}, value, (element) => {
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
