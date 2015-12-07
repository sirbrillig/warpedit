import { createStore } from 'redux';

const initialState = {
	editorActive: false,
	editableContent: ''
};

export default createStore( ( state = initialState, action ) => {
	switch ( action.type ) {
		case 'EDIT_TEXT':
			return Object.assign( {}, state, { editorActive: true, editableContent: action.content } );
	}
	return state;
} );
