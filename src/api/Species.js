class Species {
  constructor(client) {
    this.client = client;
  }

  getAllSpecies() {
    return this.client.get('/species');
  }

  addSpecie(payload) {
    return this.client.post('/species', payload);
  }

  editSpecie(payload) {
    return this.client.put(`/species/${payload.id}`, payload);
  }

  deleteSpecie(payload) {
    return this.client.delete(`/species/${payload.id}`, payload);
  }
}

export default Species;
