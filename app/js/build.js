/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};

/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {

/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;

/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};

/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);

/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;

/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}


/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;

/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;

/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";

/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	;;
	__webpack_require__(1);

/***/ },
/* 1 */
/***/ function(module, exports, __webpack_require__) {

	var fastClick = __webpack_require__(2);

	fastClick.attach(document.body);

	/*
	 * 引入路由
	 * */
	var Baofen = __webpack_require__(3);
	var baofen = new Baofen();

	Backbone.history.start();

/***/ },
/* 2 */
/***/ function(module, exports, __webpack_require__) {

	var __WEBPACK_AMD_DEFINE_RESULT__;;(function () {
		'use strict';

		/*jslint browser:true, node:true*/
		/*global define, Event, Node*/


		/**
		 * Instantiate fast-clicking listeners on the specified layer.
		 *
		 * @constructor
		 * @param {Element} layer The layer to listen on
		 * @param {Object} [options={}] The options to override the defaults
		 */
		function FastClick(layer, options) {
			var oldOnClick;

			options = options || {};

			/**
			 * Whether a click is currently being tracked.
			 *
			 * @type boolean
			 */
			this.trackingClick = false;


			/**
			 * Timestamp for when click tracking started.
			 *
			 * @type number
			 */
			this.trackingClickStart = 0;


			/**
			 * The element being tracked for a click.
			 *
			 * @type EventTarget
			 */
			this.targetElement = null;


			/**
			 * X-coordinate of touch start event.
			 *
			 * @type number
			 */
			this.touchStartX = 0;


			/**
			 * Y-coordinate of touch start event.
			 *
			 * @type number
			 */
			this.touchStartY = 0;


			/**
			 * ID of the last touch, retrieved from Touch.identifier.
			 *
			 * @type number
			 */
			this.lastTouchIdentifier = 0;


			/**
			 * Touchmove boundary, beyond which a click will be cancelled.
			 *
			 * @type number
			 */
			this.touchBoundary = options.touchBoundary || 10;


			/**
			 * The FastClick layer.
			 *
			 * @type Element
			 */
			this.layer = layer;

			/**
			 * The minimum time between tap(touchstart and touchend) events
			 *
			 * @type number
			 */
			this.tapDelay = options.tapDelay || 200;

			/**
			 * The maximum time for a tap
			 *
			 * @type number
			 */
			this.tapTimeout = options.tapTimeout || 700;

			if (FastClick.notNeeded(layer)) {
				return;
			}

			// Some old versions of Android don't have Function.prototype.bind
			function bind(method, context) {
				return function() { return method.apply(context, arguments); };
			}


			var methods = ['onMouse', 'onClick', 'onTouchStart', 'onTouchMove', 'onTouchEnd', 'onTouchCancel'];
			var context = this;
			for (var i = 0, l = methods.length; i < l; i++) {
				context[methods[i]] = bind(context[methods[i]], context);
			}

			// Set up event handlers as required
			if (deviceIsAndroid) {
				layer.addEventListener('mouseover', this.onMouse, true);
				layer.addEventListener('mousedown', this.onMouse, true);
				layer.addEventListener('mouseup', this.onMouse, true);
			}

			layer.addEventListener('click', this.onClick, true);
			layer.addEventListener('touchstart', this.onTouchStart, false);
			layer.addEventListener('touchmove', this.onTouchMove, false);
			layer.addEventListener('touchend', this.onTouchEnd, false);
			layer.addEventListener('touchcancel', this.onTouchCancel, false);

			// Hack is required for browsers that don't support Event#stopImmediatePropagation (e.g. Android 2)
			// which is how FastClick normally stops click events bubbling to callbacks registered on the FastClick
			// layer when they are cancelled.
			if (!Event.prototype.stopImmediatePropagation) {
				layer.removeEventListener = function(type, callback, capture) {
					var rmv = Node.prototype.removeEventListener;
					if (type === 'click') {
						rmv.call(layer, type, callback.hijacked || callback, capture);
					} else {
						rmv.call(layer, type, callback, capture);
					}
				};

				layer.addEventListener = function(type, callback, capture) {
					var adv = Node.prototype.addEventListener;
					if (type === 'click') {
						adv.call(layer, type, callback.hijacked || (callback.hijacked = function(event) {
							if (!event.propagationStopped) {
								callback(event);
							}
						}), capture);
					} else {
						adv.call(layer, type, callback, capture);
					}
				};
			}

			// If a handler is already declared in the element's onclick attribute, it will be fired before
			// FastClick's onClick handler. Fix this by pulling out the user-defined handler function and
			// adding it as listener.
			if (typeof layer.onclick === 'function') {

				// Android browser on at least 3.2 requires a new reference to the function in layer.onclick
				// - the old one won't work if passed to addEventListener directly.
				oldOnClick = layer.onclick;
				layer.addEventListener('click', function(event) {
					oldOnClick(event);
				}, false);
				layer.onclick = null;
			}
		}

		/**
		* Windows Phone 8.1 fakes user agent string to look like Android and iPhone.
		*
		* @type boolean
		*/
		var deviceIsWindowsPhone = navigator.userAgent.indexOf("Windows Phone") >= 0;

		/**
		 * Android requires exceptions.
		 *
		 * @type boolean
		 */
		var deviceIsAndroid = navigator.userAgent.indexOf('Android') > 0 && !deviceIsWindowsPhone;


		/**
		 * iOS requires exceptions.
		 *
		 * @type boolean
		 */
		var deviceIsIOS = /iP(ad|hone|od)/.test(navigator.userAgent) && !deviceIsWindowsPhone;


		/**
		 * iOS 4 requires an exception for select elements.
		 *
		 * @type boolean
		 */
		var deviceIsIOS4 = deviceIsIOS && (/OS 4_\d(_\d)?/).test(navigator.userAgent);


		/**
		 * iOS 6.0-7.* requires the target element to be manually derived
		 *
		 * @type boolean
		 */
		var deviceIsIOSWithBadTarget = deviceIsIOS && (/OS [6-7]_\d/).test(navigator.userAgent);

		/**
		 * BlackBerry requires exceptions.
		 *
		 * @type boolean
		 */
		var deviceIsBlackBerry10 = navigator.userAgent.indexOf('BB10') > 0;

		/**
		 * Determine whether a given element requires a native click.
		 *
		 * @param {EventTarget|Element} target Target DOM element
		 * @returns {boolean} Returns true if the element needs a native click
		 */
		FastClick.prototype.needsClick = function(target) {
			switch (target.nodeName.toLowerCase()) {

			// Don't send a synthetic click to disabled inputs (issue #62)
			case 'button':
			case 'select':
			case 'textarea':
				if (target.disabled) {
					return true;
				}

				break;
			case 'input':

				// File inputs need real clicks on iOS 6 due to a browser bug (issue #68)
				if ((deviceIsIOS && target.type === 'file') || target.disabled) {
					return true;
				}

				break;
			case 'label':
			case 'iframe': // iOS8 homescreen apps can prevent events bubbling into frames
			case 'video':
				return true;
			}

			return (/\bneedsclick\b/).test(target.className);
		};


		/**
		 * Determine whether a given element requires a call to focus to simulate click into element.
		 *
		 * @param {EventTarget|Element} target Target DOM element
		 * @returns {boolean} Returns true if the element requires a call to focus to simulate native click.
		 */
		FastClick.prototype.needsFocus = function(target) {
			switch (target.nodeName.toLowerCase()) {
			case 'textarea':
				return true;
			case 'select':
				return !deviceIsAndroid;
			case 'input':
				switch (target.type) {
				case 'button':
				case 'checkbox':
				case 'file':
				case 'image':
				case 'radio':
				case 'submit':
					return false;
				}

				// No point in attempting to focus disabled inputs
				return !target.disabled && !target.readOnly;
			default:
				return (/\bneedsfocus\b/).test(target.className);
			}
		};


		/**
		 * Send a click event to the specified element.
		 *
		 * @param {EventTarget|Element} targetElement
		 * @param {Event} event
		 */
		FastClick.prototype.sendClick = function(targetElement, event) {
			var clickEvent, touch;

			// On some Android devices activeElement needs to be blurred otherwise the synthetic click will have no effect (#24)
			if (document.activeElement && document.activeElement !== targetElement) {
				document.activeElement.blur();
			}

			touch = event.changedTouches[0];

			// Synthesise a click event, with an extra attribute so it can be tracked
			clickEvent = document.createEvent('MouseEvents');
			clickEvent.initMouseEvent(this.determineEventType(targetElement), true, true, window, 1, touch.screenX, touch.screenY, touch.clientX, touch.clientY, false, false, false, false, 0, null);
			clickEvent.forwardedTouchEvent = true;
			targetElement.dispatchEvent(clickEvent);
		};

		FastClick.prototype.determineEventType = function(targetElement) {

			//Issue #159: Android Chrome Select Box does not open with a synthetic click event
			if (deviceIsAndroid && targetElement.tagName.toLowerCase() === 'select') {
				return 'mousedown';
			}

			return 'click';
		};


		/**
		 * @param {EventTarget|Element} targetElement
		 */
		FastClick.prototype.focus = function(targetElement) {
			var length;

			// Issue #160: on iOS 7, some input elements (e.g. date datetime month) throw a vague TypeError on setSelectionRange. These elements don't have an integer value for the selectionStart and selectionEnd properties, but unfortunately that can't be used for detection because accessing the properties also throws a TypeError. Just check the type instead. Filed as Apple bug #15122724.
			if (deviceIsIOS && targetElement.setSelectionRange && targetElement.type.indexOf('date') !== 0 && targetElement.type !== 'time' && targetElement.type !== 'month') {
				length = targetElement.value.length;
				targetElement.setSelectionRange(length, length);
			} else {
				targetElement.focus();
			}
		};


		/**
		 * Check whether the given target element is a child of a scrollable layer and if so, set a flag on it.
		 *
		 * @param {EventTarget|Element} targetElement
		 */
		FastClick.prototype.updateScrollParent = function(targetElement) {
			var scrollParent, parentElement;

			scrollParent = targetElement.fastClickScrollParent;

			// Attempt to discover whether the target element is contained within a scrollable layer. Re-check if the
			// target element was moved to another parent.
			if (!scrollParent || !scrollParent.contains(targetElement)) {
				parentElement = targetElement;
				do {
					if (parentElement.scrollHeight > parentElement.offsetHeight) {
						scrollParent = parentElement;
						targetElement.fastClickScrollParent = parentElement;
						break;
					}

					parentElement = parentElement.parentElement;
				} while (parentElement);
			}

			// Always update the scroll top tracker if possible.
			if (scrollParent) {
				scrollParent.fastClickLastScrollTop = scrollParent.scrollTop;
			}
		};


		/**
		 * @param {EventTarget} targetElement
		 * @returns {Element|EventTarget}
		 */
		FastClick.prototype.getTargetElementFromEventTarget = function(eventTarget) {

			// On some older browsers (notably Safari on iOS 4.1 - see issue #56) the event target may be a text node.
			if (eventTarget.nodeType === Node.TEXT_NODE) {
				return eventTarget.parentNode;
			}

			return eventTarget;
		};


		/**
		 * On touch start, record the position and scroll offset.
		 *
		 * @param {Event} event
		 * @returns {boolean}
		 */
		FastClick.prototype.onTouchStart = function(event) {
			var targetElement, touch, selection;

			// Ignore multiple touches, otherwise pinch-to-zoom is prevented if both fingers are on the FastClick element (issue #111).
			if (event.targetTouches.length > 1) {
				return true;
			}

			targetElement = this.getTargetElementFromEventTarget(event.target);
			touch = event.targetTouches[0];

			if (deviceIsIOS) {

				// Only trusted events will deselect text on iOS (issue #49)
				selection = window.getSelection();
				if (selection.rangeCount && !selection.isCollapsed) {
					return true;
				}

				if (!deviceIsIOS4) {

					// Weird things happen on iOS when an alert or confirm dialog is opened from a click event callback (issue #23):
					// when the user next taps anywhere else on the page, new touchstart and touchend events are dispatched
					// with the same identifier as the touch event that previously triggered the click that triggered the alert.
					// Sadly, there is an issue on iOS 4 that causes some normal touch events to have the same identifier as an
					// immediately preceeding touch event (issue #52), so this fix is unavailable on that platform.
					// Issue 120: touch.identifier is 0 when Chrome dev tools 'Emulate touch events' is set with an iOS device UA string,
					// which causes all touch events to be ignored. As this block only applies to iOS, and iOS identifiers are always long,
					// random integers, it's safe to to continue if the identifier is 0 here.
					if (touch.identifier && touch.identifier === this.lastTouchIdentifier) {
						event.preventDefault();
						return false;
					}

					this.lastTouchIdentifier = touch.identifier;

					// If the target element is a child of a scrollable layer (using -webkit-overflow-scrolling: touch) and:
					// 1) the user does a fling scroll on the scrollable layer
					// 2) the user stops the fling scroll with another tap
					// then the event.target of the last 'touchend' event will be the element that was under the user's finger
					// when the fling scroll was started, causing FastClick to send a click event to that layer - unless a check
					// is made to ensure that a parent layer was not scrolled before sending a synthetic click (issue #42).
					this.updateScrollParent(targetElement);
				}
			}

			this.trackingClick = true;
			this.trackingClickStart = event.timeStamp;
			this.targetElement = targetElement;

			this.touchStartX = touch.pageX;
			this.touchStartY = touch.pageY;

			// Prevent phantom clicks on fast double-tap (issue #36)
			if ((event.timeStamp - this.lastClickTime) < this.tapDelay) {
				event.preventDefault();
			}

			return true;
		};


		/**
		 * Based on a touchmove event object, check whether the touch has moved past a boundary since it started.
		 *
		 * @param {Event} event
		 * @returns {boolean}
		 */
		FastClick.prototype.touchHasMoved = function(event) {
			var touch = event.changedTouches[0], boundary = this.touchBoundary;

			if (Math.abs(touch.pageX - this.touchStartX) > boundary || Math.abs(touch.pageY - this.touchStartY) > boundary) {
				return true;
			}

			return false;
		};


		/**
		 * Update the last position.
		 *
		 * @param {Event} event
		 * @returns {boolean}
		 */
		FastClick.prototype.onTouchMove = function(event) {
			if (!this.trackingClick) {
				return true;
			}

			// If the touch has moved, cancel the click tracking
			if (this.targetElement !== this.getTargetElementFromEventTarget(event.target) || this.touchHasMoved(event)) {
				this.trackingClick = false;
				this.targetElement = null;
			}

			return true;
		};


		/**
		 * Attempt to find the labelled control for the given label element.
		 *
		 * @param {EventTarget|HTMLLabelElement} labelElement
		 * @returns {Element|null}
		 */
		FastClick.prototype.findControl = function(labelElement) {

			// Fast path for newer browsers supporting the HTML5 control attribute
			if (labelElement.control !== undefined) {
				return labelElement.control;
			}

			// All browsers under test that support touch events also support the HTML5 htmlFor attribute
			if (labelElement.htmlFor) {
				return document.getElementById(labelElement.htmlFor);
			}

			// If no for attribute exists, attempt to retrieve the first labellable descendant element
			// the list of which is defined here: http://www.w3.org/TR/html5/forms.html#category-label
			return labelElement.querySelector('button, input:not([type=hidden]), keygen, meter, output, progress, select, textarea');
		};


		/**
		 * On touch end, determine whether to send a click event at once.
		 *
		 * @param {Event} event
		 * @returns {boolean}
		 */
		FastClick.prototype.onTouchEnd = function(event) {
			var forElement, trackingClickStart, targetTagName, scrollParent, touch, targetElement = this.targetElement;

			if (!this.trackingClick) {
				return true;
			}

			// Prevent phantom clicks on fast double-tap (issue #36)
			if ((event.timeStamp - this.lastClickTime) < this.tapDelay) {
				this.cancelNextClick = true;
				return true;
			}

			if ((event.timeStamp - this.trackingClickStart) > this.tapTimeout) {
				return true;
			}

			// Reset to prevent wrong click cancel on input (issue #156).
			this.cancelNextClick = false;

			this.lastClickTime = event.timeStamp;

			trackingClickStart = this.trackingClickStart;
			this.trackingClick = false;
			this.trackingClickStart = 0;

			// On some iOS devices, the targetElement supplied with the event is invalid if the layer
			// is performing a transition or scroll, and has to be re-detected manually. Note that
			// for this to function correctly, it must be called *after* the event target is checked!
			// See issue #57; also filed as rdar://13048589 .
			if (deviceIsIOSWithBadTarget) {
				touch = event.changedTouches[0];

				// In certain cases arguments of elementFromPoint can be negative, so prevent setting targetElement to null
				targetElement = document.elementFromPoint(touch.pageX - window.pageXOffset, touch.pageY - window.pageYOffset) || targetElement;
				targetElement.fastClickScrollParent = this.targetElement.fastClickScrollParent;
			}

			targetTagName = targetElement.tagName.toLowerCase();
			if (targetTagName === 'label') {
				forElement = this.findControl(targetElement);
				if (forElement) {
					this.focus(targetElement);
					if (deviceIsAndroid) {
						return false;
					}

					targetElement = forElement;
				}
			} else if (this.needsFocus(targetElement)) {

				// Case 1: If the touch started a while ago (best guess is 100ms based on tests for issue #36) then focus will be triggered anyway. Return early and unset the target element reference so that the subsequent click will be allowed through.
				// Case 2: Without this exception for input elements tapped when the document is contained in an iframe, then any inputted text won't be visible even though the value attribute is updated as the user types (issue #37).
				if ((event.timeStamp - trackingClickStart) > 100 || (deviceIsIOS && window.top !== window && targetTagName === 'input')) {
					this.targetElement = null;
					return false;
				}

				this.focus(targetElement);
				this.sendClick(targetElement, event);

				// Select elements need the event to go through on iOS 4, otherwise the selector menu won't open.
				// Also this breaks opening selects when VoiceOver is active on iOS6, iOS7 (and possibly others)
				if (!deviceIsIOS || targetTagName !== 'select') {
					this.targetElement = null;
					event.preventDefault();
				}

				return false;
			}

			if (deviceIsIOS && !deviceIsIOS4) {

				// Don't send a synthetic click event if the target element is contained within a parent layer that was scrolled
				// and this tap is being used to stop the scrolling (usually initiated by a fling - issue #42).
				scrollParent = targetElement.fastClickScrollParent;
				if (scrollParent && scrollParent.fastClickLastScrollTop !== scrollParent.scrollTop) {
					return true;
				}
			}

			// Prevent the actual click from going though - unless the target node is marked as requiring
			// real clicks or if it is in the whitelist in which case only non-programmatic clicks are permitted.
			if (!this.needsClick(targetElement)) {
				event.preventDefault();
				this.sendClick(targetElement, event);
			}

			return false;
		};


		/**
		 * On touch cancel, stop tracking the click.
		 *
		 * @returns {void}
		 */
		FastClick.prototype.onTouchCancel = function() {
			this.trackingClick = false;
			this.targetElement = null;
		};


		/**
		 * Determine mouse events which should be permitted.
		 *
		 * @param {Event} event
		 * @returns {boolean}
		 */
		FastClick.prototype.onMouse = function(event) {

			// If a target element was never set (because a touch event was never fired) allow the event
			if (!this.targetElement) {
				return true;
			}

			if (event.forwardedTouchEvent) {
				return true;
			}

			// Programmatically generated events targeting a specific element should be permitted
			if (!event.cancelable) {
				return true;
			}

			// Derive and check the target element to see whether the mouse event needs to be permitted;
			// unless explicitly enabled, prevent non-touch click events from triggering actions,
			// to prevent ghost/doubleclicks.
			if (!this.needsClick(this.targetElement) || this.cancelNextClick) {

				// Prevent any user-added listeners declared on FastClick element from being fired.
				if (event.stopImmediatePropagation) {
					event.stopImmediatePropagation();
				} else {

					// Part of the hack for browsers that don't support Event#stopImmediatePropagation (e.g. Android 2)
					event.propagationStopped = true;
				}

				// Cancel the event
				event.stopPropagation();
				event.preventDefault();

				return false;
			}

			// If the mouse event is permitted, return true for the action to go through.
			return true;
		};


		/**
		 * On actual clicks, determine whether this is a touch-generated click, a click action occurring
		 * naturally after a delay after a touch (which needs to be cancelled to avoid duplication), or
		 * an actual click which should be permitted.
		 *
		 * @param {Event} event
		 * @returns {boolean}
		 */
		FastClick.prototype.onClick = function(event) {
			var permitted;

			// It's possible for another FastClick-like library delivered with third-party code to fire a click event before FastClick does (issue #44). In that case, set the click-tracking flag back to false and return early. This will cause onTouchEnd to return early.
			if (this.trackingClick) {
				this.targetElement = null;
				this.trackingClick = false;
				return true;
			}

			// Very odd behaviour on iOS (issue #18): if a submit element is present inside a form and the user hits enter in the iOS simulator or clicks the Go button on the pop-up OS keyboard the a kind of 'fake' click event will be triggered with the submit-type input element as the target.
			if (event.target.type === 'submit' && event.detail === 0) {
				return true;
			}

			permitted = this.onMouse(event);

			// Only unset targetElement if the click is not permitted. This will ensure that the check for !targetElement in onMouse fails and the browser's click doesn't go through.
			if (!permitted) {
				this.targetElement = null;
			}

			// If clicks are permitted, return true for the action to go through.
			return permitted;
		};


		/**
		 * Remove all FastClick's event listeners.
		 *
		 * @returns {void}
		 */
		FastClick.prototype.destroy = function() {
			var layer = this.layer;

			if (deviceIsAndroid) {
				layer.removeEventListener('mouseover', this.onMouse, true);
				layer.removeEventListener('mousedown', this.onMouse, true);
				layer.removeEventListener('mouseup', this.onMouse, true);
			}

			layer.removeEventListener('click', this.onClick, true);
			layer.removeEventListener('touchstart', this.onTouchStart, false);
			layer.removeEventListener('touchmove', this.onTouchMove, false);
			layer.removeEventListener('touchend', this.onTouchEnd, false);
			layer.removeEventListener('touchcancel', this.onTouchCancel, false);
		};


		/**
		 * Check whether FastClick is needed.
		 *
		 * @param {Element} layer The layer to listen on
		 */
		FastClick.notNeeded = function(layer) {
			var metaViewport;
			var chromeVersion;
			var blackberryVersion;
			var firefoxVersion;

			// Devices that don't support touch don't need FastClick
			if (typeof window.ontouchstart === 'undefined') {
				return true;
			}

			// Chrome version - zero for other browsers
			chromeVersion = +(/Chrome\/([0-9]+)/.exec(navigator.userAgent) || [,0])[1];

			if (chromeVersion) {

				if (deviceIsAndroid) {
					metaViewport = document.querySelector('meta[name=viewport]');

					if (metaViewport) {
						// Chrome on Android with user-scalable="no" doesn't need FastClick (issue #89)
						if (metaViewport.content.indexOf('user-scalable=no') !== -1) {
							return true;
						}
						// Chrome 32 and above with width=device-width or less don't need FastClick
						if (chromeVersion > 31 && document.documentElement.scrollWidth <= window.outerWidth) {
							return true;
						}
					}

				// Chrome desktop doesn't need FastClick (issue #15)
				} else {
					return true;
				}
			}

			if (deviceIsBlackBerry10) {
				blackberryVersion = navigator.userAgent.match(/Version\/([0-9]*)\.([0-9]*)/);

				// BlackBerry 10.3+ does not require Fastclick library.
				// https://github.com/ftlabs/fastclick/issues/251
				if (blackberryVersion[1] >= 10 && blackberryVersion[2] >= 3) {
					metaViewport = document.querySelector('meta[name=viewport]');

					if (metaViewport) {
						// user-scalable=no eliminates click delay.
						if (metaViewport.content.indexOf('user-scalable=no') !== -1) {
							return true;
						}
						// width=device-width (or less than device-width) eliminates click delay.
						if (document.documentElement.scrollWidth <= window.outerWidth) {
							return true;
						}
					}
				}
			}

			// IE10 with -ms-touch-action: none or manipulation, which disables double-tap-to-zoom (issue #97)
			if (layer.style.msTouchAction === 'none' || layer.style.touchAction === 'manipulation') {
				return true;
			}

			// Firefox version - zero for other browsers
			firefoxVersion = +(/Firefox\/([0-9]+)/.exec(navigator.userAgent) || [,0])[1];

			if (firefoxVersion >= 27) {
				// Firefox 27+ does not have tap delay if the content is not zoomable - https://bugzilla.mozilla.org/show_bug.cgi?id=922896

				metaViewport = document.querySelector('meta[name=viewport]');
				if (metaViewport && (metaViewport.content.indexOf('user-scalable=no') !== -1 || document.documentElement.scrollWidth <= window.outerWidth)) {
					return true;
				}
			}

			// IE11: prefixed -ms-touch-action is no longer supported and it's recomended to use non-prefixed version
			// http://msdn.microsoft.com/en-us/library/windows/apps/Hh767313.aspx
			if (layer.style.touchAction === 'none' || layer.style.touchAction === 'manipulation') {
				return true;
			}

			return false;
		};


		/**
		 * Factory method for creating a FastClick object
		 *
		 * @param {Element} layer The layer to listen on
		 * @param {Object} [options={}] The options to override the defaults
		 */
		FastClick.attach = function(layer, options) {
			return new FastClick(layer, options);
		};


		if (true) {

			// AMD. Register as an anonymous module.
			!(__WEBPACK_AMD_DEFINE_RESULT__ = function() {
				return FastClick;
			}.call(exports, __webpack_require__, exports, module), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));
		} else if (typeof module !== 'undefined' && module.exports) {
			module.exports = FastClick.attach;
			module.exports.FastClick = FastClick;
		} else {
			window.FastClick = FastClick;
		}
	}());


