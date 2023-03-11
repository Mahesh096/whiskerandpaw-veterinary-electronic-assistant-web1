class Treatment {
  constructor(client) {
    this.client = client;
  }

  getAllTreatments() {
    return this.client.get('/treatments');
  }

  getTreatmentCategory() {
    return this.client.get('/treatments/category');
  }

  getAllAdminTreatments() {
    return this.client.get('/treatments/admin');
  }

  getAllResultTypes() {
    return this.client.get('/resulttypes');
  }

  getTreatmentResultTypes(treatmentId) {
    return this.client.get(`/treatments/results?id=${treatmentId}`);
  }

  getResultReasons(result_type_id) {
    return this.client.get(`/soap/reasons?result_type_id=${result_type_id}`);
  }

  createAdminTreatment(payload) {
    return this.client.post('/treatments/admin', payload);
  }

  deleteTreatment(id) {
    return this.client.delete(`/treatments?id=${id}`);
  }

  editAdminTreatment(payload) {
    return this.client.put(`/treatments/admin`, payload);
  }
}

export default Treatment;
