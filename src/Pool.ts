/*////////////////////////////////////////////////////////////////////
    Copyright (C) 2013, 2014 Johnny C. Lam.
    See the file LICENSE.txt for copying permission.
//*/

// Simple resource pool.

import { assert, tinsert, tostring, tremove, wipe } from "stub";
import { ovale } from "Ovale";

var OVALE = "Ovale";

export class OvalePool<T> {
	pool:LuaTable<T> = null
	size = 0
	unused = 0
	
	constructor(public name: string) {
		this.Drain();
	}

	Get() {
		assert(this.pool != null)
		var item = tremove(this.pool)
		if ( item ) {
			this.unused = this.unused - 1
		} else {
			this.size = this.size + 1
			item = <T>{}
		}
		return item
	}

	Release(item:T) {
		assert(this.pool != null)
		var clean = this.clean;
		clean(item)
		wipe(item)
		tinsert(this.pool, item)
		this.unused = this.unused + 1
	}

	clean: (item:T) => void;

	Drain() {
		this.pool = {}
		this.size = this.size - this.unused
		this.unused = 0
	}

	DebuggingInfo() {
		ovale.Print("Pool %s has size %d with %d item(s).", tostring(this.name), this.size, this.unused)
	}
}
