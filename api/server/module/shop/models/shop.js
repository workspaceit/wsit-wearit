/* eslint prefer-arrow-callback: 0 */
const _ = require('lodash');
const Schema = require('mongoose').Schema;

const schema = new Schema({
  ownerId: {
    type: Schema.Types.ObjectId,
    index: true
  },
  mallId: {
    type: Schema.Types.ObjectId,
    index: true
  },
  tailor: {
    type: Boolean,
    default: false
  },
  // store name
  name: {
    type: String
  },
  alias: {
    type: String,
    index: true
  },
  email: {
    type: String
  },
  phoneNumber: {
    type: String
  },
  // shop address
  address: {
    type: String
  },
  // Address details provided by Seller, in case of refund or exchange,
  // buyer will get return address details to return back the product to seller)
  returnAddress: {
    type: String
  },
  location: {
    type: [Number], // [<longitude>, <latitude>]
    index: '2d', // create the geospatial index
    default: [0, 0]
  },
  city: {
    type: String
  },
  area: {
    type: String
  },
  state: {
    type: String
  },
  contactEmail: {
    type: String,
    default: 'support@wearit.com.bd'
  },
  contactNumber: {
    type: String,
    default: '01977932748'
  },
  // country dropdown with iso code https://gist.github.com/keeguon/2310008
  country: {
    type: String
  },
  zipcode: {
    type: String
  },
  wholeSeller: {
    type: Boolean,
    default: false
  },
  businessInfo: {
    name: {
      type: String,
      default: ''
    },
    identifier: {
      type: String,
      default: ''
    },
    address: {
      type: String,
      default: ''
    }
  },
  bankInfo: {
    bankName: {
      type: String,
      default: ''
    },
    swiftCode: {
      type: String,
      default: ''
    },
    bankId: {
      type: String,
      default: ''
    },
    bankBranchId: {
      type: String,
      default: ''
    },
    bankBranchName: {
      type: String,
      default: ''
    },
    accountNumber: {
      type: String,
      default: ''
    },
    accountName: {
      type: String,
      default: ''
    }
  },
  socials: {
    facebook: String,
    twitter: String,
    google: String,
    linkedin: String,
    youtube: String,
    instagram: String,
    flickr: String
  },
  socialConnected: {
    facebook: {
      type: Boolean,
      default: false
    },
    twitter: {
      type: Boolean,
      default: false
    },
    google: {
      type: Boolean,
      default: false
    },
    linkedin: {
      type: Boolean,
      default: false
    },
  },
  logoId: {
    type: Schema.Types.ObjectId,
    ref: 'Media'
  },
  bannerId: {
    type: Schema.Types.ObjectId,
    ref: 'Media'
  },
  verified: {
    type: Boolean,
    default: false
  },
  verificationIssueId: {
    type: Schema.Types.ObjectId,
    ref: 'Media'
  },
  nidId: {
    type: Schema.Types.ObjectId,
    ref: 'Media'
  },
  tradeId: {
    type: Schema.Types.ObjectId,
    ref: 'Media'
  },
  eTinId: {
    type: Schema.Types.ObjectId,
    ref: 'Media'
  },
  businessDetailsId: {
    type: Schema.Types.ObjectId,
    ref: 'Media'
  },
  bankDetailsId: {
    type: Schema.Types.ObjectId,
    ref: 'Media'
  },
  storeDetailsId: {
    type: Schema.Types.ObjectId,
    ref: 'Media'
  },
  productsImg: [{
    type: Schema.Types.ObjectId,
    ref: 'Media'
  }],
  activated: {
    type: Boolean,
    default: false
  },
  featured: {
    type: Boolean,
    default: false
  },
  featuredTo: {
    type: Date
  },
  // google analytics code
  gaCode: {
    type: String,
    default: ''
  },
  headerText: {
    type: String,
    default: ''
  },
  notifications: {
    lowInventory: {
      type: Boolean,
      default: true
    }
  },
  // store-wide shipping setting
  storeWideShipping: {
    type: Boolean,
    default: false
  },
  shippingSettings: {
    defaultPrice: {
      type: Number,
      default: 0
    },
    perProductPrice: {
      type: Number,
      default: 0
    },
    perQuantityPrice: {
      type: Number,
      default: 0
    },
    processingTime: {
      type: String,
      default: ''
    },
    shippingPolicy: {
      type: String,
      default: ''
    },
    refundPolicy: {
      type: String,
      default: ''
    },
    shipFrom: {
      // TODO - default is user country
      type: String
    }
  },
  announcement: {
    type: String,
    default: ''
  },
  zoneId: {
    type: Schema.Types.ObjectId,
    ref: 'DeliveryZone',
    index: true
  },
  createdAt: {
    type: Date
  },
  updatedAt: {
    type: Date
  }
}, {
  timestamps: {
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
  },
  minimize: false,
  toObject: {
    virtuals: true
  },
  toJSON: {
    virtuals: true
  }
});

