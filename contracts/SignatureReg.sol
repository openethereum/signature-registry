//! A decentralised registry of 4-bytes signatures => method mappings
//!
//! Copyright 2016 Jaco Greef, Parity Technologies Ltd.
//!
//! Licensed under the Apache License, Version 2.0 (the "License");
//! you may not use this file except in compliance with the License.
//! You may obtain a copy of the License at
//!
//!     http://www.apache.org/licenses/LICENSE-2.0
//!
//! Unless required by applicable law or agreed to in writing, software
//! distributed under the License is distributed on an "AS IS" BASIS,
//! WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
//! See the License for the specific language governing permissions and
//! limitations under the License.

pragma solidity ^0.4.24;


contract SignatureReg {
	// dispatched when a new signature is registered
	event Registered(address indexed creator, bytes4 indexed signature, string method);

	// mapping of signatures to entries
	mapping (bytes4 => string) public entries;

	// the total count of registered signatures
	uint public totalSignatures = 0;

	// constructor with self-registration
	constructor()
		public
	{
		register("register(string)");
	}

	// registers a method mapping
	function register(string _method)
		public
		returns (bool)
	{
		return _register(bytes4(keccak256(bytes(_method))), _method);
	}

	// internal register function, signature => method
	function _register(bytes4 _signature, string _method)
		internal
		returns (bool)
	{
		// only allow new registrations
		if (bytes(entries[_signature]).length != 0) {
			return false;
		}

		entries[_signature] = _method;
		totalSignatures = totalSignatures + 1;
		emit Registered(msg.sender, _signature, _method);
		return true;
	}
}
