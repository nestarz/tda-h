const Account = () => import(/* webpackChunkName: "account" */ '@/views/Account');
const Projects = () => import(/* webpackChunkName: "projects" */ '@/views/projects/Projects');

export default [
  {
    path: '/',
    component: Account,
    meta: {
      requiresAuth: true,
    },
    children: [
      {
        path: '',
        name: 'Projects',
        component: Projects,
        meta: {
          title: 'Projects',
        },
      },
    ],
  },
];
