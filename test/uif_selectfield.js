/* global uif uiFactory */

window.uif = window.uif || {};

uif.selectField__idCounter = 0;

uif.selectField = function (config = {}, modifier = {}) {
	const {
		id = `selectField__${uif.textField__idCounter++}`,
		bindTo,
		label,
		choices = [],
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

		uiFactory('select', {
			id,
			class: 'form-control',
			'aria-describedby': ariaDescribedBy
		}, () => {
			return choices.map((choice) => {
				const label = choice.label || choice.value || choice;
				const choiceValue = choice.value || choice.label || choice;
				const selected = choiceValue === value ? true : null;
				return uiFactory('option', { value: choiceValue, selected }, label);
			});
		}, (element) => {
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
