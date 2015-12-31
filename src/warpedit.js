import React from 'react';
import debugFactory from 'debug';
import querystring from 'querystring';
import { connect } from 'react-redux';

import Preview from './preview';
import EditorPanel from './editor-panel';
import MenuBar from './menu-bar';
import { fetchInitialMarkup, getAuth, changeElement, editElement } from './lib/actions';
import { saveChanges, finishEditing, viewPost } from './lib/actions';

const debug = debugFactory( 'warpedit:warpedit' );

const Warpedit = React.createClass( {
	displayName: 'Warpedit',

	componentDidMount() {
		this.callInitialActions( this.props );
	},

	// TODO: add propTypes

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
		if ( ! this.props.params.site || ! this.props.params.post ) {
			return (
				<div>
					<h2>No site specified</h2>
					<h3>Please visit `/edit/SITE/POST_ID`</h3>
				</div>
			);
		}
		if ( this.props.markup.length < 1 ) {
			return (
				<div>
					<h2>Loading...</h2>
				</div>
			);
		}
		return (
			<div>
				<MenuBar
					isEditorActive={ this.props.isEditorActive }
					standardButtons={ [
						<button key="saveChanges" className="btn" onClick={ this.handleSave }>Save Changes</button>,
						<button key="viewPost" className="btn" onClick={ this.viewPost }>View Post</button>,
					] }
					editorButtons={ [
						<button key="doneEditing" className="btn" onClick={ this.handleDoneEditing }>Done</button>
					] }
				/>
				<EditorPanel
					active={ this.props.isEditorActive }
					content={ this.props.editingContent }
					onChange={ this.handleEditChange }
				/>
				<Preview
					markup={ this.props.markup }
					onClick={ this.handleClickElement }
				/>
			</div>
		);
	},

	handleDoneEditing() {
		this.props.dispatch( finishEditing() );
	},

	handleSave() {
		this.props.dispatch( saveChanges() );
	},

	viewPost() {
		this.props.dispatch( viewPost() );
	},

	handleEditChange( content ) {
		this.props.dispatch( changeElement( content ) );
	},

	handleClickElement( elementKey ) {
		this.props.dispatch( editElement( elementKey ) );
	}
} );

function mapStateToProps( state ) {
	const { isEditorActive, editingContent, markup, auth } = state;
	return { isEditorActive, editingContent, markup, auth };
}

export default connect( mapStateToProps )( Warpedit );
