/* global uif uifbs4 lorem */

const header = uif.header().properties({ class: 'bg-dark text-white' }).contents([
	uifbs4.container('fluid').contents([
		uifbs4.row().contents([
			uifbs4.col().contents([
				uif.div().properties({ class: 'p-3' }).contents([
					'HEADER'
				])
			]),
			uifbs4.col().contents([
				uif.div().properties({ class: 'p-3 text-right' }).contents([
					'MENU'
				])
			])
		])
	])
]);
document.body.appendChild(header);

const breadcrumb = uifbs4.breadcrumb().contents([
	uif.a().properties({ href: '#' }).contents(['Home']),
	[
		uif.a().properties({ href: '#' }).contents(['Page']),
		uif.a().properties({ href: '#' }).contents(['Sub Page']),
		uif.span().contents([
			'Active Page '
		])
	]
]).list.properties({ class: 'breadcrumb rounded-0' });
document.body.appendChild(breadcrumb);

const element = uifbs4.container().contents([
	uifbs4.row().contents([
		uifbs4.col(4).contents([
			uif.h2().contents([
				'HEADER'
			]),
			uif.p().contents([
				lorem()
			])
		]),
		uifbs4.col().contents([
			uif.h2().contents([
				'HEADER'
			]),
			uif.p().contents([
				lorem()
			]),
			uifbs4.buttonToolbar().contents([
				uifbs4.buttonGroup().properties({ class: 'mr-2' }).contents([
					uifbs4.button(['primary']).contents('Button A'),
					uifbs4.button(['primary']).contents('Button B')
				]),
				uifbs4.buttonGroup().contents([
					uifbs4.button(['secondary']).contents('Button A'),
					uifbs4.button(['secondary']).contents('Button B')
				])
			])
		])
	])
]);
document.body.appendChild(element);
