import { SourceObject, wasmBundle, wasmBundleFromBase64 } from "data/libs";
import { Consumer } from "data/util";

export class WebSocketDevClient {
    private enableBase64: boolean;
    private onError: Consumer<string>;
    private onBundle: Consumer<SourceObject>;

    constructor(enableBase64: boolean, onError: Consumer<string>, onBundle: Consumer<SourceObject>){
        this.onError = onError;
        this.onBundle = onBundle;
        this.enableBase64 = enableBase64;
    }

    // Process data received from dev server and call one of the callbacks
    // The data should be either base64-encoded, compressed bundle
    // or plaintext unbundled json
    public processData(data: string): void {
        if(this.enableBase64){
            if (isBase64(data)){
                const bundle = wasmBundleFromBase64(data);
                if (bundle){
                    this.onBundle(bundle);
                    return;
                }
            }
        }

        console.warn("Falling back to plaintext unbundled json when processing dev server data.")

        // Not base64, fallback to plaintext, unbundled json
        const bundle = wasmBundle(data).bundle; //Discard the errors for now
		if(bundle){
            // Add a deprecation warning
            bundle._route.splice(0,0,"(?=) There is a newer version of devtool.");
            this.onBundle(bundle);
        }else{
            this.onError("Failed to parse data from dev server");
        }
    }
}

const isBase64 = (data: string): boolean => {
    //https://stackoverflow.com/questions/475074/regex-to-parse-or-validate-base64-data
    return /^(?:[A-Za-z0-9+\/]{4})*(?:[A-Za-z0-9+\/]{2}==|[A-Za-z0-9+\/]{3}=|[A-Za-z0-9+\/]{4})$/.test(data)
}