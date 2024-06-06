const Joi = require('joi');
const nconf = require('nconf');
const url = require('url');

/**
 * /register for shop
 */
exports.register = async (req, res, next) => {
  const schema = Joi.object().keys({
    name: Joi.string().required(),
    email: Joi.string().email().required(), // email of shop, or useremail
    password: Joi.string().min(6).optional(),
    phoneNumber: Joi.string().required(),
    address: Joi.string().required(),
    city: Joi.string().required(),
    state: Joi.string().required(),
    country: Joi.string().required(),
    zipcode: Joi.string().allow(['', null]).optional(),
    verificationIssueId: Joi.string().optional(),
    area: Joi.string().optional(),
    mallId: Joi.string().optional(),
    tailor: Joi.boolean().optional(),
    wholeSeller: Joi.boolean().optional(),
    zoneId: Joi.string().required(),
    // nid: Joi.object().required(),
    // productImages: Joi.array().required()
  });

  // console.log("=========================");
  // console.log(req.files);
  // console.log("=========================");

  // console.log(req.productImages);
  const validate = Joi.validate(req.body, schema);
  if (validate.error) {
    return next(PopulateResponse.validationError(validate.error));
  }

  try {
    let user = req.user;
    if (user && user.isShop) {
      return next(PopulateResponse.error({
        message: 'Your account has already registered with a shop. please try to login'
      }, 'ERR_ACCOUNT_HAVE_SHOP'));
    } else if (!user) {
      const count = await DB.User.count({
        email: validate.value.email.toLowerCase()
      });
      if (count) {
        return next(PopulateResponse.error({
          message: 'This email has already token'
        }, 'ERR_EMAIL_ALREADY_TAKEN'));
      }

      user = new DB.User(validate.value);
      user.emailVerifiedToken = Helper.String.randomString(48);
      await user.save();

      // now send email verificaiton to user
      await Service.Mailer.send('verify-email.html', user.email, {
        subject: 'Verify email address',
        emailVerifyLink: url.resolve(nconf.get('baseUrl'), `v1/auth/verifyEmail/${user.emailVerifiedToken}`)
      });
    }

    const shop = new DB.Shop(validate.value);
    shop.location = await Service.Shop.getLocation(validate.value);
    shop.ownerId = user._id;




    let nidFile = req.files.nid[0]
    let nidFileID;

    let tradeFile = req.files.trade[0]
    let tradeID;

    let eTinFile = req.files.eTin[0]
    let eTinID;

    let bankDetailsFile = req.files.bankDetails[0]
    let bankDetailsID;

    let businessDetailsFile = req.files.businessDetails[0]
    let businessDetailsID;

    let storeDetailsFile = req.files.storeDetails[0]
    let storeDetailsID;

    let productFiles = req.files.productImages;
    let productFilesIds = [];

    const nid = await uploadFile(nidFile);
    nidFileID = nid._id;

    const trade = await uploadFile(tradeFile);
    tradeID = nid._id;

    const eTin = await uploadFile(eTinFile);
    eTinID = eTin._id;

    const bankDetails = await uploadFile(bankDetailsFile);
    bankDetailsID = bankDetails._id;

    const businessDetails = await uploadFile(businessDetailsFile);
    businessDetailsID = businessDetails._id;

    const storeDetails = await uploadFile(storeDetailsFile);
    storeDetailsID = storeDetails._id;


    await asyncForEach(productFiles, async (productFile, index, array) => {
      let file = await uploadFile(productFile);
      productFilesIds.push(file._id);
    })


    shop.nidId = nidFileID;
    shop.tradeId = tradeID;
    shop.eTinId = eTinID;
    shop.businessDetailsId = businessDetailsID;
    shop.bankDetailsId = bankDetailsID;
    shop.storeDetailsId = storeDetailsID;
    shop.productsImg = productFilesIds;
    shop.verificationIssueId = "6193721d60668c5d382047c3";


    await shop.save();
    await DB.User.update({ _id: user._id }, {
      $set: {
        isShop: true,
        shopId: shop._id
      }
    });

    // send alert email to admin
    if (process.env.EMAIL_NOTIFICATION_NEW_SHOP) {
      await Service.Mailer.send('shop/new-shop-register.html', process.env.EMAIL_NOTIFICATION_NEW_SHOP, {
        subject: 'New registered shop',
        shop: shop.toObject(),
        user: user.toObject(),
        shopUpdateUrl: url.resolve(process.env.adminWebUrl, `shops/update/${shop._id}`)
      });
    }


    // console.log("=============");
    // console.log(nidFileID, tradeID, eTinID, bankDetailsID, businessDetailsID, storeDetailsID, productFilesIds);
    // console.log("=============");


    // console.log();

    res.locals.register = shop;
    return next();
  } catch (e) {
    return next(e);
  }
};







