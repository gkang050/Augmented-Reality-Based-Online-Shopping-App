var cv = require('opencv');
var fs = require('fs');
var gm = require('gm').subClass({imageMagick: true});
// camera properties
var camWidth = 320;
var camHeight = 240;
var camFps = 10;
var camInterval = 1000 / camFps;

// face detection properties
var rectColor = [0, 255, 0];
var rectThickness = 3;

// initialize camera
var camera = new cv.VideoCapture(0);
camera.setWidth(camWidth);
camera.setHeight(camHeight);

module.exports = function (socket) {
  setInterval(function() {
    camera.read(function(err, im) {
      if (err) throw err;
      im.detectObject('./node_modules/opencv/data/haarcascade_mcs_eyepair_big.xml', {}, function(err, faces) {
        if (err) throw err;
        for (var i = 0; i < faces.length; i++) {
        	var face = faces[i];
        	// haarcascade_mcs_eyepair_big
        	//haarcascade_eye
//        	console.log(face);
//        	console.log("length is ="+faces.length);
//        	console.log("x"+face.x);
//        	console.log("y"+face.y);
//        	console.log(face.width);
//        	console.log(face.height);
        	im.rectangle([face.x, face.y], [face.width, face.height], rectColor, rectThickness);
        }
        im.save('out.jpg');
//        
//        var bgImage = 'out.jpg',
//    	frontImage = 'Replace.jpg',
//    	resultImage = 'result.jpg',
//    	xy = '+140+135';
//        
//        gm('out.jpg')
//        .composite('Replace.jpg')
//        .geometry('+100+150')
//        .write('result.jpg', function(err) {
//            if(err) console.log(err);
//        });
//        
//        console.log("here");
        fs.readFile('out.jpg', function(err, buf){
        	socket.emit('frame', { image: true, buffer: buf });
        });
      });
    });
  }, camInterval);
};