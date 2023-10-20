import { Router } from "@vaadin/router";

const router = new Router(document.querySelector(".root"));
router.setRoutes([
  { path: "/", component: "home-page" },
  { path: "/report", component: "report-page" },
  { path: "/report/me", component: "my-report-page" },
  { path: "/report/edit", component: "report-edit-page" },
  { path: "/authorization", component: "auth-page" },
  { path: "/authorization/signIn", component: "signin-page" },
  { path: "/authorization/signup", component: "signup-page" },
  { path: "/profile", component: "profile-page" },
  { path: "/profile/me", component: "data-user-page" },
  { path: "/profile/password", component: "password-user-page" },
  { path: "/myReports", component: "" },
]);
