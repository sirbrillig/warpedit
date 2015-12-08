import React from 'react';
import ReactDOM from 'react-dom';
import classNames from 'classnames';
import noop from 'lodash.noop';

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
		return {
			content: this.props.content,
		}
	},

	componentWillReceiveProps( nextProps ) {
		this.setState( { content: nextProps.content } );
	},

	componentDidUpdate() {
		if ( this.props.active ) {
			ReactDOM.findDOMNode( this.editField ).focus();
		}
	},

	handleChange( event ) {
		const newContent = event.target.value;
		this.setState( { content: newContent }, () => {
			this.props.onChange( newContent );
		} );
	},

	render() {
		const classes = classNames( 'warpedit-editor-panel', { 'is-active': this.props.active } );
		return (
			<div className={ classes }>
				<textarea rows="10" cols="80" onChange={ this.handleChange } value={ this.state.content } ref={ ( input ) => this.editField = input }/>
			</div>
		);
	}
} );
