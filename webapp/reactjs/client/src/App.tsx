import React from 'react';
import './App.css';
import ServerAddressForm from './ServerAddressForm'
import LoaderForm from './LoaderForm'
// import DiffTool from './DiffTool';
import DiffViewer from './DiffViewer';

const collaboraHost = 'https://445e-171-76-36-114.ngrok-free.app';
const wopiHost = 'https://relaxed-elk-sincerely.ngrok-free.app';

class App extends React.Component<any, any> {
    constructor(props: any) {
        super(props);
        this.handleInputChanged = this.handleInputChanged.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        const myArray = new Uint32Array(10);
        crypto.getRandomValues(myArray);
        this.state = {
            serverAddress: collaboraHost,
            // serverAddress: 'https://localhost:9980',
            // serverAddress: 'https://demo.eu.collaboraonline.com',
            startLoading: false,
            wopiUrl: '',
            token: '',
            // fileId: myArray[0]
            fileId: 123
        };

        const handleSaveEvent = async (event: any) => {
            const msg = typeof event.data === 'string' ? JSON.parse(event.data): event.data;

            if (msg.MessageId === 'App_LoadingStatus') {
				if (msg.Values) {
					if (msg.Values.Status === 'Document_Loaded') {
						console.log('==== Document loaded ...init viewer...');
						var iframe = document.getElementById('collabora-online-viewer');
                        iframe = iframe.contentWindow || (iframe.contentDocument.document || iframe.contentDocument);									                   
                        iframe.postMessage(JSON.stringify({ 'MessageId': 'Host_PostmessageReady' }), '*');

					}
				}
				
			}
            if(msg.MessageId === 'UI_SaveAs'){
                const msg2={
                        "MessageId":'Action_SaveAs',
                        "SendTime":Date.now(),
                        "Values": {
                            "Filename": '123.docx',
                            "Notify":true
                        }
                    }
                    let iframe = document.getElementById('collabora-online-viewer');
                    // iframe = iframe.contentWindow || iframe.contentDocument.document || iframe.contentDocument;
                    iframe = iframe.contentWindow || iframe.contentDocument.document || iframe.contentDocument;
                    iframe.postMessage(JSON.stringify(msg2) ,'*');
                // iframeRef.current.contentWindow.postMessage(JSON.stringify(msg2) ,'*');
            }
        };
    
        window.addEventListener('message', handleSaveEvent, false);
        
        // useEffect(() => {
        //     const handleSaveEvent = async (event) => {
        //       if (event.origin !== 'https://demo.eu.collaboraonline.com') return;
        
        //       const message = event.data;
        //       if (message.type === 'loolsave') {
        //         const content = message.content;
        //         await handleSaveFile(content);
        //       }
        //     };
        
        //     window.addEventListener('message', handleSaveEvent);
        
        //     return () => {
        //       window.removeEventListener('message', handleSaveEvent);
        //     };
        //   }, [fileUrl]);
        
    }
    handleInputChanged(address: string) {
         this.setState({serverAddress: address});
    }

