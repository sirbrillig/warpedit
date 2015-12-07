import React from 'react';
import ReactDOM from 'react-dom';
import classNames from 'classnames';
import debugFactory from 'debug';

const debug = debugFactory( 'warpedit:editor-panel' );

export default React.createClass( {
	displayName: 'EditorPanel',

	propTypes: {
		editableContent: React.PropTypes.string,
		active: React.PropTypes.bool
	},

	getDefaultProps() {
		return {
			content: '',
			active: false
		}
	},

	getInitialState() {
		return {
			content: this.props.content,
		}
	},

	componentWillReceiveProps( nextProps ) {
		debug( 'editing', nextProps.content );
		this.setState( { content: nextProps.content } );
	},

	componentDidUpdate() {
		if ( this.props.active ) {
			ReactDOM.findDOMNode( this.editField ).focus();
		}
	},

	handleChange( event ) {
		this.setState( { content: event.target.value } );
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
