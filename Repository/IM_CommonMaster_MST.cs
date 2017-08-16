using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Web.Mvc;

namespace EIAwithAngular.Repository
{
    public interface IM_CommonMaster_MST
    {
        SelectList GetFinYear(string MasterType);
    }
}
