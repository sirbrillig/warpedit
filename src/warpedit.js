import React from 'react';
import debugFactory from 'debug';
import get from 'lodash.get';

const debug = debugFactory( 'warpedit:warpedit' );

import Preview from './preview';

export default React.createClass( {
	displayName: 'Warpedit',

	handleClick( event ) {
		const editableHtml = get( event, 'target.innerHTML', '' );
		debug( 'beginning edit for', editableHtml );
	},

	render() {
		return (
			<div>
				<Preview markup="<b class='warpedit-clickable'>hi</b>" onClick={ this.handleClick }/>
			</div>
		);
	}
} );
