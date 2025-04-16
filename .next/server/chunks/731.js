"use strict";
exports.id = 731;
exports.ids = [731];
exports.modules = {

/***/ 2718:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "Z": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(997);
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(6689);
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_1__);


function Heading({ tag  }) {
    return(/*#__PURE__*/ (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", {
        className: `${tag ? "pt-10 pb-4 sm:pt-24 sm:pb-20" : "py-12 sm:py-20"} w-full text-center relative`,
        children: [
            tag ? /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx(react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.Fragment, {
                children: /*#__PURE__*/ (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("h1", {
                    className: "text-3xl sm:text-4xl inline-block w-auto mx-auto mb-8 relative",
                    children: [
                        "Projects built with ",
                        /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx("b", {
                            children: tag
                        }),
                        /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx("img", {
                            className: "sqD w-8 sm:w-10 -top-6 -right-2 sm:-right-8 sm:-top-8 absolute",
                            src: "/static/doodles/hero/code.svg"
                        })
                    ]
                })
            }) : /*#__PURE__*/ (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("h1", {
                className: "text-4xl sm:text-6xl inline-block w-auto mx-auto mb-8 relative",
                children: [
                    "Projects",
                    /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx("img", {
                        className: "sqD w-10 -top-8 -right-8 absolute",
                        src: "/static/doodles/hero/code.svg"
                    })
                ]
            }),
            !tag && /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx("p", {
                className: "text-fun-gray text-xl sm:text-2xl max-w-3xl m-auto",
                children: "I've built cool apps and websites using anything from HTML to React (and even PHP!). Here are some of my favorite projects over the course of my journey."
            })
        ]
    }));
}
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (Heading);


/***/ }),

/***/ 1227:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {


// EXPORTS
__webpack_require__.d(__webpack_exports__, {
  "Z": () => (/* binding */ projects_Projects)
});

// EXTERNAL MODULE: external "react/jsx-runtime"
var jsx_runtime_ = __webpack_require__(997);
// EXTERNAL MODULE: external "react"
var external_react_ = __webpack_require__(6689);
// EXTERNAL MODULE: ./data/content/projects.ts
var projects = __webpack_require__(5653);
// EXTERNAL MODULE: ./node_modules/next/image.js
var next_image = __webpack_require__(5675);
// EXTERNAL MODULE: ./utils/utils.ts
var utils = __webpack_require__(6116);
// EXTERNAL MODULE: ./node_modules/next/link.js
var next_link = __webpack_require__(1664);
;// CONCATENATED MODULE: ./components/projects/ProjectCard.tsx





function ProjectCard({ project  }) {
    return(/*#__PURE__*/ (0,jsx_runtime_.jsxs)("div", {
        className: "max-w-sm mx-auto flex flex-col projects-center md:projects-start md:justify-center",
        children: [
            /*#__PURE__*/ jsx_runtime_.jsx("a", {
                href: project.link || project.github,
                target: "_blank",
                className: `w-full relative rounded-xl border-fun-gray border p-2 transition hover:-translate-y-2 hover:opacity-75 hover:border-fun-pink will-change-projectCard`,
                children: /*#__PURE__*/ jsx_runtime_.jsx("img", {
                    className: "w-full rounded-md",
                    src: project.img
                })
            }),
            /*#__PURE__*/ (0,jsx_runtime_.jsxs)("div", {
                className: "w-full mt-5",
                children: [
                    /*#__PURE__*/ (0,jsx_runtime_.jsxs)("div", {
                        className: "flex projects-center justify-between",
                        children: [
                            /*#__PURE__*/ jsx_runtime_.jsx("a", {
                                href: project.link || project.github,
                                target: "_blank",
                                children: /*#__PURE__*/ jsx_runtime_.jsx("h3", {
                                    className: "text-lg font-bold",
                                    children: project.title
                                })
                            }),
                            /*#__PURE__*/ (0,jsx_runtime_.jsxs)("div", {
                                className: "space-x-2",
                                children: [
                                    project.link && /*#__PURE__*/ jsx_runtime_.jsx("a", {
                                        href: project.link,
                                        target: "_blank",
                                        rel: "noreferrer",
                                        children: /*#__PURE__*/ jsx_runtime_.jsx(next_image["default"], {
                                            src: "/static/icons/external-link.svg",
                                            width: 16,
                                            height: 16,
                                            alt: "Link Icon"
                                        })
                                    }),
                                    project.github && /*#__PURE__*/ jsx_runtime_.jsx("a", {
                                        href: project.github,
                                        target: "_blank",
                                        rel: "noreferrer",
                                        children: /*#__PURE__*/ jsx_runtime_.jsx(next_image["default"], {
                                            src: "/static/icons/github.svg",
                                            width: 16,
                                            height: 16,
                                            alt: "Github Icon"
                                        })
                                    })
                                ]
                            })
                        ]
                    }),
                    /*#__PURE__*/ jsx_runtime_.jsx("p", {
                        className: "text-fun-gray text-left text-sm",
                        children: project.desc
                    }),
                    /*#__PURE__*/ jsx_runtime_.jsx("ul", {
                        className: "flex flex-wrap items-center mt-2 -ml-2 list-none",
                        children: project.tags.map((tag, index)=>{
                            return(/*#__PURE__*/ jsx_runtime_.jsx("li", {
                                children: /*#__PURE__*/ jsx_runtime_.jsx(next_link["default"], {
                                    href: `/projects/tag/${(0,utils/* kebabCase */.GL)(tag)}`,
                                    children: /*#__PURE__*/ jsx_runtime_.jsx("div", {
                                        className: "m-1 rounded-lg text-sm bg-fun-pink-dark py-1 px-2 cursor-pointer hover:opacity-75",
                                        children: tag
                                    })
                                })
                            }, tag));
                        })
                    })
                ]
            })
        ]
    }, project.id));
}
/* harmony default export */ const projects_ProjectCard = (ProjectCard);

;// CONCATENATED MODULE: ./components/projects/Projects.tsx




function Projects({ overwriteProjects  }) {
    const projectsList = overwriteProjects ? overwriteProjects : projects/* default */.ZP;
    return(/*#__PURE__*/ jsx_runtime_.jsx("div", {
        className: "grid grid-cols-1 gap-8 md:grid-cols-3 items-start",
        children: projectsList.map((item)=>{
            return(/*#__PURE__*/ jsx_runtime_.jsx(projects_ProjectCard, {
                project: item
            }, item.id));
        })
    }));
}
/* harmony default export */ const projects_Projects = (Projects);


/***/ }),

