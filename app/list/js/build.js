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

	var fastClick = __webpack_require__(1);
	/*var Stage = require('../../utils/Stage');

	Backbone.stage = new Stage();
	console.log(Backbone.stage)*/

	fastClick.attach(document.body);

	/*
	 * 引入路由
	 * */
	var List = __webpack_require__(2);
	var list = new List();

	Backbone.history.start();

/***/ },
/* 1 */
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
/* 2 */
/***/ function(module, exports, __webpack_require__) {

	var list = __webpack_require__(3);
	var appCache = __webpack_require__(10);
	var detail = __webpack_require__(11);



	module.exports = Backbone.Router.extend({
	    routes: {
	        '': 'list',
	        'list': 'list',
	        'list/:p': 'list',
	        'detail':'detail',
	        'detail/:id':'detail'
	    },
	    cacheInitialize: function () {
	        appCache.initialize(function () {
	            var view = {};
	            view.list = new list;
	            view.detail = new detail;
	            return view;
	        });
	        this.cached = appCache.get();
	    },
	    initialize: function () {
	        this.cacheInitialize();
	    },
	    list:function(p){
	        this.cached.list.fetch(p);
	    },
	    detail:function(id){
	        this.cached.detail.fetch(id);
	    }
	});


/***/ },
/* 3 */
/***/ function(module, exports, __webpack_require__) {

	var doT = __webpack_require__(4);
	var tpl = __webpack_require__(5);
	var tplTip = __webpack_require__(17);
	var tpl_page = __webpack_require__(18);
	var List = __webpack_require__(6);
	var Alert = __webpack_require__(8);

	module.exports = Backbone.View.extend({
	    el: '#listView',
	    template: doT.template(tpl),
	    templateTip: doT.template(tplTip),
	    templateTop:'<span class="back-top"><i class="iconfont icon-fanhuidingbu"></i><span/>',
	    template_page:doT.template(tpl_page),
	    initialize: function () {
	        var _this = this;
	        _this.model = new List;
	        _this.listenTo(this.model, 'sync', _this.renderList);
	        _this.renderTip();
	        $(_this.templateTop).prependTo(_this.$el);
	        return _this;
	    },
	    events: {
	        'click .back-top':'backTop'
	    },
	    backTop:function(){
	      var _this = this;
	        _this.$el.scrollTop(0);
	    },
	    _scroll: function () {
	        var _this = this;
	        _this.$el.scroll(function () {
	            /*
	            * 向下翻页
	            * */
	            if (_this.$el.scrollTop() >= (_this.$el[0].scrollHeight - _this.$el.height())) {
	                var page = parseInt(_this._getPage()) + 1;
	                window.location.hash='list/'+ page;
	            }
	            /*
	            * 向上翻页
	            * */
	            if (_this.$el.scrollTop() == 0) {
	                _this._refresh()
	            }
	        })
	    },
	    _getPageList:function(){
	        var list = this.$el.find('[data-page]');
	        if (list.length > 3 ) {
	            list[0].remove();
	        }
	        return list;
	    },
	    /*
	    * 获取当前页的序列
	    * */
	    _getPage:function(){
	        return this.model.get('current_page');
	    },
	    _refresh:function(){
	        var crentPage = this._getPage();
	        if (crentPage != 0) {
	            this.pageList = [];
	            this.$el.find('#listCont').html('');
	            window.location.hash='list/'+ 0;
	        }
	    },
	    pageList:[],
	    fetch: function (p) {
	        var _this = this;
	        var p = p ? p : 0;
	        if (_this.pageList.indexOf('list/'+p) >= 0) {
	            /*
	            * 假如是已经加载过的页面
	            * */
	        } else {
	            /*
	            * 未加载过的页面
	            * */
	            _this.model.fetch({data: {p: p},success:function(){
	                _this.pageList.push('list/'+p);
	            }});
	        }
	        _this.$el.addClass('list-show').siblings().removeClass('list-show');
	    },
	    renderTip: function () {
	        var _this = this;
	        $(_this.templateTip()).prependTo(_this.$el);
	    },
	    isFirst:true,
	    renderList: function () {
	        var _this = this;
	        if (_this.el.innerHTML == '') {
	            _this.$el.find('#listCont').html(_this.template(_this.model.toJSON()));
	        } else {
	            if (_this.$el.find('#list_'+ _this._getPage()).length>0) {
	                _this.$el.find('#list_'+ _this._getPage()).html(_this.template(_this.model.toJSON()));
	            } else {
	                _this.$el.find('#listCont').append(_this.template(_this.model.toJSON()));
	            }
	        }
	        /*
	        * 渲染翻页
	        * */
	        _this.$el.find('#list-page').html(_this.template_page(_this.model.toJSON()));
	        /*
	        * 初次载入绑定滚动加载
	        * */
	        if (_this.isFirst) {
	            _this.isFirst=false;
	            _this._scroll();
	        }
	        return _this;
	    }
	});

/***/ },
/* 4 */
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
/* 5 */
/***/ function(module, exports) {

	module.exports = "<div data-page=\"{{=it.current_page}}\" id=\"list_{{=it.current_page}}\">\r\n    {{ for (var key in it.data) { }}\r\n    <a href=\"#detail/{{=it.data[key].id}}\">\r\n        <div class=\"za-media\">\r\n            <div class=\"za-media-left\">\r\n                <img class=\"media-object\" src=\"{{=sourceUrl}}{{=it.data[key].cover_img}}\">\r\n            </div>\r\n            <div class=\"za-media-body\">\r\n                <h5>{{=it.current_page}}{{=it.data[key].title}}</h5>\r\n                <div>\r\n                <span class=\"pull-right\">\r\n                分享：{{=it.data[key].share}} &nbsp;\r\n                阅读：{{=it.data[key].view}}\r\n            </span>\r\n                    <span class=\"text-danger\">￥{{=it.data[key].price}}</span>\r\n                </div>\r\n            </div>\r\n        </div>\r\n    </a>\r\n    {{ } }}\r\n</div>";

/***/ },
/* 6 */
/***/ function(module, exports, __webpack_require__) {

	var api = __webpack_require__(7)

	module.exports =  Backbone.Model.extend({
	    defaults:function(){
	      return {
	          tips:'分享文章到朋友圈，好友转发或阅读即可产生收入！分享文章到朋友圈，好友转发或阅读即可产生收入！',
	          page_url:'list'
	      }
	    },
	    parse: function (response, option) {
	        return response;
	    },
	    url:api.article_list,
	    initialize: function () {
	        return this;
	    }
	});

/***/ },
/* 7 */
/***/ function(module, exports) {

	module.exports = {
	    article_list: isService ? demoConfig.host + 'article_list' : demoConfig.host + 'article_list',
	    article_detail: isService ? demoConfig.host + 'article_list' : demoConfig.host + 'article_detail'
	}

/***/ },
/* 8 */
/***/ function(module, exports) {

	'use strict';
	var dismiss = '[data-dismiss="alert"]';
	var callback = function(){};
	var Alert = function (el,cb) {
	    $(el).on('click', dismiss, this.close);
	    if(cb) callback = cb;
	    console.log(this)
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
	    callback();
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
/* 9 */
/***/ function(module, exports) {

	/*
	* 取窗口到滚动条顶部高度
	* */
	module.exports.getScrollTop = function () {
	    var scrollTop=0;
	    if(document.documentElement&&document.documentElement.scrollTop)
	    {
	        scrollTop=document.documentElement.scrollTop;
	    }
	    else if(document.body)
	    {
	        scrollTop=document.body.scrollTop;
	    }
	    return scrollTop;
	}
	/*
	 * 取窗口可视范围的高度
	 * */
	module.exports.getClientHeight = function () {
	    var clientHeight;
	    if(document.body.clientHeight&&document.documentElement.clientHeight)
	    {
	        clientHeight = (document.body.clientHeight<document.documentElement.clientHeight)?document.body.clientHeight:document.documentElement.clientHeight;
	    }
	    else
	    {
	        clientHeight = (document.body.clientHeight>document.documentElement.clientHeight)?document.body.clientHeight:document.documentElement.clientHeight;
	    }
	    return clientHeight;
	}
	/*
	* 取文档内容实际高度
	* */
	module.exports.getScrollHeight = function(){
	    return Math.max(document.body.scrollHeight,document.documentElement.scrollHeight);
	}

/***/ },
/* 10 */
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
/* 11 */
/***/ function(module, exports, __webpack_require__) {

	var doT = __webpack_require__(4);
	var tpl = __webpack_require__(12);
	var List = __webpack_require__(13);
	var Alert = __webpack_require__(8);
	var size = __webpack_require__(9);

	module.exports = Backbone.View.extend ({
	    el: '#detailView',
	    events:'',
	    template: doT.template(tpl),
	    initialize: function () {
	        var _this = this;
	        _this.model = new List;
	        _this.listenTo(this.model, 'sync', _this.renderList);
	        return _this;
	    },
	    fetch:function(id){
	        var _this = this;
	        _this.model.fetch({data:{id:id}});
	        _this.$el.addClass('animated fadeInRight list-show').siblings().removeClass('list-show');
	    },
	    renderList:function(){
	        var _this = this;
	        _this.$el.html(_this.template(_this.model.toJSON()));
	        _this.$el.scrollTop(0);
	        return _this;
	    }
	});

/***/ },
/* 12 */
/***/ function(module, exports) {

	module.exports = "{{? !it}}\r\n<div class=\"sk-three-bounce\">\r\n    <div class=\"sk-child sk-bounce1\"></div>\r\n    <div class=\"sk-child sk-bounce2\"></div>\r\n    <div class=\"sk-child sk-bounce3\"></div>\r\n</div>\r\n{{??}}\r\n<div class=\"za-container\">\r\n    <div>\r\n        <h1 class=\"detail-title\">{{=it.data.title}}</h1>\r\n        <span class=\"c666\">2015-04-21</span> &nbsp;&nbsp;\r\n        <a id=\"publicLink\" data-action=\"/index.php?s=/Home/Article/linkClick.html\"\r\n           data-condition=\"{document_id:473,uid:-1,ip:2130706433,link_title:财神道}\"\r\n           href=\"index.php?s=/Home/Article/detail/id/3312.html\">财神道</a>\r\n    </div>\r\n\r\n    <div class=\"detail\">\r\n        {{=it.data.content}}\r\n    </div>\r\n</div>\r\n{{ } }}";

/***/ },
/* 13 */
/***/ function(module, exports, __webpack_require__) {

	var api = __webpack_require__(7)

	module.exports =  Backbone.Model.extend({
	    defaults:function(){
	        return {
	            tips:'分享文章到朋友圈，好友转发或阅读即可产生收入！分享文章到朋友圈，好友转发或阅读即可产生收入！'
	        }
	    },
	    url:api.article_detail,
	    initialize: function () {
	        return this;
	    }
	});

/***/ },
/* 14 */,
/* 15 */,
/* 16 */,
/* 17 */
/***/ function(module, exports) {

	module.exports = "<div class=\"za-alert za-alert-info\">\r\n    <button type=\"button\" class=\"za-close\" data-dismiss=\"alert\" aria-label=\"Close\"><span\r\n            aria-hidden=\"true\">&times;</span></button>\r\n    分享文章到朋友圈，好友转发或阅读即可产生收入！分享文章到朋友圈，好友转发或阅读即可产生收入！\r\n</div>";

/***/ },
/* 18 */
/***/ function(module, exports) {

	module.exports = "<div class=\"list-page text-center\">\r\n    <ul class=\"za-page\">\r\n        <li>\r\n            <a   {{? it.current_page == 0}}\r\n                 href=\"javascript:;\"\r\n                 class=\"disabled\"\r\n                 {{??}}\r\n                 href=\"#{{=it.page_url}}/{{=(parseInt(it.current_page) - 1)}}\"\r\n                 {{?}} aria-label=\"Previous\">\r\n                <span aria-hidden=\"true\">«</span>\r\n            </a>\r\n        </li>\r\n        {{var num = (it.total_pages < 5) ? it.total_pages : 5  ; }}\r\n\r\n        {{var endPage = ( parseInt(it.total_pages) >= parseInt(it.current_page)+ 1  ? parseInt(it.current_page)+ 1 :  parseInt(it.total_pages) ) ;}}\r\n\r\n        {{? it.current_page !=0 }}\r\n        <li>\r\n            <a class=\"{{? it.current_page == 0 }}active{{ } }}\" href=\"#{{=it.page_url}}/0\">\r\n                1\r\n            </a>\r\n        </li>\r\n        {{}}}\r\n        {{? it.current_page > 5 }}\r\n        <li>\r\n            <a>\r\n                ...\r\n            </a>\r\n        </li>\r\n        {{}}}\r\n\r\n        {{ for (var i=parseInt(it.current_page)-1; i <= endPage; i++ ) { }}\r\n            {{? i>= 0}}\r\n                {{? i == it.current_page}}\r\n                <li>\r\n                    <a class=\"{{? it.current_page == (parseInt(it.current_page)) }}active{{ } }}\" href=\"#{{=it.page_url}}/{{=parseInt(it.current_page)}}\">\r\n                        {{=parseInt(it.current_page)}}\r\n                    </a>\r\n                </li>\r\n                {{??}}\r\n\r\n                {{? i != 0 && i != it.total_pages }}\r\n                <li>\r\n\r\n                    <a href=\"#{{=it.page_url}}/{{=i-1}}\">\r\n                        {{=i}}\r\n                    </a>\r\n                </li>\r\n                {{}}}\r\n            {{?}}\r\n        {{}}}\r\n        {{ } }}\r\n        {{? parseInt(it.current_page) + 2 < parseInt(it.total_pages) }}\r\n        <li>\r\n            <a>\r\n                ...\r\n            </a>\r\n        </li>\r\n        {{}}}\r\n        {{? it.current_page != parseInt(it.total_pages) }}\r\n        <li>\r\n            <a class=\"{{? it.current_page == parseInt(it.total_pages) }}active{{ } }}\" href=\"#{{=it.page_url}}/{{=parseInt(it.total_pages)}}\">\r\n                {{=parseInt(it.total_pages)+1}}\r\n            </a>\r\n        </li>\r\n        {{}}}\r\n        <li>\r\n            <a {{? it.total_pages == it.current_page}}\r\n               href=\"javascript:;\"\r\n               class=\"disabled\"\r\n               {{??}}\r\n               href=\"#{{=it.page_url}}/{{=(parseInt(it.current_page) + 1)}}\"\r\n               {{?}}\r\n               aria-label=\"Next\">\r\n                <span aria-hidden=\"true\">»</span>\r\n            </a>\r\n        </li>\r\n    </ul>\r\n</div>";

/***/ }
/******/ ]);