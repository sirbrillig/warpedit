import wpcomFactory from 'wpcom';

import * as auth from '../lib/auth';

export function fetchInitialMarkup() {
	return function( dispatch, getState ) {
		const { authToken, site } = getState();
		const wpcom = wpcomFactory( authToken );
		const endpoint = `/sites/${site}/previews/mine`;
		wpcom.req.get( endpoint, ( err, response ) => {
			if ( ! err ) dispatch( { type: 'INITIAL_MARKUP_RECEIVED', markup: response.html, editableSelector: '.entry-content p' } );
		} );
	}
}

export function getAuthForNewSite( siteUrl ) {
	return function( dispatch ) {
		dispatch( { type: 'CLEAR_STATE' } );
		auth.getAuthFromServer( siteUrl );
		dispatch( { type: 'BEGIN_GET_AUTH' } );
	}
}

export function getAuthFromServer( siteUrl ) {
	return function( dispatch ) {
		auth.getAuthFromServer( siteUrl );
		dispatch( { type: 'BEGIN_GET_AUTH' } );
	}
}

export function saveToken( token, site ) {
	return { type: 'SAVE_AUTH_TOKEN', token, site };
}

export function editElement( elementKey ) {
	return { type: 'EDIT_ELEMENT', elementKey };
}

export function changeElement( content ) {
	return { type: 'UPDATE_ELEMENT_CONTENT', content };
}
