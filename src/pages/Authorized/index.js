import React from 'react';
import { Redirect } from 'umi';
import { setRootFilter } from 'utils/resize';
import routerMap from '../../config/router';
// 1. 判断是否是有效路由       true => 判断登录    false => push('404')
// 2. 判断登录               true => 判断权限     false => push('Login')
// 3. 判断权限               true => go()       false => push('noPermission')

const ROUTE_WITH_PARAM = ['/CarDetail']; // 需要路由传参的路由名称，需和权限管理后台中配置的路由名称相同；

const AuthRouter = (props) => {
    const isLogin = localStorage.getItem('token') ? true : false;
    const { pathname } = props.location;
    const root = document.getElementById('root');
    if (root && root.style.filter) {
        setRootFilter(false);
    }
    const isEffect = isEffectRouter(pathname);
    const hasPermission = isPermission(pathname);
    return isLogin ? (
        !isEffect ? (
            <Redirect to="/404"></Redirect>
        ) : !hasPermission ? (
            <Redirect to={{ pathname: '/NoPermission' }}></Redirect>
        ) : (
            <>{props.children}</>
        )
    ) : (
        <Redirect to="/Login"></Redirect>
    );
};
const isEffectRouter = (pathname) => {
    // const isSuperUser = localStorage.getItem('isSuperUser');
    let res = false;
    if (pathname === '/') return true;
    for (let i = 0; i < routerMap.length; i++) {
        // 判断是否是合法路由
        if (routerMap[i]?.routes?.length > 0) {
            const isEqual = routerMap[i].routes.some((route) => {
                return (
                    route.path === pathname || pathname.indexOf(route.root) > -1
                );
            });
            if (isEqual) {
                res = true;
                break;
            }
        } else if (routerMap[i].path === pathname) {
            res = true;
            break;
        }
    }
    return res;
};
const isPermission = (pathname) => {
    const isSuperUser = localStorage.getItem('isSuperUser');
    if (pathname === '/' || isSuperUser) return true;
    const token = localStorage.getItem('token');
    if (!token) return false;
    const rules = JSON.parse(localStorage.getItem('access')) || [];
    // 权限校验
    const isRouteWithParam = ROUTE_WITH_PARAM.some((route) => {
        return rules.includes(route) && pathname.indexOf(route) > -1;
    });
    return isRouteWithParam || rules.includes(pathname);
};

export default AuthRouter;
