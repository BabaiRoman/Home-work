const { Telegraf } = require('telegraf')
const sqlite3 = require('sqlite3').verbose()

const bot = new Telegraf('6373366804:AAE5_alofKpDkRmufoFt3XjEIhcOJufKUgM')

const db = new sqlite3.Database('db.sqlite3')


// Створення таблиці для зберігання користувачів
function createUserTable(){
    const query = `CREATE TABLE Users(
        id INTEGER PRIMARY KEY,
        status varchar(255),
        friend int
    );`
    db.run(query)
}
// createUserTable()
// Додавання нового користувача
function addUser(id){
    const query = `INSERT INTO Users (id, status) VALUES(?,?)`
    db.run(query, [id,"in_search"])
}
// Отримання інформації про користувача
function getUser(id, callback){
    const query = `SELECT status, friend FROM Users WHERE id = ${id}`
    db.get(query, (err, res) => {
        callback(res)
    } )
}
// Оновлення статусу користувача
function updateStatus(id, status){
    const query = `UPDATE Users SET status = '${status}' WHERE id = ${id}`
    db.run(query)
}
// Оновлення інформації про друга користувача
function updateFriend(id, friend){
    const query = `UPDATE Users SET friend = ${friend} WHERE id = ${id}`
    db.run(query)
}
// Отримання списку користувачів, які шукають співрозмовника
function getInSearchUsers(id, callback){
    const query = `SELECT id FROM Users WHERE status = 'in_search' AND id <> ${id}`
    db.all(query, (err, res) => {
        callback(res)
    })
}

// Пошук співрозмовника для користувача
function findFriend(id){
// Ця функція знаходить співрозмовника для користувача з ID `id`.

// По-перше, ми отримуємо список користувачів, які шукають співрозмовника.
    getInSearchUsers(id,(res)=>{
        // Якщо список непорожній, то ми
        if (res.length > 0){
            // вибираємо випадкового користувача з цього списку.
            const index = Math.floor(Math.random()*res.length)
            const randomUser = res[index]
            // оновлюємо статуси користувачів на `meet`.
            updateStatus(id, 'meet')
            updateStatus(randomUser.id, 'meet')
            // зберігаємо ID співрозмовника в таблиці для кожного користувача.
            updateFriend(id, randomUser.id)
            updateFriend(randomUser.id, id)
            // повідомляємо обох користувачів про те, що співрозмовник знайдений.
            bot.telegram.sendMessage(randomUser.id,"Співрозмовника знайдено. Можете спілкуватись")
            bot.telegram.sendMessage(id,"Співрозмовника знайдено. Можете спілкуватись")
        }
    })
}
// Команда /start
bot.start((ctx) =>{
    getUser(ctx.from.id, (res) => {
        // Якщо користувач вже зареєстрований, то
        if (res){
            // ми перевіряємо його статус
            if(res.status == "standart"){
                updateStatus(ctx.from.id, "in_search");
                // повідомляємо користувача, що ми шукаємо співрозмовника.
                ctx.reply('Шукаємо співрозмовника')

                findFriend(ctx.from.id)
            } else if(res.status == "in_search"){
                // якщо статус користувача `in_search`, то ми повідомляємо користувача, що ми вже шукаємо співрозмовника.

                ctx.reply('Ми вже шукаємо співрозмовника')
            } else if(res.status == "meet"){
                ctx.reply('У вас вже є співрозмовник напишіть /stop щоб зупинити бесіду')
            }
        } else{
            // Якщо користувач не зареєстрований, то ми додаємо його до бази даних.

            addUser(ctx.from.id)
            ctx.reply('Шукаємо співрозмовника')
            findFriend(ctx.from.id)
        }
    })
})
// Команда /stop
bot.command("stop", (ctx)=>{
    getUser(ctx.from.id, (res)=>{
        // Якщо користувач зареєстрований, то
        if (res){
            // ми перевіряємо його статус
            if (res.status == "meet"){
                // якщо статус користувача `meet`, то ми

                // оновлюємо його статус на `standart`.
                updateStatus(ctx.from.id, "standart")
                // видаляємо інформацію про співрозмовника з таблиці.
                updateFriend(ctx.from.id, null)
                // оновлюємо статус співрозмовника на `standart`.
                updateStatus(res.friend, 'standart')
                // видаляємо інформацію про співрозмовника з таблиці.
                updateFriend(res.friend, null)
                // повідомляємо користувача про завершення розмови.
                ctx.reply('Розмову закінчено.')
                bot.telegram.sendMessage(res.friend,'Співрозмовник завершив бесіду.')
            } else{
                ctx.reply("У вас немає співрозмовника.")
            }
        }
    })
})

bot.on('text',(ctx)=>{
    getUser(ctx.from.id,(res)=>{
        if (res){
            if (res.status == 'meet'){
                bot.telegram.sendMessage(res.friend,ctx.message.text)
            } else {
                ctx.reply('З ким ви спілкуєтесь?')
            }
        } else {
            ctx.reply('Напишіть /start щоб знайти співрозмовника.')
        }
    })
})

bot.launch()  

