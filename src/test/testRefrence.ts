export function testString() {
    let a = 'somestring'
    let b = a
    console.log(a)
    b = 'something else'
    console.log(a)
}

export function testDate(){
    let a = new Date()
    let b = a
    console.log(a.getTime())
    b = new Date()
    console.log(a.getTime())
}

export function testDate1(){
    let a = new Date()
    let b = a
    console.log(a.getTime())
    b.setDate(a.getDate() + 1)
    console.log(a.getTime())
}
