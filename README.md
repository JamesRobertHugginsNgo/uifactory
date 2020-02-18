# UI Factory

UI Factory is a(nother) way to create an HTML Element object using JavaScript, but unlike other ways UI Factory keeps it a simple as possible by using a "Factory" function and a property descriptors.

UI Factory is designed to be flexible and allows dynamic rendering with the use of function type values.

UI Factory can be used to design your own reusable UI Factories returning customized Element objects.

## Usage

The following JavaScript code

``` JavaScript
const el = uiFactory('button')
	.properties({
		class: 'btn btn-primary',
		type: 'button'
	})
	.contents([
		uiFactory('i')
			.properties({
				class: 'fa fa-save'
			}),
		' Submit'
	])
	.events({
		'click': function(event) {
			event.preventDefault();
			alert('button clicked');
		}
	});

document.body.appendChild(el);
```

returns the following HTML element

``` HTML
<button class="btn btn-primary" type="button"><i class="fa fa-save"></i> Submit</button>
```

## Factory Function

Using the document.createElement() syntax. [Document.createElement() documentation](https://developer.mozilla.org/en-US/docs/Web/API/Document/createElement)

``` JavaScript
const el = uiFactory('div');
```

Using the document.createElementNS() syntax. [Document.createElementNS() documentation](https://developer.mozilla.org/en-US/docs/Web/API/Document/createElementNS)

``` JavaScript
const el = uiFactory('http://www.w3.org/1999/xhtml', 'div');
```

Using an existing Element object.

``` JavaScript
const el = document.getElementById('elementId');
uiFactory(el);
```

By excluding any element argument, the factory will create a DIV HTML element.

``` JavaScript
const divEl = uiFactory();
```
## UI Factory Element Special Methods

Elements created with the UI Factory function contains 5 added methods.

### Callback Method

A useful method when there is a need to execute JavaScript code in the same chain as creating the element. One use case is when there is a need to assign the create element to a variable.

``` JavaScript
const returnValue = uiFactoryElement.callback(optCallback);
```

<dl>
	<dt>uiFactoryElement</dt>
	<dd>Object type. Instance of Element.</dd>
	<dd>Element object returned by the UI Factory function.</dd>
	<dt>optCallback</dt>
	<dd>Function type. Optional.</dd>
	<dd>Accepts 1 argument holding the reference for uiFactoryElement.</dd>
	<dd>Executed with the context of uiFactoryElement.</dd>
	<dd>Return value is not required.</dd>
	<dd>When omitted, the method does nothing making it safe to use when the value for optCallback has not been determined.</dd>
	<dt>returnValue</dt>
	<dd>Object type. Instance of Element.</dd>
	<dd>Method returns uiFactoryElement.</dd>
</dl>

### Events Method

``` JavaScript
const returnValue = uiFactoryElement.events({
	[eventType]: eventHandler
}, optCallback);
```

<dl>
	<dt>uiFactoryElement</dt>
	<dd>Object type. Instance of Element.</dd>
	<dd>Element object returned by the UI Factory function.</dd>
	<dt>eventType</dt>
	<dd>String type.</dd>
	<dd>Any event type that can be added using addEventListener() method. <a href="https://developer.mozilla.org/en-US/docs/Web/API/EventTarget/addEventListener">EventTarget.addEventListener() documentation</a></dd>
	<dt>eventHandler</dt>
	<dd>Function type.</dd>
	<dd>Accepts 2 arguments. The 1st holds </dd>
	<dt>returnValue</dt>
	<dd>Object type. Instance of Element.</dd>
	<dd>Method returns uiFactoryElement.</dd>
</dl>

### Properties Method

To do.

### Contents Method

To do.

### Render Method

To do.
