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
      console.log(exports.dataDir)
      if (err) {
        callback(new Error(`Unable to write counter`));
      } else {
        callback(null, {id: data, text: text});
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

  fs.readdir(exports.dataDir, (err, files) => {
    var theArray = _.map(files, (item) => {
      fs.readFile((path.join(exports.dataDir + '/' + item)), (err, data) => {

      })
    });
  })
  // var data = _.map(items, (text, id) => {
  //   return { id, text };
  // });
  // callback(null, data);
};

exports.readOne = (id, callback) => {
  var text = items[id];
  if (!text) {
    callback(new Error(`No item with id: ${id}`));
  } else {
    callback(null, { id, text });
  }
};

exports.update = (id, text, callback) => {
  var item = items[id];
  if (!item) {
    callback(new Error(`No item with id: ${id}`));
  } else {
    items[id] = text;
    callback(null, { id, text });
  }
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
