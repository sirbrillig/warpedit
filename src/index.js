import React from 'react';
import ReactDOM from 'react-dom';
import debugFactory from 'debug';
import get from 'lodash.get';

import Preview from './preview';

const debug = debugFactory( 'warpedit:main' );

function handleClick( event ) {
	const editableHtml = get( event, 'target.innerHTML', '' );
	debug( 'beginning edit for', editableHtml );
}

ReactDOM.render(
	<Preview markup="<b class='warpedit-clickable'>hi</b>" onClick={ handleClick }/>,
	document.getElementById( 'content' )
);
