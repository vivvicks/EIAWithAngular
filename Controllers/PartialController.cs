using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using EIAwithAngular.Filters;
using EIAwithAngular.Repository;
using EIAwithAngular.Models;

namespace EIAwithAngular.Controllers
{
    public class PartialController : Controller
    {

        IM_CommonMaster_MST db;
        public PartialController()
        {
            db = new M_CommonMaster_MST_Repository(new EIA_DEVEntities());
        }

        [ValidateSession]
        // GET: Partial
        public ActionResult LoginUserDetail()
        {
            ViewBag.FinYear = db.GetFinYear("FinYear");
            return View("LoginUserDetail");
        }
    }
}