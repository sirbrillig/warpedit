const initialState = {
	editableSelector: '.warpedit-editable',
	postContent: '', // The raw contents of this post
	markup: '', // The current rendered preview of this post
	postId: null,
	site: null,
	slug: '',
};
export default function post( state = initialState, action ) {
	switch ( action.type ) {
		case 'SITE_AND_POST_RECEIVED':
			const { site, postId } = action;
			return Object.assign( {}, state, { site, postId } );
		case 'POST_CONTENT_RECEIVED':
			return Object.assign( {}, state, { postContent: action.markup, slug: action.slug } );
		case 'INITIAL_MARKUP_RECEIVED':
			return Object.assign( {}, state, { markup: action.markup } );
		case 'UPDATED_POST_MARKUP':
			return Object.assign( {}, state, { markup: action.markup } );
	}
	return state;
}
