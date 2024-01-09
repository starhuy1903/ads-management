import { v4 as uuidv4 } from 'uuid';
import { storage } from './storage';

export class AnonymousUser {
  private userUuid: string;

  constructor(userUuid: string) {
    this.userUuid = userUuid;
    storage.setItem('anonymousUser', userUuid);
  }

  getUserUuid() {
    return this.userUuid;
  }
}

let userUuid;
const savedUserUuid = storage.getItem('anonymousUser');
if (!savedUserUuid) {
  userUuid = uuidv4();
} else {
  userUuid = savedUserUuid;
}

const anonymousUser = new AnonymousUser(userUuid);

export default anonymousUser;
