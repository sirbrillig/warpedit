import wpcomFactory from 'wpcom';

import * as auth from '../lib/auth';
import { applyChangesToContent } from '../lib/content';

export function fetchInitialMarkup() {
	return function( dispatch, getState ) {
		const { authToken, site, postId } = getState();
		const wpcom = wpcomFactory( authToken );
		wpcom.site( site ).post( postId ).get( { context: 'edit' } )
		.then( ( response ) => {
			dispatch( savePostContent( response.content ) );
			const endpoint = `/sites/${site}/previews/mine?path=${response.slug}/`;
			return wpcom.req.get( endpoint );
		} )
		.then( ( response ) => {
			if ( ! response.html ) {
				throw 'No markup received from API';
			}
			dispatch( saveInitialMarkup( response.html ) );
		} );
	}
}

export function savePostContent( markup ) {
	return { type: 'POST_CONTENT_RECEIVED', markup };
}

export function saveInitialMarkup( markup ) {
	return { type: 'INITIAL_MARKUP_RECEIVED', markup, editableSelector: '.warpedit-editable' };
}

export function clearState() {
	return { type: 'CLEAR_STATE' };
}

export function getAuthForNewSite( site, postId ) {
	return function( dispatch ) {
		dispatch( clearState() );
		dispatch( getAuthFromServer( site, postId ) );
	}
}

export function beginAuth() {
	return { type: 'BEGIN_GET_AUTH' };
}

export function getAuthFromServer( site, postId ) {
	return function( dispatch ) {
		auth.getAuthFromServer( site, postId );
		dispatch( beginAuth() );
	}
}

export function saveToken( token, site, postId ) {
	return { type: 'SAVE_AUTH_TOKEN', token, site, postId };
}

export function editElement( elementKey ) {
	return { type: 'EDIT_ELEMENT', elementKey };
}

export function changeElement( content ) {
	return { type: 'UPDATE_ELEMENT_CONTENT', content };
}

export function finishEditing() {
	return { type: 'EDIT_COMPLETE' };
}

export function uploadComplete() {
	return { type: 'UPLOAD_COMPLETE' };
}

export function saveChanges() {
	return function( dispatch, getState ) {
		const { authToken, site, postId, markup, postContent, editableSelector } = getState();
		const wpcom = wpcomFactory( authToken );
		const post = wpcom.site( site ).post( postId );
		const content = applyChangesToContent( postContent, markup, editableSelector );
		post.update( { content } )
		.then( () => {
			dispatch( uploadComplete() );
		} );
	}
}
