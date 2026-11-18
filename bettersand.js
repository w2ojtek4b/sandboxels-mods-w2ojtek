// bettersand.js
// Adds smooth color blending between sand and wet sand, and allows colored water to dye sand.

runAfterLoad(function() {
    function parseRGB(colorStr) {
        if (!colorStr) return null;
        if (colorStr.startsWith("rgb")) {
            var m = colorStr.match(/\d+/g);
            return m ? { r: Number(m.at(0)), g: Number(m.at(1)), b: Number(m.at(2)) } : null;
        }
        if (colorStr.startsWith("#")) {
            var hex = colorStr.slice(1);
            if (hex.length === 3) {
                hex = hex.charAt(0) + hex.charAt(0) + hex.charAt(1) + hex.charAt(1) + hex.charAt(2) + hex.charAt(2);
            }
            return {
                r: parseInt(hex.slice(0, 2), 16),
                g: parseInt(hex.slice(2, 4), 16),
                b: parseInt(hex.slice(4, 6), 16)
            };
        }
        return null;
    }

    // Smooth color transition between dry sand and wet sand
    function blendSandColors(pixel) {
        if (Math.random() > 0.1) return;
        var c1 = parseRGB(pixel.color);
        if (!c1) return;

        var dir = Math.floor(Math.random() * 4);
        var nx = pixel.x + (dir === 0 ? 1 : dir === 1 ? -1 : 0);
        var ny = pixel.y + (dir === 2 ? 1 : dir === 3 ? -1 : 0);

        if (!isEmpty(nx, ny, true)) {
            var other = pixelMap.at(nx).at(ny);
            if (other && (other.element === "sand" || other.element === "wet_sand") && other.element !== pixel.element) {
                var c2 = parseRGB(other.color);
                if (!c2) return;

                var r = Math.round(c1.r * 0.85 + c2.r * 0.15);
                var g = Math.round(c1.g * 0.85 + c2.g * 0.15);
                var b = Math.round(c1.b * 0.85 + c2.b * 0.15);
                pixel.color = "rgb(" + r + "," + g + "," + b + ")";
            }
        }
    }

    // Dye sand using the color of adjacent water
    function absorbWaterColor(pixel) {
        if (Math.random() > 0.25) return;
        var c1 = parseRGB(pixel.color);
        if (!c1) return;

        var dir = Math.floor(Math.random() * 4);
        var nx = pixel.x + (dir === 0 ? 1 : dir === 1 ? -1 : 0);
        var ny = pixel.y + (dir === 2 ? 1 : dir === 3 ? -1 : 0);

        if (!isEmpty(nx, ny, true)) {
            var other = pixelMap.at(nx).at(ny);
            if (other && other.element === "water") {
                var c2 = parseRGB(other.color);
                if (!c2) return;

                var r = Math.round(c1.r * 0.7 + (c2.r * 0.85) * 0.3);
                var g = Math.round(c1.g * 0.7 + (c2.g * 0.85) * 0.3);
                var b = Math.round(c1.b * 0.7 + (c2.b * 0.85) * 0.3);
                pixel.color = "rgb(" + r + "," + g + "," + b + ")";
            }
        }
    }

    var sandList = "sand,wet_sand".split(",");
    sandList.forEach(function(elName) {
        if (elements[elName]) {
            var oldTick = elements[elName].tick;
            elements[elName].tick = function(pixel) {
                if (oldTick) oldTick(pixel);
                blendSandColors(pixel);
                absorbWaterColor(pixel);
            };
        }
    });
});
