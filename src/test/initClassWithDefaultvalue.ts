class Foo{
  pro1 : string = ''
  pro2 : number = 1
  pro3 : boolean = false
}
function createFoo(option:Partial<Foo>){
  return {
    ...new Foo(),
    ...option
  }
}

const f = createFoo({
  pro1:'iii'
})

console.log(f)

