var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const os = require('os');
const fs = require('fs')

var serveStatic = require('serve-static')

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');

global._r = __dirname

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// app.use('/public', express.static(__dirname + '/public'));
app.use(serveStatic(__dirname + '/public', {
  maxAge: '1d',
  // setHeaders: setCustomCacheControl
}))
// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

function getIPAdress() {
  var interfaces = os.networkInterfaces();
  for (var devName in interfaces) {
      var iface = interfaces[devName];
      for (var i = 0; i < iface.length; i++) {
          var alias = iface[i];
          if (alias.family === 'IPv4' && alias.address !== '127.0.0.1' && !alias.internal) {
              return alias.address;
          }
      }
  }
}
const myIp = getIPAdress();

// const obj = {
//   a: 1,
//   b: function () {
//     console.log('22')
//   }
// }
// const bf = Buffer.from('Buffer',obj);

let str = '',
    obj = {
      a:127,
      b: 22,
      c: function() {

      },
      d: {
        d: 1,
        c: [1,2,{b:3}]
      },
      e: {
        a:1
      }
    };
function jsObjToString(obj,base='\t') {
  const isArray = obj instanceof Array;
  let str = ''
  if(!isArray) {//非数组即对象
    str += "{";
    const keyArr = Object.keys(obj);
    if(keyArr.length>0) {
      for (const key in obj) {
        if (obj.hasOwnProperty(key) && obj[key]) {
          // const element = object[key];
          
          const typeChild = typeof obj[key];
                // console.log(childIsArray,childIsObject)
          if(typeChild.toLowerCase() == 'object') {
            str += '\n' + base + key + ':' + jsObjToString(obj[key],base+'\t') + ',';
          } else {
            const isFn = typeof obj[key] == 'function';
            if(isFn) {
              str += '\n' + base  + key + ':' + obj[key].toString() + ',';
            } else {
              str += '\n' + base  + key + ':' + obj[key] + ',';
            }
          }
          
        }
      }
      str = str + base + '\n}'
    }
  } else {//数组
    str += '[';
    
    obj.map((item,index) => {
      const itemType = typeof item;
      if(itemType.toLowerCase() == 'object'){
        str += '\n ' + base + jsObjToString(item, base+'\t');
      } else if(itemType.toLowerCase() == 'function') {
        str += '\n ' + base + item.toString() + ','
      } else {
        if(index == obj.length-1) {
          str += '\n ' + base + item +',';
        } else {
          str += '\n ' + base + item + ',';
        }
        
      }
    })
    str += ']';
  }
  return str;
}

str = 'const obj =' + jsObjToString(obj);
console.log(str)
fs.writeFile(__dirname+'/log/test.js',str,err=>{
  console.log('写入成功')
  if(err) {
    console.log(err)
  }
});
// console.log('str-->',jsObjToString(obj))
// console.log(bf);
// console.log(bf.toString())
const server = app.listen(9999,() => {
  console.log('服务启动--》',9999);
  console.log('地址为:',myIp+':9999')
})

module.exports = app;
