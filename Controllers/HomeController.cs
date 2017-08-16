using EIAwithAngular.Filters;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace EIAwithAngular.Controllers
{
    public class HomeController : Controller
    {
        [ValidateSession]
        // GET: Home
        public ActionResult Home()
        {
            return View("Home");
        }
    }
}