import React from 'react'

export default React.createClass( {
	propTypes: {
		url: React.PropTypes.string.isRequired
	},

	render() {
		return (
			<div className="warpedit-preview">
				<iframe className="warpedit-preview-iframe" src={ this.props.url } />
			</div>
		);
	}
} );
