class Pet {
  constructor(client) {
    this.client = client;
  }

  getPetDetails(id) {
    return this.client.get(`/pets/${id}`);
  }

  getAllPets(id) {
    return this.client.get('/pets', { params: { clinicId: id } });
  }

  addPet(payload) {
    return this.client.post('/pets', payload);
  }

  editPet(id, payload) {
    return this.client.put(`/Pets/${id}`, payload);
  }

  deletePet(id) {
    return this.client.delete(`/Pets/${id}`);
  }
}

export default Pet;
