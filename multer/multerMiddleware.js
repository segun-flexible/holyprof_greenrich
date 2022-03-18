const multer = require("multer");
const { getRandomNumber } = require("../helpers/uniqueID");

var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'public/img/posts')
  },
    filename: function (req, file, cb) {
        req.imageName = "/img/posts/" + file.fieldname + '-' + req.query.id + ".jpg";
    cb(null, file.fieldname + '-' + req.query.id + ".jpg")
  }
})
 
var storage2 = multer.diskStorage({
  destination: function (req, file, cb) {
    //Checking File
    if (file.mimetype == "image/png" || file.mimetype == "image/jpg" || file.mimetype == "image/jpeg") {
      cb(null, 'public/img/proof')
    } else {
      
      return cb(new Error('Only .png, .jpg and .jpeg format allowed!'));
    }
    
    
  },
  filename: function (req, file, cb) {
    req.imageName = "/img/proof/" + file.fieldname + '-' + req.query.id + ".jpg";
    cb(null, file.fieldname + '-' + req.query.id + ".jpg")
  }
});

var userAvatarMulter = multer.diskStorage({
  destination: function (req, file, cb) {
    //Checking File
   
    if (file.mimetype == "image/png" || file.mimetype == "image/jpg" || file.mimetype == "image/jpeg") {
      cb(null, 'public/img/avatar')
    } else {
      
      return cb(new Error('Only .png, .jpg and .jpeg format allowed!'));
    }
    
    
  },
  filename: function (req, file, cb) {

    const randomNo = getRandomNumber(11);

    req.imageName = "/img/avatar/" + file.fieldname + '-' + randomNo + ".jpg";

    cb(null, file.fieldname + '-' + randomNo + ".jpg");

  }
});

var activationFeeMulter = multer.diskStorage({
  destination: function (req, file, cb) {
    //Checking File
   
    if (file.mimetype == "image/png" || file.mimetype == "image/jpg" || file.mimetype == "image/jpeg") {
      cb(null, 'public/img/activation')
    } else {
      
      return cb(new Error('Only .png, .jpg and .jpeg format allowed!'));
    }
    
    
  },
  filename: function (req, file, cb) {
    const randomNo = getRandomNumber(11);
    req.imageName = "/img/activation/" + 'proof' + randomNo + ".jpg";
    cb(null, 'proof' + randomNo + ".jpg")
  }
});

//MERGE
var mergeMulter = multer.diskStorage({
  destination: function (req, file, cb) {
    //Checking File
   
    if (file.mimetype == "image/png" || file.mimetype == "image/jpg" || file.mimetype == "image/jpeg") {
      cb(null, 'public/img/merge')
    } else {
      
      return cb(new Error('Only .png, .jpg and .jpeg format allowed!'));
    }
    
    
  },
  filename: function (req, file, cb) {
    req.imageName = "/img/merge/" + 'proof' + req.query.invId + ".jpg";
    cb(null, 'proof' + req.query.invId + ".jpg")
  }
});


//IDENTITY
var identityMulter = multer.diskStorage({
  destination: function (req, file, cb) {
    //Checking File
   
    if (file.mimetype == "image/png" || file.mimetype == "image/jpg" || file.mimetype == "image/jpeg" || file.mimetype == "image/gif") {
      cb(null, 'public/img/identity')
    } else {
      
      return cb(new Error('Only .png, .jpg and .jpeg format allowed!'));
    }
    
    
  },
  filename: function (req, file, cb) {
   console.log(file)
    req.imageName = "/img/identity/" + file.originalname;
    cb(null, file.originalname)
  }
});


exports.uploadPostImageSettings = multer({
    fileFilter: (req, file, cb) => {
    if (file.mimetype == "image/png" || file.mimetype == "image/jpg" || file.mimetype == "image/jpeg") {
      cb(null, true);
    } else {
      cb(null, false);
      return cb(new Error('Only .png, .jpg and .jpeg format allowed!'));
        }
        
    
    },
    limits: {
        fileSize: 1 * 1024 * 1024 * 1024  // 3 MB
    }
})

exports.uploadPostImage = multer({ storage: storage })
exports.userAvatarMulter = multer({ storage: userAvatarMulter })

exports.paymentProofMulter = multer({ storage: storage2 })
exports.identityMulter = multer({ storage: identityMulter })
exports.activationFeeMulter = multer({ storage: activationFeeMulter })
exports.mergeMulter = multer({ storage: mergeMulter })