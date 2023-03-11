class Auth {
  constructor(client) {
    this.client = client;
  }

  signin(userCredentials) {
    return this.client.post(`/auth/login`, userCredentials);
  }

  refresh(userCredentials) {
    return this.client.post(`/auth/login`, userCredentials);
  }
}

export default Auth;
