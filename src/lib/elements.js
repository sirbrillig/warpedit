import md5 from 'md5';

export function getElementKey( element ) {
	return md5( element.innerHTML );
}
