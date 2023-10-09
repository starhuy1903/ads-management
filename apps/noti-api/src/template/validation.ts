// account_email_confirm_code
export const AccountEmailConfirmCodeTemplate = {
  type: 'object',
  properties: {
    fullname: {
      type: 'string',
    },
    link: {
      type: 'string',
    },
  },
  required: ['fullname', 'link'],
};

// change_password_request
export const ChangePasswordRequestTemplate = {
  type: 'object',
  properties: {
    fullname: {
      type: 'string',
    },
    link: {
      type: 'string',
    },
  },
  required: ['fullname', 'link'],
};

// confirm_register_account
export const ConfirmRegisterAccountTemplate = {
  type: 'object',
  properties: {
    fullname: {
      type: 'string',
    },
    email: {
      type: 'string',
    },
  },
  required: ['fullname', 'email'],
};
