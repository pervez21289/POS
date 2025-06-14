using Microsoft.AspNetCore.Http;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace LMS.Core.Entities
{
    public class PropertyModel
    {
        public long PropertyId { get; set; }
        public int LocationId { get; set; }
        public short PropertyTypeId { get; set; }
        public string PropertyType { get; set; }
        public decimal RentAmount { get; set; }
        public string IsFurnished { get; set; }
        public byte Bathrooms { get; set; }
        public string Parking { get; set; }
        public string Description { get; set; }
        public string AvailableFrom { get; set; }
        public DateTime CreatedDate { get; set; }
        public DateTime ModifiedDate { get; set; }
        public bool IsActive { get; set; }
        public bool IsDeleted { get; set; }
        public string LocationName { get; set; }
        public string? FilePath { get; set; }
        public long RowNum { get; set; }
        public string Lat { get; set; }
        public string Long { get; set; }

        public string PropertyUrl { get; set; }
        public string AvailableFor { get; set; }
        public long UserId { get; set; }

        
            public byte ParkingId { get; set; }
            public byte FurnishedId { get; set; }
            public byte AvailableForId { get; set; }
            public decimal SecurityAmount { get; set; }

        public int Area { get; set; }

        }
   
    public class LocationModel
    {
        public int? LocationId { get; set; }
        public string? LocationName { get; set; }
        public decimal? Lat { get; set; }
        public decimal? Long { get; set; }
        public int? ptype { get; set; }
        public int? budget { get; set; }
        public int? page { get; set; }
        
    }

    public class FileModel
    {
        public int? Id { get; set;}
        public string? img { get; set; }   
        public string title { get; set; }
        public string src { get; set; }
        public int rows { get; set; }
        public int cols { get; set; }
        public long PropertyId { get; set; }
    }

    public class WishListModel
    {
        public long PropertyId { get; set; }
        public long UserId { get; set; }
    }
}
