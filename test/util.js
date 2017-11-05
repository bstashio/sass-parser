'use strict';

const path					= require('path');
const _							= require('lodash');
const expect				= require('chai').expect;
const app						= require('../index')();
const fixtures_path = path.resolve( path.join( 'test', 'fixtures' ) );

// -----------------------------------------------------------------------------

const util = {
	options	: {},
	fixture	: {},
	verify	: {},
};

// -----------------------------------------------------------------------------

/**
 * Get option key name
 * 
 * @param {string} name
 * @return {string}
 */
util.options.get_key_name = ( name ) =>
{
	
	return app.options.keys[ name ];
	
}
// util.options.get_key_name()



/**
 * Get variable key name
 * 
 * @param {string} name
 * @return {string}
 */
util.options.get_variable_key_name = ( name ) =>
{
	
	return app.options.keys['variable'][ name ];
	
}
// util.options.get_variable_key_name()

// -----------------------------------------------------------------------------

/**
 * Get test fixture dir path
 * 
 * @param {string} name - dir name or relative path
 * @return {string}
 */
util.fixture.dir = ( name ) =>
{
		
	return path.join( fixtures_path, name );
	
};
// util.fixture.dir()



/**
 * Get test fixture path - you can pass dir and file
 * 
 * @param {string} name - dir name
 * @return {string}
 */
util.fixture.path = ( name ) =>
{
	
	return ( file ) => {
		
		if ( ! file )
		{
			file = 'index.sass';
		}

		// -------------------------------------------------------------------------
		
		return path.join( fixtures_path, name, file );
	};
	
};
// util.fixture.path()

// -----------------------------------------------------------------------------

/**
 * Verify object based on test result
 * 
 * @param {object} result
 * @param {array} keys
 * @return {self}
 */
util.verify.object = ( result, keys ) =>
{
				
	expect( result ).to.be.an('object');

	// ---------------------------------------------------------------------------
	
	if ( keys )
	{
		expect( result ).to.have.all.keys(...keys);
	}

	// ---------------------------------------------------------------------------
	
	return this;
	
};
// util.verify.object()



/**
 * Verify variable based on test result
 * 
 * @param {object} result
 * @param {string} key
 * @param {string} value
 * @return {self}
 */
util.verify.variable = ( result, key, value ) =>
{
	
	let keys = util.options.get_key_name('variable');

	// ---------------------------------------------------------------------------
	
	util.verify.object( result, _.keys( keys ) );

	// ---------------------------------------------------------------------------
	
	expect( result[ keys.id ] )
		.to.be.equal( key );

	// ---------------------------------------------------------------------------
	
	expect( result[ keys.name ] )
		.to.be.equal('$' + key );

	// ---------------------------------------------------------------------------
	
	expect( result[ keys.value ] )
		.to.be.equal( value );

	// ---------------------------------------------------------------------------
	
	return this;
	
};
// util.verify.variable()



/**
 * Verify mixin/function based on test result
 * 
 * @param {object} result
 * @param {string} name
 * @param {array} parameters
 * @return {self}
 */
util.verify.chunk = ( result, name, parameters, what ) =>
{
	
	let keys = util.options.get_key_name( what );

	// ---------------------------------------------------------------------------
	
	util.verify.object( result, _.keys( keys ) );

	// ---------------------------------------------------------------------------
		
	expect( result[ keys.name ] )
		.to.be.equal( name );

	// ---------------------------------------------------------------------------
	
	expect( result[ keys.parameters ] )
		.to.be.an('array')
		.to.have.lengthOf( parameters.length );

	// ---------------------------------------------------------------------------
	
	_.forEach( parameters, function( value, key ) {
	
		expect( result[ keys.parameters ][ key ] )
			.to.be.equal( value );
			
	});

	// ---------------------------------------------------------------------------
	
	return this;
	
};
// util.verify.chunk()



/**
 * Verify mixin based on test result
 * 
 * @param {object} result
 * @param {string} name
 * @param {array} parameters
 * @return {self}
 */
util.verify.mixin = ( result, name, parameters ) =>
{
	
	return util.verify.chunk( result, name, parameters, 'mixin' );
	
};
// util.verify.mixin()



/**
 * Verify function based on test result
 * 
 * @param {object} result
 * @param {string} name
 * @param {array} parameters
 * @return {self}
 */
util.verify.function = ( result, name, parameters ) =>
{
	
	return util.verify.chunk( result, name, parameters, 'function' );
	
};
// util.verify.function()

// -----------------------------------------------------------------------------

module.exports = util;
