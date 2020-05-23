const multer = require('multer');
const fs = require('fs');
const Image = require('../model/Image');
const Images = require('../model/Images');

const { serverError, clientError, successResponse } = require('../utils/serverResponses');


// SET STORAGE
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
      const dir = 'uploads';
      if (!fs.existsSync(dir)) {
          fs.mkdirSync(dir);
      }
      cb(null, dir);
  },
  filename: function (req, file, cb) {
    cb(null, file.fieldname + '-' + Date.now())
  }
});

const upload = multer({ storage: storage });


module.exports = (app) => {

    app.post('/api/upload_photo', upload.single('picture'), (req, res) => {
     console.log(req.file);
          if(!req.file){
         res.end('no pic');
     }
     var newImage = new Image();
     newImage.imgs.data = fs.readFileSync(req.file.path);
     newImage.imgs.contentType = 'image/jpeg';
     newImage.save((err, item) => {
        if (err) {
            console.error(err);
            return serverError(res);
        }
        console.log(item);
        return successResponse(res, item)
        });
    });

    app.post('/api/upload_photos', upload.array('picture', 10), (req, res) => {
     console.log(req);
     if(!req.files){
         res.end('no pics');
     }
     var newImages = new Images();
     newImages.imgs= req.files.map( (file)=>{
         var data = fs.readFileSync(file.path);
         var contentType = 'image/jpeg';
         return {data: data, contentType: contentType};
     });
     newImages.save((err, item) => {
        if (err) {
            console.error(err);
            return serverError(res);
        }
        console.log(item);
        return successResponse(res, item)
        });
    });

    app.get('/api/get_photo', (req, res) =>{
        Image.findOne({}, function(err, img) {
            if (err)
                res.send(err);
            // console.log(imgs);
            res.contentType('json');
            res.send(img);
        });
    });

    app.get('/api/get_photos', (req, res) =>{
        Images.findOne({}, function(err, imgs) {
            if (err)
                res.send(err);
            // console.log(imgs);
            res.contentType('json');
            res.send(imgs);
        });
    });
};

