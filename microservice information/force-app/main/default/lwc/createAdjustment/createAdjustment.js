/*eslint no-console: "error"*/

import { LightningElement, api, wire } from 'lwc';

import { getRecord, getFieldValue } from 'lightning/uiRecordApi';
import External_Id from '@salesforce/schema/Account.External_id__c';
import Account_Id from '@salesforce/schema/Case.Account_External_id__c';
import Case_Number from '@salesforce/schema/Case.CaseNumber';


const fields = [Account_Id];
const fieldsa = [External_Id];


export default class CreateAdjustment extends LightningElement {
    @api 
    recordId;

    @wire(getRecord, { recordId: '$recordId', fields})
    case

    receivedMessage;
    token;
    body;
    montant;
    
    handleMontantChange(event) {
        this.montant = event.target.value;
    }
    // create json body
    constructbody(){
        
        var obj = new Object();
        var amount = {"amount" : this.montant ,
                     "currency":"EUR"};

        console.log(getFieldValue(this.case.data, Account_Id));

        //myObject.accountId=getFieldValue(this.case.data, Account_Id);
        obj.accountId =getFieldValue(this.case.data, Account_Id);
        obj.amount = amount;
        // if amount> 1000 put statut IN_PROGRESS else put CREATED
        if(this.montant > 1000){
            obj.adjustmentStatus="IN_PROGRESS";
        }else{
            obj.adjustmentStatus="CREATED";
        }

        this.body=obj;
        console.log(obj);
        console.log(this.body);
    }

    // get token from open api
    getToken(){
        // token mock up 

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

    
   hasRendered = false;
   

   // create adjsment call 
   Createadjusmente() {

    this.getToken();

    this.constructbody();

    //console.log(this.body);
    
        // mock up url 
       const calloutURI = 'https://extendsclass.com/mock/rest/593ed821731ab592a437b707d38ecb4c/Accountd='+getFieldValue(this.case.data, Account_Id) ;
       // requires whitelisting of calloutURI in CSP Trusted Sites
       fetch(calloutURI, {
           method: "Post",
           headers: {
                "Accept": "application/json"
             },
        
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
           //this.getTheJoke();
           this.hasRendered = true;
       }
   }
}