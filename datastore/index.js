const fs = require('fs');
const path = require('path');
const _ = require('underscore');
const counter = require('./counter');

var items = {};

// Public API - Fix these CRUD functions ///////////////////////////////////////




exports.create = (text, callback) => {
  counter.getNextUniqueId((err, data) => {
    //path.join(exports.dataDir, ${data}.txt)
    //path.join('/', path.dirname(counter.counterFile), 'dataDir', path.basename(counter.counterFile)
    fs.writeFile(path.join(exports.dataDir, `${data}.txt`), text, (err) => {
      //console.log(exports.dataDir)
      if (err) {
        callback(new Error(`Unable to write counter`));
      } else {
        callback(null, { id: data, text: text });
      }
    });
  });
  // var id = counter.getNextUniqueId();
  // items[id] = text;
  // callback(null, { id, text });
};

exports.readAll = (callback) => {
  // readDir - gets all file name
  // iterate through file names(readDir callback)
  //map read files
  // return mapped array
  var returnArr = [];
  fs.readdir(exports.dataDir, (err, files) => {
    if (err) {
      callback(new Error('Cannot read directory'));
    } else {
      _.each(files, (item) => {
        // fs.readFile((path.join(exports.dataDir + '/' + item)), (err, data) => {
        //   if (err) {
        //     callback (new Error ('Cannot read file in directory'));
        //   } else {
        //     console.log('readall', { id: item.slice(0, 5), text: data.toString() })
        //     returnArr.push({ id: item.slice(0, 5), text: data.toString() })
        //   }
        // })
        returnArr.push({ id: item.slice(0, 5), text: item.slice(0, 5) });
        // console.log('readall', { id: item.slice(0, 5), text: data.toString() })
        // returnArr.push({ id: item.slice(0, 5), text: data.toString() });
      });
      callback(null, returnArr);
    }
  })

  // var data = _.map(items, (text, id) => {
  //   return { id, text };n
  // });
  // callback(null, data);
};

exports.readOne = (id, callback) => {
  fs.readFile(path.join(exports.dataDir, `${id}.txt`), (err, fileData) => {
    if (err) {
      callback(new Error(`Cannot find ${id}.txt`));
    } else {
      callback(null, { id: id, text: fileData.toString() });
    }
  });


  // var result = [];
  // var text = items[id];
  // if (!text) {
  //   callback(new Error(`No item with id: ${id}`));
  // } else {
  //   callback(null, { id, text });
  // }
};

exports.update = (id, text, callback) => {
  // if (!(path.join(exports.dataDir, `${id}.txt`))) {
  //   return `Unable to find ${id}.txt`
  // }
  var fileIsIn;

  fs.exists(path.join(exports.dataDir, `${id}.txt`), (exists) => {
    // if (err) {
    //   callback(new Error('is not finding file'));
    // } else {
      if (exists) {
        fs.writeFile(path.join(exports.dataDir, `${id}.txt`), text, (err) => {
          // if (err) {
          //   callback(new Error(`Unable to find ${id}.txt`));
          // } else {
            //console.log('here', { id: id, text: text })
            callback(null, { id: id, text: text });
          //}
        });
      } else {
        callback(new Error(`Unable to find ${id}.txt`));
      }
    //}
  })

  // var item = items[id];
  // if (!item) {
  //   callback(new Error(`No item with id: ${id}`));
  // } else {
  //   items[id] = text;
  //   callback(null, { id, text });
  // }
};

exports.delete = (id, callback) => {
  var item = items[id];
  delete items[id];
  if (!item) {
    // report an error if item not found
    callback(new Error(`No item with id: ${id}`));
  } else {
    callback();
  }
};

// Config+Initialization code -- DO NOT MODIFY /////////////////////////////////

exports.dataDir = path.join(__dirname, 'data');

exports.initialize = () => {
  if (!fs.existsSync(exports.dataDir)) {
    fs.mkdirSync(exports.dataDir);
  }
};