/***/ },
/* 3 */
/***/ function(module, exports, __webpack_require__) {

	var appCache = __webpack_require__(4);
	var Pay = __webpack_require__(5);
	var Welcome = __webpack_require__(11);
	var Reward = __webpack_require__(13);
	var RewardRules = __webpack_require__(22);
	var JcView = __webpack_require__(24);
	var JcQcView = __webpack_require__(26);
	var ListView = __webpack_require__(28);
	var ToolView = __webpack_require__(44);
	var ToolDetailView = __webpack_require__(47);
	var IndexView = __webpack_require__(49);
	var Qcode = __webpack_require__(51);
	var Withdraw = __webpack_require__(54);
	var QcodeUpload = __webpack_require__(57);
	var ApprenticesView = __webpack_require__(60);
	var ChatView = __webpack_require__(63);
	var MenuView = __webpack_require__(68);
	var WithdrawList = __webpack_require__(70);
	var RankView = __webpack_require__(73);
	var OfficialAccounts = __webpack_require__(75);
	var OfficialAccountsDtail = __webpack_require__(77);
	var PlacardView = __webpack_require__(79);
	var PlacardWelcomeView = __webpack_require__(84);


	module.exports = Backbone.Router.extend({
	    routes: {
	        '': 'list',
	        'index': 'list',
	        'welcome': 'welcome',
	        'pay': 'pay',
	        'list': 'list',
	        'reward': 'reward',
	        'reward/:page': 'reward',
	        'reward_rules': 'rewardRules',
	        'jiaochen': 'jiaochen',
	        'jiaochen/qcode': 'jiaochenQcode',
	        'qcode': 'qcode',
	        'tool': 'tool',
	        'tool/:id': 'toolDetail',
	        'apprentices': 'apprentices',
	        'apprentices/:page': 'apprentices',
	        'qcode_upload': 'qcodeUpload',
	        'chat': 'chat',
	        'withdraw': 'withdraw',
	        'withdraw/:type': 'withdraw',
	        'withdraw_list': 'withdraw_list',
	        'withdraw_list/:page': 'withdraw_list',
	        'rank': 'rank',
	        'rank/:period': 'rank',
	        'official_accounts': 'officialAccounts',
	        'official_accounts/:id': 'officialAccountsDetail',
	        'placard':'placard',
	        'placard/:group':'placard',
	        'placard_welcome':'placardWelcome'
	    },
	    cacheInitialize: function () {
	        appCache.initialize(function () {
	            var view = {};
	            view.welcomeView = new Welcome;
	            view.payView = new Pay;
	            view.rewardView = new Reward;
	            view.rewardRulesView = new RewardRules;
	            view.listView = new ListView;
	            view.jcView = new JcView;
	            view.jcQcView = new JcQcView;
	            view.qcode = new Qcode;
	            view.qcodeUpload = new QcodeUpload;
	            view.toolView = new ToolView;
	            view.withdraw = new Withdraw;
	            view.indexView = new IndexView;
	            view.apprenticesView = new ApprenticesView;
	            view.chatView = new ChatView;
	            view.menuView = new MenuView;
	            view.withdrawList = new WithdrawList;
	            view.toolDetailView = new ToolDetailView;
	            view.rankView = new RankView;
	            view.officialAccountsView = new OfficialAccounts;
	            view.officialAccountsDtail = new OfficialAccountsDtail;
	            view.placardView = new PlacardView;
	            view.placardWelcome = new PlacardWelcomeView;

	            return view;
	        });
	        this.cached = appCache.get();
	    },
	    initialize: function () {
	        this.cacheInitialize();
	    },
	    index: function () {
	        this.cached.indexView.render();
	        this.cached.indexView.$el.addClass('block').siblings().removeClass('block');
	    },
	    placard:function(group){
	        var group = group ? group : 'myteam';
	        this.cached.placardView.placardModel.fetch({data:{group:group}});
	        this.cached.placardView.cashModel.fetch();
	        this.cached.placardView.$el.addClass('block').siblings().removeClass('block');
	    },
	    placardWelcome:function(){
	        this.cached.placardWelcome.render();
	        this.cached.placardWelcome.$el.addClass('block').siblings().removeClass('block');
	    },
	    officialAccounts: function () {
	        this.cached.officialAccountsView.render();
	        this.cached.officialAccountsView.model.fetch();
	        this.cached.officialAccountsView.$el.addClass('block').siblings().removeClass('block');
	    },
	    officialAccountsDetail:function() {
	        this.cached.officialAccountsDtail.parent = this.cached.officialAccountsView;
	        this.cached.officialAccountsDtail.render();
	    },
	    rank: function (period) {
	        var period = period ? period : 'all';
	        this.cached.rankView.rankModel.fetch({data: {period: period}});
	        this.cached.rankView.render();
	        this.cached.rankView.$el.addClass('block').siblings().removeClass('block');

	    },
	    welcome: function () {
	        this.cached.welcomeView.render();
	        this.cached.welcomeView.$el.addClass('block').siblings().removeClass('block');
	    },
	    withdraw: function (type) {
	        var type = type ? type : 2;
	        this.cached.withdraw.cashModel.fetch({data: {type: type}});
	        this.cached.withdraw.render();
	        this.cached.withdraw.$el.addClass('block').siblings().removeClass('block');

	    },
	    withdraw_list: function (page) {
	        var page = page ? page : 1;
	        this.cached.withdrawList.withModel.fetch({data: {p: page}});
	        this.cached.withdrawList.render();
	        this.cached.withdrawList.$el.addClass('block').siblings().removeClass('block');
	    },
	    pay: function () {
	        this.cached.payView.render();
	        this.cached.payView.$el.addClass('block').siblings().removeClass('block');
	    },
	    reward: function (page) {
	        var page = page ? page : 1;
	        this.cached.rewardView.model.fetch({data: {p: page}});
	        this.cached.rewardView.render();
	        this.cached.rewardView.userInfo.fetch();
	        this.cached.rewardView.$el.addClass('block').siblings().removeClass('block');
	    },
	    rewardRules: function () {
	        this.cached.rewardRulesView.render();
	        this.cached.rewardRulesView.$el.addClass('block').siblings().removeClass('block');
	    },
	    list: function () {
	        this.cached.listView.model.fetch();
	        this.cached.listView.userInfo.fetch();
	        this.cached.listView.$el.addClass('block').siblings().removeClass('block');
	        this.cached.menuView.render();
	    },
	    jiaochen: function () {
	        this.cached.jcView.render();
	        this.cached.jcView.$el.addClass('block').siblings().removeClass('block');
	    },
	    jiaochenQcode: function () {
	        this.cached.jcQcView.render();
	        this.cached.jcQcView.$el.addClass('block').siblings().removeClass('block');
	    },
	    qcode: function () {
	        this.cached.qcode.render();
	        this.cached.qcode.model.fetch();
	        this.cached.qcode.$el.addClass('block').siblings().removeClass('block');
	    },
	    qcodeUpload: function () {
	        this.cached.qcodeUpload.model.fetch();
	        this.cached.qcodeUpload.$el.addClass('block').siblings().removeClass('block');
	    },
	    tool: function () {
	        this.cached.toolView.render();
	        this.cached.toolView.$el.addClass('block').siblings().removeClass('block');
	    },
	    toolDetail: function (id) {
	        this.cached.toolDetailView.$el.empty();
	        this.cached.toolDetailView.render();
	        this.cached.toolDetailView.model.fetch({data: {id: id}});
	        this.cached.toolDetailView.$el.addClass('block').siblings().removeClass('block');
	    },
	    apprentices: function (page) {
	        var page = page ? page : 1;
	        this.cached.apprenticesView.render();
	        this.cached.apprenticesView.model.fetch({data: {p: page}});
	        this.cached.apprenticesView.$el.addClass('block').siblings().removeClass('block');
	    },
	    chat: function () {
	        this.cached.chatView.render();
	        this.cached.chatView.$el.addClass('block').siblings().removeClass('block');
	    }
	});


/***/ },
/* 4 */
/***/ function(module, exports) {

	var AppCache = function () {
	    this.flag = {};
	    this.flag.init = false;
	    return this;
	};
	AppCache.prototype.initialize = function (initDate) {
	    if (!this.flag.init) {
	        this.flag.init = true;
	        this.data = initDate();
	    }
	    return this;
	};
	AppCache.prototype.get = function (key) {
	    if (typeof key === 'undefined') {
	        return this.data;
	    } else {
	        return this.data[key];
	    }
	};

	/**
	 * 使用该对象缓存app运行生命期里的数据
	 */
	module.exports = new AppCache();


/***/ },
/* 5 */
/***/ function(module, exports, __webpack_require__) {

	var doT = __webpack_require__(6);
	var api = __webpack_require__(7);
	var dialog = __webpack_require__(9);
	var tpl = __webpack_require__(10);

	module.exports = Backbone.View.extend({
	    el: $('#viewMain'),
	    template: doT.template(tpl),
	    tagName: 'div',
	    events: {
	        'click #buyBao': '_buy'
	    },
	    _buy: function (e) {

	        var _this = this;
	        var formBox = $('#buyBaoForm');
	        var text = $.trim(formBox.find('input[name="weixin"]').val());
	        if (text == '') {
	            var d = new dialog({
	                content: '微信号必须填写',
	                title: false,
	                time: false,
	                ok: function () {
	                    d.close();
	                }
	            });
	            return;
	        }
	        if (_this.firstBuy) {
	            $(e.target).html('请求中...').addClass('disabled');
	            _this.firstBuy = false;
	            $.ajax({
	                url: api.getVip,
	                data: 'weixin=' + text,
	                method: 'POST',
	                success: function (data) {
	                    _this.firstBuy = true;
	                    $(e.target).html('立即购买').removeClass('disabled');
	                    if (data.status === 0) {
	                        var d = new dialog({
	                            content: data.info,
	                            title: false,
	                            time: false,
	                            ok: function () {
	                                d.close();
	                            }
	                        });
	                        return;
	                    }
	                    if (data.url) {
	                        window.location = data.url;
	                    }
	                }
	            });
	        }
	        return false;
	    },
	    initialize: function () {
	        /*
	         * 第一次点击购买
	         * */
	        this.firstBuy = true;
	    },
	    _getFansCount: function () {
	        var _this = this;
	        $.ajax({
	            url:api.getFansCount,
	            success:function(data){
	                console.log(data);
	                var html = '<div class="fansCount"><span>已有' +
	                    data.content +
	                    '人加入我们！</span></div>';
	                $('#payView > .top-banner').append(html)
	            }

	        })
	    },

	    render: function () {
	        var _this = this;
	        _this.$el.html(_this.template());
	        _this._getFansCount()
	        return this;
	    }
	});


/***/ },
/* 6 */
/***/ function(module, exports, __webpack_require__) {

	var __WEBPACK_AMD_DEFINE_RESULT__;// doT.js
	// 2011-2014, Laura Doktorova, https://github.com/olado/doT
	// Licensed under the MIT license.

	(function() {
	    "use strict";

	    var doT = {
	        version: "1.0.3",
	        templateSettings: {
	            evaluate:    /\{\{([\s\S]+?(\}?)+)\}\}/g,
	            interpolate: /\{\{=([\s\S]+?)\}\}/g,
	            encode:      /\{\{!([\s\S]+?)\}\}/g,
	            use:         /\{\{#([\s\S]+?)\}\}/g,
	            useParams:   /(^|[^\w$])def(?:\.|\[[\'\"])([\w$\.]+)(?:[\'\"]\])?\s*\:\s*([\w$\.]+|\"[^\"]+\"|\'[^\']+\'|\{[^\}]+\})/g,
	            define:      /\{\{##\s*([\w\.$]+)\s*(\:|=)([\s\S]+?)#\}\}/g,
	            defineParams:/^\s*([\w$]+):([\s\S]+)/,
	            conditional: /\{\{\?(\?)?\s*([\s\S]*?)\s*\}\}/g,
	            iterate:     /\{\{~\s*(?:\}\}|([\s\S]+?)\s*\:\s*([\w$]+)\s*(?:\:\s*([\w$]+))?\s*\}\})/g,
	            varname:	"it",
	            strip:		true,
	            append:		true,
	            selfcontained: false,
	            doNotSkipEncoded: false
	        },
	        template: undefined, //fn, compile template
	        compile:  undefined  //fn, for express
	    }, _globals;

	    doT.encodeHTMLSource = function(doNotSkipEncoded) {
	        var encodeHTMLRules = { "&": "&#38;", "<": "&#60;", ">": "&#62;", '"': "&#34;", "'": "&#39;", "/": "&#47;" },
	            matchHTML = doNotSkipEncoded ? /[&<>"'\/]/g : /&(?!#?\w+;)|<|>|"|'|\//g;
	        return function(code) {
	            return code ? code.toString().replace(matchHTML, function(m) {return encodeHTMLRules[m] || m;}) : "";
	        };
	    };

	    _globals = (function(){ return this || (0,eval)("this"); }());

	    if (typeof module !== "undefined" && module.exports) {
	        module.exports = doT;
	    } else if (true) {
	        !(__WEBPACK_AMD_DEFINE_RESULT__ = function(){return doT;}.call(exports, __webpack_require__, exports, module), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));
	    } else {
	        _globals.doT = doT;
	    }

	    var startend = {
	        append: { start: "'+(",      end: ")+'",      startencode: "'+encodeHTML(" },
	        split:  { start: "';out+=(", end: ");out+='", startencode: "';out+=encodeHTML(" }
	    }, skip = /$^/;

	    function resolveDefs(c, block, def) {
	        return ((typeof block === "string") ? block : block.toString())
	            .replace(c.define || skip, function(m, code, assign, value) {
	                if (code.indexOf("def.") === 0) {
	                    code = code.substring(4);
	                }
	                if (!(code in def)) {
	                    if (assign === ":") {
	                        if (c.defineParams) value.replace(c.defineParams, function(m, param, v) {
	                            def[code] = {arg: param, text: v};
	                        });
	                        if (!(code in def)) def[code]= value;
	                    } else {
	                        new Function("def", "def['"+code+"']=" + value)(def);
	                    }
	                }
	                return "";
	            })
	            .replace(c.use || skip, function(m, code) {
	                if (c.useParams) code = code.replace(c.useParams, function(m, s, d, param) {
	                    if (def[d] && def[d].arg && param) {
	                        var rw = (d+":"+param).replace(/'|\\/g, "_");
	                        def.__exp = def.__exp || {};
	                        def.__exp[rw] = def[d].text.replace(new RegExp("(^|[^\\w$])" + def[d].arg + "([^\\w$])", "g"), "$1" + param + "$2");
	                        return s + "def.__exp['"+rw+"']";
	                    }
	                });
	                var v = new Function("def", "return " + code)(def);
	                return v ? resolveDefs(c, v, def) : v;
	            });
	    }

	    function unescape(code) {
	        return code.replace(/\\('|\\)/g, "$1").replace(/[\r\t\n]/g, " ");
	    }

	    doT.template = function(tmpl, c, def) {
	        c = c || doT.templateSettings;
	        var cse = c.append ? startend.append : startend.split, needhtmlencode, sid = 0, indv,
	            str  = (c.use || c.define) ? resolveDefs(c, tmpl, def || {}) : tmpl;

	        str = ("var out='" + (c.strip ? str.replace(/(^|\r|\n)\t* +| +\t*(\r|\n|$)/g," ")
	            .replace(/\r|\n|\t|\/\*[\s\S]*?\*\//g,""): str)
	            .replace(/'|\\/g, "\\$&")
	            .replace(c.interpolate || skip, function(m, code) {
	                return cse.start + unescape(code) + cse.end;
	            })
	            .replace(c.encode || skip, function(m, code) {
	                needhtmlencode = true;
	                return cse.startencode + unescape(code) + cse.end;
	            })
	            .replace(c.conditional || skip, function(m, elsecase, code) {
	                return elsecase ?
	                    (code ? "';}else if(" + unescape(code) + "){out+='" : "';}else{out+='") :
	                    (code ? "';if(" + unescape(code) + "){out+='" : "';}out+='");
	            })
	            .replace(c.iterate || skip, function(m, iterate, vname, iname) {
	                if (!iterate) return "';} } out+='";
	                sid+=1; indv=iname || "i"+sid; iterate=unescape(iterate);
	                return "';var arr"+sid+"="+iterate+";if(arr"+sid+"){var "+vname+","+indv+"=-1,l"+sid+"=arr"+sid+".length-1;while("+indv+"<l"+sid+"){"
	                    +vname+"=arr"+sid+"["+indv+"+=1];out+='";
	            })
	            .replace(c.evaluate || skip, function(m, code) {
	                return "';" + unescape(code) + "out+='";
	            })
	        + "';return out;")
	            .replace(/\n/g, "\\n").replace(/\t/g, '\\t').replace(/\r/g, "\\r")
	            .replace(/(\s|;|\}|^|\{)out\+='';/g, '$1').replace(/\+''/g, "");
	        //.replace(/(\s|;|\}|^|\{)out\+=''\+/g,'$1out+=');

	        if (needhtmlencode) {
	            if (!c.selfcontained && _globals && !_globals._encodeHTML) _globals._encodeHTML = doT.encodeHTMLSource(c.doNotSkipEncoded);
	            str = "var encodeHTML = typeof _encodeHTML !== 'undefined' ? _encodeHTML : ("
	            + doT.encodeHTMLSource.toString() + "(" + (c.doNotSkipEncoded || '') + "));"
	            + str;
	        }
	        try {
	            return new Function(c.varname, str);
	        } catch (e) {
	            if (typeof console !== "undefined") console.log("Could not create a template function: " + str);
	            throw e;
	        }
	    };

	    doT.compile = function(tmpl, def) {
	        return doT.template(tmpl, null, def);
	    };
	}());

/***/ },
/* 7 */
/***/ function(module, exports, __webpack_require__) {

	var isService = __webpack_require__(8).server;
	module.exports = {

	    /*
	     * 用户列表
	     * */
	    'list': isService ? globConfig.host + 'index.php?s=/Weifans/index/lists' : demoConfig.host + 'lists',
	    'socketHorn': isService ? globConfig.socketHorn : demoConfig.host,
	    /*
	     * 加好友，增加能量
	     * */
	    'addEnergy': isService ? globConfig.host + 'index.php?s=/Weifans/index/add_energy' : globConfig.host + 'index.php?s=/Weifans/index/add_energy',
	    /*
	     * 用户信息
	     * */
	    'userInfo': isService ? globConfig.host + 'index.php?s=/Weifans/index/user_info' : demoConfig.host + 'user_info',
	    /*
	     * 加入队列
	     * */
	    'queue': isService ? globConfig.host + 'index.php?s=/Weifans/index/queue' : globConfig.host + 'index.php?s=/Weifans/index/queue',
	    /*
	     * 销售记录
	     * */
	    'soldNote': isService ? globConfig.host + 'index.php?s=/Weifans/index/sold_note' : demoConfig.host + 'sold_note',
	    /*
	     * 徒弟列表
	     * */
	    'apprentices': isService ? globConfig.host + 'index.php?s=/Weifans/index/apprentices' : globConfig.host + 'index.php?s=/Weifans/index/apprentices',
	    /*
	     * 工具信息
	     * */
	    'tool': isService ? globConfig.host + 'index.php?s=/Weifans/index/tool' : globConfig.host + 'index.php?s=/Weifans/index/tool',
	    /*
	     * 上传二维码
	     * */
	    'uploadQrcode': isService ? globConfig.host + 'index.php?s=/Weifans/index/upload_qrcode' : globConfig.host + 'index.php?s=/Weifans/index/upload_qrcode',
	    /*
	     * 申请VIP
	     * */
	    'getVip': isService ? globConfig.host + 'index.php?s=/Weifans/index/get_vip' : globConfig.host + 'index.php?s=/Weifans/index/get_vip',
	    /*
	     * 获取二维码
	     * */
	    'getQrcode': isService ? globConfig.host + 'index.php?s=/Weifans/weixin/get_qrcode' : globConfig.host + 'index.php?s=/Weifans/weixin/get_qrcode',
	    /*
	     * 获取用户数
	     * */
	    'getFansCount': isService ? globConfig.host + '/index.php?s=/Weifans/Weixin/get_fans_count' : globConfig.host + '/index.php?s=/Weifans/Weixin/get_fans_count',
	    /*
	     * 二维码信息
	     * */
	    'perfectInfo': isService ? globConfig.host + '/index.php?s=/Weifans/index/perfect_info' : globConfig.host + '/index.php?s=/Weifans/index/perfect_info',
	    /*
	     * 提现
	     * */
	    'withdraw': isService ? globConfig.host + '/index.php?s=/Weifans/Weiplist/withdraw_post' : demoConfig.host + 'withdraw',
	    /*
	     * 获取现金余额
	     * */
	    'cash':isService ?  globConfig.host + '/index.php?s=/Weifans/Weiplist/cash' : demoConfig.host + 'cash',
	    /*
	     * 提现记录
	     * */
	    'withdrawList':isService ?  globConfig.host + '/index.php?s=/Weifans/Weiplist/withdraw_list' : demoConfig.host + 'withdraw_list',

	    'rank':isService ?  globConfig.host + '/index.php?s=/Weifans/index/perfect_info' : demoConfig.host + 'rank',
	    'official_accounts':isService ?  globConfig.host + '/index.php?s=/Weifans/index/perfect_info' : demoConfig.host + 'official_accounts',
	    'placard_rank':isService ?  globConfig.host + '/index.php?s=/Weifans/Weiplist/team' : demoConfig.host + 'placard_rank',
	    'placard_cash': isService ?  globConfig.host + '/index.php?s=/Weifans/Weiplist/activityPoster' : demoConfig.host + 'placard_cash',
	    /*
	     * 接头暗号
	     * */
	    'secret_code': isService ?  globConfig.host + '/index.php?s=/Weifans/Weiplist/game_login' : demoConfig.host + 'secret_code'

	}

/***/ },
/* 8 */
/***/ function(module, exports) {

	module.exports =  {
	    server: true,
	    version: '1.0.0'
	}

/***/ },
/* 9 */
/***/ function(module, exports) {

	var Dialog = {};
	var $win = $(window),
	    $doc = $(document),
	    $body = $(document.body);

	var id = new Date().getTime();

	var Dialog = function (opa) {
	    this.options = {
	        title: '确定ʾ',
	        content: '内容',
	        ok: null,
	        cancel: null,
	        close: null,
	        time: 1500,
	        isClose: true,
	        closeCb:null,
	        maskClose: true,
	        offsetTop: 0,
	        zIndex: 999,
	        callBack: null
	    };
	    this.id = id;
	    this._init(opa)._create()._event()._position();
	};
	Dialog.prototype = {
	    _init: function (opa) {
	        $.extend(this.options, opa);
	        var btn = {
	                ok: this.options.ok,
	                cancel: this.options.cancel
	            },
	            txt = {
	                ok: '确定',
	                cancel: '取消'
	            },
	            isObj = function (obj) {
	                return obj !== null && typeof obj === 'object';
	            };
	        if (isObj(btn.ok) && !btn.ok.value) {
	            this.options.ok.value = txt.ok;
	        } else if ($.isFunction(btn.ok)) {
	            this.options.ok = {
	                value: txt.ok,
	                fn: btn.ok
	            };
	        }
	        ;
	        if (isObj(btn.cancel) && !btn.cancel.value) {
	            this.options.cancel = txt.cancel;
	        } else if ($.isFunction(btn.cancel)) {
	            this.options.cancel = {
	                value: txt.cancel,
	                fn: btn.cancel
	            };
	        }
	        ;

	        return this;
	    },
	    _create: function () {
	        if (this.options.id) {
	            id = this.options.id;
	        }
	        var html = '', hasTitle = this.options.title, hasOk = this.options.ok, hasCancel = this.options.cancel, isClose = this.options.isClose;
	        this._id = id;
	        html = '<div id="l' + id + '" class="dialog-layout" style="z-index:' + this.options.zIndex + '"></div>';
	        html += '<div id="d' + id + '" class="dialog-wrap" style="z-index:' + (this.options.zIndex + 1) + '">';
	        html += '<div class="dialog">';
	        if (hasTitle) {
	            html += '<div id="t' + id + '" class="d-title" unselectable="on">';
	            html += '<span>' + this.options.title + '</span>';
	            if (isClose) {
	                html += '<span id="c' + id + '" class="d-close" type="button" title="关闭"><i class="iconfont icon-guanbi"></i></span>';
	            }
	            html += '</div>';
	        }
	        html += '<div class="d-content d-bg">';
	        if (this.options.content) {
	            html += '<div class="d-c-p">' + this.options.content + '</d>';
	        } else {
	            html += '<div class="d-c-p">没有内容</div>';
	        }
	        ;
	        html += '</div>';

	        if (hasOk || hasCancel) {
	            html += '<div class="d-bottom d-bg">';
	            if (hasOk) {
	                html += '<a id="ob' + id + '" class="d-ok d-btn" title="' + this.options.ok.value + '">' + this.options.ok.value + '</button>';
	            }
	            ;
	            if (hasCancel) {
	                html += '<a id="cb' + id + '" class="d-cancle d-btn" title="' + this.options.cancel.value + '">' + this.options.cancel.value + '</button>';
	            }
	            html += '</div>';
	            html += '</div>';
	        }
	        html += '</div>';
	        $body.append(html);


	        return this;
	    },
	    _position: function () {
	        var $dialog = $('#d' + this._id),
	            left = ($win.width() - $dialog.width()) / 2,
	            top = ($win.height() - $dialog.height()) / 4,
	            top = top - this.options.offsetTop;

	        $dialog.css({left: left, top: top > 0 ? top : 0});

	        var init = this.options.init;
	        if (init && typeof init === 'function') {
	            init();
	        }
	        return this;
	    },
	    _event: function () {
	        var self = this,
	            id = this._id,
	            hasTitle = this.options.title,
	            hasOk = this.options.ok,
	            hasCancel = this.options.cancel,
	            isClose = this.options.isClose;
	        var btnok = null, btncancel = null;
	        this._close = function () {
	            $(this).unbind('click');
	            if (hasOk) {
	                btnok.unbind('click')
	            }
	            if (hasCancel) {
	                btncancel.unbind('click')
	            }
	            if (self.options.closeCb) {
	                self.options.closeCb()
	            }
	            self._remove();
	        };
	        if (hasTitle) {
	            $('#t' + id).css('cursor', 'default');
	            if (isClose) {
	                $('#c' + id).on('click', self._close);
	            }
	        } else {
	            if (self.options.time) {
	                setTimeout(function () {
	                    self._remove();
	                }, self.options.time);
	            }
	        }
	        if (hasOk) {
	            btnok = $('#ob' + id).click(function () {
	                if (self.options.ok.fn) {
	                    self.options.ok.fn();
	                }
	                return false;
	            });
	        }
	        if (hasCancel) {
	            btncancel = $('#cb' + id).click(function () {
	                if (self.options.cancel.fn) {
	                    self.options.cancel.fn();
	                }
	                return false;
	            });
	        }
	        if (self.options.maskClose) {
	            $('#l' + id).click(function () {
	                self._remove();
	                return false;
	            });
	        }
	        return this;
	    },
	    _remove: function () {
	        var id = this._id,
	            l = document.getElementById('l' + id),
	            d = document.getElementById('d' + id);

	        if (d) {
	            document.body.removeChild(d);
	        }
	        if (l) {
	            document.body.removeChild(l);
	        }
	    },
	    close: function () {
	        if (this._close) {
	            this._close.call(document.getElementById('c' + this._id));
	        }
	    },
	    show: function () {

	    }
	};
	module.exports =  Dialog;

/***/ },
/* 10 */
/***/ function(module, exports) {

	module.exports = "<div id=\"payView\">\r\n    <div class=\"top-banner\">\r\n        <img class=\"img-responsive\" src=\"{{=globConfig.imageUrl}}/3.jpg\">\r\n    </div>\r\n    <div class=\"za-container\">\r\n        <br>\r\n        <div class=\"text-danger\">对不起，您还不是会员，付费后才能使用！</div>\r\n        <br>\r\n        <div class=\"za-alert za-alert-warning\">\r\n            付费后您能同时获得我们的代理资格！<br>\r\n            (此服务有效期为1年，以购买之日起生效！)\r\n        </div>\r\n        <div class=\"input-group\">\r\n            服务费共计：<span class=\"text-danger\">25元</span>\r\n        </div>\r\n        <div id=\"buyBaoForm\" class=\"form-group\">\r\n            <div class=\"input-group input-group-sm\">\r\n                <span class=\"input-group-addon\" id=\"sizing-addon1\">微信号</span>\r\n                <input id=\"weixin\" name=\"weixin\" type=\"text\" class=\"form-control\" placeholder=\"微信号\">\r\n            </div>\r\n            <div>\r\n                <button id=\"buyBao\" class=\"za-btn za-btn-primary za-btn-block\">立即购买</button>\r\n            </div>\r\n        </div>\r\n    </div>\r\n    <br>\r\n</div>";

/***/ },
/* 11 */
/***/ function(module, exports, __webpack_require__) {

	var doT = __webpack_require__(6);
	var tpl = __webpack_require__(12);


	module.exports = Backbone.View.extend({
	    el: $('#viewMain'),
	    template: doT.template(tpl),
	    tagName: 'div',
	    events: {
	    },
	    initialize: function () {

	    },
	    render: function () {
	        var _this = this;
	        _this.$el.addClass('block').html(_this.template());
	        _this.$el.siblings().removeClass('block');



	        return this;
	    }
	});

/***/ },
/* 12 */
/***/ function(module, exports) {

	module.exports = "<div id=\"welcomeView\">\r\n    <div class=\"za-container\">\r\n        <div>\r\n            <img class=\"img-responsive\" src=\"{{=globConfig.imageUrl}}/moneys.jpg\">\r\n        </div>\r\n        <div class=\"text-center\">\r\n            <h2 class=\"text-danger\">恭喜！开通成功！</h2>\r\n            <p class=\"za-alert za-alert-info\">\r\n                成为代理，推荐好友，您可以获得相应的佣金，立即 <a href=\"\">查看详情</a>\r\n            </p>\r\n        </div>\r\n        <div>\r\n            <button class=\"za-btn za-btn-primary za-btn-block\">我知道了</button>\r\n        </div>\r\n    </div>\r\n</div>";

/***/ },
/* 13 */
/***/ function(module, exports, __webpack_require__) {

	var doT = __webpack_require__(6);
	var dialog = __webpack_require__(9);
	var api = __webpack_require__(7);
	var FootBar = __webpack_require__(14);
	var RewardHead = __webpack_require__(17);
	var UserModel = __webpack_require__(19);
	var SoldNote = __webpack_require__(20);
	var tpl = __webpack_require__(21);

	module.exports = Backbone.View.extend({
	    el: '#rewardView',
	    template: doT.template(tpl),
	    tagName: 'div',
	    events: {
	        'click .pull-down': function(e) {
	            var target = e.target;
	            var targetBox = $(target).parents('.pull-down').attr('pannel');
	            $(target).removeClass('alert-animate');
	            if ($('[pannel-target='+ targetBox +']').hasClass('show')) {
	                $('[pannel-target='+ targetBox +']').removeClass('show')
	            } else {
	                $('[pannel-target='+ targetBox +']').addClass('show');
	            }

	        },
	        'click #drawMoney' : '_drawMoney'
	    },
	    _drawMoney:function() {
	        window.location = '#withdraw';
	    },
	    initialize: function () {
	        var _this = this;
	        /*_this._drawMoney();*/
	        _this.headView = {};
	        _this.userInfo = new UserModel();
	        _this.model = new SoldNote();
	        _this.listenTo(_this.userInfo, 'sync', this._renderHead);
	        _this.listenTo(_this.model, 'change', this.render);
	    },
	    _renderHead: function () {
	        var _this = this;
	        _this.headView.userInfo = _this.userInfo.toJSON();
	        _this.headView.soldNote = _this.model.toJSON();
	        var rewardHead = new RewardHead();
	        _this.$el.find('#headView').html(rewardHead.template(_this.headView));
	    },
	    render: function () {
	        var footBar = new FootBar();
	        var _this = this;
	        _this.$el.addClass('block')
	        _this.$el.siblings().removeClass('block');
	        _this.$el.find('#recordView').html(_this.template(_this.model.toJSON()));
	        _this.$el.append(footBar.render().template());
	        footBar.footBarCrent('.footer-bar a');
	        return this;
	    }
	});

/***/ },
/* 14 */
/***/ function(module, exports, __webpack_require__) {

	var doT = __webpack_require__(6);
	var footBarCrent = __webpack_require__(15);
	var tpl = __webpack_require__(16);

	module.exports = Backbone.View.extend({
	    template: doT.template(tpl),
	    tagName: 'div',
	    initialize: function () {
	        this.footBarCrent = footBarCrent;
	    },
	    render: function () {

	        return this;
	    }
	});

/***/ },
/* 15 */
/***/ function(module, exports) {

	module.exports = function(el){
	    var hash = location.hash;

	    $(el).removeClass('on');
	    if ($(el).attr('href')) {
	        $(el).filter('[href="'+ hash +'"]').addClass('on');
	    } else  {
	        $(el).filter('[nav="'+ hash +'"]').addClass('on');
	    }
	    if ($(el).filter('.on').length == 0) {
	        $(el).eq(0).addClass('on')
	    }
	};

/***/ },
/* 16 */
/***/ function(module, exports) {

	module.exports = "<div class=\"footer-bar\">\r\n    <a class=\"qcode\" href=\"#qcode\">推广海报</a>\r\n    <a href=\"#reward\">我的账户</a>\r\n</div>";

/***/ },
/* 17 */
/***/ function(module, exports, __webpack_require__) {

	var doT = __webpack_require__(6);
	var tpl = __webpack_require__(18);

	module.exports =  Backbone.View.extend({
	    template: doT.template(tpl),
	    tagName: 'div',
	    initialize: function () {
	    },
	    render: function () {
	        return this;
	    }
	});;

/***/ },
/* 18 */
/***/ function(module, exports) {

	module.exports = "<div class=\"header\">\r\n    <div class=\"za-media\">\r\n        <div class=\"za-media-left head-face\">\r\n            <img class=\"media-object\" src=\"{{=it.userInfo.headimgurl}}\">\r\n        </div>\r\n        <div class=\"za-media-body\">\r\n            <div class=\"row\">\r\n                <div class=\"col-xs-5 text-right\"><b>昵称</b></div>\r\n                <div class=\"col-xs-7\">{{=it.userInfo.nickname}}</div>\r\n            </div>\r\n            <div class=\"row\">\r\n                <div class=\"col-xs-5 text-right\"><b>会员ID</b></div>\r\n                <div class=\"col-xs-7\">{{=it.userInfo.id}}</div>\r\n            </div>\r\n            <div class=\"row\">\r\n                <div class=\"col-xs-5 text-right\"><b>VIP会员</b></div>\r\n                <div class=\"col-xs-7\">\r\n                    {{? it.userInfo.is_vip == 1}}\r\n                    是\r\n                    {{??}}\r\n                    否\r\n                    {{}}}\r\n                </div>\r\n            </div>\r\n            <div class=\"row\">\r\n                <div class=\"col-xs-5 text-right\"><b>加入时间</b></div>\r\n                <div class=\"col-xs-7\">{{=it.userInfo.time}}</div>\r\n            </div>\r\n            <div class=\"row\">\r\n                <div class=\"col-xs-5 text-right\"><b>会员级别</b></div>\r\n                <div class=\"col-xs-7\">{{=it.userInfo.level}}</div>\r\n            </div>\r\n        </div>\r\n    </div>\r\n</div>\r\n<div class=\"za-container\">\r\n    <div class=\"reward-info row\">\r\n        <div class=\"col-xs-6\"><a>累计总收入<br><span>({{=it.soldNote.total_money}}积分)</span></a></div>\r\n        <div class=\"col-xs-6\"><a>徒弟总进贡<br><span>({{=it.soldNote.suspend_money}}积分)</span></a></div>\r\n        <div class=\"col-xs-6\"><a>消费明细</a></div>\r\n        <div class=\"col-xs-6\"><a href=\"#/rank/all\">排行榜</a></div>\r\n    </div>\r\n</div>\r\n<div class=\"za-alert za-alert-warning text-center\">\r\n    <b>可提现积分 </b><br><span style=\"font-size: 3rem\" class=\"text-danger\">{{=it.soldNote.capable_money}}</span>\r\n    <button id=\"drawMoney\" data-money=\"{{=it.soldNote.capable_money}}\" class=\"za-btn za-btn-block za-btn-danger\">我要提现</button>\r\n    仅可提现100的整数（100积分=1元）\r\n    <span pannel=\"info-cash\" class=\"pull-down text-danger\"><span class=\"iconfont icon-iconfont14 alert-animate\"></span></span>\r\n    <div class=\"tips\" pannel-target=\"info-cash\" style=\"display: none\">\r\n        <span class=\"text-danger\">若可提现金额小于提现额度不能提现</span><br>\r\n        1、必须满足积分超过100分，即最低1元方可提现；<br>\r\n        2、推广的好友关注公众号即可获得一个积分红包；<br>\r\n        3、可提现结算周期为24小时，即指第二次提现申请与第一次提现申请需间隔24小时；<br>\r\n        4、您可自主提现，提现金额转到微信零钱；<br>\r\n        5、爆粉大师拥有本活动最终解释权\r\n    </div>\r\n</div>\r\n<div class=\"za-container\">\r\n    <h3>最近三天收入</h3>\r\n    <div class=\"panel-list\">\r\n        <div class=\"row\">\r\n            <div class=\"col-xs-8\">\r\n                <b>今日收入</b>\r\n            </div>\r\n            <div class=\"col-xs-4 text-right\">\r\n                <span class=\"text-danger\">￥&nbsp;134</span>\r\n            </div>\r\n        </div>\r\n        <div class=\"row\">\r\n            <div class=\"col-xs-8\">\r\n                <b>昨日收入</b>\r\n            </div>\r\n            <div class=\"col-xs-4 text-right\">\r\n                <span class=\"text-danger\">￥&nbsp;134</span>\r\n            </div>\r\n        </div>\r\n        <div class=\"row\">\r\n            <div class=\"col-xs-8\">\r\n                <b>前日收入</b>\r\n            </div>\r\n            <div class=\"col-xs-4 text-right\">\r\n                <span class=\"text-danger\">￥&nbsp;134</span>\r\n            </div>\r\n        </div>\r\n    </div>\r\n\r\n</div>\r\n";

/***/ },
/* 19 */
/***/ function(module, exports, __webpack_require__) {

	var api = __webpack_require__(7);
	module.exports =  Backbone.Model.extend({
	    defaults:function() {
	        return {
	            energy: "0",
	            id: 21,
	            is_queue: false,
	            is_vip: 1,
	            level: "普通会员",
	            nickname: "聊天交友，互粉互助",
	            time: "2015-10-22"
	        }
	    },
	    initialize: function () {
	        return this;
	    },
	    url: api.userInfo
	});


/***/ },
/* 20 */
/***/ function(module, exports, __webpack_require__) {

	var api = __webpack_require__(7);
	module.exports =  Backbone.Model.extend({
	    initialize: function () {
	        return this;
	    },
	    url: api.soldNote
	});

/***/ },
/* 21 */
/***/ function(module, exports) {

	module.exports = "\r\n{{? !it.data}}\r\n<div class=\"sk-three-bounce\">\r\n    <div class=\"sk-child sk-bounce1\"></div>\r\n    <div class=\"sk-child sk-bounce2\"></div>\r\n    <div class=\"sk-child sk-bounce3\"></div>\r\n</div>\r\n{{?? }}\r\n<div class=\"za-container\">\r\n    <h3>推广记录</h3>\r\n    {{? it.data.length > 0}}\r\n    <div class=\"panel-list\">\r\n        {{ for (var key in it.data) { }}\r\n        <div class=\"row\">\r\n            <div class=\"col-xs-8\">\r\n                <b>{{=it.data[key].nickname}}</b>\r\n            </div>\r\n            <div class=\"col-xs-4 text-right\">\r\n                <span class=\"text-danger\">￥&nbsp;{{=it.data[key].money}}</span>\r\n            </div>\r\n        </div>\r\n        {{ } }}\r\n    </div>\r\n    {{? it.total_count > it.list_rows }}\r\n    <div class=\"text-center\">\r\n        <ul class=\"za-page\">\r\n            <li>\r\n                <a   {{? it.current_page == 1}}\r\n                     href=\"javascript:;\"\r\n                     class=\"disabled\"\r\n                     {{??}}\r\n                     href=\"#reward/{{=(parseInt(it.current_page) - 1)}}\"\r\n                     {{?}} aria-label=\"Previous\">\r\n                    <span aria-hidden=\"true\">«</span>\r\n                </a>\r\n            </li>\r\n            {{var num = (it.total_pages < 5) ? it.total_pages : 5  ; }}\r\n            {{ for (var i=0; i < num; i++ ) { }}\r\n            {{? (parseInt(it.current_page) + i) <= it.total_pages}}\r\n            <li>\r\n                <a class=\"{{? it.current_page == (parseInt(it.current_page) + i) }}active{{ } }}\" href=\"#reward/{{=(parseInt(it.current_page) + i)}}\">\r\n                    {{=(parseInt(it.current_page) + i)}}\r\n                </a>\r\n            </li>\r\n            {{?}}\r\n            {{ } }}\r\n            <li>\r\n                <a {{? it.total_pages == it.current_page}}\r\n                   href=\"javascript:;\"\r\n                   class=\"disabled\"\r\n                   {{??}}\r\n                   href=\"#reward/{{=(parseInt(it.current_page) + 1)}}\"\r\n                   {{?}}\r\n                   aria-label=\"Next\">\r\n                    <span aria-hidden=\"true\">»</span>\r\n                </a>\r\n            </li>\r\n        </ul>\r\n    </div>\r\n    {{ } }}\r\n\r\n    {{?? }}\r\n    <div class=\"za-alert za-alert-warning\">暂无记录</div>\r\n    {{ } }}\r\n</div>\r\n<br><br><br>\r\n{{ } }}";

/***/ },
/* 22 */
/***/ function(module, exports, __webpack_require__) {

	var doT = __webpack_require__(6);
	var FootBar = __webpack_require__(14);
	var tpl = __webpack_require__(23);
	module.exports = Backbone.View.extend({
	    el: '#viewMain',
	    template: doT.template(tpl),
	    tagName: 'div',

	    initialize: function () {
	    },
	    render: function () {
	        var footBar = new FootBar();
	        var _this = this;
	        _this.$el.addClass('block').html(_this.template());
	        _this.$el.siblings().removeClass('block');
	        _this.$el.append(footBar.render().template());
	        footBar.footBarCrent();
	        return this;
	    }
	});

/***/ },
/* 23 */
/***/ function(module, exports) {

	module.exports = "{{? !it}}\r\n<div class=\"sk-three-bounce\">\r\n    <div class=\"sk-child sk-bounce1\"></div>\r\n    <div class=\"sk-child sk-bounce2\"></div>\r\n    <div class=\"sk-child sk-bounce3\"></div>\r\n</div>\r\n{{??}}\r\n<header>\r\n    <a class=\"back\" href=\"#reward\"><span class=\"iconfont icon-iconfont12\"></span></a>\r\n    <h1>排行榜</h1>\r\n</header>\r\n<nav class=\"za-nav\">\r\n    <a href=\"#/rank/all\"><span>总排行</span></a>\r\n    <a href=\"#/rank/week\"><span>周排行</span></a>\r\n    <a href=\"#/rank/month\"><span>月排行</span></a>\r\n</nav>\r\n    {{ for (var key in it.data) { }}\r\n    <div class=\"za-media\">\r\n        <div class=\"za-media-left\">\r\n            <img class=\"media-object\"\r\n                 src=\"{{=it.data[key].headimgurl}}\">\r\n        </div>\r\n        <div class=\"za-media-body\">\r\n            <h4 class=\"\r\n            {{? key <= 2 }} text-danger {{?}}\r\n            \">{{=it.data[key].nickname}}</h4>\r\n        </div>\r\n        <div class=\"za-media-right\">\r\n            <span class=\"text-info\">{{=it.data[key].total}}</span>\r\n        </div>\r\n    </div>\r\n    {{ } }}\r\n{{ } }}";

/***/ },
/* 24 */
/***/ function(module, exports, __webpack_require__) {

	var doT = __webpack_require__(6);
	var tpl = __webpack_require__(25);

	module.exports = Backbone.View.extend({
	    el: $('#viewMain'),
	    template: doT.template(tpl),
	    initialize: function () {
	        return this;
	    },
	    render: function () {
	        var _this = this;
	        _this.$el.addClass('block').html(_this.template());
	        return this;
	    }
	});

/***/ },
/* 25 */
/***/ function(module, exports) {

	module.exports = "<div class=\"scroll\">\r\n    <div class=\"za-container\">\r\n        <h3>加粉秘籍</h3>\r\n\r\n        <div class=\"alert-out alert-out-info\">\r\n            <h4 class=\"text-danger\">1.我要怎么加好友？</h4>\r\n                    答：点击进入爆粉大师的页面就可以逐个添加好友啦，好友列表每隔2分钟就会刷新一次\r\n            <br>\r\n            <img class=\"img-responsive\" src=\"{{=globConfig.imageUrl}}/add1.jpg\">\r\n            <br>\r\n            <img class=\"img-responsive\" src=\"{{=globConfig.imageUrl}}/add2.jpg\">\r\n\r\n        </div>\r\n        <div class=\"alert-out alert-out-info\">\r\n            <h4 class=\"text-danger\">2.我要怎么才能被别人添加？</h4>\r\n                    答：每手动添加一名好友就会获得一点能量值，消耗能量值2分钟之内即可以插队到下一轮队列中，系统会根据用户的能量值大小进行排序\r\n            <br>\r\n            <img class=\"img-responsive\" src=\"{{=globConfig.imageUrl}}/cd1.jpg\">\r\n            <img class=\"img-responsive\" src=\"{{=globConfig.imageUrl}}/cd2.jpg\">\r\n\r\n        </div>\r\n        <div class=\"alert-out alert-out-info\">\r\n            <h4 class=\"text-danger\">3.为什么我没法插队？</h4>\r\n                    答：要先发布您的二维码才可以排队哦。点击爆粉大师中的发布二维码查看具体步骤\r\n        </div>\r\n\r\n\r\n    </div>\r\n</div>";

/***/ },
/* 26 */
/***/ function(module, exports, __webpack_require__) {

	var doT = __webpack_require__(6);
	var tpl = __webpack_require__(27);

	module.exports = Backbone.View.extend({
	    el: $('#viewMain'),
	    template: doT.template(tpl),
	    initialize: function () {
	        return this;
	    },
	    render: function () {
	        var _this = this;
	        _this.$el.addClass('block').html(_this.template());
	        return this;
	    }
	});

/***/ },
/* 27 */
/***/ function(module, exports) {

	module.exports = "<div class=\"scroll\">\r\n    <div class=\"za-container\">\r\n        <h3>上传二维码教程</h3>\r\n        简单3步,即可完成 : )\r\n        <div class=\"alert-out alert-out-info\">\r\n            <h4 class=\"text-danger\">第一步  :  获取二维码</h4>\r\n            在微信下方菜单中选择“我”，点击个人信息栏，在菜单中选择“我的二维码”，点击右上角图标，选择保存图片。<br>\r\n            <img class=\"img-responsive\" src=\"{{=globConfig.imageUrl}}/qcd1.jpg\">\r\n        </div>\r\n        <div class=\"alert-out alert-out-info\">\r\n            <h4 class=\"text-danger\">第二步  :  发送二维码</h4>\r\n            将刚获取到的图片以对话的形式发送给“爆粉大师”公众号<br>\r\n            <img class=\"img-responsive\" src=\"{{=globConfig.imageUrl}}/qcd2.jpg\">\r\n        </div>\r\n        <div class=\"alert-out alert-out-info\">\r\n            <h4 class=\"text-danger\">第三步  :  确认二维码,完善信息</h4>\r\n            回到本页，根据提示，完成二维码确认，大功告成！\r\n        </div>\r\n    </div>\r\n</div>";

/***/ },
/* 28 */
/***/ function(module, exports, __webpack_require__) {

	var doT = __webpack_require__(6);
	var dialog = __webpack_require__(9);
	var Alert = __webpack_require__(29);
	var Biu = __webpack_require__(30);
	var Hammer = __webpack_require__(31);
	var api = __webpack_require__(7);
	var countDown = __webpack_require__(33);
	var EnergyBox = __webpack_require__(35);
	var QueueBox = __webpack_require__(37);
	var ChatModel = __webpack_require__(39);
	var ListModel = __webpack_require__(40);
	var UserModel = __webpack_require__(19);
	var Energy = __webpack_require__(41);
	var tpl = __webpack_require__(42);
	var hornMessageTpl = __webpack_require__(43);

	module.exports =  Backbone.View.extend({
	    el: '#listView',
	    template: doT.template(tpl),
	    templateMessage: doT.template(hornMessageTpl),
	    tagName: 'div',
	    events: {
	        'click .add-friend': 'addFriend',
	        'click #countDown a': '_refresh',
	        'click #userEnergy': 'queue',
	        'click #userHorn' : function(e) {
	            var _this = this;
	            var html = '<form class="horn-form"><div class="horn-form">';
	            var message = _this.chatmodel.get('message');
	            for (var i in message) {
	                html += '<label data-id="'+ message[i].id +'" class="list-group-item">' +
	                    message[i].value +
	                    '<input type="radio" name="message" value="'+ message[i].value +'" />' +
	                    '</label>';
	            }
	            html += '</div></form>';
	            dialog.prototype.choose = function() {
	                var _that = this;
	                $('#d' + _that.id).find('label').on('click',function(){
	                    $(this).addClass('active').siblings().removeClass('active');
	                })
	            };
	            var d = new dialog({
	                content: html,
	                title: '选择喇叭',
	                time: false,
	                ok: {
	                    value: '使用喇叭',
	                    fn: function () {
	                        var data = $('#d' + d.id).find('form').serializeArray();
	                        console.log(data);
	                        if (data!='') {
	                            _this.socketIo.emit('horn', data);
	                            d.close();
	                        }
	                    }
	                },
	                cancel: function () {
	                    d.close();
	                }
	            });
	            d.choose();
	        }
	    },
	    /*
	     * 刷新数据列表
	     * */
	    _refresh: function (e) {
	        $(e.target).parents('a').html('<i class="iconfont icon-shuaxin roll"></i>请求中...').addClass('disabled');

	        var _this = this;
	        if (_this.refrshClick) {
	            _this.refrshClick = false;
	            _this.getData();
	        }
	    },
	    /*
	     * 使用能量插队
	     * */
	    _userEnergy: function () {
	        var _this = this;
	        var uid = _this.userInfo.get('id');
	        var crentEnergy = _this.userInfo.get('energy');
	        var text_1 = '友情提示：插队能影响下次队列中的排名，倒计时结束后可以点击刷新看最新结果。';
	        if (crentEnergy == 0) {
	            var tips = new dialog({
	                content: '<div class="za-container">' +
	                '<div class=" za-alert za-alert-success">' +
	                '<div class="text-danger">你的能量点数为0，无法插队</div>' +
	                '</div>' +
	                '<div class="alert-out alert-out-warning">' +
	                text_1 +
	                '</div>' +
	                '</div>',
	                title: false,
	                time: false,
	                ok: function () {
	                    tips.close();
	                }

	            });
	            return;
	        }

	        var d = new dialog({
	            content: '<div class="za-container">' +
	            '<div class=" za-alert za-alert-success">' +
	            '插队需要消耗能量点，您现在的能量点数' + crentEnergy + '插队后会全部消耗完，请确认！' +
	            '</div>' +
	            '<div class="alert-out alert-out-warning">' +
	            text_1 +
	            '</div>' +
	            '</div>',
	            title: false,
	            time: 100000,
	            ok: {
	                value: '确定插队',
	                fn: function () {

	                    $.ajax({
	                        url: api.queue,
	                        data: {'qr': true},
	                        method: 'GET',
	                        success: function (data) {
	                            _this.userInfo.set('energy', 0);
	                            var tips = new Biu({
	                                box: '#listView',
	                                class: 'tips-biu text-danger energy-tips animated fadeInUp',
	                                content: '插队成功',
	                                time: 2000,
	                                css: {
	                                    left: '35%',
	                                    bottom: '2rem'
	                                }
	                            });
	                            d.close();
	                        }
	                    })

	                }
	            },
	            cancel: function () {
	                d.close();
	            }
	        })
	    },
	    /*
	     * 立即插队
	     * */
	    queue: function (e) {
	        var _this = this;
	        if (_this.queueClick) {
	            _this.queueClick = false;
	            $(e.target).html('请求中...').addClass('disabled');
	            $.ajax({
	                url: api.queue,
	                method: 'GET',
	                success: function (data) {
	                    _this.queueClick = true;
	                    $(e.target).html('立即插队').removeClass('disabled');
	                    if (data.qrcode === 0) {
	                        _this.upLoadQcode();
	                    } else {
	                        _this._userEnergy();
	                    }

	                },
	                error: function (res) {
	                    _this.queueClick = true;
	                    $(e.target).html('立即插队').removeClass('disabled')
	                }
	            });
	        }
	        return false;
	    },
	    /*
	     * 上传二维码
	     * */
	    upLoadQcode: function () {
	        var html = '您必须先上传二维码才能加入队列';
	        var uploadCode = new dialog({
	            content: html,
	            title: '上传二维码',
	            close: true,
	            ok: {
	                value: '立即上传',
	                fn: function () {
	                    wx.chooseImage({
	                        count: 1,
	                        success: function (res) {
	                            var localIds = res.localIds; // 返回选定照片的本地ID列表，localId可以作为img标签的src属性显示图片
	                            wx.uploadImage({
	                                localId: localIds[0], // 需要上传的图片的本地ID，由chooseImage接口获得
	                                isShowProgressTips: 1, // 默认为1，显示进度提示
	                                success: function (res) {
	                                    var serverId = res.serverId; // 返回图片的服务器端ID
	                                    $.ajax({
	                                        url: api.uploadQrcode,
	                                        data: {'serverId': serverId},
	                                        method: 'POST',
	                                        success: function (data) {
	                                            uploadCode.close();
	                                            if (data.status === 1) {
	                                                window.location = '#qcode_upload';
	                                            } else {
	                                                var d = new dialog({
	                                                    content: data.info,
	                                                    title: false,
	                                                    time: false,
	                                                    ok: function () {
	                                                        d.close();
	                                                    }
	                                                });
	                                            }
	                                        }
	                                    })

	                                }
	                            });
	                        }
	                    });
	                }
	            },
	            cancel: {
	                value: '从公众帐号上传',
	                fn: function () {
	                    window.location = '#jiaochen/qcode';
	                    uploadCode.close();
	                }
	            }
	        });
	    },
	    /*
	     * 加好友
	     * */
	    PlusEnergy: null,
	    addFriend: function (e) {
	        var _this = this;
	        var target = e.target;
	        var imgUrl = $(target).data('qcode');
	        var myId = _this.userInfo.get('id');
	        var uid = $(target).data('uid');
	        var imageObj = new Image();
	        imageObj.src = imgUrl;
	        imageObj.className = 'img-responsive';
	        var html = '<div class="sk-cube-grid"><div class="sk-cube sk-cube1"></div><div class="sk-cube sk-cube2"></div><div class="sk-cube sk-cube3"></div><div class="sk-cube sk-cube4"></div><div class="sk-cube sk-cube5"></div><div class="sk-cube sk-cube6"></div><div class="sk-cube sk-cube7"></div><div class="sk-cube sk-cube8"></div><div class="sk-cube sk-cube9"></div></div>';
	        dialog.prototype.addFriend = function () {
	            var _that = this;
	            imageObj.onload = function () {
	                $('#d' + _that.id).find('.d-content > .d-c-p').html(imageObj);
	                $('#d' + _that.id).find('.sk-cube-grid').remove();
	                _that._position();
	                var imgEl = $('#d' + _that.id + ' img');
	                var handler = new Hammer(imgEl[0]);
	                var first = true;
	                var crentEnergy = parseInt(_this.userInfo.get('energy'));
	                handler.on('press', function () {
	                    if (!first) {
	                        console.log('无法重复提交');
	                        return;
	                    }
	                    $.ajax({
	                        url: _this.energy.url,
	                        data: {'uid': myId},
	                        method: 'POST',
	                        success: function (data) {
	                            _this.PlusEnergy = data.energy;
	                            first = false;
	                            /*
	                             * 是否长按了二维码
	                             * */
	                            codeBox.isAdd = true;
	                            var num = crentEnergy + 1;
	                            _this.userInfo.set('energy', num);
	                        }
	                    })
	                });
	            }
	        };
	        dialog.prototype.isAdd = false;
	        var codeBox = new dialog({
	            content: html,
	            title: '长按二维码',
	            close: true,
	            closeCb: function () {
	                /*
	                 * 是否长按了二维码，如果是，则能量增加的效果
	                 * */
	                if (codeBox.isAdd) {
	                    var tips = new Biu({
	                        box: '#listView',
	                        class: 'tips-biu text-danger energy-tips animated fadeInUp',
	                        content: '+' + _this.PlusEnergy,
	                        time: 2000,
	                        css: {
	                            left: '45%',
	                            bottom: '45%'
	                        }
	                    });
	                }
	            }
	        });
	        codeBox.addFriend();
	        return false;
	    },
	    initialize: function () {
	        var _this = this;
	        /*
	         * 立即插队按钮单次点击控制
	         * */
	        _this.queueClick = true;
	        _this.refrshClick = true;
	        /*
	         * 列表数据模型
	         * */
	        _this.model = new ListModel();
	        /*
	         * 用户信息
	         * */
	        _this.userInfo = new UserModel();
	        /*
	         * 能量点数
	         * */
	        _this.energy = new Energy();
	        /*
	         * 喇叭信息
	         * */
	        _this.chatmodel = new ChatModel;
	        _this.listenTo(_this.model, 'change', this.render);
	        _this.listenTo(_this.userInfo, 'sync', this._rendUser);
	        _this.listenTo(_this.userInfo, 'change:energy', this._rendEnergy);
	        _this.listenTo(_this.model, 'change:time', this._countDown);
	    },
	    _rendUser: function () {
	        var _this = this;
	        _this._renderQueue();
	        _this._rendEnergy();
	    },
	    getData: function () {
	        var _this = this;
	        _this.userInfo.fetch();
	        _this.model.fetch({
	            success: function () {
	                _this.refrshClick = true;
	            }
	        });
	    },
	    _rendEnergy: function () {
	        var _this = this;
	        var crentEnergy = _this.userInfo.get('energy');
	        var total = 500;
	        var energyBox = new EnergyBox();
	        var num = crentEnergy / total;
	        _this.$el.find('#energyView').html(energyBox.template());
	        /*
	         * 转换成百分比
	         * */
	        var toPercent = function (num, n) {
	            n = n || 2;
	            return ( Math.round(num * Math.pow(10, n + 2)) / Math.pow(10, n) ).toFixed(n) + '%';
	        };
	        var percent = toPercent(num, 2);
	        this.percent = percent;
	        $('.za-progress-bar').css({
	            'width': percent
	        });
	        return this;
	    },
	    _renderQueue: function () {
	        var _this = this;
	        /*
	         * 渲染排入队列
	         * */
	        var queueBox = new QueueBox();
	        _this.$el.find('#queueView').html(queueBox.template(_this.userInfo.toJSON()));
	        _this._countDown();
	        return this;
	    },
	    _countDown: function () {
	        var restTime = this.model.get('time');
	        /*
	         * 倒计时
	         * */
	        var $countDown = $('#countDown');
	        countDown($countDown, restTime);
	        return this;
	    },
	    _renderHorn:function(){
	        var _this = this;
	        _this.socketIo =  io.connect(api.socketHorn);
	        _this.socketIo.on('connect', function(){
	            _this.socketIo.emit('login', globConfig.uid);
	        });
	        //监听喇叭信息
	        _this.socketIo.on('horn', function(o){
	            _this.$el.find('#listHornView').html(_this.templateMessage(o));
	        });
	        return this;
	    },
	    render: function () {
	        var _this = this;
	        _this.$el.find('#listContView').html(_this.template(_this.model.toJSON().data));
	        _this._renderHorn();
	        return this;
	    }
	});

/***/ },
/* 29 */
/***/ function(module, exports) {

	'use strict';
	var dismiss = '[data-dismiss="alert"]';
	var Alert = function (el) {
	    $(el).on('click', dismiss, this.close)
	};

	Alert.VERSION = '3.3.5';

	Alert.TRANSITION_DURATION = 150;

	Alert.prototype.close = function (e) {
	    var $this = $(this);
	    var selector = $this.attr('data-target');

	    if (!selector) {
	        selector = $this.attr('href');
	        selector = selector && selector.replace(/.*(?=#[^\s]*$)/, '') ;// strip for ie7
	    }

	    var $parent = $(selector);

	    if (e) e.preventDefault();

	    if (!$parent.length) {
	        $parent = $this.closest('.za-alert')
	    }

	    $parent.trigger(e = $.Event('close.bs.alert'));

	    if (e.isDefaultPrevented()) return;

	    $parent.removeClass('in');

	    function removeElement() {
	        // detach from parent, fire event then clean up data
	        $parent.detach().trigger('closed.bs.alert').remove()
	    }

	    $.support.transition && $parent.hasClass('fade') ?
	        $parent
	            .one('bsTransitionEnd', removeElement)
	            .emulateTransitionEnd(Alert.TRANSITION_DURATION) :
	        removeElement()
	};


	// ALERT PLUGIN DEFINITION
	// =======================

	function Plugin(option) {
	    return this.each(function () {
	        var $this = $(this)
	        var data = $this.data('bs.alert')

	        if (!data) $this.data('bs.alert', (data = new Alert(this)))
	        if (typeof option == 'string') data[option].call($this)
	    })
	}

	var old = $.fn.alert;

	$.fn.alert = Plugin;
	$.fn.alert.Constructor = Alert;


	// ALERT NO CONFLICT
	// =================

	$.fn.alert.noConflict = function () {
	    $.fn.alert = old;
	    return this
	};

	$(document).on('click.bs.alert.data-api', dismiss, Alert.prototype.close)
	// ALERT DATA-API
	// ==============

	module.exports = Alert

/***/ },
/* 30 */
/***/ function(module, exports) {

	var BiuTip = function(options) {
	    this.option = {
	        box:'body',
	        class:'tips-biu',
	        content:'哈哈！',
	        time:1000,
	        css:null
	    };
	    this.option = $.extend(this.option, options);
	    this.el = $('<div >');
	    this.el.addClass(this.option.class);
	    this.el.html(this.option.content);
	    this.el.css(this.option.css);
	    this.init().timeOut();
	};
	BiuTip.prototype.timeOut = function() {
	    var _this = this;
	    setTimeout(function(){
	        _this.el.remove();
	    },_this.option.time)
	};
	BiuTip.prototype.init = function() {
	    $(this.option.box).append(this.el)
	    return this;
	};
	module.exports = BiuTip;

/***/ },
/* 31 */
/***/ function(module, exports, __webpack_require__) {

	var __WEBPACK_AMD_DEFINE_RESULT__;
	(function(window, document, exportName, undefined) {
	    'use strict';

	    var VENDOR_PREFIXES = ['', 'webkit', 'moz', 'MS', 'ms', 'o'];
	    var TEST_ELEMENT = document.createElement('div');

	    var TYPE_FUNCTION = 'function';

	    var round = Math.round;
	    var abs = Math.abs;
	    var now = Date.now;

	    /**
	     * set a timeout with a given scope
	     * @param {Function} fn
	     * @param {Number} timeout
	     * @param {Object} context
	     * @returns {number}
	     */
	    function setTimeoutContext(fn, timeout, context) {
	        return setTimeout(bindFn(fn, context), timeout);
	    }

	    /**
	     * if the argument is an array, we want to execute the fn on each entry
	     * if it aint an array we don't want to do a thing.
	     * this is used by all the methods that accept a single and array argument.
	     * @param {*|Array} arg
	     * @param {String} fn
	     * @param {Object} [context]
	     * @returns {Boolean}
	     */
	    function invokeArrayArg(arg, fn, context) {
	        if (Array.isArray(arg)) {
	            each(arg, context[fn], context);
	            return true;
	        }
	        return false;
	    }

	    /**
	     * walk objects and arrays
	     * @param {Object} obj
	     * @param {Function} iterator
	     * @param {Object} context
	     */
	    function each(obj, iterator, context) {
	        var i;

	        if (!obj) {
	            return;
	        }

	        if (obj.forEach) {
	            obj.forEach(iterator, context);
	        } else if (obj.length !== undefined) {
	            i = 0;
	            while (i < obj.length) {
	                iterator.call(context, obj[i], i, obj);
	                i++;
	            }
	        } else {
	            for (i in obj) {
	                obj.hasOwnProperty(i) && iterator.call(context, obj[i], i, obj);
	            }
	        }
	    }

	    /**
	     * extend object.
	     * means that properties in dest will be overwritten by the ones in src.
	     * @param {Object} dest
	     * @param {Object} src
	     * @param {Boolean} [merge]
	     * @returns {Object} dest
	     */
	    function extend(dest, src, merge) {
	        var keys = Object.keys(src);
	        var i = 0;
	        while (i < keys.length) {
	            if (!merge || (merge && dest[keys[i]] === undefined)) {
	                dest[keys[i]] = src[keys[i]];
	            }
	            i++;
	        }
	        return dest;
	    }

	    /**
	     * merge the values from src in the dest.
	     * means that properties that exist in dest will not be overwritten by src
	     * @param {Object} dest
	     * @param {Object} src
	     * @returns {Object} dest
	     */
	    function merge(dest, src) {
	        return extend(dest, src, true);
	    }

	    /**
	     * simple class inheritance
	     * @param {Function} child
	     * @param {Function} base
	     * @param {Object} [properties]
	     */
	    function inherit(child, base, properties) {
	        var baseP = base.prototype,
	            childP;

	        childP = child.prototype = Object.create(baseP);
	        childP.constructor = child;
	        childP._super = baseP;

	        if (properties) {
	            extend(childP, properties);
	        }
	    }

	    /**
	     * simple function bind
	     * @param {Function} fn
	     * @param {Object} context
	     * @returns {Function}
	     */
	    function bindFn(fn, context) {
	        return function boundFn() {
	            return fn.apply(context, arguments);
	        };
	    }

	    /**
	     * let a boolean value also be a function that must return a boolean
	     * this first item in args will be used as the context
	     * @param {Boolean|Function} val
	     * @param {Array} [args]
	     * @returns {Boolean}
	     */
	    function boolOrFn(val, args) {
	        if (typeof val == TYPE_FUNCTION) {
	            return val.apply(args ? args[0] || undefined : undefined, args);
	        }
	        return val;
	    }

	    /**
	     * use the val2 when val1 is undefined
	     * @param {*} val1
	     * @param {*} val2
	     * @returns {*}
	     */
	    function ifUndefined(val1, val2) {
	        return (val1 === undefined) ? val2 : val1;
	    }

	    /**
	     * addEventListener with multiple events at once
	     * @param {EventTarget} target
	     * @param {String} types
	     * @param {Function} handler
	     */
	    function addEventListeners(target, types, handler) {
	        each(splitStr(types), function(type) {
	            target.addEventListener(type, handler, false);
	        });
	    }

	    /**
	     * removeEventListener with multiple events at once
	     * @param {EventTarget} target
	     * @param {String} types
	     * @param {Function} handler
	     */
	    function removeEventListeners(target, types, handler) {
	        each(splitStr(types), function(type) {
	            target.removeEventListener(type, handler, false);
	        });
	    }

	    /**
	     * find if a node is in the given parent
	     * @method hasParent
	     * @param {HTMLElement} node
	     * @param {HTMLElement} parent
	     * @return {Boolean} found
	     */
	    function hasParent(node, parent) {
	        while (node) {
	            if (node == parent) {
	                return true;
	            }
	            node = node.parentNode;
	        }
	        return false;
	    }

	    /**
	     * small indexOf wrapper
	     * @param {String} str
	     * @param {String} find
	     * @returns {Boolean} found
	     */
	    function inStr(str, find) {
	        return str.indexOf(find) > -1;
	    }

	    /**
	     * split string on whitespace
	     * @param {String} str
	     * @returns {Array} words
	     */
	    function splitStr(str) {
	        return str.trim().split(/\s+/g);
	    }

	    /**
	     * find if a array contains the object using indexOf or a simple polyFill
	     * @param {Array} src
	     * @param {String} find
	     * @param {String} [findByKey]
	     * @return {Boolean|Number} false when not found, or the index
	     */
	    function inArray(src, find, findByKey) {
	        if (src.indexOf && !findByKey) {
	            return src.indexOf(find);
	        } else {
	            var i = 0;
	            while (i < src.length) {
	                if ((findByKey && src[i][findByKey] == find) || (!findByKey && src[i] === find)) {
	                    return i;
	                }
	                i++;
	            }
	            return -1;
	        }
	    }

	    /**
	     * convert array-like objects to real arrays
	     * @param {Object} obj
	     * @returns {Array}
	     */
	    function toArray(obj) {
	        return Array.prototype.slice.call(obj, 0);
	    }

	    /**
	     * unique array with objects based on a key (like 'id') or just by the array's value
	     * @param {Array} src [{id:1},{id:2},{id:1}]
	     * @param {String} [key]
	     * @param {Boolean} [sort=False]
	     * @returns {Array} [{id:1},{id:2}]
	     */
	    function uniqueArray(src, key, sort) {
	        var results = [];
	        var values = [];
	        var i = 0;

	        while (i < src.length) {
	            var val = key ? src[i][key] : src[i];
	            if (inArray(values, val) < 0) {
	                results.push(src[i]);
	            }
	            values[i] = val;
	            i++;
	        }

	        if (sort) {
	            if (!key) {
	                results = results.sort();
	            } else {
	                results = results.sort(function sortUniqueArray(a, b) {
	                    return a[key] > b[key];
	                });
	            }
	        }

	        return results;
	    }

	    /**
	     * get the prefixed property
	     * @param {Object} obj
	     * @param {String} property
	     * @returns {String|Undefined} prefixed
	     */
	    function prefixed(obj, property) {
	        var prefix, prop;
	        var camelProp = property[0].toUpperCase() + property.slice(1);

	        var i = 0;
	        while (i < VENDOR_PREFIXES.length) {
	            prefix = VENDOR_PREFIXES[i];
	            prop = (prefix) ? prefix + camelProp : property;

	            if (prop in obj) {
	                return prop;
	            }
	            i++;
	        }
	        return undefined;
	    }

	    /**
	     * get a unique id
	     * @returns {number} uniqueId
	     */
	    var _uniqueId = 1;
	    function uniqueId() {
	        return _uniqueId++;
	    }

	    /**
	     * get the window object of an element
	     * @param {HTMLElement} element
	     * @returns {DocumentView|Window}
	     */
	    function getWindowForElement(element) {
	        var doc = element.ownerDocument;
	        return (doc.defaultView || doc.parentWindow);
	    }

	    var MOBILE_REGEX = /mobile|tablet|ip(ad|hone|od)|android/i;

	    var SUPPORT_TOUCH = ('ontouchstart' in window);
	    var SUPPORT_POINTER_EVENTS = prefixed(window, 'PointerEvent') !== undefined;
	    var SUPPORT_ONLY_TOUCH = SUPPORT_TOUCH && MOBILE_REGEX.test(navigator.userAgent);

	    var INPUT_TYPE_TOUCH = 'touch';
	    var INPUT_TYPE_PEN = 'pen';
	    var INPUT_TYPE_MOUSE = 'mouse';
	    var INPUT_TYPE_KINECT = 'kinect';

	    var COMPUTE_INTERVAL = 25;

	    var INPUT_START = 1;
	    var INPUT_MOVE = 2;
	    var INPUT_END = 4;
	    var INPUT_CANCEL = 8;

	    var DIRECTION_NONE = 1;
	    var DIRECTION_LEFT = 2;
	    var DIRECTION_RIGHT = 4;
	    var DIRECTION_UP = 8;
	    var DIRECTION_DOWN = 16;

	    var DIRECTION_HORIZONTAL = DIRECTION_LEFT | DIRECTION_RIGHT;
	    var DIRECTION_VERTICAL = DIRECTION_UP | DIRECTION_DOWN;
	    var DIRECTION_ALL = DIRECTION_HORIZONTAL | DIRECTION_VERTICAL;

	    var PROPS_XY = ['x', 'y'];
	    var PROPS_CLIENT_XY = ['clientX', 'clientY'];

	    /**
	     * create new input type manager
	     * @param {Manager} manager
	     * @param {Function} callback
	     * @returns {Input}
	     * @constructor
	     */
	    function Input(manager, callback) {
	        var self = this;
	        this.manager = manager;
	        this.callback = callback;
	        this.element = manager.element;
	        this.target = manager.options.inputTarget;

	        // smaller wrapper around the handler, for the scope and the enabled state of the manager,
	        // so when disabled the input events are completely bypassed.
	        this.domHandler = function(ev) {
	            if (boolOrFn(manager.options.enable, [manager])) {
	                self.handler(ev);
	            }
	        };

	        this.init();

	    }

	    Input.prototype = {
	        /**
	         * should handle the inputEvent data and trigger the callback
	         * @virtual
	         */
	        handler: function() { },

	        /**
	         * bind the events
	         */
	        init: function() {
	            this.evEl && addEventListeners(this.element, this.evEl, this.domHandler);
	            this.evTarget && addEventListeners(this.target, this.evTarget, this.domHandler);
	            this.evWin && addEventListeners(getWindowForElement(this.element), this.evWin, this.domHandler);
	        },

	        /**
	         * unbind the events
	         */
	        destroy: function() {
	            this.evEl && removeEventListeners(this.element, this.evEl, this.domHandler);
	            this.evTarget && removeEventListeners(this.target, this.evTarget, this.domHandler);
	            this.evWin && removeEventListeners(getWindowForElement(this.element), this.evWin, this.domHandler);
	        }
	    };

	    /**
	     * create new input type manager
	     * called by the Manager constructor
	     * @param {Hammer} manager
	     * @returns {Input}
	     */
	    function createInputInstance(manager) {
	        var Type;
	        var inputClass = manager.options.inputClass;

	        if (inputClass) {
	            Type = inputClass;
	        } else if (SUPPORT_POINTER_EVENTS) {
	            Type = PointerEventInput;
	        } else if (SUPPORT_ONLY_TOUCH) {
	            Type = TouchInput;
	        } else if (!SUPPORT_TOUCH) {
	            Type = MouseInput;
	        } else {
	            Type = TouchMouseInput;
	        }
	        return new (Type)(manager, inputHandler);
	    }

	    /**
	     * handle input events
	     * @param {Manager} manager
	     * @param {String} eventType
	     * @param {Object} input
	     */
	    function inputHandler(manager, eventType, input) {
	        var pointersLen = input.pointers.length;
	        var changedPointersLen = input.changedPointers.length;
	        var isFirst = (eventType & INPUT_START && (pointersLen - changedPointersLen === 0));
	        var isFinal = (eventType & (INPUT_END | INPUT_CANCEL) && (pointersLen - changedPointersLen === 0));

	        input.isFirst = !!isFirst;
	        input.isFinal = !!isFinal;

	        if (isFirst) {
	            manager.session = {};
	        }

	        // source event is the normalized value of the domEvents
	        // like 'touchstart, mouseup, pointerdown'
	        input.eventType = eventType;

	        // compute scale, rotation etc
	        computeInputData(manager, input);

	        // emit secret event
	        manager.emit('hammer.input', input);

	        manager.recognize(input);
	        manager.session.prevInput = input;
	    }

	    /**
	     * extend the data with some usable properties like scale, rotate, velocity etc
	     * @param {Object} manager
	     * @param {Object} input
	     */
	    function computeInputData(manager, input) {
	        var session = manager.session;
	        var pointers = input.pointers;
	        var pointersLength = pointers.length;

	        // store the first input to calculate the distance and direction
	        if (!session.firstInput) {
	            session.firstInput = simpleCloneInputData(input);
	        }

	        // to compute scale and rotation we need to store the multiple touches
	        if (pointersLength > 1 && !session.firstMultiple) {
	            session.firstMultiple = simpleCloneInputData(input);
	        } else if (pointersLength === 1) {
	            session.firstMultiple = false;
	        }

	        var firstInput = session.firstInput;
	        var firstMultiple = session.firstMultiple;
	        var offsetCenter = firstMultiple ? firstMultiple.center : firstInput.center;

	        var center = input.center = getCenter(pointers);
	        input.timeStamp = now();
	        input.deltaTime = input.timeStamp - firstInput.timeStamp;

	        input.angle = getAngle(offsetCenter, center);
	        input.distance = getDistance(offsetCenter, center);

	        computeDeltaXY(session, input);
	        input.offsetDirection = getDirection(input.deltaX, input.deltaY);

	        input.scale = firstMultiple ? getScale(firstMultiple.pointers, pointers) : 1;
	        input.rotation = firstMultiple ? getRotation(firstMultiple.pointers, pointers) : 0;

	        computeIntervalInputData(session, input);

	        // find the correct target
	        var target = manager.element;
	        if (hasParent(input.srcEvent.target, target)) {
	            target = input.srcEvent.target;
	        }
	        input.target = target;
	    }

	    function computeDeltaXY(session, input) {
	        var center = input.center;
	        var offset = session.offsetDelta || {};
	        var prevDelta = session.prevDelta || {};
	        var prevInput = session.prevInput || {};

	        if (input.eventType === INPUT_START || prevInput.eventType === INPUT_END) {
	            prevDelta = session.prevDelta = {
	                x: prevInput.deltaX || 0,
	                y: prevInput.deltaY || 0
	            };

	            offset = session.offsetDelta = {
	                x: center.x,
	                y: center.y
	            };
	        }

	        input.deltaX = prevDelta.x + (center.x - offset.x);
	        input.deltaY = prevDelta.y + (center.y - offset.y);
	    }

	    /**
	     * velocity is calculated every x ms
	     * @param {Object} session
	     * @param {Object} input
	     */
	    function computeIntervalInputData(session, input) {
	        var last = session.lastInterval || input,
	            deltaTime = input.timeStamp - last.timeStamp,
	            velocity, velocityX, velocityY, direction;

	        if (input.eventType != INPUT_CANCEL && (deltaTime > COMPUTE_INTERVAL || last.velocity === undefined)) {
	            var deltaX = last.deltaX - input.deltaX;
	            var deltaY = last.deltaY - input.deltaY;

	            var v = getVelocity(deltaTime, deltaX, deltaY);
	            velocityX = v.x;
	            velocityY = v.y;
	            velocity = (abs(v.x) > abs(v.y)) ? v.x : v.y;
	            direction = getDirection(deltaX, deltaY);

	            session.lastInterval = input;
	        } else {
	            // use latest velocity info if it doesn't overtake a minimum period
	            velocity = last.velocity;
	            velocityX = last.velocityX;
	            velocityY = last.velocityY;
	            direction = last.direction;
	        }

	        input.velocity = velocity;
	        input.velocityX = velocityX;
	        input.velocityY = velocityY;
	        input.direction = direction;
	    }

	    /**
	     * create a simple clone from the input used for storage of firstInput and firstMultiple
	     * @param {Object} input
	     * @returns {Object} clonedInputData
	     */
	    function simpleCloneInputData(input) {
	        // make a simple copy of the pointers because we will get a reference if we don't
	        // we only need clientXY for the calculations
	        var pointers = [];
	        var i = 0;
	        while (i < input.pointers.length) {
	            pointers[i] = {
	                clientX: round(input.pointers[i].clientX),
	                clientY: round(input.pointers[i].clientY)
	            };
	            i++;
	        }

	        return {
	            timeStamp: now(),
	            pointers: pointers,
	            center: getCenter(pointers),
	            deltaX: input.deltaX,
	            deltaY: input.deltaY
	        };
	    }

	    /**
	     * get the center of all the pointers
	     * @param {Array} pointers
	     * @return {Object} center contains `x` and `y` properties
	     */
	    function getCenter(pointers) {
	        var pointersLength = pointers.length;

	        // no need to loop when only one touch
	        if (pointersLength === 1) {
	            return {
	                x: round(pointers[0].clientX),
	                y: round(pointers[0].clientY)
	            };
	        }

	        var x = 0, y = 0, i = 0;
	        while (i < pointersLength) {
	            x += pointers[i].clientX;
	            y += pointers[i].clientY;
	            i++;
	        }

	        return {
	            x: round(x / pointersLength),
	            y: round(y / pointersLength)
	        };
	    }

	    /**
	     * calculate the velocity between two points. unit is in px per ms.
	     * @param {Number} deltaTime
	     * @param {Number} x
	     * @param {Number} y
	     * @return {Object} velocity `x` and `y`
	     */
	    function getVelocity(deltaTime, x, y) {
	        return {
	            x: x / deltaTime || 0,
	            y: y / deltaTime || 0
	        };
	    }

	    /**
	     * get the direction between two points
	     * @param {Number} x
	     * @param {Number} y
	     * @return {Number} direction
	     */
	    function getDirection(x, y) {
	        if (x === y) {
	            return DIRECTION_NONE;
	        }

	        if (abs(x) >= abs(y)) {
	            return x > 0 ? DIRECTION_LEFT : DIRECTION_RIGHT;
	        }
	        return y > 0 ? DIRECTION_UP : DIRECTION_DOWN;
	    }

	    /**
	     * calculate the absolute distance between two points
	     * @param {Object} p1 {x, y}
	     * @param {Object} p2 {x, y}
	     * @param {Array} [props] containing x and y keys
	     * @return {Number} distance
	     */
	    function getDistance(p1, p2, props) {
	        if (!props) {
	            props = PROPS_XY;
	        }
	        var x = p2[props[0]] - p1[props[0]],
	            y = p2[props[1]] - p1[props[1]];

	        return Math.sqrt((x * x) + (y * y));
	    }

	    /**
	     * calculate the angle between two coordinates
	     * @param {Object} p1
	     * @param {Object} p2
	     * @param {Array} [props] containing x and y keys
	     * @return {Number} angle
	     */
	    function getAngle(p1, p2, props) {
	        if (!props) {
	            props = PROPS_XY;
	        }
	        var x = p2[props[0]] - p1[props[0]],
	            y = p2[props[1]] - p1[props[1]];
	        return Math.atan2(y, x) * 180 / Math.PI;
	    }

	    /**
	     * calculate the rotation degrees between two pointersets
	     * @param {Array} start array of pointers
	     * @param {Array} end array of pointers
	     * @return {Number} rotation
	     */
	    function getRotation(start, end) {
	        return getAngle(end[1], end[0], PROPS_CLIENT_XY) - getAngle(start[1], start[0], PROPS_CLIENT_XY);
	    }

	    /**
	     * calculate the scale factor between two pointersets
	     * no scale is 1, and goes down to 0 when pinched together, and bigger when pinched out
	     * @param {Array} start array of pointers
	     * @param {Array} end array of pointers
	     * @return {Number} scale
	     */
	    function getScale(start, end) {
	        return getDistance(end[0], end[1], PROPS_CLIENT_XY) / getDistance(start[0], start[1], PROPS_CLIENT_XY);
	    }

	    var MOUSE_INPUT_MAP = {
	        mousedown: INPUT_START,
	        mousemove: INPUT_MOVE,
	        mouseup: INPUT_END
	    };

	    var MOUSE_ELEMENT_EVENTS = 'mousedown';
	    var MOUSE_WINDOW_EVENTS = 'mousemove mouseup';

	    /**
	     * Mouse events input
	     * @constructor
	     * @extends Input
	     */
	    function MouseInput() {
	        this.evEl = MOUSE_ELEMENT_EVENTS;
	        this.evWin = MOUSE_WINDOW_EVENTS;

	        this.allow = true; // used by Input.TouchMouse to disable mouse events
	        this.pressed = false; // mousedown state

	        Input.apply(this, arguments);
	    }

	    inherit(MouseInput, Input, {
	        /**
	         * handle mouse events
	         * @param {Object} ev
	         */
	        handler: function MEhandler(ev) {
	            var eventType = MOUSE_INPUT_MAP[ev.type];

	            // on start we want to have the left mouse button down
	            if (eventType & INPUT_START && ev.button === 0) {
	                this.pressed = true;
	            }

	            if (eventType & INPUT_MOVE && ev.which !== 1) {
	                eventType = INPUT_END;
	            }

	            // mouse must be down, and mouse events are allowed (see the TouchMouse input)
	            if (!this.pressed || !this.allow) {
	                return;
	            }

	            if (eventType & INPUT_END) {
	                this.pressed = false;
	            }

	            this.callback(this.manager, eventType, {
	                pointers: [ev],
	                changedPointers: [ev],
	                pointerType: INPUT_TYPE_MOUSE,
	                srcEvent: ev
	            });
	        }
	    });

	    var POINTER_INPUT_MAP = {
	        pointerdown: INPUT_START,
	        pointermove: INPUT_MOVE,
	        pointerup: INPUT_END,
	        pointercancel: INPUT_CANCEL,
	        pointerout: INPUT_CANCEL
	    };

	// in IE10 the pointer types is defined as an enum
	    var IE10_POINTER_TYPE_ENUM = {
	        2: INPUT_TYPE_TOUCH,
	        3: INPUT_TYPE_PEN,
	        4: INPUT_TYPE_MOUSE,
	        5: INPUT_TYPE_KINECT // see https://twitter.com/jacobrossi/status/480596438489890816
	    };

	    var POINTER_ELEMENT_EVENTS = 'pointerdown';
	    var POINTER_WINDOW_EVENTS = 'pointermove pointerup pointercancel';

	// IE10 has prefixed support, and case-sensitive
	    if (window.MSPointerEvent) {
	        POINTER_ELEMENT_EVENTS = 'MSPointerDown';
	        POINTER_WINDOW_EVENTS = 'MSPointerMove MSPointerUp MSPointerCancel';
	    }

	    /**
	     * Pointer events input
	     * @constructor
	     * @extends Input
	     */
	    function PointerEventInput() {
	        this.evEl = POINTER_ELEMENT_EVENTS;
	        this.evWin = POINTER_WINDOW_EVENTS;

	        Input.apply(this, arguments);

	        this.store = (this.manager.session.pointerEvents = []);
	    }

	    inherit(PointerEventInput, Input, {
	        /**
	         * handle mouse events
	         * @param {Object} ev
	         */
	        handler: function PEhandler(ev) {
	            var store = this.store;
	            var removePointer = false;

	            var eventTypeNormalized = ev.type.toLowerCase().replace('ms', '');
	            var eventType = POINTER_INPUT_MAP[eventTypeNormalized];
	            var pointerType = IE10_POINTER_TYPE_ENUM[ev.pointerType] || ev.pointerType;

	            var isTouch = (pointerType == INPUT_TYPE_TOUCH);

	            // get index of the event in the store
	            var storeIndex = inArray(store, ev.pointerId, 'pointerId');

	            // start and mouse must be down
	            if (eventType & INPUT_START && (ev.button === 0 || isTouch)) {
	                if (storeIndex < 0) {
	                    store.push(ev);
	                    storeIndex = store.length - 1;
	                }
	            } else if (eventType & (INPUT_END | INPUT_CANCEL)) {
	                removePointer = true;
	            }

	            // it not found, so the pointer hasn't been down (so it's probably a hover)
	            if (storeIndex < 0) {
	                return;
	            }

	            // update the event in the store
	            store[storeIndex] = ev;

	            this.callback(this.manager, eventType, {
	                pointers: store,
	                changedPointers: [ev],
	                pointerType: pointerType,
	                srcEvent: ev
	            });

	            if (removePointer) {
	                // remove from the store
	                store.splice(storeIndex, 1);
	            }
	        }
	    });

	    var SINGLE_TOUCH_INPUT_MAP = {
	        touchstart: INPUT_START,
	        touchmove: INPUT_MOVE,
	        touchend: INPUT_END,
	        touchcancel: INPUT_CANCEL
	    };

	    var SINGLE_TOUCH_TARGET_EVENTS = 'touchstart';
	    var SINGLE_TOUCH_WINDOW_EVENTS = 'touchstart touchmove touchend touchcancel';

	    /**
	     * Touch events input
	     * @constructor
	     * @extends Input
	     */
	    function SingleTouchInput() {
	        this.evTarget = SINGLE_TOUCH_TARGET_EVENTS;
	        this.evWin = SINGLE_TOUCH_WINDOW_EVENTS;
	        this.started = false;

	        Input.apply(this, arguments);
	    }

	    inherit(SingleTouchInput, Input, {
	        handler: function TEhandler(ev) {
	            var type = SINGLE_TOUCH_INPUT_MAP[ev.type];

	            // should we handle the touch events?
	            if (type === INPUT_START) {
	                this.started = true;
	            }

	            if (!this.started) {
	                return;
	            }

	            var touches = normalizeSingleTouches.call(this, ev, type);

	            // when done, reset the started state
	            if (type & (INPUT_END | INPUT_CANCEL) && touches[0].length - touches[1].length === 0) {
	                this.started = false;
	            }

	            this.callback(this.manager, type, {
	                pointers: touches[0],
	                changedPointers: touches[1],
	                pointerType: INPUT_TYPE_TOUCH,
	                srcEvent: ev
	            });
	        }
	    });

	    /**
	     * @this {TouchInput}
	     * @param {Object} ev
	     * @param {Number} type flag
	     * @returns {undefined|Array} [all, changed]
	     */
	    function normalizeSingleTouches(ev, type) {
	        var all = toArray(ev.touches);
	        var changed = toArray(ev.changedTouches);

	        if (type & (INPUT_END | INPUT_CANCEL)) {
	            all = uniqueArray(all.concat(changed), 'identifier', true);
	        }

	        return [all, changed];
	    }

	    var TOUCH_INPUT_MAP = {
	        touchstart: INPUT_START,
	        touchmove: INPUT_MOVE,
	        touchend: INPUT_END,
	        touchcancel: INPUT_CANCEL
	    };

	    var TOUCH_TARGET_EVENTS = 'touchstart touchmove touchend touchcancel';

	    /**
	     * Multi-user touch events input
	     * @constructor
	     * @extends Input
	     */
	    function TouchInput() {
	        this.evTarget = TOUCH_TARGET_EVENTS;
	        this.targetIds = {};

	        Input.apply(this, arguments);
	    }

	    inherit(TouchInput, Input, {
	        handler: function MTEhandler(ev) {
	            var type = TOUCH_INPUT_MAP[ev.type];
	            var touches = getTouches.call(this, ev, type);
	            if (!touches) {
	                return;
	            }

	            this.callback(this.manager, type, {
	                pointers: touches[0],
	                changedPointers: touches[1],
	                pointerType: INPUT_TYPE_TOUCH,
	                srcEvent: ev
	            });
	        }
	    });

	    /**
	     * @this {TouchInput}
	     * @param {Object} ev
	     * @param {Number} type flag
	     * @returns {undefined|Array} [all, changed]
	     */
	    function getTouches(ev, type) {
	        var allTouches = toArray(ev.touches);
	        var targetIds = this.targetIds;

	        // when there is only one touch, the process can be simplified
	        if (type & (INPUT_START | INPUT_MOVE) && allTouches.length === 1) {
	            targetIds[allTouches[0].identifier] = true;
	            return [allTouches, allTouches];
	        }

	        var i,
	            targetTouches,
	            changedTouches = toArray(ev.changedTouches),
	            changedTargetTouches = [],
	            target = this.target;

	        // get target touches from touches
	        targetTouches = allTouches.filter(function(touch) {
	            return hasParent(touch.target, target);
	        });

	        // collect touches
	        if (type === INPUT_START) {
	            i = 0;
	            while (i < targetTouches.length) {
	                targetIds[targetTouches[i].identifier] = true;
	                i++;
	            }
	        }

	        // filter changed touches to only contain touches that exist in the collected target ids
	        i = 0;
	        while (i < changedTouches.length) {
	            if (targetIds[changedTouches[i].identifier]) {
	                changedTargetTouches.push(changedTouches[i]);
	            }

	            // cleanup removed touches
	            if (type & (INPUT_END | INPUT_CANCEL)) {
	                delete targetIds[changedTouches[i].identifier];
	            }
	            i++;
	        }

	        if (!changedTargetTouches.length) {
	            return;
	        }

	        return [
	            // merge targetTouches with changedTargetTouches so it contains ALL touches, including 'end' and 'cancel'
	            uniqueArray(targetTouches.concat(changedTargetTouches), 'identifier', true),
	            changedTargetTouches
	        ];
	    }

	    /**
	     * Combined touch and mouse input
	     *
	     * Touch has a higher priority then mouse, and while touching no mouse events are allowed.
	     * This because touch devices also emit mouse events while doing a touch.
	     *
	     * @constructor
	     * @extends Input
	     */
	    function TouchMouseInput() {
	        Input.apply(this, arguments);

	        var handler = bindFn(this.handler, this);
	        this.touch = new TouchInput(this.manager, handler);
	        this.mouse = new MouseInput(this.manager, handler);
	    }

	    inherit(TouchMouseInput, Input, {
	        /**
	         * handle mouse and touch events
	         * @param {Hammer} manager
	         * @param {String} inputEvent
	         * @param {Object} inputData
	         */
	        handler: function TMEhandler(manager, inputEvent, inputData) {
	            var isTouch = (inputData.pointerType == INPUT_TYPE_TOUCH),
	                isMouse = (inputData.pointerType == INPUT_TYPE_MOUSE);

	            // when we're in a touch event, so  block all upcoming mouse events
	            // most mobile browser also emit mouseevents, right after touchstart
	            if (isTouch) {
	                this.mouse.allow = false;
	            } else if (isMouse && !this.mouse.allow) {
	                return;
	            }

	            // reset the allowMouse when we're done
	            if (inputEvent & (INPUT_END | INPUT_CANCEL)) {
	                this.mouse.allow = true;
	            }

	            this.callback(manager, inputEvent, inputData);
	        },

	        /**
	         * remove the event listeners
	         */
	        destroy: function destroy() {
	            this.touch.destroy();
	            this.mouse.destroy();
	        }
	    });

	    var PREFIXED_TOUCH_ACTION = prefixed(TEST_ELEMENT.style, 'touchAction');
	    var NATIVE_TOUCH_ACTION = PREFIXED_TOUCH_ACTION !== undefined;

	// magical touchAction value
	    var TOUCH_ACTION_COMPUTE = 'compute';
	    var TOUCH_ACTION_AUTO = 'auto';
	    var TOUCH_ACTION_MANIPULATION = 'manipulation'; // not implemented
	    var TOUCH_ACTION_NONE = 'none';
	    var TOUCH_ACTION_PAN_X = 'pan-x';
	    var TOUCH_ACTION_PAN_Y = 'pan-y';

	    /**
	     * Touch Action
	     * sets the touchAction property or uses the js alternative
	     * @param {Manager} manager
	     * @param {String} value
	     * @constructor
	     */
	    function TouchAction(manager, value) {
	        this.manager = manager;
	        this.set(value);
	    }

	    TouchAction.prototype = {
	        /**
	         * set the touchAction value on the element or enable the polyfill
	         * @param {String} value
	         */
	        set: function(value) {
	            // find out the touch-action by the event handlers
	            if (value == TOUCH_ACTION_COMPUTE) {
	                value = this.compute();
	            }

	            if (NATIVE_TOUCH_ACTION) {
	                this.manager.element.style[PREFIXED_TOUCH_ACTION] = value;
	            }
	            this.actions = value.toLowerCase().trim();
	        },

	        /**
	         * just re-set the touchAction value
	         */
	        update: function() {
	            this.set(this.manager.options.touchAction);
	        },

	        /**
	         * compute the value for the touchAction property based on the recognizer's settings
	         * @returns {String} value
	         */
	        compute: function() {
	            var actions = [];
	            each(this.manager.recognizers, function(recognizer) {
	                if (boolOrFn(recognizer.options.enable, [recognizer])) {
	                    actions = actions.concat(recognizer.getTouchAction());
	                }
	            });
	            return cleanTouchActions(actions.join(' '));
	        },

	        /**
	         * this method is called on each input cycle and provides the preventing of the browser behavior
	         * @param {Object} input
	         */
	        preventDefaults: function(input) {
	            // not needed with native support for the touchAction property
	            if (NATIVE_TOUCH_ACTION) {
	                return;
	            }

	            var srcEvent = input.srcEvent;
	            var direction = input.offsetDirection;

	            // if the touch action did prevented once this session
	            if (this.manager.session.prevented) {
	                srcEvent.preventDefault();
	                return;
	            }

	            var actions = this.actions;
	            var hasNone = inStr(actions, TOUCH_ACTION_NONE);
	            var hasPanY = inStr(actions, TOUCH_ACTION_PAN_Y);
	            var hasPanX = inStr(actions, TOUCH_ACTION_PAN_X);

	            if (hasNone ||
	                (hasPanY && direction & DIRECTION_HORIZONTAL) ||
	                (hasPanX && direction & DIRECTION_VERTICAL)) {
	                return this.preventSrc(srcEvent);
	            }
	        },

	        /**
	         * call preventDefault to prevent the browser's default behavior (scrolling in most cases)
	         * @param {Object} srcEvent
	         */
	        preventSrc: function(srcEvent) {
	            this.manager.session.prevented = true;
	            srcEvent.preventDefault();
	        }
	    };

	    /**
	     * when the touchActions are collected they are not a valid value, so we need to clean things up. *
	     * @param {String} actions
	     * @returns {*}
	     */
	    function cleanTouchActions(actions) {
	        // none
	        if (inStr(actions, TOUCH_ACTION_NONE)) {
	            return TOUCH_ACTION_NONE;
	        }

	        var hasPanX = inStr(actions, TOUCH_ACTION_PAN_X);
	        var hasPanY = inStr(actions, TOUCH_ACTION_PAN_Y);

	        // pan-x and pan-y can be combined
	        if (hasPanX && hasPanY) {
	            return TOUCH_ACTION_PAN_X + ' ' + TOUCH_ACTION_PAN_Y;
	        }

	        // pan-x OR pan-y
	        if (hasPanX || hasPanY) {
	            return hasPanX ? TOUCH_ACTION_PAN_X : TOUCH_ACTION_PAN_Y;
	        }

	        // manipulation
	        if (inStr(actions, TOUCH_ACTION_MANIPULATION)) {
	            return TOUCH_ACTION_MANIPULATION;
	        }

	        return TOUCH_ACTION_AUTO;
	    }

	    /**
	     * Recognizer flow explained; *
	     * All recognizers have the initial state of POSSIBLE when a input session starts.
	     * The definition of a input session is from the first input until the last input, with all it's movement in it. *
	     * Example session for mouse-input: mousedown -> mousemove -> mouseup
	     *
	     * On each recognizing cycle (see Manager.recognize) the .recognize() method is executed
	     * which determines with state it should be.
	     *
	     * If the recognizer has the state FAILED, CANCELLED or RECOGNIZED (equals ENDED), it is reset to
	     * POSSIBLE to give it another change on the next cycle.
	     *
	     *               Possible
	     *                  |
	     *            +-----+---------------+
	     *            |                     |
	     *      +-----+-----+               |
	     *      |           |               |
	     *   Failed      Cancelled          |
	     *                          +-------+------+
	     *                          |              |
	     *                      Recognized       Began
	     *                                         |
	     *                                      Changed
	     *                                         |
	     *                                  Ended/Recognized
	     */
	    var STATE_POSSIBLE = 1;
	    var STATE_BEGAN = 2;
	    var STATE_CHANGED = 4;
	    var STATE_ENDED = 8;
	    var STATE_RECOGNIZED = STATE_ENDED;
	    var STATE_CANCELLED = 16;
	    var STATE_FAILED = 32;

	    /**
	     * Recognizer
	     * Every recognizer needs to extend from this class.
	     * @constructor
	     * @param {Object} options
	     */
	    function Recognizer(options) {
	        this.id = uniqueId();

	        this.manager = null;
	        this.options = merge(options || {}, this.defaults);

	        // default is enable true
	        this.options.enable = ifUndefined(this.options.enable, true);

	        this.state = STATE_POSSIBLE;

	        this.simultaneous = {};
	        this.requireFail = [];
	    }

	    Recognizer.prototype = {
	        /**
	         * @virtual
	         * @type {Object}
	         */
	        defaults: {},

	        /**
	         * set options
	         * @param {Object} options
	         * @return {Recognizer}
	         */
	        set: function(options) {
	            extend(this.options, options);

	            // also update the touchAction, in case something changed about the directions/enabled state
	            this.manager && this.manager.touchAction.update();
	            return this;
	        },

	        /**
	         * recognize simultaneous with an other recognizer.
	         * @param {Recognizer} otherRecognizer
	         * @returns {Recognizer} this
	         */
	        recognizeWith: function(otherRecognizer) {
	            if (invokeArrayArg(otherRecognizer, 'recognizeWith', this)) {
	                return this;
	            }

	            var simultaneous = this.simultaneous;
	            otherRecognizer = getRecognizerByNameIfManager(otherRecognizer, this);
	            if (!simultaneous[otherRecognizer.id]) {
	                simultaneous[otherRecognizer.id] = otherRecognizer;
	                otherRecognizer.recognizeWith(this);
	            }
	            return this;
	        },

	        /**
	         * drop the simultaneous link. it doesnt remove the link on the other recognizer.
	         * @param {Recognizer} otherRecognizer
	         * @returns {Recognizer} this
	         */
	        dropRecognizeWith: function(otherRecognizer) {
	            if (invokeArrayArg(otherRecognizer, 'dropRecognizeWith', this)) {
	                return this;
	            }

	            otherRecognizer = getRecognizerByNameIfManager(otherRecognizer, this);
	            delete this.simultaneous[otherRecognizer.id];
	            return this;
	        },

	        /**
	         * recognizer can only run when an other is failing
	         * @param {Recognizer} otherRecognizer
	         * @returns {Recognizer} this
	         */
	        requireFailure: function(otherRecognizer) {
	            if (invokeArrayArg(otherRecognizer, 'requireFailure', this)) {
	                return this;
	            }

	            var requireFail = this.requireFail;
	            otherRecognizer = getRecognizerByNameIfManager(otherRecognizer, this);
	            if (inArray(requireFail, otherRecognizer) === -1) {
	                requireFail.push(otherRecognizer);
	                otherRecognizer.requireFailure(this);
	            }
	            return this;
	        },

	        /**
	         * drop the requireFailure link. it does not remove the link on the other recognizer.
	         * @param {Recognizer} otherRecognizer
	         * @returns {Recognizer} this
	         */
	        dropRequireFailure: function(otherRecognizer) {
	            if (invokeArrayArg(otherRecognizer, 'dropRequireFailure', this)) {
	                return this;
	            }

	            otherRecognizer = getRecognizerByNameIfManager(otherRecognizer, this);
	            var index = inArray(this.requireFail, otherRecognizer);
	            if (index > -1) {
	                this.requireFail.splice(index, 1);
	            }
	            return this;
	        },

	        /**
	         * has require failures boolean
	         * @returns {boolean}
	         */
	        hasRequireFailures: function() {
	            return this.requireFail.length > 0;
	        },

	        /**
	         * if the recognizer can recognize simultaneous with an other recognizer
	         * @param {Recognizer} otherRecognizer
	         * @returns {Boolean}
	         */
	        canRecognizeWith: function(otherRecognizer) {
	            return !!this.simultaneous[otherRecognizer.id];
	        },

	        /**
	         * You should use `tryEmit` instead of `emit` directly to check
	         * that all the needed recognizers has failed before emitting.
	         * @param {Object} input
	         */
	        emit: function(input) {
	            var self = this;
	            var state = this.state;

	            function emit(withState) {
	                self.manager.emit(self.options.event + (withState ? stateStr(state) : ''), input);
	            }

	            // 'panstart' and 'panmove'
	            if (state < STATE_ENDED) {
	                emit(true);
	            }

	            emit(); // simple 'eventName' events

	            // panend and pancancel
	            if (state >= STATE_ENDED) {
	                emit(true);
	            }
	        },

	        /**
	         * Check that all the require failure recognizers has failed,
	         * if true, it emits a gesture event,
	         * otherwise, setup the state to FAILED.
	         * @param {Object} input
	         */
	        tryEmit: function(input) {
	            if (this.canEmit()) {
	                return this.emit(input);
	            }
	            // it's failing anyway
	            this.state = STATE_FAILED;
	        },

	        /**
	         * can we emit?
	         * @returns {boolean}
	         */
	        canEmit: function() {
	            var i = 0;
	            while (i < this.requireFail.length) {
	                if (!(this.requireFail[i].state & (STATE_FAILED | STATE_POSSIBLE))) {
	                    return false;
	                }
	                i++;
	            }
	            return true;
	        },

	        /**
	         * update the recognizer
	         * @param {Object} inputData
	         */
	        recognize: function(inputData) {
	            // make a new copy of the inputData
	            // so we can change the inputData without messing up the other recognizers
	            var inputDataClone = extend({}, inputData);

	            // is is enabled and allow recognizing?
	            if (!boolOrFn(this.options.enable, [this, inputDataClone])) {
	                this.reset();
	                this.state = STATE_FAILED;
	                return;
	            }

	            // reset when we've reached the end
	            if (this.state & (STATE_RECOGNIZED | STATE_CANCELLED | STATE_FAILED)) {
	                this.state = STATE_POSSIBLE;
	            }

	            this.state = this.process(inputDataClone);

	            // the recognizer has recognized a gesture
	            // so trigger an event
	            if (this.state & (STATE_BEGAN | STATE_CHANGED | STATE_ENDED | STATE_CANCELLED)) {
	                this.tryEmit(inputDataClone);
	            }
	        },

	        /**
	         * return the state of the recognizer
	         * the actual recognizing happens in this method
	         * @virtual
	         * @param {Object} inputData
	         * @returns {Const} STATE
	         */
	        process: function(inputData) { }, // jshint ignore:line

	        /**
	         * return the preferred touch-action
	         * @virtual
	         * @returns {Array}
	         */
	        getTouchAction: function() { },

	        /**
	         * called when the gesture isn't allowed to recognize
	         * like when another is being recognized or it is disabled
	         * @virtual
	         */
	        reset: function() { }
	    };

	    /**
	     * get a usable string, used as event postfix
	     * @param {Const} state
	     * @returns {String} state
	     */
	    function stateStr(state) {
	        if (state & STATE_CANCELLED) {
	            return 'cancel';
	        } else if (state & STATE_ENDED) {
	            return 'end';
	        } else if (state & STATE_CHANGED) {
	            return 'move';
	        } else if (state & STATE_BEGAN) {
	            return 'start';
	        }
	        return '';
	    }

	    /**
	     * direction cons to string
	     * @param {Const} direction
	     * @returns {String}
	     */
	    function directionStr(direction) {
	        if (direction == DIRECTION_DOWN) {
	            return 'down';
	        } else if (direction == DIRECTION_UP) {
	            return 'up';
	        } else if (direction == DIRECTION_LEFT) {
	            return 'left';
	        } else if (direction == DIRECTION_RIGHT) {
	            return 'right';
	        }
	        return '';
	    }

	    /**
	     * get a recognizer by name if it is bound to a manager
	     * @param {Recognizer|String} otherRecognizer
	     * @param {Recognizer} recognizer
	     * @returns {Recognizer}
	     */
	    function getRecognizerByNameIfManager(otherRecognizer, recognizer) {
	        var manager = recognizer.manager;
	        if (manager) {
	            return manager.get(otherRecognizer);
	        }
	        return otherRecognizer;
	    }

	    /**
	     * This recognizer is just used as a base for the simple attribute recognizers.
	     * @constructor
	     * @extends Recognizer
	     */
	    function AttrRecognizer() {
	        Recognizer.apply(this, arguments);
	    }

	    inherit(AttrRecognizer, Recognizer, {
	        /**
	         * @namespace
	         * @memberof AttrRecognizer
	         */
	        defaults: {
	            /**
	             * @type {Number}
	             * @default 1
	             */
	            pointers: 1
	        },

	        /**
	         * Used to check if it the recognizer receives valid input, like input.distance > 10.
	         * @memberof AttrRecognizer
	         * @param {Object} input
	         * @returns {Boolean} recognized
	         */
	        attrTest: function(input) {
	            var optionPointers = this.options.pointers;
	            return optionPointers === 0 || input.pointers.length === optionPointers;
	        },

	        /**
	         * Process the input and return the state for the recognizer
	         * @memberof AttrRecognizer
	         * @param {Object} input
	         * @returns {*} State
	         */
	        process: function(input) {
	            var state = this.state;
	            var eventType = input.eventType;

	            var isRecognized = state & (STATE_BEGAN | STATE_CHANGED);
	            var isValid = this.attrTest(input);

	            // on cancel input and we've recognized before, return STATE_CANCELLED
	            if (isRecognized && (eventType & INPUT_CANCEL || !isValid)) {
	                return state | STATE_CANCELLED;
	            } else if (isRecognized || isValid) {
	                if (eventType & INPUT_END) {
	                    return state | STATE_ENDED;
	                } else if (!(state & STATE_BEGAN)) {
	                    return STATE_BEGAN;
	                }
	                return state | STATE_CHANGED;
	            }
	            return STATE_FAILED;
	        }
	    });

	    /**
	     * Pan
	     * Recognized when the pointer is down and moved in the allowed direction.
	     * @constructor
	     * @extends AttrRecognizer
	     */
	    function PanRecognizer() {
	        AttrRecognizer.apply(this, arguments);

	        this.pX = null;
	        this.pY = null;
	    }

	    inherit(PanRecognizer, AttrRecognizer, {
	        /**
	         * @namespace
	         * @memberof PanRecognizer
	         */
	        defaults: {
	            event: 'pan',
	            threshold: 10,
	            pointers: 1,
	            direction: DIRECTION_ALL
	        },

	        getTouchAction: function() {
	            var direction = this.options.direction;
	            var actions = [];
	            if (direction & DIRECTION_HORIZONTAL) {
	                actions.push(TOUCH_ACTION_PAN_Y);
	            }
	            if (direction & DIRECTION_VERTICAL) {
	                actions.push(TOUCH_ACTION_PAN_X);
	            }
	            return actions;
	        },

	        directionTest: function(input) {
	            var options = this.options;
	            var hasMoved = true;
	            var distance = input.distance;
	            var direction = input.direction;
	            var x = input.deltaX;
	            var y = input.deltaY;

	            // lock to axis?
	            if (!(direction & options.direction)) {
	                if (options.direction & DIRECTION_HORIZONTAL) {
	                    direction = (x === 0) ? DIRECTION_NONE : (x < 0) ? DIRECTION_LEFT : DIRECTION_RIGHT;
	                    hasMoved = x != this.pX;
	                    distance = Math.abs(input.deltaX);
	                } else {
	                    direction = (y === 0) ? DIRECTION_NONE : (y < 0) ? DIRECTION_UP : DIRECTION_DOWN;
	                    hasMoved = y != this.pY;
	                    distance = Math.abs(input.deltaY);
	                }
	            }
	            input.direction = direction;
	            return hasMoved && distance > options.threshold && direction & options.direction;
	        },

	        attrTest: function(input) {
	            return AttrRecognizer.prototype.attrTest.call(this, input) &&
	                (this.state & STATE_BEGAN || (!(this.state & STATE_BEGAN) && this.directionTest(input)));
	        },

	        emit: function(input) {
	            this.pX = input.deltaX;
	            this.pY = input.deltaY;

	            var direction = directionStr(input.direction);
	            if (direction) {
	                this.manager.emit(this.options.event + direction, input);
	            }

	            this._super.emit.call(this, input);
	        }
	    });

	    /**
	     * Pinch
	     * Recognized when two or more pointers are moving toward (zoom-in) or away from each other (zoom-out).
	     * @constructor
	     * @extends AttrRecognizer
	     */
	    function PinchRecognizer() {
	        AttrRecognizer.apply(this, arguments);
	    }

	    inherit(PinchRecognizer, AttrRecognizer, {
	        /**
	         * @namespace
	         * @memberof PinchRecognizer
	         */
	        defaults: {
	            event: 'pinch',
	            threshold: 0,
	            pointers: 2
	        },

	        getTouchAction: function() {
	            return [TOUCH_ACTION_NONE];
	        },

	        attrTest: function(input) {
	            return this._super.attrTest.call(this, input) &&
	                (Math.abs(input.scale - 1) > this.options.threshold || this.state & STATE_BEGAN);
	        },

	        emit: function(input) {
	            this._super.emit.call(this, input);
	            if (input.scale !== 1) {
	                var inOut = input.scale < 1 ? 'in' : 'out';
	                this.manager.emit(this.options.event + inOut, input);
	            }
	        }
	    });

	    /**
	     * Press
	     * Recognized when the pointer is down for x ms without any movement.
	     * @constructor
	     * @extends Recognizer
	     */
	    function PressRecognizer() {
	        Recognizer.apply(this, arguments);

	        this._timer = null;
	        this._input = null;
	    }

	    inherit(PressRecognizer, Recognizer, {
	        /**
	         * @namespace
	         * @memberof PressRecognizer
	         */
	        defaults: {
	            event: 'press',
	            pointers: 1,
	            time: 500, // minimal time of the pointer to be pressed
	            threshold: 5 // a minimal movement is ok, but keep it low
	        },

	        getTouchAction: function() {
	            return [TOUCH_ACTION_AUTO];
	        },

	        process: function(input) {
	            var options = this.options;
	            var validPointers = input.pointers.length === options.pointers;
	            var validMovement = input.distance < options.threshold;
	            var validTime = input.deltaTime > options.time;

	            this._input = input;

	            // we only allow little movement
	            // and we've reached an end event, so a tap is possible
	            if (!validMovement || !validPointers || (input.eventType & (INPUT_END | INPUT_CANCEL) && !validTime)) {
	                this.reset();
	            } else if (input.eventType & INPUT_START) {
	                this.reset();
	                this._timer = setTimeoutContext(function() {
	                    this.state = STATE_RECOGNIZED;
	                    this.tryEmit();
	                }, options.time, this);
	            } else if (input.eventType & INPUT_END) {
	                return STATE_RECOGNIZED;
	            }
	            return STATE_FAILED;
	        },

	        reset: function() {
	            clearTimeout(this._timer);
	        },

	        emit: function(input) {
	            if (this.state !== STATE_RECOGNIZED) {
	                return;
	            }

	            if (input && (input.eventType & INPUT_END)) {
	                this.manager.emit(this.options.event + 'up', input);
	            } else {
	                this._input.timeStamp = now();
	                this.manager.emit(this.options.event, this._input);
	            }
	        }
	    });

	    /**
	     * Rotate
	     * Recognized when two or more pointer are moving in a circular motion.
	     * @constructor
	     * @extends AttrRecognizer
	     */
	    function RotateRecognizer() {
	        AttrRecognizer.apply(this, arguments);
	    }

	    inherit(RotateRecognizer, AttrRecognizer, {
	        /**
	         * @namespace
	         * @memberof RotateRecognizer
	         */
	        defaults: {
	            event: 'rotate',
	            threshold: 0,
	            pointers: 2
	        },

	        getTouchAction: function() {
	            return [TOUCH_ACTION_NONE];
	        },

	        attrTest: function(input) {
	            return this._super.attrTest.call(this, input) &&
	                (Math.abs(input.rotation) > this.options.threshold || this.state & STATE_BEGAN);
	        }
	    });

	    /**
	     * Swipe
	     * Recognized when the pointer is moving fast (velocity), with enough distance in the allowed direction.
	     * @constructor
	     * @extends AttrRecognizer
	     */
	    function SwipeRecognizer() {
	        AttrRecognizer.apply(this, arguments);
	    }

	    inherit(SwipeRecognizer, AttrRecognizer, {
	        /**
	         * @namespace
	         * @memberof SwipeRecognizer
	         */
	        defaults: {
	            event: 'swipe',
	            threshold: 10,
	            velocity: 0.65,
	            direction: DIRECTION_HORIZONTAL | DIRECTION_VERTICAL,
	            pointers: 1
	        },

	        getTouchAction: function() {
	            return PanRecognizer.prototype.getTouchAction.call(this);
	        },

	        attrTest: function(input) {
	            var direction = this.options.direction;
	            var velocity;

	            if (direction & (DIRECTION_HORIZONTAL | DIRECTION_VERTICAL)) {
	                velocity = input.velocity;
	            } else if (direction & DIRECTION_HORIZONTAL) {
	                velocity = input.velocityX;
	            } else if (direction & DIRECTION_VERTICAL) {
	                velocity = input.velocityY;
	            }

	            return this._super.attrTest.call(this, input) &&
	                direction & input.direction &&
	                input.distance > this.options.threshold &&
	                abs(velocity) > this.options.velocity && input.eventType & INPUT_END;
	        },

	        emit: function(input) {
	            var direction = directionStr(input.direction);
	            if (direction) {
	                this.manager.emit(this.options.event + direction, input);
	            }

	            this.manager.emit(this.options.event, input);
	        }
	    });

	    /**
	     * A tap is ecognized when the pointer is doing a small tap/click. Multiple taps are recognized if they occur
	     * between the given interval and position. The delay option can be used to recognize multi-taps without firing
	     * a single tap.
	     *
	     * The eventData from the emitted event contains the property `tapCount`, which contains the amount of
	     * multi-taps being recognized.
	     * @constructor
	     * @extends Recognizer
	     */
	    function TapRecognizer() {
	        Recognizer.apply(this, arguments);

	        // previous time and center,
	        // used for tap counting
	        this.pTime = false;
	        this.pCenter = false;

	        this._timer = null;
	        this._input = null;
	        this.count = 0;
	    }

	    inherit(TapRecognizer, Recognizer, {
	        /**
	         * @namespace
	         * @memberof PinchRecognizer
	         */
	        defaults: {
	            event: 'tap',
	            pointers: 1,
	            taps: 1,
	            interval: 300, // max time between the multi-tap taps
	            time: 250, // max time of the pointer to be down (like finger on the screen)
	            threshold: 2, // a minimal movement is ok, but keep it low
	            posThreshold: 10 // a multi-tap can be a bit off the initial position
	        },

	        getTouchAction: function() {
	            return [TOUCH_ACTION_MANIPULATION];
	        },

	        process: function(input) {
	            var options = this.options;

	            var validPointers = input.pointers.length === options.pointers;
	            var validMovement = input.distance < options.threshold;
	            var validTouchTime = input.deltaTime < options.time;

	            this.reset();

	            if ((input.eventType & INPUT_START) && (this.count === 0)) {
	                return this.failTimeout();
	            }

	            // we only allow little movement
	            // and we've reached an end event, so a tap is possible
	            if (validMovement && validTouchTime && validPointers) {
	                if (input.eventType != INPUT_END) {
	                    return this.failTimeout();
	                }

	                var validInterval = this.pTime ? (input.timeStamp - this.pTime < options.interval) : true;
	                var validMultiTap = !this.pCenter || getDistance(this.pCenter, input.center) < options.posThreshold;

	                this.pTime = input.timeStamp;
	                this.pCenter = input.center;

	                if (!validMultiTap || !validInterval) {
	                    this.count = 1;
	                } else {
	                    this.count += 1;
	                }

	                this._input = input;

	                // if tap count matches we have recognized it,
	                // else it has began recognizing...
	                var tapCount = this.count % options.taps;
	                if (tapCount === 0) {
	                    // no failing requirements, immediately trigger the tap event
	                    // or wait as long as the multitap interval to trigger
	                    if (!this.hasRequireFailures()) {
	                        return STATE_RECOGNIZED;
	                    } else {
	                        this._timer = setTimeoutContext(function() {
	                            this.state = STATE_RECOGNIZED;
	                            this.tryEmit();
	                        }, options.interval, this);
	                        return STATE_BEGAN;
	                    }
	                }
	            }
	            return STATE_FAILED;
	        },

	        failTimeout: function() {
	            this._timer = setTimeoutContext(function() {
	                this.state = STATE_FAILED;
	            }, this.options.interval, this);
	            return STATE_FAILED;
	        },

	        reset: function() {
	            clearTimeout(this._timer);
	        },

	        emit: function() {
	            if (this.state == STATE_RECOGNIZED ) {
	                this._input.tapCount = this.count;
	                this.manager.emit(this.options.event, this._input);
	            }
	        }
	    });

	    /**
	     * Simple way to create an manager with a default set of recognizers.
	     * @param {HTMLElement} element
	     * @param {Object} [options]
	     * @constructor
	     */
	    function Hammer(element, options) {
	        options = options || {};
	        options.recognizers = ifUndefined(options.recognizers, Hammer.defaults.preset);
	        return new Manager(element, options);
	    }

	    /**
	     * @const {string}
	     */
	    Hammer.VERSION = '2.0.4';

	    /**
	     * default settings
	     * @namespace
	     */
	    Hammer.defaults = {
	        /**
	         * set if DOM events are being triggered.
	         * But this is slower and unused by simple implementations, so disabled by default.
	         * @type {Boolean}
	         * @default false
	         */
	        domEvents: false,

	        /**
	         * The value for the touchAction property/fallback.
	         * When set to `compute` it will magically set the correct value based on the added recognizers.
	         * @type {String}
	         * @default compute
	         */
	        touchAction: TOUCH_ACTION_COMPUTE,

	        /**
	         * @type {Boolean}
	         * @default true
	         */
	        enable: true,

	        /**
	         * EXPERIMENTAL FEATURE -- can be removed/changed
	         * Change the parent input target element.
	         * If Null, then it is being set the to main element.
	         * @type {Null|EventTarget}
	         * @default null
	         */
	        inputTarget: null,

	        /**
	         * force an input class
	         * @type {Null|Function}
	         * @default null
	         */
	        inputClass: null,

	        /**
	         * Default recognizer setup when calling `Hammer()`
	         * When creating a new Manager these will be skipped.
	         * @type {Array}
	         */
	        preset: [
	            // RecognizerClass, options, [recognizeWith, ...], [requireFailure, ...]
	            [RotateRecognizer, { enable: false }],
	            [PinchRecognizer, { enable: false }, ['rotate']],
	            [SwipeRecognizer,{ direction: DIRECTION_HORIZONTAL }],
	            [PanRecognizer, { direction: DIRECTION_HORIZONTAL }, ['swipe']],
	            [TapRecognizer],
	            [TapRecognizer, { event: 'doubletap', taps: 2 }, ['tap']],
	            [PressRecognizer]
	        ],

	        /**
	         * Some CSS properties can be used to improve the working of Hammer.
	         * Add them to this method and they will be set when creating a new Manager.
	         * @namespace
	         */
	        cssProps: {
	            /**
	             * Disables text selection to improve the dragging gesture. Mainly for desktop browsers.
	             * @type {String}
	             * @default 'none'
	             */
	            userSelect: 'none',

	            /**
	             * Disable the Windows Phone grippers when pressing an element.
	             * @type {String}
	             * @default 'none'
	             */
	            touchSelect: 'none',

	            /**
	             * Disables the default callout shown when you touch and hold a touch target.
	             * On iOS, when you touch and hold a touch target such as a link, Safari displays
	             * a callout containing information about the link. This property allows you to disable that callout.
	             * @type {String}
	             * @default 'none'
	             */
	            touchCallout: 'none',

	            /**
	             * Specifies whether zooming is enabled. Used by IE10>
	             * @type {String}
	             * @default 'none'
	             */
	            contentZooming: 'none',

	            /**
	             * Specifies that an entire element should be draggable instead of its contents. Mainly for desktop browsers.
	             * @type {String}
	             * @default 'none'
	             */
	            userDrag: 'none',

	            /**
	             * Overrides the highlight color shown when the user taps a link or a JavaScript
	             * clickable element in iOS. This property obeys the alpha value, if specified.
	             * @type {String}
	             * @default 'rgba(0,0,0,0)'
	             */
	            tapHighlightColor: 'rgba(0,0,0,0)'
	        }
	    };

	    var STOP = 1;
	    var FORCED_STOP = 2;

	    /**
	     * Manager
	     * @param {HTMLElement} element
	     * @param {Object} [options]
	     * @constructor
	     */
	    function Manager(element, options) {
	        options = options || {};

	        this.options = merge(options, Hammer.defaults);
	        this.options.inputTarget = this.options.inputTarget || element;

	        this.handlers = {};
	        this.session = {};
	        this.recognizers = [];

	        this.element = element;
	        this.input = createInputInstance(this);
	        this.touchAction = new TouchAction(this, this.options.touchAction);

	        toggleCssProps(this, true);

	        each(options.recognizers, function(item) {
	            var recognizer = this.add(new (item[0])(item[1]));
	            item[2] && recognizer.recognizeWith(item[2]);
	            item[3] && recognizer.requireFailure(item[3]);
	        }, this);
	    }

	    Manager.prototype = {
	        /**
	         * set options
	         * @param {Object} options
	         * @returns {Manager}
	         */
	        set: function(options) {
	            extend(this.options, options);

	            // Options that need a little more setup
	            if (options.touchAction) {
	                this.touchAction.update();
	            }
	            if (options.inputTarget) {
	                // Clean up existing event listeners and reinitialize
	                this.input.destroy();
	                this.input.target = options.inputTarget;
	                this.input.init();
	            }
	            return this;
	        },

	        /**
	         * stop recognizing for this session.
	         * This session will be discarded, when a new [input]start event is fired.
	         * When forced, the recognizer cycle is stopped immediately.
	         * @param {Boolean} [force]
	         */
	        stop: function(force) {
	            this.session.stopped = force ? FORCED_STOP : STOP;
	        },

	        /**
	         * run the recognizers!
	         * called by the inputHandler function on every movement of the pointers (touches)
	         * it walks through all the recognizers and tries to detect the gesture that is being made
	         * @param {Object} inputData
	         */
	        recognize: function(inputData) {
	            var session = this.session;
	            if (session.stopped) {
	                return;
	            }

	            // run the touch-action polyfill
	            this.touchAction.preventDefaults(inputData);

	            var recognizer;
	            var recognizers = this.recognizers;

	            // this holds the recognizer that is being recognized.
	            // so the recognizer's state needs to be BEGAN, CHANGED, ENDED or RECOGNIZED
	            // if no recognizer is detecting a thing, it is set to `null`
	            var curRecognizer = session.curRecognizer;

	            // reset when the last recognizer is recognized
	            // or when we're in a new session
	            if (!curRecognizer || (curRecognizer && curRecognizer.state & STATE_RECOGNIZED)) {
	                curRecognizer = session.curRecognizer = null;
	            }

	            var i = 0;
	            while (i < recognizers.length) {
	                recognizer = recognizers[i];

	                // find out if we are allowed try to recognize the input for this one.
	                // 1.   allow if the session is NOT forced stopped (see the .stop() method)
	                // 2.   allow if we still haven't recognized a gesture in this session, or the this recognizer is the one
	                //      that is being recognized.
	                // 3.   allow if the recognizer is allowed to run simultaneous with the current recognized recognizer.
	                //      this can be setup with the `recognizeWith()` method on the recognizer.
	                if (session.stopped !== FORCED_STOP && ( // 1
	                    !curRecognizer || recognizer == curRecognizer || // 2
	                    recognizer.canRecognizeWith(curRecognizer))) { // 3
	                    recognizer.recognize(inputData);
	                } else {
	                    recognizer.reset();
	                }

	                // if the recognizer has been recognizing the input as a valid gesture, we want to store this one as the
	                // current active recognizer. but only if we don't already have an active recognizer
	                if (!curRecognizer && recognizer.state & (STATE_BEGAN | STATE_CHANGED | STATE_ENDED)) {
	                    curRecognizer = session.curRecognizer = recognizer;
	                }
	                i++;
	            }
	        },

	        /**
	         * get a recognizer by its event name.
	         * @param {Recognizer|String} recognizer
	         * @returns {Recognizer|Null}
	         */
	        get: function(recognizer) {
	            if (recognizer instanceof Recognizer) {
	                return recognizer;
	            }

	            var recognizers = this.recognizers;
	            for (var i = 0; i < recognizers.length; i++) {
	                if (recognizers[i].options.event == recognizer) {
	                    return recognizers[i];
	                }
	            }
	            return null;
	        },

	        /**
	         * add a recognizer to the manager
	         * existing recognizers with the same event name will be removed
	         * @param {Recognizer} recognizer
	         * @returns {Recognizer|Manager}
	         */
	        add: function(recognizer) {
	            if (invokeArrayArg(recognizer, 'add', this)) {
	                return this;
	            }

	            // remove existing
	            var existing = this.get(recognizer.options.event);
	            if (existing) {
	                this.remove(existing);
	            }

	            this.recognizers.push(recognizer);
	            recognizer.manager = this;

	            this.touchAction.update();
	            return recognizer;
	        },

	        /**
	         * remove a recognizer by name or instance
	         * @param {Recognizer|String} recognizer
	         * @returns {Manager}
	         */
	        remove: function(recognizer) {
	            if (invokeArrayArg(recognizer, 'remove', this)) {
	                return this;
	            }

	            var recognizers = this.recognizers;
	            recognizer = this.get(recognizer);
	            recognizers.splice(inArray(recognizers, recognizer), 1);

	            this.touchAction.update();
	            return this;
	        },

	        /**
	         * bind event
	         * @param {String} events
	         * @param {Function} handler
	         * @returns {EventEmitter} this
	         */
	        on: function(events, handler) {
	            var handlers = this.handlers;
	            each(splitStr(events), function(event) {
	                handlers[event] = handlers[event] || [];
	                handlers[event].push(handler);
	            });
	            return this;
	        },

	        /**
	         * unbind event, leave emit blank to remove all handlers
	         * @param {String} events
	         * @param {Function} [handler]
	         * @returns {EventEmitter} this
	         */
	        off: function(events, handler) {
	            var handlers = this.handlers;
	            each(splitStr(events), function(event) {
	                if (!handler) {
	                    delete handlers[event];
	                } else {
	                    handlers[event].splice(inArray(handlers[event], handler), 1);
	                }
	            });
	            return this;
	        },

	        /**
	         * emit event to the listeners
	         * @param {String} event
	         * @param {Object} data
	         */
	        emit: function(event, data) {
	            // we also want to trigger dom events
	            if (this.options.domEvents) {
	                triggerDomEvent(event, data);
	            }

	            // no handlers, so skip it all
	            var handlers = this.handlers[event] && this.handlers[event].slice();
	            if (!handlers || !handlers.length) {
	                return;
	            }

	            data.type = event;
	            data.preventDefault = function() {
	                data.srcEvent.preventDefault();
	            };

	            var i = 0;
	            while (i < handlers.length) {
	                handlers[i](data);
	                i++;
	            }
	        },

	        /**
	         * destroy the manager and unbinds all events
	         * it doesn't unbind dom events, that is the user own responsibility
	         */
	        destroy: function() {
	            this.element && toggleCssProps(this, false);

	            this.handlers = {};
	            this.session = {};
	            this.input.destroy();
	            this.element = null;
	        }
	    };

	    /**
	     * add/remove the css properties as defined in manager.options.cssProps
	     * @param {Manager} manager
	     * @param {Boolean} add
	     */
	    function toggleCssProps(manager, add) {
	        var element = manager.element;
	        each(manager.options.cssProps, function(value, name) {
	            element.style[prefixed(element.style, name)] = add ? value : '';
	        });
	    }

	    /**
	     * trigger dom event
	     * @param {String} event
	     * @param {Object} data
	     */
	    function triggerDomEvent(event, data) {
	        var gestureEvent = document.createEvent('Event');
	        gestureEvent.initEvent(event, true, true);
	        gestureEvent.gesture = data;
	        data.target.dispatchEvent(gestureEvent);
	    }

	    extend(Hammer, {
	        INPUT_START: INPUT_START,
	        INPUT_MOVE: INPUT_MOVE,
	        INPUT_END: INPUT_END,
	        INPUT_CANCEL: INPUT_CANCEL,

	        STATE_POSSIBLE: STATE_POSSIBLE,
	        STATE_BEGAN: STATE_BEGAN,
	        STATE_CHANGED: STATE_CHANGED,
	        STATE_ENDED: STATE_ENDED,
	        STATE_RECOGNIZED: STATE_RECOGNIZED,
	        STATE_CANCELLED: STATE_CANCELLED,
	        STATE_FAILED: STATE_FAILED,

	        DIRECTION_NONE: DIRECTION_NONE,
	        DIRECTION_LEFT: DIRECTION_LEFT,
	        DIRECTION_RIGHT: DIRECTION_RIGHT,
	        DIRECTION_UP: DIRECTION_UP,
	        DIRECTION_DOWN: DIRECTION_DOWN,
	        DIRECTION_HORIZONTAL: DIRECTION_HORIZONTAL,
	        DIRECTION_VERTICAL: DIRECTION_VERTICAL,
	        DIRECTION_ALL: DIRECTION_ALL,

	        Manager: Manager,
	        Input: Input,
	        TouchAction: TouchAction,

	        TouchInput: TouchInput,
	        MouseInput: MouseInput,
	        PointerEventInput: PointerEventInput,
	        TouchMouseInput: TouchMouseInput,
	        SingleTouchInput: SingleTouchInput,

	        Recognizer: Recognizer,
	        AttrRecognizer: AttrRecognizer,
	        Tap: TapRecognizer,
	        Pan: PanRecognizer,
	        Swipe: SwipeRecognizer,
	        Pinch: PinchRecognizer,
	        Rotate: RotateRecognizer,
	        Press: PressRecognizer,

	        on: addEventListeners,
	        off: removeEventListeners,
	        each: each,
	        merge: merge,
	        extend: extend,
	        inherit: inherit,
	        bindFn: bindFn,
	        prefixed: prefixed
	    });

	    if ("function" == TYPE_FUNCTION && __webpack_require__(32)) {
	        !(__WEBPACK_AMD_DEFINE_RESULT__ = function() {
	            return Hammer;
	        }.call(exports, __webpack_require__, exports, module), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));
	    } else if (typeof module != 'undefined' && module.exports) {
	        module.exports = Hammer;
	    } else {
	        window[exportName] = Hammer;
	    }

	})(window, document, 'Hammer');

/***/ },
/* 32 */
/***/ function(module, exports) {

	/* WEBPACK VAR INJECTION */(function(__webpack_amd_options__) {module.exports = __webpack_amd_options__;

	/* WEBPACK VAR INJECTION */}.call(exports, {}))

/***/ },
/* 33 */
/***/ function(module, exports, __webpack_require__) {

	/*
	 * 获取验证码的倒计时的封装，依赖count模块，或许这个可以抽离出去，不用放到common里
	 * var verifyDown =  $(id);
	 common.countDown (verifyDown, 59);
	 * */
	var count = __webpack_require__(34);
	module.exports =  function (obj, time, cb) {
	    count.countDownFormat(time, function (data) {
	        var str = '';
	        if (data) {
	            obj.attr('disabled', 'disabled');
	            str = data + '后刷新';
	            obj.html(str);
	        } else {
	            obj.html('<a><i class="iconfont icon-shuaxin"></i></a>').removeAttr('disabled');
	            if (cb) cb(obj);
	        }
	    });
	};


/***/ },
/* 34 */
/***/ function(module, exports) {

	/**
	 *倒计时
	 *zhongliangwenwx@163.com
	 * count.down(11120,function(timerObj){
	 * count.formatTime(time, callback)
	 })
	 */
	var count = {};
	var ms = 1;
	var count_timer;
	count.down = function(time, callback){
	    var d, h, m, s, seconds = time,
	        callback = callback || function(){};
	    var str_d="",
	        str_h="",
	        str_m="",
	        str_s="",
	        str_ms='.'+ms,
	        str="",
	        return_data = false;
	    if (seconds > 0) {
	        return_data = {
	            d: parseInt(seconds / 24 / 3600),
	            h: parseInt((seconds / 3600) % 24),
	            m: parseInt((seconds / 60) % 60),
	            s: parseInt(seconds % 60),
	            ms:str_ms
	        };
	        if(ms==0){
	            seconds = seconds-1;
	        }
	        clearTimeout(count_timer);
	        count_timer = null;
	        count_timer = setTimeout(function(){
	            count.down(seconds,callback);
	            ms--;
	            ms = ms < 0 ? 1 : ms;
	        },500);
	    }
	    callback(return_data);
	};

	count.formatTime = function (timeObj) {
	    if (timeObj) {
	        var str = '',
	            d = timeObj.d ? timeObj.d : 0,
	            h = timeObj.h ? timeObj.h : 0,
	            m = timeObj.m ? timeObj.m : 0,
	            s = timeObj.s ? timeObj.s : 0;

	        m = m<10 ? '0'+m : m;
	        s = s<10 ? '0'+s : s;

	        str += ( d == '0') ?  '' :  ( d + '天');
	        str += ( h == '0') ?  '' :  ( h + '时');
	        str += ( m == '00') ?  '' :  ( m + '分');
	        str += s + ' 秒';
	        return str;
	    }
	    return timeObj;

	};

	count.countDownFormat = function (time, callback) {
	    count.down(time,function(timeObj){
	        var data = count.formatTime (timeObj);
	        callback (data)
	    })
	};

	module.exports = count;

/***/ },
/* 35 */
/***/ function(module, exports, __webpack_require__) {

	var doT = __webpack_require__(6);
	var tpl = __webpack_require__(36);

	module.exports =  Backbone.View.extend({
	    template: doT.template(tpl),
	    tagName: 'div',
	    initialize: function () {
	    },
	    render: function (el) {
	        return this;
	    }
	});

/***/ },
/* 36 */
/***/ function(module, exports) {

	module.exports = "<div class=\"energy\">\r\n    <div class=\"za-progress\">\r\n        <div class=\"za-progress-bar za-progress-bar-danger za-progress-bar-striped active\" role=\"progressbar\" aria-valuenow=\"60\" aria-valuemin=\"0\" aria-valuemax=\"100\" style=\"width: 0%;\">\r\n            <span class=\"sr-only\">0</span>\r\n        </div>\r\n    </div>\r\n</div>";

/***/ },
/* 37 */
/***/ function(module, exports, __webpack_require__) {

	var doT = __webpack_require__(6);
	var tpl = __webpack_require__(38);

	module.exports = Backbone.View.extend({
	    template: doT.template(tpl),
	    tagName: 'div',
	    initialize: function () {
	    },
	    render: function () {
	        return this;
	    }
	});

/***/ },
/* 38 */
/***/ function(module, exports) {

	module.exports = "<div class=\"top-info\">\r\n    <div class=\"za-alert za-alert-warning\">\r\n        <button type=\"button\" class=\"za-close\" data-dismiss=\"alert\" aria-label=\"Close\"><span\r\n                aria-hidden=\"true\">&times;</span></button>\r\n        <a href=\"#jiaochen\">一分钟教你玩转爆粉大师</a>\r\n    </div>\r\n    <div class=\"za-alert za-alert-info text-right\">\r\n        <button id=\"userHorn\" class=\"za-btn za-btn-xs za-btn-primary\">使用喇叭</button>\r\n        <button id=\"userEnergy\" class=\"za-btn za-btn-xs za-btn-primary\">立即插队</button>\r\n        <span class=\"pull-left\"><span id=\"countDown\"></span></span>\r\n    </div>\r\n</div>";

/***/ },
/* 39 */
/***/ function(module, exports, __webpack_require__) {

	var api = __webpack_require__(7);
	module.exports =  Backbone.Model.extend({
	    defaults:function(){
	        return {
	            sender:'张三丰test',
	            for:'',
	            content:'在JavaScript中，原型也是一个对象，通过原型可以实现对象的属性继承，JavaScript的对象中都包含了一个" [[Prototype]]"内部属性，这个属性所对应的就是该对象的原型。',
	            sound:'',
	            message:[
	                {
	                    id:'1',
	                    value:'喇叭信息1'
	                },
	                {
	                    id:'2',
	                    value:'喇叭信息2'
	                },
	                {
	                    id:'3',
	                    value:'喇叭信息3'
	                }
	            ]
	        }

	    },
	    initialize: function () {
	        return this;
	    },
	    url: 'http://localhost:3000/'
	});


/***/ },
/* 40 */
/***/ function(module, exports, __webpack_require__) {

	var api = __webpack_require__(7);
	module.exports =  Backbone.Model.extend({
	    url: api.list,
	    initialize: function () {
	        return this;
	    }
	});

/***/ },
/* 41 */
/***/ function(module, exports, __webpack_require__) {

	var api = __webpack_require__(7);
	module.exports =  Backbone.Model.extend({
	    initialize: function () {
	        return this;
	    },
	    url: api.addEnergy
	});


/***/ },
/* 42 */
/***/ function(module, exports) {

	module.exports = "<div class=\"za-container\">\r\n    {{? !it}}\r\n    <div class=\"sk-three-bounce\">\r\n        <div class=\"sk-child sk-bounce1\"></div>\r\n        <div class=\"sk-child sk-bounce2\"></div>\r\n        <div class=\"sk-child sk-bounce3\"></div>\r\n    </div>\r\n    {{??}}\r\n        {{ for (var key in it) { }}\r\n        <div class=\"za-media\">\r\n            <div class=\"za-media-left\">\r\n                <img class=\"media-object\"\r\n                     src=\"{{=it[key].headimgurl}}\">\r\n            </div>\r\n            <div class=\"za-media-body\">\r\n                <b>{{=it[key].nickname}}</b>\r\n                <P>{{=it[key].desc}}</P>\r\n            </div>\r\n            <div class=\"za-media-right\">\r\n                <img style=\"display: none\" src=\"{{=it[key].qrcode}}\">\r\n                <button data-uid=\"{{=it[key].id}}\" data-qcode=\"{{=it[key].qrcode}}\"\r\n                        class=\"za-btn za-btn-success add-friend\">加好友\r\n                </button>\r\n            </div>\r\n        </div>\r\n        {{ } }}\r\n    {{ } }}\r\n\r\n</div>";

/***/ },
/* 43 */
/***/ function(module, exports) {

	module.exports = "<div class=\"za-media message-horn\">\r\n    <div class=\"za-media-left\">\r\n        <img class=\"media-object\"\r\n             src=\"{{=it.headimgurl}}\">\r\n    </div>\r\n    <div class=\"za-media-body\">\r\n        <b>{{=it.nickname}}</b>\r\n        <P class=\"text-danger\">{{=it.message}}&nbsp;&nbsp;<i class=\"iconfont icon-laba\"></i></P>\r\n        <P class=\"text-danger\">{{=it.desc}}</P>\r\n    </div>\r\n    <div class=\"za-media-right\">\r\n        <button data-uid=\"{{=it.id}}\" data-qcode=\"{{=it.qrcode}}\"\r\n                class=\"za-btn za-btn-danger add-friend\">加好友</span>\r\n        </button>\r\n    </div>\r\n</div>\r\n";

/***/ },
/* 44 */
/***/ function(module, exports, __webpack_require__) {

	var doT = __webpack_require__(6);
	var Tool = __webpack_require__(45);
	var tpl = __webpack_require__(46);

	module.exports = Backbone.View.extend({
	    el: '#viewMain',
	    template: doT.template(tpl),
	    initialize: function () {
	        return this;
	    },
	    render: function () {
	        var _this = this;

	        _this.$el.addClass('block').html(_this.template());
	        _this.$el.siblings().removeClass('block');

	        return this;
	    }
	});

/***/ },
/* 45 */
/***/ function(module, exports, __webpack_require__) {

	var api = __webpack_require__(7);
	module.exports =  Backbone.Model.extend({
	    initialize: function () {
	        return this;
	    },
	    url: api.tool
	});

/***/ },
/* 46 */
/***/ function(module, exports) {

	module.exports = "<div id=\"toolView\">\r\n    <div class=\"tool-head\">\r\n        <h2>实用工具</h2>\r\n    </div>\r\n    <div class=\"tool-list\">\r\n        <div class=\"row\">\r\n            <div class=\"col col-xs-4\">\r\n                <a><!--/tool/1-->\r\n                    <span class=\"icon-bg icon-bg-wx\">\r\n                    <span class=\"iconfont icon-weixin\"></span>\r\n                    </span>\r\n                </a>\r\n                <div>微信多开工具<br>（即将上线）</div>\r\n            </div>\r\n            <div class=\"col col-xs-4\">\r\n                <a><!--/tool/2-->\r\n                    <span class=\"icon-bg icon-bg-sd\">\r\n                    <span class=\"iconfont icon-shandian\"></span>\r\n                </span>\r\n                </a>\r\n                <div>自动杀死粉<br>（即将上线）</div>\r\n            </div>\r\n            <div class=\"col col-xs-4\">\r\n                <a><!--/tool/3-->\r\n                    <span class=\"icon-bg icon-bg-tk\">\r\n                        <span class=\"iconfont icon-tuikuan\"></span>\r\n                    </span>\r\n                </a>\r\n                <div>自动抢红包<br>（即将上线）</div>\r\n            </div>\r\n            <div class=\"col col-xs-4\">\r\n                <a><!--/tool/4-->\r\n                    <span class=\"icon-bg icon-bg-zh\">\r\n                        <span class=\"iconfont icon-zhuang\"></span>\r\n                    </span>\r\n                </a>\r\n                <div>装逼神器<br>（即将上线）</div>\r\n            </div>\r\n            <div class=\"col col-xs-4\">\r\n                <a><!--/tool/5-->\r\n                    <span class=\"icon-bg icon-bg-jf\">\r\n                        <span class=\"iconfont icon-jiafensi\"></span>\r\n                    </span>\r\n                </a>\r\n                <div>星辰加粉<br>（即将上线）</div>\r\n            </div>\r\n            <div class=\"col col-xs-4\">\r\n                <a><!--/tool/6-->\r\n                    <span class=\"icon-bg icon-bg-dw\">\r\n                        <span class=\"iconfont icon-dingwei\"></span>\r\n                    </span>\r\n                </a>\r\n                <div>伪装定位宝<br>（即将上线）</div>\r\n            </div>\r\n            <div class=\"col col-xs-4\">\r\n                <a><!--/tool/7-->\r\n                    <span class=\"icon-bg icon-bg-za\">\r\n                        <span class=\"iconfont icon-zan\"></span>\r\n                    </span>\r\n                </a>\r\n                <div>狂人秒赞大师<br>（即将上线）</div>\r\n            </div>\r\n            <div class=\"col col-xs-4\">\r\n\r\n            </div>\r\n        </div>\r\n    </div>\r\n</div>";

/***/ },
/* 47 */
/***/ function(module, exports, __webpack_require__) {

	var doT = __webpack_require__(6);
	var Tool = __webpack_require__(45);
	var tpl = __webpack_require__(48);

	module.exports = Backbone.View.extend({
	    el: $('#viewMain'),
	    template: doT.template(tpl),
	    initialize: function () {
	        var _this = this;
	        this.model = new Tool();
	        _this.listenTo(_this.model, 'sync', this.render);
	        return this;
	    },
	    events: {
	        'click .tool-head .back' : function() {
	            window.location.href = ('#/tool').replace(/^#+/, '#');
	        }
	    },
	    render: function () {
	        var _this = this;
	        _this.$el.addClass('block').html(_this.template(this.model.toJSON()));
	        _this.$el.siblings().removeClass('block');
	        return this;
	    }
	});

/***/ },
/* 48 */
/***/ function(module, exports) {

	module.exports = "<div id=\"toolDetailView\">\r\n    {{? !it.name}}\r\n    <div class=\"sk-three-bounce\">\r\n        <div class=\"sk-child sk-bounce1\"></div>\r\n        <div class=\"sk-child sk-bounce2\"></div>\r\n        <div class=\"sk-child sk-bounce3\"></div>\r\n    </div>\r\n    {{??}}\r\n    <div class=\"tool-head\">\r\n        <a class=\"back\"><span class=\"iconfont icon-fanhui\"></span></a>\r\n        <h2>实用工具-{{=it.name}}</h2>\r\n    </div>\r\n    <div class=\"za-container\">\r\n        <div class=\"tool-detail\">\r\n            <div class=\"row\">\r\n                {{? it.des }}\r\n                <div class=\"col-xs-4 text-right\">\r\n                    工具描述\r\n                </div>\r\n                <div class=\"col-xs-8\">\r\n                    {{=it.des}}\r\n                </div>\r\n                {{?}}\r\n                {{? it.ntended_for }}\r\n                <div class=\"col-xs-4 text-right\">\r\n                    适用人群\r\n                </div>\r\n                <div class=\"col-xs-8\">\r\n                    {{=it.ntended_for}}\r\n                </div>\r\n                {{?}}\r\n                {{? it.using_method }}\r\n                <div class=\"col-xs-4 text-right\">\r\n                    使用方法\r\n                </div>\r\n                <div class=\"col-xs-8\">\r\n                    {{=it.using_method}}\r\n                </div>\r\n                {{?}}\r\n                {{? it.important_hints }}\r\n                <div class=\"col-xs-4 text-right\">\r\n                    重要提示\r\n                </div>\r\n                <div class=\"col-xs-8\">\r\n                    {{=it.important_hints}}\r\n                </div>\r\n                {{?}}\r\n            </div>\r\n            <div class=\"alert-out alert-out-info\">\r\n                {{ for (key in it.data) { }}\r\n                <a href=\"{{=key}}\">入口地址</a>&nbsp;\r\n                {{? it.data[key] != 0}}\r\n                密码：{{=it.data[key]}}\r\n                {{?}}\r\n                <br>\r\n                {{ } }}\r\n            </div>\r\n        </div>\r\n\r\n    </div>\r\n    {{ } }}\r\n</div>";

/***/ },
/* 49 */
/***/ function(module, exports, __webpack_require__) {

	var doT = __webpack_require__(6);
	var tpl = __webpack_require__(50);

	module.exports = Backbone.View.extend({
	    el: $('#viewMain'),
	    template: doT.template(tpl),
	    tagName: 'div',
	    initialize: function () {
	    },
	    render: function () {
	        var _this = this;
	        _this.$el.addClass('block').html(_this.template());

	        return this;
	    }
	});

/***/ },
/* 50 */
/***/ function(module, exports) {

	module.exports = "<div class=\"scroll\">\r\n    <img class=\"img-responsive\" src=\"{{=globConfig.imageUrl}}/1.jpg\">\r\n</div>";

/***/ },
/* 51 */
/***/ function(module, exports, __webpack_require__) {

	var doT = __webpack_require__(6);
	var api = __webpack_require__(7);
	var Model = __webpack_require__(52);
	var FootBar = __webpack_require__(14);
	var tpl = __webpack_require__(53);


	module.exports = Backbone.View.extend({
	    el: $('#viewMain'),
	    template: doT.template(tpl),
	    tagName: 'div',
	    initialize: function () {
	        var _this = this;
	        _this.model = new Model;
	        _this.listenTo(_this.model, 'change', this.render);
	    },
	    render: function () {
	        var _this = this;
	        _this.$el.html(_this.template(_this.model.toJSON()));
	        var footBar = new FootBar();
	        _this.$el.append(footBar.render().template());
	        footBar.footBarCrent('.footer-bar a');
	        return this;
	    }
	});

/***/ },
/* 52 */
/***/ function(module, exports, __webpack_require__) {

	var api = __webpack_require__(7);
	module.exports =  Backbone.Model.extend({
	    url: api.getQrcode,
	    initialize: function () {
	        return this;
	    }
	});

/***/ },
/* 53 */
/***/ function(module, exports) {

	module.exports = "<div class=\"scroll\">\r\n    {{? !it.path}}\r\n    <div class=\"sk-three-bounce\">\r\n        <div class=\"sk-child sk-bounce1\"></div>\r\n        <div class=\"sk-child sk-bounce2\"></div>\r\n        <div class=\"sk-child sk-bounce3\"></div>\r\n    </div>\r\n    {{??}}\r\n    <div class=\"za-container\" style=\"padding-bottom: 4rem\">\r\n        <h3>第一步</h3>\r\n        <p>长按下方图片，在弹出菜单中选择“保存图片”将图片保存到您手机上</p>\r\n        <div class=\"alert-out alert-out-info\">\r\n            <img class=\"img-responsive\" src=\"{{=it.path}}\">\r\n        </div>\r\n        <p><strong>此二维码有效期至：</strong></p>\r\n        <p class=\"text-success\">{{=it.time}};</p>\r\n        <p class=\"text-success\">过期重新到本页面生成即可</p>\r\n        <h3>第二步</h3>\r\n        <p>将图片通过朋友圈或群发（微信工具栏里有群发功能，一次可以发150人）的方式发送给好友，好友通过此图片里二维码关注并付款后您就可以收徒弟并得到相应的佣金啦！</p>\r\n        <h3>第三步</h3>\r\n        <p>点击底部菜单“佣金制度”可查看佣金管理办法，所有的佣金都是采取即时汇款的方式汇到您的微信钱包的哦！</p>\r\n    </div>\r\n    {{?}}\r\n</div>";

/***/ },
/* 54 */
/***/ function(module, exports, __webpack_require__) {

	var doT = __webpack_require__(6);
	var dialog = __webpack_require__(9);
	var api = __webpack_require__(7);
	var cash = __webpack_require__(55);
	var tpl = __webpack_require__(56);

	module.exports = Backbone.View.extend({
	    el: $('#withdrawView'),
	    template: doT.template(tpl),
	    tagName: 'div',
	    events: {
	        'click #withdrawWay': function () {
	            var d = new dialog({
	                content: '暂时无其他提现方式',
	                title: false,
	                time: false,
	                ok: function () {
	                    d.close();
	                }
	            });
	        },
	        'click .za-btn': '_withdraw',
	        'change input[name="cash"]':'_subInput',
	        'keyup input[name="cash"]':'_subInput'
	    },
	    _isFirst: true,
	    _subInput:function(e){
	        var _this = this;
	        var num = _this.cashModel.get('num');
	        var numBox = _this.$el.find('.num');
	        var type = _this.cashModel.get('type');
	        var val = $(e.target).val();
	        /*
	         * 根据type的不同，进入不同的验证
	         * */
	        if (val!='') {
	            if (type == 1 && !_this._validateIntegral(val)) {
	                return;
	            } else if (type == 2 && !_this._validateMoney(val)) {
	                return;
	            }
	        }
	        if (type == 1) {
	            numBox.html(num-val*100);
	        } else if (type == 2) {
	            numBox.html(num-val);
	        }
	    },
	    _withdraw: function (e) {
	        var _this = this;
	        var type = _this.cashModel.get('type');
	        var form = _this.$el.find('form'),
	            num = parseInt(form.find('[name="cash"]').val());
	        /*
	        * 根据type的不同，进入不同的验证
	        * */
	        if (type == 1 && !_this._validateIntegral(num)) {
	            return;
	        } else if (type == 2 && !_this._validateMoney(num)) {
	            return;
	        }
	        /*
	        * _this._isFirst是否第一次提交
	        * */
	        if (_this._isFirst) {
	            $(e.target).html('正在申请...').addClass('disabled');
	            _this._isFirst = false;
	            $.ajax({
	                url: api.withdraw,
	                method: 'POST',
	                data: form.serialize(),
	                success: function (data) {
	                    _this._isFirst = true;
	                    if (data.status) {
	                        var d = new dialog({
	                            content: data.info,
	                            title: false,
	                            time: false,
	                            maskClose: false,
	                            ok: function () {
	                                d.close();
	                                window.location = '#withdraw_list'
	                            }
	                        });
	                    } else {
	                        $(e.target).html('申请提现').removeClass('disabled');
	                        alert(data.info)
	                    }
	                }
	            })
	        }
	    },
	    _validateIntegral: function (num) {
	        /*
	        * 积分验证
	        * */
	        var _this = this;
	        var reg = /^[1-9]\d*$/,
	            numtotal = _this.cashModel.get('num'),
	            canwithdraw = Math.floor(numtotal / 100);
	        if (num == '') {
	            alert('请填写金额')
	            return false;
	        } else if (!reg.test(num)) {
	            alert('请填写正整数')
	            return false;
	        } else if (num > canwithdraw) {
	            alert('您的余额不足')
	            return false;
	        } else if (num > 200) {
	            alert('单次只能提现200元')
	            return false;
	        }
	        return true;
	    },
	    _validateMoney: function (num) {
	        /*
	        * 现金验证
	        * */
	        var _this = this;
	        var reg = /^[1-9]\d*$/,
	            numtotal = _this.cashModel.get('num');
	        if (num == '') {
	            alert('请填写金额')
	            return false;
	        } else if (!reg.test(num)) {
	            alert('请填写正整数')
	            return false;
	        } else if (num > numtotal) {
	            alert('您的余额不足')
	            return false;
	        } else if (num > 200) {
	            alert('单次只能提现200元')
	            return false;
	        }
	        return true;
	    },
	    initialize: function () {
	        var _this = this;
	        _this.cashModel = new cash;
	        _this.listenTo(_this.cashModel, 'sync', this.render);
	    },
	    render: function () {
	        var _this = this;
	        _this.$el.html(_this.template(_this.cashModel.toJSON()));
	        return this;
	    }
	});

/***/ },
/* 55 */
/***/ function(module, exports, __webpack_require__) {

	var api = __webpack_require__(7);
	module.exports =  Backbone.Model.extend({
	    initialize: function () {
	        return this;
	    },
	    url: api.cash
	});


/***/ },
/* 56 */
/***/ function(module, exports) {

	module.exports = "{{? !it}}\r\n<div class=\"sk-three-bounce\">\r\n    <div class=\"sk-child sk-bounce1\"></div>\r\n    <div class=\"sk-child sk-bounce2\"></div>\r\n    <div class=\"sk-child sk-bounce3\"></div>\r\n</div>\r\n{{??}}\r\n<form class=\"form-group\">\r\n    <div id=\"withdrawWay\" class=\"input-group\">\r\n        <div class=\"form-body\">\r\n            微信钱包\r\n        </div>\r\n        <div class=\"arrow\"><i class=\"iconfont icon-qianjin\"></i></div>\r\n    </div>\r\n    <div class=\"form-tip\">\r\n        {{? it.type==1}}\r\n        当前可提现积分<span class=\"num text-danger\">{{=it.num}}</span>（100积分=1元）\r\n        {{?? it.type==2}}\r\n        当前可提现金额<span class=\"num text-danger\">{{=it.num}}</span>元\r\n        {{?}}\r\n    </div>\r\n    <div class=\"input-group\">\r\n        <span class=\"input-group-addon\">金额</span>\r\n        <input name=\"cash\" class=\"form-control\" placeholder=\"请填写金额（元）\" type=\"num\" />\r\n        <input type=\"hidden\" name=\"type\" value=\"{{= it.type}}\">\r\n    </div>\r\n    <div class=\"form-tip\">\r\n        最低限度1元，每日限额200元\r\n    </div>\r\n</form>\r\n<div class=\"za-container\">\r\n    <button class=\"za-btn za-btn-info za-btn-block\">申请提现</button>\r\n</div>\r\n{{ } }}";

/***/ },
/* 57 */
/***/ function(module, exports, __webpack_require__) {

	var doT = __webpack_require__(6);
	var dialog = __webpack_require__(9);
	var api = __webpack_require__(7);
	var Model = __webpack_require__(58);
	var tpl = __webpack_require__(59);

	module.exports = Backbone.View.extend({
	    el: $('#viewMain'),
	    template: doT.template(tpl),
	    tagName: 'div',
	    events:{
	        'click #upload_form .za-btn': '_upload'
	    },
	    _upload : function(e){
	        var form = $('#upload_form'),
	            _this = this;

	        if ($.trim(form.find('[name="desc"]').val()) == '') {
	            var d = new dialog({
	                content: '请填写描述',
	                title: false,
	                time: false,
	                ok: function () {
	                    d.close();
	                }
	            });
	            return;
	        }
	        if (_this.fistUpload) {
	            $(e.target).html('请稍候...').addClass('disabled');
	            _this.fistUpload = false;
	            $.ajax({
	                url:api.perfectInfo,
	                method:'POST',
	                data:form.serialize(),
	                success:function(data){
	                    _this.fistUpload = true;
	                    $(e.target).html('确定更改').removeClass('disabled');
	                    if (data.status == 1) {
	                        var d = new dialog({
	                            content: '更改成功',
	                            title: false,
	                            time: false,
	                            ok: function () {
	                                d.close();
	                                window.location = '#list';
	                            }
	                        });
	                    }
	                    if (data.status == 0) {
	                        var d = new dialog({
	                            content: '上传失败，请重试！',
	                            title: false,
	                            time: false,
	                            ok: function () {
	                                d.close();
	                            }
	                        });
	                    }
	                }
	            })
	        }
	    },
	    initialize: function () {
	        var _this = this;

	        /*
	         * 防止多次点击
	         * */
	        _this.fistUpload = true;

	        _this.model = new Model();
	        _this.listenTo(_this.model, 'sync', this.render);
	    },
	    render: function () {
	        var _this = this;
	        _this.$el.addClass('block').html(_this.template(_this.model.toJSON()));
	        _this.$el.siblings().removeClass('block');
	        return this;
	    }
	});

/***/ },
/* 58 */
/***/ function(module, exports, __webpack_require__) {

	var api = __webpack_require__(7);
	module.exports =  Backbone.Model.extend({
	    url: api.perfectInfo,
	    initialize: function () {
	        return this;
	    }
	});

/***/ },
/* 59 */
/***/ function(module, exports) {

	module.exports = "<div class=\"za-container\">\r\n    <form id=\"upload_form\" onSubmit=\"return false;\">\r\n        <div class=\"form-group\">\r\n            <div class=\"input-group\">\r\n                <h4>二维码</h4>\r\n                <div class=\"row\">\r\n                    {{ for ( var i in it.qrcode) { }}\r\n                    <div class=\"col-xs-6\">\r\n                        <label for=\"qrcode_{{=i}}}\"><img class=\"img-responsive\" src=\"{{= it.qrcode[i]}}\">\r\n                            <input {{? i== 1 }} checked=\"checked\" {{?}} name=\"qrcode\" id=\"qrcode_{{=i}}}\" value=\"{{= i }}\" type=\"radio\">&nbsp;使用此图作为二维码</label>\r\n                    </div>\r\n                    {{ } }}\r\n                </div>\r\n            </div>\r\n            <div class=\"input-group\">\r\n                <h4>描述</h4>\r\n                <textarea name=\"desc\" rows=\"5\" cols=\"40\" class=\"form-control\" placeholder=\"请填写描述\">{{= it.desc}}</textarea>\r\n            </div>\r\n            <br>\r\n            <button class=\"za-btn za-btn-primary\">确定更改</button>\r\n        </div>\r\n    </form>\r\n\r\n</div>\r\n";

/***/ },
/* 60 */
/***/ function(module, exports, __webpack_require__) {

	var doT = __webpack_require__(6);
	var Apprentices = __webpack_require__(61);
	var tpl = __webpack_require__(62);
	module.exports = Backbone.View.extend({
	    el: '#viewMain',
	    template: doT.template(tpl),
	    tagName: 'div',
	    initialize: function () {
	        var _this = this;
	        this.model = new Apprentices;
	        _this.listenTo(_this.model, 'change', this.render);
	    },
	    render: function () {
	        var _this = this;
	        _this.$el.addClass('block').html(_this.template(_this.model.toJSON()));
	        _this.$el.siblings().removeClass('block');
	        /*            _this.viewBoxScroll = new IScrollProbe('#apprenticesView', {
	         mouseWheel: true,
	         deceleration: 0.0002,
	         probeType: 2
	         });*/
	        return this;
	    }
	});

/***/ },
/* 61 */
/***/ function(module, exports, __webpack_require__) {

	var api = __webpack_require__(7);
	module.exports =  Backbone.Model.extend({
	    initialize: function () {
	        return this;
	    },
	    url: api.apprentices
	});

/***/ },
/* 62 */
/***/ function(module, exports) {

	module.exports = "<div class=\"za-container\">\r\n    {{? !it.data}}\r\n        <div class=\"sk-three-bounce\">\r\n            <div class=\"sk-child sk-bounce1\"></div>\r\n            <div class=\"sk-child sk-bounce2\"></div>\r\n            <div class=\"sk-child sk-bounce3\"></div>\r\n        </div>\r\n    {{??}}\r\n        <div class=\"alert-out alert-out-info\"><strong>我收的徒弟</strong></div>\r\n        <div class=\"panel-list\">\r\n            {{ for (var key in it.data) { }}\r\n            <div class=\"row\">\r\n                <div class=\"col-xs-8\">\r\n                    {{=it.data[key].nickname}}\r\n                </div>\r\n                <div class=\"col-xs-4 text-right\">\r\n                    <span class=\"text-danger\">\r\n                        {{? it.data[key].status == 1}}\r\n                        <span class=\"text-success\">已经支付</span>\r\n                        {{?? }}\r\n\r\n                        <span class=\"text-danger\">未支付</span>\r\n                        {{}}}\r\n                    </span>\r\n                </div>\r\n            </div>\r\n            {{ } }}\r\n            {{? it.total_count > it.list_rows }}\r\n            <div class=\"text-center\">\r\n                <ul class=\"za-page\">\r\n                    <li>\r\n                        <a\r\n                                {{? it.current_page == 1}}\r\n                                href=\"javascript:;\"\r\n                                class=\"disabled\"\r\n                                {{??}}\r\n                                href=\"#apprentices/{{=(parseInt(it.current_page) - 1)}}\"\r\n                                {{?}} aria-label=\"Previous\">\r\n                            <span aria-hidden=\"true\">«</span>\r\n                        </a>\r\n                    </li>\r\n                    {{var num = (it.total_pages < 5) ? it.total_pages : 5  ; }}\r\n                    {{ for (var i=0; i < num; i++ ) { }}\r\n                    {{? (parseInt(it.current_page) + i) <= it.total_pages}}\r\n                    <li>\r\n                        <a class=\"{{? it.current_page == (parseInt(it.current_page) + i) }}active{{ } }}\" href=\"#apprentices/{{=(parseInt(it.current_page) + i)}}\">\r\n                            {{=(parseInt(it.current_page) + i)}}\r\n                        </a>\r\n                    </li>\r\n                    {{?}}\r\n                    {{ } }}\r\n                    <li>\r\n                        <a\r\n                                {{? it.total_pages == it.current_page}}\r\n                                href=\"javascript:;\"\r\n                                class=\"disabled\"\r\n                                {{??}}\r\n                                href=\"#apprentices/{{=(parseInt(it.current_page) + 1)}}\"\r\n                                {{?}}\r\n                                aria-label=\"Next\">\r\n                            <span aria-hidden=\"true\">»</span>\r\n                        </a>\r\n                    </li>\r\n                </ul>\r\n            </div>\r\n            {{ } }}\r\n        </div>\r\n    {{ } }}\r\n</div>";

/***/ },
/* 63 */
/***/ function(module, exports, __webpack_require__) {

	var doT = __webpack_require__(6);
	var dialog = __webpack_require__(9);
	var chatMode = __webpack_require__(39);
	var Horn = __webpack_require__(64);
	var tpl = __webpack_require__(67);

	module.exports = Backbone.View.extend({
	    el: $('#viewMain'),
	    template: doT.template(tpl),
	    tagName: 'div',
	    events:{
	        'click .horn-bar' : function(e) {
	            var _this = this;
	            var html = '<form class="horn-form"><div class="horn-form">';
	            var message = _this.model.get('message');
	            for (var i in message) {
	                html += '<label data-id="'+ message[i].id +'" class="list-group-item">' +
	                    message[i].value +
	                    '<input type="radio" name="message" value="'+ message[i].value +'" />' +
	                    '</label>';
	            }
	            html += '</div></form>';
	            dialog.prototype.choose = function() {
	                var _that = this;
	                $('#d' + _that.id).find('label').on('click',function(){
	                    $(this).addClass('active').siblings().removeClass('active');
	                })
	            };

	            var d = new dialog({
	                content: html,
	                title: '选择喇叭',
	                time: false,
	                ok: {
	                    value: '使用喇叭',
	                    fn: function () {
	                        var data = $('#d' + d.id).find('form').serialize();
	                        if (data!='') {
	                            _this.socketIo.emit('horn', {data:data});
	                            d.close();
	                        }
	                    }
	                },
	                cancel: function () {
	                    d.close();
	                }
	            });
	            d.choose();
	        }
	    },
	    initialize: function () {
	        var _this = this;
	        _this.model = new chatMode;
	        _this.hornVeiw = new Horn;
	    },
	    render: function () {
	        var _this = this;
	        _this.$el.addClass('block').html(_this.template());

	        _this.hornVeiw.render(_this.$el);


	        _this.socketIo =  io.connect('http://localhost:3000/');

	        //监听新用户登录
	        _this.socketIo.on('horn', function(o){
	            console.log(o)
	        });

	        return this;
	    }
	});

/***/ },
/* 64 */
/***/ function(module, exports, __webpack_require__) {

	var doT = __webpack_require__(6);
	var dialog = __webpack_require__(9);
	var Model = __webpack_require__(65);
	var tpl = __webpack_require__(66);

	module.exports = Backbone.View.extend({
	    template: doT.template(tpl),
	    tagName: 'div',

	    initialize: function () {
	        var _this = this;
	        _this.hornModel = new Model
	    },
	    render: function (el) {
	        var _this = this;
	        el.append(_this.template());

	        return this;
	    }
	});

/***/ },
/* 65 */
/***/ function(module, exports, __webpack_require__) {

	var api = __webpack_require__(7);
	module.exports =  Backbone.Model.extend({
	    defaults:function(){
	        return {
	            sender:'张三丰test',
	            for:'',
	            content:'在JavaScript中，原型也是一个对象，通过原型可以实现对象的属性继承，JavaScript的对象中都包含了一个" [[Prototype]]"内部属性，这个属性所对应的就是该对象的原型。',
	            sound:'',
	            message:[
	                {
	                    id:'1',
	                    value:'喇叭信息1'
	                },
	                {
	                    id:'2',
	                    value:'喇叭信息2'
	                },
	                {
	                    id:'3',
	                    value:'喇叭信息3'
	                }
	            ]
	        }
	    },
	    initialize: function () {
	        return this;
	    }
	});

/***/ },
/* 66 */
/***/ function(module, exports) {

	module.exports = "<div class=\"tool-horn\">\r\n    <div class=\"horn-bar\">\r\n        <i class=\"iconfont icon-gouwuche\"></i>\r\n    </div>\r\n</div>";

/***/ },
/* 67 */
/***/ function(module, exports) {

	module.exports = "";

/***/ },
/* 68 */
/***/ function(module, exports, __webpack_require__) {

	var doT = __webpack_require__(6);
	var tpl = __webpack_require__(69);


	module.exports = Backbone.View.extend({
	    el: $('#menuView'),
	    template: doT.template(tpl),
	    tagName: 'div',
	    events:{
	        'click .n-1 > a': function(e) {
	            var el = e.target;
	            if ($(el).parents('.n-1').hasClass('active')) {
	                $(el).parents('.n-1').removeClass('active');
	            } else {
	                $(el).parents('.n-1').addClass('active');
	            }
	            return false;

	        }
	    },
	    initialize: function () {
	    },
	    render: function () {
	        var _this = this;
	        _this.$el.html(_this.template());
	        return this;
	    }
	});

/***/ },
/* 69 */
/***/ function(module, exports) {

	module.exports = "<div class=\"menu-lb\">\r\n    <div class=\"menu-box\">\r\n        <ul class=\"m-1\">\r\n            <li class=\"n-1\">\r\n                <a href=\"\"><span><i class=\"iconfont icon-gouwuche\"></i></span></a>\r\n                <ul class=\"m-2\">\r\n                    <li class=\"n-2\">\r\n                        <a><span><i class=\"iconfont icon-laba\"></i></span></a>\r\n                    </li>\r\n                    <li class=\"n-2\">\r\n                        <a><span><i class=\"iconfont icon-shandian\"></i></span></a>\r\n                    </li>\r\n                </ul>\r\n            </li>\r\n        </ul>\r\n    </div>\r\n</div>\r\n</body>";

/***/ },
/* 70 */
/***/ function(module, exports, __webpack_require__) {

	var doT = __webpack_require__(6);
	var dialog = __webpack_require__(9);
	var api = __webpack_require__(7);
	var WithModel = __webpack_require__(71);
	var tpl = __webpack_require__(72);

	module.exports = Backbone.View.extend({
	    el: $('#withdrawListView'),
	    template: doT.template(tpl),
	    tagName: 'div',
	    events: {

	    },
	    initialize: function () {
	        var _this = this;
	        _this.withModel = new WithModel;
	        _this.listenTo(_this.withModel, 'sync', this.render);
	    },
	    render: function () {
	        var _this = this;
	        _this.$el.html(_this.template(_this.withModel.toJSON()));
	        return this;
	    }
	});

/***/ },
/* 71 */
/***/ function(module, exports, __webpack_require__) {

	var api = __webpack_require__(7);
	module.exports =  Backbone.Model.extend({
	    initialize: function () {
	        return this;
	    },
	    url: api.withdrawList
	});


/***/ },
/* 72 */
/***/ function(module, exports) {

	module.exports = "{{? !it}}\r\n<div class=\"sk-three-bounce\">\r\n    <div class=\"sk-child sk-bounce1\"></div>\r\n    <div class=\"sk-child sk-bounce2\"></div>\r\n    <div class=\"sk-child sk-bounce3\"></div>\r\n</div>\r\n{{??}}\r\n\r\n{{ for (var key in it.data) { }}\r\n<div class=\"za-media\">\r\n    <div class=\"za-media-left\">\r\n        {{?it.data[key].type == parseInt(1)}}\r\n        <b>积分提现</b>\r\n        {{??it.data[key].type == parseInt(2)}}\r\n        <b>现金</b>\r\n        {{?}}\r\n    </div>\r\n    <div class=\"za-media-body\">\r\n        <span class=\"text-danger\">\r\n            ￥{{=it.data[key].cash}}\r\n        </span>\r\n    </div>\r\n    <div class=\"za-media-right\">\r\n        {{?it.data[key].status == 1}}\r\n        <span class=\"text-success\">提现成功</span>\r\n        {{??it.data[key].status == 0}}\r\n        <span class=\"text-danger\">提现失败</span>\r\n        {{??it.data[key].status == 2}}\r\n        <span class=\"text-info\">审核中...</span>\r\n        {{?}}\r\n        <br>\r\n        {{=it.data[key].time}}\r\n\r\n    </div>\r\n</div>\r\n{{ } }}\r\n{{? it.total_count > it.list_rows }}\r\n<div class=\"text-center\">\r\n    <ul class=\"za-page\">\r\n        <li>\r\n            <a   {{? it.current_page == 1}}\r\n                 href=\"javascript:;\"\r\n                 class=\"disabled\"\r\n                 {{??}}\r\n                 href=\"#withdraw_list/{{=(parseInt(it.current_page) - 1)}}\"\r\n                 {{?}} aria-label=\"Previous\">\r\n                <span aria-hidden=\"true\">«</span>\r\n            </a>\r\n        </li>\r\n        {{var num = (it.total_pages < 5) ? it.total_pages : 5  ; }}\r\n        {{ for (var i=0; i < num; i++ ) { }}\r\n        {{? (parseInt(it.current_page) + i) <= it.total_pages}}\r\n        <li>\r\n            <a class=\"{{? it.current_page == (parseInt(it.current_page) + i) }}active{{ } }}\" href=\"#withdraw_list/{{=(parseInt(it.current_page) + i)}}\">\r\n                {{=(parseInt(it.current_page) + i)}}\r\n            </a>\r\n        </li>\r\n        {{?}}\r\n        {{ } }}\r\n        <li>\r\n            <a {{? it.total_pages == it.current_page}}\r\n               href=\"javascript:;\"\r\n               class=\"disabled\"\r\n               {{??}}\r\n               href=\"#withdraw_list/{{=(parseInt(it.current_page) + 1)}}\"\r\n               {{?}}\r\n               aria-label=\"Next\">\r\n                <span aria-hidden=\"true\">»</span>\r\n            </a>\r\n        </li>\r\n    </ul>\r\n</div>\r\n{{ } }}\r\n{{ } }}";

/***/ },
/* 73 */
/***/ function(module, exports, __webpack_require__) {

	var doT = __webpack_require__(6);
	var dialog = __webpack_require__(9);
	var api = __webpack_require__(7);
	var footBarCrent = __webpack_require__(15);
	var rank = __webpack_require__(74);
	var tpl = __webpack_require__(23);


	module.exports = Backbone.View.extend({
	    el: $('#rankView'),
	    template: doT.template(tpl),
	    tagName: 'div',
	    events: {

	    },
	    initialize: function () {
	        var _this = this;
	        _this.rankModel = new rank;
	        _this.listenTo(_this.rankModel, 'sync', this.render);
	    },
	    render: function () {
	        var _this = this;
	        _this.$el.html(_this.template(_this.rankModel.toJSON()));
	        footBarCrent('.za-nav a');
	        return this;
	    }
	});

/***/ },
/* 74 */
/***/ function(module, exports, __webpack_require__) {

	var api = __webpack_require__(7);
	module.exports =  Backbone.Model.extend({
	    initialize: function () {
	        return this;
	    },
	    url: api.rank
	});

/***/ },
/* 75 */
/***/ function(module, exports, __webpack_require__) {

	var doT = __webpack_require__(6);
	var Public = __webpack_require__(76);
	var tpl = __webpack_require__(69);

	module.exports = Backbone.View.extend({
	    el: $('#publicView'),
	    template: doT.template(tpl),
	    tagName: 'div',
	    initialize: function () {
	        var _this = this;
	        _this.model = new Public;
	        _this.listenTo(_this.model, 'sync', _this.render);
	    },
	    render: function () {
	        var _this = this;
	        _this.$el.html(_this.template(_this.model.toJSON()));

	        return this;
	    }
	});

/***/ },
/* 76 */
/***/ function(module, exports, __webpack_require__) {

	var api = __webpack_require__(7);
	module.exports =  Backbone.Model.extend({
	    url: api.official_accounts,
	    initialize: function () {
	        return this;
	    }
	});

/***/ },
/* 77 */
/***/ function(module, exports, __webpack_require__) {

	var doT = __webpack_require__(6);
	var tpl = __webpack_require__(78);

	module.exports = Backbone.View.extend({
	    el: $('#publicView'),
	    template: doT.template(tpl),
	    tagName: 'div',
	    initialize: function () {
	        var _this = this;
	    },
	    render: function () {
	        var _this = this;
	        _this.$el.html(_this.template());
	        return this;
	    }
	});

/***/ },
/* 78 */
/***/ function(module, exports) {

	module.exports = "";

/***/ },
/* 79 */
/***/ function(module, exports, __webpack_require__) {

	var doT = __webpack_require__(6);
	var dialog = __webpack_require__(9);
	var PlacardRank = __webpack_require__(80);
	var Cash = __webpack_require__(81);
	var footBarCrent = __webpack_require__(15);
	var tpl = __webpack_require__(82);
	var tplRank = __webpack_require__(83);


	module.exports = Backbone.View.extend({
	    el: $('#placardView'),
	    template: doT.template(tpl),
	    templateRank:doT.template(tplRank),
	    tagName: 'div',
	    events:{
	        'click .icon-wenhao': function() {
	            var html = '<div class="alert-out alert-out-info">' +
	                '<span class="text-danger">若可提现金额小于提现额度不能提现</span><br>1、必须满足积分超过100分，即最低1元方可提现；<br>2、推广的团员输入接头暗号后即可随机获得一个5-50积分；<br>3、可提现结算周期为24小时，即指第二次提现申请与第一次提现申请需间隔24小时；<br>4、您可自主提现，提现金额转到微信零钱；<br>5、财神道拥有本活动最终解释权' +
	                '</div>';
	            var d = new dialog ({
	                title:'积分说明',
	                content:html,
	                ok:function(){
	                    d.close();
	                }
	            })
	        }
	    },
	    initialize: function () {
	        var _this = this;
	        _this.placardModel = new PlacardRank;
	        _this.cashModel  = new Cash;
	        _this.listenTo(_this.placardModel, 'sync', this._renderRank);
	        _this.listenTo(_this.cashModel, 'sync', this.render);
	    },
	    _renderRank:function(){
	        var _this = this;
	        _this.$el.find('.rankView').html(_this.templateRank(_this.placardModel.toJSON()));
	        footBarCrent('.za-nav a');
	    },
	    render: function () {
	        var _this = this;
	        _this.$el.find('.bannerView').html(_this.template(_this.cashModel.toJSON()));
	        return this;
	    }
	});

/***/ },
/* 80 */
/***/ function(module, exports, __webpack_require__) {

	var api = __webpack_require__(7);
	module.exports =  Backbone.Model.extend({
	    url: api.placard_rank,
	    initialize: function () {
	        return this;
	    }
	});

/***/ },
/* 81 */
/***/ function(module, exports, __webpack_require__) {

	var api = __webpack_require__(7);
	module.exports =  Backbone.Model.extend({
	    initialize: function () {
	        return this;
	    },
	    url: api.placard_cash
	});

/***/ },
/* 82 */
/***/ function(module, exports) {

	module.exports = "<div class=\"img-placard\">\r\n    <div class=\"inner\">\r\n        <img class=\"img-responsive text\" src=\"{{=globConfig.imageUrl}}/text_img.png\" alt=\"\"/>\r\n    </div>\r\n    <img class=\"img-responsive\" src=\"{{=globConfig.imageUrl}}/haibao_banner.jpg\" alt=\"\"/>\r\n</div>\r\n<div class=\"za-container\">\r\n    <h3>第一步</h3>\r\n    <p>长按下方图片，在弹出菜单中选择“保存图片”将图片保存到您手机上</p>\r\n    <div class=\"alert-out alert-out-info\">\r\n        <img class=\"img-responsive\" src=\"{{=it.qrcode}}\">\r\n    </div>\r\n    <h3>第二步</h3>\r\n    <p>将图片通过朋友圈或群发（微信工具栏里有群发功能，一次可以发150人）的方式发送给好友，好友通过此图片里二维码关注公众号后，点击进入游戏页面输入您的接头暗号，您将随机获得数量5~50不等的积分</p>\r\n    <h3>第三步</h3>\r\n    <p>积满100积分可兑换1元现金，即可点击提现，满百整兑，以此类推。</p>\r\n</div>\r\n\r\n\r\n<div class=\"footer-line\">\r\n    <span class=\"pull-right\"><a class=\"za-btn za-btn-danger\" href=\"#withdraw\">提现</a></span>\r\n    当前积分：{{=it.integral}} <span class=\"icon-wenhao\">?</span>\r\n</div>";

/***/ },
/* 83 */
/***/ function(module, exports) {

	module.exports = "{{? !it}}\r\n<div class=\"sk-three-bounce\">\r\n    <div class=\"sk-child sk-bounce1\"></div>\r\n    <div class=\"sk-child sk-bounce2\"></div>\r\n    <div class=\"sk-child sk-bounce3\"></div>\r\n</div>\r\n{{??}}\r\n<nav class=\"za-nav\">\r\n    <a href=\"#/placard/myteam\"><span>我的军团</span></a>\r\n    <a href=\"#/placard/all\"><span>世界排名</span></a>\r\n</nav>\r\n{{ for (var key in it.data) { }}\r\n<div class=\"za-media\">\r\n    <div class=\"za-media-left\">\r\n        <img class=\"media-object\"\r\n             src=\"{{=it.data[key].headimgurl}}\">\r\n    </div>\r\n    <div class=\"za-media-body\">\r\n        <h4>{{=it.data[key].nickname}} </h4>\r\n\r\n        <p class=\"time-info\">{{? it.group == 'myteam'}}入团时间{{??}}建团时间{{?}}：{{=it.data[key].join_time}}</p>\r\n    </div>\r\n    <div class=\"za-media-right\">\r\n        <div class=\"text-right\">\r\n            {{? it.group == 'myteam'}}贡献{{??}}总积分{{?}}<br>\r\n            <span class=\"text-danger\">{{=it.data[key].integral}}</span>\r\n        </div>\r\n    </div>\r\n</div>\r\n{{ } }}\r\n{{? it.group == 'myteam'}}\r\n<div class=\"za-media\">\r\n    <div class=\"za-media-left\">\r\n\r\n    </div>\r\n    <div class=\"za-media-body text-right\">\r\n        <b>军团累计积分:</b>\r\n    </div>\r\n    <div class=\"za-media-right\">\r\n        <div class=\"text-right text-danger\">\r\n            {{=it.all_integral}}\r\n        </div>\r\n    </div>\r\n</div>\r\n{{?}}\r\n{{ } }}";

/***/ },
/* 84 */
/***/ function(module, exports, __webpack_require__) {

	var doT = __webpack_require__(6);
	var dialog = __webpack_require__(9);
	var api = __webpack_require__(7);
	var tpl = __webpack_require__(85);
	var getQuery = __webpack_require__(86);

	module.exports = Backbone.View.extend({
	    el: '#placardWelcomeView',
	    template: doT.template(tpl),
	    tagName: 'div',
	    events:{
	        'click .za-btn':'_join'
	    },
	    _join:function(e){
	        var _this = this;
	        if (_this.joinIsClick) {
	            _this.joinIsClick = false;
	            $(e.target).html('请稍后...').addClass('disabled');
	            var form = _this.$el.find('form');
	            var type = getQuery('type');
	            if (type == '' || type == null) {
	                alert('没有获取到游戏种类')
	            }
	            form.find('[name="type"]').attr('value',type);
	            if ($.trim(form.find('[name="secret_code"]').val()) == '') {
	                alert('请填写暗号');
	                return;
	            }
	            $.ajax({
	                url:api.secret_code,
	                method:'POST',
	                data:form.serializeArray(),
	                success:function(data){
	                    _this.joinIsClick = true;
	                    $(e.target).html('立即参加').removeClass('disabled');
	                    if (data.status) {
	                        window.location = data.content.url
	                    } else {
	                        alert(data.info)
	                    }
	                }
	            })

	        }


	    },
	    joinIsClick:true,
	    initialize: function () {

	    },
	    render: function () {
	        var _this = this;
	        _this.$el.html(_this.template());
	        return this;
	    }
	});

/***/ },
/* 85 */
/***/ function(module, exports) {

	module.exports = "<div class=\"img-welcome\">\r\n    <img class=\"img-responsive\" src=\"{{=globConfig.imageUrl}}/haibao_bg.jpg\">\r\n    <div class=\"inner\">\r\n        <form class=\"form-group form-welcome\">\r\n            <h3>请输入接头暗号</h3>\r\n            <div>\r\n                <input name=\"secret_code\" class=\"form-control\" type=\"text\" placeholder=\"请输入暗号\">\r\n                <input name=\"type\" class=\"form-control\" type=\"hidden\" value=\"1\">\r\n            </div>\r\n        </form>\r\n        <button class=\"za-btn za-btn-block za-btn-primary\">立即参加</button>\r\n    </div>\r\n</div>";

/***/ },
/* 86 */
/***/ function(module, exports) {

	module.exports = function (name) {
	    var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");
	    var r = window.location.search.substr(1).match(reg);
	    if (r != null) return unescape(r[2]);
	    return null;
	}

/***/ }
/******/ ]);