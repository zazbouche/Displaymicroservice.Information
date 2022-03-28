/*eslint no-console: "error"*/

import { LightningElement, api, wire } from 'lwc';

import { getRecord, getFieldValue } from 'lightning/uiRecordApi';
import External_Id from '@salesforce/schema/Account.External_id__c';

const fields = [External_Id];


export default class LwcMakeCallout extends LightningElement {
    @api recordId;

    @wire(getRecord, { recordId: '$recordId', fields })
    account;

     receivedMessage;
     token;
   
     
    hasRendered = false;

    // get tken from open API
    getToken(){
        // mock up url token 
        const calloutURI = 'https://extendsclass.com/mock/rest/593ed821731ab592a437b707d38ecb4c/salesforce/oauth/token';
        fetch(calloutURI, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },

        }).then(
            (response) => {
                //console.log(response.json());
                if (response.ok) {
                    return response.json();
                } 
            }
        ).then(responseJSON => {
            console.log(responseJSON);
            this.token = responseJSON;
            console.log(JSON.stringify(this.token));
        });
    }

    // get  the account fromopen api 
    getTheAccount() {
        console.log(getFieldValue(this.account.data, External_Id));
        this.getToken();

        //console.log(token);
        
        //mock up url account 
        const calloutURI = 'https://extendsclass.com/mock/rest/593ed821731ab592a437b707d38ecb4c/accounts/' + getFieldValue(this.account.data, External_Id) ;
        // requires whitelisting of calloutURI in CSP Trusted Sites
        fetch(calloutURI, {
            method: "GET",
            headers: {
                "Accept": "application/json"
              }
        }).then(
            (response) => {
                //console.log(response.json());
                if (response.ok) {
                    return response.json();
                } 
            }
        ).then(responseJSON => {
            console.log(responseJSON);
            this.receivedMessage = JSON.stringify(responseJSON);
            console.log(JSON.stringify(this.receivedMessage));
        });
    }

    renderedCallback() {
        if(this.hasRendered == false) {
            //this.getTheAccount();
            this.hasRendered = true;
        }
    }
}