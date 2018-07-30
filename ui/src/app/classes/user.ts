export class User {
  username: string;
  password: string;
  email: string;
  id: string;
  token: string;
  constructor() {
    this.id = '';
    this.token = '';
    this.username = '';
    this.password = '';
    this.email = '';
  }
}
