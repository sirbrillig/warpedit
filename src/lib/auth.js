import debugFactory from 'debug';
import { browserHistory } from 'react-router';
import wpcomOAuth from 'wpcom-oauth-cors';

const debug = debugFactory( 'warpedit:auth' );

// TODO: make this a config file
const settings = {
	client_id: '44072',
	redirect: 'http://localhost:3000'
};

export function getAuthFromServer( blog, postId ) {
	if ( ! settings ) {
		console.error( 'Error trying to authenticate with WordPress.com. No settings found.' );
		return;
	}
	const redirect = `${settings.redirect}/edit/${blog}/${postId}`;
	debug( 'starting oauth process for', blog, 'will redirect to', redirect );
	const wpoauth = wpcomOAuth( settings.client_id, { blog, redirect } );
	wpoauth.request();
}

export function removeTokenFromUrl() {
	if ( ! window ) return;
	const newUrl = window.location.pathname;
	debug( 'replacing history location with', newUrl );
	browserHistory.replace( newUrl );
}
