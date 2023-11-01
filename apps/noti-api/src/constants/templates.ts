import {
  AccountEmailConfirmCodeTemplate,
  ChangePasswordRequestTemplate,
  ConfirmRegisterAccountTemplate,
} from '../template/validation';

export const TEMPLATES = [
  {
    name: 'account_email_confirm_code',
    subject: 'Mã xác nhận email tài khoản',
    validation: AccountEmailConfirmCodeTemplate,
  },
  {
    name: 'change_password_request',
    subject: 'Yêu cầu đổi mật khẩu tài khoản',
    validation: ChangePasswordRequestTemplate,
  },
  {
    name: 'confirm_register_account',
    subject: 'Xác nhận đăng ký tài khoản',
    validation: ConfirmRegisterAccountTemplate,
  },
];
