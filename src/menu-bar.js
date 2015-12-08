import React from 'react';

import store from './lib/store';

export default React.createClass( {
	displayName: 'MenuBar',

	propTypes: {
		isEditorActive: React.PropTypes.bool,
	},

	getDefaultProps() {
		return {
			isEditorActive: false
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
			{ this.props.isEditorActive ? this.renderEditorButtons() : '' }
			</div>
		);
	}
} );
