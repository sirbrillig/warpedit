import React from 'react';
import debugFactory from 'debug';
import noop from 'lodash.noop';

const debug = debugFactory( 'warpedit:preview' );

export default React.createClass( {
	displayName: 'Preview',

	propTypes: {
		markup: React.PropTypes.string.isRequired,
		clickableClassName: React.PropTypes.string,
		onClick: React.PropTypes.func,
	},

	getDefaultProps() {
		return {
			clickableClassName: '.warpedit-clickable',
			onClick: noop,
		};
	},

	componentDidMount() {
		this.updateFrameContent( this.props.markup );
	},

	componentDidUpdate() {
		this.updateFrameContent( this.props.markup );
	},

	updateFrameContent( content ) {
		debug( 'adding content to iframe' );
		this.iframe.addEventListener( 'load', this.attachClickHandlers );
		this.iframe.contentDocument.open();
		this.iframe.contentDocument.write( content );
		this.iframe.contentDocument.close();
	},

	attachClickHandlers() {
		const clickableElements = Array.prototype.slice.call( this.iframe.contentDocument.querySelectorAll( this.props.clickableClassName ) );
		debug( 'attaching click handlers to', clickableElements.length, 'elements' );
		clickableElements.map( this.attachClickHandler );
	},

	attachClickHandler( element ) {
		debug( 'attaching click handler to', element );
		element.onclick = this.handleClick;
	},

	handleClick( event ) {
		debug( 'click detected:', event );
		this.props.onClick( event );
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
