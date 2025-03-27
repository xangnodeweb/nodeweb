
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

exports.bodyaddpackage = async (Msisdn, countername, starttime, expiretime, refillstoptime) => {
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
         <web:Msisdn>${Msisdn}</web:Msisdn>
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
exports.bodymodiefieldhours = (phone, productno, starttime, expire) => {
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
         <web:StartTime>${starttime}T00:00:00.0000000+07:00</web:StartTime>
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



exports.changemainoffering = async (phone, offeringold, offeringnew, msgseq) => {
   try {

      const dates = `"${"yyyyMMddHHmmss"}"`
      const datess = `(new java.text.SimpleDateFormat(${dates}`

      const messageone = ")).format(new Date())}"
      // ${=(new java.text.SimpleDateFormat("yyyyMMddHHmmss")).format(new Date())}${=(int)(Math.random()*1000)}
      const message = "${=(int)(Math.random()*1000)}"
      const datadateformat = "${=" + datess + "" + messageone + message
      // console.log(datadateformat)
      const data = `<?xml version="1.0" encoding="UTF-8"?>
<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:bcs="http://www.huawei.com/bme/cbsinterface/bcservices" xmlns:cbs="http://www.huawei.com/bme/cbsinterface/cbscommon" xmlns:bcc="http://www.huawei.com/bme/cbsinterface/bccommon">
   <soapenv:Header/>
   <soapenv:Body>
      <bcs:ChangeSubOfferingRequestMsg>
         <RequestHeader>
            <cbs:Version>1</cbs:Version>
            <cbs:BusinessCode>ChangeSubOffering</cbs:BusinessCode>
            <cbs:MessageSeq>${msgseq}</cbs:MessageSeq>
            <cbs:AccessSecurity>
               <cbs:LoginSystemCode>APIGEEAPI</cbs:LoginSystemCode>
               <cbs:Password>cdVOUWF+57KsMd57vH8D3H+ykq4CbeLtc8wCapSScPhjazQDDuTrFUP4sDBpyX+q</cbs:Password>
            </cbs:AccessSecurity>
         </RequestHeader>
         <ChangeSubOfferingRequest>
           <bcs:SubAccessCode>
                <bcc:PrimaryIdentity>${phone}</bcc:PrimaryIdentity>
             </bcs:SubAccessCode>
           <bcs:PrimaryOffering>
               <bcs:OldPrimaryOffering>
                  <bcc:OfferingID>${offeringold}</bcc:OfferingID>
               </bcs:OldPrimaryOffering>
               <bcs:NewPrimaryOffering>
                  <bcc:OfferingKey>
                     <bcc:OfferingID>${offeringnew}</bcc:OfferingID>
                  </bcc:OfferingKey>
               </bcs:NewPrimaryOffering>
               <bcs:EffectiveTime>
                  <bcc:Mode>I</bcc:Mode>
               </bcs:EffectiveTime>
            </bcs:PrimaryOffering>
         </ChangeSubOfferingRequest>
      </bcs:ChangeSubOfferingRequestMsg>
   </soapenv:Body>
</soapenv:Envelope>`;

      return data;

   } catch (error) {
      console.log(error)
   }
}





exports.changemaxdate = (phone, balancevalue, dayvalue) => {
   try {

      const dates = `"${"yyyyMMddHHmmss"}"`
      const datess = `(new java.text.SimpleDateFormat(${dates}`
      const messageone = ")).format(new Date())}"
      const message = "${=(int)(Math.random()*1000)}"
      const datadateformat = "${=" + datess + "" + messageone + message
      // ${=(new java.text.SimpleDateFormat("yyyyMMddHHmmss")).format(new Date())}${=(int)(Math.random()*1000)}
      const data = `<?xml version="1.0" encoding="UTF-8"?>                                                                                                                                                                                                                             
<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:bcs="http://www.huawei.com/bme/cbsinterface/bcservices" xmlns:cbs="http://www.huawei.com/bme/cbsinterface/cbscommon" xmlns:bcc="http://www.huawei.com/bme/cbsinterface/bccommon">
   <soapenv:Header/>                                                                                                                                                                                                                                               
   <soapenv:Body>                                                                                                                                                                                                                                                  
      <bcs:ChangeSubInfoRequestMsg>                                                                                                                                                                                                                                
         <RequestHeader>                                                                                                                                                                                                                                           
            <cbs:Version>1</cbs:Version>                                                                                                                                                                                                                           
            <cbs:BusinessCode>ChangeSubInfo</cbs:BusinessCode>                                                                                                                                                                                                     
            <cbs:MessageSeq>${datadateformat}</cbs:MessageSeq>                                                                                                                
            <cbs:AccessSecurity>                                                                                                                                                                                                                                   
               <cbs:LoginSystemCode>APIGEEAPI</cbs:LoginSystemCode>                                                                                                                                                                                                
               <cbs:Password>cdVOUWF+57KsMd57vH8D3H+ykq4CbeLtc8wCapSScPhjazQDDuTrFUP4sDBpyX+q</cbs:Password>                                                                                                                                                       
            </cbs:AccessSecurity>                                                                                                                                                                                                                                  
         </RequestHeader>                                                                                                                                                                                                                                          
         <ChangeSubInfoRequest>                                                                                                                                                                                                                                    
            <bcs:SubAccessCode>                                                                                                                                                                                                                                    
              <bcc:PrimaryIdentity>${phone}</bcc:PrimaryIdentity>                                                                                                                                                                                                
            </bcs:SubAccessCode>                                                                                                                                                                                                                                   
            <bcs:SubBasicInfo>                                                                                                                                                                                                                                     
              <bcc:SubProperty>                                                                                                                                                                                                                                    
                  <bcc:Code>C_SUB_MAX_BALANCE</bcc:Code>                                                                                                                                                                                                           
                  <bcc:Value>${balancevalue}</bcc:Value>                                                                                                                                                                                                                          
               </bcc:SubProperty>                                                                                                                                                                                                                                  
               <bcc:SubProperty>                                                                                                                                                                                                                                   
                  <bcc:Code>C_SUB_MAX_VALIDITY</bcc:Code>                                                                                                                                                                                                          
                  <bcc:Value>${dayvalue}</bcc:Value>                                                                                                                                                                                                                       
               </bcc:SubProperty>                                                                                                                                                                                                                                  
            </bcs:SubBasicInfo>                                                                                                                                                                                                                                    
         </ChangeSubInfoRequest>                                                                                                                                                                                                                                   
      </bcs:ChangeSubInfoRequestMsg>                                                                                                                                                                                                                               
   </soapenv:Body>                                                                                                                                                                                                                                                 
</soapenv:Envelope>`;

      return data;

   } catch (error) {
      console.log(error)
   }
}

exports.bodysetvalidity = (phone, validityincrement) => {
   try {
      const dates = `"${"yyyyMMddHHmmss"}"`
      const datess = `(new java.text.SimpleDateFormat(${dates}`
      const messageone = ")).format(new Date())}"
      const message = "${=(int)(Math.random()*1000)}"
      const datadateformat = "${=" + datess + "" + messageone + message;

      const data = `<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:bcs="http://www.huawei.com/bme/cbsinterface/bcservices" xmlns:cbs="http://www.huawei.com/bme/cbsinterface/cbscommon" xmlns:bcc="http://www.huawei.com/bme/cbsinterface/bccommon">
   <soapenv:Header/>
   <soapenv:Body>
      <bcs:ChangeSubValidityRequestMsg>
        <RequestHeader>
            <cbs:Version>1</cbs:Version>
            <cbs:BusinessCode>ChangeSubValidity</cbs:BusinessCode>
            <cbs:MessageSeq>${datadateformat}</cbs:MessageSeq>
            <cbs:AccessSecurity>
               <cbs:LoginSystemCode>APIGEEAPI</cbs:LoginSystemCode>
               <cbs:Password>cdVOUWF+57KsMd57vH8D3H+ykq4CbeLtc8wCapSScPhjazQDDuTrFUP4sDBpyX+q</cbs:Password>             
            </cbs:AccessSecurity>       
         </RequestHeader>
         <ChangeSubValidityRequest>
            <bcs:SubAccessCode>           
               <bcc:PrimaryIdentity>${phone}</bcc:PrimaryIdentity>
            </bcs:SubAccessCode>
            <bcs:OpType>2</bcs:OpType>
            <bcs:ValidityIncrement>${validityincrement}</bcs:ValidityIncrement>
         </ChangeSubValidityRequest>
      </bcs:ChangeSubValidityRequestMsg>
   </soapenv:Body>
</soapenv:Envelope>`

      return data;

   } catch (error) {
      console.log(error)
   }
}

exports.querybalance = async (phone, uuid) => {
   try {

      const dates = `"${"yyyyMMddHHmmss"}"`
      const datess = `(new java.text.SimpleDateFormat(${dates}`

      const messageone = ")).format(new Date())}"
      // ${=(new java.text.SimpleDateFormat("yyyyMMddHHmmss")).format(new Date())}${=(int)(Math.random()*1000)}
      const message = "${=(int)(Math.random()*1000)}"
      const datadateformat = "${=" + datess + "" + messageone + message
      // console.log(datadateformat)
      const data = `<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:ars="http://www.huawei.com/bme/cbsinterface/arservices" xmlns:cbs="http://www.huawei.com/bme/cbsinterface/cbscommon" xmlns:arc="http://cbs.huawei.com/ar/wsservice/arcommon">
   <soapenv:Header/>
   <soapenv:Body>
      <ars:QueryBalanceRequestMsg>
         <RequestHeader>
            <cbs:Version>1</cbs:Version>
            <cbs:BusinessCode>Query Balance</cbs:BusinessCode>
            <cbs:MessageSeq>${uuid}</cbs:MessageSeq>
            <cbs:AccessSecurity>
               <cbs:LoginSystemCode>APIGEEAPI</cbs:LoginSystemCode>
               <cbs:Password>cdVOUWF+57KsMd57vH8D3H+ykq4CbeLtc8wCapSScPhjazQDDuTrFUP4sDBpyX+q</cbs:Password>
            </cbs:AccessSecurity>
         </RequestHeader>
         <QueryBalanceRequest>
            <ars:QueryObj>
               <ars:SubAccessCode>
                  <arc:PrimaryIdentity>${phone}</arc:PrimaryIdentity>
               </ars:SubAccessCode>
            </ars:QueryObj>
          <ars:BalanceType>C_MAIN_ACCOUNT</ars:BalanceType>
         </QueryBalanceRequest>
      </ars:QueryBalanceRequestMsg>
   </soapenv:Body>
</soapenv:Envelope>`
      return data;

   } catch (error) {
      console.log(error)
   }
}


exports.addpackagebody = async (phone, countername, refilltoptime ,userid) => {

   try {


      const data = `<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:web="http://vsmp.ais.co.th/webservices/">
   <soapenv:Header/>
   <soapenv:Body>
      <web:AddCounter>
         <!--Optional:-->
         <web:Username>ISD</web:Username>
         <!--Optional:-->
         <web:OrderRef>Test00001</web:OrderRef>
         <!--Optional:-->
         <web:OrderDesc>TestDatausage</web:OrderDesc>
         <!--Optional:-->
         <web:Msisdn>${phone}</web:Msisdn>
         <!--Optional:-->
         <web:CounterName>${countername}</web:CounterName>
         <!--Optional:-->
         <web:RefillStopTime>${refilltoptime}T23:59:59.0000000+07:00</web:RefillStopTime>
         <!--Optional:-->
         <web:StartTime></web:StartTime>
         <!--Optional:-->
         <web:ExpiryTime></web:ExpiryTime>
         <!--Optional:-->
         <web:CounterState></web:CounterState>
         <!--Optional:-->
         <web:ReplenishValue></web:ReplenishValue>
      </web:AddCounter>
   </soapenv:Body>
</soapenv:Envelope>`


      return data

   } catch (error) {
      console.log(error);
   }

}






const path = require("path");
const fs = require("fs");
exports.adddatafile = async (bodydata, numapi) => {
   try {

      let data = "";

      let date = datetime();
      const paths = path.join(__dirname, "./filedatatxt/");
      console.log(paths);

      if (numapi == 0) {
         if (bodydata != null) {

            const result = bodydata.result[0]
            if (result != null) {
               data = `${result.Msisdn + "|" + result.ProductNumber + "|" + result.CounterName + "|" + result.StartTime.slice(0, 10) + "|" + result.ExpiryTime.slice(0, 10) + "|" + result.status + "|" + date}\n`;
               await fs.appendFile(paths + "fileaddpackage.txt", data, (err) => {
                  if (err) {
                     console.log(bodydata);
                  }
               });
            }
         }
      } else if (numapi == 1) {
         if (bodydata.length > 0) {
            for (var i = 0; i < bodydata.length; i++) {
               data = `${bodydata[i].Msisdn + "|" + bodydata[i].ProductNumber + "|" + bodydata[i].CounterName + "|" + bodydata[i].StartTime.slice(0, 10) + "|" + bodydata[i].ExpiryTime.slice(0, 10) + "|" + bodydata[i].status + "|" + date}\n`

               await fs.appendFile(paths + "fileaddpackage.txt", data, (err) => {
                  if (err) {
                     console.log(bodydata)
                     console.log(err)
                  }
               });
            }
         }
      }
   } catch (error) {
      console.log(error)
   }
}
const datetime = () => {
   try {

      const date = new Intl.DateTimeFormat("fr-CA", { year: "numeric", month: "2-digit", day: "2-digit" }).format(new Date());
      const time = new Intl.DateTimeFormat("en-US", { hour: "2-digit", minute: "2-digit", second: "2-digit", hour12: false, timeZone: "Asia/Bangkok" }).format(new Date());
      const datenow = date.replace(new RegExp("-", "g"), "") + "" + time.replace(new RegExp(":", "g"), "");
      return datenow;
   } catch (error) {
      console.log(error);
   }
}