const Account = () => import(/* webpackChunkName: "account" */ '@/views/Account');
const Profile = () => import(/* webpackChunkName: "account" */ '@/views/account/Profile');
const Settings = () => import(/* webpackChunkName: "account" */ '@/views/account/Settings');

export default [
  {
    path: '/account',
    component: Account,
    meta: {
      requiresAuth: true,
    },
    children: [
      {
        path: '',
        name: 'Profile',
        component: Profile,
        meta: {
          title: 'Profile',
        },
      },
      {
        path: 'settings',
        name: 'Settings',
        component: Settings,
        meta: {
          title: 'Settings',
        },
      },
    ],
  },
];
