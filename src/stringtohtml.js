/* global uiFactory */

/* exported stringToHtml */
function stringToHtml(str) {
	const element = document.createElement('div');
	element.innerHTML = str;
	return [...element.childNodes].map((element) => {
		if (element instanceof HTMLElement) {
			const childElements = stringToHtml(element.innerHTML);
			return uiFactory(element, null, childElements);
		}

		return element;
	});
}
