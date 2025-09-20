import { defineStorage } from '@aws-amplify/backend';

export const storage = defineStorage({
  name: 'photos',
  access: (allow) => ({
    'public/*': [
      allow.guest.to(['read']),
    ],
  })
});