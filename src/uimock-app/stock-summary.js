import {html, PolymerElement} from '@polymer/polymer/polymer-element.js';
import '@polymer/iron-ajax/iron-ajax.js';
import '@polymer/iron-form/iron-form.js';
import '@polymer/paper-button/paper-button.js';
import '@polymer/paper-dropdown-menu/paper-dropdown-menu.js';
import '@polymer/paper-item/paper-item.js';
import '@polymer/paper-listbox/paper-listbox.js';
import '@polymer/paper-toast/paper-toast.js';
import '@polymer/paper-input/paper-input.js';
import { sharedStyles } from './shared-styles.js';

class StockSummary extends PolymerElement{
    constructor(){
        super();
    }
    ready(){
        
        super.ready();

    }
    static get properties(){
        return {
            pageTitle:{
                type: String,
                value: "This is Stock Summary page"
            },
            users:{
                type: Array,
                value: ["user1", "user2", "user3"]
            },
        }
    }
    getSummary(event){
        this.isActive = true;
        if(this.$.getSummary.validate()){
            let buyStockajax = this.$.ajax;
            
           buyStockajax.contentType = "application/json";
           buyStockajax.url = "http://13.234.20.255:9080/rmisecurity/stmt/"+ this.selectedUser+ "/stockname";
            this.requestType = 'summary';
            buyStockajax.generateRequest();
         }
    }
    handleResponse(event, requestType ){
        switch(this.requestType){
            case 'summary':
             this.isActive = false;
                console.log("details rendered", event.response);
                this.responseData = event.detail.__data.response;
                break;
            case 'buyStock':
                this.toastMessage = "This transaction is successful"
                this.$.messageHandle.toggle();

               console.log("response message",event.response.message);
                
                break;    
        }
       
       //this.set('responseData', event.detail.response['Global Quote']);
       
    }
    handleError(event){
        this.$.messageHandle.toggle();
        //this.toastMessage = "Failed to make transaction";
    }
    static get template(){
        return html `
            <h2>[[pageTitle]]</h2>
            <iron-form id="getSummary" class="col-md-4 offset-md-4 border border-secondary pt-3 pb-3">
                <form>
                    <paper-dropdown-menu label="Users" name="selectUser">
                        <paper-listbox slot="dropdown-content" selected="{{selectedUser}}" attr-for-selected="name" selected-attribute="visible">
                            <template is="dom-repeat" items="[[users]]">
                                <paper-item name={{item}}>{{item}}</paper-item>
                            </template>
                        </paper-listbox>
                    </paper-dropdown-menu>
                    
                    <paper-button label="Submit" required raised on-click="getSummary">Submit</paper-input>
                   
                </form>
            </iron-form>
            <paper-spinner active={{isActive}}></paper-spinner><br/>
            <iron-ajax
                id="ajax"
                handle-as="json"
                on-response="handleResponse"
                on-error="handleError"
                debounce-duration="300">
            </iron-ajax>
            <table class="table mt-5">
                <thead>
                    <tr>
                        <th>Transaction ID</th>
                        <th>Username</th>
                        <th>Stock Name Amount</th>
                        <th>Quantity</th>
                        <th>Type</th>
                    </tr>
                </thead>
                {{filteredResults}}
                    
                        <tbody id="scrollable-element" style="overflow: auto;height: 200px;">
                        
                                <template is="dom-repeat" items=[[responseData]]  as="historyResults">
                                    <tr>
                                        <td scope="row">{{item.id}}</td>
                                        <td>{{historyResults.userName}}</td>
                                        <td>{{historyResults.stockName}}</td>
                                        <td>{{historyResults.qty}}</td>
                                        <td>{{historyResults.type}}</td>
                                    </tr>
                                </template>
                        
                        </tbody>
                    
            </table><br/>
            
        `
    }

}
customElements.define("stock-summary", StockSummary);