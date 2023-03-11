class Differentials {
  constructor(client) {
    this.client = client;
  }

  getAllDifferentials() {
    return this.client.get('/differentials');
  }

  getDifferential(id) {
    return this.client.get(`/differentials/${id}`);
  }

  getDifferentialCategory() {
    return this.client.get('/differentialcategory');
  }

  getSOAPCases() {
    return this.client.get('/maincategory');
  }

  createDifferential(payload) {
    return this.client.post('/differentials', payload);
  }

  deleteDifferential(id) {
    return this.client.delete(`/differentials?id=${id}`);
  }

  editDifferential(payload) {
    return this.client.put('/differentials', payload);
  }
}

export default Differentials;
