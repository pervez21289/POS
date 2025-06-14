using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace LMS.Core.Entities
{
    public  class Booking
    {
        private DateTime _bookingDate;
        public long BookingId { get; set; }
        public int PriceId { get; set; }
        public int UserId { get; set; }
        public DateTime BookingDate { get
            {
                return TimeZoneInfo.ConvertTimeFromUtc(_bookingDate, TimeZoneInfo.FindSystemTimeZoneById("India Standard Time"));
            }

            set
            {
                _bookingDate = value;
            }
        }
        public bool? IsCancelled { get; set; }
        public string Mobile { get; set; } = "";
             
    }
}
