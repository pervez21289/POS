using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace LMS.Core.Entities
{
    public class Location
    {
             public int LocationId { get; set; }
            public string LocationName { get; set; }
            public string Lat { get;set; }
            public string Long { get;set; }
            public int CityId { get; set; }
    }
}
