import { lazy } from "react";
import { Outlet, createHashRouter as createRouter } from "react-router-dom";
import {
  RouteSegmentElementLayout,
  RootErrorElement,
  RouteSegmentElement,
} from "@meta-ultra/app-router";

const router = createRouter([
  {
    element: (
      <RouteSegmentElement
        layout={RouteSegmentElementLayout.ROOT_LAYOUT}
        loading={undefined}
        error={undefined}
        notFound={undefined}
      >
        {lazy(() => import("./app/layout"))}
      </RouteSegmentElement>
    ),
    errorElement: <RootErrorElement notFound={undefined} />,
    children: [
      {
        id: "signin-signup-1",
        path: "signin-signup-1",
        element: (
          <RouteSegmentElement
            layout={RouteSegmentElementLayout.NO}
            loading={undefined}
            error={undefined}
            notFound={undefined}
          >
            {lazy(() => import("./app/signin-signup-1/page"))}
          </RouteSegmentElement>
        ),
      },
      {
        index: true,
        element: (
          <RouteSegmentElement
            layout={RouteSegmentElementLayout.NO}
            loading={undefined}
            error={undefined}
            notFound={undefined}
          >
            {lazy(() => import("./app/page"))}
          </RouteSegmentElement>
        ),
      },
    ],
  },
]);

export default router;
