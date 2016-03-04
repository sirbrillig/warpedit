import React from 'react';
import debugFactory from 'debug';
import querystring from 'querystring';
import { connect } from 'react-redux';

import NoPost from './no-post';
import Loading from './loading';
import LoggedIn from './logged-in';
import { fetchInitialMarkup, getAuth } from './lib/actions';

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

	callInitialActions( newProps ) {
		// when we first mount, we should do the following:
		// - render the help page if no site or no post ID are in the URL
		debug( 'calling initial actions' );
		const { dispatch, params, location, auth } = newProps;
		if ( ! params.site || ! params.post ) {
			debug( 'no site or post specified.' );
			return;
		}
		// - redirect to the oauth page if we don't have a token for the site in the URL
		const hashParams = querystring.parse( location.hash.substr( 1 ) );
		if ( ! hashParams.access_token && ! auth[params.site] ) {
			debug( 'requesting authentication token for', params.site );
			return dispatch( getAuth( params.site, params.post ) );
		}
		// - if we do have a token, request the page markup and render the preview
		const token = hashParams.access_token || auth[params.site];
		debug( 'requesting initial markup' );
		dispatch( fetchInitialMarkup( token, params.site, params.post ) );
	},

	render() {
		if ( ! this.props.params.site || ! this.props.params.post ) return <NoPost />;
		if ( this.props.markup.length < 1 ) return <Loading />;
		return <LoggedIn />
	},
} );

function mapStateToProps( state ) {
	const { markup, auth } = state;
	return { markup, auth };
}

export default connect( mapStateToProps )( Warpedit );
