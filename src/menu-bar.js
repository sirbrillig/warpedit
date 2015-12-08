import React from 'react';

import store from './lib/store';

export default React.createClass( {
	displayName: 'MenuBar',

	propTypes: {
		editorActive: React.PropTypes.bool,
	},

	getDefaultProps() {
		return {
			editorActive: false
		}
	},

	handleDoneEditing() {
		store.dispatch( { type: 'EDIT_COMPLETE' } );
	},

	renderEditorButtons() {
		return (
			<button className="btn" onClick={ this.handleDoneEditing }>Done</button>
		);
	},

	render() {
		return (
			<div className="warpedit-menu-bar">
			{ this.props.editorActive ? this.renderEditorButtons() : '' }
			</div>
		);
	}
} );
