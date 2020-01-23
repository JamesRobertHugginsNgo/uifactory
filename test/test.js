/* global uif */

const container = (childElements) => {
	return uif.div({ class: 'container' }, childElements);
};

const aboutContent = `Add some information about the album below, the author, or any other background context. Make it a
	few sentences long so folks can pick up some informative tidbits. Then, link them off to some social networking sites
	or contact information.`;

const contacts = [
	{ text: 'Facebook', link: '#' },
	{ text: 'Twitter', link: '#' },
	{ text: 'Instagram', link: '#' },
	{ text: 'Snapchat', link: '#' },
	{ text: 'Youtube', link: '#' }
];

const element = uif.div({}, [
	uif.header({}, [
		uif.div({ class: 'bg-dark collapse', id: 'navbarHeader' }, [
			container([
				uif.div({ class: 'row' }, [
					uif.div({ class: 'col-sm-8 col-md-7 py-4' }, [
						uif.h4({ class: 'text-white' }, [
							'About'
						]),
						uif.p({ class: 'text-muted' }, [
							aboutContent
						])
					]),
					uif.div({ class: 'col-sm-4 offset-md-1 py-4' }, [
						uif.h4({ class: 'text-white' }, [
							'Contact'
						]),
						uif.ul({ class: 'list-unstyled' }, [
							contacts.map((contact) => {
								return uif.li({}, uif.a({ href: contact.link, class: 'text-white' }, [
									contact.text
								]));
							})
						])
					])
				])
			])
		]),
		uif.div({ class: 'navbar navbar-dark bg-dark shadow-sm' }, [
			uif.div({ class: 'container d-flex justify-content-between' }, [
				uif.a({ class: 'navbar-brand d-flex align-items-center', href: '#' }, [
					uif.svg.svg({ xmlns: 'http://www.w3.org/2000/svg', width: 20, height: 20, fill: 'none', stroke: 'currentColor', 'stroke-linecap': 'round', 'stroke-linejoin': 'round', 'stroke-width': 2, 'aria-hidden': true, class: 'mr-2', viewBox: '0 0 24 24', focusable: 'false' }, [
						uif.svg.path({ d: 'M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z' }),
						uif.svg.circle({ cx: 12, cy: 13, r: 4 })
					]),
					uif.strong({}, [
						'Album'
					])
				]),
				uif.button({ class: 'navbar-toggler collapsed', type: 'button', 'data-toggle': 'collapse', 'data-target': '#navbarHeader', 'aria-controls': 'navbarHeader', 'aria-expanded': false, 'aria-label': 'Toggle navigation' }, [
					uif.span({ class: 'navbar-toggler-icon' })
				])
			])
		])
	]),
	uif.main({ role: 'main' }, [
		uif.section({ class: 'jumbotron text-center mb-0' }, [
			container([
				uif.h1({}, [
					'Album Example'
				]),
				uif.p({ class: 'lead text-muted' }, [
					'Something short and leading about the collection below—its contents, the creator, etc. Make it short and sweet, but not too short so folks don’t simply skip over it entirely.'
				]),
				uif.p({}, [
					uif.a({ class: 'btn btn-primary my-2', href: '#' }, [
						'Main call to action'
					]),
					' ',
					uif.a({ class: 'btn btn-secondary my-2', href: '#' }, [
						'Secondary action'
					])
				])
			])
		]),
		uif.div({ class: 'album py-5 bg-light' }, [
			container([
				uif.div({ class: 'row' }, [
					uif.div({ class: 'col-md-4' }, [
						uif.div({ class: 'card mb-4 shadow-sm' }, [
							uif.svg.svg({ class: 'bd-placeholder-img card-img-top', width: '100%', height: '225', xmlns: 'http://www.w3.org/2000/svg', preserveAspectRatio: 'xMidYMid slice', focusable: false, role: 'img', 'aria-label': 'Placeholder: Thumbnail' }, [
								uif.svg.title({}, [
									'Placeholder'
								]),
								uif.svg.rect({ width: '100%', height: '100%', fill: '#55595c' }, [
									'Placeholder'
								]),
								uif.svg.text({ x: '50%', y: '50%', fill: '#eceeef', dy: '.3em' }, [
									'Thumbnail'
								])
							])
						])
					]),
					uif.div({ class: 'col-md-4' }, [
						uif.div({ class: 'card mb-4 shadow-sm' }, [
							uif.svg.svg({ class: 'bd-placeholder-img card-img-top', width: '100%', height: '225', xmlns: 'http://www.w3.org/2000/svg', preserveAspectRatio: 'xMidYMid slice', focusable: false, role: 'img', 'aria-label': 'Placeholder: Thumbnail' }, [
								uif.svg.title({}, [
									'Placeholder'
								]),
								uif.svg.rect({ width: '100%', height: '100%', fill: '#55595c' }, [
									'Placeholder'
								]),
								uif.svg.text({ x: '50%', y: '50%', fill: '#eceeef', dy: '.3em' }, [
									'Thumbnail'
								])
							])
						])
					]),
					uif.div({ class: 'col-md-4' }, [
						uif.div({ class: 'card mb-4 shadow-sm' }, [
							uif.svg.svg({ class: 'bd-placeholder-img card-img-top', width: '100%', height: '225', xmlns: 'http://www.w3.org/2000/svg', preserveAspectRatio: 'xMidYMid slice', focusable: false, role: 'img', 'aria-label': 'Placeholder: Thumbnail' }, [
								uif.svg.title({}, [
									'Placeholder'
								]),
								uif.svg.rect({ width: '100%', height: '100%', fill: '#55595c' }, [
									'Placeholder'
								]),
								uif.svg.text({ x: '50%', y: '50%', fill: '#eceeef', dy: '.3em' }, [
									'Thumbnail'
								])
							])
						])
					])
				])
			])
		])
	]),
	uif.footer({ class: 'text-muted pt-5 pb-5' }, [
		container([
			uif.p({ class: 'float-right' }, [
				uif.a({ href: '#' }, [
					'Back to top'
				])
			]),
			uif.p({}, [
				'Album example is © Bootstrap, but please download and customize it for yourself!'
			]),
			uif.p({}, [
				'New to Bootstrap? ',
				uif.a({ href: '#' }, [
					'Visit the homepage'
				]),
				' or read our ',
				uif.a({ href: '#' }, [
					'getting started guide'
				]),
				'.'
			])
		])
	])
]);

document.body.appendChild(element);
