/*! SuperSimpleSim v0.1.0 - 2014-05-17 11:16:06
 *  Vince Allen
 *  Brooklyn, NY
 *  vince@vinceallen.com
 *  @vinceallenvince
 *  License: MIT */

window.requestAnimFrame = (function(callback){

return  window.requestAnimationFrame       ||
        window.webkitRequestAnimationFrame ||
        window.mozRequestAnimationFrame    ||
        window.oRequestAnimationFrame      ||
        window.msRequestAnimationFrame     ||
        function(callback) {
          window.setTimeout(callback, 1000 / 60);
        };
})();

var SuperSimpleSim3d = {}, exports = SuperSimpleSim3d;

(function(exports) {

  var Utils = {};

	/**
	 * Re-maps a number from one range to another.
	 *
	 * @function map
	 * @memberof Utils
	 * @param {number} value The value to be converted.
	 * @param {number} min1 Lower bound of the value's current range.
	 * @param {number} max1 Upper bound of the value's current range.
	 * @param {number} min2 Lower bound of the value's target range.
	 * @param {number} max2 Upper bound of the value's target range.
	 * @returns {number} A number.
	 */
  Utils.map = function(value, min1, max1, min2, max2) { // returns a new value relative to a new range
    var unitratio = (value - min1) / (max1 - min1);
    return (unitratio * (max2 - min2)) + min2;
  };

	/**
	 * Converts radians to degrees.
	 *
	 * @function radiansToDegrees
	 * @memberof Utils
	 * @param {number} radians The radians value to be converted.
	 * @returns {number} A number in degrees.
	 */
	Utils.radiansToDegrees = function(radians) {
	  if (typeof radians !== 'undefined') {
	    return radians * (180/Math.PI);
	  } else {
	    if (typeof console !== 'undefined') {
	      console.log('Error: Utils.radiansToDegrees is missing radians param.');
	    }
	    return false;
	  }
	};

  exports.Utils = Utils;

  //

  function Box(options) {
    this.location = {
      x: 300,
      y: 100,
      z: 1
    };
    this.angleX = 0;
    this.angleY = 0;
    this.angleZ = 0;
    this.scale = 1;
    this.width = options.width || 10;
    this.height = options.height || 10;
    this.color = [0, 0, 255];
    this.visibility = 'visible';
    this.opacity = 1;
    this.zIndex = 1;
    this.colorMode = 'rgb';
    this.borderWidth = options.borderWidth || 90,
    this.borderStyle = 'groove',
    this.borderColor = [255, 0, 0]
    this.el = document.getElementById('box');
  }

  Box.prototype.step = function() {
    //this.angleZ = Utils.map(iPhoneAngle, -1, 1, 0, 360);
  };

  exports.Box = Box;

  //

	function System() {

  }

  System.records = [];
  System._stylePosition =
  	'transform: translate3d(<x>px, <y>px, <z>px) rotateX(<angleX>deg) rotateY(<angleY>deg) rotateZ(<angleZ>deg) scale(<scale>, <scale>); ' +
    '-webkit-transform: translate3d(<x>px, <y>px, <z>px) rotateX(<angleX>deg) rotateY(<angleY>deg) rotateZ(<angleZ>deg) scale(<scale>, <scale>); ' +
    '-moz-transform: translate3d(<x>px, <y>px, <z>px) rotateX(<angleX>deg) rotateY(<angleY>deg) rotateZ(<angleZ>deg) scale(<scale>, <scale>); ' +
    '-o-transform: translate3d(<x>px, <y>px, <z>px) rotateX(<angleX>deg) rotateY(<angleY>deg) rotateZ(<angleZ>deg) scale(<scale>, <scale>); ' +
    '-ms-transform: translate3d(<x>px, <y>px, <z>px) rotateX(<angleX>deg) rotateY(<angleY>deg) rotateZ(<angleZ>deg) scale(<scale>, <scale>);';


  System.loop = function() {

    var i, records = System.records;

    // step
    for (i = records.length - 1; i >= 0; i -= 1) {
      record = records[i];
      record.step();
    }

    // draw
    for (i = records.length - 1; i >= 0; i -= 1) {
      record = records[i];
      System.draw(record);
    }

    window.requestAnimFrame(System.loop);
  };

  System.draw = function(obj) {

    var cssText = System.getCSSText({
      x: obj.location.x - (obj.width / 2),
      y: obj.location.y - (obj.height / 2),
      z: obj.location.z,
      angleX: obj.angleX,
      angleY: obj.angleY,
      angleZ: obj.angleZ,
      scale: obj.scale || 1,
      width: obj.autoWidth ? null : obj.width,
      height: obj.autoHeight ? null : obj.height,
      color0: obj.color[0],
      color1: obj.color[1],
      color2: obj.color[2],
      colorMode: obj.colorMode,
      visibility: obj.visibility,
      opacity: obj.opacity,
      zIndex: obj.zIndex,
      borderWidth: obj.borderWidth,
      borderStyle: obj.borderStyle,
      borderColor0: obj.borderColor[0],
      borderColor1: obj.borderColor[1],
      borderColor2: obj.borderColor[2]
    });
    obj.el.style.cssText = cssText;
  };

  System.getCSSText = function(props) {
    return System._stylePosition.replace(/<x>/g, props.x).replace(/<y>/g, props.y).replace(/<z>/g, props.z).replace(/<angleX>/g, props.angleX).replace(/<angleY>/g, props.angleY).replace(/<angleZ>/g, props.angleZ).replace(/<scale>/g, props.scale) + 'width: ' +
        props.width + 'px; height: ' + props.height + 'px; background-color: ' +
        props.colorMode + '(' + props.color0 + ', ' + props.color1 + (props.colorMode === 'hsl' ? '%' : '') + ', ' + props.color2 + (props.colorMode === 'hsl' ? '%' : '') +'); border: ' +
        props.borderWidth + 'px ' + props.borderStyle + ' ' + props.colorMode + '(' + props.borderColor0 + ', ' + props.borderColor1 + (props.colorMode === 'hsl' ? '%' : '') + ', ' + props.borderColor2 + (props.colorMode === 'hsl' ? '%' : '') + '); border-radius: ' +
        props.borderRadius + '%; box-shadow: ' + props.boxShadowOffsetX + 'px ' + props.boxShadowOffsetY + 'px ' + props.boxShadowBlur + 'px ' + props.boxShadowSpread + 'px ' + props.colorMode + '(' + props.boxShadowColor0 + ', ' + props.boxShadowColor1 + (props.colorMode === 'hsl' ? '%' : '') + ', ' + props.boxShadowColor2 + (props.colorMode === 'hsl' ? '%' : '') + '); visibility: ' +
        props.visibility + '; opacity: ' + props.opacity + '; z-index: ' + props.zIndex + '; position: ' +
        props.position + '; padding-top: ' + props.paddingTop + 'px; padding-right: ' + props.paddingRight + 'px; padding-bottom: ' + props.paddingBottom + 'px; padding-left: ' + props.paddingLeft + 'px; margin-top: ' + props.marginTop + 'px;';
  };

  exports.System = System;

}(exports));