import React from 'react';
import ReactDOM from 'react-dom';
import Preview from './preview';

ReactDOM.render(
	<Preview markup="<b class='warpedit-clickable'>hi</b>" />,
	document.getElementById( 'content' )
);
