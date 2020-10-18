const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const saltRounds = 10;
const jwt = require('jsonwebtoken');

const userSchema = mongoose.Schema({
  firstname: {
      type: String,
      trim: true,
      maxlength: 50
  },
  lastname: {
      type: String,
      maxlength: 50
  },
  email: {
      type: String,
      trim: true,
      unique: 1
  },
  password: {
      type: String,
      minlength: 5
  },
  role: {
      type: Number,
      default: 0
  },
  image: String,
  token: {
      type: String
  },
  tokenExp: {
      type: Number
  }
});

// mongo db 저장하기 전에 function실행
userSchema.pre('save', function(next) {
  let user = this;

  if(user.isModified('password')) {  //비밀번호가 변경될때만 실행
  //Salt를 이용해서 비밀번호를 암호화시킨다.
    bcrypt.genSalt(saltRounds, function(err, salt) {
      if(err) return next(err);
      bcrypt.hash(user.password, salt, function(err, hash) {  //hash: 암호화된 비번
         if(err) return next(err)
         user.password = hash;
         next();
      });
    });
  } else {
      next();
  }
});

userSchema.methods.comparePassword = function(plainPassword, cb) {
    //plainPassword: 1234567 ,  암호화된 비밀번호: $2b$10$aSGm7.ivrWc.N0rlrC.pDeNivEsxrleuexT3rbzimq.s5Q5q.ZMg.
    bcrypt.compare(plainPassword, this.password, function(err, isMatch) {
      if(err) return cb(err);
      cb(null, isMatch);
    });
}

userSchema.methods.generateToken = function(cb) {
    //jsonwebtoken을 이용하여 토큰 생성
    let user = this;
    let token = jwt.sign(user._id.toHexString(), 'secretToken');
    // user._id + 'secretToken' = token
    user.token = token;
    user.save(function(err, user) {
      if(err) return cb(err);
      cb(null, user);
    });
}

userSchema.statics.findByToken = function(token, cb) {
  var user = this;

  // user._id + 'sectetToken' = token
  // 토큰을 decode한다.
  jwt.verify(token, 'secretToken', function(err, decoded) {
    //유저 아이디를 이용해서 유저를 찾은 다음 
    //클라이언트에서 가져온 토큰과 DB에 보관된 토큰이 일치하는지 확인
    user.findOne({"_id": decoded, "token": token}, function(err, user) {
      if(err) return cb(err);
      cb(null, user);
    })
  })
}

const User = mongoose.model('User', userSchema)

module.exports = { User }