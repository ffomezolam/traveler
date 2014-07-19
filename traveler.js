/**
 * Exports object containing utility functions for handling points and
 * distances on a sphere
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

    function llArrayToObject(lla) {
        return {
            lat: lla[0],
            lng: lla[1]
        };
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
            if(isArray(c1)) c1 = llArrayToObject(c1);
            if(isArray(c2)) c2 = llArrayToObject(c2);

            var lat1 = deg2rad(c1.lat),
                lat2 = deg2rad(c2.lat),
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
            if(isArray(c)) c = llArrayToObject(c);
            b = deg2rad(b);

            var a = d / R;
            var lat = Math.asin( Math.sin(c.lat) * Math.cos(a) + Math.cos(c.lat) * Math.sin(a) * Math.cos(b) );
            var lng = c.lng + Math.atan2( Math.sin(b) * Math.sin(a) * Math.cos(c.lat),
                                          Math.cos(a) - Math.sin(c.lat) * Math.sin(lat) );
            return {
                lat: parseFloat(rad2deg(lat).toFixed(precision)),
                lng: parseFloat(rad2deg(lng).toFixed(precision))
            };
        }
    };

    return Traveler;
});
