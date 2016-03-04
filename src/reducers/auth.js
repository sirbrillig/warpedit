const initialState = {};
export default function auth( state = initialState, action ) {
	switch ( action.type ) {
		case 'AUTH_COMPLETE':
			return Object.assign( {}, state, { [ action.site ]: action.token } );
		case 'ERROR':
			const text = action.error.toString();
			if ( text.match( /expired|unauthorized/i ) ) {
				return Object.assign( {}, initialState );
			}
			return state;
	}
	return state;
}
