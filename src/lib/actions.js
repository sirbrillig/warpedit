import wpcomFactory from 'wpcom';
import debugFactory from 'debug';
import { getPreviewForSlug } from 'wpreview';

import { getAuthFromServer } from '../lib/auth';
import { replaceNewlinesWithHtml, getElementMarkupForKey, updateElementInMarkup, addElementKeysToMarkup, applyChangesToContent } from '../lib/content';

const debug = debugFactory( 'warpedit:actions' );

export function gotError( error ) {
	debug( 'got error', error );
	return { type: 'ERROR', error: error.toString() };
}

export function fetchInitialMarkup( site, postId ) {
	return function( dispatch, getState ) {
		const { auth } = getState();
		const authToken = auth[ site ];
		const wpcom = wpcomFactory( authToken );
		debug( 'fetching initial markup' );
		wpcom.site( site ).post( postId ).get( { context: 'edit' } )
		.then( response => {
			debug( 'got post data response with slug', response.slug );
			dispatch( gotPostContent( response.content, response.slug ) );
		} )
		.catch( err => dispatch( gotError( err ) ) );
	}
}

export function gotPostContent( markup, slug ) {
	return function( dispatch, getState ) {
		const { post } = getState();
		dispatch( savePostContent( addElementKeysToMarkup( markup, post.editableSelector ), slug ) );
		dispatch( fetchPreview( post.site, slug ) );
	}
}

export function fetchPreview( site, slug ) {
	return function( dispatch, getState ) {
		debug( 'fetching preview' );
		const { auth, post } = getState();
		const authToken = auth[ site ];
		const wpcom = wpcomFactory( authToken );
		getPreviewForSlug( wpcom, site, slug )
		.then( response => {
			debug( 'got initial markup response' );
			if ( ! response ) {
				throw new Error( 'No markup received from API' );
			}
			dispatch( saveInitialMarkup( addElementKeysToMarkup( response, post.editableSelector ) ) );
		} )
		.catch( err => dispatch( gotError( err ) ) );
	}
}

export function savePostContent( markup, slug ) {
	return { type: 'POST_CONTENT_RECEIVED', markup, slug };
}

export function saveInitialMarkup( markup ) {
	return { type: 'INITIAL_MARKUP_RECEIVED', markup };
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
	return function( dispatch, getState ) {
		const { post } = getState();
		const content = getElementMarkupForKey( elementKey, post.markup );
		dispatch( editElementContent( elementKey, content ) );
	}
}

export function editElementContent( elementKey, content ) {
	return { type: 'EDIT_ELEMENT', elementKey, content };
}

export function changeElement( content ) {
	return { type: 'UPDATE_ELEMENT_CONTENT', content };
}

export function finishEditing() {
	return function( dispatch, getState ) {
		const { post, editor } = getState();
		const editingContent = replaceNewlinesWithHtml( editor.editingContent );
		const newMarkup = updateElementInMarkup( editor.editingKey, editingContent, post.markup );
		dispatch( gotUpdatedMarkup( newMarkup ) );
		dispatch( closeEditor() );
	}
}

export function closeEditor() {
	return { type: 'EDIT_COMPLETE' };
}

export function gotUpdatedMarkup( markup ) {
	return { type: 'UPDATED_POST_MARKUP', markup };
}

export function uploadComplete() {
	return { type: 'UPLOAD_COMPLETE' };
}

export function saveChanges() {
	return function( dispatch, getState ) {
		const { auth, post } = getState();
		const authToken = auth[ post.site ];
		const wpcom = wpcomFactory( authToken );
		const wpcomPost = wpcom.site( post.site ).post( post.postId );
		const content = applyChangesToContent( post.postContent, post.markup, post.editableSelector );
		if ( ! content ) {
			throw new Error( 'Could not save empty markup to API' );
		}
		wpcomPost.update( { content } )
		.then( () => {
			dispatch( uploadComplete() );
		} )
		.catch( () => {
			throw new Error( 'Error saving markup to API' );
		} );
	}
}

export function gotAuth( site, token ) {
	return { type: 'AUTH_COMPLETE', site, token };
}

export function gotSiteAndPost( site, postId ) {
	return { type: 'SITE_AND_POST_RECEIVED', site, postId };
}

export function viewPost() {
	return function( dispatch, getState ) {
		const { post } = getState();
		openInNewWindow( `http://${post.site}/${post.slug}/` );
	}
}

function openInNewWindow( url ) {
	if ( ! window ) {
		return;
	}
	window.open( url, '_blank' );
}
