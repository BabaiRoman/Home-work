const authModule = require('./auth.js');
// const readLine = require('readline')

// // const rl = readLine.createInterface({
// //     input: process.stdin,
// //     output: process.stdout
// // })

var studentUser
var teacherUser

const main = () => {
    if (!studentUser && !teacherUser){
        console.log('Авторизація: \n1: Я вчитель\n2: Я учень')
        authModule.rl.question('',(select)=>{
            switch(select){
                case '1':
                    authModule.authTeacher((teacher) => {
                        teacherUser = teacher
                        main()
                    })
                    break;
                case '2':
                    authModule.authTeacher((student) => {
                        studentUser = student
                        main()
                    })
                    break;
            } 
        })
        
    } else if (teacherUser){
        console.log('You are teacher ')
        console.log(teacherUser.name, teacherUser.surname)
    } else if (studentUser){
        console.log('You are student ')
        console.log(studentUser.name, studentUser.surname)
    }
    
}

main()
