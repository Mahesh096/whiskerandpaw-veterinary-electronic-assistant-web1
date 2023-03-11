class Roles {
  constructor(client) {
    this.client = client;
  }

  getAllRoles() {
    return this.client.get(`/roles`);
  }

  getRolePermissions(roleId) {
    return this.client.get(`/roles/${roleId}`);
  }

  getAllPermissions() {
    return this.client.get('/permissions');
  }

  createPermission(payload) {
    return this.client.post('/permissions', payload);
  }

  createRole(payload) {
    return this.client.post(`/roles`, payload);
  }
}

export default Roles;
