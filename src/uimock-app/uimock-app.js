import {html, PolymerElement} from '@polymer/polymer/polymer-element.js';
import '@polymer/app-route/app-location.js';
import '@polymer/app-route/app-route.js';
import '@polymer/iron-pages/iron-pages.js';

import { sharedStyles } from './shared-styles.js';
/**
 * @customElement
 * @polymer
 */

class UimockApp extends PolymerElement {
  static get template() {
    return html`
      ${sharedStyles}
      <style>
        :host {
          display: block;
        }
        .navbar-light .navbar-nav .nav-link{
          color: #fff;
        }
      </style>
      <h2>Hello [[prop1]]!</h2>
      <div class="container">
        <h2>Hello [[prop1]]!</h2>
      </div>
      <app-location route="{{route}}" use-hash-as-path></app-location>
      <app-route
          route="{{route}}"
          pattern="/:page"
          data="{{routeData}}"
          tail="{{subroute}}">
      </app-route>
      <app-route
          route="{{subroute}}"
          pattern="/:id"
          data="{{subrouteData}}">
      </app-route>
      <div class="container">
        <nav class="navbar navbar-expand-lg navbar-light bg-light" style="background-color: #ff6200 !important;">
          <a class="navbar-brand" href="#"><img src="ing.png" style="width: 58px;"/></a>
          <button class="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
            <span class="navbar-toggler-icon"></span>
          </button>
          <div class="collapse navbar-collapse" id="navbarNav">
            <ul class="navbar-nav">
              <li class="nav-item"><a class="nav-link" href="#/buysell-stock">Buy/Sell</a></li>
              <li class="nav-item"><a class="nav-link" href="#/stock-summary">Stock Summary</a></li>
              <li class="nav-item"><a class="nav-link" href="#/stock-statement">Stock Statement</a></li>
              <li class="nav-item"><a class="nav-link" href="#/trade-analytics">Trade Analytics</a></li>
            </ul>
          </div>
        </nav> 
          <div class="d-flex justify-content-center">
            <paper-spinner active={{isActive}}></paper-spinner>
          </div> 
        <iron-pages selected=[[page]] attr-for-selected="name" selected-attribute="visible" fallback-selection="404">
          <buysell-stock name="buysell-stock"></buysell-stock>
          <stock-summary name="stock-summary"></stock-summary>
          <stock-statement name="stock-statement"></stock-statement>
          <trade-analytics name="trade-analytics"></trade-analytics>
        </iron-pages>
      </div>
    `;
  }
  static get properties() {
    return {
      prop1: {
        type: String,
        value: 'uimock-app'
      },
      page:{
        type: String,
        observer: '_pageChanged'
      }
    };
  }
  static get observers(){
    
    return ['_routeChanged(routeData.page)'];
    
  }
  _routeChanged(page){
    this.page = (page || ('buysell-stock'))
  }
  _pageChanged(newPage, oldPage){
    this.isActive = true;
    switch(newPage){
      case 'buysell-stock':
        import('./buysell-stock.js');
        this.isActive = false;
        break;
      case 'stock-summary':
        import('./stock-summary.js');
        this.isActive = false;
        break;
      case 'stock-statement':
        import('./stock-statement.js');
        this.isActive = false;
        break;
      case 'trade-analytics':
        import('./trade-analytics.js');
        this.isActive = false;
        break;  
      default:
        this.page =  'buysell-stock';   
    }
  }
  ready(){
    super.ready();
    console.log("second",config.baseURL)
  }
}

window.customElements.define('uimock-app', UimockApp);
