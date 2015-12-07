import React from 'react';
import debugFactory from 'debug';
import noop from 'lodash.noop';

import { getElementKey } from './lib/elements';

const debug = debugFactory( 'warpedit:preview' );

let clickableElements = {};

export default React.createClass( {
	displayName: 'Preview',

	propTypes: {
		markup: React.PropTypes.string.isRequired,
		clickableClassName: React.PropTypes.string,
		editableElements: React.PropTypes.object,
		onClick: React.PropTypes.func,
		addClickableElement: React.PropTypes.func,
	},

	getDefaultProps() {
		return {
			clickableClassName: '.warpedit-clickable',
			editableElements: {},
			onClick: noop,
			addClickableElement: noop,
		};
	},

	componentDidMount() {
		this.updateFrameContent( this.props.markup );
	},

	componentDidUpdate() {
		this.updateFrameContent( this.props.markup );
	},

	shouldComponentUpdate( nextProps ) {
		return ( nextProps.markup !== this.props.markup );
	},

	componentWillReceiveProps( nextProps ) {
		this.updateEditableElements( nextProps.editableElements );
	},

	updateEditableElements( editableElements ) {
		Object.keys( editableElements ).map( elementKey => {
			this.updateFrameElement( elementKey, editableElements[ elementKey ] );
		} );
	},

	updateFrameElement( elementKey, content ) {
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
