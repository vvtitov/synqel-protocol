module.exports = [
"[project]/apps/web/components/sidebar.tsx [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "Sidebar",
    ()=>Sidebar
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-dev-runtime.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/client/app-dir/link.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/navigation.js [app-ssr] (ecmascript)");
"use client";
;
;
;
const SECTIONS = [
    {
        title: "Getting Started",
        items: [
            {
                label: "Overview",
                href: "/docs"
            },
            {
                label: "Installation",
                href: "/docs#installation"
            },
            {
                label: "Quick Start",
                href: "/docs#quick-start"
            }
        ]
    },
    {
        title: "Protocol Spec",
        items: [
            {
                label: "Entities",
                href: "/docs/protocol#entities"
            },
            {
                label: "Actions",
                href: "/docs/protocol#actions"
            },
            {
                label: "Capabilities",
                href: "/docs/protocol#capabilities"
            },
            {
                label: "Workflows",
                href: "/docs/protocol#workflows"
            },
            {
                label: "Events",
                href: "/docs/events"
            },
            {
                label: "Policy",
                href: "/docs/policy"
            }
        ]
    },
    {
        title: "SDK Reference",
        items: [
            {
                label: "registerEntity",
                href: "/docs/sdk#registerEntity"
            },
            {
                label: "registerAction",
                href: "/docs/sdk#registerAction"
            },
            {
                label: "registerCapability",
                href: "/docs/sdk#registerCapability"
            },
            {
                label: "registerWorkflow",
                href: "/docs/sdk#registerWorkflow"
            },
            {
                label: "SemanticRegistry",
                href: "/docs/sdk#SemanticRegistry"
            },
            {
                label: "SemanticEventBus",
                href: "/docs/sdk#SemanticEventBus"
            },
            {
                label: "evaluatePolicy",
                href: "/docs/sdk#evaluatePolicy"
            },
            {
                label: "useSemanticRuntime",
                href: "/docs/sdk#useSemanticRuntime"
            },
            {
                label: "useSemanticEvents",
                href: "/docs/sdk#useSemanticEvents"
            }
        ]
    },
    {
        title: "Examples",
        items: [
            {
                label: "E-commerce",
                href: "/docs/examples#ecommerce"
            },
            {
                label: "Form completion",
                href: "/docs/examples#form"
            },
            {
                label: "Dashboard navigation",
                href: "/docs/examples#dashboard"
            }
        ]
    }
];
function Sidebar() {
    const pathname = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["usePathname"])();
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("aside", {
        className: "w-64 shrink-0 overflow-y-auto border-r py-6 pr-6 max-lg:hidden",
        style: {
            borderColor: "var(--color-border)"
        },
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("nav", {
            className: "flex flex-col gap-6",
            children: SECTIONS.map((section)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                            className: "mb-2 text-xs font-semibold uppercase tracking-wider",
                            style: {
                                color: "var(--color-text-muted)"
                            },
                            children: section.title
                        }, void 0, false, {
                            fileName: "[project]/apps/web/components/sidebar.tsx",
                            lineNumber: 63,
                            columnNumber: 13
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("ul", {
                            className: "flex flex-col gap-1",
                            children: section.items.map((item)=>{
                                const isActive = pathname === item.href || item.href !== "/docs" && pathname === item.href.split("#")[0];
                                return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("li", {
                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"], {
                                        href: item.href,
                                        className: "block rounded-md px-3 py-1.5 text-sm transition-colors",
                                        style: {
                                            color: isActive ? "var(--color-accent)" : "var(--color-text-secondary)",
                                            backgroundColor: isActive ? "var(--color-bg-secondary)" : "transparent"
                                        },
                                        children: item.label
                                    }, void 0, false, {
                                        fileName: "[project]/apps/web/components/sidebar.tsx",
                                        lineNumber: 77,
                                        columnNumber: 21
                                    }, this)
                                }, item.href, false, {
                                    fileName: "[project]/apps/web/components/sidebar.tsx",
                                    lineNumber: 76,
                                    columnNumber: 19
                                }, this);
                            })
                        }, void 0, false, {
                            fileName: "[project]/apps/web/components/sidebar.tsx",
                            lineNumber: 69,
                            columnNumber: 13
                        }, this)
                    ]
                }, section.title, true, {
                    fileName: "[project]/apps/web/components/sidebar.tsx",
                    lineNumber: 62,
                    columnNumber: 11
                }, this))
        }, void 0, false, {
            fileName: "[project]/apps/web/components/sidebar.tsx",
            lineNumber: 60,
            columnNumber: 7
        }, this)
    }, void 0, false, {
        fileName: "[project]/apps/web/components/sidebar.tsx",
        lineNumber: 59,
        columnNumber: 5
    }, this);
}
}),
"[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-dev-runtime.js [app-ssr] (ecmascript)", ((__turbopack_context__, module, exports) => {
"use strict";

module.exports = __turbopack_context__.r("[project]/node_modules/next/dist/server/route-modules/app-page/module.compiled.js [app-ssr] (ecmascript)").vendored['react-ssr'].ReactJsxDevRuntime; //# sourceMappingURL=react-jsx-dev-runtime.js.map
}),
"[project]/node_modules/next/navigation.js [app-ssr] (ecmascript)", ((__turbopack_context__, module, exports) => {

module.exports = __turbopack_context__.r("[project]/node_modules/next/dist/client/components/navigation.js [app-ssr] (ecmascript)");
}),
];

//# sourceMappingURL=_41d4cd76._.js.map