using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using EIAwithAngular.Models;


namespace EIAwithAngular.Repository
{
    public interface IMenu
    {
        List<VSEC_FUNCTION_MST> GetMenus();
    }
}
