const express = require('express')
const app = express()
const port = 5000
const bodyParser = require('body-parser');
const { User } = require('./models/User');

const config = require('./config/key');

// bodyParser가 client 에서 오는 정보를 server에서 분석할 수 있게 해준다.
app.use(bodyParser.urlencoded({ extended: true }));    // application/x-www-form-urlencoded 를 분석
app.use(bodyParser.json());                           // application/json 을 분석


const mongoose = require('mongoose');
mongoose.connect(config.mongoURI, {
    useNewUrlParser:true, useUnifiedTopology: true, useCreateIndex: true, useFindAndModify: false   //에러방지
}).then(() => console.log('MongoDB Connected...'))
  .catch(err => console.log(err))

app.get('/', (req, res) => res.send('Hello World!~~^3^'))

app.post('/register', (req, res) => {
    //회원가입할때 필요한 정보들을 client에서 가져오면 그것들을 데이터베이스에 넣어준다.
    const user = new User(req.body)

    user.save((err, userInfo) => {
      if(err) return res.json({ success: false, err })
      return res.status(200).json({ success: true })
    })

})

app.listen(port, () => console.log(`Example app listening at http://localhost:${port}`))