    handleSubmit() {
        const wopiClientHost = this.state.serverAddress;
        const locationOrigin = wopiHost;
        // const locationOrigin = 'http://localhost:3001';
        // const locationOrigin = 'https://localhost:3001';
        const wopiSrc =  `${locationOrigin}/wopi/files/${this.state.fileId}`;
        // const wopiSrc =  'https://staging-23.s3.us-east-1.amazonaws.com/64f992f2f1d658840ebbe716/actual/Resume%20Info%20%281%29.docx?response-content-disposition=inline&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEHUaCXVzLWVhc3QtMSJHMEUCIB6TpSkWyeIajH28KhYIly3zZECCNiwiViXPrpagoFFtAiEAoT8h0y%2FS8ao8vq2dGBD3bUqOndz6ddPP8KoyzWnDmYwq6AIILhABGgw5NjE3MDcwNTQ4MzAiDIn74nqBWUFoPNiHfSrFAqcploLWFDTvADRk6Yk8L0W1FiNbeNuwoOOxUzM3D6pyHCpqhYFYs3Qf2hJaQKl2QL05WQl7DjM9i5P1BAw%2FkIy1n9GqMuvOL0C%2FJ%2BDq9dY11VqjXncimPWYmqHCutmrQ3Hzwt4AAm%2F0VwMlDB8F%2FHmn9irKgtlygYX7cayIy%2FzXoU6wogHW%2BWMqkJLIUiqXJAguBM3Syab%2BN0B4H7etpEsJCzJaXisxxOHe%2FYervjOenEGgCG3XIw0mMjvBc9Y5%2BEp0fmpI07jYuTyRTjrn1ixC0YzZCoGBIMrEsWcWy72Cw5Y53s5t9EXiPx9y2Ou%2BiwkqJgwx9%2FhZhFUKu3Us2qKKfQLfaCaLNDfvV2kfPupp8lY7e6cRk4Pnhwnutra3DIy5QzJyeXhllZhaoDSioi9LKJwkq4NE%2F3AuOPH7MCPQgfcl%2BKQwpIeAtAY6swLQq3WEnGwN5qAuwTvsjj52W5AZ7boI0t9SYCL8cHwz3pVxJ1wCwDopTDSS%2BK0diqd7YK07RLOsKAR%2Bl5vzXRg%2BknOeSldplfl6D4xfAWRuCEIDg9SW0G09CEiA9d9POsuici6OxP1tYUrCMCmYAO2zjOxD3wECff8Y2LidkmBDMgGg2BOxZi7rj2cwlXJC6rq4cvDTYyhJi5WqIbB617mfmIxRfIQtpmsFe4uXDgKDKK2R9uCvbf0oakJnRuxViUWsVBibkjYqRu5ndpdxslhN3WedsODLZJ34E%2BKynhBZgdmtUBE2JKSbHZauVfm%2BNaJfGre8%2F1P49YntPPrOOgugglTAl9pqde%2B2bXwTXuK39JxTgyaP%2BF6e1ZcIXo5h7XGF48I8KC5zTgJHumQcBekmO3KE&X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Date=20240629T125539Z&X-Amz-SignedHeaders=host&X-Amz-Expires=43200&X-Amz-Credential=ASIA572RVC3XBSSOEBUT%2F20240629%2Fus-east-1%2Fs3%2Faws4_request&X-Amz-Signature=1b2d2199357f29814774ea7a476928d022c66eff1f1447b083fe0b7699230cf4';
        const collaboraUrl = `${locationOrigin}/collaboraUrl?server=${wopiClientHost}&postMessageOrigin=${window.location.origin}`;
        console.log(collaboraUrl)
        fetch(collaboraUrl)
            .then(response => response.json())
            .then(data => {
                const wopiClientUrl = data.url
                const accessToken = data.token;
                const wopiUrl = `${wopiClientUrl}WOPISrc=${encodeURIComponent(wopiSrc)}`;
                console.log(`wopiUrl: ${wopiUrl}`)
                this.setState({
                    startLoading: true,
                    wopiUrl: wopiUrl,
                    token: accessToken
                })
            })
    }

    componentDidUpdate() {
        if (this.state.startLoading) {
            this.setState({startLoading: false})
        }
    }

    render() {
        let loaderForm;
        if (this.state.startLoading) {
            loaderForm = <LoaderForm
                url={this.state.wopiUrl}
                token={this.state.token}
            />
        }

        return (
            <div className="App">
                <DiffViewer />
                <ServerAddressForm
                    address={this.state.serverAddress}
                    onChange={this.handleInputChanged}
                    onSubmit={this.handleSubmit}/>
                {loaderForm}
                <iframe 
                    id="collabora-online-viewer"
                    title="Collabora Online Viewer"
                    name="collabora-online-viewer"
                    allow="clipboard-read *; clipboard-write *">
                </iframe>
            </div>
        );
    }
}

export default App;
