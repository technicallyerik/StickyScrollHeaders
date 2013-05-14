/* ---------------------------------------------------------------------
Global JavaScript

Target Browsers: All
Authors: Erik Weiss
------------------------------------------------------------------------ */

// Namespace Object
var NERD = NERD || {};

// Pass reference to jQuery and Namespace
(function($, APP) {

    // DOM Ready Function
    $(function() {
    	$(".date").StickyScrollHeaders({container: $("#body")});
    });


}(jQuery, NERD));