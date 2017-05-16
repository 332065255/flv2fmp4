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
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};

/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);

/******/ 		// Flag the module as loaded
/******/ 		module.l = true;

/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}


/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;

/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;

/******/ 	// identity function for calling harmony imports with the correct context
/******/ 	__webpack_require__.i = function(value) { return value; };

/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};

/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};

/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };

/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";

/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
eval("\n\nwindow.flvParse = {\n    setFlv: function setFlv(uint8) {},\n    nextTag: function nextTag() {}\n};//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vLi9qcy9mbHZFbnRlci5qcz9iZGJiIl0sIm5hbWVzIjpbIndpbmRvdyIsImZsdlBhcnNlIiwic2V0Rmx2IiwidWludDgiLCJuZXh0VGFnIl0sIm1hcHBpbmdzIjoiOztBQUFBQSxPQUFPQyxRQUFQLEdBQWtCO0FBQ2RDLFlBQVEsZ0JBQVNDLEtBQVQsRUFBZ0IsQ0FFdkIsQ0FIYTtBQUlkQyxhQUFTLG1CQUFXLENBRW5CO0FBTmEsQ0FBbEIiLCJmaWxlIjoiMC5qcyIsInNvdXJjZXNDb250ZW50IjpbIndpbmRvdy5mbHZQYXJzZSA9IHtcbiAgICBzZXRGbHY6IGZ1bmN0aW9uKHVpbnQ4KSB7XG5cbiAgICB9LFxuICAgIG5leHRUYWc6IGZ1bmN0aW9uKCkge1xuXG4gICAgfVxufVxuXG5cbi8vIFdFQlBBQ0sgRk9PVEVSIC8vXG4vLyAuL2pzL2ZsdkVudGVyLmpzIl0sInNvdXJjZVJvb3QiOiIifQ==");

/***/ })
/******/ ]);