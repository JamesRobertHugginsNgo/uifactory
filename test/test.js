/* global uif */

const textFieldData = {};

const config = {
	type: 'page',

	title: 'PAGE TITLE',
	data: textFieldData,

	blocks: [
		{
			type: 'row',

			blocks: [
				{
					type: 'card',
					colSpan: 9,

					title: 'CARD TITLE',

					blocks: [
						{
							type: 'row',

							blocks: [
								{
									type: 'htmlContent',
									html: '<p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Maecenas a quam sit amet risus lacinia porttitor vel quis libero. Integer imperdiet, sem nec placerat eleifend, turpis odio suscipit magna, nec porttitor lorem nisl a est. Proin a risus vel lorem condimentum dapibus eu in lectus. In non urna egestas, pharetra sapien ac, suscipit ex. Mauris sagittis bibendum consequat. Maecenas neque mi, feugiat eget orci at, pretium ornare risus. In nec iaculis velit. Etiam euismod ut mauris ut rhoncus. Aenean suscipit feugiat elit, non porttitor elit vulputate ut. Pellentesque finibus eros eget libero laoreet, at ultricies leo vehicula. Suspendisse id metus varius, vehicula ipsum eget, rhoncus risus. Mauris semper lobortis mauris in placerat.</p>'
								},
								{
									type: 'htmlContent',
									html: '<p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Maecenas a quam sit amet risus lacinia porttitor vel quis libero. Integer imperdiet, sem nec placerat eleifend, turpis odio suscipit magna, nec porttitor lorem nisl a est. Proin a risus vel lorem condimentum dapibus eu in lectus. In non urna egestas, pharetra sapien ac, suscipit ex. Mauris sagittis bibendum consequat. Maecenas neque mi, feugiat eget orci at, pretium ornare risus. In nec iaculis velit. Etiam euismod ut mauris ut rhoncus. Aenean suscipit feugiat elit, non porttitor elit vulputate ut. Pellentesque finibus eros eget libero laoreet, at ultricies leo vehicula. Suspendisse id metus varius, vehicula ipsum eget, rhoncus risus. Mauris semper lobortis mauris in placerat.</p>'
								}
							]
						}
					]
				},
				{
					type: 'section',

					title: 'SECTION TITLE',

					blocks: [
						{
							type: 'htmlContent',
							html: '<p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Maecenas a quam sit amet risus lacinia porttitor vel quis libero. Integer imperdiet, sem nec placerat eleifend, turpis odio suscipit magna, nec porttitor lorem nisl a est. Proin a risus vel lorem condimentum dapibus eu in lectus. In non urna egestas, pharetra sapien ac, suscipit ex. Mauris sagittis bibendum consequat. Maecenas neque mi, feugiat eget orci at, pretium ornare risus. In nec iaculis velit. Etiam euismod ut mauris ut rhoncus. Aenean suscipit feugiat elit, non porttitor elit vulputate ut. Pellentesque finibus eros eget libero laoreet, at ultricies leo vehicula. Suspendisse id metus varius, vehicula ipsum eget, rhoncus risus. Mauris semper lobortis mauris in placerat.</p>'
						}
					]
				}
			]
		},
		{
			type: 'form',

			action: '#',
			method: 'GET',

			blocks: [
				{
					type: 'section',

					title: 'SECTION TITLE',

					blocks: [
						{
							type: 'card',

							title: 'CARD TITLE',

							blocks: [
								{
									type: 'row',

									data: {
										textfield: 123,
										textareafield: 456,
										selectfield: '123'
									},

									blocks: [
										{
											type: 'textField',

											label: 'Text Field',
											placeholder: 'Text',
											bindTo: 'textfield',
											helpText: 'help text'
										},
										{
											type: 'textareaField',

											label: 'Text Area Field',
											placeholder: 'Text',
											bindTo: 'textareafield',
											helpText: 'help text',
											rows: 10
										},
										{
											type: 'selectField',

											label: 'Text Field',
											choices: ['123', '345', '678'],
											value: '678',
											bindTo: 'selectfield',
											helpText: 'help text'
										},
									]
								}
							]
						}
					]
				}
			]
		}
	]
};

const element = uif.app(config);
document.querySelector('.container').appendChild(element);
