var totalItems = 800;
var getRandomNumber = BitShadowMachine.Utils.getRandomNumber;
var palette = new BitShadowMachine.ColorPalette();
palette.addColor({
  min: 12,
  max: 24,
  startColor: [248, 215, 173],
  endColor: [230, 186, 131]
}).addColor({
  min: 12,
  max: 24,
  startColor: [244, 192, 157],
  endColor: [218, 149, 103]
}).addColor({
  min: 12,
  max: 24,
  startColor: [255, 243, 216],
  endColor: [230, 210, 167]
}).addColor({
  min: 12,
  max: 24,
  startColor: [250, 219, 142],
  endColor: [222, 182, 84]
}).addColor({
  min: 12,
  max: 24,
  startColor: [252, 221, 205],
  endColor: [219, 164, 134]
});

var klasses = {
  Repeller: Repeller,
  Seeker: Seeker
};

/**
 * Tell BitShadowMachine where to find classes.
 */
BitShadowMachine.Classes = klasses;

var worldA = new BitShadowMachine.World(document.getElementById('worldA'), {
  width: 700,
  height: 450,
  resolution: 4,
  colorMode: 'hsla',
  hue: 0,
  saturation: 0,
  lightness: 0,
  noMenu: true
});

/**
 * Create a new BitShadowMachine system.
 */
BitShadowMachine.System.init(function() {

  this.add('Repeller', {
    G: -1,
    scale: 20,
    mass: 150,
    color: palette.getColor(),
    opacity: 0,
    location: new BitShadowMachine.Vector(worldA.width / 4, worldA.height / 2),
    beforeStep: function() {

      this.mass = Math.abs(SimplexNoise.noise(BitShadowMachine.System.clock * 0.01, 0) * 10);

      for (var i = 0; i < 2; i++) {

        var location = new BitShadowMachine.Vector(-100, worldA.height / 2);

        var offset = new BitShadowMachine.Vector(1, 1);
        offset.normalize();
        offset.rotate(getRandomNumber(0, 360));
        offset.mult(getRandomNumber(0, 5, true));
        location.add(offset);

        var scale = getRandomNumber(.1, 2, true),
            globalMaxSpeed = 5;

        if (getRandomNumber(0, 500) === 100) {
          scale = getRandomNumber(1, 4);
        }

        BitShadowMachine.System.add('Seeker', {
          location: location,
          blur: 0,
          scale: scale,
          mass: BitShadowMachine.Utils.map(scale, .1, 2, 1, 15),
          maxSpeed: globalMaxSpeed,
          color: palette.getColor(),
          opacity: 1,
          checkWorldEdges: false,
          hue: getRandomNumber(0, 30),
          saturation: 0.5,
          lightness: 0.5,
          seekTarget: {
            location: new BitShadowMachine.Vector(worldA.width + 50, worldA.height / 2)
          },
          beforeStep: function() {
            if (this.location.x > worldA.width || this.location.y < 0 || this.location.y > worldA.height) {
              BitShadowMachine.System.destroyItem(this);
            }
            var velMag = this.velocity.mag();
            this.opacity = BitShadowMachine.Utils.map(velMag, 0, globalMaxSpeed, 1, 0.5);
            this.saturation = BitShadowMachine.Utils.map(velMag, 0, globalMaxSpeed, 0.5, 1);
            this.lightness = BitShadowMachine.Utils.map(velMag, 0, globalMaxSpeed, 0.5, 1);
            this.blur = BitShadowMachine.Utils.map(velMag, 0, globalMaxSpeed, 0, 10);
          }
        });
      }
    }
  });
}, worldA, Modernizr);