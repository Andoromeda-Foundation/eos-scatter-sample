using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using System.Net.Http;
using Microsoft.AspNetCore.Mvc;
using Newtonsoft.Json;

namespace EosScatterSample
{
    [Route("api/[controller]")]
    public class ChainController : Controller
    {
        [HttpGet("id")]
        public async Task<object> Get()
        {
            using (var client = new HttpClient() { BaseAddress = new Uri("http://localhost:8888") })
            using (var resposne = await client.GetAsync("/v1/chain/get_info"))
            {
                var jsonText = await resposne.Content.ReadAsStringAsync();
                var dic = JsonConvert.DeserializeObject<Dictionary<string, object>>(jsonText);
                return new
                {
                    code = 200,
                    data = dic["chain_id"]
                };
            }
        }
    }
}
