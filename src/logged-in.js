import React from 'react';
import { connect } from 'react-redux';

import Preview from './preview';
import EditorPanel from './editor-panel';
import MenuBar from './menu-bar';
import { changeElement, editElement } from './lib/actions';
import { saveChanges, finishEditing, viewPost } from './lib/actions';

const LoggedIn = React.createClass( {
	propTypes: {
		markup: React.PropTypes.string,
		isEditorActive: React.PropTypes.bool,
		editingContent: React.PropTypes.string,
		dispatch: React.PropTypes.func,
	},

	render() {
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
	const { isEditorActive, editingContent, markup } = state;
	return { isEditorActive, editingContent, markup };
}

export default connect( mapStateToProps )( LoggedIn );
