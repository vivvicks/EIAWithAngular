using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using EIAwithAngular.Models;

namespace EIAwithAngular.Repository
{
    public class Menu : IMenu
    {
        EIA_DEVEntities _db;
        public Menu(EIA_DEVEntities objcontext)
        {
            _db = objcontext;
        }

        public List<VSEC_FUNCTION_MST> GetMenus()
        {
            List<VSEC_FUNCTION_MST> _obj = _db.VSEC_FUNCTION_MST.ToList();

            return _obj;
        }
    }
}