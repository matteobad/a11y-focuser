import { html, fixture, expect } from '@open-wc/testing';

import {A11yFocuser} from '../src/A11yFocuser.js';
import '../a11y-focuser.js';

describe('A11yFocuser', () => {
  // it('has a default title "Hey there" and counter 5', async () => {
  //   const el: A11yFocuser = await fixture(html`
  //     <a11y-focuser></a11y-focuser>
  //   `);

  //   expect(el.title).to.equal('Hey there');
  //   expect(el.counter).to.equal(5);
  // });

  // it('increases the counter on button click', async () => {
  //   const el: A11yFocuser = await fixture(html`
  //     <a11y-focuser></a11y-focuser>
  //   `);
  //   el.shadowRoot!.querySelector('button')!.click();

  //   expect(el.counter).to.equal(6);
  // });

  // it('can override the title via attribute', async () => {
  //   const el: A11yFocuser = await fixture(html`
  //     <a11y-focuser title="attribute title"></a11y-focuser>
  //   `);

  //   expect(el.title).to.equal('attribute title');
  // });

  it('passes the a11y audit', async () => {
    const el: A11yFocuser = await fixture(html`
      <a11y-focuser></a11y-focuser>
    `);

    await expect(el).shadowDom.to.be.accessible();
  });
});