exports.shopRegister = async (req, res, next) => {
  // const schema = Joi.object().keys({
  //   name: Joi.string().required(),
  //   email: Joi.string().email().required(), // email of shop, or useremail
  //   password: Joi.string().min(6).optional(),
  //   phoneNumber: Joi.string().required(),
  //   address: Joi.string().required(),
  //   city: Joi.string().required(),
  //   state: Joi.string().required(),
  //   country: Joi.string().required(),
  //   zipcode: Joi.string().allow(['', null]).optional(),
  //   verificationIssueId: Joi.string().optional(),
  //   area: Joi.string().optional(),
  //   mallId: Joi.string().optional(),
  //   tailor: Joi.boolean().optional(),
  //   wholeSeller: Joi.boolean().optional(),
  //   // nid: Joi.object().required(),
  //   // productImages: Joi.array().required()
  // });

  // // console.log("=========================");
  // // console.log(req.files);
  // // console.log("=========================");

  // // console.log(req.productImages);
  // const validate = Joi.validate(req.body, schema);
  // if (validate.error) {
  //   return next(PopulateResponse.validationError(validate.error));
  // }

  // try {
  //   let user = req.user;
  //   if (user && user.isShop) {
  //     return next(PopulateResponse.error({
  //       message: 'Your account has already registered with a shop. please try to login'
  //     }, 'ERR_ACCOUNT_HAVE_SHOP'));
  //   } else if (!user) {
  //     const count = await DB.User.count({
  //       email: validate.value.email.toLowerCase()
  //     });
  //     if (count) {
  //       return next(PopulateResponse.error({
  //         message: 'This email has already token'
  //       }, 'ERR_EMAIL_ALREADY_TAKEN'));
  //     }

  //     user = new DB.User(validate.value);
  //     user.emailVerifiedToken = Helper.String.randomString(48);
  //     await user.save();

  //     // now send email verificaiton to user
  //     await Service.Mailer.send('verify-email.html', user.email, {
  //       subject: 'Verify email address',
  //       emailVerifyLink: url.resolve(nconf.get('baseUrl'), `v1/auth/verifyEmail/${user.emailVerifiedToken}`)
  //     });
  //   }

  //   const shop = new DB.Shop(validate.value);
  //   shop.location = await Service.Shop.getLocation(validate.value);
  //   shop.ownerId = user._id;




  //   let nidFile = req.files.nid[0]
  //   let nidFileID;

  //   let tradeFile = req.files.trade[0]
  //   let tradeID;

  //   let eTinFile = req.files.eTin[0]
  //   let eTinID;

  //   let bankDetailsFile = req.files.bankDetails[0]
  //   let bankDetailsID;

  //   let businessDetailsFile = req.files.businessDetails[0]
  //   let businessDetailsID;

  //   let storeDetailsFile = req.files.storeDetails[0]
  //   let storeDetailsID;

  //   let productFiles = req.files.productImages;
  //   let productFilesIds = [];

  //   const nid = await uploadFile(nidFile);
  //   nidFileID = nid._id;

  //   const trade = await uploadFile(tradeFile);
  //   tradeID = nid._id;

  //   const eTin = await uploadFile(eTinFile);
  //   eTinID = eTin._id;

  //   const bankDetails = await uploadFile(bankDetailsFile);
  //   bankDetailsID = bankDetails._id;

  //   const businessDetails = await uploadFile(businessDetailsFile);
  //   businessDetailsID = businessDetails._id;

  //   const storeDetails = await uploadFile(storeDetailsFile);
  //   storeDetailsID = storeDetails._id;


  //   await asyncForEach(productFiles, async (productFile, index, array) => {
  //     let file = await uploadFile(productFile);
  //     productFilesIds.push(file._id);
  //   })


  //   shop.nidId = nidFileID;
  //   shop.tradeId = tradeID;
  //   shop.eTinId = eTinID;
  //   shop.businessDetailsId = businessDetailsID;
  //   shop.bankDetailsId = bankDetailsID;
  //   shop.storeDetailsId = storeDetailsID;
  //   shop.productsImg = productFilesIds;
  //   shop.verificationIssueId = "6193721d60668c5d382047c3";


  //   await shop.save();
  //   await DB.User.update({ _id: user._id }, {
  //     $set: {
  //       isShop: true,
  //       shopId: shop._id
  //     }
  //   });

  //   // send alert email to admin
  //   if (process.env.EMAIL_NOTIFICATION_NEW_SHOP) {
  //     await Service.Mailer.send('shop/new-shop-register.html', process.env.EMAIL_NOTIFICATION_NEW_SHOP, {
  //       subject: 'New registered shop',
  //       shop: shop.toObject(),
  //       user: user.toObject(),
  //       shopUpdateUrl: url.resolve(process.env.adminWebUrl, `shops/update/${shop._id}`)
  //     });
  //   }


  //   // console.log("=============");
  //   // console.log(nidFileID, tradeID, eTinID, bankDetailsID, businessDetailsID, storeDetailsID, productFilesIds);
  //   // console.log("=============");


  //   // console.log();

  //   res.locals.register = shop;
  //   return next();
  // } catch (e) {
  //   return next(e);
  // }
};

async function uploadFile(file) {
  const nid = new DB.Media({
    type: 'file',
    systemType: 'verification_issue',
    name: file.filename,
    mimeType: file.mimetype,
    originalPath: file.path,
    filePath: file.path,
    convertStatus: 'done'
  });
  let save = await nid.save();
  return save;
}



exports.uploadDocument = async (req, res, next) => {
  try {
    if (!req.file) {
      // TODO - verify about file size, and type
      return next(PopulateResponse.error({
        message: 'Missing file!'
      }, 'ERR_MISSING_FILE'));
    }

    const file = new DB.Media({
      type: 'file',
      systemType: 'verification_issue',
      name: req.file.filename,
      mimeType: req.file.mimetype,
      originalPath: req.file.path,
      filePath: req.file.path,
      convertStatus: 'done'
    });
    await file.save();

    res.locals.document = {
      _id: file._id,
      name: req.file.filename
    };
    return next();
  } catch (e) {
    return next(e);
  }
};

async function asyncForEach(array, callback) {
  for (let index = 0; index < array.length; index++) {
    await callback(array[index], index, array)
  }
}
