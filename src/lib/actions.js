import wpcomFactory from 'wpcom';
import debugFactory from 'debug';

import { getAuthFromServer } from '../lib/auth';
import { applyChangesToContent } from '../lib/content';

const debug = debugFactory( 'warpedit:actions' );

export function fetchInitialMarkup( authToken, site, postId ) {
	return function( dispatch ) {
		if ( ! authToken || ! site || ! postId ) {
			debug( 'cannot fetch markup. insufficient data available' );
			return;
		}
		const wpcom = wpcomFactory( authToken );
		debug( 'fetching initial markup' );
		wpcom.site( site ).post( postId ).get( { context: 'edit' } )
		.then( ( response ) => {
			debug( 'got post data response', response.slug );
			dispatch( savePostContent( response.content, response.slug ) );
			// TODO: use functions specifically made for this (wpreview)
			const endpoint = `/sites/${site}/previews/mine?path=${response.slug}/`;
			return wpcom.req.get( endpoint );
		} )
		.then( ( response ) => {
			debug( 'got initial markup response' );
			if ( ! response.html ) {
				//TODO: throw Error object
				throw 'No markup received from API';
			}
			dispatch( saveInitialMarkup( authToken, site, postId, response.html ) );
		} )
		.catch( () => {
			//TODO: throw Error object
			throw 'Error fetching markup from API';
		} );
	}
}

export function savePostContent( markup, slug ) {
	return { type: 'POST_CONTENT_RECEIVED', markup, slug };
}

export function saveInitialMarkup( authToken, site, postId, markup ) {
	return { type: 'INITIAL_MARKUP_RECEIVED', authToken, site, postId, markup, editableSelector: '.warpedit-editable' };
}

export function getAuth( site, postId ) {
	return function() {
		getAuthFromServer( site, postId );
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
	// TODO: applyChangesToContent is not necessary since the content will be updated already.
	return function( dispatch, getState ) {
		const { auth, site, postId, markup, postContent, editableSelector } = getState();
		const authToken = auth[ site ];
		const wpcom = wpcomFactory( authToken );
		const post = wpcom.site( site ).post( postId );
		const content = applyChangesToContent( postContent, markup, editableSelector );
		post.update( { content } )
		.then( () => {
			dispatch( uploadComplete() );
		} )
		.catch( () => {
			throw 'Error saving markup to API';
		} );
	}
}

export function viewPost() {
	return function( dispatch, getState ) {
		const { site, slug } = getState();
		openInNewWindow( `http://${site}/${slug}/` );
	}
}

function openInNewWindow( url ) {
	if ( ! window ) {
		return;
	}
	window.open( url, '_blank' );
}
