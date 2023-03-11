class PetParent {
  constructor(client) {
    this.client = client;
  }

  getPetParentDetails(id) {
    return this.client.get(`/pet-parents/${id}`);
  }

  getAllPetParents(id) {
    return this.client.get('/pet-parents', { params: { clinicId: id } });
  }

  addPetParent(payload) {
    return this.client.post('/pet-parents', payload);
  }

  editPetParent(id, payload) {
    return this.client.put(`/pet-parents/${id}`, payload);
  }

  deletePetParent(id) {
    return this.client.delete(`/pet-parents/${id}`);
  }
}

export default PetParent;
