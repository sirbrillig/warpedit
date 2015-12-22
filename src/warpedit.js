import React from 'react';
import debugFactory from 'debug';
import querystring from 'querystring';

import store from './lib/store';
import Preview from './preview';
import EditorPanel from './editor-panel';
import MenuBar from './menu-bar';
import { fetchInitialMarkup, getAuthFromServer, saveToken, changeElement, editElement } from './lib/actions';

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
		debug( 'calling initial actions', newProps );
		const hashParams = querystring.parse( newProps.location.hash.substr( 1 ) );
		if ( hashParams.access_token ) {
			debug( 'got oauth token', hashParams.access_token );
			store.dispatch( saveToken( hashParams.access_token, hashParams.site_id ) );
			return this.props.history.replaceState( null, `/edit/${hashParams.site_id}` );
		}
		if ( ! store.getState().authToken && newProps.params.site ) {
			debug( 'requesting authentication token for', newProps.params.site );
			store.dispatch( getAuthFromServer( newProps.params.site ) );
		}
	},

	updateWarpedit() {
		debug( 'new store state', store.getState() );
		const { isEditorActive, editingContent, markup, authToken, site } = store.getState();
		if ( authToken && ! markup ) {
			store.dispatch( fetchInitialMarkup() );
		}
		this.setState( { isEditorActive, editingContent, markup, authToken, site } );
	},

	render() {
		if ( ! this.state.site && ! this.props.params.site ) {
			return (
				<div>
					<h2>No site specified</h2>
					<h3>Please visit `/edit/YOURSITEHERE`</h3>
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
