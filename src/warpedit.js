import React from 'react';
import debugFactory from 'debug';
import querystring from 'querystring';
import { connect } from 'react-redux';

import { removeTokenFromUrl } from './lib/auth';
import NoPost from './no-post';
import Loading from './loading';
import LoggedIn from './logged-in';
import { fetchInitialMarkup, getAuth, gotSiteAndPost, gotAuth } from './lib/actions';

const debug = debugFactory( 'warpedit:warpedit' );

const Warpedit = React.createClass( {
	propTypes: {
		markup: React.PropTypes.string,
		auth: React.PropTypes.object,
		params: React.PropTypes.object,
		dispatch: React.PropTypes.func,
		location: React.PropTypes.object,
	},

	componentDidMount() {
		this.callInitialActions( this.props );
	},

	componentDidUpdate() {
		this.callInitialActions( this.props );
	},

	callInitialActions( newProps ) {
		// when we first mount, we should do the following:
		// - render the help page if no site or no post ID are in the URL
		debug( 'calling initial actions' );
		const { dispatch, params, location, auth, post, site, markup } = newProps;
		if ( ! params.site || ! params.post ) {
			debug( 'no site or post specified.' );
			return;
		}
		if ( ! post || ! site ) {
			debug( 'saving site and post' );
			return dispatch( gotSiteAndPost( params.site, params.post ) );
		}
		// - redirect to the oauth page if we don't have a token for the site in the URL
		const hashParams = querystring.parse( location.hash.substr( 1 ) );
		if ( ! hashParams.access_token && ! auth[site] ) {
			debug( 'requesting authentication token for', site );
			return dispatch( getAuth( site, post ) );
		}
		// - if we do have a token, request the page markup and render the preview
		if ( auth[site] && ! markup ) {
			debug( 'requesting initial markup' );
			return dispatch( fetchInitialMarkup( site, post ) );
		}
		// - if we received a token, save it
		if ( hashParams.access_token ) {
			dispatch( gotAuth( site, hashParams.access_token ) );
			removeTokenFromUrl();
			return;
		}
	},

	render() {
		if ( ! this.props.params.site || ! this.props.params.post ) return <NoPost />;
		if ( this.props.markup.length < 1 ) return <Loading />;
		return <LoggedIn />
	},
} );

function mapStateToProps( state ) {
	const { auth, post } = state;
	return { site: post.site, post: post.postId, markup: post.markup, auth };
}

export default connect( mapStateToProps )( Warpedit );
