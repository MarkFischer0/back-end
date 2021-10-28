const express = require('express');
const http = require('http');
const cors = require('cors');
const { Console } = require('console');
if (typeof localStorage === "undefined" || localStorage === null) {
  var LocalStorage = require('node-localstorage').LocalStorage;
  localStorage = new LocalStorage('./scratch');
}
const { sequelize, ToDo } = require('./models');

const app = express();

app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use((req, res, next) => {
  console.log('URL = ', req.url);
  console.log('Original_URL = ', req.originalUrl);
  console.log('METHOD = ', req.method);
  console.log('HOST = ', req.headers.host);
  console.log('IsSecure = ', req.secure);
  console.log('BODY', req.body);
  console.log('QUERY', req.query);

  next();
});



http.createServer(app).listen(3000, async() => {
  console.log('Server is working on port 3000');
  await sequelize.sync({ force: true })
})


// function sum(a, b) {
//   console.log(a + b)
// }
// sum(10, 20)

// function reverseCase(s) {
//   s1 = ''
//   for (var i = 0; i < s.length; i++) {
//     if (s[i].toUpperCase() == s[i]) {
//       s1 += s[i].toLowerCase()
//     }
//     else {
//       s1 += s[i].toUpperCase()
//     }
//   }
//   console.log(s1)
// }

// reverseCase("aSdZxC")


// function reverseArray(...stack) {
//   app.get('/', function(req, res) {
//     res.send(stack.reverse())
//   })
// }

// reverseArray(1, 2, 3, 4)


// let string = []

// app.post('/string', (req, res) => {
//   string.push(req.body.arr)
//   res.status(200).json()
// })


// app.get('/string', (req, res, next) => {
//   res.json({string})
// })

// app.delete('/string', (req, res) => {
//   string = []
//   res.status(200).json()
// })


//Сохранение в local 
// app.post('/string1', (req, res) => {
//   localStorage.setItem('test', JSON.stringify(req.body.arr))
//   res.status(200).json()
// })

// app.get('/string1', (req, res, next) => {
//   res.json(localStorage.getItem('test'))
// })
// localStorage.clear()



app.post("/todo", async(req, res) => {
  const { name, description} = req.body
  
  try {
    const task = await ToDo.create({name, description})

    return res.json(task)
  } catch(err) {
    console.log(err)
    return res.status(500).json(err)
  }
})

app.get("/todo", async(req, res) => {
  try {
    const tasks = await ToDo.findAll()
    
    return res.json(tasks)
  } catch(err) {
    console.log(err)
    return res.status(500).json({error: "Ошибка"})
  }
})

app.delete("/todo", async(req, res) => {
  try {
    const task = await ToDo.findOne({ where: { id: req.params.id}})
    
    await task.destroy()
    
    return res.json({message: "Пользователь удалён"})
  } catch(err) {
    console.log(err)
    return res.status(500).json({error: "Ошибка"})
  }
})

app.patch("/todo/:id", async(req, res) => {
  const id = req.params.id;
  try {
    await ToDo.update(req.body, { where: { id: req.params.id } })
  

    return res.json({message: "Изменения успешны"})
  } catch(err) {
    console.log(err)
    return res.status(500).json({error: "Ошибка"})
  }
})
