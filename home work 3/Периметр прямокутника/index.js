const readline = require('readline');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});


rl.question('Введіть ширину прямокутника: ', (width) => {

  rl.question('Введіть висоту прямокутника: ', (height) => {

    width = Number(width);
    height = Number(height);

      let perimeter = 2 * (width + height);
      console.log('Периметр прямокутника дорівнює ' + perimeter + '.');
    

    rl.close();
  });
});