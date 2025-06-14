using Microsoft.AspNetCore.Http;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace LMS.Core.Entities
{
    public  class Property
    {
        public long PropertyId { get; set; }    
        public int LocationId { get; set; }
        public int PropertyTypeId { get; set; }
        public decimal RentAmount { get; set; }
        public int IsFurnished { get; set; }
        public int Bathrooms { get; set; }
        public string? Description { get; set; }
        public int Parking { get; set; }
        public DateTime? AvailableFrom { get; set; }
        public long UserId { get; set; }
        public int AvailableFor { get; set; }
        public decimal? SecurityAmount { get; set; }
        public int? Area  { get; set; }

    }
}
