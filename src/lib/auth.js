import debugFactory from 'debug';
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
	debug( 'starting oauth process' );
	const redirect = `${settings.redirect}/edit/${blog}/${postId}`;
	const wpoauth = wpcomOAuth( settings.client_id, { blog, redirect } );
	wpoauth.get();
}
