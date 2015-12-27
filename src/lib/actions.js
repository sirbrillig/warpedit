import wpcomFactory from 'wpcom';
import url from 'url';

import * as auth from '../lib/auth';

export function fetchInitialMarkup() {
	return function( dispatch, getState ) {
		const { authToken, site, path } = getState();
		const wpcom = wpcomFactory( authToken );
		const endpoint = `/sites/${site}/previews/mine?path=${path}`;
		wpcom.req.get( endpoint, ( err, response ) => {
			if ( ! err ) dispatch( saveInitialMarkup( response.html ) );
		} );
	}
}

export function saveInitialMarkup( markup ) {
	return { type: 'INITIAL_MARKUP_RECEIVED', markup, editableSelector: '.entry-content p' };
}

export function clearState() {
	return { type: 'CLEAR_STATE' };
}

export function getAuthForNewSite( siteUrl ) {
	return function( dispatch ) {
		dispatch( clearState() );
		dispatch( getAuthFromServer( siteUrl ) );
	}
}

export function beginAuth() {
	return { type: 'BEGIN_GET_AUTH' };
}

export function saveSite( siteUrl ) {
	return { type: 'SAVE_SITE', siteUrl };
}

export function getAuthFromServer( siteUrl ) {
	return function( dispatch ) {
		const { host } = url.parse( siteUrl );
		dispatch( saveSite( siteUrl ) );
		auth.getAuthFromServer( host );
		dispatch( beginAuth() );
	}
}

export function saveToken( token ) {
	return { type: 'SAVE_AUTH_TOKEN', token };
}

export function editElement( elementKey ) {
	return { type: 'EDIT_ELEMENT', elementKey };
}

export function changeElement( content ) {
	return { type: 'UPDATE_ELEMENT_CONTENT', content };
}
