import {LitElement, html, css} from 'lit-element';

import * as fontoxpath from '../output/fontoxpath.js';
import fx from "../output/fontoxpath";

export class XfModel extends LitElement {

    static get styles() {
        return css`
            :host {
                display: block;
                height:auto;
                background:var(--paper-blue-700);
                padding:var(--model-element-padding);
            }
            :host:before{
                content:'xf-model';
            }
        `;
    }

    static get properties() {
        return {
            id: {
                type: String
            },
            instances: {
                type: Array
            },
            defaultInstance: {
                type: Object
            }
        };
    }

    constructor() {
        super();
        this.id = '';
        this.instances = [];
    }

/*
    render() {
        return html`
             <slot></slot>
        `;
    }
*/

    firstUpdated(_changedProperties) {
        console.log('MODEL.firstUpdated');
        this.addEventListener('model-construct', this._modelConstruct);
        // this.addEventListener('instance-ready', this._callUpdate);

        // this.addEventListener('model-construct-done', this._handleModelConstructDone);

        this.addEventListener('ready', this._ready);

    }

    _modelConstruct() {
        console.log('model-construct received ', this.id);
        const instances = this.querySelectorAll('xf-instance');

        if (instances.length > 0) {
            instances.forEach(instance => {
                instance.init();
            });
        } else {
            this.dispatchEvent(new CustomEvent('model-construct-done', {
                composed: true,
                bubbles: true,
                detail: {model: this}
            }));
        }

        this.instances = instances;
        console.log('model instances ', this.instances);

        this.updateModel();
        this.dispatchEvent(new CustomEvent('model-construct-done', {
            composed: true,
            bubbles: true,
            detail: {model: this}
        }));

    }

    /**
     * update action triggering the update cycle
     */
    updateModel() {
        console.group('updateModel', this.id);
        this.rebuild();
        this.recalculate();
        this.revalidate();
        console.groupEnd();
    }

    rebuild() {
        // tbd
        console.log('rebuild');
    }

    recalculate() {
        // tbd
        console.log('recalculate');
    }

    revalidate() {
        // tbd
        console.log('revalidate');
        console.log('revalidate instances ', this.instances);

        console.group('revalidate');
        const binds = this.querySelectorAll('xf-bind');
        binds.forEach(bind => {
            console.log('bind ', bind);
            console.log('bind ', bind.ref);
            console.log('instanceData ', this.getDefaultInstanceData());

            let contextNode =  fx.evaluateXPath(bind.ref, this.getDefaultInstanceData(), null, {});
            console.log('evaluated context node ', contextNode);

            let result ='';
            if(bind.readonly !== 'false()'){
                console.log('evaluating readonly expression', bind.readonly);
            }
            if(bind.required !== 'false()'){
                console.log('evaluating required expression', bind.required);
                result =  fx.evaluateXPath(bind.required, result, null, {});
                console.log('required evaluated to', result);
            }
            if(bind.relevant !== 'true()'){
                console.log('evaluating relevant expression', bind.relevant);
            }
            if(bind.constraint !== 'true()'){
                console.log('evaluating constraint expression', bind.constraint);
            }
            if(bind.type !== 'xs:string'){
                console.log('evaluating type  expression', bind.type);
            }
        });
        console.groupEnd();
    }

    _handleModelConstructDone(e){
        console.log('_handleModelConstructDone');
        this.refresh();
    }


    getDefaultInstanceData() {
        // console.log('default instance data ',this.instances[0].instanceData);
        // console.log('default instance data ',this.instances[0].instanceData.firstElementChild);
        return this.instances[0].instanceData.firstElementChild;
    }

    evalBinding(bindingExpr){
        console.log('MODEL.evalBinding ', bindingExpr);
        //default context of evaluation is always the default instance
        return this.instances[0].evalXPath(bindingExpr);
    }


/*
    _callUpdate(e) {

        // fire construct-done only in case we received the event from the last instance meaning all instances are up
        const instances = this.querySelectorAll('xf-instance');
        if (instances.length > 0) {
            const cnt = instances.length;
            const last = this.querySelectorAll('xf-instance')[cnt - 1];

            const targetInstance = document.getElementById(e.detail.id);
            if (targetInstance === last) {
                console.log('last instance fired ', last.id);
                this.updateModel();
                this.dispatchEvent(new CustomEvent('model-construct-done', {
                    composed: true,
                    bubbles: true,
                    detail: {model: this}
                }));
            }
        } else {
            // there are no instances at model construction time
            this.dispatchEvent(new CustomEvent('model-construct-done', {
                composed: true,
                bubbles: true,
                detail: {model: this}
            }));
        }

    }
*/

    _ready(e) {
        console.log('model is ready');
    }

    createRenderRoot() {
        /**
         * Render template without shadow DOM. Note that shadow DOM features like
         * encapsulated CSS and slots are unavailable.
         */
        return this;
    }



}

customElements.define('xf-model', XfModel);