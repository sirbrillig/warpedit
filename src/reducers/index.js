import { combineReducers } from 'redux';
import editor from './editor';
import auth from './auth';
import post from './post';
import ui from './ui';

export default combineReducers( {
	auth,
	editor,
	post,
	ui,
} );
