module.exports = [
    {
        path: '/Login',
        component: './Login',
    },
    {
        path: '/Regist',
        component: './Regist',
    },
    {
        path: '/NoPermission',
        component: './NoPermission',
    },
    {
        path: '/LandingPage',
        component: './LandingPage',
    },
    {
        path: '/404',
        component: './404',
    },
    {
        path: '/',
        component: '../layouts',
        wrappers: ['./Authorized'],
        routes: [
            {
                path: '/Admin',
                component: './Admin',
            },
            {
                path: '/Admin/vehicles',
                component: './Admin/Vehicles',
            },
            {
                path: '/Admin/faults',
                component: './Admin/Faults',
            },
            {
                path: '/Admin/version',
                component: './Admin/Version',
            },
            {
                path: '/Admin/moduleConfig',
                component: './Admin/ModuleConfig',
            },
            {
                path: '/Admin/ModuleOperation',
                component: './Admin/ModuleOperation',
            },
            {
                path: '/Admin/mail',
                component: './Admin/Mail',
            },
            {
                path: '/Admin/mapTool',
                component: './Admin/MapTool',
            },
            {
                path: '/Admin/help',
                component: './Admin/Help',
            },
            {
                path: '/TrunkMonitor',
                component: './TrunkMonitor',
            },
            {
                path: '/TrunkDev',
                component: './TrunkDev',
            },
            {
                path: '/CarDetail/:id',
                component: './TrunkDev/components/CarDetail',
                root: 'CarDetail',
            },
            {
                path: '/Admin/CarPools',
                component: './Admin/CarPools',
            },
            {
                component: '../layouts',
            },
        ],
    },
];
