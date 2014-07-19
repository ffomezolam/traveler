/**
 * Exports object containing utility functions for handling points and
 * distances on a sphere
 *
 * Special help with formulas from
 * http://www.movable-type.co.uk/scripts/latlong.html
 *
 * @module traveler
 */
(function(name, context, definition) {
    if(typeof module !== 'undefined' && module.exports) module.exports = definition();
    else if(typeof define === 'function' && define.amd) define(definition);
    else context[name] = definition();
})('Traveler', this, function() {
    function isArray(o) {
        return Object.prototype.toString.call(o) === "[object Array]";
    }

    function deg2rad(d) {
        return d * (Math.PI / 180);
    }

    function rad2deg(r) {
        return r * (180 / Math.PI);
    }

    function processCoordinate(a) {
        var out = {};

        if(isArray(a)) {
            out.lat = a[0];
            out.lng = a[1];
        } else if(typeof a == 'object') {
            out.lat = a.lat;
            out.lng = a.lng;
        }

        out.lat = limit(out.lat, -90, 90);
        out.lng = limit(out.lng, -180, 180);

        return out;
    }

    function wrap(i, l, h) {
        var r = h - l;
        var i = i - l;
        while(i > r) i -= r;
        while(i < 0) i += r;
        return i + l;
    }

    function limit(i, l, h) {
        if(i > h) return h;
        if(i < l) return l;
        return i;
    }

    var precision = 6; // module-wide precision for decimal output
    var R = 6371; // Earth's radius in km

    /**
     * Static class containing methods for handling points and distances on
     * a sphere
     *
     * @class Traveler
     * @static
     */
    var Traveler = {
        /**
         * Get distance between two coordinates
         * TODO: allow for various types of arguments
         *
         * @method distance
         * @param {Object} c1 Coordinate 1
         * @param {Object} c2 Coordinate 2
         * @return {Number} Distance (km)
         */
        distance: function(c1, c2) {
            c1 = processCoordinate(c1);
            c2 = processCoordinate(c2);

            var lat1 = deg2rad(c1.lat);
                lat2 = deg2rad(c2.lat);
                diflat = deg2rad(c2.lat - c1.lat),
                diflng = deg2rad(c2.lng - c1.lng);

            var sinlat = Math.sin(diflat / 2),
                sinlng = Math.sin(diflng / 2);

            var a = sinlat * sinlat + Math.cos(lat1) * Math.cos(lat2) * sinlng * sinlng;
            var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

            return parseFloat((R * c).toFixed(precision));
        },

        /**
         * Get point at distance and bearing from given points
         *
         * @method destination
         * @param {Object} c Starting coordinate
         * @param {Number} b Bearing (degrees)
         * @param {Number} d Distance (km)
         * @return {Object} Destination point
         */
        destination: function(c, b, d) {
            c = processCoordinate(c);
            b = deg2rad(wrap(b, 0, 360));

            var inlat = deg2rad(c.lat),
                inlng = deg2rad(c.lng),
                a = d / R;

            var lat = Math.asin( Math.sin(inlat) * Math.cos(a) + Math.cos(inlat) * Math.sin(a) * Math.cos(b) );
            var lng = inlng + Math.atan2( Math.sin(b) * Math.sin(a) * Math.cos(inlat),
                                          Math.cos(a) - (Math.sin(inlat) * Math.sin(lat)) );
            return {
                lat: parseFloat(rad2deg(lat).toFixed(precision)),
                lng: parseFloat(rad2deg(lng).toFixed(precision))
            };
        }
    };

    return Traveler;
});
