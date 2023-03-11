class Vaccine {
  constructor(client) {
    this.client = client;
  }

  getVaccine(id) {
    return this.client.get(`/Vaccines/${id}`);
  }

  getAllVaccines() {
    return this.client.get('/vaccines');
  }

  getVaccineCategories() {
    return this.client.get('/vaccine-categories');
  }

  addVaccine(payload) {
    return this.client.post(`/vaccines`, payload);
  }

  editVaccine(payload) {
    return this.client.put(`/vaccines/${payload.id}`, {
      name: payload.name,
      category: payload.category,
    });
  }

  deleteVaccine(id) {
    return this.client.delete(`/vaccines/${id}`);
  }
}

export default Vaccine;
