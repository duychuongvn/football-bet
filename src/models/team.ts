import { TeamInterface } from 'interfaces/team';


export class Team{

    private _name : string;
    public get name() : string {
        return this._name;
    }
    public set name(v : string) {
        this._name = v;
    }


    private _code : string;
    public get code() : string {
        return this._code;
    }
    public set code(v : string) {
        this._code = v;
    }


    private _shortName : string;
    public get shortName() : string {
        return this._shortName;
    }
    public set shortName(v : string) {
        this._shortName = v;
    }


    private _squadMarketValue : string;
    public get squadMarketValue() : string {
        return this._squadMarketValue;
    }
    public set squadMarketValue(v : string) {
        this._squadMarketValue = v;
    }


    private _crestUrl : string;
    public get crestUrl() : string {
        return this._crestUrl;
    }
    public set crestUrl(v : string) {
        this._crestUrl = v;
    }


    constructor(data?: TeamInterface){
        this.code = data.code;
        this.name = data.name;
        this.shortName = data.shortName;
        this.squadMarketValue = data.squadMarketValue;
        this.crestUrl = data.crestUrl;
    }

}
