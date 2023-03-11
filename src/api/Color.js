class Color {
  constructor(client) {
    this.client = client;
  }

  getColors() {
    return this.client.get(`/colors`);
  }

  addColor(payload) {
    return this.client.post('/colors', payload);
  }
}

export default Color;
