/* global process */
import { setWorldConstructor } from '@cucumber/cucumber';

export class CustomWorld {
  constructor({ parameters }) {
    this.parameters = parameters;
    this.driver = null;
    this.baseUrl = process.env.BASE_URL || 'http://localhost:3001';
  }
}

setWorldConstructor(CustomWorld);
