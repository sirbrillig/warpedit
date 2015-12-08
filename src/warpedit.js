import React from 'react';
import debugFactory from 'debug';

import store from './lib/store';
import Preview from './preview';
import EditorPanel from './editor-panel';
import MenuBar from './menu-bar';
import { getElementKey } from './lib/elements';

const debug = debugFactory( 'warpedit:warpedit' );

export default React.createClass( {
	displayName: 'Warpedit',

	componentDidMount() {
		store.subscribe( this.updateWarpedit );
	},

	getInitialState() {
		return {
			editingContent: '',
			editorActive: false,
			editableElements: {},
		}
	},

	updateWarpedit() {
		debug( 'new store state', store.getState() );
		const { editorActive, editingContent, editableElements } = store.getState();
		this.setState( { editorActive, editingContent, editableElements } );
	},

	handleEditElement( elementKey ) {
		store.dispatch( { type: 'EDIT_ELEMENT', elementKey } );
	},

	addClickableElement( element ) {
		const elementKey = getElementKey( element );
		store.dispatch( { type: 'ADD_EDITABLE_ELEMENT', elementKey, content: element.innerHTML } );
	},

	handleMarkupChange( newMarkup ) {
		store.dispatch( { type: 'UPDATE_MARKUP', markup: newMarkup } );
	},

	onEditChange( newContent ) {
		store.dispatch( { type: 'UPDATE_ELEMENT_CONTENT', content: newContent } );
	},

	render() {
		return (
			<div>
				<MenuBar editorActive={ this.state.editorActive }/>
				<EditorPanel
					active={ this.state.editorActive }
					content={ this.state.editingContent }
					onChange={ this.onEditChange }
				/>
				<Preview
					markup="Hello, <span class='warpedit-clickable'>human</span>.<br/><span class='warpedit-clickable'>I hope your day is going well!</span>"
					editableElements={ this.state.editableElements }
					onEditElement={ this.handleEditElement }
					addClickableElement={ this.addClickableElement }
					onMarkupChange={ this.handleMarkupChange }
				/>
			</div>
		);
	}
} );
