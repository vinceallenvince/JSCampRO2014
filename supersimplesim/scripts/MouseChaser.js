function MouseChaser(opt_options) {
  var options = opt_options || {};
  options.name = options.name || 'MouseChaser';
  exports.Item.call(this, options);
}
exports.System.extend(MouseChaser, exports.Item);


MouseChaser.map = exports.System.map;

/**
 * Holds the current and last mouse/touch positions relative
 * to the browser window. Also, holds the current mouse velocity.
 * @public
 */
MouseChaser.mouse = {
  location: new exports.Vector(),
  lastLocation: new exports.Vector(),
  velocity: new exports.Vector()
};

/**
 * Adds an event listener to a DOM element.
 *
 * @function _addEvent
 * @memberof System
 * @private
 * @param {Object} target The element to receive the event listener.
 * @param {string} eventType The event type.
 * @param {function} The function to run when the event is triggered.
 */
MouseChaser._addEvent = function(target, eventType, handler) {
  if (target.addEventListener) { // W3C
    target.addEventListener(eventType, handler, false);
  } else if (target.attachEvent) { // IE
    target.attachEvent("on" + eventType, handler);
  }
};

/**
 * Saves the mouse/touch location relative to the browser window.
 *
 * @function _recordMouseLoc
 * @memberof System
 * @private
 */
MouseChaser._recordMouseLoc = function(e) {

  var worldRight = document.body.scrollWidth;
  var worldBottom = document.body.scrollHeight;

  this.mouse.lastLocation.x = this.mouse.location.x;
  this.mouse.lastLocation.y = this.mouse.location.y;

  /**
   * Mapping window size to world size allows us to
   * lead an agent around a world that's not bound
   * to the window.
   */
  if (e.pageX && e.pageY) {
    this.mouse.location.x = this.map(e.pageX, 0, window.innerWidth, 0, worldRight);
    this.mouse.location.y = this.map(e.pageY, 0, window.innerHeight, 0, worldBottom);
  } else if (e.clientX && e.clientY) {
    this.mouse.location.x = this.map(e.clientX, 0, window.innerWidth, 0, worldRight);
    this.mouse.location.y = this.map(e.clientY, 0, window.innerHeight, 0, worldBottom);
  }

  this.mouse.velocity.x = this.mouse.lastLocation.x - this.mouse.location.x;
  this.mouse.velocity.y = this.mouse.lastLocation.y - this.mouse.location.y;
};
/**
 * Applies forces to item.
 */
MouseChaser.prototype.step = function() {
  this.applyForce(exports.System.gravity);
  this.applyForce(exports.System.wind);

  var t = {
    location: new exports.Vector(MouseChaser.mouse.location.x,
        MouseChaser.mouse.location.y)
  };
  this.applyForce(this._seek(t));

  this.velocity.add(this.acceleration);
  this.velocity.limit(this.maxSpeed, this.minSpeed);
  if (this.velocity.mag() > 0.1) {
        this.angle = MouseChaser.radiansToDegrees(Math.atan2(this.velocity.y, this.velocity.x));
      }
  this.location.add(this.velocity);
  if (this.checkWorldEdges) {
    this._checkWorldEdges();
  } else {
    this._wrapWorldEdges();
  }
  this.acceleration.mult(0);
};

/**
 * Calculates a steering force to apply to an object seeking another object.
 *
 * @param {Object} target The object to seek.
 * @returns {Object} The force to apply.
 * @private
 */
MouseChaser.prototype._seek = function(target) {

  var world = this.world,
    desiredVelocity = exports.Vector.VectorSub(target.location, this.location),
    distanceToTarget = desiredVelocity.mag();

  desiredVelocity.normalize();

  if (distanceToTarget < world.width / 2) { // slow down to arrive at target
    var m = Utils.map(distanceToTarget, 0, world.width / 2, 0, this.maxSpeed);
    desiredVelocity.mult(m);
  } else {
    desiredVelocity.mult(this.maxSpeed);
  }

  desiredVelocity.sub(this.velocity);
  desiredVelocity.limit(this.maxSteeringForce);

  return desiredVelocity;
};

/**
 * Saves the current and last mouse position on mousemove.
 */
MouseChaser._addEvent(document, 'mousemove', function(e) {
  MouseChaser._recordMouseLoc.call(MouseChaser, e);
});

/**
 * Converts radians to degrees.
 *
 * @function radiansToDegrees
 * @memberof Utils
 * @param {number} radians The radians value to be converted.
 * @returns {number} A number in degrees.
 */
MouseChaser.radiansToDegrees = function(radians) {
  if (typeof radians !== 'undefined') {
    return radians * (180/Math.PI);
  } else {
    if (typeof console !== 'undefined') {
      console.log('Error: Utils.radiansToDegrees is missing radians param.');
    }
    return false;
  }
};