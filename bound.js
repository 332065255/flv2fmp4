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
/******/ 	return __webpack_require__(__webpack_require__.s = 2);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
eval("\n\nObject.defineProperty(exports, \"__esModule\", {\n    value: true\n});\n\nvar _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if (\"value\" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();\n\nvar _flvTag = __webpack_require__(1);\n\nvar _flvTag2 = _interopRequireDefault(_flvTag);\n\nfunction _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }\n\nfunction _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError(\"Cannot call a class as a function\"); } }\n\nvar FlvParse = function () {\n    function FlvParse() {\n        _classCallCheck(this, FlvParse);\n\n        this.tempUint8 = [];\n        this.arrTag = [];\n        this.index = 0;\n        this.tempArr = [];\n    }\n\n    _createClass(FlvParse, [{\n        key: \"setFlv\",\n        value: function setFlv(uint8) {\n            this.tempUint8 = uint8;\n            this.parse();\n            console.log(this.arrTag);\n        }\n    }, {\n        key: \"parse\",\n        value: function parse() {\n            this.read(9);\n            this.read(4);\n            while (this.index < this.tempUint8.length) {\n                var t = new _flvTag2.default();\n\n                t.tagType = this.read(1)[0]; //取出tag类型\n                t.dataSize = [].concat(this.read(3)); //取出包体大小\n                t.Timestamp = [].concat(this.read(4)); //取出解码时间\n                t.StreamID = [].concat(this.read(3)); //取出stream id\n                t.body = [].concat(this.read(this.getBodySum(t.dataSize))); //取出stream id\n                this.arrTag.push(t);\n                this.read(4);\n            }\n        }\n    }, {\n        key: \"read\",\n        value: function read(length) {\n            this.tempArr.length = 0;\n            for (var i = 0; i < length; i++) {\n                // console.log(this.tempUint8);\n                this.tempArr.push(this.tempUint8[this.index]);\n                this.index += 1;\n            }\n            return this.tempArr;\n        }\n    }, {\n        key: \"getBodySum\",\n        value: function getBodySum(arr) {\n            var _str = \"\";\n            _str += arr[0].toString(16).length == 1 ? \"0\" + arr[0].toString(16) : arr[0].toString(16);\n            _str += arr[1].toString(16).length == 1 ? \"0\" + arr[1].toString(16) : arr[1].toString(16);\n            _str += arr[2].toString(16).length == 1 ? \"0\" + arr[2].toString(16) : arr[2].toString(16);\n            return parseInt(_str, 16);\n        }\n    }]);\n\n    return FlvParse;\n}();\n\nexports.default = new FlvParse();//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vLi9qcy9mbHYvZmx2UGFyc2UuanM/Y2FlOCJdLCJuYW1lcyI6WyJGbHZQYXJzZSIsInRlbXBVaW50OCIsImFyclRhZyIsImluZGV4IiwidGVtcEFyciIsInVpbnQ4IiwicGFyc2UiLCJjb25zb2xlIiwibG9nIiwicmVhZCIsImxlbmd0aCIsInQiLCJ0YWdUeXBlIiwiZGF0YVNpemUiLCJjb25jYXQiLCJUaW1lc3RhbXAiLCJTdHJlYW1JRCIsImJvZHkiLCJnZXRCb2R5U3VtIiwicHVzaCIsImkiLCJhcnIiLCJfc3RyIiwidG9TdHJpbmciLCJwYXJzZUludCJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7QUFBQTs7Ozs7Ozs7SUFDTUEsUTtBQUNGLHdCQUFjO0FBQUE7O0FBQ1YsYUFBS0MsU0FBTCxHQUFpQixFQUFqQjtBQUNBLGFBQUtDLE1BQUwsR0FBYyxFQUFkO0FBQ0EsYUFBS0MsS0FBTCxHQUFhLENBQWI7QUFDQSxhQUFLQyxPQUFMLEdBQWUsRUFBZjtBQUNIOzs7OytCQUNNQyxLLEVBQU87QUFDVixpQkFBS0osU0FBTCxHQUFpQkksS0FBakI7QUFDQSxpQkFBS0MsS0FBTDtBQUNBQyxvQkFBUUMsR0FBUixDQUFZLEtBQUtOLE1BQWpCO0FBQ0g7OztnQ0FDTztBQUNKLGlCQUFLTyxJQUFMLENBQVUsQ0FBVjtBQUNBLGlCQUFLQSxJQUFMLENBQVUsQ0FBVjtBQUNBLG1CQUFPLEtBQUtOLEtBQUwsR0FBYSxLQUFLRixTQUFMLENBQWVTLE1BQW5DLEVBQTJDO0FBQ3ZDLG9CQUFJQyxJQUFJLHNCQUFSOztBQUVBQSxrQkFBRUMsT0FBRixHQUFhLEtBQUtILElBQUwsQ0FBVSxDQUFWLEVBQWEsQ0FBYixDQUFiLENBSHVDLENBR1I7QUFDL0JFLGtCQUFFRSxRQUFGLEdBQWEsR0FBR0MsTUFBSCxDQUFXLEtBQUtMLElBQUwsQ0FBVSxDQUFWLENBQVgsQ0FBYixDQUp1QyxDQUlDO0FBQ3hDRSxrQkFBRUksU0FBRixHQUFjLEdBQUdELE1BQUgsQ0FBVSxLQUFLTCxJQUFMLENBQVUsQ0FBVixDQUFWLENBQWQsQ0FMdUMsQ0FLQTtBQUN2Q0Usa0JBQUVLLFFBQUYsR0FBYSxHQUFHRixNQUFILENBQVUsS0FBS0wsSUFBTCxDQUFVLENBQVYsQ0FBVixDQUFiLENBTnVDLENBTUQ7QUFDdENFLGtCQUFFTSxJQUFGLEdBQVMsR0FBR0gsTUFBSCxDQUFVLEtBQUtMLElBQUwsQ0FBVSxLQUFLUyxVQUFMLENBQWdCUCxFQUFFRSxRQUFsQixDQUFWLENBQVYsQ0FBVCxDQVB1QyxDQU9xQjtBQUM1RCxxQkFBS1gsTUFBTCxDQUFZaUIsSUFBWixDQUFpQlIsQ0FBakI7QUFDQSxxQkFBS0YsSUFBTCxDQUFVLENBQVY7QUFDSDtBQUNKOzs7NkJBQ0lDLE0sRUFBUTtBQUNULGlCQUFLTixPQUFMLENBQWFNLE1BQWIsR0FBc0IsQ0FBdEI7QUFDQSxpQkFBSyxJQUFJVSxJQUFJLENBQWIsRUFBZ0JBLElBQUlWLE1BQXBCLEVBQTRCVSxHQUE1QixFQUFpQztBQUM3QjtBQUNBLHFCQUFLaEIsT0FBTCxDQUFhZSxJQUFiLENBQWtCLEtBQUtsQixTQUFMLENBQWUsS0FBS0UsS0FBcEIsQ0FBbEI7QUFDQSxxQkFBS0EsS0FBTCxJQUFjLENBQWQ7QUFDSDtBQUNELG1CQUFPLEtBQUtDLE9BQVo7QUFDSDs7O21DQUNVaUIsRyxFQUFLO0FBQ1osZ0JBQUlDLE9BQU8sRUFBWDtBQUNBQSxvQkFBU0QsSUFBSSxDQUFKLEVBQU9FLFFBQVAsQ0FBZ0IsRUFBaEIsRUFBb0JiLE1BQXBCLElBQThCLENBQTlCLEdBQWtDLE1BQU1XLElBQUksQ0FBSixFQUFPRSxRQUFQLENBQWdCLEVBQWhCLENBQXhDLEdBQThERixJQUFJLENBQUosRUFBT0UsUUFBUCxDQUFnQixFQUFoQixDQUF2RTtBQUNBRCxvQkFBU0QsSUFBSSxDQUFKLEVBQU9FLFFBQVAsQ0FBZ0IsRUFBaEIsRUFBb0JiLE1BQXBCLElBQThCLENBQTlCLEdBQWtDLE1BQU1XLElBQUksQ0FBSixFQUFPRSxRQUFQLENBQWdCLEVBQWhCLENBQXhDLEdBQThERixJQUFJLENBQUosRUFBT0UsUUFBUCxDQUFnQixFQUFoQixDQUF2RTtBQUNBRCxvQkFBU0QsSUFBSSxDQUFKLEVBQU9FLFFBQVAsQ0FBZ0IsRUFBaEIsRUFBb0JiLE1BQXBCLElBQThCLENBQTlCLEdBQWtDLE1BQU1XLElBQUksQ0FBSixFQUFPRSxRQUFQLENBQWdCLEVBQWhCLENBQXhDLEdBQThERixJQUFJLENBQUosRUFBT0UsUUFBUCxDQUFnQixFQUFoQixDQUF2RTtBQUNBLG1CQUFPQyxTQUFTRixJQUFULEVBQWUsRUFBZixDQUFQO0FBQ0g7Ozs7OztrQkFHVSxJQUFJdEIsUUFBSixFIiwiZmlsZSI6IjAuanMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgdGFnIGZyb20gJy4vZmx2VGFnLmpzJ1xuY2xhc3MgRmx2UGFyc2Uge1xuICAgIGNvbnN0cnVjdG9yKCkge1xuICAgICAgICB0aGlzLnRlbXBVaW50OCA9IFtdO1xuICAgICAgICB0aGlzLmFyclRhZyA9IFtdO1xuICAgICAgICB0aGlzLmluZGV4ID0gMDtcbiAgICAgICAgdGhpcy50ZW1wQXJyID0gW107XG4gICAgfVxuICAgIHNldEZsdih1aW50OCkge1xuICAgICAgICB0aGlzLnRlbXBVaW50OCA9IHVpbnQ4O1xuICAgICAgICB0aGlzLnBhcnNlKCk7XG4gICAgICAgIGNvbnNvbGUubG9nKHRoaXMuYXJyVGFnKVxuICAgIH1cbiAgICBwYXJzZSgpIHtcbiAgICAgICAgdGhpcy5yZWFkKDkpXG4gICAgICAgIHRoaXMucmVhZCg0KTtcbiAgICAgICAgd2hpbGUgKHRoaXMuaW5kZXggPCB0aGlzLnRlbXBVaW50OC5sZW5ndGgpIHtcbiAgICAgICAgICAgIGxldCB0ID0gbmV3IHRhZygpO1xuXG4gICAgICAgICAgICB0LnRhZ1R5cGUgPSAodGhpcy5yZWFkKDEpWzBdKTsgLy/lj5blh7p0YWfnsbvlnotcbiAgICAgICAgICAgIHQuZGF0YVNpemUgPSBbXS5jb25jYXQoKHRoaXMucmVhZCgzKSkpOyAvL+WPluWHuuWMheS9k+Wkp+Wwj1xuICAgICAgICAgICAgdC5UaW1lc3RhbXAgPSBbXS5jb25jYXQodGhpcy5yZWFkKDQpKTsgLy/lj5blh7rop6PnoIHml7bpl7RcbiAgICAgICAgICAgIHQuU3RyZWFtSUQgPSBbXS5jb25jYXQodGhpcy5yZWFkKDMpKTsgLy/lj5blh7pzdHJlYW0gaWRcbiAgICAgICAgICAgIHQuYm9keSA9IFtdLmNvbmNhdCh0aGlzLnJlYWQodGhpcy5nZXRCb2R5U3VtKHQuZGF0YVNpemUpKSk7IC8v5Y+W5Ye6c3RyZWFtIGlkXG4gICAgICAgICAgICB0aGlzLmFyclRhZy5wdXNoKHQpO1xuICAgICAgICAgICAgdGhpcy5yZWFkKDQpO1xuICAgICAgICB9XG4gICAgfVxuICAgIHJlYWQobGVuZ3RoKSB7XG4gICAgICAgIHRoaXMudGVtcEFyci5sZW5ndGggPSAwO1xuICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IGxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICAvLyBjb25zb2xlLmxvZyh0aGlzLnRlbXBVaW50OCk7XG4gICAgICAgICAgICB0aGlzLnRlbXBBcnIucHVzaCh0aGlzLnRlbXBVaW50OFt0aGlzLmluZGV4XSk7XG4gICAgICAgICAgICB0aGlzLmluZGV4ICs9IDE7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHRoaXMudGVtcEFycjtcbiAgICB9XG4gICAgZ2V0Qm9keVN1bShhcnIpIHtcbiAgICAgICAgbGV0IF9zdHIgPSBcIlwiO1xuICAgICAgICBfc3RyICs9IChhcnJbMF0udG9TdHJpbmcoMTYpLmxlbmd0aCA9PSAxID8gXCIwXCIgKyBhcnJbMF0udG9TdHJpbmcoMTYpIDogYXJyWzBdLnRvU3RyaW5nKDE2KSk7XG4gICAgICAgIF9zdHIgKz0gKGFyclsxXS50b1N0cmluZygxNikubGVuZ3RoID09IDEgPyBcIjBcIiArIGFyclsxXS50b1N0cmluZygxNikgOiBhcnJbMV0udG9TdHJpbmcoMTYpKTtcbiAgICAgICAgX3N0ciArPSAoYXJyWzJdLnRvU3RyaW5nKDE2KS5sZW5ndGggPT0gMSA/IFwiMFwiICsgYXJyWzJdLnRvU3RyaW5nKDE2KSA6IGFyclsyXS50b1N0cmluZygxNikpO1xuICAgICAgICByZXR1cm4gcGFyc2VJbnQoX3N0ciwgMTYpO1xuICAgIH1cblxufVxuZXhwb3J0IGRlZmF1bHQgbmV3IEZsdlBhcnNlKCk7XG5cblxuLy8gV0VCUEFDSyBGT09URVIgLy9cbi8vIC4vanMvZmx2L2ZsdlBhcnNlLmpzIl0sInNvdXJjZVJvb3QiOiIifQ==");

