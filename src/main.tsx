import { StrictMode } from "react";

import { createRoot } from "react-dom/client";

import { App } from "./app.tsx";
import "./main.css";
import "./vite-env.d.ts";

// oxlint-disable-next-line typescript/no-non-null-assertion
createRoot(document.querySelector("#root")!).render(
	<StrictMode>
		<App />
	</StrictMode>,
);
