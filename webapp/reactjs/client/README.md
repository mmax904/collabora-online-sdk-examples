# Getting Started with Create React App

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

## Available Scripts

In the project directory, you can run:

### `npm start`

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

The page will reload if you make edits.\
You will also see any lint errors in the console.

### `npm test`

Launches the test runner in the interactive watch mode.\
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

### `npm run build`

Builds the app for production to the `build` folder.\
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.\
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

### `npm run eject`

**Note: this is a one-way operation. Once you `eject`, you can’t go back!**

If you aren’t satisfied with the build tool and configuration choices, you can `eject` at any time. This command will remove the single build dependency from your project.

Instead, it will copy all the configuration files and the transitive dependencies (webpack, Babel, ESLint, etc) right into your project so you have full control over them. All of the commands except `eject` will still work, but they will point to the copied scripts so you can tweak them. At this point you’re on your own.

You don’t have to ever use `eject`. The curated feature set is suitable for small and middle deployments, and you shouldn’t feel obligated to use this feature. However we understand that this tool wouldn’t be useful if you couldn’t customize it when you are ready for it.

## Learn More

You can learn more in the [Create React App documentation](https://facebook.github.io/create-react-app/docs/getting-started).

To learn React, check out the [React documentation](https://reactjs.org/).



### I want to add docx editor on web, which will read doc file from s3 and can track changes, what are the best options available

WOPI: Web Application Open Platform Interface Protocol

https://learn.microsoft.com/en-us/microsoft-365/cloud-storage-partner-program/online/apply-for-cspp-program

https://learn.microsoft.com/en-us/microsoft-365/cloud-storage-partner-program/online/build-test-ship/environments
<action name="view" ext="docx" default="true" urlsrc="https://word-view.officeapps.live.com/wv/wordviewerframe.aspx?<ui=UI_LLCC&><rs=DC_LLCC&><dchat=DISABLE_CHAT&><hid=HOST_SESSION_ID&><sc=SESSION_CONTEXT&><wopisrc=WOPI_SOURCE&><showpagestats=PERFSTATS&><IsLicensedUser=BUSINESS_USER&><actnavid=ACTIVITY_NAVIGATION_ID&>"/>
https://word-view.officeapps.live.com/wv/wordviewerframe.aspx?wopisrc=https%3A%2F%2Frelaxed-elk-sincerely.ngrok-free.app%2Fwopi%2Ffiles%2F123


<action name="view" ext="docx" default="true" urlsrc="https://FFC-word-view.officeapps.live.com/wv/wordviewerframe.aspx?<ui=UI_LLCC&><rs=DC_LLCC&><dchat=DISABLE_CHAT&><hid=HOST_SESSION_ID&><sc=SESSION_CONTEXT&><wopisrc=WOPI_SOURCE&><showpagestats=PERFSTATS&><IsLicensedUser=BUSINESS_USER&><actnavid=ACTIVITY_NAVIGATION_ID&>"/>
https://FFC-word-view.officeapps.live.com/wv/wordviewerframe.aspx?wopisrc=https%3A%2F%2Frelaxed-elk-sincerely.ngrok-free.app%2Fwopi%2Ffiles%2F123


https://learn.microsoft.com/en-us/microsoft-365/cloud-storage-partner-program/rest/

https://learn.microsoft.com/en-us/openspecs/office_protocols/ms-wopi/0f0bf842-6353-49ed-91c0-c9d672f21200?redirectedfrom=MSDN

https://sdk.collaboraonline.com/docs/faq.html#can-i-host-your-product-on-my-own-environment


ngrok http 3000 --host-header="localhost:3000"
ngrok http 3001 --host-header="localhost:3001"
ngrok http --host-header=rewrite 3000

ngrok http https://localhost:3001 --host-header="localhost:3001"

ngrok http https://localhost:3001 // when using ssl is used in nodejs



ngrok start --config ngrok.yml --all

ngrok.yml
=========
version: "2"
authtoken: 1S4UgJnJ3jBDtX5gWmuizv0MpyK_5oqeDAB7pwoh94HuvZXGG
tunnels:
  wopi:
    proto: http
    addr: https://localhost:3001
    # domain: relaxed-elk-sincerely.ngrok-free.app
    hostname: relaxed-elk-sincerely.ngrok-free.app
    host_header: localhost:3001
  collabora:
    proto: http
    addr: https://localhost:9980
    # domain: relaxed-elk-sincerely.ngrok-free.app
    # hostname: relaxed-elk-sincerely.ngrok-free.app
    # host_header: localhost:9980
  collabora-web:
    proto: http
    addr: https://localhost:3000
    # domain: relaxed-elk-sincerely.ngrok-free.app
    # hostname: relaxed-elk-sincerely.ngrok-free.app
    host_header: localhost:3000

docker run -t -d -p 9980:9980 --name "collabora-demo" -e "aliasgroup1=https://09c9-106-214-69-188.ngrok-free.app:443" -e "domain=*" -e "username=admin" -e "password=admin" -e "extra_params=--o:ssl.enable=false" collabora/code

docker run -t -d -p 9980:9980 --name "collabora-demo" -e "aliasgroup1=https://bf45-106-214-69-188.ngrok-free.app:443" -e "domain=*" -e "username=admin" -e "password=admin" -e "extra_params=--o:ssl.enable=false" collabora/code

docker run -t -d -p 9980:9980 --name "collabora-demo" -e "aliasgroup1=https://relaxed-elk-sincerely.ngrok-free.app:443" -e "aliasgroup2=https://e135-106-214-69-188.ngrok-free.app:443" -e "domain=*" -e "username=admin" -e "password=admin" collabora/code

docker run -t -d -p 9980:9980 --name "collabora-demo-non-ssl" -e "aliasgroup1=https://relaxed-elk-sincerely.ngrok-free.app:443" -e "domain=*" -e "username=admin" -e "password=admin" -e "extra_params=--o:ssl.enable=false" collabora/code

It is to be noted that as mentioned in WOPI specs, Collabora Online frame will ignore all post messages coming from the host frame if Host_PostmessageReady has not been received. Further, since for embedding Collabora Online as an iframe WOPI implementation is a must, it is required that PostMessageOrigin property is present in WOPI host’s CheckFileInfo response. Otherwise, no post messages will be emitted.

Refused to frame 'https://demo.eu.collaboraonline.com/' because an ancestor violates the following Content Security Policy directive: "frame-ancestors demo.eu.collaboraonline.com:* bf45-106-214-69-188.ngrok-free.app:*".

// form has target property which is id of iframe hence when form is posted it load in iframe

package.json
"proxy": "http://localhost:3001/",

https://www.collaboraoffice.com/demo-servers.json

http://localhost:9980/hosting/discovery

http://localhost:9980/browser/dist/admin/admin.html

https://github.com/mikeebowen/node-wopi-server/blob/main/src/app/WopiServer.ts

https://www.altcademy.com/blog/how-to-enable-https-in-reactjs/#:~:text=Implementing%20HTTPS%20in%20ReactJS,-Now%20that%20we&text=By%20default%2C%20it%20uses%20HTTP,tweaking%20the%20npm%20start%20script.&text=Here%2C%20HTTPS%3Dtrue%20tells%20the,key%20files%20we%20generated%20earlier.

https://akshitb.medium.com/how-to-run-https-on-localhost-a-step-by-step-guide-c61fde893771

https://stackoverflow.com/questions/45088006/nodejs-error-self-signed-certificate-in-certificate-chain

https://stackoverflow.com/questions/50107816/react-proxy-error-could-not-proxy-request-api-from-localhost3000-to-http-l

https://medium.com/@TinaHeiligers1/localhost-on-https-my-domain-on-a-mac-c2f1a98d65a6

https://forum.seafile.com/t/collabora-code-not-working-wopi-not-found-unauthorized/16236/6

https://stackoverflow.com/questions/39062025/wopi-host-implementation-in-nodejs/39186295


https://setapp.com/how-to/edit-mac-hosts-file


https://sdk.collaboraonline.com/docs/How_to_integrate.html#re-using-our-development-demo-servers

https://sdk.collaboraonline.com/docs/introduction.html



WOPI Docs
=========

https://learn.microsoft.com/en-us/microsoft-365/cloud-storage-partner-program/online/scenarios/postmessage

https://learn.microsoft.com/en-us/microsoft-365/cloud-storage-partner-program/rest/endpoints

https://learn.microsoft.com/en-us/microsoft-365/cloud-storage-partner-program/rest/files/putrelativefile

https://learn.microsoft.com/en-us/microsoft-365/cloud-storage-partner-program/rest/endpoints#file-contents-endpoint

https://learn.microsoft.com/en-us/microsoft-365/cloud-storage-partner-program/rest/files/checkfileinfo/checkfileinfo-response

https://learn.microsoft.com/en-us/microsoft-365/cloud-storage-partner-program/rest/files/checkfileinfo/checkfileinfo-response#usercannotwriterelative

https://learn.microsoft.com/en-us/microsoft-365/cloud-storage-partner-program/rest/files/checkfileinfo/checkfileinfo-response#supportsupdate

https://datatracker.ietf.org/doc/html/rfc4627.html


Errors:
========
Refused to frame 'https://d58f-106-214-69-188.ngrok-free.app/' because an ancestor violates the following Content Security Policy directive: "frame-ancestors d58f-106-214-69-188.ngrok-free.app:* relaxed-elk-sincerely.ngrok-free.app:*".


https://www.w3.org/TR/CSP2/
https://github.com/CollaboraOnline/online/blob/master/docker/README


InsertButton: 8.12
https://www.youtube.com/watch?v=H7HfbZBycRU&t=438s
https://collaboraonline.github.io/docs/#grab-the-code

For Demo:
=========
https://learn.microsoft.com/en-us/microsoft-365/cloud-storage-partner-program/online/apply-for-cspp-program


node-http-handler@3.1.1 for MaxListenersExceededWarning: Possible EventEmitter memory leak detected. 11 close listeners added to [TLSSocket]. Use emitter.setMaxListeners() to increase limit in s3-client