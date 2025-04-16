"use strict";
(() => {
var exports = {};
exports.id = 759;
exports.ids = [759];
exports.modules = {

/***/ 1207:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "getStaticPaths": () => (/* binding */ getStaticPaths),
/* harmony export */   "getStaticProps": () => (/* binding */ getStaticProps),
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(997);
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var components_utility_Page__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(3365);
/* harmony import */ var _data_content_projects__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(5653);
/* harmony import */ var _utils_utils__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(6116);
/* harmony import */ var components_projects_Projects__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(1227);
/* harmony import */ var components_projects_Heading__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(2718);
/* harmony import */ var next_link__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(1664);








const getStaticPaths = async ()=>{
    const allTags = [];
    _data_content_projects__WEBPACK_IMPORTED_MODULE_2__/* ["default"].forEach */ .ZP.forEach((project)=>project.tags.forEach((tag)=>{
            allTags.push(tag);
        })
    );
    const uniqueAllTags = [
        ...new Set(allTags)
    ];
    const allTagsPaths = uniqueAllTags.map((path)=>({
            params: {
                tag: `${(0,_utils_utils__WEBPACK_IMPORTED_MODULE_6__/* .kebabCase */ .GL)(path)}`
            }
        })
    );
    return {
        paths: allTagsPaths,
        fallback: false
    };
};
const getStaticProps = async ({ params  })=>{
    const tag = params.tag;
    const filteredProjects = _data_content_projects__WEBPACK_IMPORTED_MODULE_2__/* ["default"].filter */ .ZP.filter((project)=>[
            ...(0,_utils_utils__WEBPACK_IMPORTED_MODULE_6__/* .kebabArray */ .EP)(project.tags)
        ].includes(tag)
    );
    return {
        props: JSON.parse(JSON.stringify({
            filteredProjects,
            tag: tag
        }))
    };
};
function PostPage({ filteredProjects , tag  }) {
    const capsTag = _data_content_projects__WEBPACK_IMPORTED_MODULE_2__/* .allTags */ .iF[_data_content_projects__WEBPACK_IMPORTED_MODULE_2__/* .allKebabTags.indexOf */ .tD.indexOf(tag)];
    return(/*#__PURE__*/ (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)(components_utility_Page__WEBPACK_IMPORTED_MODULE_1__/* ["default"] */ .Z, {
        currentPage: "Projects",
        meta: {
            title: `${capsTag} Projects`,
            desc: `A showcase for all of my ${capsTag} projects.`
        },
        children: [
            /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx(components_projects_Heading__WEBPACK_IMPORTED_MODULE_4__/* ["default"] */ .Z, {
                tag: capsTag
            }),
            /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx(components_projects_Projects__WEBPACK_IMPORTED_MODULE_3__/* ["default"] */ .Z, {
                overwriteProjects: filteredProjects
            }),
            /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx(next_link__WEBPACK_IMPORTED_MODULE_5__["default"], {
                href: "/projects",
                children: /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx("div", {
                    className: "mt-8 max-w-sm md:max-w-2xl border border-fun-pink mx-auto text-center w-full whitespace-nowrap px-8 py-3 rounded-full text-fun-pink bg-fun-pink-darkerer hover:bg-fun-pink hover:text-white transition-colors cursor-pointer",
                    children: "View All"
                })
            })
        ]
    }));
}
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (PostPage);


/***/ }),

/***/ 562:
/***/ ((module) => {

module.exports = require("next/dist/server/denormalize-page-path.js");

/***/ }),

/***/ 8028:
/***/ ((module) => {

module.exports = require("next/dist/server/image-config.js");

/***/ }),

/***/ 4957:
/***/ ((module) => {

module.exports = require("next/dist/shared/lib/head.js");

/***/ }),

/***/ 4014:
/***/ ((module) => {

module.exports = require("next/dist/shared/lib/i18n/normalize-locale-path.js");

/***/ }),

/***/ 8020:
/***/ ((module) => {

module.exports = require("next/dist/shared/lib/mitt.js");

/***/ }),

/***/ 4964:
/***/ ((module) => {

module.exports = require("next/dist/shared/lib/router-context.js");

/***/ }),

/***/ 9565:
/***/ ((module) => {

module.exports = require("next/dist/shared/lib/router/utils/get-asset-path-from-route.js");

/***/ }),

/***/ 4365:
/***/ ((module) => {

module.exports = require("next/dist/shared/lib/router/utils/get-middleware-regex.js");

/***/ }),

/***/ 1428:
/***/ ((module) => {

module.exports = require("next/dist/shared/lib/router/utils/is-dynamic.js");

/***/ }),

/***/ 1292:
/***/ ((module) => {

module.exports = require("next/dist/shared/lib/router/utils/parse-relative-url.js");

/***/ }),

/***/ 979:
/***/ ((module) => {

module.exports = require("next/dist/shared/lib/router/utils/querystring.js");

/***/ }),

/***/ 6052:
/***/ ((module) => {

module.exports = require("next/dist/shared/lib/router/utils/resolve-rewrites.js");

/***/ }),

/***/ 4226:
/***/ ((module) => {

module.exports = require("next/dist/shared/lib/router/utils/route-matcher.js");

/***/ }),

/***/ 5052:
/***/ ((module) => {

module.exports = require("next/dist/shared/lib/router/utils/route-regex.js");

/***/ }),

/***/ 3018:
/***/ ((module) => {

module.exports = require("next/dist/shared/lib/to-base-64.js");

/***/ }),

/***/ 9232:
/***/ ((module) => {

module.exports = require("next/dist/shared/lib/utils.js");

/***/ }),

/***/ 968:
/***/ ((module) => {

module.exports = require("next/head");

/***/ }),

/***/ 6689:
/***/ ((module) => {

module.exports = require("react");

/***/ }),

/***/ 997:
/***/ ((module) => {

module.exports = require("react/jsx-runtime");

/***/ })

};
;

// load runtime
var __webpack_require__ = require("../../../webpack-runtime.js");
__webpack_require__.C(exports);
var __webpack_exec__ = (moduleId) => (__webpack_require__(__webpack_require__.s = moduleId))
var __webpack_exports__ = __webpack_require__.X(0, [730,664,675,365,731], () => (__webpack_exec__(1207)));
module.exports = __webpack_exports__;

})();