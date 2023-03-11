class Users {
  constructor(client) {
    this.client = client;
  }

  inviteUser(payload) {
    return this.client.post(`/invite`, payload);
  }

  verifyUser(payload) {
    return this.client.post(`/verify/${payload.token}`, {
      password: payload.password,
    });
  }

  getAllUsers() {
    return this.client.get('/users');
  }
}

export default Users;
