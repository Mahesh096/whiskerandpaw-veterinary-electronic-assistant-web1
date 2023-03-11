class Visitation {
  constructor(client) {
    this.client = client;
  }

  getAllVisitaions() {
    return this.client.get('/visitations');
  }

  getAllVisitaionsByPet(petId) {
    return this.client.get(`/visitations/pet/${petId}`);
  }

  getAllVisitaionDetailsById(id) {
    return this.client.get(`/visitations/${id}`);
  }

  getSubjectiveData(id) {
    return this.client.get(`/visitations/subjectives/${id}`);
  }

  getObjectiveData(id) {
    return this.client.get(`/visitations/objectives/${id}`);
  }

  saveSubjectiveData(payload) {
    return this.client.post('/visitations/subjectives', payload);
  }

  updateObjectiveData(payload) {
    return this.client.put(`/visitations/objectives/${payload.id}`, {
      ...payload?.data,
    });
  }

  updateSubjectiveData(payload) {
    return this.client.put(`/visitations/subjectives/${payload.id}`, {
      ...payload?.data,
    });
  }

  updateAssessmentData(payload) {
    return this.client.put(`/visitations/assessments/${payload.id}`, {
      ...payload?.data,
    });
  }

  saveObjectiveData(payload) {
    return this.client.post('/visitations/objectives', payload);
  }

  saveAssessmentData(payload) {
    return this.client.post('/visitations/assessments', payload);
  }

  getAIDiagnosisRecommendation(payload) {
    return this.client.post(`/soap/recommended/diagnosis`, payload);
  }

  getAITreatmentRecommendation(payload) {
    return this.client.post(`/soap/recommended/treatments`, payload);
  }

  getAIRuleOutsRecommendation(payload) {
    return this.client.post(`/soap/recommended/ruleouts`, payload);
  }

  getAIMedicationRecommendation(payload) {
    return this.client.post('/soap/recommended/ruleouts/medications', payload);
  }
  getTreatementResultData(payload) {
    return this.client.get('/soapresult/pet', {
      params: payload,
    });
  }

  getAITreatmentMedicationRecommendation(payload) {
    return this.client.post('/soap/recommended/medications', payload);
  }

  saveTreatmentPlanData(payload) {
    return this.client.post('/petprocess', payload);
  }

  sendTreatmentPlanApprovalEmail(payload) {
    return this.client.post('/generic/sm', payload);
  }

  saveTreatmentResultData(payload) {
    return this.client.post('/soapresult', payload);
  }

  updateTreatmentPlanData(payload) {
    return this.client.put('/petprocess', payload);
  }

  updateTreatmentResultData(payload) {
    return this.client.put('/soapresult', payload);
  }

  getTreatmentPlanData(visitId) {
    return this.client.get(`/petprocess/${visitId}`);
  }

  getVisitationStatus() {
    return this.client.get(`/logs/status/events`);
  }

  getAllStatusByVisitId(visitId) {
    return this.client.get(`/logs/status?visit_id=${visitId}`);
  }

  updateVisitationStatus(payload) {
    return this.client.post(`/logs`, payload);
  }
}

export default Visitation;
