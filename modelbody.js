
exports.bodyinquery = async (phone) => {
    try {

        const bodys = `<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:web="http://vsmp.ais.co.th/webservices/">
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
 </soapenv:Envelope>`;
        return bodys

    } catch (error) {
        console.log(error)
    }

}


exports.bodymodiefield = (phone, productno, expire) => {
    try {

        const bodys = `<soap:Envelope xmlns:soap="http://www.w3.org/2003/05/soap-envelope" xmlns:web="http://vsmp.ais.co.th/webservices/">
   <soap:Header/>
   <soap:Body>
      <web:modifyCounter>
         <!--Optional:-->
         <web:Username>vansana</web:Username>
         <!--Optional:-->
         <web:OrderRef>test</web:OrderRef>
         <!--Optional:-->
         <web:OrderDesc>migrateexpdate</web:OrderDesc>
         <!--Optional:-->
         <web:Msisdn>${phone}</web:Msisdn>
         <!--Optional:-->
         <web:ProductNo>${productno}</web:ProductNo>
         <!--Optional:-->
         <web:ExpiryRecurringFlag></web:ExpiryRecurringFlag>
         <!--Optional:-->
         <web:ExpiryTime>${expire}T23:59:59.0700000+07:00</web:ExpiryTime>
         <!--Optional:-->
         <web:StartTime></web:StartTime>
         <!--Optional:-->
         <web:CounterState></web:CounterState>
         <!--Optional:-->
         <web:RefillStopTime>${expire}T23:59:59.0700000+07:00</web:RefillStopTime>
      </web:modifyCounter>
   </soap:Body>
</soap:Envelope>`
        {/* <web:ExpiryTime>2024-10-30T23:59:59.0700000+07:00</web:ExpiryTime> */ }


        return bodys;
    } catch (error) {
        console.log(error)
    }

}

exports.bodyaddpackage = async (phone, countername, starttime, expiretime , refillstoptime) => {
    try {
        const body = `<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:web="http://vsmp.ais.co.th/webservices/">
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
</soapenv:Envelope>`

        return body;

    } catch (error) {
        console.log(error)
    }

}