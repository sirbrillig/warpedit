import cheerio from 'cheerio';
import debugFactory from 'debug';
import { getElementKey } from '../lib/elements';

const debug = debugFactory( 'warpedit:content' );

export function applyChangesToContent( postContent, newMarkup, editableSelector ) {
	const findInNewPage = cheerio.load( newMarkup );
	const findInOldPage = cheerio.load( postContent );
	findInOldPage( editableSelector ).toArray().forEach( ( element ) => {
		const elementKey = getElementKey( cheerio( element ).html() );
		debug( `applying changes to element ${elementKey}` );
		const newElementMarkup = findInNewPage( `[data-preview-id='${elementKey}']` ).html();
		cheerio( element ).html( newElementMarkup );
	} );
	return findInOldPage.html();
}