/***/ }),
/* 1 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
eval("\n\nObject.defineProperty(exports, \"__esModule\", {\n    value: true\n});\n\nfunction _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError(\"Cannot call a class as a function\"); } }\n\nvar FlvTag = function FlvTag() {\n    _classCallCheck(this, FlvTag);\n\n    this.tagType = -1;\n    this.dataSize = -1;\n    this.Timestamp = -1;\n    this.StreamID = -1;\n    this.body = -1;\n};\n\nexports.default = FlvTag;//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vLi9qcy9mbHYvZmx2VGFnLmpzPzg1OTgiXSwibmFtZXMiOlsiRmx2VGFnIiwidGFnVHlwZSIsImRhdGFTaXplIiwiVGltZXN0YW1wIiwiU3RyZWFtSUQiLCJib2R5Il0sIm1hcHBpbmdzIjoiOzs7Ozs7OztJQUFxQkEsTSxHQUNqQixrQkFBYztBQUFBOztBQUNWLFNBQUtDLE9BQUwsR0FBZSxDQUFDLENBQWhCO0FBQ0EsU0FBS0MsUUFBTCxHQUFnQixDQUFDLENBQWpCO0FBQ0EsU0FBS0MsU0FBTCxHQUFpQixDQUFDLENBQWxCO0FBQ0EsU0FBS0MsUUFBTCxHQUFnQixDQUFDLENBQWpCO0FBQ0EsU0FBS0MsSUFBTCxHQUFZLENBQUMsQ0FBYjtBQUNILEM7O2tCQVBnQkwsTSIsImZpbGUiOiIxLmpzIiwic291cmNlc0NvbnRlbnQiOlsiZXhwb3J0IGRlZmF1bHQgY2xhc3MgRmx2VGFnIHtcbiAgICBjb25zdHJ1Y3RvcigpIHtcbiAgICAgICAgdGhpcy50YWdUeXBlID0gLTE7XG4gICAgICAgIHRoaXMuZGF0YVNpemUgPSAtMTtcbiAgICAgICAgdGhpcy5UaW1lc3RhbXAgPSAtMTtcbiAgICAgICAgdGhpcy5TdHJlYW1JRCA9IC0xO1xuICAgICAgICB0aGlzLmJvZHkgPSAtMTtcbiAgICB9XG59XG5cblxuLy8gV0VCUEFDSyBGT09URVIgLy9cbi8vIC4vanMvZmx2L2ZsdlRhZy5qcyJdLCJzb3VyY2VSb290IjoiIn0=");

/***/ }),
/* 2 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
eval("\n\nvar _flvParse = __webpack_require__(0);\n\nvar _flvParse2 = _interopRequireDefault(_flvParse);\n\nfunction _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }\n\nwindow.flvParse = {\n    setFlv: function setFlv(uint8) {\n        _flvParse2.default.setFlv(uint8);\n    },\n    nextTag: function nextTag() {}\n};//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vLi9qcy9mbHZFbnRlci5qcz9iZGJiIl0sIm5hbWVzIjpbIndpbmRvdyIsImZsdlBhcnNlIiwic2V0Rmx2IiwidWludDgiLCJuZXh0VGFnIl0sIm1hcHBpbmdzIjoiOztBQUFBOzs7Ozs7QUFDQUEsT0FBT0MsUUFBUCxHQUFrQjtBQUNkQyxZQUFRLGdCQUFTQyxLQUFULEVBQWdCO0FBQ3BCLDJCQUFTRCxNQUFULENBQWdCQyxLQUFoQjtBQUNILEtBSGE7QUFJZEMsYUFBUyxtQkFBVyxDQUVuQjtBQU5hLENBQWxCIiwiZmlsZSI6IjIuanMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgZmx2cGFyc2UgZnJvbSAnLi9mbHYvZmx2UGFyc2UnXG53aW5kb3cuZmx2UGFyc2UgPSB7XG4gICAgc2V0Rmx2OiBmdW5jdGlvbih1aW50OCkge1xuICAgICAgICBmbHZwYXJzZS5zZXRGbHYodWludDgpO1xuICAgIH0sXG4gICAgbmV4dFRhZzogZnVuY3Rpb24oKSB7XG5cbiAgICB9XG59XG5cblxuLy8gV0VCUEFDSyBGT09URVIgLy9cbi8vIC4vanMvZmx2RW50ZXIuanMiXSwic291cmNlUm9vdCI6IiJ9");

/***/ })
/******/ ]);