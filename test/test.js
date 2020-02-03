/* global uif */

let element;
uif(document.body).contents([
	uif.div((el) => element = el)
		.events({ click: (event, el) => { console.log('CLICK', el); } })
		.properties({ class: 'className' })
		.contents([
			...element.childNodes,
			'TEST ',
			uif('strong').contents('TEST')
		])
]);

console.log('ELEMENT', element);
