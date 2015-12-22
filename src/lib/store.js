import { createStore, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';
import debugFactory from 'debug';
import cheerio from 'cheerio';

import { getElementKey } from '../lib/elements';

const debug = debugFactory( 'warpedit:store' );

const initialState = {
	isEditorActive: false,
	editingKey: '',
	editingContent: '',
	markup: '',
	authToken: null,
	site: null,
};

const createStoreWithMiddleware = applyMiddleware( thunk )( createStore );
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
			return Object.assign( {}, state, { isEditorActive: false, editingKey: '', editingContent: '', markup: findInPage.html() } );
			break;

		case 'INITIAL_MARKUP_RECEIVED':
			debug( 'initial markup received' );
			// same action as UPDATE_MARKUP, so fall through
		case 'UPDATE_MARKUP':
			debug( 'markup changed' );
			let markup = action.markup;
			if ( action.editableSelector ) {
				const findInNewPage = cheerio.load( action.markup );
				findInNewPage( action.editableSelector ).toArray().forEach( ( element ) => {
					const elementKey = getElementKey( cheerio( element ).html() );
					debug( `adding preview-id to element ${elementKey}` );
					cheerio( element ).attr( 'data-preview-id', elementKey );
				} );
				markup = findInNewPage.html();
			}
			return Object.assign( {}, state, { markup } );
			break;

		case 'SAVE_AUTH_TOKEN':
			debug( 'saving auth token' );
			return Object.assign( {}, state, { authToken: action.token, site: action.site } );
			break;
	}
	return state;
} );
