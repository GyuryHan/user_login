// process.env.NODE_ENV: 환경변수
if(process.env.NODE_ENV === 'production') {  //배포 후 라면
    module.exports = require('./prod');
} else {
    module.exports = require('./dev');     //개발환경이라면
}