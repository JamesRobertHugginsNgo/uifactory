/* global uif uifbs */

const element = uifbs.container().cEls([
	uif.h1().cEls('Title'),
	uifbs.alert('primary', true).cEls([
		uif.p().attrs({ class: 'mb-0' }).cEls([
			uif.lorem()
		])
	]),
	uifbs.row().cEls([
		uifbs.col().cEls([
			uif.h2().cEls([
				'Column 1 ',
				uifbs.badge('secondary').cEls([
					'New'
				])
			]),
			uif.p().cEls(`${uif.lorem().substring(0, 200)}.`),
			uif.p().cEls(`${uif.lorem().substring(0, 200)}.`)
		]),
		uifbs.col().cEls([
			uif.h2().cEls('Column 2'),
			uif.p().cEls(`${uif.lorem().substring(0, 500)}.`)
		]),
		uifbs.col().cEls([
			uif.h2().cEls('Column 3'),
			uif.p().cEls(`${uif.lorem().substring(0, 200)}.`),
			uif.p().cEls(`${uif.lorem().substring(0, 200)}.`)
		])
	])
]);

document.body.appendChild(element);
