// @ts-nocheck
import React from 'react';
import { ApplyPluginsType } from '/Users/heyunfei/Desktop/yunfei_workspace/TrunkFace/node_modules/umi/node_modules/@umijs/runtime';
import * as umiExports from './umiExports';
import { plugin } from './plugin';

export function getRoutes() {
  const routes = [
  {
    "path": "/Login",
    "component": require('/Users/heyunfei/Desktop/yunfei_workspace/TrunkFace/src/pages/Login').default,
    "exact": true
  },
  {
    "path": "/",
    "component": require('/Users/heyunfei/Desktop/yunfei_workspace/TrunkFace/src/layouts').default,
    "wrappers": [require('/Users/heyunfei/Desktop/yunfei_workspace/TrunkFace/src/pages/Authorized').default],
    "routes": [
      {
        "path": "/Admin",
        "component": require('/Users/heyunfei/Desktop/yunfei_workspace/TrunkFace/src/pages/Admin').default,
        "exact": true
      },
      {
        "path": "/Admin/vehicles",
        "component": require('/Users/heyunfei/Desktop/yunfei_workspace/TrunkFace/src/pages/Admin/Vehicles').default,
        "exact": true
      },
      {
        "path": "/Admin/faults",
        "component": require('/Users/heyunfei/Desktop/yunfei_workspace/TrunkFace/src/pages/Admin/Faults').default,
        "exact": true
      },
      {
        "path": "/Admin/upgrade",
        "component": require('/Users/heyunfei/Desktop/yunfei_workspace/TrunkFace/src/pages/Admin/Upgrade').default,
        "exact": true
      },
      {
        "path": "/Admin/version",
        "component": require('/Users/heyunfei/Desktop/yunfei_workspace/TrunkFace/src/pages/Admin/Version').default,
        "exact": true
      },
      {
        "path": "/Admin/moduleConfig",
        "component": require('/Users/heyunfei/Desktop/yunfei_workspace/TrunkFace/src/pages/Admin/ModuleConfig').default,
        "exact": true
      },
      {
        "path": "/Admin/mail",
        "component": require('/Users/heyunfei/Desktop/yunfei_workspace/TrunkFace/src/pages/Admin/Mail').default,
        "exact": true
      },
      {
        "path": "/Admin/mapTool",
        "component": require('/Users/heyunfei/Desktop/yunfei_workspace/TrunkFace/src/pages/Admin/MapTool').default,
        "exact": true
      },
      {
        "path": "/Admin/help",
        "component": require('/Users/heyunfei/Desktop/yunfei_workspace/TrunkFace/src/pages/Admin/Help').default,
        "exact": true
      },
      {
        "path": "/TrunkMonitor",
        "component": require('/Users/heyunfei/Desktop/yunfei_workspace/TrunkFace/src/pages/TrunkMonitor').default,
        "exact": true
      },
      {
        "path": "/TrunkDev",
        "component": require('/Users/heyunfei/Desktop/yunfei_workspace/TrunkFace/src/pages/TrunkDev').default,
        "exact": true
      },
      {
        "path": "/CarDetail/:id",
        "component": require('/Users/heyunfei/Desktop/yunfei_workspace/TrunkFace/src/pages/TrunkDev/components/CarDetail').default,
        "exact": true
      },
      {
        "component": require('/Users/heyunfei/Desktop/yunfei_workspace/TrunkFace/src/layouts').default,
        "exact": true
      }
    ]
  }
];

  // allow user to extend routes
  plugin.applyPlugins({
    key: 'patchRoutes',
    type: ApplyPluginsType.event,
    args: { routes },
  });

  return routes;
}
