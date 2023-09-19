class Car {
    constructor(name, brand, color, speed) {
      this.name = name;
      this.brand = brand;
      this.color = color;
      this.speed = speed;
    }
  
    printinfo() {
      console.log(`Назва: ${this.name}`);
      console.log(`Марка: ${this.brand}`);
      console.log(`Колір: ${this.color}`);
      console.log(`Швидкість: ${this.speed} км/год`);
    }
  
    move() {
      console.log(`${this.brand} може рухатись зі швидкістю ${this.speed} км/год`);
    }
  }
  

  function race(car1, car2) {

    console.log("Перша машина:");
    car1.printinfo();
    car1.move();
    console.log();
  
    console.log("Друга машина:");
    car2.printinfo();
    car2.move();
    console.log();
  
    if (car1.speed > car2.speed) {
      console.log(`${car1.brand} Гонить швидше!`);
    } else if (car1.speed < car2.speed) {
      console.log(`${car2.brand} Гонить швидше!`);
    } else {
      console.log(`Однаково гонять.`);
    }
  }
  
  let bmw = new Car("X5", "BMW", "Чорний", 250);
  let audi = new Car("A6", "Audi", "Срібний", 240);
  
  race(bmw, audi);
