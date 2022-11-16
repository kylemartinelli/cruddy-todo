const fs = require('fs');
const path = require('path');
const _ = require('underscore');
const counter = require('./counter');

const Promise = require('bluebird');
const readFilePromise = Promise.promisify(fs.readFile)

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

  fs.readdir(exports.dataDir, (err, files) => {
    if (err) {
      throw ('error reading data folder');
    }
    var data = _.map(files, (file) => {
      var id = path.basename(file, '.txt');
      var filepath = path.join(exports.dataDir, file);
      return readFilePromise(filepath).then(fileData => {
        return {
          id: id,
          text: fileData.toString()
        };
      });
    });
    Promise.all(data)
      .then(items => callback(null, items), err => callback(err));
  });
  };

// exports.readAll = (callback) => {
//   // readDir - gets all file name
//   // iterate through file names(readDir callback)
//   //map read files
//   // return mapped array

//   fs.readdir(exports.dataDir, (err, files) => {
//     if (err) {
//       console.log('1')
//       callback (new Error('Cannot read directory'));
//     }

//     var data = _.map(files, (file) => {
//       var id = path.basename(file, '.txt');
//       var filepath = path.join(exports.dataDir, file);
//       return readFilePromise(filepath).then(fileData => {
//         return {
//           id: id,
//           text: fileData.toString()
//         };
//       });
//     });

//     // var data = _.map(files, (item) => {
//     //   // var id = path.basename(item, '.txt')
//     //   console.log('2')
//     //   return readFilePromise(item).then((fileData) => {
//     //     console.log('3')
//     //     return {
//     //       id: item.slice(0, 5),
//     //       text: fileData.toString()
//     //     }
//     //   })
//     // })

//     Promise.all(data)
//     .then(items => callback(null, items), err => callback(err));

//   })
// }


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
  fs.exists(path.join(exports.dataDir, `${id}.txt`), (exists) => {
    if (exists) {
      fs.writeFile(path.join(exports.dataDir, `${id}.txt`), text, (err) => {
        callback(null, { id: id, text: text });
      });
    } else {
      callback(new Error(`Unable to find ${id}.txt`));
    }
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
  fs.unlink(path.join(exports.dataDir, `${id}.txt`), (err) => {
    if (err) {
      callback(new Error(`Unable to find ${id}.txt to delete`));
    } else {
      callback()
    }
  });

  // var item = items[id];
  // delete items[id];
  // if (!item) {
  //   // report an error if item not found
  //   callback(new Error(`No item with id: ${id}`));
  // } else {
  //   callback();
  // }
};

// Config+Initialization code -- DO NOT MODIFY /////////////////////////////////

exports.dataDir = path.join(__dirname, 'data');

exports.initialize = () => {
  if (!fs.existsSync(exports.dataDir)) {
    fs.mkdirSync(exports.dataDir);
  }
};
