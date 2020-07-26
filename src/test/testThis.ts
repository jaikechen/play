
export function testThis1() {
    const log1 = new Logger1()
    const { printName, printNameArrow } = log1
    printNameArrow()
    printName()
}


class Logger1 {
    //normal function don't have this when context changed, e.g. assign fun to anthoer varialbe
    printName() {
        this.print(`in normal`);
    }
    //arrow can always invoke this
    printNameArrow = () => this.print('in arrow')
    print(text) {
        console.log(text);
    }
}