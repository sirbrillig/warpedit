import cheerio from 'cheerio';
import debugFactory from 'debug';

const debug = debugFactory( 'warpedit:content' );

// TODO: can we do this with data instead of getting truth from the DOM?
export function applyChangesToContent( postContent, newMarkup, editableSelector ) {
	debug( 'applying changes to content' );
	const findInNewPage = cheerio.load( newMarkup );
	const findInOldPage = cheerio.load( postContent );
	findInOldPage( editableSelector ).toArray().forEach( element => {
		debug( 'examining', element );
		const elementKey = cheerio( element ).data( 'preview-id' );
		if ( ! elementKey ) {
			debug( 'could not find key for element', element );
			return;
		}
		debug( `applying changes to element ${elementKey}`, element );
		const newElementMarkup = findInNewPage( `[data-preview-id='${elementKey}']` ).html();
		if ( ! newElementMarkup ) {
			debug( `no markup found to update element ${elementKey}` );
			return;
		}
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

export function replaceNewlinesWithHtml( content ) {
	return content
	.replace( /\n/g, '<BR/>' );
}

export function stripHtmlFromContent( content ) {
	return content
	.replace( /<BR\s*\/?>/ig, '\n' )
	.replace( /<\/P>/ig, '\n' )
	.replace( /<[^>]+>/g, '' );
}
