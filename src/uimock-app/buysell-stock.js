import {html, PolymerElement} from '@polymer/polymer/polymer-element.js';
import '@polymer/iron-ajax/iron-ajax.js';
import '@polymer/iron-form/iron-form.js';
import '@polymer/paper-button/paper-button.js';
import '@polymer/paper-dropdown-menu/paper-dropdown-menu.js';
import '@polymer/paper-item/paper-item.js';
import '@polymer/paper-listbox/paper-listbox.js';
import '@polymer/paper-toast/paper-toast.js';
import '@polymer/paper-input/paper-input.js';
import '@vaadin/vaadin-accordion/vaadin-accordion.js';
import { sharedStyles } from './shared-styles.js';
class BuysellStock extends PolymerElement{
    constructor(){
        super();
    }
    ready(){
        super.ready();
        this.isVisible = true;
        let stockLoadajax = this.$.ajax;
        stockLoadajax.contentType = "application/json";
        stockLoadajax.url = config.baseURL + "/ing_trade/api/v1/stocks/getDetails";
        this.requestType = 'getStock';
        stockLoadajax.generateRequest();
    }
    handleResponse(event, requestType ){
        switch(this.requestType){
            case 'getStock':
                this.isActive = false;
                this.isVisible = false;
                console.log(event.detail.response);
                this.data = event.detail.response;
                break;
            case 'buyStock':
                this.toastMessage = "This transaction is successful"
                this.$.messageHandle.toggle();

               console.log("response message",event.response.message);
                
                break;    
        }  
    }
    static get properties(){
        return {
            pageTitle:{
                type: String,
                value: "This is for Buying/Selling page"
            },
            
            users:{
                type: Array,
                value: ["user1", "user2", "user3"]
            }
            
            
        }
    }
    
    handleError(event){
        this.$.messageHandle.toggle();
        this.toastMessage = "Failed to make transaction";
    }
    static get template(){
        return html `
            ${sharedStyles}
            <h2>[[pageTitle]]</h2>
            <paper-toast id="messageHandle" text="[[toastMessage]]" horizontal-align="center" vertical-align="middle"></paper-toast>
            <paper-dropdown-menu label="Users" name="selectUser">
                <paper-listbox slot="dropdown-content" selected="{{selectedUser}}" attr-for-selected="name" selected-attribute="visible">
                    <template is="dom-repeat" items="[[users]]">
                        <paper-item name={{item}}>{{item}}</paper-item>
                    </template>
                </paper-listbox>
            </paper-dropdown-menu>
            <vaadin-accordion>
                <template is="dom-repeat"  items="{{data}}" as="product">
                    <vaadin-accordion-panel theme="filled"> 
                        <div slot="summary">{{product.name}}</div>
                        <template is="dom-repeat" items="{{product.company_details}}">
                            <table class="table">
                                <tr>
                                    <td>Open: [[item.open]]</td>
                                    <td>low: [[item.close]]</td>
                                    <td>high: [[item.high]]</td>
                                </tr>
                                <tr>
                                    <td>latest trading day: [[item.latest_trading_day]]</td>
                                    <td>price: [[item.price]]</td>
                                    <td>previous closure: [[item.change_percent]]</td>
                                </tr>
                                <tr>
                                    <td>[[item.latest_trading_day]]</td>
                                    <td>[[item.price]]</td>
                                    <td>[[item.change_percent]]</td>
                                </tr>
                            </table>
                            
                            <iron-form id="stockselection" class="col-md-4 offset-md-4 border border-secondary pt-3 pb-3">
                                <form>
                                    <paper-input label="Qty" hidden$=[[isVisible]] value="{{qty}}"></paper-input>
                                    <paper-button label="Submit" required raised on-click="buyStock">Submit</paper-input>
                                </form>
                            </iron-form>
                            <div><paper-button label="Buy" required raised on-click="makeTransaction">Buy</paper-input></div>
                        </template>  
                    </vaadin-accordian-panel> 
                </template>
            </vaadin-accordion>
            <iron-ajax
                id="ajax"
                handle-as="json"
                on-response="handleResponse"
                on-error="handleError"
                debounce-duration="300">
            </iron-ajax>
            <paper-spinner active={{isActive}}></paper-spinner><br/>
        `
    }

}
customElements.define("buysell-stock", BuysellStock);