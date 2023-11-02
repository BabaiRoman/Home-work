const telegraf = require("telegraf");
const sqlite3 = require("sqlite3");

const db = new sqlite3.Database("school.db");
const bot = new telegraf.Telegraf("6878336855:AAHjVYWgAj4VDVvXeH6vwdpjgbLMXqZ4Ojo");


function createStudentTable() {
  const query = `CREATE TABLE student (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    login VARCHAR(255) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    name_surname VARCHAR(255) NOT NULL,
    class_id INTEGER NOT NULL
  );`;
  db.run(query);
}

function createClassTable() {
  const query = `CREATE TABLE class (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name VARCHAR(255) NOT NULL,
    teacher_id INTEGER NOT NULL
  );`;
  db.run(query);
}

function createTeacherTable() {
  const query = `CREATE TABLE teacher (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    login VARCHAR(255) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    name_surname VARCHAR(255) NOT NULL
  );`;
  db.run(query);
}

function createMarkTable() {
  const query = `CREATE TABLE mark (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    mark INTEGER NOT NULL,
    student_id INTEGER NOT NULL
  );`;
  db.run(query);
}

async function closeDatabaseConnection() {
  await db.close();
}

bot.on("message", async (ctx) => {
  if (ctx.message.text === "/register") {
    const { login, password, role } = await ctx.ask("Введіть логін, пароль і роль (teacher/student):");

    const user = await db.get("student", { login });
    if (user) {
      ctx.reply("Користувач з таким логіном вже існує.");
      return;
    }

    if (role === "teacher") {
      await db.run(`
        INSERT INTO teacher (login, password, name_surname)
        VALUES (?, ?, ?)`, [login, password, ctx.message.from.username]);
    } else {
      await db.run(`
        INSERT INTO student (login, password, name_surname, class_id)
        VALUES (?, ?, ?, ?)`, [login, password, ctx.message.from.username, 1]);
    }

    ctx.login(login);
    ctx.reply("Ви успішно зареєструвалися.");
  }

  if (ctx.message.text === "/classes") {
    const classes = await db.all("class");
    ctx.reply("Список класів:");
    for (const className of classes) {
      ctx.reply(`* ${className.name}`);
    }
  }

  if (ctx.message.text.startsWith("/students")) {
    const classId = parseInt(ctx.message.text.split(" ")[1]);
    const students = await db.all("student", { class_id });
    ctx.reply("Список учнів у класі:");
    for (const student of students) {
      ctx.reply(`* ${student.name_surname}`);
    }
  }

  if (ctx.message.text.startsWith("/mark")) {
    const mark = parseInt(ctx.message.text.split(" ")[1]);
    const studentId = parseInt(ctx.message.text.split(" ")[2]);
    await db.run(`
      INSERT INTO mark (mark, student_id)
      VALUES (?, ?)`, [mark, studentId]);
    ctx.reply("Оцінка успішно поставлена.");
  }

  bot.on("stop", async () => {
    await closeDatabaseConnection();
  });
});

bot.start();
