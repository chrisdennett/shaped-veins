export default class Node {
  constructor(parent, position, isTip, ctx, imgData, width) {
    this.parent = parent; // reference to parent node, necessary for vein thickening later
    this.position = position; // {vec2} of this node's position
    this.isTip = isTip; // {boolean}
    this.ctx = ctx; // global canvas context for drawing
    this.imgData = imgData;
    this.width = width;

    this.segmentLength = 5;
    this.useAlpha = false;
    this.renderMode = "lines";
    this.showTips = false;
    this.tipThickness = 2;
    // this.tipColor = "red";
    this.branchColor = "white";
    this.branchThickness = 1;

    if (this.imgData) {
      const { x, y } = this.position;
      const { r, g, b } = this.getPathColourFromImage(
        x,
        y,
        width,
        this.imgData
      );

      // this.ctx.strokeStyle = `hsl(${h}, ${s}%, ${l}%)`;
      this.branchColor = `rgba(${r}, ${g}, ${b}, ${1})`;
    }

    this.influencedBy = []; // references to all Attractors influencing this node each frame
    this.thickness = 0; // thickness - this is increased during vein thickening process
  }

  RGBToHSL(r, g, b) {
    // Make r, g, and b fractions of 1
    r /= 255;
    g /= 255;
    b /= 255;

    // Find greatest and smallest channel values
    let cmin = Math.min(r, g, b),
      cmax = Math.max(r, g, b),
      delta = cmax - cmin,
      h = 0,
      s = 0,
      l = 0;

    // Calculate hue
    // No difference
    if (delta === 0) h = 0;
    // Red is max
    else if (cmax === r) h = ((g - b) / delta) % 6;
    // Green is max
    else if (cmax === g) h = (b - r) / delta + 2;
    // Blue is max
    else h = (r - g) / delta + 4;

    h = Math.round(h * 60);

    // Make negative hues positive behind 360°
    if (h < 0) h += 360;

    // Calculate lightness
    l = (cmax + cmin) / 2;

    // Calculate saturation
    s = delta === 0 ? 0 : delta / (1 - Math.abs(2 * l - 1));

    // Multiply l and s by 100
    s = +(s * 100).toFixed(1);
    l = +(l * 100).toFixed(1);

    return { h, s, l };
  }

  getColorIndicesForCoord(x, y, width) {
    var red = y * (width * 4) + x * 4;
    return [red, red + 1, red + 2, red + 3];
  }

  getPathColourFromImage(x, y, width, imageData) {
    if (!imageData) return;

    var colorIndices = this.getColorIndicesForCoord(x, y, width);
    var r = imageData.data[colorIndices[0]];
    var g = imageData.data[colorIndices[1]];
    var b = imageData.data[colorIndices[2]];

    if (!this.pathColour) {
      return { r, g, b };
    }

    const fracOfNew = 0.02;
    const fracOfOld = 1 - fracOfNew;

    const newR = Math.round(r * fracOfNew + this.pathColour.r * fracOfOld);
    const newG = Math.round(g * fracOfNew + this.pathColour.g * fracOfOld);
    const newB = Math.round(b * fracOfNew + this.pathColour.b * fracOfOld);

    return { r: newR, g: newG, b: newB };
  }

  draw() {
    if (this.parent != null) {
      // Smoothly ramp up opacity based on vein thickness
      if (this.useAlpha) {
        this.ctx.globalAlpha = this.thickness / 3 + 0.2;
      }

      // "Lines" render mode
      if (this.renderMode === "lines") {
        this.ctx.beginPath();

        this.ctx.moveTo(this.position.x, this.position.y);
        this.ctx.lineTo(this.parent.position.x, this.parent.position.y);

        if (this.isTip && this.showTips) {
          this.ctx.strokeStyle = this.tipColor;
          this.ctx.lineWidth = this.tipThickness;
        } else {
          this.ctx.strokeStyle = this.branchColor;
          this.ctx.lineWidth = this.branchThickness + this.thickness;
        }

        this.ctx.stroke();
        this.ctx.lineWidth = 1;
      }

      // Reset global opacity if it was changed due to opacity gradient flag
      if (this.useAlpha) {
        this.ctx.globalAlpha = 1;
      }
    }
  }

  // Create a new node in the provided direction and a pre-defined distance (SegmentLength)
  getNextNode(averageAttractorDirection) {
    this.isTip = false;
    this.nextPosition = this.position.add(
      averageAttractorDirection.multiply(this.segmentLength),
      true
    );

    this.nextPosition.x = Math.round(this.nextPosition.x);
    this.nextPosition.y = Math.round(this.nextPosition.y);

    return new Node(
      this,
      this.nextPosition,
      true,
      this.ctx,
      this.imgData,
      this.width
    );
  }
}
