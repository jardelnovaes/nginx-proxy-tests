# NGINX Proxy Tests
Just some tests using NGINX as reverse proxy and first level cliente authentication.

### Running "Background service/api"
It's a simple dummy API just to represent a real service/api.  
To run it:  
```bash
cd api_serice
yarn start

#or 
npm start

# or
node app.js
```

### Using Client Cert + Api-Key
NGINX will validade the client "HTTPS" certificate on a "Mutual TLS Connection" and will by pass the api-key to the "background service/api"  

  
**Correct api-key:** ZTA3YjZkOWMtMjhjZi0xMWViLWFkZTEtMDA1MDU2OGY2NDBl  
**Correct Client "HTTPS" Certificate:** company_xpto.crt  

a) Using correct certificate and api-key
```bash
curl -k -i --cert certs/company_xpto.crt --key certs/company_xpto.key -H "api-key: ZTA3YjZkOWMtMjhjZi0xMWViLWFkZTEtMDA1MDU2OGY2NDBl" https://172.18.15.19/test-cert-and-api-key
```
Excepted Result:
```
HTTP/1.1 200 OK
[...]
Keep-Alive: timeout=5

*** You are in! ***
```

b) Using correct certificate and wrong api-key
```bash
curl -k -i --cert certs/company_xpto.crt --key certs/company_xpto.key -H "api-key: d3JvbmctYXBpLWtleS13cm9uZy1hcGkta2V5d3JvbmctYXA" https://172.18.15.19/test-cert-and-api-key
```
Excepted Result:
```
HTTP/1.1 401 Unauthorized
[...]
Keep-Alive: timeout=5

### Oops! ###
```

c) Using wrong certificate and correct api-key
```bash
curl -k -i --cert certs/other_company.crt --key certs/other_company.key -H "api-key: ZTA3YjZkOWMtMjhjZi0xMWViLWFkZTEtMDA1MDU2OGY2NDBl" https://172.18.15.19/test-cert-and-api-key
```
Excepted Result:
```
HTTP/1.1 400 Bad Request
[...]
Connection: close

<html>
<head><title>400 The SSL certificate error</title></head>
<body>
<center><h1>400 Bad Request</h1></center>
<center>The SSL certificate error</center>
<hr><center>nginx/1.18.0 (Ubuntu)</center>
</body>
</html>
```

d) Using wrong certificate and api-key
```bash
curl -k -i --cert certs/other_company.crt --key certs/other_company.key -H "api-key: d3JvbmctYXBpLWtleS13cm9uZy1hcGkta2V5d3JvbmctYXA" https://172.18.15.19/test-cert-and-api-key
```
Excepted Result:
```
HTTP/1.1 400 Bad Request
[...]
Connection: close

<html>
<head><title>400 The SSL certificate error</title></head>
<body>
<center><h1>400 Bad Request</h1></center>
<center>The SSL certificate error</center>
<hr><center>nginx/1.18.0 (Ubuntu)</center>
</body>
</html>
```

e) Without a certificate and correct api-key
```bash
curl -k -i -H "api-key: ZTA3YjZkOWMtMjhjZi0xMWViLWFkZTEtMDA1MDU2OGY2NDBl" https://172.18.15.19/test-cert-and-api-key
```
Excepted Result:
```
HTTP/1.1 401 Unauthorized
[...]
Connection: keep-alive

<html>
<head><title>401 Authorization Required</title></head>
<body>
<center><h1>401 Authorization Required</h1></center>
<hr><center>nginx/1.18.0 (Ubuntu)</center>
</body>
</html>
```
