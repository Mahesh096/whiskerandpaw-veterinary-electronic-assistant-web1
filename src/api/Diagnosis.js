class Diagnosis {
  constructor(client) {
    this.client = client;
  }

  getAllDiagnosis() {
    return this.client.get('/diagnosis/clinic');
  }

  getAllDifferentials() {
    return this.client.get('/differentials');
  }

  getDifferentialCategory() {
    return this.client.get('/maincategory');
  }

  getAllDiagnosisAdmin() {
    return this.client.get('/diagnosis/admin');
  }

  createAdminDiagnosis(payload) {
    return this.client.post('/diagnosis/admin', payload);
  }

  editDiagnosis(payload) {
    return this.client.put(`/diagnosis/clinic`, payload);
  }

  editAdminDiagnosis(payload) {
    return this.client.put(`/diagnosis/admin`, payload);
  }

  deleteAdminDiagnosis(payload) {
    return this.client.delete(`/diagnosis/admin`, {
      params: {
        id: payload.id,
      },
    });
  }

  getDiagnosisCategory() {
    return this.client.get('/category/diagnosis');
  }
}

export default Diagnosis;
