import { inspect } from "util"

export function testWeakSet() {
	let obj = {}
	const weakSet = new WeakSet()
	console.log('before add:' + weakSet)
	weakSet.add(obj)
	console.log('after add:' +  weakSet)
	obj = null
	console.log('after set null: ' + weakSet)
}

export function inspectWeakSet() {
	let obj = {}
	const weakSet = new WeakSet()
	console.log('before add:' + inspect(weakSet, { showHidden: true }));
	weakSet.add(obj)
	console.log('after add:' +inspect(weakSet, { showHidden: true }));
	obj = null
	console.log('after set null: ' +inspect(weakSet, { showHidden: true }));
}

export function 

/*
// Execute a callback on everything stored inside an object
function execRecursively(fn, subject, _refs = null){
	if(!_refs)
		_refs = new WeakSet();
	
	// Avoid infinite recursion
	if(_refs.has(subject))
		return;

	fn(subject);
	if("object" === typeof subject){
		_refs.add(subject);
		for(let key in subject)
			execRecursively(fn, subject[key], _refs);
	}
}

const foo:any = {
	foo: "Foo",
	bar: {
		bar: "Bar"
	}
};

export  function testWeekSet(){
console.log('--------------------------------------------')
foo.bar.baz = foo; // Circular reference!
execRecursively(obj => console.log(obj), foo);
}
*/