﻿using LMS.Core.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace LMS.Core.Interfaces
{
    public interface IUserContext
    {
        int CompanyID { get; }
        int UserId { get; }
    }
}
