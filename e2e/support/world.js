import { setWorldConstructor, World } from '@cucumber/cucumber';

class RedBankWorld extends World {
  constructor(options) {
    super(options);
    this.baseUrl = process.env.FRONTEND_URL || 'http://localhost:3001';
    this.driver = null;
    this.pages = {};
  }
}

setWorldConstructor(RedBankWorld);
