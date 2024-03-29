export class User{
    constructor(
        public email : string,
        public  id: string,
        private _token : string,
        private _tokenExpirationDate : Date){
        
    }
    get token(){
        if(!this._tokenExpirationDate || new Date()>this._tokenExpirationDate){
            console.log("token expired")
            return null
        }
        console.log("token valid: ",this._token)
        return this._token;

    }

}
/*
idToken : string;
email : string;
refreshToken : string;
expiresIn : string;
localId : string;
registered? : boolean;
*/