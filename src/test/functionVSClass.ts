/*
# app registration
1. go to azure portal, add a app resigtration
2. got certificates & secrets, add a new client secrets
3. go to Dynamics, go to security > user, change view to application user, add a application user, 
    3.1 set the client id of the appliation user to client id above
    3.2 give the user system customize role
*/

import * as adal from 'adal-node';
import * as DynamicsWebApi from "dynamics-web-api";

export const getDynamicsWebApi = (tenantId: string, resource: string, clientId: string, secret: string) => {
    const authorityUrl = `https://login.microsoftonline.com/${tenantId}/oauth2/token`;
    const authContext = new adal.AuthenticationContext(authorityUrl);
    const dynamicsWebApi = new DynamicsWebApi({
        webApiUrl: `https://${resource}/api/data/v9.0/`,
        onTokenRefresh: (callback) => authContext.acquireTokenWithClientCredentials(
            resource,
            clientId,
            secret,
            (error, token) => error ? console.log(error) : callback(token)
            )
    })
    return dynamicsWebApi
}
export async function testFunction(){
    const api = getDynamicsWebApi('','','','')
    const records = await api.retrieveMultiple("leads", ["fullname", "subject"], "statecode eq 0")
}

export class DynamicsConnector {
    authorityUrl: string;
    resource: string;
    clientId: string;
    secrect: string;
    adalContext: adal.AuthenticationContext;
    apiUrl: string;
    dynamicsWebApi: any;
    constructor(tenantId: string, resource: string, clientId: string, secret: string) {
        this.authorityUrl = `https://login.microsoftonline.com/${tenantId}/oauth2/token`;
        this.resource = `https://${resource}/`;
        this.apiUrl = resource;
        this.clientId = clientId;
        this.secrect = secret
        //create DynamicsWebApi object
        this.dynamicsWebApi = new DynamicsWebApi({
            webApiUrl: `https://${this.apiUrl}/api/data/v9.0/`,
            onTokenRefresh: this.acquireTokens
        });
        this.adalContext = new adal.AuthenticationContext(this.authorityUrl);
    }


    public acquireTokens = (dynamicsCallback: any) => {
        const adalCallback = (error: any, token: any) => {
            if (!error) {
                //call DynamicsWebApi callback only when a token has been retrieved
                dynamicsCallback(token);
            }
            else {
                console.log('Token has not been retrieved. Error: ' + error.stack);
            }
        }
        this.adalContext.acquireTokenWithClientCredentials(this.resource, this.clientId, this.secrect, adalCallback)
    }
}
async function testClass(){
    const api = new DynamicsConnector('','','','').dynamicsWebApi
    const records = await api.retrieveMultiple("leads", ["fullname", "subject"], "statecode eq 0")
}
