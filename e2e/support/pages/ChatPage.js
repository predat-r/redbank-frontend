import { By, until } from 'selenium-webdriver';

export class ChatPage {
  constructor(driver, baseUrl) {
    this.driver = driver;
    this.baseUrl = baseUrl;
  }

  async open() {
    await this.driver.get(`${this.baseUrl}/chat`);
    await this.waitForLoad();
  }

  async waitForLoad() {
    await this.driver.wait(
      until.elementLocated(By.xpath("//h3[contains(., 'RedAssist')]"))
    );
  }

  async isWelcomeMessageVisible() {
    try {
      const welcomeMsg = await this.driver.wait(
        until.elementLocated(By.xpath("//h3[contains(., 'How can I help you today?')]")),
        5000
      );
      return await welcomeMsg.isDisplayed();
    } catch {
      return false;
    }
  }

  async isSendButtonDisabled() {
    const btn = await this.driver.findElement(By.css("button[type='submit']"));
    return !(await btn.isEnabled());
  }

  async isClearButtonDisabled() {
    const btn = await this.driver.findElement(By.css("button[title='Clear chat']"));
    return !(await btn.isEnabled());
  }

  async sendMessage(message) {
    const input = await this.driver.findElement(
      By.css("input[placeholder='Ask a question...']")
    );
    await input.clear();
    await input.sendKeys(message);
    const sendBtn = await this.driver.findElement(By.css("button[type='submit']"));
    await this.driver.executeScript('arguments[0].click();', sendBtn);
  }

  async waitForAiResponse() {
    // Wait until there is a message from AI (bg-neutral-100 or bg-error-50)
    await this.driver.wait(
      until.elementLocated(
        By.xpath(
          "//div[contains(@class, 'bg-neutral-100') or contains(@class, 'bg-error-50')]"
        )
      ),
      10000
    );
  }

  async getUserMessages() {
    const elements = await this.driver.findElements(
      By.xpath("//div[contains(@class, 'bg-primary-600')]")
    ); // User message bubble
    const texts = [];
    for (let el of elements) {
      texts.push(await el.getText());
    }
    return texts;
  }

  async getAiMessages() {
    const elements = await this.driver.findElements(
      By.xpath(
        "//div[contains(@class, 'bg-neutral-100') or contains(@class, 'bg-error-50')]"
      )
    ); // AI message bubble (success or error)
    const texts = [];
    for (let el of elements) {
      texts.push(await el.getText());
    }
    return texts;
  }

  async clearChat() {
    const clearBtn = await this.driver.findElement(By.css("button[title='Clear chat']"));
    await this.driver.executeScript('arguments[0].click();', clearBtn);
  }

  async hasFinancialChip() {
    try {
      const chip = await this.driver.wait(
        until.elementLocated(
          By.xpath("//span[contains(@style, 'font-variant-numeric: tabular-nums')]")
        ),
        5000
      );
      return await chip.isDisplayed();
    } catch {
      return false;
    }
  }

  async clearLocalStorage() {
    await this.driver.executeScript(
      "window.localStorage.removeItem('redbank_chat_history');"
    );
  }

  async refresh() {
    await this.driver.navigate().refresh();
    await this.waitForLoad();
  }
}
