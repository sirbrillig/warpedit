import React from 'react';
import debugFactory from 'debug';
import querystring from 'querystring';

import store from './lib/store';
import Preview from './preview';
import EditorPanel from './editor-panel';
import MenuBar from './menu-bar';
import { fetchInitialMarkup, getAuthForNewSite, getAuthFromServer, clearState, saveToken, saveSite, changeElement, editElement } from './lib/actions';

const debug = debugFactory( 'warpedit:warpedit' );

export default React.createClass( {
	displayName: 'Warpedit',

	componentWillMount() {
		debug( 'setting up...' );
		this.updateWarpedit();
	},

	componentDidMount() {
		store.subscribe( this.updateWarpedit );
		this.callInitialActions( this.props );
	},

	getInitialState() {
		return {
			editingContent: '',
			isEditorActive: false,
			authToken: null,
			site: null,
		};
	},

	callInitialActions( newProps ) {
		// when we start, we may be in one of the following states:
		debug( 'calling initial actions' );
		// - no site or no post in the url: clear the state and stop
		if ( ! newProps.params.site || ! newProps.params.post ) {
			debug( 'no site or post specified. resetting state.' );
			return store.dispatch( clearState() );
		}
		const hashParams = querystring.parse( newProps.location.hash.substr( 1 ) );
		// - auth token in the url: save the auth token and the site and post
		if ( hashParams.access_token ) {
			debug( 'got oauth token', hashParams.access_token );
			store.dispatch( saveToken( hashParams.access_token, newProps.params.site, newProps.params.post ) );
		}
		// - site in the url does not match site in the store: clear the store, fetch a new token, and stop
		if ( newProps.params.site !== store.getState().site ) {
			debug( 'requesting new authentication token for', newProps.params.site );
			return store.dispatch( getAuthForNewSite( newProps.params.site, newProps.params.post ) );
		}
		// - site and post in the url but not in the store: save those to the store
		if ( ! store.getState().site || ! store.getState().post ) {
			store.dispatch( saveSite( newProps.params.site, newProps.params.post ) );
		}
		// - no auth token in the store: fetch a new token and stop
		if ( ! store.getState().authToken ) {
			debug( 'requesting authentication token for', newProps.params.site );
			return store.dispatch( getAuthFromServer( newProps.params.site ) );
		}
		// - auth token in the store but no markup fetched: fetch the markup
		if ( ! store.getState().markup ) {
			debug( 'requesting initial markup' );
			store.dispatch( fetchInitialMarkup() );
		}
	},

	updateWarpedit() {
		debug( 'new store state', store.getState() );
		const { isEditorActive, editingContent, markup, authToken, site } = store.getState();
		this.setState( { isEditorActive, editingContent, markup, authToken, site } );
	},

	render() {
		if ( ! this.state.site && ! this.props.params.site ) {
			return (
				<div>
					<h2>No site specified</h2>
					<h3>Please visit `/edit/SITE/POST_ID`</h3>
				</div>
			);
		}
		if ( this.state.markup.length < 1 ) {
			return (
				<div>
					<h2>Loading...</h2>
				</div>
			);
		}
		return (
			<div>
				<MenuBar isEditorActive={ this.state.isEditorActive }/>
				<EditorPanel
					active={ this.state.isEditorActive }
					content={ this.state.editingContent }
					onChange={ this.handleEditChange }
				/>
				<Preview
					markup={ this.state.markup }
					onClick={ this.handleClickElement }
				/>
			</div>
		);
	},

	handleEditChange( content ) {
		store.dispatch( changeElement( content ) );
	},

	handleClickElement( elementKey ) {
		store.dispatch( editElement( elementKey ) );
	}
} );
