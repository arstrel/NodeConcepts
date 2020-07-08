const puppeteer = require('puppeteer');
const Keygrip = require('keygrip');
const keys = require('../config/keys');
const Buffer = require('safe-buffer').Buffer;
const keygrip = new Keygrip([keys.cookieKey]);
const userID = "5f03797e6c96ce9189d7ead0";

const mockUser = `{"passport":{"user":"${userID}"}}`;
const mockSession = Buffer.from(mockUser, 'utf8').toString('base64');
const mockSessionSig = keygrip.sign(`session=${mockSession}`);
const cookies = [{
    'name': 'session',
    'value': mockSession
},
{
    'name': 'session.sig',
    'value': mockSessionSig
}];
const url = process.env.TEST_DOMAIN_URL || 'http://localhost:3000';


let browser, page;

beforeAll(async () => {
    browser = await puppeteer.launch();
});

beforeEach(async () => {
    page = await browser.newPage();
    await page.goto(url);
});

afterEach(async () => {
    await page.close();
});

afterAll(async () => {
    browser.close();
});

test('The header has a correct text', async () => {
    const text = await page.$eval('a.brand-logo', el => el.innerHTML);
    expect(text).toEqual('Blogster');
});

test('Login button leads to Google OAuth flow', async () => {
    await page.click('.right a');
    const url = await page.url();
    expect(url).toMatch(/accounts.google.com/);
});

test('When signed in shows logout button', async () => {
    await page.setCookie(...cookies);
    const cookiesSet = await page.cookies(url);
    await page.reload({ waitUntil: ["networkidle0", "domcontentloaded"] });
    const text = await page.$eval('.right li:last-of-type a', el => el.innerHTML);
    expect(text).toEqual('Logout');
});

