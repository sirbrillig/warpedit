import React from 'react';

import store from './lib/store';
import { saveChanges, finishEditing } from './lib/actions';

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
		store.dispatch( finishEditing() );
	},

	handleSave() {
		store.dispatch( saveChanges() );
	},

	renderStandardButtons() {
		return (
			<button className="btn" onClick={ this.handleSave }>Save Changes</button>
		);
	},

	renderEditorButtons() {
		return (
			<button className="btn" onClick={ this.handleDoneEditing }>Done</button>
		);
	},

	render() {
		return (
			<div className="warpedit-menu-bar">
			{ this.props.isEditorActive ? this.renderEditorButtons() : this.renderStandardButtons() }
			</div>
		);
	}
} );
