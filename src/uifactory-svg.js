/* global uiFactory */

uiFactory.svg = (callback) => uiFactory('http://www.w3.org/2000/svg', 'svg', callback);

['a', 'animate', 'animateMotion', 'animateTransform', 'circle', 'clipPath', 'color-profile', 'defs', 'desc', 'discard',
	'ellipse', 'feBlend', 'feColorMatrix', 'feComponentTransfer', 'feComposite', 'feConvolveMatrix', 'feDiffuseLighting',
	'feDisplacementMap', 'feDistantLight', 'feDropShadow', 'feFlood', 'feFuncA', 'feFuncB', 'feFuncG', 'feFuncR',
	'feGaussianBlur', 'feImage', 'feMerge', 'feMergeNode', 'feMorphology', 'feOffset', 'fePointLight',
	'feSpecularLighting', 'feSpotLight', 'feTile', 'feTurbulence', 'filter', 'foreignObject', 'g', 'hatch', 'hatchpath',
	'image', 'line', 'linearGradient', 'marker', 'mask', 'mesh', 'meshgradient', 'meshpatch', 'meshrow', 'metadata',
	'mpath', 'path', 'pattern', 'polygon', 'polyline', 'radialGradient', 'rect', 'script', 'set', 'solidcolor', 'stop',
	'style', 'switch', 'symbol', 'text', 'textPath', 'title', 'tspan', 'unknown', 'use', 'view']
	.forEach((tag) => uiFactory.svg[tag] = (callback) => uiFactory('http://www.w3.org/2000/svg', tag, callback));
