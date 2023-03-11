class Question {
  constructor(client) {
    this.client = client;
  }

  getQuestion(id) {
    return this.client.get(`/question/${id}`);
  }

  getAllSecurityQuestions() {
    return this.client.get('/questions');
  }
}

export default Question;