/***/ 5653:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "iF": () => (/* binding */ allTags),
/* harmony export */   "tD": () => (/* binding */ allKebabTags),
/* harmony export */   "ZP": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _utils_utils__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(6116);

const projects = [
    {
        id: 0,
        title: "Learn.TheYEI",
        desc: "All the resources you will need to get a boost into economics.",
        img: "/static/projects/yei-learn.png",
        link: "https://learn.theyei.org/",
        github: "https://github.com/braydentw/learn.theyei",
        tags: [
            "React",
            "NextJS",
            "TailwindCSS",
            "CSS",
            "Firebase"
        ]
    },
    {
        id: 1,
        title: "BuildFaster",
        desc: "Beautiful HTML templates ready-made for your next landing page.",
        img: "/static/projects/buildfaster.png",
        link: "https://buildfaster-io.vercel.app/",
        tags: [
            "HTML",
            "CSS",
            "Javascript",
            "Gumroad"
        ]
    },
    {
        id: 2,
        title: "React Emoji Search",
        desc: "1800+ emojis at your fingertips. Ready-to-use with just a simple copy+paste.",
        img: "/static/projects/react-emoji-search.png",
        link: "https://react-emoji-search.braydentw.vercel.app/",
        github: "https://github.com/braydentw/react-emoji-search",
        tags: [
            "React",
            "CSS",
            "JSON"
        ]
    },
    {
        id: 3,
        title: "BitcoinTemp",
        desc: "A fun way to check the price of bitcoin! Cloudy days, sunny days, and Bitcoin Storms!",
        img: "/static/projects/bitcointemp.png",
        link: "https://bitcointemp.com",
        tags: [
            "React",
            "NextJS",
            "SCSS",
            "API"
        ]
    },
    {
        id: 4,
        title: "Create HTML Boilerplate",
        desc: "Generate a vanilla HTML boilerplate in a flash!",
        img: "/static/projects/create-html-boilerplate.png",
        github: "https://github.com/BraydenTW/create-html-boilerplate",
        tags: [
            "Node",
            "Javascript",
            "NPM",
            "HTML"
        ]
    },
    {
        id: 5,
        title: "8 Ball in your CLI",
        desc: "An 8 ball simulation in your CLI built with Rust!",
        img: "/static/projects/8ball-rust.png",
        github: "https://github.com/BraydenTW/8ball-rust",
        tags: [
            "Rust",
            "CLI",
            "Game"
        ]
    },
    {
        id: 6,
        title: "DontLeaveMe 😭",
        desc: "Beg for users to stay on your website.",
        img: "/static/projects/dontleaveme.png",
        link: "https://github.com/BraydenTW/dontleaveme/",
        tags: [
            "Javascript",
            "NPM"
        ]
    },
    {
        id: 7,
        title: "Madlibs",
        desc: "A simple version of Madlibs built for the web!",
        img: "/static/projects/madlibs.png",
        link: "https://fillemin.netlify.app/",
        github: "https://github.com/braydentw/madlibs",
        tags: [
            "HTML",
            "CSS",
            "Javascript"
        ]
    }, 
];
const allTags = [];
projects.forEach((project)=>{
    project.tags.forEach((tag)=>!allTags.includes(tag) && allTags.push(tag)
    );
});
const allKebabTags = allTags.map((tag)=>(0,_utils_utils__WEBPACK_IMPORTED_MODULE_0__/* .kebabCase */ .GL)(tag)
);
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (projects);


/***/ }),

/***/ 6116:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "GL": () => (/* binding */ kebabCase),
/* harmony export */   "EP": () => (/* binding */ kebabArray),
/* harmony export */   "Uk": () => (/* binding */ randomNumberText)
/* harmony export */ });
const kebabCase = (str)=>str.replace(/([a-z])([A-Z])/g, "$1-$2").replace(/[\s_]+/g, "-").toLowerCase()
;
const kebabArray = (arr)=>arr.map((item)=>kebabCase(item)
    )
;
const randomNumberText = (finalNum, setNumber)=>{
    let count = 0;
    let newNum = "";
    const interval = setInterval(()=>{
        count++;
        for(let i = 0; i < finalNum.length; i++){
            newNum += Math.floor(Math.random() * 10);
        }
        setNumber(newNum);
        newNum = "";
        if (count === 20) {
            clearInterval(interval);
            setNumber("404");
        }
    }, 80);
};


/***/ })

};
;