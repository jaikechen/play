# Purpose
Some thoughts on typescirpt/javascript

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
