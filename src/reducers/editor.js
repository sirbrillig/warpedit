const initialState = { editingKey: '', editingContent: '' };
export default function editor( state = initialState, action ) {
	switch ( action.type ) {
		case 'EDIT_ELEMENT':
			return Object.assign( {}, state, { editingKey: action.elementKey, editingContent: action.content } );
		case 'UPDATE_ELEMENT_CONTENT':
			return Object.assign( {}, state, { editingContent: action.content } );
		case 'EDIT_COMPLETE':
			return Object.assign( {}, state, initialState );
	}
	return state;
}
