import cheerio from 'cheerio';
import debugFactory from 'debug';

const debug = debugFactory( 'warpedit:content' );

// TODO: can we do this with data instead of getting truth from the DOM?
export function applyChangesToContent( postContent, newMarkup, editableSelector ) {
	const findInNewPage = cheerio.load( newMarkup );
	const findInOldPage = cheerio.load( postContent );
	findInOldPage( editableSelector ).toArray().forEach( ( element ) => {
		const elementKey = element.data( 'data-preview-id' );
		// TODO: skip if key not found
		debug( `applying changes to element ${elementKey}`, element );
		const newElementMarkup = findInNewPage( `[data-preview-id='${elementKey}']` ).html();
		// TODO: skip if markup not found
		cheerio( element ).html( newElementMarkup );
	} );
	return findInOldPage.html();
}

export function addElementKeysToMarkup( markup, editableSelector ) {
	const findInNewPage = cheerio.load( markup );
	findInNewPage( editableSelector ).toArray().forEach( ( element, index ) => {
		const elementKey = `warpedit-editable-id-${index}`;
		debug( `adding preview-id to element ${elementKey}` );
		cheerio( element ).attr( 'data-preview-id', elementKey );
	} );
	return findInNewPage.html();
}

export function getElementMarkupForKey( key, markup ) {
	return cheerio( `[data-preview-id='${key}']`, markup ).html();
}

export function updateElementInMarkup( key, content, markup ) {
	const findInPage = cheerio.load( markup );
	findInPage( `[data-preview-id='${key}']` ).html( content );
	return findInPage.html();
}
