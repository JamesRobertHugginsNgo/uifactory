/* global uiFactory */

let uiFactory_lorem_index = 0;

uiFactory.lorem = () => {
	const paragraphs = [
		'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Phasellus gravida felis vitae mauris facilisis maximus. Integer pulvinar at diam ac pharetra. Donec eu nisi ornare, ultrices tellus sed, blandit magna. Donec molestie accumsan arcu non lacinia. Mauris mollis nulla ex, id suscipit elit dictum sit amet. Suspendisse tempor congue dui, at dictum quam eleifend eget. Maecenas sit amet lacus id erat pharetra pulvinar.',
		'Quisque rhoncus blandit nunc in dictum. Nunc elit tortor, ultricies ac turpis vel, ornare dignissim augue. Cras in ante sit amet sem aliquam porta. Quisque ut interdum orci. Cras condimentum felis tempor, eleifend lorem nec, rhoncus libero. Aenean ultricies felis sed nunc dapibus suscipit. Vestibulum laoreet, nibh ac scelerisque consectetur, sapien odio malesuada felis, quis lobortis justo turpis a sapien. Pellentesque consectetur volutpat ante, at tincidunt nisl porta ac. Donec eleifend imperdiet vulputate. Fusce ullamcorper ultrices euismod. Maecenas bibendum scelerisque arcu, et aliquam nulla consectetur ut. Class aptent taciti sociosqu ad litora torquent per conubia nostra, per inceptos himenaeos. Donec porta nibh sed risus scelerisque fringilla.',
		'Maecenas molestie nulla eu laoreet consequat. Sed sagittis blandit imperdiet. Vestibulum commodo urna vel purus sodales tincidunt. Phasellus in nulla vel nunc sodales dignissim quis quis nisi. Donec venenatis et nisi vel porttitor. Sed ut sollicitudin urna, vel aliquet ligula. In hac habitasse platea dictumst. Fusce quis urna diam. Donec tempor tristique dignissim. Nulla pharetra sit amet nibh id porta. Donec sagittis urna risus, in ultrices nisi fringilla et. Suspendisse potenti.',
		'Morbi vitae fringilla massa. Praesent luctus gravida magna, et ornare enim viverra sit amet. Donec risus ipsum, interdum non libero eget, feugiat placerat ante. Quisque semper elementum euismod. Donec sit amet enim lobortis, tempus sem vel, mollis elit. Maecenas eget dui arcu. Nunc a orci lorem.',
		'Phasellus non leo nunc. Ut id posuere orci. Mauris congue lectus sed sapien vulputate dignissim. Donec ac enim ac dui vestibulum fermentum. Nam dignissim lacinia lacus, tempor dignissim lacus mattis et. Quisque sed velit nisi. Vivamus pulvinar rhoncus justo, quis lobortis sem lobortis eu. Nam iaculis odio non velit semper feugiat. Pellentesque vehicula dui felis, nec malesuada lacus molestie rutrum. Nullam in lectus porta, egestas massa quis, mattis sem. Fusce mauris purus, faucibus et congue eu, iaculis sit amet leo. Maecenas et volutpat lorem, non eleifend est. Donec nec nisi eu erat finibus ultricies. Nullam eget convallis felis, eget viverra est. Pellentesque pellentesque feugiat augue.'
	];

	return paragraphs[uiFactory_lorem_index++ % paragraphs.length];
};


