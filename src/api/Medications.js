class Medication {
  constructor(client) {
    this.client = client;
  }

  getMedication(id) {
    return this.client.get(`/medications/${id}`);
  }

  getMedicationCategory() {
    return this.client.get(`/category/medication`);
  }

  getMedicationRecommendations(payload) {
    return this.client.post('/medications/recommendations', payload);
  }

  getAllMedications() {
    return this.client.get('/medications/admin');
  }

  createMedication(payload) {
    return this.client.post('/medications/admin', payload);
  }

  editMedication(payload) {
    return this.client.put('/medications/admin', payload);
  }

  deleteMedication(payload) {
    return this.client.delete('/medications/admin', {
      params: {
        id: payload.id,
      },
    });
  }
}

export default Medication;
