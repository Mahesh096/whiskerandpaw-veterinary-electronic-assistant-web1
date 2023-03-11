class Breed {
  constructor(client) {
    this.client = client;
  }

  getBreed(id) {
    return this.client.get(`/breeds/${id}`);
  }

  deleteBreed(id) {
    return this.client.delete(`/breeds/${id}`);
  }

  getAllBreeds() {
    return this.client.get('/breeds');
  }

  addBreed(payload) {
    return this.client.post('/breeds', payload);
  }

  editBreed(payload) {
    return this.client.put(`/breeds/${payload.id}`, {
      name: payload.name,
      specieId: payload.specieId,
    });
  }
}

export default Breed;
