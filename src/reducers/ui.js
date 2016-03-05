const initialState = { isEditorActive: false };
export default function ui( state = initialState, action ) {
	switch ( action.type ) {
		case 'EDIT_ELEMENT':
			return Object.assign( {}, state, { isEditorActive: true } );
		case 'EDIT_COMPLETE':
			return Object.assign( {}, state, { isEditorActive: false } );
	}
	return state;
}
