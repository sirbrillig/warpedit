import React from 'react';
import debugFactory from 'debug';
import noop from 'lodash.noop';

import { getElementKey } from './lib/elements';

const debug = debugFactory( 'warpedit:preview' );

let clickableElements = {};

export default React.createClass( {
	displayName: 'Preview',

	propTypes: {
		initialMarkup: React.PropTypes.string.isRequired,
		clickableClassName: React.PropTypes.string,
		getMarkupClassName: React.PropTypes.string,
		editableElements: React.PropTypes.object,
		onClick: React.PropTypes.func,
		addClickableElement: React.PropTypes.func,
		onMarkupChange: React.PropTypes.func,
	},

	getDefaultProps() {
		return {
			clickableClassName: '.warpedit-clickable',
			getMarkupClassName: 'body',
			editableElements: {},
			onClick: noop,
			addClickableElement: noop,
			onMarkupChange: noop,
		};
	},

	componentDidMount() {
		this.updateFrameContent( this.props.initialMarkup );
	},

	componentDidUpdate() {
		this.updateFrameContent( this.props.initialMarkup );
	},

	shouldComponentUpdate( nextProps ) {
		return ( nextProps.initialMarkup !== this.props.initialMarkup );
	},

	componentWillReceiveProps( nextProps ) {
		if ( ! Object.keys( nextProps.editableElements ).some( elementKey => this.didFrameElementChange( elementKey, nextProps.editableElements[ elementKey ] ) ) ) return;
		this.updateEditableElements( nextProps.editableElements );
	},

	getMarkup() {
		const markup = this.iframe.contentDocument.querySelector( this.props.getMarkupClassName );
		return markup.innerHTML;
	},

	updateEditableElements( editableElements ) {
		Object.keys( editableElements ).map( elementKey => this.updateFrameElement( elementKey, editableElements[ elementKey ] ) );
		this.props.onMarkupChange( this.getMarkup() );
	},

	didFrameElementChange( elementKey, content ) {
		return ( clickableElements[ elementKey ].innerHTML !== content );
	},

	updateFrameElement( elementKey, content ) {
		if ( ! this.didFrameElementChange( elementKey, content ) ) return;
		debug( 'updating frame element', elementKey );
		clickableElements[ elementKey ].innerHTML = content;
	},

	updateFrameContent( content ) {
		debug( 'adding content to iframe' );
		this.iframe.addEventListener( 'load', this.attachClickHandlers );
		this.iframe.contentDocument.open();
		this.iframe.contentDocument.write( content );
		this.iframe.contentDocument.close();
	},

	attachClickHandlers() {
		const domElements = Array.prototype.slice.call( this.iframe.contentDocument.querySelectorAll( this.props.clickableClassName ) );
		debug( 'attaching click handlers to', domElements.length, 'elements' );
		domElements.map( this.attachClickHandler );
	},

	attachClickHandler( element ) {
		debug( 'attaching click handler to', element );
		const elementKey = getElementKey( element );
		clickableElements[ elementKey ] = element;
		this.props.addClickableElement( element );
		element.elementKey = elementKey;
		element.onclick = this.handleClick;
		this.flashElement( element );
	},

	flashElement( element ) {
		const oldTransition = element.style.transition;
		const oldBackground = element.style.backgroundColor;
		const oldShadow = element.style.boxShadow;
		element.style.transition = 'all 500ms ease-in-out';
		element.style.backgroundColor = 'orange';
		element.style.boxShadow = 'orange 0px 0px 2px 2px';
		setTimeout( () => {
			element.style.backgroundColor = oldBackground;
			element.style.boxShadow = oldShadow;
			setTimeout( () => element.style.transition = oldTransition, 500 );
		}, 500 );
	},

	handleClick( event ) {
		const elementKey = event.target.elementKey;
		debug( 'click detected for element', elementKey );
		this.props.onEditElement( elementKey );
	},

	render() {
		return (
			<div className="warpedit-preview">
				<iframe
					className="warpedit-preview-iframe"
					ref={ ( ref ) => this.iframe = ref }
				/>
			</div>
		);
	}
} );
