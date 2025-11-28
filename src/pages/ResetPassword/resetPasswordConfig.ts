/* ResetPassword page configuration */
export type PageHeaderConfig = {
  title: string;
  subtitle: string;
};

export type SuccessMessageConfig = {
  title: string;
  message: string;
};

export const PAGE_HEADER_CONFIG: PageHeaderConfig = {
  title: "Reset Password",
  subtitle: "Enter your email to reset your password",
};

export const SUCCESS_MESSAGE: SuccessMessageConfig = {
  title: "Success!",
  message:
    "Password reset link sent! Please check your email and click the link to reset your password.",
};
