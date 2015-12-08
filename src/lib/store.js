import { createStore } from 'redux';
import debugFactory from 'debug';

const debug = debugFactory( 'warpedit:store' );

const initialState = {
	isEditorActive: false,
	editingKey: '',
	editingContent: '',
	editableElements: {},
	markup: '',
	initialMarkup: 'Hello, <span class="warpedit-clickable">human</span>.<br/><span class="warpedit-clickable">I hope your day is going well!</span>',
};

function updateObject( object, key, value ) {
	return Object.assign( {}, object, { [ key ]: value } );
}

export default createStore( ( state = initialState, action ) => {
	switch ( action.type ) {
		case 'EDIT_ELEMENT':
			debug( 'editing element', action.elementKey );
			return Object.assign( {}, state, { isEditorActive: true, editingKey: action.elementKey, editingContent: state.editableElements[ action.elementKey ] } );
			break;

		case 'UPDATE_ELEMENT_CONTENT':
			return Object.assign( {}, state, { editingContent: action.content } );
			break;

		case 'EDIT_COMPLETE':
			debug( 'applying changes to element', state.editingKey );
			return Object.assign( {}, state, { isEditorActive: false, editingKey: '', editingContent: '', editableElements: updateObject( state.editableElements, state.editingKey, state.editingContent ) } );
			break;

		case 'ADD_EDITABLE_ELEMENT':
			debug( 'adding editable element content', action.elementKey );
			return Object.assign( {}, state, { editableElements: updateObject( state.editableElements, action.elementKey, action.content ) } );
			break;

		case 'UPDATE_MARKUP':
			debug( 'markup changed' );
			return Object.assign( {}, state, { markup: action.markup } );
			break;
	}
	return state;
} );
