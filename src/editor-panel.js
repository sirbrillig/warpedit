import React from 'react';
import classNames from 'classnames';
import noop from 'lodash.noop';
import { Editor, EditorState, ContentState } from 'draft-js';

export default React.createClass( {
	displayName: 'EditorPanel',

	propTypes: {
		content: React.PropTypes.string,
		active: React.PropTypes.bool,
		onChange: React.PropTypes.func,
	},

	getDefaultProps() {
		return {
			content: '',
			active: false,
			onChange: noop,
		}
	},

	getInitialState() {
		const contentState = ContentState.createFromText( this.props.content );
		return {
			content: this.props.content,
			editorState: EditorState.createWithContent( contentState ),
		}
	},

	componentWillReceiveProps( nextProps ) {
		const contentState = ContentState.createFromText( nextProps.content );
		console.log( 'updating state' );
		this.setState( {
			content: nextProps.content,
			editorState: EditorState.createWithContent( contentState ),
		} );
	},

	componentDidUpdate() {
		if ( this.props.active && this.editField ) {
			this.editField.focus();
		}
	},

	handleChange( editorState ) {
		const content = editorState.getCurrentContent().getPlainText();
		console.log( 'changed', content );
		this.setState( { editorState, content } );
	},

	render() {
		// TODO: we cannot pass the current content up and back down again, so we
		// need a done button inside of this component, I guess
		const classes = classNames( 'warpedit-editor-panel', { 'is-active': this.props.active } );
		return (
			<div className={ classes }>
				<Editor editorState={ this.state.editorState } onChange={ this.handleChange } ref={ input => this.editField = input } />
			</div>
		);
	}
} );
