var getRandomNumber = BitShadowMachine.Utils.getRandomNumber;
var map = BitShadowMachine.Utils.map;
var palette = new BitShadowMachine.ColorPalette();
palette.addColor({
  min: 12,
  max: 24,
  startColor: [196, 213, 86],
  endColor: [166, 183, 56]
}).addColor({
  min: 12,
  max: 24,
  startColor: [56, 139, 126],
  endColor: [26, 109, 96]
}).addColor({
  min: 12,
  max: 24,
  startColor: [104, 233, 212],
  endColor: [74, 203, 182]
}).addColor({
  min: 12,
  max: 24,
  startColor: [233, 158, 104],
  endColor: [203, 128, 74]
}).addColor({
  min: 12,
  max: 24,
  startColor: [191, 75, 49],
  endColor: [171, 55, 19]
});

var klasses = {
  Walker: Walker,
  Flocker: Flocker
};

/**
 * Tell BitShadowMachine where to find classes.
 */
BitShadowMachine.Classes = klasses;

var world = new BitShadowMachine.World(document.getElementById('worldA'), {
  width: 700,
  height: 450,
  resolution: 4,
  colorMode: 'hsla',
  hue: 0,
  saturation: 0,
  lightness: 0,
  noMenu: true
});

var currentBaseHue = 200;
var totalInitialItems = 140;
var seekTarget = null;

var createFlocker = function(props) {
  var location = new BitShadowMachine.Vector(BitShadowMachine.System.firstWorld().width / 2,
        BitShadowMachine.System.firstWorld().height / 2);
  var offset = new BitShadowMachine.Vector(1, 1);
  offset.normalize();
  offset.rotate(getRandomNumber(0, 360));
  offset.mult(getRandomNumber(1, 7, true));
  location.add(offset);

  addFlocker({
    location: location,
    size: 4,
    maxScale: 4,
    hueMin: currentBaseHue,
    hueMax: currentBaseHue + 30,
    massMin: 1,
    massMax: 200,
    maxBlur: 20,
    maxSpeed: 4,
    seekTarget: props.seekTarget
  });
};

var addFlocker = function(props) {

  var mass = getRandomNumber(props.massMin, props.massMax);

  var flocker = BitShadowMachine.System.add('Flocker', {
      beforeStep: function() {
        var mag = this.velocity.mag();
        this.opacity = map(mag, 0, this.maxSpeed * 0.75, 0.35, 1);
        this.blur = map(mag, 0, this.maxSpeed * 0.75, 0, this.maxBlur);
        this.saturation = map(mag, 0, this.maxSpeed * 0.75, 1, 0.25);
        this.lightness = map(mag, 0, this.maxSpeed * 0.75, 0.25, 0.75);
      },
      location: props.location,
      width: props.size,
      height: props.size,
      mass: mass,
      scale: map(mass, props.massMin, props.massMax, 0.25, props.maxScale),
      //scale: 1,
      maxSpeed: props.maxSpeed,
      color: palette.getColor(),
      hue: getRandomNumber(props.hueMin, props.hueMax),
      saturation: 1,
      lightness: 0.5,
      maxBlur: props.maxBlur,
      seekTarget: props.seekTarget,
      maxSteeringForce: 1000
    });
};

var updateHue = function(val) {
  var i, max, items = BitShadowMachine.System.getAllItemsByName('Flocker');
  currentBaseHue = val;
  for (i = 0, max = items.length; i < max; i++) {
    items[i].hue = getRandomNumber(val, val + 30);
  }
};

/**
 * Create a new BitShadowMachine system.
 */
BitShadowMachine.System.init(function() {

  var location = new BitShadowMachine.Vector(BitShadowMachine.System.firstWorld().width / 2,
      BitShadowMachine.System.firstWorld().height / 2);

  seekTarget = this.add('Walker', {
    location: location,
    blur: 0,
    scale: 1,
    hue: 30,
    saturation: 1,
    lightness: 0.5,
    opacity: 1,
    remainsOnScreen: false,
    perlinSpeed: 0.005,
    perlinAccelLow: -1.5,
    perlinAccelHigh: 1.5,
    opacity: 0
  });

  for (var i = 0; i < totalInitialItems; i++) {
    createFlocker({
      seekTarget: seekTarget
    });
  }
}, world, Modernizr);

// update hue or add/remove items
BitShadowMachine.Utils.addEvent(document, 'keyup', function(e) {

  if (e.keyCode >= 48 && e.keyCode <= 57) {
    updateHue(map(e.keyCode, 48, 57, 0, 360));
  }

  switch (e.keyCode) {
    case 189: // remove item
      var items = BitShadowMachine.System.getAllItemsByName('Flocker');
      if (items.length) {
        BitShadowMachine.System.destroyItem(items[items.length - 1]);
      }
      break;
    case 187: // create item
      createFlocker({
        seekTarget: seekTarget
      });
      break;
  }
});