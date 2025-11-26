/* SignUp page configuration */
export type PageHeaderConfig = {
  title: string;
  subtitle: string;
};

export type SuccessMessageConfig = {
  title: string;
  message: string;
};

export const PAGE_HEADER_CONFIG: PageHeaderConfig = {
  title: "Sign Up",
  subtitle: "Create your account",
};

export const SUCCESS_MESSAGE: SuccessMessageConfig = {
  title: "Success!",
  message:
    "Account created successfully! Please check your email to verify your account.",
};
