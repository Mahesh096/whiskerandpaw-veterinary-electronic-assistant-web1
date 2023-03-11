class Clinic {
  constructor(client) {
    this.client = client;
  }

  signup(userCredentials) {
    return this.client.post(`/organizations`, userCredentials);
  }

  getClinicInfo(id) {
    return this.client.get(`/clinics/${id}`);
  }

  getUserClinics() {
    return this.client.get(`/organizations`);
  }

  completeClinicSetup(payload) {
    return this.client.put(`/users/verify`, payload);
  }

  verifyClinicSignupToken(token) {
    return this.client.get(`/tokens/verify/${token}`);
  }

  getClinicExamination() {
    return this.client.get(`/clinic-exams`);
  }

  getClinicExaminationV2() {
    return this.client.get(`/differentials/category/all`);
  }

  updateClinic(id, payload) {
    return this.client.put(`/clinics/${id}`, payload);
  }

  getAvatar(id) {
    return this.client.get(`/clinics/${id}/avatar`);
  }

  updateAvatar(id) {
    return this.client.put(`/clinics/${id}/avatar`);
  }

  uploadAvatarS3(url, payload) {
    return this.client.put(url, payload, {
      'Content-Type': 'multipart/form-data',
    });
  }

  payments(payload) {
    return this.client.post(`/payments`, payload);
  }
}

export default Clinic;
