
Some thoughts/best practice/pattern on typescript/javascript

# Class VS Function

when I was researching how to use adal to get a oauth token, then use the token to access dynamics CRM records, I got the following code from internet.
```
import * as adal from 'adal-node';
import * as DynamicsWebApi from "dynamics-web-api";

export class DynamicsConnector {
    authorityUrl: string;
    resource: string;
    clientId: string;
    secret: string;
    adalContext: adal.AuthenticationContext;
    apiUrl: string;
    dynamicsWebApi: any;
    constructor(tenantId: string, resource: string, clientId: string, secret: string) {
        this.authorityUrl = `https://login.microsoftonline.com/${tenantId}/oauth2/token`;
        this.resource = `https://${resource}/`;
        this.apiUrl = resource;
        this.clientId = clientId;
        this.secret = secret
        //create DynamicsWebApi object
        this.dynamicsWebApi = new DynamicsWebApi({
            webApiUrl: `https://${this.apiUrl}/api/data/v9.0/`,
            onTokenRefresh: this.acquireTokens
        });
        this.adalContext = new adal.AuthenticationContext(this.authorityUrl);
    }


    public acquireTokens = (dynamicsCallback: any) => {
        const adalCallback = (error: any, token: any) => {
            if (!error) {
                //call DynamicsWebApi callback only when a token has been retrieved
                dynamicsCallback(token);
            }
            else {
                console.log('Token has not been retrieved. Error: ' + error.stack);
            }
        }
        this.adalContext.acquireTokenWithClientCredentials(this.resource, this.clientId, this.secret, adalCallback)
    }
}
```
it worked when I use the following code to test it. 
```
async function testClass(){
    const api = new DynamicsConnector('','','','').dynamicsWebApi
    const records = await api.retrieveMultiple("leads", ["fullname", "subject"], "statecode eq 0")
}
```
But it doesn't make sense, 
1. I just want to  get an instance of  DynamicsWebApi, I have to initialize another object DynamicConnector
2. The code is not intuitive, only after I looked at the example code, did I realized the Property dynamicsWebApi is the really interface
3. Too much redundant code, in the constructor, it save the parameters to instance properties, then use these instance properties in callback functions
4. Because of too much code, it is not easy to understand the logic. 
the author make things mess by using class

I changed the code as follow, the line count reduced from 35 to 14 lines.


```

export const getDynamicsWebApi = (tenantId: string, resource: string, clientId: string, secret: string) => {
    const authorityUrl = `https://login.microsoftonline.com/${tenantId}/oauth2/token`;
    const authContext = new adal.AuthenticationContext(authorityUrl);
    const dynamicsWebApi = new DynamicsWebApi({
        webApiUrl: `https://${resource}/api/data/v9.0/`,
        onTokenRefresh: (callback) => authContext.acquireTokenWithClientCredentials(
            resource,
            clientId,
            secret,
            (error, token) => error ? console.log(error) : callback(token)
            )
    })
    return dynamicsWebApi
}

```
also the usage is intuitive
```
export async function testFunction(){
    const api = getDynamicsWebApi('','','','')
    const records = await api.retrieveMultiple("leads", ["fullname", "subject"], "statecode eq 0")
}
```
## conclusion
the trend is changing,  when we did c coding, we use function programming; when we did c# and java coding, everything is object.
React team said, class make things complicated, both for computer and people. 
well, the above example proved that.




# initialize object with default value

## interface
In the following example, I want create an array of cars, I created a typescript interface Car. The interface can ensure each object will have id, name, seats, drivetrain. 
It is a simple, safe solution, but it is not convenience. Most of the car has 5 seats and are FWD drivetrain, I would like set seats default to 5 and drivetrain default to FWD. Interface didn't give me default value option.
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
I put all parameter to contractors
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
### a factory method with partial values
her is my final solution, the factory method buildCar received 3 parameter, the first two one are required parameter, all the optional parameter are in the third parameter partial.

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
f = null and delete f are totally different things.
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

so it is a common mistake, referencing to nothing, doesn't mean delete an object.
we never know and can not take control of  when the system decide an object should be deleted.
The fact we need not to / can't delete an object is the reason Java replace c++ , we don't need to manually manage memory.
## a use case of weakset
the following example was given by https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/WeakSet
we use weakset instead of set, because we don't want change system's garbage collection mechanism.
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

# reference in JS  
one day, I watched a video teaching JS by reference and value, the teacher gave an example
```
let a = 'some string'
let b = a
b = 'something else'
```
then he said, by changing b, a also get changed.
I was amazed, by my c# experience
```
let a = 'some string'  // a reference to a string const
let b = a              // b also reference to the string const 'some string'
b = 'something else'   // b reference to another string const 'something else'
```
so no way a could be changed as well. I did a test, add console.log(a) before b='something else' and after b='something else', of course, the console print 'some string' for both cases. then I left a comments to the teacher. he replied, string is primitive, so a won't change. 

I wrote another piece of code,  the two console.log print same value.
```
let a = new Date()
    let b = a
    console.log(a.getTime())
    b = new Date()
    console.log(a.getTime())
```

so the teacher just did not get: 
the assign operator '=', let b reference to another object, so it has nothing to do with a, the correct example should be

```
export function testDate1(){
    let a = new Date()
    let b = a
    console.log(a.getTime())
    b.setDate(b.getDate() + 1)
    console.log(a.getTime())
}
```
here the two console.log print different things.
# vs code extensions 
# ms-mssql.mssql
no need to install the huge sql server client

## steoates.autoimport
it can add import automatically
## Code Spell Checker
if you are using camera naming conventions, it can check spelling for each words
## vscodevim.vim
### map ESC to jj 
after install the extension, press ctrl+shift+X open Extensions Bar, select Vim, select setting in the context menu.
go to vim Handle keys, click edit in setting.json
add the following text 
```
liximomo.sftp
```
    "vim.insertModeKeyBindings": [
        {
            "before": [
                "j",
                "j"
            ],
            "after": [
                "<esc>"
            ]
        }
    ],
``` 
### let vs code handle ctrl + c
add the following text to setting.json
```
"vim.handleKeys": {
        "<C-c>": false,
        "<C-v>": false
},
```
## liximomo.sftp

the directory structure of my website is like following
- node_modules
- *.js
- build/*

the *.js in the root directory is the backend build
the build/* is front end code, so my sftp configuration is like

```
[{
    "name": "dist",
    "host": "app.azurewebsites.windows.net",
    "protocol": "ftp",
    "port": 21,
    "remotePath": "/site/wwwroot",
    "uploadOnSave": false,
    "context": "dist",
    "username": "",
    "password": ""
},
{
    "name": "build",
    "host": "app.ftp.azurewebsites.windows.net",
    "protocol": "ftp",
    "port": 21,
    "remotePath": "/site/wwwroot/build",
    "uploadOnSave": false,
    "context":"src/client/build",
    "username": "",
    "password": ""
}]
```
Each time I want to update frontend,  I press F1, choose SFT - UploadProject, choose project build
Each time I want to update backend,  I press F1, choose SFT - UploadProject, choose project dist

## exclude directory
# deploy to azure
# use global state
# use fetch
# dynamic Orm
# immutable date class
