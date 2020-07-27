# Purpose
Some thoughts on typescirpt/javascript

# weakset and weakmap
## a mistake
In a video teaching weakset and weakmap, the teacher gave an example
```
export function testWeakSet() {
	let obj = {}
	const weakSet = new WeakSet()
	console.log(weakSet)
	weakSet.add(obj)
	console.log(weakSet)
	obj = null
	console.log(weakSet)
}
```
the results of the console.log are
WeakSet { [items unknown] }
WeakSet { [items unknown] }
WeakSet { [items unknown] }
so the teach assumed
the first console.log: the weakset is empty
the second console.log: the weakset has 1 element
the third console.log: the weakset is empty again.

that was against my instinct, in old c++ days, 
```
Foo * f = new Foo();
f = null;
delete f;
```
f = null and delete f are totally diffrent things.
the for C# or Java, we have no way of deleting an object(free the memory), so I think when we set obj = null, we does not remove obj from weakset. with the help of inspect, I changed the code to
```
export function inspectWeakSet() {
	let obj = {}
	const weakSet = new WeakSet()
	console.log('before add:' + inspect(weakSet, { showHidden: true }));
	weakSet.add(obj)
	console.log('after add:' +inspect(weakSet, { showHidden: true }));
	obj = null
	console.log('after set null: ' +inspect(weakSet, { showHidden: true }));
}

```
As I expected, set obj = null, will not remove item from weakset
before add:WeakSet {  }
after add:WeakSet { {} }
after set null: WeakSet { {} }

so it is a common mistake, refrencing to nothing, doesn't mean delete an object.
we never know and can not take control of  when the system decide an object should be remove from the system.
The fact we don't need / can't delete an object is the reason Java replace c++ , we don't need to manually manage memory.
## a usecase of weakset
the following example was given by https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/WeakSet
we use weakset instead of set, because we don't want change system's garbage collection machanism.
```
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
```

# refrence in JS  
one day, I watched a video teaching JS by refrence and value, the teacher gave an example
```
let a = 'somestring'
let b = a
b = 'something else'
```
then he said, by changing b, a also get changed.
I was amazed, by my c# experience
```
let a = 'somestring'  // a refrence to a string const
let b = a              // b also refence to the string const 'somestring'
b = 'something else'   // b refrence to another string const 'something else'
```
so no way a could be changed as well. I did a test, add console.log(a) before b='something else' and after b='something else', of course, the console print 'somestring' for both cases. then I left a comments to the teacher. he replied, strign is primitive, so a won't change. 

I wrote another piece of code,  the two console.log print same value.
```
let a = new Date()
    let b = a
    console.log(a.getTime())
    b = new Date()
    console.log(a.getTime())
```

so the teacher just did not get: 
the assign operator '=', let b refrence to another object, so it has nothing to do with a, the correct example should be

```
export function testDate1(){
    let a = new Date()
    let b = a
    console.log(a.getTime())
    b.setDate(b.getDate() + 1)
    console.log(a.getTime())
}
```
here the two console.log print diffrent things.
