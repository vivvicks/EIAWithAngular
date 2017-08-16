using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace EIAwithAngular.Filters
{
    public class ValidateSession : AuthorizeAttribute
    {
        public override void OnAuthorization(AuthorizationContext filterContext)
        {
            if (!object.Equals(filterContext.HttpContext.Session["GMVSession"], null))
            {
                Dictionary<string, string> GVObjDict = new Dictionary<string, string>();
                GVObjDict = (Dictionary<string, string>)filterContext.HttpContext.Session["GMVSession"];


                filterContext.Controller.ViewBag.LoginID = Convert.ToString(GVObjDict["LoginID"]);
                filterContext.Controller.ViewBag.TerminalCode = Convert.ToString(GVObjDict["TerminalCode"]);

                //string LoginID = Convert.ToString(GVObjDict["LoginID"]);

                if (Convert.ToString(GVObjDict["LoginID"]) == "") 
                {
                    ViewResult result = new ViewResult();
                    result.ViewName = "Error";
                    result.ViewBag.ErrorMessage = "Invalid User";
                    filterContext.Result = result;
                }

            }
            else
            {
                ViewResult result = new ViewResult();
                result.ViewName = "Error";
                result.ViewBag.ErrorMessage = "You Session has been Expired";
                filterContext.Result = result;
            }
            //base.OnAuthorization(filterContext);
        }

    }
}