schema.virtual('owner', {
  ref: 'User',
  localField: 'ownerId',
  foreignField: '_id',
  justOne: true
});

schema.virtual('logo', {
  ref: 'Media',
  localField: 'logoId',
  foreignField: '_id',
  justOne: true
});

schema.virtual('banner', {
  ref: 'Media',
  localField: 'bannerId',
  foreignField: '_id',
  justOne: true
});

schema.virtual('verificationIssue', {
  ref: 'Media',
  localField: 'verificationIssueId',
  foreignField: '_id',
  justOne: true
});

schema.virtual('nid', {
  ref: 'Media',
  localField: 'nidId',
  foreignField: '_id',
  justOne: true
});

schema.virtual('trade', {
  ref: 'Media',
  localField: 'tradeId',
  foreignField: '_id',
  justOne: true
});

schema.virtual('eTin', {
  ref: 'Media',
  localField: 'eTinId',
  foreignField: '_id',
  justOne: true
});

schema.virtual('businessDetails', {
  ref: 'Media',
  localField: 'businessDetailsId',
  foreignField: '_id',
  justOne: true
});

schema.virtual('bankDetails', {
  ref: 'Media',
  localField: 'bankDetailsId',
  foreignField: '_id',
  justOne: true
});

schema.virtual('storeDetails', {
  ref: 'Media',
  localField: 'storeDetailsId',
  foreignField: '_id',
  justOne: true
});


schema.virtual('productsImages', {
  ref: 'Media',
  localField: 'productsImg',
  foreignField: '_id',
  justOne: true
});

schema.virtual('zone', {
  ref: 'DeliveryZone',
  localField: 'zoneId',
  foreignField: '_id',
  justOne: true
});




schema.pre('save', async function beforeSave(next) {
  try {
    ['name', 'address', 'returnAddress', 'announcement'].forEach((key) => {
      this[key] = Helper.String.stripTags(this[key]);
    });
    this.headerText = Helper.String.removeScriptTag(this.headerText);

    let alias = this.alias || Helper.String.createAlias(this.name);
    const count = await DB.Shop.count({ alias, _id: { $ne: this._id } });
    if (count) {
      alias = `${alias}-${Helper.String.randomString(5).toLowerCase()}`;
    }

    this.alias = alias.trim();
  } catch (e) {
    Service.Logger.create({
      level: 'error',
      path: 'shop-pre-save',
      error: e
    });
  }

  this._verifiedModified = this.isModified('verified');
  this._activatedModified = this.isModified('activated');
  this._featuredModified = this.isModified('featured');
  next();
});

schema.post('save', async function afterSave(doc, next) {
  try {
    if (doc._verifiedModified || doc._activatedModified || doc._featuredModified) {
      await DB.Product.updateMany({ shopId: doc._id }, {
        $set: {
          shopFeatured: doc.featured,
          shopActivated: doc.activated,
          shopVerified: doc.verified
        }
      });
    }
  } catch (e) {
    Service.Logger.create({
      level: 'error',
      path: 'shop-post-save',
      error: e
    });
  }

  next();
});

schema.method('toJSON', function toJSON() {
  const shop = this.toObject();
  return _.omit(shop, [
    'verificationIssue', 'bankInfo', 'verificationIssueId'
  ]);
});

module.exports = schema;
