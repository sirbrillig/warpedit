# Preview

A component to display an html page inside an iframe.

## Props

* `markup`: The markup to display in the preview. Markup must have data-preview-id attribute for each clickable element set to a unique key.
* `onClick`: (Optional) A function which will be called when any DOM element matching `clickableSelector` is clicked. Will be passed the unique key of that element.
