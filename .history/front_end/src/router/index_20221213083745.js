import Vue from "vue";
import VueRouter from "vue-router";
Vue.use(VueRouter);

const routes = [
  {
    path: "/debug",
    name: "debug",
    component: () => import("../views/debug.vue"),
  },
  {
    path: "/",
    name: "home",
    component: () => import("../views/UserRoot.vue"),
    children: [
      {
        path: "/FirstPage",
        name: "FirstPage",
        component: () => import("../views/User/FirstPage.vue"),
      },
      {
        path: "/PaperInformation/:paper_id",
        name: "PaperInformation",
        component: () => import("../views/User/PaperInformation.vue"),
      },
      {
        path: "/MasterInformation",
        name: "MasterInformation",
        component: () => import("../views/User/MasterInformation.vue"),
      },
      {
        path: "/PersonalInformation/:id",
        name: "PersonalInformation",
        component: () => import("../views/User/PersonalInformation.vue"),
      },
      {
        path: "/PersonalInformation",
        name: "PersonalInformation",
        component: () => import("../views/User/PersonalInformation.vue"),
      },
      {
        path: "/SearchInformation",
        name: "SearchInformation",
        component: () => import("../views/User/SearchInformation.vue"),
      },
      {
        path:"/SearchAuthor",
        name: "SearchAuthor",
        component: () => import("../views/User/SearchAuthor.vue"),
      },
      {
        path: "/login",
        name: "login",
        component: () => import("../views/User/login.vue"),
      },
      {
        path: '/forgetPassword',
        name: '/forgetPassword',
        component: () => import( '../views/User/Forget.vue')
      },
      {
        path: '/NoteInformation/:note_id',
        name: 'NoteInformation',
        component: () => import( '../views/User/NoteInformation.vue')
      },
      {
        path: "/register",
        name: "register",
        component: () => import("../views/User/register.vue"),
      },
      {
        path: "/NoteInformation/:note_id",
        name: "NoteInformation",
        component: () => import("../views/User/NoteInformation.vue"),
      },
      {
        path: "/manage",
        name: "Manage",
        component: () => import("../views/Manager/index"),
        children: [
          //  Cards
          {
            path: "/literature",
            name: "literatureCard",
            component: () =>
              import("../views/Manager/Cards/LiteratureCard.vue"),
          },
          {
            path: "/note",
            name: "noteCard",
            component: () => import("../views/Manager/Cards/NoteCard.vue"),
          },
          {
            path: "/repre",
            name: "repreCard",
            component: () => import("../views/Manager/Cards/RepreCard.vue"),
          },
          {
            path: "/identity/:src",
            name: "identyCard",
            component: () => import("../views/Manager/Cards/IdentityCard.vue"),
          },
          //  Views
          {
            path: "/manageScholar",
            name: "manageScholar",
            component: () => import("../views/Manager/ManageScholar"),
          },
          {
            path: "/auditRepresentation",
            name: "auditRepresentation",
            component: () => import("../views/Manager/AuditRepresentation"),
          },
          {
            path: "/auditIdentity",
            name: "auditIdentity",
            component: () => import("../views/Manager/AuditIdentity"),
          },
          {
            path: "/auditLack",
            name: "auditLack",
            component: () => import("../views/Manager/AuditLack"),
          },
          {
            path: "/auditComments",
            name: "auditComments",
            component: () => import("../views/Manager/AuditComments"),
          },
          {
            path: "/auditNote",
            name: "auditNote",
            component: () => import("../views/Manager/AuditNote"),
          },
          {
            path: "/auditLiterature",
            name: "auditLiterature",
            component: () => import("../views/Manager/AuditLiterature"),
          },
          {
            path: "/importLiterature",
            name: "importLiterature",
            component: () => import("../views/Manager/ImportLiterature"),
          },
        ],
      },
    ],
  },
  {
    path: "/about",
    name: "about",
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import("../views/AboutView.vue"),
  },
  {
    path: "/manage",
    name: "Manage",
    component: () => import("../views/Manager/index"),
    children: [
      {
        path: "/manageScholar",
        name: "manageScholar",
        component: () => import("../views/Manager/ManageScholar"),
      },
      {
        path: "/auditRepresentation",
        name: "auditRepresentation",
        component: () => import("../views/Manager/AuditRepresentation"),
      },
      {
        path: "/auditIdentity",
        name: "auditIdentity",
        component: () => import("../views/Manager/AuditIdentity"),
      },
      {
        path: "/auditLack",
        name: "auditLack",
        component: () => import("../views/Manager/AuditLack"),
      },
      {
        path: "/auditComments",
        name: "auditComments",
        component: () => import("../views/Manager/AuditComments"),
      },
      {
        path: "/auditNote",
        name: "auditNote",
        component: () => import("../views/Manager/AuditNote"),
      },
      {
        path: "/auditLiterature",
        name: "auditLiterature",
        component: () => import("../views/Manager/AuditLiterature"),
      },
      {
        path: "/importLiterature",
        name: "importLiterature",
        component: () => import("../views/Manager/ImportLiterature"),
      },
    ],
  },
];

const router = new VueRouter({
  mode: "history",
  base: process.env.BASE_URL,
  routes,
});

// router.beforeEach((to, from, next) => {
//   const islogin = sessionStorage.getItem("token");
//   if (to.name === "/register" || to.path === "/login") {
//     if (islogin) {
//       next({ path: "/FirstPage" });
//     }else{
//       next();
//     }
//   }
// })

export default router;
