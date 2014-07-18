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

    // utility function to get latLng points from various types of arguments
    function latLngArgs(np) {
        var as = Array.prototype.slice.call(arguments, 1); // turn arguments into array
        var i = 0,
            t = 0;  // 0 = lat, 1 = lng
        while(i < as.length) {
            var a = as[i];

        }
    }

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
            var lat1 = deg2rad(c1.lat),
                lat2 = deg2rad(c2.lat),
                diflat = deg2rad(c2.lat - c1.lat),
                diflng = deg2rad(c2.lng - c1.lng);

            var sinlat = Math.sin(diflat / 2),
                sinlng = Math.sin(diflng / 2);

            var a = sinlat * sinlat + Math.cos(lat1) * Math.cos(lat2) + sinlng * sinlng;
            var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

            return R * c;
        }
    };

    return Traveler;
});
