class Gender {
  constructor(client) {
    this.client = client;
  }

  getAllGenders() {
    return this.client.get(`/genders`);
  }

  addGender(payload) {
    return this.client.post(`/genders`, payload);
  }

  editGender(id, payload) {
    return this.client.put(`/genders/${id}`, payload);
  }

  getGenderDetails(id) {
    return this.client.get(`/genders/${id}`);
  }

  deleteGender(id) {
    return this.client.delete(`/genders/${id}`);
  }
}

export default Gender;
