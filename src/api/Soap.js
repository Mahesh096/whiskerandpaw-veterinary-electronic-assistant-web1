class Soap {
  constructor(client) {
    this.client = client;
  }

  getAllSoapConnections() {
    return this.client.get('/soap/rules');
  }

  getAllSoapRuleData(rule_code) {
    return this.client.get(`/soap/rule?rule_code=${rule_code}`);
  }

  createAdminSoapConnection(payload) {
    return this.client.post('/soap/rule', payload);
  }

  editAdminSoapConnection(payload) {
    return this.client.put('/soap/rule', payload);
  }

  deleteAdminSoapConnection(payload) {
    return this.client.delete(`/soap/rule?rule_code=${payload.rule_code}`);
  }
}

export default Soap;
