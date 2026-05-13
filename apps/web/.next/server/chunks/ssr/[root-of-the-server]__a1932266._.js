module.exports = [
"[project]/apps/web/.next-internal/server/app/docs/events/page/actions.js [app-rsc] (server actions loader, ecmascript)", ((__turbopack_context__, module, exports) => {

}),
"[project]/apps/web/app/layout.tsx [app-rsc] (ecmascript, Next.js Server Component)", ((__turbopack_context__) => {

__turbopack_context__.n(__turbopack_context__.i("[project]/apps/web/app/layout.tsx [app-rsc] (ecmascript)"));
}),
"[project]/apps/web/app/docs/layout.tsx [app-rsc] (ecmascript, Next.js Server Component)", ((__turbopack_context__) => {

__turbopack_context__.n(__turbopack_context__.i("[project]/apps/web/app/docs/layout.tsx [app-rsc] (ecmascript)"));
}),
"[project]/apps/web/app/docs/events/page.tsx [app-rsc] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>EventsPage
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/rsc/react-jsx-dev-runtime.js [app-rsc] (ecmascript)");
;
function EventsPage() {
    const categories = [
        {
            category: "semantic.entity",
            description: "Lifecycle events for entities registered in the semantic registry.",
            events: [
                {
                    kind: "semantic.entity.registered",
                    fires: "When registerEntity() is called",
                    payload: "{ type: \"entity:registered\"; entity: SemanticEntity }"
                },
                {
                    kind: "semantic.entity.queried",
                    fires: "When getEntity() finds an entity",
                    payload: "{ type: \"entity:queried\"; entityId: string }"
                },
                {
                    kind: "semantic.entity.updated",
                    fires: "When updateEntity() is called",
                    payload: "{ type: \"entity:updated\"; entity: SemanticEntity }"
                },
                {
                    kind: "semantic.entity.removed",
                    fires: "When removeEntity() succeeds",
                    payload: "{ type: \"entity:removed\"; entityId: string }"
                }
            ]
        },
        {
            category: "semantic.action",
            description: "Events for action registration, policy-gated execution, and results.",
            events: [
                {
                    kind: "semantic.action.attempt",
                    fires: "When an action execution is attempted (before policy evaluation)",
                    payload: "{ type: \"action:attempt\"; actionId: string; context: PolicyContext }"
                },
                {
                    kind: "semantic.action.result",
                    fires: "After policy evaluation — whether the action succeeded or was denied",
                    payload: "{ type: \"action:result\"; actionId: string; ok: boolean; message?: string }"
                },
                {
                    kind: "semantic.action.executed",
                    fires: "When an action passes policy and executes successfully",
                    payload: "{ type: \"action:executed\"; actionId: string }"
                }
            ]
        },
        {
            category: "semantic.workflow",
            description: "Events for workflow lifecycle — start, step progression, completion, and failure.",
            events: [
                {
                    kind: "semantic.workflow.started",
                    fires: "When a workflow execution begins",
                    payload: "{ type: \"workflow:started\"; workflowId: string }"
                },
                {
                    kind: "semantic.workflow.step",
                    fires: "When a workflow advances to the next step",
                    payload: "{ type: \"workflow:step\"; workflowId: string; stepIndex: number; stepId: string }"
                },
                {
                    kind: "semantic.workflow.completed",
                    fires: "When all steps in a workflow complete successfully",
                    payload: "{ type: \"workflow:completed\"; workflowId: string }"
                },
                {
                    kind: "semantic.workflow.failed",
                    fires: "When a workflow fails at any step",
                    payload: "{ type: \"workflow:failed\"; workflowId: string; error: string }"
                }
            ]
        },
        {
            category: "semantic.session",
            description: "Session-level events for tracking agent interaction boundaries.",
            events: [
                {
                    kind: "semantic.session.started",
                    fires: "When an AI agent session begins",
                    payload: "{ type: \"session:started\"; sessionId: string }"
                },
                {
                    kind: "semantic.session.ended",
                    fires: "When an AI agent session ends",
                    payload: "{ type: \"session:ended\"; sessionId: string }"
                },
                {
                    kind: "semantic.session.heartbeat",
                    fires: "Periodic signal that a session is still active",
                    payload: "N/A (taxonomy-only, not yet in RuntimeEvent union)"
                }
            ]
        },
        {
            category: "semantic.intent",
            description: "Events for tracking expressed user/agent intents through their lifecycle.",
            events: [
                {
                    kind: "semantic.intent.expressed",
                    fires: "When a user or agent expresses an intent (e.g. \"I want to check out\")",
                    payload: "{ type: \"intent:expressed\"; intentId: string; intent: string; metadata?: Record<string, unknown> }"
                },
                {
                    kind: "semantic.intent.resolved",
                    fires: "When an expressed intent is successfully fulfilled",
                    payload: "{ type: \"intent:resolved\"; intentId: string }"
                },
                {
                    kind: "semantic.intent.abandoned",
                    fires: "When an intent is abandoned before resolution",
                    payload: "{ type: \"intent:abandoned\"; intentId: string }"
                },
                {
                    kind: "semantic.intent.failed",
                    fires: "When an intent fails to resolve",
                    payload: "{ type: \"intent:failed\"; intentId: string; error: string }"
                }
            ]
        },
        {
            category: "semantic.policy",
            description: "Events for policy evaluation outcomes.",
            events: [
                {
                    kind: "semantic.policy.evaluated",
                    fires: "When a policy evaluation completes (allowed or denied)",
                    payload: "{ type: \"policy:evaluated\"; actionId: string; decision: PolicyDecision }"
                },
                {
                    kind: "semantic.policy.denied",
                    fires: "When a policy evaluation denies an action",
                    payload: "{ type: \"policy:denied\"; actionId: string; reason: string }"
                }
            ]
        }
    ];
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("article", {
        className: "max-w-3xl",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("h1", {
                className: "text-3xl font-bold tracking-tight",
                style: {
                    color: "var(--color-text-primary)"
                },
                children: "Event Taxonomy"
            }, void 0, false, {
                fileName: "[project]/apps/web/app/docs/events/page.tsx",
                lineNumber: 143,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                className: "mt-4 text-lg leading-relaxed",
                style: {
                    color: "var(--color-text-secondary)"
                },
                children: [
                    "Synqel Protocol defines ",
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("strong", {
                        children: "20 event kinds"
                    }, void 0, false, {
                        fileName: "[project]/apps/web/app/docs/events/page.tsx",
                        lineNumber: 153,
                        columnNumber: 33
                    }, this),
                    " across",
                    " ",
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("strong", {
                        children: "6 categories"
                    }, void 0, false, {
                        fileName: "[project]/apps/web/app/docs/events/page.tsx",
                        lineNumber: 154,
                        columnNumber: 9
                    }, this),
                    ". Every operation on the semantic registry emits a typed ",
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("code", {
                        style: {
                            color: "var(--color-accent)",
                            fontFamily: "var(--font-mono)",
                            fontSize: "0.875em"
                        },
                        children: "RuntimeEvent"
                    }, void 0, false, {
                        fileName: "[project]/apps/web/app/docs/events/page.tsx",
                        lineNumber: 155,
                        columnNumber: 23
                    }, this),
                    " ",
                    "that agents and observability tools can subscribe to."
                ]
            }, void 0, true, {
                fileName: "[project]/apps/web/app/docs/events/page.tsx",
                lineNumber: 149,
                columnNumber: 7
            }, this),
            categories.map((cat)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("section", {
                    className: "mt-12",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                            className: "text-2xl font-semibold",
                            style: {
                                color: "var(--color-text-primary)"
                            },
                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("code", {
                                style: {
                                    fontFamily: "var(--font-mono)"
                                },
                                children: cat.category
                            }, void 0, false, {
                                fileName: "[project]/apps/web/app/docs/events/page.tsx",
                                lineNumber: 165,
                                columnNumber: 13
                            }, this)
                        }, void 0, false, {
                            fileName: "[project]/apps/web/app/docs/events/page.tsx",
                            lineNumber: 161,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                            className: "mt-2 text-sm leading-relaxed",
                            style: {
                                color: "var(--color-text-secondary)"
                            },
                            children: cat.description
                        }, void 0, false, {
                            fileName: "[project]/apps/web/app/docs/events/page.tsx",
                            lineNumber: 167,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "mt-4 overflow-x-auto",
                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("table", {
                                className: "w-full text-sm",
                                style: {
                                    color: "var(--color-text-secondary)"
                                },
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("thead", {
                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("tr", {
                                            className: "border-b text-left",
                                            style: {
                                                borderColor: "var(--color-border)"
                                            },
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("th", {
                                                    className: "pb-3 pr-4 font-semibold",
                                                    style: {
                                                        color: "var(--color-text-primary)"
                                                    },
                                                    children: "Event Kind"
                                                }, void 0, false, {
                                                    fileName: "[project]/apps/web/app/docs/events/page.tsx",
                                                    lineNumber: 180,
                                                    columnNumber: 19
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("th", {
                                                    className: "pb-3 pr-4 font-semibold",
                                                    style: {
                                                        color: "var(--color-text-primary)"
                                                    },
                                                    children: "When it fires"
                                                }, void 0, false, {
                                                    fileName: "[project]/apps/web/app/docs/events/page.tsx",
                                                    lineNumber: 181,
                                                    columnNumber: 19
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("th", {
                                                    className: "pb-3 font-semibold",
                                                    style: {
                                                        color: "var(--color-text-primary)"
                                                    },
                                                    children: "Payload shape"
                                                }, void 0, false, {
                                                    fileName: "[project]/apps/web/app/docs/events/page.tsx",
                                                    lineNumber: 182,
                                                    columnNumber: 19
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/apps/web/app/docs/events/page.tsx",
                                            lineNumber: 176,
                                            columnNumber: 17
                                        }, this)
                                    }, void 0, false, {
                                        fileName: "[project]/apps/web/app/docs/events/page.tsx",
                                        lineNumber: 175,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("tbody", {
                                        children: cat.events.map((event)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("tr", {
                                                className: "border-b",
                                                style: {
                                                    borderColor: "var(--color-border)"
                                                },
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
                                                        className: "py-3 pr-4",
                                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("code", {
                                                            className: "text-xs",
                                                            style: {
                                                                color: "var(--color-accent)",
                                                                fontFamily: "var(--font-mono)"
                                                            },
                                                            children: event.kind
                                                        }, void 0, false, {
                                                            fileName: "[project]/apps/web/app/docs/events/page.tsx",
                                                            lineNumber: 193,
                                                            columnNumber: 23
                                                        }, this)
                                                    }, void 0, false, {
                                                        fileName: "[project]/apps/web/app/docs/events/page.tsx",
                                                        lineNumber: 192,
                                                        columnNumber: 21
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
                                                        className: "py-3 pr-4",
                                                        children: event.fires
                                                    }, void 0, false, {
                                                        fileName: "[project]/apps/web/app/docs/events/page.tsx",
                                                        lineNumber: 200,
                                                        columnNumber: 21
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
                                                        className: "py-3",
                                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("code", {
                                                            className: "text-xs",
                                                            style: {
                                                                fontFamily: "var(--font-mono)",
                                                                color: "var(--color-text-muted)"
                                                            },
                                                            children: event.payload
                                                        }, void 0, false, {
                                                            fileName: "[project]/apps/web/app/docs/events/page.tsx",
                                                            lineNumber: 202,
                                                            columnNumber: 23
                                                        }, this)
                                                    }, void 0, false, {
                                                        fileName: "[project]/apps/web/app/docs/events/page.tsx",
                                                        lineNumber: 201,
                                                        columnNumber: 21
                                                    }, this)
                                                ]
                                            }, event.kind, true, {
                                                fileName: "[project]/apps/web/app/docs/events/page.tsx",
                                                lineNumber: 187,
                                                columnNumber: 19
                                            }, this))
                                    }, void 0, false, {
                                        fileName: "[project]/apps/web/app/docs/events/page.tsx",
                                        lineNumber: 185,
                                        columnNumber: 15
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/apps/web/app/docs/events/page.tsx",
                                lineNumber: 174,
                                columnNumber: 13
                            }, this)
                        }, void 0, false, {
                            fileName: "[project]/apps/web/app/docs/events/page.tsx",
                            lineNumber: 173,
                            columnNumber: 11
                        }, this)
                    ]
                }, cat.category, true, {
                    fileName: "[project]/apps/web/app/docs/events/page.tsx",
                    lineNumber: 160,
                    columnNumber: 9
                }, this)),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("section", {
                className: "mt-12",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                        className: "text-2xl font-semibold",
                        style: {
                            color: "var(--color-text-primary)"
                        },
                        children: "Using the taxonomy in code"
                    }, void 0, false, {
                        fileName: "[project]/apps/web/app/docs/events/page.tsx",
                        lineNumber: 218,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                        className: "mt-3 text-sm leading-relaxed",
                        style: {
                            color: "var(--color-text-secondary)"
                        },
                        children: "The SDK exports type-safe utilities for working with event kinds:"
                    }, void 0, false, {
                        fileName: "[project]/apps/web/app/docs/events/page.tsx",
                        lineNumber: 224,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("ul", {
                        className: "mt-3 flex flex-col gap-2 text-sm",
                        style: {
                            color: "var(--color-text-secondary)"
                        },
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("li", {
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("code", {
                                        style: {
                                            fontFamily: "var(--font-mono)",
                                            color: "var(--color-accent)"
                                        },
                                        children: "EVENT_CATEGORIES"
                                    }, void 0, false, {
                                        fileName: "[project]/apps/web/app/docs/events/page.tsx",
                                        lineNumber: 232,
                                        columnNumber: 13
                                    }, this),
                                    " — readonly tuple of all 6 category strings"
                                ]
                            }, void 0, true, {
                                fileName: "[project]/apps/web/app/docs/events/page.tsx",
                                lineNumber: 231,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("li", {
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("code", {
                                        style: {
                                            fontFamily: "var(--font-mono)",
                                            color: "var(--color-accent)"
                                        },
                                        children: "EVENT_KINDS"
                                    }, void 0, false, {
                                        fileName: "[project]/apps/web/app/docs/events/page.tsx",
                                        lineNumber: 235,
                                        columnNumber: 13
                                    }, this),
                                    " — readonly tuple of all 20 event kind strings"
                                ]
                            }, void 0, true, {
                                fileName: "[project]/apps/web/app/docs/events/page.tsx",
                                lineNumber: 234,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("li", {
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("code", {
                                        style: {
                                            fontFamily: "var(--font-mono)",
                                            color: "var(--color-accent)"
                                        },
                                        children: "getCategoryFromKind(kind)"
                                    }, void 0, false, {
                                        fileName: "[project]/apps/web/app/docs/events/page.tsx",
                                        lineNumber: 238,
                                        columnNumber: 13
                                    }, this),
                                    " — extracts the category from an event kind"
                                ]
                            }, void 0, true, {
                                fileName: "[project]/apps/web/app/docs/events/page.tsx",
                                lineNumber: 237,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("li", {
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("code", {
                                        style: {
                                            fontFamily: "var(--font-mono)",
                                            color: "var(--color-accent)"
                                        },
                                        children: "isValidEventKind(kind)"
                                    }, void 0, false, {
                                        fileName: "[project]/apps/web/app/docs/events/page.tsx",
                                        lineNumber: 241,
                                        columnNumber: 13
                                    }, this),
                                    " — type guard that checks if a string is a valid event kind"
                                ]
                            }, void 0, true, {
                                fileName: "[project]/apps/web/app/docs/events/page.tsx",
                                lineNumber: 240,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/apps/web/app/docs/events/page.tsx",
                        lineNumber: 230,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/apps/web/app/docs/events/page.tsx",
                lineNumber: 217,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/apps/web/app/docs/events/page.tsx",
        lineNumber: 142,
        columnNumber: 5
    }, this);
}
}),
"[project]/apps/web/app/docs/events/page.tsx [app-rsc] (ecmascript, Next.js Server Component)", ((__turbopack_context__) => {

__turbopack_context__.n(__turbopack_context__.i("[project]/apps/web/app/docs/events/page.tsx [app-rsc] (ecmascript)"));
}),
"[externals]/next/dist/shared/lib/no-fallback-error.external.js [external] (next/dist/shared/lib/no-fallback-error.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/shared/lib/no-fallback-error.external.js", () => require("next/dist/shared/lib/no-fallback-error.external.js"));

module.exports = mod;
}),
];

//# sourceMappingURL=%5Broot-of-the-server%5D__a1932266._.js.map