#r "Newtonsoft.Json"

using System;
using System.Text;
using System.Net;
using System.Text.RegularExpressions;
using Newtonsoft.Json;
using Newtonsoft.Json.Linq;

public static async Task<HttpResponseMessage> Run(HttpRequestMessage req, TraceWriter log)
{
    //Your Zipcodeapi.com key (register here: https://www.zipcodeapi.com/Register)
    string zipcodeapikey = "ThisIsYourKey";

    //Your Darksky api key (register here: https://darksky.net/dev/register)
    string darkskyapikey = "Your Key Here";

    // parse query parameter
    string zip = req.GetQueryNameValuePairs()
        .FirstOrDefault(q => string.Compare(q.Key, "zip", true) == 0)
        .Value;

    string pattern = "^[0-9]{5}$";
    Regex rgx = new Regex(pattern);
    if (!rgx.IsMatch(zip)) {
        log.Warn("Bad Zip");
        return req.CreateResponse(HttpStatusCode.BadRequest, "Bad Zipcode");
    }
    
    log.Info($"C# HTTP trigger function processed a request for {zip}.");

    using (WebClient wc = new WebClient())
    {
        wc.Encoding = Encoding.UTF8;
        var zipjson = wc.DownloadString($"https://www.zipcodeapi.com/rest/{zipcodeapikey}/info.json/{zip}/degrees");
        dynamic zipinfo = JObject.Parse(zipjson);

        string latlong = zipinfo.lat + "," + zipinfo.lng;
        string location = zipinfo.city + ", " + zipinfo.state;
        var json = wc.DownloadString($"https://api.darksky.net/forecast/{darkskyapikey}/{latlong}?exclude=minutely,flags");
        //I really hate string escapes in C# 
        json = ReplaceFirst(json, "{", $@"{{""location"":""{location}"",");
        return new HttpResponseMessage(HttpStatusCode.OK) {
            Content = new StringContent(json, Encoding.UTF8, "application/json")
        };
    }
}

public static string ReplaceFirst(string text, string search, string replace)
{
  int pos = text.IndexOf(search);
  if (pos < 0)
  {
    return text;
  }
  return text.Substring(0, pos) + replace + text.Substring(pos + search.Length);
}
