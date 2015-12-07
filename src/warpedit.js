import React from 'react';
import get from 'lodash.get';
import debugFactory from 'debug';

import store from './store';
import Preview from './preview';
import EditorPanel from './editor-panel';
import MenuBar from './menu-bar';

const debug = debugFactory( 'warpedit:warpedit' );

export default React.createClass( {
	displayName: 'Warpedit',

	componentDidMount() {
		store.subscribe( this.updateWarpedit );
	},

	getInitialState() {
		return {
			editableContent: '',
			editorActive: false
		}
	},

	updateWarpedit() {
		debug( 'new store state', store.getState() );
		const { editorActive, editableContent } = store.getState();
		this.setState( { editorActive, editableContent } );
	},

	handleClick( event ) {
		const content = get( event, 'target.innerHTML', '' );
		store.dispatch( { type: 'EDIT_TEXT', content } );
	},

	render() {
		return (
			<div>
				<MenuBar editorActive={ this.state.editorActive }/>
				<EditorPanel active={ this.state.editorActive } content={ this.state.editableContent }/>
				<Preview markup="Hello, <span class='warpedit-clickable'>human</span>.<br/><span class='warpedit-clickable'>I hope your day is going well!</span>" onClick={ this.handleClick }/>
			</div>
		);
	}
} );
