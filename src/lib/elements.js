import md5 from 'md5';

export function getElementKey( element ) {
	if ( element.innerHTML ) {
		return md5( element.innerHTML );
	}
	return md5( element );
}
