import {LitElement,html, css} from "lit-element";
import {BoundElement} from "./BoundElement.js";
import {Fore} from "./fore.js";


/**
 * `xf-repeat`
 * an xformish form for eXist-db
 *
 * @customElement
 * @polymer
 * @demo demo/index.html
 */
export class XfRepeatitem extends BoundElement{

    static get styles() {
        return css`
            :host {
              display: block;
            }
        `;
    }

/*
    render() {
        return html`
          <slot></slot>
        `;
    }
*/

    static get properties() {
        return {
/*
            index:{
                type:Number
            }
*/
        };
    }

    constructor(){
        super();
    }

    firstUpdated(_changedProperties) {
        // console.log('### xf-repeatitem firstUpdated index ', this.index);
        // console.log('### xf-repeatitem firstUpdated nodeset ', this.nodeset);
        this.dispatchEvent(new CustomEvent('repeatitem-created', {
            composed: true,
            bubbles: true,
            detail: {item: this}
        }));

    }

    updated(_changedProperties) {
        super.updated(_changedProperties);
/*
        this.dispatchEvent(new CustomEvent('repeatitem-created', {
            composed: true,
            bubbles: true,
            detail: {item: this}
        }));
*/
    }

    refresh(){
        const children = this.querySelectorAll(':scope *');
        this.updateChildren(children);

    }

    updateChildren(children){
        children.forEach(element => {

            //todo: later - check for AVTs
            if(!element.nodeName.toLowerCase().startsWith('xf-')) return;
            if(element.nodeName.toLowerCase() === 'xf-repeat') return;

            if (typeof element.refresh === 'function') {
                // console.log('refresh bound element ', bound);
                // console.log('# refresh element ', element);
                element.refresh();
            }

        });

    }



    createRenderRoot() {
        /**
         * Render template without shadow DOM. Note that shadow DOM features like
         * encapsulated CSS and slots are unavailable.
         */
        return this;
    }

}

window.customElements.define('xf-repeatitem', XfRepeatitem);
