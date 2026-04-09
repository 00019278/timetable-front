import HomeLayout from '../layouts/default.vue'
import Landing from '../pages/Landing/index.vue'
import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'index',
      component: Landing,
    },

    {
      path: '/login',
      name: 'LoginLayout',
      component: () => import('@/pages/Login/index.vue'),
    },

    {
      path: '/home',
      name: 'HomeLayout',
      component: HomeLayout,

      children: [
        {
          path: "organization",
          name: "Organization",
          meta: {
            title: "sidebar.school",
          },
          component: () => import("@/pages/Organization/index.vue"),
        },

        {
          path: "classes",
          name: "Classes",
          meta: {
            title: "sidebar.classes",
          },
          component: () => import("@/pages/Classes/index.vue"),
        },

        {
          path: "teachers",
          name: "Teachers",
          meta: {
            title: "sidebar.teachers",
          },
          component: () => import("@/pages/Teachers/index.vue"),
        },

        {
          path: "subjects",
          name: "Subjects",
          meta: {
            title: "sidebar.subjects",
          },
          component: () => import("@/pages/Subjects/index.vue"),
        },

        {
          path: "lessons",
          name: "Lessons",
          meta: {
            title: "sidebar.lessons",
          },
          component: () => import("@/pages/Lessons/index.vue"),
        },

        {
          path: "rooms",
          name: "Rooms",
          meta: {
            title: "sidebar.rooms",
          },
          component: () => import("@/pages/Rooms/index.vue"),
        },

        {
          path: "templates",
          name: "Templates",
          meta: {
            title: "sidebar.templates",
          },
          component: () => import("@/pages/Templates/index.vue"),
        },

        {
          path: "timetables",
          name: "Timetables",
          meta: {
            title: "sidebar.timetables",
          },
          component: () => import("@/pages/Timetables/index.vue"),
        },

        {
          path: "profile",
          name: "Profile",
          meta: {
            title: "header.profile",
          },
          component: () => import("@/pages/Profile/index.vue"),
        },

        {
          path: "settings",
          name: "Settings",
          meta: {
            title: "sidebar.settings",
          },
          component: () => import("@/pages/Settings/index.vue"),
        },
      ]
    },

    {
      path: "/:pathMatch(.*)*",
      redirect: "/home",
    },
  ],
})

export default router
