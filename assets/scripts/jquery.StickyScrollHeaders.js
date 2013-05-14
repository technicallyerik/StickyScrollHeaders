;(function($) {

	var StickyHeader = function(element, options) {
		this.element = element;
		this.$element = $(element);
		var offset = this.$element.offset();
		this.origTop = offset.top;
		this.origLeft = offset.left;
		this.isStuck = false;
		this.topoffset = (options != null && options.container != null) ? options.container.offset().top : 0
		this.$element.css({'z-index': 2, 'position': 'relative'});
	};

	StickyHeader.prototype.Stick = function() {
		this.isStuck = true;
		this.$element.css({'position': 'fixed', 'top': this.topoffset, 'left': this.origLeft, 'z-index': 1});
		StickyHeader.currentlyStuckElement = this;
	}

	StickyHeader.prototype.UnStick = function() {
		this.isStuck = false;
		this.$element.css({'position': 'relative', 'top': '', 'left': '', 'z-index': 2});
		StickyHeader.currentlyStuckElement = null;
	}

	StickyHeader.prototype.SetTop = function(top) {
		this.$element.css('top', top);
	}

	StickyHeader.prototype.ResetTop = function() {
		this.$element.css('top', this.topoffset);
	}

	StickyHeader.prototype.FixLeftMargin = function() {
		if(this.isStuck) {
			this.UnStick();
			this.origLeft = this.$element.offset().left;
			this.Stick();
		} else {
			this.origLeft = this.$element.offset().left;
		}
	}

	StickyHeader.currentlyStuckElement = null;

	$.fn.StickyScrollHeaders = function(options) {
  		// Convert our elements to StickyHeader objects, to remember it's 
  		// original offset, and to be able to use helper functions.
  		var stickyHeaderElements = new Array();
  		this.each(function() {
  			var stickyHeaderElement = new StickyHeader(this, options);
  			stickyHeaderElements.push(stickyHeaderElement);
  		});

  		$(window).bind("scroll", function(){
            // Get window's scroll position
  			var windowScroll = $(window).scrollTop();

  			// We want to find the biggest y offset that is less than or equal to the scroll position to stick
  			var largestTopOffset = -1;
  			var largestStickyHeader = null;
  			// Also want to find the smallest y offset that is greater than the scroll position upcoming
  			var upcomingOffset = Number.MAX_VALUE;
  			var upcomingStickyHeader = null;

  			for (var i = stickyHeaderElements.length - 1; i >= 0; i--) {
  				var stickyHeaderElement = stickyHeaderElements[i];
  				if(stickyHeaderElement.origTop > largestTopOffset && stickyHeaderElement.origTop <= (windowScroll + stickyHeaderElement.topoffset)) {
					largestTopOffset = stickyHeaderElement.origTop;
					largestStickyHeader = stickyHeaderElement;
				}
				if(stickyHeaderElement.origTop < upcomingOffset && stickyHeaderElement.origTop > (windowScroll + stickyHeaderElement.topoffset)) {
					upcomingOffset = stickyHeaderElement.origTop;
					upcomingStickyHeader = stickyHeaderElement;
				}
  			};

  			// Bump stuck element in perparation for upcoming element appropriately
  			if(StickyHeader.currentlyStuckElement != null && upcomingStickyHeader != null) {
  				var currentStuckElementHeight = StickyHeader.currentlyStuckElement.$element.height();
  				var upcomingItemOffset = upcomingOffset - (windowScroll + StickyHeader.currentlyStuckElement.topoffset);

  				if(currentStuckElementHeight > upcomingItemOffset) {
  					StickyHeader.currentlyStuckElement.SetTop(StickyHeader.currentlyStuckElement.topoffset - (currentStuckElementHeight - upcomingItemOffset));
  				} else {
  					StickyHeader.currentlyStuckElement.ResetTop();
  				}
  			}

  			// Stick and unstick appropriately
			if(StickyHeader.currentlyStuckElement != null && largestStickyHeader != null) {
				if(!StickyHeader.currentlyStuckElement.$element.is(largestStickyHeader.$element)) {
					StickyHeader.currentlyStuckElement.UnStick();
					largestStickyHeader.Stick();
				}
			} else if(StickyHeader.currentlyStuckElement != null) {
				StickyHeader.currentlyStuckElement.UnStick();
			} else if(largestStickyHeader != null) {
				largestStickyHeader.Stick();
			}

        });

		$(window).resize(function() {
			for (var i = stickyHeaderElements.length - 1; i >= 0; i--) {
  				var stickyHeaderElement = stickyHeaderElements[i];
  				stickyHeaderElement.FixLeftMargin();
  			};
		});

	};
}(jQuery));