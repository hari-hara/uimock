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

class TradeAnalytics extends PolymerElement{
    constructor(){
        super();
    }
    ready(){
        
        super.ready();

        let paymentReportajax = this.$.ajax;
        paymentReportajax.method = "GET";
        paymentReportajax.contentType = "application/json";
        paymentReportajax.url = config.baseURL+"/rmisecurity/tradeAnalytics";
        paymentReportajax.generateRequest(); 
        
    }
    handleResponse(event){
        
        let data = event.detail.response.map((analytics) => {
            return {
                "stockName": analytics.stockName,
                "stockTransation": parseInt(analytics.stockTransation)
            }
        })
        console.log('data - - ', data);
        /*let data =  [];
        newArray.forEach((arr, i) => {
            console.log(arr);
            data.push(arr.details[0]);
        });   
*/
        
          
        // const data = [{date: 2011,amount: 45},{date: 2012,amount: 47},
        // {date: 2013,amount: 52},{date: 2014,amount: 70},
        // {date: 2015,amount: 75},{date: 2016,amount: 30},];
        // this.data= data; 
 

        
        this.data= data; 
        console.log("newly formed data",data);
        //var color = d3.scale.ordinal().range(["#6b486b", "#a05d56", "#d0743c", "#ff8c00"]);

        //data = event.detail.response[0].details;
        var svg = d3.select(this.$.svgImage),
            margin = 200,
            width = svg.attr("width") - margin,
            height = svg.attr("height") - margin

        svg.append("text")
        .attr("transform", "translate(100,0)")
        .attr("x", 50)
        .attr("y", 50)
        .attr("font-size", "24px")
        .text("Transaction History")

        var xScale = d3.scaleBand().range([0, width]).padding(0.4),
            yScale = d3.scaleLinear().range([height, 0]);

        var g = svg.append("g")
                .attr("transform", "translate(" + 100 + "," + 100 + ")");

        /*d3.csv(this.data, function(error, data) {
            if (error) {
                throw error;
            }*/

            xScale.domain(data.map(function(d) { return  d.stockName; }));
            
            //let yData = data.map(function(d, subarray ) { return  d.details[0].amount; });    
            yScale.domain([0, d3.max(data, function(d) { 
                //data.map(function(d, subarray ) { return  d.details[0].amount; })    
                return d.stockTransation; 
            })]);
            g.append("g")
            .attr("transform", "translate(0," + height + ")")
            .call(d3.axisBottom(xScale))
            .append("text")
            .attr("y", height - 250)
            .attr("x", width - 100)
            .attr("text-anchor", "end")
            .attr("stroke", "black")
            .text("Stock Name");

            g.append("g")
            .call(d3.axisLeft(yScale).tickFormat(function(d){
                return d;
            })
            .ticks(10))
            .append("text")
            .attr("transform", "rotate(-90)")
            .attr("y", 6)
            .attr("dy", "-5.1em")
            .attr("text-anchor", "end")
            .attr("stroke", "black")
            .text("Points");

            g.selectAll(".bar")
            .data(data)
            .enter().append("rect")
            .attr("class", "bar")
            .attr("x", function(d) { return xScale(d.stockName); })
            .attr("y", function(d) { return yScale(d.stockTransation); })
            .attr("width", xScale.bandwidth())
            .attr("height", function(d) { return height - yScale(d.stockTransation); })
            .attr("fill", function(d) {
                //return colorPicker(d.amount); // call the color picker to get the fill.
                if (d.stockTransation <= 250) {
                    return "#666666";
                } else if (d.stockTransation > 250) {
                    return "#FF0033";
                }
            });
            
            

            
        /*});*/
    }
    colorPicker(v) {
        if (v <= 250) {
          return "#666666";
        } else if (v > 250) {
          return "#FF0033";
        }
    }
    static get properties(){
        return {
            pageTitle:{
                type: String,
                value: "This is Product Analytics page"
            }
        }
    }
    handleError(event){
        this.$.messageHandle.toggle();
        //this.toastMessage = "Failed to make transaction";
    }
    static get template(){
        return html `
            <h2>[[pageTitle]]</h2>
            <svg id="svgImage" width="980" height="500"></svg><paper-spinner active={{isActive}}></paper-spinner><br/>
            <iron-ajax
                id="ajax"
                handle-as="json"
                on-response="handleResponse"
                on-error="handleError"
                debounce-duration="300">
            </iron-ajax>
        `
    }

}
customElements.define("trade-analytics", TradeAnalytics);