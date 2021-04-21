import React, { ReactNode, Fragment, useEffect } from "react";
import type { AnalyticsJS } from "./analytics";
const SNIPPET_VERSION = "4.13.2";
/**
 * Determine whether analytics has already been installed
 * @returns true if analytics is installed, false otherwise
 */
function isInstalled() {
  const globalWindow = (window as unknown) as { analytics: any };
  if (!globalWindow.analytics) return false;
  if (!globalWindow.analytics.initialize && globalWindow.analytics.invoked)
    return true;
  return false;
}
/**
 * Retrieve the analytics object. Note that it throws if it has not yet been installed
 * @returns analytics object
 */
export function getAnalytics() {
  if (!isInstalled()) throw new Error("Analytics not installed");
  const globalWindow = (window as unknown) as { analytics: AnalyticsJS };
  return globalWindow.analytics;
}
/**
 * Download and install analytics.js
 * @param id Segment identifier from snippet
 */
export function install(id: string) {
  const globalWindow = (window as unknown) as { analytics: any };
  const analytics = (globalWindow.analytics = globalWindow.analytics || []);
  if (!analytics) throw new Error("analytics is null for some reason");
  if (isInstalled()) return;
  else {
    analytics.invoked = !0;
    analytics.methods = [
      "trackSubmit",
      "trackClick",
      "trackLink",
      "trackForm",
      "pageview",
      "identify",
      "reset",
      "group",
      "track",
      "ready",
      "alias",
      "debug",
      "page",
      "once",
      "off",
      "on",
      "addSourceMiddleware",
      "addIntegrationMiddleware",
      "setAnonymousId",
      "addDestinationMiddleware",
    ];
    analytics.factory = function (e: any) {
      return function (...args: any[]) {
        const t = Array.prototype.slice.call(args);
        t.unshift(e);
        analytics.push(t);
        return analytics;
      };
    };
    for (const key of analytics.methods) {
      analytics[key] = analytics.factory(key);
    }
    analytics.load = function (key: string, e: any) {
      const t = document.createElement("script");
      t.type = "text/javascript";
      t.async = !0;
      t.src = `https://cdn.segment.com/analytics.js/v1/${key}/analytics.min.js`;
      document.head.insertBefore(t, document.head.firstChild);
      analytics._loadOptions = e;
    };
    analytics._writeKey = id;
    analytics.SNIPPET_VERSION = SNIPPET_VERSION;
    analytics.load(id);
    analytics.page();
  }
}
/**
 * React Component to initialize analytics
 * @param props
 * @returns
 */
export function Segment(props: { id: string; children?: ReactNode }) {
  const { id, children } = props;
  useEffect(() => {
    install(id);
  }, []);
  return <Fragment>{children}</Fragment>;
}
/**
 * Use Analytics in context of a compoent
 * @returns analytics object
 */
export function useSegment() {
  const analytics = getAnalytics();
  return analytics;
}
