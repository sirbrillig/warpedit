import { compose, createStore, applyMiddleware } from 'redux';
import persistState from 'redux-localstorage';
import thunk from 'redux-thunk';
import debugFactory from 'debug';
import cheerio from 'cheerio';

import { getElementKey } from '../lib/elements';

const debug = debugFactory( 'warpedit:store' );

const initialState = {
	isEditorActive: false,
	editingKey: '',
	editingContent: '',
	editableSelector: '',
	postContent: '',
	slug: '',
	markup: '',
	auth: {},
	postId: null,
	site: null,
};

const createStoreWithMiddleware = compose(
	applyMiddleware( thunk ),
	persistState( null, {
		key: 'warpedit',
		slicer: () => {
			return ( state ) => {
				return Object.assign( {}, initialState, { auth: state.auth } );
			}
		}
	} )
)( createStore );

export default createStoreWithMiddleware( ( state = initialState, action ) => {
	switch ( action.type ) {
		case 'EDIT_ELEMENT':
			debug( 'editing element', action.elementKey );
			const editingContent = cheerio( `[data-preview-id='${action.elementKey}']`, state.markup ).html();
			return Object.assign( {}, state, { isEditorActive: true, editingKey: action.elementKey, editingContent } );
			break;

		case 'UPDATE_ELEMENT_CONTENT':
			return Object.assign( {}, state, { editingContent: action.content } );
			break;

		case 'EDIT_COMPLETE':
			debug( 'applying changes to element', state.editingKey );
			const findInPage = cheerio.load( state.markup );
			findInPage( `[data-preview-id='${state.editingKey}']` ).html( state.editingContent );
			//TODO: also update markup in the same way
			return Object.assign( {}, state, { isEditorActive: false, editingKey: '', editingContent: '', markup: findInPage.html() } );
			break;

		case 'POST_CONTENT_RECEIVED':
			debug( 'post content changed' );
			// TODO: call addElementKeysToMarkup on this markup as well
			return Object.assign( {}, state, { postContent: action.markup, slug: action.slug } );
			break;

		case 'INITIAL_MARKUP_RECEIVED':
			debug( 'initial markup received' );
			const markup = addElementKeysToMarkup( action.markup, action.editableSelector );
			const { editableSelector, site, postId } = action;
			const auth = Object.assign( {}, state.auth, { [ site ]: action.authToken } );
			return Object.assign( {}, state, { markup, editableSelector, site, postId, auth } );
			break;

		case 'UPDATE_MARKUP':
			debug( 'markup changed' );
			return Object.assign( {}, state, { markup: action.markup } );
			break;
	}
	return state;
} );

// TODO: move to content.js
function addElementKeysToMarkup( markup, editableSelector ) {
	// TODO: use order of elements as key
	const findInNewPage = cheerio.load( markup );
	findInNewPage( editableSelector ).toArray().forEach( ( element ) => {
		const elementKey = getElementKey( cheerio( element ).html() );
		debug( `adding preview-id to element ${elementKey}` );
		cheerio( element ).attr( 'data-preview-id', elementKey );
	} );
	return findInNewPage.html();
}
