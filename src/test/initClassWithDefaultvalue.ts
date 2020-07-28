export function displayCarByInterface() {
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
}

export function displayCarWithClass(){
  class Car{
    id:number
    name:string
    seats:number = 5
    drivetrain:'FWD'|'AWD' = 'FWD'
  }
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
} 

export function displayCarWithClassContructor(){
  class Car{
    constructor(
    public id:number,
    public name:string,
    public seats:number = 5,
    public drivetrain:'FWD'|'AWD' = 'FWD'
    ){}
  }
  const cars:Car[] = [
    new Car(0,'Camry'),
    new Car(1,'Golf'),
    new Car(3,'Mini',4),
    new Car(4,'Rav4',undefined,'AWD')
  ]
  for (const car of cars){
    console.log(car)
  }
} 

export function displayCarWithClassDefaultValue(){
  class Car{
    id:number
    name:string
    seats:number = 5
    drivetrain:'FWD'|'AWD' = 'FWD'
  }
  const buildCar = (id:number, name:string, partial:Partial<Car>={}) =>({...new Car(),...partial,id,name})

  const cars:Car[] = [
    buildCar(0,'Camry'),
    buildCar(1,'Golf'),
    buildCar(3,'Mini',{seats:4}),
    buildCar(4,'Rav4',{drivetrain:'FWD'})
  ]
  for (const car of cars){
    console.log(car)
  }
} 
