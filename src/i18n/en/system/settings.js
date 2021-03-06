export default {
  navItem: {
    label: 'Settings',

  },

  editor: {
    title: 'System settings',

    auth: {
      title: 'Authentication',

      internal: {
        title: 'Internal',
        enabled: 'Internal authentication enabled',
        'password-reset': {
          enabled: 'Password reset enabled',
        },
        signup: {
          enabled: 'Signup enabled',
          'email-confirmation-required': 'Signup email confirmation required',
        },
      },

      mfa: {
        title: 'Multi-factor authentication',
        emailOTP: {
          enabled: 'Allow users to use one-time-password over email',
          enforced: 'Force users to use one-time-password over email',
          expires: {
            label: 'Valid for',
            description: 'How long will password be valid before it expires.',
          },
        },

        TOTP: {
          enabled: 'Allow users to use time based one-time-password',
          enforced: 'Force users to use one-time-password over email',
          issuer: {
            label: 'Issuer',
            description: 'Issuer name will be send to authenticator app when user configures it.',
          },
        },
      },

      mail: {
        title: 'Mail',
        'from-address': 'Sender address',
        'from-name': 'Sender name',
        emailConfirmation: {
          title: 'Email Confirmation',
          subject: 'Subject',
          body: 'Body',
        },
        passwordReset: {
          title: 'Password Reset',
          subject: 'Subject',
          body: 'Body',
        },
      },
    },

    email: {
      title: 'Email',

      header: 'Header (EmailHeaderEn)',
      footer: 'Footer (EmailFooterEn)',
    },

    external: {
      title: 'External Authentication Providers',

      handle: 'Handle',
      external: 'External',
      enabled: 'Enable external authentication',
      'client-key': 'Client key',
      secret: 'Secret',
      issuer: 'OIDC Issuer URL',
      'provider-enabled': 'Enable this external authentication provider',
      oidc: 'OpenID Connect',
      google: 'Google',
      facebook: 'Facebook',
      github: 'GitHub',
      linkedin: 'LinkedIn',
    },
  },
}
