import React from 'react';

export default React.createClass( {
	displayName: 'MenuBar',

	propTypes: {
		isEditorActive: React.PropTypes.bool,
		standardButtons: React.PropTypes.arrayOf( React.PropTypes.element ),
		editorButtons: React.PropTypes.arrayOf( React.PropTypes.element ),
	},

	getDefaultProps() {
		return {
			isEditorActive: false,
			standardButtons: [],
			editorButtons: [],
		}
	},

	renderStandardButtons() {
		return (
			<div>
				{ this.props.standardButtons }
			</div>
		);
	},

	renderEditorButtons() {
		return (
			<div>
				{ this.props.editorButtons }
			</div>
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
