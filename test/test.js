/* global uif lorem */

document.body.appendChild(uif.bs4.container('fluid').contents([
	uif.h1().contents([
		'Title ',
		uif.bs4.badge(['secondary', 'pill']).contents([10])
	]),
	uif.bs4.breadcrumb().contents([
		uif.a().properties({ href: '#' }).contents(['Home']),
		[
			uif.a().properties({ href: '#' }).contents(['Page']),
			uif.a().properties({ href: '#' }).contents(['Sub Page']),
			uif.span().contents([
				'Active Page ',
				uif.bs4.badge(['secondary', 'pill']).contents(100)
			])
		]
	]),
	uif.bs4.alert(['primary', 'dismissible']).contents(lorem()),
	uif.bs4.row().contents([
		uif.bs4.col(4).contents([
			uif.p().contents([
				lorem()
			])
		]),
		uif.bs4.col().contents([
			uif.p().contents([
				lorem()
			])
		])
	]),
	uif.bs4.row().contents([
		uif.bs4.col(4).contents([
			uif.p().contents([
				lorem()
			])
		]),
		uif.bs4.col().contents([
			uif.div().contents([
				uif.bs4.buttonToolbar().contents([
					uif.bs4.buttonGroup().properties({ class: 'mr-2' }).contents([
						uif.bs4.button(['primary']).contents('Button A'),
						uif.bs4.button(['primary']).contents('Button B')
					]),
					uif.bs4.buttonGroup().contents([
						uif.bs4.button(['secondary']).contents('Button A'),
						uif.bs4.button(['secondary']).contents('Button B')
					])
				])
			])
		])
	])
]));
