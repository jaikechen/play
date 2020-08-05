
Some thoughts/best practice/pattern on typescirpt/javascript

# initialize object with default value

## interface
In the following example, I want create an array of cars, I created a typesript interface Car. The interface can ensure each object will have id, name, seats, drivetrain. 
It is a smiple, safe solution, but there are some incevinence. Most of the car has 5 seats and are FWD drivertrain, I would like set seats default to 5 and drivetrain default to FWD. Interface didn't give me default value option.
```
 interface Car {
    id: number
    name: string
    seats: number
    drivetrain:'FWD'|'AWD'

  }
  const cars:Car[] = [
    {
      id:0,
      name:'Camry',
      seats:5,
      drivetrain:'FWD'
    },
    {
      id:1,
      name:'Golf',
      seats:5,
      drivetrain:'FWD'
    }
  ]
  for (const car of cars){
    console.log(car)
  }
```
## class
I changed interface to class, so I can set default value of 'seats' and 'drivetrain'.  
```
 class Car{
    id:number
    name:string
    seats:number = 5
    drivetrain:'FWD'|'AWD' = 'FWD'
  }
```
to let a object has the default value, I have to call the constructor new Car(), so the code ends up to below, which looks odd.
```
  const cars:Car[] = [
    {
      ...new Car(),
      id:0,
      name:'Camry',
    },
    {
      ...new Car(),
      id:1,
      name:'Golf',
    }
  ]
  for (const car of cars){
    console.log(car)
  }
```
## class with constructor
I put all parameter to contructors
```
 class Car{
    constructor(
    public id:number,
    public name:string,
    public seats:number = 5,
    public drivetrain:'FWD'|'AWD' = 'FWD'
    ){}
  }
```
the code looks ok when I was trying to create the first cars
```
 const cars:Car[] = [
    new Car(0,'Camry'),
    new Car(1,'Golf'),
 ]
```
but it looked ugly when I created a car with default seats and special drivetrain. I have to put a undefined if I want to set it to default value.
``` 
    new Car(3,'Mini',4),
    new Car(4,'Rav4',undefined,'AWD')
  ]
  for (const car of cars){
    console.log(car)
  }
```
### a factory method with patial values
her is my final solution, the factory method buildCar recieved 3 parameter, the first two one are required parameter, all the optional parameter are in the third parameter partial.

```
 class Car{
    id:number
    name:string
    seats:number = 5
    drivetrain:'FWD'|'AWD' = 'FWD'
  }
  const buildCar = (id:number, name:string, partial:Partial<Car>={}) =>({...new Car(),...partial,id,name})
```

I like the code  buildCar(3,'Mini',{seats:4}),  and buildCar(4,'Rav4',{drivetrain:'FWD'}), they are easy to read
```
  const cars:Car[] = [
    buildCar(0,'Camry'),
    buildCar(1,'Golf'),
    buildCar(3,'Mini',{seats:4}),
    buildCar(4,'Rav4',{drivetrain:'FWD'})
  ]
  for (const car of cars){
    console.log(car)
  }
```


# weakset 
## a misunderstanding
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
- the first console.log: the weakset is empty
- the second console.log: the weakset has 1 element
- the third console.log: the weakset is empty again.

that was against my instinct, in old c++ days, 
```
Foo * f = new Foo();
f = null;
delete f;
```
f = null and delete f are totally diffrent things.
then for C# or Java, we have no way of deleting an object(free the memory), so I think when we set obj = null, we does not remove obj from weakset. with the help of inspect, I changed the code to
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
- before add:WeakSet {  }
- after add:WeakSet { {} }
- after set null: WeakSet { {} }

so it is a common mistake, refrencing to nothing, doesn't mean delete an object.
we never know and can not take control of  when the system decide an object should be deleted.
The fact we need not to / can't delete an object is the reason Java replace c++ , we don't need to manually manage memory.
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
