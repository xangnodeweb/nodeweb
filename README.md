# nodeweb

## api 1 inquery body  xml 
* field parameter | format phone  field value Msisdn == 856205xxxxxxx
  | Msisdn |
  |--------|
  |856205xxxxxxx|

 <soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:web="http://vsmp.ais.co.th/webservices/">
    <soapenv:Header/>
    <soapenv:Body>
       <web:inquiryCounter>
          <!--Optional:-->
          <web:Username>Mservice</web:Username>
          <!--Optional:-->
          <web:OrderRef>test</web:OrderRef>
          <!--Optional:-->
          <web:OrderDesc>test</web:OrderDesc>
          <!--Optional:-->
          <web:Msisdn>${phone}</web:Msisdn>
          <!--Optional:-->
          <web:ProductNo></web:ProductNo>
       </web:inquiryCounter>
    </soapenv:Body>
 </soapenv:Envelope>

____________________________________________________________

## api 2 modifield one phone
* field parameter == Msisdn , ProductNo , ExpiryTime , RefillStopTime

|   Msisdn    |ProductNo|ExpiryTime|RefillStopTime|
|-------------|---------|----------|--------------|
|856205xxxxxxx|  1001   |2024-11-05|  2024-11-05  |

* add header field parameter ==>  Content-Type = text/xml;charset=utf-8


<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:web="http://vsmp.ais.co.th/webservices/">
   <soapenv:Header/>
   <soapenv:Body>
      <web:AddCounter>
         <!--Optional:-->
         <web:Username>vansana</web:Username>
         <!--Optional:-->
         <web:OrderRef>0307564</web:OrderRef>
         <!--Optional:-->
         <web:OrderDesc>0307564</web:OrderDesc>
         <!--Optional:-->
         <web:Msisdn>${phone}</web:Msisdn>
         <!--Optional:-->
         <web:CounterName>${countername}</web:CounterName>
         <!--Optional:-->
         <web:RefillStopTime>${refillstoptime}T23:59:59.0000000+07:00</web:RefillStopTime>
         <!--Optional:-->
         <web:StartTime>${starttime}T00:00:00.0000000+07:00</web:StartTime>
         <!--Optional:-->
         <web:ExpiryTime>${expiretime}T23:59:59.0000000+07:00</web:ExpiryTime>
         <!--Optional:-->
         <web:CounterState></web:CounterState>
         <!--Optional:-->
         <web:ReplenishValue></web:ReplenishValue>
      </web:AddCounter>
   </soapenv:Body>
</soapenv:Envelope>

### api 3 addpackage one phone

* field parameter ==> Msisdn , CounterName , RefillStopTime , StartTime , ExpiryTime 
* option package == Prepaid_Staff_3GB, Prepaid_Staff_5GB,Prepaid_Staff_10GB,Prepaid_Staff 15GB , Package Promotion 3GB/24hour , 5G LTC Staff
* package Prepaid_Staff 15GB string not have _
<p align="center">
  
|    Msisdn   |     CounterName   |            RefillStopTime       |              StartTime            |          ExpiryTime               |
|-------------|-------------------|---------------------------------|-----------------------------------|-----------------------------------|
|856205xxxxxxx| Prepaid_Staff_3GB |2030-11-05T23:59:59.0000000+07:00| 2024-11-05T00:00:00.0000000+07:00 | 2024-11-30T23:59:59.0000000+07:00 |
</p>

<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:web="http://vsmp.ais.co.th/webservices/">
   <soapenv:Header/>
   <soapenv:Body>
      <web:AddCounter>
         <!--Optional:-->
         <web:Username>vansana</web:Username>
         <!--Optional:-->
         <web:OrderRef>0307564</web:OrderRef>
         <!--Optional:-->
         <web:OrderDesc>0307564</web:OrderDesc>
         <!--Optional:-->
         <web:Msisdn>${phone}</web:Msisdn>
         <!--Optional:-->
         <web:CounterName>${countername}</web:CounterName>
         <!--Optional:-->
         <web:RefillStopTime>${refillstoptime}T23:59:59.0000000+07:00</web:RefillStopTime>
         <!--Optional:-->
         <web:StartTime>${starttime}T00:00:00.0000000+07:00</web:StartTime>
         <!--Optional:-->
         <web:ExpiryTime>${expiretime}T23:59:59.0000000+07:00</web:ExpiryTime>
         <!--Optional:-->
         <web:CounterState></web:CounterState>
         <!--Optional:-->
         <web:ReplenishValue></web:ReplenishValue>
      </web:AddCounter>
   </soapenv:Body>
</soapenv:Envelope>

### api 4 modify package hour promotion
# body request modifield Package Promotion =>  Msisdn, ProductNumber, StartTime , ExpiryTime
# it have field StartTime is package Promotion 24 hour.