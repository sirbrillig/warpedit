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
