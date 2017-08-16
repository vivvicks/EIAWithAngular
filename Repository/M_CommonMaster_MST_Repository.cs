using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using EIAwithAngular.Repository;
using EIAwithAngular.Models;

namespace EIAwithAngular.Repository
{
    public class M_CommonMaster_MST_Repository : IM_CommonMaster_MST
    {
        EIA_DEVEntities _db;
        public M_CommonMaster_MST_Repository(EIA_DEVEntities objcontext)
        {
            _db = objcontext;
        }

        public SelectList GetFinYear(string MasterType)
        {
            var lstFinYear = (from t in _db.M_CommonMaster_MST
                              orderby t.MasterValue1 descending
                              where t.MasterType == MasterType
                              select t).ToArray();

            SelectList lst = new SelectList(lstFinYear, "MasterValue1", "MasterDesc");

            return lst;

        }
    }
}