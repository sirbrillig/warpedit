import React from 'react';
import debugFactory from 'debug';
import noop from 'lodash.noop';
import cheerio from 'cheerio';

const debug = debugFactory( 'warpedit:preview' );

// Each clickable DOM element in the preview keyed by its order in the document
let clickableElements = {};

export default React.createClass( {
	displayName: 'Preview',

	propTypes: {
		// The markup to display in the preview. Markup must have data-preview-id
		// attribute for each clickable element set to a unique key.
		markup: React.PropTypes.string.isRequired,
		// The handler to call when a clickable element is clicked. Will be passed
		// the unique key of the element.
		onClick: React.PropTypes.func,
	},

	getDefaultProps() {
		return {
			markup: '',
			onClick: noop,
		};
	},

	componentDidMount() {
		this.updateFrameContent( this.props.markup );
	},

	componentDidUpdate() {
		this.updateFrameContent( this.props.markup );
	},

	shouldComponentUpdate( nextProps ) {
		try {
			this.getElementChanges( this.props.markup, nextProps.markup );
		} catch ( error ) {
			debug( 'markup has changed; re-rendering preview' );
			return true;
		}
		return false;
	},

	componentWillReceiveProps( nextProps ) {
		this.getElementChanges( this.props.markup, nextProps.markup ).map( ( { elementId, newMarkup } ) => this.updatePreviewElement( elementId, newMarkup ) );
	},

	getElementChanges( oldMarkup, newMarkup ) {
		const findInNewPage = cheerio.load( newMarkup );
		const findInOldPage = cheerio.load( oldMarkup );
		return findInNewPage( '[data-preview-id]' ).toArray().reduce( ( changed, newElement ) => {
			const elementId = cheerio( newElement ).data( 'preview-id' );
			const oldElement = findInOldPage( `[data-preview-id='${elementId}']` );
			if ( oldElement.length < 1 ) throw `missing element ${elementId}`;
			if ( cheerio( oldElement ).html() !== cheerio( newElement ).html() ) return changed.concat( { elementId, newMarkup: cheerio( newElement ).html() } );
			return changed;
		}, [] );
	},

	updatePreviewElement( elementKey, content ) {
		if ( ! clickableElements[ elementKey ] ) {
			debug( `expected to find cached page element ${elementKey} in`, clickableElements );
			throw `Could not update page element '${elementKey}'; element was not cached.`;
		}
		clickableElements[ elementKey ].innerHTML = content;
	},

	updateFrameContent( content ) {
		debug( 'adding content to iframe' );
		this.iframe.addEventListener( 'load', this.finishPreviewLoad );
		this.iframe.contentDocument.open();
		this.iframe.contentDocument.write( content );
		this.iframe.contentDocument.close();
	},

	finishPreviewLoad() {
		const domLinks = Array.prototype.slice.call( this.iframe.contentDocument.querySelectorAll( 'a' ) );
		debug( `disabling ${domLinks.length} links in preview` );
		domLinks.map( this.disableLink );
		const domElements = Array.prototype.slice.call( this.iframe.contentDocument.querySelectorAll( '[data-preview-id]' ) );
		debug( `attaching click handlers to ${domElements.length} elements` );
		this.clearCachedElements();
		domElements.map( this.cacheElement );
		domElements.map( this.attachClickHandler );
		domElements.map( this.flashElement );
	},

	disableLink( element ) {
		element.href = '#';
		element.onclick = ( event ) => event.preventDefault();
	},

	clearCachedElements() {
		debug( 'clearing cached elements' );
		clickableElements = {};
	},

	cacheElement( element ) {
		const elementKey = element.dataset.previewId;
		debug( `caching element ${elementKey}` );
		clickableElements[ elementKey ] = element;
	},

	attachClickHandler( element ) {
		element.onclick = this.handleClick;
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

	findElementKeyOnTarget( target ) {
		if ( target.dataset.previewId ) return target.dataset.previewId;
		return this.findElementKeyOnTarget( target.parentNode );
	},

	handleClick( event ) {
		const elementKey = this.findElementKeyOnTarget( event.target );
		if ( ! elementKey ) throw 'Click detected on unknown element';
		debug( 'click detected for element', elementKey );
		this.props.onClick( elementKey );
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
