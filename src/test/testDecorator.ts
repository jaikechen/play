const classRepoMap  = new Map<string,string>()
export function Entity(repoName:string){
    return target=> {
        classRepoMap.set(target.name, repoName)
    }
}

export function getRepoName(object:Object){
    console.log(classRepoMap)
    console.log(object.constructor.name)
    return classRepoMap.get(object.constructor.name)
}

export function Column() {
  return function(target: Object, propertyKey: string) { 
    let value : string;
    const getter = function() {
      return value;
    };
    const setter = function(newVal: string) {
        value = newVal
    }; 
    Object.defineProperty(target, propertyKey, {
      get: getter,
      set: setter
    }); 
  }
}

@Entity('testRepo')
export class Test {
//    static repoName :string
    @Column()
    id :number = 100 
}


export function test() {
    console.log('-------------')
    const t = new Test()
    console.log(getRepoName(t))

    //console.log(t.constructor.name)

    //const pro:any = typeof t
    //console.log(pro.repoName)
    
   // console.log(t)
    //console.log((Test as any).repoName)
}



