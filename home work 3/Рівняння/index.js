const readline = require('readline');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

rl.question('Введіть коефіцієнти a, b і c через пробіл: ', (answer) => {

  let [a, b, c] = answer.split(' ').map(Number);


  let D = b * b - 4 * a * c;


  if (D > 0) {

    let x1 = (-b + Math.sqrt(D)) / (2 * a);
    let x2 = (-b - Math.sqrt(D)) / (2 * a);
    console.log(`Розв'язки рівняння: x1 = ${x1}, x2 = ${x2}`);
  } else if (D == 0) {

    let x = -b / (2 * a);
    console.log(`Розв'язок рівняння: x = ${x}`);
  } else {

    console.log(`Рівняння немає реальних розв'язків`);
  }

  rl.close();
});
