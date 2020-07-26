class A {
  a :number = undefined
}

type DisplayOption<T> = {
  fields : [{
    name : keyof T
    length :number

  }]
}

const d1 :DisplayOption<A> = {
  fields:[{
    name :'a',
    length: 3
  }]
}

export function abc () {
  return 'ddd'
}

export const de = () =>{
  
}