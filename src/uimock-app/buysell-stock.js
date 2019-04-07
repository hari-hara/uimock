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
    connectedCallback(){
        super.connectedCallback();
        // this.$.stockBrokerage.addEventListener('change', function(event){
        //     console.log("getting triggered"); 
        //     console.log(event.target.value);
        // }.bind(this));
    }
    ready(){
        super.ready();
        this.isVisible = true;
        let stockLoadajax = this.$.ajax;
        stockLoadajax.contentType = "application/json";
        //stockLoadajax.url = config.baseURL + "/rmisecurity/getDetails";
        stockLoadajax.url = config.baseURL + "/ingdb/api/v1/stocks/getDetails";
        this.requestType = 'getStock';
        stockLoadajax.generateRequest();
    }
    buyStock(event){  
       
        if(this.$.stocksList.querySelector('iron-form').validate()){
            //this.TotalPrice = (this.unitPrice * this.qty); 
            let buyStockajax = this.$.ajax;
            buyStockajax.method = "POST";
           buyStockajax.contentType = "application/json";
           buyStockajax.url = config.baseURL+"/rmisecurity/tradestock";
           buyStockajax.body = 
           {
               "userName": this.selectedUser,
               "stockName": event.model.item.symbol,
               "qty": this.qty,
               "type": "cr",
               "unitPrice": event.model.item.price,
               "TotalPrice": this.finalPrice
           }
            this.requestType = 'buyStock';
            buyStockajax.generateRequest();
         }
    }
    handleResponse(event, requestType ){
        switch(this.requestType){
            case 'getStock':
                this.toastMessage = "Successfully fetched stocks"
                this.isActive = false;
                this.isVisible = false;
                console.log(event.detail.response);
                this.data = event.detail.response;
                //this.price = event.detail.response 
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
            },
            selectedUser:{
                type: String
            }
            
            
        }
    }
    
    handleError(event){
        this.$.messageHandle.toggle();
        this.toastMessage = "This API call is failed";
    }
    calculateBrokerage(event){
        console.log(event.model.item);
        console.log("change triggered");
        console.log(event);
        
        let unitPrice = event.model.item.price;
        let qty = this.qty;
        let total = unitPrice * qty;
        if(qty >= 500 ){
            this.finalPrice = total + ((0.15 * total)/100);
        }else{
            this.finalPrice = total + ((0.10 * total)/100);
        }
    }
    showStatistics(event){

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
            <div id="stocksList">
            <vaadin-accordion>
                <template is="dom-repeat"  items="{{data}}" as="product">
                    <vaadin-accordion-panel theme="filled"> 
                        <div slot="summary">{{product.name}}</div>
                        <template is="dom-repeat" items="{{product.company_details}}">
                            <table class="table">
                                <tr>
                                    <td><strong>Open:</strong> [[item.open]]</td>
                                    <td><strong>low:</strong> [[item.close]]</td>
                                    <td><strong>high:</strong> [[item.high]]</td>
                                </tr>
                                <tr>
                                    <td><strong>latest trading day:</strong> [[item.latest_trading_day]]</td>
                                    <td><strong>Unit price:</strong> {{item.price}}</td>
                                    <td><strong>previous closure:</strong> [[item.change_percent]]</td>
                                </tr>
                                <tr>
                                    <td><strong>Last Trading Day: </strong>[[item.latest_trading_day]]</td>
                                   
                                    <td><strong>Change Percent: </strong>[[item.change_percent]]</td>
                                    <td><paper-button label="Get Quote" raised on-click="showStatistics">Get Statistics</paper-button></td>
                                </tr>
                            </table>
                            
                            <iron-form id="stockselection" class="col-md-4 offset-md-4 border border-secondary pt-3 pb-3">
                                <form>
                                    <paper-input label="Qty" hidden$=[[isVisible]] value="{{qty}}" id="stockBrokerage"></paper-input>&nbsp;&nbsp;<label>[[finalPrice]]</label>
                                    <paper-button label="Get Quote" raised on-click="calculateBrokerage">Get Quote</paper-button>&nbsp;&nbsp;<paper-button label="Submit" required raised on-click="buyStock">Submit</paper-input>
                                </form>
                            </iron-form>
                        </template>  
                    </vaadin-accordian-panel> 
                </template>
            </vaadin-accordion>
            </div>
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