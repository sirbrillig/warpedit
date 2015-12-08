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

	componentWillMount() {
		this.updateWarpedit();
	},

	componentDidMount() {
		store.subscribe( this.updateWarpedit );
	},

	getInitialState() {
		return {
			editingContent: '',
			isEditorActive: false,
			editableElements: {},
		}
	},

	updateWarpedit() {
		debug( 'new store state', store.getState() );
		const { isEditorActive, editingContent, editableElements, initialMarkup } = store.getState();
		this.setState( { isEditorActive, editingContent, editableElements, initialMarkup } );
	},

	handleEditElement( elementKey ) {
		store.dispatch( { type: 'EDIT_ELEMENT', elementKey } );
	},

	addClickableElement( element ) {
		const elementKey = getElementKey( element );
		store.dispatch( { type: 'ADD_EDITABLE_ELEMENT', elementKey, content: element.innerHTML } );
	},

	handleMarkupChange( markup ) {
		store.dispatch( { type: 'UPDATE_MARKUP', markup } );
	},

	onEditChange( content ) {
		store.dispatch( { type: 'UPDATE_ELEMENT_CONTENT', content } );
	},

	render() {
		return (
			<div>
				<MenuBar isEditorActive={ this.state.isEditorActive }/>
				<EditorPanel
					active={ this.state.isEditorActive }
					content={ this.state.editingContent }
					onChange={ this.onEditChange }
				/>
				<Preview
					initialMarkup={ this.state.initialMarkup }
					editableElements={ this.state.editableElements }
					onEditElement={ this.handleEditElement }
					addClickableElement={ this.addClickableElement }
					onMarkupChange={ this.handleMarkupChange }
				/>
			</div>
		);
	}
} );
