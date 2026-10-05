import { mount } from "svelte";
import App from "./App.svelte";
import "./styles.css";

const appRoot = document.querySelector<HTMLDivElement>("#app");
if (!appRoot) throw new Error("App root was not found.");

mount(App, { target: appRoot });
