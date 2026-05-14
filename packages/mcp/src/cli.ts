#!/usr/bin/env node
/**
 * Minimal stdio entrypoint using the **global** `getSemanticRegistry()` singleton.
 * Real integrations should import `connectSynqelMcpStdio` and pass a configured registry instead.
 */
import { getSemanticRegistry } from "@synqel/sdk";
import { connectSynqelMcpStdio } from "./index.js";

await connectSynqelMcpStdio(getSemanticRegistry());
