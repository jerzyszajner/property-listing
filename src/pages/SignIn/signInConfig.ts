/* SignIn page configuration */
import type { PageHeaderConfig } from "@/types/pageHeader";
import type { Link } from "@/types/link";

export type SuccessMessageConfig = {
  title: string;
  message: string;
};

export const PAGE_HEADER_CONFIG: PageHeaderConfig = {
  title: "Sign In",
  subtitle: "Sign In to your account",
};

export const SUCCESS_MESSAGE: SuccessMessageConfig = {
  title: "Success!",
  message: "You have been successfully signed in. Welcome back!",
};

export const SIGN_IN_FORM_LINKS: Link[] = [
  {
    to: "/sign-up",
    label: "Don't have an account? Sign up",
  },
  {
    to: "/reset-password",
    label: "Forgot your password?",
  },
];
