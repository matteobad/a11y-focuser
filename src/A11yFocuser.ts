import { html, css, LitElement, property } from 'lit-element';

export class A11yFocuser extends LitElement {
  static styles = css`
    :host {
      height: 0;
      outline-width: var(--a11y-focus-width, 3px);
      outline-color: var(--a11y-focus-color, #000000);
      outline-style: var(--a11y-focus-style, solid);
      outline-offset: var(--a11y-focus-offset, 0);
      pointer-events: none;
      position: absolute;
      top: 0; left: 0;
      visibility: hidden;
      width: 0;
      z-index: 9999;
    }

    :host(.focus) {
      visibility: visible;
    }
  `;

  @property({type: Element}) currentEl = document.activeElement;
  @property({type: Boolean}) isFocused = false;
  @property({type: Boolean}) isKeyboard = false;

  @property({type: Number}) top = 0;
  @property({type: Number}) left = 0;
  @property({type: Number}) width = 0;
  @property({type: Number}) height = 0;

  constructor() {
    super();

		// bind events
    this.detectKeyboard = this.detectKeyboard.bind(this);
    this.mousedownHandler = this.mousedownHandler.bind(this);
		this.startFocuser = this.startFocuser.bind(this);
		this.stopFocuser = this.stopFocuser.bind(this);
		this.updateFocuser = this.updateFocuser.bind(this);
  }

  connectedCallback() {
    super.connectedCallback();

    document.body.addEventListener('keyup', this.detectKeyboard);
		document.body.addEventListener('mousedown', this.mousedownHandler);
		document.body.addEventListener('focus', this.startFocuser, true);
		document.body.addEventListener('blur', this.stopFocuser, true);

		this.updateFocuser();
  }

  disconnectedCallback() {
    document.body.removeEventListener('keyup', this.detectKeyboard);
		document.body.removeEventListener('mousedown', this.mousedownHandler);
		document.body.removeEventListener('focus', this.startFocuser, true);
    document.body.removeEventListener('blur', this.stopFocuser, true);

    super.disconnectedCallback();
  }

  __findCommonAncestor(node1: Element, node2: Element) {
		const method: string = 'contains' in node1 ? 'contains' : 'compareDocumentPosition';
		const test: number = method === 'contains' ? 1 : 0x10; // HEX -> 16

		while ((node1 = node1.parentNode as Element)) {
			if (((node1 as any)[method](node2) & test) === test) return node1
    }

		return null;
  }

	detectKeyboard(evt: KeyboardEvent) {
		const code = evt.keyCode || evt.which;
		const keys = [9, 37, 38, 39, 40];

		if (keys.indexOf(code) > -1) {
			document.body.classList.add('has-focus');
			this.isKeyboard = true;
			this.startFocuser();
		}
  }

  mousedownHandler() {
    document.body.classList.remove('has-focus');
		this.isKeyboard = false;
		this.stopFocuser();
  }

	startFocuser() {
		this.isFocused = true;
		this.currentEl = document.activeElement;

		if (this.isKeyboard) {
			this.classList.add('focus');
			this.updateFocuser();
		}
	}

	stopFocuser() {
		this.isFocused = false;
		this.currentEl = null;

		this.classList.remove('focus');
	}

	updateFocuser() {
		if (!this.isFocused || !this.currentEl) {
			return;
		}

		const label = document.querySelector(`label[for="${this.currentEl.id}"]`);
		this.currentEl = label ? this.__findCommonAncestor(this.currentEl, label) : this.currentEl;
		const { width, height, top, left } = this.currentEl!.getBoundingClientRect();

    // reasons to stop an active focuser
    // the element is less than 1px in height and width
		// this catches elements that may be using accessible techniques for hidden content
		if (height <= 1 && width <= 1) {
			this.stopFocuser();

			// only update the focuser element if
			// the dimensions have changed to save on processing
		} else if (this.width !== width || this.height !== height || this.top !== top || this.left !== left) {
			// save the current dimensions for comparison
			this.width = width;
			this.height = height;
			this.top = top;
			this.left = left;

			// set the style on the focuser
      // TODO don't animate width & height
      this.style.cssText = `
        width: ${width}px; height: ${height}px;
        transform: translate(${left + window.pageXOffset}px, ${top + window.pageYOffset}px);
      `;
		}

		// this is bad for performance but needed to follow transitioning elements & resize
		// NOTE it could be activated via option only if needed
		requestAnimationFrame(this.updateFocuser);
	}

  render() {
    return html``;
  }
}
