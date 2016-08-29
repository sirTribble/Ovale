/*////////////////////////////////////////////////////////////////////
    Copyright (C) 2013, 2014 Johnny C. Lam.
    See the file LICENSE.txt for copying permission.
//*/

import { ovale } from './Ovale';

class BackToFrontIterator<T> {
	constructor(private invariant:LuaTable<T>, public control: number) {}
	Next() {
		this.control = this.control - 1;
		return this.invariant[this.control];
	}
}

class FrontToBackIterator<T> {
	constructor(private invariant:LuaTable<T>, private control: number) {}
	Next() {
		this.control = this.control + 1;
		return this.invariant[this.control];
	}
}

export class OvaleDequeue<T> implements LuaTable<T> {
	first = 0;
	last = -1;
	[index:number]:T;

	constructor(public name:string) {

	}

	InsertFront(element:T) {
		var first = this.first - 1
		this.first = first
		this[first] = element
	}

	InsertBack(element:T) {
		var last = this.last + 1
		this.last = last
		this[last] = element
	}

	RemoveFront() {
		var first = this.first
		var element = this[first]
		if ( element ) {
			this[first] = null
			this.first = first + 1
		}
		return element
	}

	RemoveBack() {
		var last = this.last
		var element = this[last]
		if ( element ) {
			this[last] = null
			this.last = last - 1
		}
		return element
	}

	At(index: number) {
		if ( index > this.Size() ) {
			return
		}
		return this[this.first + index - 1]
	}

	Front() {
		return this[this.first]
	}

	Back() {
		return this[this.last]
	}

	BackToFrontIterator() {
		return new BackToFrontIterator(this, this.last + 1);
	}

	FrontToBackIterator() {
		return new FrontToBackIterator(this, this.first - 1);
	}

	Reset() {
		const iterator = this.BackToFrontIterator();
		while (iterator.Next()) {
			this[iterator.control] = null
		}
		this.first = 0
		this.last = -1
	}

	Size() {
		return this.last - this.first + 1
	}

	DebuggingInfo() {
		ovale.Print("Queue %s has %d item(s), first=%d, last=%d.", this.name, this.Size(), this.first, this.last)
	}
}

// Queue (FIFO) methods
export class OvaleQueue<T> extends OvaleDequeue<T> {
	Insert(value:T) {
		this.InsertBack(value);
	}

	Remove(){
		return this.RemoveFront();
	}

	Iterator(){
		return this.FrontToBackIterator();
	}
}

export class OvaleStack<T> extends OvaleDequeue<T> {
	Push(value:T) {
		this.InsertBack(value);
	}

	Pop() {
		return this.RemoveBack();
	}

	Top(){
		return this.Back();
	}
}

