const { request } = require('express');
var express = require('express');
var multiparty = require("multiparty");
var router = express.Router();
const fs = require('fs');
const utils = require('../utils/utils');

/* GET home page. */
router.get('/', function(req, res, next) {
  // res.render('index', { title: 'Express' });
  res.redirect('/sendMsg.html')
});

router.post('/sendString',(request, response) => {
  console.log(request.headers)
  console.log('request',request.body.msg)
  fs.writeFileSync(_r+'/log/string.txt',request.body.msg);
  response.send({
    msg: '发送成功',
    code: 0,
  })
})

router.post('/sendImg',(req,res,next) => {
  // console.log(req.body);
  console.log('headers-->',req.headers)
  console.log(req.body,"body")
    //生成multiparty对象，并配置上传目标路径
    var form = new multiparty.Form({ uploadDir: './public/images' });
    form.parse(req, function(err, fields, files) {
        console.log(fields, files,' fields2')
        if (err) {
          console.log(err)
        } else {
            res.json({ imgSrc: files.image[0].path })
        }
    });
})

router.delete('/allImg',(request,response) => {
  utils.delDirs('./public/images');
  response.send({
    msg:'操作成功',
    code: 0
  })
})
module.exports = router;
