class Status {
  constructor(client) {
    this.client = client;
  }

  getAllStatuses() {
    return this.client.get(`/status`);
  }
}

export default Status;
